# CR Impact Analysis: CR-20260205-ADMIN-FUNCS

**CR ID**: CR-20260205-ADMIN-FUNCS  
**Base CR**: CR-20260205-MASTER-001  
**Ngày phân tích**: 2026-02-05  
**Người phân tích**: Antigravity - Design Authority  
**Status**: COMPLETED ✅

---

## 📋 EXECUTIVE SUMMARY

### Scope
Triển khai toàn bộ chức năng quản lý Master User & Employee dựa trên CR-20260205-MASTER-001 (43KB, 1381 lines analysis).

### Impact Level: **HIGH**
- **5 Documents** affected: BRD, FRD, ERD, API Spec, UI Spec
- **4 Modules** affected: Master Data, Employee, User, Warehouse
- **21 Files** to create/modify (16 new + 5 modified)
- **1 Schema change**: Add `email` field to `employees` table
- **6 Validation rules** to implement
- **5 API endpoints** to create

---

## 🎯 IMPACT MATRIX

| Document | Current Version | Impact Level | Changes Required |
|----------|----------------|--------------|------------------|
| **BRD** | v2.5 | 🟡 LOW | Add BR-MD-005-02 clarification |
| **FRD** | Master Data v1.2 | 🔴 HIGH | Add 3 new screens + Employee-User linking |
| **ERD** | Master Data v1.2 | 🟡 MEDIUM | Add 1 field (`employees.email`) |
| **API Spec** | (Latest) | 🔴 HIGH | Add 5 search endpoints + computed fields |
| **UI Spec** | (Latest) | 🔴 HIGH | Add 3 pages + 2 component modifications |

---

## 📘 BRD IMPACT ANALYSIS

### Current State
- **Version**: BRD v2.5
- **Relevant Section**: 5.8 Module 09: Master Data Management
- **Current Requirement**: BR-MD-005 "Employee Management"

### Changes Required

#### 1. Clarify BR-MD-005 Requirement
**Current** (BRD v2.5, line 19):
```markdown
| **BR-MD-005** | Employee Management | Manage employee profiles. |
```

**Proposed Addition**:
```markdown
| **BR-MD-005** | Employee Management | Manage employee profiles. |
| **BR-MD-005-01** | Employee CRUD | Create, Read, Update, Delete employee records with full_name, email, department, position, level. |
| **BR-MD-005-02** | Structure Management | Manage Key Lists: Departments, Positions, Levels via UI (not database tools). |
| **BR-MD-005-03** | User Linking | Link employees to user accounts for system access. |
| **BR-MD-005-04** | Lifecycle Management | Automated warnings when terminated employees have active user accounts. |
```

#### 2. Add Smart Search Requirement (Already exists)
**Existing** (BRD v2.5, line 27):
```markdown
| **BR-SYS-001** | Smart Search Dropdowns | All Foreign Key selection inputs must support real-time search... |
```
✅ **No change needed** - Already covers SmartSelect requirement

### BRD Impact Summary
- **Complexity**: 🟢 LOW
- **Breaking Changes**: None
- **New Requirements**: 3 sub-requirements under BR-MD-005
- **Affected Sections**: 5.8 Module 09 only

---

## 📗 FRD IMPACT ANALYSIS

### Current State
- **Version**: FRD Master Data v1.2
- **File**: `frd_master_data_v1.2.md` (1748 lines)
- **Current Coverage**: VehicleModel, Accessory, ServiceCatalog, ServiceBay, Employee, Supplier, Inventory

### Changes Required

#### 1. Add FR-MD-005-02: Department Management UI

**New Functional Requirement**:

```markdown
### FR-MD-005-02: Department Management

**Priority**: CRITICAL (P0)  
**Actors**: Admin (CRUD), All Users (Read only)  
**Source**: CR-20260205-ADMIN-FUNCS

#### FR-MD-005-02-01: Create Department
**Preconditions**:
- User has role: Admin
- User has permission: MASTER_DATA.CREATE

**Main Flow**:
1. Admin navigates to `/master-data/departments`
2. Admin clicks "+ New" button
3. System displays Create Department dialog
4. System auto-generates `department_code`:
   - Format: `DEPT-XXX`
   - Auto-increment XXX
5. Admin enters required fields:
   - `department_name` (text, required, max 200 chars)
   - `description` (textarea, optional)
   - `status` (radio: ACTIVE/INACTIVE, default ACTIVE)
6. Admin clicks "Save"
7. System validates:
   - `department_name`: not empty, max 200 chars, unique (case-insensitive)
   - `status`: valid enum
8. If valid:
   - Create department record
   - Log to activity_logs
   - Display success message
   - Refresh table
9. If invalid:
   - Display inline errors
   - Keep dialog open

**Postconditions**:
- Department created with status = ACTIVE
- Audit log entry created
- Department available in all dropdowns

**Validation Rules**: VR-MD-020

#### FR-MD-005-02-02: Read Department List
(Similar to other master data Read requirements)

#### FR-MD-005-02-03: Update Department
(Similar to other master data Update requirements)

#### FR-MD-005-02-04: Delete Department (Soft Delete)
(Similar to other master data Delete requirements)

#### FR-MD-005-02-05: Search Department
(Similar to other master data Search requirements)

#### FR-MD-005-02-06: Filter Department
(Similar to other master data Filter requirements)
```

