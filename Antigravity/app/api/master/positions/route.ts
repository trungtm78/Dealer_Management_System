import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const forDropdown = searchParams.get('for_dropdown') === 'true';
        const status = searchParams.get('status') || 'ACTIVE';

        if (forDropdown) {
            const positions = await prisma.master_positions.findMany({
                where: { status },
                select: { id: true, position_name: true, status: true },
                orderBy: { position_name: 'asc' }
            });
            const dropdownData = positions.map(p => ({
                id: p.id,
                name: p.position_name,
                status: p.status
            }));
            return NextResponse.json({ data: dropdownData });
        }

        const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
        const skip = calculateSkip(page, limit);

        const where: any = {
            ...buildSearchWhereClause(search, ["position_name", "position_code"]),
        };

        if (filters.status) {
            where.status = filters.status;
        }

        const [total, positions] = await Promise.all([
            prisma.master_positions.count({ where }),
            prisma.master_positions.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);

        return NextResponse.json({
            data: positions,
            meta: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        console.error('Failed to fetch positions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch positions' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const position = await prisma.master_positions.create({
            data: {
                position_code: body.position_code,
                position_name: body.position_name,
                status: body.status || 'ACTIVE'
            }
        });
        
        return NextResponse.json(position, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create position:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create position' },
            { status: 400 }
        );
    }
}
