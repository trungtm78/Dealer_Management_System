# HANDOVER TO OPENCODE: CR-20260205-ADMIN-FUNCS

**CR ID**: CR-20260205-ADMIN-FUNCS  
**Title**: Triển khai chức năng master user, employee  
**Priority**: CRITICAL  
**Complexity**: COMPLEX  
**Effort**: 120 hours (15 developer-days)  
**Team**: 2 developers  
**Duration**: 2 weeks (with testing)  
**Handover Date**: 2026-02-05

---

## 🎯 EXECUTIVE SUMMARY

### Objective
Triển khai toàn bộ chức năng quản lý Master User & Employee, bao gồm:
- 3 new UI pages (Departments, Positions, Levels)
- Employee-User linking functionality
- Employee lifecycle management
- SmartSelect migration (remove mock data)

### Business Impact
- ✅ Fix data integrity issues (mock data, schema mismatch)
- ✅ Enable proper employee-user management
- ✅ Improve UX with SmartSelect dropdowns
- ✅ Comply with FRD requirements

---

## 📦 DELIVERABLES CHECKLIST

### Frontend (UI) - 5 files

#### New Pages (3)
- [ ] `app/(main)/master-data/departments/page.tsx` (~50 lines)
- [ ] `components/master/DepartmentManagement.tsx` (~400 lines)
- [ ] `app/(main)/master-data/positions/page.tsx` (~50 lines)
- [ ] `components/master/PositionManagement.tsx` (~400 lines)
- [ ] `app/(main)/master-data/levels/page.tsx` (~50 lines)
- [ ] `components/master/LevelManagement.tsx` (~400 lines)

#### Modified Pages (2)
- [ ] `components/master/EmployeeManagement.tsx` (~200 lines modified)
  - Fix schema mismatch (full_name)
  - Add email field
  - Remove mock data
  - Add user linking section
  - Add user column in table
- [ ] `components/master/WarehouseManagement.tsx` (~50 lines modified)
  - Remove mock managers
  - Replace with SmartSelect

#### Menu
- [ ] `app/(main)/layout.tsx` (~10 lines modified)
  - Add 3 new menu items

---

### Backend (API) - 9 files

#### New Endpoints (6)
- [ ] `app/api/shared/search/departments/route.ts` (~80 lines)
- [ ] `app/api/shared/search/positions/route.ts` (~80 lines)
- [ ] `app/api/shared/search/employee-levels/route.ts` (~80 lines)
- [ ] `app/api/shared/search/employees/route.ts` (~100 lines)
- [ ] `app/api/shared/search/users/route.ts` (~100 lines)
- [ ] `app/api/master/employees/[id]/create-user/route.ts` (~150 lines)

#### Modified Endpoints (2)
- [ ] `app/api/users/[id]/route.ts` (~20 lines modified)
  - Add computed fields (department, position)
- [ ] `app/api/master/employees/route.ts` (~30 lines modified)
  - Add email field
  - Fix schema (full_name)

---

### Database - 1 file

#### Migration Script
- [ ] `prisma/migrations/YYYYMMDDHHMMSS_add_employee_email/migration.sql`
  ```sql
  ALTER TABLE employees ADD COLUMN email VARCHAR(200);
  
  UPDATE employees e
  SET email = u.email
  FROM "User" u
  WHERE e.user_id = u.id
    AND e.email IS NULL
    AND u.email IS NOT NULL;
  ```

---

## 📚 SINGLE SOURCE OF TRUTH (SSOT)

### Main Documents to Follow

**CRITICAL**: Developers MUST read these consolidated main documents:

1. **BRD v2.6** (if exists, else use v2.5 + CR markers)
   - Location: `docs/requirements/BRD/brd_honda_dms_v2.6.md`
   - Section: 5.8 Module 09: Master Data Management
   - Requirements: BR-MD-005-01 to BR-MD-005-04

2. **FRD Master Data v1.3** (if exists, else use v1.2 + CR drafts)
   - Location: `docs/requirements/FRD/frd_master_data_v1.3.md`
   - Sections:
     * FR-MD-005-02: Department Management
     * FR-MD-005-03: Position Management
     * FR-MD-005-04: Level Management
     * FR-MD-005-01-07: Link Employee to User
     * FR-MD-005-01-08: Employee Termination Lifecycle
   - Validation Rules: VR-MD-020 to VR-MD-025

