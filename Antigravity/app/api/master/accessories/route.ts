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
                { accessory_name: { contains: search } },
                { accessory_code: { contains: search } }
            ];
        }
        
        const [total, accessories] = await Promise.all([
            prisma.accessories.count({ where }),
            prisma.accessories.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);
        
        return NextResponse.json({
            data: accessories,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Failed to fetch accessories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch accessories' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const accessory = await prisma.accessories.create({
            data: {
                accessory_code: body.accessory_code,
                accessory_name: body.accessory_name,
                category: body.category,
                price: parseFloat(body.price),
                installation_required: body.installation_required || false,
                warranty_period_months: body.warranty_period_months || 12,
                status: body.status || 'ACTIVE'
            }
        });
        
        return NextResponse.json(accessory, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create accessory:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create accessory' },
            { status: 400 }
        );
    }
}
