"use server";

import prisma from "@/lib/prisma";
import { CreateLeadInput, LeadDTO, LeadStatus } from "@/lib/types/crm";
import { revalidatePath as _revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const isTestEnv = process.env.NODE_ENV === 'test';

const safeRevalidatePath = (path: string) => {
    if (!isTestEnv) {
        _revalidatePath(path);
    }
};

/**
 * Fetch all leads from database
 */
export async function getLeads(): Promise<LeadDTO[]> {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                interactions: {
                    orderBy: { created_at: 'desc' }
                }
            }
        });

        return leads.map((l: any) => ({
            ...l,
            email: l.email || undefined,
            model_interest: l.model_interest || undefined,
            budget: l.budget ? l.budget.toString() : undefined,
            created_at: l.created_at.toISOString(),
            updated_at: l.updated_at.toISOString(),
            // Friendly string for UI display
            time_created: l.created_at.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
            interactions: l.interactions.map((i: any) => ({
                ...i,
                created_at: i.created_at.toISOString(),
            }))
        }));
    } catch (error) {
        console.error("Failed to fetch leads:", error);
        return [];
    }
}

/**
 * Create a new lead
 */
export async function createLead(data: CreateLeadInput) {
    try {
        const lead = await prisma.lead.create({
            data: {
                ...data,
                status: 'NEW',
                score: 10,
                // Convert string budget to number
                budget: data.budget ? (parseFloat(data.budget.toString().replace(/,/g, '')) || undefined) : undefined,
            }
        });
        safeRevalidatePath('/crm/leads');
        return { success: true, data: lead };
    } catch (error) {
        console.error("Failed to create lead:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

/**
 * Update Lead Status (Kanban Drop)
 */
export async function updateLeadStatus(id: string, newStatus: LeadStatus, notes?: string) {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id },
            include: { interactions: { where: { type: 'STAGE_CHANGE' }, orderBy: { created_at: 'desc' }, take: 1 } }
        });
        if (!lead) throw new Error("Lead not found");

        let userId = lead.assigned_to_id;

        if (!userId) {
            userId = cookies().get('user_id')?.value || null;
        }

        if (!userId) {
            const systemUserObj = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
            userId = systemUserObj?.id || null;
        }

        const oldStatus = lead.status;
        const now = new Date();

        let durationSeconds = 0;
        const lastStageChange = lead.interactions[0];
        if (lastStageChange) {
            durationSeconds = Math.floor((now.getTime() - lastStageChange.created_at.getTime()) / 1000);
        } else {
            durationSeconds = Math.floor((now.getTime() - lead.created_at.getTime()) / 1000);
        }

        const updateData: any = {
            status: newStatus,
        };

        await prisma.$transaction([
            prisma.lead.update({
                where: { id },
                data: updateData
            }),
            prisma.interaction.create({
                data: {
                    lead_id: id,
                    type: 'STAGE_CHANGE',
                    notes: `Chuyển trạng thái từ ${oldStatus} sang ${newStatus}. ${notes ? `Ghi chú: ${notes}` : ''}`,
                    user_id: userId || 'system',
                    outcome: newStatus,
                    metadata: JSON.stringify({
                        oldStatus,
                        newStatus,
                        durationSeconds,
                        reason: notes
                    })
                }
            })
        ]);
        safeRevalidatePath('/crm/leads');
        return { success: true };
    } catch (error) {
        console.error("Failed to update status:", error);
        return { success: false, error: "Status update failed" };
    }
}

/**
 * Add a generic activity/interaction
 */
export async function addLeadActivity(
    leadId: string,
    type: string,
    content: string,
    metadata?: any,
    startTime?: Date,
    endTime?: Date,
    outcome?: string
) {
    try {
        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) return { success: false, error: "Lead not found" };

        let userId = lead.assigned_to_id;

        if (!userId) {
            userId = cookies().get('user_id')?.value || null;
        }

        if (!userId) {
            const systemUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
            userId = systemUser?.id || null;
        }

        await prisma.$transaction([
            prisma.interaction.create({
                data: {
                    lead_id: leadId,
                    type,
                    notes: content,
                    user_id: userId || 'system',
                    outcome,
                    metadata: metadata ? JSON.stringify(metadata) : null
                }
            })
        ]);

        safeRevalidatePath('/crm/leads');
        return { success: true };
    } catch (error) {
        console.error("Failed to add activity:", error);
        return { success: false, error: "Failed to add activity" };
    }
}

/**
 * Update general lead info
 */
export async function updateLead(id: string, data: Partial<CreateLeadInput>) {
    try {
        await prisma.lead.update({
            where: { id },
            data: {
                ...data,
                budget: data.budget ? parseFloat(data.budget.toString().replace(/,/g, '')) : undefined,
            }
        });
        safeRevalidatePath('/crm/leads');
        return { success: true };
    } catch (error) {
        console.error("Failed to update lead:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

/**
 * Delete a lead
 */
export async function deleteLead(id: string) {
    try {
        await prisma.lead.update({
            where: { id },
            data: { 
                status: 'DEAD',
                deleted_at: new Date()
            }
        });
        safeRevalidatePath('/crm/leads');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete lead:", error);
        return { success: false, error: "Failed to delete lead" };
    }
}

/**
 * Search leads by name or phone
 */
export async function searchLeads(query: string) {
    if (!query || query.length < 2) return [];

    try {
        const leads = await prisma.lead.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { phone: { contains: query } },
                    { email: { contains: query } }
                ]
            },
            take: 10,
            orderBy: { created_at: 'desc' }
        });

        return leads.map((l: any) => ({
            id: l.id,
            name: l.name,
            phone: l.phone,
            email: l.email || '',
            vehicle: l.model_interest ? `${l.model_interest} ${l.model_version || ''}`.trim() : '',
            plate: ''
        }));
    } catch (error) {
        console.error("Failed to search leads:", error);
        return [];
    }
}
