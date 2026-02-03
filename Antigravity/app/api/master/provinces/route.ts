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
        { province_name: { contains: search, mode: 'insensitive' } },
        { province_code: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    const [total, provinces] = await Promise.all([
      prisma.provinces.count({ where }),
      prisma.provinces.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])
    
    return NextResponse.json({
      data: provinces,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch provinces:', error)
    return NextResponse.json(
      { error: 'Failed to fetch provinces' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const province = await prisma.provinces.create({
      data: {
        id: `PR${Date.now()}`,
        province_code: body.province_code || `PR${Date.now()}`,
        province_name: body.province_name,
        status: body.status || 'ACTIVE',
        updated_at: new Date()
      }
    })
    
    return NextResponse.json(province, { status: 201 })
  } catch (error) {
    console.error('Failed to create province:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create province'
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}
