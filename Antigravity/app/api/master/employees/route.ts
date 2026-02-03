import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (searchParams.get('name')) {
      where.full_name = {
        contains: searchParams.get('name'),
        mode: 'insensitive'
      }
    }

    if (searchParams.get('department_id')) {
      where.department_id = searchParams.get('department_id')
    }

    if (searchParams.get('position_id')) {
      where.position_id = searchParams.get('position_id')
    }

    if (searchParams.get('level_id')) {
      where.level_id = searchParams.get('level_id')
    }

    if (searchParams.get('status')) {
      where.status = searchParams.get('status')
    }

    // Get total count for pagination
    const total = await prisma.employees.count({ where })

    // Get employees with pagination
    const employees = await prisma.employees.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' }
    })

    const result = {
      data: employees,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to fetch employees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.full_name) {
      return NextResponse.json(
        { error: 'full_name is required' },
        { status: 400 }
      )
    }

    // Check for duplicate employee_code if provided
    if (body.employee_code) {
      const existingByCode = await prisma.employees.findFirst({
        where: { employee_code: body.employee_code }
      })

      if (existingByCode) {
        return NextResponse.json(
          { error: `Employee code "${body.employee_code}" already exists` },
          { status: 400 }
        )
      }
    }

    // Check for duplicate user_id if provided
    if (body.user_id) {
      const existingByUserId = await prisma.employees.findFirst({
        where: { user_id: body.user_id }
      })

      if (existingByUserId) {
        return NextResponse.json(
          { error: `User ID "${body.user_id}" is already linked to another employee` },
          { status: 400 }
        )
      }
    }

    const employee = await prisma.employees.create({
      data: {
        employee_code: body.employee_code || `EMP${Date.now()}`,
        full_name: body.full_name,
        department_id: body.department_id,
        position_id: body.position_id,
        level_id: body.level_id,
        join_date: body.join_date ? new Date(body.join_date) : null,
        status: body.status || 'ACTIVE',
        user_id: body.user_id
      }
    })

    return NextResponse.json(employee, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create employee:', error)

    // Handle Prisma UNIQUE constraint violation
    if (error.code === 'P2002') {
      const target = error.meta?.target || []
      const field = target[0] || 'field'

      let message = `${field} already exists. Please use a different value.`

      if (field === 'employee_code') {
        message = 'Employee code already exists. Please use a different code.'
      } else if (field === 'user_id') {
        message = 'This user is already linked to another employee.'
      }

      return NextResponse.json(
        { error: message },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to create employee'
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}