#### 2. Add FR-MD-005-03: Position Management UI
(Same structure as Department Management, replace "Department" with "Position", code format `POS-XXX`)

#### 3. Add FR-MD-005-04: Level Management UI
(Same structure as Department Management, replace "Department" with "Level", code format `LVL-XXX`)

#### 4. Update FR-MD-005-01: Employee Management

**Current State**: Employee Management exists in FRD v1.2

**Changes Required**:

**A. Fix Schema Mismatch**:
```markdown
<!-- BEFORE -->
**Form Fields**:
- First Name (text, required)
- Last Name (text, required)

<!-- AFTER -->
**Form Fields**:
- Full Name (text, required, max 200 chars, placeholder: "Nguyễn Văn A")
- Email (email, optional, placeholder: "employee@honda.com")
  * Helper text: "Required if employee needs system access"
```

**B. Add User Linking**:
```markdown
#### FR-MD-005-01-07: Link Employee to User Account

**Preconditions**:
- User has role: Admin
- User has permission: EMPLOYEE.UPDATE
- Employee exists

**Main Flow**:
1. Admin opens Employee form (Create or Edit)
2. System displays "User Account" section:
   - SmartSelect dropdown: "Select user account..." (optional)
   - Button: "Create User Account"
   - Display: Current linked user (if exists)
3. Admin can:
   - **Option A**: Select existing user from dropdown
     * Dropdown filters: onlyActive=true, excludeLinkedUsers=true
     * Shows: email, name, role
   - **Option B**: Click "Create User Account" button
     * Opens Create User dialog
     * Pre-fills: email (from employee.email), name (from employee.full_name)
     * Required: password, role
     * Shows: Suggested roles based on employee position
     * On save: Creates user + links to employee
   - **Option C**: Clear selection (unlink user)
4. Admin saves employee
5. System validates:
   - If user_id provided: User must exist, not already linked to another employee
6. System updates employee.user_id
7. System logs to activity_logs

**Postconditions**:
- Employee linked/unlinked to user account
- User account created (if Option B)
- Audit log entry created

**Validation Rules**: VR-MD-021, VR-MD-022
```

**C. Add Lifecycle Management**:
```markdown
#### FR-MD-005-01-08: Employee Termination Lifecycle

**Preconditions**:
- User has role: Admin or HR_MANAGER
- Employee exists with status = ACTIVE
- Employee has linked user account

**Main Flow**:
1. Admin updates employee status to "TERMINATED"
2. System checks if employee has linked user (user_id not null)
3. If linked user exists:
   a. System creates notification:
      - Type: EMPLOYEE_TERMINATED_WITH_USER
      - Title: "Employee [full_name] terminated"
      - Message: "User account [email] is still ACTIVE"
      - Action URL: `/admin/users/[user_id]`
      - Target roles: ADMIN, HR_MANAGER
      - Severity: WARNING
   b. System creates scheduled task:
      - Task type: DEACTIVATE_USER
      - Target: user_id
      - Scheduled at: NOW() + 7 days
      - Status: PENDING
      - Can cancel: true
4. System displays warning to admin:
   - "⚠️ This employee has an active user account. The account will be automatically deactivated in 7 days unless you take action."
5. Admin can:
   - Proceed with termination
   - Cancel termination
   - Immediately deactivate user

**Postconditions**:
- Employee status = TERMINATED
- Notification created for admins
- Scheduled task created (7-day grace period)
- Admin dashboard shows pending review

**Business Rules**:
- Grace period: 7 days
- Auto-deactivation: Can be cancelled by admin
- Manual override: Admin can deactivate immediately

**Validation Rules**: VR-MD-023
```

**D. Remove Mock Data**:
```markdown
<!-- DELETE from FR-MD-005-01 -->
**Filter Options**:
- Department: [Mock array removed - use SmartSelect]
- Position: [Mock array removed - use SmartSelect]
- Level: [Mock array removed - use SmartSelect]

<!-- REPLACE WITH -->
**Filter Options**:
- Department: SmartSelect (endpoint: /api/shared/search/departments)
- Position: SmartSelect (endpoint: /api/shared/search/positions)
- Level: SmartSelect (endpoint: /api/shared/search/employee-levels)
```

#### 5. Update FR-MD-007: Warehouse Management

**Changes Required**:

```markdown
#### FR-MD-007-01: Create Warehouse

<!-- BEFORE -->
**Form Fields**:
- Manager: Dropdown (hardcoded list)

<!-- AFTER -->
**Form Fields**:
- Manager: SmartSelect (endpoint: /api/shared/search/employees)
  * Context filter: onlyActive=true, positionFilter=["Manager", "Supervisor", "Director"]
  * Display: full_name, employee_code, position_name
  * Required: true

**Validation Rules**: VR-MD-024 (Manager must be valid active employee)
```

### Data Requirements Changes

#### New Entities: None
(All entities already exist: departments, positions, levels, employees)

#### Modified Entities

**Entity**: `employees`

| Field | Type | Nullable | Constraints | Change |
|-------|------|----------|-------------|--------|
| email | String | Yes | Max 200 chars, NOT unique | **NEW** |

