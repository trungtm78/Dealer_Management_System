import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const forDropdown = searchParams.get('for_dropdown') === 'true';
        const status = searchParams.get('status') || 'ACTIVE';

        if (forDropdown) {
            const roles = await prisma.role.findMany({
                where: { is_system: false },
                select: { id: true, name: true },
                orderBy: { name: 'asc' }
            });
            const dropdownData = roles.map(r => ({
                id: r.id,
                name: r.name,
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

        const [total, roles] = await Promise.all([
            prisma.role.count({ where }),
            prisma.role.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);

        return NextResponse.json({
            data: roles,
            meta: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        console.error("Failed to fetch roles:", error);
        return NextResponse.json({
            error: "Failed to fetch roles"
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const result = await prisma.role.create({
            data: {
                name: body.name,
                description: body.description
            }
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create role:', error);
        return NextResponse.json({
            error: error.message || 'Failed to create role'
        }, { status: 400 });
    }
}
