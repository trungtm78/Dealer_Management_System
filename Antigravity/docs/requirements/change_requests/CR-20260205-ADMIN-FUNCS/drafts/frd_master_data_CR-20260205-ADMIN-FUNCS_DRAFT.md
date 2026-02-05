# Functional Requirements Document: Master Data Management
## DRAFT for CR-20260205-ADMIN-FUNCS

**Base Version**: FRD Master Data v1.2  
**Draft Version**: v1.3 (DRAFT)  
**CR**: CR-20260205-ADMIN-FUNCS  
**Date**: 2026-02-05  
**Status**: DRAFT  

---

## ⚠️ DRAFT NOTICE

This is a DRAFT version created for CR-20260205-ADMIN-FUNCS review.  
**Base document**: `frd_master_data_v1.2.md` (1748 lines)  
**Changes marked with**: `<!-- CR-20260205-ADMIN-FUNCS: ... -->`

---

## 📝 CHANGES SUMMARY

### Scope Update
```markdown
<!-- CR-20260205-ADMIN-FUNCS: ADDED -->
**Admin Functions Scope** (CR-20260205-ADMIN-FUNCS):
- ✅ Department Management UI
- ✅ Position Management UI  
- ✅ Level Management UI
- ✅ Employee-User Linking
- ✅ Employee Lifecycle Management
- ✅ SmartSelect Migration (remove mock data)
<!-- END CR-20260205-ADMIN-FUNCS -->
```

---

## 2. Functional Requirements

### [EXISTING] FR-MD-001 to FR-MD-004
*(No changes - keep existing content from v1.2)*

---

<!-- CR-20260205-ADMIN-FUNCS: ADDED -->
### FR-MD-005-02: Department Management

**Source**: CR-20260205-ADMIN-FUNCS  
**Priority**: CRITICAL (P0)  
**Actors**: Admin (CRUD), All Users (Read only)

#### FR-MD-005-02-01: Create Department

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.CREATE

**Main Flow**:
1. Admin navigates to `/master-data/departments`
2. Admin clicks "+ New" button
3. System displays Create Department dialog
4. System auto-generates `department_code`:
   - Format: `DEPT-XXX`
   - Example: `DEPT-001`, `DEPT-002`
   - Auto-increment XXX
5. Admin enters required fields:
   - `department_name` (text input, required, max 200 chars)
   - `description` (textarea, optional)
   - `status` (radio: ACTIVE/INACTIVE, default ACTIVE)
6. Admin clicks "Save" button
7. System validates inputs:
   - `department_name`: not empty, max 200 chars, unique (case-insensitive)
   - `status`: must be valid enum value (ACTIVE/INACTIVE)
8. If validation passes:
   - System creates Department record
   - System logs to `activity_logs` table
   - System displays success message: "Department created successfully"
   - System closes dialog
   - System refreshes table to show new record
9. If validation fails:
   - System displays error messages inline
   - System keeps dialog open for corrections

**Postconditions**:
- Department created with status = ACTIVE (or as selected)
- Audit log entry created with action = CREATE
- Department available in all dropdowns (Employee Management, User Management)

**Validation Rules**: VR-MD-020

---

#### FR-MD-005-02-02: Read Department List

**Preconditions**:
- User is authenticated
- User has permission: MASTER_DATA.READ

**Main Flow**:
1. User navigates to `/master-data/departments`
2. System displays Department table with columns:
   - Department Code (sortable)
   - Department Name (sortable)
   - Description
   - Status (filterable, badge display)
   - Employee Count (computed from employees table)
   - Actions (Edit, Delete icons)
3. System loads data:
   - Default sort: `department_name ASC`
   - Default filter: `status = ACTIVE`
   - Pagination: 20 items per page
4. User can interact with table:
   - Click column headers to sort
   - Use search box to filter (department_name, department_code)
   - Use status dropdown to filter
   - Click Edit icon to modify
   - Click Delete icon to soft delete

