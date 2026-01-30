import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {}
    if (status) {
      where.status = status
    }

    const stockTakes = await prisma.stockTake.findMany({
      where,
      include: {
        items: {
          include: {
            part: {
              select: {
                id: true,
                part_number: true,
                name: true,
                category: true
              }
            }
          }
        },
        countedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(stockTakes)
  } catch (error) {
    console.error('Failed to fetch stock takes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock takes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      reference_number, 
      stock_take_date, 
      notes, 
      items 
    } = body

    const year = new Date().getFullYear()
    const sessionNumber = `ST-${year}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    
    const stockTake = await prisma.stockTake.create({
      data: {
        session_number: sessionNumber,
        session_date: new Date(stock_take_date),
        status: 'IN_PROGRESS',
        notes,
        counted_by_id: '1'
      },
      include: {
        items: {
          include: {
            part: {
              select: {
                id: true,
                part_number: true,
                name: true,
                category: true
              }
            }
          }
        },
        countedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(stockTake)
  } catch (error) {
    console.error('Failed to create stock take:', error)
    return NextResponse.json(
      { error: 'Failed to create stock take' },
      { status: 500 }
    )
  }
}
