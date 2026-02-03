# API Specification: Master Data Management

## Document Information
- **Module**: Master Data Management
- **Version**: 1.2
- **Created**: 02/02/2026
- **Updated by**: CR-20260202-001
- **Author**: Antigravity - API Architect
- **Project**: Honda SPICE ERP System

---

## 📋 Mục Lục

1. [Endpoints Overview](#1-endpoints-overview)
2. [Endpoint Details](#2-endpoint-details)
3. [Data Mapping](#3-data-mapping)
4. [Integration Points](#4-integration-points)
5. [Audit Logging](#5-audit-logging)

---

## 1. Endpoints Overview

### 1.1 VehicleModel Endpoints (Existing + CR-MD-001)

| Method | Endpoint | Description | Added By | Breaking |
|--------|----------|-------------|----------|----------|
| GET | /api/vehicle-models | List all models | Existing | No |
| POST | /api/vehicle-models | Create model | Existing | No |
| PATCH | /api/vehicle-models/[id] | Update model | **CR-MD-001** | **No** |
| DELETE | /api/vehicle-models/[id] | Soft delete model | **CR-MD-001** | **No** |

### 1.2 Accessory Endpoints (NEW - CR-MD-002)

| Method | Endpoint | Description | Added By | Breaking |
|--------|----------|-------------|----------|----------|
| GET | /api/accessories | List all accessories | **CR-MD-002** | **NEW** |
| POST | /api/accessories | Create accessory | **CR-MD-002** | **NEW** |
| PATCH | /api/accessories/[id] | Update accessory | **CR-MD-002** | **NEW** |
| DELETE | /api/accessories/[id] | Soft delete accessory | **CR-MD-002** | **NEW** |
| GET | /api/accessories/[id]/compatibility | Get compatible models | **CR-MD-002** | **NEW** |
| POST | /api/accessories/[id]/compatibility | Add model compatibility | **CR-MD-002** | **NEW** |
| DELETE | /api/accessories/[id]/compatibility/[model_id] | Remove model compatibility | **CR-MD-002** | **NEW** |
| GET | /api/accessories/[id]/price-history | Get price history | **CR-MD-002** | **NEW** |

### 1.3 ServiceCatalog Endpoints (NEW - CR-MD-003)

| Method | Endpoint | Description | Added By | Breaking |
|--------|----------|-------------|----------|----------|
| GET | /api/service-catalogs | List all services | **CR-MD-003** | **NEW** |
| POST | /api/service-catalogs | Create service | **CR-MD-003** | **NEW** |
| PATCH | /api/service-catalogs/[id] | Update service | **CR-MD-003** | **NEW** |
| DELETE | /api/service-catalogs/[id] | Soft delete service | **CR-MD-003** | **NEW** |
| GET | /api/service-catalogs/[id]/parts | Get service parts | **CR-MD-003** | **NEW** |
| POST | /api/service-catalogs/[id]/parts | Add service part | **CR-MD-003** | **NEW** |
| DELETE | /api/service-catalogs/[id]/parts/[part_id] | Remove service part | **CR-MD-003** | **NEW** |
| GET | /api/service-catalogs/packages | List service packages | **CR-MD-003** | **NEW** |
| POST | /api/service-catalogs/packages | Create service package | **CR-MD-003** | **NEW** |
| PATCH | /api/service-catalogs/packages/[id] | Update service package | **CR-MD-003** | **NEW** |
| DELETE | /api/service-catalogs/packages/[id] | Delete service package | **CR-MD-003** | **NEW** |

### 1.4 ServiceBay Endpoints (NEW - CR-MD-004)

| Method | Endpoint | Description | Added By | Breaking |
|--------|----------|-------------|----------|----------|
| GET | /api/service-bays | List all service bays | **CR-MD-004** | **NEW** |
| POST | /api/service-bays | Create service bay | **CR-MD-004** | **NEW** |
| PATCH | /api/service-bays/[id] | Update service bay | **CR-MD-004** | **NEW** |
| DELETE | /api/service-bays/[id] | Soft delete service bay | **CR-MD-004** | **NEW** |
| GET | /api/service-bays/[id]/usage | Get bay usage statistics | **CR-MD-004** | **NEW** |

### 1.5 ScoringRule Endpoints (NEW - CR-MD-004)

| Method | Endpoint | Description | Added By | Breaking |
|--------|----------|-------------|----------|----------|
| GET | /api/scoring-rules | List all scoring rules | **CR-MD-004** | **NEW** |
| POST | /api/scoring-rules | Create scoring rule | **CR-MD-004** | **NEW** |
| PATCH | /api/scoring-rules/[id] | Update scoring rule | **CR-MD-004** | **NEW** |
| DELETE | /api/scoring-rules/[id] | Soft delete scoring rule | **CR-MD-004** | **NEW** |
| POST | /api/scoring-rules/[id]/test | Test scoring rule | **CR-MD-004** | **NEW** |

### 1.6 SystemSetting Endpoints (NEW - CR-MD-004)

| Method | Endpoint | Description | Added By | Breaking |
|--------|----------|-------------|----------|----------|
| GET | /api/system-settings | List all system settings | **CR-MD-004** | **NEW** |
| POST | /api/system-settings | Create system setting | **CR-MD-004** | **NEW** |
| PATCH | /api/system-settings/[id] | Update system setting | **CR-MD-004** | **NEW** |
| DELETE | /api/system-settings/[id] | Soft delete system setting | **CR-MD-004** | **NEW** |
| PATCH | /api/system-settings/[id]/value | Update setting value only | **CR-MD-004** | **NEW** |
| POST | /api/system-settings/[id]/reset | Reset setting to default | **CR-MD-004** | **NEW** |

### 1.7 Employee Endpoints (NEW - CR-20260202-001)

| Method | Endpoint | Description | Added By | Breaking |
|--------|----------|-------------|----------|----------|
| GET | /api/master/employees | List employees | **CR-001** | **NEW** |
| POST | /api/master/employees | Create employee | **CR-001** | **NEW** |
| GET | /api/master/employees/[id] | Get detail | **CR-001** | **NEW** |
| PUT | /api/master/employees/[id] | Update profile | **CR-001** | **NEW** |
| GET | /api/master/departments | List departments | **CR-001** | **NEW** |
| GET | /api/master/positions | List positions | **CR-001** | **NEW** |

### 1.8 Supplier Endpoints (NEW - CR-20260202-001)

| Method | Endpoint | Description | Added By | Breaking |
|--------|----------|-------------|----------|----------|
| GET | /api/master/suppliers | List suppliers | **CR-001** | **NEW** |
| POST | /api/master/suppliers | Create supplier | **CR-001** | **NEW** |
| PUT | /api/master/suppliers/[id] | Update supplier | **CR-001** | **NEW** |

### 1.9 Inventory Endpoints (Warehouse/UOM) (NEW - CR-20260202-001)

| Method | Endpoint | Description | Added By | Breaking |
|--------|----------|-------------|----------|----------|
| GET | /api/master/warehouses | List warehouses | **CR-001** | **NEW** |
| POST | /api/master/warehouses | Create warehouse | **CR-001** | **NEW** |
| GET | /api/master/uoms | List UOMs | **CR-001** | **NEW** |
| POST | /api/master/uoms | Create UOM | **CR-001** | **NEW** |

**Breaking Change Analysis**:
- ✅ All VehicleModel endpoints: NO CHANGES (backward compatible)
- ✅ All NEW endpoints: No breaking changes (adding new functionality)
- ✅ Total: 36 new endpoints (24 + 12), 0 breaking changes

---

## 2. Endpoint Details

### 2.1 VehicleModel Endpoints (Existing - No Changes)

#### 2.1.1 GET /api/vehicle-models

**Status**: ✅ Existing (no changes)  
**Purpose**: Retrieve list of vehicle models with filtering, sorting, pagination

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | - | Search by name or code (partial match) |
| `category` | string[] | No | - | Filter by category (SEDAN, SUV, HATCHBACK, MPV) |
| `status` | string | No | ACTIVE | Filter by status (ACTIVE, INACTIVE, ALL) |
| `min_price` | number | No | 0 | Minimum base price |
| `max_price` | number | No | - | Maximum base price |
| `page` | number | No | 1 | Page number (1-indexed) |
| `limit` | number | No | 20 | Items per page (max 100) |
| `sort` | string | No | created_at:desc | Sort field:direction |

**Request Example**:
```http
GET /api/vehicle-models?search=city&category=SEDAN&status=ACTIVE&page=1&limit=20&sort=model_name:asc
```

**Response**: 200 OK
```json
{
  "data": [
    {
      "id": 1,
      "model_code": "MOD/2026/001",
      "model_name": "Honda City RS",
      "category": "SEDAN",
      "base_price": 559000000.00,
      "status": "ACTIVE",
      "created_at": "2026-01-30T10:00:00Z",
      "updated_at": "2026-01-30T10:00:00Z",
      "deleted_at": null
    },
    {
      "id": 3,
      "model_code": "MOD/2026/003",
      "model_name": "Honda City Hatchback",
      "category": "HATCHBACK",
      "base_price": 549000000.00,
      "status": "ACTIVE",
      "created_at": "2026-01-30T10:05:00Z",
      "updated_at": "2026-01-30T10:05:00Z",
      "deleted_at": null
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.READ permission

#### 2.1.2 POST /api/vehicle-models

**Status**: ✅ Existing (no changes)  
**Purpose**: Create a new vehicle model

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "model_name": "Honda City RS",
  "category": "SEDAN",
  "base_price": 559000000.00
}
```

**Validation Rules**:
- `model_name`: Required, max 100 chars, unique (case-insensitive)
- `category`: Required, enum (SEDAN/SUV/HATCHBACK/MPV)
- `base_price`: Required, decimal(15,2), must be > 0

**Response**: 201 Created
```json
{
  "id": 1,
  "model_code": "MOD/2026/001",
  "model_name": "Honda City RS",
  "category": "SEDAN",
  "base_price": 559000000.00,
  "status": "ACTIVE",
  "created_at": "2026-01-30T10:00:00Z",
  "updated_at": "2026-01-30T10:00:00Z",
  "deleted_at": null
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.CREATE permission
- `409 Conflict`: Duplicate model_name

#### 2.1.3 PATCH /api/vehicle-models/[id]

**Status**: ✅ Existing (no changes)  
**Purpose**: Update an existing vehicle model

**Path Parameters**:
- `id` (number, required): VehicleModel ID

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body** (partial update):
```json
{
  "model_name": "Honda City RS 2026",
  "base_price": 569000000.00
}
```

**Validation Rules**:
- `model_name`: Optional, max 100 chars, unique (case-insensitive)
- `category`: Optional, enum (SEDAN/SUV/HATCHBACK/MPV)
- `base_price`: Optional, decimal(15,2), must be > 0
- `status`: Optional, enum (ACTIVE/INACTIVE)

**Response**: 200 OK
```json
{
  "id": 1,
  "model_code": "MOD/2026/001",
  "model_name": "Honda City RS 2026",
  "category": "SEDAN",
  "base_price": 569000000.00,
  "status": "ACTIVE",
  "created_at": "2026-01-30T10:00:00Z",
  "updated_at": "2026-01-31T14:30:00Z",
  "deleted_at": null
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.UPDATE permission
- `404 Not Found`: VehicleModel not found
- `409 Conflict`: Duplicate model_name

#### 2.1.4 DELETE /api/vehicle-models/[id]

**Status**: ✅ Existing (no changes)  
**Purpose**: Soft delete a vehicle model (set status = INACTIVE)

**Path Parameters**:
- `id` (number, required): VehicleModel ID

**Request Headers**:
```
Authorization: Bearer {token}
```

**Action**: 
- SET `status` = 'INACTIVE'
- SET `deleted_at` = NOW()
- NOT hard delete (preserve record)

**Response**: 200 OK
```json
{
  "message": "VehicleModel deleted successfully",
  "id": 1
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.DELETE permission
- `404 Not Found`: VehicleModel not found

### 2.2 Accessory Endpoints (NEW - CR-MD-002)

#### 2.2.1 GET /api/accessories

**Status**: ✅ NEW (CR-MD-002)  
**Breaking**: No (new endpoint)  
**Purpose**: Retrieve list of accessories with filtering, sorting, pagination

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | - | Search by name or code (partial match) |
| `category` | string[] | No | - | Filter by category (INTERIOR, EXTERIOR, TECH, SAFETY) |
| `installation_required` | boolean | No | - | Filter by installation requirement |
| `status` | string | No | ACTIVE | Filter by status (ACTIVE, INACTIVE, ALL) |
| `min_price` | number | No | 0 | Minimum price |
| `max_price` | number | No | - | Maximum price |
| `min_warranty` | number | No | - | Minimum warranty period (months) |
| `page` | number | No | 1 | Page number (1-indexed) |
| `limit` | number | No | 20 | Items per page (max 100) |
| `sort` | string | No | created_at:desc | Sort field:direction |

**Request Example**:
```http
GET /api/accessories?search=floor+mat&category=INTERIOR&installation_required=false&status=ACTIVE&page=1&limit=20
```

**Response**: 200 OK
```json
{
  "data": [
    {
      "id": 1,
      "accessory_code": "ACC/2026/001",
      "accessory_name": "Floor Mat Premium",
      "category": "INTERIOR",
      "price": 500000.00,
      "installation_required": false,
      "warranty_period_months": 12,
      "status": "ACTIVE",
      "created_at": "2026-01-31T09:00:00Z",
      "updated_at": "2026-01-31T09:00:00Z",
      "deleted_at": null
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.READ permission

#### 2.2.2 POST /api/accessories

**Status**: ✅ NEW (CR-MD-002)  
**Breaking**: No (new endpoint)  
**Purpose**: Create a new accessory

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "accessory_name": "Floor Mat Premium",
  "category": "INTERIOR",
  "price": 500000.00,
  "installation_required": false,
  "warranty_period_months": 12
}
```

**Validation Rules**:
- `accessory_name`: Required, max 100 chars, unique (case-insensitive)
- `category`: Required, enum (INTERIOR/EXTERIOR/TECH/SAFETY)
- `price`: Required, decimal(15,2), must be > 0
- `installation_required`: Required, boolean
- `warranty_period_months`: Required, integer, between 6-60

**Response**: 201 Created
```json
{
  "id": 1,
  "accessory_code": "ACC/2026/001",
  "accessory_name": "Floor Mat Premium",
  "category": "INTERIOR",
  "price": 500000.00,
  "installation_required": false,
  "warranty_period_months": 12,
  "status": "ACTIVE",
  "created_at": "2026-01-31T09:00:00Z",
  "updated_at": "2026-01-31T09:00:00Z",
  "deleted_at": null
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.CREATE permission
- `409 Conflict`: Duplicate accessory_name

#### 2.2.3 PATCH /api/accessories/[id]

**Status**: ✅ NEW (CR-MD-002)  
**Breaking**: No (new endpoint)  
**Purpose**: Update an existing accessory

**Path Parameters**:
- `id` (number, required): Accessory ID

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body** (partial update):
```json
{
  "accessory_name": "Floor Mat Premium Plus",
  "price": 550000.00
}
```

**Validation Rules**:
- `accessory_name`: Optional, max 100 chars, unique (case-insensitive)
- `category`: Optional, enum (INTERIOR/EXTERIOR/TECH/SAFETY)
- `price`: Optional, decimal(15,2), must be > 0
- `installation_required`: Optional, boolean
- `warranty_period_months`: Optional, integer, between 6-60
- `status`: Optional, enum (ACTIVE/INACTIVE)

**Special Behavior**: 
- If `price` is changed, automatically create price history record
- Record previous price, new price, changed_by, changed_at

**Response**: 200 OK
```json
{
  "id": 1,
  "accessory_code": "ACC/2026/001",
  "accessory_name": "Floor Mat Premium Plus",
  "category": "INTERIOR",
  "price": 550000.00,
  "installation_required": false,
  "warranty_period_months": 12,
  "status": "ACTIVE",
  "created_at": "2026-01-31T09:00:00Z",
  "updated_at": "2026-01-31T10:30:00Z",
  "deleted_at": null
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.UPDATE permission
- `404 Not Found`: Accessory not found
- `409 Conflict`: Duplicate accessory_name

#### 2.2.4 DELETE /api/accessories/[id]

**Status**: ✅ NEW (CR-MD-002)  
**Breaking**: No (new endpoint)  
**Purpose**: Soft delete an accessory (set status = INACTIVE)

**Path Parameters**:
- `id` (number, required): Accessory ID

**Request Headers**:
```
Authorization: Bearer {token}
```

**Action**: 
- SET `status` = 'INACTIVE'
- SET `deleted_at` = NOW()
- NOT hard delete (preserve record)

**Response**: 200 OK
```json
{
  "message": "Accessory deleted successfully",
  "id": 1
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.DELETE permission
- `404 Not Found`: Accessory not found

#### 2.2.5 GET /api/accessories/[id]/compatibility

**Status**: ✅ NEW (CR-MD-002)  
**Breaking**: No (new endpoint)  
**Purpose**: Get vehicle models compatible with this accessory

**Path Parameters**:
- `id` (number, required): Accessory ID

**Request Headers**:
```
Authorization: Bearer {token}
```

**Response**: 200 OK
```json
{
  "accessory": {
    "id": 1,
    "accessory_code": "ACC/2026/001",
    "accessory_name": "Floor Mat Premium"
  },
  "compatible_models": [
    {
      "model_id": 1,
      "model_code": "MOD/2026/001",
      "model_name": "Honda City RS",
      "compatible_since": "2026-01-31T09:00:00Z"
    },
    {
      "model_id": 2,
      "model_code": "MOD/2026/002",
      "model_name": "Honda CR-V L",
      "compatible_since": "2026-01-31T09:00:00Z"
    }
  ],
  "incompatible_models": [
    {
      "model_id": 3,
      "model_code": "MOD/2026/003",
      "model_name": "Honda City Hatchback"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.READ permission
- `404 Not Found`: Accessory not found

#### 2.2.6 POST /api/accessories/[id]/compatibility

**Status**: ✅ NEW (CR-MD-002)  
**Breaking**: No (new endpoint)  
**Purpose**: Add vehicle model compatibility to an accessory

**Path Parameters**:
- `id` (number, required): Accessory ID

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "model_id": 3
}
```

**Validation Rules**:
- `model_id`: Required, must exist in VehicleModel table
- Must NOT already be compatible (prevent duplicates)

**Response**: 201 Created
```json
{
  "message": "Model compatibility added successfully",
  "accessory_id": 1,
  "model_id": 3,
  "model_name": "Honda City Hatchback"
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed or already compatible
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.UPDATE permission
- `404 Not Found`: Accessory or model not found

#### 2.2.7 DELETE /api/accessories/[id]/compatibility/[model_id]

**Status**: ✅ NEW (CR-MD-002)  
**Breaking**: No (new endpoint)  
**Purpose**: Remove vehicle model compatibility from an accessory

**Path Parameters**:
- `id` (number, required): Accessory ID
- `model_id` (number, required): VehicleModel ID

**Request Headers**:
```
Authorization: Bearer {token}
```

**Response**: 200 OK
```json
{
  "message": "Model compatibility removed successfully",
  "accessory_id": 1,
  "model_id": 3
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.UPDATE permission
- `404 Not Found`: Accessory, model, or compatibility not found

#### 2.2.8 GET /api/accessories/[id]/price-history

**Status**: ✅ NEW (CR-MD-002)  
**Breaking**: No (new endpoint)  
**Purpose**: Get price history for an accessory

**Path Parameters**:
- `id` (number, required): Accessory ID

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number (1-indexed) |
| `limit` | number | No | 50 | Items per page (max 100) |
| `sort` | string | No | changed_at:desc | Sort field:direction |

**Request Headers**:
```
Authorization: Bearer {token}
```

**Response**: 200 OK
```json
{
  "accessory": {
    "id": 1,
    "accessory_code": "ACC/2026/001",
    "accessory_name": "Floor Mat Premium",
    "current_price": 550000.00
  },
  "price_history": [
    {
      "id": 1,
      "old_price": null,
      "new_price": 500000.00,
      "changed_by": 1,
      "changed_by_name": "Admin User",
      "changed_at": "2026-01-31T09:00:00Z"
    },
    {
      "id": 2,
      "old_price": 500000.00,
      "new_price": 550000.00,
      "changed_by": 1,
      "changed_by_name": "Admin User",
      "changed_at": "2026-01-31T10:30:00Z"
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 50,
    "total_pages": 1
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.READ permission
- `404 Not Found`: Accessory not found

### 2.3 ServiceCatalog Endpoints (NEW - CR-MD-003)

#### 2.3.1 GET /api/service-catalogs

**Status**: ✅ NEW (CR-MD-003)  
**Breaking**: No (new endpoint)  
**Purpose**: Retrieve list of services with filtering, sorting, pagination

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | - | Search by name or code (partial match) |
| `category` | string[] | No | - | Filter by category (MAINTENANCE, REPAIR, INSPECTION, DETAILING) |
| `requires_parts` | boolean | No | - | Filter by parts requirement |
| `status` | string | No | ACTIVE | Filter by status (ACTIVE, INACTIVE, ALL) |
| `min_price` | number | No | 0 | Minimum price |
| `max_price` | number | No | - | Maximum price |
| `min_duration` | number | No | - | Minimum duration (hours) |
| `max_duration` | number | No | - | Maximum duration (hours) |
| `page` | number | No | 1 | Page number (1-indexed) |
| `limit` | number | No | 20 | Items per page (max 100) |
| `sort` | string | No | created_at:desc | Sort field:direction |

**Request Example**:
```http
GET /api/service-catalogs?search=oil+change&category=MAINTENANCE&requires_parts=true&status=ACTIVE&page=1&limit=20
```

**Response**: 200 OK
```json
{
  "data": [
    {
      "id": 1,
      "service_code": "SVC/2026/001",
      "service_name": "Oil Change Premium",
      "category": "MAINTENANCE",
      "duration_hours": 1.5,
      "base_price": 500000.00,
      "requires_parts": true,
      "status": "ACTIVE",
      "created_at": "2026-01-31T10:00:00Z",
      "updated_at": "2026-01-31T10:00:00Z",
      "deleted_at": null
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.READ permission

#### 2.3.2 POST /api/service-catalogs

**Status**: ✅ NEW (CR-MD-003)  
**Breaking**: No (new endpoint)  
**Purpose**: Create a new service

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "service_name": "Oil Change Premium",
  "category": "MAINTENANCE",
  "duration_hours": 1.5,
  "base_price": 500000.00,
  "requires_parts": true
}
```

**Validation Rules**:
- `service_name`: Required, max 100 chars, unique (case-insensitive)
- `category`: Required, enum (MAINTENANCE/REPAIR/INSPECTION/DETAILING)
- `duration_hours`: Required, decimal(3,1), between 0.5-8
- `base_price`: Required, decimal(15,2), must be > 0
- `requires_parts`: Required, boolean

**Response**: 201 Created
```json
{
  "id": 1,
  "service_code": "SVC/2026/001",
  "service_name": "Oil Change Premium",
  "category": "MAINTENANCE",
  "duration_hours": 1.5,
  "base_price": 500000.00,
  "requires_parts": true,
  "status": "ACTIVE",
  "created_at": "2026-01-31T10:00:00Z",
  "updated_at": "2026-01-31T10:00:00Z",
  "deleted_at": null
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.CREATE permission
- `409 Conflict`: Duplicate service_name

#### 2.3.3 PATCH /api/service-catalogs/[id]

**Status**: ✅ NEW (CR-MD-003)  
**Breaking**: No (new endpoint)  
**Purpose**: Update an existing service


**Path Parameters**:
- `id` (number, required): ServiceCatalog ID

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body** (partial update):
```json
{
  "service_name": "Oil Change Premium Plus",
  "base_price": 550000.00
}
```

**Validation Rules**:
- `service_name`: Optional, max 100 chars, unique (case-insensitive)
- `category`: Optional, enum (MAINTENANCE/REPAIR/INSPECTION/DETAILING)
- `duration_hours`: Optional, decimal(3,1), between 0.5-8
- `base_price`: Optional, decimal(15,2), must be > 0
- `requires_parts`: Optional, boolean
- `status`: Optional, enum (ACTIVE/INACTIVE)

**Response**: 200 OK
```json
{
  "id": 1,
  "service_code": "SVC/2026/001",
  "service_name": "Oil Change Premium Plus",
  "category": "MAINTENANCE",
  "duration_hours": 1.5,
  "base_price": 550000.00,
  "requires_parts": true,
  "status": "ACTIVE",
  "created_at": "2026-01-31T10:00:00Z",
  "updated_at": "2026-01-31T11:30:00Z",
  "deleted_at": null
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.UPDATE permission
- `404 Not Found`: ServiceCatalog not found
- `409 Conflict`: Duplicate service_name

#### 2.3.4 DELETE /api/service-catalogs/[id]

**Status**: ✅ NEW (CR-MD-003)  
**Breaking**: No (new endpoint)  
**Purpose**: Soft delete a service (set status = INACTIVE)

**Path Parameters**:
- `id` (number, required): ServiceCatalog ID

**Request Headers**:
```
Authorization: Bearer {token}
```

**Action**: 
- SET `status` = 'INACTIVE'
- SET `deleted_at` = NOW()
- NOT hard delete (preserve record)

**Response**: 200 OK
```json
{
  "message": "ServiceCatalog deleted successfully",
  "id": 1
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.DELETE permission
- `404 Not Found`: ServiceCatalog not found

#### 2.3.5 GET /api/service-catalogs/[id]/parts

**Status**: ✅ NEW (CR-MD-003)  
**Breaking**: No (new endpoint)  
**Purpose**: Get parts required for a service

**Path Parameters**:
- `id` (number, required): ServiceCatalog ID

**Request Headers**:
```
Authorization: Bearer {token}
```

**Response**: 200 OK
```json
{
  "service": {
    "id": 1,
    "service_code": "SVC/2026/001",
    "service_name": "Oil Change Premium"
  },
  "required_parts": [
    {
      "part_id": 1,
      "accessory_code": "ACC/2026/001",
      "accessory_name": "Engine Oil 5W-30",
      "quantity": 1,
      "unit_price": 150000.00,
      "total_price": 150000.00
    },
    {
      "part_id": 2,
      "accessory_code": "ACC/2026/002",
      "accessory_name": "Oil Filter",
      "quantity": 1,
      "unit_price": 80000.00,
      "total_price": 80000.00
    }
  ],
  "summary": {
    "total_parts": 2,
    "total_cost": 230000.00
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.READ permission
- `404 Not Found`: ServiceCatalog not found

#### 2.3.6 POST /api/service-catalogs/[id]/parts

**Status**: ✅ NEW (CR-MD-003)  
**Breaking**: No (new endpoint)  
**Purpose**: Add a part to a service

**Path Parameters**:
- `id` (number, required): ServiceCatalog ID

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "accessory_id": 3,
  "quantity": 1
}
```

**Validation Rules**:
- `accessory_id`: Required, must exist in Accessory table
- `quantity`: Required, integer, must be > 0
- Must NOT already be added (prevent duplicates)

**Response**: 201 Created
```json
{
  "message": "Service part added successfully",
  "service_id": 1,
  "accessory_id": 3,
  "accessory_name": "Oil Filter Gasket",
  "quantity": 1
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed or part already exists
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.UPDATE permission
- `404 Not Found`: ServiceCatalog or Accessory not found

#### 2.3.7 DELETE /api/service-catalogs/[id]/parts/[part_id]

**Status**: ✅ NEW (CR-MD-003)  
**Breaking**: No (new endpoint)  
**Purpose**: Remove a part from a service

**Path Parameters**:
- `id` (number, required): ServiceCatalog ID
- `part_id` (number, required): Accessory ID

**Request Headers**:
```
Authorization: Bearer {token}
```

**Response**: 200 OK
```json
{
  "message": "Service part removed successfully",
  "service_id": 1,
  "part_id": 3
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.UPDATE permission
- `404 Not Found`: ServiceCatalog, Accessory, or service part not found

#### 2.3.8 GET /api/service-catalogs/packages

**Status**: ✅ NEW (CR-MD-003)  
**Breaking**: No (new endpoint)  
**Purpose**: List all service packages

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | - | Search by package name (partial match) |
| `status` | string | No | ACTIVE | Filter by status (ACTIVE, INACTIVE, ALL) |
| `page` | number | No | 1 | Page number (1-indexed) |
| `limit` | number | No | 20 | Items per page (max 100) |
| `sort` | string | No | created_at:desc | Sort field:direction |

**Request Headers**:
```
Authorization: Bearer {token}
```

**Response**: 200 OK
```json
{
  "data": [
    {
      "id": 1,
      "package_name": "Basic Maintenance Package",
      "description": "Essential maintenance services",
      "total_price": 1200000.00,
      "status": "ACTIVE",
      "included_services": [
        {
          "service_id": 1,
          "service_name": "Oil Change Premium",
          "service_price": 500000.00
        },
        {
          "service_id": 2,
          "service_name": "Tire Rotation",
          "service_price": 200000.00
        }
      ],
      "created_at": "2026-01-31T11:00:00Z",
      "updated_at": "2026-01-31T11:00:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.READ permission

#### 2.3.9 POST /api/service-catalogs/packages

**Status**: ✅ NEW (CR-MD-003)  
**Breaking**: No (new endpoint)  
**Purpose**: Create a new service package

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "package_name": "Basic Maintenance Package",
  "description": "Essential maintenance services",
  "service_ids": [1, 2]
}
```

**Validation Rules**:
- `package_name`: Required, max 100 chars, unique (case-insensitive)
- `description`: Required, max 500 chars
- `service_ids`: Required, array, must exist in ServiceCatalog table
- Must have at least 2 services

**Special Behavior**:
- Calculate `total_price` as sum of individual service prices
- Create records in `service_packages` and `service_package_items` tables

**Response**: 201 Created
```json
{
  "id": 1,
  "package_name": "Basic Maintenance Package",
  "description": "Essential maintenance services",
  "total_price": 1200000.00,
  "status": "ACTIVE",
  "included_services": [
    {
      "service_id": 1,
      "service_name": "Oil Change Premium",
      "service_price": 500000.00
    },
    {
      "service_id": 2,
      "service_name": "Tire Rotation",
      "service_price": 200000.00
    }
  ],
  "created_at": "2026-01-31T11:00:00Z",
  "updated_at": "2026-01-31T11:00:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.CREATE permission
- `404 Not Found`: One or more services not found
- `409 Conflict`: Duplicate package_name

#### 2.3.10 PATCH /api/service-catalogs/packages/[id]

**Status**: ✅ NEW (CR-MD-003)  
**Breaking**: No (new endpoint)  
**Purpose**: Update an existing service package

**Path Parameters**:
- `id` (number, required): ServicePackage ID

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body** (partial update):
```json
{
  "package_name": "Basic Maintenance Package Plus",
  "service_ids": [1, 2, 3]
}
```

**Validation Rules**:
- `package_name`: Optional, max 100 chars, unique (case-insensitive)
- `description`: Optional, max 500 chars
- `service_ids`: Optional, array, must exist in ServiceCatalog table
- Must have at least 2 services

**Special Behavior**:
- Recalculate `total_price` when `service_ids` changes
- Update `service_package_items` table when services change

**Response**: 200 OK
```json
{
  "id": 1,
  "package_name": "Basic Maintenance Package Plus",
  "description": "Essential maintenance services",
  "total_price": 1700000.00,
  "status": "ACTIVE",
  "included_services": [
    {
      "service_id": 1,
      "service_name": "Oil Change Premium",
      "service_price": 500000.00
    },
    {
      "service_id": 2,
      "service_name": "Tire Rotation",
      "service_price": 200000.00
    },
    {
      "service_id": 3,
      "service_name": "Brake Inspection",
      "service_price": 1000000.00
    }
  ],
  "created_at": "2026-01-31T11:00:00Z",
  "updated_at": "2026-01-31T12:00:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.UPDATE permission
- `404 Not Found`: ServicePackage or service not found
- `409 Conflict`: Duplicate package_name

#### 2.3.11 DELETE /api/service-catalogs/packages/[id]

**Status**: ✅ NEW (CR-MD-003)  
**Breaking**: No (new endpoint)  
**Purpose**: Delete a service package (hard delete)

**Path Parameters**:
- `id` (number, required): ServicePackage ID

**Request Headers**:
```
Authorization: Bearer {token}
```

**Action**: 
- Hard delete from `service_packages` and `service_package_items` tables
- NOT soft delete (packages are configuration, not historical data)

**Response**: 200 OK
```json
{
  "message": "ServicePackage deleted successfully",
  "id": 1
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.DELETE permission
- `404 Not Found`: ServicePackage not found

### 2.4 ServiceBay Endpoints (NEW - CR-MD-004)

#### 2.4.1 GET /api/service-bays

**Status**: ✅ NEW (CR-MD-004)  
**Breaking**: No (new endpoint)  
**Purpose**: Retrieve list of service bays with filtering, sorting, pagination

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | - | Search by name or code (partial match) |
| `bay_type` | string[] | No | - | Filter by bay type (STANDARD, PREMIUM, EXPRESS) |
| `status` | string | No | ACTIVE | Filter by status (ACTIVE, INACTIVE, ALL) |
| `min_capacity` | number | No | 1 | Minimum capacity (vehicles) |
| `max_capacity` | number | No | - | Maximum capacity (vehicles) |
| `page` | number | No | 1 | Page number (1-indexed) |
| `limit` | number | No | 20 | Items per page (max 100) |
| `sort` | string | No | created_at:desc | Sort field:direction |

**Request Example**:
```http
GET /api/service-bays?search=bay+a&bay_type=STANDARD&status=ACTIVE&page=1&limit=20
```

**Response**: 200 OK
```json
{
  "data": [
    {
      "id": 1,
      "bay_code": "BAY/2026/001",
      "bay_name": "Bay A",
      "bay_type": "STANDARD",
      "capacity_vehicles": 2,
      "location": "Building A, Floor 1",
      "description": "Standard service bay with basic equipment",
      "status": "ACTIVE",
      "created_at": "2026-01-31T12:00:00Z",
      "updated_at": "2026-01-31T12:00:00Z",
      "deleted_at": null
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.READ permission

#### 2.4.2 POST /api/service-bays

**Status**: ✅ NEW (CR-MD-004)  
**Breaking**: No (new endpoint)  
**Purpose**: Create a new service bay

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "bay_name": "Bay A",
  "bay_type": "STANDARD",
  "capacity_vehicles": 2,
  "location": "Building A, Floor 1",
  "description": "Standard service bay with basic equipment"
}
```

**Validation Rules**:
- `bay_name`: Required, max 50 chars, unique (case-insensitive)
- `bay_type`: Required, enum (STANDARD/PREMIUM/EXPRESS)
- `capacity_vehicles`: Required, integer, between 1-5
- `location`: Required, max 100 chars
- `description`: Optional, max 500 chars

**Response**: 201 Created
```json
{
  "id": 1,
  "bay_code": "BAY/2026/001",
  "bay_name": "Bay A",
  "bay_type": "STANDARD",
  "capacity_vehicles": 2,
  "location": "Building A, Floor 1",
  "description": "Standard service bay with basic equipment",
  "status": "ACTIVE",
  "created_at": "2026-01-31T12:00:00Z",
  "updated_at": "2026-01-31T12:00:00Z",
  "deleted_at": null
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.CREATE permission
- `409 Conflict`: Duplicate bay_name

#### 2.4.3 PATCH /api/service-bays/[id]

**Status**: ✅ NEW (CR-MD-004)  
**Breaking**: No (new endpoint)  
**Purpose**: Update an existing service bay

**Path Parameters**:
- `id` (number, required): ServiceBay ID

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body** (partial update):
```json
{
  "bay_name": "Bay A Premium",
  "bay_type": "PREMIUM"
}
```

**Validation Rules**:
- `bay_name`: Optional, max 50 chars, unique (case-insensitive)
- `bay_type`: Optional, enum (STANDARD/PREMIUM/EXPRESS)
- `capacity_vehicles`: Optional, integer, between 1-5
- `location`: Optional, max 100 chars
- `description`: Optional, max 500 chars
- `status`: Optional, enum (ACTIVE/INACTIVE)

**Response**: 200 OK
```json
{
  "id": 1,
  "bay_code": "BAY/2026/001",
  "bay_name": "Bay A Premium",
  "bay_type": "PREMIUM",
  "capacity_vehicles": 2,
  "location": "Building A, Floor 1",
  "description": "Standard service bay with basic equipment",
  "status": "ACTIVE",
  "created_at": "2026-01-31T12:00:00Z",
  "updated_at": "2026-01-31T13:00:00Z",
  "deleted_at": null
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.UPDATE permission
- `404 Not Found`: ServiceBay not found
- `409 Conflict`: Duplicate bay_name

#### 2.4.4 DELETE /api/service-bays/[id]

**Status**: ✅ NEW (CR-MD-004)  
**Breaking**: No (new endpoint)  
**Purpose**: Soft delete a service bay (set status = INACTIVE)

**Path Parameters**:
- `id` (number, required): ServiceBay ID

**Request Headers**:
```
Authorization: Bearer {token}
```

**Action**: 
- SET `status` = 'INACTIVE'
- SET `deleted_at` = NOW()
- NOT hard delete (preserve record)

**Response**: 200 OK
```json
{
  "message": "ServiceBay deleted successfully",
  "id": 1
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.DELETE permission
- `404 Not Found`: ServiceBay not found

#### 2.4.5 GET /api/service-bays/[id]/usage

**Status**: ✅ NEW (CR-MD-004)  
**Breaking**: No (new endpoint)  
**Purpose**: Get usage statistics for a service bay

**Path Parameters**:
- `id` (number, required): ServiceBay ID

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `start_date` | string | No | - | Start date (YYYY-MM-DD) |
| `end_date` | string | No | - | End date (YYYY-MM-DD) |

**Request Headers**:
```
Authorization: Bearer {token}
```

**Response**: 200 OK
```json
{
  "bay": {
    "id": 1,
    "bay_code": "BAY/2026/001",
    "bay_name": "Bay A Premium",
    "bay_type": "PREMIUM",
    "capacity_vehicles": 2
  },
  "usage_stats": {
    "total_appointments": 45,
    "completed_appointments": 42,
    "cancelled_appointments": 3,
    "total_hours_used": 126.5,
    "average_duration": 3.0,
    "utilization_rate": 78.5,
    "peak_usage_days": [
      {
        "date": "2026-01-15",
        "appointment_count": 8,
        "utilization_rate": 95.0
      },
      {
        "date": "2026-01-22",
        "appointment_count": 7,
        "utilization_rate": 90.0
      }
    ],
    "popular_services": [
      {
        "service_name": "Oil Change Premium",
        "appointment_count": 15,
        "percentage": 33.3
      },
      {
        "service_name": "Full Service",
        "appointment_count": 12,
        "percentage": 26.7
      }
    ]
  },
  "period": {
    "start_date": "2026-01-01",
    "end_date": "2026-01-31",
    "days": 31
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.READ permission
- `404 Not Found`: ServiceBay not found

### 2.5 ScoringRule Endpoints (NEW - CR-MD-004)

#### 2.5.1 GET /api/scoring-rules

**Status**: ✅ NEW (CR-MD-004)  
**Breaking**: No (new endpoint)  
**Purpose**: Retrieve list of scoring rules with filtering, sorting, pagination

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | - | Search by name or code (partial match) |
| `category` | string[] | No | - | Filter by category (LEAD, SERVICE, CUSTOMER, PERFORMANCE) |
| `status` | string | No | ACTIVE | Filter by status (ACTIVE, INACTIVE, ALL) |
| `min_weight` | number | No | 1 | Minimum weight percentage |
| `max_weight` | number | No | 100 | Maximum weight percentage |
| `page` | number | No | 1 | Page number (1-indexed) |
| `limit` | number | No | 20 | Items per page (max 100) |
| `sort` | string | No | weight_percentage:desc | Sort field:direction |

**Request Example**:
```http
GET /api/scoring-rules?search=lead&category=LEAD&status=ACTIVE&page=1&limit=20
```

**Response**: 200 OK
```json
{
  "data": [
    {
      "id": 1,
      "rule_code": "SCR/2026/001",
      "rule_name": "Lead Source Score",
      "category": "LEAD",
      "weight_percentage": 30,
      "min_score": 0,
      "max_score": 100,
      "condition_expression": "lead_source = 'WEBSITE'",
      "description": "Scores leads based on source",
      "status": "ACTIVE",
      "created_at": "2026-01-31T13:00:00Z",
      "updated_at": "2026-01-31T13:00:00Z",
      "deleted_at": null
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.READ permission

#### 2.5.2 POST /api/scoring-rules

**Status**: ✅ NEW (CR-MD-004)  
**Breaking**: No (new endpoint)  
**Purpose**: Create a new scoring rule

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "rule_name": "Lead Source Score",
  "category": "LEAD",
  "weight_percentage": 30,
  "min_score": 0,
  "max_score": 100,
  "condition_expression": "lead_source = 'WEBSITE'",
  "description": "Scores leads based on source"
}
```

**Validation Rules**:
- `rule_name`: Required, max 100 chars, unique (case-insensitive)
- `category`: Required, enum (LEAD/SERVICE/CUSTOMER/PERFORMANCE)
- `weight_percentage`: Required, integer, between 1-100
- `min_score`: Required, integer, between 0-1000
- `max_score`: Required, integer, > min_score, <= 1000
- `condition_expression`: Required, max 500 chars, SQL-like syntax
- `description`: Optional, max 500 chars

**Special Validation**:
- `condition_expression`: Must be valid SQL-like expression
- Syntax validation: field operator value format
- Supported operators: =, !=, >, <, >=, <=, IN, LIKE, BETWEEN
- Supported values: strings, numbers, booleans

**Response**: 201 Created
```json
{
  "id": 1,
  "rule_code": "SCR/2026/001",
  "rule_name": "Lead Source Score",
  "category": "LEAD",
  "weight_percentage": 30,
  "min_score": 0,
  "max_score": 100,
  "condition_expression": "lead_source = 'WEBSITE'",
  "description": "Scores leads based on source",
  "status": "ACTIVE",
  "created_at": "2026-01-31T13:00:00Z",
  "updated_at": "2026-01-31T13:00:00Z",
  "deleted_at": null
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.CREATE permission
- `409 Conflict`: Duplicate rule_name

#### 2.5.3 PATCH /api/scoring-rules/[id]

**Status**: ✅ NEW (CR-MD-004)  
**Breaking**: No (new endpoint)  
**Purpose**: Update an existing scoring rule

**Path Parameters**:
- `id` (number, required): ScoringRule ID

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body** (partial update):
```json
{
  "rule_name": "Lead Source Score Premium",
  "weight_percentage": 35,
  "max_score": 150
}
```

**Validation Rules**:
- `rule_name`: Optional, max 100 chars, unique (case-insensitive)
- `category`: Optional, enum (LEAD/SERVICE/CUSTOMER/PERFORMANCE)
- `weight_percentage`: Optional, integer, between 1-100
- `min_score`: Optional, integer, between 0-1000
- `max_score`: Optional, integer, > min_score, <= 1000
- `condition_expression`: Optional, max 500 chars, SQL-like syntax
- `description`: Optional, max 500 chars
- `status`: Optional, enum (ACTIVE/INACTIVE)

**Special Validation**:
- If `condition_expression` is updated, must validate syntax
- If `weight_percentage` is updated, check total doesn't exceed 100% per category

**Response**: 200 OK
```json
{
  "id": 1,
  "rule_code": "SCR/2026/001",
  "rule_name": "Lead Source Score Premium",
  "category": "LEAD",
  "weight_percentage": 35,
  "min_score": 0,
  "max_score": 150,
  "condition_expression": "lead_source = 'WEBSITE'",
  "description": "Scores leads based on source",
  "status": "ACTIVE",
  "created_at": "2026-01-31T13:00:00Z",
  "updated_at": "2026-01-31T14:00:00Z",
  "deleted_at": null
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.UPDATE permission
- `404 Not Found`: ScoringRule not found
- `409 Conflict`: Duplicate rule_name or weight percentage exceeds 100%

#### 2.5.4 DELETE /api/scoring-rules/[id]

**Status**: ✅ NEW (CR-MD-004)  
**Breaking**: No (new endpoint)  
**Purpose**: Soft delete a scoring rule (set status = INACTIVE)

**Path Parameters**:
- `id` (number, required): ScoringRule ID

**Request Headers**:
```
Authorization: Bearer {token}
```

**Action**: 
- SET `status` = 'INACTIVE'
- SET `deleted_at` = NOW()
- NOT hard delete (preserve record for historical scoring)

**Response**: 200 OK
```json
{
  "message": "ScoringRule deleted successfully",
  "id": 1
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.DELETE permission
- `404 Not Found`: ScoringRule not found

#### 2.5.5 POST /api/scoring-rules/[id]/test

**Status**: ✅ NEW (CR-MD-004)  
**Breaking**: No (new endpoint)  
**Purpose**: Test a scoring rule with sample data

**Path Parameters**:
- `id` (number, required): ScoringRule ID

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "test_data": {
    "lead_source": "WEBSITE",
    "lead_status": "NEW",
    "expected_score": 30
  }
}
```

**Validation Rules**:
- `test_data`: Required, object
- Must include all fields referenced in `condition_expression`
- `expected_score`: Optional, for validation

**Special Behavior**:
- Parse and evaluate `condition_expression` against `test_data`
- Calculate actual score based on rule parameters
- Compare with `expected_score` if provided
- Return detailed evaluation result

**Response**: 200 OK
```json
{
  "rule": {
    "id": 1,
    "rule_name": "Lead Source Score",
    "condition_expression": "lead_source = 'WEBSITE'",
    "min_score": 0,
    "max_score": 100
  },
  "test_result": {
    "condition_met": true,
    "condition_details": "lead_source = 'WEBSITE' → TRUE",
    "calculated_score": 30,
    "expected_score": 30,
    "test_passed": true,
    "message": "Rule evaluation successful"
  },
  "evaluation": {
    "input_data": {
      "lead_source": "WEBSITE",
      "lead_status": "NEW"
    },
    "steps": [
      {
        "step": "Condition Evaluation",
        "expression": "lead_source = 'WEBSITE'",
        "result": true,
        "details": "String comparison passed"
      },
      {
        "step": "Score Calculation",
        "formula": "condition_met ? max_score : 0",
        "result": 30,
        "details": "Condition met, assigned max score"
      }
    ]
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid test data or missing required fields
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks MASTER_DATA.READ permission
- `404 Not Found`: ScoringRule not found
- `422 Unprocessable Entity`: Condition evaluation error

### 2.6 SystemSetting Endpoints (NEW - CR-MD-004)

#### 2.6.1 GET /api/system-settings

**Status**: ✅ NEW (CR-MD-004)  
**Breaking**: No (new endpoint)  
**Purpose**: Retrieve list of system settings with filtering, sorting, pagination

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | - | Search by name or code (partial match) |
| `category` | string[] | No | - | Filter by category (LEAD, SERVICE, CUSTOMER, SYSTEM) |
| `data_type` | string[] | No | - | Filter by data type (STRING, NUMBER, BOOLEAN, DATE) |
| `status` | string | No | ACTIVE | Filter by status (ACTIVE, INACTIVE, ALL) |
| `page` | number | No | 1 | Page number (1-indexed) |
| `limit` | number | No | 20 | Items per page (max 100) |
| `sort` | string | No | category:asc,setting_name:asc | Sort field:direction |

**Request Example**:
```http
GET /api/system-settings?search=lead&category=LEAD&data_type=NUMBER&status=ACTIVE&page=1&limit=20
```

**Response**: 200 OK
```json
{
  "data": [
    {
      "id": 1,
      "setting_code": "SYS/2026/001",
      "setting_name": "Lead Expiry Days",
      "category": "LEAD",
      "data_type": "NUMBER",
      "default_value": "30",
      "current_value": "30",
      "description": "Number of days before lead expires",
      "status": "ACTIVE",
      "created_at": "2026-01-31T14:00:00Z",
      "updated_at": "2026-01-31T14:00:00Z",
      "deleted_at": null
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks ADMIN.READ permission

#### 2.6.2 POST /api/system-settings

**Status**: ✅ NEW (CR-MD-004)  
**Breaking**: No (new endpoint)  
**Purpose**: Create a new system setting

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "setting_name": "Lead Expiry Days",
  "category": "LEAD",
  "data_type": "NUMBER",
  "default_value": "30",
  "description": "Number of days before lead expires"
}
```

**Validation Rules**:
- `setting_name`: Required, max 100 chars, unique (case-insensitive)
- `category`: Required, enum (LEAD/SERVICE/CUSTOMER/SYSTEM)
- `data_type`: Required, enum (STRING/NUMBER/BOOLEAN/DATE)
- `default_value`: Required, string, must be valid for data type
- `description`: Optional, max 500 chars

**Special Validation**:
- `default_value`: Must be valid for the specified `data_type`
  * STRING: Any text
  * NUMBER: Must be numeric
  * BOOLEAN: Must be "true" or "false" (case-insensitive)
  * DATE: Must be valid date format (YYYY-MM-DD)

**Response**: 201 Created
```json
{
  "id": 1,
  "setting_code": "SYS/2026/001",
  "setting_name": "Lead Expiry Days",
  "category": "LEAD",
  "data_type": "NUMBER",
  "default_value": "30",
  "current_value": "30",
  "description": "Number of days before lead expires",
  "status": "ACTIVE",
  "created_at": "2026-01-31T14:00:00Z",
  "updated_at": "2026-01-31T14:00:00Z",
  "deleted_at": null
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks ADMIN.CREATE permission
- `409 Conflict`: Duplicate setting_name

#### 2.6.3 PATCH /api/system-settings/[id]

**Status**: ✅ NEW (CR-MD-004)  
**Breaking**: No (new endpoint)  
**Purpose**: Update an existing system setting

**Path Parameters**:
- `id` (number, required): SystemSetting ID

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body** (partial update):
```json
{
  "setting_name": "Lead Expiry Days Premium",
  "default_value": "45"
}
```

**Validation Rules**:
- `setting_name`: Optional, max 100 chars, unique (case-insensitive)
- `category`: Optional, enum (LEAD/SERVICE/CUSTOMER/SYSTEM)
- `data_type`: Optional, enum (STRING/NUMBER/BOOLEAN/DATE)
- `default_value`: Optional, string, must be valid for data type
- `description`: Optional, max 500 chars
- `status`: Optional, enum (ACTIVE/INACTIVE)

**Special Behavior**:
- If `default_value` is changed and `current_value` equals old `default_value`,
  automatically update `current_value` to new `default_value`
- If `data_type` is changed, validate both `default_value` and `current_value`

**Response**: 200 OK
```json
{
  "id": 1,
  "setting_code": "SYS/2026/001",
  "setting_name": "Lead Expiry Days Premium",
  "category": "LEAD",
  "data_type": "NUMBER",
  "default_value": "45",
  "current_value": "45",
  "description": "Number of days before lead expires",
  "status": "ACTIVE",
  "created_at": "2026-01-31T14:00:00Z",
  "updated_at": "2026-01-31T15:00:00Z",
  "deleted_at": null
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks ADMIN.UPDATE permission
- `404 Not Found`: SystemSetting not found
- `409 Conflict**: Duplicate setting_name

#### 2.6.4 DELETE /api/system-settings/[id]

**Status**: ✅ NEW (CR-MD-004)  
**Breaking**: No (new endpoint)  
**Purpose**: Soft delete a system setting (set status = INACTIVE)

**Path Parameters**:
- `id` (number, required): SystemSetting ID

**Request Headers**:
```
Authorization: Bearer {token}
```

**Action**: 
- SET `status` = 'INACTIVE'
- SET `deleted_at` = NOW()
- NOT hard delete (preserve record for audit)

**Response**: 200 OK
```json
{
  "message": "SystemSetting deleted successfully",
  "id": 1
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks ADMIN.DELETE permission
- `404 Not Found`: SystemSetting not found

#### 2.6.5 PATCH /api/system-settings/[id]/value

**Status**: ✅ NEW (CR-MD-004)  
**Breaking**: No (new endpoint)  
**Purpose**: Update only the current value of a system setting

**Path Parameters**:
- `id` (number, required): SystemSetting ID

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "new_value": "35",
  "reason": "System configuration update for premium features"
}
```

**Validation Rules**:
- `new_value`: Required, string, must be valid for setting's data type
- `reason`: Required, string, max 200 chars (for audit)

**Special Behavior**:
- Update only `current_value`, preserve `default_value`
- Create audit log entry with old value, new value, reason, user, timestamp
- Validate `new_value` against `data_type` before updating

**Response**: 200 OK
```json
{
  "message": "SystemSetting value updated successfully",
  "id": 1,
  "setting_name": "Lead Expiry Days Premium",
  "old_value": "30",
  "new_value": "35",
  "updated_by": 1,
  "updated_by_name": "Admin User",
  "updated_at": "2026-01-31T16:00:00Z",
  "reason": "System configuration update for premium features"
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks ADMIN.UPDATE permission
- `404 Not Found`: SystemSetting not found
- `422 Unprocessable Entity`: Invalid value for data type

#### 2.6.6 POST /api/system-settings/[id]/reset

**Status**: ✅ NEW (CR-MD-004)  
**Breaking**: No (new endpoint)  
**Purpose**: Reset a system setting to its default value

**Path Parameters**:
- `id` (number, required): SystemSetting ID

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "reason": "Reset to default after testing"
}
```

**Validation Rules**:
- `reason`: Required, string, max 200 chars (for audit)

**Special Behavior**:
- Set `current_value` = `default_value`
- Create audit log entry with reset operation, reason, user, timestamp

**Response**: 200 OK
```json
{
  "message": "SystemSetting reset to default successfully",
  "id": 1,
  "setting_name": "Lead Expiry Days Premium",
  "old_value": "35",
  "new_value": "45",
  "default_value": "45",
  "reset_by": 1,
  "reset_by_name": "Admin User",
  "reset_at": "2026-01-31T17:00:00Z",
  "reason": "Reset to default after testing"
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks ADMIN.UPDATE permission
- `404 Not Found`: SystemSetting not found

### 2.7 Emergency Master Data Endpoints (CR-20260202-001)

**Note:** These endpoints were added as part of an emergency CR. Detailed specifications (headers, validation rules, examples) will be finalized in the next standard release.

#### 2.7.1 Employee Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/master/employees | List employees |
| POST | /api/master/employees | Create employee |
| GET | /api/master/employees/[id] | Get detail |
| PUT | /api/master/employees/[id] | Update profile |
| GET | /api/master/departments | List departments |
| GET | /api/master/positions | List positions |

#### 2.7.2 Supplier Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/master/suppliers | List suppliers |
| POST | /api/master/suppliers | Create supplier |
| PUT | /api/master/suppliers/[id] | Update supplier |

#### 2.7.3 Warehouse & UOM Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/master/warehouses | List warehouses |
| POST | /api/master/warehouses | Create warehouse |
| GET | /api/master/uoms | List UOMs |
| POST | /api/master/uoms | Create UOM |

---

## 3. Data Mapping

### 3.1 VehicleModel - UI → API → DB

| UI Field | API Field | DB Column | Validation |
|----------|-----------|-----------|------------|
| Model Code | `model_code` | `model_code` | Auto-generated, immutable |
| Model Name | `model_name` | `model_name` | Required, max 100, unique |
| Category | `category` | `category` | Required, enum |
| Base Price | `base_price` | `base_price` | Required, > 0 |
| Status | `status` | `status` | Required, enum |

### 3.2 Accessory - UI → API → DB

| UI Field | API Field | DB Column | Validation |
|----------|-----------|-----------|------------|
| Accessory Code | `accessory_code` | `accessory_code` | Auto-generated, immutable |
| Accessory Name | `accessory_name` | `accessory_name` | Required, max 100, unique |
| Category | `category` | `category` | Required, enum |
| Price | `price` | `price` | Required, > 0 |
| Installation | `installation_required` | `installation_required` | Required, boolean |
| Warranty | `warranty_period_months` | `warranty_period_months` | Required, 6-60 months |
| Status | `status` | `status` | Required, enum |

### 3.3 ServiceCatalog - UI → API → DB

| UI Field | API Field | DB Column | Validation |
|----------|-----------|-----------|------------|
| Service Code | `service_code` | `service_code` | Auto-generated, immutable |
| Service Name | `service_name` | `service_name` | Required, max 100, unique |
| Category | `category` | `category` | Required, enum |
| Duration | `duration_hours` | `duration_hours` | Required, 0.5-8 hours |
| Base Price | `base_price` | `base_price` | Required, > 0 |
| Required Parts | `requires_parts` | `requires_parts` | Required, boolean |
| Status | `status` | `status` | Required, enum |

### 3.4 ServiceBay - UI → API → DB

| UI Field | API Field | DB Column | Validation |
|----------|-----------|-----------|------------|
| Bay Code | `bay_code` | `bay_code` | Auto-generated, immutable |
| Bay Name | `bay_name` | `bay_name` | Required, max 50, unique |
| Type | `bay_type` | `bay_type` | Required, enum |
| Capacity | `capacity_vehicles` | `capacity_vehicles` | Required, 1-5 vehicles |
| Location | `location` | `location` | Required, max 100 |
| Description | `description` | `description` | Optional, max 500 |
| Status | `status` | `status` | Required, enum |

### 3.5 ScoringRule - UI → API → DB

| UI Field | API Field | DB Column | Validation |
|----------|-----------|-----------|------------|
| Rule Code | `rule_code` | `rule_code` | Auto-generated, immutable |
| Rule Name | `rule_name` | `rule_name` | Required, max 100, unique |
| Category | `category` | `category` | Required, enum |
| Weight | `weight_percentage` | `weight_percentage` | Required, 1-100% |
| Min Score | `min_score` | `min_score` | Required, 0-1000 |
| Max Score | `max_score` | `max_score` | Required, > min, ≤ 1000 |
| Condition | `condition_expression` | `condition_expression` | Required, SQL-like syntax |
| Description | `description` | `description` | Optional, max 500 |
| Status | `status` | `status` | Required, enum |

### 3.6 SystemSetting - UI → API → DB

| UI Field | API Field | DB Column | Validation |
|----------|-----------|-----------|------------|
| Setting Code | `setting_code` | `setting_code` | Auto-generated, immutable |
| Setting Name | `setting_name` | `setting_name` | Required, max 100, unique |
| Category | `category` | `category` | Required, enum |
| Data Type | `data_type` | `data_type` | Required, enum |
| Default Value | `default_value` | `default_value` | Required, valid for type |
| Current Value | `current_value` | `current_value` | Auto-set from default |
| Description | `description` | `description` | Optional, max 500 |
| Status | `status` | `status` | Required, enum |

---

## 4. Integration Points

### 4.1 CRM Module Dependencies

#### 4.1.1 Lead Management
- **VehicleModel Integration**:
  - GET /api/vehicle-models (for model selection in lead form)
  - Filter: ACTIVE status only
  - Usage: Lead vehicle model assignment
- **ScoringRule Integration**:
  - GET /api/scoring-rules (for lead scoring)
  - Filter: LEAD category, ACTIVE status
  - Usage: Automatic lead scoring based on rules
- **SystemSetting Integration**:
  - GET /api/system-settings (for lead expiry settings)
  - Filter: LEAD category, ACTIVE status
  - Usage: Lead expiry calculation

#### 4.1.2 Quotation Management
- **VehicleModel Integration**:
  - GET /api/vehicle-models (for model selection in quotation)
  - Filter: ACTIVE status only
  - Usage: Quotation vehicle model assignment
- **Accessory Integration**:
  - GET /api/accessories (for accessory selection in quotation)
  - Filter: ACTIVE status, compatible with selected model
  - Usage: Quotation accessory pricing and availability
- **ServiceCatalog Integration**:
  - GET /api/service-catalogs (for service selection in quotation)
  - Filter: ACTIVE status, compatible with selected model
  - Usage: Quotation service pricing and duration

### 4.2 Service Module Dependencies

#### 4.2.1 Appointment Scheduling
- **ServiceBay Integration**:
  - GET /api/service-bays (for bay selection in appointment)
  - Filter: ACTIVE status, available capacity
  - Usage: Appointment bay assignment
- **ServiceCatalog Integration**:
  - GET /api/service-catalogs (for service selection in appointment)
  - Filter: ACTIVE status
  - Usage: Appointment service assignment and duration calculation
- **ServiceBay Usage Integration**:
  - GET /api/service-bays/[id]/usage (for bay utilization)
  - Usage: Intelligent bay allocation based on usage statistics

#### 4.2.2 Service Execution
- **ServiceCatalog Parts Integration**:
  - GET /api/service-catalogs/[id]/parts (for parts required)
  - Usage: Parts inventory check and reservation
- **Accessory Integration**:
  - GET /api/accessories (for parts pricing and availability)
  - Usage: Parts cost calculation and inventory update

### 4.3 Admin Module Dependencies

#### 4.3.1 User Management
- **SystemSetting Integration**:
  - GET /api/system-settings (for system configuration)
  - Filter: SYSTEM category, ACTIVE status
  - Usage: User permission levels, session timeouts, etc.

#### 4.3.2 Reporting and Analytics
- **All Master Data Integration**:
  - GET endpoints for all entities (for reporting data)
  - Usage: Sales reports, service reports, performance analytics
- **ServiceBay Usage Integration**:
  - GET /api/service-bays/[id]/usage (for bay utilization reports)
  - Usage: Resource optimization and planning

### 4.4 Cross-Module Data Flow

```
Lead Creation
├── VehicleModel: GET /api/vehicle-models (model selection)
├── ScoringRule: GET /api/scoring-rules (auto-scoring)
└── SystemSetting: GET /api/system-settings (expiry calculation)

Quotation Creation
├── VehicleModel: GET /api/vehicle-models (model selection)
├── Accessory: GET /api/accessories (accessory selection)
├── ServiceCatalog: GET /api/service-catalogs (service selection)
└── SystemSetting: GET /api/system-settings (pricing rules)

Appointment Scheduling
├── ServiceBay: GET /api/service-bays (bay selection)
├── ServiceCatalog: GET /api/service-catalogs (service selection)
└── ServiceBay Usage: GET /api/service-bays/[id]/usage (utilization check)
```

### 4.5 Cache Strategy

#### 4.5.1 High-Frequency Read Data
- **VehicleModel**: Cache 1 hour (frequent model selection)
- **Accessory**: Cache 30 minutes (pricing and availability)
- **ServiceCatalog**: Cache 30 minutes (service pricing)
- **ServiceBay**: Cache 15 minutes (availability changes frequently)
- **SystemSetting**: Cache 5 minutes (configuration may change)

#### 4.5.2 Cache Invalidation
- **Entity Update**: Invalidate cache for that entity
- **Entity Delete**: Invalidate cache for that entity
- **Status Change**: Invalidate cache for that entity
- **Price Change**: Invalidate Accessory and ServiceCatalog cache
- **Capacity Change**: Invalidate ServiceBay cache

---

## 5. Audit Logging

### 5.1 Audit Events

#### 5.1.1 Master Data CRUD Operations

**Entity Creation**:
```json
{
  "event_type": "CREATE",
  "entity_type": "VehicleModel|Accessory|ServiceCatalog|ServiceBay|ScoringRule|SystemSetting",
  "entity_id": 1,
  "entity_code": "MOD/2026/001",
  "entity_name": "Honda City RS",
  "user_id": 1,
  "user_name": "Admin User",
  "timestamp": "2026-01-31T10:00:00Z",
  "changes": {
    "model_name": "Honda City RS",
    "category": "SEDAN",
    "base_price": 559000000.00
  }
}
```

**Entity Update**:
```json
{
  "event_type": "UPDATE",
  "entity_type": "VehicleModel|Accessory|ServiceCatalog|ServiceBay|ScoringRule|SystemSetting",
  "entity_id": 1,
  "entity_code": "MOD/2026/001",
  "entity_name": "Honda City RS",
  "user_id": 1,
  "user_name": "Admin User",
  "timestamp": "2026-01-31T14:30:00Z",
  "changes": {
    "base_price": {
      "from": 559000000.00,
      "to": 569000000.00
    }
  }
}
```

**Entity Delete**:
```json
{
  "event_type": "DELETE",
  "entity_type": "VehicleModel|Accessory|ServiceCatalog|ServiceBay|ScoringRule|SystemSetting",
  "entity_id": 1,
  "entity_code": "MOD/2026/001",
  "entity_name": "Honda City RS",
  "user_id": 1,
  "user_name": "Admin User",
  "timestamp": "2026-01-31T15:00:00Z",
  "changes": {
    "status": {
      "from": "ACTIVE",
      "to": "INACTIVE"
    },
    "deleted_at": {
      "from": null,
      "to": "2026-01-31T15:00:00Z"
    }
  }
}
```

#### 5.1.2 Special Operations

**Accessory Price Change**:
```json
{
  "event_type": "PRICE_CHANGE",
  "entity_type": "Accessory",
  "entity_id": 1,
  "entity_code": "ACC/2026/001",
  "entity_name": "Floor Mat Premium",
  "user_id": 1,
  "user_name": "Admin User",
  "timestamp": "2026-01-31T10:30:00Z",
  "changes": {
    "price": {
      "from": 500000.00,
      "to": 550000.00
    },
    "reason": "Supplier price increase"
  }
}
```

**SystemSetting Value Change**:
```json
{
  "event_type": "SETTING_CHANGE",
  "entity_type": "SystemSetting",
  "entity_id": 1,
  "entity_code": "SYS/2026/001",
  "entity_name": "Lead Expiry Days",
  "user_id": 1,
  "user_name": "Admin User",
  "timestamp": "2026-01-31T16:00:00Z",
  "changes": {
    "current_value": {
      "from": "30",
      "to": "35"
    },
    "reason": "System configuration update for premium features"
  }
}
```

**ServiceBay Usage Update**:
```json
{
  "event_type": "USAGE_UPDATE",
  "entity_type": "ServiceBay",
  "entity_id": 1,
  "entity_code": "BAY/2026/001",
  "entity_name": "Bay A",
  "user_id": 2,
  "user_name": "Service Manager",
  "timestamp": "2026-01-31T11:00:00Z",
  "changes": {
    "appointment_scheduled": true,
    "appointment_id": 123,
    "service_duration": 1.5,
    "utilization_before": 65.0,
    "utilization_after": 78.5
  }
}
```

### 5.2 Audit Log Storage

#### 5.2.1 Database Table
```sql
CREATE TABLE audit_log (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  event_type VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id BIGINT NOT NULL,
  entity_code VARCHAR(50),
  entity_name VARCHAR(100),
  user_id BIGINT NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  changes JSON,
  reason TEXT,
  INDEX idx_entity_type_id (entity_type, entity_id),
  INDEX idx_event_type (event_type),
  INDEX idx_user_id (user_id),
  INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### 5.2.2 Retention Policy
- **CRUD Operations**: Keep 2 years
- **Price Changes**: Keep 5 years (for financial audit)
- **Setting Changes**: Keep 3 years (for compliance)
- **Usage Updates**: Keep 1 year (for analytics)

### 5.3 Audit Query Endpoints

#### 5.3.1 GET /api/audit-log

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `event_type` | string[] | No | - | Filter by event types |
| `entity_type` | string[] | No | - | Filter by entity types |
| `entity_id` | number | No | - | Filter by specific entity ID |
| `user_id` | number | No | - | Filter by specific user ID |
| `start_date` | string | No | - | Start date (YYYY-MM-DD) |
| `end_date` | string | No | - | End date (YYYY-MM-DD) |
| `page` | number | No | 1 | Page number (1-indexed) |
| `limit` | number | No | 50 | Items per page (max 200) |
| `sort` | string | No | timestamp:desc | Sort field:direction |

**Request Headers**:
```
Authorization: Bearer {token}
```

**Response**: 200 OK
```json
{
  "data": [
    {
      "id": 1,
      "event_type": "UPDATE",
      "entity_type": "VehicleModel",
      "entity_id": 1,
      "entity_code": "MOD/2026/001",
      "entity_name": "Honda City RS",
      "user_id": 1,
      "user_name": "Admin User",
      "timestamp": "2026-01-31T14:30:00Z",
      "ip_address": "192.168.1.100",
      "changes": {
        "base_price": {
          "from": 559000000.00,
          "to": 569000000.00
        }
      },
      "reason": "Annual price adjustment"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 50,
    "total_pages": 1
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks AUDIT.READ permission

#### 5.3.2 GET /api/audit-log/entity/[entity_type]/[entity_id]

**Purpose**: Get audit history for a specific entity

**Path Parameters**:
- `entity_type` (string, required): Entity type (VehicleModel, Accessory, etc.)
- `entity_id` (number, required): Entity ID

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number (1-indexed) |
| `limit` | number | No | 50 | Items per page (max 200) |

**Request Headers**:
```
Authorization: Bearer {token}
```

**Response**: 200 OK
```json
{
  "entity": {
    "type": "VehicleModel",
    "id": 1,
    "code": "MOD/2026/001",
    "name": "Honda City RS"
  },
  "audit_history": [
    {
      "id": 3,
      "event_type": "UPDATE",
      "timestamp": "2026-01-31T14:30:00Z",
      "user_name": "Admin User",
      "changes": {
        "base_price": {
          "from": 559000000.00,
          "to": 569000000.00
        }
      },
      "reason": "Annual price adjustment"
    },
    {
      "id": 1,
      "event_type": "CREATE",
      "timestamp": "2026-01-31T10:00:00Z",
      "user_name": "Admin User",
      "changes": {
        "model_name": "Honda City RS",
        "category": "SEDAN",
        "base_price": 559000000.00
      }
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 50,
    "total_pages": 1
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User lacks AUDIT.READ permission
- `404 Not Found`: Entity not found

---

## Change Log

### v1.2 (02/02/2026) - CR-20260202-001 (Emergency Master Data)
- ADDED: Employee Management endpoints
- ADDED: Supplier Management endpoints
- ADDED: Inventory Masters (Warehouse, UOM) endpoints
- Consolidated from Emergency CR.

### v1.1 (31/01/2026) - CR-MD-002/003/004
- Added 24 new endpoints (13 marked as NEW)
  - 7 Accessory endpoints (all NEW)
  - 6 ServiceCatalog endpoints (4 NEW)
  - 4 ServiceBay endpoints (all NEW)
  - 5 ScoringRule endpoints (all NEW)
  - 3 SystemSetting endpoints (2 NEW)
- Added detailed endpoint specifications for all new entities
- Updated Data Mapping section with all 6 entities
- Enhanced Integration Points with cross-module dependencies
- Added comprehensive Audit Logging section
- Added cache strategy recommendations
- Maintained 0 breaking changes (all NEW endpoints)

### v1.0 (31/01/2026) - CR-MD-001
- Initial API Spec for Master Data Management
- Added 4 VehicleModel endpoints (2 marked as NEW)
- Added basic Data Mapping for VehicleModel
- Added basic Integration Points
- Added basic Audit Logging structure

---

**End of Document**
