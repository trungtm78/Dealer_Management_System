# CR Draft Summary: CR-20260205-ADMIN-FUNCS

**CR ID**: CR-20260205-ADMIN-FUNCS  
**Base CR**: CR-20260205-MASTER-001  
**Ngày tạo draft**: 2026-02-05  
**Người tạo**: Antigravity - Design Authority  
**Status**: DRAFT COMPLETED ✅

---

## 📋 EXECUTIVE SUMMARY

### CR Scope
Triển khai toàn bộ chức năng quản lý Master User & Employee dựa trên CR-20260205-MASTER-001.

### Draft Documents Created
✅ 5 draft documents đã được tạo trong CR folder:

1. **BRD Draft**: `BRD_CR-20260205-ADMIN-FUNCS_DRAFT.md`
2. **FRD Draft**: `frd_master_data_CR-20260205-ADMIN-FUNCS_DRAFT.md`
3. **ERD Draft**: `erd_master_data_CR-20260205-ADMIN-FUNCS_DRAFT/`
4. **API Spec Draft**: `api_spec_CR-20260205-ADMIN-FUNCS_DRAFT.md`
5. **UI Spec Draft**: `ui_spec_CR-20260205-ADMIN-FUNCS_DRAFT.md`

---

## 📊 DRAFT CHANGES SUMMARY

### BRD Changes

**Document**: `BRD_CR-20260205-ADMIN-FUNCS_DRAFT.md`  
**Base Version**: BRD v2.5  
**Impact**: 🟡 LOW

**Changes**:
- ✅ Added 4 sub-requirements to BR-MD-005:
  * BR-MD-005-01: Employee CRUD
  * BR-MD-005-02: Structure Management (Departments, Positions, Levels)
  * BR-MD-005-03: User Linking
  * BR-MD-005-04: Lifecycle Management

**CR Markers**: `<!-- CR-20260205-ADMIN-FUNCS: ADDED -->`

---

### FRD Changes

**Document**: `frd_master_data_CR-20260205-ADMIN-FUNCS_DRAFT.md`  
**Base Version**: FRD Master Data v1.2  
**Impact**: 🔴 HIGH

**Changes**:

#### Added (New Requirements)
1. **FR-MD-005-02**: Department Management (6 sub-requirements)
   - FR-MD-005-02-01: Create Department
   - FR-MD-005-02-02: Read Department List
   - FR-MD-005-02-03: Update Department
   - FR-MD-005-02-04: Delete Department (Soft Delete)
   - FR-MD-005-02-05: Search Department
   - FR-MD-005-02-06: Filter Department

2. **FR-MD-005-03**: Position Management (6 sub-requirements)
   - Same structure as Department Management

3. **FR-MD-005-04**: Level Management (6 sub-requirements)
   - Same structure as Department Management

4. **FR-MD-005-01-07**: Link Employee to User Account (NEW)
   - Option A: Link existing user
   - Option B: Create new user
   - Option C: Unlink user

5. **FR-MD-005-01-08**: Employee Termination Lifecycle (NEW)
   - Notification system
   - Scheduled task (7-day grace period)
   - Admin dashboard widget

#### Modified (Updated Requirements)
1. **FR-MD-005-01-01**: Create Employee
   - Schema fix: `first_name` + `last_name` → `full_name`
   - Add `email` field (optional)
   - Replace mock data with SmartSelect

2. **FR-MD-005-01-02**: Read Employee List
   - Add "User Account" column
   - Replace filter dropdowns with SmartSelect

3. **FR-MD-007-01**: Create Warehouse
   - Replace mock managers with SmartSelect

#### Validation Rules Added
- VR-MD-020: Master Data Name Uniqueness
- VR-MD-021: User Email Uniqueness
- VR-MD-022: Employee-User Linking
- VR-MD-023: Employee Termination Lifecycle
- VR-MD-024: Warehouse Manager Validation
- VR-MD-025: Employee Full Name Required

