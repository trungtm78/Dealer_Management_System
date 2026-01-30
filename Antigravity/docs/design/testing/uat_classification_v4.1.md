# UAT Classification Decision v4.0 (REVISED)

**Version**: 4.0  
**Date**: 2026-01-30  
**Classified By**: Antigravity - Design Authority & UAT Decision Maker  
**Source UAT Log**: `uat_execution_log_full_system_v3.0.md`  
**ERD Version**: v1.2 (56 tables, snake_case verified)  
**Total Scenarios Analyzed**: 359  
**Total FAIL Scenarios**: 335 (93.3%)  
**Total PASS Scenarios**: 24 (6.7%)

---

## 🚨 CRITICAL CORRECTION

**PHÁT HIỆN QUAN TRỌNG**: UAT Execution Log v3.0 có **SAI SÓT NGHIÊM TRỌNG** trong phân tích nguyên nhân.

### Sai Sót Trong UAT Log v3.0

UAT Log v3.0 (lines 85-88) báo cáo:
> **Error**: Schema Mismatch. Code uses `leadId`, `userId`, `startTime` (camelCase) while DB schema expects `lead_id`, `user_id`, `start_time` (snake_case).

### Kết Quả Rà Soát Thực Tế

Sau khi rà soát:
1. ✅ **Prisma Schema** (schema.prisma, 955 lines): Sử dụng snake_case đúng chuẩn
2. ✅ **Action Files** (customers.ts, quotations.ts, etc.): Sử dụng snake_case đúng chuẩn
3. ❌ **UAT Log v3.0**: Báo sai "Schema Mismatch"

**KẾT LUẬN**: **KHÔNG CÓ** schema mismatch (camelCase vs snake_case). Code đã đúng chuẩn từ đầu!

---

## 📋 EXECUTIVE SUMMARY (REVISED)

Sau khi rà soát chi tiết:
- ✅ ERD v1.2 (56 tables, snake_case)
- ✅ Prisma Schema (snake_case, match ERD)
- ✅ Action Files (snake_case, match Prisma)
- ✅ API Spec v1.0 (định nghĩa đầy đủ endpoints)

**KẾT LUẬN PHÂN LOẠI (REVISED)**:

| Classification | Count | % | Rationale |
|----------------|-------|---|-----------|
| **BUG** | 335 | 100% | Missing API endpoints + Implementation gaps |
| **CHANGE REQUEST** | 0 | 0% | Không có mâu thuẫn trong tài liệu thiết kế |

---

## 🔍 PHÂN TÍCH NGUYÊN NHÂN (REVISED)

### P0 - CRITICAL BLOCKING ISSUES (BUG)

#### ~~BUG-UAT-SCHEMA-001: Schema Mismatch~~ ❌ KHÔNG TỒN TẠI

**Status**: ❌ **FALSE POSITIVE** - UAT Log v3.0 báo sai

**Verification**:
- Prisma schema: `quote_number`, `customer_name`, `base_price`, `created_at` (snake_case) ✅
- Action files: `quote_number`, `customer_name`, `base_price`, `created_at` (snake_case) ✅
- **MATCH PERFECT** - Không có mismatch

**Kết luận**: Bug này **KHÔNG TỒN TẠI**. 272 scenarios bị FAIL KHÔNG PHẢI do schema mismatch.

---

#### BUG-UAT-API-001: Missing API Endpoints (REVISED)

**Classification**: ✅ **BUG**  
**Impact**: 255+ scenarios (76%)  
**Affected Modules**: CRM, Sales, Service, Parts, Insurance, Accounting, Supporting

