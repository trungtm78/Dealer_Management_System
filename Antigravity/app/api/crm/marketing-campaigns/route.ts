import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
    const skip = calculateSkip(page, limit);

    const where: any = {
      ...buildSearchWhereClause(search, ["name", "description"]),
    };

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.type) {
      where.type = filters.type
    }

    const [total, campaigns] = await Promise.all([
      prisma.marketingCampaign.count({ where }),
      prisma.marketingCampaign.findMany({
        where,
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])

    return NextResponse.json({
      data: campaigns,
      meta: buildPaginationMeta(total, page, limit)
    })
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
        User: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error('Failed to create marketing campaign:', error)
    return NextResponse.json(
      { error: 'Failed to create marketing campaign' },
      { status: 500 }
    )
  }
}
