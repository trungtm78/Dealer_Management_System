# Honda DMS - Refactoring Plan v1.0

**Refactor ID**: REF-HONDA-001  
**Version**: 1.0  
**Date**: 2026-01-28  
**Owner**: Antigravity (Refactoring Design Authority)  
**Reviewer**: OpenCode (Implementation Authority)  
**Refactor Type**: No-Logic-Change Refactor

---

## 📋 A. Overview

### Purpose
Cải tổ cấu trúc code Honda DMS để:
- Tăng khả năng bảo trì (maintainability)
- Giảm nợ kỹ thuật (technical debt)
- Chuẩn hóa patterns và conventions
- Cải thiện type safety (TypeScript)
- Loại bỏ code duplication

### Refactor Principles (BẤT BIẾN)
✅ **ĐƯỢC PHÉP**:
- Rename variables/functions/files (improve clarity)
- Extract functions/components (reduce complexity)
- Restructure folders (improve organization)
- Add TypeScript types (eliminate `any`)
- Remove dead code
- Standardize error handling
- Consolidate duplicate code
- Split large files into modules

❌ **KHÔNG ĐƯỢC PHÉP**:
- Thay đổi business logic
- Thay đổi API contracts (endpoints, methods, request/response schemas)
- Thay đổi DB schema/ERD
- Thay đổi UI behavior (user-facing functionality)
- Thay đổi data flow/state management logic

---

## 🎯 B. Scope (2-Phase Approach)

### Phase 1: Discovery & Analysis (1-2 days)

**Objective**: Scan codebase và identify refactoring opportunities

**Discovery Criteria**:
1. **File Size Analysis**
   - Files > 500 lines → candidate for splitting
   - Files > 1000 lines → high priority

2. **Code Duplication**
   - Duplicate code blocks > 10 lines
   - Similar patterns across files

3. **Complexity Analysis**
   - Functions with cyclomatic complexity > 10
   - Nested conditions > 3 levels

4. **Type Safety**
   - TypeScript `any` usage
   - Implicit types
   - Missing interface definitions

5. **Error Handling**
   - Inconsistent try-catch patterns
   - Missing error boundaries
   - Inconsistent error response formats

6. **Folder Structure**
   - Files not following `docs/instructions.md` conventions
   - Misplaced components/utilities

**Discovery Output**: `refactoring_discovery_report_v1.0.md`

### Phase 2: Execution (Iterative, 1-2 weeks)

**Scope by Priority**:

#### Priority 1: Low-Risk Refactoring (Week 1)
- ✅ TypeScript typing improvements
- ✅ Error handling standardization
- ✅ Dead code removal
- ✅ Naming conventions alignment
- ✅ Import organization

#### Priority 2: Medium-Risk Refactoring (Week 2)
- ✅ Extract utility functions
- ✅ Split large files (>500 lines)
- ✅ Consolidate duplicate code
- ✅ Folder restructuring

#### Priority 3: Deferred (Future iterations)
- ⏭️ State management refactoring
- ⏭️ Component architecture changes
- ⏭️ Performance optimizations

**Modules in Scope**:
- `app/` - Next.js App Router pages
- `components/` - React components (8 modules)
- `lib/` - Utilities and helpers
- `prisma/` - Database client (no schema changes)

---

## 🚫 C. Non-Goals (KHÓA CỨNG)

### Absolutely Prohibited
1. **No Business Logic Changes**
   - Calculations, validations, workflows MUST remain identical
   - Data transformations MUST produce same output

2. **No API Contract Changes**
   - Endpoints: Same URLs
   - Methods: Same HTTP methods
   - Request schemas: Same fields, types, validations
   - Response schemas: Same structure, fields, types
   - Status codes: Same codes for same conditions
   - Error codes: Same format `{MODULE}_{HTTP_CODE}`

3. **No Database Changes**
   - Schema: No table/column/index changes
   - Migrations: No new migrations
   - Queries: Same SQL/Prisma queries (structure may change, results must match)

