"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

// --- Types ---

export type ContractStatus = "Active" | "Pending" | "Expired";
export type ClaimStatus = "New" | "Processing" | "Approved" | "Rejected" | "Completed";

export interface Contract {
    id: string;
    customerName: string;
    customerPhone?: string;
    carModel: string;
    licensePlate: string;
    provider: string;
    startDate: string;
    endDate: string;
    value: number;
    status: ContractStatus;
    deductible?: number; // Mức miễn thường
    coverage?: string[]; // Quyền lợi bảo hiểm
}

export interface Claim {
    id: string;
    contractId: string;
    incidentDate: string;
    location?: string; // Địa điểm sự kiện
    description: string;
    estimatedAmount: number;
    status: ClaimStatus;
    handler: string;
    rejectionReason?: string;
    driverName?: string;
    driverPhone?: string;
    images?: string[];
}

interface InsuranceState {
    contracts: Contract[];
    claims: Claim[];
}

type Action =
    | { type: "ADD_CONTRACT"; payload: Contract }
    | { type: "UPDATE_CONTRACT"; payload: Contract }
    | { type: "DELETE_CONTRACT"; payload: string } // id
    | { type: "ADD_CLAIM"; payload: Claim }
    | { type: "UPDATE_CLAIM"; payload: Claim } // Full update
    | { type: "DELETE_CLAIM"; payload: string } // id
    | { type: "UPDATE_CLAIM_STATUS"; payload: { id: string; status: ClaimStatus; rejectionReason?: string } };

// --- Initial Data ---

const initialContracts: Contract[] = [
    {
        id: "HD001", customerName: "Nguyễn Văn A", customerPhone: "0901234567", carModel: "Honda CR-V", licensePlate: "51H-123.45", provider: "PVI", startDate: "2024-01-01", endDate: "2025-01-01", value: 15000000, status: "Active",
        deductible: 500000, coverage: ["Bảo hiểm vật chất", "Thủy kích", "Mất cắp bộ phận"]
    },
    {
        id: "HD002", customerName: "Trần Thị B", customerPhone: "0909998887", carModel: "Honda City", licensePlate: "51G-567.89", provider: "Bảo Việt", startDate: "2024-02-15", endDate: "2025-02-15", value: 12500000, status: "Pending",
        deductible: 500000, coverage: ["Bảo hiểm vật chất"]
    },
    {
        id: "HD003", customerName: "Lê Văn C", customerPhone: "0912341234", carModel: "Honda Civic", licensePlate: "51F-999.99", provider: "PTI", startDate: "2023-03-10", endDate: "2024-03-10", value: 18000000, status: "Expired",
        deductible: 1000000, coverage: ["Toàn bộ", "Thủy kích"]
    },
    {
        id: "HD004", customerName: "Công Ty XYZ", customerPhone: "0283838383", carModel: "Honda Accord", licensePlate: "51A-111.11", provider: "MIC", startDate: "2024-05-05", endDate: "2025-05-05", value: 22000000, status: "Active",
        deductible: 500000, coverage: ["VIP"]
    },
    {
        id: "HD005", customerName: "Phạm Văn D", customerPhone: "0987654321", carModel: "Honda HR-V", licensePlate: "51K-222.33", provider: "PVI", startDate: "2024-06-20", endDate: "2025-06-20", value: 14000000, status: "Active",
        deductible: 500000, coverage: ["Cơ bản"]
    },
];

const initialClaims: Claim[] = [
    {
        id: "CL001", contractId: "HD001", incidentDate: "2024-01-10", location: "Quận 1, TP.HCM", description: "Va chạm nhẹ cản sau", estimatedAmount: 5000000, status: "New", handler: "Nguyễn Văn X",
        driverName: "Nguyễn Văn A", driverPhone: "0901234567"
    },
    {
        id: "CL002", contractId: "HD003", incidentDate: "2024-01-12", location: "Quận 3, TP.HCM", description: "Vỡ đèn pha", estimatedAmount: 12000000, status: "Processing", handler: "Trần Văn Y",
        driverName: "Lê Văn C", driverPhone: "0912341234"
    },
    {
        id: "CL003", contractId: "HD005", incidentDate: "2024-01-15", location: "Thủ Đức", description: "Xước sơn cánh cửa", estimatedAmount: 2500000, status: "Approved", handler: "Nguyễn Văn X",
        driverName: "Vợ anh D", driverPhone: "0987654322"
    },
    {
        id: "CL004", contractId: "HD002", incidentDate: "2024-01-20", location: "Bình Dương", description: "Móp nắp capo", estimatedAmount: 8000000, status: "Rejected", handler: "Lê Văn Z", rejectionReason: "Không thuộc phạm vi bảo hiểm",
        driverName: "Tài xế riêng", driverPhone: "0909090909"
    },
];

