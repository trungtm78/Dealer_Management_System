export interface Supplier {
  id: string;
  supplier_code: string;
  supplier_name: string;
  tax_id?: string;
  address?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLACKLIST';
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface SupplierContact {
  id: string;
  supplier_id: string;
  contact_name: string;
  position?: string;
  phone?: string;
  email?: string;
  is_primary: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

export interface CreateSupplierDto {
  supplier_code?: string;
  supplier_name: string;
  tax_id?: string;
  address?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'BLACKLIST';
}

export interface UpdateSupplierDto {
  supplier_name: string;
  tax_id?: string;
  address?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'BLACKLIST';
}

export interface CreateSupplierContactDto {
  supplier_id: string;
  contact_name: string;
  position?: string;
  phone?: string;
  email?: string;
  is_primary?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateSupplierContactDto {
  contact_name: string;
  position?: string;
  phone?: string;
  email?: string;
  is_primary?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface SupplierResponse {
  data: Supplier[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SupplierFilterDto {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
}