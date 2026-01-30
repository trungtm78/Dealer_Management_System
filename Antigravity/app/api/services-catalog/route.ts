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

    const services = await prisma.serviceCatalog.findMany({
      where,
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Failed to fetch services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
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
      base_price, 
      duration_hours, 
      required_certifications, 
      status 
    } = body

    // Generate service code
    const count = await prisma.serviceCatalog.count()
    const serviceCode = `SVC/2026/${String(count + 1).padStart(3, '0')}`

    const service = await prisma.serviceCatalog.create({
      data: {
        service_code: serviceCode,
        service_name: name,
        category,
        labor_hours: parseFloat(duration_hours),
        labor_rate: parseFloat(base_price),
        status
      }
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Failed to create service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
