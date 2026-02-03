"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from "react";

// --- Types ---

export type UserRole = "Admin" | "Sales" | "Service" | "Accountant" | "Manager";
export type UserStatus = "Active" | "Inactive";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department: string;
    status: UserStatus;
    lastLogin: string;
    avatar?: string;
}

export interface SystemSettings {
    dealerName: string;
    address: string;
    phone: string;
    email: string;
    taxCode: string;
    currency: string;
    vatRate: number;
}

export interface ApiConfig {
    id: string;
    name: string;
    baseUrl: string;
    apiKey: string;
    status: "Active" | "Inactive" | "Error";
    lastSync: string;
}

export interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    module: "Admin" | "Sales" | "Service" | "Accounting" | "Insurance" | "CRM" | "Parts";
    timestamp: string;
    details: string;
}

interface AdminState {
    users: User[];
    settings: SystemSettings;
    apiConfigs: ApiConfig[];
    logs: AuditLog[];
}

type Action =
    | { type: "ADD_USER"; payload: User }
    | { type: "UPDATE_USER"; payload: User }
    | { type: "DELETE_USER"; payload: string }
    | { type: "UPDATE_SETTINGS"; payload: SystemSettings }
    | { type: "UPDATE_API_CONFIG"; payload: ApiConfig }
    | { type: "ADD_LOG"; payload: AuditLog }
    | { type: "SET_STATE"; payload: AdminState };

// --- Initial Data ---

const initialUsers: User[] = [
    { id: "U001", name: "Nguyễn Quản Trị", email: "admin@honda.com.vn", role: "Admin", department: "Board of Directors", status: "Active", lastLogin: "2024-06-25 08:30" },
    { id: "U002", name: "Trần Kinh Doanh", email: "sales@honda.com.vn", role: "Sales", department: "Sales Dept", status: "Active", lastLogin: "2024-06-25 09:15" },
    { id: "U003", name: "Lê Kỹ Thuật", email: "service@honda.com.vn", role: "Service", department: "Service Dept", status: "Active", lastLogin: "2024-06-24 17:00" },
    { id: "U004", name: "Phạm Kế Toán", email: "accounting@honda.com.vn", role: "Accountant", department: "Finance Dept", status: "Active", lastLogin: "2024-06-25 08:00" },
    { id: "U005", name: "Vũ Kho", email: "parts@honda.com.vn", role: "Manager", department: "Parts Dept", status: "Inactive", lastLogin: "2024-05-30 10:00" },
];

const initialSettings: SystemSettings = {
    dealerName: "Honda Ôtô Sài Gòn - Quận 7",
    address: "Khu dân cư ven sông, Nguyễn Văn Linh, Quận 7, TP.HCM",
    phone: "028 377 55 999",
    email: "contact@hondaotopmyhun.com.vn",
    taxCode: "0300123456",
    currency: "VND",
    vatRate: 10,
};

const initialApiConfigs: ApiConfig[] = [
    { id: "API001", name: "Honda Global ERP", baseUrl: "https://api.honda.global/v1", apiKey: "********", status: "Active", lastSync: "2024-06-25 10:00" },
    { id: "API002", name: "SendGrid Email", baseUrl: "https://api.sendgrid.com/v3", apiKey: "********", status: "Active", lastSync: "2024-06-25 09:30" },
    { id: "API003", name: "Twilio SMS", baseUrl: "https://api.twilio.com/2010-04-01", apiKey: "********", status: "Inactive", lastSync: "2024-06-20 14:00" },
];

const initialLogs: AuditLog[] = [
    { id: "L001", userId: "U001", userName: "Nguyễn Quản Trị", action: "System Update", module: "Admin", timestamp: "2024-06-25 10:00", details: "Cập nhật cấu hình thuế VAT" },
    { id: "L002", userId: "U002", userName: "Trần Kinh Doanh", action: "Create Contract", module: "Sales", timestamp: "2024-06-25 09:30", details: "Tạo hợp đồng HD005" },
    { id: "L003", userId: "U003", userName: "Lê Kỹ Thuật", action: "Complete Order", module: "Service", timestamp: "2024-06-25 08:45", details: "Hoàn tất RO-2024-001" },
    { id: "L004", userId: "U004", userName: "Phạm Kế Toán", action: "Approve Payment", module: "Accounting", timestamp: "2024-06-24 16:30", details: "Duyệt thanh toán lương tháng 5" },
];

const initialState: AdminState = {
    users: initialUsers,
    settings: initialSettings,
    apiConfigs: initialApiConfigs,
    logs: initialLogs,
};

