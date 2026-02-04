import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { SearchRequest, SearchResponse, SelectItem } from "@/types/smart-select";

export async function POST(req: NextRequest) {
    try {
        const searchRequest: SearchRequest = await req.json();

        const { q, limit = 20, cursor, context, filter } = searchRequest;

        const where: any = {
            ...(filter?.excludedIds && { id: { notIn: filter.excludedIds } }),
            ...(context?.onlyActive !== false && { status: "ACTIVE" }),
        };

        // Search by code, name
        if (q && q.trim()) {
            const query = q.trim().toLowerCase();
            where.OR = [
                { code: { contains: query } },
                { name: { contains: query } }
            ];
        }

        const items = await prisma.supplier.findMany({
            where,
            take: limit + 1,
            ...(cursor && { skip: 1, cursor: { id: cursor as string } }),
            orderBy: [{ name: "asc" }],
        });

        const selectItems: SelectItem[] = items.slice(0, limit).map((supplier: any) => ({
            id: supplier.id,
            label: supplier.name,
            subtitle: supplier.code,
            meta: supplier
        }));

        const nextCursor = items.length > limit ? items[limit - 1].id : null;

        const response: SearchResponse = {
            items: selectItems,
            nextCursor
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error in suppliers search:", error);
        return NextResponse.json(
            { error: "Failed to search suppliers" },
            { status: 500 }
        );
    }
}
