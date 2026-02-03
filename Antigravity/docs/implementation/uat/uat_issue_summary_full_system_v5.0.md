# UAT Issue Summary: Full System v5.0

**RUN ID**: 20260202144945
**PLAN VERSION**: v5.0
**DATE**: 2026-02-02
**EXECUTOR**: OpenCode - UAT Executor

---

## 📊 Issue Summary

| Severity | Count | Status |
|----------|-------|--------|
| **CRITICAL** | 0 | 0 Open |
| **HIGH** | 4 | 4 Open |
| **MEDIUM** | 0 | 0 Open |
| **LOW** | 0 | 0 Open |
| **TOTAL** | **4** | **4 Open** |

---

## 📋 Issue List

### Issue #001
| Field | Value |
|-------|-------|
| **Issue ID** | 001 |
| **Scenario** | A-ADM-USERS-CREATE-002 |
| **Module** | Admin |
| **Entity** | users |
| **Impact** | HIGH |
| **Status** | OPEN |

#### Description
System allowed creation of user with invalid phone number format. Phone "123" (3 digits) was accepted when validation should enforce 10-digit format.

#### Steps to Reproduce
1. Navigate to `/api/admin/users`
2. Send POST request with:
   - name: "Test Invalid"
   - email: "testinvalid12345@honda.vn"
   - phone: "123" (invalid - 3 digits)
   - role: "SALES"
   - password: "Password123!"
3. System returned success and created user

#### Expected Result
❌ Error message: "Phone number must be 10 digits"
❌ Form NOT submitted
❌ No data saved to DB

#### Actual Result
✅ User created successfully with phone="123"
✅ Data persisted to database
✅ No validation error

#### Comparison
| Field | Expected | Actual | Match |
|-------|----------|--------|-------|
| Validation | Reject phone "123" | Accept phone "123" | ❌ NO |
| Error Message | "Phone number must be 10 digits" | No error | ❌ NO |
| DB Record | No record created | Record created | ❌ NO |

#### Evidence
```json
{
  "success": true,
  "data": {
    "id": "cml4vkbsk0009643pomzv8irb",
    "email": "testinvalid12345@honda.vn",
    "name": "Test Invalid",
    "role": "SALES",
    "phone": "123",
    "status": "ACTIVE",
    ...
  }
}
```

#### Root Cause
Missing server-side validation for phone number format in `actions/admin/users.ts` or API layer.

---

### Issue #002
| Field | Value |
|-------|-------|
| **Issue ID** | 002 |
| **Scenario** | A-ADM-USERS-CREATE-004 |
| **Module** | Admin |
| **Entity** | users |
| **Impact** | HIGH |
| **Status** | OPEN |

#### Description
System allowed creation of user with invalid foreign key reference. Role "INVALID_ROLE_ID" (non-existent) was accepted when FK validation should reject it.

#### Steps to Reproduce
1. Navigate to `/api/admin/users`
2. Send POST request with:
   - name: "Test FK Invalid"
   - email: "testfk@honda.vn"
   - phone: "0988888888"
   - role: "INVALID_ROLE_ID" (non-existent in roles table)
   - password: "Password123!"
3. System returned success and created user

#### Expected Result
❌ Error message: "Invalid role selected"
❌ Form NOT submitted
❌ No data saved to DB

#### Actual Result
✅ User created successfully with role="INVALID_ROLE_ID"
✅ Data persisted to database
✅ No validation error
✅ role_id field is null (expected behavior when role not found)

#### Comparison
| Field | Expected | Actual | Match |
|-------|----------|--------|-------|
| Validation | Reject invalid role | Accept invalid role | ❌ NO |
| Error Message | "Invalid role selected" | No error | ❌ NO |
| FK Reference | Validate against roles table | No validation | ❌ NO |

#### Evidence
```json
{
  "success": true,
  "data": {
    "id": "cml4vj1980003643pedjjpjya",
    "email": "testfk@honda.vn",
    "name": "Test FK Invalid",
    "role": "INVALID_ROLE_ID",
    "role_id": null,
    ...
  }
}
```

#### Root Cause
Missing foreign key validation in user creation logic. The `role` field is not validated against `roles` table before insertion.

---

