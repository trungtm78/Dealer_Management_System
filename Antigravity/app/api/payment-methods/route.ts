import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const forDropdown = searchParams.get('for_dropdown') === 'true';
    const status = searchParams.get('status') || 'ACTIVE';

    if (forDropdown) {
      const paymentMethods = await prisma.payment_methods.findMany({
        where: { status },
        select: { id: true, method_name: true, status: true },
        orderBy: { method_name: 'asc' }
      });
      const dropdownData = paymentMethods.map(pm => ({
        id: pm.id,
        name: pm.method_name,
        status: pm.status
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
        { method_code: { contains: search } },
        { method_name: { contains: search } }
      ];
    }

    const [total, paymentMethods] = await Promise.all([
      prisma.payment_methods.count({ where }),
      prisma.payment_methods.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ]);

    return NextResponse.json({
      data: paymentMethods,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Failed to fetch payment methods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}
