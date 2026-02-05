# ERD Master Data - DRAFT for CR-20260205-ADMIN-FUNCS

**Base Version**: ERD Master Data v1.2  
**Draft Version**: v1.3 (DRAFT)  
**CR**: CR-20260205-ADMIN-FUNCS  
**Date**: 2026-02-05  
**Status**: DRAFT

---

## ⚠️ DRAFT NOTICE

This is a DRAFT version created for CR-20260205-ADMIN-FUNCS review.  
**Base documents**: `erd_master_data_v1.2.md`, `honda_dms_erd_diagram.png`  
**Changes marked with**: `<!-- CR-20260205-ADMIN-FUNCS: ... -->`

---

## 📝 SCHEMA CHANGES SUMMARY

### Modified Tables: 1

#### employees (MODIFIED)

<!-- CR-20260205-ADMIN-FUNCS: MODIFIED -->

**Change**: Add `email` field

**Before**:
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
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt
  deleted_at        DateTime?
  
  // Relations
  master_departments  master_departments? @relation(fields: [department_id], references: [id])
  master_positions    master_positions?   @relation(fields: [position_id], references: [id])
  master_levels       master_levels?      @relation(fields: [level_id], references: [id])
  User                User?               @relation(fields: [user_id], references: [id])
  warehouses          warehouses[]        @relation("warehouse_manager")
}
```

**After**:
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
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt
  deleted_at        DateTime?
  
  // Relations (unchanged)
  master_departments  master_departments? @relation(fields: [department_id], references: [id])
  master_positions    master_positions?   @relation(fields: [position_id], references: [id])
  master_levels       master_levels?      @relation(fields: [level_id], references: [id])
  User                User?               @relation(fields: [user_id], references: [id])
  warehouses          warehouses[]        @relation("warehouse_manager")
}
```

**Migration SQL**:
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

**Rationale**:
- Facilitate user account creation for employees
- Optional field (drivers, cleaners không cần email)
- NOT unique (multiple employees có thể share: info@honda.com)
- Only User.email is unique

**Breaking Changes**: None (nullable field, additive change)

<!-- END CR-20260205-ADMIN-FUNCS -->

---

### New Tables: 0

**Note**: All required tables already exist:
- ✅ `master_departments` (exists, no changes)
- ✅ `master_positions` (exists, no changes)
- ✅ `master_levels` (exists, no changes)
- ✅ `employees` (exists, add 1 field)
- ✅ `User` (exists, no schema changes)
- ✅ `warehouses` (exists, no changes)

---

## 📚 DICTIONARY UPDATES

### employees.md (UPDATED)

<!-- CR-20260205-ADMIN-FUNCS: MODIFIED -->

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
| created_at | TIMESTAMP | No | NOW() | - | Record creation timestamp |
| updated_at | TIMESTAMP | No | NOW() | - | Last update timestamp |
| deleted_at | TIMESTAMP | Yes | NULL | - | Soft delete timestamp |

## Indexes
- PRIMARY KEY (id)
- UNIQUE (employee_code)
- UNIQUE (user_id)
- INDEX (department_id)
- INDEX (position_id)
- INDEX (level_id)
- INDEX (status)
- INDEX (deleted_at)

## Relationships
- **master_departments** (N:1): employees.department_id → master_departments.id
- **master_positions** (N:1): employees.position_id → master_positions.id
- **master_levels** (N:1): employees.level_id → master_levels.id
- **User** (1:1 optional): employees.user_id → User.id
- **warehouses** (1:N): employees.id ← warehouses.manager_id

## Usage
- **Screens**: Employee Management, User Management, Warehouse Management
- **APIs**: 
  - `/api/master/employees` (CRUD)
  - `/api/shared/search/employees` (SmartSelect)
  - `/api/master/employees/:id/create-user` (User linking)

## Business Rules
- BR-MD-005-01: Employee CRUD operations
- BR-MD-005-03: Employee-User linking (1-to-1 optional)
- BR-MD-005-04: Lifecycle management (termination warnings)
- **NEW**: Email is optional (drivers, cleaners không cần)
- **NEW**: Email NOT unique (multiple employees có thể share: info@honda.com)
- **NEW**: Only User.email is unique
- **NEW**: When creating user for employee, email syncs bidirectionally

## Validation Rules
- VR-MD-025: full_name required, max 200 chars
- VR-MD-022: user_id must be unique (1-to-1 with User)
- VR-MD-023: Termination lifecycle (warnings for linked users)