**Expected Result** (theo API Spec v1.0):
- API Spec CRM định nghĩa 40 endpoints
- Ví dụ:
  - `POST /api/crm/interactions`
  - `POST /api/crm/reminders`
  - `POST /api/crm/loyalty-transactions`
  - `POST /api/crm/complaints`
  - `POST /api/crm/marketing-campaigns`
  - `POST /api/crm/scoring-rules`
  - `POST /api/service/quotes`
  - `POST /api/sales/test-drives`
  - `POST /api/parts/suppliers`
  - Và nhiều endpoints khác...

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
  - Line 192: `/api/service/quotes does not exist`

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
TASK: Implement Missing API Endpoints - BUG-UAT-API-001
PRIORITY: P0 - CRITICAL BLOCKER
ACTION: Implement all missing API endpoints defined in API Spec v1.0
SCOPE:
  - CRM Module: 21+ missing endpoints
    - /api/crm/interactions (CREATE, READ, UPDATE, DELETE)
    - /api/crm/reminders (CREATE, READ, UPDATE, DELETE)
    - /api/crm/loyalty-transactions (CREATE, READ, UPDATE, DELETE)
    - /api/crm/complaints (CREATE, READ, UPDATE, DELETE)
    - /api/crm/marketing-campaigns (CREATE, READ, UPDATE, DELETE)
    - /api/crm/scoring-rules (CREATE, READ, UPDATE, DELETE)
  
  - Sales Module: 
    - /api/sales/test-drives (CREATE, READ, UPDATE, DELETE)
    - /api/sales/contracts (CREATE, READ, UPDATE, DELETE)
    - /api/sales/pds-checklists (CREATE, READ, UPDATE, DELETE)
    - /api/sales/deliveries (CREATE, READ, UPDATE, DELETE)
  
  - Service Module:
    - /api/service/quotes (CREATE, READ, UPDATE, DELETE)
    - /api/service/work-logs (CREATE, READ, UPDATE, DELETE)
    - /api/service/qc-checklists (CREATE, READ, UPDATE, DELETE)
    - /api/service/settlements (CREATE, READ, UPDATE, DELETE)
  
  - Parts Module:
    - /api/parts/parts (CREATE, READ, UPDATE, DELETE)
    - /api/parts/suppliers (CREATE, READ, UPDATE, DELETE)
    - /api/parts/purchase-orders (CREATE, READ, UPDATE, DELETE)
    - /api/parts/stock-takes (CREATE, READ, UPDATE, DELETE)
  
  - Accounting Module:
    - /api/accounting/invoices (CREATE, READ, UPDATE, DELETE)
    - /api/accounting/payments (CREATE, READ, UPDATE, DELETE)
    - /api/accounting/fixed-assets (CREATE, READ, UPDATE, DELETE)
    - /api/accounting/tax-declarations (CREATE, READ, UPDATE, DELETE)
    - /api/accounting/reconciliations (CREATE, READ, UPDATE, DELETE)
  
  - Supporting Module:
    - /api/supporting/vehicle-models (CREATE, READ, UPDATE, DELETE)
    - /api/supporting/accessories (CREATE, READ, UPDATE, DELETE)
    - /api/supporting/services-catalog (CREATE, READ, UPDATE, DELETE)
    - /api/supporting/system-settings (CREATE, READ, UPDATE, DELETE)

REFERENCE: 
  - API Spec v1.0: docs/design/api/api_spec_02_crm.md (and other modules)
  - ERD v1.2: docs/design/database/erd/erd_description_v1.2.md
  - Prisma Schema: prisma/schema.prisma (ALREADY CORRECT - snake_case)

VERIFICATION:
  - Run: npm run test:integration
  - Test: All endpoints return 200/201 (not 404)
  - Re-run: UAT scenarios for all modules
  - Expected: UAT pass rate ≥ 80%
