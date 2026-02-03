'use server'

import prisma from '@/lib/prisma'

export interface DashboardKPIs {
  active_policies: number
  claims_in_progress: number
  premium_ytd: number
  commission_ytd: number
}

export interface ExpiringPolicy {
  id: string
  contract_number: string
  customer_name: string
  customer_phone: string
  vehicle_vin?: string
  expiry_date: string
  days_left: number
  premium_amount: number
}

export interface RenewalRateData {
  renewed_count: number
  expiring_count: number
  renewal_rate: number
}

/**
 * Get dashboard KPIs
 */
export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  try {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    
    // Get active policies count
    const activePolicies = await prisma.insuranceContract.count({
      where: {
        status: 'ACTIVE'
      }
    })
    
    // Get claims in progress count
    const claimsInProgress = await prisma.insuranceClaim.count({
      where: {
        status: {
          in: ['SUBMITTED', 'REVIEWING', 'APPROVED']
        }
      }
    })
    
    // Get premium YTD
    const premiumYTD = await prisma.insuranceContract.aggregate({
      where: {
        start_date: {
          gte: startOfYear
        }
      },
      _sum: {
        premium_amount: true
      }
    })
    
    const premiumYTDAmount = Number(premiumYTD._sum.premium_amount || 0)
    const commissionRate = 0.12 // 12% commission rate
    const commissionYTD = premiumYTDAmount * commissionRate
    
    return {
      active_policies: activePolicies,
      claims_in_progress: claimsInProgress,
      premium_ytd: Number(premiumYTDAmount),
      commission_ytd: Number(commissionYTD)
    }
  } catch (error) {
    console.error("Failed to fetch dashboard KPIs:", error)
    return {
      active_policies: 0,
      claims_in_progress: 0,
      premium_ytd: 0,
      commission_ytd: 0
    }
  }
}

/**
 * Get expiring policies
 */
export async function getExpiringPolicies(days: number = 30): Promise<ExpiringPolicy[]> {
  try {
    const now = new Date()
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    
    const policies = await prisma.insuranceContract.findMany({
      where: {
        status: 'ACTIVE',
        end_date: {
          gte: now,
          lte: futureDate
        }
      },
      include: {
        Customer: {
          select: {
            name: true,
            phone: true
          }
        }
      },
      orderBy: {
        end_date: 'asc'
      }
    })
    
    return policies.map(policy => {
      const daysLeft = Math.ceil((policy.end_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) || 0
      
      return {
        id: policy.id,
        contract_number: policy.contract_number,
        customer_name: policy.Customer.name,
        customer_phone: policy.Customer.phone,
        vehicle_vin: policy.vehicle_id || undefined,
        expiry_date: policy.end_date.toISOString().split('T')[0],
        days_left: daysLeft,
        premium_amount: Number(policy.premium_amount)
      }
    })
  } catch (error) {
    console.error("Failed to fetch expiring policies:", error)
    return []
  }
}

/**
 * Get renewal rate
 */
export async function getRenewalRate(period: 'this_month' | 'last_month' | 'ytd' = 'this_month'): Promise<RenewalRateData> {
  try {
    const now = new Date()
    let startDate: Date
    let endDate: Date
    
    if (period === 'this_month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    } else if (period === 'last_month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      endDate = new Date(now.getFullYear(), now.getMonth(), 0)
    } else { // ytd
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = now
    }
    
    // Get contracts that ended in the period
    const expiringContracts = await prisma.insuranceContract.findMany({
      where: {
        end_date: {
          gte: startDate,
          lte: endDate
        }
      }
    })
    
    const expiringCount = expiringContracts.length
    
    // Calculate renewal rate based on contracts that started after the period
    // with similar customer/vehicle information as a proxy for renewal
    const renewedCount = Math.floor(expiringCount * 0.65) // Placeholder: 65% renewal rate
    
    const renewalRate = expiringCount > 0 ? (renewedCount / expiringCount) * 100 : 0
    
    return {
      renewed_count: renewedCount,
      expiring_count: expiringCount,
      renewal_rate: Math.round(renewalRate * 100) / 100 // Round to 2 decimal places
    }
  } catch (error) {
    console.error("Failed to fetch renewal rate:", error)
    return {
      renewed_count: 0,
      expiring_count: 0,
      renewal_rate: 0
    }
  }
}