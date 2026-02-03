# UAT Classification Decision v3.0

**Version**: 3.0  
**Date**: 2026-01-30  
**Classified By**: Antigravity - Design Authority & UAT Decision Maker  
**Source UAT Log**: `uat_execution_log_full_system_v3.0.md`  
**Total Scenarios Analyzed**: 359  
**Total FAIL Scenarios**: 335 (93.3%)  
**Total PASS Scenarios**: 24 (6.7%)

---

## 📋 EXECUTIVE SUMMARY

Sau khi phân tích chi tiết 335 FAIL scenarios dựa trên:
- ✅ ERD v1.0 (49 tables, snake_case naming)
- ✅ API Spec v1.0 (40 CRM APIs + các module khác)
- ✅ FRD Modules (8 modules)
- ✅ UAT Execution Log v3.0

**KẾT LUẬN PHÂN LOẠI:**

| Classification | Count | % | Rationale |
|----------------|-------|---|-----------|
| **BUG** | 335 | 100% | Implementation không tuân thủ thiết kế đã được phê duyệt |
| **CHANGE REQUEST** | 0 | 0% | Không có mâu thuẫn trong tài liệu thiết kế |

---

## 🔍 PHÂN TÍCH NGUYÊN NHÂN

### P0 - CRITICAL BLOCKING ISSUES (BUG)

#### BUG-UAT-SCHEMA-001: Schema Mismatch (camelCase vs snake_case)
**Classification**: ✅ **BUG**  
**Impact**: 81% of all failures (272 scenarios)  
**Affected Modules**: Sales, Service, Insurance, Parts, Inventory

**Expected Result** (theo ERD v1.0):
- Database schema sử dụng **snake_case**
- Ví dụ: `quote_number`, `customer_name`, `base_price`, `created_at`

**Actual Result** (theo UAT Log):
- Action files sử dụng **camelCase**
- Ví dụ: `quoteNumber`, `customerName`, `basePrice`, `createdAt`

**Evidence**:
- ERD v1.0 (lines 200-233): Định nghĩa rõ ràng snake_case cho tất cả fields
- UAT Log v3.0 (lines 505-549): "Schema mismatch between Action/API code and Prisma database schema"
- Specific examples:
  - `quotations`: 12 field mismatches
  - `service_appointments`: 8 field mismatches
  - `insurance_contracts`: 12 field mismatches
  - `test_drives`: 7 field mismatches
  - `vins`: 6 field mismatches

**Phạm vi ảnh hưởng**:
- ❌ Backend: Actions files (quotations, service, insurance, parts, inventory)
- ❌ API: All CREATE/UPDATE operations fail
- ❌ Database: Query mismatch errors

**Hành động tiếp theo**:
1. ✅ **FIX CODE** - Không cập nhật tài liệu
2. Sửa tất cả Action files để sử dụng snake_case theo ERD
3. Update Prisma client generation
4. Re-run Unit Tests
5. Re-run UAT scenarios

**Chỉ đạo cho OpenCode**:
```
TASK: Fix Schema Mismatch - BUG-UAT-SCHEMA-001
PRIORITY: P0 - CRITICAL BLOCKER
ACTION: Update all Action files to use snake_case field names matching ERD v1.0
SCOPE: 
  - actions/sales/*.ts (quotations, test_drives, contracts, deposits, pds_checklists)
  - actions/service/*.ts (service_quotes, service_appointments, repair_orders)
  - actions/insurance/*.ts (insurance_contracts, insurance_claims)
  - actions/parts/*.ts (parts, suppliers, purchase_orders, stock_movements)
  - actions/inventory/vehicles.ts
VERIFICATION:
  - Run: npm run test (all unit tests must pass)
  - Re-run: UAT scenarios for affected modules
  - Expected: 0 schema mismatch errors
```

---

#### BUG-UAT-API-002: Missing API Endpoints
**Classification**: ✅ **BUG**  
**Impact**: 76% of APIs return 404 (255 scenarios)  
**Affected Modules**: All modules except Admin (partial)

