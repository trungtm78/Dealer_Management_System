export interface VehicleModel {
  id: string;
  model_code: string;
  model_name: string;
  category: string;
  base_price: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleModelResponse {
  data: VehicleModel[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateVehicleModelDto {
  model_code?: string;
  model_name: string;
  category: 'SEDAN' | 'SUV' | 'HATCHBACK' | 'MPV';
  base_price: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateVehicleModelDto {
  model_name: string;
  category: 'SEDAN' | 'SUV' | 'HATCHBACK' | 'MPV';
  base_price: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface VehicleModelFilterDto {
  search?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}