 import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { EntityValidators } from '@/lib/entity-validators'

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
        { warehouse_name: { contains: search, mode: 'insensitive' } },
        { warehouse_code: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Fix: handle boolean status properly
    if (status) {
      where.is_active = status === 'ACTIVE'
    }
    
     const [total, warehouses] = await Promise.all([
       prisma.warehouses.count({ where }),
       prisma.warehouses.findMany({
         where,
         skip,
         take: limit,
         orderBy: { created_at: 'desc' }
       })
     ])
    
    return NextResponse.json({
      data: warehouses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch warehouses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch warehouses' },
      { status: 500 }
    )
  }
}

 export async function POST(request: NextRequest) {
   try {
     const body = await request.json()

     EntityValidators.warehouses({
       warehouse_name: body.warehouse_name,
       location_address: body.location_address,
       capacity: body.capacity,
       contact_person: body.contact_person,
       contact_phone: body.contact_phone,
       contact_email: body.contact_email
     })

     EntityValidators.warehouses({
       warehouse_name: body.warehouse_name,
       location_address: body.location_address,
       contact_person: body.contact_person,
       contact_phone: body.contact_phone,
       contact_email: body.contact_email
     })

     const warehouse = await prisma.warehouses.create({
       data: {
         id: `WH${Date.now()}`,
         warehouse_code: body.warehouse_code || `WH${Date.now()}`,
         warehouse_name: body.warehouse_name,
         location_address: body.location_address,
         manager_id: body.manager_id,
         is_active: body.is_active !== undefined ? body.is_active : true,
         updated_at: new Date()
       }
     })

     return NextResponse.json(warehouse, { status: 201 })
   } catch (error: any) {
     console.error('Failed to create warehouse:', error)
     const errorMessage = error instanceof Error ? error.message : 'Failed to create warehouse'
     return NextResponse.json(
       { error: errorMessage },
       { status: error.name === 'ValidationError' ? 400 : 500 }
     )
   }
 }
