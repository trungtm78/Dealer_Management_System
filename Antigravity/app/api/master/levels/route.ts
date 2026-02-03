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
                { level_name: { contains: search } },
                { level_code: { contains: search } }
            ];
        }
        
        const [total, levels] = await Promise.all([
            prisma.master_levels.count({ where }),
            prisma.master_levels.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);
        
        return NextResponse.json({
            data: levels,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Failed to fetch levels:', error);
        return NextResponse.json(
            { error: 'Failed to fetch levels' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const level = await prisma.master_levels.create({
            data: {
                level_code: body.level_code,
                level_name: body.level_name,
                status: body.status || 'ACTIVE'
            }
        });
        
        return NextResponse.json(level, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create level:', error);
        return NextResponse.json(JSON.stringify({ error: error.message || 'Failed to create level' }), { status: 400 });
    }
}
