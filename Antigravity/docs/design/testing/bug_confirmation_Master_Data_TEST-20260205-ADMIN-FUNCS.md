# BUG CONFIRMATION DECISION

**Module**: Master Data (Departments, Positions, Levels, Employees)  
**UAT RUN-ID**: TEST-20260205-ADMIN-FUNCS  
**Decision Date**: 2026-02-05  
**Decision By**: Antigravity (Bug Confirmation Authority)  
**Status**: READY FOR FIX

---

## 📋 SUMMARY

| Bug ID | Description | Category | Severity | Decision | Fix Scope |
|--------|-----------|----------|----------|----------|-----------|
| **BUG-20260205-ADMIN-FUNCS-001** | Missing `deleted_at` field in departments search | API/Schema | CRITICAL | CONFIRMED BUG | BE/DB |
| **BUG-20260205-ADMIN-FUNCS-002** | Missing `deleted_at` field in positions search | API/Schema | CRITICAL | CONFIRMED BUG | BE/DB |
| **BUG-20260205-ADMIN-FUNCS-003** | Missing `deleted_at` field in employee-levels search | API/Schema | CRITICAL | CONFIRMED BUG | BE/DB |
| **BUG-20260205-ADMIN-FUNCS-004** | Test data collision - hardcoded codes | Test Config | HIGH | CONFIRMED BUG | TEST |
| **BUG-20260205-ADMIN-FUNCS-005** | Test data collision - multiple files | Test Config | HIGH | CONFIRMED BUG | TEST |

---

## 🐛 DETAILED BUG ANALYSIS

### Bug #1: Missing `deleted_at` field in departments search

**Bug ID**: BUG-20260205-ADMIN-FUNCS-001  
**Type**: API/Schema Mismatch  
**Severity**: CRITICAL  
**Affected Files**:
- `app/api/shared/search/departments/route.ts:25`
- `app/api/shared/search/positions/route.ts:25`
- `app/api/shared/search/employee-levels/route.ts:25`

**Error Evidence**:
```
Invalid `prisma.master_departments.findMany()` invocation:
...
Unknown argument `deleted_at`. Available options are marked with ?.
```

**Tests Failed**: 13 tests

**Trace to Specifications**:

| Spec | Reference | Status |
|------|-----------|--------|
| **FRD** | `frd_master_data_CR-20260205-ADMIN-FUNCS_DRAFT.md` - FR-MD-005-02: Search Department | ✅ EXISTING |
| **API Spec** | `api_spec_CR-20260205-ADMIN-FUNCS_DRAFT.md` - POST /api/shared/search/departments | ✅ EXISTING |
| **ERD** | `prisma/schema.prisma` - master_departments table | ✅ EXISTING |

**Analysis**:

1. **FRD Requirement (FR-MD-005-02: Search Department)**:
   - Describes search by name, code, status
   - Does NOT mention soft-delete or `deleted_at` filter
   - ✅ FRD is clear: no soft-delete requirement

2. **API Spec (POST /api/shared/search/departments)**:
   - Specifies request/response format
   - Does NOT specify `deleted_at` filter
   - ✅ API Spec is clear: no soft-delete requirement

3. **ERD (prisma/schema.prisma)**:
   ```prisma
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
   // ❌ NO deleted_at field in schema!
   ```

4. **Implementation Bug**:
   ```typescript
   // app/api/shared/search/departments/route.ts:25
   const where: any = {
       ...(filter?.excludedIds && { id: { notIn: filter.excludedIds } }),
       ...(context?.onlyActive !== false && { status: "ACTIVE" }),
       deleted_at: null  // ❌ BUG: Field doesn't exist in schema!
   };
   ```

**Root Cause**: Implementation assumes soft-delete pattern with `deleted_at` field, but:
- Schema does NOT have `deleted_at` field
- FRD does NOT specify soft-delete requirement
- API Spec does NOT specify soft-delete requirement

**Conclusion**: ✅ CONFIRMED BUG

---

