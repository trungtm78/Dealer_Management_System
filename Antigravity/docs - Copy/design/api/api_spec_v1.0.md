# Honda DMS - API Specification v1.0

**Version**: 1.0  
**Date**: 2026-01-28  
**Author**: Antigravity - System & API Design Authority  
**Purpose**: Comprehensive API specification với full traceability từ FRD → ERD

---

## 📋 Document Overview

Tài liệu này là **nguồn sự thật DUY NHẤT** cho API design. Frontend và Backend **PHẢI** triển khai STRICTLY theo spec này.

**Scope**:
- **175 API endpoints** across 8 modules
- **Full traceability**: FRD Screen ID → ERD Table
- **Standardized error codes**: {MODULE}_{HTTP_CODE}
- **Request/Response field mapping** to ERD columns

**Modules**:
1. Dashboard (5 APIs)
2. CRM (40 APIs)
3. Sales (35 APIs)
4. Service (30 APIs)
5. Parts (25 APIs)
6. Insurance (10 APIs)
7. Accounting (20 APIs)
8. Admin (10 APIs)

---

## 🎯 API Design Principles

### Naming Convention
**Pattern**: `{HTTP_METHOD} /api/{module}/{resource}[/{id}][/{action}]`

**Examples**:
- `GET /api/crm/leads` - List leads
- `POST /api/crm/leads` - Create lead
- `GET /api/crm/leads/{id}` - Get lead detail
- `PUT /api/crm/leads/{id}` - Update lead
- `DELETE /api/crm/leads/{id}` - Delete lead
- `POST /api/crm/leads/{id}/convert` - Convert lead to customer

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "CRM_404",
    "message": "Lead not found",
    "details": { ... }
  }
}
```

---

## 📐 Module 1: Dashboard (5 APIs)

### API-DASH-001: Get Dashboard KPIs

#### A. Thông tin chung
- **API Name**: Get Dashboard KPIs
- **Endpoint**: `GET /api/dashboard/kpis`
- **Purpose**: Lấy các chỉ số KPI cho dashboard điều hành

#### B. FRD Mapping
- **Screen ID**: SCR-DASH-001
- **User Action**: View dashboard overview
- **FRD Section**: Module 1, Dashboard Điều Hành

#### C. ERD Mapping
- **Entities**: leads, customers, quotations, test_drives, repair_orders
- **Tables**: 
  - `leads` (count new leads)
  - `customers` (count total customers)
  - `quotations` (revenue calculation)
  - `test_drives` (count appointments)
  - `repair_orders` (service metrics)
- **Relations**: N/A (aggregation only)

#### D. Request Specification

**Query Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| date_from | date | No | Start date (default: first day of month) | ISO 8601 format |
| date_to | date | No | End date (default: today) | ISO 8601 format |

**Example**:
```
GET /api/dashboard/kpis?date_from=2026-01-01&date_to=2026-01-31
```

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "revenue": {
      "value": 15000000000,
      "change": 12.5,
      "trend": "up"
    },
    "cars_sold": {
      "value": 45,
      "change": 8.3,
      "trend": "up"
    },
    "new_leads": {
      "value": 120,
      "change": -5.2,
      "trend": "down"
    },
    "appointments": {
      "value": 85,
      "change": 15.7,
      "trend": "up"
    }
  }
}
```

**Field Mapping**:
| Response Field | ERD Mapping | Calculation |
|----------------|-------------|-------------|
| revenue.value | SUM(quotations.total_amount WHERE status='APPROVED') | Aggregation |
| cars_sold.value | COUNT(contracts.id) | Aggregation |
| new_leads.value | COUNT(leads.id WHERE created_at >= date_from) | Aggregation |
| appointments.value | COUNT(test_drives.id) + COUNT(service_appointments.id) | Aggregation |

#### F. Business Rules
- BR-DASH-001: Revenue chỉ tính quotations có status = 'APPROVED'
- BR-DASH-002: Cars sold tính theo contracts đã ký
- BR-DASH-003: Change % so với period trước đó (same duration)
- BR-DASH-004: Trend = 'up' nếu change > 0, 'down' nếu change < 0, 'stable' nếu change = 0

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| DASH_400 | Invalid date format | Invalid date format. Use ISO 8601 (YYYY-MM-DD) |
| DASH_400 | date_from > date_to | Start date must be before end date |

---

### API-DASH-002: Get Revenue Chart Data

#### A. Thông tin chung
- **API Name**: Get Revenue Chart Data
- **Endpoint**: `GET /api/dashboard/revenue-chart`
- **Purpose**: Lấy dữ liệu biểu đồ doanh thu theo tháng

#### B. FRD Mapping
- **Screen ID**: SCR-DASH-001
- **User Action**: View revenue chart
- **FRD Section**: Module 1, Dashboard - Revenue Chart

#### C. ERD Mapping
- **Entity**: quotations
- **Table**: `quotations`
- **Relations**: N/A (aggregation)

#### D. Request Specification

