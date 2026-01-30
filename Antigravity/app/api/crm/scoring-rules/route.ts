import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where: any = {}
    if (category) {
      where.category = category
    }

    const rules = await prisma.scoringRule.findMany({
      where,
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(rules)
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

    const rule = await prisma.scoringRule.create({
      data: {
        name,
        category,
        condition: JSON.stringify(condition),
        points,
        is_active: true
      }
    })

    return NextResponse.json(rule)
  } catch (error) {
    console.error('Failed to create scoring rule:', error)
    return NextResponse.json(
      { error: 'Failed to create scoring rule' },
      { status: 500 }
    )
  }
}