**CR Markers**: `<!-- CR-20260205-ADMIN-FUNCS: ADDED/MODIFIED -->`

---

### ERD Changes

**Document**: `erd_master_data_CR-20260205-ADMIN-FUNCS_DRAFT/`  
**Base Version**: ERD Master Data v1.2  
**Impact**: 🟡 MEDIUM

**Changes**:

#### Modified Tables
1. **employees** table:
   - ✅ Added `email` field (VARCHAR(200), nullable, NOT unique)

**Migration SQL**:
```sql
ALTER TABLE employees ADD COLUMN email VARCHAR(200);

UPDATE employees e
SET email = u.email
FROM "User" u
WHERE e.user_id = u.id
  AND e.email IS NULL
  AND u.email IS NOT NULL;
```

**Breaking Changes**: None (nullable field, additive change)

**Files Created**:
- `erd_description_DRAFT.md` - ERD overview with changes
- `dictionary/employees_DRAFT.md` - Updated employees table dictionary

**CR Markers**: `<!-- CR-20260205-ADMIN-FUNCS: MODIFIED -->`

---

### API Spec Changes

**Document**: `api_spec_CR-20260205-ADMIN-FUNCS_DRAFT.md`  
**Base Version**: API Spec (Latest)  
**Impact**: 🔴 HIGH

**Changes**:

#### New Endpoints (6)
1. `POST /api/shared/search/departments` - SmartSelect search for departments
2. `POST /api/shared/search/positions` - SmartSelect search for positions
3. `POST /api/shared/search/employee-levels` - SmartSelect search for levels
4. `POST /api/shared/search/employees` - SmartSelect search for employees
5. `POST /api/shared/search/users` - SmartSelect search for users
6. `POST /api/master/employees/:id/create-user` - Create user for employee

#### Modified Endpoints (2)
1. `GET /api/users/:id` - Add computed fields (department, position)
2. `POST /api/master/employees` - Add email field, fix schema (full_name)

**Breaking Changes**: None (all changes are additive)

**CR Markers**: `<!-- CR-20260205-ADMIN-FUNCS: ADDED/MODIFIED -->`

---

### UI Spec Changes

**Document**: `ui_spec_CR-20260205-ADMIN-FUNCS_DRAFT.md`  
**Base Version**: UI Spec (Latest)  
**Impact**: 🔴 HIGH

**Changes**:

#### New Pages (3)
1. `/master-data/departments` - Department Management (~400 lines)
2. `/master-data/positions` - Position Management (~400 lines)
3. `/master-data/levels` - Level Management (~400 lines)

#### Modified Pages (2)
1. `/master-data/employees` - Employee Management (~200 lines modified)
   - Fix schema mismatch (full_name)
   - Add email field
   - Remove mock data
   - Add user linking section
   - Add user column in table

2. `/master-data/warehouses` - Warehouse Management (~50 lines modified)
   - Remove mock managers
   - Replace with SmartSelect

#### Menu Updates
- Add 3 new menu items to Master Data submenu

**Refs Strategy**: REUSE AS-IS ✅
- No new components needed
- All UI patterns exist in EmployeeManagement

**Total Lines**: ~1,460 lines (3 new pages + 2 modified pages)

**CR Markers**: `<!-- CR-20260205-ADMIN-FUNCS: ADDED/MODIFIED -->`

---

## 🎯 TRACEABILITY MATRIX

| BRD | FRD | ERD | API | UI | Deliverable |
|-----|-----|-----|-----|----|----|
| BR-MD-005-02 | FR-MD-005-02 | master_departments | /api/master/departments, /api/shared/search/departments | /master-data/departments | DepartmentManagement.tsx |
| BR-MD-005-02 | FR-MD-005-03 | master_positions | /api/master/positions, /api/shared/search/positions | /master-data/positions | PositionManagement.tsx |
| BR-MD-005-02 | FR-MD-005-04 | master_levels | /api/master/levels, /api/shared/search/employee-levels | /master-data/levels | LevelManagement.tsx |
| BR-MD-005-03 | FR-MD-005-01-07 | employees, User | /api/master/employees/:id/create-user, /api/shared/search/users | /master-data/employees | EmployeeManagement.tsx (User Linking) |
| BR-MD-005-04 | FR-MD-005-01-08 | employees, User, notifications, scheduled_tasks | /api/master/employees (status update) | /master-data/employees, Admin Dashboard | Lifecycle Management |