**Query Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| months | int | No | Number of months (default: 12) | 1-24 |

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "labels": ["Jan", "Feb", "Mar", "..."],
    "datasets": [{
      "label": "Revenue",
      "data": [1200000000, 1500000000, 1300000000, "..."]
    }]
  }
}
```

**Field Mapping**:
| Response Field | ERD Mapping | Calculation |
|----------------|-------------|-------------|
| data[].value | SUM(quotations.total_amount) GROUP BY MONTH(created_at) | Aggregation |

#### F. Business Rules
- BR-DASH-005: Chỉ tính quotations có status = 'APPROVED' hoặc 'CONTRACT'
- BR-DASH-006: Group by month của created_at

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| DASH_400 | months < 1 or months > 24 | Months must be between 1 and 24 |

---

### API-DASH-003: Get Leads Source Chart Data

#### A. Thông tin chung
- **API Name**: Get Leads Source Chart Data
- **Endpoint**: `GET /api/dashboard/leads-chart`
- **Purpose**: Lấy dữ liệu phân bổ leads theo nguồn

#### B. FRD Mapping
- **Screen ID**: SCR-DASH-001
- **User Action**: View leads source distribution
- **FRD Section**: Module 1, Dashboard - Leads Chart

#### C. ERD Mapping
- **Entity**: leads
- **Table**: `leads`
- **Relations**: N/A (aggregation)

#### D. Request Specification

**Query Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| date_from | date | No | Start date | ISO 8601 |
| date_to | date | No | End date | ISO 8601 |

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "labels": ["Facebook", "Website", "Walk-in", "Hotline", "Referral"],
    "datasets": [{
      "data": [45, 30, 15, 8, 2]
    }]
  }
}
```

**Field Mapping**:
| Response Field | ERD Mapping | Calculation |
|----------------|-------------|-------------|
| data[].value | COUNT(leads.id) GROUP BY source | Aggregation |

#### F. Business Rules
- BR-DASH-007: Tính tất cả leads (không filter status)
- BR-DASH-008: Group by source enum

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| DASH_400 | Invalid date | Invalid date format |

---

### API-DASH-004: Get Top Models Chart Data

#### A. Thông tin chung
- **API Name**: Get Top Models Chart Data
- **Endpoint**: `GET /api/dashboard/models-chart`
- **Purpose**: Lấy top 5 models bán chạy

#### B. FRD Mapping
- **Screen ID**: SCR-DASH-001
- **User Action**: View top selling models
- **FRD Section**: Module 1, Dashboard - Top Models Chart

#### C. ERD Mapping
- **Entity**: contracts, vehicle_models
- **Tables**: `contracts`, `vehicle_models`
- **Relations**: `contracts.model_id` → `vehicle_models.id`

#### D. Request Specification

**Query Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| limit | int | No | Number of models (default: 5) | 1-10 |

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "labels": ["CR-V", "City", "Accord", "Civic", "HR-V"],
    "datasets": [{
      "data": [25, 18, 12, 8, 5]
    }]
  }
}
```

**Field Mapping**:
| Response Field | ERD Mapping | Calculation |
|----------------|-------------|-------------|
| labels[] | vehicle_models.name | JOIN |
| data[] | COUNT(contracts.id) GROUP BY model_id | Aggregation |

#### F. Business Rules
- BR-DASH-009: Chỉ tính contracts đã ký (status != 'CANCELLED')
- BR-DASH-010: Order by count DESC, limit 5

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| DASH_400 | limit < 1 or limit > 10 | Limit must be between 1 and 10 |

---

### API-DASH-005: Get Notifications

#### A. Thông tin chung
- **API Name**: Get Notifications
- **Endpoint**: `GET /api/dashboard/notifications`
- **Purpose**: Lấy danh sách notifications/alerts

#### B. FRD Mapping
- **Screen ID**: SCR-DASH-001
- **User Action**: View notifications
- **FRD Section**: Module 1, Dashboard - Notifications

#### C. ERD Mapping
- **Entities**: leads, test_drives, service_appointments, reminders
- **Tables**: Multiple tables (aggregation)
- **Relations**: N/A

#### D. Request Specification

**Query Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| limit | int | No | Number of notifications (default: 10) | 1-50 |

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "notif-001",
      "type": "lead",
      "title": "New lead assigned",
      "message": "You have a new lead from Facebook",
      "timestamp": "2026-01-28T10:30:00Z",
      "read": false
    }
  ]
}
```

**Field Mapping**:
| Response Field | ERD Mapping | Source |
|----------------|-------------|--------|
| type | - | Derived from source table |
| title | - | Generated based on type |
| timestamp | created_at | Various tables |

#### F. Business Rules
- BR-DASH-011: Notifications include: new leads, upcoming test drives, service appointments, reminders
- BR-DASH-012: Order by timestamp DESC
- BR-DASH-013: Only show unread by default

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| DASH_400 | limit < 1 or limit > 50 | Limit must be between 1 and 50 |

---

## 📐 Module 2: CRM (40 APIs)

### 🔹 Leads Management (10 APIs)

### API-CRM-001: List Leads

#### A. Thông tin chung
- **API Name**: List Leads
- **Endpoint**: `GET /api/crm/leads`
- **Purpose**: Lấy danh sách leads với filters, sort, pagination

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-001
- **User Action**: View leads board
- **FRD Section**: Module 2, Quản Lý Leads

#### C. ERD Mapping
- **Entity**: leads
- **Table**: `leads`
- **Relations**:
  - `leads.assigned_to_id` → `users.id`
  - `leads.customer_id` → `customers.id` (nullable)

#### D. Request Specification

