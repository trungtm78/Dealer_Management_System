import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ValidationError } from '@/lib/validators'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accountCode = searchParams.get('account_code')
    const transactionDate = searchParams.get('transaction_date')
    const referenceType = searchParams.get('reference_type')

    const where: any = {}
    if (accountCode) {
      where.account_code = accountCode
    }
    if (transactionDate) {
      where.transaction_date = new Date(transactionDate)
    }
    if (referenceType) {
      where.reference_type = referenceType
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { transaction_date: 'desc' }
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      transaction_date,
      type,
      account_code,
      description,
      debit = 0,
      credit = 0,
      reference_type,
      reference_id,
      created_by_id
    } = body

    if (!transaction_date) {
      throw new ValidationError('Ngày giao dịch là bắt buộc')
    }

    const date = new Date(transaction_date)
    if (isNaN(date.getTime())) {
      throw new ValidationError('Ngày giao dịch không hợp lệ')
    }

    if (!type) {
      throw new ValidationError('Loại giao dịch là bắt buộc')
    }

    const validTypes = ['DEBIT', 'CREDIT', 'ADJUSTMENT']
    if (!validTypes.includes(type)) {
      throw new ValidationError(`Loại giao dịch không hợp lệ. Các giá trị hợp lệ: ${validTypes.join(', ')}`)
    }

    if (!account_code) {
      throw new ValidationError('Mã tài khoản là bắt buộc')
    }

    if (!description || !description.trim()) {
      throw new ValidationError('Mô tả giao dịch là bắt buộc')
    }

    const debitValue = parseFloat(debit.toString())
    const creditValue = parseFloat(credit.toString())

    if (isNaN(debitValue) || debitValue < 0) {
      throw new ValidationError('Số nợ phải là số không âm')
    }

    if (isNaN(creditValue) || creditValue < 0) {
      throw new ValidationError('Số có phải là số không âm')
    }

    if (debitValue === 0 && creditValue === 0) {
      throw new ValidationError('Phải có ít nhất một trong số nợ hoặc số có lớn hơn 0')
    }

    const transaction = await prisma.transaction.create({
      data: {
        transaction_date: date,
        type,
        account_code,
        description: description.trim(),
        debit: debitValue,
        credit: creditValue,
        reference_type,
        reference_id,
        created_by_id
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create transaction:', error)

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}
