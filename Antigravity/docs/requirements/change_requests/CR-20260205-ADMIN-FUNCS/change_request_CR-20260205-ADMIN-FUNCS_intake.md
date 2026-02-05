# Change Request Intake: CR-20260205-ADMIN-FUNCS

**CR ID**: CR-20260205-ADMIN-FUNCS  
**Ngày tạo**: 2026-02-05  
**Người yêu cầu**: User  
**Người phân tích**: Antigravity - Design Authority  
**Trạng thái**: APPROVED ✅

---

## 📋 THÔNG TIN CƠ BẢN

### Tiêu đề
**Triển khai chức năng quản lý Master User & Employee**

### Mô tả yêu cầu
Triển khai toàn bộ chức năng quản lý Master Data cho User và Employee module dựa trên Change Request CR-20260205-MASTER-001 đã được phân tích chi tiết.

### Nguồn gốc
- **Base Document**: `C:/Honda/Antigravity/docs/requirements/change_requests/CRD/CR-20260205-MASTER-001.md`
- **Loại**: FEATURE_COMPLETION + BUG_FIX + TECHNICAL_DEBT + ARCHITECTURE_IMPROVEMENT
- **Module ảnh hưởng**: Master Data, Employee Management, User Management, Warehouse Management

---

## 🎯 MỤC TIÊU NGHIỆP VỤ

### Business Objectives
1. **Functional Completeness**: Cho phép Admin quản lý departments, positions, levels qua UI (hiện tại phải dùng database tools)
2. **Data Integrity**: Đảm bảo dữ liệu nhất quán, loại bỏ mock data, fix schema mismatch
3. **User Management**: Implement Employee-User linking với lifecycle management
4. **Security**: Tự động cảnh báo khi employee terminated nhưng user account vẫn active
5. **UX Consistency**: Chuẩn hóa SmartSelect pattern cho tất cả dropdowns
6. **Compliance**: Đáp ứng FRD requirement FR-MD-005-02

### Success Criteria
- ✅ Admin có thể CRUD departments/positions/levels qua UI
- ✅ Employee creation works (fix schema mismatch)
- ✅ Warehouse manager selection dùng real employee IDs (không còn fake IDs)
- ✅ Admin có thể link employee với user account
- ✅ Automated warnings khi employee terminated
- ✅ Tất cả filters/dropdowns dùng SmartSelect với real data

---

## 📊 PHÂN TÍCH CHI TIẾT

### 1. VẤN ĐỀ HIỆN TẠI (6 GAPS)

#### GAP #1: Thiếu UI Pages cho Master Tables
**Severity**: 🔴 CRITICAL  
**FRD Violation**: FR-MD-005-02

| Entity | API Route | UI Page | Component | Status |
|--------|-----------|---------|-----------|--------|
| Departments | ✅ Exists | ❌ MISSING | ❌ MISSING | BLOCKED |
| Positions | ✅ Exists | ❌ MISSING | ❌ MISSING | BLOCKED |
| Levels | ✅ Exists | ❌ MISSING | ❌ MISSING | BLOCKED |

**Impact**:
- Admin không thể quản lý master data qua UI
- Phải dùng database tools (không có validation, audit logs)
- Vi phạm FRD requirement

#### GAP #2: Thiếu SmartSelect Search Endpoints
**Severity**: 🔴 HIGH

| Entity | Endpoint | Status | Required By |
|--------|----------|--------|-------------|
| Departments | `/api/shared/search/departments` | ❌ MISSING | EmployeeManagement, UserForm |
| Positions | `/api/shared/search/positions` | ❌ MISSING | EmployeeManagement |
| Levels | `/api/shared/search/employee-levels` | ❌ MISSING | EmployeeManagement |
| Employees | `/api/shared/search/employees` | ❌ MISSING | WarehouseManagement |
| Users | `/api/shared/search/users` | ❌ MISSING | Employee linking |