**Query Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| status | enum | No | Filter by status | NEW, CONTACTED, QUALIFIED, PROPOSAL, NEGOTIATION, WON, DEAD |
| source | enum | No | Filter by source | FACEBOOK, WEBSITE, WALK_IN, HOTLINE, REFERRAL, OTHER |
| assigned_to_id | varchar | No | Filter by assigned user | UUID |
| score_min | int | No | Minimum score | 1-100 |
| score_max | int | No | Maximum score | 1-100 |
| search | string | No | Search by name/phone | Min 2 chars |
| sort_by | string | No | Sort field (default: created_at) | score, created_at, updated_at |
| sort_order | string | No | Sort order (default: DESC) | ASC, DESC |
| page | int | No | Page number (default: 1) | >= 1 |
| limit | int | No | Items per page (default: 20) | 1-100 |

**Example**:
```
GET /api/crm/leads?status=NEW&source=FACEBOOK&page=1&limit=20
```

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "lead-001",
      "name": "Nguyễn Văn A",
      "phone": "0901234567",
      "email": "nguyenvana@gmail.com",
      "model_interest": "CR-V",
      "model_version": "L",
      "budget": 1200000000,
      "source": "FACEBOOK",
      "status": "NEW",
      "score": 65,
      "assigned_to": {
        "id": "usr-001",
        "name": "Sales Rep 1"
      },
      "created_at": "2026-01-28T10:00:00Z",
      "updated_at": "2026-01-28T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

**Field Mapping**:
| Response Field | ERD Mapping | Type |
|----------------|-------------|------|
| id | leads.id | varchar |
| name | leads.name | varchar |
| phone | leads.phone | varchar |
| email | leads.email | varchar |
| model_interest | leads.model_interest | varchar |
| model_version | leads.model_version | varchar |
| budget | leads.budget | decimal |
| source | leads.source | enum |
| status | leads.status | enum |
| score | leads.score | int |
| assigned_to.id | users.id | varchar (JOIN) |
| assigned_to.name | users.name | varchar (JOIN) |
| created_at | leads.created_at | timestamp |
| updated_at | leads.updated_at | timestamp |

#### F. Business Rules
- BR-CRM-001: Default sort by created_at DESC
- BR-CRM-002: Default limit = 20, max = 100
- BR-CRM-003: Search tìm trong name và phone (LIKE %search%)
- BR-CRM-004: Chỉ show leads của user hiện tại (except ADMIN/MANAGER)

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_400 | Invalid status enum | Invalid status value |
| CRM_400 | Invalid source enum | Invalid source value |
| CRM_400 | score_min > score_max | Min score must be less than max score |
| CRM_400 | limit > 100 | Limit cannot exceed 100 |
| CRM_401 | Unauthorized | Authentication required |

---

### API-CRM-002: Create Lead

#### A. Thông tin chung
- **API Name**: Create Lead
- **Endpoint**: `POST /api/crm/leads`
- **Purpose**: Tạo lead mới

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-001
- **User Action**: Create new lead
- **FRD Section**: Module 2, Quản Lý Leads - Create Lead Dialog

#### C. ERD Mapping
- **Entity**: leads
- **Table**: `leads` (INSERT)
- **Relations**:
  - `leads.assigned_to_id` → `users.id` (required)

#### D. Request Specification

**Body Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| name | string | Yes | Lead name | Min 2 chars |
| phone | string | Yes | Phone number | 10-11 digits |
| email | string | No | Email | Valid email format |
| address | string | No | Address | - |
| model_interest | string | No | Model interested | - |
| model_version | string | No | Version | - |
| budget | decimal | No | Budget | >= 0 |
| source | enum | Yes | Lead source | FACEBOOK, WEBSITE, WALK_IN, HOTLINE, REFERRAL, OTHER |
| notes | string | No | Notes | Max 1000 chars |
| assigned_to_id | varchar | No | Assigned user (default: current user) | UUID, must exist in users |

**Example**:
```json
{
  "name": "Nguyễn Văn A",
  "phone": "0901234567",
  "email": "nguyenvana@gmail.com",
  "model_interest": "CR-V",
  "source": "FACEBOOK",
  "assigned_to_id": "usr-001"
}
```

#### E. Response Specification

**Success (201)**:
```json
{
  "success": true,
  "data": {
    "id": "lead-001",
    "name": "Nguyễn Văn A",
    "phone": "0901234567",
    "status": "NEW",
    "score": 10,
    "created_at": "2026-01-28T10:00:00Z"
  }
}
```

**Field Mapping**:
| Response Field | ERD Mapping | Default Value |
|----------------|-------------|---------------|
| id | leads.id | Generated UUID |
| status | leads.status | 'NEW' |
| score | leads.score | 10 |
| created_at | leads.created_at | now() |
| updated_at | leads.updated_at | now() |

#### F. Business Rules
- BR-CRM-005: Default status = 'NEW'
- BR-CRM-006: Default score = 10
- BR-CRM-007: Phone có thể trùng (không UNIQUE) - nhiều leads từ cùng SĐT
- BR-CRM-008: Auto-assign nếu không có assigned_to_id (round-robin)
- BR-CRM-009: Trigger scoring engine sau khi tạo

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_400 | Missing required fields | Required field missing: {field} |
| CRM_400 | Invalid phone format | Invalid phone number format |
| CRM_400 | Invalid email format | Invalid email format |
| CRM_404 | assigned_to_id not found | User not found |
| CRM_401 | Unauthorized | Authentication required |

---

