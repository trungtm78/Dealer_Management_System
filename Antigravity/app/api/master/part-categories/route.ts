import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const forDropdown = searchParams.get('for_dropdown') === 'true';
    const status = searchParams.get('status') || 'ACTIVE';

    if (forDropdown) {
      const partCategories = await prisma.part_categories.findMany({
        where: { status },
        select: { id: true, category_name: true, status: true },
        orderBy: { category_name: 'asc' }
      });
      const dropdownData = partCategories.map(c => ({
        id: c.id,
        name: c.category_name,
        status: c.status
      }));
      return NextResponse.json({ data: dropdownData });
    }
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const search = searchParams.get('search') || ''
    const includeChildren = searchParams.get('include_children') === '"ACTIVE"'

    const where: any = {}
    
    if (search) {
      where.OR = [
        { category_code: { contains: search, mode: 'insensitive' } },
        { category_name: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    }

    const [total, partCategories] = await Promise.all([
      prisma.part_categories.count({ where }),
      prisma.part_categories.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])

    return NextResponse.json({
      data: partCategories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch part categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch part categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const partCategory = await prisma.part_categories.create({
      data: {
        category_code: body.category_code,
        category_name: body.category_name,
        parent_category_id: body.parent_category_id || null,
        description: body.description,
        status: body.status || 'ACTIVE'
      }
    })
    
    return NextResponse.json(partCategory, { status: 201 })
  } catch (error) {
    console.error('Failed to create part category:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create part category'
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}