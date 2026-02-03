import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const search = searchParams.get('search') || ''
    const warehouseId = searchParams.get('warehouse_id') || ''
    const status = searchParams.get('status') || ''

    const where: any = {}
    
    if (search) {
      where.OR = [
        { location_code: { contains: search, mode: 'insensitive' } },
        { location_name: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (warehouseId) {
      where.warehouse_id = warehouseId
    }
    
    if (status) {
      where.status = status
    }

    const [total, partLocations] = await Promise.all([
      prisma.part_locations.count({ where }),
      prisma.part_locations.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])

    return NextResponse.json({
      data: partLocations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch part locations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch part locations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const partLocation = await prisma.part_locations.create({
      data: {
        id: `PL${Date.now()}`,
        location_code: body.location_code || `PL${Date.now()}`,
        location_name: body.location_name,
        warehouse_id: body.warehouse_id,
        bay_id: body.bay_id,
        shelf_id: body.shelf_id,
        description: body.description,
        status: body.status || 'ACTIVE',
        updated_at: new Date()
      }
    })
    
    return NextResponse.json(partLocation, { status: 201 })
  } catch (error) {
    console.error('Failed to create part location:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create part location'
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}