'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface CreateQuotationInput {
    customer_name: string
    customer_phone: string
    customer_email?: string
    customer_id?: string
    model: string
    version: string
    color: string
    base_price: number
    accessories?: string[]
    services?: string[]
    accessories_total?: number
    services_total?: number
    insurance?: number
    registration_tax?: number
    registration_fee?: number
    other_fees?: number
    discount?: number
    promotion_value?: number
    total_price: number
    notes?: string
    status?: 'DRAFT' | 'SENT' | 'APPROVED' | 'CONTRACT' | 'LOST' | 'EXPIRED' | 'DELETED'
    user_id: string
}

/**
 * Create a new quotation
 */
export async function createQuotation(data: CreateQuotationInput) {
    try {
        // ENUM Validation
        const { EnumValidator } = await import('@/middleware/enum_validation');
        const enumValidation = EnumValidator.validateObject('quotations', data);
        
        if (!enumValidation.valid) {
            return { 
                success: false, 
                error: "Lỗi xác thực: " + enumValidation.errors.join("; ") 
            };
        }

        // Generate quote number
        const count = await prisma.quotation.count()
        const quoteNumber = `QT/2026/${String(count + 1).padStart(3, '0')}`

        const quotation = await prisma.quotation.create({
            data: {
                quote_number: quoteNumber,
                customer_id: data.customer_id,
                customer_name: data.customer_name,
                customer_phone: data.customer_phone,
                model: data.model,
                version: data.version,
                color: data.color,
                base_price: data.base_price,
                accessories: JSON.stringify(data.accessories || []),
                services: JSON.stringify(data.services || []),
                insurance: data.insurance || 0,
                registration_tax: data.registration_tax || 0,
                registration_fee: data.registration_fee || 0,
                other_fees: data.other_fees || 0,
                discount: data.discount || 0,
                promotion_value: data.promotion_value || 0,
                total_price: data.total_price,
                created_by_id: data.user_id,
                status: data.status || 'DRAFT'
            },
            include: {
                customer: true,
                createdBy: true
            }
        })

        revalidatePath('/sales/quotations')
        return { success: true, data: quotation }
    } catch (error) {
        console.error('Failed to create quotation:', error)
        return { success: false, error: 'Không thể tạo báo giá' }
    }
}

/**
 * Get all quotations
 */
export async function getQuotations() {
    try {
        const quotations = await prisma.quotation.findMany({
            include: {
                customer: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        })

return quotations.map((q: any) => ({
            ...q,
            created_at: q.created_at.toISOString(),
            updated_at: q.updated_at.toISOString(),
            valid_until: q.valid_until?.toISOString()
        }))
    } catch (error) {
        console.error('Failed to fetch quotations:', error)
        return []
    }
}

/**
 * Get a single quotation by ID
 */
export async function getQuotation(id: string) {
    try {
        const quotation = await prisma.quotation.findUnique({
            where: { id },
            include: {
                customer: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        if (!quotation) return null

return {
            ...quotation,
            created_at: quotation.created_at.toISOString(),
            updated_at: quotation.updated_at.toISOString(),
            valid_until: quotation.valid_until?.toISOString()
        }
    } catch (error) {
        console.error('Failed to fetch quotation:', error)
        return null
    }
}

/**
 * Update quotation status
 */
export async function updateQuotationStatus(id: string, status: 'DRAFT' | 'SENT' | 'APPROVED' | 'CONTRACT' | 'LOST' | 'EXPIRED') {
    try {
        const quotation = await prisma.quotation.update({
            where: { id },
            data: { status }
        })

        revalidatePath('/sales/quotations')
        return { success: true, data: quotation }
    } catch (error) {
        console.error('Failed to update quotation status:', error)
        return { success: false, error: 'Không thể cập nhật trạng thái' }
    }
}

/**
 * Update quotation
 */
export async function updateQuotation(id: string, data: Partial<CreateQuotationInput>) {
    try {
const quotation = await prisma.quotation.update({
            where: { id },
            data: {
                customer_name: data.customer_name,
                customer_phone: data.customer_phone,
                model: data.model,
                version: data.version,
                color: data.color,
                base_price: data.base_price,
                accessories: data.accessories ? JSON.stringify(data.accessories) : undefined,
                services: data.services ? JSON.stringify(data.services) : undefined,
                insurance: data.insurance,
                registration_tax: data.registration_tax,
                registration_fee: data.registration_fee,
                other_fees: data.other_fees,
                discount: data.discount,
                promotion_value: data.promotion_value,
                total_price: data.total_price
            }
        })

        revalidatePath('/sales/quotations')
        return { success: true, data: quotation }
    } catch (error) {
        console.error('Failed to update quotation:', error)
        return { success: false, error: 'Không thể cập nhật báo giá' }
    }
}

/**
 * Delete quotation (soft delete)
 */
export async function deleteQuotation(id: string) {
    try {
        // Check if quotation exists and status = DRAFT (BR-SAL-005)
        const quotation = await prisma.quotation.findUnique({
            where: { id }
        })

        if (!quotation) {
            return { success: false, error: 'Báo giá không tồn tại' }
        }

        if (quotation.status !== 'DRAFT') {
            return { success: false, error: 'Chỉ có thể xóa báo giá ở trạng thái DRAFT' }
        }

        // FK Validation: Check for restricted relationships (especially contracts)
        const { FKValidator } = await import('@/middleware/fk_validation');
        const fkValidation = await FKValidator.validateBeforeDelete('quotations', id);
        
        if (!fkValidation.valid) {
            return { 
                success: false, 
                error: fkValidation.error || "Không thể xóa báo giá vì có bản ghi liên quan đang tồn tại." 
            };
        }

        // Perform cascading delete for related records (if any)
        const cascadeResult = await FKValidator.performCascadingDelete('quotations', id);
        if (!cascadeResult.success) {
            return { success: false, error: cascadeResult.error };
        }

        // Soft delete: UPDATE status = 'DELETED' instead of hard delete
        const updatedQuotation = await prisma.quotation.update({
            where: { id },
            data: { status: 'DELETED' }
        })

        revalidatePath('/sales/quotations')
        return { success: true, data: updatedQuotation }
    } catch (error) {
        console.error('Failed to delete quotation:', error)
        return { success: false, error: 'Không thể xóa báo giá' }
    }
}
