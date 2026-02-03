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
                { position_name: { contains: search } },
                { position_code: { contains: search } }
            ];
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
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
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
