import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const forDropdown = searchParams.get('for_dropdown') === 'true';
        const status = searchParams.get('status') || 'ACTIVE';

        if (forDropdown) {
            const catalogs = await prisma.service_catalogs.findMany({
                where: { status },
                select: { id: true, service_name: true, status: true },
                orderBy: { service_name: 'asc' }
            });
            const dropdownData = catalogs.map(c => ({
                id: c.id,
                name: c.service_name,
                status: c.status
            }));
            return NextResponse.json({ data: dropdownData });
        }

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;
        const search = searchParams.get('search') || '';

        const where: any = {};

        if (search) {
            where.OR = [
                { service_name: { contains: search } },
                { service_code: { contains: search } }
            ];
        }

        const [total, catalogs] = await Promise.all([
            prisma.service_catalogs.count({ where }),
            prisma.service_catalogs.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);

        return NextResponse.json({
            data: catalogs,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Failed to fetch service catalogs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch service catalogs' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const catalog = await prisma.service_catalogs.create({
            data: {
                service_code: body.service_code,
                service_name: body.service_name,
                category: body.category,
                duration_hours: parseFloat(body.duration_hours) || 1.0,
                base_price: parseFloat(body.base_price),
                requires_parts: body.requires_parts || false,
                status: body.status || 'ACTIVE'
            }
        });
        
        return NextResponse.json(catalog, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create service catalog:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create service catalog' },
            { status: 400 }
        );
    }
}
