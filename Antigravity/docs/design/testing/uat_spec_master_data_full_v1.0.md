# UAT Specification: Master Data Management Module (Full)

## Document Information
- **CR IDs**: CR-MD-001, CR-MD-002, CR-MD-003, CR-MD-004
- **Module**: Master Data Management
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

Xác nhận rằng **toàn bộ Master Data Management Module** (4 CRs) đã được implement đúng theo Business Requirements và Functional Requirements, đảm bảo:

1. **Business Flow**: Admin có thể quản lý 6 Master Data entities (CRUD) đúng nghiệp vụ
2. **Data Integrity**: Dữ liệu nhất quán, không duplicate, soft delete hoạt động đúng
3. **Integration**: CRM, Sales, Service modules sử dụng Master Data dropdowns chính xác
4. **End-to-End**: Từ Admin tạo master data → Modules khác sử dụng → Analytics chính xác

### 1.2 Phạm Vi UAT

#### ✅ In Scope

**Master Data Entities** (6 entities):
- ✅ VehicleModel (CR-MD-001)
- ✅ Accessory (CR-MD-002)
- ✅ ServiceCatalog (CR-MD-003)
- ✅ ServiceBay (CR-MD-004)
- ✅ ScoringRule (CR-MD-004)
- ✅ SystemSetting (CR-MD-004)

**Operations**:
- ✅ CRUD (Create, Read, Update, Delete soft)
- ✅ Search & Filter
- ✅ Import/Export Excel (where applicable)
- ✅ Audit Trail
- ✅ Special features (Compatibility Matrix, Service Package Builder, Pricing Calculator, etc.)

**Integration Points**:
- ✅ CRM: Lead.model_interest, Lead scoring
- ✅ Sales: Quotation.vehicle_model_id, Quotation.accessories
- ✅ Service: RepairOrder.services, BayAssignment.bay_id
- ✅ Admin: System settings management

#### ❌ Out of Scope

- ❌ Unit Test logic (đã cover bởi UT)
- ❌ API performance testing
- ❌ Security penetration testing
- ❌ Data migration (CR-INT-002)
- ❌ Other modules (Insurance, Parts, Accounting)

### 1.3 UAT Type

**PARTIAL REGRESSION**

**Lý do**:
- 4 CRs là **NEW features** (Master Data module mới)
- Có **integration impact** với 3 modules (CRM, Sales, Service)
- Cần test:
  * NEW: Master Data CRUD cho 6 entities
  * REGRESSION: CRM Lead form, Sales Quotation form, Service RepairOrder form

**Không phải FULL REGRESSION** vì:
- Không ảnh hưởng Insurance, Parts, Accounting modules
- Database schema không thay đổi (một số tables đã tồn tại)
- API backward compatible (24 endpoints mới, không breaking)

### 1.4 Liên Kết CR-IDs

**CR Documents**:
- CR-MD-001: `docs/design/change_requests/CR_MD_001_vehicle_model_master_v1.0.md`
- CR-MD-002: `docs/design/change_requests/CR_MD_002_accessory_master_v1.0.md`
- CR-MD-003: `docs/design/change_requests/CR_MD_003_service_catalog_master_v1.0.md`
- CR-MD-004: `docs/design/change_requests/CR_MD_004_other_masters_v1.0.md`

**Design Documents**:
- BRD: `docs/requirements/BRD/brd_honda_dms_v2.2.md` (Section 5.1)
- FRD: `docs/requirements/FRD/frd_master_data_v1.1.md`
- ERD: `docs/design/database/erd/erd_master_data_v1.1.md`
- UI Spec: `docs/design/ui/ui_spec_master_data_v1.1.md`
- API Spec: `docs/design/api/api_spec_master_data_v1.1.md`

---

## 2. UAT Entry/Exit Criteria

### 2.1 Entry Criteria

UAT chỉ được bắt đầu khi **TẤT CẢ** các điều kiện sau được thỏa mãn:

| # | Criteria | Status | Verified By |
|---|----------|--------|-------------|
| 1 | All 4 CRs implemented hoàn chỉnh | ⏳ Pending | Dev Team |
| 2 | Unit Test (UT) 100% PASS | ⏳ Pending | Dev Team |
| 3 | Database migration completed | ⏳ Pending | Dev Team |
| 4 | UI deployed to UAT environment | ⏳ Pending | DevOps |
| 5 | API deployed to UAT environment | ⏳ Pending | DevOps |
| 6 | Test data prepared (all entities) | ⏳ Pending | QA Team |
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

