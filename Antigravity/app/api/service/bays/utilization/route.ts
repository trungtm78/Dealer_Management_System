import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const [totalBays, activeAssignments] = await Promise.all([
            prisma.serviceBay.count({ where: { status: 'ACTIVE' } }),
            prisma.bayAssignment.findMany({
                where: { status: { in: ['ASSIGNED', 'WORKING'] } },
                include: { bay: true }
            })
        ]);

        const workingBays = activeAssignments.length;
        const idleBays = totalBays - workingBays;
        const utilizationRate = totalBays > 0 ? (workingBays / totalBays) * 100 : 0;

        const now = new Date();
        const delayedCount = activeAssignments.filter(a => 
            a.estimated_end && new Date(a.estimated_end) < now
        ).length;

        const avgProgress = activeAssignments.length > 0 
            ? activeAssignments.reduce((acc, a) => acc + a.progress_percent, 0) / activeAssignments.length 
            : 0;

        return NextResponse.json({
            success: true,
            data: {
                total_bays: totalBays,
                working_bays: workingBays,
                idle_bays: idleBays,
                utilization_rate: Math.round(utilizationRate),
                delayed_count: delayedCount,
                avg_progress: Math.round(avgProgress)
            }
        });
    } catch (error) {
        console.error("API Error [GET /api/service/bays/utilization]:", error);
        return NextResponse.json({
            success: false,
            error: { code: "BAY_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}
