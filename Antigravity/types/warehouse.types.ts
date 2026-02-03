export interface Warehouse {
  id: string;
  warehouse_code: string;
  warehouse_name: string;
  location_address?: string;
  manager_id?: string;
  manager_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateWarehouseDto {
  warehouse_code?: string;
  warehouse_name: string;
  location_address?: string;
  manager_id?: string;
  is_active?: boolean;
}

export interface UpdateWarehouseDto {
  warehouse_name: string;
  location_address?: string;
  manager_id?: string;
  is_active?: boolean;
}

export interface WarehouseResponse {
  data: Warehouse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface WarehouseFilterDto {
  search?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}