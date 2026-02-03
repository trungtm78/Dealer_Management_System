import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

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
        { account_code: { contains: search, mode: 'insensitive' } },
        { account_name: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    }

    const [total, accountCodes] = await Promise.all([
      prisma.account_codes.count({ where }),
      prisma.account_codes.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])

    return NextResponse.json({
      data: accountCodes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch account codes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch account codes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const accountCode = await prisma.account_codes.create({
      data: {
        account_code: body.account_code,
        account_name: body.account_name,
        account_type: body.account_type,
        parent_code: body.parent_code || null,
        description: body.description,
        status: body.status || 'ACTIVE'
      }
    })
    
    return NextResponse.json(accountCode, { status: 201 })
  } catch (error) {
    console.error('Failed to create account code:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create account code'
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}