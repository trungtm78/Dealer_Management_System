import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { EntityValidators } from '@/lib/entity-validators'

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
        { warehouse_name: { contains: search } },
        { warehouse_code: { contains: search } }
      ]
    }

    // Fix: handle boolean status properly
    if (status) {
      where.is_active = status === 'ACTIVE'
    }

    const [total, warehouses] = await Promise.all([
      prisma.warehouses.count({ where }),
      prisma.warehouses.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])

    return NextResponse.json({
      data: warehouses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch warehouses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch warehouses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.warehouse_name) {
      return NextResponse.json(
        { error: 'warehouse_name is required' },
        { status: 400 }
      )
    }

    // Check for duplicate warehouse_name
    const existingByName = await prisma.warehouses.findFirst({
      where: { warehouse_name: body.warehouse_name }
    })

    if (existingByName) {
      return NextResponse.json(
        { error: `Warehouse name "${body.warehouse_name}" already exists` },
        { status: 400 }
      )
    }

    // Check for duplicate warehouse_code if provided
    if (body.warehouse_code) {
      const existingByCode = await prisma.warehouses.findFirst({
        where: { warehouse_code: body.warehouse_code }
      })

      if (existingByCode) {
        return NextResponse.json(
          { error: `Warehouse code "${body.warehouse_code}" already exists` },
          { status: 400 }
        )
      }
    }

    const warehouse = await prisma.warehouses.create({
      data: {
        warehouse_code: body.warehouse_code || `WH${Date.now()}`,
        warehouse_name: body.warehouse_name,
        location_address: body.location_address,
        manager_id: body.manager_id,
        is_active: body.is_active !== undefined ? body.is_active : true,
        updated_at: new Date()
      }
    })

    return NextResponse.json(warehouse, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create warehouse:', error)

    // Handle Prisma UNIQUE constraint violation
    if (error.code === 'P2002') {
      const target = error.meta?.target || []
      const field = target[0] || 'field'
      return NextResponse.json(
        { error: `${field} already exists. Please use a different value.` },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to create warehouse'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

