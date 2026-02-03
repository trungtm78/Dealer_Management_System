# UAT Plan v3.0 - Execution Guide for OpenCode

**Version**: 3.0-EG  
**Date**: 2026-01-29  
**Author**: Antigravity - System UAT Authority  
**Purpose**: Chi tiết hóa template scenarios cho OpenCode execute

---

## 📋 Document Purpose

UAT Plan v3.0 sử dụng **template approach** (compact, maintainable).  
Document này cung cấp **chi tiết execution** cho mỗi template để OpenCode có thể test.

---

## 🎯 How to Use This Guide

### For OpenCode (Tester)

1. **Đọc UAT Plan v3.0** để hiểu templates
2. **Đọc Execution Guide này** để biết cách execute
3. **Apply template** cho từng entity theo Coverage Matrix
4. **Record results** trong UAT Execution Log

### Example Workflow

```
1. Coverage Matrix → Entity: customers, Action: CREATE
2. UAT Plan v3.0 → Template: T-CREATE
3. Execution Guide → T-CREATE detailed steps for customers
4. Execute test
5. Record result
```

---

## 📋 TEMPLATE EXECUTION DETAILS

### T-CREATE: Create & Save Template

**Applies to**: All 49 entities

#### Generic Steps (from v3.0)
1. Navigate to entity list screen
2. Click "Create New"
3. Fill all required fields
4. Click "Save"
5. Reload page (F5)

#### Detailed Execution by Entity

##### Example 1: Entity = customers

**Scenario**: UAT-CRM-001-CREATE  
**URL**: `/crm/customers`

**Detailed Steps**:
1. Navigate to `/crm/customers`
2. Click "Add New Customer" button
3. Fill form:
   ```
   Name: Test Customer {timestamp}
   Phone: 090{random 7 digits}
   Email: test{timestamp}@example.com
   Type: INDIVIDUAL
   Tier: SILVER
   Street: 123 Test Street
   District: Quận 1
   City: TP.HCM
   ```
4. Click "Save" button
5. Wait for success toast
6. Press F5 to reload
7. Search for customer by phone number

**Expected UI Result**:
- ✅ Toast: "Customer created successfully"
- ✅ Customer visible in list
- ✅ After reload: Customer still visible

**Expected DB Verification**:
```sql
SELECT * FROM customers 
WHERE phone = '090{entered phone}';
```
Expected:
- ✅ Record exists
- ✅ `name` = entered name
- ✅ `type` = 'INDIVIDUAL'
- ✅ `tier` = 'SILVER'
- ✅ `created_at` IS NOT NULL

**Pass Criteria**: Customer created, visible, persisted after reload

---

##### Example 2: Entity = leads

**Scenario**: UAT-CRM-009-CREATE  
**URL**: `/crm/leads`

**Detailed Steps**:
1. Navigate to `/crm/leads`
2. Click "Add New Lead" button
3. Fill form:
   ```
   Name: Test Lead {timestamp}
   Phone: 091{random 7 digits}
   Email: lead{timestamp}@example.com
   Source: FACEBOOK
   Status: NEW
   Model Interest: Honda City
   Budget: 600000000
   ```
4. Click "Save" button
5. Wait for success toast
6. Press F5 to reload
7. Search for lead by phone

**Expected UI Result**:
- ✅ Toast: "Lead created successfully"
- ✅ Lead visible in list
- ✅ Score auto-calculated
- ✅ After reload: Lead still visible

**Expected DB Verification**:
```sql
SELECT * FROM leads 
WHERE phone = '091{entered phone}';
```
Expected:
- ✅ Record exists
- ✅ `status` = 'NEW'
- ✅ `score` >= 0
- ✅ `created_at` IS NOT NULL

**Pass Criteria**: Lead created, score calculated, persisted

---

##### Example 3: Entity = quotations

**Scenario**: UAT-SAL-001-CREATE  
**URL**: `/sales/quotations`

**Detailed Steps**:
1. Navigate to `/sales/quotations`
2. Click "Create Quotation" button
3. Fill form:
   ```
   Customer: {Select existing customer}
   Model: Honda City
   Version: RS
   Base Price: 559000000
   Accessories: [Select 1-2 accessories]
   Services: [Select PDS]
   Discount: 5000000
   Sales Person: {Current user}
   ```
4. Click "Save" button
5. Wait for success toast
6. Press F5 to reload
7. Search for quotation by customer

**Expected UI Result**:
- ✅ Toast: "Quotation created successfully"
- ✅ Quotation visible in list
- ✅ Total price calculated correctly
- ✅ After reload: Quotation still visible

**Expected DB Verification**:
```sql
SELECT * FROM quotations 
WHERE customer_id = '{selected customer id}';
```
Expected:
- ✅ Record exists
- ✅ `total_price` = base + accessories + services - discount
- ✅ `status` = 'DRAFT'
- ✅ `created_at` IS NOT NULL

**Pass Criteria**: Quotation created, price calculated, persisted

---

### T-UPDATE: Update & Persist Template

**Applies to**: 43 entities (excludes append-only)

#### Detailed Execution by Entity

##### Example 1: Entity = customers

**Scenario**: UAT-CRM-003-UPDATE  
**URL**: `/crm/customers/{id}`

**Detailed Steps**:
1. Navigate to customer detail page
2. Click "Edit" button
3. Modify fields:
   ```
   Name: {Original Name} Updated
   Tier: GOLD (if was SILVER)
   ```
4. Click "Save" button
5. Wait for success toast
6. Press F5 to reload
7. Verify changes persisted

**Expected UI Result**:
- ✅ Toast: "Customer updated successfully"
- ✅ Name shows "Updated" suffix
- ✅ Tier badge shows "GOLD"
- ✅ After reload: Changes still visible

