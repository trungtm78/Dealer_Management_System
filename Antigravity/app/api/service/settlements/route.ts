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

    const settlements = await prisma.serviceAppointment.findMany({
      where: {
        ...where,
        status: 'COMPLETED'
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
        },
        RepairOrder: {
          include: {
            ROLineItem: true,
            WorkLog: true
          }
        }
      },
      orderBy: { updated_at: 'desc' }
    })

    return NextResponse.json(settlements)
  } catch (error) {
    console.error('Failed to fetch service settlements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service settlements' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { appointment_id, total_amount, payment_method, notes } = body

    const appointment = await prisma.serviceAppointment.update({
      where: { id: appointment_id },
      data: {
        status: 'COMPLETED'
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
        },
        RepairOrder: {
          include: {
            ROLineItem: true,
            WorkLog: true
          }
        }
      }
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Failed to create service settlement:', error)
    return NextResponse.json(
      { error: 'Failed to create service settlement' },
      { status: 500 }
    )
  }
}