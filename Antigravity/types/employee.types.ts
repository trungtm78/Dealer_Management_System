export interface MasterDepartment {
  id: string;
  department_code: string;
  department_name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

export interface MasterPosition {
  id: string;
  position_code: string;
  position_name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

export interface MasterLevel {
  id: string;
  level_code: string;
  level_name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  user_id?: string;
  employee_code: string;
  full_name: string;
  department_id?: string;
  department_name?: string;
  position_id?: string;
  position_name?: string;
  level_id?: string;
  level_name?: string;
  join_date?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateEmployeeDto {
  user_id?: string;
  employee_code?: string;
  full_name: string;
  department_id?: string;
  position_id?: string;
  level_id?: string;
  join_date?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
}

export interface UpdateEmployeeDto {
  user_id?: string;
  full_name: string;
  department_id?: string;
  position_id?: string;
  level_id?: string;
  join_date?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
}

export interface EmployeeResponse {
  data: Employee[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface EmployeeFilterDto {
  search?: string;
  department_id?: string;
  position_id?: string;
  level_id?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
}