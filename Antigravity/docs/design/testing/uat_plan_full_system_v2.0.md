# Honda DMS - UAT Plan Full System v2.0

**Version**: 2.0  
**Date**: 2026-01-29  
**Author**: Antigravity - System UAT Authority  
**Purpose**: REGRESSION Testing - Full System Storage Operations **INCLUDING DELETE**  
**Scope**: ALL modules and screens with storage operations (CRUD + File + Status)

**Changes from v1.0**:
- ✅ Added GROUP D: DELETE scenarios (60+ scenarios)
- ✅ Added DELETE coverage for all entities
- ✅ Added FK constraint testing
- ✅ Total scenarios: 211 → **271 scenarios**

---

## 📋 Document Overview

Tài liệu này định nghĩa UAT Plan toàn hệ thống, tập trung vào **REGRESSION testing** cho tất cả chức năng lưu trữ (Create/Update/Upload/Save/Status/**DELETE**).

**Coverage**:
- 8 modules
- 58 screens
- 172 storage points + **60 DELETE points**
- **271 UAT scenarios** (211 from v1.0 + 60 DELETE)

**Reference**: `uat_coverage_matrix_v2.0.md` - Chi tiết mapping screens → storage types

---

## 🎯 UAT Organization (6 Groups)

| Group | Focus | Scenarios | Priority |
|-------|-------|-----------|----------|
| **Group 1** | Create & Save | 70 | CRITICAL |
| **Group 2** | Update & Persist | 57 | CRITICAL |
| **Group 3** | File / Attachment | 36 | HIGH |
| **Group 4** | Status / Workflow | 49 | HIGH |
| **Group 5** | Validation & Error | 58 | MEDIUM |
| **Group 6 (NEW)** | **DELETE Operations** | **60** | **CRITICAL** |
| **TOTAL** | - | **271** | - |

---

## 🆕 GROUP 6: DELETE OPERATIONS (60 scenarios)

**Focus**: Verify all DELETE operations (Soft Delete, Hard Delete, FK Constraints)

**CRITICAL RULES**:
- DELETE là nghiệp vụ rủi ro cao → KHÔNG ĐƯỢC test hời hợt
- Mỗi entity PHẢI có DELETE test
- Phải test cả Soft Delete VÀ Hard Delete (nếu có)
- Phải test DELETE với FK constraints (RESTRICT / CASCADE / SET NULL)

---

### 🅳 DELETE Scenario Structure (3 Types)

#### D1 - Soft Delete (Logical Delete)

```
Scenario ID: UAT-[MODULE]-[SCREEN]-DEL-SOFT-[N]
Module: [Module Name]
Screen: [Screen Name]
Entity: [Entity Name]
Type: SOFT DELETE

Preconditions:
- Existing record in DB
- User has delete permission
- Record not referenced by FK (or FK allows delete)

Steps:
1. Navigate to [Screen]
2. Select record to delete
3. Click "Delete" button
4. Confirm deletion in dialog
5. Reload page (F5)

Expected UI Result:
- Success message: "Record deleted"
- Record NOT visible in list
- Record NOT visible in detail view

Expected DB Result:
- Record still exists in `[table]` table
- `deleted_at` timestamp populated OR
- `status` changed to "DELETED" OR
- `is_active` = false
- Record NOT returned by default API queries

Pass/Fail Criteria:
- ✅ PASS: Record soft deleted, not visible in UI, DB flag set
- ❌ FAIL: Record still visible OR DB not updated OR hard deleted
```

---

#### D2 - Hard Delete (Physical Delete)

```
Scenario ID: UAT-[MODULE]-[SCREEN]-DEL-HARD-[N]
Module: [Module Name]
Screen: [Screen Name]
Entity: [Entity Name]
Type: HARD DELETE

Preconditions:
- Existing record in DB
- User has admin/hard delete permission
- Record not referenced by FK with RESTRICT

Steps:
1. Navigate to [Screen]
2. Select record to delete
3. Click "Permanent Delete" (admin only)
4. Confirm deletion with password/2FA
5. Attempt to fetch record by ID

Expected UI Result:
- Success message: "Record permanently deleted"
- Record NOT visible anywhere
- Attempt to view detail → 404 Not Found

Expected DB Result:
- Record REMOVED from `[table]` table
- FK behavior executed:
  - CASCADE: Related records also deleted
  - SET NULL: FK fields set to NULL
  - RESTRICT: Delete blocked (tested separately)

Pass/Fail Criteria:
- ✅ PASS: Record physically deleted, FK behavior correct
- ❌ FAIL: Record still exists OR FK behavior wrong
```

---

#### D3 - Delete with FK Constraint (RESTRICT)

```
Scenario ID: UAT-[MODULE]-[SCREEN]-DEL-FK-[N]
Module: [Module Name]
Screen: [Screen Name]
Entity: [Entity Name]
Type: DELETE CONSTRAINT TEST

Preconditions:
- Existing record in DB
- Record IS referenced by FK in another table
- FK constraint = RESTRICT (delete blocked)

Steps:
1. Navigate to [Screen]
2. Select record that has FK references
3. Click "Delete" button
4. Confirm deletion

Expected UI Result:
- Error message: "Cannot delete. Record is referenced by [related entity]"
- Record NOT deleted
- User can view related records

Expected DB Result:
- Record still exists in `[table]` table
- No changes to DB
- FK references intact

Pass/Fail Criteria:
- ✅ PASS: Delete blocked, error shown, DB unchanged
- ❌ FAIL: Record deleted OR no error OR FK broken
```

---

### Representative DELETE Scenarios

#### UAT-CRM-001-DEL-SOFT-001: Soft Delete Lead

**Module**: CRM  
**Screen**: Lead List (CRM-001)  
**Entity**: Lead  
**Type**: SOFT DELETE

**Preconditions**:
- Existing lead with status "DEAD" or "WON"
- User logged in as SALES_REP or MANAGER
- Lead has no active quotations

**Steps**:
1. Navigate to `/crm/leads`
2. Select lead with status "DEAD"
3. Click "Delete" button
4. Confirm deletion: "Are you sure you want to delete this lead?"
5. Click "Yes, Delete"
6. Reload page (F5)
7. Attempt to search for deleted lead

**Expected UI Result**:
- Success message: "Lead deleted successfully"
- Lead NOT visible in Lead List
- Search by phone → No results
- Attempt to view detail → 404 or "Lead not found"

**Expected DB Result**:
- `leads` table: Record still exists
- `leads.status` = "DELETED" OR `leads.deleted_at` populated
- `leads.updated_at` changed
- Lead NOT returned by `GET /api/crm/leads` (default query)
- Lead history preserved in `lead_history` table

**Pass/Fail Criteria**:
- ✅ PASS: Lead soft deleted, not visible, DB flag set, history preserved
- ❌ FAIL: Lead still visible OR hard deleted OR history lost

---

#### UAT-CRM-003-DEL-FK-001: Delete Customer with FK Constraint

**Module**: CRM  
**Screen**: Customer List (CRM-003)  
**Entity**: Customer  
**Type**: DELETE CONSTRAINT TEST

**Preconditions**:
- Existing customer with ID `cust_001`
- Customer HAS active quotations (FK reference)
- FK constraint: `quotations.customer_id` REFERENCES `customers.id` ON DELETE RESTRICT

**Steps**:
1. Navigate to `/crm/customers`
2. Select customer `cust_001` (has 2 active quotations)
3. Click "Delete" button
4. Confirm deletion

**Expected UI Result**:
- Error message: "Cannot delete customer. Customer has 2 active quotations."
- Link to view quotations
- Customer NOT deleted
- User can cancel or view related quotations

**Expected DB Result**:
- `customers` table: Record still exists
- `quotations` table: 2 quotations still reference `cust_001`
- No changes to DB

**Pass/Fail Criteria**:
- ✅ PASS: Delete blocked, error shown with count, DB unchanged
- ❌ FAIL: Customer deleted OR quotations orphaned OR no error

---

#### UAT-SAL-005-DEL-HARD-001: Hard Delete VIN (Admin Only)

**Module**: Sales  
**Screen**: VIN List (SAL-005)  
**Entity**: VIN  
**Type**: HARD DELETE

**Preconditions**:
- Existing VIN with status "AVAILABLE" (not allocated/sold)
- User logged in as ADMIN
- VIN has NO FK references (no allocations, no contracts)

**Steps**:
1. Navigate to `/sales/vins`
2. Select VIN with status "AVAILABLE"
3. Click "Actions" → "Permanent Delete" (admin only)
4. Confirm deletion with admin password
5. Attempt to fetch VIN by ID via API

**Expected UI Result**:
- Warning dialog: "This will PERMANENTLY delete the VIN. This action cannot be undone."
- Password confirmation required
- Success message: "VIN permanently deleted"
- VIN NOT visible in list
- Attempt to view detail → 404

**Expected DB Result**:
- `vins` table: Record REMOVED (hard deleted)
- No soft delete flag
- API `GET /api/sales/vins/[vin_id]` → 404 Not Found

**Pass/Fail Criteria**:
- ✅ PASS: VIN physically deleted, 404 on fetch, DB record removed
- ❌ FAIL: VIN still exists OR soft deleted instead

---

#### UAT-SVC-005-DEL-SOFT-001: Soft Delete Repair Order

**Module**: Service  
**Screen**: Repair Order List (SVC-005)  
**Entity**: RepairOrder  
**Type**: SOFT DELETE

**Preconditions**:
- Existing RO with status "CANCELLED"
- User logged in as SERVICE_MANAGER
- RO has line items (FK references)

**Steps**:
1. Navigate to `/service/orders`
2. Filter by status "CANCELLED"
3. Select cancelled RO
4. Click "Delete" button
5. Confirm deletion
6. Reload page (F5)

**Expected UI Result**:
- Success message: "Repair Order deleted"
- RO NOT visible in list
- Attempt to view detail → "RO not found"

**Expected DB Result**:
- `repair_orders` table: Record still exists
- `repair_orders.deleted_at` populated OR `status` = "DELETED"
- `ro_line_items` table: Line items preserved (FK CASCADE to soft delete OR preserved)
- RO NOT returned by default API queries

**Pass/Fail Criteria**:
- ✅ PASS: RO soft deleted, line items handled correctly, not visible
- ❌ FAIL: RO still visible OR line items orphaned

---

#### UAT-INS-003-DEL-FK-001: Delete Claim with Uploaded Files

**Module**: Insurance  
**Screen**: Claim List (INS-003)  
**Entity**: InsuranceClaim  
**Type**: DELETE WITH FILE CLEANUP

**Preconditions**:
- Existing claim with status "REJECTED"
- Claim has 4 uploaded files (photos + PDF)
- User logged in as INSURANCE_MANAGER

**Steps**:
1. Navigate to `/insurance/claims`
2. Select claim with status "REJECTED"
3. Click "Delete" button
4. Confirm deletion
5. Reload page (F5)
6. Check file storage

**Expected UI Result**:
- Success message: "Claim deleted"
- Claim NOT visible in list

**Expected DB Result**:
- `insurance_claims` table: Record soft deleted
- `claim_documents` table (if separate): Records soft deleted OR CASCADE deleted
- File storage: Files RETAINED (for audit) OR moved to archive

**Expected File Storage Result**:
- Files NOT deleted from storage (audit requirement)
- OR Files moved to `/archive/insurance/claims/[claim_id]/`

**Pass/Fail Criteria**:
- ✅ PASS: Claim deleted, files handled per policy (retained or archived)
- ❌ FAIL: Claim still visible OR files lost OR files not archived

---

### DELETE Scenarios by Module (60 total)

#### CRM Module (10 DELETE scenarios)
- UAT-CRM-001-DEL-SOFT-001: Soft Delete Lead
- UAT-CRM-001-DEL-FK-001: Delete Lead with Interactions (FK test)
- UAT-CRM-003-DEL-SOFT-001: Soft Delete Customer
- UAT-CRM-003-DEL-FK-001: Delete Customer with Quotations (FK RESTRICT)
- UAT-CRM-005-DEL-SOFT-001: Soft Delete Scoring Rule
- UAT-CRM-006-DEL-SOFT-001: Delete Interaction
- UAT-CRM-007-DEL-SOFT-001: Delete Reminder
- UAT-CRM-009-DEL-SOFT-001: Soft Delete Complaint
- UAT-CRM-010-DEL-SOFT-001: Soft Delete Campaign
- UAT-CRM-010-DEL-FK-001: Delete Campaign with Sent Messages (FK test)

---

#### Sales Module (12 DELETE scenarios)
- UAT-SAL-001-DEL-SOFT-001: Soft Delete Quotation (DRAFT)
- UAT-SAL-001-DEL-FK-001: Delete Quotation with Test Drive (FK test)
- UAT-SAL-003-DEL-SOFT-001: Soft Delete Test Drive
- UAT-SAL-005-DEL-SOFT-001: Soft Delete VIN Allocation
- UAT-SAL-005-DEL-HARD-001: Hard Delete VIN (Admin only)
- UAT-SAL-005-DEL-FK-001: Delete VIN with Contract (FK RESTRICT)
- UAT-SAL-007-DEL-SOFT-001: Soft Delete Contract (CANCELLED)
- UAT-SAL-007-DEL-FK-001: Delete Contract with Deposit (FK test)
- UAT-SAL-009-DEL-SOFT-001: Soft Delete Deposit (REFUNDED)
- UAT-SAL-011-DEL-SOFT-001: Delete PDS Checklist
- UAT-SAL-011-DEL-FILE-001: Delete PDS with Photos (file cleanup test)
- UAT-SAL-007-DEL-HARD-001: Hard Delete Contract (Admin, no FK refs)

---

#### Service Module (10 DELETE scenarios)
- UAT-SVC-001-DEL-SOFT-001: Soft Delete Service Quote
- UAT-SVC-003-DEL-SOFT-001: Soft Delete Appointment (CANCELLED)
- UAT-SVC-003-DEL-FK-001: Delete Appointment with RO (FK RESTRICT)
- UAT-SVC-005-DEL-SOFT-001: Soft Delete Repair Order (CANCELLED)
- UAT-SVC-005-DEL-FK-001: Delete RO with Line Items (FK CASCADE test)
- UAT-SVC-007-DEL-SOFT-001: Delete Work Log
- UAT-SVC-008-DEL-SOFT-001: Delete QC Checklist
- UAT-SVC-009-DEL-SOFT-001: Soft Delete Settlement
- UAT-SVC-006-DEL-SOFT-001: Delete Bay Assignment (completed)
- UAT-SVC-005-DEL-FILE-001: Delete RO with Attachments (file cleanup)

---

#### Parts Module (8 DELETE scenarios)
- UAT-PRT-001-DEL-SOFT-001: Soft Delete Part (inactive)
- UAT-PRT-001-DEL-FK-001: Delete Part with Stock Movements (FK RESTRICT)
- UAT-PRT-003-DEL-SOFT-001: Delete Stock Movement (adjustment)
- UAT-PRT-004-DEL-SOFT-001: Soft Delete Purchase Order (DRAFT)
- UAT-PRT-004-DEL-FK-001: Delete PO with Received Items (FK test)
- UAT-PRT-006-DEL-SOFT-001: Soft Delete Stock Take
- UAT-PRT-008-DEL-SOFT-001: Soft Delete Supplier
- UAT-PRT-008-DEL-FK-001: Delete Supplier with POs (FK RESTRICT)

---

#### Insurance Module (6 DELETE scenarios)
- UAT-INS-001-DEL-SOFT-001: Soft Delete Insurance Contract (EXPIRED)
- UAT-INS-001-DEL-FK-001: Delete Contract with Claims (FK RESTRICT)
- UAT-INS-003-DEL-SOFT-001: Soft Delete Claim (REJECTED)
- UAT-INS-003-DEL-FILE-001: Delete Claim with Uploaded Files (file cleanup)
- UAT-INS-001-DEL-HARD-001: Hard Delete Contract (Admin, no claims)
- UAT-INS-003-DEL-FK-001: Delete Claim with Payments (FK test)

---

#### Accounting Module (8 DELETE scenarios)
- UAT-ACC-001-DEL-SOFT-001: Soft Delete Invoice (CANCELLED)
- UAT-ACC-001-DEL-FK-001: Delete Invoice with Payments (FK RESTRICT)
- UAT-ACC-003-DEL-SOFT-001: Soft Delete Payment (VOIDED)
- UAT-ACC-005-DEL-SOFT-001: Soft Delete Journal Entry
- UAT-ACC-006-DEL-SOFT-001: Soft Delete Fixed Asset
- UAT-ACC-006-DEL-FILE-001: Delete Asset with Photos (file cleanup)
- UAT-ACC-008-DEL-SOFT-001: Delete Reconciliation
- UAT-ACC-001-DEL-HARD-001: Hard Delete Invoice (Admin, no payments)

---

#### Admin Module (6 DELETE scenarios)
- UAT-ADM-001-DEL-SOFT-001: Soft Delete User (deactivate)
- UAT-ADM-001-DEL-FK-001: Delete User with Created Records (FK test)
- UAT-ADM-001-DEL-HARD-001: Hard Delete User (Admin, no FK refs)
- UAT-ADM-002-DEL-SOFT-001: Delete Custom Role
- UAT-ADM-002-DEL-FK-001: Delete Role with Assigned Users (FK RESTRICT)
- UAT-ADM-004-DEL-SOFT-001: Reset System Setting (delete custom value)

---

## 📊 DELETE Coverage Matrix

| Module | Soft Delete | Hard Delete | FK Constraint | File Cleanup | Total |
|--------|-------------|-------------|---------------|--------------|-------|
| CRM | 7 | 0 | 3 | 0 | 10 |
| Sales | 7 | 2 | 3 | 2 | 12 |
| Service | 7 | 0 | 2 | 1 | 10 |
| Parts | 5 | 0 | 3 | 0 | 8 |
| Insurance | 2 | 1 | 2 | 1 | 6 |
| Accounting | 5 | 1 | 1 | 1 | 8 |
| Admin | 3 | 1 | 2 | 0 | 6 |
| **TOTAL** | **36** | **5** | **16** | **5** | **60** |

---

## 📚 GROUPS 1-5 (From v1.0)

**Note**: Groups 1-5 remain unchanged from v1.0. See `uat_plan_full_system_v1.0.md` for details.

- **Group 1**: Create & Save (70 scenarios)
- **Group 2**: Update & Persist (57 scenarios)
- **Group 3**: File / Attachment (36 scenarios)
- **Group 4**: Status / Workflow (49 scenarios)
- **Group 5**: Validation & Error (58 scenarios)

---

## 📊 UAT Execution Plan (Updated)

### Phase 1: Critical Path (Weeks 1-2)
- Group 1: Create & Save (70 scenarios)
- Group 2: Update & Persist (57 scenarios)
- **Total**: 127 scenarios, ~40 hours

### Phase 2: File Operations (Week 3)
- Group 3: File / Attachment (36 scenarios)
- **Total**: 36 scenarios, ~12 hours

### Phase 3: Workflow (Week 4)
- Group 4: Status / Workflow (49 scenarios)
- **Total**: 49 scenarios, ~16 hours

### Phase 4: DELETE Operations (Week 5) **NEW**
- Group 6: DELETE (60 scenarios)
  - Soft Delete: 36 scenarios
  - Hard Delete: 5 scenarios
  - FK Constraints: 16 scenarios
  - File Cleanup: 5 scenarios
- **Total**: 60 scenarios, ~20 hours

### Phase 5: Validation (Week 6)
- Group 5: Validation & Error (58 scenarios)
- **Total**: 58 scenarios, ~18 hours

### Phase 6: Regression (Week 7)
- Re-run all CRITICAL scenarios (Groups 1, 2, 6)
- **Total**: 184 scenarios, ~24 hours

---

## ✅ TOTAL UAT SUMMARY (v2.0)

| Metric | Value |
|--------|-------|
| **Total Modules** | 8 |
| **Total Screens** | 58 |
| **Total Storage Points** | 232 (172 + 60 DELETE) |
| **Total UAT Scenarios** | **271** |
| **Estimated Execution Time** | **130 hours** (6.5 weeks) |

---

## 🎯 DELETE COVERAGE VALIDATION

- ✅ All entities with DELETE capability identified
- ✅ Soft Delete scenarios for all applicable entities (36)
- ✅ Hard Delete scenarios for admin-only operations (5)
- ✅ FK Constraint testing for all relationships (16)
- ✅ File cleanup testing for entities with attachments (5)
- ✅ NO entity with DELETE capability omitted

---

## 🚨 CRITICAL RULES (DELETE)

1. ✅ DELETE MUST be tested for EVERY entity that supports delete
2. ✅ Soft Delete vs Hard Delete MUST be clearly distinguished
3. ✅ FK constraints MUST be tested (RESTRICT / CASCADE / SET NULL)
4. ✅ File cleanup MUST be tested for entities with attachments
5. ✅ Audit trail MUST be preserved after soft delete
6. ❌ NEVER skip DELETE testing because "it's rarely used"
7. ❌ NEVER assume DELETE works without explicit testing

---

**Maintained By**: Antigravity (System UAT Authority)  
**Last Updated**: 2026-01-29  
**Version**: 2.0 (Added DELETE coverage)  
**Next Review**: After UAT execution

---

**End of UAT Plan Full System v2.0**
