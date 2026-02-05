# UI Specification - DRAFT for CR-20260205-ADMIN-FUNCS

**Base Version**: UI Spec (Latest)  
**Draft Version**: (DRAFT)  
**CR**: CR-20260205-ADMIN-FUNCS  
**Date**: 2026-02-05  
**Status**: DRAFT

---

## ⚠️ DRAFT NOTICE

This document details UI changes for CR-20260205-ADMIN-FUNCS.  
**Changes marked with**: `<!-- CR-20260205-ADMIN-FUNCS: ... -->`

---

## 📝 UI CHANGES SUMMARY

### New Pages: 3
1. `/master-data/departments` - Department Management
2. `/master-data/positions` - Position Management
3. `/master-data/levels` - Level Management

### Modified Pages: 2
1. `/master-data/employees` - Employee Management (schema fix, user linking, remove mock data)
2. `/master-data/warehouses` - Warehouse Management (remove mock managers)

### New Components: 0
All UI patterns reuse existing components (SmartSelect, Table, Dialog, etc.)

---

## 🆕 NEW PAGES

<!-- CR-20260205-ADMIN-FUNCS: ADDED -->

### 1. /master-data/departments

**Page**: `app/(main)/master-data/departments/page.tsx`  
**Component**: `components/master/DepartmentManagement.tsx`  
**FRD Mapping**: FR-MD-005-02  
**Refs Strategy**: Reuse As-Is (copy from EmployeeManagement pattern)

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│ Master Data > Departments                          [+ New]  │
├─────────────────────────────────────────────────────────────┤
│ Search: [_____________]  Status: [ACTIVE ▼]                 │
├─────────────────────────────────────────────────────────────┤
│ Code     │ Name              │ Description │ Status │ Count │
├──────────┼───────────────────┼─────────────┼────────┼───────┤
│ DEPT-001 │ Sales Department  │ Sales...    │ ACTIVE │  15   │
│ DEPT-002 │ Service Dept      │ Service...  │ ACTIVE │  12   │
│ ...                                                          │
└─────────────────────────────────────────────────────────────┘
```

**Features**:
- ✅ Table with sortable columns
- ✅ Search box (debounced 300ms)
- ✅ Status filter dropdown
- ✅ Create dialog (+ New button)
- ✅ Edit dialog (✎ icon)
- ✅ Soft delete (🗑 icon with confirmation)
- ✅ Pagination (20 items per page)

**Form Fields** (Create/Edit Dialog):
```tsx
<Dialog>
  <DialogTitle>{isEdit ? "Edit" : "Create"} Department</DialogTitle>
  <Form>
    <Input 
      label="Department Code" 
      value={formData.department_code}
      disabled={true}  // Auto-generated, read-only
      helperText="Auto-generated (DEPT-XXX)"
    />
    <Input 
      label="Department Name *" 
      value={formData.department_name}
      onChange={...}
      required
      maxLength={200}
      placeholder="Sales Department"
    />
    <Textarea 
      label="Description" 
      value={formData.description}
      onChange={...}
      rows={3}
      placeholder="Department description..."
    />
    <RadioGroup 
      label="Status" 
      value={formData.status}
      onChange={...}
      options={[
        { value: "ACTIVE", label: "Active" },
        { value: "INACTIVE", label: "Inactive" }
      ]}
    />
    <Button type="submit">Save</Button>
  </Form>
</Dialog>
```

**Validation**:
- Department name: Required, max 200 chars, unique (VR-MD-020)
- Status: Required, enum (ACTIVE/INACTIVE)

**Refs Components Used**:
- ✅ Table (sortable, filterable)
- ✅ Dialog
- ✅ Input
- ✅ Textarea
- ✅ RadioGroup
- ✅ Button
- ✅ Badge (for status display)

**Estimated Lines**: ~400 lines

---

### 2. /master-data/positions

**Page**: `app/(main)/master-data/positions/page.tsx`  
**Component**: `components/master/PositionManagement.tsx`  
**FRD Mapping**: FR-MD-005-03

**Note**: Same structure as Department Management, replace:
- Entity: "Department" → "Position"
- Code format: `DEPT-XXX` → `POS-XXX`
- Field names: `department_code`, `department_name` → `position_code`, `position_name`

**Estimated Lines**: ~400 lines

---

### 3. /master-data/levels

**Page**: `app/(main)/master-data/levels/page.tsx`  
**Component**: `components/master/LevelManagement.tsx`  
**FRD Mapping**: FR-MD-005-04

**Note**: Same structure as Department Management, replace:
- Entity: "Department" → "Level"
- Code format: `DEPT-XXX` → `LVL-XXX`
- Field names: `department_code`, `department_name` → `level_code`, `level_name`

**Estimated Lines**: ~400 lines

<!-- END CR-20260205-ADMIN-FUNCS -->

---

## 🔄 MODIFIED PAGES

<!-- CR-20260205-ADMIN-FUNCS: MODIFIED -->

### 1. /master-data/employees (UPDATED)

**Component**: `components/master/EmployeeManagement.tsx`  
**FRD Mapping**: FR-MD-005-01 (updated)

#### Change #1: Fix Schema Mismatch

**Before** (lines 200-220):
```tsx
<Input label="First Name *" id="first_name" required />
<Input label="Last Name *" id="last_name" required />
```

**After**:
```tsx
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

