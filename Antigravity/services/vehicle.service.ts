
import {
    VehicleDTO, CreateVehicleInput, UpdateVehicleInput, VehicleStatus
} from "@/lib/types/inventory";

const API_BASE_URL = "/api/inventory/vehicles";

export const VehicleService = {
    getVehicles: async (query?: string): Promise<VehicleDTO[]> => {
        const url = new URL(API_BASE_URL, window.location.origin);
        if (query) {
            url.searchParams.append('query', query);
        }
        const res = await fetch(url.toString(), { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch vehicles");
        const result = await res.json();
        return result.data || [];
    },

    getVehicle: async (id: string): Promise<VehicleDTO | null> => {
        const res = await fetch(`${API_BASE_URL}/${id}`, { cache: 'no-store' });
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to fetch vehicle");
        return res.json();
    },

    createVehicle: async (data: CreateVehicleInput): Promise<{ success: boolean; data?: VehicleDTO; error?: string }> => {
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

    updateVehicle: async (id: string, data: UpdateVehicleInput): Promise<{ success: boolean; data?: VehicleDTO; error?: string }> => {
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

    deleteVehicle: async (id: string): Promise<{ success: boolean; error?: string }> => {
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
