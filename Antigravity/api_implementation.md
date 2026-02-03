# API Implementation Plan
## CR-20250131-002 Implementation

**Date**: 2026-02-01  
**Version**: 1.0  
**Status**: Ready for Implementation

---

## 📋 Overview

This API implementation plan covers all endpoints required for:
1. **System Administration Module**: User Management, RBAC, Audit Logs, System Settings, Monitoring
2. **Insurance Module**: Contracts and Claims

---

## 🔧 API Structure

### Base Configuration

```typescript
// src/lib/api/config.ts
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  VERSION: 'v1',
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
} as const;

// Common types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}
```

---

## 👥 System Administration APIs

### 1. User Management APIs

#### 1.1 Get Users (List)

**Endpoint**: `GET /api/v1/admin/users`

**Request Parameters**:
```typescript
interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: 'active' | 'inactive' | 'all';
  search?: string;
}
```

**Response**:
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: {
    id: string;
    name: string;
    description: string;
  };
  status: 'active' | 'inactive';
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

type GetUsersResponse = PaginatedResponse<User>;
```

**Implementation**:
```typescript
// src/lib/api/admin/users.ts
export const getUsers = async (params: GetUsersParams = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(`${API_CONFIG.BASE_URL}/admin/users?${searchParams}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};
```

#### 1.2 Create User

**Endpoint**: `POST /api/v1/admin/users`

**Request Body**:
```typescript
interface CreateUserRequest {
  email: string;
  name: string;
  roleId: string;
  password: string;
  sendWelcomeEmail?: boolean;
}
```

**Response**:
```typescript
interface CreateUserResponse {
  user: User;
  temporaryPassword?: string;
}
```

**Implementation**:
```typescript
export const createUser = async (data: CreateUserRequest) => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/admin/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create user');
  }

  return response.json();
};
```

#### 1.3 Update User Role

**Endpoint**: `PUT /api/v1/admin/users/:id/role`

**Request Body**:
```typescript
interface UpdateUserRoleRequest {
  roleId: string;
}
```

**Implementation**:
```typescript
export const updateUserRole = async (userId: string, data: UpdateUserRoleRequest) => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/admin/users/${userId}/role`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update user role');
  }

  return response.json();
};
```

### 2. Role & Permission APIs

#### 2.1 Get Roles

**Endpoint**: `GET /api/v1/admin/roles`

**Response**:
```typescript
interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: Permission[];
}

type GetRolesResponse = ApiResponse<Role[]>;
```

**Implementation**:
```typescript
// src/lib/api/admin/roles.ts
export const getRoles = async () => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/admin/roles`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch roles');
  }

  return response.json();
};
```

#### 2.2 Get Role Permissions

**Endpoint**: `GET /api/v1/admin/roles/:id/permissions`

**Response**:
```typescript
interface Permission {
  id: string;
  module: string;
  entity: string;
  action: string;
  description: string;
}

type GetRolePermissionsResponse = ApiResponse<Permission[]>;
```

#### 2.3 Create Role

**Endpoint**: `POST /api/v1/admin/roles`

**Request Body**:
```typescript
interface CreateRoleRequest {
  name: string;
  description: string;
  permissionIds?: string[];
}
```

**Implementation**:
```typescript
export const createRole = async (data: CreateRoleRequest) => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/admin/roles`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create role');
  }

  return response.json();
};
```

#### 2.4 Update Role Permissions

**Endpoint**: `PUT /api/v1/admin/roles/:id/permissions`

**Request Body**:
```typescript
interface UpdateRolePermissionsRequest {
  permissionIds: string[];
}
```

**Implementation**:
```typescript
export const updateRolePermissions = async (roleId: string, data: UpdateRolePermissionsRequest) => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/admin/roles/${roleId}/permissions`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update role permissions');
  }

  return response.json();
};
```

#### 2.5 Get All Permissions

**Endpoint**: `GET /api/v1/admin/permissions`

**Response**:
```typescript
type GetAllPermissionsResponse = ApiResponse<Permission[]>;
```

### 3. Audit Log APIs

#### 3.1 Get Audit Logs

