
export interface Part {
    id: string;
    partNumber: string;
    name: string;
    category: 'CONSUMABLE' | 'SPARE_PART' | 'ACCESSORY' | 'TIRE' | 'OIL';
    unit: string;
    price: number;
    cost: number;
    stock: number;
    minStock: number; // Safety Stock
    location: string; // Bin Location
    supplierId: string;
    status: 'ACTIVE' | 'DISCONTINUED';
    compatibility: string[]; // List of compatible car models
}

export interface Transaction {
    id: string;
    type: 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT';
    partId: string;
    quantity: number;
    date: string; // ISO String
    reference: string; // PO Number or RO Number
    performedBy: string;
    notes?: string;
}

export interface Supplier {
    id: string;
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
}

export interface PurchaseOrder {
    id: string;
    poNumber: string;
    supplierId: string;
    date: string;
    expectedDate?: string;
    status: 'DRAFT' | 'PENDING' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
    totalAmount: number;
    items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
    partId: string;
    quantity: number;
    price: number;
}

export interface Backorder {
    id: string;
    partId: string;
    roNumber: string; // Linked Repair Order
    customerName: string;
    quantity: number;
    date: string;
    status: 'OPEN' | 'FULFILLED';
}

const PARTS_DATA: Part[] = [
    {
        id: '1',
        partNumber: '15400-RAF-T01',
        name: 'Oil Filter (Lọc Dầu)',
        category: 'OIL',
        unit: 'Cái',
        price: 250000,
        cost: 150000,
        stock: 120,
        minStock: 50,
        location: 'A1-01',
        supplierId: 'sup1',
        status: 'ACTIVE',
        compatibility: ['CR-V', 'Civic', 'City']
    },
    {
        id: '1b',
        partNumber: '08232-P99-F8M1',
        name: 'Engine Oil 0W-20 (Dầu Nhớt)',
        category: 'OIL',
        unit: 'Lít',
        price: 180000,
        cost: 110000,
        stock: 40,
        minStock: 100, // Warning Level
        location: 'A1-02',
        supplierId: 'sup1',
        status: 'ACTIVE',
        compatibility: ['All']
    },
    {
        id: '2',
        partNumber: '45022-T04-A01',
        name: 'Front Brake Pads (Má Phanh Trước)',
        category: 'SPARE_PART',
        unit: 'Bộ',
        price: 2100000,
        cost: 1400000,
        stock: 15,
        minStock: 10,
        location: 'B2-05',
        supplierId: 'sup2',
        status: 'ACTIVE',
        compatibility: ['CR-V 2020', 'CR-V 2023']
    },
    {
        id: '3',
        partNumber: '80292-TJA-H01',
        name: 'Cabin Air Filter (Lọc Gió Điều Hòa)',
        category: 'CONSUMABLE',
        unit: 'Cái',
        price: 450000,
        cost: 250000,
        stock: 5,
        minStock: 20, // Low Stock
        location: 'A2-03',
        supplierId: 'sup2',
        status: 'ACTIVE',
        compatibility: ['City 2021', 'City 2023']
    },
];

const TRANSACTIONS_DATA: Transaction[] = [
    {
        id: 't1',
        type: 'INBOUND',
        partId: '1',
        quantity: 100,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        reference: 'PO-2024-001',
        performedBy: 'Kho Thủ A'
    },
    {
        id: 't2',
        type: 'OUTBOUND',
        partId: '1',
        quantity: 1,
        date: new Date().toISOString(),
        reference: 'RO-2024-1001',
        performedBy: 'KTV B'
    }
];

const SUPPLIERS_DATA: Supplier[] = [
    { id: 'sup1', name: 'Honda Genuine Parts Vietnam', contactPerson: 'Mr. Linh', phone: '0901234567', email: 'parts@honda.com.vn', address: 'Vĩnh Phúc' },
    { id: 'sup2', name: 'Denso Vietnam', contactPerson: 'Ms. Lan', phone: '0909888777', email: 'sales@denso.com.vn', address: 'Hà Nội' },
];

const PURCHASE_ORDERS: PurchaseOrder[] = [
    {
        id: 'po1',
        poNumber: 'PO-2024-001',
        supplierId: 'sup1',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'RECEIVED',
        totalAmount: 25000000,
        items: [
            { partId: '1', quantity: 100, price: 150000 },
            { partId: '1b', quantity: 50, price: 110000 }
        ]
    },
    {
        id: 'po2',
        poNumber: 'PO-2024-002',
        supplierId: 'sup2',
        date: new Date().toISOString(),
        status: 'PENDING',
        totalAmount: 5000000,
        items: [
            { partId: '3', quantity: 20, price: 250000 }
        ]
    }
];

const BACKORDER_DATA: Backorder[] = [
    {
        id: 'bo1',
        partId: '3',
        roNumber: 'RO-2024-1005',
        customerName: 'Nguyễn Văn C',
        quantity: 1,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'OPEN'
    }
];

export const PartsDataService = {
    getParts: () => PARTS_DATA,

    getPartById: (id: string) => PARTS_DATA.find(p => p.id === id),

    getTransactions: () => TRANSACTIONS_DATA.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),

    getSuppliers: () => SUPPLIERS_DATA,

    updateStock: (partId: string, quantity: number, type: 'INBOUND' | 'OUTBOUND', reference: string, performedBy: string) => {
        const part = PARTS_DATA.find(p => p.id === partId);
        if (part) {
            if (type === 'INBOUND') {
                part.stock += quantity;
            } else {
                if (part.stock < quantity) return false; // Not enough stock
                part.stock -= quantity;
            }

            // Log transaction
            TRANSACTIONS_DATA.unshift({
                id: crypto.randomUUID(),
                type,
                partId,
                quantity,
                date: new Date().toISOString(),
                reference,
                performedBy
            });
            return true;
        }
        return false;
    },

    getPurchaseOrders: () => PURCHASE_ORDERS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),

    createPurchaseOrder: (data: Omit<PurchaseOrder, 'id' | 'poNumber' | 'status'>) => {
        const newPO: PurchaseOrder = {
            ...data,
            id: crypto.randomUUID(),
            poNumber: `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            status: 'PENDING'
        };
        PURCHASE_ORDERS.unshift(newPO);
        return newPO;
    },

    receivePurchaseOrder: (poId: string) => {
        const po = PURCHASE_ORDERS.find(p => p.id === poId);
        if (po && po.status !== 'RECEIVED') {
            po.status = 'RECEIVED';
            // Auto update stock
            po.items.forEach(item => {
                PartsDataService.updateStock(item.partId, item.quantity, 'INBOUND', po.poNumber, 'System');
            });
            return true;
        }
        return false;
    },

    getBackorders: () => BACKORDER_DATA,

    fulfillBackorder: (id: string) => {
        const item = BACKORDER_DATA.find(b => b.id === id);
        if (item) {
            item.status = 'FULFILLED';
            // Ideally we should also decrease stock or link to a transaction
            // For now, assuming stock was already reserved or adjusted elsewhere or manually
            return true;
        }
        return false;
    }
};
