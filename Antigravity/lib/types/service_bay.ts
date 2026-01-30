export interface ServiceBayDTO {
    id: string;
    name: string;
    location: string | null;
    capacity: string | null;
    equipment: string | null;
    status: string;
    is_available: boolean;
    assignments?: BayAssignmentDTO[];
}

export interface BayAssignmentDTO {
    id: string;
    bay_id: string;
    repair_order_id: string;
    assigned_at: string;
    started_at: string | null;
    estimated_end: string | null;
    actual_end: string | null;
    status: string;
    progress_percent: number;
    delay_minutes: number;
    notes: string | null;
    repairOrder?: any;
}

export interface BayKPIs {
    total_bays: number;
    working_bays: number;
    idle_bays: number;
    utilization_rate: number;
    delayed_count: number;
    avg_progress: number;
}
