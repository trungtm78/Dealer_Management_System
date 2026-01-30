
export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type RepairStatus = 'PENDING' | 'DIAGNOSING' | 'WAITING_PARTS' | 'IN_PROGRESS' | 'QUALITY_CHECK' | 'COMPLETED' | 'DELIVERED';

export interface ServiceAppointmentDTO {
    id: string;
    customerId: string;
    customerName?: string; // Derived
    vehicleInfo: any;
    appointmentDate: string; // ISO
    appointmentTime: string;
    serviceType: string;
    status: AppointmentStatus;
    notes?: string | null;
    createdAt: string;
    assignedTo?: {
        id: string;
        name: string;
    } | null;
}

export interface CreateAppointmentInput {
    customerId: string;
    vehicleInfo: any;
    appointmentDate: Date;
    appointmentTime: string;
    serviceType: string;
    notes?: string;
    assignedToId?: string;
}

export interface RepairOrderDTO {
    id: string;
    orderNumber: string;
    customerId: string;
    customerName?: string;
    vehicleInfo: any;
    symptoms: string;
    diagnosis?: string | null;
    partsUsed?: any;
    laborHours?: number | null;
    totalCost?: number | null;
    status: RepairStatus;
    technicianId?: string | null;
    technicianName?: string;
    createdAt: string;
}

export interface CreateRepairOrderInput {
    customerId: string;
    vehicleInfo: any;
    symptoms: string;
    technicianId?: string;
}

export interface UpdateRepairOrderInput {
    diagnosis?: string;
    partsUsed?: any;
    laborHours?: number;
    totalCost?: number;
    status?: RepairStatus;
    technicianId?: string;
}

export interface UpdateAppointmentInput extends Partial<CreateAppointmentInput> {
    status?: AppointmentStatus;
}

export type QuoteStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED' | 'CONVERTED';

export interface ServiceQuoteDTO {
    id: string;
    quoteNumber: string;
    customerId: string;
    customerName?: string; // Derived
    customerPhone?: string; // Derived
    vehicleInfo: {
        model: string;
        plateNumber: string;
    };
    advisorId: string;
    advisorName?: string;
    services: any[]; // JSON
    parts: any[]; // JSON
    totalLabor: number;
    totalParts: number;
    subTotal: number;
    vat: number;
    totalAmount: number;
    status: QuoteStatus;
    expiryDate: string;
    notes?: string;
    createdAt: string;
}

export interface CreateServiceQuoteInput {
    customerId: string;
    vehicleInfo: {
        model: string;
        plateNumber: string;
    };
    advisorId: string;
    services: any[];
    parts: any[];
    expiryDate: Date | string;
    notes?: string;
}

export interface UpdateServiceQuoteInput extends Partial<CreateServiceQuoteInput> {
    status?: QuoteStatus;
}
