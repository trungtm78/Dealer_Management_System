# Honda DMS - UAT Plan Full System v3.0 (COMPACT)

**Version**: 3.0  
**Date**: 2026-01-29  
**Author**: Antigravity - System UAT Authority  
**Purpose**: REGRESSION Testing - Full System Storage Operations  
**Scope**: ALL 49 entities from ERD v1.0

**Format**: COMPACT - Templates + Entity Matrix (easier to maintain)

---

## 📋 Document Overview

UAT Plan v3.0 sử dụng **template-based approach** để coverage toàn bộ 49 entities một cách hiệu quả.

**Key Differences from v2.x**:
- ✅ Template-driven (không lặp lại scenarios)
- ✅ Entity-centric (theo ERD)
- ✅ Đầy đủ DELETE coverage (soft/hard/FK)
- ✅ Compact nhưng comprehensive

---

## 🎯 UAT ORGANIZATION (7 GROUPS)

| Group | Focus | Template ID | Applies To |
|-------|-------|-------------|------------|
| **Group 1** | Create & Save | T-CREATE | All 49 entities |
| **Group 2** | Update & Persist | T-UPDATE | All 49 entities |
| **Group 3** | File / Attachment | T-FILE | Entities with files |
| **Group 4** | Status / Workflow | T-STATUS | Entities with status |
| **Group 5** | Validation & Error | T-VALIDATE | All 49 entities |
| **Group 6** | DELETE - Soft | T-DELETE-SOFT | Entities with soft delete |
| **Group 7** | DELETE - Hard & FK | T-DELETE-HARD | All deletable entities |

**Total Estimated Scenarios**: ~350

---

## 📊 ENTITY COVERAGE MATRIX

### Module 1: Admin (3 entities)

| Entity | Create | Update | File | Status | Validate | Delete-Soft | Delete-Hard | FK Test |
|--------|--------|--------|------|--------|----------|-------------|-------------|---------|
| users | ✅ | ✅ | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| activity_logs | ✅ | - | - | - | ✅ | - | - | - |
| system_metrics | ✅ | ✅ | - | - | ✅ | - | ✅ | - |

**Scenarios**: 15

---

### Module 2: CRM (8 entities)

| Entity | Create | Update | File | Status | Validate | Delete-Soft | Delete-Hard | FK Test |
|--------|--------|--------|------|--------|----------|-------------|-------------|---------|
| customers | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - | ✅ |
| leads | ✅ | ✅ | - | ✅ | ✅ | ✅ | - | ✅ |
| interactions | ✅ | ✅ | - | - | ✅ | ✅ | - | ✅ |
| reminders | ✅ | ✅ | - | ✅ | ✅ | ✅ | - | - |
| loyalty_transactions | ✅ | - | - | - | ✅ | - | - | - |
| complaints | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - | - |
| marketing_campaigns | ✅ | ✅ | - | ✅ | ✅ | ✅ | - | ✅ |
| scoring_rules | ✅ | ✅ | - | ✅ | ✅ | ✅ | - | - |

**Scenarios**: 60

---

### Module 3: Sales (7 entities)

| Entity | Create | Update | File | Status | Validate | Delete-Soft | Delete-Hard | FK Test |
|--------|--------|--------|------|--------|----------|-------------|-------------|---------|
| vins | ✅ | ✅ | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| quotations | ✅ | ✅ | - | ✅ | ✅ | ✅ | - | ✅ |
| test_drives | ✅ | ✅ | - | ✅ | ✅ | ✅ | - | ✅ |
| contracts | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| deposits | ✅ | ✅ | - | ✅ | ✅ | ✅ | - | ✅ |
| pds_checklists | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - | ✅ |
| deliveries | ✅ | ✅ | ✅ | ✅ | ✅ | - | - | ✅ |

**Scenarios**: 55

---

### Module 4: Service (7 entities)

