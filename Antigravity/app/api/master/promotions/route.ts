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
    const type = searchParams.get('type') || ''

    const where: any = {}
    
    if (search) {
      where.OR = [
        { promotion_code: { contains: search, mode: 'insensitive' } },
        { promotion_name: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    if (type) {
      where.type = type
    }

    const [total, promotions] = await Promise.all([
      prisma.promotions.count({ where }),
      prisma.promotions.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])

    return NextResponse.json({
      data: promotions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch promotions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const promotion = await prisma.promotions.create({
      data: {
        promotion_code: body.promotion_code,
        promotion_name: body.promotion_name,
        promotion_type: body.promotion_type,
        start_date: new Date(body.start_date),
        end_date: new Date(body.end_date),
        discount_percent: body.discount_percent,
        discount_amount: body.discount_amount,
        min_purchase_amount: body.min_purchase_amount,
        max_discount_amount: body.max_discount_amount,
        description: body.description,
        status: body.status || 'ACTIVE'
      }
    })
    
    return NextResponse.json(promotion, { status: 201 })
  } catch (error) {
    console.error('Failed to create promotion:', error)
    return NextResponse.json(
      { error: 'Failed to create promotion' },
      { status: 400 }
    )
  }
}