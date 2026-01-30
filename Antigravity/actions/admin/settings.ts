'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

/**
 * Get a system setting by key
 */
export async function getSystemSetting(key: string) {
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key }
        })
        return setting ? setting.value : null
    } catch (error) {
        console.error('Failed to get setting:', error)
        return null
    }
}

/**
 * Update or create a system setting
 */
export async function updateSystemSetting(key: string, value: any, userId: string, description?: string) {
    try {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
        const setting = await prisma.systemSetting.upsert({
            where: { key },
            update: {
                value: stringValue,
                updated_by: userId,
                description: description || undefined
            },
            create: {
                key,
                value: stringValue,
                updated_by: userId,
                description: description || undefined,
                data_type: typeof value === 'string' ? 'string' : 'json',
                category: 'general'
            }
        })

        // Revalidate relevant paths
        if (key === 'scoring_config') {
            revalidatePath('/crm/scoring')
        } else if (key === 'kanban_columns') {
            revalidatePath('/crm/leads')
        }

        return { success: true, data: setting }
    } catch (error) {
        console.error('Failed to update setting:', error)
        return { success: false, error: 'Failed to update setting' }
    }
}

/**
 * Get all system settings
 */
export async function getAllSystemSettings() {
    try {
        const settings = await prisma.systemSetting.findMany({
            include: {
                updatedBy: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
orderBy: {
                updated_at: 'desc'
            }
        })
        return { success: true, data: settings }
    } catch (error) {
        console.error('Failed to get settings:', error)
        return { success: false, error: 'Failed to get settings', data: [] }
    }
}

/**
 * Delete a system setting
 */
export async function deleteSystemSetting(key: string) {
    try {
        await prisma.systemSetting.delete({
            where: { key }
        })
        return { success: true }
    } catch (error) {
        console.error('Failed to delete setting:', error)
        return { success: false, error: 'Failed to delete setting' }
    }
}
