# API Implementation: CR-20260203-005 - Part-Vehicle Compatibility

## Document Information
- **CR ID**: CR-20260203-005
- **Title**: Add Part-Vehicle Compatibility Feature
- **Date**: 03/02/2026
- **Author**: OpenCode - API Implementation Authority

---

## 1. API Overview

**Total Endpoints**: 7 new endpoints

**Purpose**: Provide RESTful APIs for managing Part-Vehicle Compatibility

**Technology**:
- Framework: NestJS
- Language: TypeScript
- ORM: Prisma
- Validation: class-validator
- DTO: TypeScript interfaces

---

## 2. API Endpoints Specification

### 2.1 Endpoint 1: GET /api/part-compatibility/:part_id

#### Request Specification

**FRD Reference**: FR-MD-009-01 (Manage Part Compatibility)

**ERD Reference**: `part_vehicle_compatibility` table

**Purpose**: Get all vehicle models compatible with a specific part

**Method**: GET

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `part_id` | UUID | Yes | Part identifier |

**Query Parameters**: None

**Request Headers**:
```
Authorization: Bearer {token}
```

---

#### Response Specification

**Success Response**: 200 OK

```typescript
interface GetPartCompatibilityResponse {
  part_id: string;
  part_name: string;
  part_number: string;
  compatible_models: CompatibleModel[];
  is_universal: boolean;
}

interface CompatibleModel {
  model_id: string;
  model_code: string;
  model_name: string;
  category: 'SEDAN' | 'SUV' | 'HATCHBACK' | 'MPV';
  compatible_since: string; // ISO 8601 datetime
}
```

**Example Response**:
```json
{
  "part_id": "550e8400-e29b-41d4-a716-446655440001",
  "part_name": "Engine Oil Filter",
  "part_number": "P-OIL-001",
  "compatible_models": [
    {
      "model_id": "660e8400-e29b-41d4-a716-446655440001",
      "model_code": "MOD/2026/001",
      "model_name": "Honda City RS",
      "category": "SEDAN",
      "compatible_since": "2026-02-03T10:00:00Z"
    },
    {
      "model_id": "660e8400-e29b-41d4-a716-446655440003",
      "model_code": "MOD/2026/003",
      "model_name": "Honda Civic RS",
      "category": "SEDAN",
      "compatible_since": "2026-02-03T10:00:00Z"
    }
  ],
  "is_universal": false
}
```

**Error Responses**:

| Error Code | HTTP Status | Description |
|------------|--------------|-------------|
| PART_NOT_FOUND | 404 | Part with given ID not found |
| UNAUTHORIZED | 401 | Missing or invalid authentication token |
| FORBIDDEN | 403 | User lacks PARTS.READ permission |

**Error Response Format**:
```json
{
  "error": {
    "code": "PART_NOT_FOUND",
    "message": "Part not found with id: 550e8400-e29b-41d4-a716-446655440001",
    "timestamp": "2026-02-03T10:00:00Z"
  }
}
```

---

### 2.2 Endpoint 2: POST /api/part-compatibility

#### Request Specification

**FRD Reference**: FR-MD-009-01 (Manage Part Compatibility)

**ERD Reference**: `part_vehicle_compatibility` table

**Purpose**: Create/Replace vehicle model compatibility for a part

**Method**: POST

**Path Parameters**: None

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```typescript
interface CreatePartCompatibilityRequest {
  part_id: string;
  vehicle_model_ids: string[]; // Empty array = universal part
  created_by?: string; // Optional, auto-populate from JWT
}
```

**Validation Rules**:
- `part_id`: Required, must be valid UUID
- `vehicle_model_ids`: Required, must be array of valid UUIDs
  - All model IDs must exist in `vehicle_models` table
  - All models must have `status = 'ACTIVE'`
  - Duplicate model IDs are ignored (UNIQUE constraint)
- Empty array (`[]`) → Part is universal (all models compatible)
- Null or undefined → Invalid (must provide array)

**Example Request**:
```json
{
  "part_id": "550e8400-e29b-41d4-a716-446655440001",
  "vehicle_model_ids": [
    "660e8400-e29b-41d4-a716-446655440001",
    "660e8400-e29b-41d4-a716-446655440003"
  ]
}
```

**Universal Part Request**:
```json
{
  "part_id": "550e8400-e29b-41d4-a716-446655440001",
  "vehicle_model_ids": []
}
```

