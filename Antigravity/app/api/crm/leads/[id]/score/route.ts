import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { score } = body;

        if (score === undefined) {
            return NextResponse.json({ error: "Score is required" }, { status: 400 });
        }

        const lead = await prisma.lead.update({
            where: { id: params.id },
            data: { score: Number(score) }
        });

        return NextResponse.json({
            id: lead.id,
            score: lead.score,
            updated_at: lead.updated_at
        });
    } catch (error) {
        console.error("API Error [POST /api/crm/leads/:id/score]:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
