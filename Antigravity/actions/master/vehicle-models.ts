"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getVehicleModels(search: string = "", category: string = "", page: number = 1, limit: number = 10) {
    try {
        const skip = (page - 1) * limit;
        const where: any = {};
        
        if (search) {
            where.OR = [
                { model_name: { contains: search, mode: 'insensitive' } },
                { model_code: { contains: search, mode: 'insensitive' } }
            ];
        }
        
        if (category) {
            where.category = category;
        }
        
        const [total, models] = await Promise.all([
            prisma.vehicle_models.count({ where }),
            prisma.vehicle_models.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);
        
        const vehicleModelsWithTier = models.map(m => ({
            ...m,
            tier: calculateTier(m.base_price.toNumber())
        }));
        
        revalidatePath("/master/vehicle-models");
        
        return {
            success: true,
            data: vehicleModelsWithTier,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error("Failed to fetch vehicle models:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: []
        };
    }
}

export async function createVehicleModel(data: any, userId: string) {
    try {
        const { EntityValidators } = await import('@/lib/entity-validators');
        EntityValidators.vehicleModels(data);
        
        const modelCode = data.model_code || await generateModelCode(data.model_name);
        
        const model = await prisma.vehicle_models.create({
            data: {
                ...data,
                model_code: modelCode
            }
        });
        
        revalidatePath("/master/vehicle-models");
        return { success: true, data: model };
    } catch (error: any) {
        console.error("Failed to create vehicle model:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

export async function updateVehicleModel(id: string, data: any, userId: string) {
    try {
        const model = await prisma.vehicle_models.findUnique({ where: { id } });
        if (!model) {
            return { success: false, error: "Vehicle model not found" };
        }
        
        // Check duplicate model_code/name (excluding current record)
        if ((data.model_code && data.model_code !== model.model_code) || 
            (data.model_name && data.model_name !== model.model_name)) {
            const duplicate = await prisma.vehicle_models.findFirst({
                where: {
                    OR: [
                        { model_code: data.model_code || '' },
                        { model_name: data.model_name || '' }
                    ],
                    NOT: { id }
                }
            });
            
            if (duplicate) {
                return { success: false, error: "Model name or code already exists" };
            }
        }
        
        const { EntityValidators } = await import('@/lib/entity-validators');
        EntityValidators.vehicleModels({ ...data, model_code: data.model_code || model.model_code });
        
        const updatedModel = await prisma.vehicle_models.update({
            where: { id },
            data
        });
        
        revalidatePath("/master/vehicle-models");
        return { success: true, data: updatedModel };
    } catch (error: any) {
        console.error("Failed to update vehicle model:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

export async function deleteVehicleModel(id: string, userId: string) {
    try {
        const model = await prisma.vehicle_models.findUnique({ where: { id } });
        if (!model) {
            return { success: false, error: "Vehicle model not found" };
        }
        
        // Check for active references in quotations
        const hasActiveReferences = await prisma.quotation.count({
            where: {
                model: model.model_code,
                status: { in: ['DRAFT', 'PENDING', 'CONFIRMED'] }
            }
        });
        
        if (hasActiveReferences > 0) {
            return { success: false, error: "Vehicle model is in use in active quotations" };
        }
        
        const updatedModel = await prisma.vehicle_models.update({
            where: { id },
            data: { 
                status: 'INACTIVE',
                deleted_at: new Date() 
            }
        });
        
        revalidatePath("/master/vehicle-models");
        return { success: true, data: updatedModel };
    } catch (error: any) {
        console.error("Failed to delete vehicle model:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

export async function generateModelCode(prefix: string = "MOD") {
    const year = new Date().getFullYear().toString();
    const prefixUpper = prefix.toUpperCase();
    
    const count = await prisma.vehicle_models.count({
        where: {
            model_code: { startsWith: `${prefixUpper}-${year}` }
        }
    });
    
    return `${prefixUpper}-${year}-${(count + 1).toString().padStart(3, '0')}`;
}

function calculateTier(price: number): 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' {
    if (price >= 50000000) return 'PLATINUM';
    if (price >= 30000000) return 'GOLD';
    if (price >= 10000000) return 'SILVER';
    return 'BRONZE';
}