### API-CRM-003: Get Lead Detail

#### A. Thông tin chung
- **API Name**: Get Lead Detail
- **Endpoint**: `GET /api/crm/leads/{id}`
- **Purpose**: Lấy chi tiết 1 lead

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-001
- **User Action**: View lead detail
- **FRD Section**: Module 2, Quản Lý Leads - Lead Dialog

#### C. ERD Mapping
- **Entity**: leads
- **Table**: `leads`
- **Relations**:
  - `leads.assigned_to_id` → `users.id`
  - `leads.customer_id` → `customers.id`
  - `leads.id` ← `interactions.lead_id` (1:N)

#### D. Request Specification

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | varchar | Yes | Lead ID (UUID) |

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "id": "lead-001",
    "name": "Nguyễn Văn A",
    "phone": "0901234567",
    "email": "nguyenvana@gmail.com",
    "address": "123 Nguyễn Huệ, Q1, HCMC",
    "model_interest": "CR-V",
    "model_version": "L",
    "budget": 1200000000,
    "source": "FACEBOOK",
    "status": "QUALIFIED",
    "score": 65,
    "notes": "Quan tâm mua trong tháng",
    "customer_type": "individual",
    "assigned_to": {
      "id": "usr-001",
      "name": "Sales Rep 1",
      "email": "sales1@honda.vn"
    },
    "customer": null,
    "interactions_count": 5,
    "created_at": "2026-01-20T10:00:00Z",
    "updated_at": "2026-01-28T15:30:00Z"
  }
}
```

#### F. Business Rules
- BR-CRM-010: Chỉ show lead của user hiện tại (except ADMIN/MANAGER)
- BR-CRM-011: Include interactions_count (COUNT)

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_404 | Lead not found | Lead not found |
| CRM_403 | Not assigned to current user | Access denied |
| CRM_401 | Unauthorized | Authentication required |

---

### API-CRM-004: Update Lead

#### A. Thông tin chung
- **API Name**: Update Lead
- **Endpoint**: `PUT /api/crm/leads/{id}`
- **Purpose**: Cập nhật thông tin lead

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-001
- **User Action**: Edit lead
- **FRD Section**: Module 2, Quản Lý Leads - Edit Lead

#### C. ERD Mapping
- **Entity**: leads
- **Table**: `leads` (UPDATE)
- **Relations**: Same as Create

#### D. Request Specification

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | varchar | Yes | Lead ID |

**Body Parameters**: (All optional, only send fields to update)
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| name | string | No | Lead name | Min 2 chars |
| phone | string | No | Phone | 10-11 digits |
| email | string | No | Email | Valid email |
| address | string | No | Address | - |
| model_interest | string | No | Model | - |
| model_version | string | No | Version | - |
| budget | decimal | No | Budget | >= 0 |
| status | enum | No | Status | NEW, CONTACTED, QUALIFIED, PROPOSAL, NEGOTIATION, WON, DEAD |
| score | int | No | Score | 1-100 |
| notes | string | No | Notes | Max 1000 chars |
| assigned_to_id | varchar | No | Assigned user | UUID |

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "id": "lead-001",
    "updated_at": "2026-01-28T16:00:00Z"
  }
}
```

#### F. Business Rules
- BR-CRM-012: Chỉ update fields được gửi (partial update)
- BR-CRM-013: Auto update updated_at = now()
- BR-CRM-014: Không cho update nếu status = 'WON' (đã convert)
- BR-CRM-015: Re-calculate score nếu thay đổi thông tin quan trọng

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_404 | Lead not found | Lead not found |
| CRM_403 | Not assigned to current user | Access denied |
| CRM_409 | Status = WON | Cannot update converted lead |
| CRM_400 | Invalid status transition | Invalid status transition from {old} to {new} |

---

### API-CRM-005: Delete Lead

#### A. Thông tin chung
- **API Name**: Delete Lead
- **Endpoint**: `DELETE /api/crm/leads/{id}`
- **Purpose**: Xóa lead (soft delete: status = DEAD)

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-001
- **User Action**: Delete lead
- **FRD Section**: Module 2, Quản Lý Leads

#### C. ERD Mapping
- **Entity**: leads
- **Table**: `leads` (UPDATE status = 'DEAD')
- **Relations**: N/A

#### D. Request Specification

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | varchar | Yes | Lead ID |

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

#### F. Business Rules
- BR-CRM-016: Soft delete: UPDATE status = 'DEAD'
- BR-CRM-017: Không xóa vật lý (keep for analytics)
- BR-CRM-018: Không cho xóa nếu status = 'WON'

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_404 | Lead not found | Lead not found |
| CRM_403 | Not assigned to current user | Access denied |
| CRM_409 | Status = WON | Cannot delete converted lead |

---

### API-CRM-006: Assign Lead

#### A. Thông tin chung
- **API Name**: Assign Lead
- **Endpoint**: `POST /api/crm/leads/{id}/assign`
- **Purpose**: Gán lead cho user khác

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-001
- **User Action**: Assign lead to sales rep
- **FRD Section**: Module 2, Quản Lý Leads

#### C. ERD Mapping
- **Entity**: leads
- **Table**: `leads` (UPDATE assigned_to_id)
- **Relations**: `leads.assigned_to_id` → `users.id`

#### D. Request Specification

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | varchar | Yes | Lead ID |

