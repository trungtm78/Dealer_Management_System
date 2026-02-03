# UAT Specification: CR-MD-001 - VehicleModel Master Data Management

## Document Information
- **CR ID**: CR-MD-001
- **UAT Spec Version**: 1.0
- **Created Date**: 31/01/2026
- **Prepared by**: Antigravity - UAT Authority & Design Authority
- **Approved by**: Antigravity - UAT Authority
- **Approval Date**: 31/01/2026
- **Project**: Honda SPICE ERP System

---

## 📋 Mục Lục

1. [UAT Overview](#1-uat-overview)
2. [UAT Entry/Exit Criteria](#2-uat-entryexit-criteria)
3. [UAT Scope Matrix](#3-uat-scope-matrix)
4. [UAT Scenarios Definition](#4-uat-scenarios-definition)
5. [Data & Environment](#5-data--environment)
6. [Bug vs CR Classification Rule](#6-bug-vs-cr-classification-rule)
7. [UAT Execution Rules](#7-uat-execution-rules)
8. [Traceability Matrix](#8-traceability-matrix)
9. [Approval Section](#9-approval-section)

---

## 1. UAT Overview

### 1.1 Mục Tiêu UAT

Xác nhận rằng **CR-MD-001 (VehicleModel Master Data Management)** đã được implement đúng theo Business Requirements và Functional Requirements, đảm bảo:

1. **Business Flow**: Admin có thể quản lý VehicleModel (CRUD) đúng nghiệp vụ
2. **Data Integrity**: Dữ liệu VehicleModel nhất quán, không có duplicate, soft delete hoạt động đúng
3. **Integration**: CRM, Sales, Inventory modules sử dụng VehicleModel dropdown chính xác
4. **End-to-End**: Từ Admin tạo model → Sales chọn model → Quotation auto-fill price → Báo cáo chính xác

### 1.2 Phạm Vi UAT

#### ✅ In Scope

**Master Data Module**:
- ✅ VehicleModel CRUD (Create, Read, Update, Delete soft)
- ✅ VehicleModel Search & Filter
- ✅ VehicleModel Import/Export Excel
- ✅ Audit Trail cho VehicleModel operations

**Integration Points**:
- ✅ CRM: Lead.model_interest dropdown
- ✅ Sales: Quotation.vehicle_model_id dropdown + auto-fill base_price
- ✅ Inventory: Vehicle.model_id display

**Data Integrity**:
- ✅ Unique constraints (model_code, model_name)
- ✅ Soft delete (status = INACTIVE, deleted_at timestamp)
- ✅ FK constraints (Quotation, Vehicle references)

#### ❌ Out of Scope

- ❌ Unit Test logic (đã cover bởi UT)
- ❌ API performance testing (không phải UAT scope)
- ❌ Security penetration testing
- ❌ Other Master Data entities (Accessory, ServiceCatalog) - sẽ có CR riêng
- ❌ Data migration (CR-INT-002)

### 1.3 UAT Type

**PARTIAL REGRESSION**

**Lý do**:
- CR-MD-001 là **NEW feature** (Master Data module mới)
- Có **integration impact** với 3 modules (CRM, Sales, Inventory)
- Cần test:
  * NEW: Master Data CRUD
  * REGRESSION: CRM Lead form, Sales Quotation form, Inventory Vehicle display

**Không phải FULL REGRESSION** vì:
- Không ảnh hưởng Service, Parts, Accounting, Admin modules
- Database schema không thay đổi (table đã tồn tại)
- API backward compatible (2 endpoints mới, không breaking)

### 1.4 Liên Kết CR-ID

- **CR ID**: CR-MD-001
- **CR Document**: `docs/design/change_requests/CR_MD_001_vehicle_model_master_v1.0.md`
- **BRD**: `docs/requirements/BRD/brd_honda_dms_v2.1.md` (Section 5.1)
- **FRD**: `docs/requirements/FRD/frd_master_data_v1.0.md`
- **ERD**: `docs/design/database/erd/erd_master_data_v1.0.md`
- **UI Spec**: `docs/design/ui/ui_spec_master_data_v1.0.md`
- **API Spec**: `docs/design/api/api_spec_master_data_v1.0.md`

---

## 2. UAT Entry/Exit Criteria

### 2.1 Entry Criteria

UAT chỉ được bắt đầu khi **TẤT CẢ** các điều kiện sau được thỏa mãn:

| # | Criteria | Status | Verified By |
|---|----------|--------|-------------|
| 1 | CR-MD-001 implemented hoàn chỉnh | ⏳ Pending | Dev Team |
| 2 | Unit Test (UT) 100% PASS | ⏳ Pending | Dev Team |
| 3 | Database migration completed (nếu có) | ⏳ Pending | Dev Team |
| 4 | UI deployed to UAT environment | ⏳ Pending | DevOps |
| 5 | API deployed to UAT environment | ⏳ Pending | DevOps |
| 6 | Test data prepared (8 sample models) | ⏳ Pending | QA Team |
| 7 | UAT Spec approved by Antigravity | ✅ Approved | Antigravity |

**⚠️ Nếu thiếu bất kỳ criteria nào → KHÔNG được bắt đầu UAT**

### 2.2 Exit Criteria

UAT được coi là **PASS** khi:

| # | Criteria | Pass Condition |
|---|----------|----------------|
| 1 | All CRITICAL scenarios PASS | 100% (0 failed) |
| 2 | All HIGH priority scenarios PASS | ≥ 95% |
| 3 | All MEDIUM priority scenarios PASS | ≥ 90% |
| 4 | No open CRITICAL bugs | 0 bugs |
| 5 | No open HIGH bugs | 0 bugs |
| 6 | MEDIUM bugs reviewed & accepted | Antigravity approval |
| 7 | Traceability verified | 100% FRs covered |

**⚠️ Nếu có bất kỳ CRITICAL bug → UAT FAILED, phải fix và re-test**

---

## 3. UAT Scope Matrix

| Module | Entity | Screen | API Endpoint | In Scope | Priority |
|--------|--------|--------|--------------|----------|----------|
| **Master Data** | VehicleModel | /master/vehicle-models | GET /api/vehicle-models | ✅ Yes | CRITICAL |
| **Master Data** | VehicleModel | /master/vehicle-models | POST /api/vehicle-models | ✅ Yes | CRITICAL |
| **Master Data** | VehicleModel | /master/vehicle-models | PATCH /api/vehicle-models/[id] | ✅ Yes | CRITICAL |
| **Master Data** | VehicleModel | /master/vehicle-models | DELETE /api/vehicle-models/[id] | ✅ Yes | CRITICAL |
| **CRM** | Lead | /crm/leads (form) | GET /api/vehicle-models | ✅ Yes | HIGH |
| **Sales** | Quotation | /sales/quotations (form) | GET /api/vehicle-models | ✅ Yes | HIGH |
| **Inventory** | Vehicle | /inventory/vehicles (detail) | GET /api/vehicle-models/[id] | ✅ Yes | MEDIUM |
| **Service** | - | - | - | ❌ No | - |
| **Parts** | - | - | - | ❌ No | - |
| **Accounting** | - | - | - | ❌ No | - |
| **Admin** | activity_logs | - | - | ✅ Yes | MEDIUM |

**Tổng**: 7 scope items (4 CRITICAL, 2 HIGH, 2 MEDIUM)

---

## 4. UAT Scenarios Definition

### 4.1 Scenario Naming Convention

`UAT-CR-MD-001-[Module]-[Number]`

Ví dụ: `UAT-CR-MD-001-MD-001` (Master Data scenario 1)

---

### 4.2 CRITICAL Scenarios (Must PASS 100%)

---

#### UAT-CR-MD-001-MD-001: Create VehicleModel - Happy Path

**Mapped FR-ID**: FR-MD-001-01  
**Priority**: CRITICAL  
**Test Type**: End-to-End Business Flow

**Preconditions**:
- User logged in as Admin
- User has permission: MASTER_DATA.CREATE
- Database has no model with name "Honda City RS 2026"

**Test Steps**:

| Step | Action | Expected Result (UI) | Expected Result (DB) |
|------|--------|----------------------|----------------------|
| 1 | Navigate to `/master/vehicle-models` | Page loads, shows VehicleModel table | - |
| 2 | Click "+ New" button | Create VehicleModel dialog opens | - |
| 3 | Observe `model_code` field | Field is read-only, shows auto-generated code (e.g., MOD/2026/001) | - |
| 4 | Enter `model_name`: "Honda City RS 2026" | Text appears in field | - |
| 5 | Select `category`: "SEDAN" | Dropdown shows "SEDAN" selected | - |
| 6 | Enter `base_price`: "569000000" | Field shows "569,000,000₫" (formatted) | - |
| 7 | Select `status`: "ACTIVE" (default) | Radio button "Active" selected | - |
| 8 | Click "Save" button | Dialog closes, success message appears: "VehicleModel created successfully" | Record inserted into VehicleModel table |
| 9 | Verify table | New row appears with: MOD/2026/001, Honda City RS 2026, SEDAN badge (blue), 569,000,000₫, ACTIVE badge (green) | - |
| 10 | Query database | - | `SELECT * FROM VehicleModel WHERE model_name = 'Honda City RS 2026'` returns 1 row with correct data |

**Expected DB State After Test**:
```sql
-- VehicleModel table
id: [auto-generated]
model_code: 'MOD/2026/001'
model_name: 'Honda City RS 2026'
category: 'SEDAN'
base_price: 569000000.00
status: 'ACTIVE'
created_at: [current timestamp]
updated_at: [current timestamp]
deleted_at: NULL

-- activity_logs table
user_id: [current user ID]
action: 'CREATE'
entity: 'VehicleModel'
entity_id: [new VehicleModel ID]
details: {"new_value": {...}}
```

**Pass Criteria**:
- ✅ Dialog opens and closes correctly
- ✅ model_code auto-generated with correct format
- ✅ Success message displayed
- ✅ New row appears in table with correct data
- ✅ Database record created with correct values
- ✅ Audit log entry created

**Fail Criteria**:
- ❌ Dialog does not open
- ❌ model_code not auto-generated
- ❌ Validation error on valid data
- ❌ Database record not created
- ❌ Audit log not created

---

#### UAT-CR-MD-001-MD-002: Create VehicleModel - Duplicate Name Validation

**Mapped FR-ID**: FR-MD-001-01 (Alternate Flow 1)  
**Priority**: CRITICAL  
**Test Type**: Data Integrity Validation

**Preconditions**:
- User logged in as Admin
- Database already has model: "Honda City RS" (case-insensitive match)

**Test Steps**:

| Step | Action | Expected Result (UI) | Expected Result (DB) |
|------|--------|----------------------|----------------------|
| 1 | Navigate to `/master/vehicle-models`, click "+ New" | Create dialog opens | - |
| 2 | Enter `model_name`: "HONDA CITY RS" (uppercase) | Text appears | - |
| 3 | Enter other fields (category, price) | Fields filled | - |
| 4 | Click "Save" | Error message appears: "Model name already exists. Please use a different name." | No record inserted |
| 5 | Verify dialog | Dialog remains open, error shown below model_name field (red text) | - |
| 6 | Change `model_name` to "Honda CR-V L" | Error clears | - |
| 7 | Click "Save" | Success, dialog closes | Record inserted |

**Pass Criteria**:
- ✅ Duplicate name detected (case-insensitive)
- ✅ Error message displayed correctly
- ✅ No database record created on duplicate
- ✅ User can correct and retry

**Fail Criteria**:
- ❌ Duplicate name allowed
- ❌ Database constraint error (should be caught by app)
- ❌ Dialog closes without saving

---

#### UAT-CR-MD-001-MD-003: Update VehicleModel - Immutable model_code

**Mapped FR-ID**: FR-MD-001-03 (Alternate Flow 1)  
**Priority**: CRITICAL  
**Test Type**: Business Rule Enforcement

**Preconditions**:
- User logged in as Admin
- Database has model: MOD/2026/001, "Honda City RS", SEDAN, 559000000

**Test Steps**:

| Step | Action | Expected Result (UI) | Expected Result (DB) |
|------|--------|----------------------|----------------------|
| 1 | Navigate to `/master/vehicle-models` | Table shows existing model | - |
| 2 | Click Edit icon (✎) on "Honda City RS" row | Edit dialog opens | - |
| 3 | Observe `model_code` field | Field is read-only (grayed out), shows "MOD/2026/001" | - |
| 4 | Attempt to edit `model_code` (inspect element, try to enable) | Field remains disabled, cannot be edited | - |
| 5 | Update `base_price` to "569000000" | Field updates | - |
| 6 | Click "Save" | Success, dialog closes | base_price updated to 569000000, model_code unchanged |
| 7 | Verify table | Price shows 569,000,000₫, model_code still MOD/2026/001 | - |
| 8 | Query database | - | `model_code` = 'MOD/2026/001' (unchanged), `base_price` = 569000000.00 |

**Pass Criteria**:
- ✅ model_code field is disabled in Edit mode
- ✅ model_code cannot be changed (UI enforced)
- ✅ Other fields can be updated
- ✅ Database model_code unchanged after update

**Fail Criteria**:
- ❌ model_code field is editable
- ❌ model_code changed in database

---

#### UAT-CR-MD-001-MD-004: Delete VehicleModel - Soft Delete

**Mapped FR-ID**: FR-MD-001-04  
**Priority**: CRITICAL  
**Test Type**: Data Integrity & Soft Delete

**Preconditions**:
- User logged in as Admin
- Database has model: MOD/2026/001, "Honda City RS", status = ACTIVE

**Test Steps**:

| Step | Action | Expected Result (UI) | Expected Result (DB) |
|------|--------|----------------------|----------------------|
| 1 | Navigate to `/master/vehicle-models` | Table shows "Honda City RS" with ACTIVE status | - |
| 2 | Click Delete icon (🗑) on "Honda City RS" row | Confirmation dialog appears: "Deactivate Vehicle Model?" | - |
| 3 | Read confirmation message | Message explains soft delete: "This will set the model status to INACTIVE..." | - |
| 4 | Click "Deactivate" button | Dialog closes, success message: "VehicleModel deactivated successfully" | status = INACTIVE, deleted_at = NOW() |
| 5 | Verify table (filter = ACTIVE) | "Honda City RS" row disappears from table | - |
| 6 | Change filter to "INACTIVE" | "Honda City RS" row appears with INACTIVE badge (gray) | - |
| 7 | Query database | - | `SELECT * FROM VehicleModel WHERE model_name = 'Honda City RS'` returns 1 row: status = 'INACTIVE', deleted_at IS NOT NULL |
| 8 | Verify record NOT hard deleted | - | Record still exists in database (soft delete) |

**Expected DB State After Test**:
```sql
-- VehicleModel table (record still exists)
id: [original ID]
model_code: 'MOD/2026/001'
model_name: 'Honda City RS'
status: 'INACTIVE'  -- Changed
deleted_at: '2026-01-31 10:30:00'  -- Set to current timestamp

-- activity_logs table
action: 'DELETE'
entity: 'VehicleModel'
details: {"old_value": {"status": "ACTIVE"}}
```

**Pass Criteria**:
- ✅ Confirmation dialog appears
- ✅ Soft delete performed (status = INACTIVE, deleted_at set)
- ✅ Record NOT hard deleted (still in database)
- ✅ Row disappears from ACTIVE filter
- ✅ Row appears in INACTIVE filter
- ✅ Audit log created

**Fail Criteria**:
- ❌ Record hard deleted (removed from database)
- ❌ status not changed to INACTIVE
- ❌ deleted_at not set

---

### 4.3 HIGH Priority Scenarios

---

#### UAT-CR-MD-001-CRM-001: Lead Form - VehicleModel Dropdown Integration

**Mapped FR-ID**: FR-MD-001-02 (Integration Point)  
**Priority**: HIGH  
**Test Type**: Integration Test

**Preconditions**:
- Database has 3 ACTIVE models: "Honda City RS", "Honda CR-V L", "Honda Civic RS"
- Database has 1 INACTIVE model: "Honda Accord" (deleted)
- User logged in as Sales

**Test Steps**:

| Step | Action | Expected Result (UI) | Expected Result (DB) |
|------|--------|----------------------|----------------------|
| 1 | Navigate to `/crm/leads`, click "+ New Lead" | Lead form opens | - |
| 2 | Locate `model_interest` field | Field is a dropdown (not free text input) | - |
| 3 | Click `model_interest` dropdown | Dropdown shows 3 options: "Honda City RS", "Honda CR-V L", "Honda Civic RS" (sorted alphabetically) | - |
| 4 | Verify INACTIVE model NOT shown | "Honda Accord" does NOT appear in dropdown | - |
| 5 | Select "Honda City RS" | Dropdown shows "Honda City RS" selected | - |
| 6 | Fill other fields (customer_name, phone, etc.) | Fields filled | - |
| 7 | Click "Save" | Lead created successfully | Lead.model_interest = 'Honda City RS' |
| 8 | Query database | - | `SELECT model_interest FROM Lead WHERE id = [new lead ID]` returns 'Honda City RS' |

**Pass Criteria**:
- ✅ model_interest is dropdown (not free text)
- ✅ Dropdown populated from VehicleModel table
- ✅ Only ACTIVE models shown
- ✅ INACTIVE models NOT shown
- ✅ Lead saved with correct model_interest value

**Fail Criteria**:
- ❌ model_interest is free text input
- ❌ Dropdown empty or shows wrong data
- ❌ INACTIVE models shown in dropdown

---

#### UAT-CR-MD-001-SALES-001: Quotation Form - Auto-fill Base Price

**Mapped FR-ID**: FR-MD-001-02 (Integration Point)  
**Priority**: HIGH  
**Test Type**: Integration Test

**Preconditions**:
- Database has model: "Honda City RS", base_price = 559000000
- User logged in as Sales

**Test Steps**:

| Step | Action | Expected Result (UI) | Expected Result (DB) |
|------|--------|----------------------|----------------------|
| 1 | Navigate to `/sales/quotations`, click "+ New Quotation" | Quotation form opens | - |
| 2 | Locate `vehicle_model_id` field | Field is a dropdown | - |
| 3 | Click dropdown | Dropdown shows models with prices: "Honda City RS - 559,000,000₫" | - |
| 4 | Select "Honda City RS - 559,000,000₫" | Dropdown shows selected | - |
| 5 | Observe `base_price` field | Field auto-fills with "559,000,000₫" | - |
| 6 | User can edit `base_price` (optional discount) | Field is editable, user can change to "550,000,000₫" | - |
| 7 | Fill other fields, click "Save" | Quotation created | Quotation.vehicle_model_id = [Honda City RS ID], base_price = 550000000 (user-edited) |

**Pass Criteria**:
- ✅ Dropdown shows model name + price
- ✅ base_price auto-fills when model selected
- ✅ User can override auto-filled price
- ✅ Quotation saved with correct vehicle_model_id

**Fail Criteria**:
- ❌ base_price not auto-filled
- ❌ Dropdown shows wrong price
- ❌ vehicle_model_id not saved

---

### 4.4 MEDIUM Priority Scenarios

---

#### UAT-CR-MD-001-MD-005: Search VehicleModel - Partial Match

**Mapped FR-ID**: FR-MD-001-05  
**Priority**: MEDIUM  
**Test Type**: Functional Test

**Preconditions**:
- Database has models: "Honda City RS", "Honda City Hatchback", "Honda CR-V L"

**Test Steps**:

| Step | Action | Expected Result (UI) |
|------|--------|----------------------|
| 1 | Navigate to `/master/vehicle-models` | Table shows all 3 models |
| 2 | Type "city" in search box | After 300ms, table filters to show: "Honda City RS", "Honda City Hatchback" (2 rows) |
| 3 | Verify "Honda CR-V L" NOT shown | Table shows only 2 matching rows |
| 4 | Clear search (click ✕) | Table shows all 3 models again |

**Pass Criteria**:
- ✅ Search is case-insensitive
- ✅ Partial match works
- ✅ Debounce 300ms applied
- ✅ Clear search resets table

---

#### UAT-CR-MD-001-ADMIN-001: Audit Trail - CREATE Action

**Mapped FR-ID**: FR-MD-001-09  
**Priority**: MEDIUM  
**Test Type**: Audit & Compliance

**Preconditions**:
- User logged in as Admin (user_id = 123)

**Test Steps**:

| Step | Action | Expected Result (DB) |
|------|--------|----------------------|
| 1 | Create new VehicleModel "Honda Brio" | Record created in VehicleModel table |
| 2 | Query activity_logs | `SELECT * FROM activity_logs WHERE entity = 'VehicleModel' AND action = 'CREATE' ORDER BY created_at DESC LIMIT 1` returns 1 row |
| 3 | Verify log fields | user_id = 123, action = 'CREATE', entity = 'VehicleModel', entity_id = [new ID], details contains new_value with full object |

**Pass Criteria**:
- ✅ Audit log entry created
- ✅ All required fields populated
- ✅ details JSON contains new_value

---

## 5. Data & Environment

### 5.1 Test Environment

- **Environment**: UAT Server
- **URL**: `https://uat.honda-spice-erp.com`
- **Database**: `honda_spice_erp_uat`
- **API Base URL**: `https://uat-api.honda-spice-erp.com`

### 5.2 Test Data Assumptions

**Pre-populated VehicleModels** (for testing):

```sql
INSERT INTO VehicleModel (model_code, model_name, category, base_price, status) VALUES
('MOD/2026/001', 'Honda City RS', 'SEDAN', 559000000.00, 'ACTIVE'),
('MOD/2026/002', 'Honda CR-V L', 'SUV', 1029000000.00, 'ACTIVE'),
('MOD/2026/003', 'Honda Civic RS', 'SEDAN', 799000000.00, 'ACTIVE'),
('MOD/2026/004', 'Honda Accord', 'SEDAN', 1319000000.00, 'INACTIVE'),
('MOD/2026/005', 'Honda BR-V', 'SUV', 661000000.00, 'ACTIVE'),
('MOD/2026/006', 'Honda HR-V', 'SUV', 699000000.00, 'ACTIVE'),
('MOD/2026/007', 'Honda City Hatchback', 'HATCHBACK', 549000000.00, 'ACTIVE'),
('MOD/2026/008', 'Honda Brio', 'HATCHBACK', 418000000.00, 'ACTIVE');
```

**Test Users**:

| Username | Password | Role | Permissions |
|----------|----------|------|-------------|
| admin_uat | [provided separately] | Admin | MASTER_DATA.* (all) |
| sales_uat | [provided separately] | Sales | MASTER_DATA.READ |
| service_uat | [provided separately] | Service Advisor | MASTER_DATA.READ |

### 5.3 User Roles for UAT

- **Admin**: Test CRUD operations, Import/Export
- **Sales**: Test dropdown integration, read-only access
- **Service Advisor**: Test read-only access

---

## 6. Bug vs CR Classification Rule

### 6.1 Khi Nào Là BUG

Issue được phân loại là **BUG** khi:

1. **Không đúng FRD**: Hành vi khác với Functional Requirements Document
   - Ví dụ: model_code không auto-generate → BUG (FR-MD-001-01 yêu cầu auto-generate)

2. **Validation sai**: Validation rule không đúng theo VR-MD-001 đến VR-MD-004
   - Ví dụ: Cho phép base_price = 0 → BUG (VR-MD-004 yêu cầu > 0)

3. **Data integrity lỗi**: Dữ liệu không nhất quán
   - Ví dụ: Soft delete không set deleted_at → BUG

4. **Integration lỗi**: Dropdown không hoạt động đúng
   - Ví dụ: CRM dropdown hiển thị INACTIVE models → BUG

5. **UI/UX sai spec**: Giao diện khác UI Specification
   - Ví dụ: model_code field có thể edit trong Edit mode → BUG

### 6.2 Khi Nào Là CHANGE REQUEST

Issue được phân loại là **CR** khi:

1. **Yêu cầu mới**: Tính năng không có trong CR-MD-001
   - Ví dụ: "Thêm field 'year' vào VehicleModel" → CR mới (không có trong FRD)

2. **Thay đổi business logic**: Thay đổi quy trình nghiệp vụ
   - Ví dụ: "Cho phép Sales tạo VehicleModel" → CR (FRD quy định chỉ Admin)

3. **Mở rộng scope**: Tính năng ngoài phạm vi CR-MD-001
   - Ví dụ: "Thêm Accessory Master Data" → CR-MD-002 (scope khác)

4. **Cải tiến UX**: Đề xuất cải thiện trải nghiệm người dùng
   - Ví dụ: "Thêm bulk delete" → CR (không có trong FRD)

### 6.3 Quyền Quyết Định

**ANTIGRAVITY** là người duy nhất có quyền quyết định phân loại BUG vs CR.

**Quy trình**:
1. OpenCode phát hiện issue → Báo cáo cho Antigravity
2. Antigravity review issue vs FRD/ERD/UI/API Spec
3. Antigravity quyết định: BUG hoặc CR
4. Nếu BUG → Dev fix ngay, re-test
5. Nếu CR → Tạo CR mới, prioritize, schedule

---

## 7. UAT Execution Rules

### 7.1 Rules for OpenCode (UAT Executor)

1. **Chỉ test theo UAT Spec này**
   - ❌ KHÔNG tự mở rộng test case
   - ❌ KHÔNG test logic đã cover bởi Unit Test
   - ✅ CHỈ test các scenarios được định nghĩa trong Section 4

2. **Không tự sửa code**
   - ❌ KHÔNG sửa code khi phát hiện bug
   - ✅ Báo cáo bug cho Antigravity
   - ✅ Chờ Dev fix, sau đó re-test

3. **Follow test steps chính xác**
   - ✅ Thực hiện đúng thứ tự steps
   - ✅ Verify cả UI và DB (theo Expected Result)
   - ✅ Screenshot khi FAIL

4. **Report đầy đủ**
   - ✅ Mỗi scenario: PASS / FAIL
   - ✅ Nếu FAIL: Screenshot + DB query result + Error message
   - ✅ Tổng hợp: X/Y scenarios PASS

5. **Không skip scenarios**
   - ✅ Test TẤT CẢ scenarios (CRITICAL, HIGH, MEDIUM)
   - ❌ KHÔNG skip vì "tương tự scenario khác"

### 7.2 Rules for Antigravity (UAT Authority)

1. **Review UAT Report**
   - Review OpenCode UAT Report
   - Verify screenshots và DB evidence
   - Quyết định PASS / FAIL

2. **Classify Issues**
   - Phân loại BUG vs CR
   - Assign severity (CRITICAL, HIGH, MEDIUM, LOW)
   - Decide: Fix now vs Fix later vs Reject

3. **Approve UAT**
   - Nếu Exit Criteria thỏa mãn → APPROVE
   - Nếu có CRITICAL bug → REJECT, yêu cầu fix

---

## 8. Traceability Matrix

| CR ID | BRD Section | FR-ID | Scenario ID | Screen | API Endpoint | Status |
|-------|-------------|-------|-------------|--------|--------------|--------|
| CR-MD-001 | BR-MD-001 | FR-MD-001-01 | UAT-CR-MD-001-MD-001 | /master/vehicle-models | POST /api/vehicle-models | ✅ Defined |
| CR-MD-001 | BR-MD-001 | FR-MD-001-01 | UAT-CR-MD-001-MD-002 | /master/vehicle-models | POST /api/vehicle-models | ✅ Defined |
| CR-MD-001 | BR-MD-001 | FR-MD-001-03 | UAT-CR-MD-001-MD-003 | /master/vehicle-models | PATCH /api/vehicle-models/[id] | ✅ Defined |
| CR-MD-001 | BR-MD-001 | FR-MD-001-04 | UAT-CR-MD-001-MD-004 | /master/vehicle-models | DELETE /api/vehicle-models/[id] | ✅ Defined |
| CR-MD-001 | BR-MD-001 | FR-MD-001-05 | UAT-CR-MD-001-MD-005 | /master/vehicle-models | GET /api/vehicle-models?search= | ✅ Defined |
| CR-MD-001 | BR-MD-001 | FR-MD-001-02 | UAT-CR-MD-001-CRM-001 | /crm/leads | GET /api/vehicle-models | ✅ Defined |
| CR-MD-001 | BR-MD-001 | FR-MD-001-02 | UAT-CR-MD-001-SALES-001 | /sales/quotations | GET /api/vehicle-models | ✅ Defined |
| CR-MD-001 | BR-MD-001 | FR-MD-001-09 | UAT-CR-MD-001-ADMIN-001 | - | - | ✅ Defined |

**Coverage**: 8 scenarios cover 9 FRs (FR-MD-001-01 to FR-MD-001-09)

**Missing Coverage**:
- FR-MD-001-06 (Filter): Covered partially in MD-005 (Search)
- FR-MD-001-07 (Import Excel): Not covered (can be added if needed)
- FR-MD-001-08 (Export Excel): Not covered (can be added if needed)

**Rationale**: Import/Export are utility features, not critical business flow. Can be tested manually or added as MEDIUM priority scenarios if needed.

---

## 9. Approval Section

### 9.1 Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Prepared by** | Antigravity - UAT Authority & Design Authority | [Digital Signature] | 31/01/2026 |
| **Reviewed by** | Antigravity - UAT Authority | [Digital Signature] | 31/01/2026 |
| **Approved by** | Antigravity - UAT Authority | [Digital Signature] | 31/01/2026 |

### 9.2 Approval Status

- **Status**: ✅ APPROVED
- **Approval Date**: 31/01/2026
- **Valid Until**: Implementation & UAT completion
- **Next Review**: After UAT execution

### 9.3 Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 31/01/2026 | Antigravity | Initial UAT Specification for CR-MD-001 |

---

## 📝 Notes for OpenCode (UAT Executor)

### Before Starting UAT

1. ✅ Verify ALL Entry Criteria (Section 2.1)
2. ✅ Prepare test environment (Section 5.1)
3. ✅ Load test data (Section 5.2)
4. ✅ Prepare test users (Section 5.3)

### During UAT Execution

1. ✅ Follow scenarios EXACTLY as written (Section 4)
2. ✅ Verify BOTH UI and DB for each step
3. ✅ Take screenshots for FAIL cases
4. ✅ Do NOT skip scenarios
5. ✅ Do NOT modify code

### After UAT Execution

1. ✅ Create UAT Report: `docs/implementation/testing/uat_report_CR_MD_001_v1.0.md`
2. ✅ Include: Summary, Scenario Results (PASS/FAIL), Screenshots, DB Evidence
3. ✅ Submit to Antigravity for review
4. ✅ Wait for Antigravity decision (APPROVE / REJECT)

---

**End of UAT Specification**

**Status**: ✅ APPROVED - Ready for UAT Execution after Implementation & UT PASS