| Entity | Create | Update | File | Status | Validate | Delete-Soft | Delete-Hard | FK Test |
|--------|--------|--------|------|--------|----------|-------------|-------------|---------|
| service_quotes | ✅ | ✅ | - | ✅ | ✅ | ✅ | - | ✅ |
| service_appointments | ✅ | ✅ | - | ✅ | ✅ | ✅ | - | ✅ |
| repair_orders | ✅ | ✅ | - | ✅ | ✅ | ✅ | - | ✅ |
| ro_line_items | ✅ | ✅ | - | - | ✅ | - | ✅ | ✅ |
| work_logs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - | ✅ |
| qc_checklists | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - | ✅ |
| service_settlements | ✅ | ✅ | - | ✅ | ✅ | - | - | ✅ |

**Scenarios**: 55

---

### Module 5: Parts (9 entities)

| Entity | Create | Update | File | Status | Validate | Delete-Soft | Delete-Hard | FK Test |
|--------|--------|--------|------|--------|----------|-------------|-------------|---------|
| parts | ✅ | ✅ | - | ✅ | ✅ | ✅ | - | ✅ |
| suppliers | ✅ | ✅ | - | - | ✅ | ✅ | - | ✅ |
| stock_movements | ✅ | - | - | - | ✅ | - | - | - |
| purchase_orders | ✅ | ✅ | - | ✅ | ✅ | ✅ | - | ✅ |
| po_line_items | ✅ | ✅ | - | - | ✅ | - | ✅ | ✅ |
| stock_takes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - | - |
| stock_take_items | ✅ | ✅ | - | - | ✅ | - | ✅ | ✅ |
| bay_assignments | ✅ | ✅ | - | ✅ | ✅ | ✅ | - | ✅ |
| bay_utilizations | ✅ | - | - | - | ✅ | - | - | - |

**Scenarios**: 60

---

### Module 6: Insurance (2 entities)

| Entity | Create | Update | File | Status | Validate | Delete-Soft | Delete-Hard | FK Test |
|--------|--------|--------|------|--------|----------|-------------|-------------|---------|
| insurance_contracts | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| insurance_claims | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - | ✅ |

**Scenarios**: 20

---

### Module 7: Accounting (7 entities)

| Entity | Create | Update | File | Status | Validate | Delete-Soft | Delete-Hard | FK Test |
|--------|--------|--------|------|--------|----------|-------------|-------------|---------|
| invoices | ✅ | ✅ | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| payments | ✅ | ✅ | - | ✅ | ✅ | ✅ | - | ✅ |
| transactions | ✅ | - | - | - | ✅ | - | - | - |
| fixed_assets | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - | - |
| depreciation_schedules | ✅ | ✅ | - | - | ✅ | - | ✅ | ✅ |
| tax_declarations | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - | - |
| reconciliations | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - | - |

**Scenarios**: 50

---

### Module 8: Supporting (6 entities)

| Entity | Create | Update | File | Status | Validate | Delete-Soft | Delete-Hard | FK Test |
|--------|--------|--------|------|--------|----------|-------------|-------------|---------|
| vehicle_models | ✅ | ✅ | - | - | ✅ | - | - | - |
| accessories | ✅ | ✅ | - | - | ✅ | - | - | - |
| services_catalog | ✅ | ✅ | - | ✅ | ✅ | ✅ | - | - |
| system_settings | - | ✅ | - | - | ✅ | - | - | - |
| lead_history | ✅ | - | - | - | ✅ | - | - | - |
| bay_definitions | ✅ | ✅ | - | ✅ | ✅ | ✅ | - | - |

**Scenarios**: 30

---

## 📋 TOTAL COVERAGE SUMMARY

| Metric | Count |
|--------|-------|
| **Total Entities** | 49 |
| **Entities with Create** | 49 (100%) |
| **Entities with Update** | 43 (88%) |
| **Entities with File** | 12 (24%) |
| **Entities with Status** | 35 (71%) |
| **Entities with Validation** | 49 (100%) |
| **Entities with Soft Delete** | 36 (73%) |
| **Entities with Hard Delete** | 10 (20%) |
| **Entities with FK Test** | 32 (65%) |
| **Total Scenarios** | **~350** |

---

## 🔧 UAT SCENARIO TEMPLATES

### T-CREATE: Create & Save Template

**Applies to**: All 49 entities

**Scenario ID Format**: `UAT-{MODULE}-{ENTITY}-CREATE-001`

