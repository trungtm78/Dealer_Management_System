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
    const bankId = searchParams.get('bank_id') || ''
    const termMonths = searchParams.get('term_months') || ''

    const where: any = {}
    
    if (search) {
      where.OR = [
        { rate_code: { contains: search, mode: 'insensitive' } },
        { rate_name: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    if (bankId) {
      where.bank_id = bankId
    }
    
    if (termMonths) {
      where.term_months = parseInt(termMonths)
    }

    const [total, interestRates] = await Promise.all([
      prisma.interest_rates.count({ where }),
      prisma.interest_rates.findMany({
        where,
        skip,
        take: limit,
        orderBy: { effective_from: 'desc', created_at: 'desc' }
      })
    ])

    return NextResponse.json({
      data: interestRates,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch interest rates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch interest rates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const interestRate = await prisma.interest_rates.create({
      data: {
        rate_code: body.rate_code,
        rate_name: body.rate_name,
        rate_type: body.rate_type || 'FIXED',
        rate_percent: body.rate_percent || body.interest_rate_percent,
        min_amount: body.min_amount,
        max_amount: body.max_amount,
        effective_from: body.effective_from || new Date().toISOString().split('T')[0],
        effective_to: body.effective_to,
        status: body.status || 'ACTIVE'
      }
    })

    return NextResponse.json(interestRate, { status: 201 })
  } catch (error) {
    console.error('Failed to create interest rate:', error)
    return NextResponse.json(
      { error: 'Failed to create interest rate' },
      { status: 400 }
    )
  }
}