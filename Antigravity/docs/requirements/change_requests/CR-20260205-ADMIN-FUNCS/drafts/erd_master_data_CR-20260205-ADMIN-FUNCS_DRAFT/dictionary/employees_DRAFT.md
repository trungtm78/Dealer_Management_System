# employees Table Dictionary

**Table Name**: `employees`  
**CR**: CR-20260205-ADMIN-FUNCS  
**Status**: DRAFT  
**Version**: v1.3 (DRAFT)

---

## Purpose
Stores employee profiles for Honda dealership staff.

## Classification
- **Type**: Master Data
- **Sensitivity**: Medium (PII - Personal Identifiable Information)
- **Retention**: Permanent (soft delete only via `deleted_at`)
- **Access**: Admin, HR_MANAGER (full), All authenticated users (read-only)

---

## Columns

| Column | Type | Nullable | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| id | UUID | No | uuid() | PK | Unique identifier |
| employee_code | VARCHAR(50) | No | - | UNIQUE | Auto-generated code (EMP-XXX) |
| full_name | VARCHAR(200) | No | - | - | Employee full name |
| **email** | **VARCHAR(200)** | **Yes** | **NULL** | **-** | **Employee email (optional, NOT unique)** ← NEW |
| phone | VARCHAR(20) | Yes | NULL | - | Contact phone number |
| address | TEXT | Yes | NULL | - | Home address |
| hire_date | DATE | Yes | NULL | - | Date of hire |
| status | VARCHAR(20) | No | 'ACTIVE' | ENUM | Employee status: ACTIVE, TERMINATED, ON_LEAVE |
| department_id | UUID | Yes | NULL | FK → master_departments.id | Department assignment |
| position_id | UUID | Yes | NULL | FK → master_positions.id | Job position |
| level_id | UUID | Yes | NULL | FK → master_levels.id | Employee level/seniority |
| user_id | UUID | Yes | NULL | FK → User.id, UNIQUE | Linked user account (1-to-1) |
| created_at | TIMESTAMP | No | NOW() | - | Record creation timestamp |
| updated_at | TIMESTAMP | No | NOW() | AUTO | Last update timestamp (auto-updated) |
| deleted_at | TIMESTAMP | Yes | NULL | - | Soft delete timestamp |

---

## Indexes

| Index Name | Type | Columns | Purpose |
|------------|------|---------|---------|
| employees_pkey | PRIMARY KEY | id | Primary key |
| employees_employee_code_key | UNIQUE | employee_code | Unique employee code |
| employees_user_id_key | UNIQUE | user_id | 1-to-1 relationship with User |
| idx_employees_department | INDEX | department_id | Filter by department |
| idx_employees_position | INDEX | position_id | Filter by position |
| idx_employees_level | INDEX | level_id | Filter by level |
| idx_employees_status | INDEX | status | Filter by status (ACTIVE/TERMINATED) |
| idx_employees_deleted_at | INDEX | deleted_at | Soft delete queries |

**Note**: No index on `email` because:
- Not unique (multiple employees can share email)
- Not frequently queried alone
- Only used for user creation (infrequent operation)

---

## Relationships

### Foreign Keys (N:1)

| FK Column | References | Relationship | On Delete | Description |
|-----------|------------|--------------|-----------|-------------|
| department_id | master_departments.id | N:1 (optional) | SET NULL | Employee belongs to department |
| position_id | master_positions.id | N:1 (optional) | SET NULL | Employee has position |
| level_id | master_levels.id | N:1 (optional) | SET NULL | Employee has level |
| user_id | User.id | 1:1 (optional) | SET NULL | Employee linked to user account |

### Reverse Relationships (1:N)

| Table | FK Column | Relationship | Description |
|-------|-----------|--------------|-------------|
| warehouses | manager_id | 1:N | Employee manages warehouses |

---

## Usage

### Screens
- `/master-data/employees` - Employee Management (CRUD)
- `/master-data/warehouses` - Warehouse Management (manager selection)
- `/admin/users` - User Management (employee linking)
- `/admin/dashboard` - Admin Dashboard (termination warnings)

### API Endpoints
- `GET /api/master/employees` - List employees
- `POST /api/master/employees` - Create employee
- `PUT /api/master/employees/:id` - Update employee
- `DELETE /api/master/employees/:id` - Soft delete employee
- `POST /api/shared/search/employees` - SmartSelect search (NEW)
- `POST /api/master/employees/:id/create-user` - Create user for employee (NEW)

---

## Business Rules

### BR-MD-005-01: Employee CRUD
- Employee code auto-generated (format: `EMP-XXX`)
- Full name required, max 200 chars
- Email optional, max 200 chars, valid email format
- Status defaults to ACTIVE
- Department, position, level optional (can be assigned later)

### BR-MD-005-03: Employee-User Linking (NEW)
- One employee can link to at most one user (1-to-1)
- One user can link to at most one employee (1-to-1)
- user_id must be unique across employees
- When creating user for employee, email syncs bidirectionally:
  - If employee.email exists → use for User.email
  - If employee.email null → sync User.email back to employee.email
- Unlinking employee from user does NOT delete user account

### BR-MD-005-04: Lifecycle Management (NEW)
- When employee status changes to TERMINATED:
  - If employee has linked user (user_id not null):
    - System creates notification for ADMIN, HR_MANAGER
    - System creates scheduled task to deactivate user in 7 days
    - Admin can deactivate immediately or cancel scheduled task
  - If no linked user: proceed normally
- Grace period: 7 days (configurable)
- Audit trail: All lifecycle events logged

