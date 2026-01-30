"use server";


import prisma from "@/lib/prisma";
import { CustomerDTO } from "@/lib/types/crm";
import { revalidatePath } from "next/cache";

const isTestEnv = process.env.NODE_ENV === 'test';

const safeRevalidatePath = (path: string) => {
    if (!isTestEnv) {
        revalidatePath(path);
    }
};

export async function updateCustomerTier(id: string, tier: string) {
    try {
        await prisma.customer.update({
            where: { id },
            data: { tier }
        });
        safeRevalidatePath('/crm/loyalty');
        return { success: true };
    } catch (error) {
        console.error("Update tier error:", error);
        return { success: false, error: 'Failed to update tier' };
    }
}

export async function getLoyaltyCustomers(): Promise<CustomerDTO[]> {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: { points: 'desc' },
            take: 20
        });
        return customers.map((c: any) => ({
            ...c,
            email: c.email || undefined,
            memberSince: c.memberSince?.toISOString(),
            // expiryDate not in schema
            pointsEarned: c.totalPoints || c.points || 0
        }));
    } catch (error) {
        console.error("Fetch loyalty error:", error);
        return [];
    }
}
