 import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { EntityValidators } from '@/lib/entity-validators'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const where: any = {}
    
    if (search) {
      where.OR = [
        { engine_code: { contains: search, mode: 'insensitive' } },
        { fuel_type: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    }

     const [total, vehicleEngines] = await Promise.all([
       prisma.vehicle_engines.count({ where }),
       prisma.vehicle_engines.findMany({
         where,
         skip,
         take: limit,
         orderBy: { created_at: 'desc' }
       })
     ])

     return NextResponse.json({
       data: vehicleEngines,
       meta: {
         total,
         page,
         limit,
         totalPages: Math.ceil(total / limit)
       }
     })
  } catch (error) {
    console.error('Failed to fetch vehicle engines:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle engines' },
      { status: 500 }
    )
  }
}

 export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    EntityValidators.vehicleEngines({
      engine_name: body.engine_name,
      engine_code: body.engine_code,
      fuel_type: body.fuel_type,
      engine_capacity: body.engine_capacity
    })

    const vehicleEngine = await prisma.vehicle_engines.create({
      data: {
        id: `VE${Date.now()}`,
        engine_code: body.engine_code || `VE${Date.now()}`,
        engine_name: body.engine_name,
        engine_capacity: body.engine_capacity,
        fuel_type: body.fuel_type,
        status: body.status || 'ACTIVE',
        updated_at: new Date()
      }
    })
    
    return NextResponse.json(vehicleEngine, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create vehicle engine:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create vehicle engine'
    return NextResponse.json(
      { error: errorMessage },
      { status: error.name === 'ValidationError' ? 400 : 500 }
    )
  }
}