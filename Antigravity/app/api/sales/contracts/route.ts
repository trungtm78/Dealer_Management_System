import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
    const skip = calculateSkip(page, limit);

    const where: any = {
      ...buildSearchWhereClause(search, ["contract_number"]),
    };

    if (filters.status) {
      where.status = filters.status
    }

    const [total, contracts] = await Promise.all([
      prisma.contract.count({ where }),
      prisma.contract.findMany({
        where,
        include: {
          Customer: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true
            }
          },
          Quotation: {
            select: {
              id: true,
              quote_number: true,
              model: true,
              version: true,
              color: true,
              total_price: true
            }
          },
          User: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { contract_date: 'desc' }
      })
    ])

    return NextResponse.json({
      data: contracts,
      meta: buildPaginationMeta(total, page, limit)
    })
  } catch (error) {
    console.error('Failed to fetch contracts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quotation_id, customer_id, vin_id, total_amount, deposit_amount, payment_method, contract_date, delivery_date, created_by_id } = body

    const contractDate = new Date(contract_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (contractDate < today) {
      return NextResponse.json(
        { error: 'Ngày hợp đồng không thể nhỏ hơn ngày hiện tại' },
        { status: 400 }
      )
    }

    if (total_amount <= 0) {
      return NextResponse.json(
        { error: 'Tổng số tiền hợp đồng phải lớn hơn 0' },
        { status: 400 }
      )
    }

    if (deposit_amount < 0 || deposit_amount > total_amount) {
      return NextResponse.json(
        { error: 'Số tiền đặt cọc phải từ 0 đến tổng số tiền hợp đồng' },
        { status: 400 }
      )
    }

    const year = new Date().getFullYear()
    const contractNumber = `CON-${year}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`

    const contract = await prisma.contract.create({
      data: {
        contract_number: contractNumber,
        quotation_id,
        customer_id,
        vin_id,
        total_amount,
        deposit_amount,
        remaining_amount: total_amount - deposit_amount,
        payment_method,
        contract_date: contractDate,
        delivery_date: delivery_date ? new Date(delivery_date) : null,
        created_by_id,
        status: 'ACTIVE'
      },
      include: {
        Customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        },
        Quotation: {
          select: {
            id: true,
            quote_number: true,
            model: true,
            version: true,
            color: true,
            total_price: true
          }
        },
        User: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(contract, { status: 201 })
  } catch (error) {
    console.error('Failed to create contract:', error)
    return NextResponse.json(
      { error: 'Failed to create contract' },
      { status: 500 }
    )
  }
}