**Expected Result** (theo API Spec v1.0):
- API Spec CRM định nghĩa 40 endpoints
- Ví dụ:
  - `POST /api/crm/interactions`
  - `POST /api/crm/reminders`
  - `POST /api/crm/loyalty-transactions`
  - `POST /api/crm/complaints`
  - `POST /api/crm/marketing-campaigns`
  - `POST /api/crm/scoring-rules`

**Actual Result** (theo UAT Log):
- Endpoints không tồn tại → 404 Not Found
- UAT Log v3.0 (lines 118-187): "API endpoint not found (404)"

**Evidence**:
- API Spec CRM v1.0: Định nghĩa đầy đủ 40 APIs
- UAT Log v3.0: 
  - Line 122: `/api/crm/interactions does not exist`
  - Line 128: `/api/crm/reminders does not exist`
  - Line 136: `/api/crm/loyalty-transactions does not exist`
  - Line 144: `/api/crm/complaints does not exist`
  - Line 150: `/api/crm/marketing-campaigns does not exist`
  - Line 157: `/api/crm/scoring-rules does not exist`

**Phạm vi ảnh hưởng**:
- ❌ Backend: Missing route handlers
- ❌ API: Cannot test business logic
- ❌ Frontend: Cannot integrate

**Hành động tiếp theo**:
1. ✅ **FIX CODE** - Không cập nhật tài liệu
2. Implement missing API endpoints theo API Spec v1.0
3. Implement CRUD operations (CREATE, READ, UPDATE, DELETE)
4. Add proper validation and error handling
5. Re-run Integration Tests
6. Re-run UAT scenarios

**Chỉ đạo cho OpenCode**:
```
TASK: Implement Missing API Endpoints - BUG-UAT-API-002
PRIORITY: P0 - CRITICAL BLOCKER
ACTION: Implement all missing API endpoints defined in API Spec v1.0
SCOPE:
  - CRM Module: 21+ missing endpoints (interactions, reminders, loyalty, complaints, marketing, scoring)
  - Sales Module: test-drives, contracts, pds-checklists, deliveries
  - Service Module: service-quotes, work-logs, qc-checklists, settlements
  - Parts Module: parts, suppliers, purchase-orders, stock-takes
  - Accounting Module: invoices, payments, fixed-assets, tax-declarations, reconciliations
  - Supporting Module: vehicle-models, accessories, services-catalog, system-settings
REFERENCE: 
  - API Spec v1.0: docs/design/api/api_spec_02_crm.md (and other modules)
  - ERD v1.0: docs/design/database/erd/erd_description_v1.0.md
VERIFICATION:
  - Run: npm run test:integration
  - Test: All endpoints return 200/201 (not 404)
  - Re-run: UAT scenarios for all modules
```

---

### P1 - HIGH PRIORITY ISSUES (BUG)

#### BUG-UAT-DELETE-003: Soft Delete vs Hard Delete Confusion
**Classification**: ✅ **BUG**  
**Impact**: 8 scenarios  
**Affected Entities**: `users`, `customers`, `leads`

**Expected Result** (theo ERD v1.0):
- ERD v1.0 (lines 327-345): "Soft Delete (status = INACTIVE)" cho:
  - `users`
  - `customers`
  - `parts`
  - `suppliers`
  - Master data tables

**Actual Result** (theo UAT Log):
- UAT Log v3.0 (lines 41-53):
  - UAT-ADM-006-DEL-SOFT: `deleteUser` performs **hard delete** (`prisma.user.delete`)
  - UAT-CRM-007-DEL-SOFT: `deleteCustomer` performs **hard delete** (`prisma.customer.delete`)

**Evidence**:
- ERD v1.0 clearly defines soft delete strategy
- UAT Log shows physical deletion instead of status update

**Phạm vi ảnh hưởng**:
- ❌ Backend: Delete actions
- ❌ Database: Data loss risk
- ❌ Business Logic: Referential integrity issues

**Hành động tiếp theo**:
1. ✅ **FIX CODE** - Không cập nhật tài liệu
2. Update delete actions to use soft delete (UPDATE status = 'INACTIVE')
3. Add validation to prevent hard delete of master data
4. Re-run Unit Tests
5. Re-run UAT delete scenarios

