import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const compatibleModel = searchParams.get('compatible_model')

    const where: any = {}
    if (category) {
      where.category = category
    }
    if (compatibleModel) {
      where.compatible_models = { has: compatibleModel }
    }

    const accessories = await prisma.accessories.findMany({
      where,
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(accessories)
  } catch (error) {
    console.error('Failed to fetch accessories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accessories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      description, 
      category, 
      price, 
      compatible_models, 
      installation_required, 
      warranty_period_months 
    } = body

    const accessory = await prisma.accessories.create({
      data: {
        accessory_code: `ACC-${Date.now()}`,
        accessory_name: name,
        category: category || '',
        price: parseFloat(price)
      }
    })

    return NextResponse.json(accessory)
  } catch (error) {
    console.error('Failed to create accessory:', error)
    return NextResponse.json(
      { error: 'Failed to create accessory' },
      { status: 500 }
    )
  }
}