**Body Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| assigned_to_id | varchar | Yes | User ID | UUID, must exist |

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "id": "lead-001",
    "assigned_to": {
      "id": "usr-002",
      "name": "Sales Rep 2"
    }
  }
}
```

#### F. Business Rules
- BR-CRM-019: Chỉ MANAGER/ADMIN có thể assign
- BR-CRM-020: Log activity khi assign

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_404 | Lead not found | Lead not found |
| CRM_404 | User not found | User not found |
| CRM_403 | Not MANAGER/ADMIN | Access denied |

---

### API-CRM-007: Convert Lead to Customer

#### A. Thông tin chung
- **API Name**: Convert Lead to Customer
- **Endpoint**: `POST /api/crm/leads/{id}/convert`
- **Purpose**: Convert lead thành customer

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-001
- **User Action**: Convert lead
- **FRD Section**: Module 2, Quản Lý Leads

#### C. ERD Mapping
- **Entities**: leads, customers
- **Tables**: 
  - `leads` (UPDATE status = 'WON', customer_id)
  - `customers` (INSERT or UPDATE)
- **Relations**:
  - `leads.customer_id` → `customers.id`

#### D. Request Specification

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | varchar | Yes | Lead ID |

**Body Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| create_new | boolean | No | Create new customer (default: true) | - |
| existing_customer_id | varchar | No | Link to existing customer | UUID (if create_new = false) |

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "lead_id": "lead-001",
    "customer_id": "cus-001",
    "customer": {
      "id": "cus-001",
      "name": "Nguyễn Văn A",
      "phone": "0901234567",
      "tier": "BRONZE"
    }
  }
}
```

#### F. Business Rules
- BR-CRM-021: Chỉ convert nếu status >= 'QUALIFIED'
- BR-CRM-022: Check duplicate phone trong customers
- BR-CRM-023: Nếu phone đã tồn tại → link to existing customer
- BR-CRM-024: Update lead: status = 'WON', customer_id = {id}
- BR-CRM-025: New customer: tier = 'BRONZE', points = 0

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_404 | Lead not found | Lead not found |
| CRM_400 | Status < QUALIFIED | Lead must be qualified before conversion |
| CRM_409 | Already converted | Lead already converted |
| CRM_409 | Phone exists in customers | Customer with this phone already exists. Use existing_customer_id |

---

### API-CRM-008: Update Lead Score

#### A. Thông tin chung
- **API Name**: Update Lead Score
- **Endpoint**: `POST /api/crm/leads/{id}/score`
- **Purpose**: Cập nhật điểm lead (manual hoặc auto)

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-003
- **User Action**: Update lead score
- **FRD Section**: Module 2, Chấm Điểm Lead

#### C. ERD Mapping
- **Entity**: leads
- **Table**: `leads` (UPDATE score)
- **Relations**: N/A

#### D. Request Specification

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | varchar | Yes | Lead ID |

**Body Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| score | int | Yes | New score | 1-100 |
| reason | string | No | Reason for manual update | Max 500 chars |

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "id": "lead-001",
    "score": 75,
    "previous_score": 65,
    "updated_at": "2026-01-28T16:30:00Z"
  }
}
```

#### F. Business Rules
- BR-CRM-026: Score range: 1-100
- BR-CRM-027: Log score changes in activity_logs

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_404 | Lead not found | Lead not found |
| CRM_400 | score < 1 or score > 100 | Score must be between 1 and 100 |

---

### API-CRM-009: Search Leads

#### A. Thông tin chung
- **API Name**: Search Leads
- **Endpoint**: `GET /api/crm/leads/search`
- **Purpose**: Tìm kiếm leads (full-text search)

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-001
- **User Action**: Search leads
- **FRD Section**: Module 2, Quản Lý Leads - Search

#### C. ERD Mapping
- **Entity**: leads
- **Table**: `leads`
- **Relations**: Same as List Leads

#### D. Request Specification

**Query Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| q | string | Yes | Search query | Min 2 chars |
| limit | int | No | Max results (default: 10) | 1-50 |

**Example**:
```
GET /api/crm/leads/search?q=nguyen&limit=10
```

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "lead-001",
      "name": "Nguyễn Văn A",
      "phone": "0901234567",
      "status": "NEW",
      "score": 65
    }
  ]
}
```

#### F. Business Rules
- BR-CRM-028: Search trong name, phone, email
- BR-CRM-029: Case-insensitive
- BR-CRM-030: Order by score DESC

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_400 | q < 2 chars | Search query must be at least 2 characters |

---

### API-CRM-010: Get Lead Activities

#### A. Thông tin chung
- **API Name**: Get Lead Activities
- **Endpoint**: `GET /api/crm/leads/{id}/activities`
- **Purpose**: Lấy lịch sử activities của lead

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-005
- **User Action**: View lead activities
- **FRD Section**: Module 2, Lịch Sử & Hoạt Động

#### C. ERD Mapping
- **Entity**: interactions
- **Table**: `interactions`
- **Relations**: `interactions.lead_id` → `leads.id`

#### D. Request Specification

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | varchar | Yes | Lead ID |

