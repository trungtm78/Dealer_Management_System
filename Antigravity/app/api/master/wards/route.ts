import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';
        
        const where: any = {};
        
        if (search) {
            where.OR = [
                { ward_name: { contains: search } },
                { ward_code: { contains: search } }
            ];
        }
        
        if (status) {
            where.status = status;
        }
        
        const [total, wards] = await Promise.all([
            prisma.wards.count({ where }),
            prisma.wards.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);
        
        return NextResponse.json({
            data: wards,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Failed to fetch wards:', error);
        return NextResponse.json(
            { error: 'Failed to fetch wards' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const ward = await prisma.wards.create({
            data: {
                ward_code: body.ward_code,
                ward_name: body.ward_name,
                district_code: body.district_code,
                status: body.status || 'ACTIVE'
            }
        });
        
        return NextResponse.json(ward, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create ward:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create ward' },
            { status: 400 }
        );
    }
}
