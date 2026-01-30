'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { PartDTO, CreatePartInput, UpdatePartInput } from '@/lib/types/inventory'

// Helper to map Prisma entity to DTO
function mapToDTO(part: any): PartDTO {
    return {
        id: part.id,
        partNumber: part.part_number,
        name: part.name,
        category: part.category,
        price: Number(part.unit_price),
        cost: Number(part.cost_price),
        quantity: part.quantity,
        minStock: part.min_stock,
        location: part.location,
        createdAt: part.created_at.toISOString(),
        updatedAt: part.updated_at.toISOString(),
    }
}

/**
 * Get all parts with optional search
 */
export async function getParts(query?: string) {
    try {
        const where: any = {};
        if (query) {
            where.OR = [
                { part_number: { contains: query } },
                { name: { contains: query } },
            ];
        }

        const parts = await prisma.part.findMany({
            where,
            orderBy: { part_number: 'asc' }
        });

        return parts.map(mapToDTO);
    } catch (error) {
        console.error("Failed to fetch parts:", error);
        return [];
    }
}

/**
 * Get single part by ID
 */
export async function getPart(id: string) {
    try {
        const part = await prisma.part.findUnique({ where: { id } });
        if (!part) return null;
        return mapToDTO(part);
    } catch (error) {
        console.error("Failed to fetch part:", error);
        return null;
    }
}

/**
 * Create a new part
 */
export async function createPart(data: CreatePartInput) {
    try {
        // Check duplicate
        const existing = await prisma.part.findUnique({
            where: { part_number: data.partNumber }
        });
        if (existing) {
            return { success: false, error: "Mã phụ tùng đã tồn tại" };
        }

        const newPart = await prisma.part.create({
            data: {
                part_number: data.partNumber,
                name: data.name,
                category: data.category,
                unit_price: data.price,
                cost_price: data.cost || 0,
                quantity: data.quantity || 0,
                min_stock: data.minStock || 0,
                location: data.location
            }
        });

        revalidatePath('/inventory/parts');
        return { success: true, data: mapToDTO(newPart) };
    } catch (error: any) {
        console.error("Failed to create part:", error);
        return { success: false, error: error.message || "Không thể tạo phụ tùng" };
    }
}

/**
 * Update a part
 */
export async function updatePart(id: string, data: UpdatePartInput) {
    try {
        const updateData: any = { ...data };
        
        if (data.price !== undefined) {
            updateData.unit_price = data.price;
            delete updateData.price;
        }
        if (data.cost !== undefined) {
            updateData.cost_price = data.cost;
            delete updateData.cost;
        }
        if (data.minStock !== undefined) {
            updateData.min_stock = data.minStock;
            delete updateData.minStock;
        }

        const updatedPart = await prisma.part.update({
            where: { id },
            data: updateData
        });
        revalidatePath('/inventory/parts');
        return { success: true, data: mapToDTO(updatedPart) };
    } catch (error: any) {
        console.error("Failed to update part:", error);
        return { success: false, error: error.message || "Không thể cập nhật phụ tùng" };
    }
}

/**
 * Delete a part
 */
export async function deletePart(id: string) {
    try {
        // Check dependencies (e.g. movements)
        const movements = await prisma.stockMovement.count({ where: { part_id: id } });
        if (movements > 0) {
            return { success: false, error: "Không thể xóa phụ tùng đã có giao dịch kho" };
        }

        await prisma.part.delete({ where: { id } });
        revalidatePath('/inventory/parts');
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete part:", error);
        return { success: false, error: error.message || "Không thể xóa phụ tùng" };
    }
}
