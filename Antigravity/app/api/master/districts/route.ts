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
    const provinceCode = searchParams.get('province_code') || ''

    const where: any = {}
    
    if (search) {
      where.OR = [
        { district_code: { contains: search, mode: 'insensitive' } },
        { district_name: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    if (provinceCode) {
      where.province_code = provinceCode
    }

    const [total, districts] = await Promise.all([
      prisma.districts.count({ where }),
      prisma.districts.findMany({
        where,
        skip,
        take: limit,
        orderBy: { district_name: 'asc' }
      })
    ])

    return NextResponse.json({
      data: districts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch districts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch districts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const district = await prisma.districts.create({
      data: {
        district_code: body.code,
        district_name: body.name,
        province_code: body.province_code,
        distance_from_showroom_km: body.distance_from_showroom_km,
        service_zone: body.service_zone,
        status: body.status || 'ACTIVE'
      }
    })
    
    return NextResponse.json(district, { status: 201 })
  } catch (error) {
    console.error('Failed to create district:', error)
    return NextResponse.json(
      { error: 'Failed to create district' },
      { status:  400 }
    )
  }
}