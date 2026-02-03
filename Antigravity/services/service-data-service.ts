// Removed uuid import
export type ServiceStatus = 'SCHEDULED' | 'ARRIVED' | 'IN_PROGRESS' | 'QC_PENDING' | 'WASHING' | 'READY' | 'DELIVERED';

export type PaymentStatus = 'PENDING' | 'PAID';

export interface Appointment {
    id: string;
    customerName: string;
    phone: string;
    plateNumber: string;
    vehicleModel: string;
    date: string;
    time: string;
    serviceType: 'PERIODIC' | 'REPAIR' | 'WARRANTY' | 'OTHER';
    status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
    notes?: string;
    advisor?: string;
}

export interface RepairOrder {
    roNumber: string; // RO-2024-XXX
    appointmentId?: string;
    customerName: string;
    phone: string;
    plateNumber: string;
    vehicleModel: string;
    advisor: string;
    technician?: string;
    status: ServiceStatus;
    paymentStatus: PaymentStatus;
    checkInTime: string;
    estimatedDeliveryTime: string;
    services: ServiceJob[];
    parts: ServicePart[];
    totalAmount: number;
    notes?: string;
    qcInspector?: string;
    qcNote?: string;
}

export interface ServiceJob {
    id: string;
    name: string;
    laborCost: number;
    hours: number;
}

export interface ServicePart {
    id: string;
    partNumber: string;
    name: string;
    quantity: number;
    unitPrice: number;
}

export interface Technician {
    id: string;
    name: string;
    skillLevel: 'MASTER' | 'PRO' | 'JUNIOR';
    status: 'BUSY' | 'IDLE' | 'OFF';
    currentRo?: string;
}

// Mock Data
let appointments: Appointment[] = [
    { id: '1', customerName: 'Nguyen Van A', phone: '0901112222', plateNumber: '30H-12345', vehicleModel: 'Honda CR-V', date: '2026-01-15', time: '08:30', serviceType: 'PERIODIC', status: 'CONFIRMED', advisor: 'Tran Van Bao' },
    { id: '2', customerName: 'Le Thi B', phone: '0903334444', plateNumber: '29A-56789', vehicleModel: 'Honda City', date: '2026-01-15', time: '09:00', serviceType: 'REPAIR', status: 'CONFIRMED', advisor: 'Tran Van Bao' },
    { id: '3', customerName: 'Doan Van C', phone: '0905556666', plateNumber: '30G-99999', vehicleModel: 'Honda Civic', date: '2026-01-16', time: '14:00', serviceType: 'WARRANTY', status: 'CONFIRMED' }
];

let repairOrders: RepairOrder[] = [
    {
        roNumber: 'RO-2026-001', appointmentId: '1', customerName: 'Nguyen Van A', phone: '0901112222', plateNumber: '30H-12345', vehicleModel: 'Honda CR-V',
        advisor: 'Tran Van Bao', technician: 'Tech A', status: 'IN_PROGRESS', paymentStatus: 'PENDING',
        checkInTime: '2026-01-15T08:15:00', estimatedDeliveryTime: '2026-01-15T11:00:00',
        services: [{ id: 'j1', name: 'Bảo dưỡng 5000km', laborCost: 300000, hours: 1.5 }],
        parts: [{ id: 'p1', partNumber: 'OIL-001', name: 'Dầu máy Honda Fully', quantity: 4, unitPrice: 150000 }],
        totalAmount: 900000,
        notes: 'Khách yêu cầu kiểm tra kỹ phanh'
    }
];

let technicians: Technician[] = [
    { id: 't1', name: 'Nguyen Ky Thuat (Tech A)', skillLevel: 'MASTER', status: 'BUSY', currentRo: 'RO-2026-001' },
    { id: 't2', name: 'Tran Tho May (Tech B)', skillLevel: 'PRO', status: 'IDLE' },
    { id: 't3', name: 'Le Hoc Viec (Tech C)', skillLevel: 'JUNIOR', status: 'IDLE' }
];