**Rationale**:
- Facilitate user account creation
- Optional (drivers, cleaners không cần email)
- NOT unique (multiple employees có thể share: info@honda.com)
- Only User.email is unique

**Migration**:
- Add column as nullable
- Backfill from User.email for existing linked employees
- No breaking changes

### FRD Impact Summary
- **Complexity**: 🔴 HIGH
- **New Screens**: 3 (Departments, Positions, Levels)
- **Modified Screens**: 2 (Employee, Warehouse)
- **New Data Fields**: 1 (`employees.email`)
- **New Business Rules**: 6 (VR-MD-020 to VR-MD-024, plus lifecycle rules)
- **Estimated Pages**: +150 lines

---

## 📊 ERD IMPACT ANALYSIS

### Current State
- **Version**: ERD Master Data v1.2
- **File**: `erd_master_data_v1.2.md`
- **Diagram**: `honda_dms_erd_diagram.png`

### Changes Required

#### 1. Modify `employees` Table

**Current Schema**:
```prisma
model employees {
  id                String   @id @default(uuid())
  employee_code     String   @unique
  full_name         String
  phone             String?
  address           String?
  hire_date         DateTime?
  status            String   @default("ACTIVE")
  department_id     String?
  position_id       String?
  level_id          String?
  user_id           String?  @unique
  
  // Relations
  master_departments  master_departments? @relation(fields: [department_id], references: [id])
  master_positions    master_positions?   @relation(fields: [position_id], references: [id])
  master_levels       master_levels?      @relation(fields: [level_id], references: [id])
  User                User?               @relation(fields: [user_id], references: [id])
}
```

**Proposed Schema**:
```prisma
model employees {
  id                String   @id @default(uuid())
  employee_code     String   @unique
  full_name         String
  email             String?  // ✅ NEW - Optional, NOT unique
  phone             String?
  address           String?
  hire_date         DateTime?
  status            String   @default("ACTIVE")
  department_id     String?
  position_id       String?
  level_id          String?
  user_id           String?  @unique
  
  // Relations (unchanged)
  master_departments  master_departments? @relation(fields: [department_id], references: [id])
  master_positions    master_positions?   @relation(fields: [position_id], references: [id])
  master_levels       master_levels?      @relation(fields: [level_id], references: [id])
  User                User?               @relation(fields: [user_id], references: [id])
}
```

**Migration Script**:
```sql
-- Add email column (nullable, no unique constraint)
ALTER TABLE employees ADD COLUMN email VARCHAR(200);

-- Backfill email from linked users
UPDATE employees e
SET email = u.email
FROM "User" u
WHERE e.user_id = u.id
  AND e.email IS NULL
  AND u.email IS NOT NULL;

-- No index needed (not unique, not frequently queried alone)
```

#### 2. No Changes to Other Tables

**Existing Tables** (already support requirements):
- ✅ `master_departments` (exists)
- ✅ `master_positions` (exists)
- ✅ `master_levels` (exists)
- ✅ `employees` (exists, only add email field)
- ✅ `User` (exists, no changes needed)
- ✅ `warehouses` (exists, manager_id FK already correct)

**Note**: No new tables needed. All master data tables already exist with correct structure.

#### 3. Update ERD Dictionary

**New Dictionary Entry**: `employees.md` (update)

```markdown
# Table: employees

## Purpose
Stores employee profiles for Honda dealership staff.

## Classification
- **Type**: Master Data
- **Sensitivity**: Medium (PII)
- **Retention**: Permanent (soft delete only)

## Columns

| Column | Type | Nullable | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| id | UUID | No | uuid() | PK | Unique identifier |
| employee_code | VARCHAR(50) | No | - | UNIQUE | Auto-generated (EMP-XXX) |
| full_name | VARCHAR(200) | No | - | - | Employee full name |
| **email** | **VARCHAR(200)** | **Yes** | **NULL** | **-** | **Employee email (optional, not unique)** |
| phone | VARCHAR(20) | Yes | NULL | - | Contact phone |
| address | TEXT | Yes | NULL | - | Home address |
| hire_date | DATE | Yes | NULL | - | Date of hire |
| status | VARCHAR(20) | No | 'ACTIVE' | ENUM | ACTIVE, TERMINATED, ON_LEAVE |
| department_id | UUID | Yes | NULL | FK | Reference to master_departments |
| position_id | UUID | Yes | NULL | FK | Reference to master_positions |
| level_id | UUID | Yes | NULL | FK | Reference to master_levels |
| user_id | UUID | Yes | NULL | FK, UNIQUE | Reference to User (1-to-1) |

## Indexes
- PRIMARY KEY (id)
- UNIQUE (employee_code)
- UNIQUE (user_id)
- INDEX (department_id)
- INDEX (position_id)
- INDEX (status)

## Relationships
- **master_departments** (N:1): employees.department_id → master_departments.id
- **master_positions** (N:1): employees.position_id → master_positions.id
- **master_levels** (N:1): employees.level_id → master_levels.id
- **User** (1:1 optional): employees.user_id → User.id

## Usage
- **Screens**: Employee Management, User Management, Warehouse Management
- **APIs**: `/api/master/employees`, `/api/shared/search/employees`

## Business Rules
- BR-MD-005-01: Employee CRUD operations
- BR-MD-005-03: Employee-User linking (1-to-1 optional)
- BR-MD-005-04: Lifecycle management (termination warnings)
- **NEW**: Email is optional (drivers, cleaners không cần)
- **NEW**: Email NOT unique (multiple employees có thể share: info@honda.com)
- **NEW**: Only User.email is unique

## Sample Data
```sql
INSERT INTO employees (id, employee_code, full_name, email, phone, department_id, position_id, status, user_id)
VALUES 
  ('emp_001', 'EMP-001', 'Nguyễn Văn A', 'nguyenvana@honda.com', '0901234567', 'dept_001', 'pos_001', 'ACTIVE', 'user_001'),
  ('emp_002', 'EMP-002', 'Trần Thị B', NULL, '0907654321', 'dept_002', 'pos_002', 'ACTIVE', NULL);