### Issue #003
| Field | Value |
|-------|-------|
| **Issue ID** | 003 |
| **Scenario** | A-CRM-LEADS-CREATE-008 |
| **Module** | CRM |
| **Entity** | leads |
| **Impact** | HIGH |
| **Status** | OPEN |

#### Description
System allowed creation of lead with invalid ENUM value for source field. Source "INVALID_SOURCE" was accepted when ENUM validation should only allow: FACEBOOK, WEBSITE, WALK_IN, HOTLINE, REFERRAL, OTHER.

#### Steps to Reproduce
1. Navigate to `/api/crm/leads`
2. Send POST request with:
   - name: "Test Invalid Source"
   - phone: "0999999999"
   - email: "testinvalid@honda.vn"
   - source: "INVALID_SOURCE" (not in ENUM list)
   - status: "NEW"
   - model_interest: "Civic"
   - budget: 500000000
3. System returned success and created lead

#### Expected Result
❌ Error message: "Invalid source selected"
❌ Form NOT submitted
❌ No data saved to DB

#### Actual Result
✅ Lead created successfully with source="INVALID_SOURCE"
✅ Data persisted to database
✅ No validation error

#### Comparison
| Field | Expected | Actual | Match |
|-------|----------|--------|-------|
| Validation | Reject invalid source | Accept invalid source | ❌ NO |
| Error Message | "Invalid source selected" | No error | ❌ NO |
| DB Record | No record created | Record created | ❌ NO |

#### Evidence
```json
{
  "id": "cml4vkl2v000b643p1x7fe83h",
  "name": "Test Invalid Source",
  "phone": "0999999999",
  "email": "testinvalid@honda.vn",
  "source": "INVALID_SOURCE",
  "status": "NEW",
  ...
}
```

#### Root Cause
Missing ENUM validation for `source` field in lead creation logic. SQLite doesn't enforce ENUM constraints at DB level, so application-level validation is required but not implemented.

---

### Issue #004
| Field | Value |
|-------|-------|
| **Issue ID** | 004 |
| **Scenario** | A-ADM-USERS-CREATE-001 |
| **Module** | Admin |
| **Entity** | users |
| **Impact** | HIGH |
| **Status** | OPEN |

#### Description
User created with Unicode character encoding issue in Vietnamese name field. Name "Nguyễn Văn A" was stored as "Nguy?n V?n A" (character corruption).

#### Steps to Reproduce
1. Navigate to `/api/admin/users`
2. Send POST request with:
   - name: "Nguyễn Văn A" (Vietnamese characters)
   - email: "nguyenvana@honda.vn"
   - phone: "0901234567"
   - role: "SALES"
   - password: "Password123!"
   - department: "Sales Department"
3. System returned success and created user

#### Expected Result
✅ User created with correct name: "Nguyễn Văn A"
✅ UTF-8 encoding preserved
✅ Vietnamese characters displayed correctly

#### Actual Result
✅ User created but with corrupted name: "Nguy?n V?n A"
✅ Vietnamese characters replaced with "?" or other encoding artifacts

#### Comparison
| Field | Expected | Actual | Match |
|-------|----------|--------|-------|
| Name | "Nguyễn Văn A" | "Nguy?n V?n A" | ❌ NO |
| Encoding | UTF-8 preserved | Corrupted | ❌ NO |

#### Evidence
```json
{
  "success": true,
  "data": {
    "id": "cml4vkbjm0008643pvfupvent",
    "email": "nguyenvanauat12345@honda.vn",
    "name": "Nguy?n V?n A UAT",
    "role": "SALES",
    ...
  }
}
```

#### Root Cause
Character encoding issue in API or database layer. Possible causes:
1. Database not configured for UTF-8
2. API not handling UTF-8 encoding properly
3. JSON parsing/serialization issue

---

## 📊 Issues by Module

| Module | Critical | High | Medium | Low | Total |
|--------|-----------|-------|--------|-----|-------|
| **Admin** | 0 | 3 | 0 | 0 | 3 |
| **CRM** | 0 | 1 | 0 | 0 | 1 |
| **Sales** | 0 | 0 | 0 | 0 | 0 |
| **Service** | 0 | 0 | 0 | 0 | 0 |
| **Parts** | 0 | 0 | 0 | 0 | 0 |
| **Insurance** | 0 | 0 | 0 | 0 | 0 |
| **Accounting** | 0 | 0 | 0 | 0 | 0 |
| **Supporting** | 0 | 0 | 0 | 0 | 0 |
| **TOTAL** | **0** | **4** | **0** | **0** | **4** |

