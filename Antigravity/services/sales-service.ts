export interface Quote {
    id: string;
    customerName: string;
    phone: string;
    model: string;
    version: string;
    color: string;
    accessories: string[];
    services: string[];
    totalPrice: number;
    status: 'DRAFT' | 'SENT' | 'APPROVED' | 'CONTRACT' | 'LOST';
    date: string;
    staff: string;
}

export interface TestDrive {
    id: string;
    customer: string;
    phone: string;
    model: string;
    date: string;
    time: string;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
    staff: string;
}

export interface InventoryItem {
    vin: string;
    model: string;
    color: string;
    engine: string;
    status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
    warehouse: string;
    days: number;
}

export interface Allocation {
    contractId: string;
    customer: string;
    model: string;
    color: string;
    vin: string;
    status: 'PENDING' | 'ALLOCATED';
    date: string;
}

export interface Deposit {
    receipt: string;
    customer: string;
    amount: number;
    date: string;
    status: 'PAID' | 'REFUNDED';
    contract: string;
}

export interface PdsItem {
    vin: string;
    model: string;
    color: string;
    date: string;
    inspector: string;
    status: 'PENDING' | 'PASSED' | 'FAILED';
}

const STORAGE_KEYS = {
    QUOTES: 'sales_quotes',
    TEST_DRIVES: 'sales_test_drives',
    INVENTORY: 'sales_inventory',
    ALLOCATIONS: 'sales_allocations',
    DEPOSITS: 'sales_deposits',
    PDS: 'sales_pds'
};

// Initial Data Seeding
const seedData = () => {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
        const initialInventory: InventoryItem[] = [
            { vin: "RLH12345678", model: "Honda CR-V L", color: "white", engine: "K24Z123", status: "AVAILABLE", warehouse: "Kho A - Zone 1", days: 5 },
            { vin: "RLH87654321", model: "Honda CR-V L", color: "black", engine: "K24Z124", status: "RESERVED", warehouse: "Kho A - Zone 2", days: 12 },
            { vin: "RLH11223344", model: "Honda City RS", color: "red", engine: "L15B112", status: "AVAILABLE", warehouse: "Kho B - Zone 1", days: 30 },
            { vin: "RLH99887766", model: "Honda Civic RS", color: "grey", engine: "L15C998", status: "SOLD", warehouse: "Kho C - PDS", days: 2 },
            { vin: "RLH55667788", model: "Honda Accord", color: "black", engine: "K20C556", status: "AVAILABLE", warehouse: "Kho A - VIP", days: 45 },
        ];
        localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(initialInventory));
    }
};

export const SalesService = {
    init: () => seedData(),

    // --- QUOTES ---
    getQuotes: (): Quote[] => {
        if (typeof window === 'undefined') return [];
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.QUOTES) || '[]');
    },
    saveQuote: (quote: Omit<Quote, 'id' | 'date' | 'status'>) => {
        const quotes = SalesService.getQuotes();
        const newQuote: Quote = {
            ...quote,
            id: `QT/2026/${String(quotes.length + 1).padStart(3, '0')}`,
            date: new Date().toLocaleDateString('vi-VN'),
            status: 'DRAFT',
            staff: 'Admin User' // Simplified
        };
        quotes.unshift(newQuote);
        localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
        return newQuote;
    },
    updateQuoteStatus: (id: string, status: Quote['status']) => {
        const quotes = SalesService.getQuotes();
        const updated = quotes.map(q => q.id === id ? { ...q, status } : q);
        localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(updated));
    },

    // --- TEST DRIVES ---
    getTestDrives: (): TestDrive[] => {
        if (typeof window === 'undefined') return [];
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.TEST_DRIVES) || '[]');
    },
    bookTestDrive: (drive: Omit<TestDrive, 'id' | 'status'>) => {
        const drives = SalesService.getTestDrives();
        const newDrive: TestDrive = {
            ...drive,
            id: `TD${String(drives.length + 1).padStart(3, '0')}`,
            status: 'SCHEDULED'
        };
        drives.unshift(newDrive);
        localStorage.setItem(STORAGE_KEYS.TEST_DRIVES, JSON.stringify(drives));
        return newDrive;
    },
    updateTestDriveStatus: (id: string, status: TestDrive['status']) => {
        const drives = SalesService.getTestDrives();
        const updated = drives.map(d => d.id === id ? { ...d, status } : d);
        localStorage.setItem(STORAGE_KEYS.TEST_DRIVES, JSON.stringify(updated));
    },

    // --- INVENTORY & ALLOCATION ---
    getInventory: (): InventoryItem[] => {
        if (typeof window === 'undefined') return [];
        // Ensure seeding runs
        if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) seedData();
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.INVENTORY) || '[]');
    },
    getAllocations: (): Allocation[] => {
        if (typeof window === 'undefined') return [];
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ALLOCATIONS) || '[]');
    },
    createAllocation: (contractId: string, customer: string, model: string, color: string) => {
        const allocs = SalesService.getAllocations();
        const newAlloc: Allocation = {
            contractId, customer, model, color,
            vin: 'Chưa phân bổ',
            status: 'PENDING',
            date: new Date().toLocaleDateString('vi-VN')
        };
        allocs.unshift(newAlloc);
        localStorage.setItem(STORAGE_KEYS.ALLOCATIONS, JSON.stringify(allocs));
    },
    assignVin: (contractId: string, vin: string) => {
        // 1. Update Allocation
        const allocs = SalesService.getAllocations();
        const updatedAllocs = allocs.map(a => a.contractId === contractId ? { ...a, vin, status: 'ALLOCATED' as const } : a);
        localStorage.setItem(STORAGE_KEYS.ALLOCATIONS, JSON.stringify(updatedAllocs));

        // 2. Update Inventory Status
        const inventory = SalesService.getInventory();
        const updatedInv = inventory.map(i => i.vin === vin ? { ...i, status: 'RESERVED' as const } : i);
        localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(updatedInv));
    },

    // --- DEPOSITS ---
    getDeposits: (): Deposit[] => {
        if (typeof window === 'undefined') return [];
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.DEPOSITS) || '[]');
    },
    createDeposit: (contract: string, customer: string, amount: number) => {
        const deposits = SalesService.getDeposits();
        const newDeposit: Deposit = {
            receipt: `PT/2026/${String(deposits.length + 1).padStart(3, '0')}`,
            contract, customer, amount,
            status: 'PAID',
            date: new Date().toLocaleDateString('vi-VN')
        };
        deposits.unshift(newDeposit);
        localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(deposits));
    },

    // --- PDS ---
    getPdsList: (): PdsItem[] => {
        if (typeof window === 'undefined') return [];
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PDS) || '[]');
    },
    createPdsRequest: (vin: string, model: string, color: string) => {
        const pds = SalesService.getPdsList();
        const newPds: PdsItem = {
            vin, model, color,
            status: 'PENDING',
            inspector: 'Chưa gán',
            date: new Date().toLocaleDateString('vi-VN')
        };
        pds.unshift(newPds);
        localStorage.setItem(STORAGE_KEYS.PDS, JSON.stringify(pds));
    },
    updatePdsStatus: (vin: string, status: PdsItem['status'], inspector: string) => {
        const pds = SalesService.getPdsList();
        const updated = pds.map(p => p.vin === vin ? { ...p, status, inspector } : p);
        localStorage.setItem(STORAGE_KEYS.PDS, JSON.stringify(updated));
    }
};
