'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { PDSDTO, CreatePDSInput, UpdatePDSInput, PDSStatus } from '@/lib/types/sales'

// Helper
function mapToDTO(p: any): PDSDTO {
    return {
        id: p.id,
        contractId: p.contract_id,
        vinId: p.vin_id,
        exteriorCheck: p.exterior_check ? JSON.parse(p.exterior_check) : undefined,
        interiorCheck: p.interior_check ? JSON.parse(p.interior_check) : undefined,
        mechanicalCheck: p.mechanical_check ? JSON.parse(p.mechanical_check) : undefined,
        documentationCheck: p.documentation_check ? JSON.parse(p.documentation_check) : undefined,
        photos: p.photos ? JSON.parse(p.photos) : undefined,
        inspectorId: p.inspector_id,
        customerSignature: p.customer_signature,
        inspectorSignature: p.inspector_signature,
        deliveryDate: p.delivery_date ? p.delivery_date.toISOString() : null,
        status: p.status || PDSStatus.PENDING,
        issues: p.issues,
        completedAt: p.completed_at ? p.completed_at.toISOString() : null,
        createdAt: p.created_at.toISOString(),
        updatedAt: p.updated_at.toISOString(),
        contract: p.contract ? {
            id: p.contract.id,
            contractNumber: p.contract.contract_number
        } : undefined,
        vin: p.vin ? {
            id: p.vin.id,
            model: p.vin.model,
            color: p.vin.color
        } : undefined,
        inspector: p.inspector ? {
            id: p.inspector.id,
            name: p.inspector.name
        } : undefined
    }
}

/**
 * Get PDS List
 */
export async function getPDSList(query?: string) {
    try {
        const list = await prisma.pDSChecklist.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                inspector: { select: { id: true, name: true } }
            }
        });
        return list.map(mapToDTO);
    } catch (error) {
        console.error("Failed to fetch PDS list:", error);
        return [];
    }
}

/**
 * Get single PDS
 */
export async function getPDS(id: string) {
    try {
        const pds = await prisma.pDSChecklist.findUnique({
            where: { id },
            include: {
                inspector: { select: { id: true, name: true } }
            }
        });
        if (!pds) return null;
        return mapToDTO(pds);
    } catch (error) {
        console.error("Failed to fetch PDS:", error);
        return null;
    }
}

/**
 * Create PDS
 */
export async function createPDS(data: CreatePDSInput) {
    try {
        // Validate required fields
        if (!data.contractId) {
            return { success: false, error: "Contract ID is required" };
        }
        
        if (!data.vinId) {
            return { success: false, error: "VIN ID is required" };
        }
        
        if (!data.inspectorId) {
            return { success: false, error: "Inspector ID is required" };
        }
        
        // Verify that contract and VIN exist
        const contract = await prisma.contract.findUnique({
            where: { id: data.contractId }
        });
        
        if (!contract) {
            return { success: false, error: "Contract not found" };
        }
        
        const vin = await prisma.vin.findUnique({
            where: { id: data.vinId }
        });
        
        if (!vin) {
            return { success: false, error: "VIN not found" };
        }
        
        const newPDS = await prisma.pDSChecklist.create({
            data: {
                contract_id: data.contractId,
                vin_id: data.vinId,
                exterior_check: JSON.stringify(data.exteriorCheck || {}),
                interior_check: JSON.stringify(data.interiorCheck || {}),
                mechanical_check: JSON.stringify(data.mechanicalCheck || {}),
                documentation_check: JSON.stringify(data.documentationCheck || {}),
                photos: JSON.stringify(data.photos || []),
                inspector_id: data.inspectorId
            },
            include: {
                inspector: { select: { id: true, name: true } },
                contract: true,
                vin: true
            }
        });
        revalidatePath('/sales/pds');
        return { success: true, data: mapToDTO(newPDS) };
    } catch (error: any) {
        console.error("Failed to create PDS:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Update PDS
 */
export async function updatePDS(id: string, data: UpdatePDSInput) {
    try {
        const updateData: any = { ...data };

        if (data.status === 'PASSED' || data.status === 'FAILED') {
            updateData.completedAt = new Date();
        }

        const updated = await prisma.pDSChecklist.update({
            where: { id },
            data: updateData,
            include: {
                inspector: { select: { id: true, name: true } }
            }
        });
        revalidatePath('/sales/pds');
        return { success: true, data: mapToDTO(updated) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
