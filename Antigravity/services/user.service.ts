const API_BASE_URL = "/api/users";

export interface UserDTO {
    id: string;
    name: string;
    email: string;
    role: string;
}

export const UserService = {
    getUsers: async (role?: string): Promise<UserDTO[]> => {
        const url = new URL(API_BASE_URL, window.location.origin);
        if (role) {
            url.searchParams.append('role', role);
        }
        const res = await fetch(url.toString(), { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch users");
        const result = await res.json();
        return result.data || [];
    },

    getTechnicians: async (): Promise<UserDTO[]> => {
        return UserService.getUsers('TECHNICIAN');
    }
};
