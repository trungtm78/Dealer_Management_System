import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
    const skip = calculateSkip(page, limit);

    const where: any = {
      ...buildSearchWhereClause(search, ["po_number"]),
    };

    if (filters.supplier_id) {
      where.supplier_id = filters.supplier_id
    }

    if (filters.status) {
      where.status = filters.status
    }

    const [total, purchaseOrders] = await Promise.all([
      prisma.purchaseOrder.count({ where }),
      prisma.purchaseOrder.findMany({
        where,
        include: {
          Supplier: {
            select: {
              id: true,
              name: true,
              contact_person: true,
              phone: true
            }
          },
          POLineItem: {
            include: {
              Part: {
                select: {
                  id: true,
                  part_number: true,
                  name: true,
                  category: true
                }
              }
            }
          },
          User: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])

    return NextResponse.json({
      data: purchaseOrders,
      meta: buildPaginationMeta(total, page, limit)
    })
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
        Supplier: {
          select: {
            id: true,
            name: true,
            contact_person: true,
            phone: true
          }
        },
        POLineItem: {
          include: {
            Part: {
              select: {
                id: true,
                part_number: true,
                name: true,
                category: true
              }
            }
          }
        },
        User: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(purchaseOrder, { status: 201 })
  } catch (error) {
    console.error('Failed to create purchase order:', error)
    return NextResponse.json(
      { error: 'Failed to create purchase order' },
      { status: 500 }
    )
  }
}
