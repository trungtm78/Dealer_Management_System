
import {
    ServiceAppointmentDTO, CreateAppointmentInput, AppointmentStatus,
    RepairOrderDTO, CreateRepairOrderInput, UpdateRepairOrderInput, RepairStatus,
    ServiceQuoteDTO // Import the newly added type
} from "@/lib/types/service";

const API_BASE_URL = "/api/service";

export const ServiceService = {
    // --- APPOINTMENTS ---
    getAppointments: async (): Promise<ServiceAppointmentDTO[]> => {
        const res = await fetch(`${API_BASE_URL}/appointments`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch appointments");
        const result = await res.json();
        return result.data || [];
    },

    createAppointment: async (data: CreateAppointmentInput): Promise<{ success: boolean; data?: ServiceAppointmentDTO; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/appointments`, {
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

    updateAppointmentStatus: async (id: string, status: AppointmentStatus): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
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

    deleteAppointment: async (id: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) return { success: false, error: "Failed to delete" };
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    // --- REPAIR ORDERS ---
    getRepairOrders: async (): Promise<RepairOrderDTO[]> => {
        const res = await fetch(`${API_BASE_URL}/repair-orders`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch ROs");
        const result = await res.json();
        return result.data || [];
    },

    createRepairOrder: async (data: CreateRepairOrderInput): Promise<{ success: boolean; data?: RepairOrderDTO; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/repair-orders`, {
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

    updateRepairOrder: async (id: string, data: UpdateRepairOrderInput): Promise<{ success: boolean; data?: RepairOrderDTO; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/repair-orders/${id}`, {
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

    updateRepairOrderStatus: async (id: string, status: RepairStatus): Promise<{ success: boolean; error?: string }> => {
        return ServiceService.updateRepairOrder(id, { status });
    },

    // --- QUOTATIONS ---
    getQuotes: async (query?: string): Promise<ServiceQuoteDTO[]> => {
        const url = new URL(`${API_BASE_URL}/quotations`, window.location.origin);
        if (query) url.searchParams.append('query', query);
        const res = await fetch(url.toString(), { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch quotes");
        const result = await res.json();
        return result.data || [];
    },

    createQuote: async (data: any): Promise<{ success: boolean; data?: ServiceQuoteDTO; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/quotations`, {
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

    updateQuoteStatus: async (id: string, status: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/quotations/${id}`, {
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

    convertQuoteToRO: async (id: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/quotations/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: 'convert' }),
            });
            const result = await res.json();
            if (!res.ok) return { success: false, error: result.error || "Failed" };
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};
