import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
    const skip = calculateSkip(page, limit);

    const where: any = {
      ...buildSearchWhereClause(search, ["service_name", "service_code"]),
    };

    if (filters.category) {
      const categories = filters.category ? filters.category.split(',').filter(Boolean) : [];
      if (categories.length > 0) {
        where.category = { in: categories }
      }
    }

    if (filters.requires_parts !== undefined && filters.requires_parts !== null) {
      where.requiresParts = filters.requires_parts === 'ACTIVE' || filters.requires_parts === 'true';
    }

    if (filters.status && filters.status !== 'ALL') {
      where.status = filters.status
    }

    if (filters.min_price) {
      where.basePrice = { gte: parseFloat(filters.min_price) }
    }

    if (filters.max_price) {
      where.basePrice = { ...where.basePrice, lte: parseFloat(filters.max_price) }
    }

    if (filters.min_duration) {
      where.durationHours = { gte: parseFloat(filters.min_duration) }
    }

    if (filters.max_duration) {
      where.durationHours = { ...where.durationHours, lte: parseFloat(filters.max_duration) }
    }

    const [total, services] = await Promise.all([
      prisma.service_catalogs.count({ where }),
      prisma.service_catalogs.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])

    return NextResponse.json({
      data: services,
      meta: buildPaginationMeta(total, page, limit)
    })
  } catch (error) {
    console.error('Failed to fetch service catalogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service catalogs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      service_name,
      category,
      duration_hours = 1.0,
      base_price,
      requires_parts = "INACTIVE"
    } = body

    const existingService = await prisma.service_catalogs.findFirst({
      where: {
        service_name: {
          equals: service_name
        }
      }
    })

    if (existingService) {
      return NextResponse.json(
        { error: 'Service name already exists' },
        { status: 409 }
      )
    }

    const count = await prisma.service_catalogs.count()
    const serviceCode = `SVC/2026/${String(count + 1).padStart(3, '0')}`

    const service = await prisma.service_catalogs.create({
      data: {
        service_code: serviceCode,
        service_name,
        category,
        duration_hours: parseFloat(duration_hours),
        base_price: parseFloat(base_price),
        requires_parts: requires_parts
      }
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Failed to create service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
