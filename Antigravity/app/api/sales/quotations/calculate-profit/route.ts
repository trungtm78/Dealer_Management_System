import { NextRequest, NextResponse } from 'next/server';
import { calculateProfit } from '@/lib/calculations/quotation';

/**
 * POST /api/sales/quotations/calculate-profit
 * Calculate profit analysis for a quotation
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            total_revenue,
            base_price,
            accessories_total,
            services_total,
            promotions_value,
            discount,
            actual_commission,
        } = body;

        // Validation
        if (
            total_revenue === undefined ||
            base_price === undefined ||
            accessories_total === undefined ||
            services_total === undefined ||
            promotions_value === undefined ||
            discount === undefined
        ) {
            return NextResponse.json(
                {
                    error:
                        'Missing required fields: total_revenue, base_price, accessories_total, services_total, promotions_value, discount',
                },
                { status: 400 }
            );
        }

        // Calculate profit
        const result = calculateProfit({
            totalRevenue: total_revenue,
            basePrice: base_price,
            accessoriesTotal: accessories_total,
            servicesTotal: services_total,
            promotionValue: promotions_value,
            discount,
            actualCommission: actual_commission,
        });

        return NextResponse.json({
            total_revenue: result.totalRevenue,
            total_cost: result.totalCost,
            gross_profit: result.grossProfit,
            profit_margin: result.profitMargin,
            margin_status: result.marginStatus,
            cost_breakdown: result.costBreakdown,
        });
    } catch (error) {
        console.error('Error calculating profit:', error);
        return NextResponse.json(
            { error: 'Failed to calculate profit' },
            { status: 500 }
        );
    }
}