**Postconditions**:
- User sees current list of Departments
- Filters and sort preferences saved in URL query params

---

#### FR-MD-005-02-03: Update Department

**Preconditions**:
- User has role: Admin
- User has permission: MASTER_DATA.UPDATE
- Department exists

**Main Flow**:
1. Admin clicks Edit icon (✎) on a Department row
2. System displays Edit Department dialog
3. System pre-fills form with current values:
   - `department_code` (read-only, grayed out)
   - `department_name` (editable)
   - `description` (editable)
   - `status` (editable)
4. Admin modifies fields (except department_code)
5. Admin clicks "Save" button
6. System validates inputs (same as Create)
7. If validation passes:
   - System updates Department record
   - System logs to `activity_logs` with old_value and new_value
   - System displays success message: "Department updated successfully"
   - System closes dialog
   - System refreshes table
8. If validation fails:
   - System displays error messages
   - System keeps dialog open

**Postconditions**:
- Department updated with new values
- Audit log entry created with action = UPDATE
- Changes reflected in all dropdowns immediately

**Validation Rules**: VR-MD-020

---

#### FR-MD-005-02-04: Delete Department (Soft Delete)

**Preconditions**:
- User has role: Admin
- User has permission: MASTER_DATA.DELETE
- Department exists

**Main Flow**:
1. Admin clicks Delete icon (🗑) on a Department row
2. System checks if department has active employees
3. If department has active employees:
   - System displays warning dialog:
     * Title: "Cannot Delete Department"
     * Message: "This department has X active employees. Please reassign or terminate employees before deleting."
     * Button: "OK"
   - System prevents deletion
4. If department has no active employees:
   - System displays confirmation dialog:
     * Title: "Deactivate Department?"
     * Message: "This will set the department status to INACTIVE. The department will no longer appear in dropdowns but historical data will be preserved."
     * Buttons: "Cancel", "Deactivate"
5. Admin clicks "Deactivate" button
6. System performs soft delete:
   - SET `status` = 'INACTIVE'
   - SET `deleted_at` = NOW()
   - NOT hard delete (preserve record)
7. System logs to `activity_logs` with action = DELETE
8. System displays success message: "Department deactivated successfully"
9. System refreshes table (record disappears if filter = ACTIVE only)

**Postconditions**:
- Department status = INACTIVE
- `deleted_at` timestamp set
- Audit log entry created
- Department no longer appears in dropdowns (filtered by status = ACTIVE)
- Historical data preserved (Employees still reference this department)

---

#### FR-MD-005-02-05: Search Department

**Preconditions**:
- User is on `/master-data/departments` page
- User has permission: MASTER_DATA.READ

**Main Flow**:
1. User types in search box (placeholder: "Search by department name or code...")
2. System waits for 300ms after last keystroke (debounce)
3. System performs search:
   - Match against: `department_name` OR `department_code`
   - Match type: Partial match, case-insensitive
   - Example: "sales" matches "Sales Department", "DEPT-001" (if contains "sales")
4. System updates table with filtered results
5. System shows result count: "Showing X results for 'search term'"
6. If no results found:
   - System displays: "No departments found matching 'search term'"
   - System shows "Clear search" button

**Postconditions**:
- Table shows only matching records
- Search term saved in URL query param
- Other filters (status) still applied (AND logic)

---

#### FR-MD-005-02-06: Filter Department

**Preconditions**:
- User is on `/master-data/departments` page
- User has permission: MASTER_DATA.READ

**Main Flow**:
1. User selects filter options:
   - **Status Filter** (single-select dropdown):
     * Options: All, ACTIVE, INACTIVE
     * Default: ACTIVE only
     * Single selection
2. System applies filter immediately on selection
3. System updates table with filtered results
4. System shows filter summary: "Filtered by: Status (ACTIVE)"

**Postconditions**:
- Table shows only records matching filter criteria
- Filter saved in URL query param
- Search still applied if active (AND logic)