**Impact**:
- EmployeeManagement đã migrate sang SmartSelect nhưng không hoạt động (404 errors)
- Filters vẫn dùng hardcoded mock data

#### GAP #3: Schema Mismatch - Employee Fields
**Severity**: 🔴 HIGH

- **Database**: `full_name` (String, required)
- **UI**: `first_name` + `last_name` (không tồn tại trong DB)

**Impact**: Employee creation fails

#### GAP #4: Mock Data trong Components
**Severity**: 🟡 MEDIUM (🔴 HIGH for data integrity)

- **EmployeeManagement.tsx**: Mock arrays cho departments, positions, levels
- **WarehouseManagement.tsx**: Mock managers với fake IDs ("1", "2", "3"...)

**Impact**: 
- Warehouse `manager_id` lưu fake IDs vào DB
- Không link với real employees
- Data integrity violation

#### GAP #5: Thiếu User Linking
**Severity**: 🟡 MEDIUM

- Không có `user_id` field trong Employee form
- Không có "Create User Account" button
- Phải manual update database

#### GAP #6: Department/Role/Email Conflicts
**Severity**: 🔴 HIGH

- **User.department** (String) vs **Employee.department_id** (FK) → Data duplication
- **User.role** (String) vs **User.role_id** (FK) → Không rõ source of truth
- **Employee** thiếu email field → Không thể tạo User account

### 2. GIẢI PHÁP ĐỀ XUẤT (5 Best Practices)

#### Solution #1: Department Management - Computed Field
- User.department = computed field từ Employee.department_id
- Single source of truth: master_departments
- Backward compatible

#### Solution #2: Role Assignment - Manual with Smart Defaults
- Admin manually chọn role
- System gợi ý dựa trên position
- Flexible, no magic

#### Solution #3: Lifecycle Management - Automated Warning System
- Event-driven notifications khi employee terminated
- 7-day grace period
- Admin có final decision

#### Solution #4: Scalability - Keep 1-to-1 with Future-proof Design
- Maintain 1-to-1 Employee-User relationship
- Clear migration path to 1-to-many nếu cần

#### Solution #5: Email Field - Add Optional Email to Employee
- Add `email` field (optional, not unique)
- Facilitate user creation
- No conflict with User.email (unique)

---

## 🔧 SCOPE CHANGES

### In Scope
1. ✅ Tạo 3 UI pages: Departments, Positions, Levels Management
2. ✅ Tạo 5 SmartSelect search endpoints
3. ✅ Fix EmployeeManagement schema mismatch (full_name)
4. ✅ Add email field to Employee model
5. ✅ Remove mock data từ EmployeeManagement và WarehouseManagement
6. ✅ Implement Employee-User linking UI
7. ✅ Add validation rules (6 rules)
8. ✅ Implement lifecycle warning system
9. ✅ Add computed department field trong User API
10. ✅ Migration scripts

### Out of Scope
- Other modules using AutocompleteFK (separate CR)
- Advanced features (bulk import/export)
- UI/UX redesign
- Mobile app support
- Notification system implementation (assume exists)
- Scheduled task system implementation (assume exists)

---

## 📈 EFFORT ESTIMATE

### Complexity: COMPLEX
**Lý do**:
- Multiple modules affected (Master Data, Employee, User, Warehouse)
- Database schema changes
- 21 deliverables (16 new + 5 modified files)
- 6 validation rules
- Lifecycle management logic

### Estimated Effort
- **Duration**: 3 weeks
- **Developer-days**: 17 days
- **Hours**: 136 hours

### Breakdown by Phase
| Phase | Tasks | Effort |
|-------|-------|--------|
| Phase 1: API & Schema | 9 tasks | 24 hours |
| Phase 2: Master Data UI | 10 tasks | 32 hours |
| Phase 3: Employee/Warehouse Fix | 10 tasks | 24 hours |
| Phase 4: Lifecycle & Testing | 9 tasks | 40 hours |
| **TOTAL** | **38 tasks** | **120 hours** |