4. **No UI Behavior Changes**
   - User interactions: Same flows
   - Loading states: Same behavior
   - Error states: Same messages/handling
   - Success states: Same feedback

### Verification Required
Every refactoring item MUST prove "no logic change" via:
- ✅ Unit tests pass (before & after)
- ✅ Integration tests pass
- ✅ API response snapshots match
- ✅ UI regression tests pass

---

## ⚠️ D. Risk Assessment

### Risk Categories

| Risk Level | Description | Mitigation |
|------------|-------------|------------|
| **LOW** | Typing, naming, formatting | Automated tests |
| **MEDIUM** | File splitting, extraction | Snapshot testing + manual review |
| **HIGH** | Folder restructuring, imports | Full regression suite |

### Identified Risks

#### Risk 1: Breaking Imports
- **Impact**: HIGH
- **Probability**: MEDIUM
- **Mitigation**: 
  - Use TypeScript compiler to catch import errors
  - Run full test suite after each change
  - Incremental commits with rollback plan

#### Risk 2: Hidden Coupling
- **Impact**: MEDIUM
- **Probability**: LOW
- **Mitigation**:
  - Analyze dependencies before refactoring
  - Test all affected modules
  - Maintain API contracts

#### Risk 3: Test Coverage Gaps
- **Impact**: MEDIUM
- **Probability**: MEDIUM
- **Mitigation**:
  - Increase test coverage before refactoring
  - Add integration tests for critical paths
  - Manual UAT for high-risk changes

---

## ✅ E. Acceptance Criteria

### Definition of "No Logic Change"

#### 1. API Behavior Unchanged
- ✅ Same response schema for all endpoints
- ✅ Same status codes (200, 201, 400, 404, etc.)
- ✅ Same error codes (`CRM_404`, `SAL_400`, etc.)
- ✅ Same validation rules
- ✅ Same data transformations

**Verification Method**: API snapshot testing
```bash
# Before refactor
npm run test:api:snapshot -- --update

# After refactor
npm run test:api:snapshot
# Must pass with 0 differences
```

#### 2. Database Behavior Unchanged
- ✅ Same queries executed (Prisma logs match)
- ✅ Same data written (INSERT/UPDATE/DELETE patterns match)
- ✅ Same transactions (BEGIN/COMMIT patterns match)

**Verification Method**: Database query logging
```bash
# Enable Prisma query logging
# Compare logs before/after refactor
```

#### 3. UI Behavior Unchanged
- ✅ Same user flows
- ✅ Same loading states
- ✅ Same error messages
- ✅ Same success feedback

**Verification Method**: E2E tests + Manual UAT

#### 4. Test Suite Passes
- ✅ All unit tests pass (100% of existing tests)
- ✅ All integration tests pass
- ✅ All E2E tests pass (Playwright)
- ✅ No new test failures introduced

**Verification Method**: CI/CD pipeline
```bash
npm run test        # Unit tests
npm run test:integration
npm run test:e2e
```

---

## 🔍 F. Verification Strategy

### 1. Baseline Snapshot (Before Refactor)

**API Endpoints to Snapshot** (Top 20 critical):
- `GET /api/dashboard/summary`
- `GET /api/crm/leads`
- `POST /api/crm/leads`
- `GET /api/crm/customers`
- `POST /api/crm/customers`
- `GET /api/sales/quotations`
- `POST /api/sales/quotations`
- `GET /api/service/orders`
- `POST /api/service/orders`
- `GET /api/parts`
- (... see full list in Discovery Report)

**Database Queries to Log**:
- All Prisma queries during test suite execution
- Transaction patterns
- Query performance metrics

**UI Flows to Record**:
- Login → Dashboard
- Create Lead → Convert to Customer
- Create Quotation → Create Contract
- Create Appointment → Create RO → Complete RO

### 2. Unit Test Scope

**Coverage Target**: Maintain current coverage (aim for 80%+)