```

## Migration Notes
- **CR-20260205-ADMIN-FUNCS**: Added `email` field (optional, not unique)
- Migration: Backfill email from User.email for existing linked employees
- No breaking changes (nullable field)
```

### ERD Impact Summary
- **Complexity**: 🟡 MEDIUM
- **New Tables**: 0
- **Modified Tables**: 1 (`employees` - add 1 field)
- **New Indexes**: 0
- **Breaking Changes**: None (nullable field)
- **Migration Strategy**: Add column + backfill
- **Estimated Effort**: 2 hours

---

## 🔌 API SPEC IMPACT ANALYSIS

### Current State
- **Existing APIs**: `/api/master/departments`, `/api/master/positions`, `/api/master/levels`, `/api/master/employees`, `/api/master/warehouses`
- **Missing**: SmartSelect search endpoints

### Changes Required

#### 1. Add 5 SmartSelect Search Endpoints

**Endpoint #1**: `/api/shared/search/departments`

```typescript
POST /api/shared/search/departments

Request:
{
  "query": "sales",           // Search term (optional)
  "limit": 20,                // Max results (default 20)
  "cursor": null,             // Pagination cursor (optional)
  "context": {
    "onlyActive": true        // Filter by status = ACTIVE
  }
}

Response:
{
  "items": [
    {
      "id": "dept_001",
      "label": "Sales Department",
      "subtitle": "DEPT-001 | 15 employees",
      "meta": {
        "id": "dept_001",
        "department_code": "DEPT-001",
        "department_name": "Sales Department",
        "description": "Sales and Marketing",
        "status": "ACTIVE",
        "employee_count": 15
      }
    }
  ],
  "nextCursor": "eyJpZCI6ImRlcHRfMDAxIn0="
}

Search Fields: department_name, department_code
Context Filters: onlyActive (boolean)
FRD Mapping: FR-MD-005-02-05 (Search Department)
ERD Mapping: master_departments table
```

**Endpoint #2**: `/api/shared/search/positions`
(Same structure as departments, replace with positions)

**Endpoint #3**: `/api/shared/search/employee-levels`
(Same structure as departments, replace with levels)

**Endpoint #4**: `/api/shared/search/employees`

```typescript
POST /api/shared/search/employees

Request:
{
  "query": "nguyen",
  "limit": 20,
  "cursor": null,
  "context": {
    "onlyActive": true,
    "positionFilter": ["Manager", "Supervisor", "Director"]
  }
}

Response:
{
  "items": [
    {
      "id": "emp_001",
      "label": "Nguyễn Văn A",
      "subtitle": "EMP-001 | Sales Manager | Sales Dept",
      "meta": {
        "id": "emp_001",
        "employee_code": "EMP-001",
        "full_name": "Nguyễn Văn A",
        "email": "nguyenvana@honda.com",
        "phone": "0901234567",
        "department_name": "Sales Department",
        "position_name": "Sales Manager",
        "level_name": "Level 3",
        "status": "ACTIVE"
      }
    }
  ],
  "nextCursor": "..."
}

Search Fields: full_name, employee_code, email
Context Filters: onlyActive (boolean), positionFilter (string[])
FRD Mapping: FR-MD-005-01-05 (Search Employee), FR-MD-007-01 (Warehouse Manager)
ERD Mapping: employees table + joins (departments, positions, levels)
```

**Endpoint #5**: `/api/shared/search/users`

```typescript
POST /api/shared/search/users

Request:
{
  "query": "admin",
  "limit": 20,
  "cursor": null,
  "context": {
    "onlyActive": true,
    "excludeLinkedUsers": true
  }
}

Response:
{
  "items": [
    {
      "id": "user_001",
      "label": "admin@honda.com",
      "subtitle": "Admin | Sales Department",
      "meta": {
        "id": "user_001",
        "email": "admin@honda.com",
        "name": "Admin User",
        "role": "ADMIN",
        "department": "Sales Department",  // Computed from Employee
        "status": "ACTIVE",
        "has_employee": false
      }
    }
  ],
  "nextCursor": "..."
}

Search Fields: email, name
Context Filters: onlyActive (boolean), excludeLinkedUsers (boolean)
FRD Mapping: FR-MD-005-01-07 (Link Employee to User)
ERD Mapping: User table + join employees
```

