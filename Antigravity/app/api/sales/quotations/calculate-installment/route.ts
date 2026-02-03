import { NextRequest, NextResponse } from 'next/server';
import { calculatePMT } from '@/lib/calculations/quotation';

/**
 * POST /api/sales/quotations/calculate-installment
 * Calculate monthly payment and schedule for installment plan
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { total_price, prepayment_ratio, loan_term, interest_rate } = body;

        // Validation
        if (!total_price || !prepayment_ratio || !loan_term || !interest_rate) {
            return NextResponse.json(
                { error: 'Missing required fields: total_price, prepayment_ratio, loan_term, interest_rate' },
                { status: 400 }
            );
        }

        // Calculate PMT
        const result = calculatePMT({
            totalPrice: total_price,
            prepaymentRatio: prepayment_ratio,
            loanTerm: loan_term,
            interestRate: interest_rate,
        });

        return NextResponse.json({
            loan_amount: result.loanAmount,
            prepayment: result.prepayment,
            monthly_payment: result.monthlyPayment,
            total_interest: result.totalInterest,
            total_payment: result.totalPayment,
            schedule: result.schedule,
        });
    } catch (error) {
        console.error('Error calculating installment:', error);
        return NextResponse.json(
            { error: 'Failed to calculate installment' },
            { status: 500 }
        );
    }
}
