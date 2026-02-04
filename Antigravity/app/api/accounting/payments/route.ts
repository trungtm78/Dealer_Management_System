import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
    const skip = calculateSkip(page, limit);

    const where: any = {
      ...buildSearchWhereClause(search, ["payment_number", "reference_number"]),
    };

    if (filters.customer_id) {
      where.customer_id = filters.customer_id
    }

    if (filters.invoice_id) {
      where.invoice_id = filters.invoice_id
    }

    if (filters.payment_method) {
      where.payment_method = filters.payment_method
    }

    const [total, payments] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        where,
        include: {
          Invoice: {
            select: {
              id: true,
              invoice_number: true,
              invoice_date: true,
              total_amount: true
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
        orderBy: { payment_date: 'desc' }
      })
    ])

    return NextResponse.json({
      data: payments,
      meta: buildPaginationMeta(total, page, limit)
    })
  } catch (error) {
    console.error('Failed to fetch payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customer_id,
      invoice_id,
      payment_date,
      amount,
      payment_method,
      reference_number,
      notes
    } = body

    const paymentDate = new Date(payment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (paymentDate > today) {
      return NextResponse.json(
        { error: 'Ngày thanh toán không thể ở tương lai' },
        { status: 400 }
      )
    }

    if (parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: 'Số tiền thanh toán phải lớn hơn 0' },
        { status: 400 }
      )
    }

    const year = new Date().getFullYear()
    const paymentNumber = `PAY-${year}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`

    const payment = await prisma.payment.create({
      data: {
        payment_number: paymentNumber,
        invoice_id,
        payment_date: paymentDate,
        amount: parseFloat(amount),
        payment_method,
        reference_number,
        notes,
        received_by_id: '1'
      },
      include: {
        Invoice: {
          select: {
            id: true,
            invoice_number: true,
            invoice_date: true,
            total_amount: true
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

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('Failed to create payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
