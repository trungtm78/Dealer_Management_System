 import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { EntityValidators } from '@/lib/entity-validators'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const partNumber = searchParams.get('part_number')
    const category = searchParams.get('category')
    const supplierId = searchParams.get('supplier_id')

    const where: any = {}
    if (partNumber) {
      where.part_number = { contains: partNumber }
    }
    if (category) {
      where.category = category
    }
    if (supplierId) {
      where.supplier_id = supplierId
    }

    const parts = await prisma.part.findMany({
      where,
      include: {
        Supplier: {
          select: {
            id: true,
            name: true,
            contact_person: true,
            phone: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(parts)
  } catch (error) {
    console.error('Failed to fetch parts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch parts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      part_number,
      name,
      description,
      category,
      unit_price,
      stock_quantity,
      minimum_stock,
      supplier_id
    } = body

    EntityValidators.parts({
      part_number,
      name,
      unit_price,
      stock_quantity,
      minimum_stock
    })

    const part = await prisma.part.create({
      data: {
        part_number,
        name,
        description,
        category,
        quantity: parseInt(stock_quantity),
        min_stock: parseInt(minimum_stock),
        unit_price: parseFloat(unit_price),
        cost_price: parseFloat(unit_price) * 0.7,
        supplier_id
      },
      include: {
        Supplier: {
          select: {
            id: true,
            name: true,
            contact_person: true,
            phone: true
          }
        }
      }
    })

    return NextResponse.json(part)
  } catch (error: any) {
    console.error('Failed to create part:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create part' },
      { status: error.name === 'ValidationError' ? 400 : 500 }
    )
  }
}
