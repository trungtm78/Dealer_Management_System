"use server";

import prisma from "@/lib/prisma";

export type SourceStat = {
    source: string;
    total: number;
    won: number; // QUALIFIED or higher
    avgScore: number;
    conversionRate: number;
};

export async function getLeadSourceStats() {
    try {
        const leads = await prisma.lead.findMany({
            select: {
                source: true,
                status: true,
                score: true,
            }
        });

        const statsMap = new Map<string, { total: number; won: number; totalScore: number }>();

        // Initialize all known sources with 0 to ensure they appear
        const knownSources = ['FACEBOOK', 'WEBSITE', 'WALK_IN', 'HOTLINE', 'REFERRAL', 'OTHER'];
        knownSources.forEach((source: string) => {
            statsMap.set(source, { total: 0, won: 0, totalScore: 0 });
        });

        leads.forEach((lead: any) => {
            const current = statsMap.get(lead.source) || { total: 0, won: 0, totalScore: 0 };

            const isWon = lead.status === 'QUALIFIED' || lead.status === 'TEST_DRIVE'; // Definition of "Won" or "Promising"

            statsMap.set(lead.source, {
                total: current.total + 1,
                won: current.won + (isWon ? 1 : 0),
                totalScore: current.totalScore + lead.score
            });
        });

        const result: SourceStat[] = Array.from(statsMap.entries()).map(([source, data]) => {
            return {
                source: formatSourceName(source),
                total: data.total,
                won: data.won,
                avgScore: data.total > 0 ? Math.round(data.totalScore / data.total) : 0,
                conversionRate: data.total > 0 ? parseFloat(((data.won / data.total) * 100).toFixed(1)) : 0
            };
        });

        // Sort by Total Descending
        return { success: true, data: result.sort((a, b) => b.total - a.total) };

    } catch (error) {
        console.error("Error fetching source stats:", error);
        return { success: false, error: "Failed to fetch statistics" };
    }
}

function formatSourceName(source: string): string {
    const mapping: Record<string, string> = {
        'FACEBOOK': 'Facebook Ads',
        'WEBSITE': 'Website',
        'WALK_IN': 'Showroom (Walk-in)',
        'HOTLINE': 'Hotline',
        'REFERRAL': 'Giới thiệu',
        'OTHER': 'Khác'
    };
    return mapping[source] || source;
}