---

### FR-MD-005-03: Position Management

**Source**: CR-20260205-ADMIN-FUNCS  
**Priority**: CRITICAL (P0)  
**Actors**: Admin (CRUD), All Users (Read only)

**Note**: All sub-requirements (FR-MD-005-03-01 to FR-MD-005-03-06) follow the same structure as Department Management (FR-MD-005-02), with the following replacements:
- Entity: "Department" → "Position"
- Code format: `DEPT-XXX` → `POS-XXX`
- Field names: `department_code`, `department_name` → `position_code`, `position_name`
- URL: `/master-data/departments` → `/master-data/positions`

**Validation Rules**: VR-MD-020 (adapted for Position)

---

### FR-MD-005-04: Level Management

**Source**: CR-20260205-ADMIN-FUNCS  
**Priority**: CRITICAL (P0)  
**Actors**: Admin (CRUD), All Users (Read only)

**Note**: All sub-requirements (FR-MD-005-04-01 to FR-MD-005-04-06) follow the same structure as Department Management (FR-MD-005-02), with the following replacements:
- Entity: "Department" → "Level"
- Code format: `DEPT-XXX` → `LVL-XXX`
- Field names: `department_code`, `department_name` → `level_code`, `level_name`
- URL: `/master-data/departments` → `/master-data/levels`

**Validation Rules**: VR-MD-020 (adapted for Level)

---

### FR-MD-005-01: Employee Management (UPDATED)

**Source**: CR-20260202-001 (original), CR-20260205-ADMIN-FUNCS (updates)  
**Priority**: CRITICAL (P0)  
**Actors**: Admin, HR Manager (CRUD), All Users (Read only)

<!-- CR-20260205-ADMIN-FUNCS: MODIFIED -->

#### FR-MD-005-01-01: Create Employee (UPDATED)

**Changes from v1.2**:
1. **Schema Fix**: Replace `first_name` + `last_name` with `full_name`
2. **Add Email Field**: Optional email field
3. **Remove Mock Data**: Replace hardcoded dropdowns with SmartSelect

**Main Flow** (updated steps):

5. Admin enters required fields:
   <!-- CR-20260205-ADMIN-FUNCS: MODIFIED -->
   - `full_name` (text input, required, max 200 chars, placeholder: "Nguyễn Văn A")
   - `email` (email input, optional, max 200 chars, placeholder: "employee@honda.com")
     * Helper text: "Required if employee needs system access"
   <!-- END CR-20260205-ADMIN-FUNCS -->
   - `phone` (text input, optional)
   - `address` (textarea, optional)
   - `hire_date` (date picker, optional)
   <!-- CR-20260205-ADMIN-FUNCS: MODIFIED -->
   - `department_id` (SmartSelect from `/api/shared/search/departments`, optional)
   - `position_id` (SmartSelect from `/api/shared/search/positions`, optional)
   - `level_id` (SmartSelect from `/api/shared/search/employee-levels`, optional)
   <!-- END CR-20260205-ADMIN-FUNCS -->
   - `status` (radio: ACTIVE/TERMINATED/ON_LEAVE, default ACTIVE)

7. System validates inputs:
   <!-- CR-20260205-ADMIN-FUNCS: MODIFIED -->
   - `full_name`: not empty, max 200 chars
   - `email`: valid email format if provided, max 200 chars (NOT unique)
   <!-- END CR-20260205-ADMIN-FUNCS -->
   - `department_id`: must be valid Department ID if provided
   - `position_id`: must be valid Position ID if provided
   - `level_id`: must be valid Level ID if provided

**Validation Rules**: VR-MD-025 (full_name required)

---

#### FR-MD-005-01-07: Link Employee to User Account (NEW)

<!-- CR-20260205-ADMIN-FUNCS: ADDED -->

**Preconditions**:
- User has role: Admin or HR_MANAGER
- User is authenticated
- User has permission: EMPLOYEE.UPDATE
- Employee exists