| Module | Entity | Screen | API Endpoint | CR ID | Priority |
|--------|--------|--------|--------------|-------|----------|
| **Master Data** | VehicleModel | /master/vehicle-models | GET/POST/PATCH/DELETE /api/vehicle-models | CR-MD-001 | CRITICAL |
| **Master Data** | Accessory | /master/accessories | GET/POST/PATCH/DELETE /api/accessories | CR-MD-002 | CRITICAL |
| **Master Data** | Accessory | /master/accessories | GET/POST /api/accessories/compatibility-matrix | CR-MD-002 | CRITICAL |
| **Master Data** | ServiceCatalog | /master/services | GET/POST/PATCH/DELETE /api/services-catalog | CR-MD-003 | CRITICAL |
| **Master Data** | ServiceCatalog | /master/services | POST /api/service-packages | CR-MD-003 | CRITICAL |
| **Master Data** | ServiceBay | /master/service-bays | GET/POST/PATCH/DELETE /api/service-bays | CR-MD-004 | HIGH |
| **Master Data** | ScoringRule | /crm/scoring-rules | GET/POST/PATCH/DELETE /api/crm/scoring-rules | CR-MD-004 | HIGH |
| **Master Data** | SystemSetting | /admin/system-settings | GET/POST/PATCH /api/system-settings | CR-MD-004 | HIGH |
| **CRM** | Lead | /crm/leads (form) | GET /api/vehicle-models | CR-MD-001 | HIGH |
| **CRM** | Lead | /crm/leads (scoring) | POST /api/crm/scoring-rules/test | CR-MD-004 | HIGH |
| **Sales** | Quotation | /sales/quotations (form) | GET /api/vehicle-models, /api/accessories | CR-MD-001/002 | HIGH |
| **Service** | RepairOrder | /service/repair-orders (form) | GET /api/services-catalog | CR-MD-003 | HIGH |
| **Service** | BayAssignment | /service/bay-assignments | GET /api/service-bays | CR-MD-004 | MEDIUM |
| **Admin** | activity_logs | - | - | All CRs | MEDIUM |

**Tổng**: 14 scope items (5 CRITICAL, 6 HIGH, 3 MEDIUM)

---

## 4. UAT Scenarios Definition

### 4.1 Scenario Naming Convention

`UAT-MD-[Entity]-[Number]`

Ví dụ: 
- `UAT-MD-VM-001` (VehicleModel scenario 1)
- `UAT-MD-ACC-001` (Accessory scenario 1)
- `UAT-MD-SVC-001` (ServiceCatalog scenario 1)

---

### 4.2 CRITICAL Scenarios (Must PASS 100%)

---

#### UAT-MD-VM-001: VehicleModel - Create Happy Path

**Mapped FR-ID**: FR-MD-001-01  
**CR ID**: CR-MD-001  
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
| 7 | Click "Save" button | Dialog closes, success message appears | Record inserted into VehicleModel table |
| 8 | Verify table | New row appears with correct data | - |
| 9 | Query database | - | `SELECT * FROM VehicleModel WHERE model_name = 'Honda City RS 2026'` returns 1 row |

**Pass Criteria**:
- ✅ model_code auto-generated with correct format
- ✅ Success message displayed
- ✅ New row appears in table
- ✅ Database record created
- ✅ Audit log entry created

---

#### UAT-MD-VM-002: VehicleModel - Soft Delete

**Mapped FR-ID**: FR-MD-001-04  
**CR ID**: CR-MD-001  
**Priority**: CRITICAL  
**Test Type**: Data Integrity & Soft Delete

**Preconditions**:
- User logged in as Admin
- Database has model: "Honda City RS", status = ACTIVE

**Test Steps**:

| Step | Action | Expected Result (UI) | Expected Result (DB) |
|------|--------|----------------------|----------------------|
| 1 | Navigate to `/master/vehicle-models` | Table shows "Honda City RS" with ACTIVE status | - |
| 2 | Click Delete icon (🗑) on row | Confirmation dialog appears | - |
| 3 | Click "Deactivate" button | Dialog closes, success message | status = INACTIVE, deleted_at = NOW() |
| 4 | Verify table (filter = ACTIVE) | Row disappears from table | - |
| 5 | Change filter to "INACTIVE" | Row appears with INACTIVE badge | - |
| 6 | Query database | - | Record still exists (soft delete) |

**Pass Criteria**:
- ✅ Soft delete performed (status = INACTIVE, deleted_at set)
- ✅ Record NOT hard deleted
- ✅ Row disappears from ACTIVE filter
- ✅ Row appears in INACTIVE filter

---

#### UAT-MD-ACC-001: Accessory - Create with Compatibility Matrix

