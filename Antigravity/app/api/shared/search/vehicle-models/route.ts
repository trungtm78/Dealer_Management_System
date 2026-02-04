import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { SearchRequest, SearchResponse, SelectItem } from "@/types/smart-select";

export async function POST(req: NextRequest) {
    try {
        const searchRequest: SearchRequest = await req.json();

        const { q, limit = 20, cursor, context, filter } = searchRequest;

        const where: any = {
            ...(filter?.categoryId && { categoryId: filter.categoryId }),
            ...(filter?.excludedIds && { id: { notIn: filter.excludedIds } }),
            ...(context?.onlyActive !== false && { status: "ACTIVE" }),
        };

        if (q && q.trim()) {
            const query = q.trim().toLowerCase();
            where.OR = [
                { model_name: { contains: query } },
                { model_code: { contains: query } }
            ];
        }

        const items = await prisma.vehicle_models.findMany({
            where,
            take: limit + 1,
            ...(cursor && { skip: 1, cursor: { id: cursor as string } }),
            orderBy: [{ model_name: "asc" }],
        });

        const selectItems: SelectItem[] = items.slice(0, limit).map((model: any) => ({
            id: model.id,
            label: model.model_name,
            subtitle: model.model_code,
            meta: model
        }));

        const nextCursor = items.length > limit ? items[limit - 1].id : null;

        const response: SearchResponse = {
            items: selectItems,
            nextCursor
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error in vehicle models search:", error);
        return NextResponse.json(
            { error: "Failed to search vehicle models" },
            { status: 500 }
        );
    }
}
