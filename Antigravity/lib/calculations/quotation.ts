/**
 * Quotation Calculation Utilities
 * CR-20260202-004
 * 
 * Contains all calculation logic for quotations:
 * - OTR (On-The-Road) Total
 * - PMT (Payment) for installments
 * - Profit Analysis
 */

// ============================================================================
// CONSTANTS (from Refs - DO NOT MODIFY)
// ============================================================================

export const QUOTATION_CONSTANTS = {
    // Fixed costs per deal
    MANUFACTURER_COST_CRV: 1_150_000_000, // CR-V base cost
    STANDARD_COMMISSION: 40_000_000,
    OPERATING_COST: 25_000_000,
    MARKETING_COST: 15_000_000,

    // Cost rates
    ACCESSORY_COST_RATE: 0.7, // 70% of retail
    SERVICE_COST_RATE: 0.5,   // 50% of retail

    // Fixed fees
    INSURANCE: 23_000_000,
    REGISTRATION_TAX_RATE: 0.1, // 10% of base price
    REGISTRATION_FEE: 15_000_000,
    OTHER_FEES: 2_500_000,
} as const;

// ============================================================================
// OTR CALCULATION
// ============================================================================

export interface OTRParams {
    basePrice: number;
    accessoriesTotal: number;
    servicesTotal: number;
    insurance?: number;
    registrationTax?: number;
    registration?: number;
    otherFees?: number;
}

export function calculateOTR(params: OTRParams): number {
    const {
        basePrice,
        accessoriesTotal,
        servicesTotal,
        insurance = QUOTATION_CONSTANTS.INSURANCE,
        registrationTax = basePrice * QUOTATION_CONSTANTS.REGISTRATION_TAX_RATE,
        registration = QUOTATION_CONSTANTS.REGISTRATION_FEE,
        otherFees = QUOTATION_CONSTANTS.OTHER_FEES,
    } = params;

    return (
        basePrice +
        accessoriesTotal +
        servicesTotal +
        insurance +
        registrationTax +
        registration +
        otherFees
    );
}

// ============================================================================
// PMT CALCULATION (Installment)
// ============================================================================

export interface PMTParams {
    totalPrice: number;
    prepaymentRatio: number; // 0.0 to 1.0 (e.g., 0.3 = 30%)
    loanTerm: number; // months
    interestRate: number; // annual % (e.g., 8.5)
}

export interface PMTResult {
    loanAmount: number;
    prepayment: number;
    monthlyPayment: number;
    totalInterest: number;
    totalPayment: number;
    schedule: PaymentScheduleItem[];
}

export interface PaymentScheduleItem {
    month: number;
    principal: number;
    interest: number;
    payment: number;
    balance: number;
}

export function calculatePMT(params: PMTParams): PMTResult {
    const { totalPrice, prepaymentRatio, loanTerm, interestRate } = params;

    const loanAmount = totalPrice * (1 - prepaymentRatio);
    const prepayment = totalPrice * prepaymentRatio;
    const monthlyRate = interestRate / 12 / 100;
    const numPayments = loanTerm;

    // PMT formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    const monthlyPayment =
        loanAmount *
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);

    // Generate payment schedule
    const schedule: PaymentScheduleItem[] = [];
    let remainingBalance = loanAmount;

    for (let month = 1; month <= numPayments; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;

        schedule.push({
            month,
            principal: principalPayment,
            interest: interestPayment,
            payment: monthlyPayment,
            balance: Math.max(0, remainingBalance), // Avoid negative due to rounding
        });
    }

    const totalInterest = monthlyPayment * numPayments - loanAmount;
    const totalPayment = prepayment + monthlyPayment * numPayments;

    return {
        loanAmount,
        prepayment,
        monthlyPayment,
        totalInterest,
        totalPayment,
        schedule,
    };
}

// ============================================================================
// PROFIT ANALYSIS
// ============================================================================

export interface ProfitParams {
    totalRevenue: number;
    basePrice: number;
    accessoriesTotal: number;
    servicesTotal: number;
    promotionValue: number; // NEGATIVE value (e.g., -15000000)
    discount: number;
    actualCommission?: number;
}

export interface ProfitResult {
    totalRevenue: number;
    totalCost: number;
    grossProfit: number;
    profitMargin: number; // percentage
    marginStatus: 'GOOD' | 'MEDIUM' | 'LOW' | 'CRITICAL' | 'LOSS';
    costBreakdown: {
        manufacturer: number;
        accessories: number;
        services: number;
        insurance: number;
        registrationTax: number;
        registration: number;
        otherFees: number;
        operating: number;
        marketing: number;
        promotion: number;
        discount: number;
        commission: number;
    };
}

export function calculateProfit(params: ProfitParams): ProfitResult {
    const {
        totalRevenue,
        basePrice,
        accessoriesTotal,
        servicesTotal,
        promotionValue,
        discount,
        actualCommission = QUOTATION_CONSTANTS.STANDARD_COMMISSION,
    } = params;

    // Calculate costs
    const manufacturerCost = QUOTATION_CONSTANTS.MANUFACTURER_COST_CRV;
    const accessoryCost = accessoriesTotal * QUOTATION_CONSTANTS.ACCESSORY_COST_RATE;
    const serviceCost = servicesTotal * QUOTATION_CONSTANTS.SERVICE_COST_RATE;
    const promotionCost = Math.abs(promotionValue);
    const insurance = QUOTATION_CONSTANTS.INSURANCE;
    const registrationTax = basePrice * QUOTATION_CONSTANTS.REGISTRATION_TAX_RATE;
    const registration = QUOTATION_CONSTANTS.REGISTRATION_FEE;
    const otherFees = QUOTATION_CONSTANTS.OTHER_FEES;
    const operatingCost = QUOTATION_CONSTANTS.OPERATING_COST;
    const marketingCost = QUOTATION_CONSTANTS.MARKETING_COST;

    const totalCost =
        manufacturerCost +
        accessoryCost +
        serviceCost +
        insurance +
        registrationTax +
        registration +
        otherFees +
        operatingCost +
        marketingCost +
        promotionCost +
        discount +
        actualCommission;

    const grossProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    // Determine margin status
    let marginStatus: ProfitResult['marginStatus'];
    if (profitMargin < 0) {
        marginStatus = 'LOSS';
    } else if (profitMargin < 5) {
        marginStatus = 'CRITICAL';
    } else if (profitMargin < 10) {
        marginStatus = 'LOW';
    } else if (profitMargin < 15) {
        marginStatus = 'MEDIUM';
    } else {
        marginStatus = 'GOOD';
    }

    return {
        totalRevenue,
        totalCost,
        grossProfit,
        profitMargin,
        marginStatus,
        costBreakdown: {
            manufacturer: manufacturerCost,
            accessories: accessoryCost,
            services: serviceCost,
            insurance,
            registrationTax,
            registration,
            otherFees,
            operating: operatingCost,
            marketing: marketingCost,
            promotion: promotionCost,
            discount,
            commission: actualCommission,
        },
    };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + ' đ';
}

export function calculateFinalTotal(
    otrTotal: number,
    promotionValue: number,
    discount: number
): number {
    // promotionValue is NEGATIVE (e.g., -15000000)
    return otrTotal + promotionValue - discount;
}
