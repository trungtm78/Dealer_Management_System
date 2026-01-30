
export type QuotationStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'CONTRACT' | 'LOST' | 'EXPIRED';

export enum DepositStatus {
    PAID = 'PAID',
    REFUNDED = 'REFUNDED',
    CANCELLED = 'CANCELLED'
}

export enum PDSStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    PASSED = 'PASSED',
    FAILED = 'FAILED',
    REWORK = 'REWORK'
}

export interface QuotationDTO {
    id: string;
    quoteNumber: string;
    customerId?: string | null;
    customerName: string;
    customerPhone: string;
    customerEmail?: string | null;
    model: string;
    version: string;
    color: string;
    basePrice: number;
    accessories: any; // Json
    services: any; // Json
    accessoriesTotal: number;
    servicesTotal: number;
    insurance: number;
    registrationTax: number;
    registration: number;
    otherFees: number;
    discount: number;
    promotionValue: number;
    totalPrice: number;
    status: QuotationStatus;
    validUntil?: string | null; // ISO Date
    notes?: string | null;
    createdAt: string; // ISO Date
    updatedAt: string; // ISO Date
    createdBy?: {
        id: string;
        name: string;
    };
}

export interface CreateQuotationInput {
    customerId?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    model: string;
    version: string;
    color: string;
    basePrice: number;
    accessories: string[]; // List of IDs
    services: string[]; // List of IDs
    accessoriesTotal: number;
    servicesTotal: number;
    insurance: number;
    registrationTax: number;
    registration: number;
    otherFees: number;
    discount: number;
    promotionValue: number;
    totalPrice: number;
    userId: string;
    validUntil?: Date;
    notes?: string;
}

export interface UpdateQuotationInput extends Partial<CreateQuotationInput> {
    status?: QuotationStatus;
}

// --- DEPOSITS ---
export interface DepositDTO {
    id: string;
    receiptNumber: string;
    customerId?: string | null;
    customerName: string;
    amount: number;
    contractNumber?: string | null;
    paymentMethod?: string | null;
    status: DepositStatus;
    notes?: string | null;
    createdAt: string;
    receivedBy?: {
        id: string;
        name: string;
    } | null;
}

export interface CreateDepositInput {
    customerId?: string;
    customerName: string;
    amount: number;
    contractNumber?: string;
    paymentMethod?: string;
    notes?: string;
    receivedById: string;
}

// --- PDS ---
export interface PDSDTO {
    id: string;
    contractId: string;
    vinId: string;
    exteriorCheck?: Record<string, any>;
    interiorCheck?: Record<string, any>;
    mechanicalCheck?: Record<string, any>;
    documentationCheck?: Record<string, any>;
    photos?: string[];
    inspectorId: string;
    customerSignature?: string;
    inspectorSignature?: string;
    deliveryDate?: string | null;
    status: PDSStatus;
    issues?: string | null;
    completedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    contract?: {
        id: string;
        contractNumber: string;
    };
    vin?: {
        id: string;
        model: string;
        color: string;
    };
    inspector?: {
        id: string;
        name: string;
    };
}

export interface CreatePDSInput {
    contractId: string;
    vinId: string;
    inspectorId: string;
    exteriorCheck?: Record<string, any>;
    interiorCheck?: Record<string, any>;
    mechanicalCheck?: Record<string, any>;
    documentationCheck?: Record<string, any>;
    photos?: string[];
    customerSignature?: string;
    inspectorSignature?: string;
    deliveryDate?: string;
}

export interface UpdatePDSInput {
    status?: PDSStatus;
    inspectorId?: string;
    exteriorCheck?: Record<string, any>;
    interiorCheck?: Record<string, any>;
    mechanicalCheck?: Record<string, any>;
    documentationCheck?: Record<string, any>;
    photos?: string[];
    customerSignature?: string;
    inspectorSignature?: string;
    deliveryDate?: string;
    issues?: string;
}
