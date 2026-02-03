import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contractId = searchParams.get('contract_id')

    const where: any = {}
    if (contractId) {
      where.contract_id = contractId
    }

    const deliveries = await prisma.contract.findMany({
      where: {
        ...where,
        delivery_date: { not: null }
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
        Quotation: {
          select: {
            id: true,
            quote_number: true,
            model: true,
            version: true,
            color: true
          }
        },
        Vin: {
          select: {
            id: true,
            vin_number: true,
            model: true,
            version: true,
            color: true
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
      orderBy: { delivery_date: 'desc' }
    })

    return NextResponse.json(deliveries)
  } catch (error) {
    console.error('Failed to fetch deliveries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deliveries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contract_id, delivery_date } = body

    const delivery = await prisma.contract.update({
      where: { id: contract_id },
      data: {
        delivery_date: delivery_date ? new Date(delivery_date) : null
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
        Quotation: {
          select: {
            id: true,
            quote_number: true,
            model: true,
            version: true,
            color: true
          }
        },
        Vin: {
          select: {
            id: true,
            vin_number: true,
            model: true,
            version: true,
            color: true
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

    return NextResponse.json(delivery)
  } catch (error) {
    console.error('Failed to update delivery:', error)
    return NextResponse.json(
      { error: 'Failed to update delivery' },
      { status: 500 }
    )
  }
}