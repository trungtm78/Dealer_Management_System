import { NextRequest, NextResponse } from "next/server";
import { getQuotes, createQuote } from "@/actions/service/quotations";
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
        const skip = calculateSkip(page, limit);

        const where: any = {
            ...buildSearchWhereClause(search, ["quote_number", "customer_name"]),
        };

        if (filters.status) {
            where.status = filters.status;
        }

        const [total, quotes] = await Promise.all([
            prisma.serviceQuote.count({ where }),
            prisma.serviceQuote.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);

        return NextResponse.json({
            data: quotes,
            meta: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        console.error("Failed to fetch service quotes:", error);
        return NextResponse.json({ error: "Failed to fetch service quotes" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await createQuote(body);
        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json(result.data, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
    }
}