---

## 📦 DELIVERABLES CHECKLIST

### Documents ✅
- [x] BRD Draft (28 lines → 38 lines, +10 lines)
- [x] FRD Draft (comprehensive changes summary)
- [x] ERD Draft (1 table modified, 1 field added)
- [x] API Spec Draft (6 new endpoints, 2 modified)
- [x] UI Spec Draft (3 new pages, 2 modified)

### Code Files (To be created in CR-06)
- [ ] 3 new pages (DepartmentManagement, PositionManagement, LevelManagement)
- [ ] 2 modified pages (EmployeeManagement, WarehouseManagement)
- [ ] 6 new API routes (SmartSelect search endpoints)
- [ ] 1 new API route (create-user endpoint)
- [ ] 2 modified API routes (users/:id, employees)
- [ ] 1 migration script (add email field)

**Total**: 16 files to create/modify

---

## 🔍 CONSISTENCY CHECKS

### Cross-Document Consistency ✅

| Check | Status | Notes |
|-------|--------|-------|
| BRD ↔ FRD alignment | ✅ PASS | All BR-MD-005-XX mapped to FR-MD-005-XX |
| FRD ↔ ERD alignment | ✅ PASS | All entities referenced in FRD exist in ERD |
| FRD ↔ API alignment | ✅ PASS | All FR requirements have API endpoints |
| FRD ↔ UI alignment | ✅ PASS | All FR requirements have UI screens |
| API ↔ ERD alignment | ✅ PASS | All API endpoints reference valid tables |
| UI ↔ API alignment | ✅ PASS | All UI screens call correct API endpoints |

### Validation Rules Coverage ✅

| Validation Rule | FRD | API | UI |
|-----------------|-----|-----|-----|
| VR-MD-020 | ✅ | ✅ | ✅ |
| VR-MD-021 | ✅ | ✅ | ✅ |
| VR-MD-022 | ✅ | ✅ | ✅ |
| VR-MD-023 | ✅ | ✅ | ✅ |
| VR-MD-024 | ✅ | ✅ | ✅ |
| VR-MD-025 | ✅ | ✅ | ✅ |

### CR Markers ✅

All changes marked with:
```markdown
<!-- CR-20260205-ADMIN-FUNCS: ADDED -->
...
<!-- END CR-20260205-ADMIN-FUNCS -->

<!-- CR-20260205-ADMIN-FUNCS: MODIFIED -->
...
<!-- END CR-20260205-ADMIN-FUNCS -->
```

---

## 📈 IMPACT SUMMARY

### By Document Type

| Document | Impact Level | Changes | Breaking |
|----------|--------------|---------|----------|
| BRD | 🟡 LOW | +4 sub-requirements | No |
| FRD | 🔴 HIGH | +18 requirements, +6 validation rules | No |
| ERD | 🟡 MEDIUM | +1 field | No |
| API Spec | 🔴 HIGH | +6 endpoints, +2 modified | No |
| UI Spec | 🔴 HIGH | +3 pages, +2 modified | No |

### By Change Type

| Change Type | Count | Examples |
|-------------|-------|----------|
| NEW | 21 | 3 pages, 6 endpoints, 6 validation rules, 6 FR requirements |
| MODIFIED | 7 | 2 pages, 2 endpoints, 3 FR requirements |
| DELETED | 3 | Mock data arrays (departments, positions, levels, managers) |

### Effort Estimate