**Chỉ đạo cho OpenCode**:
```
TASK: Fix Soft Delete Implementation - BUG-UAT-DELETE-003
PRIORITY: P1 - HIGH
ACTION: Update delete actions to use soft delete for master data
SCOPE:
  - actions/admin/users.ts: Change delete to UPDATE status = 'INACTIVE'
  - actions/crm/customers.ts: Change delete to UPDATE status = 'INACTIVE'
  - actions/parts/parts.ts: Change delete to UPDATE status = 'INACTIVE'
  - actions/parts/suppliers.ts: Change delete to UPDATE status = 'INACTIVE'
REFERENCE: ERD v1.0 (lines 327-345)
VERIFICATION:
  - Test: Delete user → status = 'INACTIVE', record still in DB
  - Test: Delete customer → status = 'INACTIVE', record still in DB
  - Re-run: UAT-ADM-006-DEL-SOFT, UAT-CRM-007-DEL-SOFT
```

---

#### BUG-UAT-FK-004: Foreign Key Constraint Not Enforced
**Classification**: ✅ **BUG**  
**Impact**: 3 scenarios  
**Affected Entities**: `users`, `leads`

**Expected Result** (theo ERD v1.0):
- ERD v1.0 (lines 156-183): Foreign key relationships defined
- `leads.assigned_to_id` → `users.id` (should have onDelete: Restrict)

**Actual Result** (theo UAT Log):
- UAT Log v3.0 (lines 48-53):
  - UAT-ADM-008-DEL-FK: Delete user successful, `assigned_to_id` in `leads` became NULL
  - Expected: Delete blocked due to FK reference (RESTRICT)

**Evidence**:
- ERD v1.0 defines FK relationships
- UAT Log shows FK constraint not enforced

**Phạm vi ảnh hưởng**:
- ❌ Database: Prisma schema missing `onDelete: Restrict`
- ❌ Data Integrity: Orphaned records possible

**Hành động tiếp theo**:
1. ✅ **FIX CODE** - Không cập nhật tài liệu
2. Update Prisma schema to add `onDelete: Restrict` for critical FKs
3. Run migration
4. Re-run UAT FK scenarios

**Chỉ đạo cho OpenCode**:
```
TASK: Fix Foreign Key Constraints - BUG-UAT-FK-004
PRIORITY: P1 - HIGH
ACTION: Update Prisma schema to enforce FK constraints
SCOPE:
  - prisma/schema.prisma: Add onDelete: Restrict for:
    - Lead.assignedTo (users)
    - Quotation.customer (customers)
    - Contract.customer (customers)
    - RepairOrder.customer (customers)
VERIFICATION:
  - Test: Delete user with assigned leads → should fail with FK error
  - Re-run: UAT-ADM-008-DEL-FK
```

---

### P2 - MEDIUM PRIORITY ISSUES (BUG)

#### BUG-UAT-LOGGING-005: Activity Logging Not Implemented
**Classification**: ✅ **BUG**  
**Impact**: 5 scenarios  
**Affected Entity**: `activity_logs`

**Expected Result** (theo ERD v1.0):
- ERD v1.0 (lines 65-66): `activity_logs` - Audit log (append-only)
- Automatic creation of activity log entries after system actions

**Actual Result** (theo UAT Log):
- UAT Log v3.0 (lines 56-61):
  - UAT-ADM-009-CREATE: No logs found in `activity_logs` table
  - System-wide activity logging middleware or hooks are missing

**Evidence**:
- ERD v1.0 defines activity_logs table
- UAT Log shows empty table

**Phạm vi ảnh hưởng**:
- ❌ Backend: Missing middleware/hooks
- ❌ Audit Trail: No audit compliance

**Hành động tiếp theo**:
1. ✅ **FIX CODE** - Không cập nhật tài liệu
2. Implement activity logging middleware
3. Add hooks for CREATE/UPDATE/DELETE operations
4. Re-run UAT logging scenarios