**Test Categories**:
- ✅ Utility functions (lib/)
- ✅ API route handlers (app/api/)
- ✅ Database operations (Prisma)
- ✅ Business logic functions

**Command**:
```bash
npm run test -- --coverage
```

### 3. Integration Test Scope

**API Integration Tests**:
- ✅ CRM module (40 endpoints)
- ✅ Sales module (35 endpoints)
- ✅ Service module (30 endpoints)
- ✅ Dashboard module (5 endpoints)

**Database Integration Tests**:
- ✅ CRUD operations for all entities
- ✅ Relationships (JOIN queries)
- ✅ Transactions
- ✅ Constraints (UNIQUE, FK)

**Command**:
```bash
npm run test:integration
```

### 4. Regression Checklist

**Pre-Refactor Checklist**:
- [ ] All tests passing (baseline)
- [ ] API snapshots created
- [ ] DB query logs captured
- [ ] UI flows recorded (screenshots/videos)
- [ ] Performance metrics captured

**Post-Refactor Checklist**:
- [ ] All tests still passing
- [ ] API snapshots match (0 differences)
- [ ] DB query logs match (same queries)
- [ ] UI flows match (visual regression)
- [ ] Performance metrics within 5% of baseline

**Rollback Plan**:
- Git commit per refactoring item
- Ability to revert individual changes
- Full system backup before Phase 2

---

## 🧪 G. UAT Mini Pack

### Core Scenarios (Top 10)

#### Scenario 1: Dashboard Overview
- **Steps**: Login → View Dashboard
- **Expected**: All metrics display correctly
- **Pass Criteria**: Numbers match API responses

#### Scenario 2: Create Lead
- **Steps**: Navigate to CRM → Create Lead → Fill form → Submit
- **Expected**: Lead created, appears in list
- **Pass Criteria**: API returns 201, lead visible in Kanban

#### Scenario 3: Convert Lead to Customer
- **Steps**: Select Lead → Convert → Confirm
- **Expected**: Customer created, lead status = WON
- **Pass Criteria**: Customer appears in customers list

#### Scenario 4: Create Quotation
- **Steps**: Sales → New Quotation → Fill details → Save
- **Expected**: Quotation created with quote number
- **Pass Criteria**: Quotation appears in list, PDF generates

#### Scenario 5: Create Repair Order
- **Steps**: Service → New RO → Select customer → Add services → Save
- **Expected**: RO created with RO number
- **Pass Criteria**: RO appears in list, status = PENDING

#### Scenario 6: Search Customers
- **Steps**: CRM → Customers → Search "Nguyen"
- **Expected**: Matching customers displayed
- **Pass Criteria**: Results match database query

#### Scenario 7: Update Lead Score
- **Steps**: CRM → Lead Detail → Update Score → Save
- **Expected**: Score updated, lead re-ranked
- **Pass Criteria**: New score persisted, Kanban updated

#### Scenario 8: Assign Lead
- **Steps**: CRM → Lead → Assign to User → Save
- **Expected**: Lead assigned, user notified
- **Pass Criteria**: assigned_to_id updated

#### Scenario 9: Add Loyalty Points
- **Steps**: CRM → Customer → Add Points → Submit
- **Expected**: Points added, tier updated if threshold crossed
- **Pass Criteria**: Transaction logged, balance correct

#### Scenario 10: Complete Service Order
- **Steps**: Service → RO → Complete → QC → Payment → Deliver
- **Expected**: RO status = DELIVERED, invoice generated
- **Pass Criteria**: Payment recorded, customer notified

**UAT Execution**:
- Run after each Priority phase (P1, P2)
- Document results in `refactoring_uat_results_v1.0.md`
- Pass rate must be 100% to proceed

---

## 📦 H. Deliverables & Output Paths

### Required Files (KHÓA CỨNG)

