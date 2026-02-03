import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;
        const search = searchParams.get('search') || '';
        
        const where: any = {};
        
        if (search) {
            where.OR = [
                { model_name: { contains: search } },
                { model_code: { contains: search } }
            ];
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
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
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
