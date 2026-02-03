import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    
    const where: any = {}
    
    if (searchParams.get('name')) {
      where.uom_name = {
        contains: searchParams.get('name'),
        mode: 'insensitive'
      }
    }
    
    if (searchParams.get('code')) {
      where.uom_code = {
        contains: searchParams.get('code'),
        mode: 'insensitive'
      }
    }
    
    if (searchParams.get('status')) {
      where.status = searchParams.get('status')
    }
    
    const total = await prisma.uoms.count({ where })
    
    const uoms = await prisma.uoms.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' }
    })
    
    const result = {
      data: uoms,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to fetch UOMs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch UOMs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const uom = await prisma.uoms.create({
      data: {
        id: `UOM${Date.now()}`,
        uom_code: body.uom_code || `UOM${Date.now()}`,
        uom_name: body.uom_name,
        description: body.description,
        status: body.status || 'ACTIVE',
        updated_at: new Date()
      }
    })
    
    return NextResponse.json(uom, { status: 201 })
  } catch (error) {
    console.error('Failed to create UOM:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create UOM'
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}
