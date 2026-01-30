export type ContractStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
export type ClaimStatus = 'SUBMITTED' | 'REVIEWING' | 'APPROVED' | 'PAID' | 'REJECTED';

export interface InsuranceContractDTO {
    id: string;
    contract_number: string;
    customer_id: string;
    customer_name?: string;
    customer_phone?: string;
    vehicle_vin: string;
    provider: string;
    type: string;
    premium_amount: number;
    start_date: string;
    end_date: string;
    status: ContractStatus;
    claims?: InsuranceClaimDTO[];
    created_at: string;
}

export interface InsuranceClaimDTO {
    id: string;
    claim_number: string;
    contract_id: string;
    contract_number?: string;
    incident_date: string;
    incident_description: string;
    claim_amount: number;
    approved_amount?: number | null;
    status: ClaimStatus;
    documents?: string[];
    created_at: string;
}

export interface CreateContractInput {
    customer_id: string;
    vehicle_vin: string;
    provider: string;
    type: string;
    premium_amount: number;
    start_date: string;
    end_date: string;
}

export interface CreateClaimInput {
    contract_id: string;
    incident_date: string;
    incident_description: string;
    claim_amount: number;
}

export interface UpdateContractInput extends Partial<CreateContractInput> {
    status?: ContractStatus;
}