**Main Flow**:
1. Admin opens Employee form (Create or Edit)
2. System displays "User Account" section:
   - Label: "User Account (Optional)"
   - SmartSelect dropdown: "Select user account..."
   - Button: "Create User Account"
   - Display: Current linked user (if exists)
3. Admin can choose one of three options:

   **Option A: Link Existing User**
   a. Admin clicks SmartSelect dropdown
   b. System calls `/api/shared/search/users` with context:
      - `onlyActive`: true
      - `excludeLinkedUsers`: true (only show users not linked to any employee)
   c. Admin types to search users by email or name
   d. System displays matching users:
      - Label: email
      - Subtitle: name | role | department
   e. Admin selects a user
   f. System sets `formData.user_id` = selected user ID
   
   **Option B: Create New User**
   a. Admin clicks "Create User Account" button
   b. System displays Create User dialog:
      - Title: "Create User Account for [employee.full_name]"
      - Pre-filled fields:
        * Email: employee.email (or empty if null)
        * Name: employee.full_name
      - Required fields:
        * Email (if not pre-filled)
        * Password (min 8 chars, must contain uppercase, lowercase, number)
        * Role (SmartSelect from roles)
      - Info alert: "Suggested roles for '[employee.position_name]': [badges]"
        * Mapping: Position → Suggested Roles
        * Example: "Sales Manager" → ["SALES_MANAGER", "SALES_STAFF"]
   c. Admin fills in required fields
   d. Admin clicks "Create User Account" button
   e. System validates:
      - Email unique in User table
      - Password meets requirements
      - Role is valid
   f. If valid:
      - System calls `POST /api/master/employees/:id/create-user`
      - System creates User record
      - System links employee.user_id = new user ID
      - System syncs email back to employee if employee.email was null
      - System displays success: "User account created and linked successfully"
      - System closes dialog
      - System updates Employee form to show linked user
   g. If invalid:
      - System displays error messages
      - System keeps dialog open
   
   **Option C: Unlink User**
   a. Admin clicks "Clear" button on SmartSelect (if user is linked)
   b. System displays confirmation:
      - Title: "Unlink User Account?"
      - Message: "This will remove the link between employee and user. The user account will remain active."
      - Buttons: "Cancel", "Unlink"
   c. Admin clicks "Unlink"
   d. System sets employee.user_id = null
   e. System displays success: "User account unlinked"

4. Admin saves employee
5. System validates:
   - If user_id provided: User must exist, must not be linked to another employee
6. System updates employee.user_id
7. System logs to activity_logs

**Postconditions**:
- Employee linked/unlinked to user account
- User account created (if Option B)
- Audit log entry created with action = UPDATE
- Employee form shows current linked user

**Business Rules**:
- `user_id` is optional - employee không nhất thiết phải có user account
- `user_id` must be unique - một user chỉ link với một employee (1-to-1)
- Context filter `excludeLinkedUsers: true` - chỉ show users chưa link
- Khi unlink user (set `user_id = null`), user account vẫn tồn tại (không delete)
- Email sync: Khi tạo user, nếu employee.email null, sync user.email → employee.email

**Validation Rules**: VR-MD-021 (email uniqueness), VR-MD-022 (user linking)

**Position-Role Mapping** (configurable):
```typescript
const POSITION_ROLE_MAPPING = {
  "Sales Manager": ["SALES_MANAGER", "SALES_STAFF"],
  "Service Advisor": ["SERVICE_ADVISOR", "SERVICE_STAFF"],
  "Technician": ["TECHNICIAN"],
  "Admin Staff": ["ADMIN"],
  "Warehouse Manager": ["WAREHOUSE_MANAGER", "WAREHOUSE_STAFF"],
  "Accountant": ["ACCOUNTANT"],
  "HR Manager": ["HR_MANAGER", "ADMIN"]
};
```

<!-- END CR-20260205-ADMIN-FUNCS -->

---

