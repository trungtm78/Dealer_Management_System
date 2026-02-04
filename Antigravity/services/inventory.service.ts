
import {
    PartDTO, CreatePartInput, UpdatePartInput,
    StockMovementDTO, CreateStockMovementInput
} from "@/lib/types/inventory";

const API_BASE_URL = "/api/inventory";

export const InventoryService = {
    // --- PARTS ---
    getParts: async (query?: string): Promise<PartDTO[]> => {
        const url = new URL(`${API_BASE_URL}/parts`, window.location.origin);
        if (query) {
            url.searchParams.append('query', query);
        }
        const res = await fetch(url.toString(), { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch parts");
        const result = await res.json();
        return result.data || [];
    },

    createPart: async (data: CreatePartInput): Promise<{ success: boolean; data?: PartDTO; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/parts`, {
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

    updatePart: async (id: string, data: UpdatePartInput): Promise<{ success: boolean; data?: PartDTO; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/parts/${id}`, {
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

    deletePart: async (id: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/parts/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) return { success: false, error: "Failed to delete" };
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    // --- MOVEMENTS ---
    getMovements: async (): Promise<StockMovementDTO[]> => {
        const res = await fetch(`${API_BASE_URL}/movements`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch movements");
        return res.json();
    },

    createMovement: async (data: CreateStockMovementInput): Promise<{ success: boolean; data?: StockMovementDTO; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/movements`, {
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
    }
};
