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
        { holiday_name: { contains: search, mode: 'insensitive' } },
        { holiday_code: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    const [total, holidays] = await Promise.all([
      prisma.holidays.count({ where }),
      prisma.holidays.findMany({
        where,
        skip,
        take: limit,
        orderBy: { holiday_date: 'asc' }
      })
    ])
    
    return NextResponse.json({
      data: holidays,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch holidays:', error)
    return NextResponse.json(
      { error: 'Failed to fetch holidays' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const holiday = await prisma.holidays.create({
      data: {
        id: `HD${Date.now()}`,
        holiday_code: body.holiday_code || `HD${Date.now()}`,
        holiday_name: body.holiday_name,
        holiday_date: body.holiday_date,
        is_recurring: body.is_recurring || "INACTIVE",
        status: body.status || 'ACTIVE',
        updated_at: new Date()
      }
    })
    
    return NextResponse.json(holiday, { status: 201 })
  } catch (error) {
    console.error('Failed to create holiday:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create holiday'
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}