### Bug #2: Missing `deleted_at` field in positions search

**Bug ID**: BUG-20260205-ADMIN-FUNCS-002  
**Type**: API/Schema Mismatch  
**Severity**: CRITICAL  
**Affected Files**:
- `app/api/shared/search/positions/route.ts:25`
- (Same pattern as Bug #1)

**Error Evidence**: Same as Bug #1  
**Tests Failed**: 3 tests

**Trace to Specifications**:

| Spec | Reference | Status |
|------|-----------|--------|
| **FRD** | FR-MD-005-03 (Position Management) | ✅ EXISTING |
| **API Spec** | POST /api/shared/search/positions | ✅ EXISTING |
| **ERD** | master_positions table | ✅ EXISTING |

**Analysis**: Same as Bug #1. No soft-delete requirement in FRD or API Spec.

**Conclusion**: ✅ CONFIRMED BUG

---

### Bug #3: Missing `deleted_at` field in employee-levels search

**Bug ID**: BUG-20260205-ADMIN-FUNCS-003  
**Type**: API/Schema Mismatch  
**Severity**: CRITICAL  
**Affected Files**:
- `app/api/shared/search/employee-levels/route.ts:25`
- (Same pattern as Bug #1)

**Error Evidence**: Same as Bug #1  
**Tests Failed**: 3 tests

**Trace to Specifications**:

| Spec | Reference | Status |
|------|-----------|--------|
| **FRD** | FR-MD-005-04 (Level Management) | ✅ EXISTING |
| **API Spec** | POST /api/shared/search/employee-levels | ✅ EXISTING |
| **ERD** | master_levels table | ✅ EXISTING |

**Analysis**: Same as Bug #1. No soft-delete requirement in FRD or API Spec.

**Conclusion**: ✅ CONFIRMED BUG

---

### Bug #4: Test data collision - hardcoded codes

**Bug ID**: BUG-20260205-ADMIN-FUNCS-004  
**Type**: Test Configuration Issue  
**Severity**: HIGH  
**Affected Files**:
- `tests/api/shared/search/departments.test.ts:13`
- `tests/api/shared/search/positions.test.ts:12`
- `tests/api/shared/search/employee-levels.test.ts:12`
- `tests/api/shared/search/employees.test.ts:12`
- `tests/api/master/employees/create-user.test.ts:13`
- `tests/api/users/users-by-id.test.ts:13`
- `tests/api/master/employees/employees-modified.test.ts:11`

**Error Evidence**:
```
Invalid `prisma.master_departments.create()` invocation:
Unique constraint failed on the fields: (`department_code`)
```

**Tests Failed**: 19 tests

**Root Cause**: Multiple test files try to create test data with same hardcoded codes (TEST-DEPT-001, TEST-POS-001, etc.), causing unique constraint violations.

**Conflicting Test Data**:

| Test File | Department Code | Position Code | Level Code |
|-----------|-----------------|---------------|------------|
| departments.test.ts | TEST-DEPT-001 | TEST-POS-001 | TEST-LVL-001 |
| employees.test.ts | TEST-DEPT-002 | TEST-POS-002 | TEST-LVL-002 |
| users-by-id.test.ts | TEST-DEPT-004 | TEST-POS-004 | - |
| create-user.test.ts | TEST-DEPT-003 | TEST-POS-003 | TEST-LVL-003 |
| employees-modified.test.ts | TEST-DEPT-005 | TEST-POS-005 | TEST-LVL-005 |

**Analysis**:

1. **Test Design Issue**: Tests use hardcoded codes instead of UUID-based or timestamp-based codes
2. **Test Isolation Issue**: Tests do not clean up after themselves, and do not use unique codes
3. **Database Contamination**: Tests may conflict with existing data in database from previous runs

**Conclusion**: ✅ CONFIRMED BUG (Test Configuration Bug)

---

### Bug #5: Test data collision - unique constraint violations (remaining 19 tests)

**Bug ID**: BUG-20260205-ADMIN-FUNCS-005  
**Type**: Test Configuration Issue  
**Severity**: HIGH  
**Affected Files**: Same as Bug #4

**Tests Failed**: 19 tests (remaining from Bug #4)

**Conclusion**: ✅ CONFIRMED BUG (same root cause as Bug #4)

---

## 🔍 COMPREHENSIVE ANALYSIS

### Pattern Analysis

All 5 bugs fall into 2 categories:

**Category 1: Schema/Implementation Mismatch (3 bugs - CRITICAL)**
- Bugs: BUG-20260205-ADMIN-FUNCS-001, 002, 003
- Root Cause: Implementation assumes soft-delete pattern but schema doesn't support it
- Impact: All 3 SmartSelect search endpoints fail completely
- Tests Failed: 13 tests
- **Classification**: API/Schema Bug

**Category 2: Test Configuration (2 bugs - HIGH)**
- Bugs: BUG-20260205-ADMIN-FUNCS-004, 005
- Root Cause: Test data isolation issue with hardcoded codes
- Impact: Tests fail to create test data
- Tests Failed: 19 tests
- **Classification**: Test Configuration Bug

### Spec Compliance Check

| Bug | FRD Requirement | API Spec | ERD Rule | Status |
|-----|----------------|-----------|-----------|--------|
| BUG-001 | ✅ Met | ✅ Met | ❌ Violation | BUG |
| BUG-002 | ✅ Met | ✅ Met | ❌ Violation | BUG |
| BUG-003 | ✅ Met | ✅ Met | ❌ Violation | BUG |
| BUG-004 | ✅ Met | ✅ Met | ✅ Met | BUG |
| BUG-005 | ✅ Met | ✅ Met | ✅ Met | BUG |

---

## 📋 DECISION SUMMARY

### ✅ CONFIRMED BUGS (5 bugs)

| Bug ID | Decision | Reason | Fix Scope | Required Re-Test |
|--------|----------|--------|----------|-------------------|
| **BUG-20260205-ADMIN-FUNCS-001** | CONFIRMED BUG | Implementation violates schema by using non-existent `deleted_at` field | BE/DB | UT + IT + UAT |
| **BUG-20260205-ADMIN-FUNCS-002** | CONFIRMED BUG | Same as BUG-001 | BE/DB | UT + IT + UAT |
| **BUG-20260205-ADMIN-FUNCS-003** | CONFIRMED BUG | Same as BUG-001 | BE/DB | UT + IT + UAT |
| **BUG-20260205-ADMIN-FUNCS-004** | CONFIRMED BUG | Test configuration uses hardcoded codes causing collisions | TEST | UT + IT |
| **BUG-20260205-ADMIN-FUNCS-005** | CONFIRMED BUG | Same as BUG-004 | TEST | UT + IT |

### ❌ CHANGE REQUESTS (0 bugs)
None

### ⚙️ ENV ISSUES (0 bugs)
None

### ❓ NEED MORE INFO (0 bugs)
None

---

## 📝 FIX INSTRUCTIONS FOR OPENCODE

### Bug Group 1: Schema Mismatch (CRITICAL - Fix IMMEDIATELY)

**Fix Scope**: BE/DB  
**Allowed Changes**:
- **Option 1 (RECOMMENDED)**: Remove `deleted_at: null` filter from all 3 files
  ```typescript
  // Remove this line from:
  // app/api/shared/search/departments/route.ts:25
  // app/api/shared/search/positions/route.ts:25
  // app/api/shared/search/employee-levels/route.ts:25
  deleted_at: null  // ❌ DELETE THIS LINE
  
  // Keep only:
  const where: any = {
      ...(filter?.excludedIds && { id: { notIn: filter.excludedIds } }),
      ...(context?.onlyActive !== false && { status: "ACTIVE" }),
  };
  ```
- **Option 2**: Add `deleted_at` field to schema and migration (requires CR approval)
  ```prisma
  model master_departments {
    // ... existing fields
    deleted_at DateTime?  // ADD THIS
    @@index([deleted_at])  // ADD THIS
  }
  // Same for master_positions and master_levels
  ```

**NOT Allowed**:
- Do NOT change API contract (endpoint/method/request/response)
- Do NOT change business logic
- Do NOT change FRD or API Spec

**Required Re-Test**:
1. **Unit Test**: Run UT for all 3 SmartSelect endpoints
2. **Integration Test**: Test SmartSelect integration in frontend
3. **UAT**: Re-run UAT scenarios for Department, Position, Level management

**Test Evidence Required**:
- UT test output (pass/fail)
- IT test output (pass/fail)
- UAT re-run log with screenshots

---

### Bug Group 2: Test Configuration (HIGH - Fix LATER)

**Fix Scope**: TEST ONLY  
**Allowed Changes**:
- Modify test files to use UUID-based or timestamp-based test codes
- Add test cleanup in `beforeEach` to remove test data
- Use unique codes for each test run

**Example Fix**:
```typescript
beforeEach(async () => {
  // Clean up test data
  await prisma.master_departments.deleteMany({
    where: { department_code: { startsWith: "TEST-" } }
  });

  const department = await prisma.master_departments.create({
    data: {
      department_code: `TEST-DEPT-${crypto.randomUUID()}`, // UNIQUE
      department_name: "Test Department",
      status: "ACTIVE"
    }
  });
});
```

**NOT Allowed**:
- Do NOT modify production code
- Do NOT change schema
- Do NOT change API contract

**Required Re-Test**:
1. **Unit Test**: Run all test files after fix
2. **Integration Test**: Test affected endpoints

**Test Evidence Required**:
- UT test output (all 32 tests should pass)

---

## 🚨 IMPACT ASSESSMENT

### Production Impact

| Bug | Production Impact | Affected Users | Severity |
|-----|-------------------|----------------|----------|
| BUG-001, 002, 003 | **CRITICAL** - All 3 SmartSelect search endpoints fail with 500 error | All users who try to create/edit departments, positions, levels, employees, warehouses | CRITICAL |
| BUG-004, 005 | **NONE** - Only affects test execution | None | HIGH |

### Affected Modules

| Module | Affected Feature | Bug ID |
|--------|-----------------|--------|
| **Department Management** | Search/filter departments | BUG-001 |
| **Position Management** | Search/filter positions | BUG-002 |
| **Level Management** | Search/filter levels | BUG-003 |
| **Employee Management** | Department/position/level SmartSelect | BUG-001, 002, 003 |
| **Warehouse Management** | Manager SmartSelect (uses employee search) | BUG-003 |

---

## ✅ ACCEPTANCE CHECKLIST

### For Bug Group 1 (Schema Mismatch)
- [x] Bug evidence collected and documented
- [x] Traced to FRD/API/ERD
- [x] Confirmed as BUG (not CHANGE REQUEST or ENV ISSUE)
- [x] Fix scope clearly defined (BE/DB)
- [x] NOT allowed to change API contract
- [x] NOT allowed to change FRD or API Spec
- [x] Required re-test specified (UT + IT + UAT)
- [x] Test evidence required

### For Bug Group 2 (Test Configuration)
- [x] Bug evidence collected and documented
- [x] Root cause identified
- [x] Confirmed as BUG
- [x] Fix scope clearly defined (TEST ONLY)
- [x] NOT allowed to modify production code
- [x] Required re-test specified (UT + IT)
- [x] Test evidence required

---

## 📞 CONTACT

For questions or issues:
- **Bug Confirmation Authority**: Antigravity
- **Bug Fix Executor**: OpenCode
- **CR Documents**: `docs/requirements/change_requests/CR-20260205-ADMIN-FUNCS/`
- **Main Documents**: BRD v2.5, FRD Master Data v1.4, API Spec Draft, UI Spec Draft

---

**END OF BUG CONFIRMATION DECISION**

**Version**: 1.0
**Status**: READY FOR FIX
