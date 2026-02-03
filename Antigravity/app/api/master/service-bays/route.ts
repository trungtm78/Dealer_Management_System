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
                { bay_name: { contains: search } },
                { bay_code: { contains: search } }
            ];
        }
        
        const [total, bays] = await Promise.all([
            prisma.service_bays.count({ where }),
            prisma.service_bays.findMany({
                where,
                skip,
                take: limit,
                orderBy: { bay_name: 'asc' }
            })
        ]);
        
        return NextResponse.json({
            data: bays,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Failed to fetch service bays:', error);
        return NextResponse.json(
            { error: 'Failed to fetch service bays' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const bay = await prisma.service_bays.create({
            data: {
                bay_code: body.bay_code,
                bay_name: body.bay_name,
                bay_type: body.bay_type || 'GENERAL',
                capacity_vehicles: body.capacity_vehicles || 1,
                location: body.location,
                status: 'ACTIVE'
            }
        });
        
        return NextResponse.json(bay, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create service bay:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create service bay' },
            { status: 400 }
        );
    }
}
