import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const search = searchParams.get('name') || ''
    const status = searchParams.get('status') || ''
    
    const where: any = {}
    
    if (search) {
      where.OR = [
        { color_name: { contains: search, mode: 'insensitive' } },
        { color_code: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    const [total, vehicleColors] = await Promise.all([
      prisma.vehicle_colors.count({ where }),
      prisma.vehicle_colors.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])
    
    return NextResponse.json({
      data: vehicleColors,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch vehicle colors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle colors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const vehicleColor = await prisma.vehicle_colors.create({
      data: {
        id: `VC${Date.now()}`,
        color_code: body.color_code || `VC${Date.now()}`,
        color_name: body.color_name,
        hex_code: body.hex_code,
        status: body.status || 'ACTIVE',
        updated_at: new Date()
      }
    })
    
    return NextResponse.json(vehicleColor, { status: 201 })
  } catch (error) {
    console.error('Failed to create vehicle color:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create vehicle color'
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}