**Endpoint**: `GET /api/v1/admin/audit-logs`

**Request Parameters**:
```typescript
interface GetAuditLogsParams {
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  userId?: string;
  action?: string;
  entity?: string;
  page?: number;
  limit?: number;
}
```

**Response**:
```typescript
interface AuditLog {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

type GetAuditLogsResponse = PaginatedResponse<AuditLog>;
```

**Implementation**:
```typescript
// src/lib/api/admin/audit.ts
export const getAuditLogs = async (params: GetAuditLogsParams = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(`${API_CONFIG.BASE_URL}/admin/audit-logs?${searchParams}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch audit logs');
  }

  return response.json();
};
```

### 4. System Settings APIs

#### 4.1 Get System Settings

**Endpoint**: `GET /api/v1/admin/settings`

**Request Parameters**:
```typescript
interface GetSettingsParams {
  category?: string;
}
```

**Response**:
```typescript
interface SystemSetting {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  isPublic: boolean;
  description: string;
  updatedAt: string;
}

type GetSettingsResponse = ApiResponse<Record<string, SystemSetting>>;
```

**Implementation**:
```typescript
// src/lib/api/admin/settings.ts
export const getSystemSettings = async (params: GetSettingsParams = {}) => {
  const searchParams = new URLSearchParams();
  if (params.category) {
    searchParams.append('category', params.category);
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/admin/settings?${searchParams}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch system settings');
  }

  return response.json();
};
```

#### 4.2 Update System Settings

**Endpoint**: `PUT /api/v1/admin/settings`

**Request Body**:
```typescript
interface UpdateSettingsRequest {
  settings: Array<{
    key: string;
    value: any;
  }>;
}
```

**Implementation**:
```typescript
export const updateSystemSettings = async (data: UpdateSettingsRequest) => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/admin/settings`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update system settings');
  }

  return response.json();
};
```

### 5. Monitoring APIs

#### 5.1 Get System Metrics

**Endpoint**: `GET /api/v1/admin/monitoring/stats`

**Response**:
```typescript
interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  database: {
    status: 'healthy' | 'warning' | 'critical';
    connectionCount: number;
    queryTime: number;
  };
  application: {
    uptime: number;
    activeUsers: number;
    requestRate: number;
  };
}

type GetSystemMetricsResponse = ApiResponse<SystemMetrics>;
```

**Implementation**:
```typescript
// src/lib/api/admin/monitoring.ts
export const getSystemMetrics = async () => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/admin/monitoring/stats`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch system metrics');
  }

  return response.json();
};
```

---

## 📋 Insurance APIs

### 1. Insurance Contract APIs

#### 1.1 Get Insurance Contracts

**Endpoint**: `GET /api/v1/insurance/contracts`

**Request Parameters**:
```typescript
interface GetInsuranceContractsParams {
  page?: number;
  limit?: number;
  status?: 'active' | 'expired' | 'cancelled' | 'pending';
  type?: 'bao_vien_than' | 'bao_vat_chat' | 'dung_chung';
  customerId?: string;
  vehicleId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}
```

**Response**:
```typescript
interface InsuranceContract {
  id: string;
  contractNumber: string;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  vehicle: {
    id: string;
    vin: string;
    model: string;
    year: number;
  };
  insuranceType: string;
  premiumAmount: number;
  coverageAmount: number;
  startDate: string;
  endDate: string;
  status: string;
  policyNumber?: string;
  insuranceCompany?: string;
  createdAt: string;
  updatedAt: string;
}

