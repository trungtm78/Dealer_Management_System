import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roId = searchParams.get('ro_id')

    const where: any = {}
    if (roId) {
      where.ro_id = roId
    }

    const workLogs = await prisma.workLog.findMany({
      where,
      include: {
        RepairOrder: {
          select: {
            id: true,
            ro_number: true,
            customer_id: true
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

    return NextResponse.json(workLogs)
  } catch (error) {
    console.error('Failed to fetch work logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch work logs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ro_id, technician_id, work_description, hours_spent, status, photos, notes } = body

    const workLog = await prisma.workLog.create({
      data: {
        ro_id,
        technician_id,
        work_description,
        hours_spent,
        status,
        photos: photos ? JSON.stringify(photos) : null,
        notes
      },
      include: {
        RepairOrder: {
          select: {
            id: true,
            ro_number: true,
            customer_id: true
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

    return NextResponse.json(workLog)
  } catch (error) {
    console.error('Failed to create work log:', error)
    return NextResponse.json(
      { error: 'Failed to create work log' },
      { status: 500 }
    )
  }
}