// --- Reducer ---

export function adminReducer(state: AdminState, action: Action): AdminState {
    switch (action.type) {
        case "ADD_USER":
            return {
                ...state,
                users: [action.payload, ...state.users],
                logs: [{
                    id: `LOG${Date.now()}`,
                    userId: "CURRENT_USER", // Mock ID
                    userName: "Current Admin",
                    action: "Create User",
                    module: "Admin",
                    timestamp: new Date().toLocaleString(),
                    details: `Tạo user mới: ${action.payload.name}`
                }, ...state.logs]
            };
        case "UPDATE_USER":
            return {
                ...state,
                users: state.users.map(u => u.id === action.payload.id ? action.payload : u),
                logs: [{
                    id: `LOG${Date.now()}`,
                    userId: "CURRENT_USER",
                    userName: "Current Admin",
                    action: "Update User",
                    module: "Admin",
                    timestamp: new Date().toLocaleString(),
                    details: `Cập nhật user: ${action.payload.name}`
                }, ...state.logs]
            };
        case "DELETE_USER":
            const userToDelete = state.users.find(u => u.id === action.payload);
            return {
                ...state,
                users: state.users.filter(u => u.id !== action.payload),
                logs: [{
                    id: `LOG${Date.now()}`,
                    userId: "CURRENT_USER",
                    userName: "Current Admin",
                    action: "Delete User",
                    module: "Admin",
                    timestamp: new Date().toLocaleString(),
                    details: `Xóa user: ${userToDelete?.name || action.payload}`
                }, ...state.logs]
            };
        case "UPDATE_SETTINGS":
            return {
                ...state,
                settings: action.payload,
                logs: [{
                    id: `LOG${Date.now()}`,
                    userId: "CURRENT_USER",
                    userName: "Current Admin",
                    action: "Update Settings",
                    module: "Admin",
                    timestamp: new Date().toLocaleString(),
                    details: "Cập nhật cấu hình hệ thống"
                }, ...state.logs]
            };
        case "UPDATE_API_CONFIG":
            return {
                ...state,
                apiConfigs: state.apiConfigs.map(api => api.id === action.payload.id ? action.payload : api),
                logs: [{
                    id: `LOG${Date.now()}`,
                    userId: "CURRENT_USER",
                    userName: "Current Admin",
                    action: "Update API Config",
                    module: "Admin",
                    timestamp: new Date().toLocaleString(),
                    details: `Cập nhật cấu hình API: ${action.payload.name}`
                }, ...state.logs]
            }
        case "ADD_LOG":
            return { ...state, logs: [action.payload, ...state.logs] };
        case "SET_STATE":
            return action.payload;
        default:
            return state;
    }
}

// --- Context ---

interface AdminContextType {
    state: AdminState;
    addUser: (user: User) => void;
    updateUser: (user: User) => void;
    deleteUser: (id: string) => void;
    updateSettings: (settings: SystemSettings) => void;
    updateApiConfig: (config: ApiConfig) => void;
    addLog: (log: AuditLog) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(adminReducer, initialState);
    const [isInitialized, setIsInitialized] = useState(false);

    // Persistence
    useEffect(() => {
        const saved = localStorage.getItem("HONDA_ADMIN_STATE");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge loaded state with initialState to ensure new fields (like apiConfigs) are present
                const mergedState = { ...initialState, ...parsed };
                // Ensure arrays are initialized if missing in parsed state
                if (!mergedState.apiConfigs) mergedState.apiConfigs = initialState.apiConfigs;

                dispatch({ type: "SET_STATE", payload: mergedState });
            } catch (e) {
                console.error("Failed to load admin state", e);
            }
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem("HONDA_ADMIN_STATE", JSON.stringify(state));
    }, [state, isInitialized]);

    const addUser = (user: User) => dispatch({ type: "ADD_USER", payload: user });
    const updateUser = (user: User) => dispatch({ type: "UPDATE_USER", payload: user });
    const deleteUser = (id: string) => dispatch({ type: "DELETE_USER", payload: id });
    const updateSettings = (settings: SystemSettings) => dispatch({ type: "UPDATE_SETTINGS", payload: settings });
    const updateApiConfig = (config: ApiConfig) => dispatch({ type: "UPDATE_API_CONFIG", payload: config });
    const addLog = (log: AuditLog) => dispatch({ type: "ADD_LOG", payload: log });

    return (
        <AdminContext.Provider value={{ state, addUser, updateUser, deleteUser, updateSettings, updateApiConfig, addLog }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
}
