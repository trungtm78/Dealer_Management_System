
import {
    CreateQuotationInput, QuotationDTO, UpdateQuotationInput, QuotationStatus,
    DepositDTO, CreateDepositInput, DepositStatus,
    PDSDTO, PDSStatus
} from "@/lib/types/sales";

const API_BASE_URL = "/api/sales";

export const SalesService = {
    // --- QUOTATIONS ---
    getQuotations: async (query?: string): Promise<QuotationDTO[]> => {
        const url = new URL(`${API_BASE_URL}/quotations`, window.location.origin);
        if (query) {
            url.searchParams.append('query', query);
        }
        const res = await fetch(url.toString(), { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch quotations");
        const result = await res.json();
        return result.data || [];
    },

    getQuotation: async (id: string): Promise<QuotationDTO | null> => {
        const res = await fetch(`${API_BASE_URL}/quotations/${id}`, { cache: 'no-store' });
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to fetch quotation");
        return res.json();
    },

    createQuotation: async (data: CreateQuotationInput): Promise<{ success: boolean; data?: QuotationDTO; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/quotations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (!res.ok) {
                return { success: false, error: result.error || "Failed to create quotation" };
            }
            return { success: true, data: result };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    updateQuotation: async (id: string, data: UpdateQuotationInput): Promise<{ success: boolean; data?: QuotationDTO; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/quotations/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (!res.ok) {
                return { success: false, error: result.error || "Failed to update quotation" };
            }
            return { success: true, data: result };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    deleteQuotation: async (id: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/quotations/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const result = await res.json();
                return { success: false, error: result.error || "Failed to delete quotation" };
            }
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    updateQuotationStatus: async (id: string, status: QuotationStatus): Promise<{ success: boolean; error?: string }> => {
        const res = await SalesService.updateQuotation(id, { status });
        if (!res.success) return { success: false, error: res.error };
        return { success: true };
    },

    // --- DEPOSITS ---
    getDeposits: async (query?: string): Promise<DepositDTO[]> => {
        const url = new URL(`${API_BASE_URL}/deposits`, window.location.origin);
        if (query) {
            url.searchParams.append('query', query);
        }
        const res = await fetch(url.toString(), { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch deposits");
        return res.json();
    },

    createDeposit: async (data: CreateDepositInput): Promise<{ success: boolean; data?: DepositDTO; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/deposits`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) return { success: false, error: result.error || "Failed to create deposit" };
            return { success: true, data: result };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    updateDepositStatus: async (id: string, status: DepositStatus): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/deposits/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) return { success: false, error: "Failed to update status" };
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    // --- PDS ---
    getPDSList: async (): Promise<PDSDTO[]> => {
        const res = await fetch(`${API_BASE_URL}/pds`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch PDS list");
        return res.json();
    },

    getPDS: async (id: string): Promise<PDSDTO | null> => {
        const res = await fetch(`${API_BASE_URL}/pds/${id}`, { cache: 'no-store' });
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to fetch PDS");
        return res.json();
    },

    createPDS: async (data: any): Promise<{ success: boolean; data?: PDSDTO; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/pds`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) return { success: false, error: result.error || "Failed to create PDS" };
            return { success: true, data: result };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    updatePDS: async (id: string, data: any): Promise<{ success: boolean; data?: PDSDTO; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/pds/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) return { success: false, error: result.error || "Failed to update PDS" };
            return { success: true, data: result };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    updatePDSStatus: async (id: string, status: PDSStatus): Promise<{ success: boolean; error?: string }> => {
        return SalesService.updatePDS(id, { status }).then(res => ({ success: res.success, error: res.error }));
    }
};
