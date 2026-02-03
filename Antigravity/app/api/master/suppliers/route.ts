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
      where.name = { contains: name }
    }

    if (code) {
      where.code = { contains: code }
    }

    if (status) {
      where.status = status
    }

     const [total, suppliers] = await Promise.all([
       prisma.supplier.count({ where }),
       prisma.supplier.findMany({
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

    const { EntityValidators } = await import('@/lib/entity-validators');
    EntityValidators.suppliers(body);

    const result = await prisma.supplier.create({
      data: {
        code: body.code || `SUP${Date.now()}`,
        name: body.name,
        contact_person: body.contact_person,
        phone: body.phone,
        email: body.email,
        address: body.address,
        payment_terms: body.payment_terms,
        status: body.status || 'ACTIVE'
      }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create Supplier:', error)
    const errorMessage = error.message || 'Failed to create supplier'
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}