**Mapped FR-ID**: FR-MD-002-01, FR-MD-002-07  
**CR ID**: CR-MD-002  
**Priority**: CRITICAL  
**Test Type**: End-to-End Business Flow

**Preconditions**:
- User logged in as Admin
- Database has 3 VehicleModels: "Honda City RS", "Honda CR-V L", "Honda Civic RS"

**Test Steps**:

| Step | Action | Expected Result (UI) | Expected Result (DB) |
|------|--------|----------------------|----------------------|
| 1 | Navigate to `/master/accessories` | Page loads, shows Accessory table | - |
| 2 | Click "+ New" button | Create Accessory dialog opens | - |
| 3 | Observe `accessory_code` field | Field is read-only, shows auto-generated code (e.g., ACC-001) | - |
| 4 | Enter `accessory_name`: "Body Kit - Modulo" | Text appears | - |
| 5 | Select `category`: "EXTERIOR" | Dropdown shows "EXTERIOR" selected | - |
| 6 | Enter `price`: "15000000" | Field shows "15,000,000₫" | - |
| 7 | Click "Set Compatibility" button | Compatibility Matrix dialog opens | - |
| 8 | Observe matrix | Checkbox grid shows 3 models (City RS, CR-V L, Civic RS) | - |
| 9 | Check "Honda City RS" and "Honda Civic RS" | 2 checkboxes checked | - |
| 10 | Click "Save" in matrix dialog | Matrix dialog closes, shows "2 models" in main form | - |
| 11 | Click "Save" in main dialog | Success message, dialog closes | Accessory record + 2 compatibility records inserted |
| 12 | Query database | - | `SELECT * FROM accessory_model_compatibility WHERE accessory_id = [new ID]` returns 2 rows |

**Pass Criteria**:
- ✅ accessory_code auto-generated
- ✅ Compatibility Matrix dialog works
- ✅ Multiple models can be selected
- ✅ Accessory record created
- ✅ Compatibility records created (2 rows)

---

#### UAT-MD-ACC-002: Accessory - Pricing History Tracking

**Mapped FR-ID**: FR-MD-002-08  
**CR ID**: CR-MD-002  
**Priority**: CRITICAL  
**Test Type**: Data Integrity & Audit

**Preconditions**:
- User logged in as Admin (user_id = 123)
- Database has Accessory: "Body Kit - Modulo", price = 15000000

**Test Steps**:

| Step | Action | Expected Result (UI) | Expected Result (DB) |
|------|--------|----------------------|----------------------|
| 1 | Navigate to `/master/accessories` | Table shows "Body Kit - Modulo" | - |
| 2 | Click Edit icon on row | Edit dialog opens | - |
| 3 | Change `price` from "15,000,000₫" to "16,000,000₫" | Field updates | - |
| 4 | Click "Save" | Success message | Accessory.price updated, price_history record inserted |
| 5 | Click "View History" icon on row | Pricing History timeline dialog opens | - |
| 6 | Observe timeline | Shows 1 entry: "15,000,000₫ → 16,000,000₫" with timestamp and user | - |
| 7 | Query database | - | `SELECT * FROM accessory_price_history WHERE accessory_id = [ID]` returns 1 row: old_price=15000000, new_price=16000000, changed_by=123 |

**Pass Criteria**:
- ✅ Price update successful
- ✅ Price history record created
- ✅ Timeline shows correct data
- ✅ changed_by = current user

---

#### UAT-MD-SVC-001: ServiceCatalog - Create with Pricing Calculator

**Mapped FR-ID**: FR-MD-003-01, FR-MD-003-08  
**CR ID**: CR-MD-003  
**Priority**: CRITICAL  
**Test Type**: End-to-End Business Flow

**Preconditions**:
- User logged in as Admin

**Test Steps**:

| Step | Action | Expected Result (UI) | Expected Result (DB) |
|------|--------|----------------------|----------------------|
| 1 | Navigate to `/master/services` | Page loads, shows ServiceCatalog table | - |
| 2 | Click "+ New" button | Create ServiceCatalog dialog opens | - |
| 3 | Observe `service_code` field | Field is read-only, shows auto-generated code (e.g., SVC-001) | - |
| 4 | Enter `service_name`: "Oil Change - Standard" | Text appears | - |
| 5 | Select `category`: "MAINTENANCE" | Dropdown shows "MAINTENANCE" selected | - |
| 6 | Enter `labor_hours`: "1.5" | Field shows "1.5" | - |
| 7 | Enter `labor_rate`: "200000" | Field shows "200,000₫" | - |
| 8 | Observe "Estimated Cost" field | Field auto-calculates: "300,000₫" (1.5 × 200,000) | - |
| 9 | Click "Add Parts" button | Parts selection dialog opens | - |
| 10 | Add part: "Engine Oil - 4L", price: "500,000₫" | Part added to list | - |
| 11 | Observe "Total Cost" field | Field updates: "800,000₫" (300,000 labor + 500,000 parts) | - |
| 12 | Click "Save" | Success message | ServiceCatalog record inserted with parts_required JSON |
| 13 | Query database | - | `SELECT * FROM ServiceCatalog WHERE service_name = 'Oil Change - Standard'` returns 1 row, parts_required contains part data |

