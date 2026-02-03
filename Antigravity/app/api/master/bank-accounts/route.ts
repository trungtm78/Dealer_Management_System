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
        { bank_name: { contains: search, mode: 'insensitive' } },
        { branch_name: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    }

    const [total, bankAccounts] = await Promise.all([
      prisma.bank_accounts.count({ where }),
      prisma.bank_accounts.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])

    return NextResponse.json({
      data: bankAccounts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch bank accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bank accounts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const bankAccount = await prisma.bank_accounts.create({
      data: {
        account_code: body.account_code,
        account_name: body.account_name,
        bank_name: body.bank_name,
        account_number: body.account_number,
        branch_name: body.branch_name,
        account_type: body.account_type,
        currency: body.currency || 'VND',
        status: body.status || 'ACTIVE'
      }
    })
    
    return NextResponse.json(bankAccount, { status: 201 })
  } catch (error) {
    console.error('Failed to create bank account:', error)
    return NextResponse.json(
      { error: 'Failed to create bank account' },
      { status: 400 }
    )
  }
}