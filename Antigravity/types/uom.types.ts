export interface UOM {
  id: string;
  uom_code: string;
  uom_name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateUOMDto {
  uom_code?: string;
  uom_name: string;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateUOMDto {
  uom_name: string;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UOMResponse {
  data: UOM[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UOMFilterDto {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
}