**Pass Criteria**:
- ✅ service_code auto-generated
- ✅ Pricing Calculator auto-calculates labor cost
- ✅ Parts can be added
- ✅ Total cost auto-updates
- ✅ ServiceCatalog record created with parts JSON

---

#### UAT-MD-SVC-002: ServiceCatalog - Service Package Builder

**Mapped FR-ID**: FR-MD-003-07  
**CR ID**: CR-MD-003  
**Priority**: CRITICAL  
**Test Type**: Business Flow

**Preconditions**:
- Database has 3 services: "Oil Change" (300k), "Tire Rotation" (200k), "Brake Inspection" (400k)

**Test Steps**:

| Step | Action | Expected Result (UI) | Expected Result (DB) |
|------|--------|----------------------|----------------------|
| 1 | Navigate to `/master/services` | Table shows 3 services | - |
| 2 | Click "Create Package" button | Service Package Builder dialog opens | - |
| 3 | Enter `package_name`: "Basic Maintenance Package" | Text appears | - |
| 4 | Select services: Check "Oil Change", "Tire Rotation", "Brake Inspection" | 3 checkboxes checked | - |
| 5 | Observe "Subtotal" | Shows "900,000₫" (300k + 200k + 400k) | - |
| 6 | Enter `discount_percentage`: "10" | Field shows "10%" | - |
| 7 | Observe "Total Price" | Shows "810,000₫" (900k - 10%) | - |
| 8 | Click "Save" | Success message | service_packages record + 3 service_package_items records inserted |
| 9 | Query database | - | `SELECT * FROM service_packages WHERE package_name = 'Basic Maintenance Package'` returns 1 row, total_price = 810000 |
| 10 | Query package items | - | `SELECT * FROM service_package_items WHERE package_id = [new ID]` returns 3 rows |

**Pass Criteria**:
- ✅ Multiple services can be selected
- ✅ Subtotal auto-calculates
- ✅ Discount applies correctly
- ✅ Total price correct
- ✅ Package record created
- ✅ Package items created (3 rows)

---

### 4.3 HIGH Priority Scenarios

---

#### UAT-MD-SB-001: ServiceBay - CRUD Operations

**Mapped FR-ID**: FR-MD-004-01  
**CR ID**: CR-MD-004  
**Priority**: HIGH  
**Test Type**: CRUD Operations

**Preconditions**:
- User logged in as Admin

**Test Steps**:

| Step | Action | Expected Result (UI) | Expected Result (DB) |
|------|--------|----------------------|----------------------|
| 1 | Navigate to `/master/service-bays` | Page loads, shows ServiceBay table | - |
| 2 | Click "+ New" button | Create ServiceBay dialog opens | - |
| 3 | Enter `bay_name`: "Bay 1" | Text appears | - |
| 4 | Enter `capacity`: "2" | Field shows "2" | - |
| 5 | Click "Configure Equipment" | Equipment config dialog opens | - |
| 6 | Add equipment: "Lift", "Air Compressor" | 2 items added | - |
| 7 | Click "Save" | Success message | ServiceBay record inserted with equipment JSON |
| 8 | Verify table | New row shows "Bay 1", capacity "2", equipment "2 items" | - |

**Pass Criteria**:
- ✅ ServiceBay created
- ✅ Equipment stored as JSON
- ✅ Table displays correctly

---

#### UAT-MD-SR-001: ScoringRule - Visual Rule Builder & Test Simulator

**Mapped FR-ID**: FR-MD-004-05, FR-MD-004-06  
**CR ID**: CR-MD-004  
**Priority**: HIGH  
**Test Type**: Business Flow

**Preconditions**:
- User logged in as Admin

**Test Steps**:

