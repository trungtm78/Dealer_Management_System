import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')?.split(',').filter(Boolean)
    const requires_parts = searchParams.get('requires_parts')
    const status = searchParams.get('status') || 'ACTIVE'
    const min_price = searchParams.get('min_price')
    const max_price = searchParams.get('max_price')
    const min_duration = searchParams.get('min_duration')
    const max_duration = searchParams.get('max_duration')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const sort = searchParams.get('sort') || 'created_at:desc'

    const where: any = {}
    if (search) {
      where.OR = [
        { service_name: { contains: search } },
        { service_code: { contains: search } }
      ]
    }
    if (category && category.length > 0) {
      where.category = { in: category }
    }
    if (requires_parts !== null) {
      where.requiresParts = requires_parts === '"ACTIVE"'
    }
    if (status !== 'ALL') {
      where.status = status
    }
    if (min_price) {
      where.basePrice = { gte: parseFloat(min_price) }
    }
    if (max_price) {
      where.basePrice = { ...where.basePrice, lte: parseFloat(max_price) }
    }
    if (min_duration) {
      where.durationHours = { gte: parseFloat(min_duration) }
    }
    if (max_duration) {
      where.durationHours = { ...where.durationHours, lte: parseFloat(max_duration) }
    }

    const [sortField, sortOrder] = sort.split(':')
    const orderBy = { [sortField]: sortOrder === 'desc' ? 'desc' : 'asc' }

    const skip = (page - 1) * limit

    const [services, total] = await Promise.all([
      prisma.service_catalogs.findMany({
        where,
        orderBy,
        skip,
        take: limit
      }),
      prisma.service_catalogs.count({ where })
    ])

    return NextResponse.json({
      data: services,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
      }
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

    // Check for duplicate service_name
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

    // Generate service code
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