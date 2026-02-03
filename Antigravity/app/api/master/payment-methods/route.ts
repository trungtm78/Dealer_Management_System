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
        { method_code: { contains: search, mode: 'insensitive' } },
        { method_name: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    }

    const [total, paymentMethods] = await Promise.all([
      prisma.payment_methods.count({ where }),
      prisma.payment_methods.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])

    return NextResponse.json({
      data: paymentMethods,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch payment methods:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const paymentMethod = await prisma.payment_methods.create({
      data: {
        method_code: body.method_code,
        method_name: body.method_name,
        method_type: body.method_type,
        description: body.description,
        processing_fee: body.processing_fee || 0,
        status: body.status || 'ACTIVE'
      }
    })
    
    return NextResponse.json(paymentMethod, { status: 201 })
  } catch (error) {
    console.error('Failed to create payment method:', error)
    return NextResponse.json(
      { error: 'Failed to create payment method' },
      { status: 400 }
    )
  }
}