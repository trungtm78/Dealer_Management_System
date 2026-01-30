import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * Foreign Key Validation Middleware
 * Validates foreign key constraints before operations
 */

export interface FKValidationRule {
    table: string
    field: string
    referencedTable: string
    referencedField: string
    onDelete?: 'CASCADE' | 'RESTRICT' | 'SET_NULL'
    checkBeforeDelete?: boolean
}

export interface ValidationResult {
    success: boolean
    valid: boolean
    error?: string
    dependentRecords?: any[]
}

export class FKValidator {
    private static readonly VALIDATION_RULES: FKValidationRule[] = [
        // Customer relationships - Most should CASCADE
        { table: 'interactions', field: 'customer_id', referencedTable: 'customers', referencedField: 'id', onDelete: 'CASCADE' },
        { table: 'quotations', field: 'customer_id', referencedTable: 'customers', referencedField: 'id', onDelete: 'CASCADE' },
        { table: 'test_drives', field: 'customer_id', referencedTable: 'customers', referencedField: 'id', onDelete: 'CASCADE' },
        { table: 'contracts', field: 'customer_id', referencedTable: 'customers', referencedField: 'id', onDelete: 'RESTRICT' }, // Business critical
        { table: 'deposits', field: 'customer_id', referencedTable: 'customers', referencedField: 'id', onDelete: 'CASCADE' },
        { table: 'service_appointments', field: 'customer_id', referencedTable: 'customers', referencedField: 'id', onDelete: 'CASCADE' },
        { table: 'repair_orders', field: 'customer_id', referencedTable: 'customers', referencedField: 'id', onDelete: 'CASCADE' },
        { table: 'insurance_contracts', field: 'customer_id', referencedTable: 'customers', referencedField: 'id', onDelete: 'CASCADE' },
        { table: 'invoices', field: 'customer_id', referencedTable: 'customers', referencedField: 'id', onDelete: 'CASCADE' },
        { table: 'complaints', field: 'customer_id', referencedTable: 'customers', referencedField: 'id', onDelete: 'CASCADE' },
        { table: 'reminders', field: 'customer_id', referencedTable: 'customers', referencedField: 'id', onDelete: 'CASCADE' },
        { table: 'loyalty_transactions', field: 'customer_id', referencedTable: 'customers', referencedField: 'id', onDelete: 'CASCADE' },
        { table: 'service_quotes', field: 'customer_id', referencedTable: 'customers', referencedField: 'id', onDelete: 'CASCADE' },

        // Quotation relationships - Business critical, mostly RESTRICT
        { table: 'contracts', field: 'quotation_id', referencedTable: 'quotations', referencedField: 'id', onDelete: 'RESTRICT' },

        // Contract relationships - Business critical
        { table: 'vins', field: 'allocated_to_contract_id', referencedTable: 'contracts', referencedField: 'id', onDelete: 'SET_NULL' },
        { table: 'deposits', field: 'contract_id', referencedTable: 'contracts', referencedField: 'id', onDelete: 'CASCADE' },
        { table: 'pds_checklists', field: 'contract_id', referencedTable: 'contracts', referencedField: 'id', onDelete: 'CASCADE' },

        // User relationships - Audit/history use SET_NULL, operational use RESTRICT
        { table: 'activity_logs', field: 'user_id', referencedTable: 'users', referencedField: 'id', onDelete: 'SET_NULL' },
        { table: 'interactions', field: 'user_id', referencedTable: 'users', referencedField: 'id', onDelete: 'SET_NULL' },
        { table: 'quotations', field: 'created_by_id', referencedTable: 'users', referencedField: 'id', onDelete: 'RESTRICT' },
        { table: 'contracts', field: 'created_by_id', referencedTable: 'users', referencedField: 'id', onDelete: 'RESTRICT' },
        { table: 'stock_movements', field: 'user_id', referencedTable: 'users', referencedField: 'id', onDelete: 'SET_NULL' },
        { table: 'transactions', field: 'created_by_id', referencedTable: 'users', referencedField: 'id', onDelete: 'SET_NULL' },

        // Service relationships
        { table: 'repair_orders', field: 'appointment_id', referencedTable: 'service_appointments', referencedField: 'id', onDelete: 'SET_NULL' },
        { table: 'ro_line_items', field: 'ro_id', referencedTable: 'repair_orders', referencedField: 'id', onDelete: 'CASCADE' },
        { table: 'work_logs', field: 'ro_id', referencedTable: 'repair_orders', referencedField: 'id', onDelete: 'CASCADE' },
        { table: 'qc_checklists', field: 'ro_id', referencedTable: 'repair_orders', referencedField: 'id', onDelete: 'CASCADE' },
        { table: 'bay_assignments', field: 'repair_order_id', referencedTable: 'repair_orders', referencedField: 'id', onDelete: 'CASCADE' },

        // Parts relationships
        { table: 'parts', field: 'supplier_id', referencedTable: 'suppliers', referencedField: 'id', onDelete: 'SET_NULL' },
        { table: 'stock_movements', field: 'part_id', referencedTable: 'parts', referencedField: 'id', onDelete: 'CASCADE' },
        { table: 'po_line_items', field: 'part_id', referencedTable: 'parts', referencedField: 'id', onDelete: 'RESTRICT' },
        { table: 'stock_take_items', field: 'part_id', referencedTable: 'parts', referencedField: 'id', onDelete: 'CASCADE' },

        // Insurance relationships
        { table: 'insurance_claims', field: 'contract_id', referencedTable: 'insurance_contracts', referencedField: 'id', onDelete: 'RESTRICT' },

        // Accounting relationships
        { table: 'payments', field: 'invoice_id', referencedTable: 'invoices', referencedField: 'id', onDelete: 'CASCADE' },
    ]

