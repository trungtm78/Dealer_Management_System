
export interface Invoice {
    id: string;
    entityName: string; // Customer or Supplier Name
    invoiceNumber: string;
    date: string;
    dueDate: string;
    amount: number;
    paidAmount: number;
    status: 'PENDING' | 'OVERDUE' | 'PAID';
    type: 'RECEIVABLE' | 'PAYABLE'; // AR or AP
}

export interface Asset {
    id: string;
    code: string;
    name: string;
    purchaseDate: string;
    department: string;
    cost: number;
    lifeYears: number;
    status: 'ACTIVE' | 'DISPOSED';
}

export interface FinancialMetric {
    period: string;
    revenue: number;
    expense: number;
    profit: number;
}

// Mock Data
let INVOICES_DATA: Invoice[] = [
    // Receivables (AR)
    { id: 'ar1', entityName: "Công Ty TNHH Vận Tải ABC", invoiceNumber: "HD00123", date: "2024-01-15", dueDate: "2024-02-15", amount: 154000000, paidAmount: 50000000, status: "OVERDUE", type: 'RECEIVABLE' },
    { id: 'ar2', entityName: "Anh Nguyễn Văn X", invoiceNumber: "HD00125", date: "2024-01-20", dueDate: "2024-02-20", amount: 25000000, paidAmount: 0, status: "PENDING", type: 'RECEIVABLE' },
    { id: 'ar3', entityName: "Công Ty Xây Dựng XYZ", invoiceNumber: "HD00110", date: "2023-12-10", dueDate: "2024-01-10", amount: 500000000, paidAmount: 200000000, status: "OVERDUE", type: 'RECEIVABLE' },
    { id: 'ar4', entityName: "Chị Lê Thị Y", invoiceNumber: "HD00130", date: "2024-02-05", dueDate: "2024-03-05", amount: 12000000, paidAmount: 12000000, status: "PAID", type: 'RECEIVABLE' },

    // Payables (AP)
    { id: 'ap1', entityName: "Honda Vietnam", invoiceNumber: "INV-998877", date: "2024-01-15", dueDate: "2024-02-28", amount: 2500000000, paidAmount: 0, status: "PENDING", type: 'PAYABLE' },
    { id: 'ap2', entityName: "Denso Parts", invoiceNumber: "INV-554433", date: "2023-12-20", dueDate: "2024-01-30", amount: 150000000, paidAmount: 0, status: "OVERDUE", type: 'PAYABLE' },
    { id: 'ap3', entityName: "Castrol Oil", invoiceNumber: "INV-112233", date: "2024-01-25", dueDate: "2024-02-15", amount: 80000000, paidAmount: 0, status: "PENDING", type: 'PAYABLE' },
];

let ASSETS_DATA: Asset[] = [
    { id: 'as1', code: "TSCĐ001", name: "Xe ô tô Toyota Fortuner", purchaseDate: "2020-05-15", cost: 1200000000, lifeYears: 10, department: "Ban Giám Đốc", status: 'ACTIVE' },
    { id: 'as2', code: "TSCĐ002", name: "Máy chủ Dell PowerEdge", purchaseDate: "2022-01-10", cost: 150000000, lifeYears: 5, department: "IT", status: 'ACTIVE' },
    { id: 'as3', code: "TSCĐ003", name: "Hệ thống Cầu Nâng", purchaseDate: "2021-11-20", cost: 800000000, lifeYears: 8, department: "Xưởng Dịch Vụ", status: 'ACTIVE' },
];

export const AccountingDataService = {
    getReceivables: () => INVOICES_DATA.filter(i => i.type === 'RECEIVABLE'),

    getPayables: () => INVOICES_DATA.filter(i => i.type === 'PAYABLE'),

    getAssets: () => ASSETS_DATA,

    payInvoice: (id: string, fullPayment: boolean = true) => {
        const inv = INVOICES_DATA.find(i => i.id === id);
        if (inv) {
            if (fullPayment) {
                inv.paidAmount = inv.amount;
                inv.status = 'PAID';
            }
            return true;
        }
        return false;
    },

    addAsset: (asset: Omit<Asset, 'id'>) => {
        const newAsset = { ...asset, id: crypto.randomUUID() };
        ASSETS_DATA.push(newAsset);
        return newAsset;
    },

    // Mock Methods for Dashboard
    getFinancialSummary: () => {
        // Mock dynamic calculation based on some logic if needed, or static for now
        return {
            revenue: 4523189000,
            expense: 2350000000,
            netProfit: 1203000000,
            cashFlow: 573000000
        };
    }
};
