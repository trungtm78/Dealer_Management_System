# UAT Plan: Honda SPICE ERP - Full System Regression v5.0

**Document Version**: 5.0  
**Date**: 2026-01-30  
**Author**: Antigravity - System UAT Authority  
**Status**: APPROVED  

---

## 📋 Executive Summary

### Purpose
Tài liệu này định nghĩa chiến lược User Acceptance Testing (UAT) toàn diện cho hệ thống Honda SPICE ERP, nhằm đảm bảo:
- ✅ **100% CRUD Coverage** trên 56 entities (ERD v1.2)
- ✅ **Data Persistence** sau reload (F5 Principal)
- ✅ **Constraint Validation** (PK/FK/Type/Nullable/Enum)
- ✅ **File Handling** (Upload/Delete/Cleanup)
- ✅ **State Transitions** (6 workflows)
- ✅ **Cross-Screen Data Linking** (15 E2E flows)

### Scope
- **Database**: ERD v1.2 (56 tables, 8 modules)
- **Modules**: Admin, CRM, Sales, Service, Parts, Insurance, Accounting, Supporting
- **Test Approach**: Entity-based testing (KHÔNG theo màn hình)
- **Test Groups**: 8 nhóm (A-H)

### Approach
Test theo **ENTITY (ERD)**, KHÔNG theo màn hình, đảm bảo:
- Mọi action ghi dữ liệu phải có UAT
- DELETE test riêng (Soft/Hard/Cascade/Restrict)
- Validate theo ERD constraints
- Cross-screen data linking verification

---

## 🎯 Objectives

### Primary Objectives
1. **Verify Data Integrity**: Đảm bảo mọi thao tác CRUD persist đúng vào database
2. **Validate Constraints**: Kiểm tra tất cả ERD constraints (PK/FK/Type/Length/Nullable/Enum)
3. **Test File Operations**: Verify upload/delete/cleanup cho 4 entities có file
4. **Verify Workflows**: Test 6 state machines (Lead/Quotation/RO/Bay/Invoice/VIN)
5. **End-to-End Validation**: Test 15 cross-screen flows

### Secondary Objectives
1. **Error Handling**: Verify meaningful error messages
2. **Audit Trail**: Verify created_at/updated_at/created_by_id
3. **Performance**: Response time < 3s cho standard CRUD
4. **Business Rules**: Validate FRD business logic

---

## 📊 Scope

### In Scope

#### Modules (8)
1. **Admin** (7 entities): users, roles, permissions, role_permissions, system_settings, activity_logs, system_metrics
2. **CRM** (10 entities): leads, customers, lead_histories, interactions, scoring_rules, scoring_criteria, reminders, loyalty_transactions, complaints, marketing_campaigns
3. **Sales** (7 entities): quotations, test_drives, vins, contracts, deposits, pds_checklists
4. **Service** (10 entities): service_quotes, service_appointments, repair_orders, ro_line_items, work_logs, qc_checklists, service_bays, bay_assignments, bay_status_logs
5. **Parts** (9 entities): parts, suppliers, stock_movements, purchase_orders, po_line_items, stock_takes, stock_take_items
6. **Insurance** (2 entities): insurance_contracts, insurance_claims
7. **Accounting** (7 entities): invoices, payments, transactions, fixed_assets, depreciation_schedules, tax_declarations
8. **Supporting** (4 entities): vehicle_models, accessories, services_catalog

#### Test Types
- ✅ CREATE & SAVE (Group A)
- ✅ READ & PERSIST (Group B)
- ✅ UPDATE (Group C)
- ✅ DELETE (Group D)
- ✅ FILE & ATTACHMENT (Group E)
- ✅ STATE & WORKFLOW (Group F)
- ✅ VALIDATION & ERROR (Group G)
- ✅ CROSS-SCREEN & E2E (Group H)

### Out of Scope
- ❌ Performance testing (load/stress)
- ❌ Security penetration testing
- ❌ Browser compatibility testing
- ❌ Mobile responsive testing
- ❌ API unit testing (đã có riêng)
- ❌ UI/UX design review

---

## 🏗️ Test Approach

### Entity-Based Testing
**NGUYÊN TẮC**: Test theo ENTITY (ERD), KHÔNG theo màn hình

**Lý do**:
- Một entity có thể xuất hiện trên nhiều màn hình
- Đảm bảo không bỏ sót action nào
- Dễ trace về ERD constraints
- Dễ verify data persistence

### The 8-Group Testing Architecture

#### 🅰️ GROUP A – CREATE & SAVE
**Objective**: Validate data insertion và persistence

