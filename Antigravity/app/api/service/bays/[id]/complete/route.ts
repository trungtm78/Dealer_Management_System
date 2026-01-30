import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { notes, user_id } = body;

        const assignment = await prisma.bayAssignment.findFirst({
            where: {
                bay_id: params.id,
                status: { in: ['ASSIGNED', 'WORKING'] }
            }
        });

        if (!assignment) {
            return NextResponse.json({ success: false, error: { code: "ASSIGNMENT_NOT_FOUND", message: "No active assignment for this bay" } }, { status: 404 });
        }

        const result = await prisma.$transaction(async (tx) => {
            const upd = await tx.bayAssignment.update({
                where: { id: assignment.id },
                data: {
                    status: 'COMPLETED',
                    actual_end: new Date(),
                    progress_percent: 100,
                    notes: notes || assignment.notes
                }
            });

            await tx.serviceBay.update({
                where: { id: params.id },
                data: { is_available: true }
            });

            await tx.bayStatusLog.create({
                data: {
                    bay_id: params.id,
                    assignment_id: assignment.id,
                    status: 'IDLE',
                    changed_by: user_id,
                    notes: `Work completed. ${notes || ''}`
                }
            });

            // Also update the Repair Order status to QC (Quality Control) as it leaves the bay
            await tx.repairOrder.update({
                where: { id: assignment.repair_order_id },
                data: { status: 'QC' }
            });

            return upd;
        });

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("API Error [POST /api/service/bays/:id/complete]:", error);
        return NextResponse.json({
            success: false,
            error: { code: "BAY_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}
