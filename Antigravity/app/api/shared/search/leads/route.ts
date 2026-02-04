import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { SearchRequest, SearchResponse, SelectItem } from "@/types/smart-select";

export async function POST(req: NextRequest) {
    try {
        const searchRequest: SearchRequest = await req.json();

        const { q, limit = 20, cursor, context, filter } = searchRequest;

        const where: any = {
            ...(filter?.excludedIds && { id: { notIn: filter.excludedIds } }),
        };

        // Search by name, phone, email
        if (q && q.trim()) {
            const query = q.trim().toLowerCase();
            where.OR = [
                { name: { contains: query } },
                { phone: { contains: query } },
                { email: { contains: query } }
            ];
        }

        const items = await prisma.lead.findMany({
            where,
            take: limit + 1,
            ...(cursor && { skip: 1, cursor: { id: cursor as string } }),
            orderBy: [{ created_at: "desc" }],
        });

        const selectItems: SelectItem[] = items.slice(0, limit).map((lead: any) => ({
            id: lead.id,
            label: lead.name,
            subtitle: [lead.phone, lead.model_interest].filter(Boolean).join(" • "),
            meta: lead
        }));

        const nextCursor = items.length > limit ? items[limit - 1].id : null;

        const response: SearchResponse = {
            items: selectItems,
            nextCursor
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error in leads search:", error);
        return NextResponse.json(
            { error: "Failed to search leads" },
            { status: 500 }
        );
    }
}
