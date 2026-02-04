import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const forDropdown = searchParams.get('for_dropdown') === 'true';
        const status = searchParams.get('status') || 'ACTIVE';

        if (forDropdown) {
            const products = await prisma.insurance_products.findMany({
                where: { status },
                select: { id: true, product_name: true, status: true },
                orderBy: { product_name: 'asc' }
            });
            const dropdownData = products.map(p => ({
                id: p.id,
                name: p.product_name,
                status: p.status
            }));
            return NextResponse.json({ data: dropdownData });
        }

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;
        const search = searchParams.get('search') || '';

        const where: any = { status };

        if (search) {
            where.OR = [
                { product_code: { contains: search } },
                { product_name: { contains: search } }
            ];
        }

        const [total, products] = await Promise.all([
            prisma.insurance_products.count({ where }),
            prisma.insurance_products.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);

        return NextResponse.json({
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Failed to fetch insurance packages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch insurance packages' },
            { status: 500 }
        );
    }
}
