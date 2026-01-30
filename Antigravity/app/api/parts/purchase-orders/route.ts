import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const supplierId = searchParams.get('supplier_id')
    const status = searchParams.get('status')

    const where: any = {}
    if (supplierId) {
      where.supplier_id = supplierId
    }
    if (status) {
      where.status = status
    }

    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where,
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            contact_person: true,
            phone: true
          }
        },
        lineItems: {
          include: {
            part: {
              select: {
                id: true,
                part_number: true,
                name: true,
                category: true
              }
            }
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(purchaseOrders)
  } catch (error) {
    console.error('Failed to fetch purchase orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchase orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      supplier_id, 
      order_date, 
      expected_delivery_date, 
      status, 
      notes, 
      items 
    } = body

    const year = new Date().getFullYear()
    const poNumber = `PO-${year}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    
    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        po_number: poNumber,
        supplier_id,
        order_date: new Date(order_date),
        expected_delivery_date: new Date(expected_delivery_date),
        status,
        notes,
        total_amount: 0,
        created_by_id: '1'
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            contact_person: true,
            phone: true
          }
        },
        lineItems: {
          include: {
            part: {
              select: {
                id: true,
                part_number: true,
                name: true,
                category: true
              }
            }
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(purchaseOrder)
  } catch (error) {
    console.error('Failed to create purchase order:', error)
    return NextResponse.json(
      { error: 'Failed to create purchase order' },
      { status: 500 }
    )
  }
}
