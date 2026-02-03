'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { InsuranceContractDTO, CreateContractInput } from '@/lib/types/insurance'

// Helper
function mapToDTO(c: any): InsuranceContractDTO {
    return {
        id: c.id,
        contract_number: c.contract_number,
        customer_id: c.customer_id,
        customer_name: c.Customer?.name,
        customer_phone: c.Customer?.phone,
        vehicle_vin: c.vehicle_id,
        provider: c.insurance_company,
        type: c.insurance_type,
        premium_amount: c.premium_amount,
        start_date: c.start_date.toISOString().split('T')[0],
        end_date: c.end_date.toISOString().split('T')[0],
        status: c.status,
        claims: c.InsuranceClaim, // TODO: Map claims if needed detail
        created_at: c.created_at.toISOString()
    }
}

/**
 * Get Constraints
 */
export async function getInsuranceContracts(query?: string) {
    try {
        const contracts = await prisma.insuranceContract.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                Customer: { select: { name: true, phone: true } },
                InsuranceClaim: true
            }
        });
        return contracts.map(mapToDTO);
    } catch (error) {
        console.error("Failed to fetch contracts:", error);
        return [];
    }
}

/**
 * Get single
 */
export async function getInsuranceContract(id: string) {
    try {
        const contract = await prisma.insuranceContract.findUnique({
            where: { id },
            include: {
                Customer: { select: { name: true, phone: true } },
                InsuranceClaim: true
            }
        });
        if (!contract) return null;
        return mapToDTO(contract);
    } catch (error) {
        console.error("Failed to fetch contract:", error);
        return null;
    }
}

/**
 * Create
 */
export async function createInsuranceContract(data: CreateContractInput) {
    try {
        // Generate Number: INS-YYYY-RANDOM
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const contractNumber = `INS-${year}-${random}`;

const newContract = await prisma.insuranceContract.create({
            data: {
                contract_number: contractNumber,
                customer_id: data.customer_id,
                vehicle_id: data.vehicle_vin,
                insurance_company: data.provider,
                insurance_type: data.type,
                premium_amount: data.premium_amount,
                start_date: data.start_date,
                end_date: data.end_date,
                coverage_amount: data.premium_amount * 2, // Estimate
                policy_number: `${contractNumber}-POL`,
                created_by_id: 'admin' // TODO: Get from session
            },
            include: {
                Customer: { select: { name: true, phone: true } }
            }
        });
        revalidatePath('/insurance/contracts');
        return { success: true, data: mapToDTO(newContract) };
    } catch (error: any) {
        console.error("Failed to create contract:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Update
 */
export async function updateInsuranceContract(id: string, data: CreateContractInput) {
    try {
        const updated = await prisma.insuranceContract.update({
            where: { id },
            data: { ...data },
            include: {
                Customer: { select: { name: true, phone: true } }
            }
        });
        revalidatePath('/insurance/contracts');
        revalidatePath(`/insurance/contracts/${id}`); // if detail page exists
        return { success: true, data: mapToDTO(updated) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Delete
 */
export async function deleteInsuranceContract(id: string) {
    try {
        await prisma.insuranceContract.delete({ where: { id } });
        revalidatePath('/insurance/contracts');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
