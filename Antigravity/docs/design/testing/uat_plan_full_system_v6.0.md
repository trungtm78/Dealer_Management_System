# UAT Plan - Honda SPICE ERP System (Full System)

**Phiên Bản**: 6.0  
**Ngày Tạo**: 2026-02-04  
**Người Tạo**: Antigravity - System UAT Authority  
**Trạng Thái**: 🔄 DRAFT (Chờ phê duyệt)  
**Database Schema**: ERD v1.6 Consolidated (67 tables)

---

## 📋 MỤC LỤC

1. [Executive Summary](#1-executive-summary)
2. [Objectives](#2-objectives)
3. [Scope](#3-scope)
4. [Test Approach](#4-test-approach)
5. [Test Organization](#5-test-organization)
6. [Entry/Exit Criteria](#6-entryexit-criteria)
7. [Resources & Schedule](#7-resources--schedule)
8. [Risks & Mitigation](#8-risks--mitigation)
9. [References](#9-references)

---

## 1. Executive Summary

### 1.1 Purpose

Tài liệu này định nghĩa chiến lược **User Acceptance Testing (UAT)** toàn diện cho Honda SPICE ERP System. UAT v6.0 là lần kiểm thử chính thức đầu tiên trên nền tảng cơ sở dữ liệu ERD v1.6 Consolidated với **67 entities** phân bố trên **8 modules** chức năng.

### 1.2 Scope Overview

- **Total Entities**: 67 tables (ERD v1.6)
- **Modules Covered**: Admin, CRM, Sales, Service, Parts, Insurance, Accounting, Supporting/Master Data
- **Test Groups**: 8 nhóm chức năng (A-H)
- **Estimated Scenarios**: ~2,000 test cases
- **Execution Strategy**: Entity-based testing (không theo màn hình UI)

### 1.3 Key Changes from v5.0

| Aspect | v5.0 | v6.0 (This Plan) |
|--------|------|------------------|
| **ERD Version** | v1.2 (56 tables) | v1.6 (67 tables) |
| **Master Data** | Incomplete | Fully Implemented (Employee, Supplier, Warehouse, UOM) |
| **Parts Module** | Basic | Enhanced (Part Categories, Locations, Compatibility) |
| **Test Coverage** | Partial (~649 cases) | Complete (~2,000 cases) |
| **Pattern Coverage** | Manual | Pattern-Based + Sampling (FK Dropdown CR-20260203-009) |

---

## 2. Objectives

### 2.1 Primary Objectives

1. **Data Integrity Verification**
   - Xác nhận CRUD operations tuân thủ 100% ERD v1.6
   - Validate PK/FK/UNIQUE/NOT NULL/ENUM constraints
   - Verify soft delete vs hard delete behaviors
   - Confirm audit trail fields (`created_at`, `updated_at`, `deleted_at`)

2. **Business Logic Validation**
   - Verify state transitions (Lead, Quotation, RO, Invoice lifecycles)
   - Validate business rules (deposit percentage, discount limits, VAT calculations)
   - Confirm file upload/delete/persistence (PDS photos, work logs, attachments)

3. **Cross-Module Consistency**
   - Test 15 end-to-end flows (CRM → Sales → Accounting)
   - Verify data visibility across screens
   - Validate cascade/restrict FK behaviors

4. **Error Handling & UX**
   - Meaningful error messages for constraint violations
   - Graceful handling of invalid data
   - Consistent validation feedback

### 2.2 Success Criteria

- ✅ **100% Scenario Pass Rate**: Tất cả ~2,000 scenarios PASS
- ✅ **Zero Critical Bugs**: Không có BUG severity CRITICAL unresolved
- ✅ **100% Entity Coverage**: 67/67 entities có UAT scenarios
- ✅ **E2E Flow Coverage**: 15/15 flows validated
- ✅ **Sign-off**: Antigravity (UAT Authority) approval

---

## 3. Scope

### 3.1 In Scope

#### 3.1.1 Modules & Entities (67 Total)

**MODULE 1: ADMIN (7 entities)**
- `users`, `roles`, `permissions`, `role_permissions`, `system_settings`, `activity_logs`, `system_metrics`

**MODULE 2: CRM (8 entities)**
- `customers`, `leads`, `lead_histories`, `interactions`, `scoring_rules`, `reminders`, `loyalty_transactions`, `complaints`, `marketing_campaigns`

**MODULE 3: SALES (7 entities)**
- `quotations`, `test_drives`, `vins`, `contracts`, `deposits`, `pds_checklists`

**MODULE 4: SERVICE (10 entities)**
- `service_quotes`, `service_appointments`, `repair_orders`, `ro_line_items`, `work_logs`, `qc_checklists`, `service_bays`, `bay_assignments`, `bay_status_logs`

**MODULE 5: PARTS (12 entities)**
- `parts`, `suppliers`, `stock_movements`, `purchase_orders`, `po_line_items`, `stock_takes`, `stock_take_items`, `part_categories`, `part_locations`, `part_vehicle_compatibility`

**MODULE 6: INSURANCE (2 entities)**
- `insurance_contracts`, `insurance_claims`

**MODULE 7: ACCOUNTING (7 entities)**
- `invoices`, `payments`, `transactions`, `fixed_assets`, `depreciation_schedules`, `tax_declarations`

**MODULE 8: SUPPORTING/MASTER DATA (10+ entities)**
- `vehicle_models`, `accessories`, `services_catalog`, `employees`, `warehouses`, `uoms`, `accessory_model_compatibility`, `accessory_price_history`, `service_packages`, `service_package_items`

#### 3.1.2 Test Types

| Test Type | Description |
|-----------|-------------|
| **CRUD Operations** | Create, Read, Update, Delete cho tất cả 67 entities |
| **Constraint Validation** | PK/FK/UNIQUE/NOT NULL/ENUM/TYPE/LENGTH |
| **File Handling** | Upload/Delete/Persistence (PDS, Work Logs, Attachments) |
| **State Workflows** | Lead → Quotation → Contract, RO status transitions |
| **Cross-Module E2E** | 15 key business flows |
| **Error Handling** | Meaningful error messages, graceful failures |

### 3.2 Out of Scope

- ❌ **Performance Testing**: Load/stress testing (riêng biệt)
- ❌ **Security Penetration**: Security audit (riêng biệt)
- ❌ **Browser Compatibility**: Chỉ test trên Chrome (production browser)
- ❌ **Mobile Responsive**: Desktop only
- ❌ **API Testing**: Tập trung vào UI/UX + DB validation
- ❌ **Infrastructure**: Deployment, CI/CD, backup/restore

---

## 4. Test Approach

### 4.1 Entity-Based Testing Philosophy

> **CRITICAL RULE**: Test theo ENTITY (ERD), KHÔNG theo màn hình UI.

**Rationale**:
- 1 entity có thể xuất hiện trên nhiều màn hình (e.g., `customers` trong CRM + Sales + Service)
- 1 màn hình có thể thao tác nhiều entities (e.g., Quotation màn hình → `quotations`, `quotations.accessories`, `quotations.services`)
- Entity-based testing đảm bảo 100% data coverage

**Example**:
- ❌ **SAI**: "Test màn hình Customer List" (chỉ test READ)
- ✅ **ĐÚNG**: "Test entity `customers`: CREATE, READ, UPDATE, DELETE, Validation, E2E"

### 4.2 Test Groups (A-H)

#### GROUP A – CREATE & SAVE

**Purpose**: Verify record creation and data persistence.

| Scenario ID | Test Focus | Example |
|-------------|------------|---------|
| **A01** | Valid data → Success | Create customer với phone/email valid |
| **A02** | Invalid data → Reject + Error | Create customer với email invalid format |
| **A03** | PK duplicate → Reject | Create user với email đã tồn tại |
| **A04** | FK invalid → Reject | Create quotation với `customer_id` không tồn tại |
| **A05** | Required field null → Reject | Create part với `part_number` = NULL |
| **A06** | Data type mismatch → Reject | Create quotation với `base_price` = "abc" |
| **A07** | Length exceeded → Reject | Create user với email > 255 chars |
| **A08** | Enum invalid → Reject | Create lead với status = "INVALID_STATUS" |
| **A09** | Verify audit fields | Check `created_at`, `created_by` auto-populated |

#### GROUP B – READ & PERSIST

**Purpose**: Verify data retrieval and persistence after reload.

| Scenario ID | Test Focus | Example |
|-------------|------------|---------|
| **B01** | Read by PK → Correct | Đọc customer theo ID |
| **B02** | Read by filter → Correct | Filter leads by status = "QUALIFIED" |
| **B03** | Reload page (F5) → Data persists | Tạo quotation → F5 → vẫn hiển thị |
| **B04** | Query with JOIN → Related data correct | Quotation hiển thị đúng customer name |

#### GROUP C – UPDATE

**Purpose**: Verify record modification.

| Scenario ID | Test Focus | Example |
|-------------|------------|---------|
| **C01** | Valid data → Success | Update customer phone number |
| **C02** | Invalid data → Reject | Update customer email → invalid format |
| **C03** | Update PK → Reject (immutable) | Update user `id` (should fail) |
| **C04** | Update FK invalid → Reject | Update quotation `customer_id` → invalid ID |
| **C05** | Partial update → Only changed fields | Update chỉ `phone` → không thay đổi `email` |

#### GROUP D – DELETE

**Purpose**: Verify delete behaviors (soft/hard/cascade/restrict).

| Scenario ID | Test Focus | Example |
|-------------|------------|---------|
| **D01** | Soft delete → Flag set, data preserved | Delete customer → `deleted_at` set |
| **D02** | Hard delete no children → Success | Delete scoring_rule không có references |
| **D03** | Hard delete CASCADE → All deleted | Delete role → `role_permissions` cascade |
| **D04** | Hard delete RESTRICT → Reject | Delete customer có quotations → reject |
| **D05** | Delete record with file → File removed | Delete PDS checklist → photos deleted |

#### GROUP E – FILE & ATTACHMENT

**Purpose**: Verify file upload/delete/persistence.

| Scenario ID | Test Focus | Entities |
|-------------|------------|----------|
| **E01** | Upload valid → Success, correct path | PDS `photos`, Work Log `photos` |
| **E02** | Upload invalid format → Reject | Upload .exe file |
| **E03** | Upload exceed size → Reject | Upload file > max_upload_size |
| **E04** | Delete record → File removed | Delete PDS → photos deleted from storage |

**Entities with File Fields**:
- `pds_checklists.photos` (JSON array)
- `work_logs.photos` (JSON array)
- `qc_checklists.photos` (JSON array, nếu có)

#### GROUP F – STATE & WORKFLOW

**Purpose**: Verify lifecycle transitions and business rules.

| Scenario ID | Test Focus | Entities |
|-------------|------------|----------|
| **F01** | Valid transition → Success | Lead: NEW → CONTACTED |
| **F02** | Invalid transition → Reject | Lead: NEW → WON (skip steps) |
| **F03** | State change → Audit logged | RO: PENDING → IN_PROGRESS (log bay_status_logs) |

**Entities with State**:
- `leads` (NEW → CONTACTED → QUALIFIED → PROPOSAL → NEGOTIATION → WON/DEAD)
- `quotations` (DRAFT → SENT → APPROVED → CONTRACT / LOST/EXPIRED)
- `repair_orders` (PENDING → IN_PROGRESS → QC → READY → DELIVERED)
- `bay_assignments` (ASSIGNED → IN_PROGRESS → COMPLETED/CANCELLED)
- `invoices` (UNPAID → PARTIAL → PAID)
- `vins` (AVAILABLE → ALLOCATED → SOLD)

#### GROUP G – VALIDATION & ERROR

**Purpose**: Verify meaningful error messages.

| Scenario ID | Test Focus | Example |
|-------------|------------|---------|
| **G01** | PK null/duplicate → Reject | Create với PK = null hoặc duplicate |
| **G02** | FK non-existent → Reject | "Customer ID không tồn tại" |
| **G03** | Required null → Reject | "Part Number là bắt buộc" |
| **G04** | Business rule violation → Reject | "Discount không được vượt quá 10%" |

#### GROUP H – CROSS-SCREEN & END-TO-END

**Purpose**: Verify data consistency across modules.

| Scenario ID | Test Focus | Flow |
|-------------|------------|------|
| **H01** | Create at A → Visible at B | Create customer trong CRM → visible trong Sales |
| **H02** | Update at A → Reflected at B | Update customer phone → reflected trong Quotation |
| **H03** | Delete at A → Handled at B | Delete customer → Quotation shows "Customer deleted" |
| **H04** | File upload at A → Accessible from B | Upload PDS photo → visible from RO detail |
| **H05** | Multi-screen workflow → Data consistent | Lead → Quotation → Contract → Invoice (full flow) |

**15 Key E2E Flows** (Chi tiết trong UAT Scenarios):
1. Lead → Customer → Quotation → Contract → Invoice → Payment
2. Customer → Test Drive → Quotation → VIN Allocation → PDS
3. Customer → Service Appointment → RO → Work Log → QC → Invoice
4. Part → Stock Movement → PO → Stock Take
5. Accessory → Quotation → Contract
6. Service Package → Service Quote → RO
7. Employee → RO Assignment → Bay Assignment
8. Complaint → Interaction → Resolution
9. Marketing Campaign → Lead → Conversion
10. Insurance Contract → Claim → Payment
11. Fixed Asset → Depreciation → Accounting
12. Supplier → PO → Stock Movement
13. VIN → Contract → Delivery
14. Bay → Assignment → RO → Bay Status Log
15. Loyalty Points → Transaction → Redemption

### 4.3 Pattern-Based UAT (CR-20260203-009)

Đối với các CR áp dụng pattern thống nhất trên nhiều màn hình (e.g., FK Dropdown với AutocompleteFK):

**Strategy**:
1. **Define Pattern Scenarios**: Tạo scenarios cho pattern (Search, Pagination, Quick Create)
2. **Pilot Testing**: Test chi tiết trên 1-2 modules đại diện (e.g., Master Data)
3. **Traceability**: Map pattern scenarios đến tất cả screens affected
4. **Sampling**: Test sampling trên các modules còn lại

**Example (FK Dropdown Pattern)**:
- Pattern Scenario: TC-FK-SEARCH, TC-FK-PAGINATION, TC-FK-QUICK-CREATE
- Pilot Module: Master Data (Vehicle Models, Accessories)
- Affected Screens: ~90 FK fields across 8 modules
- Coverage: 100% via pattern traceability

---

## 5. Test Organization

### 5.1 Test Groups Summary

| Group | Test Focus | Scenarios per Entity | Total Entities | Est. Total |
|-------|------------|---------------------|----------------|------------|
| **A** | CREATE & SAVE | 9 | 67 | ~600 |
| **B** | READ & PERSIST | 4 | 67 | ~268 |
| **C** | UPDATE | 5 | 67 | ~335 |
| **D** | DELETE | 5 | 67 | ~335 |
| **E** | FILE & ATTACHMENT | 4 | ~10 | ~40 |
| **F** | STATE & WORKFLOW | 3 | ~20 | ~60 |
| **G** | VALIDATION & ERROR | 4 | 67 | ~268 |
| **H** | CROSS-SCREEN & E2E | 5 | 15 flows | ~75 |
| **TOTAL** | | | | **~2,000** |

### 5.2 Execution Order

1. **GROUP A** (CREATE) - Foundation for all other tests
2. **GROUP B** (READ) - Verify persistence
3. **GROUP C** (UPDATE) - Modify existing records
4. **GROUP G** (VALIDATION) - Error handling
5. **GROUP D** (DELETE) - Cleanup behaviors
6. **GROUP E** (FILE) - File-specific entities
7. **GROUP F** (STATE) - Workflow entities
8. **GROUP H** (E2E) - Integration flows

### 5.3 Test Data Strategy

**Approach**: Seed database với master data trước khi execute UAT.

**Seed Data**:
- **Users**: 5 users với roles khác nhau (Admin, Sales, Service, Parts, Accounting)
- **Customers**: 20 customers (10 regular, 10 VIP)
- **Vehicle Models**: 8 models (Honda City, CR-V, Civic, Accord, BR-V, HR-V, City Hatchback, Brio)
- **Accessories**: 10 accessories với compatibility matrix
- **Services Catalog**: 10 services (Oil Change, Tire Rotation, Brake Inspection, etc.)
- **Employees**: 10 employees (Sales, Technicians, Admin)
- **Suppliers**: 5 suppliers
- **Warehouses**: 3 warehouses
- **Parts**: 20 parts với categories/locations

---

## 6. Entry/Exit Criteria

### 6.1 Entry Criteria

- ✅ **ERD v1.6 Consolidated** - Approved and finalized
- ✅ **Database Schema** - Migrated to production schema
- ✅ **FRD for all modules** - Latest versions available
- ✅ **UAT Plan, Scenarios, Matrix** - Approved by Antigravity
- ✅ **Seed Data** - Master data loaded
- ✅ **Test Environment** - Stable and accessible
- ✅ **Known Bugs** - All P0/CRITICAL bugs from v5.0 fixed

### 6.2 Exit Criteria

- ✅ **100% Scenario Execution** - All ~2,000 scenarios executed
- ✅ **100% Pass Rate** - All scenarios PASS (or documented exceptions)
- ✅ **Zero Critical Bugs** - No unresolved CRITICAL/HIGH bugs
- ✅ **Coverage Matrix** - 100% entity coverage confirmed
- ✅ **E2E Flows** - 15/15 flows validated
- ✅ **Sign-off** - Antigravity (UAT Authority) approval
- ✅ **Bug Report** - All bugs classified and documented
- ✅ **CR Report** - All CRs documented for next cycle

---

## 7. Resources & Schedule

### 7.1 Team & Roles

| Role | Responsibility | Resource |
|------|---------------|----------|
| **UAT Authority** | Plan approval, issue classification, final sign-off | Antigravity |
| **Test Executor** | Execute scenarios, log results, capture evidence | OpenCode |
| **Developer** | Fix bugs, implement CR (if approved mid-UAT) | OpenCode |
| **Data Analyst** | Verify DB state, SQL queries | Antigravity |

### 7.2 Schedule (Estimated)

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| **Preparation** | 2 days | Seed data, environment setup |
| **Execution (Group A-G)** | 5 days | Sequential group execution |
| **Execution (Group H E2E)** | 2 days | After all entities validated |
| **Bug Fixing** | 3 days | Parallel with execution |
| **Regression** | 2 days | After bug fixes |
| **Sign-off** | 1 day | Final review |
| **TOTAL** | **15 days** | |

### 7.3 Tools

- **Test Management**: Manual (UAT Execution Log in Markdown)
- **Database Tool**: DBeaver / pgAdmin (PostgreSQL)
- **Screenshot/Video**: Built-in OS tools
- **Browser**: Google Chrome (latest stable)

---

## 8. Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **New entities (v1.6) chưa implement UI** | HIGH | MEDIUM | Pre-check implementation status trước UAT |
| **Seed data inconsistent** | HIGH | LOW | Validate seed script before execution |
| **Bug volume quá lớn** | HIGH | MEDIUM | Prioritize CRITICAL bugs first |
| **CR phát sinh mid-UAT** | MEDIUM | HIGH | Document CRs, continue UAT on existing scope |
| **Environment downtime** | MEDIUM | LOW | Daily backup, quick restore plan |
| **Regression coverage** | MEDIUM | MEDIUM | Automated smoke tests post-fix |

---

## 9. References

### 9.1 Design Documentation

- **ERD v1.6 Consolidated**: `docs/design/database/erd/erd_description_v1.2.md` (chưa update tên v1.6)
- **ERD Master Data v1.2**: `docs/design/database/erd/erd_master_data_v1.2.md`
- **FRD Modules**:
  - Admin: `docs/requirements/FRD/frd_admin_v2.1.md`
  - CRM: `docs/requirements/FRD/frd_crm_v1.0.md`
  - Sales: `docs/requirements/FRD/frd_sales_v1.1.md`
  - Service: `docs/requirements/FRD/frd_service_v1.0.md`
  - Parts: `docs/requirements/FRD/frd_parts_v1.0.md`
  - Insurance: `docs/requirements/FRD/frd_insurance_v1.3.md`
  - Accounting: `docs/requirements/FRD/frd_accounting_v1.0.md`
  - Master Data: `docs/requirements/FRD/frd_master_data_v1.3.md`

### 9.2 UAT Documentation

- **UAT Scenarios v6.0**: `docs/design/testing/uat_scenarios_full_system_v6.0.md`
- **UAT Coverage Matrix v6.0**: `docs/design/testing/uat_coverage_matrix_v6.0.md`

### 9.3 Knowledge Base

- **System UAT Master Protocol**: KB > honda_spice_erp > testing > system_uat_master_protocol.md
- **Master ERD Consolidated**: KB > honda_spice_erp > architecture > master_erd_consolidated.md

---

## ✅ APPROVAL

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **UAT Authority** | Antigravity | | |
| **Project Manager** | | | |
| **Technical Lead** | | | |

---

**End of UAT Plan v6.0**