| Step | Action | Expected Result (UI) | Expected Result (DB) |
|------|--------|----------------------|----------------------|
| 1 | Navigate to `/crm/scoring-rules` | Page loads, shows ScoringRule table | - |
| 2 | Click "+ New" button | Visual Rule Builder dialog opens | - |
| 3 | Enter `rule_name`: "Hot Lead Rule" | Text appears | - |
| 4 | Observe Monaco editor | JSON editor shows template | - |
| 5 | Edit rule JSON: `{"budget": {">": 500000000, "points": 30}}` | JSON updates | - |
| 6 | Click "Test Rule" button | Test Simulator dialog opens | - |
| 7 | Enter test data: `{"budget": 600000000}` | Test data entered | - |
| 8 | Click "Run Test" | Result shows: "Score: 30, Grade: HOT" | - |
| 9 | Click "Save Rule" | Success message | ScoringRule record inserted with rule_json |
| 10 | Query database | - | `SELECT * FROM ScoringRule WHERE rule_name = 'Hot Lead Rule'` returns 1 row, rule_json valid |

**Pass Criteria**:
- ✅ Visual Rule Builder works
- ✅ JSON validation works
- ✅ Test Simulator calculates score correctly
- ✅ Rule saved with valid JSON

---

#### UAT-MD-SS-001: SystemSetting - Type-safe Editing

**Mapped FR-ID**: FR-MD-004-08  
**CR ID**: CR-MD-004  
**Priority**: HIGH  
**Test Type**: Data Validation

**Preconditions**:
- User logged in as Admin
- Database has setting: "max_quotation_discount_percent", data_type = "number", value = "10"

**Test Steps**:

| Step | Action | Expected Result (UI) | Expected Result (DB) |
|------|--------|----------------------|----------------------|
| 1 | Navigate to `/admin/system-settings` | Page loads, shows SystemSetting table grouped by category | - |
| 2 | Click "General" tab | Shows general settings | - |
| 3 | Find "max_quotation_discount_percent" row | Shows current value "10" with number input | - |
| 4 | Click Edit icon | Inline editor appears (number input) | - |
| 5 | Try to enter "abc" (invalid) | Error message: "Must be a number" | - |
| 6 | Enter "15" (valid) | Field accepts | - |
| 7 | Click "Save" | Success message | SystemSetting.value updated to "15" |
| 8 | Verify type enforcement | - | value stored as string "15" but validated as number |

**Pass Criteria**:
- ✅ Type-safe editor shown (number input for number type)
- ✅ Invalid input rejected
- ✅ Valid input accepted
- ✅ Value updated correctly

---

#### UAT-MD-INT-001: CRM Lead - VehicleModel Dropdown Integration

**Mapped FR-ID**: FR-MD-001-02  
**CR ID**: CR-MD-001  
**Priority**: HIGH  
**Test Type**: Integration Test

**Preconditions**:
- Database has 3 ACTIVE models: "Honda City RS", "Honda CR-V L", "Honda Civic RS"
- Database has 1 INACTIVE model: "Honda Accord"

**Test Steps**:

| Step | Action | Expected Result (UI) | Expected Result (DB) |
|------|--------|----------------------|----------------------|
| 1 | Navigate to `/crm/leads`, click "+ New Lead" | Lead form opens | - |
| 2 | Click `model_interest` dropdown | Dropdown shows 3 options (ACTIVE only) | - |
| 3 | Verify INACTIVE model NOT shown | "Honda Accord" does NOT appear | - |
| 4 | Select "Honda City RS" | Dropdown shows selected | - |
| 5 | Fill other fields, click "Save" | Lead created | Lead.model_interest = 'Honda City RS' |

**Pass Criteria**:
- ✅ Dropdown populated from VehicleModel table
- ✅ Only ACTIVE models shown
- ✅ INACTIVE models NOT shown
- ✅ Lead saved correctly

---

#### UAT-MD-INT-002: Sales Quotation - Auto-fill Base Price & Accessories

**Mapped FR-ID**: FR-MD-001-02, FR-MD-002-02  
**CR ID**: CR-MD-001, CR-MD-002  
**Priority**: HIGH  
**Test Type**: Integration Test

**Preconditions**:
- Database has model: "Honda City RS", base_price = 559000000
- Database has accessory: "Body Kit - Modulo", price = 15000000, compatible with "Honda City RS"

**Test Steps**:

| Step | Action | Expected Result (UI) | Expected Result (DB) |
|------|--------|----------------------|----------------------|
| 1 | Navigate to `/sales/quotations`, click "+ New" | Quotation form opens | - |
| 2 | Select `vehicle_model_id`: "Honda City RS" | Dropdown shows selected | - |
| 3 | Observe `base_price` field | Field auto-fills with "559,000,000₫" | - |
| 4 | Click "Add Accessories" button | Accessories selection dialog opens | - |
| 5 | Observe accessories list | Shows only compatible accessories: "Body Kit - Modulo - 15,000,000₫" | - |
| 6 | Select "Body Kit - Modulo" | Checkbox checked | - |
| 7 | Observe "Total Price" | Shows "574,000,000₫" (559M + 15M) | - |
| 8 | Click "Save" | Quotation created | Quotation.vehicle_model_id, base_price, accessories saved |

