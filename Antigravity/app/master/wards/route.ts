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
    const districtCode = searchParams.get('district_code') || ''
    
    const where: any = {}
    
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    if (districtCode) {
      where.district_code = districtCode
    }
    
    const [total, wards] = await Promise.all([
      prisma.wards.count({ where }),
      prisma.wards.findMany({
        where,
        skip,
        take: limit,
        orderBy: { ward_name: 'asc' }
      })
    ])
    
    return NextResponse.json({
      data: wards,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch wards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wards' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const ward = await prisma.wards.create({
      data: {
        ward_code: body.ward_code,
        ward_name: body.ward_name,
        district_code: body.district_code,
        postal_code: body.postal_code,
        status: body.status || 'ACTIVE'
      }
    })

    return NextResponse.json(ward, { status: 201 })
  } catch (error) {
    console.error('Failed to create ward:', error)
    return NextResponse.json(
      { error: 'Failed to create ward' },
      { status: 400 }
    )
  }
}