**Coverage**:
- A01: Valid data → Success
- A02: Invalid data → Reject + Error
- A03: PK duplicate → Reject
- A04: FK invalid → Reject
- A05: Required field null → Reject
- A06: Data type mismatch → Reject
- A07: Length exceeded → Reject
- A08: Enum invalid → Reject
- A09: Verify audit fields (created_at, created_by_id)

**Entities**: Tất cả 56 entities

#### 🅱️ GROUP B – READ & PERSIST
**Objective**: Validate data retrieval và persistence sau reload

**Coverage**:
- B01: Read by PK → Correct
- B02: Read by filter → Correct
- B03: Reload page (F5) → Data persists
- B04: Query with JOIN → Related data correct

**Entities**: Tất cả 56 entities

#### 🅲️ GROUP C – UPDATE
**Objective**: Validate data modification

**Coverage**:
- C01: Valid data → Success
- C02: Invalid data → Reject
- C03: Update PK → Reject (immutable)
- C04: Update FK invalid → Reject
- C05: Partial update → Only changed fields
- C06: Verify audit fields (updated_at)

**Entities**: 50 entities (trừ 6 append-only)

#### 🅳️ GROUP D – DELETE
**Objective**: Validate removal logic

**Coverage**:
- D01: Soft delete → Flag set, data preserved
- D02: Hard delete no children → Success
- D03: Hard delete CASCADE → All deleted
- D04: Hard delete RESTRICT → Reject
- D05: Delete record with file → File removed

**Entities**:
- Soft: 14 entities (users, customers, leads, parts, suppliers, quotations, contracts, service_quotes, repair_orders, service_bays, purchase_orders, insurance_contracts, invoices, fixed_assets, vehicle_models, accessories, services_catalog)
- Hard: 36 entities
- Append-only: 6 entities (NO DELETE)

#### 🅴️ GROUP E – FILE & ATTACHMENT
**Objective**: Validate binary file handling

**Coverage**:
- E01: Upload valid → Success, correct path
- E02: Upload invalid format → Reject
- E03: Upload exceed size → Reject
- E04: Delete record → File removed
- E05: Multiple files → All uploaded
- E06: File persistence → Visible after F5

**Entities**: 4 entities (pds_checklists, work_logs, qc_checklists, insurance_claims)

#### 🅵️ GROUP F – STATE & WORKFLOW
**Objective**: Validate lifecycle state transitions

**Coverage**:
- F01: Valid transition → Success
- F02: Invalid transition → Reject
- F03: State change → Audit logged
- F04: Required fields per state → Enforced

**Workflows**:
1. **F1**: Lead (NEW → CONTACTED → QUALIFIED → WON/DEAD)
2. **F2**: Quotation (DRAFT → SENT → APPROVED → CONTRACT)
3. **F3**: Repair Order (PENDING → IN_PROGRESS → QC → READY → DELIVERED)
4. **F4**: Bay Assignment (ASSIGNED → IN_PROGRESS → COMPLETED/CANCELLED)
5. **F5**: Invoice (UNPAID → PARTIAL → PAID)
6. **F6**: VIN (AVAILABLE → ALLOCATED → SOLD)

#### 🅶️ GROUP G – VALIDATION & ERROR
**Objective**: Validate constraints và error handling

**Coverage**:
- G01: PK null/duplicate → Reject
- G02: FK non-existent → Reject
- G03: Required null → Reject
- G04: Business rule violation → Reject + Meaningful error
- G05: Data type mismatch → Reject
- G06: Length exceeded → Reject
- G07: Enum invalid → Reject

**Entities**: Tất cả 56 entities

#### 🅷️ GROUP H – CROSS-SCREEN & END-TO-END
**Objective**: Validate data linking across screens/modules

**Coverage**:
- H01: Create at A → Visible at B
- H02: Update at A → Reflected at B
- H03: Delete at A → Handled at B
- H04: File upload at A → Accessible from B
- H05: Multi-screen workflow → Data consistent

**15 E2E Flows**:
1. **H1**: Lead → Customer → Quotation → Contract
2. **H2**: Customer → Service Appointment → Repair Order → Invoice
3. **H3**: Parts → Purchase Order → Stock Movement → RO Line Items
4. **H4**: Quotation → VIN Allocation → Contract → PDS → Delivery
5. **H5**: Customer → Insurance Contract → Insurance Claim
6. **H6**: User → Role → Permission → RBAC Enforcement
7. **H7**: Lead Scoring → Auto-Calculation → Lead Prioritization
8. **H8**: Customer → Loyalty Points → Transactions
9. **H9**: Repair Order → Work Log → QC → Bay Status
10. **H10**: Stock Take → Variance → Adjustment
11. **H11**: Marketing Campaign → Lead Generation → Conversion Tracking
12. **H12**: Complaint → Assignment → Resolution → Customer Satisfaction
13. **H13**: Test Drive → Feedback → Quotation
14. **H14**: Service Quote → Approval → RO Creation
15. **H15**: Fixed Asset → Depreciation → Accounting

