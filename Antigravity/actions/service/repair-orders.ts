'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { RepairOrderDTO, CreateRepairOrderInput, UpdateRepairOrderInput } from '@/lib/types/service'

// Helper
function mapToDTO(r: any): RepairOrderDTO {
    return {
        id: r.id,
        orderNumber: r.ro_number,
        customerId: r.customer_id,
        customerName: r.customer?.name,
        vehicleInfo: r.vehicle_info ? JSON.parse(r.vehicle_info) : {},
        symptoms: r.customer_complaints,
        diagnosis: r.inspection_notes,
        partsUsed: [], // Logic for line items needed if DTO expects it
        laborHours: 0,
        totalCost: 0,
        status: r.status,
        technicianId: r.technician_id,
        technicianName: r.technician?.name,
        createdAt: r.created_at.toISOString()
    }
}

/**
 * Get ROs
 */
export async function getRepairOrders(query?: string) {
    try {
        const repairOrders = await prisma.repairOrder.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                Customer: { select: { name: true } },
                User_RepairOrder_technician_idToUser: { select: { name: true } }
            }
        });
        return repairOrders.map(mapToDTO);
    } catch (error) {
        console.error("Failed to fetch ROs:", error);
        return [];
    }
}

/**
 * Get single RO
 */
export async function getRepairOrder(id: string) {
    try {
        const ro = await prisma.repairOrder.findUnique({
            where: { id },
            include: {
                Customer: { select: { name: true } },
                User_RepairOrder_technician_idToUser: { select: { name: true } },
                ROLineItem: true
            }
        });
        if (!ro) return null;
        return mapToDTO(ro);
    } catch (error) {
        console.error("Failed to fetch RO:", error);
        return null;
    }
}

/**
 * Create RO
 */
export async function createRepairOrder(data: CreateRepairOrderInput) {
    try {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const roNumber = `RO-${dateStr}-${random}`;

        if (!roNumber || !roNumber.trim()) {
            throw new Error('RO Number is required');
        }

        const newRO = await prisma.repairOrder.create({
            data: {
                ro_number: roNumber,
                customer_id: data.customerId,
                vehicle_info: JSON.stringify(data.vehicleInfo),
                customer_complaints: data.symptoms,
                advisor_id: data.technicianId || 'system',
                status: 'PENDING'
            },
            include: {
                Customer: { select: { name: true } },
                User_RepairOrder_technician_idToUser: { select: { name: true } }
            }
        });
        revalidatePath('/service/repair-orders');
        return { success: true, data: mapToDTO(newRO) };
    } catch (error: any) {
        console.error("Failed to create RO:", error);
        return { success: false, error: error.message };
    }
}


/**
 * Update RO
 */
export async function updateRepairOrder(id: string, data: UpdateRepairOrderInput) {
    try {
        const updated = await prisma.repairOrder.update({
            where: { id },
            data: {
                ...data
            },
            include: {
                Customer: { select: { name: true } },
                User_RepairOrder_technician_idToUser: { select: { name: true } }
            }
        });
        revalidatePath('/service/repair-orders');
        return { success: true, data: mapToDTO(updated) };
    } catch (error: any) {
        console.error("Failed to update RO:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete RO
 */
export async function deleteRepairOrder(id: string) {
    try {
        const lineItemsCount = await prisma.rOLineItem.count({
            where: { ro_id: id }
        });
        if (lineItemsCount > 0) {
            throw new Error('Không thể xóa Repair Order vì có Line Items. Vui lòng xóa Line Items trước.');
        }
        await prisma.repairOrder.delete({ where: { id } });
        revalidatePath('/service/repair-orders');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