#### 2. Update User API - Add Computed Fields

**Endpoint**: `GET /api/users/:id`

```typescript
// BEFORE
GET /api/users/user_001
{
  "id": "user_001",
  "email": "john@honda.com",
  "role": "SALES_STAFF",
  "department": "Sales",  // ❌ Hardcoded string
  "status": "ACTIVE"
}

// AFTER
GET /api/users/user_001
{
  "id": "user_001",
  "email": "john@honda.com",
  "role": "SALES_STAFF",
  // ✅ Computed từ Employee relation
  "department": "Sales Department",  // employee?.master_departments?.department_name || null
  "department_id": "dept_001",       // employee?.department_id || null
  "position": "Sales Manager",       // employee?.master_positions?.position_name || null
  "position_id": "pos_001",          // employee?.position_id || null
  "status": "ACTIVE"
}

Implementation:
- Include employee relation in Prisma query
- Compute department, position từ employee relations
- Backward compatible (existing fields unchanged)
- No breaking changes

FRD Mapping: FR-MD-005-01-07 (User Linking)
ERD Mapping: User → employees → master_departments, master_positions
```

#### 3. Update Employee API - Add Email Field

**Endpoint**: `POST /api/master/employees`

```typescript
// BEFORE
POST /api/master/employees
{
  "employee_code": "EMP-001",  // Auto-generated
  "first_name": "Nguyễn",      // ❌ NOT IN DB
  "last_name": "Văn A",        // ❌ NOT IN DB
  "phone": "0901234567",
  "department_id": "dept_001",
  "position_id": "pos_001"
}

// AFTER
POST /api/master/employees
{
  "employee_code": "EMP-001",  // Auto-generated
  "full_name": "Nguyễn Văn A", // ✅ Match DB schema
  "email": "nguyenvana@honda.com",  // ✅ NEW - Optional
  "phone": "0901234567",
  "department_id": "dept_001",
  "position_id": "pos_001",
  "user_id": "user_001"        // ✅ NEW - Optional (link to user)
}

Validation:
- full_name: required, max 200 chars
- email: optional, max 200 chars, valid email format
- user_id: optional, must exist, must not be linked to another employee

FRD Mapping: FR-MD-005-01-01 (Create Employee), FR-MD-005-01-07 (User Linking)
ERD Mapping: employees table
```

#### 4. Add Employee-User Linking Endpoint

**New Endpoint**: `POST /api/master/employees/:id/create-user`

```typescript
POST /api/master/employees/emp_001/create-user

Request:
{
  "email": "nguyenvana@honda.com",  // Required (from employee.email or manual)
  "password": "SecurePass123!",     // Required
  "role_id": "role_001"             // Required
}

Response:
{
  "user": {
    "id": "user_new",
    "email": "nguyenvana@honda.com",
    "name": "Nguyễn Văn A",  // From employee.full_name
    "role_id": "role_001",
    "status": "ACTIVE"
  },
  "employee": {
    "id": "emp_001",
    "user_id": "user_new"  // Updated
  }
}

Business Logic:
1. Validate employee exists
2. Validate employee.user_id is null (not already linked)
3. Validate email unique in User table
4. Create User record
5. Link employee.user_id = user.id
6. Sync email back to employee if employee.email was null
7. Log to activity_logs

FRD Mapping: FR-MD-005-01-07 (Create User Account for Employee)
ERD Mapping: User table, employees table
Validation Rules: VR-MD-021, VR-MD-022
```

### API Impact Summary
- **Complexity**: 🔴 HIGH
- **New Endpoints**: 6 (5 search + 1 create-user)
- **Modified Endpoints**: 2 (User GET, Employee POST)
- **Breaking Changes**: None (backward compatible)
- **Versioning**: No version bump needed (additive changes)
- **Estimated Effort**: 24 hours

---

## 🎨 UI SPEC IMPACT ANALYSIS

### Current State
- **Existing Pages**: `/master-data/employees`, `/master-data/warehouses`
- **Missing Pages**: `/master-data/departments`, `/master-data/positions`, `/master-data/levels`

### Changes Required

#### 1. Create 3 New Master Data Pages

**Page #1**: `/master-data/departments`
- **Component**: `DepartmentManagement.tsx`
- **Layout**: Standard master data table + dialog
- **Features**: CRUD, Search, Filter, Pagination
- **Refs**: Reuse existing patterns from `EmployeeManagement.tsx`
- **Estimated Lines**: ~400 lines

**Page #2**: `/master-data/positions`
- **Component**: `PositionManagement.tsx`
- **Layout**: Same as DepartmentManagement
- **Estimated Lines**: ~400 lines

**Page #3**: `/master-data/levels`
- **Component**: `LevelManagement.tsx`
- **Layout**: Same as DepartmentManagement
- **Estimated Lines**: ~400 lines

**Common UI Pattern**:
```tsx
// Table columns
- Code (sortable)
- Name (sortable)
- Description
- Status (filterable badge)
- Employee Count (computed)
- Actions (Edit, Delete)

// Form fields
- Code (auto-generated, read-only)
- Name (text input, required)
- Description (textarea, optional)
- Status (radio: ACTIVE/INACTIVE)

// Actions
- Create: "+ New" button → Dialog
- Edit: ✎ icon → Dialog
- Delete: 🗑 icon → Confirmation → Soft delete
- Search: Search box (debounced)
- Filter: Status dropdown
```

