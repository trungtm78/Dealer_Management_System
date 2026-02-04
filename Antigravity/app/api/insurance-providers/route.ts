import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const forDropdown = searchParams.get('for_dropdown') === 'true';
        const status = searchParams.get('status') || 'ACTIVE';

        if (forDropdown) {
            const providers = await prisma.insurance_companies.findMany({
                where: { status },
                select: { id: true, company_name: true, status: true },
                orderBy: { company_name: 'asc' }
            });
            const dropdownData = providers.map(p => ({
                id: p.id,
                name: p.company_name,
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
                { company_code: { contains: search } },
                { company_name: { contains: search } }
            ];
        }

        const [total, providers] = await Promise.all([
            prisma.insurance_companies.count({ where }),
            prisma.insurance_companies.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);

        return NextResponse.json({
            data: providers,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Failed to fetch insurance providers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch insurance providers' },
            { status: 500 }
        );
    }
}
