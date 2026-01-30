import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    const where: any = {}
    if (category) {
      where.category = category
    }
    if (status) {
      where.status = status
    }

    const fixedAssets = await prisma.fixedAsset.findMany({
      where,
      // Fixed assets don't have relations in schema
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(fixedAssets)
  } catch (error) {
    console.error('Failed to fetch fixed assets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fixed assets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      asset_number, 
      name, 
      description, 
      category, 
      purchase_date, 
      purchase_price, 
      expected_life_years, 
      current_value, 
      status, 
      location, 
      assigned_to_id 
    } = body

    const fixedAsset = await prisma.fixedAsset.create({
      data: {
        asset_code: asset_number,
        asset_name: name,
        category: category || '',
        acquisition_date: new Date(purchase_date),
        acquisition_cost: parseFloat(purchase_price),
        useful_life_years: parseInt(expected_life_years),
        depreciation_method: 'STRAIGHT_LINE',
        net_book_value: parseFloat(current_value),
        status: status || 'ACTIVE',
        location: location || ''
      }
    })

    return NextResponse.json(fixedAsset)
  } catch (error) {
    console.error('Failed to create fixed asset:', error)
    return NextResponse.json(
      { error: 'Failed to create fixed asset' },
      { status: 500 }
    )
  }
}