#### FR-MD-005-01-08: Employee Termination Lifecycle (NEW)

<!-- CR-20260205-ADMIN-FUNCS: ADDED -->

**Preconditions**:
- User has role: Admin or HR_MANAGER
- User is authenticated
- Employee exists with status = ACTIVE or ON_LEAVE
- Employee has linked user account (user_id not null)

**Main Flow**:
1. Admin updates employee status to "TERMINATED"
2. System checks if employee has linked user (user_id not null)
3. If linked user exists:
   
   a. **Create Notification**:
   - System creates notification record:
     * Type: EMPLOYEE_TERMINATED_WITH_USER
     * Title: "Employee [full_name] terminated"
     * Message: "User account [email] is still ACTIVE. Review required."
     * Action URL: `/admin/users/[user_id]`
     * Target roles: ADMIN, HR_MANAGER
     * Severity: WARNING
     * Status: UNREAD
   
   b. **Create Scheduled Task**:
   - System creates scheduled_tasks record:
     * Task type: DEACTIVATE_USER
     * Target ID: user_id
     * Scheduled at: NOW() + 7 days (grace period)
     * Status: PENDING
     * Can cancel: true
     * Created by: current user ID
   
   c. **Display Warning**:
   - System displays warning dialog to admin:
     * Title: "⚠️ Employee Has Active User Account"
     * Message: "This employee has an active user account ([email]). The account will be automatically deactivated in 7 days unless you take action."
     * Options:
       - "Proceed with Termination" (default)
       - "Deactivate User Now" (immediate action)
       - "Cancel Termination"
   
   d. **Admin Actions**:
   - If "Proceed with Termination":
     * Continue with employee termination
     * Notification and scheduled task remain
   - If "Deactivate User Now":
     * System immediately sets User.status = INACTIVE
     * System cancels scheduled task
     * System logs immediate deactivation
     * Continue with employee termination
   - If "Cancel Termination":
     * System aborts employee status change
     * No notification or task created

4. If no linked user:
   - System proceeds with termination normally (no warnings)

5. System updates employee.status = TERMINATED
6. System logs to activity_logs

**Postconditions**:
- Employee status = TERMINATED
- Notification created for admins (if linked user exists)
- Scheduled task created with 7-day grace period (if linked user exists)
- Admin dashboard shows pending review item
- User account remains ACTIVE (until manual or scheduled deactivation)

**Admin Dashboard Widget**:
- Widget title: "⚠️ Terminated Employees with Active Users (X)"
- Table columns:
  * Employee Name
  * User Email
  * Terminated Date
  * User Status
  * Auto-Deactivate Date
  * Actions: "Deactivate Now", "Keep Active", "View Details"

**Business Rules**:
- Grace period: 7 days (configurable)
- Auto-deactivation: Can be cancelled by admin before scheduled date
- Manual override: Admin can deactivate immediately
- Notification: Sent to ADMIN and HR_MANAGER roles only
- Audit trail: All actions logged (termination, notification, scheduled task, deactivation)

**Validation Rules**: VR-MD-023 (termination lifecycle)

<!-- END CR-20260205-ADMIN-FUNCS -->

---

#### FR-MD-005-01-02: Read Employee List (UPDATED)

<!-- CR-20260205-ADMIN-FUNCS: MODIFIED -->

**Changes from v1.2**:
1. **Add User Column**: Display linked user account
2. **Update Filter Dropdowns**: Use SmartSelect instead of hardcoded arrays

**Table Columns** (updated):
- Employee Code (sortable)
- Full Name (sortable)
- Email
- Phone
- Department (sortable, from master_departments)
- Position (sortable, from master_positions)
- Level (sortable, from master_levels)
<!-- CR-20260205-ADMIN-FUNCS: ADDED -->
- User Account (badge display: email or "No user")
<!-- END CR-20260205-ADMIN-FUNCS -->
- Status (filterable, badge display)
- Actions (Edit, Delete icons)