    /**
     * Validate foreign key constraints before deletion
     */
    static async validateBeforeDelete(table: string, id: string): Promise<ValidationResult> {
        const rules = this.VALIDATION_RULES.filter(rule => rule.referencedTable === table)
        
        if (rules.length === 0) {
            return { success: true, valid: true }
        }

        const dependentRecords: any[] = []
        const restrictRules = rules.filter(rule => rule.onDelete === 'RESTRICT')

        for (const rule of restrictRules) {
            try {
                const count = await (prisma as any)[rule.table].count({
                    where: {
                        [rule.field]: id
                    }
                })

                if (count > 0) {
                    const records = await (prisma as any)[rule.table].findMany({
                        where: {
                            [rule.field]: id
                        },
                        take: 5 // Limit to 5 records for error message
                    })

                    dependentRecords.push(...records.map((record: any) => ({
                        table: rule.table,
                        field: rule.field,
                        record: record
                    })))
                }
            } catch (error) {
                console.error(`FK validation error for ${rule.table}.${rule.field}:`, error)
            }
        }

        if (dependentRecords.length > 0) {
            return {
                success: false,
                valid: false,
                error: `Không thể xóa bản ghi vì có ${dependentRecords.length} bản ghi liên quan đang tồn tại.`,
                dependentRecords
            }
        }

        return { success: true, valid: true }
    }

    /**
     * Perform cascading delete operations
     */
    static async performCascadingDelete(table: string, id: string): Promise<{ success: boolean; error?: string }> {
        const cascadeRules = this.VALIDATION_RULES.filter(rule => 
            rule.referencedTable === table && rule.onDelete === 'CASCADE'
        )

        const setNullRules = this.VALIDATION_RULES.filter(rule => 
            rule.referencedTable === table && rule.onDelete === 'SET_NULL'
        )

        try {
            // Perform CASCADE deletes
            for (const rule of cascadeRules) {
                await (prisma as any)[rule.table].deleteMany({
                    where: {
                        [rule.field]: id
                    }
                })
            }

            // Perform SET NULL operations
            for (const rule of setNullRules) {
                await (prisma as any)[rule.table].updateMany({
                    where: {
                        [rule.field]: id
                    },
                    data: {
                        [rule.field]: null
                    }
                })
            }

            return { success: true }
        } catch (error) {
            console.error('Cascading delete error:', error)
            return { 
                success: false, 
                error: 'Lỗi khi thực hiện cascading delete: ' + (error as Error).message 
            }
        }
    }

    /**
     * Complete delete operation with validation and cascading
     */
    static async safeDelete(table: string, id: string): Promise<ValidationResult> {
        // Step 1: Validate foreign key constraints
        const validation = await this.validateBeforeDelete(table, id)
        if (!validation.valid) {
            return validation
        }

        // Step 2: Perform cascading operations
        const cascadeResult = await this.performCascadingDelete(table, id)
        if (!cascadeResult.success) {
            return { success: false, valid: false, error: cascadeResult.error }
        }

        // Step 3: Delete the main record
        try {
            await (prisma as any)[table].delete({
                where: { id }
            })

            return { success: true, valid: true }
        } catch (error) {
            console.error(`Delete error for ${table}:`, error)
            return { 
                success: false, 
                valid: false,
                error: `Lỗi khi xóa bản ghi ${table}: ` + (error as Error).message 
            }
        }
    }
}

/**
 * Middleware function for foreign key validation
 */
export async function fkValidationMiddleware(request: NextRequest): Promise<NextResponse | null> {
    // This middleware can be extended for specific routes that need FK validation
    return null
}