"use server";

import prisma from "@/lib/prisma";
import { ScoringRuleDTO } from "@/lib/types/crm";
import { revalidatePath } from "next/cache";

export async function getScoringRules(): Promise<ScoringRuleDTO[]> {
    try {
        const criteriaList = await prisma.scoringCriteria.findMany({
            orderBy: { category: 'asc' }
        });

        // Map ScoringCriteria Prisma Model to ScoringRuleDTO
        return criteriaList.map((c: any) => ({
            id: c.id,
            category: c.category,
            criteria: c.name,
            weight: c.score,
            enabled: c.status === "ACTIVE"
        }));
    } catch (error) {
        console.error("getScoringRules error:", error);
        return [];
    }
}

export async function toggleRule(id: string, currentStatus: boolean) {
    try {
        await prisma.scoringCriteria.update({
            where: { id },
            data: { status: !currentStatus ? "ACTIVE" : "INACTIVE" }
        });
        revalidatePath('/crm/scoring');
        return { success: true };
    } catch (error) {
        console.error("toggleRule error:", error);
        return { success: false };
    }
}

export async function updateRuleWeight(id: string, weight: number) {
    try {
        await prisma.scoringCriteria.update({
            where: { id },
            data: { score: weight }
        });
        revalidatePath('/crm/scoring');
        return { success: true };
    } catch (error) {
        console.error("updateRuleWeight error:", error);
        return { success: false };
    }
}

export async function createScoringRule(category: string, criteria: string, weight: number, enabled: boolean = true) {
    try {
        await prisma.scoringCriteria.create({
            data: {
                category,
                name: criteria,
                score: weight,
                status: enabled ? "ACTIVE" : "INACTIVE"
            }
        });
        revalidatePath('/crm/scoring');
        return { success: true };
    } catch (error: any) {
        console.error("createScoringRule error:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteScoringRule(id: string) {
    try {
        await prisma.scoringCriteria.delete({
            where: { id }
        });
        revalidatePath('/crm/scoring');
        return { success: true };
    } catch (error) {
        console.error("deleteScoringRule error:", error);
        return { success: false, error: 'Failed to delete rule' };
    }
}

export async function deleteManyScoringRules(ids: string[]) {
    try {
        await prisma.scoringCriteria.deleteMany({
            where: { id: { in: ids } }
        });
        revalidatePath('/crm/scoring');
        return { success: true };
    } catch (error) {
        console.error("deleteManyScoringRules error:", error);
        return { success: false, error: 'Failed to delete rules' };
    }
}

import { calculateLeadScore } from "@/lib/scoring";

export async function recalculateAllLeadsScore() {
    try {
        const rawCriteria = await prisma.scoringCriteria.findMany({ 
            where: { status: "ACTIVE" } 
        });
        
        const rules: ScoringRuleDTO[] = rawCriteria.map((c: any) => ({
            id: c.id,
            category: c.category,
            criteria: c.name,
            weight: c.score,
            enabled: true
        }));

        const leads = await prisma.lead.findMany();

        let updatedCount = 0;

        for (const lead of leads) {
            const score = calculateLeadScore(lead, rules);

            await prisma.lead.update({
                where: { id: lead.id },
                data: { score }
            });
            updatedCount++;
        }

        revalidatePath('/crm/leads');
        revalidatePath('/crm/scoring');
        return { success: true, count: updatedCount };
    } catch (error) {
        console.error("recalculateAllLeadsScore error:", error);
        return { success: false, error: 'Failed to recalculate scores' };
    }
}
