
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

// POST /api/crm/leads/[id]/activities
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { type, content, metadata, startTime, endTime, outcome } = body;

        if (!type || !content) {
            return NextResponse.json({ error: "Missing required fields: type, content" }, { status: 400 });
        }

        const leadId = params.id;
        const lead = await prisma.lead.findUnique({ where: { id: leadId } });

        if (!lead) {
            return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        }

        // Priority 1: Current Logged-in User (from Cookie)
        let userId: string | undefined = cookies().get('user_id')?.value;

        // Priority 2: Assigned User
        if (!userId) {
            userId = lead.assigned_to_id || undefined;
        }

        // Priority 3: Fallback System/Sales User
        if (!userId) {
            const systemUser = await prisma.user.findFirst({
                where: { OR: [{ role: 'ADMIN' }, { role: 'SALES' }] }
            });

            if (systemUser) {
                userId = systemUser.id;
            } else {
                // Absolute fallback to any user
                const anyUser = await prisma.user.findFirst();
                if (anyUser) userId = anyUser.id;
                else {
                    return NextResponse.json({ error: "No users found in system to assign activity" }, { status: 500 });
                }
            }
        }

const now = new Date();
        const leadUpdateData: any = {};

        // Transaction to update Lead and create Interaction
        await prisma.$transaction([
prisma.interaction.create({
                data: {
                    lead_id: leadId,
                    type,
                    outcome: content,
                    user_id: userId,
                    metadata: metadata || {}
                }
            }),
            prisma.lead.update({
                where: { id: leadId },
                data: leadUpdateData
            })
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("API Error [POST /api/crm/leads/:id/activities]:", error);
        return NextResponse.json({ error: "Failed to add activity" }, { status: 500 });
    }
}
