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

    const qcChecklists = await prisma.qCChecklist.findMany({
      where,
      include: {
        repairOrder: {
          select: {
            id: true,
            ro_number: true,
            customer_id: true
          }
        },
        qcBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(qcChecklists)
  } catch (error) {
    console.error('Failed to fetch QC checklists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch QC checklists' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ro_id, checklist_items, photos, qc_result, qc_by_id, rework_notes } = body

    const qcChecklist = await prisma.qCChecklist.create({
      data: {
        ro_id,
        checklist_items: JSON.stringify(checklist_items),
        photos: photos ? JSON.stringify(photos) : null,
        qc_result,
        qc_by_id,
        rework_notes
      },
      include: {
        repairOrder: {
          select: {
            id: true,
            ro_number: true,
            customer_id: true
          }
        },
        qcBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(qcChecklist)
  } catch (error) {
    console.error('Failed to create QC checklist:', error)
    return NextResponse.json(
      { error: 'Failed to create QC checklist' },
      { status: 500 }
    )
  }
}