3. **ERD Master Data v1.3** (if exists, else use v1.2 + CR drafts)
   - Location: `docs/design/database/erd/erd_master_data_v1.3.md`
   - Changes: employees.email field (VARCHAR(200), nullable)

4. **API Spec** (CR drafts)
   - Location: `docs/requirements/change_requests/CR-20260205-ADMIN-FUNCS/drafts/api_spec_CR-20260205-ADMIN-FUNCS_DRAFT.md`
   - 6 new endpoints + 2 modified endpoints

5. **UI Spec** (CR drafts)
   - Location: `docs/requirements/change_requests/CR-20260205-ADMIN-FUNCS/drafts/ui_spec_CR-20260205-ADMIN-FUNCS_DRAFT.md`
   - 3 new pages + 2 modified pages

---

## 🔧 IMPLEMENTATION GUIDE

### Phase 1: Database Migration (1 hour)

**Priority**: Do this FIRST

```bash
# Create migration
npx prisma migrate dev --name add_employee_email

# Verify migration
npx prisma studio
# Check employees table has email column
```

**Validation**:
```sql
SELECT 
  COUNT(*) as total,
  COUNT(email) as with_email,
  COUNT(user_id) as with_user
FROM employees
WHERE deleted_at IS NULL;
```

---

### Phase 2: Backend API (40 hours)

#### Step 1: SmartSelect Search Endpoints (24 hours)

**Pattern**: All 5 endpoints follow the same structure

**Reference**: `app/api/shared/search/customers/route.ts` (existing)

**Template**:
```typescript
// app/api/shared/search/departments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { query, limit = 20, cursor, context } = await req.json();
  
  const where = {
    ...(query && {
      OR: [
        { department_name: { contains: query, mode: 'insensitive' } },
        { department_code: { contains: query, mode: 'insensitive' } }
      ]
    }),
    ...(context?.onlyActive && { status: 'ACTIVE' }),
    deleted_at: null
  };
  
  const items = await prisma.master_departments.findMany({
    where,
    take: limit + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: { department_name: 'asc' }
  });
  
  const hasMore = items.length > limit;
  const results = hasMore ? items.slice(0, -1) : items;
  
  return NextResponse.json({
    items: results.map(item => ({
      id: item.id,
      label: item.department_name,
      subtitle: `${item.department_code} | ${item._count?.employees || 0} employees`,
      meta: item
    })),
    nextCursor: hasMore ? results[results.length - 1].id : null
  });
}
```

**Endpoints to create**:
1. `/api/shared/search/departments` (copy template, replace entity)
2. `/api/shared/search/positions` (copy template, replace entity)
3. `/api/shared/search/employee-levels` (copy template, replace entity)
4. `/api/shared/search/employees` (add joins for department, position, level)
5. `/api/shared/search/users` (add join for employees, computed fields)

**Testing**:
```bash
curl -X POST http://localhost:3000/api/shared/search/departments \
  -H "Content-Type: application/json" \
  -d '{"query": "sales", "limit": 20, "context": {"onlyActive": true}}'
```

---

#### Step 2: Create User Endpoint (10 hours)

**File**: `app/api/master/employees/[id]/create-user/route.ts`

**Business Logic**:
1. Validate employee exists
2. Validate employee.user_id is null
3. Validate email unique in User table
4. Create User record
5. Link employee.user_id = user.id
6. Sync email back to employee if was null
7. Log to activity_logs

**Reference**: API Spec Draft, FR-MD-005-01-07

---

#### Step 3: Modify Existing Endpoints (6 hours)

**File 1**: `app/api/users/[id]/route.ts`
- Add computed fields: department, department_id, position, position_id
- Join with employees → master_departments, master_positions

**File 2**: `app/api/master/employees/route.ts`
- Add email field to request/response
- Fix schema: use full_name (not first_name/last_name)

---

### Phase 3: Frontend UI (50 hours)

#### Step 1: Create 3 New Pages (36 hours)

**Pattern**: All 3 pages follow the same structure

**Reference**: `components/master/EmployeeManagement.tsx` (existing)

