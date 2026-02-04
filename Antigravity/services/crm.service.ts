
import { CustomerDTO, CustomerCreateInput, CustomerUpdateInput, LoyaltyTier, LeadDTO } from "@/lib/types/crm";

const API_BASE_URL = "/api/crm/customers";

export const CRMService = {
    // customers
    getCustomers: async (query?: string): Promise<CustomerDTO[]> => {
        const url = new URL(API_BASE_URL, window.location.origin);
        if (query) {
            url.searchParams.append('query', query);
        }
        const res = await fetch(url.toString(), { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch customers");
        const result = await res.json();
        return result.data || [];
    },

    getCustomer: async (id: string): Promise<CustomerDTO | null> => {
        const res = await fetch(`${API_BASE_URL}/${id}`, { cache: 'no-store' });
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to fetch customer");
        return res.json();
    },

    createCustomer: async (data: CustomerCreateInput): Promise<{ success: boolean; data?: CustomerDTO; error?: string }> => {
        try {
            const res = await fetch(API_BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (!res.ok) {
                return { success: false, error: result.error || "Failed to create customer" };
            }
            return { success: true, data: result };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    updateCustomer: async (id: string, data: CustomerUpdateInput): Promise<{ success: boolean; data?: CustomerDTO; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (!res.ok) {
                return { success: false, error: result.error || "Failed to update customer" };
            }
            return { success: true, data: result };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    deleteCustomer: async (id: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE_URL}/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const result = await res.json();
                return { success: false, error: result.error || "Failed to delete customer" };
            }
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    // specialized actions
    updateCustomerTier: async (id: string, tier: LoyaltyTier): Promise<{ success: boolean; error?: string }> => {
        return CRMService.updateCustomer(id, { tier });
    },

    // --- LEADS ---
    getLeads: async (query?: string, status?: string): Promise<LeadDTO[]> => {
        const url = new URL("/api/crm/leads", window.location.origin);
        if (query) url.searchParams.append('query', query);
        if (status && status !== 'ALL') url.searchParams.append('status', status);

        const res = await fetch(url.toString(), { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch leads");
        const result = await res.json();
        return result.data || [];
    },

    getLead: async (id: string): Promise<LeadDTO> => {
        const res = await fetch(`/api/crm/leads/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Lead not found");
        return res.json();
    },

    createLead: async (data: any): Promise<{ success: boolean; data?: LeadDTO; error?: string }> => {
        const res = await fetch("/api/crm/leads", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (!res.ok) return { success: false, error: json.error || "Failed to create lead" };
        return { success: true, data: json };
    },

    updateLead: async (id: string, data: any): Promise<{ success: boolean; data?: LeadDTO; error?: string }> => {
        const res = await fetch(`/api/crm/leads/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (!res.ok) return { success: false, error: json.error || "Failed to update lead" };
        return { success: true, data: json };
    },

    deleteLead: async (id: string): Promise<{ success: boolean; error?: string }> => {
        const res = await fetch(`/api/crm/leads/${id}`, { method: 'DELETE' });
        if (!res.ok) return { success: false, error: "Failed to delete lead" };
        return { success: true };
    },

    addActivity: async (leadId: string, type: string, content: string, metadata?: any): Promise<{ success: boolean; error?: string }> => {
        const res = await fetch(`/api/crm/leads/${leadId}/activities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, content, metadata })
        });
        if (!res.ok) return { success: false, error: "Failed to add activity" };
        return { success: true };
    },

    convertLeadToCustomer: async (leadId: string): Promise<{ success: boolean; customerId?: string; error?: string }> => {
        try {
            const res = await fetch(`/api/crm/leads/${leadId}/convert`, {
                method: "POST",
            });
            const result = await res.json();
            if (!res.ok) {
                return { success: false, error: result.error || "Failed to convert lead" };
            }
            return { success: true, customerId: result.customerId };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};
