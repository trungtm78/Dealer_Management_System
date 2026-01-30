/**
 * ENUM Validation Middleware
 * Provides application-level ENUM validation since SQLite doesn't support ENUM constraints
 */

export interface EnumDefinition {
    [field: string]: string[]
}

export class EnumValidator {
    // ENUM definitions from ERD v1.2
    private static readonly ENUMS: { [table: string]: EnumDefinition } = {
        users: {
            role: ['ADMIN', 'MANAGER', 'SALES', 'SERVICE', 'PARTS', 'ACCOUNTING', 'INSURANCE'],
            status: ['ACTIVE', 'INACTIVE', 'SUSPENDED']
        },
        customers: {
            type: ['INDIVIDUAL', 'COMPANY'],
            status: ['ACTIVE', 'INACTIVE'],
            tier: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND']
        },
        leads: {
            source: ['FACEBOOK', 'WEBSITE', 'WALK_IN', 'HOTLINE', 'REFERRAL', 'OTHER'],
            status: ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'DEAD'],
            customer_type: ['INDIVIDUAL', 'COMPANY']
        },
        quotations: {
            status: ['DRAFT', 'SENT', 'APPROVED', 'CONTRACT', 'LOST', 'EXPIRED', 'DELETED']
        },
        test_drives: {
            status: ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']
        },
        vins: {
            status: ['AVAILABLE', 'ALLOCATED', 'SOLD']
        },
        deposits: {
            status: ['PAID', 'REFUNDED', 'CANCELLED']
        },
        service_appointments: {
            status: ['SCHEDULED', 'CONFIRMED', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
        },
        repair_orders: {
            status: ['PENDING', 'IN_PROGRESS', 'QC', 'READY', 'DELIVERED']
        },
        stock_movements: {
            type: ['IN', 'OUT', 'TRANSFER', 'ADJUSTMENT']
        },
        purchase_orders: {
            status: ['DRAFT', 'SENT', 'CONFIRMED', 'RECEIVED', 'CLOSED']
        },
        insurance_contracts: {
            status: ['ACTIVE', 'EXPIRED', 'CANCELLED']
        },
        insurance_claims: {
            status: ['SUBMITTED', 'REVIEWING', 'APPROVED', 'PAID', 'REJECTED']
        },
        payments: {
            method: ['CASH', 'CARD', 'TRANSFER'],
            status: ['PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED']
        },
        transactions: {
            type: ['DEBIT', 'CREDIT'],
            status: ['DRAFT', 'POSTED', 'CANCELLED']
        },
        activity_logs: {
            type: ['CALL', 'EMAIL', 'MEETING', 'NOTE', 'STAGE_CHANGE']
        },
        reminders: {
            type: ['MAINTENANCE', 'INSPECTION', 'INSURANCE', 'BIRTHDAY'],
            status: ['PENDING', 'SENT', 'COMPLETED', 'CANCELLED']
        },
        complaints: {
            status: ['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
        },
        marketing_campaigns: {
            type: ['SMS', 'EMAIL', 'SOCIAL', 'EVENT', 'ZALO', 'FACEBOOK'],
            status: ['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED']
        },
        pds_checklists: {
            status: ['DRAFT', 'IN_PROGRESS', 'COMPLETED', 'APPROVED', 'REJECTED']
        },
        service_quotes: {
            status: ['DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'CONVERTED']
        }
    }

    /**
     * Validate a single ENUM value
     */
    static validate(table: string, field: string, value: any): boolean {
        const tableEnums = this.ENUMS[table]
        if (!tableEnums) {
            return true // No ENUM validation defined for this table
        }

        const fieldEnums = tableEnums[field]
        if (!fieldEnums) {
            return true // No ENUM validation defined for this field
        }

        // Allow null/undefined values (handled by NOT NULL constraints separately)
        if (value === null || value === undefined) {
            return true
        }

        return fieldEnums.includes(value)
    }

    /**
     * Validate all ENUM values in an object
     */
    static validateObject(table: string, data: any): { valid: boolean; errors: string[] } {
        const errors: string[] = []
        const tableEnums = this.ENUMS[table]

        if (!tableEnums) {
            return { valid: true, errors: [] }
        }

        for (const [field, value] of Object.entries(data)) {
            if (tableEnums[field]) {
                if (!this.validate(table, field, value)) {
                    const validValues = tableEnums[field].join(', ')
                    errors.push(`Trường ${field} có giá trị không hợp lệ '${value}'. Giá trị hợp lệ: ${validValues}`)
                }
            }
        }

        return { valid: errors.length === 0, errors }
    }

    /**
     * Get valid ENUM values for a field
     */
    static getValidValues(table: string, field: string): string[] {
        const tableEnums = this.ENUMS[table]
        return tableEnums?.[field] || []
    }

    /**
     * Check if a table has ENUM validation
     */
    static hasEnumValidation(table: string): boolean {
        return table in this.ENUMS
    }

    /**
     * Get all ENUM fields for a table
     */
    static getEnumFields(table: string): string[] {
        const tableEnums = this.ENUMS[table]
        return tableEnums ? Object.keys(tableEnums) : []
    }
}

/**
 * ENUM Validation Decorator for server actions
 */
export function withEnumValidation(table: string) {
    return function <T extends (...args: any[]) => any>(
        target: any,
        propertyName: string,
        descriptor: TypedPropertyDescriptor<T>
    ) {
        const method = descriptor.value!

        descriptor.value = (async function (this: any, data: any, ...args: any[]) {
            // Validate ENUM values
            const validation = EnumValidator.validateObject(table, data)
            if (!validation.valid) {
                return {
                    success: false,
                    error: 'Lỗi xác thực ENUM: ' + validation.errors.join('; ')
                }
            }

            // Call the original method
            return method.apply(this, [data, ...args])
        }) as any

        return descriptor
    }
}

/**
 * Middleware function for ENUM validation
 */
export async function enumValidationMiddleware(request: Request, table: string, data: any): Promise<{ valid: boolean; error?: string }> {
    const validation = EnumValidator.validateObject(table, data)
    
    if (!validation.valid) {
        return {
            valid: false,
            error: 'Lỗi xác thực ENUM: ' + validation.errors.join('; ')
        }
    }

    return { valid: true }
}