export interface LeadFormState {
    name: string;
    phone: string;
    email: string;
    source: string;
    model: string;
}

export type ValidationResult = {
    isValid: boolean;
    errors: Record<string, string>;
};

export const validateLeadForm = (data: LeadFormState): ValidationResult => {
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim().length === 0) {
        errors.name = "Tên khách hàng là bắt buộc";
    }

    if (!data.phone || data.phone.trim().length === 0) {
        errors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^\d{10,11}$/.test(data.phone.replace(/\s/g, ''))) {
        // Simple regex for 10-11 digits, ignoring spaces
        errors.phone = "Số điện thoại không hợp lệ (cần 10-11 số)";
    }

    if (!data.model || data.model.trim().length === 0) {
        errors.model = "Vui lòng chọn dòng xe quan tâm";
    }

    if (data.email && data.email.trim().length > 0) {
        // Basic email regex
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = "Email không hợp lệ";
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
