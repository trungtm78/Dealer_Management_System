import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { EntityValidators } from '@/lib/entity-validators'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get('brand')
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    const where: any = {}
    if (brand) {
      where.brand = { contains: brand }
    }
    if (category) {
      where.category = category
    }
    if (status) {
      where.status = status
    }

    const vehicleModels = await prisma.vehicle_models.findMany({
      where,
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(vehicleModels)
  } catch (error) {
    console.error('Failed to fetch vehicle models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle models' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      model_name,
      category,
      base_price,
      status
    } = body

    EntityValidators.vehicleModels({
      name: model_name,
      year: new Date().getFullYear(),
      base_price
    })

    const count = await prisma.vehicle_models.count()
    const modelCode = `MOD/2026/${String(count + 1).padStart(3, '0')}`

    const vehicleModel = await prisma.vehicle_models.create({
      data: {
        model_code: modelCode,
        model_name,
        category,
        base_price: parseFloat(base_price),
        status: status || 'ACTIVE'
      }
    })

    return NextResponse.json(vehicleModel)
  } catch (error: any) {
    console.error('Failed to create vehicle model:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create vehicle model' },
      { status: error.name === 'ValidationError' ? 400 : 500 }
    )
  }
}
