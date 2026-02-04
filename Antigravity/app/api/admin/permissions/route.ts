import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const forDropdown = searchParams.get('for_dropdown') === 'true';
        const status = searchParams.get('status') || 'ACTIVE';

        if (forDropdown) {
            const permissions = await prisma.permission.findMany({
                select: { id: true, description: true, module: true, action: true },
                orderBy: { module: 'asc' }
            });
            const dropdownData = permissions.map(p => ({
                id: p.id,
                name: `${p.module}: ${p.action}`,
                status: 'ACTIVE'
            }));
            return NextResponse.json({ data: dropdownData });
        }

        const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
        const skip = calculateSkip(page, limit);

        const where: any = {
            ...buildSearchWhereClause(search, ["name", "code"]),
        };

        if (filters.status) {
            where.status = filters.status;
        }

        const [total, permissions] = await Promise.all([
            prisma.permission.count({ where }),
            prisma.permission.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);

        return NextResponse.json({
            data: permissions,
            meta: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        console.error("Failed to fetch permissions:", error);
        return NextResponse.json({
            error: "Failed to fetch permissions"
        }, { status: 500 });
    }
}