const initialState: InsuranceState = {
    contracts: initialContracts,
    claims: initialClaims,
};

// --- Reducer ---

export function insuranceReducer(state: InsuranceState, action: Action): InsuranceState {
    switch (action.type) {
        case "ADD_CONTRACT":
            return { ...state, contracts: [action.payload, ...state.contracts] };
        case "UPDATE_CONTRACT":
            return {
                ...state,
                contracts: state.contracts.map((c) => (c.id === action.payload.id ? action.payload : c)),
            };
        case "DELETE_CONTRACT":
            return {
                ...state,
                contracts: state.contracts.filter((c) => c.id !== action.payload),
                claims: state.claims.filter(c => c.contractId !== action.payload) // Optional: Cascade delete claims? Or keep them? Let's cascade for simplicity to avoid orphans.
            };
        case "ADD_CLAIM":
            return { ...state, claims: [action.payload, ...state.claims] };
        case "UPDATE_CLAIM":
            return {
                ...state,
                claims: state.claims.map((c) => (c.id === action.payload.id ? action.payload : c)),
            };
        case "DELETE_CLAIM":
            return {
                ...state,
                claims: state.claims.filter((c) => c.id !== action.payload),
            };
        case "UPDATE_CLAIM_STATUS":
            return {
                ...state,
                claims: state.claims.map((c) =>
                    c.id === action.payload.id
                        ? { ...c, status: action.payload.status, rejectionReason: action.payload.rejectionReason }
                        : c
                ),
            };
        default:
            return state;
    }
}

// --- Context ---

interface InsuranceContextType {
    state: InsuranceState;
    addContract: (contract: Contract) => void;
    updateContract: (contract: Contract) => void;
    deleteContract: (id: string) => void;
    addClaim: (claim: Claim) => void;
    updateClaim: (claim: Claim) => void;
    deleteClaim: (id: string) => void;
    updateClaimStatus: (id: string, status: ClaimStatus, rejectionReason?: string) => void;
    renewContract: (id: string) => void;
}

const InsuranceContext = createContext<InsuranceContextType | undefined>(undefined);

export function InsuranceProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(insuranceReducer, initialState);

    const addContract = (contract: Contract) => dispatch({ type: "ADD_CONTRACT", payload: contract });
    const updateContract = (contract: Contract) => dispatch({ type: "UPDATE_CONTRACT", payload: contract });
    const deleteContract = (id: string) => dispatch({ type: "DELETE_CONTRACT", payload: id });

    const addClaim = (claim: Claim) => dispatch({ type: "ADD_CLAIM", payload: claim });
    const updateClaim = (claim: Claim) => dispatch({ type: "UPDATE_CLAIM", payload: claim });
    const deleteClaim = (id: string) => dispatch({ type: "DELETE_CLAIM", payload: id });
    const updateClaimStatus = (id: string, status: ClaimStatus, rejectionReason?: string) =>
        dispatch({ type: "UPDATE_CLAIM_STATUS", payload: { id, status, rejectionReason } });

    const renewContract = (id: string) => {
        const contract = state.contracts.find(c => c.id === id);
        if (contract) {
            const currentEndDate = new Date(contract.endDate);
            const newEndDate = new Date(currentEndDate);
            newEndDate.setFullYear(newEndDate.getFullYear() + 1);

            dispatch({
                type: "UPDATE_CONTRACT",
                payload: {
                    ...contract,
                    endDate: newEndDate.toISOString().split('T')[0],
                    status: "Active"
                }
            });
        }
    };

    return (
        <InsuranceContext.Provider value={{
            state,
            addContract, updateContract, deleteContract,
            addClaim, updateClaim, deleteClaim, updateClaimStatus,
            renewContract
        }}>
            {children}
        </InsuranceContext.Provider>
    );
}

export function useInsurance() {
    const context = useContext(InsuranceContext);
    if (!context) {
        throw new Error("useInsurance must be used within an InsuranceProvider");
    }
    return context;
}