export const ServiceDataService = {
    // Appointment Methods
    getAppointments: () => [...appointments],
    createAppointment: (data: Omit<Appointment, 'id' | 'status'>) => {
        const newItem: Appointment = { ...data, id: crypto.randomUUID(), status: 'CONFIRMED' };
        appointments.push(newItem);
        return newItem;
    },
    updateAppointmentStatus: (id: string, status: Appointment['status']) => {
        const idx = appointments.findIndex(a => a.id === id);
        if (idx !== -1) appointments[idx].status = status;
    },

    // RO Methods
    getROs: () => [...repairOrders],
    getROByNumber: (roNumber: string) => repairOrders.find(r => r.roNumber === roNumber),
    createROFromAppointment: (apptId: string) => {
        const appt = appointments.find(a => a.id === apptId);
        if (!appt) throw new Error("Appointment not found");

        const newRO: RepairOrder = {
            roNumber: `RO-2026-${String(repairOrders.length + 1).padStart(3, '0')}`,
            appointmentId: appt.id,
            customerName: appt.customerName,
            phone: appt.phone,
            plateNumber: appt.plateNumber,
            vehicleModel: appt.vehicleModel,
            advisor: appt.advisor || 'Receptionist',
            status: 'ARRIVED',
            paymentStatus: 'PENDING',
            checkInTime: new Date().toISOString(),
            estimatedDeliveryTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // +2h
            services: [],
            parts: [],
            totalAmount: 0
        };
        repairOrders.push(newRO);
        // Update Appt Status
        ServiceDataService.updateAppointmentStatus(apptId, 'COMPLETED');
        return newRO;
    },
    updateROStatus: (roNumber: string, status: ServiceStatus) => {
        const ro = repairOrders.find(r => r.roNumber === roNumber);
        if (ro) {
            ro.status = status;
            // Validate Tech logic simplistic
            if (status === 'IN_PROGRESS' && !ro.technician) {
                // Auto assign idle tech if none? Or allow manual.
            }
        }
    },
    assignTech: (roNumber: string, techId: string) => {
        const ro = repairOrders.find(r => r.roNumber === roNumber);
        const tech = technicians.find(t => t.id === techId);
        if (ro && tech) {
            ro.technician = tech.name;
            tech.status = 'BUSY';
            tech.currentRo = roNumber;
        }
    },

    // Tech Methods
    getTechnicians: () => [...technicians],

    // Stats
    getStats: () => ({
        todayAppts: appointments.filter(a => a.date === '2026-01-15').length,
        inProgress: repairOrders.filter(r => r.status === 'IN_PROGRESS').length,
        completed: repairOrders.filter(r => r.status === 'READY' || r.status === 'DELIVERED').length,
        revenue: repairOrders.reduce((sum, r) => sum + r.totalAmount, 0)
    }),

    // Quote Methods
    getQuotes: () => [...serviceQuotes],
    getQuoteById: (id: string) => serviceQuotes.find(q => q.id === id),
    getLaborMaster: () => [
        { id: 'L001', name: 'Bảo dưỡng cấp 5.000km', price: 250000, hour: 1.0 },
        { id: 'L002', name: 'Bảo dưỡng cấp 10.000km', price: 450000, hour: 1.8 },
        { id: 'L003', name: 'Thay thế má phanh trước', price: 300000, hour: 1.2 },
        { id: 'L004', name: 'Thay thế má phanh sau', price: 300000, hour: 1.2 },
        { id: 'L005', name: 'Thay dầu động cơ', price: 100000, hour: 0.5 },
        { id: 'L006', name: 'Vệ sinh kim phun', price: 500000, hour: 1.5 },
        { id: 'L007', name: 'Cân bằng động lốp', price: 200000, hour: 0.8 },
        { id: 'L008', name: 'Sơn dặm cản trước', price: 1200000, hour: 4.0 },
    ],
    createQuote: (data: Omit<ServiceQuote, 'id' | 'status' | 'createdDate' | 'totalAmount'>) => {
        const total = data.services.reduce((sum, s) => sum + s.laborCost, 0) +
            data.parts.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);

        const newQuote: ServiceQuote = {
            ...data,
            id: `SQ-2026-${String(serviceQuotes.length + 1).padStart(3, '0')}`,
            status: 'DRAFT',
            createdDate: new Date().toISOString(),
            totalAmount: total
        };
        serviceQuotes.push(newQuote);
        return newQuote;
    },
    updateQuoteStatus: (id: string, status: ServiceQuote['status']) => {
        const q = serviceQuotes.find(item => item.id === id);
        if (q) q.status = status;
    },
    convertQuoteToRO: (id: string) => {
        const quote = serviceQuotes.find(q => q.id === id);
        if (!quote) throw new Error("Quote not found");

        // Logic to create RO from Quote
        const newRO: RepairOrder = {
            roNumber: `RO-2026-${String(repairOrders.length + 1).padStart(3, '0')}`,
            customerName: quote.customerName,
            phone: quote.phone,
            plateNumber: quote.plateNumber,
            vehicleModel: quote.vehicleModel,
            advisor: quote.advisor,
            status: 'ARRIVED',
            paymentStatus: 'PENDING',
            checkInTime: new Date().toISOString(),
            estimatedDeliveryTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            services: [...quote.services],
            parts: [...quote.parts],
            totalAmount: quote.totalAmount,
            notes: `Converted from Quote ${id}. ${quote.notes || ''}`
        };
        repairOrders.push(newRO);
        quote.status = 'CONVERTED';
        return newRO;
    }
};

export interface ServiceQuote {
    id: string;
    customerName: string;
    phone: string;
    plateNumber: string;
    vehicleModel: string;
    advisor: string;
    status: 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED' | 'CONVERTED';
    createdDate: string;
    expiryDate: string;
    services: ServiceJob[];
    parts: ServicePart[];
    totalAmount: number;
    notes?: string;
}

let serviceQuotes: ServiceQuote[] = [
    {
        id: 'SQ-2026-001',
        customerName: 'Dang Le Nguyen Vu',
        phone: '0988777666',
        plateNumber: '51K-888.88',
        vehicleModel: 'Honda Civic Type R',
        advisor: 'Tran Van Bao',
        status: 'SENT',
        createdDate: '2026-01-14T09:00:00',
        expiryDate: '2026-01-21',
        services: [{ id: 'j1', name: 'Thay thế bộ ly hợp', laborCost: 2500000, hours: 4 }],
        parts: [{ id: 'p1', partNumber: 'CLUTCH-KIT-01', name: 'Bộ ly hợp Exedy', quantity: 1, unitPrice: 8500000 }],
        totalAmount: 11000000,
        notes: 'Khách yêu cầu hàng chính hãng'
    },
    {
        id: 'SQ-2026-002',
        customerName: 'Phamh Nhat Vuong',
        phone: '0912345678',
        plateNumber: '30E-111.11',
        vehicleModel: 'Honda CR-V',
        advisor: 'Nguyen Thi Thu',
        status: 'DRAFT',
        createdDate: '2026-01-15T08:30:00',
        expiryDate: '2026-01-22',
        services: [{ id: 'j2', name: 'Sơn dặm cản trước', laborCost: 1200000, hours: 24 }],
        parts: [],
        totalAmount: 1200000,
        notes: ''
    }
];