**Query Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| type | enum | No | Filter by type | CALL, EMAIL, MEETING, NOTE |
| page | int | No | Page (default: 1) | >= 1 |
| limit | int | No | Limit (default: 20) | 1-100 |

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "int-001",
      "type": "CALL",
      "direction": "OUTBOUND",
      "notes": "Gọi tư vấn model CR-V",
      "duration": 300,
      "user": {
        "id": "usr-001",
        "name": "Sales Rep 1"
      },
      "created_at": "2026-01-28T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 5
  }
}
```

**Field Mapping**:
| Response Field | ERD Mapping | Type |
|----------------|-------------|------|
| id | interactions.id | varchar |
| type | interactions.type | enum |
| direction | interactions.direction | enum |
| notes | interactions.notes | text |
| duration | interactions.duration | int |
| user.id | users.id | varchar (JOIN) |
| created_at | interactions.created_at | timestamp |

#### F. Business Rules
- BR-CRM-031: Order by created_at DESC
- BR-CRM-032: Include user info (JOIN)

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_404 | Lead not found | Lead not found |

---

### 🔹 Customers Management (8 APIs)

### API-CRM-011: List Customers

#### A. Thông tin chung
- **API Name**: List Customers
- **Endpoint**: `GET /api/crm/customers`
- **Purpose**: Lấy danh sách khách hàng với filters, sort, pagination

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-002
- **User Action**: View customers list
- **FRD Section**: Module 2, Khách Hàng

#### C. ERD Mapping
- **Entity**: customers
- **Table**: `customers`
- **Relations**: N/A

#### D. Request Specification

**Query Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| type | enum | No | Filter by type | INDIVIDUAL, COMPANY |
| tier | enum | No | Filter by tier | BRONZE, SILVER, GOLD, PLATINUM |
| search | string | No | Search by name/phone/email | Min 2 chars |
| sort_by | string | No | Sort field (default: created_at) | name, tier, created_at |
| sort_order | string | No | Sort order (default: DESC) | ASC, DESC |
| page | int | No | Page number (default: 1) | >= 1 |
| limit | int | No | Items per page (default: 20) | 1-100 |

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "cus-001",
      "name": "Nguyễn Văn A",
      "type": "INDIVIDUAL",
      "phone": "0901234567",
      "mobile": "0912345678",
      "email": "nguyenvana@gmail.com",
      "address": "123 Nguyễn Huệ, Q1, HCMC",
      "tier": "GOLD",
      "points": 1500,
      "tags": ["VIP", "Loyal"],
      "created_at": "2025-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 250
  }
}
```

**Field Mapping**:
| Response Field | ERD Mapping | Type |
|----------------|-------------|------|
| id | customers.id | varchar |
| name | customers.name | varchar |
| type | customers.type | enum |
| phone | customers.phone | varchar (UNIQUE) |
| mobile | customers.mobile | varchar |
| email | customers.email | varchar |
| address | customers.address | text |
| tier | customers.tier | enum |
| points | customers.points | int |
| tags | customers.tags | JSON array |
| created_at | customers.created_at | timestamp |

#### F. Business Rules
- BR-CRM-033: Default tier = 'SILVER' for new customers
- BR-CRM-034: Tags stored as JSON array
- BR-CRM-035: Phone is UNIQUE constraint
- BR-CRM-036: Points calculated from loyalty_transactions

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_400 | Invalid type enum | Invalid customer type |
| CRM_400 | Invalid tier enum | Invalid tier value |
| CRM_401 | Unauthorized | Authentication required |

---

### API-CRM-012: Create Customer

#### A. Thông tin chung
- **API Name**: Create Customer
- **Endpoint**: `POST /api/crm/customers`
- **Purpose**: Tạo khách hàng mới

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-002
- **User Action**: Create new customer
- **FRD Section**: Module 2, Khách Hàng - Create Customer

#### C. ERD Mapping
- **Entity**: customers
- **Table**: `customers` (INSERT)
- **Relations**: N/A

#### D. Request Specification

**Body Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| name | string | Yes | Customer name | Min 2 chars |
| type | enum | Yes | Customer type | INDIVIDUAL, COMPANY |
| phone | string | Yes | Phone number (UNIQUE) | 10-11 digits |
| mobile | string | No | Mobile number | 10-11 digits |
| email | string | No | Email | Valid email format |
| address | string | No | Address | - |
| vat | string | No | VAT number (required if COMPANY) | - |
| tags | string[] | No | Tags | Array of strings |
| notes | string | No | Notes | Max 1000 chars |

**Example**:
```json
{
  "name": "Nguyễn Văn A",
  "type": "INDIVIDUAL",
  "phone": "0901234567",
  "email": "nguyenvana@gmail.com",
  "tags": ["VIP"]
}
```

#### E. Response Specification

**Success (201)**:
```json
{
  "success": true,
  "data": {
    "id": "cus-001",
    "name": "Nguyễn Văn A",
    "tier": "SILVER",
    "points": 0,
    "created_at": "2026-01-28T10:00:00Z"
  }
}
```

#### F. Business Rules
- BR-CRM-037: Default tier = 'SILVER', points = 0
- BR-CRM-038: Phone must be UNIQUE (check before insert)
- BR-CRM-039: VAT required if type = 'COMPANY'
- BR-CRM-040: Tags stored as JSON array

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_400 | Missing required fields | Required field missing: {field} |
| CRM_400 | Invalid phone format | Invalid phone number format |
| CRM_409 | Phone already exists | Customer with this phone already exists |
| CRM_400 | COMPANY without VAT | VAT required for company type |

---

### API-CRM-013: Get Customer Detail

