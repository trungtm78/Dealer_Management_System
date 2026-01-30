// SQLite doesn't support enums, so we define them as string literal types
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'DEAD';
export type LeadSource = 'FACEBOOK' | 'HOTLINE' | 'WALK_IN' | 'WEBSITE' | 'REFERRAL' | 'OTHER';
export type CampaignType = 'SMS' | 'EMAIL' | 'SOCIAL' | 'EVENT' | 'ZALO' | 'FACEBOOK';
export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
export type CustomerType = 'INDIVIDUAL' | 'COMPANY';

// Lead Types
export interface LeadDTO {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    source: LeadSource | string;
    status: LeadStatus | string;
    score: number;
    model_interest?: string | null;
    model_version?: string | null;
    color?: string | null;
    budget?: string | null;
    timeframe?: string | null;
    customer_type?: string | null;
    address?: string | null;
    notes?: string | null;
    time_created: string; // Formatted date string for UI
    created_at: string;   // ISO string
    updated_at: string;
    interactions?: InteractionDTO[];
    history?: LeadHistoryDTO[];
}

export interface LeadHistoryDTO {
    id: string;
    lead_id: string;
    changed_by_id: string;
    changed_by?: { name: string; email: string };
    field: string;
    old_value?: string | null;
    new_value?: string | null;
    created_at: string;
}

export interface InteractionDTO {
    id: string;
    content: string;
    type: string;
    lead_id: string;
    user_id: string;
    created_at: string;
    outcome?: string | null;
    metadata?: any;
    start_time?: string | null;
    end_time?: string | null;
}

export type CreateLeadInput = {
    name: string;
    phone: string;
    email?: string;
    source: LeadSource;
    model_interest?: string;
    model_version?: string;
    color?: string;
    budget?: string;
    payment_method?: string;
    timeframe?: string;
    customer_type?: string;
    address?: string;
    notes?: string;
    trade_in_car?: string;
    is_test_drive?: boolean;
    test_drive_date?: string;
};


// Campaign Types
export interface CampaignDTO {
    id: string;
    name: string;
    type: CampaignType;
    status: CampaignStatus;
    startDate: string; // Changed to string (ISO)
    endDate: string;   // Changed to string (ISO)
    targetSegment: string;
    audienceSize: number;
    budget: number;
    spent: number;
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
}

export interface CustomerDTO {
    id: string;
    name: string;
    type: CustomerType;
    phone: string;
    mobile?: string | null;
    email?: string | null;
    address?: string | null;
    street?: string | null;
    city?: string | null;
    district?: string | null;
    ward?: string | null;
    vat?: string | null;
    tier: LoyaltyTier;
    points: number;
    total_points: number;
    tags: string[] | string;
    member_since: string;
    updated_at: string;
}

export type CustomerCreateInput = {
    name: string;
    phone: string;
    type: CustomerType;
    mobile?: string | null;
    email?: string | null;
    street?: string | null;
    city?: string | null;
    district?: string | null;
    ward?: string | null;
    vat?: string | null;
    notes?: string | null;
    tags?: string[];
};

export type CustomerUpdateInput = Partial<CustomerCreateInput> & {
    tier?: LoyaltyTier;
    status?: string;
    points?: number;
    total_points?: number;
};


// Scoring Rule Types
export interface ScoringRuleDTO {
    id: string;
    category: string;
    criteria: string;
    weight: number;
    enabled: boolean;
}
