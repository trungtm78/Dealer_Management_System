export interface RoleDTO {
  id: string;
  name: string;
  description: string | null;
  is_system: boolean;
  created_at: string;
  permissions?: string[]; // IDs or action strings
}

export interface PermissionDTO {
  id: string;
  module: string;
  action: string;
  description: string | null;
}

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string | null;
  phone: string | null;
  status: string;
  last_login: string | null;
  is_active: boolean;
}

export interface CreateUserInput {
  email: string;
  name: string;
  role: string;
  department?: string;
  phone?: string;
}

export interface UpdateUserInput {
  name?: string;
  role?: string;
  department?: string;
  phone?: string;
  status?: string;
  is_active?: boolean;
}

export interface AuditLogDTO {
  id: string;
  user_id: string;
  user_name?: string;
  action: string;
  entity: string;
  entity_id: string | null;
  details: string | null;
  ip_address: string | null;
  created_at: string;
}
