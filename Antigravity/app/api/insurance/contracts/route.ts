import { NextResponse } from "next/server";
import { getInsuranceContracts, createInsuranceContract } from "@/actions/insurance/contracts";
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
        const skip = calculateSkip(page, limit);

        const where: any = {
            ...buildSearchWhereClause(search, ["contract_number", "customer_name"]),
        };

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.customer_id) {
            where.customer_id = filters.customer_id;
        }

        const [total, contracts] = await Promise.all([
            prisma.insuranceContract.count({ where }),
            prisma.insuranceContract.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);

        return NextResponse.json({
            data: contracts,
            meta: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch insurance contracts" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const payload = {
            ...body,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            premium: Number(body.premium)
        };

        const result = await createInsuranceContract(payload);
        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json(result.data, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