---

#### Change #2: Remove Mock Data

**Delete** (lines 73-99):
```tsx
// ❌ DELETE
const departments = [
  { id: "1", name: "Sales" },
  { id: "2", name: "Service" },
  // ...
]
const positions = [...]
const levels = [...]
```

---

#### Change #3: Replace Filters with SmartSelect

**Before**:
```tsx
<select value={selectedDepartment} onChange={...}>
  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
</select>
```

**After**:
```tsx
<SmartSelect
  dataSource={departmentDataSource}
  value={selectedDepartment}
  onChange={setSelectedDepartment}
  label="Department"
  placeholder="All Departments"
  allowClear={true}
/>

// DataSource definition
const departmentDataSource: SelectDataSource = {
  search: async (req) => {
    const res = await fetch('/api/shared/search/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    return res.json();
  }
};
```

---

#### Change #4: Add User Linking Section

**New Section** in Employee Form:
```tsx
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
        <User className="w-3 h-3 inline mr-1" />
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
        onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
        required 
        type="email"
      />
      <Input 
        label="Password *" 
        type="password" 
        value={userFormData.password}
        onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
        required 
        minLength={8}
        helperText="Min 8 chars, must contain uppercase, lowercase, number"
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
        value={userFormData.role_id}
        onChange={(id) => setUserFormData({ ...userFormData, role_id: id })}
        required
        context={{ suggestedFirst: true }}
      />
      
      <Button type="submit">Create User Account</Button>
    </Form>
  </DialogContent>
</Dialog>
```

**Business Logic**:
```tsx
const handleCreateUser = async () => {
  try {
    const res = await fetch(`/api/master/employees/${employee.id}/create-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userFormData.email,
        password: userFormData.password,
        role_id: userFormData.role_id
      })
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }
    
    const data = await res.json();
    
    // Update employee form with new user_id
    setFormData({ ...formData, user_id: data.user.id });
    
    // Close dialog
    setCreateUserDialogOpen(false);
    
    // Show success message
    toast.success("User account created and linked successfully");
    
    // Refresh employee data
    await fetchEmployee(employee.id);
  } catch (error) {
    toast.error(error.message);
  }
};

// Position-Role Mapping
const POSITION_ROLE_MAPPING = {
  "Sales Manager": ["SALES_MANAGER", "SALES_STAFF"],
  "Service Advisor": ["SERVICE_ADVISOR", "SERVICE_STAFF"],
  "Technician": ["TECHNICIAN"],
  "Admin Staff": ["ADMIN"],
  "Warehouse Manager": ["WAREHOUSE_MANAGER", "WAREHOUSE_STAFF"],
  "Accountant": ["ACCOUNTANT"],
  "HR Manager": ["HR_MANAGER", "ADMIN"]
};

const suggestedRoles = POSITION_ROLE_MAPPING[employee.position_name] || [];
```

---

#### Change #5: Add User Column in Table

**New Column**:
```tsx
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

---

### 2. /master-data/warehouses (UPDATED)

**Component**: `components/master/WarehouseManagement.tsx`  
**FRD Mapping**: FR-MD-007-01 (updated)

#### Change #1: Remove Mock Managers

**Delete** (lines 56-63):
```tsx
// ❌ DELETE
const managers = [
  { id: "1", name: "Nguyễn Văn A" },
  { id: "2", name: "Trần Thị B" },
  // ...
]
```

---

#### Change #2: Replace Manager Select with SmartSelect

**Before** (lines 384-398):
```tsx
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
```

