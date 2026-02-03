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

    const settings = await prisma.system_settings.findMany({
      where,
      orderBy: { setting_code: 'asc' }
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
    const { setting_code, current_value, description, category, data_type } = body

    const existingSetting = await prisma.system_settings.findUnique({
      where: { setting_code }
    })

    let setting
    if (existingSetting) {
      setting = await prisma.system_settings.update({
        where: { setting_code },
        data: {
          current_value,
          description,
          category,
          data_type,
          updated_at: new Date()
        }
      })
    } else {
      setting = await prisma.system_settings.create({
        data: {
          setting_code,
          setting_name: setting_code,
          default_value: current_value,
          current_value,
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
