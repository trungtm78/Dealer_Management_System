import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ValidationError } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceQuoteId, technicianId, notes } = body

    if (!serviceQuoteId) {
      throw new ValidationError('Service Quote ID là bắt buộc')
    }

    const serviceQuote = await prisma.serviceQuote.findUnique({
      where: { id: serviceQuoteId },
      include: { Customer: true }
    })

    if (!serviceQuote) {
      throw new ValidationError('Service Quote không tồn tại')
    }

    if (serviceQuote.status !== 'APPROVED') {
      throw new ValidationError('Chỉ có thể tạo Repair Order từ Service Quote đã được duyệt')
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const roNumber = `RO-${dateStr}-${random}`

    const ro = await prisma.repairOrder.create({
      data: {
        ro_number: roNumber,
        customer_id: serviceQuote.customer_id,
        vehicle_info: serviceQuote.vehicle_info,
        customer_complaints: notes || `Tạo từ Service Quote: ${serviceQuote.quote_number}`,
        advisor_id: technicianId || serviceQuote.advisor_id,
        status: 'PENDING'
      },
      include: {
        Customer: { select: { name: true } },
        User_RepairOrder_technician_idToUser: { select: { name: true } }
      }
    })

    await prisma.serviceQuote.update({
      where: { id: serviceQuoteId },
      data: { status: 'CONVERTED' }
    })

    return NextResponse.json(ro, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create RO from service quote:', error)

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create repair order from service quote' },
      { status: 500 }
    )
  }
}
