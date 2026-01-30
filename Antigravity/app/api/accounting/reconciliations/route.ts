import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Reconciliation model doesn't exist in schema - returning empty array for now
    const reconciliations: any[] = []
    
    return NextResponse.json(reconciliations)
  } catch (error) {
    console.error('Failed to fetch reconciliations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reconciliations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Reconciliation model doesn't exist in schema - returning success for now
    return NextResponse.json({ 
      success: true, 
      message: 'Reconciliation endpoint not implemented yet' 
    })
  } catch (error) {
    console.error('Failed to create reconciliation:', error)
    return NextResponse.json(
      { error: 'Failed to create reconciliation' },
      { status: 500 }
    )
  }
}