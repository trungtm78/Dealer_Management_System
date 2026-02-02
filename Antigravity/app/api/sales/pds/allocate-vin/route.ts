import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ValidationError } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contractId, inspectorId } = body

    if (!contractId) {
      throw new ValidationError('Contract ID là bắt buộc')
    }

    if (!inspectorId) {
      throw new ValidationError('Inspector ID là bắt buộc')
    }

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { Customer: true }
    })

    if (!contract) {
      throw new ValidationError('Contract không tồn tại')
    }

    if (contract.status !== 'ACTIVE') {
      throw new ValidationError('Chỉ có thể allocate VIN cho Contract ở trạng thái ACTIVE')
    }

    if (contract.vin_id) {
      throw new ValidationError('Contract đã có VIN được allocate')
    }

    const quotation = await prisma.quotation.findUnique({
      where: { id: contract.quotation_id }
    })

    const availableVins = await prisma.vin.findMany({
      where: {
        status: 'AVAILABLE',
        model: quotation?.model || '',
        color: quotation?.color || ''
      },
      orderBy: { created_at: 'asc' },
      take: 1
    })

    if (availableVins.length === 0) {
      throw new ValidationError('Không có VIN phù hợp sẵn có. Vui lòng kiểm tra kho hàng.')
    }

    const selectedVin = availableVins[0]

    await prisma.$transaction([
      prisma.vin.update({
        where: { id: selectedVin.id },
        data: {
          status: 'ALLOCATED',
          allocated_to_contract_id: contractId
        }
      }),
      prisma.contract.update({
        where: { id: contractId },
        data: { vin_id: selectedVin.id }
      }),
      prisma.pDSChecklist.create({
        data: {
          contract_id: contractId,
          vin_id: selectedVin.id,
          exterior_check: '{}',
          interior_check: '{}',
          mechanical_check: '{}',
          documentation_check: '{}',
          photos: '[]',
          inspector_id: inspectorId
        }
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'VIN đã được allocate thành công',
      data: {
        vin: selectedVin,
        contract: contract
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error('Failed to allocate VIN to PDS:', error)

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to allocate VIN to PDS' },
      { status: 500 }
    )
  }
}