type GetInsuranceContractsResponse = PaginatedResponse<InsuranceContract>;
```

**Implementation**:
```typescript
// src/lib/api/insurance/contracts.ts
export const getInsuranceContracts = async (params: GetInsuranceContractsParams = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(`${API_CONFIG.BASE_URL}/insurance/contracts?${searchParams}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch insurance contracts');
  }

  return response.json();
};
```

#### 1.2 Get Insurance Contract Details

**Endpoint**: `GET /api/v1/insurance/contracts/:id`

**Response**:
```typescript
interface InsuranceContractDetail extends InsuranceContract {
  claims: InsuranceClaim[];
  paymentHistory: InsurancePayment[];
  documents: InsuranceDocument[];
}
```

#### 1.3 Create Insurance Contract

**Endpoint**: `POST /api/v1/insurance/contracts`

**Request Body**:
```typescript
interface CreateInsuranceContractRequest {
  customerId: string;
  vehicleId: string;
  insuranceType: 'bao_vien_than' | 'bao_vat_chat' | 'dung_chung';
  premiumAmount: number;
  coverageAmount: number;
  startDate: string;
  endDate: string;
  policyNumber?: string;
  insuranceCompany?: string;
  notes?: string;
}
```

**Implementation**:
```typescript
export const createInsuranceContract = async (data: CreateInsuranceContractRequest) => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/insurance/contracts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create insurance contract');
  }

  return response.json();
};
```

#### 1.4 Update Insurance Contract

**Endpoint**: `PUT /api/v1/insurance/contracts/:id`

**Request Body**:
```typescript
interface UpdateInsuranceContractRequest {
  customerId?: string;
  vehicleId?: string;
  insuranceType?: string;
  premiumAmount?: number;
  coverageAmount?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  policyNumber?: string;
  insuranceCompany?: string;
  notes?: string;
}
```

### 2. Insurance Claim APIs

#### 2.1 Get Insurance Claims

**Endpoint**: `GET /api/v1/insurance/claims`

**Request Parameters**:
```typescript
interface GetInsuranceClaimsParams {
  page?: number;
  limit?: number;
  status?: 'submitted' | 'reviewing' | 'approved' | 'rejected' | 'paid';
  contractId?: string;
  customerId?: string;
  startDate?: string;
  endDate?: string;
}
```

**Response**:
```typescript
interface InsuranceClaim {
  id: string;
  claimNumber: string;
  contract: {
    id: string;
    contractNumber: string;
    customer: {
      id: string;
      name: string;
    };
  };
  incidentDate: string;
  incidentType: string;
  incidentDescription: string;
  claimAmount: number;
  approvedAmount?: number;
  status: string;
  approvalNotes?: string;
  rejectionReason?: string;
  paymentDate?: string;
  paymentReference?: string;
  incidentPhotos?: string[];
  supportingDocuments?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

type GetInsuranceClaimsResponse = PaginatedResponse<InsuranceClaim>;
```

**Implementation**:
```typescript
// src/lib/api/insurance/claims.ts
export const getInsuranceClaims = async (params: GetInsuranceClaimsParams = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(`${API_CONFIG.BASE_URL}/insurance/claims?${searchParams}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch insurance claims');
  }

  return response.json();
};
```

#### 2.2 Get Insurance Claim Details

**Endpoint**: `GET /api/v1/insurance/claims/:id`

**Response**:
```typescript
interface InsuranceClaimDetail extends InsuranceClaim {
  approvalHistory: ClaimApprovalStep[];
  documents: ClaimDocument[];
}
```

#### 2.3 Create Insurance Claim

**Endpoint**: `POST /api/v1/insurance/claims`

**Request Body**:
```typescript
interface CreateInsuranceClaimRequest {
  contractId: string;
  incidentDate: string;
  incidentType: string;
  incidentDescription: string;
  claimAmount: number;
  incidentPhotos?: File[];
  supportingDocuments?: File[];
}
```

**Implementation**:
```typescript
export const createInsuranceClaim = async (data: CreateInsuranceClaimRequest) => {
  const formData = new FormData();
  
  // Add regular fields
  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'incidentPhotos' && key !== 'supportingDocuments') {
      formData.append(key, value.toString());
    }
  });

  // Add files if any
  if (data.incidentPhotos) {
    data.incidentPhotos.forEach((file, index) => {
      formData.append(`incidentPhotos[${index}]`, file);
    });
  }

  if (data.supportingDocuments) {
    data.supportingDocuments.forEach((file, index) => {
      formData.append(`supportingDocuments[${index}]`, file);
    });
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/insurance/claims`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create insurance claim');
  }

  return response.json();
};
```

#### 2.4 Update Insurance Claim Status

**Endpoint**: `PUT /api/v1/insurance/claims/:id/status`

**Request Body**:
```typescript
interface UpdateClaimStatusRequest {
  status: 'submitted' | 'reviewing' | 'approved' | 'rejected' | 'paid';
  approvedAmount?: number;
  approvalNotes?: string;
  rejectionReason?: string;
  paymentDate?: string;
  paymentReference?: string;
}
```

**Implementation**:
```typescript
export const updateClaimStatus = async (claimId: string, data: UpdateClaimStatusRequest) => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/insurance/claims/${claimId}/status`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update claim status');
  }

  return response.json();
};
```

---

## 🛡️ Authentication & Authorization

### Token Management

```typescript
// src/lib/api/auth.ts
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
```

### API Request Interceptor

```typescript
// src/lib/api/interceptor.ts
export const apiRequest = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();
  
  if (token && isTokenExpired(token)) {
    // Token expired, redirect to login
    window.location.href = '/login';
    throw new Error('Token expired');
  }

  const headers = {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Unauthorized, redirect to login
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (response.status === 403) {
    // Forbidden, show error
    throw new Error('Access denied');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};
```

---

## 📊 Error Handling

### Error Types

```typescript
// src/lib/api/errors.ts
export enum ApiErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
}

