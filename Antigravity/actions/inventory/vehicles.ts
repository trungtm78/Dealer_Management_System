'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { VehicleDTO, CreateVehicleInput, UpdateVehicleInput } from '@/lib/types/inventory'

// Helper to map
function mapToDTO(v: any): VehicleDTO {
    return {
        id: v.id,
        vin: v.vin,
        model: v.model,
        version: v.version,
        color: v.color,
        engineNumber: v.engineNumber,
        status: v.status,
        warehouse: v.warehouse,
        arrivalDate: v.arrival_date ? v.arrival_date.toISOString() : null,
        daysInStock: v.daysInStock,
        allocatedTo: v.allocatedTo,
        allocatedAt: v.allocatedAt?.toISOString() || null,
        createdAt: v.created_at.toISOString(),
        updatedAt: v.updated_at.toISOString(),
    }
}

/**
 * Get all vehicles
 */
export async function getVehicles(query?: string) {
    try {
        const where: any = {};
        if (query) {
            where.OR = [
                { vin: { contains: query } },
                { model: { contains: query } },
            ];
        }

        const vehicles = await prisma.vin.findMany({
            where,
            orderBy: { created_at: 'desc' }
        });

        return vehicles.map(mapToDTO);
    } catch (error) {
        console.error("Failed to fetch vehicles:", error);
        return [];
    }
}

/**
 * Get vehicle by ID
 */
export async function getVehicle(id: string) {
    try {
        const vehicle = await prisma.vin.findUnique({ where: { id } });
        if (!vehicle) return null;
        return mapToDTO(vehicle);
    } catch (error) {
        console.error("Failed to fetch vehicle:", error);
        return null;
    }
}

/**
 * Create vehicle
 */
export async function createVehicle(data: CreateVehicleInput) {
    try {
        const existing = await prisma.vin.findUnique({ where: { vin_number: data.vin } });
        if (existing) return { success: false, error: "Số VIN đã tồn tại" };

        const newVehicle = await prisma.vin.create({
data: {
                vin_number: data.vin || '',
                model: data.model || '',
                version: data.version || '',
                color: data.color || '',
                year: 2024,
                arrival_date: data.arrivalDate ? new Date(data.arrivalDate) : null
            }
        });
        revalidatePath('/inventory/vehicles');
        return { success: true, data: mapToDTO(newVehicle) };
    } catch (error: any) {
        console.error("Failed to create vehicle:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Update vehicle
 */
export async function updateVehicle(id: string, data: UpdateVehicleInput) {
    try {
        const updatedVehicle = await prisma.vin.update({
            where: { id },
data: {
                vin_number: data.vin,
                model: data.model,
                version: data.version,
                color: data.color,
                year: 2024,
                arrival_date: data.arrivalDate ? new Date(data.arrivalDate) : null
            }
        });
        revalidatePath('/inventory/vehicles');
        return { success: true, data: mapToDTO(updatedVehicle) };
    } catch (error: any) {
        console.error("Failed to update vehicle:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete vehicle
 */
export async function deleteVehicle(id: string) {
    try {
        await prisma.vin.delete({ where: { id } });
        revalidatePath('/inventory/vehicles');
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete vehicle:", error);
        return { success: false, error: error.message };
    }
}