#### 2. Modify EmployeeManagement.tsx

**Changes**:

**A. Fix Schema Mismatch**:
```tsx
// ❌ BEFORE (lines 200-220)
<Input label="First Name" id="first_name" required />
<Input label="Last Name" id="last_name" required />

// ✅ AFTER
<Input 
  label="Full Name *" 
  id="full_name"
  placeholder="Nguyễn Văn A"
  required
  maxLength={200}
/>
<Input 
  label="Email (Optional)" 
  id="email"
  type="email"
  placeholder="employee@honda.com"
  helperText="Required if employee needs system access"
/>
```

**B. Remove Mock Data** (lines 73-99):
```tsx
// ❌ DELETE
const departments = [
  { id: "1", name: "Sales" },
  // ...
]
const positions = [...]
const levels = [...]
```

**C. Replace Filters with SmartSelect**:
```tsx
// ❌ BEFORE
<select value={selectedDepartment} onChange={...}>
  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
</select>

// ✅ AFTER
<SmartSelect
  dataSource={departmentDataSource}
  value={selectedDepartment}
  onChange={setSelectedDepartment}
  label="Department"
  placeholder="All Departments"
  allowClear={true}
/>
```

**D. Add User Linking Section**:
```tsx
// NEW section in Employee Form
<div className="col-span-2 border-t pt-4 mt-4">
  <h3 className="text-lg font-semibold mb-4">User Account</h3>
  
  {/* Option 1: Link existing user */}
  <SmartSelect
    dataSource={userDataSource}
    value={formData.user_id}
    onChange={(id) => setFormData({ ...formData, user_id: id })}
    label="Link to User Account (Optional)"
    placeholder="Select user account..."
    allowClear={true}
    context={{ onlyActive: true, excludeLinkedUsers: true }}
  />
  
  {/* Option 2: Create new user */}
  <Button 
    onClick={() => setCreateUserDialogOpen(true)}
    variant="outline"
    className="mt-2"
  >
    <UserPlus className="w-4 h-4 mr-2" />
    Create User Account
  </Button>
  
  {/* Display current linked user */}
  {employee.user_id && (
    <div className="mt-2 p-2 bg-blue-50 rounded">
      <p className="text-sm">
        Linked to: <strong>{employee.user_email}</strong>
      </p>
    </div>
  )}
</div>

{/* Create User Dialog */}
<Dialog open={createUserDialogOpen} onOpenChange={setCreateUserDialogOpen}>
  <DialogTitle>Create User Account for {employee.full_name}</DialogTitle>
  <DialogContent>
    <Form onSubmit={handleCreateUser}>
      <Input 
        label="Email *" 
        value={employee.email || ""} 
        required 
      />
      <Input 
        label="Password *" 
        type="password" 
        required 
        minLength={8}
      />
      
      <Alert type="info">
        Suggested roles for "{employee.position_name}":
        {suggestedRoles.map(role => (
          <Badge key={role} className="ml-1">{role}</Badge>
        ))}
      </Alert>
      
      <SmartSelect
        label="Role *"
        dataSource={roleDataSource}
        required
        context={{ suggestedFirst: true }}
      />
      
      <Button type="submit">Create User Account</Button>
    </Form>
  </DialogContent>
</Dialog>
```

**E. Add User Column in Table**:
```tsx
// NEW column in Employee table
<TableCell>
  {employee.user_id ? (
    <Badge className="bg-blue-100 text-blue-800">
      <User className="w-3 h-3 mr-1" />
      {employee.user_email}
    </Badge>
  ) : (
    <span className="text-gray-400 text-sm">No user</span>
  )}
</TableCell>
```

**Estimated Changes**: ~200 lines modified/added

#### 3. Modify WarehouseManagement.tsx

**Changes**:

**A. Remove Mock Managers** (lines 56-63):
```tsx
// ❌ DELETE
const managers = [
  { id: "1", name: "Nguyễn Văn A" },
  // ...
]
```

**B. Replace Manager Select with SmartSelect**:
```tsx
// ❌ BEFORE (lines 384-398)
<select
  value={formData.manager_id}
  onChange={(e) => setFormData({ ...formData, manager_id: e.target.value })}
  required
>
  <option value="">Chọn quản lý</option>
  {managers.map((manager) => (
    <option key={manager.id} value={manager.id}>{manager.name}</option>
  ))}
</select>

// ✅ AFTER
<SmartSelect
  dataSource={employeeDataSource}
  value={formData.manager_id ? Number(formData.manager_id) : null}
  onChange={(id) => setFormData({ ...formData, manager_id: id ? String(id) : "" })}
  label="Quản Lý *"
  placeholder="Chọn quản lý..."
  required
  context={{
    onlyActive: true,
    positionFilter: ["Manager", "Supervisor", "Director"]
  }}
/>
```

**C. Add Employee DataSource**:
```tsx
const employeeDataSource: SelectDataSource = {
  search: async (req) => {
    const res = await fetch('/api/shared/search/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...req,
        context: {
          onlyActive: true,
          positionFilter: ["Manager", "Supervisor", "Director"]
        }
      })
    });
    return res.json();
  }
};
```

