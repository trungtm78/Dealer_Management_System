"use server";

import prisma from "@/lib/prisma";
import { CampaignDTO, CampaignStatus } from "@/lib/types/crm";
import { revalidatePath } from "next/cache";

export async function getCampaigns(): Promise<CampaignDTO[]> {
    try {
        const campaigns = await prisma.marketingCampaign.findMany({
            orderBy: { created_at: 'desc' }
        });
        return campaigns.map((c: any) => ({
            ...c,
            startDate: c.startDate?.toISOString() || null,
            endDate: c.endDate?.toISOString() || null,
            // We don't need these in DTO if not defined, but map them correctly if needed
        }));
    } catch (error) {
        console.error("Fetch campaigns error:", error);
        return [];
    }
}

export async function toggleCampaignStatus(id: string, currentStatus: CampaignStatus) {
    try {
        let newStatus: CampaignStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        if (currentStatus === 'DRAFT') newStatus = 'ACTIVE';

        await prisma.marketingCampaign.update({
            where: { id },
            data: { status: newStatus }
        });
        revalidatePath('/crm/marketing');
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}
