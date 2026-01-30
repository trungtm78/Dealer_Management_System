import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')
    const status = searchParams.get('status')
    const invoiceType = searchParams.get('invoice_type')

    const where: any = {}
    if (customerId) {
      where.customer_id = customerId
    }
    if (status) {
      where.status = status
    }
    if (invoiceType) {
      where.invoice_type = invoiceType
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        },
        payments: true,
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

    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Failed to fetch invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      customer_id, 
      invoice_date, 
      due_date, 
      invoice_type, 
      status, 
      items 
    } = body

// Simplified invoice creation - items will need to be handled separately
    const year = new Date().getFullYear()
    const invoiceNumber = `INV-${year}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    
    const invoice = await prisma.invoice.create({
      data: {
        invoice_number: invoiceNumber,
        customer_id,
        invoice_date: new Date(invoice_date),
        due_date: new Date(due_date),
        invoice_type,
        status,
        sub_total: 0,
        vat: 0,
        total_amount: 0,
        created_by_id: '1'
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        },
        payments: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Failed to create invoice:', error)
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
