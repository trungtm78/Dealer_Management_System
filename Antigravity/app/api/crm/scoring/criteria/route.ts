import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { category, name, score, status } = body;

        if (!category || !name || score === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const criteria = await prisma.scoringCriteria.create({
            data: {
                category,
                name,
                score: Number(score),
                status: status || "ACTIVE"
            }
        });

        return NextResponse.json(criteria, { status: 201 });
    } catch (error) {
        console.error("API Error [POST /api/crm/scoring/criteria]:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const criteriaList = await prisma.scoringCriteria.findMany({
            orderBy: { created_at: 'desc' }
        });
        return NextResponse.json(criteriaList);
    } catch (error) {
        console.error("API Error [GET /api/crm/scoring/criteria]:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
