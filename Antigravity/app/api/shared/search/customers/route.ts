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

        // Multi-field search: name, phone, mobile, email, vat (tax ID)
        if (q && q.trim()) {
            const query = q.trim().toLowerCase();
            where.OR = [
                { name: { contains: query } },
                { phone: { contains: query } },
                { mobile: { contains: query } },
                { email: { contains: query } },
                { vat: { contains: query } }
            ];
        }

        const items = await prisma.customer.findMany({
            where,
            take: limit + 1,
            ...(cursor && { skip: 1, cursor: { id: cursor as string } }),
            orderBy: [{ name: "asc" }],
        });

        const selectItems: SelectItem[] = items.slice(0, limit).map((customer: any) => ({
            id: customer.id,
            label: customer.name,
            subtitle: [
                customer.phone || customer.mobile,
                customer.email
            ].filter(Boolean).join(" • "),
            meta: customer
        }));

        const nextCursor = items.length > limit ? items[limit - 1].id : null;

        const response: SearchResponse = {
            items: selectItems,
            nextCursor
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error in customers search:", error);
        return NextResponse.json(
            { error: "Failed to search customers" },
            { status: 500 }
        );
    }
}
