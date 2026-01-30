import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { repair_order_id, estimated_duration_minutes, notes, user_id } = body;

        // 1. Check if bay is available
        const bay = await prisma.serviceBay.findUnique({ where: { id: params.id } });
        if (!bay) return NextResponse.json({ success: false, error: { code: "BAY_NOT_FOUND", message: "Bay not found" } }, { status: 404 });
        if (!bay.is_available) return NextResponse.json({ success: false, error: { code: "BAY_NOT_AVAILABLE", message: "Bay is not available" } }, { status: 400 });

        // 2. Check if repair order is already assigned
        const existingAssignment = await prisma.bayAssignment.findFirst({
            where: { repair_order_id, status: { in: ['ASSIGNED', 'WORKING'] } }
        });
        if (existingAssignment) {
            return NextResponse.json({ 
                success: false, 
                error: { code: "REPAIR_ORDER_ALREADY_ASSIGNED", message: "Repair order is already assigned to a bay" } 
            }, { status: 400 });
        }

        // 3. Create assignment and log in transaction
        const estimatedEnd = new Date();
        estimatedEnd.setMinutes(estimatedEnd.getMinutes() + Number(estimated_duration_minutes));

        const result = await prisma.$transaction(async (tx) => {
            const assignment = await tx.bayAssignment.create({
                data: {
                    bay_id: params.id,
                    repair_order_id,
                    estimated_end: estimatedEnd,
                    status: 'WORKING',
                    started_at: new Date(),
                    notes
                }
            });

            await tx.serviceBay.update({
                where: { id: params.id },
                data: { is_available: false }
            });

            await tx.bayStatusLog.create({
                data: {
                    bay_id: params.id,
                    assignment_id: assignment.id,
                    status: 'WORKING',
                    changed_by: user_id,
                    notes: "Work assigned and started"
                }
            });

            return assignment;
        });

        return NextResponse.json({
            success: true,
            data: result
        }, { status: 201 });

    } catch (error) {
        console.error("API Error [POST /api/service/bays/:id/assign]:", error);
        return NextResponse.json({
            success: false,
            error: { code: "BAY_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}