**Expected DB Verification**:
```sql
SELECT * FROM customers WHERE id = '{customer id}';
```
Expected:
- ✅ `name` contains "Updated"
- ✅ `tier` = 'GOLD'
- ✅ `updated_at` > `created_at`

**Pass Criteria**: Customer updated, changes persisted

---

### T-DELETE-SOFT: Soft Delete Template

**Applies to**: 36 entities with soft delete

#### Detailed Execution by Entity

##### Example 1: Entity = customers

**Scenario**: UAT-CRM-007-DEL-SOFT  
**URL**: `/crm/customers`

**Detailed Steps**:
1. Navigate to customer list
2. Select customer (ensure NO FK references)
3. Click "Delete" button
4. Confirm deletion in modal
5. Wait for success toast
6. Press F5 to reload
7. Verify customer NOT in list
8. Check DB directly

**Expected UI Result**:
- ✅ Toast: "Customer deleted successfully"
- ❌ Customer NOT visible in list
- ❌ Customer NOT in search results

**Expected DB Verification**:
```sql
SELECT * FROM customers WHERE id = '{customer id}';
```
Expected:
- ✅ Record still EXISTS in DB
- ✅ `deleted_at` IS NOT NULL OR `status` = 'DELETED'

**Expected API Verification**:
```
GET /api/customers
```
Expected:
- ❌ Deleted customer NOT in response

**Pass Criteria**: Customer soft deleted, not visible, DB record retained

---

### T-DELETE-FK: FK Constraint Test Template

**Applies to**: 32 entities with FK relationships

#### Detailed Execution by Entity

##### Example 1: Entity = customers (FK RESTRICT)

**Scenario**: UAT-CRM-008-DEL-FK  
**URL**: `/crm/customers`

**Preconditions**:
- Customer exists
- Customer has quotation (FK reference)

**Detailed Steps**:
1. Create customer
2. Create quotation for customer
3. Attempt to delete customer
4. Observe result

**Expected UI Result**:
- ❌ Error toast: "Cannot delete customer with existing quotations"
- ❌ Delete operation BLOCKED
- ✅ Customer still visible

**Expected DB Verification**:
```sql
SELECT * FROM customers WHERE id = '{customer id}';
```
Expected:
- ✅ Customer NOT deleted
- ✅ Quotation still references customer

**ERD Constraint Verified**:
- ✅ FK RESTRICT behavior working

**Pass Criteria**: Delete blocked due to FK constraint

---

##### Example 2: Entity = quotations → contracts (FK CASCADE)

**Scenario**: UAT-SAL-006-DEL-FK  

**Preconditions**:
- Quotation exists
- Contract exists for quotation

**Detailed Steps**:
1. Create quotation
2. Create contract from quotation
3. Delete quotation (if allowed)
4. Check contract status

**Expected Result** (depends on ERD):
- If FK = CASCADE: Contract also deleted
- If FK = RESTRICT: Delete blocked
- If FK = SET NULL: Contract FK set to NULL

**Pass Criteria**: FK behavior matches ERD specification

---

## 📋 ENTITY-SPECIFIC NOTES

### customers
- **Required fields**: name, phone, type
- **Unique**: phone (within active customers)
- **Soft delete**: Yes (`deleted_at`)
- **FK references**: quotations, contracts, leads

### leads
- **Required fields**: name, phone, source
- **Auto-calculated**: score (based on scoring_rules)
- **Soft delete**: Yes (`deleted_at`)
- **FK references**: interactions, lead_history

### quotations
- **Required fields**: customer_id, model, base_price
- **Auto-calculated**: total_price
- **Soft delete**: Yes (`deleted_at`)
- **FK references**: contracts (1:1)

### contracts
- **Required fields**: quotation_id, customer_id, vin_id
- **Hard delete**: Yes (admin only)
- **FK references**: pds_checklists, deliveries

---

## 🎯 EXECUTION CHECKLIST

### Before Starting UAT

- [ ] Read UAT Plan v3.0 (templates)
- [ ] Read this Execution Guide (details)
- [ ] Read Coverage Matrix v3.0 (entity list)
- [ ] Setup test environment
- [ ] Prepare test data

### For Each Entity

- [ ] Identify entity in Coverage Matrix
- [ ] Find applicable templates (CREATE, UPDATE, DELETE, etc.)
- [ ] Read detailed execution steps (this guide)
- [ ] Execute test
- [ ] Verify UI result
- [ ] Verify DB result
- [ ] Record result in Coverage Matrix

### After Each Module

- [ ] Calculate pass rate
- [ ] Report failures to Antigravity
- [ ] Wait for bug fixes
- [ ] Re-test failed scenarios

---

## 📊 REPORTING RESULTS

### For Each Scenario

Record in Coverage Matrix:
- Scenario ID
- Status (PASS/FAIL)
- Actual Result (if FAIL)
- Screenshot (if FAIL)
- Error message (if FAIL)

### Example Report Entry

```
Scenario: UAT-CRM-001-CREATE
Entity: customers
Status: FAIL
Expected: Customer created and persisted
Actual: Customer created but disappeared after reload
Error: TypeError: Cannot read property 'name' of null
Screenshot: screenshot_001.png
```

---

## ✅ APPROVAL

**Status**: ✅ APPROVED FOR USE WITH UAT PLAN V3.0

**Approved By**: Antigravity - System UAT Authority  
**Date**: 2026-01-29

**Usage**:
- Use with UAT Plan v3.0 (template-based)
- Provides detailed execution steps
- Enables OpenCode to execute tests

---

**Maintained By**: Antigravity (System UAT Authority)  
**Last Updated**: 2026-01-29  
**Version**: 3.0-EG (Execution Guide)

---

**End of Execution Guide**