**Steps**:
1. Navigate to entity list screen
2. Click "Create New"
3. Fill all required fields
4. Click "Save"
5. Reload page (F5)

**Expected UI Result**:
- Success message displayed
- Entity visible in list
- All fields persisted correctly

**Expected DB Result**:
- New record in `{entity}` table
- All fields saved correctly
- `created_at` populated
- `id` generated

**Pass Criteria**: ✅ Entity created, visible, persisted after reload

---

### T-UPDATE: Update & Persist Template

**Applies to**: 43 entities (excludes append-only)

**Scenario ID Format**: `UAT-{MODULE}-{ENTITY}-UPDATE-001`

**Steps**:
1. Navigate to entity detail
2. Click "Edit"
3. Modify field values
4. Click "Save"
5. Reload page (F5)

**Expected UI Result**:
- Success message displayed
- Updated values visible
- Values persisted after reload

**Expected DB Result**:
- Record updated in `{entity}` table
- `updated_at` changed
- Old values overwritten

**Pass Criteria**: ✅ Entity updated, persisted after reload

---

### T-FILE: File / Attachment Template

**Applies to**: 12 entities with file uploads

**Scenario ID Format**: `UAT-{MODULE}-{ENTITY}-FILE-001`

**Steps**:
1. Navigate to entity detail
2. Click "Upload File"
3. Select valid file (PDF/JPG/PNG)
4. Upload
5. Reload page (F5)

**Expected UI Result**:
- File uploaded successfully
- File visible in attachments list
- File persists after reload

**Expected Storage Result**:
- File saved to storage (S3/local)
- File path saved in DB
- File accessible via download link

**Pass Criteria**: ✅ File uploaded, visible, downloadable after reload

---

### T-STATUS: Status / Workflow Template

**Applies to**: 35 entities with status field

**Scenario ID Format**: `UAT-{MODULE}-{ENTITY}-STATUS-001`

**Steps**:
1. Navigate to entity detail
2. Change status (e.g., DRAFT → PENDING)
3. Click "Save"
4. Reload page (F5)

**Expected UI Result**:
- Status updated
- Status badge reflects new value
- Status persisted after reload

**Expected DB Result**:
- `status` field updated
- `updated_at` changed
- Status transition logged (if applicable)

**Pass Criteria**: ✅ Status updated, persisted after reload

---

### T-VALIDATE: Validation & Error Template

**Applies to**: All 49 entities

**Scenario ID Format**: `UAT-{MODULE}-{ENTITY}-VAL-001`

**Steps**:
1. Navigate to create/edit form
2. Leave required field empty
3. Click "Save"

**Expected UI Result**:
- Error message: "Field X is required"
- Form NOT submitted
- User can correct and retry

**Expected DB Result**:
- NO record created/updated
- DB unchanged

**Pass Criteria**: ✅ Validation error shown, DB unchanged

---

### T-DELETE-SOFT: Soft Delete Template

**Applies to**: 36 entities with soft delete

**Scenario ID Format**: `UAT-{MODULE}-{ENTITY}-DEL-SOFT-001`

**Steps**:
1. Navigate to entity list
2. Select entity
3. Click "Delete"
4. Confirm deletion
5. Reload page (F5)

**Expected UI Result**:
- Success message: "Entity deleted"
- Entity NOT visible in list
- Entity NOT returned by API

**Expected DB Result**:
- `deleted_at` populated OR
- `status` = "DELETED" OR
- `is_deleted` = true
- Record still exists in DB

**Pass Criteria**: ✅ Entity soft deleted, not visible, DB record retained

---

### T-DELETE-HARD: Hard Delete Template

**Applies to**: 10 entities with hard delete

**Scenario ID Format**: `UAT-{MODULE}-{ENTITY}-DEL-HARD-001`

**Steps**:
1. Navigate to entity list (admin mode)
2. Select entity
3. Click "Permanent Delete"
4. Confirm deletion
5. Attempt to fetch entity by ID

**Expected UI Result**:
- Success message: "Entity permanently deleted"
- Entity NOT visible anywhere

**Expected DB Result**:
- Record DELETED from `{entity}` table
- FK behavior executed (CASCADE/RESTRICT/SET NULL)