**Chỉ đạo cho OpenCode**:
```
TASK: Implement Activity Logging - BUG-UAT-LOGGING-005
PRIORITY: P2 - MEDIUM
ACTION: Implement system-wide activity logging
SCOPE:
  - Create middleware for activity logging
  - Hook into CREATE/UPDATE/DELETE operations
  - Log to activity_logs table
VERIFICATION:
  - Test: Create user → activity_logs has entry
  - Test: Update customer → activity_logs has entry
  - Re-run: UAT-ADM-009-CREATE
```

---

#### BUG-UAT-METRICS-006: System Metrics Not Collected
**Classification**: ✅ **BUG**  
**Impact**: 5 scenarios  
**Affected Entity**: `system_metrics`

**Expected Result** (theo ERD v1.0):
- ERD v1.0 (lines 66): `system_metrics` - System monitoring
- Periodic/automatic metric generation

**Actual Result** (theo UAT Log):
- UAT Log v3.0 (lines 63-67):
  - UAT-ADM-011-CREATE to UAT-ADM-015-VAL: `system_metrics` table is empty
  - Background monitor or metric collection service is not running

**Evidence**:
- ERD v1.0 defines system_metrics table
- UAT Log shows empty table

**Phạm vi ảnh hưởng**:
- ❌ Backend: Missing background service
- ❌ Monitoring: No system metrics

**Hành động tiếp theo**:
1. ✅ **FIX CODE** - Không cập nhật tài liệu
2. Implement background metric collection service
3. Collect CPU, Memory, Disk metrics periodically
4. Re-run UAT metrics scenarios

**Chỉ đạo cho OpenCode**:
```
TASK: Implement System Metrics Collection - BUG-UAT-METRICS-006
PRIORITY: P2 - MEDIUM
ACTION: Implement background service for system metrics
SCOPE:
  - Create background service for metric collection
  - Collect CPU, Memory, Disk usage
  - Store in system_metrics table
VERIFICATION:
  - Test: Start system → system_metrics has entries
  - Re-run: UAT-ADM-011-CREATE to UAT-ADM-015-VAL
```

---

#### BUG-UAT-VALIDATION-007: Missing Field Validation
**Classification**: ✅ **BUG**  
**Impact**: 2 scenarios  
**Affected Entity**: `customers`

**Expected Result** (theo API Spec CRM):
- API-CRM-014 (lines 176-184): Update Customer with all fields including `status`

**Actual Result** (theo UAT Log):
- UAT Log v3.0 (lines 69-73):
  - UAT-CRM-004-STATUS: Customer updated but `status` remains unchanged
  - `status` field is missing from `allowedFields` in `actions/crm/customers.ts`

**Evidence**:
- API Spec defines status field
- UAT Log shows status not updatable

**Phạm vi ảnh hưởng**:
- ❌ Backend: Missing field in allowedFields
- ❌ Business Logic: Cannot update status

**Hành động tiếp theo**:
1. ✅ **FIX CODE** - Không cập nhật tài liệu
2. Add `status` to allowedFields in customers action
3. Re-run UAT validation scenarios

**Chỉ đạo cho OpenCode**:
```
TASK: Fix Missing Field Validation - BUG-UAT-VALIDATION-007
PRIORITY: P2 - MEDIUM
ACTION: Add missing fields to allowedFields
SCOPE:
  - actions/crm/customers.ts: Add 'status' to allowedFields
VERIFICATION:
  - Test: Update customer status → status changes
  - Re-run: UAT-CRM-004-STATUS
```

---

## 📊 CLASSIFICATION SUMMARY BY MODULE

| Module | Total Scenarios | PASS | FAIL | BUG | CHANGE REQUEST |
|--------|----------------|------|------|-----|----------------|
| Admin | 15 | 7 | 8 | 8 | 0 |
| CRM | 60 | 13 | 47 | 47 | 0 |
| Sales | 55 | 0 | 55 | 55 | 0 |
| Service | 55 | 2 | 53 | 53 | 0 |
| Parts | 60 | 0 | 60 | 60 | 0 |
| Insurance | 20 | 2 | 18 | 18 | 0 |
| Accounting | 50 | 0 | 50 | 50 | 0 |
| Supporting | 30 | 0 | 30 | 30 | 0 |
| **TOTAL** | **359** | **24** | **335** | **335** | **0** |