### Risk Level: MEDIUM
**Risks**:
- Breaking existing employee data (Mitigation: No schema changes to existing fields)
- SmartSelect performance (Mitigation: Cursor pagination, indexes)
- User confusion full_name vs first/last (Mitigation: Clear labels, training)
- Warehouse data integrity (Mitigation: Data cleanup script)

---

## ✅ VALIDATION CHECKLIST

### Business Validation
- [x] Business objectives rõ ràng
- [x] Success criteria đo lường được
- [x] Stakeholders identified
- [x] Compliance requirements (FRD FR-MD-005-02)

### Technical Validation
- [x] Scope defined rõ ràng
- [x] Dependencies identified (SmartSelect component, Prisma, Next.js)
- [x] Breaking changes documented
- [x] Migration strategy defined
- [x] Rollback plan available

### Resource Validation
- [x] Effort estimate reasonable (3 weeks)
- [x] Team capacity available
- [x] Timeline realistic

### Documentation Validation
- [x] Base CR document comprehensive (CR-20260205-MASTER-001.md)
- [x] All 6 gaps analyzed
- [x] All 5 solutions documented
- [x] Implementation plan detailed

---

## 🎯 CLASSIFICATION

### CR Type
- [x] FEATURE_COMPLETION (3 new master data pages)
- [x] BUG_FIX (schema mismatch, mock data)
- [x] TECHNICAL_DEBT (remove mock data, add validation)
- [x] ARCHITECTURE_IMPROVEMENT (computed fields, lifecycle management)

### Priority: 🔴 CRITICAL
**Justification**:
- Violates FRD requirement (FR-MD-005-02)
- Blocks admin operations (cannot manage master data)
- Data integrity issues (fake warehouse manager IDs)
- Security risk (terminated employees with active users)

### Impact Level: HIGH
**Affected Areas**:
- Master Data module
- Employee Management
- User Management
- Warehouse Management
- API layer (5 new endpoints)
- Database schema (1 new field)

---

## 📝 NEXT STEPS

### Immediate Actions
1. ✅ CR Intake completed
2. ⏭️ Proceed to CR-02: Impact Analysis
   - Analyze impact on BRD, FRD, ERD, API Spec, UI Spec
   - Detail data requirements changes
   - Assess Refs availability

### Dependencies
- SmartSelect component (exists)
- Prisma ORM (exists)
- Next.js API routes (exists)
- shadcn/ui components (exists)

### Stakeholders to Notify
- Backend Lead (API implementation)
- Frontend Lead (UI pages)
- QA Lead (testing strategy)
- Product Owner (UAT approval)

---

## 🔖 REFERENCES

### Source Documents
- **CR-20260205-MASTER-001.md**: Complete analysis (1381 lines, 43KB)
  - Path: `C:/Honda/Antigravity/docs/requirements/change_requests/CRD/CR-20260205-MASTER-001.md`

### Related Documents
- FRD requirement FR-MD-005-02
- Database schema: `prisma/schema.prisma`
- EmployeeManagement component: `components/master/EmployeeManagement.tsx`
- WarehouseManagement component: `components/master/WarehouseManagement.tsx`

---

## ✅ DECISION

**Status**: APPROVED ✅

**Rationale**:
1. ✅ Business objectives clear và critical
2. ✅ Technical scope well-defined
3. ✅ Effort estimate reasonable
4. ✅ Risks identified với mitigation
5. ✅ Base CR document comprehensive
6. ✅ Compliance requirement (FRD)
7. ✅ Data integrity issues must be fixed

**Approved By**: Antigravity - Design Authority  
**Date**: 2026-02-05  
**Next Step**: CR-02 Impact Analysis

---

**Signature**: Antigravity  
**Role**: Design Authority  
**Date**: 2026-02-05
