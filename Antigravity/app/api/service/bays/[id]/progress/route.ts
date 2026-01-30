import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { progress_percent, notes, user_id } = body;

        const assignment = await prisma.bayAssignment.findFirst({
            where: {
                bay_id: params.id,
                status: { in: ['ASSIGNED', 'WORKING'] }
            }
        });

        if (!assignment) {
            return NextResponse.json({ success: false, error: { code: "ASSIGNMENT_NOT_FOUND", message: "No active assignment for this bay" } }, { status: 404 });
        }

        // Validate progress cannot decrease
        if (progress_percent < assignment.progress_percent) {
            return NextResponse.json({ success: false, error: { code: "INVALID_PROGRESS", message: "Progress cannot decrease" } }, { status: 400 });
        }

        // Calculate delay
        let delayMinutes = 0;
        const now = new Date();
        if (assignment.estimated_end && now > new Date(assignment.estimated_end)) {
            delayMinutes = Math.floor((now.getTime() - new Date(assignment.estimated_end).getTime()) / 60000);
        }

        const updated = await prisma.$transaction(async (tx) => {
            const upd = await tx.bayAssignment.update({
                where: { id: assignment.id },
                data: {
                    progress_percent,
                    delay_minutes: delayMinutes,
                    notes: notes || assignment.notes
                }
            });

            if (notes) {
                await tx.bayStatusLog.create({
                    data: {
                        bay_id: params.id,
                        assignment_id: assignment.id,
                        status: 'WORKING',
                        changed_by: user_id,
                        notes: `Progress update: ${progress_percent}%. ${notes}`
                    }
                });
            }

            return upd;
        });

        return NextResponse.json({
            success: true,
            data: updated
        });

    } catch (error) {
        console.error("API Error [PUT /api/service/bays/:id/progress]:", error);
        return NextResponse.json({
            success: false,
            error: { code: "BAY_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}
