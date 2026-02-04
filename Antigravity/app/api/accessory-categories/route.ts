import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const forDropdown = searchParams.get('for_dropdown') === 'true';
        const status = searchParams.get('status') || 'ACTIVE';

        if (forDropdown) {
            const categories = await prisma.accessories.findMany({
                where: { status },
                select: { category: true },
                distinct: ['category'],
                orderBy: { category: 'asc' }
            });

            const dropdownData = categories.map((c, index) => ({
                id: `ACC-CAT-${index}`,
                name: c.category,
                status: status
            }));

            return NextResponse.json({ data: dropdownData });
        }

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;
        const search = searchParams.get('search') || '';

        const where: any = { status };

        if (search) {
            where.category = {
                contains: search
            };
        }

        const [total, categories] = await Promise.all([
            prisma.accessories.count({
                where: {
                    status,
                    ...(search && { category: { contains: search } })
                }
            }),
            prisma.accessories.findMany({
                where: {
                    status,
                    ...(search && { category: { contains: search } })
                },
                select: { category: true, id: true },
                distinct: ['category'],
                skip,
                take: limit,
                orderBy: { category: 'asc' }
            })
        ]);

        return NextResponse.json({
            data: categories.map(c => ({
                id: c.id,
                category: c.category
            })),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Failed to fetch accessory categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch accessory categories' },
            { status: 500 }
        );
    }
}
