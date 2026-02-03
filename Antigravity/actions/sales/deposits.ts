'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { DepositDTO, CreateDepositInput, DepositStatus } from '@/lib/types/sales'

const isTestEnv = process.env.NODE_ENV === 'test';

const safeRevalidatePath = (path: string) => {
    if (!isTestEnv) {
        revalidatePath(path);
    }
};

// Helper
function mapToDTO(d: any): DepositDTO {
    return {
        id: d.id,
        receiptNumber: d.receipt_number,
        customerId: d.customer_id,
        customerName: d.customer_name,
        amount: d.amount,
        contractNumber: d.contract_number,
        paymentMethod: d.payment_method,
        status: d.status,
        createdAt: d.created_at.toISOString(),
        receivedBy: d.User ? {
            id: d.User.id,
            name: d.User.name
        } : null
    }
}

/**
 * Get deposits
 */
export async function getDeposits(query?: string) {
    try {
        const deposits = await prisma.deposit.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                User: { select: { id: true, name: true } }
            }
        });
        return deposits.map(mapToDTO);
    } catch (error) {
        console.error("Failed to fetch deposits:", error);
        return [];
    }
}

/**
 * Get single deposit
 */
export async function getDeposit(id: string) {
    try {
        const deposit = await prisma.deposit.findUnique({
            where: { id },
            include: {
                User: { select: { id: true, name: true } }
            }
        });
        if (!deposit) return null;
        return mapToDTO(deposit);
    } catch (error) {
        console.error("Failed to fetch deposit:", error);
        return null;
    }
}

/**
 * Create deposit
 */
export async function createDeposit(data: CreateDepositInput) {
    try {
        // Generate Receipt Number: DP-YYYYMMDD-XXX
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const receiptNumber = `DP-${dateStr}-${random}`;

        // Validate receivedById or fallback
        let receivedById = data.receivedById;
        const receivedUser = await prisma.user.findUnique({ where: { id: receivedById } });

        if (!receivedUser) {
            const firstUser = await prisma.user.findFirst({
                where: { OR: [{ role: 'SALES' }, { role: 'ADMIN' }, { role: 'MANAGER' }] }
            });
            if (firstUser) {
                receivedById = firstUser.id;
            } else {
                return { success: false, error: 'Không tìm thấy nhân viên nào trong hệ thống' };
}
        }

        // Validate customer exists
        if (data.customerId) {
            const customer = await prisma.customer.findUnique({
                where: { id: data.customerId },
                select: { id: true }
            });

            if (!customer) {
                return { success: false, error: "Customer not found" };
            }
        }

const newDeposit = await prisma.deposit.create({
            data: {
                receipt_number: receiptNumber,
                customer_id: data.customerId || null,
                customer_name: data.customerName || '',
                amount: data.amount,
                contract_number: data.contractNumber || null,
                payment_method: data.paymentMethod || 'CASH',
                notes: data.notes || null,
                received_by_id: receivedById,
                status: DepositStatus.PAID
},
            include: {
                User: { select: { id: true, name: true } }
            }
        });
        safeRevalidatePath('/sales/deposits');
        return { success: true, data: mapToDTO(newDeposit) };
    } catch (error: any) {
        console.error("Failed to create deposit:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Update Deposit Status
 */
export async function updateDepositStatus(id: string, status: DepositStatus) {
    try {
        const updated = await prisma.deposit.update({
            where: { id },
            data: { status },
            include: {
                User: { select: { id: true, name: true } }
            }
});
        safeRevalidatePath('/sales/deposits');
        return { success: true, data: mapToDTO(updated) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
