import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')

    const where: any = {}
    if (customerId) {
      where.customer_id = customerId
    }

    const transactions = await prisma.loyaltyTransaction.findMany({
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
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Failed to fetch loyalty transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch loyalty transactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_id, points, type, reason, reference_id } = body

    const transaction = await prisma.$transaction(async (tx) => {
      const loyaltyTransaction = await tx.loyaltyTransaction.create({
        data: {
          customer_id,
          points,
          type,
          reason,
          reference_id
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

      await tx.customer.update({
        where: { id: customer_id },
        data: {
          points: {
            increment: points
          },
          total_points: {
            increment: points
          }
        }
      })

      return loyaltyTransaction
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Failed to create loyalty transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create loyalty transaction' },
      { status: 500 }
    )
  }
}