**Filter Options** (updated):
<!-- CR-20260205-ADMIN-FUNCS: MODIFIED -->
- Department: SmartSelect (endpoint: `/api/shared/search/departments`, context: {onlyActive: true})
- Position: SmartSelect (endpoint: `/api/shared/search/positions`, context: {onlyActive: true})
- Level: SmartSelect (endpoint: `/api/shared/search/employee-levels`, context: {onlyActive: true})
<!-- END CR-20260205-ADMIN-FUNCS -->
- Status: Dropdown (ACTIVE, TERMINATED, ON_LEAVE, All)

<!-- END CR-20260205-ADMIN-FUNCS -->

---

### FR-MD-007: Warehouse Management (UPDATED)

<!-- CR-20260205-ADMIN-FUNCS: MODIFIED -->

#### FR-MD-007-01: Create Warehouse (UPDATED)

**Changes from v1.2**:
1. **Remove Mock Managers**: Replace hardcoded manager array with SmartSelect

**Form Fields** (updated):

<!-- CR-20260205-ADMIN-FUNCS: MODIFIED -->
- `manager_id` (SmartSelect from `/api/shared/search/employees`, required)
  * Context filters:
    - `onlyActive`: true (only active employees)
    - `positionFilter`: ["Manager", "Supervisor", "Director"]
  * Display format: "[full_name] | [employee_code] | [position_name]"
  * Placeholder: "Chọn quản lý..."
<!-- END CR-20260205-ADMIN-FUNCS -->

**Validation** (updated):
<!-- CR-20260205-ADMIN-FUNCS: MODIFIED -->
- `manager_id`: must be valid active employee ID
<!-- END CR-20260205-ADMIN-FUNCS -->

**Validation Rules**: VR-MD-024 (manager validation)

<!-- END CR-20260205-ADMIN-FUNCS -->

---

<!-- END CR-20260205-ADMIN-FUNCS -->

---

## 3. Validation Rules

### [EXISTING] VR-MD-001 to VR-MD-019
*(No changes - keep existing content from v1.2)*

---

<!-- CR-20260205-ADMIN-FUNCS: ADDED -->

### VR-MD-020: Master Data Name Uniqueness

**Rule ID**: VR-MD-020  
**Applies to**: Departments, Positions, Levels  
**Severity**: ERROR

**Description**:
Entity names (department_name, position_name, level_name) must be unique within their respective tables, case-insensitive.

**Validation Logic**:
```typescript
async function validateMasterDataName(
  table: 'master_departments' | 'master_positions' | 'master_levels',
  nameField: string,
  name: string,
  excludeId?: string
) {
  const existing = await prisma[table].findFirst({
    where: { 
      [nameField]: { equals: name, mode: 'insensitive' }
    }
  });
  
  if (existing && existing.id !== excludeId) {
    throw new ValidationError(`${nameField} already exists`);
  }
}
```

**Error Message**:
- "Department name already exists"
- "Position name already exists"
- "Level name already exists"

---

### VR-MD-021: User Email Uniqueness

**Rule ID**: VR-MD-021  
**Applies to**: User creation  
**Severity**: ERROR

**Description**:
User email must be unique in the User table.

**Validation Logic**:
```typescript
async function validateUserEmail(email: string, excludeUserId?: string) {
  const existing = await prisma.User.findUnique({ where: { email } });
  if (existing && existing.id !== excludeUserId) {
    throw new ValidationError("Email already used by another user");
  }
}
```

**Error Message**: "Email already used by another user"

---

### VR-MD-022: Employee-User Linking

**Rule ID**: VR-MD-022  
**Applies to**: Employee-User linking  
**Severity**: ERROR

**Description**:
- One employee can link to at most one user (1-to-1)
- One user can link to at most one employee (1-to-1)

