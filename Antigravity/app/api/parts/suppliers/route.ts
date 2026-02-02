import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { EntityValidators } from '@/lib/entity-validators'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    const contactPerson = searchParams.get('contact_person')

    const where: any = {}
    if (name) {
      where.name = { contains: name }
    }
    if (contactPerson) {
      where.contact_person = { contains: contactPerson }
    }

    const suppliers = await prisma.supplier.findMany({
      where,
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(suppliers)
  } catch (error) {
    console.error('Failed to fetch suppliers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      contact_person,
      phone,
      email,
      address,
      tax_id,
      payment_terms
    } = body

    EntityValidators.suppliers({
      name,
      contact_person,
      contact_phone: phone,
      contact_email: email
    })

    const supplier = await prisma.supplier.create({
      data: {
        code: `SUP-${Date.now()}`,
        name,
        contact_person,
        phone,
        email,
        address,
        payment_terms
      }
    })

    return NextResponse.json(supplier)
  } catch (error: any) {
    console.error('Failed to create supplier:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create supplier' },
      { status: error.name === 'ValidationError' ? 400 : 500 }
    )
  }
}
