import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const forDropdown = searchParams.get('for_dropdown') === 'true';
        const status = searchParams.get('status') || 'ACTIVE';

        if (forDropdown) {
            const models = await prisma.vehicle_models.findMany({
                where: { status },
                select: { id: true, model_name: true, status: true },
                orderBy: { model_name: 'asc' }
            });
            const dropdownData = models.map(m => ({
                id: m.id,
                name: m.model_name,
                status: m.status
            }));
            return NextResponse.json({ data: dropdownData });
        }

        const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
        const skip = calculateSkip(page, limit);

        const where: any = {
            ...buildSearchWhereClause(search, ["model_name", "model_code"]),
        };

        if (filters.status) {
            where.status = filters.status;
        }

        const [total, models] = await Promise.all([
            prisma.vehicle_models.count({ where }),
            prisma.vehicle_models.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);

        return NextResponse.json({
            data: models,
            meta: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        console.error('Failed to fetch vehicle models:', error);
        return NextResponse.json(
            { error: 'Failed to fetch vehicle models' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const model = await prisma.vehicle_models.create({
            data: {
                model_code: body.model_code,
                model_name: body.model_name,
                category: body.category,
                base_price: parseFloat(body.base_price),
                status: body.status || 'ACTIVE'
            }
        });
        
        return NextResponse.json(model, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create vehicle model:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create vehicle model' },
            { status: 400 }
        );
    }
}
