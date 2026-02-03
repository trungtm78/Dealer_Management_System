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

    const complaints = await prisma.complaint.findMany({
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

    return NextResponse.json(complaints)
  } catch (error) {
    console.error('Failed to fetch complaints:', error)
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_id, category, priority, description, assigned_to_id } = body

    const complaint = await prisma.complaint.create({
      data: {
        customer_id,
        category,
        priority,
        description,
        assigned_to_id,
        status: 'NEW'
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

    return NextResponse.json(complaint)
  } catch (error) {
    console.error('Failed to create complaint:', error)
    return NextResponse.json(
      { error: 'Failed to create complaint' },
      { status: 500 }
    )
  }
}