**Pass Criteria**:
- ✅ base_price auto-fills
- ✅ Accessories filtered by compatibility
- ✅ Total price auto-calculates
- ✅ Quotation saved correctly

---

#### UAT-MD-INT-003: Service RepairOrder - ServiceCatalog Dropdown & Cost Calculation

**Mapped FR-ID**: FR-MD-003-02, FR-MD-003-08  
**CR ID**: CR-MD-003  
**Priority**: HIGH  
**Test Type**: Integration Test

**Preconditions**:
- Database has service: "Oil Change - Standard", labor_hours = 1.5, labor_rate = 200000, parts_required = [{"name": "Engine Oil", "price": 500000}]

**Test Steps**:

| Step | Action | Expected Result (UI) | Expected Result (DB) |
|------|--------|----------------------|----------------------|
| 1 | Navigate to `/service/repair-orders`, click "+ New" | RepairOrder form opens | - |
| 2 | Click "Add Service" button | Service selection dialog opens | - |
| 3 | Select "Oil Change - Standard" | Service added to list | - |
| 4 | Observe service row | Shows: "Oil Change - Standard", labor "300,000₫", parts "500,000₫", total "800,000₫" | - |
| 5 | Observe "Total Cost" field | Shows "800,000₫" | - |
| 6 | Click "Save" | RepairOrder created | RepairOrder.services contains service data |

**Pass Criteria**:
- ✅ ServiceCatalog dropdown works
- ✅ Labor cost auto-calculated
- ✅ Parts cost shown
- ✅ Total cost correct
- ✅ RepairOrder saved

---

### 4.4 MEDIUM Priority Scenarios

---

#### UAT-MD-SEARCH-001: Search & Filter - All Entities

**Mapped FR-ID**: FR-MD-001-05, FR-MD-002-05, FR-MD-003-05  
**CR ID**: All CRs  
**Priority**: MEDIUM  
**Test Type**: Functional Test

**Preconditions**:
- Database has multiple records for each entity

**Test Steps**:

| Step | Action | Expected Result (UI) |
|------|--------|----------------------|
| 1 | Navigate to `/master/vehicle-models` | Table shows all models |
| 2 | Type "city" in search box | After 300ms, table filters to show matching models |
| 3 | Clear search | Table shows all models again |
| 4 | Repeat for `/master/accessories` | Search works |
| 5 | Repeat for `/master/services` | Search works |

**Pass Criteria**:
- ✅ Search is case-insensitive
- ✅ Partial match works
- ✅ Debounce 300ms applied
- ✅ Clear search resets table

---

#### UAT-MD-AUDIT-001: Audit Trail - All Operations

**Mapped FR-ID**: FR-MD-001-09, FR-MD-002-09, FR-MD-003-10  
**CR ID**: All CRs  
**Priority**: MEDIUM  
**Test Type**: Audit & Compliance

**Preconditions**:
- User logged in as Admin (user_id = 123)

**Test Steps**:

| Step | Action | Expected Result (DB) |
|------|--------|----------------------|
| 1 | Create new VehicleModel | activity_logs entry: action='CREATE', entity='VehicleModel' |
| 2 | Update Accessory price | activity_logs entry: action='UPDATE', entity='Accessory' |
| 3 | Delete ServiceCatalog | activity_logs entry: action='DELETE', entity='ServiceCatalog' |
| 4 | Query logs | All 3 entries exist with correct user_id, entity_id, details JSON |

**Pass Criteria**:
- ✅ Audit log entries created for all operations
- ✅ All required fields populated
- ✅ details JSON contains old_value/new_value

---

#### UAT-MD-MENU-001: Menu Navigation - All Screens Accessible

**Mapped FR-ID**: UI-001  
**CR ID**: All CRs  
**Priority**: MEDIUM  
**Test Type**: UI Navigation

**Preconditions**:
- User logged in as Admin

**Test Steps**:

| Step | Action | Expected Result (UI) |
|------|--------|----------------------|
| 1 | Observe sidebar | "Master Data" menu group visible |
| 2 | Click "Master Data" | Submenu expands |
| 3 | Verify submenu items | Shows: Vehicle Models, Accessories (NEW), Service Catalog (NEW), Service Bays (NEW) |
| 4 | Click "Accessories" | Navigates to `/master/accessories` |
| 5 | Observe breadcrumb | Shows: Home > Master Data > Accessories |
| 6 | Click "CRM" menu | Submenu expands |
| 7 | Verify "Scoring Rules" item | Shows with "NEW" badge |
| 8 | Click "Admin" menu | Submenu expands |
| 9 | Verify "System Settings" item | Shows with "NEW" badge |

