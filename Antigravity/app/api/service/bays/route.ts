import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
        const skip = calculateSkip(page, limit);

        const where: any = {
            ...buildSearchWhereClause(search, ["bay_name", "bay_code"]),
        };

        if (filters.status) {
            where.status = filters.status;
        } else {
            where.status = { not: 'DELETED' };
        }

        if (filters.bay_type) {
            where.bay_type = filters.bay_type;
        }

        const [total, bays] = await Promise.all([
            prisma.service_bays.count({ where }),
            prisma.service_bays.findMany({
                where,
                skip,
                take: limit,
                orderBy: { bay_name: 'asc' }
            })
        ]);

        return NextResponse.json({
            data: bays,
            meta: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        console.error("API Error [GET /api/service/bays]:", error);
        return NextResponse.json({
            error: { code: "BAY_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { bay_name, bay_code, bay_type, location, capacity_vehicles } = body;

        if (!bay_name || !bay_code) {
            return NextResponse.json({
                error: { code: "BAY_400", message: "Bay name and code are required" }
            }, { status: 400 });
        }

        const bay = await prisma.service_bays.create({
            data: {
                bay_name,
                bay_code,
                bay_type: bay_type || 'GENERAL',
                capacity_vehicles: capacity_vehicles || 1,
                location,
                status: 'ACTIVE'
            }
        });

        return NextResponse.json(bay, { status: 201 });
    } catch (error) {
        console.error("API Error [POST /api/service/bays]:", error);
        return NextResponse.json({
            error: { code: "BAY_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}