**After**:
```tsx
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

// DataSource definition
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

<!-- END CR-20260205-ADMIN-FUNCS -->

---

## 🗂️ MENU UPDATES

<!-- CR-20260205-ADMIN-FUNCS: ADDED -->

**File**: `app/(main)/layout.tsx`

**Add to Master Data submenu**:
```tsx
{
  title: "Master Data",
  icon: Database,
  children: [
    { title: "Employees", href: "/master-data/employees" },
    { title: "Departments", href: "/master-data/departments" },  // NEW
    { title: "Positions", href: "/master-data/positions" },      // NEW
    { title: "Levels", href: "/master-data/levels" },            // NEW
    { title: "Warehouses", href: "/master-data/warehouses" },
    { title: "Suppliers", href: "/master-data/suppliers" },
    // ... other items
  ]
}
```

<!-- END CR-20260205-ADMIN-FUNCS -->

---

## 🎨 REFS EVALUATION

### Existing Refs (Reuse As-Is) ✅

All required UI components already exist in the Refs library:

| Component | Usage | Status |
|-----------|-------|--------|
| Table | Sortable, filterable tables | ✅ Reuse |
| Dialog | Create/Edit forms | ✅ Reuse |
| SmartSelect | Dropdown with search | ✅ Reuse |
| Input | Text inputs | ✅ Reuse |
| Textarea | Multi-line text | ✅ Reuse |
| RadioGroup | Status selection | ✅ Reuse |
| Button | Actions | ✅ Reuse |
| Badge | Status display | ✅ Reuse |
| Alert | Info messages | ✅ Reuse |
| Form | Form handling | ✅ Reuse |

### New Components Needed: 0

**Refs Strategy**: **REUSE AS-IS** ✅
- No new components needed
- All UI patterns already exist in EmployeeManagement
- Copy-paste-modify approach for 3 new pages

---

## 📊 UI CHANGE SUMMARY

| Page | Change Type | Components | Lines |
|------|-------------|------------|-------|
| `/master-data/departments` | NEW | DepartmentManagement.tsx | ~400 |
| `/master-data/positions` | NEW | PositionManagement.tsx | ~400 |
| `/master-data/levels` | NEW | LevelManagement.tsx | ~400 |
| `/master-data/employees` | MODIFIED | EmployeeManagement.tsx | ~200 |
| `/master-data/warehouses` | MODIFIED | WarehouseManagement.tsx | ~50 |
| Menu | MODIFIED | layout.tsx | ~10 |
| **TOTAL** | **3 new + 3 modified** | **6 files** | **~1,460** |

---

## 🎯 USER FLOWS

### Flow #1: Create Department

```
1. Admin navigates to /master-data/departments
2. Admin clicks "+ New" button
3. System displays Create Department dialog
4. System auto-generates department_code (DEPT-XXX)
5. Admin enters department_name, description, status
6. Admin clicks "Save"
7. System validates (VR-MD-020: name uniqueness)
8. If valid:
   - System creates department
   - System closes dialog
   - System refreshes table
   - System shows success toast
9. If invalid:
   - System shows inline errors
   - System keeps dialog open
```

### Flow #2: Link Employee to User (Existing User)

```
1. Admin navigates to /master-data/employees
2. Admin clicks Edit on an employee
3. System displays Edit Employee dialog
4. Admin scrolls to "User Account" section
5. Admin clicks SmartSelect dropdown
6. Admin types to search users (e.g., "admin")
7. System calls /api/shared/search/users (excludeLinkedUsers: true)
8. System displays matching users
9. Admin selects a user
10. Admin clicks "Save"
11. System validates (VR-MD-022: user linking)
12. If valid:
    - System updates employee.user_id
    - System closes dialog
    - System refreshes table (shows user badge)
    - System shows success toast
```

### Flow #3: Create User for Employee

```
1. Admin navigates to /master-data/employees
2. Admin clicks Edit on an employee
3. System displays Edit Employee dialog
4. Admin scrolls to "User Account" section
5. Admin clicks "Create User Account" button
6. System displays Create User dialog
7. System pre-fills email (from employee.email), name (from employee.full_name)
8. System shows suggested roles based on employee position
9. Admin enters password, selects role
10. Admin clicks "Create User Account"
11. System calls POST /api/master/employees/:id/create-user
12. System validates (VR-MD-021: email uniqueness, VR-MD-022: user linking)
13. If valid:
    - System creates user
    - System links employee.user_id
    - System syncs email back to employee if was null
    - System closes dialog
    - System updates Employee form to show linked user
    - System shows success toast
14. If invalid:
    - System shows error message
    - System keeps dialog open
```

---

**END OF DRAFT DOCUMENT**
