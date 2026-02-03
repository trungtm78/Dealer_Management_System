import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    const where: any = {}
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } }
      ]
    }

    const reminders = await prisma.reminder.findMany({
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
      orderBy: { scheduled_date: 'asc' }
    })

    return NextResponse.json(reminders)
  } catch (error) {
    console.error('Failed to fetch reminders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reminders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_id, type, scheduled_date, message, channel } = body

    const reminder = await prisma.reminder.create({
      data: {
        customer_id,
        type,
        scheduled_date: new Date(scheduled_date),
        message,
        channel,
        status: 'PENDING'
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

    return NextResponse.json(reminder)
  } catch (error) {
    console.error('Failed to create reminder:', error)
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    )
  }
}