**Pass Criteria**:
- ✅ Master Data menu group exists
- ✅ All 6 screens accessible
- ✅ NEW badges shown
- ✅ Breadcrumbs correct

---

## 5. Data & Environment

### 5.1 Test Environment

- **Environment**: UAT Server
- **URL**: `https://uat.honda-spice-erp.com`
- **Database**: `honda_spice_erp_uat`
- **API Base URL**: `https://uat-api.honda-spice-erp.com`

### 5.2 Test Data Assumptions

**Pre-populated Data** (for testing):

**VehicleModels**:
```sql
INSERT INTO VehicleModel (model_code, model_name, category, base_price, status) VALUES
('MOD/2026/001', 'Honda City RS', 'SEDAN', 559000000.00, 'ACTIVE'),
('MOD/2026/002', 'Honda CR-V L', 'SUV', 1029000000.00, 'ACTIVE'),
('MOD/2026/003', 'Honda Civic RS', 'SEDAN', 799000000.00, 'ACTIVE'),
('MOD/2026/004', 'Honda Accord', 'SEDAN', 1319000000.00, 'INACTIVE');
```

**Accessories**:
```sql
INSERT INTO Accessory (accessory_code, accessory_name, category, price, status) VALUES
('ACC-001', 'Body Kit - Modulo', 'EXTERIOR', 15000000.00, 'ACTIVE'),
('ACC-002', 'Leather Seat Cover', 'INTERIOR', 8000000.00, 'ACTIVE'),
('ACC-003', 'Dash Cam - 4K', 'TECH', 5000000.00, 'ACTIVE');
```

**ServiceCatalog**:
```sql
INSERT INTO ServiceCatalog (service_code, service_name, category, labor_hours, labor_rate, status) VALUES
('SVC-001', 'Oil Change - Standard', 'MAINTENANCE', 1.5, 200000.00, 'ACTIVE'),
('SVC-002', 'Tire Rotation', 'MAINTENANCE', 1.0, 200000.00, 'ACTIVE'),
('SVC-003', 'Brake Inspection', 'INSPECTION', 2.0, 200000.00, 'ACTIVE');
```

**Test Users**:

| Username | Password | Role | Permissions |
|----------|----------|------|-------------|
| admin_uat | [provided separately] | Admin | MASTER_DATA.* (all) |
| sales_uat | [provided separately] | Sales | MASTER_DATA.READ |
| service_uat | [provided separately] | Service Advisor | MASTER_DATA.READ |

---

## 6. Bug vs CR Classification Rule

### 6.1 Khi Nào Là BUG

Issue được phân loại là **BUG** khi:

1. **Không đúng FRD**: Hành vi khác với Functional Requirements Document
2. **Validation sai**: Validation rule không đúng theo VR-MD-001 đến VR-MD-020
3. **Data integrity lỗi**: Dữ liệu không nhất quán
4. **Integration lỗi**: Dropdown không hoạt động đúng
5. **UI/UX sai spec**: Giao diện khác UI Specification

### 6.2 Khi Nào Là CHANGE REQUEST

Issue được phân loại là **CR** khi:

1. **Yêu cầu mới**: Tính năng không có trong 4 CRs
2. **Thay đổi business logic**: Thay đổi quy trình nghiệp vụ
3. **Mở rộng scope**: Tính năng ngoài phạm vi 4 CRs
4. **Cải tiến UX**: Đề xuất cải thiện trải nghiệm người dùng

### 6.3 Quyền Quyết Định

**ANTIGRAVITY** là người duy nhất có quyền quyết định phân loại BUG vs CR.

---

## 7. UAT Execution Rules

### 7.1 Rules for OpenCode (UAT Executor)

1. **Chỉ test theo UAT Spec này**
   - ❌ KHÔNG tự mở rộng test case
   - ✅ CHỈ test các scenarios được định nghĩa

2. **Không tự sửa code**
   - ❌ KHÔNG sửa code khi phát hiện bug
   - ✅ Báo cáo bug cho Antigravity

3. **Follow test steps chính xác**
   - ✅ Thực hiện đúng thứ tự steps
   - ✅ Verify cả UI và DB
   - ✅ Screenshot khi FAIL

4. **Report đầy đủ**
   - ✅ Mỗi scenario: PASS / FAIL
   - ✅ Nếu FAIL: Screenshot + DB query + Error message

5. **Không skip scenarios**
   - ✅ Test TẤT CẢ scenarios

---