**Validation Logic**:
```typescript
async function validateEmployeeUserLink(employeeId: string, userId: string) {
  // Check employee not already linked to different user
  const employee = await prisma.employees.findUnique({ 
    where: { id: employeeId } 
  });
  if (employee.user_id && employee.user_id !== userId) {
    throw new ValidationError("Employee already linked to another user");
  }
  
  // Check user not already linked to different employee
  const user = await prisma.User.findUnique({ 
    where: { id: userId }, 
    include: { employees: true } 
  });
  if (user.employees && user.employees.id !== employeeId) {
    throw new ValidationError("User already linked to another employee");
  }
}
```

**Error Messages**:
- "Employee already linked to another user"
- "User already linked to another employee"

---

### VR-MD-023: Employee Termination Lifecycle

**Rule ID**: VR-MD-023  
**Applies to**: Employee status change to TERMINATED  
**Severity**: WARNING

**Description**:
When employee status changes to TERMINATED and employee has linked user account, system must create notification and scheduled task.

**Validation Logic**:
```typescript
async function validateEmployeeTermination(employeeId: string, newStatus: string) {
  if (newStatus === "TERMINATED") {
    const employee = await prisma.employees.findUnique({
      where: { id: employeeId },
      include: { User: true }
    });
    
    if (employee.User && employee.User.status === "ACTIVE") {
      return {
        warning: true,
        message: "Employee has active user account. Account will be deactivated in 7 days.",
        user_email: employee.User.email,
        requires_action: true
      };
    }
  }
  return { warning: false };
}
```

**Warning Message**: "Employee has active user account ([email]). Account will be deactivated in 7 days unless you take action."

---

### VR-MD-024: Warehouse Manager Validation

**Rule ID**: VR-MD-024  
**Applies to**: Warehouse creation/update  
**Severity**: ERROR

**Description**:
Warehouse manager must be a valid, active employee.

