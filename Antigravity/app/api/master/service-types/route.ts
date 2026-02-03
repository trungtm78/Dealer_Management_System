import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const where: any = {}
    
    if (search) {
      where.OR = [
        { service_type_code: { contains: search, mode: 'insensitive' } },
        { service_type_name: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    }

    const [total, serviceTypes] = await Promise.all([
      prisma.service_types.count({ where }),
      prisma.service_types.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])

    return NextResponse.json({
      data: serviceTypes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch service types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service types' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const serviceType = await prisma.service_types.create({
      data: {
        service_type_code: body.service_type_code,
        service_type_name: body.service_type_name,
        category: body.category,
        default_duration_hours: body.default_duration_hours || 1.0,
        base_price: body.base_price,
        description: body.description,
        status: body.status || 'ACTIVE'
      }
    })
    
    return NextResponse.json(serviceType, { status: 201 })
  } catch (error) {
    console.error('Failed to create service type:', error)
    return NextResponse.json(
      { error: 'Failed to create service type' },
      { status: 400 }
    )
  }
}