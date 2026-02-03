'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ServiceAppointmentDTO, CreateAppointmentInput, UpdateAppointmentInput } from '@/lib/types/service'

// Helper
function mapToDTO(a: any): ServiceAppointmentDTO {
    return {
        id: a.id,
        customerId: a.CustomerId,
        customerName: a.Customer.name,
        vehicleInfo: a.vehicleInfo,
        appointmentDate: a.appointmentDate.toISOString(),
        appointmentTime: a.appointmentTime,
        serviceType: a.serviceType,
        status: a.status,
        notes: a.notes,
        createdAt: a.createdAt.toISOString(),
        assignedTo: a.assignedTo ? {
            id: a.assignedTo.id,
            name: a.assignedTo.name
        } : null
    }
}

/**
 * Get appointments
 */
export async function getAppointments(query?: string) {
    try {
        const where: any = {};
        if (query) {
            // Basic search if needed
        }

const appointments = await prisma.serviceAppointment.findMany({
            where,
            orderBy: { scheduled_date: 'asc' },
include: {
                Customer: { select: { name: true } },
                User: { select: { id: true, name: true } }
            }
        });

        return appointments.map(mapToDTO);
    } catch (error) {
        console.error("Failed to fetch appointments:", error);
        return [];
    }
}

/**
 * Get single appointment
 */
export async function getAppointment(id: string) {
    try {
const appointment = await prisma.serviceAppointment.findUnique({
            where: { id },
include: {
                Customer: { select: { name: true } },
                User: { select: { id: true, name: true } }
            }
        });
        if (!appointment) return null;
        return mapToDTO(appointment);
    } catch (error) {
        console.error("Failed to fetch appointment:", error);
        return null;
    }
}

/**
 * Create appointment
 */
export async function createAppointment(data: CreateAppointmentInput) {
    try {
const newAppointment = await prisma.serviceAppointment.create({
            data: {
                customer_id: data.customerId || '',
                vehicle_info: JSON.stringify(data.vehicleInfo || {}),
                scheduled_date: new Date(data.appointmentDate),
                scheduled_time: data.appointmentTime,
                service_type: data.serviceType,
                notes: data.notes,
                advisor_id: data.assignedToId || ''
            },
            include: {
                Customer: { select: { name: true } },
                User: { select: { id: true, name: true } }
            }
        });
        revalidatePath('/service/appointments');
        return { success: true, data: mapToDTO(newAppointment) };
    } catch (error: any) {
        console.error("Failed to create appointment:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Update appointment
 */
export async function updateAppointment(id: string, data: UpdateAppointmentInput) {
    try {
const updated = await prisma.serviceAppointment.update({
            where: { id },
            data: {
                customer_id: data.customerId,
                vehicle_info: JSON.stringify(data.vehicleInfo || {}),
                scheduled_date: data.appointmentDate ? new Date(data.appointmentDate) : undefined,
                scheduled_time: data.appointmentTime,
                service_type: data.serviceType,
                notes: data.notes,
                advisor_id: data.assignedToId
            },
            include: {
                Customer: { select: { name: true } },
                User: { select: { id: true, name: true } }
            }
        });
        revalidatePath('/service/appointments');
        return { success: true, data: mapToDTO(updated) };
    } catch (error: any) {
        console.error("Failed to update appointment:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete appointment
 */
export async function deleteAppointment(id: string) {
    try {
        await prisma.serviceAppointment.delete({ where: { id } });
        revalidatePath('/service/appointments');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
