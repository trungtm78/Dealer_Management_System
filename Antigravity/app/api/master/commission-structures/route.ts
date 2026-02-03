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
        { commission_code: { contains: search, mode: 'insensitive' } },
        { commission_name: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    }

    const [total, commissionStructures] = await Promise.all([
      prisma.commission_structures.count({ where }),
      prisma.commission_structures.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])

    return NextResponse.json({
      data: commissionStructures,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch commission structures:', error)
    return NextResponse.json(
      { error: 'Failed to fetch commission structures' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const commissionStructure = await prisma.commission_structures.create({
      data: {
        commission_code: body.commission_code,
        commission_name: body.commission_name,
        type: body.type,
        role_id: body.role_id,
        target: body.target,
        rate_percent: body.rate_percent,
        applicable_products: body.applicable_products,
        status: body.status || 'ACTIVE'
      }
    })
    
    return NextResponse.json(commissionStructure, { status: 201 })
  } catch (error) {
    console.error('Failed to create commission structure:', error)
    return NextResponse.json(
      { error: 'Failed to create commission structure' },
      { status: 400 }
    )
  }
}