import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const forDropdown = searchParams.get('for_dropdown') === 'true';
    const status = searchParams.get('status') || 'ACTIVE';

    if (forDropdown) {
      const invoices = await prisma.invoice.findMany({
        where: { status },
        select: { id: true, invoice_number: true, status: true },
        orderBy: { invoice_number: 'asc' }
      });
      const dropdownData = invoices.map(i => ({
        id: i.id,
        name: i.invoice_number,
        status: i.status
      }));
      return NextResponse.json({ data: dropdownData });
    }

    const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
    const skip = calculateSkip(page, limit);

    const where: any = {
      ...buildSearchWhereClause(search, ["invoice_number"]),
    };

    if (filters.customer_id) {
      where.customer_id = filters.customer_id
    }

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.invoice_type) {
      where.invoice_type = filters.invoice_type
    }

    const [total, invoices] = await Promise.all([
      prisma.invoice.count({ where }),
      prisma.invoice.findMany({
        where,
        include: {
          Customer: {
            select: {
              id: true,
              name: true,
              phone: true,
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
      data: invoices,
      meta: buildPaginationMeta(total, page, limit)
    })
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
      sub_total,
      vat,
      total_amount,
      items
    } = body

    if (total_amount !== undefined && total_amount <= 0) {
      return NextResponse.json(
        { error: 'Invoice amount must be positive' },
        { status: 400 }
      )
    }
    if (sub_total !== undefined && sub_total < 0) {
      return NextResponse.json(
        { error: 'Invoice sub_total cannot be negative' },
        { status: 400 }
      )
    }
    if (vat !== undefined && vat < 0) {
      return NextResponse.json(
        { error: 'Invoice VAT cannot be negative' },
        { status: 400 }
      )
    }

    const year = new Date().getFullYear()
    const invoiceNumber = `INV-${year}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    const userId = 'system'

    const invoice = await prisma.invoice.create({
      data: {
        invoice_number: invoiceNumber,
        customer_id,
        invoice_date: new Date(invoice_date),
        due_date: new Date(due_date),
        invoice_type,
        status,
        sub_total: sub_total || 0,
        vat: vat || 0,
        total_amount: total_amount || 0,
        created_by_id: userId
      },
      include: {
        Customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('Failed to create invoice:', error)
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