**Validation Logic**:
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
  
  // Optional: Check position (warning only)
  const validPositions = ["Manager", "Supervisor", "Director"];
  if (!validPositions.includes(employee.master_positions?.position_name)) {
    console.warn(
      `Employee ${employee.full_name} position is ${employee.master_positions?.position_name}, ` +
      `not a typical manager position`
    );
  }
}
```

**Error Messages**:
- "Manager must be a valid employee"
- "Manager must be an active employee"

---

### VR-MD-025: Employee Full Name Required

**Rule ID**: VR-MD-025  
**Applies to**: Employee creation/update  
**Severity**: ERROR

**Description**:
Employee full_name is required and must not exceed 200 characters.

**Validation Logic**:
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

**Error Messages**:
- "Full name is required"
- "Full name must be less than 200 characters"

<!-- END CR-20260205-ADMIN-FUNCS -->

---

## 4. Permission Matrix

*(Keep existing content from v1.2, no changes)*

---

## 5. Integration Points

### [EXISTING] Integration Points from v1.2
*(Keep existing content)*

---

<!-- CR-20260205-ADMIN-FUNCS: ADDED -->

### INT-MD-006: SmartSelect Search Endpoints

**Integration Point**: SmartSelect component → Search API endpoints

**Endpoints**:
1. `POST /api/shared/search/departments`
2. `POST /api/shared/search/positions`
3. `POST /api/shared/search/employee-levels`
4. `POST /api/shared/search/employees`
5. `POST /api/shared/search/users`

**Request Format** (all endpoints):
```typescript
{
  "query": string,           // Search term (optional)
  "limit": number,           // Max results (default 20, max 100)
  "cursor": string | null,   // Pagination cursor (optional)
  "context": {               // Context-specific filters
    "onlyActive": boolean,   // Filter by status = ACTIVE
    // Endpoint-specific context fields...
  }
}
```

**Response Format** (all endpoints):
```typescript
{
  "items": [
    {
      "id": string,          // Entity ID
      "label": string,       // Primary display text
      "subtitle": string,    // Secondary display text
      "meta": object         // Full entity data
    }
  ],
  "nextCursor": string | null  // Pagination cursor
}
```

**Used By**:
- Employee Management (departments, positions, levels, users)
- Warehouse Management (employees)
- User Management (departments - computed field)

**Performance Requirements**:
- Response time: < 200ms (p95)
- Pagination: Cursor-based
- Search: Debounced (300ms)
- Caching: 5 minutes for active entities

<!-- END CR-20260205-ADMIN-FUNCS -->

---

## 6. Traceability

### [EXISTING] Traceability from v1.2
*(Keep existing content)*

---

<!-- CR-20260205-ADMIN-FUNCS: ADDED -->

### Traceability: CR-20260205-ADMIN-FUNCS

| BRD Requirement | FRD Requirement | ERD Table | API Endpoint | UI Screen |
|-----------------|-----------------|-----------|--------------|-----------|
| BR-MD-005-02 | FR-MD-005-02 | master_departments | /api/master/departments, /api/shared/search/departments | /master-data/departments |
| BR-MD-005-02 | FR-MD-005-03 | master_positions | /api/master/positions, /api/shared/search/positions | /master-data/positions |
| BR-MD-005-02 | FR-MD-005-04 | master_levels | /api/master/levels, /api/shared/search/employee-levels | /master-data/levels |
| BR-MD-005-03 | FR-MD-005-01-07 | employees, User | /api/master/employees/:id/create-user, /api/shared/search/users | /master-data/employees (User Linking section) |
| BR-MD-005-04 | FR-MD-005-01-08 | employees, User, notifications, scheduled_tasks | /api/master/employees (status update) | /master-data/employees, Admin Dashboard |

<!-- END CR-20260205-ADMIN-FUNCS -->

---

## 📊 CHANGE LOG

### Version 1.3 (DRAFT) - 2026-02-05
**CR**: CR-20260205-ADMIN-FUNCS

#### Added
- FR-MD-005-02: Department Management (6 sub-requirements)
- FR-MD-005-03: Position Management (6 sub-requirements)
- FR-MD-005-04: Level Management (6 sub-requirements)
- FR-MD-005-01-07: Link Employee to User Account
- FR-MD-005-01-08: Employee Termination Lifecycle
- VR-MD-020: Master Data Name Uniqueness
- VR-MD-021: User Email Uniqueness
- VR-MD-022: Employee-User Linking
- VR-MD-023: Employee Termination Lifecycle
- VR-MD-024: Warehouse Manager Validation
- VR-MD-025: Employee Full Name Required
- INT-MD-006: SmartSelect Search Endpoints

#### Modified
- FR-MD-005-01-01: Create Employee (schema fix, add email, SmartSelect filters)
- FR-MD-005-01-02: Read Employee List (add user column, SmartSelect filters)
- FR-MD-007-01: Create Warehouse (SmartSelect for manager)

#### Removed
- Mock data arrays from Employee Management filters
- Mock managers array from Warehouse Management
- first_name, last_name fields (replaced with full_name)

### Version 1.2 - 2026-02-02
**CR**: CR-20260202-001 (Emergency Master Data)
*(Existing change log from v1.2)*

---

**END OF DRAFT DOCUMENT**

---

## 📝 NOTES FOR REVIEWERS

1. **Base Document**: This draft is based on `frd_master_data_v1.2.md` (1748 lines)
2. **Change Markers**: All changes marked with `<!-- CR-20260205-ADMIN-FUNCS: ... -->`
3. **Sections Not Shown**: Existing sections (FR-MD-001 to FR-MD-004, VR-MD-001 to VR-MD-019, Permission Matrix) remain unchanged
4. **Next Steps**: After approval, merge into main FRD v1.3 and remove CR markers
5. **Related Documents**: 
   - BRD draft: `BRD_CR-20260205-ADMIN-FUNCS_DRAFT.md`
   - ERD draft: `erd_master_data_CR-20260205-ADMIN-FUNCS_DRAFT/`
   - API Spec draft: `api_spec_CR-20260205-ADMIN-FUNCS_DRAFT.md`
