import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { SearchRequest, SearchResponse, SelectItem } from "@/types/smart-select";

export async function POST(req: NextRequest) {
    try {
        const searchRequest: SearchRequest = await req.json();

        const { q, limit = 20, cursor } = searchRequest;

        const where: any = {};

        // Search by name
        if (q && q.trim()) {
            const query = q.trim().toLowerCase();
            where.name = { contains: query };
        }

        const items = await prisma.role.findMany({
            where,
            take: limit + 1,
            ...(cursor && { skip: 1, cursor: { id: cursor as string } }),
            orderBy: [{ name: "asc" }],
        });

        const selectItems: SelectItem[] = items.slice(0, limit).map((role: any) => ({
            id: role.id,
            label: role.name,
            subtitle: role.description,
            meta: role
        }));

        const nextCursor = items.length > limit ? items[limit - 1].id : null;

        const response: SearchResponse = {
            items: selectItems,
            nextCursor
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error in roles search:", error);
        return NextResponse.json(
            { error: "Failed to search roles" },
            { status: 500 }
        );
    }
}
