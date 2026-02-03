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
        { tax_code: { contains: search, mode: 'insensitive' } },
        { tax_name: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status) {
      where.status = status
    }

    const [total, taxRates] = await Promise.all([
      prisma.tax_rates.count({ where }),
      prisma.tax_rates.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])

    return NextResponse.json({
      data: taxRates,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch tax rates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tax rates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const taxRate = await prisma.tax_rates.create({
      data: {
        tax_code: body.tax_code,
        tax_name: body.tax_name,
        tax_type: body.tax_type,
        rate_percent: body.rate_percent,
        effective_from: body.effective_from,
        effective_to: body.effective_to,
        description: body.description,
        status: body.status || 'ACTIVE'
      }
    })
    
    return NextResponse.json(taxRate, { status: 201 })
  } catch (error) {
    console.error('Failed to create tax rate:', error)
    return NextResponse.json(
      { error: 'Failed to create tax rate' },
      { status: 400 }
    )
  }
}