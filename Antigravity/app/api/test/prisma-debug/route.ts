import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Prisma client:', prisma)
    console.log('Prisma uoms:', prisma.uoms)
    console.log('Prisma vehicle_colors:', prisma.vehicle_colors)
    console.log('Prisma keys:', Object.keys(prisma).filter(k => k.includes('color')))
    
    const testResult = {
      prismaExists: !!prisma,
      uomsExists: !!prisma.uoms,
      vehicleColorsExists: !!prisma.vehicle_colors,
      vehicle_colorsExists: !!prisma.vehicle_colors,
      allKeys: Object.keys(prisma).filter(k => !k.startsWith('_'))
    }
    
    return NextResponse.json(testResult)
  } catch (error) {
    console.error('Error in test API:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