**Expected API Result**:
- GET /{entity}/{id} → 404 NOT FOUND

**Pass Criteria**: ✅ Entity hard deleted, DB record removed

---

### T-DELETE-FK: FK Constraint Test Template

**Applies to**: 32 entities with FK relationships

**Scenario ID Format**: `UAT-{MODULE}-{ENTITY}-DEL-FK-001`

**Steps**:
1. Create parent entity
2. Create child entity referencing parent
3. Attempt to delete parent
4. Observe result

**Expected Result (depends on FK constraint)**:

**If FK = RESTRICT**:
- ❌ Delete BLOCKED
- Error: "Cannot delete, referenced by {child}"
- Parent NOT deleted

**If FK = CASCADE**:
- ✅ Delete SUCCESS
- Parent deleted
- Child also deleted

**If FK = SET NULL**:
- ✅ Delete SUCCESS
- Parent deleted
- Child FK set to NULL

**Pass Criteria**: ✅ FK behavior matches ERD specification

---

## 🎯 EXECUTION PLAN

### Phase 1: Create & Update (Weeks 1-2)
- Execute T-CREATE for all 49 entities
- Execute T-UPDATE for 43 entities
- **Target**: 92 scenarios, ~30 hours

### Phase 2: File & Status (Week 3)
- Execute T-FILE for 12 entities
- Execute T-STATUS for 35 entities
- **Target**: 47 scenarios, ~15 hours

### Phase 3: Validation (Week 4)
- Execute T-VALIDATE for all 49 entities
- **Target**: 49 scenarios, ~16 hours

### Phase 4: DELETE Operations (Weeks 5-6)
- Execute T-DELETE-SOFT for 36 entities
- Execute T-DELETE-HARD for 10 entities
- Execute T-DELETE-FK for 32 entities
- **Target**: 78 scenarios, ~26 hours

### Phase 5: Regression (Week 7)
- Re-run all CRITICAL scenarios
- **Target**: Full suite, ~30 hours

**Total Estimated Time**: 117 hours (7 weeks)

---

## ✅ VERIFICATION CHECKLIST

### Coverage Verification
- [ ] All 49 entities have CREATE test
- [ ] All updatable entities have UPDATE test
- [ ] All entities with files have FILE test
- [ ] All entities with status have STATUS test
- [ ] All entities have VALIDATION test
- [ ] All soft-deletable entities have SOFT DELETE test
- [ ] All hard-deletable entities have HARD DELETE test
- [ ] All FK relationships have FK CONSTRAINT test

### Quality Gates
- [ ] Pass rate ≥ 95%
- [ ] No entity omitted
- [ ] DELETE coverage = 100%
- [ ] FK behavior verified for all relationships

---

## 📊 SCENARIO COUNT BY GROUP

| Group | Template | Entities | Scenarios |
|-------|----------|----------|-----------|
| Group 1 | T-CREATE | 49 | 49 |
| Group 2 | T-UPDATE | 43 | 43 |
| Group 3 | T-FILE | 12 | 24 |
| Group 4 | T-STATUS | 35 | 35 |
| Group 5 | T-VALIDATE | 49 | 98 |
| Group 6 | T-DELETE-SOFT | 36 | 36 |
| Group 7 | T-DELETE-HARD | 10 | 10 |
| Group 7 | T-DELETE-FK | 32 | 64 |
| **TOTAL** | - | - | **359** |

---

## 🚨 CRITICAL NOTES

1. **DELETE is MANDATORY**: Every deletable entity MUST have delete test
2. **FK Constraints**: MUST verify CASCADE/RESTRICT/SET NULL behavior
3. **Soft vs Hard**: Clearly distinguish soft delete (flag) vs hard delete (remove)
4. **Append-Only Tables**: No UPDATE/DELETE tests (e.g., activity_logs, stock_movements, transactions)
5. **Template Customization**: Customize template for entity-specific logic

---

**Maintained By**: Antigravity (System UAT Authority)  
**Last Updated**: 2026-01-29  
**Version**: 3.0 (COMPACT - Template-based)  
**Next Review**: After UAT execution

---

**End of UAT Plan Full System v3.0**
