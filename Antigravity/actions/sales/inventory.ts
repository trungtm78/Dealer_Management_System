'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface CreateVehicleInput {
    vin: string
    model: string
    version?: string
    color: string
    engineNumber?: string
    warehouse?: string
    arrivalDate?: Date | string
}

/**
 * Add vehicle to inventory
 */
export async function createVehicle(data: CreateVehicleInput) {
    try {
        const vehicle = await prisma.vin.create({
data: {
                vin_number: data.vin || '',
                model: data.model || '',
                version: data.version || '',
                color: data.color || '',
                year: 2024,
                arrival_date: data.arrivalDate ? new Date(data.arrivalDate) : new Date(),
                status: 'AVAILABLE'
            }
        })

        revalidatePath('/sales/inventory')
        return { success: true, data: vehicle }
    } catch (error) {
        console.error('Failed to create vehicle:', error)
        return { success: false, error: 'Không thể thêm xe vào kho' }
    }
}

/**
 * Get all vehicles
 */
export async function getVehicles() {
    try {
        const vehicles = await prisma.vin.findMany({
            orderBy: { created_at: 'desc' }
        })

        // Calculate days in stock
        const now = new Date()
        return vehicles.map((v: any) => {
            const arrivalDate = v.arrival_date || v.created_at
            const days = Math.floor((now.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24))

            return {
                ...v,
                daysInStock: days,
                arrivalDate: arrivalDate.toISOString(),
                allocatedAt: v.allocatedAt?.toISOString(),
                createdAt: v.created_at.toISOString(),
                updatedAt: v.updated_at.toISOString()
            }
        })
    } catch (error) {
        console.error('Failed to fetch vehicles:', error)
        return []
    }
}

/**
 * Update vehicle status
 */
export async function updateVehicleStatus(id: string, status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'IN_TRANSIT' | 'PDS') {
try {
        const vehicle = await prisma.vin.update({
            where: { id },
            data: { status }
        })

        revalidatePath('/sales/inventory')
        return { success: true, data: vehicle }
    } catch (error) {
        console.error('Failed to update vehicle status:', error)
        return { success: false, error: 'Không thể cập nhật trạng thái' }
    }
}

/**
 * Allocate vehicle to customer
 */
export async function allocateVehicle(id: string, allocatedTo: string) {
try {
        const vehicle = await prisma.vin.update({
            where: { id },
            data: {
                status: 'RESERVED',
                allocated_to_contract_id: allocatedTo
            }
        })

        revalidatePath('/sales/inventory')
        return { success: true, data: vehicle }
    } catch (error) {
        console.error('Failed to allocate vehicle:', error)
        return { success: false, error: 'Không thể phân bổ xe' }
    }
}