---

#### Response Specification

**Success Response**: 201 Created

```typescript
interface CreatePartCompatibilityResponse {
  success: true;
  part_id: string;
  compatible_models_count: number;
  is_universal: boolean;
  message: string;
  created_at: string;
}
```

**Example Response**:
```json
{
  "success": true,
  "part_id": "550e8400-e29b-41d4-a716-446655440001",
  "compatible_models_count": 2,
  "is_universal": false,
  "message": "Compatibility updated successfully",
  "created_at": "2026-02-03T10:05:00Z"
}
```

**Universal Part Response**:
```json
{
  "success": true,
  "part_id": "550e8400-e29b-41d4-a716-446655440001",
  "compatible_models_count": 0,
  "is_universal": true,
  "message": "Part set to universal (compatible with all models)",
  "created_at": "2026-02-03T10:05:00Z"
}
```

**Error Responses**:

| Error Code | HTTP Status | Description |
|------------|--------------|-------------|
| PART_NOT_FOUND | 404 | Part with given ID not found |
| MODEL_NOT_FOUND | 404 | One or more vehicle model IDs not found |
| MODEL_INACTIVE | 400 | One or more models are not ACTIVE |
| INVALID_UUID | 400 | Invalid UUID format |
| UNAUTHORIZED | 401 | Missing or invalid authentication token |
| FORBIDDEN | 403 | User lacks MASTER_DATA.UPDATE permission |

**Error Response Format**:
```json
{
  "error": {
    "code": "MODEL_INACTIVE",
    "message": "Cannot create compatibility with inactive models: [MOD/2026/005]",
    "details": {
      "inactive_model_ids": [
        "660e8400-e29b-41d4-a716-446655440005"
      ]
    },
    "timestamp": "2026-02-03T10:05:00Z"
  }
}
```

---

### 2.3 Endpoint 3: DELETE /api/part-compatibility/:part_id/:model_id

#### Request Specification

**FRD Reference**: FR-MD-009-01 (Manage Part Compatibility)

**ERD Reference**: `part_vehicle_compatibility` table

**Purpose**: Remove specific compatibility (part + model)

**Method**: DELETE

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `part_id` | UUID | Yes | Part identifier |
| `model_id` | UUID | Yes | Vehicle model identifier |

**Query Parameters**: None

**Request Headers**:
```
Authorization: Bearer {token}
```

---

#### Response Specification

**Success Response**: 200 OK

```typescript
interface DeletePartCompatibilityResponse {
  success: true;
  part_id: string;
  model_id: string;
  message: string;
  deleted_at: string;
}
```

**Example Response**:
```json
{
  "success": true,
  "part_id": "550e8400-e29b-41d4-a716-446655440001",
  "model_id": "660e8400-e29b-41d4-a716-446655440003",
  "message": "Compatibility removed successfully",
  "deleted_at": "2026-02-03T10:10:00Z"
}
```

**Error Responses**:

| Error Code | HTTP Status | Description |
|------------|--------------|-------------|
| COMPATIBILITY_NOT_FOUND | 404 | Compatibility record not found |
| PART_NOT_FOUND | 404 | Part with given ID not found |
| MODEL_NOT_FOUND | 404 | Vehicle model with given ID not found |
| UNAUTHORIZED | 401 | Missing or invalid authentication token |
| FORBIDDEN | 403 | User lacks MASTER_DATA.UPDATE permission |

---

### 2.4 Endpoint 4: GET /api/part-compatibility/matrix

#### Request Specification

**FRD Reference**: FR-MD-009-02 (Compatibility Matrix)

**ERD Reference**: `part_vehicle_compatibility` table

**Purpose**: Get compatibility matrix data for grid view

**Method**: GET

**Path Parameters**: None

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number (1-indexed) |
| `limit` | number | No | 20 | Items per page (max 100) |

**Request Headers**:
```
Authorization: Bearer {token}
```

---

#### Response Specification

**Success Response**: 200 OK

