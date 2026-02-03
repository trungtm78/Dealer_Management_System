import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const name = searchParams.get('name') || ''
    const code = searchParams.get('code') || ''
    const status = searchParams.get('status') || ''

    const where: any = {}

    if (name) {
      where.name = { contains: name, mode: 'insensitive' }
    }

    if (code) {
      where.code = { contains: code, mode: 'insensitive' }
    }

    if (status) {
      where.status = status
    }

     const [total, suppliers] = await Promise.all([
       prisma.suppliers.count({ where }),
       prisma.suppliers.findMany({
         where,
         skip,
         take: limit,
         orderBy: { created_at: 'desc' }
       })
     ])

    return NextResponse.json({
      data: suppliers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch suppliers:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch suppliers'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = await prisma.supplier.create({
      data: body
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Failed to create Supplier:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create supplier'
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}