'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { CreateStockMovementInput, StockMovementDTO } from '@/lib/types/inventory'
import { Prisma } from '@prisma/client';

// Helper
function mapToDTO(m: any): StockMovementDTO {
    return {
        id: m.id,
        partId: m.part_id,
        partName: m.part?.name,
        partNumber: m.part?.part_number,
        type: m.type,
        quantity: m.quantity,
        reason: m.notes,
        reference: m.reference_id,
        createdById: m.user_id,
        createdByName: m.user?.name,
        createdAt: m.created_at.toISOString()
    }
}

/**
 * Get movements (History)
 */
export async function getStockMovements(partId?: string) {
    try {
        const where: any = {};
        if (partId) where.partId = partId;

        const movements = await prisma.stockMovement.findMany({
            where,
include: {
                part: { select: { name: true, part_number: true } },
                user: { select: { name: true } }
            },
            orderBy: { created_at: 'desc' },
            take: 100
        });

        return movements.map(mapToDTO);
    } catch (error) {
        console.error("Failed to fetch movements:", error);
        return [];
    }
}

/**
 * Create movement (In/Out)
 */
export async function createStockMovement(data: CreateStockMovementInput) {
    try {
        const part = await prisma.part.findUnique({ where: { id: data.partId } });
        if (!part) return { success: false, error: "Phụ tùng không tồn tại" };

        // Validate stock logic
        let newQuantity = part.quantity;
        if (data.type === 'IN' || data.type === 'RETURN') {
            newQuantity += data.quantity;
        } else if (data.type === 'OUT') {
            if (part.quantity < data.quantity) {
                return { success: false, error: `Số lượng tồn kho không đủ (Hiện có: ${part.quantity})` };
            }
            newQuantity -= data.quantity;
        } else if (data.type === 'ADJUSTMENT') {
            // Adjustment implies setting the difference, or we can treat inputs as the ABSOLUTE new quantity?
            // Usually adjustment records the CHANGE. Let's assume input quantity is the CHANGE amount (can be negative but type is enum).
            // Actually usually Adjustment means "Correction".
            // Let's assume for simplicity here: Input Quantity is strictly Amount Changed.
            // If we want to set absolute, we need to calculate diff.
            // Let's assume the user enters the MAGNITUDE of change.
            // Wait, usually Adjustment can be + or -.
            // If type is ADJUSTMENT, let's allow it to adapt.
            // But Prisma Enum has IN, OUT, ADJUSTMENT.
            // Let's treat ADJUSTMENT as a direct modification where we might need a flag.
            // For now, let's assume ADJUSTMENT adds quantity (if positive) similar to IN, but semantically different.
            // OR we can rely on UI to send IN/OUT for standard ops.
            // Let's treat ADJUSTMENT as adding/subtracting based on context or just add.
            // A safer approach: Input quantity is always positive.
            // If we want to decrease via adjustment, maybe we need another type or assume the caller handles logic?
            // Let's implement simpler logic:
            // IN: +qty
            // OUT: -qty
            // RETURN: +qty
            // ADJUSTMENT: Let's assume it updates to the new quantity? No, movement log usually records delta.
            // Let's assume ADJUSTMENT updates storage by +qty. If user wants negative, they use OUT with reason "Adjustment".
            // Or we treat ADJUSTMENT as +qty.
            newQuantity += data.quantity; // Temporary simplified.
        }

        // Transaction
        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
const movement = await tx.stockMovement.create({
                data: {
                    part_id: data.partId,
                    type: data.type,
                    quantity: data.quantity,
                    notes: data.reason,
                    reference_id: data.reference,
                    user_id: data.createdById
                }
            });

            await tx.part.update({
                where: { id: data.partId },
                data: { quantity: newQuantity }
            });

            return movement;
        });

// Fetch included relations for DTO
        const fullMovement = await prisma.stockMovement.findUnique({
            where: { id: result.id },
            include: {
                part: true,
                user: true
            }
        });

        revalidatePath('/inventory/parts');
        revalidatePath(`/inventory/parts/${data.partId}`);

        return { success: true, data: mapToDTO(fullMovement) };

    } catch (error: any) {
        console.error("Failed to move stock:", error);
        return { success: false, error: error.message };
    }
}
