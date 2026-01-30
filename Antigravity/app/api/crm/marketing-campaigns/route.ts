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

    const campaigns = await prisma.marketingCampaign.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error('Failed to fetch marketing campaigns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch marketing campaigns' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, type, target_segment, budget, start_date, end_date, created_by_id } = body

    const campaign = await prisma.marketingCampaign.create({
      data: {
        name,
        description,
        type,
        target_segment: target_segment ? JSON.stringify(target_segment) : null,
        budget,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        created_by_id,
        status: 'DRAFT'
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Failed to create marketing campaign:', error)
    return NextResponse.json(
      { error: 'Failed to create marketing campaign' },
      { status: 500 }
    )
  }
}