```

---

### P1 - HIGH PRIORITY ISSUES (BUG)

#### BUG-UAT-DELETE-002: Soft Delete vs Hard Delete Confusion

**Classification**: ✅ **BUG**  
**Impact**: 8 scenarios  
**Affected Entities**: `users`, `customers`

**Expected Result** (theo ERD v1.2):
- ERD v1.2: "Soft Delete (deleted_at field)" cho:
  - `users`
  - `customers`
  - `parts`
  - `suppliers`
  - Master data tables

**Actual Result** (theo UAT Log):
- UAT Log v3.0 (lines 41-53):
  - UAT-ADM-006-DEL-SOFT: `deleteUser` performs **hard delete** (`prisma.user.delete`)
  - **NHƯNG** khi kiểm tra code thực tế:
    - `customers.ts` (lines 221-236): **ĐÃ SỬ DỤNG SOFT DELETE** ✅
    ```typescript
    await prisma.customer.update({
        where: { id },
        data: { 
            status: 'INACTIVE',
            deleted_at: new Date()
        }
    });
    ```

**Verification**:
- ✅ `customers.ts`: Soft delete implemented correctly
- ❌ `users.ts`: Cần kiểm tra (UAT log báo hard delete)

**Phạm vi ảnh hưởng**:
- ❌ Backend: `users.ts` delete action (cần verify)
- ✅ Backend: `customers.ts` delete action (đã đúng)

**Hành động tiếp theo**:
1. Verify `actions/admin/users.ts` delete function
2. Nếu sai → Fix to use soft delete
3. Re-run UAT delete scenarios

**Chỉ đạo cho OpenCode**:
```
TASK: Verify and Fix Soft Delete - BUG-UAT-DELETE-002
PRIORITY: P1 - HIGH
ACTION: Verify soft delete implementation for users
SCOPE:
  - actions/admin/users.ts: Verify deleteUser function
  - If using hard delete → Change to UPDATE deleted_at = now()
  - Ensure status = 'INACTIVE' or deleted_at is set
REFERENCE: 
  - ERD v1.2: Soft delete strategy
  - customers.ts (lines 221-236): Reference implementation ✅
VERIFICATION:
  - Test: Delete user → deleted_at set, record still in DB
  - Re-run: UAT-ADM-006-DEL-SOFT
```

---

#### BUG-UAT-FK-003: Foreign Key Constraint Not Enforced

**Classification**: ✅ **BUG**  
**Impact**: 3 scenarios  
**Affected Entities**: `users`, `leads`

**Expected Result** (theo ERD v1.2):
- ERD v1.2: Foreign key relationships defined
- `leads.assigned_to_id` → `users.id` (should have onDelete: Restrict)

**Actual Result** (theo UAT Log):
- UAT Log v3.0 (lines 48-53):
  - UAT-ADM-008-DEL-FK: Delete user successful, `assigned_to_id` in `leads` became NULL
  - Expected: Delete blocked due to FK reference (RESTRICT)

**Verification** (Prisma Schema):
```prisma
model Lead {
  assigned_to_id  String?
  assignedTo   User?  @relation("AssignedTo", fields: [assigned_to_id], references: [id], onDelete: Restrict)
}
```

**Status**: ✅ **PRISMA SCHEMA ĐÃ ĐÚNG** - có `onDelete: Restrict`

**Phạm vi ảnh hưởng**:
- ✅ Prisma schema: FK constraint defined correctly
- ❌ Runtime behavior: Constraint not enforced (SQLite limitation?)

**Hành động tiếp theo**:
1. Verify database type (SQLite vs PostgreSQL)
2. SQLite có thể không enforce FK constraints by default
3. Nếu dùng SQLite → Enable FK constraints: `PRAGMA foreign_keys = ON`
4. Re-run UAT FK scenarios

**Chỉ đạo cho OpenCode**:
```
TASK: Enable Foreign Key Constraints - BUG-UAT-FK-003
PRIORITY: P1 - HIGH
ACTION: Ensure FK constraints are enforced at runtime
SCOPE:
  - Check database type (SQLite vs PostgreSQL)
  - If SQLite: Enable FK constraints in connection string
    DATABASE_URL="file:./dev.db?mode=memory&cache=shared&foreign_keys=ON"
  - If PostgreSQL: FK constraints enabled by default
VERIFICATION:
  - Test: Delete user with assigned leads → should fail with FK error
  - Re-run: UAT-ADM-008-DEL-FK
