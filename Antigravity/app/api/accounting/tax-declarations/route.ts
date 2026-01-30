import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taxType = searchParams.get('tax_type')
    const year = searchParams.get('year')
    const status = searchParams.get('status')

    const where: any = {}
    if (taxType) {
      where.tax_type = taxType
    }
    if (year) {
      where.year = parseInt(year)
    }
    if (status) {
      where.status = status
    }

const taxDeclarations = await prisma.taxDeclaration.findMany({
      where,
      orderBy: { period: 'desc' }
    })

    return NextResponse.json(taxDeclarations)
  } catch (error) {
    console.error('Failed to fetch tax declarations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tax declarations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      tax_type, 
      year, 
      period_start, 
      period_end, 
      total_taxable_amount, 
      total_tax_amount, 
      status, 
      notes 
    } = body

    const currentYear = new Date().getFullYear()
    const declarationNumber = `TAX-${currentYear}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    
    const taxDeclaration = await prisma.taxDeclaration.create({
      data: {
        declaration_number: declarationNumber,
        tax_type,
        period: `${currentYear}-Q1`, // Default period
        taxable_amount: parseFloat(total_taxable_amount),
        tax_amount: parseFloat(total_tax_amount),
        status,
        created_by_id: '1'
      }
    })

    return NextResponse.json(taxDeclaration)
  } catch (error) {
    console.error('Failed to create tax declaration:', error)
    return NextResponse.json(
      { error: 'Failed to create tax declaration' },
      { status: 500 }
    )
  }
}