export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### Error Handler

```typescript
// src/lib/api/handler.ts
export const handleApiError = (error: unknown): never => {
  if (error instanceof ApiError) {
    throw error;
  }

  if (error instanceof Error) {
    if (error.message.includes('Network')) {
      throw new ApiError(ApiErrorCode.NETWORK_ERROR, 'Network error occurred');
    }
    
    if (error.message.includes('timeout')) {
      throw new ApiError(ApiErrorCode.TIMEOUT_ERROR, 'Request timeout');
    }
  }

  throw new ApiError(ApiErrorCode.INTERNAL_ERROR, 'An unexpected error occurred');
};
```

---

## 🔄 API Client

### Centralized API Client

```typescript
// src/lib/api/client.ts
import { apiRequest } from './interceptor';
import { handleApiError } from './errors';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, value.toString());
          }
        });
      }

      const response = await apiRequest(url.toString());
      return response.data as T;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await apiRequest(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      });
      return response.data as T;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await apiRequest(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      });
      return response.data as T;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    try {
      const response = await apiRequest(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
      });
      return response.data as T;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async upload<T = any>(endpoint: string, formData: FormData): Promise<T> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.data as T;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
```

---

## ✅ Testing Strategy

### Unit Tests

```typescript
// tests/api/admin/users.test.ts
import { getUsers, createUser } from '@/lib/api/admin/users';
import { apiClient } from '@/lib/api/client';

jest.mock('@/lib/api/client');

describe('User API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should fetch users with default parameters', async () => {
      const mockUsers = {
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockUsers);

      const result = await getUsers();

      expect(apiClient.get).toHaveBeenCalledWith('/admin/users', {});
      expect(result).toEqual(mockUsers);
    });

    it('should fetch users with custom parameters', async () => {
      const mockUsers = {
        data: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockUsers);

      const params = { page: 1, limit: 20, role: 'ADMIN' };
      const result = await getUsers(params);

      expect(apiClient.get).toHaveBeenCalledWith('/admin/users', params);
      expect(result).toEqual(mockUsers);
    });
  });
});
```

### Integration Tests

```typescript
// tests/api/integration.test.ts
import { apiClient } from '@/lib/api/client';

describe('API Integration', () => {
  beforeAll(() => {
    // Setup test database
  });

  afterAll(() => {
    // Cleanup test database
  });

  describe('User Management Flow', () => {
    it('should create, update, and delete user', async () => {
      // Create user
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        roleId: 'rol-003',
        password: 'testpass123',
      };

      const createdUser = await apiClient.post('/admin/users', userData);
      expect(createdUser.email).toBe(userData.email);

      // Update user role
      await apiClient.put(`/admin/users/${createdUser.id}/role`, {
        roleId: 'rol-004',
      });

      // Verify user
      const user = await apiClient.get(`/admin/users/${createdUser.id}`);
      expect(user.role.id).toBe('rol-004');
    });
  });
});
```

---

**End of API Implementation Plan**