```typescript
interface GetCompatibilityMatrixResponse {
  parts: PartMatrix[];
  vehicle_models: VehicleModel[];
  pagination: Pagination;
}

interface PartMatrix {
  part_id: string;
  part_number: string;
  part_name: string;
  category: string;
  compatible_model_ids: string[];
  is_universal: boolean;
}

interface VehicleModel {
  model_id: string;
  model_code: string;
  model_name: string;
  category: 'SEDAN' | 'SUV' | 'HATCHBACK' | 'MPV';
  status: 'ACTIVE' | 'INACTIVE';
}

interface Pagination {
  page: number;
  limit: number;
  total_parts: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
```

**Example Response**:
```json
{
  "parts": [
    {
      "part_id": "550e8400-e29b-41d4-a716-446655440001",
      "part_number": "P-OIL-001",
      "part_name": "Engine Oil Filter",
      "category": "Engine",
      "compatible_model_ids": [
        "660e8400-e29b-41d4-a716-446655440001",
        "660e8400-e29b-41d4-a716-446655440003"
      ],
      "is_universal": false
    },
    {
      "part_id": "550e8400-e29b-41d4-a716-446655440002",
      "part_number": "P-AIR-001",
      "part_name": "Air Freshener",
      "category": "Interior",
      "compatible_model_ids": [],
      "is_universal": true
    }
  ],
  "vehicle_models": [
    {
      "model_id": "660e8400-e29b-41d4-a716-446655440001",
      "model_code": "MOD/2026/001",
      "model_name": "Honda City RS",
      "category": "SEDAN",
      "status": "ACTIVE"
    },
    {
      "model_id": "660e8400-e29b-41d4-a716-446655440003",
      "model_code": "MOD/2026/003",
      "model_name": "Honda Civic RS",
      "category": "SEDAN",
      "status": "ACTIVE"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_parts": 100,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

**Error Responses**:

| Error Code | HTTP Status | Description |
|------------|--------------|-------------|
| UNAUTHORIZED | 401 | Missing or invalid authentication token |
| FORBIDDEN | 403 | User lacks MASTER_DATA.READ permission |

---

### 2.5 Endpoint 5: POST /api/part-compatibility/matrix

#### Request Specification

**FRD Reference**: FR-MD-009-02 (Compatibility Matrix)

**ERD Reference**: `part_vehicle_compatibility` table

**Purpose**: Batch update compatibility matrix from UI grid

**Method**: POST

**Path Parameters**: None

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```typescript
interface UpdateCompatibilityMatrixRequest {
  updates: MatrixUpdate[];
}

interface MatrixUpdate {
  part_id: string;
  vehicle_model_ids: string[]; // Empty array = universal part
}
```

**Validation Rules**:
- `updates`: Required, non-empty array
- `part_id`: Required, must be valid UUID
- `vehicle_model_ids`: Required, must be array of valid UUIDs
  - All model IDs must exist in `vehicle_models` table
  - All models must be `status = 'ACTIVE'`
- Empty array (`[]`) → Part is universal

**Example Request**:
```json
{
  "updates": [
    {
      "part_id": "550e8400-e29b-41d4-a716-446655440001",
      "vehicle_model_ids": [
        "660e8400-e29b-41d4-a716-446655440001",
        "660e8400-e29b-41d4-a716-446655440003"
      ]
    },
    {
      "part_id": "550e8400-e29b-41d4-a716-446655440002",
      "vehicle_model_ids": []
    }
  ]
}
```

---

#### Response Specification

**Success Response**: 200 OK

```typescript
interface UpdateCompatibilityMatrixResponse {
  success: true;
  updated_parts_count: number;
  created_compatibility_records: number;
  deleted_compatibility_records: number;
  message: string;
  updated_at: string;
}
```

**Example Response**:
```json
{
  "success": true,
  "updated_parts_count": 2,
  "created_compatibility_records": 2,
  "deleted_compatibility_records": 0,
  "message": "Compatibility matrix updated successfully",
  "updated_at": "2026-02-03T10:15:00Z"
}
```

**Error Responses**:

| Error Code | HTTP Status | Description |
|------------|--------------|-------------|
| PART_NOT_FOUND | 404 | One or more parts not found |
| MODEL_NOT_FOUND | 404 | One or more vehicle model IDs not found |
| MODEL_INACTIVE | 400 | One or more models are not ACTIVE |
| INVALID_UUID | 400 | Invalid UUID format |
| UNAUTHORIZED | 401 | Missing or invalid authentication token |
| FORBIDDEN | 403 | User lacks MASTER_DATA.UPDATE permission |

**Error Response Format**:
```json
{
  "error": {
    "code": "MODEL_INACTIVE",
    "message": "Cannot create compatibility with inactive models",
    "details": {
      "inactive_model_ids": ["660e8400-e29b-41d4-a716-446655440005"],
      "part_ids": ["550e8400-e29b-41d4-a716-446655440001"]
    },
    "timestamp": "2026-02-03T10:15:00Z"
  }
}
```

---

### 2.6 Endpoint 6: GET /api/parts (Updated)

#### Request Specification

**FRD Reference**: SCR-PRT-001 (Tổng Quan Tồn Kho)

**ERD Reference**: `parts` + `part_vehicle_compatibility` tables

**Purpose**: List parts with optional filter by vehicle model

**Method**: GET

**Path Parameters**: None

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | - | Search by part number or name (partial match) |
| `category` | string[] | No | - | Filter by category |
| `status` | string | No | ACTIVE | Filter by status (ACTIVE, INACTIVE, ALL) |
| `vehicle_model_id` | UUID | No | - | **NEW: Filter by vehicle model compatibility** |
| `min_price` | number | No | - | Minimum price |
| `max_price` | number | No | - | Maximum price |
| `page` | number | No | 1 | Page number (1-indexed) |
| `limit` | number | No | 20 | Items per page (max 100) |
| `sort` | string | No | created_at:desc | Sort field:direction |

**Request Headers**:
```
Authorization: Bearer {token}
```

**Filter Logic (vehicle_model_id)**:
- If `vehicle_model_id` is provided → Return parts WHERE:
  - Part has compatibility record for this model **OR**
  - Part has NO compatibility records (universal)
- If `vehicle_model_id` is NOT provided → Return all parts (no compatibility filter)

---

#### Response Specification

**Success Response**: 200 OK

```typescript
interface GetPartsResponse {
  data: PartWithCompatibility[];
  meta: Pagination;
}