**Template Structure**:
```tsx
// components/master/DepartmentManagement.tsx
"use client";

import { useState, useEffect } from "react";
import { Table, Dialog, Input, Textarea, RadioGroup, Button, Badge } from "@/components/ui";
import { SmartSelect } from "@/components/shared/SmartSelect";

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    department_code: "",
    department_name: "",
    description: "",
    status: "ACTIVE"
  });
  
  // Fetch departments
  useEffect(() => {
    fetchDepartments();
  }, []);
  
  const fetchDepartments = async () => {
    const res = await fetch("/api/master/departments");
    const data = await res.json();
    setDepartments(data);
  };
  
  const handleCreate = async () => {
    const res = await fetch("/api/master/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setIsDialogOpen(false);
      fetchDepartments();
    }
  };
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1>Department Management</h1>
        <Button onClick={() => setIsDialogOpen(true)}>+ New</Button>
      </div>
      
      <Table
        columns={[
          { key: "department_code", label: "Code" },
          { key: "department_name", label: "Name" },
          { key: "description", label: "Description" },
          { key: "status", label: "Status", render: (row) => <Badge>{row.status}</Badge> }
        ]}
        data={departments}
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTitle>Create Department</DialogTitle>
        <DialogContent>
          <Input label="Department Name *" value={formData.department_name} onChange={...} required />
          <Textarea label="Description" value={formData.description} onChange={...} />
          <RadioGroup label="Status" value={formData.status} onChange={...} options={[...]} />
          <Button onClick={handleCreate}>Save</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

**Pages to create**:
1. DepartmentManagement.tsx (~400 lines)
2. PositionManagement.tsx (~400 lines)
3. LevelManagement.tsx (~400 lines)

**Refs Strategy**: REUSE AS-IS
- Copy EmployeeManagement.tsx structure
- Replace entity names
- No new components needed

---

#### Step 2: Modify Employee Management (10 hours)

**File**: `components/master/EmployeeManagement.tsx`

**Changes**:
1. Fix schema mismatch:
   ```tsx
   // ❌ DELETE
   <Input label="First Name" id="first_name" />
   <Input label="Last Name" id="last_name" />
   
   // ✅ ADD
   <Input label="Full Name *" id="full_name" required />
   <Input label="Email (Optional)" id="email" type="email" />
   ```

2. Remove mock data (lines 73-99):
   ```tsx
   // ❌ DELETE
   const departments = [...]
   const positions = [...]
   const levels = [...]
   ```

3. Replace filters with SmartSelect:
   ```tsx
   // ✅ ADD
   const departmentDataSource = {
     search: async (req) => {
       const res = await fetch('/api/shared/search/departments', {
         method: 'POST',
         body: JSON.stringify(req)
       });
       return res.json();
     }
   };
   
   <SmartSelect
     dataSource={departmentDataSource}
     value={selectedDepartment}
     onChange={setSelectedDepartment}
     label="Department"
     allowClear
   />
   ```

4. Add user linking section (see UI Spec Draft for full code)

---

#### Step 3: Modify Warehouse Management (4 hours)

**File**: `components/master/WarehouseManagement.tsx`

**Changes**:
1. Remove mock managers (lines 56-63)
2. Replace manager select with SmartSelect:
   ```tsx
   const employeeDataSource = {
     search: async (req) => {
       const res = await fetch('/api/shared/search/employees', {
         method: 'POST',
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
   
   <SmartSelect
     dataSource={employeeDataSource}
     value={formData.manager_id}
     onChange={(id) => setFormData({ ...formData, manager_id: id })}
     label="Quản Lý *"
     required
   />
   ```

---

### Phase 4: Testing & UAT (29 hours)

#### Unit Tests (10 hours)
- Test all 6 new API endpoints
- Test 2 modified API endpoints
- Test migration script

#### Integration Tests (10 hours)
- Test SmartSelect integration
- Test employee-user linking flow
- Test termination lifecycle

#### UAT (9 hours)
- Test all 3 new pages (CRUD operations)
- Test employee management (schema fix, user linking)
- Test warehouse management (SmartSelect)
- Verify data integrity

---

## 🎯 VALIDATION RULES

### VR-MD-020: Master Data Name Uniqueness
```typescript
// Departments, Positions, Levels
const existing = await prisma.master_departments.findFirst({
  where: { department_name: { equals: name, mode: 'insensitive' } }
});
if (existing && existing.id !== excludeId) {
  throw new Error("Department name already exists");
}
```

### VR-MD-021: User Email Uniqueness
```typescript
const existing = await prisma.User.findUnique({ where: { email } });
if (existing && existing.id !== excludeUserId) {
  throw new Error("Email already used by another user");
}
```

### VR-MD-022: Employee-User Linking
```typescript
// Check 1-to-1 relationship
const employee = await prisma.employees.findUnique({ where: { id: employeeId } });
if (employee.user_id && employee.user_id !== userId) {
  throw new Error("Employee already linked to another user");
}

const user = await prisma.User.findUnique({ where: { id: userId }, include: { employees: true } });
if (user.employees && user.employees.id !== employeeId) {
  throw new Error("User already linked to another employee");
}
```

### VR-MD-023: Employee Termination Lifecycle
```typescript
if (newStatus === "TERMINATED" && employee.User?.status === "ACTIVE") {
  // Create notification
  await prisma.notifications.create({
    data: {
      type: "EMPLOYEE_TERMINATED_WITH_USER",
      message: `Employee ${employee.full_name} terminated. User ${employee.User.email} still active.`,
      target_roles: ["ADMIN", "HR_MANAGER"]
    }
  });
  
  // Create scheduled task (7-day grace period)
  await prisma.scheduled_tasks.create({
    data: {
      task_type: "DEACTIVATE_USER",
      target_id: employee.user_id,
      scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });
}
```

### VR-MD-024: Warehouse Manager Validation
```typescript
const employee = await prisma.employees.findUnique({ where: { id: managerId } });
if (!employee || employee.status !== "ACTIVE") {
  throw new Error("Manager must be an active employee");
}
```

### VR-MD-025: Employee Full Name Required
```typescript
if (!data.full_name || data.full_name.trim().length === 0) {
  throw new Error("Full name is required");
}
if (data.full_name.length > 200) {
  throw new Error("Full name must be less than 200 characters");
}
```

---

## ⚠️ CRITICAL WARNINGS

### 1. Schema Mismatch ⚠️
**Issue**: EmployeeManagement.tsx uses `first_name`, `last_name` (NOT in DB)  
**Fix**: Use `full_name` field  
**Impact**: HIGH - Existing code will fail

### 2. Mock Data ⚠️
**Issue**: Hardcoded arrays for departments, positions, levels, managers  
**Fix**: Replace with SmartSelect + API calls  
**Impact**: MEDIUM - Data inconsistency

### 3. Email NOT Unique ⚠️
**Issue**: employees.email is NOT unique (multiple employees can share)  
**Fix**: Only User.email is unique  
**Impact**: LOW - Business rule, not technical issue

### 4. Migration Timing ⚠️
**Issue**: Must run migration BEFORE deploying code  
**Fix**: Run migration first, then deploy  
**Impact**: HIGH - Code will fail without migration

---

## 📊 EFFORT BREAKDOWN

| Phase | Task | Hours | % |
|-------|------|-------|---|
| **Phase 1** | Database Migration | 1 | 1% |
| **Phase 2** | Backend API | 40 | 33% |
| | - SmartSelect endpoints | 24 | 20% |
| | - Create user endpoint | 10 | 8% |
| | - Modify endpoints | 6 | 5% |
| **Phase 3** | Frontend UI | 50 | 42% |
| | - 3 new pages | 36 | 30% |
| | - Employee Management | 10 | 8% |
| | - Warehouse Management | 4 | 3% |
| **Phase 4** | Testing & UAT | 29 | 24% |
| | - Unit tests | 10 | 8% |
| | - Integration tests | 10 | 8% |
| | - UAT | 9 | 8% |
| **TOTAL** | | **120** | **100%** |

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] Run migration script
- [ ] Verify migration success
- [ ] Backup database
- [ ] Review all code changes
- [ ] Run all tests (unit + integration)

### Deployment
- [ ] Deploy backend API (6 new + 2 modified endpoints)
- [ ] Deploy frontend UI (3 new + 2 modified pages)
- [ ] Verify menu items added
- [ ] Smoke test all new pages

### Post-Deployment
- [ ] Execute UAT plan
- [ ] Monitor error logs
- [ ] Verify data integrity
- [ ] User acceptance sign-off

---

## 📞 SUPPORT & QUESTIONS

### For Questions:
- **Design Authority**: Antigravity
- **CR Documents**: `docs/requirements/change_requests/CR-20260205-ADMIN-FUNCS/`
- **Main Documents**: See "SINGLE SOURCE OF TRUTH" section above

### For Issues:
1. Check validation rules (VR-MD-020 to VR-MD-025)
2. Review API Spec draft
3. Review UI Spec draft
4. Consult FRD Master Data v1.3

---

**Prepared by**: Antigravity - Design Authority  
**Date**: 2026-02-05  
**Status**: READY FOR IMPLEMENTATION ✅

---

**END OF HANDOVER DOCUMENT**
