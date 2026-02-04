import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
    const skip = calculateSkip(page, limit);

    const where: any = {
      ...buildSearchWhereClause(search, ["full_name", "employee_code"]),
    };

    if (filters.department_id) {
      where.department_id = filters.department_id
    }

    if (filters.position_id) {
      where.position_id = filters.position_id
    }

    if (filters.level_id) {
      where.level_id = filters.level_id
    }

    if (filters.status) {
      where.status = filters.status
    }

    const [total, employees] = await Promise.all([
      prisma.employees.count({ where }),
      prisma.employees.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ])

    return NextResponse.json({
      data: employees,
      meta: buildPaginationMeta(total, page, limit)
    })
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

    if (!body.full_name) {
      return NextResponse.json(
        { error: 'full_name is required' },
        { status: 400 }
      )
    }

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