```

---

### P2 - MEDIUM PRIORITY ISSUES (BUG)

#### BUG-UAT-LOGGING-004: Activity Logging Not Implemented

**Classification**: ✅ **BUG**  
**Impact**: 5 scenarios  
**Affected Entity**: `activity_logs`

**Expected Result** (theo ERD v1.2):
- ERD v1.2: `activity_logs` - Audit log (append-only)
- Automatic creation of activity log entries after system actions

**Actual Result** (theo UAT Log):
- UAT Log v3.0 (lines 56-61):
  - UAT-ADM-009-CREATE: No logs found in `activity_logs` table
  - System-wide activity logging middleware or hooks are missing

**Phạm vi ảnh hưởng**:
- ❌ Backend: Missing middleware/hooks
- ❌ Audit Trail: No audit compliance

**Hành động tiếp theo**:
1. Implement activity logging middleware
2. Add hooks for CREATE/UPDATE/DELETE operations
3. Re-run UAT logging scenarios

**Chỉ đạo cho OpenCode**:
```
TASK: Implement Activity Logging - BUG-UAT-LOGGING-004
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

#### BUG-UAT-METRICS-005: System Metrics Not Collected

**Classification**: ✅ **BUG**  
**Impact**: 5 scenarios  
**Affected Entity**: `system_metrics`

**Expected Result** (theo ERD v1.2):
- ERD v1.2: `system_metrics` - System monitoring
- Periodic/automatic metric generation

**Actual Result** (theo UAT Log):
- UAT Log v3.0 (lines 63-67):
  - UAT-ADM-011-CREATE to UAT-ADM-015-VAL: `system_metrics` table is empty
  - Background monitor or metric collection service is not running

**Phạm vi ảnh hưởng**:
- ❌ Backend: Missing background service
- ❌ Monitoring: No system metrics

**Hành động tiếp theo**:
1. Implement background metric collection service
2. Collect CPU, Memory, Disk metrics periodically
3. Re-run UAT metrics scenarios

**Chỉ đạo cho OpenCode**:
```
TASK: Implement System Metrics - BUG-UAT-METRICS-005
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

#### BUG-UAT-VALIDATION-006: Missing Field Validation

**Classification**: ✅ **BUG**  
**Impact**: 2 scenarios  
**Affected Entity**: `customers`

**Expected Result** (theo API Spec CRM):
- API-CRM-014: Update Customer with all fields including `status`

**Actual Result** (theo UAT Log):
- UAT Log v3.0 (lines 69-73):
  - UAT-CRM-004-STATUS: Customer updated but `status` remains unchanged

**Verification** (customers.ts):
```typescript
const allowedFields = [
    'name', 'phone', 'mobile', 'email', 'type', 'street',
    'city', 'district', 'ward', 'vat', 'notes',
    'tags', 'tier', 'points', 'total_points', 'status'  // ✅ status IS included
];
```

**Status**: ✅ **CODE ĐÃ ĐÚNG** - `status` có trong allowedFields

**Phạm vi ảnh hưởng**:
- ✅ Backend: Field validation correct
- ❌ UAT Log: Có thể test sai hoặc có vấn đề khác

**Hành động tiếp theo**:
1. Re-test UAT-CRM-004-STATUS scenario
2. Verify request payload includes `status` field
3. Check if status value is valid ENUM

**Chỉ đạo cho OpenCode**:
```
TASK: Re-verify Customer Status Update - BUG-UAT-VALIDATION-006
PRIORITY: P2 - MEDIUM
ACTION: Re-test customer status update scenario
SCOPE:
  - Verify allowedFields includes 'status' (ALREADY DONE ✅)
  - Test with valid status values: ACTIVE, INACTIVE
  - Check response and DB state
VERIFICATION:
  - Test: Update customer status → status changes
  - Re-run: UAT-CRM-004-STATUS
