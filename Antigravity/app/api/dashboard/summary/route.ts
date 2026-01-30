import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const [
            leadTotal, leadNew, leadQualified,
            customerTotal, customerActive,
            contractTotal, contractActive,
            roTotal, roPending
        ] = await Promise.all([
            prisma.lead.count(),
            prisma.lead.count({ where: { status: 'NEW' } }),
            prisma.lead.count({ where: { status: 'QUALIFIED' } }),
            prisma.customer.count(),
            prisma.customer.count({ where: { status: 'ACTIVE' } }),
            prisma.contract.count(),
            prisma.contract.count({ where: { status: 'ACTIVE' } }),
            prisma.repairOrder.count(),
            prisma.repairOrder.count({ where: { status: 'PENDING' } })
        ]);

        const totalRevenue = await prisma.contract.aggregate({
            _sum: { total_amount: true }
        });

        return NextResponse.json({
            leads: { total: leadTotal, new: leadNew, qualified: leadQualified },
            customers: { total: customerTotal, active: customerActive },
            sales: { revenue: Number(totalRevenue._sum.total_amount || 0), units: contractTotal },
            service: { active_ros: roPending }
        });
    } catch (error) {
        console.error("API Error [GET /api/dashboard/summary]:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
