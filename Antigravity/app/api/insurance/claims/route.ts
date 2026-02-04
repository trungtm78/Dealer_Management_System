import { NextRequest, NextResponse } from "next/server";
import { getClaims, createClaim } from "@/actions/insurance/claims";
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
        const skip = calculateSkip(page, limit);

        const where: any = {
            ...buildSearchWhereClause(search, ["claim_number", "customer_name"]),
        };

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.contract_id) {
            where.contract_id = filters.contract_id;
        }

        const [total, claims] = await Promise.all([
            prisma.insuranceClaim.count({ where }),
            prisma.insuranceClaim.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);

        return NextResponse.json({
            data: claims,
            meta: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        return NextResponse.json({
            error: { code: "INS_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await createClaim(body);

        if (result.success) {
            return NextResponse.json({ success: true, data: result.data }, { status: 201 });
        } else {
            return NextResponse.json({
                success: false,
                error: { code: "INS_400", message: result.error }
            }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: { code: "INS_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}