interface PartWithCompatibility {
  id: string;
  part_number: string;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  min_stock: number;
  max_stock: number;
  unit_price: number;
  cost_price: number;
  supplier_id?: string;
  location?: string;
  status: 'ACTIVE' | 'INACTIVE';
  compatible_models?: CompatibleModel[]; // NEW FIELD
  is_universal: boolean; // NEW FIELD
  created_at: string;
  updated_at: string;
}

interface CompatibleModel {
  model_id: string;
  model_name: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
```

**Example Response** (with vehicle_model_id filter):
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "part_number": "P-OIL-001",
      "name": "Engine Oil Filter",
      "category": "Engine",
      "quantity": 50,
      "min_stock": 10,
      "max_stock": 100,
      "unit_price": 50000.00,
      "cost_price": 35000.00,
      "status": "ACTIVE",
      "compatible_models": [
        {
          "model_id": "660e8400-e29b-41d4-a716-446655440001",
          "model_name": "Honda City RS"
        }
      ],
      "is_universal": false,
      "created_at": "2026-01-01T10:00:00Z",
      "updated_at": "2026-02-03T10:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "part_number": "P-AIR-001",
      "name": "Air Freshener",
      "category": "Interior",
      "quantity": 100,
      "min_stock": 20,
      "max_stock": 200,
      "unit_price": 10000.00,
      "cost_price": 5000.00,
      "status": "ACTIVE",
      "compatible_models": [],
      "is_universal": true,
      "created_at": "2026-01-01T10:00:00Z",
      "updated_at": "2026-01-01T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

**Error Responses**:

| Error Code | HTTP Status | Description |
|------------|--------------|-------------|
| MODEL_NOT_FOUND | 404 | Vehicle model ID not found (if vehicle_model_id provided) |
| UNAUTHORIZED | 401 | Missing or invalid authentication token |
| FORBIDDEN | 403 | User lacks PARTS.READ permission |

---

### 2.7 Endpoint 7: PUT /api/parts/:id (Updated)

#### Request Specification

**FRD Reference**: SCR-PRT-001 (Tổng Quan Tồn Kho)

**ERD Reference**: `parts` + `part_vehicle_compatibility` tables

**Purpose**: Update part with optional compatibility field

**Method**: PUT

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Part identifier |

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```typescript
interface UpdatePartRequest {
  part_number?: string;
  name?: string;
  description?: string;
  category?: string;
  quantity?: number;
  min_stock?: number;
  max_stock?: number;
  unit_price?: number;
  cost_price?: number;
  supplier_id?: string;
  location?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  vehicle_model_ids?: string[]; // NEW OPTIONAL FIELD
}
```

**Validation Rules**:
- All existing fields validated as before
- `vehicle_model_ids` (NEW):
  - Optional
  - Must be array of valid UUIDs
  - All models must be `status = 'ACTIVE'`
  - Empty array → Part becomes universal

**Example Request**:
```json
{
  "name": "Engine Oil Filter Premium",
  "quantity": 60,
  "vehicle_model_ids": [
    "660e8400-e29b-41d4-a716-446655440001",
    "660e8400-e29b-41d4-a716-446655440003"
  ]
}
```

---

#### Response Specification

**Success Response**: 200 OK

```typescript
interface UpdatePartResponse {
  id: string;
  part_number: string;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  min_stock: number;
  max_stock: number;
  unit_price: number;
  cost_price: number;
  supplier_id?: string;
  location?: string;
  status: 'ACTIVE' | 'INACTIVE';
  compatible_models?: CompatibleModel[];
  is_universal: boolean;
  updated_at: string;
}
```

**Example Response**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "part_number": "P-OIL-001",
  "name": "Engine Oil Filter Premium",
  "category": "Engine",
  "quantity": 60,
  "min_stock": 10,
  "max_stock": 100,
  "unit_price": 50000.00,
  "cost_price": 35000.00,
  "status": "ACTIVE",
  "compatible_models": [
    {
      "model_id": "660e8400-e29b-41d4-a716-446655440001",
      "model_name": "Honda City RS"
    },
    {
      "model_id": "660e8400-e29b-41d4-a716-446655440003",
      "model_name": "Honda Civic RS"
    }
  ],
  "is_universal": false,
  "updated_at": "2026-02-03T10:20:00Z"
}
```

**Error Responses**:

| Error Code | HTTP Status | Description |
|------------|--------------|-------------|
| PART_NOT_FOUND | 404 | Part with given ID not found |
| MODEL_NOT_FOUND | 404 | One or more vehicle model IDs not found |
| MODEL_INACTIVE | 400 | One or more models are not ACTIVE |
| INVALID_UUID | 400 | Invalid UUID format |
| UNAUTHORIZED | 401 | Missing or invalid authentication token |
| FORBIDDEN | 403 | User lacks PARTS.UPDATE permission |

---

## 3. Error Code Reference

### 3.1 Error Codes List

| Error Code | Category | HTTP Status | Description |
|------------|----------|--------------|-------------|
| PART_NOT_FOUND | Business Logic | 404 | Part not found |
| MODEL_NOT_FOUND | Business Logic | 404 | Vehicle model not found |
| COMPATIBILITY_NOT_FOUND | Business Logic | 404 | Compatibility record not found |
| MODEL_INACTIVE | Validation | 400 | Vehicle model is not ACTIVE |
| INVALID_UUID | Validation | 400 | Invalid UUID format |
| UNAUTHORIZED | Authentication | 401 | Missing or invalid token |
| FORBIDDEN | Authorization | 403 | Insufficient permissions |

### 3.2 Error Response Structure

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: {
      [key: string]: any;
    };
    timestamp: string; // ISO 8601
  };
}
```

---

## 4. Permission Matrix

| Endpoint | READ Permission | WRITE Permission | Role Required |
|----------|-----------------|------------------|---------------|
| GET /api/part-compatibility/:part_id | PARTS.READ | - | Any |
| POST /api/part-compatibility | - | MASTER_DATA.UPDATE | Admin, Parts Manager |
| DELETE /api/part-compatibility/:part_id/:model_id | - | MASTER_DATA.UPDATE | Admin, Parts Manager |
| GET /api/part-compatibility/matrix | MASTER_DATA.READ | - | Any |
| POST /api/part-compatibility/matrix | - | MASTER_DATA.UPDATE | Admin, Parts Manager |
| GET /api/parts (updated) | PARTS.READ | - | Any |
| PUT /api/parts/:id (updated) | - | PARTS.UPDATE | Admin, Parts Manager |

---

## 5. Rate Limiting

| Endpoint | Rate Limit | Burst |
|----------|------------|-------|
| All endpoints | 100 requests/minute | 20 requests |

---

**END OF API IMPLEMENTATION DOCUMENT**
