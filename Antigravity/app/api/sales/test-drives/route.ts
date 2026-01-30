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

    const testDrives = await prisma.testDrive.findMany({
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
        salesConsultant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { scheduled_date: 'asc' }
    })

    return NextResponse.json(testDrives)
  } catch (error) {
    console.error('Failed to fetch test drives:', error)
    return NextResponse.json(
      { error: 'Failed to fetch test drives' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_id, model, scheduled_date, scheduled_time, sales_consultant_id, feedback } = body

    const testDrive = await prisma.testDrive.create({
      data: {
        customer_id,
        model,
        scheduled_date: new Date(scheduled_date),
        scheduled_time,
        sales_consultant_id,
        feedback,
        status: 'SCHEDULED'
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
        salesConsultant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(testDrive)
  } catch (error) {
    console.error('Failed to create test drive:', error)
    return NextResponse.json(
      { error: 'Failed to create test drive' },
      { status: 500 }
    )
  }
}