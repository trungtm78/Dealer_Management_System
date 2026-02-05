# API Specification - DRAFT for CR-20260205-ADMIN-FUNCS

**Base Version**: API Spec (Latest)  
**Draft Version**: (DRAFT)  
**CR**: CR-20260205-ADMIN-FUNCS  
**Date**: 2026-02-05  
**Status**: DRAFT

---

## ⚠️ DRAFT NOTICE

This document details API changes for CR-20260205-ADMIN-FUNCS.  
**Changes marked with**: `<!-- CR-20260205-ADMIN-FUNCS: ... -->`

---

## 📝 API CHANGES SUMMARY

### New Endpoints: 6
1. `POST /api/shared/search/departments`
2. `POST /api/shared/search/positions`
3. `POST /api/shared/search/employee-levels`
4. `POST /api/shared/search/employees`
5. `POST /api/shared/search/users`
6. `POST /api/master/employees/:id/create-user`

### Modified Endpoints: 2
1. `GET /api/users/:id` - Add computed fields
2. `POST /api/master/employees` - Add email field, fix schema

### Breaking Changes: None
All changes are additive and backward compatible.

---

## 🔍 NEW ENDPOINTS

<!-- CR-20260205-ADMIN-FUNCS: ADDED -->

### 1. POST /api/shared/search/departments

**Purpose**: SmartSelect search for departments  
**FRD Mapping**: FR-MD-005-02-05 (Search Department)  
**ERD Mapping**: `master_departments` table

**Request**:
```typescript
POST /api/shared/search/departments
Content-Type: application/json

{
  "query": "sales",           // Search term (optional)
  "limit": 20,                // Max results (default 20, max 100)
  "cursor": null,             // Pagination cursor (optional)
  "context": {
    "onlyActive": true        // Filter by status = ACTIVE (optional, default true)
  }
}
```

**Response**:
```typescript
200 OK
Content-Type: application/json

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
        "employee_count": 15,
        "created_at": "2026-01-01T00:00:00Z"
      }
    }
  ],
  "nextCursor": "eyJpZCI6ImRlcHRfMDAxIn0="
}
```

**Search Logic**:
- Match against: `department_name` OR `department_code`
- Match type: Partial match, case-insensitive (ILIKE)
- Example: "sales" matches "Sales Department", "DEPT-001" (if contains "sales")

**Context Filters**:
- `onlyActive` (boolean): If true, filter `status = 'ACTIVE'`

**Performance**:
- Response time: < 200ms (p95)
- Pagination: Cursor-based
- Caching: 5 minutes

**Error Responses**:
```typescript
400 Bad Request - Invalid request format
{
  "error": "INVALID_REQUEST",
  "message": "limit must be between 1 and 100"
}

500 Internal Server Error - Database error
{
  "error": "INTERNAL_ERROR",
  "message": "Database query failed"
}
```

---

### 2. POST /api/shared/search/positions

**Purpose**: SmartSelect search for positions  
**FRD Mapping**: FR-MD-005-03 (Position Management)  
**ERD Mapping**: `master_positions` table

**Note**: Same structure as `/api/shared/search/departments`, replace:
- Entity: "department" → "position"
- Table: `master_departments` → `master_positions`
- Fields: `department_code`, `department_name` → `position_code`, `position_name`

---

### 3. POST /api/shared/search/employee-levels

**Purpose**: SmartSelect search for employee levels  
**FRD Mapping**: FR-MD-005-04 (Level Management)  
**ERD Mapping**: `master_levels` table

**Note**: Same structure as `/api/shared/search/departments`, replace:
- Entity: "department" → "level"
- Table: `master_departments` → `master_levels`
- Fields: `department_code`, `department_name` → `level_code`, `level_name`

---

### 4. POST /api/shared/search/employees

**Purpose**: SmartSelect search for employees  
**FRD Mapping**: FR-MD-005-01-05 (Search Employee), FR-MD-007-01 (Warehouse Manager)  
**ERD Mapping**: `employees` table + joins

