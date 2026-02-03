import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get('appointment_id')

    const where: any = {}
    if (appointmentId) {
      where.appointment_id = appointmentId
    }

    const quotes = await prisma.serviceQuote.findMany({
      where,
      include: {
        Customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
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
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(quotes)
  } catch (error) {
    console.error('Failed to fetch service quotes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service quotes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_id, vehicle_info, services, parts, total_labor, total_parts, sub_total, vat, total_amount, advisor_id, expiry_date, notes } = body

    // Generate quote number
    const count = await prisma.serviceQuote.count()
    const quoteNumber = `SQ/2026/${String(count + 1).padStart(3, '0')}`

    const quote = await prisma.serviceQuote.create({
      data: {
        quote_number: quoteNumber,
        customer_id,
        vehicle_info: JSON.stringify(vehicle_info),
        services: JSON.stringify(services),
        parts: JSON.stringify(parts),
        total_labor,
        total_parts,
        sub_total,
        vat,
        total_amount,
        advisor_id,
        expiry_date: new Date(expiry_date),
        notes,
        status: 'DRAFT'
      },
      include: {
        Customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
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

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Failed to create service quote:', error)
    return NextResponse.json(
      { error: 'Failed to create service quote' },
      { status: 500 }
    )
  }
}