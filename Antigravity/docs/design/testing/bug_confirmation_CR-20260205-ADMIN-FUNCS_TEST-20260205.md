# Bug Confirmation Decision: CR-20260205-ADMIN-FUNCS

**CR ID**: CR-20260205-ADMIN-FUNCS  
**UAT RUN-ID**: TEST-20260205-ADMIN-FUNCS  
**Module**: Master Data (Departments, Positions, Levels, Employees)  
**Date**: 2026-02-05  
**Confirmed By**: Antigravity - Bug Confirmation Authority  
**Status**: CONFIRMED ✅

---

## 📋 EXECUTIVE SUMMARY

**Total Bugs Reported**: 32  
**Bugs Confirmed**: 3 (CRITICAL)  
**ENV Issues**: 29 (HIGH)  
**Change Requests**: 0  
**Need More Info**: 0

**Decision**: **3 BUGS CONFIRMED** - OpenCode được phép sửa code

---

## 🔍 BUG ANALYSIS

### Bug Group 1: Schema Mismatch - Missing `deleted_at` field

**Bug IDs**: #1, #2, #3  
**Severity**: CRITICAL  
**Decision**: ✅ **CONFIRMED BUG**

#### Evidence
**Test Report**: `test_report_CR-20260205-ADMIN-FUNCS_EXECUTED.md`  
**Error Message**:
```
Invalid `prisma.master_departments.findMany()` invocation:
Unknown argument `deleted_at`. Available options are marked with ?.
```

**Affected Files**:
- `app/api/shared/search/departments/route.ts:25`
- `app/api/shared/search/positions/route.ts:25`
- `app/api/shared/search/employee-levels/route.ts:25`

**Code Snippet (BUG)**:
```typescript
const where: any = {
    ...(filter?.excludedIds && { id: { notIn: filter.excludedIds } }),
    ...(context?.onlyActive !== false && { status: "ACTIVE" }),
    deleted_at: null  // ❌ BUG: Field doesn't exist in schema!
};
```

#### Trace to Documents

**Schema Verification** (`prisma/schema.prisma`):
```prisma
// Lines 863-877
model master_departments {
  id             String    @id @default(cuid())
  department_code String    @unique
  department_name String
  description    String?
  status         String    @default("ACTIVE")
  created_at     DateTime  @default(now())
  updated_at     DateTime  @updatedAt
  employees      Employee[]
  _count         Count[]
  @@index([status])
  @@index([department_code])
}
// ❌ NO deleted_at field!
```

**ERD Draft Verification** (`erd_master_data_CR-20260205-ADMIN-FUNCS_DRAFT/erd_description_DRAFT.md`):
- Line 115: "✅ `master_departments` (exists, **no changes**)"
- Line 116: "✅ `master_positions` (exists, **no changes**)"
- Line 117: "✅ `master_levels` (exists, **no changes**)"
- Line 252-255: "**No changes to**: master_departments table, master_positions table, master_levels table"

**FRD Verification**: No requirement for soft-delete on master tables  
**API Spec Draft**: No mention of `deleted_at` filter for these endpoints

#### Confirmation Rationale

**Why CONFIRMED BUG**:
1. ✅ Code assumes `deleted_at` field exists
2. ✅ Schema does NOT have `deleted_at` field
3. ✅ ERD draft explicitly states "no changes" to these tables
4. ✅ No requirement in FRD/API Spec for soft-delete
5. ✅ Other tables (Customer, Lead, User, employees) HAVE `deleted_at`, but master tables DO NOT
6. ✅ This is a **code error**, not a missing requirement

**Hành vi thực tế ≠ mô tả trong tài liệu**:
- Code: Filters by `deleted_at: null`
- Schema: No `deleted_at` field
- ERD: No `deleted_at` field
- **Conclusion**: Code is wrong, schema is correct

#### Decision: ✅ CONFIRMED BUG

**Allowed Actions for OpenCode**:
- ✅ Fix code (remove `deleted_at: null` filter)
- ❌ DO NOT add `deleted_at` field to schema (not required)
- ❌ DO NOT update documents

**Fix Instruction**:
```typescript
// BEFORE (BUG):
const where: any = {
    ...(filter?.excludedIds && { id: { notIn: filter.excludedIds } }),
    ...(context?.onlyActive !== false && { status: "ACTIVE" }),
    deleted_at: null  // ❌ REMOVE THIS LINE
};

// AFTER (FIXED):
const where: any = {
    ...(filter?.excludedIds && { id: { notIn: filter.excludedIds } }),
    ...(context?.onlyActive !== false && { status: "ACTIVE" })
    // ✅ No deleted_at filter needed (master tables don't have soft-delete)
};
```

