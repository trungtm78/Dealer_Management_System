'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface CreateTestDriveInput {
    customerName: string
    customerPhone: string
    customerId?: string
    model: string
    scheduledDate: Date | string
    scheduledTime: string
    notes?: string
    assignedToId: string
}

/**
 * Book a new test drive
 */
export async function createTestDrive(data: CreateTestDriveInput) {
    try {
        // Validate assignedToId or fallback to first user
        let assignedToId = data.assignedToId;

        // Check if user exists
        const assignedUser = await prisma.user.findUnique({
            where: { id: assignedToId }
        });

        if (!assignedUser) {
            // Fallback: Find the first sales user or admin
            const firstUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { role: 'SALES' },
                        { role: 'ADMIN' },
                        { role: 'MANAGER' } // Added MANAGER to be safe
                    ]
                }
            });

            if (firstUser) {
                assignedToId = firstUser.id;
            } else {
                return { success: false, error: 'Không tìm thấy nhân viên sales nào trong hệ thống' };
            }
        }

        const testDrive = await prisma.testDrive.create({
data: {
                customer_id: data.customerId || '',
                model: data.model,
                scheduled_date: new Date(data.scheduledDate),
                scheduled_time: data.scheduledTime,
                sales_consultant_id: assignedToId,
                status: 'SCHEDULED'
            },
include: {
                customer: true,
                salesConsultant: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        revalidatePath('/sales/test-drives')
        return { success: true, data: testDrive }
    } catch (error: any) {
        console.error('Failed to create test drive:', error)
        return { success: false, error: error.message || 'Không thể đặt lịch lái thử' }
    }
}

/**
 * Get all test drives
 */
export async function getTestDrives() {
    try {
        const testDrives = await prisma.testDrive.findMany({
include: {
                customer: true,
                salesConsultant: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { scheduled_date: 'desc' }
        })

        return testDrives.map((td: any) => ({
            ...td,
            scheduledDate: td.scheduledDate.toISOString(),
            createdAt: td.createdAt.toISOString(),
            updatedAt: td.updatedAt.toISOString()
        }))
    } catch (error) {
        console.error('Failed to fetch test drives:', error)
        return []
    }
}

/**
 * Update test drive status
 */
export async function updateTestDriveStatus(id: string, status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW') {
    try {
        const testDrive = await prisma.testDrive.update({
            where: { id },
            data: { status }
        })

        revalidatePath('/sales/test-drives')
        return { success: true, data: testDrive }
    } catch (error) {
        console.error('Failed to update test drive status:', error)
        return { success: false, error: 'Không thể cập nhật trạng thái' }
    }
}

/**
 * Delete test drive
 */
export async function deleteTestDrive(id: string) {
    try {
        await prisma.testDrive.delete({
            where: { id }
        })

        revalidatePath('/sales/test-drives')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete test drive:', error)
        return { success: false, error: 'Không thể xóa lịch lái thử' }
    }
}