```

---

## 📊 CLASSIFICATION SUMMARY BY MODULE (REVISED)

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

## 🎯 PRIORITIZED BUG FIX ROADMAP (REVISED)

### Phase 1: P0 Critical Blockers (Estimated: 5-7 days)
1. ✅ **BUG-UAT-API-001**: Implement Missing API Endpoints (255+ scenarios)
   - **Impact**: Fix ~76% of failures
   - **Effort**: 5-7 days (21+ endpoints × multiple modules)

**Expected Impact**: Fix ~76% of failures → UAT pass rate ≥ 80%

### Phase 2: P1 High Priority (Estimated: 2-3 days)
2. ✅ **BUG-UAT-DELETE-002**: Verify/Fix Soft Delete (8 scenarios)
3. ✅ **BUG-UAT-FK-003**: Enable FK Constraints (3 scenarios)

**Expected Impact**: Fix data integrity issues → UAT pass rate ≥ 85%

### Phase 3: P2 Medium Priority (Estimated: 2-3 days)
4. ✅ **BUG-UAT-LOGGING-004**: Implement Activity Logging (5 scenarios)
5. ✅ **BUG-UAT-METRICS-005**: Implement System Metrics (5 scenarios)
6. ✅ **BUG-UAT-VALIDATION-006**: Re-verify Field Validation (2 scenarios)

**Expected Impact**: Complete system features → UAT pass rate ≥ 90%

### Phase 4: Regression Testing (Estimated: 1-2 days)
- Re-run all 359 UAT scenarios
- Verify pass rate ≥ 90%
- Document remaining issues

**Total Estimated Effort**: 10-15 days

---

## ⚠️ QUY TẮC BẤT BIẾN

1. ✅ **Antigravity** là người DUY NHẤT được phân loại BUG vs CHANGE REQUEST
2. ✅ **OpenCode** không được tự phân loại
3. ✅ Không có file phân loại → OpenCode KHÔNG được sửa
4. ✅ Mọi thay đổi phải trace được về tài liệu & version
5. ✅ **100% FAIL scenarios** được phân loại là **BUG** vì implementation không đầy đủ

---

## 📝 TRACEABILITY

| Bug ID | Scenario Count | FRD Reference | ERD Reference | API Spec Reference |
|--------|---------------|---------------|---------------|-------------------|
| ~~BUG-UAT-SCHEMA-001~~ | ~~272~~ | ~~All~~ | ~~ERD v1.2~~ | ~~All~~ |
| **Status** | **❌ FALSE POSITIVE** | **Code đã đúng** | **No mismatch** | **Prisma = snake_case ✅** |
| BUG-UAT-API-001 | 255+ | SCR-CRM-001 to SCR-CRM-010 | ERD v1.2 | API Spec CRM v1.0 |
| BUG-UAT-DELETE-002 | 8 | SCR-ADM-001, SCR-CRM-002 | ERD v1.2 | API-CRM-015, API-ADM-003 |
| BUG-UAT-FK-003 | 3 | SCR-ADM-001 | ERD v1.2 | - |
| BUG-UAT-LOGGING-004 | 5 | SCR-ADM-002 | ERD v1.2 | - |
| BUG-UAT-METRICS-005 | 5 | SCR-ADM-002 | ERD v1.2 | - |
| BUG-UAT-VALIDATION-006 | 2 | SCR-CRM-002 | ERD v1.2 | API-CRM-014 |

---

## 🚀 NEXT STEPS FOR OPENCODE

1. **READ** this revised classification decision document
2. **PRIORITIZE** bugs by P0 → P1 → P2
3. **FIX** bugs according to instructions above
4. **VERIFY** each fix with specified tests
5. **RE-RUN** UAT scenarios after each phase
6. **REPORT** progress back to Antigravity

**Target**: Achieve ≥ 90% UAT pass rate after all bug fixes

---

## 🔍 LESSONS LEARNED

### 1. UAT Execution Quality Matters
- **Lesson**: UAT Log v3.0 contained false positive (schema mismatch)
- **Action**: Verify UAT findings against actual code before classification
- **Tool**: Always cross-check UAT logs with source code

### 2. Missing API Endpoints is Real Blocker
- **Lesson**: 76% of failures due to missing endpoints (404)
- **Action**: Implement API endpoints BEFORE writing business logic
- **Tool**: Use OpenAPI/Swagger to validate implementation

### 3. Code Review Before Classification
- **Lesson**: Prisma schema and Action files were already correct (snake_case)
- **Action**: Always verify code before accepting UAT findings
- **Tool**: Direct code inspection + ERD verification

---

**Document Status**: ✅ FINAL (REVISED)  
**Approved By**: Antigravity - Design Authority  
**Date**: 2026-01-30  
**Version**: 4.0 (Revised after ERD v1.2 verification)