## Sample Data
```sql
INSERT INTO employees (id, employee_code, full_name, email, phone, department_id, position_id, level_id, status, user_id)
VALUES 
  ('emp_001', 'EMP-001', 'Nguyễn Văn A', 'nguyenvana@honda.com', '0901234567', 'dept_001', 'pos_001', 'lvl_003', 'ACTIVE', 'user_001'),
  ('emp_002', 'EMP-002', 'Trần Thị B', NULL, '0907654321', 'dept_002', 'pos_002', 'lvl_002', 'ACTIVE', NULL),
  ('emp_003', 'EMP-003', 'Lê Văn C', 'info@honda.com', '0909876543', 'dept_003', 'pos_003', 'lvl_001', 'ACTIVE', NULL);
```

## Migration Notes
- **CR-20260205-ADMIN-FUNCS**: Added `email` field (optional, not unique)
- Migration: 
  1. Add column as nullable
  2. Backfill email from User.email for existing linked employees
  3. No breaking changes (nullable field)
- Estimated migration time: < 1 minute (for 1000 employees)
```

<!-- END CR-20260205-ADMIN-FUNCS -->

---

## 📊 ERD DIAGRAM CHANGES

### Visual Changes

<!-- CR-20260205-ADMIN-FUNCS: MODIFIED -->

**employees table** (add field):
```
┌─────────────────────────────────┐
│         employees               │
├─────────────────────────────────┤
│ id (PK)                         │
│ employee_code (UNIQUE)          │
│ full_name                       │
│ email (NEW) ◄─────────────────┐ │
│ phone                           │ │
│ address                         │ │
│ hire_date                       │ │
│ status                          │ │
│ department_id (FK)              │ │
│ position_id (FK)                │ │
│ level_id (FK)                   │ │
│ user_id (FK, UNIQUE)            │ │
│ created_at                      │ │
│ updated_at                      │ │
│ deleted_at                      │ │
└─────────────────────────────────┘ │
                                    │
Note: email is optional, NOT unique │
```

**No changes to**:
- master_departments table
- master_positions table
- master_levels table
- User table
- warehouses table
- Relationships between tables

<!-- END CR-20260205-ADMIN-FUNCS -->

---

## 🔄 MIGRATION STRATEGY

### Phase 1: Schema Update (Non-breaking)

```sql
-- Step 1: Add column (nullable, no constraints)
ALTER TABLE employees ADD COLUMN email VARCHAR(200);

-- Step 2: Backfill from User table
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
```

### Phase 2: Application Deployment

1. Deploy API changes (add email field to Employee endpoints)
2. Deploy UI changes (add email field to Employee form)
3. No downtime required (additive change)

### Phase 3: Validation

```sql
-- Check for data quality
SELECT 
  e.id,
  e.employee_code,
  e.full_name,
  e.email as employee_email,
  u.email as user_email,
  CASE 
    WHEN e.email IS NULL AND u.email IS NOT NULL THEN 'Missing sync'
    WHEN e.email != u.email THEN 'Email mismatch'
    ELSE 'OK'
  END as status
FROM employees e
LEFT JOIN "User" u ON e.user_id = u.id
WHERE e.deleted_at IS NULL
  AND e.user_id IS NOT NULL;
```

### Rollback Plan

```sql
-- If needed, rollback is simple (no data loss)
ALTER TABLE employees DROP COLUMN email;
```

**Risk**: LOW (nullable field, no constraints, no breaking changes)

---

## 📈 CHANGE LOG

### Version 1.3 (DRAFT) - 2026-02-05
**CR**: CR-20260205-ADMIN-FUNCS

#### Modified Tables
- **employees**: Added `email` field (VARCHAR(200), nullable, not unique)

#### New Tables
- None

#### Removed Tables
- None

#### Migration
- Add `email` column to `employees` table
- Backfill from `User.email` for linked employees
- No breaking changes

### Version 1.2 - 2026-02-02
**CR**: CR-20260202-001 (Emergency Master Data)
*(Existing change log from v1.2)*

---

**END OF DRAFT DOCUMENT**

---

## 📝 NOTES FOR REVIEWERS

1. **Base Document**: This draft is based on `erd_master_data_v1.2.md`
2. **Change Markers**: All changes marked with `<!-- CR-20260205-ADMIN-FUNCS: ... -->`
3. **Schema Impact**: Minimal (1 field addition, nullable, no breaking changes)
4. **Migration Risk**: LOW (additive change, simple backfill)
5. **Next Steps**: After approval, update main ERD v1.3, update diagram, remove CR markers
6. **Related Documents**: 
   - BRD draft: `BRD_CR-20260205-ADMIN-FUNCS_DRAFT.md`
   - FRD draft: `frd_master_data_CR-20260205-ADMIN-FUNCS_DRAFT.md`
   - API Spec draft: `api_spec_CR-20260205-ADMIN-FUNCS_DRAFT.md`
