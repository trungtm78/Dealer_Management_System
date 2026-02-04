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

        // Search by contract number, customer info
        if (q && q.trim()) {
            const query = q.trim().toLowerCase();
            where.OR = [
                { contract_number: { contains: query } },
                { policy_number: { contains: query } },
                { insurance_company: { contains: query } }
            ];
        }

        const items = await prisma.insuranceContract.findMany({
            where,
            take: limit + 1,
            ...(cursor && { skip: 1, cursor: { id: cursor as string } }),
            orderBy: [{ contract_number: "asc" }],
            include: {
                Customer: { select: { name: true } }
            }
        });

        const selectItems: SelectItem[] = items.slice(0, limit).map((contract: any) => ({
            id: contract.id,
            label: contract.contract_number,
            subtitle: `${contract.Customer.name} - ${contract.insurance_company}`,
            meta: contract
        }));

        const nextCursor = items.length > limit ? items[limit - 1].id : null;

        const response: SearchResponse = {
            items: selectItems,
            nextCursor
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error in insurance contracts search:", error);
        return NextResponse.json(
            { error: "Failed to search insurance contracts" },
            { status: 500 }
        );
    }
}