### Email Field Rules (NEW)
- **Optional**: Not all employees need email (e.g., drivers, cleaners)
- **NOT Unique**: Multiple employees can share email (e.g., info@honda.com)
- **Only User.email is unique**: Enforced at User table level
- **Validation**: If provided, must be valid email format

---

## Validation Rules

### VR-MD-025: Employee Full Name Required
```typescript
if (!data.full_name || data.full_name.trim().length === 0) {
  throw new ValidationError("Full name is required");
}
if (data.full_name.length > 200) {
  throw new ValidationError("Full name must be less than 200 characters");
}
```

### VR-MD-022: Employee-User Linking
```typescript
// Check employee not already linked to different user
if (employee.user_id && employee.user_id !== userId) {
  throw new ValidationError("Employee already linked to another user");
}
// Check user not already linked to different employee
if (user.employees && user.employees.id !== employeeId) {
  throw new ValidationError("User already linked to another employee");
}
```

### VR-MD-023: Employee Termination Lifecycle
```typescript
if (newStatus === "TERMINATED" && employee.User?.status === "ACTIVE") {
  return {
    warning: true,
    message: "Employee has active user account. Account will be deactivated in 7 days.",
    requires_action: true
  };
}
```

---

## Sample Data

```sql
INSERT INTO employees (
  id, employee_code, full_name, email, phone, 
  department_id, position_id, level_id, status, user_id
)
VALUES 
  -- Employee with user account
  (
    'emp_001', 
    'EMP-001', 
    'Nguyễn Văn A', 
    'nguyenvana@honda.com', 
    '0901234567', 
    'dept_001', -- Sales Department
    'pos_001',  -- Sales Manager
    'lvl_003',  -- Level 3
    'ACTIVE', 
    'user_001'
  ),
  
  -- Employee without user account (no email)
  (
    'emp_002', 
    'EMP-002', 
    'Trần Thị B', 
    NULL,  -- No email
    '0907654321', 
    'dept_002', -- Service Department
    'pos_002',  -- Service Advisor
    'lvl_002',  -- Level 2
    'ACTIVE', 
    NULL  -- No user account
  ),
  
  -- Employee with shared email (no user account)
  (
    'emp_003', 
    'EMP-003', 
    'Lê Văn C', 
    'info@honda.com',  -- Shared email
    '0909876543', 
    'dept_003', -- Parts Department
    'pos_003',  -- Parts Staff
    'lvl_001',  -- Level 1
    'ACTIVE', 
    NULL
  ),
  
  -- Terminated employee with user account
  (
    'emp_004', 
    'EMP-004', 
    'Phạm Thị D', 
    'phamthid@honda.com', 
    '0905551234', 
    'dept_001', 
    'pos_004',  -- Sales Staff
    'lvl_002', 
    'TERMINATED',  -- Terminated
    'user_004'  -- User account still exists
  );
```

---

## Migration Notes

### CR-20260205-ADMIN-FUNCS: Add Email Field

**Change**: Added `email` field (VARCHAR(200), nullable, not unique)

**Migration SQL**:
```sql
-- Step 1: Add column (nullable, no constraints)
ALTER TABLE employees ADD COLUMN email VARCHAR(200);

-- Step 2: Backfill from User table for existing linked employees
UPDATE employees e
SET email = u.email
FROM "User" u
WHERE e.user_id = u.id
  AND e.email IS NULL
  AND u.email IS NOT NULL;

-- Step 3: Verify migration
SELECT 
  COUNT(*) as total_employees,
  COUNT(email) as employees_with_email,
  COUNT(user_id) as employees_with_user,
  COUNT(CASE WHEN user_id IS NOT NULL AND email IS NULL THEN 1 END) as linked_but_no_email
FROM employees
WHERE deleted_at IS NULL;

-- Expected result: linked_but_no_email should be 0
```

**Rollback**:
```sql
ALTER TABLE employees DROP COLUMN email;
```

**Risk**: LOW
- Nullable field (no data required)
- No constraints (no validation failures)
- Additive change (no breaking changes)
- Simple backfill (one-time sync from User table)

**Estimated Time**: < 1 minute for 1000 employees

---

## Performance Considerations

### Query Patterns

**Common Queries**:
```sql
-- List active employees by department
SELECT * FROM employees 
WHERE department_id = ? AND status = 'ACTIVE' AND deleted_at IS NULL
ORDER BY full_name;
-- Uses: idx_employees_department, idx_employees_status

-- Search employees for SmartSelect
SELECT * FROM employees 
WHERE (full_name ILIKE ? OR employee_code ILIKE ?)
  AND status = 'ACTIVE' 
  AND deleted_at IS NULL
LIMIT 20;
-- Full table scan (acceptable for SmartSelect with debounce)

-- Find employee by user_id
SELECT * FROM employees WHERE user_id = ?;
-- Uses: employees_user_id_key (unique index)
```

**Performance Targets**:
- List queries: < 100ms (p95)
- Search queries: < 200ms (p95)
- User lookup: < 10ms (p95)

---

## Security & Privacy

### PII Fields
- `full_name` - Personal name
- `email` - Contact information
- `phone` - Contact information
- `address` - Home address

### Access Control
- **Read**: All authenticated users (for dropdowns, references)
- **Create/Update**: Admin, HR_MANAGER only
- **Delete**: Admin only (soft delete)
- **PII Access**: Logged in audit_logs

### Data Retention
- Active employees: Retained indefinitely
- Terminated employees: Soft deleted (deleted_at set), retained for 7 years
- Hard delete: Never (preserve historical data)

---

**END OF DICTIONARY**