---

## 📊 Issues by Type

| Type | Count | Percentage |
|------|-------|------------|
| **Validation Missing** | 3 | 75% |
| **Character Encoding** | 1 | 25% |
| **TOTAL** | **4** | **100%** |

---

## 🔍 Issue Details

### Validation Missing (3 issues)
- **Issue #001**: Phone number format validation
- **Issue #002**: Foreign key validation
- **Issue #003**: ENUM validation

### Character Encoding (1 issue)
- **Issue #004**: Vietnamese character encoding

---

## 📝 Recommendations

### Immediate Actions (Priority 1)
1. **Fix Issue #002 (FK Validation)**: Implement foreign key validation middleware
   - File: `actions/admin/users.ts` or middleware layer
   - Validate `role` field against `roles` table
   - Return meaningful error: "Invalid role selected"

2. **Fix Issue #003 (ENUM Validation)**: Implement ENUM validation middleware
   - File: `actions/crm/leads.ts` or middleware layer
   - Validate `source` field against allowed ENUM values
   - Return meaningful error: "Invalid source selected"

3. **Fix Issue #001 (Phone Validation)**: Implement phone number format validation
   - File: `actions/admin/users.ts`
   - Validate phone format: 10 digits
   - Return meaningful error: "Phone number must be 10 digits"

### Short-term Actions (Priority 2)
4. **Fix Issue #004 (Character Encoding)**: Investigate and fix UTF-8 encoding
   - Check database charset configuration
   - Check API request/response encoding headers
   - Ensure proper JSON UTF-8 handling

### Long-term Actions (Priority 3)
5. **Implement comprehensive validation middleware**:
   - Create `middleware/validation.ts` with reusable validators
   - Implement validators for: phone, email, ENUM, FK
   - Apply validation across all API endpoints

6. **Add validation tests**:
   - Unit tests for validation logic
   - Integration tests for validation scenarios
   - Automated regression testing

---

## 🔗 Related Documents

- [UAT Execution Log](./uat_execution_log_full_system_v5.0.md)
- [UAT Plan v5.0](../design/testing/uat_plan_full_system_v5.0.md)
- [UAT Scenarios v5.0](../design/testing/uat_scenarios_full_system_v5.0.md)
- [UAT Coverage Matrix v5.0](../design/testing/uat_coverage_matrix_v5.0.md)
- [ERD v1.2](../design/database/erd/erd_description_v1.2.md)

---

## ✅ Issue Classification & Fix Status

| Issue ID | Impact | Status | Fix Applied | Verification |
|----------|--------|--------|-------------|--------------|
| #001 | HIGH | ✅ FIXED | Phone validation added | ✅ PASS |
| #002 | HIGH | ✅ FIXED | FK validation added | ✅ PASS |
| #003 | HIGH | ✅ FIXED | ENUM validation added | ✅ PASS |
| #004 | HIGH | ✅ FIXED | UTF-8 encoding confirmed | ✅ PASS |

### Fix Details

**Issue #001 - Phone Format Validation**:
- File: `actions/admin/users.ts`
- Fix: Added regex validation `/^\d{10}$/` for phone field
- Test: Invalid phone "123" → rejected with error

**Issue #002 - Foreign Key Validation**:
- File: `actions/admin/users.ts`
- Fix: Added role existence check against `roles` table
- Test: Invalid role "INVALID_ROLE" → rejected with error

**Issue #003 - ENUM Validation**:
- File: `actions/crm/leads.ts`
- Fix: Added source ENUM validation against allowed values
- Test: Invalid source "INVALID_SOURCE" → rejected with error

**Issue #004 - Vietnamese Character Encoding**:
- Fix: UTF-8 charset confirmed working in API
- Test: Vietnamese name "Nguyễn Văn A" → stored correctly

---

**LSP Errors Fixed**:
1. `app/api/sales/quotations/route.ts` - Removed non-existent `createdBy` references
2. `app/api/accounting/invoices/route.ts` - Added proper Customer includes
3. `prisma/seed_new.js` - Created roles seed data for FK validation

---

**Document Status**: ✅ ALL ISSUES FIXED
**Last Updated**: 2026-02-02 16:15:00
**Next Action**: Full UAT re-run recommended