**Files to Fix**:
1. `app/api/shared/search/departments/route.ts:25`
2. `app/api/shared/search/positions/route.ts:25`
3. `app/api/shared/search/employee-levels/route.ts:25`

**Testing Required After Fix**:
- ✅ Unit tests (re-run all 13 tests for these 3 endpoints)
- ✅ Integration tests (verify SmartSelect works in UI)
- ✅ Manual UAT (test Department/Position/Level Management pages)

---

### Bug Group 2: Test Data Collision

**Bug IDs**: #4-32 (29 bugs)  
**Severity**: HIGH  
**Decision**: ⚙️ **ENV ISSUE** (NOT a code bug)

#### Evidence
**Error Message**:
```
Invalid `prisma.master_departments.create()` invocation:
Unique constraint failed on the fields: (`department_code`)
```

**Root Cause**: Tests use hardcoded codes (TEST-DEPT-001, TEST-POS-001, etc.) which may:
1. Conflict with existing data in database
2. Conflict with each other when tests run in parallel
3. Not clean up after themselves

#### Confirmation Rationale

**Why ENV ISSUE (NOT BUG)**:
1. ✅ Code logic is correct (unique constraint is working as expected)
2. ✅ This is a **test environment issue**, not a production code bug
3. ✅ Tests need better data isolation strategy
4. ✅ No changes to application code needed

#### Decision: ⚙️ ENV ISSUE

**Allowed Actions for OpenCode**:
- ✅ Fix test setup (use UUID-based codes or cleanup in `beforeEach`)
- ✅ Improve test data isolation
- ❌ DO NOT change application code
- ❌ DO NOT update documents

**Fix Instruction (Test Files Only)**:

**Option 1: Use UUID-based test codes** (RECOMMENDED):
```typescript
// BEFORE:
const department = await prisma.master_departments.create({
  data: {
    department_code: "TEST-DEPT-001",  // ❌ Hardcoded
    department_name: "Test Department",
    status: "ACTIVE"
  }
});

// AFTER:
const department = await prisma.master_departments.create({
  data: {
    department_code: `TEST-DEPT-${crypto.randomUUID().slice(0, 8)}`,  // ✅ Unique
    department_name: "Test Department",
    status: "ACTIVE"
  }
});
```

**Option 2: Clean up in `beforeEach`**:
```typescript
beforeEach(async () => {
  // Delete all test data before each test
  await prisma.master_departments.deleteMany({
    where: { department_code: { startsWith: "TEST-" } }
  });
  await prisma.master_positions.deleteMany({
    where: { position_code: { startsWith: "TEST-" } }
  });
  await prisma.master_levels.deleteMany({
    where: { level_code: { startsWith: "TEST-" } }
  });
  // ... cleanup other test data
});
```

**Files to Fix** (Test files only):
- `tests/api/shared/search/departments.test.ts`
- `tests/api/shared/search/positions.test.ts`
- `tests/api/shared/search/employee-levels.test.ts`
- `tests/api/shared/search/employees.test.ts`
- `tests/api/master/employees/create-user.test.ts`
- `tests/api/users/users-by-id.test.ts`
- `tests/api/master/employees/employees-modified.test.ts`

**Testing Required After Fix**:
- ✅ Re-run all 32 tests
- ✅ Verify tests pass independently
- ✅ Verify tests pass when run in parallel

---

## 📊 SUMMARY TABLE

| Bug ID | Severity | Decision | Scope | Fix Instruction |
|--------|----------|----------|-------|-----------------|
| **#1** | CRITICAL | ✅ CONFIRMED BUG | BE (API) | Remove `deleted_at: null` from departments search |
| **#2** | CRITICAL | ✅ CONFIRMED BUG | BE (API) | Remove `deleted_at: null` from positions search |
| **#3** | CRITICAL | ✅ CONFIRMED BUG | BE (API) | Remove `deleted_at: null` from employee-levels search |
| **#4-32** | HIGH | ⚙️ ENV ISSUE | Test Setup | Use UUID-based codes or cleanup in `beforeEach` |

---

## 🎯 OFFICIAL DECISION

### For Bug #1, #2, #3 (CRITICAL - Schema Mismatch)

**Decision**: ✅ **CONFIRMED BUG**

**Rationale**:
1. Code assumes `deleted_at` field exists in `master_departments`, `master_positions`, `master_levels`
2. Schema does NOT have `deleted_at` field in these tables
3. ERD draft explicitly states "no changes" to these tables
4. No requirement in FRD/API Spec for soft-delete on master tables
5. This is a **code error** (copy-paste from other endpoints that DO have `deleted_at`)

**Allowed Actions**:
- ✅ **Fix code**: Remove `deleted_at: null` filter from 3 API endpoints
- ✅ **Test**: Re-run unit tests, integration tests, manual UAT
- ❌ **DO NOT** add `deleted_at` field to schema (not required)
- ❌ **DO NOT** update documents (no document changes needed)

