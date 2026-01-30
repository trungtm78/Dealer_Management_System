
export interface LoginInput {
    email?: string;
    password?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: {
        id: string;
        email: string;
        name: string | null;
        role: string;
    };
}