**Estimated Changes**: ~50 lines modified

#### 4. Add Menu Items

**File**: `app/(main)/layout.tsx`

```tsx
// Add to Master Data submenu
{
  title: "Master Data",
  icon: Database,
  children: [
    { title: "Employees", href: "/master-data/employees" },
    { title: "Departments", href: "/master-data/departments" },  // NEW
    { title: "Positions", href: "/master-data/positions" },      // NEW
    { title: "Levels", href: "/master-data/levels" },            // NEW
    { title: "Warehouses", href: "/master-data/warehouses" },
    // ... other items
  ]
}
```

### Refs Evaluation

**Existing Refs** (can reuse):
- ✅ Table component (sortable, filterable)
- ✅ Dialog component (create/edit forms)
- ✅ SmartSelect component (already exists)
- ✅ Badge component (status display)
- ✅ Button component (actions)
- ✅ Input component (form fields)
- ✅ Alert component (notifications)

**Refs Strategy**: **REUSE AS-IS** ✅
- No new components needed
- All UI patterns already exist in EmployeeManagement
- Copy-paste-modify approach for 3 new pages

### UI Impact Summary
- **Complexity**: 🔴 HIGH
- **New Pages**: 3 (Departments, Positions, Levels)
- **Modified Pages**: 2 (Employee, Warehouse)
- **New Components**: 0 (reuse existing)
- **Refs Strategy**: Reuse As-Is
- **Estimated Lines**: ~1,250 lines total
  - New pages: 3 × 400 = 1,200 lines
  - Modifications: 250 lines
- **Estimated Effort**: 32 hours

---

## ⚖️ VALIDATION RULES

### New Validation Rules

#### VR-MD-020: Department Name Uniqueness
```typescript
async function validateDepartmentName(name: string, excludeId?: string) {
  const existing = await prisma.master_departments.findFirst({
    where: { 
      department_name: { equals: name, mode: 'insensitive' }
    }
  });
  
  if (existing && existing.id !== excludeId) {
    throw new ValidationError("Department name already exists");
  }
}
```

#### VR-MD-021: User Email Uniqueness
```typescript
async function validateUserEmail(email: string, excludeUserId?: string) {
  const existing = await prisma.User.findUnique({ where: { email } });
  if (existing && existing.id !== excludeUserId) {
    throw new ValidationError("Email already used by another user");
  }
}
```

#### VR-MD-022: Employee-User Linking
```typescript
async function validateEmployeeUserLink(employeeId: string, userId: string) {
  // Check employee not already linked
  const employee = await prisma.employees.findUnique({ where: { id: employeeId } });
  if (employee.user_id && employee.user_id !== userId) {
    throw new ValidationError("Employee already linked to another user");
  }
  
  // Check user not already linked
  const user = await prisma.User.findUnique({ 
    where: { id: userId }, 
    include: { employees: true } 
  });
  if (user.employees && user.employees.id !== employeeId) {
    throw new ValidationError("User already linked to another employee");
  }
}
```

#### VR-MD-023: Employee Termination Lifecycle
```typescript
async function validateEmployeeTermination(employeeId: string, newStatus: string) {
  if (newStatus === "TERMINATED") {
    const employee = await prisma.employees.findUnique({
      where: { id: employeeId },
      include: { User: true }
    });
    
    if (employee.User && employee.User.status === "ACTIVE") {
      // Create warning notification
      // Create scheduled task (7-day grace period)
      return {
        warning: true,
        message: "Employee has active user account. Account will be deactivated in 7 days.",
        user_email: employee.User.email
      };
    }
  }
}
```

#### VR-MD-024: Warehouse Manager Validation
```typescript
async function validateWarehouseManager(managerId: string) {
  const employee = await prisma.employees.findUnique({
    where: { id: managerId },
    include: { master_positions: true }
  });
  
  if (!employee) {
    throw new ValidationError("Manager must be a valid employee");
  }
  
  if (employee.status !== "ACTIVE") {
    throw new ValidationError("Manager must be an active employee");
  }
  
  // Optional: Check position
  const validPositions = ["Manager", "Supervisor", "Director"];
  if (!validPositions.includes(employee.master_positions?.position_name)) {
    console.warn(`Employee ${employee.full_name} position is ${employee.master_positions?.position_name}, not a typical manager position`);
  }
}
```

#### VR-MD-025: Employee Full Name Required
```typescript
async function validateEmployeeData(data: CreateEmployeeDto) {
  if (!data.full_name || data.full_name.trim().length === 0) {
    throw new ValidationError("Full name is required");
  }
  
  if (data.full_name.length > 200) {
    throw new ValidationError("Full name must be less than 200 characters");
  }
}
```

---

## 📊 EFFORT ESTIMATE

### Complexity Assessment
- **Overall Complexity**: COMPLEX
- **Reason**: Multiple modules, schema changes, 21 deliverables, lifecycle logic

### Effort Breakdown