**Request**:
```typescript
POST /api/shared/search/employees
Content-Type: application/json

{
  "query": "nguyen",
  "limit": 20,
  "cursor": null,
  "context": {
    "onlyActive": true,                                    // Filter by status = ACTIVE
    "positionFilter": ["Manager", "Supervisor", "Director"] // Filter by position names
  }
}
```

**Response**:
```typescript
200 OK
Content-Type: application/json

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
        "department_id": "dept_001",
        "department_name": "Sales Department",
        "position_id": "pos_001",
        "position_name": "Sales Manager",
        "level_id": "lvl_003",
        "level_name": "Level 3",
        "status": "ACTIVE",
        "user_id": "user_001",
        "user_email": "nguyenvana@honda.com"
      }
    }
  ],
  "nextCursor": "..."
}
```

**Search Logic**:
- Match against: `full_name` OR `employee_code` OR `email`
- Match type: Partial match, case-insensitive
- Joins: `master_departments`, `master_positions`, `master_levels`, `User`

**Context Filters**:
- `onlyActive` (boolean): Filter `status = 'ACTIVE'`
- `positionFilter` (string[]): Filter by position names (for warehouse manager selection)

---

### 5. POST /api/shared/search/users

**Purpose**: SmartSelect search for users  
**FRD Mapping**: FR-MD-005-01-07 (Link Employee to User)  
**ERD Mapping**: `User` table + join `employees`

**Request**:
```typescript
POST /api/shared/search/users
Content-Type: application/json

{
  "query": "admin",
  "limit": 20,
  "cursor": null,
  "context": {
    "onlyActive": true,           // Filter by status = ACTIVE
    "excludeLinkedUsers": true    // Exclude users already linked to employees
  }
}
```

**Response**:
```typescript
200 OK
Content-Type: application/json

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
        "department_id": "dept_001",       // Computed from Employee
        "status": "ACTIVE",
        "has_employee": false,             // Not linked to any employee
        "created_at": "2026-01-01T00:00:00Z"
      }
    }
  ],
  "nextCursor": "..."
}
```

**Search Logic**:
- Match against: `email` OR `name`
- Match type: Partial match, case-insensitive
- Join: `employees` (to compute department and check linking)

**Context Filters**:
- `onlyActive` (boolean): Filter `status = 'ACTIVE'`
- `excludeLinkedUsers` (boolean): If true, exclude users where `employees.user_id IS NOT NULL`

**Computed Fields**:
- `department`: From `employee?.master_departments?.department_name`
- `department_id`: From `employee?.department_id`
- `has_employee`: `employees.user_id IS NOT NULL`

---

### 6. POST /api/master/employees/:id/create-user

**Purpose**: Create user account for employee  
**FRD Mapping**: FR-MD-005-01-07 (Link Employee to User - Option B)  
**ERD Mapping**: `User` table, `employees` table

**Request**:
```typescript
POST /api/master/employees/emp_001/create-user
Content-Type: application/json
Authorization: Bearer <token>

{
  "email": "nguyenvana@honda.com",  // Required (from employee.email or manual)
  "password": "SecurePass123!",     // Required (min 8 chars, complexity rules)
  "role_id": "role_001"             // Required
}
```

**Response**:
```typescript
201 Created
Content-Type: application/json

{
  "user": {
    "id": "user_new",
    "email": "nguyenvana@honda.com",
    "name": "Nguyễn Văn A",  // From employee.full_name
    "role_id": "role_001",
    "status": "ACTIVE",
    "created_at": "2026-02-05T10:00:00Z"
  },
  "employee": {
    "id": "emp_001",
    "user_id": "user_new",  // Updated
    "email": "nguyenvana@honda.com"  // Synced if was null
  }
}
```

**Business Logic**:
1. Validate employee exists
2. Validate employee.user_id is null (not already linked)
3. Validate email unique in User table (VR-MD-021)
4. Validate password meets requirements
5. Create User record
6. Link employee.user_id = user.id
7. Sync email back to employee if employee.email was null
8. Log to activity_logs

**Validation Rules**:
- VR-MD-021: User email uniqueness
- VR-MD-022: Employee-User linking (1-to-1)
- Password: Min 8 chars, must contain uppercase, lowercase, number

