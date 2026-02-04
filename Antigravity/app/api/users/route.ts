import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
        const skip = calculateSkip(page, limit);

        const where: any = {
            ...buildSearchWhereClause(search, ["name", "phone", "email"]),
        };

        if (filters.role) {
            where.role = filters.role;
        }

        if (filters.status) {
            where.status = filters.status;
        }

        const [total, users] = await Promise.all([
            prisma.user.count({ where }),
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);

        return NextResponse.json({
            data: users,
            meta: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        console.error("API Error [GET /api/users]:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
