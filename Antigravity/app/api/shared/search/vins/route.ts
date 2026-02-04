import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { SearchRequest, SearchResponse, SelectItem } from "@/types/smart-select";

export async function POST(req: NextRequest) {
    try {
        const searchRequest: SearchRequest = await req.json();

        const { q, limit = 20, cursor, context, filter } = searchRequest;

        const where: any = {
            ...(filter?.excludedIds && { id: { notIn: filter.excludedIds } }),
            ...(context?.onlyActive !== false && { status: "AVAILABLE" }),
        };

        // Search by VIN number, model, color
        if (q && q.trim()) {
            const query = q.trim().toLowerCase();
            where.OR = [
                { vin_number: { contains: query } },
                { model: { contains: query } },
                { color: { contains: query } }
            ];
        }

        const items = await prisma.vin.findMany({
            where,
            take: limit + 1,
            ...(cursor && { skip: 1, cursor: { id: cursor as string } }),
            orderBy: [{ vin_number: "asc" }],
        });

        const selectItems: SelectItem[] = items.slice(0, limit).map((vin: any) => ({
            id: vin.id,
            label: vin.vin_number,
            subtitle: `${vin.model} - ${vin.color} (${vin.year})`,
            meta: vin
        }));

        const nextCursor = items.length > limit ? items[limit - 1].id : null;

        const response: SearchResponse = {
            items: selectItems,
            nextCursor
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error in VINs search:", error);
        return NextResponse.json(
            { error: "Failed to search VINs" },
            { status: 500 }
        );
    }
}
