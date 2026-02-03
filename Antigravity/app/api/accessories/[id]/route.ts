import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accessory = await prisma.accessories.findUnique({
      where: { id: params.id }
    })

    if (!accessory) {
      return NextResponse.json(
        { error: 'Accessory not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(accessory)
  } catch (error) {
    console.error('Failed to fetch accessory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accessory' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate that accessory_code cannot be updated
    if (body.accessory_code) {
      return NextResponse.json(
        { error: 'Accessory code cannot be updated' },
        { status: 400 }
      )
    }

    // Convert numeric fields
    const updateData = { ...body }
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price)
    }
    if (updateData.warranty_period_months) {
      updateData.warranty_period_months = parseInt(updateData.warranty_period_months)
    }

    // Check for duplicate name (excluding current record)
    if (updateData.accessory_name) {
      const existingAccessory = await prisma.accessories.findFirst({
        where: {
          AND: [
            { accessory_name: { equals: updateData.accessory_name } },
            { id: { not: params.id } }
          ]
        }
      })

      if (existingAccessory) {
        return NextResponse.json(
          { error: 'Accessory name already exists' },
          { status: 409 }
        )
      }
    }

    const updatedAccessory = await prisma.accessories.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(updatedAccessory)
  } catch (error) {
    console.error('Failed to update accessory:', error)
    return NextResponse.json(
      { error: 'Failed to update accessory' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Soft delete by setting status to INACTIVE and deleted_at
    const updatedAccessory = await prisma.accessories.update({
      where: { id: params.id },
      data: {
        status: 'INACTIVE'
      }
    })

    return NextResponse.json({
      message: 'Accessory deleted successfully',
      id: params.id
    })
  } catch (error) {
    console.error('Failed to delete accessory:', error)
    return NextResponse.json(
      { error: 'Failed to delete accessory' },
      { status: 500 }
    )
  }
}