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

    const settings = await prisma.systemSetting.findMany({
      where,
      orderBy: { key: 'asc' }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Failed to fetch system settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch system settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value, description, category, data_type } = body

    const existingSetting = await prisma.systemSetting.findUnique({
      where: { key }
    })

    let setting
    if (existingSetting) {
      setting = await prisma.systemSetting.update({
        where: { key },
        data: {
          value,
          description,
          category,
          data_type,
          updated_at: new Date()
        }
      })
    } else {
      setting = await prisma.systemSetting.create({
        data: {
          key,
          value,
          description,
          category,
          data_type,
          updated_by: '1'
        }
      })
    }

    return NextResponse.json(setting)
  } catch (error) {
    console.error('Failed to update system settings:', error)
    return NextResponse.json(
      { error: 'Failed to update system settings' },
      { status: 500 }
    )
  }
}