#### A. Thông tin chung
- **API Name**: Get Customer Detail
- **Endpoint**: `GET /api/crm/customers/{id}`
- **Purpose**: Lấy chi tiết khách hàng

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-002
- **User Action**: View customer detail
- **FRD Section**: Module 2, Khách Hàng - Customer Detail

#### C. ERD Mapping
- **Entity**: customers
- **Table**: `customers`
- **Relations**:
  - `customers.id` ← `leads.customer_id` (1:N)
  - `customers.id` ← `quotations.customer_id` (1:N)
  - `customers.id` ← `loyalty_transactions.customer_id` (1:N)

#### D. Request Specification

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | varchar | Yes | Customer ID |

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "id": "cus-001",
    "name": "Nguyễn Văn A",
    "type": "INDIVIDUAL",
    "phone": "0901234567",
    "mobile": "0912345678",
    "email": "nguyenvana@gmail.com",
    "address": "123 Nguyễn Huệ, Q1, HCMC",
    "vat": null,
    "tier": "GOLD",
    "points": 1500,
    "tags": ["VIP", "Loyal"],
    "notes": "Khách hàng thân thiết",
    "stats": {
      "total_purchases": 3,
      "total_spent": 3500000000,
      "leads_count": 2
    },
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2026-01-28T10:00:00Z"
  }
}
```

#### F. Business Rules
- BR-CRM-041: Include stats (aggregation from related tables)
- BR-CRM-042: total_purchases = COUNT(contracts)
- BR-CRM-043: total_spent = SUM(contracts.total_amount)

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_404 | Customer not found | Customer not found |

---

### API-CRM-014: Update Customer

#### A. Thông tin chung
- **API Name**: Update Customer
- **Endpoint**: `PUT /api/crm/customers/{id}`
- **Purpose**: Cập nhật thông tin khách hàng

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-002
- **User Action**: Edit customer
- **FRD Section**: Module 2, Khách Hàng - Edit Customer

#### C. ERD Mapping
- **Entity**: customers
- **Table**: `customers` (UPDATE)
- **Relations**: N/A

#### D. Request Specification

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | varchar | Yes | Customer ID |

**Body Parameters**: (All optional)
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| name | string | No | Customer name | Min 2 chars |
| phone | string | No | Phone | 10-11 digits, UNIQUE |
| mobile | string | No | Mobile | 10-11 digits |
| email | string | No | Email | Valid email |
| address | string | No | Address | - |
| vat | string | No | VAT | - |
| tags | string[] | No | Tags | Array |
| notes | string | No | Notes | Max 1000 chars |

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "id": "cus-001",
    "updated_at": "2026-01-28T16:00:00Z"
  }
}
```

#### F. Business Rules
- BR-CRM-044: Partial update (only sent fields)
- BR-CRM-045: Auto update updated_at = now()
- BR-CRM-046: Check phone UNIQUE if updating phone

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_404 | Customer not found | Customer not found |
| CRM_409 | Phone already exists | Phone number already in use |

---

### API-CRM-015: Delete Customer

#### A. Thông tin chung
- **API Name**: Delete Customer
- **Endpoint**: `DELETE /api/crm/customers/{id}`
- **Purpose**: Xóa khách hàng (soft delete)

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-002
- **User Action**: Delete customer
- **FRD Section**: Module 2, Khách Hàng

#### C. ERD Mapping
- **Entity**: customers
- **Table**: `customers` (UPDATE status = 'INACTIVE')
- **Relations**: N/A

#### D. Request Specification

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | varchar | Yes | Customer ID |

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

#### F. Business Rules
- BR-CRM-047: Soft delete: UPDATE status = 'INACTIVE'
- BR-CRM-048: Không xóa vật lý (keep for audit)
- BR-CRM-049: Không cho xóa nếu có contracts active

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_404 | Customer not found | Customer not found |
| CRM_409 | Has active contracts | Cannot delete customer with active contracts |

---

### API-CRM-016: Get Customer Loyalty Transactions

#### A. Thông tin chung
- **API Name**: Get Customer Loyalty Transactions
- **Endpoint**: `GET /api/crm/customers/{id}/loyalty`
- **Purpose**: Lấy lịch sử giao dịch điểm loyalty

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-007
- **User Action**: View loyalty transactions
- **FRD Section**: Module 2, Chương Trình Loyalty

#### C. ERD Mapping
- **Entity**: loyalty_transactions
- **Table**: `loyalty_transactions`
- **Relations**: `loyalty_transactions.customer_id` → `customers.id`

#### D. Request Specification

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | varchar | Yes | Customer ID |

