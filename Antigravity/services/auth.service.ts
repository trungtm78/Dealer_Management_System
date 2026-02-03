
import { LoginInput, AuthResponse } from "@/lib/types/auth";

export const AuthService = {
    login: async (data: LoginInput): Promise<AuthResponse> => {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();

            // Normalize error response structure if needed, but API returns AuthResponse structure
            return result;
        } catch (error) {
            return { success: false, message: "Lỗi kết nối mạng" };
        }
    },

    logout: async (): Promise<AuthResponse> => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
            });
            return await res.json();
        } catch (error) {
            return { success: false, message: "Lỗi đăng xuất" };
        }
    }
};
