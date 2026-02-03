import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const search = searchParams.get('name') || ''
    const status = searchParams.get('status') || ''
    
    const where: any = {}
    
    if (search) {
      where.OR = [
        { company_name: { contains: search, mode: 'insensitive' } },
        { company_code: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    const [total, insuranceCompanies] = await Promise.all([
      prisma.insurance_companies.count({ where }),
      prisma.insurance_companies.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])
    
    return NextResponse.json({
      data: insuranceCompanies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch insurance companies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch insurance companies' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const insuranceCompany = await prisma.insurance_companies.create({
      data: {
        id: `IC${Date.now()}`,
        company_code: body.company_code || `IC${Date.now()}`,
        company_name: body.company_name,
        contact_person: body.contact_person,
        phone: body.phone,
        email: body.email,
        address: body.address,
        status: body.status || 'ACTIVE',
        updated_at: new Date()
      }
    })
    
    return NextResponse.json(insuranceCompany, { status: 201 })
  } catch (error) {
    console.error('Failed to create insurance company:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create insurance company'
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}
