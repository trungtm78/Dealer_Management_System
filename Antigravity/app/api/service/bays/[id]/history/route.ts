import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = Number(searchParams.get('limit')) || 20;

        const history = await prisma.bay_status_logs.findMany({
            where: { bay_id: params.id },
            include: {
                User: { select: { id: true, name: true } },
                bay_assignments: {
                    include: {
                        RepairOrder: {
                            include: { Customer: true }
                        }
                    }
                }
            },
            orderBy: { changed_at: 'desc' },
            take: limit
        });

        return NextResponse.json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error("API Error [GET /api/service/bays/:id/history]:", error);
        return NextResponse.json({
            success: false,
            error: { code: "BAY_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}
