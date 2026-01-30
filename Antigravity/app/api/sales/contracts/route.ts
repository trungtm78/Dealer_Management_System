import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {}
    if (status) {
      where.status = status
    }

    const contracts = await prisma.contract.findMany({
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
        quotation: {
          select: {
            id: true,
            quote_number: true,
            model: true,
            version: true,
            color: true,
            total_price: true
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
      orderBy: { contract_date: 'desc' }
    })

    return NextResponse.json(contracts)
  } catch (error) {
    console.error('Failed to fetch contracts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quotation_id, customer_id, vin_id, total_amount, deposit_amount, payment_method, contract_date, delivery_date, created_by_id } = body

    const year = new Date().getFullYear()
    const contractNumber = `CON-${year}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    
    const contract = await prisma.contract.create({
      data: {
        contract_number: contractNumber,
        quotation_id,
        customer_id,
        vin_id,
        total_amount,
        deposit_amount,
        remaining_amount: total_amount - deposit_amount,
        payment_method,
        contract_date: new Date(contract_date),
        delivery_date: delivery_date ? new Date(delivery_date) : null,
        created_by_id,
        status: 'ACTIVE'
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
        quotation: {
          select: {
            id: true,
            quote_number: true,
            model: true,
            version: true,
            color: true,
            total_price: true
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

    return NextResponse.json(contract)
  } catch (error) {
    console.error('Failed to create contract:', error)
    return NextResponse.json(
      { error: 'Failed to create contract' },
      { status: 500 }
    )
  }
}