| Phase | Tasks | Hours | Developer-Days |
|-------|-------|-------|----------------|
| **Phase 1: API & Schema** | 9 tasks | 24h | 3 days |
| - Add email field migration | 1 task | 2h | 0.25 days |
| - Create 5 search endpoints | 5 tasks | 10h | 1.25 days |
| - Add validation rules | 1 task | 4h | 0.5 days |
| - Unit tests | 1 task | 4h | 0.5 days |
| - Update User API | 1 task | 2h | 0.25 days |
| - Add create-user endpoint | 1 task | 2h | 0.25 days |
| **Phase 2: Master Data UI** | 10 tasks | 32h | 4 days |
| - Create DepartmentManagement | 1 task | 4h | 0.5 days |
| - Create departments page | 1 task | 1h | 0.125 days |
| - Create PositionManagement | 1 task | 4h | 0.5 days |
| - Create positions page | 1 task | 1h | 0.125 days |
| - Create LevelManagement | 1 task | 4h | 0.5 days |
| - Create levels page | 1 task | 1h | 0.125 days |
| - Add menu items | 1 task | 1h | 0.125 days |
| - Integration tests | 1 task | 4h | 0.5 days |
| - UAT | 1 task | 4h | 0.5 days |
| - Bug fixes | 1 task | 8h | 1 day |
| **Phase 3: Employee/Warehouse Fix** | 10 tasks | 24h | 3 days |
| - Fix schema mismatch | 1 task | 3h | 0.375 days |
| - Add email field to form | 1 task | 1h | 0.125 days |
| - Add user linking UI | 1 task | 4h | 0.5 days |
| - Create user dialog | 1 task | 6h | 0.75 days |
| - Smart role suggestions | 1 task | 3h | 0.375 days |
| - Remove mock data | 1 task | 1h | 0.125 days |
| - Update filters | 1 task | 3h | 0.375 days |
| - User column in table | 1 task | 2h | 0.25 days |
| - Fix Warehouse managers | 1 task | 2h | 0.25 days |
| - Test warehouse creation | 1 task | 1h | 0.125 days |
| **Phase 4: Lifecycle & Testing** | 9 tasks | 40h | 5 days |
| - Lifecycle warning system | 1 task | 4h | 0.5 days |
| - Admin dashboard widget | 1 task | 3h | 0.375 days |
| - Validation tests | 1 task | 4h | 0.5 days |
| - Integration tests | 1 task | 4h | 0.5 days |
| - E2E tests | 1 task | 4h | 0.5 days |
| - Email migration script | 1 task | 2h | 0.25 days |
| - Warehouse cleanup script | 1 task | 3h | 0.375 days |
| - UAT execution | 1 task | 8h | 1 day |
| - Bug fixes | 1 task | 8h | 1 day |
| **TOTAL** | **38 tasks** | **120h** | **15 days** |

### Risk Assessment

| Risk | Severity | Probability | Mitigation |
|------|----------|-------------|------------|
| Breaking employee data | 🔴 HIGH | 🟢 LOW | No changes to existing fields, only additions |
| SmartSelect performance | 🟡 MEDIUM | 🟡 MEDIUM | Cursor pagination, indexes on search fields |
| User confusion (full_name) | 🟡 MEDIUM | 🔴 HIGH | Clear labels, placeholders, training |
| User linking conflicts | 🟡 MEDIUM | 🟡 MEDIUM | Validation prevents duplicate linking |
| Warehouse data integrity | 🔴 HIGH | 🟡 MEDIUM | Data cleanup script, validation on manager_id |
| Fake manager IDs | 🔴 HIGH | 🔴 HIGH | Migration script to clean up, manual review |

---

## 🎯 NEXT STEPS

### Immediate Actions
1. ✅ CR-01 Intake completed (APPROVED)
2. ✅ CR-02 Impact Analysis completed
3. ⏭️ Proceed to CR-03: Update Requirement Documents (DRAFT)
   - Create draft versions of all affected documents
   - Mark all changes with CR ID
   - Save in CR folder for review

### Documents to Update in CR-03
- [x] BRD v2.5 → BRD_CR-20260205-ADMIN-FUNCS_DRAFT.md
- [x] FRD Master Data v1.2 → frd_master_data_CR-20260205-ADMIN-FUNCS_DRAFT.md
- [x] ERD Master Data v1.2 → erd_master_data_CR-20260205-ADMIN-FUNCS_DRAFT/
- [x] API Spec → api_spec_CR-20260205-ADMIN-FUNCS_DRAFT.md
- [x] UI Spec → ui_spec_CR-20260205-ADMIN-FUNCS_DRAFT.md

---

## 📚 REFERENCES

### Source Documents
- **CR-20260205-MASTER-001.md**: Base analysis (1381 lines, 43KB)
- **BRD v2.5**: Current business requirements
- **FRD Master Data v1.2**: Current functional requirements (1748 lines)
- **ERD Master Data v1.2**: Current data model

### Related CRs
- CR-MD-001: VehicleModel Management
- CR-MD-002: Accessory Management
- CR-MD-003: ServiceCatalog Management
- CR-20260202-001: Emergency Master Data

---

**Status**: COMPLETED ✅  
**Next Step**: CR-03 Update Requirement Documents (DRAFT)  
**Approved By**: Antigravity - Design Authority  
**Date**: 2026-02-05
