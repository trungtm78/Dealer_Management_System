import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
    const skip = calculateSkip(page, limit);

    const where: any = {
      ...buildSearchWhereClause(search, ["rule_name", "rule_code"]),
    };

    if (filters.category) {
      where.category = filters.category
    }

    if (filters.status) {
      where.status = filters.status
    }

    const [total, rules] = await Promise.all([
      prisma.scoring_rules.count({ where }),
      prisma.scoring_rules.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])

    return NextResponse.json({
      data: rules,
      meta: buildPaginationMeta(total, page, limit)
    })
  } catch (error) {
    console.error('Failed to fetch scoring rules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scoring rules' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, condition, points } = body

    const rule = await prisma.scoring_rules.create({
      data: {
        rule_code: `RULE-${Date.now()}`,
        rule_name: name,
        category,
        condition_expression: JSON.stringify(condition),
        description: `Created by user`,
        status: "ACTIVE"
      }
    })

    return NextResponse.json(rule, { status: 201 })
  } catch (error) {
    console.error('Failed to create scoring rule:', error)
    return NextResponse.json(
      { error: 'Failed to create scoring rule' },
      { status: 500 }
    )
  }
}