#### 1. Refactoring Plan (This File)
**Path**: `docs/technical/refactoring/refactoring_plan_v1.0.md`
- ✅ Created: 2026-01-28
- Status: APPROVED (pending Discovery)

#### 2. Refactoring Checklist
**Path**: `docs/technical/refactoring/refactoring_checklist_v1.0.md`
- Status: TO BE CREATED
- Purpose: Atomic task list for OpenCode

#### 3. Discovery Report
**Path**: `docs/technical/refactoring/refactoring_discovery_report_v1.0.md`
- Status: TEMPLATE CREATED (to be filled by OpenCode)
- Purpose: Scan results and prioritized refactoring items

#### 4. UAT Results (Post-Execution)
**Path**: `docs/technical/refactoring/refactoring_uat_results_v1.0.md`
- Status: TO BE CREATED
- Purpose: UAT execution evidence

#### 5. Change Log
**Path**: `docs/technical/refactoring/refactoring_change_log.md`
- Status: TO BE CREATED
- Purpose: Version history and change tracking

---

## 📅 I. Timeline & Milestones

### Phase 1: Discovery (Days 1-2)
- **Day 1**: Run automated scans, analyze results
- **Day 2**: Prioritize items, create execution plan

**Deliverable**: Discovery Report with top 20 refactoring items

### Phase 2: Execution - Priority 1 (Days 3-7)
- **Days 3-4**: TypeScript typing improvements
- **Days 5-6**: Error handling standardization
- **Day 7**: Dead code removal, naming fixes

**Deliverable**: P1 refactoring complete, tests passing

### Phase 2: Execution - Priority 2 (Days 8-14)
- **Days 8-10**: Extract utility functions
- **Days 11-12**: Split large files
- **Days 13-14**: Consolidate duplicates, folder restructure

**Deliverable**: P2 refactoring complete, UAT passed

### Phase 3: Verification & Sign-off (Day 15)
- Full regression testing
- UAT execution
- Documentation update
- Sign-off

**Deliverable**: Refactoring v1.0 COMPLETE

---

## 🔄 J. Versioning & Change Management

### Version Rules
- **Major version (vX.0)**: New refactoring scope or major changes
- **Minor version (vX.Y)**: Adjustments to existing plan

### Change Process
1. Update plan document
2. Increment version
3. Update change log with summary
4. Get approval from Design Authority (Antigravity)
5. Notify OpenCode

### Current Version
- **v1.0**: Initial refactoring plan
- **Date**: 2026-01-28
- **Status**: APPROVED for Discovery phase

---

## 📞 K. Assumptions & Dependencies

### Assumptions
1. **Codebase State**: 
   - Current code is functional (tests passing)
   - No major bugs blocking refactoring

2. **Test Coverage**:
   - Existing tests cover critical paths
   - Tests are reliable (not flaky)

3. **Documentation**:
   - FRD, ERD, API Spec are up-to-date
   - `docs/instructions.md` reflects current conventions

4. **Resources**:
   - OpenCode available for 2-week execution
   - Antigravity available for reviews

### Dependencies
1. **Tools**:
   - TypeScript compiler
   - ESLint/Prettier
   - Vitest (unit tests)
   - Playwright (E2E tests)
   - Prisma CLI

2. **Environment**:
   - Development database (SQLite)
   - Test data available
   - CI/CD pipeline functional

---

## ✅ L. Sign-off

### Approval Required From
- [ ] **Antigravity** (Refactoring Design Authority) - Plan approval
- [ ] **OpenCode** (Implementation Authority) - Execution commitment
- [ ] **Stakeholder** (Optional) - Business approval for timeline

### Approval Status
- **Plan v1.0**: APPROVED for Discovery phase (2026-01-28)
- **Discovery Report**: PENDING
- **Execution**: PENDING (after Discovery)

---

**Document Status**: ✅ ACTIVE  
**Next Action**: OpenCode to execute Discovery phase and create Discovery Report  
**Review Date**: 2026-02-15 (after Phase 2 completion)
