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

    const pdsChecklists = await prisma.pDSChecklist.findMany({
      where,
      include: {
        Contract: {
          select: {
            id: true,
            contract_number: true,
            customer_id: true
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
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(pdsChecklists)
  } catch (error) {
    console.error('Failed to fetch PDS checklists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PDS checklists' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contract_id, vin_id, exterior_check, interior_check, mechanical_check, documentation_check, photos, inspector_id, customer_signature, inspector_signature, delivery_date } = body

    const pdsChecklist = await prisma.pDSChecklist.create({
      data: {
        contract_id,
        vin_id,
        exterior_check: exterior_check ? JSON.stringify(exterior_check) : null,
        interior_check: interior_check ? JSON.stringify(interior_check) : null,
        mechanical_check: mechanical_check ? JSON.stringify(mechanical_check) : null,
        documentation_check: documentation_check ? JSON.stringify(documentation_check) : null,
        photos: photos ? JSON.stringify(photos) : null,
        inspector_id,
        customer_signature,
        inspector_signature,
        delivery_date: delivery_date ? new Date(delivery_date) : null
      },
      include: {
        Contract: {
          select: {
            id: true,
            contract_number: true,
            customer_id: true
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

    return NextResponse.json(pdsChecklist)
  } catch (error) {
    console.error('Failed to create PDS checklist:', error)
    return NextResponse.json(
      { error: 'Failed to create PDS checklist' },
      { status: 500 }
    )
  }
}