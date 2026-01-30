'use server'

import prisma from '@/lib/prisma'

export async function getUsers(role?: string) {
    try {
        const where = role ? { role: role as any } : {};
        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                // Add other fields if needed for display
            }
        });
        return users;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
    }
}

export async function getTechnicians() {
    return getUsers('TECHNICIAN');
}