**Scope**: Backend (API) only - 3 files

**Priority**: CRITICAL - Must fix before deployment

**Estimated Effort**: 15 minutes (simple code change)

---

### For Bug #4-32 (HIGH - Test Data Collision)

**Decision**: ⚙️ **ENV ISSUE**

**Rationale**:
1. Application code is correct (unique constraint working as expected)
2. This is a **test environment issue**, not a production code bug
3. Tests need better data isolation strategy
4. No changes to application code needed

**Allowed Actions**:
- ✅ **Fix test setup**: Use UUID-based codes or cleanup in `beforeEach`
- ✅ **Improve test data isolation**: Ensure tests don't conflict
- ❌ **DO NOT** change application code
- ❌ **DO NOT** update documents

**Scope**: Test files only - 7 files

**Priority**: HIGH - Must fix for reliable testing

**Estimated Effort**: 30 minutes (update test setup)

---

## 📝 NEXT STEPS FOR OPENCODE

### Step 1: Fix Bug #1-3 (CRITICAL)

1. Open 3 files:
   - `app/api/shared/search/departments/route.ts`
   - `app/api/shared/search/positions/route.ts`
   - `app/api/shared/search/employee-levels/route.ts`

2. Find line with `deleted_at: null` (around line 25)

3. Remove that line

4. Save files

5. Run tests:
   ```bash
   npm test -- departments.test.ts
   npm test -- positions.test.ts
   npm test -- employee-levels.test.ts
   ```

6. Verify all 13 tests pass

### Step 2: Fix Bug #4-32 (ENV ISSUE)

1. Choose fix strategy (Option 1 recommended: UUID-based codes)

2. Update all 7 test files

3. Run all tests:
   ```bash
   npm test
   ```

4. Verify all 32 tests pass

### Step 3: Re-run Full Test Suite

```bash
npm test -- test_report_CR-20260205-ADMIN-FUNCS
```

### Step 4: Manual UAT

1. Test Department Management page
2. Test Position Management page
3. Test Level Management page
4. Test Employee Management page (SmartSelect filters)
5. Test Warehouse Management page (Manager SmartSelect)

### Step 5: Report Back

Create updated test report:
- `test_report_CR-20260205-ADMIN-FUNCS_FIXED.md`

---

## 🔖 REFERENCES

### Input Documents
- **Test Report**: `docs/requirements/change_requests/CR-20260205-ADMIN-FUNCS/test_report_CR-20260205-ADMIN-FUNCS_EXECUTED.md`
- **Schema**: `prisma/schema.prisma` (lines 863-877, 879-893, 895-909)
- **ERD Draft**: `docs/requirements/change_requests/CR-20260205-ADMIN-FUNCS/drafts/erd_master_data_CR-20260205-ADMIN-FUNCS_DRAFT/erd_description_DRAFT.md`
- **FRD Draft**: `docs/requirements/change_requests/CR-20260205-ADMIN-FUNCS/drafts/frd_master_data_CR-20260205-ADMIN-FUNCS_DRAFT.md`
- **API Spec Draft**: `docs/requirements/change_requests/CR-20260205-ADMIN-FUNCS/drafts/api_spec_CR-20260205-ADMIN-FUNCS_DRAFT.md`

### Related Documents
- **CR Intake**: `docs/requirements/change_requests/CR-20260205-ADMIN-FUNCS/change_request_CR-20260205-ADMIN-FUNCS_intake.md`
- **CR Impact Analysis**: `docs/requirements/change_requests/CR-20260205-ADMIN-FUNCS/change_request_CR-20260205-ADMIN-FUNCS_impact_analysis.md`
- **HANDOVER**: `docs/requirements/change_requests/CR-20260205-ADMIN-FUNCS/HANDOVER_TO_OPENCODE.md`

---

## ⚠️ CRITICAL REMINDERS

### For OpenCode:
1. ✅ **ONLY fix confirmed bugs** (Bug #1-3)
2. ✅ **ONLY fix test setup** (Bug #4-32)
3. ❌ **DO NOT** add `deleted_at` field to schema
4. ❌ **DO NOT** update documents
5. ❌ **DO NOT** make any other changes

### For Antigravity:
- ✅ Bug confirmation complete
- ✅ No document updates needed
- ✅ No Change Requests identified
- ✅ OpenCode can proceed with fixes

---

**Confirmed By**: Antigravity - Bug Confirmation Authority  
**Date**: 2026-02-05  
**Status**: CONFIRMED ✅  
**Next Step**: OpenCode fixes bugs → Re-run tests → Report back

---

**END OF BUG CONFIRMATION DECISION**
