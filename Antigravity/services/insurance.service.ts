
import { InsuranceContractDTO, CreateContractInput, UpdateContractInput } from "@/lib/types/insurance";

const API_BASE_URL = "/api/insurance/contracts";

export const InsuranceService = {
    getContracts: async (): Promise<InsuranceContractDTO[]> => {
        const res = await fetch(API_BASE_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch contracts");
        const result = await res.json();
        return result.data || [];
    },

    getContract: async (id: string): Promise<InsuranceContractDTO> => {
        const res = await fetch(`${API_BASE_URL}/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch contract");
        return res.json();
    },

    createContract: async (data: CreateContractInput): Promise<{ success: boolean; data?: InsuranceContractDTO; error?: string }> => {
        try {
            const res = await fetch(API_BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) return { success: false, error: result.error || "Failed" };
            return { success: true, data: result };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    updateContract: async (id: string, data: UpdateContractInput): Promise<{ success: boolean; data?: InsuranceContractDTO; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) return { success: false, error: result.error || "Failed" };
            return { success: true, data: result };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    deleteContract: async (id: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) return { success: false, error: "Failed to delete" };
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};