**Error Responses**:
```typescript
400 Bad Request - Validation error
{
  "error": "VALIDATION_ERROR",
  "message": "Email already used by another user"
}

404 Not Found - Employee not found
{
  "error": "NOT_FOUND",
  "message": "Employee not found"
}

409 Conflict - Employee already linked
{
  "error": "CONFLICT",
  "message": "Employee already linked to another user"
}
```

<!-- END CR-20260205-ADMIN-FUNCS -->

---

## 🔄 MODIFIED ENDPOINTS

<!-- CR-20260205-ADMIN-FUNCS: MODIFIED -->

### 1. GET /api/users/:id (UPDATED)

**Changes**: Add computed fields from Employee relation

**Before**:
```typescript
GET /api/users/user_001

200 OK
{
  "id": "user_001",
  "email": "john@honda.com",
  "role": "SALES_STAFF",
  "department": "Sales",  // ❌ Hardcoded string
  "status": "ACTIVE"
}
```

**After**:
```typescript
GET /api/users/user_001

200 OK
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
```

**Implementation**:
```typescript
// Prisma query
const user = await prisma.User.findUnique({
  where: { id: userId },
  include: {
    employees: {
      include: {
        master_departments: true,
        master_positions: true
      }
    }
  }
});

// Compute fields
return {
  ...user,
  department: user.employees?.master_departments?.department_name || null,
  department_id: user.employees?.department_id || null,
  position: user.employees?.master_positions?.position_name || null,
  position_id: user.employees?.position_id || null
};
```

**Breaking Changes**: None (additive fields)

---

### 2. POST /api/master/employees (UPDATED)

**Changes**: Add email field, fix schema mismatch

**Before**:
```typescript
POST /api/master/employees

{
  "employee_code": "EMP-001",  // Auto-generated
  "first_name": "Nguyễn",      // ❌ NOT IN DB
  "last_name": "Văn A",        // ❌ NOT IN DB
  "phone": "0901234567",
  "department_id": "dept_001",
  "position_id": "pos_001"
}
```

**After**:
```typescript
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
```

**Validation**:
- `full_name`: Required, max 200 chars (VR-MD-025)
- `email`: Optional, max 200 chars, valid email format (NOT unique)
- `user_id`: Optional, must exist, must not be linked to another employee (VR-MD-022)

**Breaking Changes**: None
- Existing clients not sending `email` or `user_id` will continue to work (optional fields)
- `first_name`, `last_name` never worked (schema mismatch), so removing them is not breaking

<!-- END CR-20260205-ADMIN-FUNCS -->

---

## 📊 API CHANGE SUMMARY

| Endpoint | Method | Change Type | Breaking |
|----------|--------|-------------|----------|
| `/api/shared/search/departments` | POST | NEW | No |
| `/api/shared/search/positions` | POST | NEW | No |
| `/api/shared/search/employee-levels` | POST | NEW | No |
| `/api/shared/search/employees` | POST | NEW | No |
| `/api/shared/search/users` | POST | NEW | No |
| `/api/master/employees/:id/create-user` | POST | NEW | No |
| `/api/users/:id` | GET | MODIFIED (add fields) | No |
| `/api/master/employees` | POST | MODIFIED (add fields, fix schema) | No |

**Total**: 6 new endpoints, 2 modified endpoints, 0 breaking changes

---

## 🔐 AUTHENTICATION & AUTHORIZATION

All endpoints require authentication via Bearer token.

### Permissions

| Endpoint | Required Permission | Roles |
|----------|---------------------|-------|
| `POST /api/shared/search/*` | `MASTER_DATA.READ` | All authenticated users |
| `POST /api/master/employees/:id/create-user` | `EMPLOYEE.UPDATE` | ADMIN, HR_MANAGER |
| `GET /api/users/:id` | `USER.READ` | All authenticated users |
| `POST /api/master/employees` | `MASTER_DATA.CREATE` | ADMIN, HR_MANAGER |

---

**END OF DRAFT DOCUMENT**
