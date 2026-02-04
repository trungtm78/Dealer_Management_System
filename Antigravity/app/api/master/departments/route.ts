import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const forDropdown = searchParams.get('for_dropdown') === 'true';
        const status = searchParams.get('status') || 'ACTIVE';

        if (forDropdown) {
            const departments = await prisma.master_departments.findMany({
                where: { status },
                select: { id: true, department_name: true, status: true },
                orderBy: { department_name: 'asc' }
            });
            const dropdownData = departments.map(d => ({
                id: d.id,
                name: d.department_name,
                status: d.status
            }));
            return NextResponse.json({ data: dropdownData });
        }

        const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
        const skip = calculateSkip(page, limit);

        const where: any = {
            ...buildSearchWhereClause(search, ["department_name", "department_code"]),
        };

        if (filters.status) {
            where.status = filters.status;
        }

        const [total, departments] = await Promise.all([
            prisma.master_departments.count({ where }),
            prisma.master_departments.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);

        return NextResponse.json({
            data: departments,
            meta: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        console.error('Failed to fetch departments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch departments' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const department = await prisma.master_departments.create({
            data: {
                department_code: body.department_code,
                department_name: body.department_name,
                status: body.status || 'ACTIVE'
            }
        });
        
        return NextResponse.json(department, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create department:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create department' },
            { status: 400 }
        );
    }
}