**From CR-02 Impact Analysis**:
- Complexity: COMPLEX
- Effort: 120 hours (15 developer-days)
- Team: 2 developers
- Duration: 2 weeks (with testing)

---

## ⚠️ RISKS & MITIGATIONS

### Risk #1: Data Integrity (Mock Data)
**Risk**: Existing warehouses reference fake manager IDs  
**Mitigation**: Migration script to set manager_id = NULL for invalid references  
**Status**: Documented in ERD draft

### Risk #2: Schema Mismatch
**Risk**: Existing code uses first_name/last_name (not in DB)  
**Mitigation**: Update all references to use full_name  
**Status**: Documented in FRD/UI Spec drafts

### Risk #3: User Confusion (Email NOT Unique)
**Risk**: Users expect employee.email to be unique  
**Mitigation**: Clear UI helper text, validation messages  
**Status**: Documented in FRD/UI Spec drafts

### Risk #4: SmartSelect Performance
**Risk**: Search queries slow for large datasets  
**Mitigation**: Pagination, debounce (300ms), caching (5 min)  
**Status**: Documented in API Spec draft

---

## 📝 NEXT STEPS

### CR-04: Review & Approve
1. Review all 5 draft documents for consistency
2. Check traceability matrix completeness
3. Validate CR markers present
4. Make approval decision (APPROVE/REJECT/CHANGE_REQUEST)

### CR-05: Consolidate (if approved)
1. Merge BRD draft → BRD v2.6
2. Merge FRD draft → FRD Master Data v1.3
3. Merge ERD draft → ERD Master Data v1.3
4. Update API Spec (main)
5. Update UI Spec (main)
6. Remove all CR markers
7. Increment versions
8. Create CONSOLIDATED.md marker
9. Create HANDOVER_TO_OPENCODE.md

### CR-06: Implementation (by OpenCode)
1. Follow consolidated main documents
2. Implement 16 files (3 new pages, 2 modified, 6 new endpoints, etc.)
3. Run migration script
4. Execute UAT
5. Deploy to production

---

## 🔖 REFERENCES

### Base Documents
- CR-20260205-MASTER-001.md (43KB, 1381 lines)
- BRD v2.5
- FRD Master Data v1.2
- ERD Master Data v1.2

### CR Process Documents
- change_request_CR-20260205-ADMIN-FUNCS_intake.md (CR-01)
- change_request_CR-20260205-ADMIN-FUNCS_impact_analysis.md (CR-02)
- change_request_CR-20260205-ADMIN-FUNCS_draft_summary.md (CR-03) ← This document

### Draft Documents
- drafts/BRD_CR-20260205-ADMIN-FUNCS_DRAFT.md
- drafts/frd_master_data_CR-20260205-ADMIN-FUNCS_DRAFT.md
- drafts/erd_master_data_CR-20260205-ADMIN-FUNCS_DRAFT/
- drafts/api_spec_CR-20260205-ADMIN-FUNCS_DRAFT.md
- drafts/ui_spec_CR-20260205-ADMIN-FUNCS_DRAFT.md

---

## ✅ COMPLETION CHECKLIST

### CR-03 Requirements
- [x] Create BRD draft with CR markers
- [x] Create FRD draft with CR markers
- [x] Create ERD draft with CR markers
- [x] Create API Spec draft with CR markers
- [x] Create UI Spec draft with CR markers
- [x] All changes marked with CR ID
- [x] Traceability matrix complete
- [x] Consistency checks passed
- [x] Draft summary created

### Quality Gates
- [x] All 5 documents created
- [x] CR markers present and consistent
- [x] No breaking changes introduced
- [x] Validation rules documented
- [x] Migration strategy defined
- [x] Effort estimate confirmed (120 hours)

---

**Status**: CR-03 COMPLETED ✅  
**Ready for**: CR-04 Review & Approve  
**Date**: 2026-02-05  
**Prepared by**: Antigravity - Design Authority

---

**END OF DRAFT SUMMARY**