## 8. Traceability Matrix

| CR ID | BRD Section | FR-ID | Scenario ID | Screen | API Endpoint | Priority |
|-------|-------------|-------|-------------|--------|--------------|----------|
| CR-MD-001 | BR-MD-001 | FR-MD-001-01 | UAT-MD-VM-001 | /master/vehicle-models | POST /api/vehicle-models | CRITICAL |
| CR-MD-001 | BR-MD-001 | FR-MD-001-04 | UAT-MD-VM-002 | /master/vehicle-models | DELETE /api/vehicle-models/[id] | CRITICAL |
| CR-MD-002 | BR-MD-002 | FR-MD-002-01 | UAT-MD-ACC-001 | /master/accessories | POST /api/accessories | CRITICAL |
| CR-MD-002 | BR-MD-002 | FR-MD-002-07 | UAT-MD-ACC-001 | /master/accessories | POST /api/accessories/compatibility-matrix | CRITICAL |
| CR-MD-002 | BR-MD-002 | FR-MD-002-08 | UAT-MD-ACC-002 | /master/accessories | GET /api/accessories/[id]/price-history | CRITICAL |
| CR-MD-003 | BR-MD-003 | FR-MD-003-01 | UAT-MD-SVC-001 | /master/services | POST /api/services-catalog | CRITICAL |
| CR-MD-003 | BR-MD-003 | FR-MD-003-08 | UAT-MD-SVC-001 | /master/services | - | CRITICAL |
| CR-MD-003 | BR-MD-003 | FR-MD-003-07 | UAT-MD-SVC-002 | /master/services | POST /api/service-packages | CRITICAL |
| CR-MD-004 | BR-MD-004 | FR-MD-004-01 | UAT-MD-SB-001 | /master/service-bays | POST /api/service-bays | HIGH |
| CR-MD-004 | BR-MD-004 | FR-MD-004-05 | UAT-MD-SR-001 | /crm/scoring-rules | POST /api/crm/scoring-rules | HIGH |
| CR-MD-004 | BR-MD-004 | FR-MD-004-06 | UAT-MD-SR-001 | /crm/scoring-rules | POST /api/crm/scoring-rules/test | HIGH |
| CR-MD-004 | BR-MD-004 | FR-MD-004-08 | UAT-MD-SS-001 | /admin/system-settings | PATCH /api/system-settings/[id] | HIGH |
| CR-MD-001 | BR-MD-001 | FR-MD-001-02 | UAT-MD-INT-001 | /crm/leads | GET /api/vehicle-models | HIGH |
| CR-MD-001/002 | BR-MD-001/002 | FR-MD-001-02, FR-MD-002-02 | UAT-MD-INT-002 | /sales/quotations | GET /api/vehicle-models, /api/accessories | HIGH |
| CR-MD-003 | BR-MD-003 | FR-MD-003-02 | UAT-MD-INT-003 | /service/repair-orders | GET /api/services-catalog | HIGH |
| All CRs | All BRs | FR-MD-*-05 | UAT-MD-SEARCH-001 | All screens | GET /api/* | MEDIUM |
| All CRs | All BRs | FR-MD-*-09 | UAT-MD-AUDIT-001 | - | - | MEDIUM |
| All CRs | - | UI-001 | UAT-MD-MENU-001 | All screens | - | MEDIUM |

**Total**: 18 scenarios covering 37 FRs across 4 CRs

**Coverage**:
- CR-MD-001: 3 scenarios (VehicleModel)
- CR-MD-002: 2 scenarios (Accessory)
- CR-MD-003: 2 scenarios (ServiceCatalog)
- CR-MD-004: 3 scenarios (ServiceBay, ScoringRule, SystemSetting)
- Integration: 3 scenarios (CRM, Sales, Service)
- Cross-cutting: 3 scenarios (Search, Audit, Menu)

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
| 1.0 | 31/01/2026 | Antigravity | Initial UAT Specification for Master Data Module (4 CRs) |

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

1. ✅ Create UAT Report: `docs/design/testing/uat_report_master_data_full_v1.0.md`
2. ✅ Include: Summary, Scenario Results (PASS/FAIL), Screenshots, DB Evidence
3. ✅ Submit to Antigravity for review
4. ✅ Wait for Antigravity decision (APPROVE / REJECT)

---

**End of UAT Specification**

**Status**: ✅ APPROVED - Ready for UAT Execution after Implementation & UT PASS

**Total Scenarios**: 18 (6 CRITICAL, 6 HIGH, 3 MEDIUM, 3 cross-cutting)  
**Total FRs Covered**: 37 across 4 CRs  
**Estimated UAT Time**: 12-16 hours
