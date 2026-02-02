import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')
    const invoiceId = searchParams.get('invoice_id')
    const paymentMethod = searchParams.get('payment_method')

    const where: any = {}
    if (customerId) {
      where.customer_id = customerId
    }
    if (invoiceId) {
      where.invoice_id = invoiceId
    }
    if (paymentMethod) {
      where.payment_method = paymentMethod
    }

    const payments = await prisma.payment.findMany({
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
      orderBy: { payment_date: 'desc' }
    })

    return NextResponse.json(payments)
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

    return NextResponse.json(payment)
  } catch (error) {
    console.error('Failed to create payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