**Query Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| type | enum | No | Filter by type | EARN, REDEEM |
| page | int | No | Page (default: 1) | >= 1 |
| limit | int | No | Limit (default: 20) | 1-100 |

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "loy-001",
      "type": "EARN",
      "points": 100,
      "description": "Purchase - Contract #CNT-001",
      "created_at": "2026-01-28T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "current_points": 1500
  }
}
```

**Field Mapping**:
| Response Field | ERD Mapping | Type |
|----------------|-------------|------|
| id | loyalty_transactions.id | varchar |
| type | loyalty_transactions.type | enum |
| points | loyalty_transactions.points | int |
| description | loyalty_transactions.description | text |
| created_at | loyalty_transactions.created_at | timestamp |

#### F. Business Rules
- BR-CRM-050: EARN = positive points, REDEEM = negative points
- BR-CRM-051: current_points = SUM(points)
- BR-CRM-052: Order by created_at DESC

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_404 | Customer not found | Customer not found |

---

### API-CRM-017: Add Loyalty Points

#### A. Thông tin chung
- **API Name**: Add Loyalty Points
- **Endpoint**: `POST /api/crm/customers/{id}/loyalty`
- **Purpose**: Thêm điểm loyalty cho khách hàng

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-007
- **User Action**: Add loyalty points
- **FRD Section**: Module 2, Chương Trình Loyalty

#### C. ERD Mapping
- **Entities**: customers, loyalty_transactions
- **Tables**: 
  - `loyalty_transactions` (INSERT)
  - `customers` (UPDATE points)
- **Relations**: `loyalty_transactions.customer_id` → `customers.id`

#### D. Request Specification

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | varchar | Yes | Customer ID |

**Body Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| points | int | Yes | Points to add/subtract | Non-zero integer |
| description | string | Yes | Transaction description | Max 500 chars |
| reference_type | string | No | Reference type (CONTRACT, MANUAL, etc.) | - |
| reference_id | varchar | No | Reference ID | - |

**Example**:
```json
{
  "points": 100,
  "description": "Purchase - Contract #CNT-001",
  "reference_type": "CONTRACT",
  "reference_id": "cnt-001"
}
```

#### E. Response Specification

**Success (201)**:
```json
{
  "success": true,
  "data": {
    "transaction_id": "loy-001",
    "customer_id": "cus-001",
    "points_added": 100,
    "new_total": 1600,
    "new_tier": "GOLD"
  }
}
```

#### F. Business Rules
- BR-CRM-053: Positive points = EARN, Negative = REDEEM
- BR-CRM-054: Update customers.points = SUM(loyalty_transactions.points)
- BR-CRM-055: Auto upgrade/downgrade tier based on points
- BR-CRM-056: Tier thresholds: BRONZE (0-499), SILVER (500-1999), GOLD (2000-4999), PLATINUM (5000+)

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_404 | Customer not found | Customer not found |
| CRM_400 | points = 0 | Points cannot be zero |
| CRM_400 | Insufficient points for redeem | Insufficient loyalty points |

---

### API-CRM-018: Search Customers

#### A. Thông tin chung
- **API Name**: Search Customers
- **Endpoint**: `GET /api/crm/customers/search`
- **Purpose**: Tìm kiếm khách hàng (full-text search)

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-002
- **User Action**: Search customers
- **FRD Section**: Module 2, Khách Hàng - Search

#### C. ERD Mapping
- **Entity**: customers
- **Table**: `customers`
- **Relations**: N/A

#### D. Request Specification

**Query Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| q | string | Yes | Search query | Min 2 chars |
| limit | int | No | Max results (default: 10) | 1-50 |

**Example**:
```
GET /api/crm/customers/search?q=nguyen&limit=10
```

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "cus-001",
      "name": "Nguyễn Văn A",
      "phone": "0901234567",
      "tier": "GOLD",
      "type": "INDIVIDUAL"
    }
  ]
}
```

#### F. Business Rules
- BR-CRM-057: Search trong name, phone, mobile, email, vat
- BR-CRM-058: Case-insensitive
- BR-CRM-059: Order by tier DESC, then name ASC

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_400 | q < 2 chars | Search query must be at least 2 characters |

---

### 🔹 Scoring Management (5 APIs)

### API-CRM-019: Get Scoring Rules

#### A. Thông tin chung
- **API Name**: Get Scoring Rules
- **Endpoint**: `GET /api/crm/scoring/rules`
- **Purpose**: Lấy cấu hình quy tắc chấm điểm lead

#### B. FRD Mapping
- **Screen ID**: SCR-CRM-003
- **User Action**: View scoring configuration
- **FRD Section**: Module 2, Chấm Điểm Lead

#### C. ERD Mapping
- **Entity**: scoring_rules
- **Table**: `scoring_rules`
- **Relations**: N/A

#### D. Request Specification

**Query Parameters**: None

#### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "rules": [
      {
        "id": "rule-001",
        "name": "Source Score",
        "field": "source",
        "weight": 20,
        "conditions": {
          "FACEBOOK": 20,
          "WEBSITE": 18,
          "WALK_IN": 15,
          "HOTLINE": 12,
          "REFERRAL": 10,
          "OTHER": 5
        }
      },
      {
        "id": "rule-002",
        "name": "Budget Score",
        "field": "budget",
        "weight": 30,
        "conditions": {
          ">= 1500000000": 30,
          ">= 1000000000": 25,
          ">= 500000000": 15,
          "< 500000000": 5
        }
      }
    ],
    "total_weight": 100
  }
}
```

**Field Mapping**:
| Response Field | ERD Mapping | Type |
|----------------|-------------|------|
| id | scoring_rules.id | varchar |
| name | scoring_rules.name | varchar |
| field | scoring_rules.field | varchar |
| weight | scoring_rules.weight | int |
| conditions | scoring_rules.conditions | JSON |

#### F. Business Rules
- BR-CRM-060: Total weight must = 100
- BR-CRM-061: Conditions stored as JSON object
- BR-CRM-062: Auto-apply rules when lead created/updated

#### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| CRM_401 | Unauthorized | Authentication required |

---

**[Continuing with remaining CRM APIs in next section...]**