---

## 📂 Test Organization

### Scenario Files Structure

```
docs/design/testing/
├── uat_plan_full_system_v5.0.md (THIS FILE)
├── uat_coverage_matrix_v5.0.md
└── scenarios/
    ├── group_a_create_save_v5.0.md
    ├── group_b_read_persist_v5.0.md
    ├── group_c_update_v5.0.md
    ├── group_d_delete_v5.0.md
    ├── group_e_file_attachment_v5.0.md
    ├── group_f_state_workflow_v5.0.md
    ├── group_g_validation_error_v5.0.md
    └── group_h_cross_screen_e2e_v5.0.md
```

### Scenario Summary by Group

| Group | File | Scenarios | Entities |
|-------|------|-----------|----------|
| A | [group_a_create_save_v5.0.md](file:///C:/Honda/Antigravity/docs/design/testing/scenarios/group_a_create_save_v5.0.md) | ~56 | 56 (all) |
| B | [group_b_read_persist_v5.0.md](file:///C:/Honda/Antigravity/docs/design/testing/scenarios/group_b_read_persist_v5.0.md) | ~56 | 56 (all) |
| C | [group_c_update_v5.0.md](file:///C:/Honda/Antigravity/docs/design/testing/scenarios/group_c_update_v5.0.md) | ~50 | 50 (exclude append-only) |
| D | [group_d_delete_v5.0.md](file:///C:/Honda/Antigravity/docs/design/testing/scenarios/group_d_delete_v5.0.md) | ~50 | 50 (exclude append-only) |
| E | [group_e_file_attachment_v5.0.md](file:///C:/Honda/Antigravity/docs/design/testing/scenarios/group_e_file_attachment_v5.0.md) | ~24 | 4 (file entities) |
| F | [group_f_state_workflow_v5.0.md](file:///C:/Honda/Antigravity/docs/design/testing/scenarios/group_f_state_workflow_v5.0.md) | ~30 | 6 (workflow entities) |
| G | [group_g_validation_error_v5.0.md](file:///C:/Honda/Antigravity/docs/design/testing/scenarios/group_g_validation_error_v5.0.md) | ~56 | 56 (all) |
| H | [group_h_cross_screen_e2e_v5.0.md](file:///C:/Honda/Antigravity/docs/design/testing/scenarios/group_h_cross_screen_e2e_v5.0.md) | ~60 | 15 flows |

**Total Scenarios**: ~450-500 (optimized)

---

## 🎫 Entry & Exit Criteria

### Entry Criteria
- ✅ ERD v1.2 finalized và approved
- ✅ FRD (8 modules) finalized
- ✅ API Spec (8 modules) finalized
- ✅ UI Spec available
- ✅ Backend implementation completed
- ✅ Frontend implementation completed
- ✅ Unit tests passed
- ✅ Test environment ready
- ✅ Test data prepared

### Exit Criteria
- ✅ 100% scenarios executed
- ✅ 100% PASS rate (hoặc BUG/CR identified)
- ✅ All critical bugs fixed
- ✅ All data persistence verified
- ✅ All constraints validated
- ✅ All workflows tested
- ✅ All E2E flows verified
- ✅ UAT Report signed off

---

## 👥 Resources & Roles

### Roles
- **UAT Authority**: Antigravity (Design & Scenario Creation)
- **Test Executor**: OpenCode (Execution & Reporting)
- **Developer**: Fix bugs identified
- **Stakeholder**: Final sign-off

### Test Environment
- **Database**: PostgreSQL (Production) / SQLite (Demo)
- **Backend**: Node.js + Express + Prisma
- **Frontend**: React + TypeScript
- **Browser**: Chrome (latest)

---

## 📅 Schedule

### Phase 1: Preparation (COMPLETED)
- ✅ ERD v1.2 finalized
- ✅ UAT Plan created
- ✅ UAT Scenarios created (8 groups)
- ✅ UAT Coverage Matrix created

### Phase 2: Execution (NEXT)
- [ ] Execute Group A scenarios
- [ ] Execute Group B scenarios
- [ ] Execute Group C scenarios
- [ ] Execute Group D scenarios
- [ ] Execute Group E scenarios
- [ ] Execute Group F scenarios
- [ ] Execute Group G scenarios
- [ ] Execute Group H scenarios

### Phase 3: Reporting
- [ ] Categorize failures (BUG vs CR)
- [ ] Create bug reports
- [ ] Create change requests
- [ ] Track fixes

### Phase 4: Sign-off
- [ ] Achieve 100% pass rate
- [ ] UAT Report approval
- [ ] Production deployment approval

---

## ⚠️ Risks & Mitigation

### Risk 1: Data Loss After Reload
**Impact**: HIGH  
**Mitigation**: F5 Principal - Test persistence for EVERY scenario

### Risk 2: Constraint Violations
**Impact**: HIGH  
**Mitigation**: Dedicated Group G for validation testing

### Risk 3: Cross-Screen Data Inconsistency
**Impact**: MEDIUM  
**Mitigation**: Dedicated Group H for E2E testing

### Risk 4: File Cleanup Failure
**Impact**: MEDIUM  
**Mitigation**: Dedicated Group E with delete verification

### Risk 5: Invalid State Transitions
**Impact**: MEDIUM  
**Mitigation**: Dedicated Group F for workflow testing

---

## 📚 References

### Design Documents
- [ERD v1.2](file:///C:/Honda/Antigravity/docs/design/database/erd/erd_description_v1.2.md)
- [ERD Diagram](file:///C:/Honda/Antigravity/docs/design/database/erd/honda_dms_erd_diagram.png)
- [API Spec Index](file:///C:/Honda/Antigravity/docs/design/api/api_spec_index_v1.0.md)

### FRD Documents
- [FRD Admin](file:///C:/Honda/Antigravity/docs/requirements/FRD/frd_admin_v1.0.md)
- [FRD CRM](file:///C:/Honda/Antigravity/docs/requirements/FRD/frd_crm_v1.0.md)
- [FRD Sales](file:///C:/Honda/Antigravity/docs/requirements/FRD/frd_sales_v1.0.md)
- [FRD Service](file:///C:/Honda/Antigravity/docs/requirements/FRD/frd_service_v1.0.md)
- [FRD Parts](file:///C:/Honda/Antigravity/docs/requirements/FRD/frd_parts_v1.0.md)
- [FRD Insurance](file:///C:/Honda/Antigravity/docs/requirements/FRD/frd_insurance_v1.0.md)
- [FRD Accounting](file:///C:/Honda/Antigravity/docs/requirements/FRD/frd_accounting_v1.0.md)

### UAT Documents
- [UAT Coverage Matrix v5.0](file:///C:/Honda/Antigravity/docs/design/testing/uat_coverage_matrix_v5.0.md)
- [Group A Scenarios](file:///C:/Honda/Antigravity/docs/design/testing/scenarios/group_a_create_save_v5.0.md)
- [Group B Scenarios](file:///C:/Honda/Antigravity/docs/design/testing/scenarios/group_b_read_persist_v5.0.md)
- [Group C Scenarios](file:///C:/Honda/Antigravity/docs/design/testing/scenarios/group_c_update_v5.0.md)
- [Group D Scenarios](file:///C:/Honda/Antigravity/docs/design/testing/scenarios/group_d_delete_v5.0.md)
- [Group E Scenarios](file:///C:/Honda/Antigravity/docs/design/testing/scenarios/group_e_file_attachment_v5.0.md)
- [Group F Scenarios](file:///C:/Honda/Antigravity/docs/design/testing/scenarios/group_f_state_workflow_v5.0.md)
- [Group G Scenarios](file:///C:/Honda/Antigravity/docs/design/testing/scenarios/group_g_validation_error_v5.0.md)
- [Group H Scenarios](file:///C:/Honda/Antigravity/docs/design/testing/scenarios/group_h_cross_screen_e2e_v5.0.md)

### Knowledge Base
- [UAT Coverage Summary v5.0](file:///C:/Users/Than%20Minh%20Trung/.gemini/antigravity/knowledge/honda_spice_erp_knowledge_base/artifacts/testing/uat_coverage_summary_v5_0.md)
- [UAT E2E Flow Definitions v5.0](file:///C:/Users/Than%20Minh%20Trung/.gemini/antigravity/knowledge/honda_spice_erp_knowledge_base/artifacts/testing/uat_e2e_flow_definitions_v5_0.md)
- [UAT Scenario Standards v5.0](file:///C:/Users/Than%20Minh%20Trung/.gemini/antigravity/knowledge/honda_spice_erp_knowledge_base/artifacts/testing/uat_scenario_standards_v5_0.md)

---

## ✅ Approval

**Document Status**: APPROVED  
**Approved By**: Antigravity - System UAT Authority  
**Date**: 2026-01-30  

---

**End of UAT Plan v5.0**