---

## 🎯 PRIORITIZED BUG FIX ROADMAP

### Phase 1: P0 Critical Blockers (Estimated: 3-5 days)
1. ✅ **BUG-UAT-SCHEMA-001**: Fix Schema Mismatch (272 scenarios)
2. ✅ **BUG-UAT-API-002**: Implement Missing API Endpoints (255 scenarios)

**Expected Impact**: Fix 81% + 76% = ~90% of failures

### Phase 2: P1 High Priority (Estimated: 2-3 days)
3. ✅ **BUG-UAT-DELETE-003**: Fix Soft Delete Implementation (8 scenarios)
4. ✅ **BUG-UAT-FK-004**: Fix Foreign Key Constraints (3 scenarios)

**Expected Impact**: Fix remaining data integrity issues

### Phase 3: P2 Medium Priority (Estimated: 2-3 days)
5. ✅ **BUG-UAT-LOGGING-005**: Implement Activity Logging (5 scenarios)
6. ✅ **BUG-UAT-METRICS-006**: Implement System Metrics (5 scenarios)
7. ✅ **BUG-UAT-VALIDATION-007**: Fix Missing Field Validation (2 scenarios)

**Expected Impact**: Complete system features

### Phase 4: Regression Testing (Estimated: 1-2 days)
- Re-run all 359 UAT scenarios
- Verify pass rate ≥ 95%
- Document remaining issues

---

## ⚠️ QUY TẮC BẤT BIẾN

1. ✅ **Antigravity** là người DUY NHẤT được phân loại BUG vs CHANGE REQUEST
2. ✅ **OpenCode** không được tự phân loại
3. ✅ Không có file phân loại → OpenCode KHÔNG được sửa
4. ✅ Mọi thay đổi phải trace được về tài liệu & version
5. ✅ **100% FAIL scenarios** được phân loại là **BUG** vì implementation không tuân thủ thiết kế

---

## 📝 TRACEABILITY

| Bug ID | Scenario IDs | FRD Reference | ERD Reference | API Spec Reference |
|--------|-------------|---------------|---------------|-------------------|
| BUG-UAT-SCHEMA-001 | 272 scenarios | All modules | ERD v1.0 (lines 200-233) | All API Specs |
| BUG-UAT-API-002 | 255 scenarios | SCR-CRM-001 to SCR-CRM-010 | ERD v1.0 | API Spec CRM v1.0 |
| BUG-UAT-DELETE-003 | 8 scenarios | SCR-ADM-001, SCR-CRM-002 | ERD v1.0 (lines 327-345) | API-CRM-015, API-ADM-003 |
| BUG-UAT-FK-004 | 3 scenarios | SCR-ADM-001 | ERD v1.0 (lines 156-183) | - |
| BUG-UAT-LOGGING-005 | 5 scenarios | SCR-ADM-002 | ERD v1.0 (lines 65-66) | - |
| BUG-UAT-METRICS-006 | 5 scenarios | SCR-ADM-002 | ERD v1.0 (line 66) | - |
| BUG-UAT-VALIDATION-007 | 2 scenarios | SCR-CRM-002 | ERD v1.0 | API-CRM-014 |

---

## 🚀 NEXT STEPS FOR OPENCODE

1. **READ** this classification decision document
2. **PRIORITIZE** bugs by P0 → P1 → P2
3. **FIX** bugs according to instructions above
4. **VERIFY** each fix with specified tests
5. **RE-RUN** UAT scenarios after each phase
6. **REPORT** progress back to Antigravity

**Target**: Achieve ≥ 95% UAT pass rate after all bug fixes

---

**Document Status**: ✅ FINAL  
**Approved By**: Antigravity - Design Authority  
**Date**: 2026-01-30  
**Version**: 3.0
