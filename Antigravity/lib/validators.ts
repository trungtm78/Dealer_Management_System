/**
 * Generic Validation Middleware
 * Validates common patterns across all entities
 */

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export const ValidationRules = {
    // Email validation
    email: (value: string) => {
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            throw new ValidationError('Email không đúng định dạng');
        }
    },

    // Phone number validation (Vietnam: 10 digits)
    phone: (value: string) => {
        if (!value || !/^\d{10}$/.test(value)) {
            throw new ValidationError('Số điện thoại phải có 10 chữ số');
        }
    },

    // Decimal validation (positive)
    positiveDecimal: (value: number, fieldName: string) => {
        if (isNaN(value) || value <= 0) {
            throw new ValidationError(`${fieldName} phải là số dương`);
        }
    },

    // Non-negative decimal
    nonNegativeDecimal: (value: number, fieldName: string) => {
        if (isNaN(value) || value < 0) {
            throw new ValidationError(`${fieldName} không thể là số âm`);
        }
    },

    // Required string
    requiredString: (value: string, fieldName: string) => {
        if (!value || !value.trim()) {
            throw new ValidationError(`${fieldName} là bắt buộc`);
        }
    },

    // Date not in future
    pastDateOnly: (value: Date, fieldName: string) => {
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date > today) {
            throw new ValidationError(`${fieldName} không thể ở tương lai`);
        }
    },

    // Date not in past
    futureDateOnly: (value: Date, fieldName: string) => {
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date < today) {
            throw new ValidationError(`${fieldName} không thể ở quá khứ`);
        }
    },

    // Enum validation
    enumValue: (value: string, allowedValues: string[], fieldName: string) => {
        if (!allowedValues.includes(value)) {
            throw new ValidationError(`${fieldName} không hợp lệ. Các giá trị hợp lệ: ${allowedValues.join(', ')}`);
        }
    },

    // String length
    stringLength: (value: string, min: number, max: number, fieldName: string) => {
        if (value && (value.length < min || value.length > max)) {
            throw new ValidationError(`${fieldName} phải từ ${min} đến ${max} ký tự`);
        }
    },

    // Required field
    required: (value: any, fieldName: string) => {
        if (value === null || value === undefined || value === '') {
            throw new ValidationError(`${fieldName} là bắt buộc`);
        }
    }
};

export const CommonValidators = {
    /**
     * Validate contact information
     */
    validateContact: (data: { name?: string, phone?: string, email?: string }) => {
        if (data.name) ValidationRules.requiredString(data.name, 'Tên');
        if (data.phone) ValidationRules.phone(data.phone);
        if (data.email) ValidationRules.email(data.email);
    },

    /**
     * Validate monetary amount
     */
    validateAmount: (amount: number, fieldName: string, allowZero: boolean = false) => {
        if (allowZero) {
            ValidationRules.nonNegativeDecimal(amount, fieldName);
        } else {
            ValidationRules.positiveDecimal(amount, fieldName);
        }
    },

    /**
     * Validate date range
     */
    validateDateRange: (startDate: Date, endDate: Date, fieldName: string) => {
        if (new Date(startDate) > new Date(endDate)) {
            throw new ValidationError(`${fieldName} phải bắt đầu trước khi kết thúc`);
        }
    }
};

export default ValidationRules;
