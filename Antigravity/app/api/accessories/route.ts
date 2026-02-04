import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const forDropdown = searchParams.get('for_dropdown') === 'true';
    const status = searchParams.get('status') || 'ACTIVE';

    if (forDropdown) {
      const accessories = await prisma.accessories.findMany({
        where: { status },
        select: { id: true, accessory_name: true, status: true },
        orderBy: { accessory_name: 'asc' }
      });
      const dropdownData = accessories.map(a => ({
        id: a.id,
        name: a.accessory_name,
        status: a.status
      }));
      return NextResponse.json({ data: dropdownData });
    }

    const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
    const skip = calculateSkip(page, limit);

    const where: any = {
      ...buildSearchWhereClause(search, ["accessory_name", "accessory_code"]),
    };

    if (filters.category) {
      where.category = filters.category
    }

    if (filters.compatible_model) {
      where.compatible_models = { has: filters.compatible_model }
    }

    const [total, accessories] = await Promise.all([
      prisma.accessories.count({ where }),
      prisma.accessories.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])

    return NextResponse.json({
      data: accessories,
      meta: buildPaginationMeta(total, page, limit)
    })
  } catch (error) {
    console.error('Failed to fetch accessories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accessories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      category,
      price,
      compatible_models,
      installation_required,
      warranty_period_months
    } = body

    const accessory = await prisma.accessories.create({
      data: {
        accessory_code: `ACC-${Date.now()}`,
        accessory_name: name,
        category: category || '',
        price: parseFloat(price)
      }
    })

    return NextResponse.json(accessory, { status: 201 })
  } catch (error) {
    console.error('Failed to create accessory:', error)
    return NextResponse.json(
      { error: 'Failed to create accessory' },
      { status: 500 }
    )
  }
}
