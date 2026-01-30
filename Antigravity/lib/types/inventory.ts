
export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT' | 'RETURN';
export type VehicleStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'IN_TRANSIT' | 'PDS';

export interface PartDTO {
    id: string;
    partNumber: string;
    name: string;
    category: string;
    price: number;
    cost?: number | null;
    quantity: number;
    minStock: number;
    location?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePartInput {
    partNumber: string;
    name: string;
    category: string;
    price: number;
    cost?: number;
    quantity?: number;
    minStock?: number;
    location?: string;
}

export interface UpdatePartInput {
    name?: string;
    category?: string;
    price?: number;
    cost?: number;
    minStock?: number;
    location?: string;
}

export interface StockMovementDTO {
    id: string;
    partId: string;
    partName?: string;
    partNumber?: string;
    type: MovementType;
    quantity: number;
    reason?: string | null;
    reference?: string | null;
    createdById: string;
    createdByName?: string;
    createdAt: string;
}

export interface CreateStockMovementInput {
    partId: string;
    type: MovementType;
    quantity: number;
    reason?: string;
    reference?: string;
    createdById: string; // Typically handled by session, but good for DTO
}

export interface VehicleDTO {
    id: string;
    vin: string;
    model: string;
    version?: string | null;
    color: string;
    engineNumber?: string | null;
    status: VehicleStatus;
    warehouse?: string | null;
    arrivalDate?: string | null;
    daysInStock: number;
    allocatedTo?: string | null;
    allocatedAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateVehicleInput {
    vin: string;
    model: string;
    version?: string;
    color: string;
    engineNumber?: string;
    warehouse?: string;
    arrivalDate?: Date;
    status?: VehicleStatus;
}

export interface UpdateVehicleInput extends Partial<CreateVehicleInput> {
    allocatedTo?: string;
    allocatedAt?: Date;
}
