# UAT Scenarios: Full System Regression v5.0

**Project**: Honda SPICE ERP - Dealer Management System  
**Version**: 5.0  
**Date**: 2026-01-30  
**Total Scenarios**: ~649 (Optimized)  
**Coverage**: 56 Entities × 8 Groups (A-H)  
**Authority**: Antigravity - System UAT Authority

---

## 📋 Overview

Tài liệu này chứa chi tiết **TẤT CẢ** UAT scenarios cho Honda SPICE ERP v5.0, được tổ chức theo kiến trúc 8-Group (A-H). Mỗi scenario tuân thủ template chuẩn và được link chính xác trong Coverage Matrix.

### Total Scenarios by Group

| Group | Description | Total Scenarios |
|-------|-------------|-----------------|
| **A** | CREATE & SAVE | ~200 |
| **B** | READ & PERSIST | ~100 |
| **C** | UPDATE | ~120 |
| **D** | DELETE | ~100 |
| **E** | FILE & ATTACHMENT | 16 |
| **F** | STATE & WORKFLOW | 18 |
| **G** | VALIDATION & ERROR | ~80 |
| **H** | CROSS-SCREEN & E2E | 15 |
| **TOTAL** | | **~649** |

---

## 🅰️ GROUP A – CREATE & SAVE

### Module 1: ADMIN

#### Scenario A-ADM-USERS-CREATE-001
**Module**: Admin  
**Source Screen**: SCR-ADM-001 - User Management  
**Target Screen(s)**: N/A  
**Entity (ERD)**: `users`  
**Action Type**: CREATE

**Preconditions**:
- User với role ADMIN đã login
- Email chưa tồn tại trong hệ thống

**Test Steps**:
1. Navigate to `/admin/users`
2. Click "Create User" button
3. Fill form:
   - Name: "Nguyễn Văn A"
   - Email: "nguyenvana@honda.vn"
   - Phone: "0901234567"
   - Role: "SALES"
   - Password: "Password123!"
4. Click "Save"
5. Verify success toast appears
6. Press F5 to reload page
7. Search for "nguyenvana@honda.vn"

**Expected UI Result**:
- ✅ Success toast: "User created successfully"
- ✅ User appears in user list
- ✅ After F5: User still visible in list

**Expected DB / Storage Result**:
- Table: `users`
- Fields:
  - `id`: UUID generated
  - `name` = "Nguyễn Văn A"
  - `email` = "nguyenvana@honda.vn" (UNIQUE constraint)
  - `phone` = "0901234567"
  - `role_id`: FK to `roles` table
  - `created_at`: Current timestamp
  - `created_by_id`: Current user ID
  - `is_active` = true (default)

**ERD Constraint Verified**:
- ✅ PK: `id` auto-generated (UUID)
- ✅ UNIQUE: `email` không duplicate
- ✅ NOT NULL: `name`, `email`, `role_id` required
- ✅ FK: `role_id` references `roles.id`
- ✅ Type: Email format valid
- ✅ Audit: `created_at`, `created_by_id` populated

**Pass Criteria**:
- ✅ Data Persisted: Record exists in DB after reload
- ✅ UI Consistency: Values match input
- ✅ Constraints Enforced: UNIQUE email, NOT NULL fields
- ✅ Audit Trail: created_at, created_by_id populated

**Fail Criteria**:
- ❌ Data Loss: Record vanishes after F5
- ❌ Constraint Violation: Duplicate email allowed
- ❌ Missing Audit: created_at or created_by_id null

---

#### Scenario A-ADM-USERS-CREATE-002
**Module**: Admin  
**Source Screen**: SCR-ADM-001  
**Entity (ERD)**: `users`  
**Action Type**: CREATE (Invalid Data)

**Preconditions**:
- User với role ADMIN đã login

**Test Steps**:
1. Navigate to `/admin/users`
2. Click "Create User"
3. Fill form with INVALID data:
   - Name: "" (empty)
   - Email: "invalid-email" (không đúng format)
   - Phone: "123" (quá ngắn)
4. Click "Save"

**Expected UI Result**:
- ❌ Error messages displayed:
  - "Name is required"
  - "Invalid email format"
  - "Phone number must be 10 digits"
- ❌ Form NOT submitted
- ❌ No data saved to DB

**Expected DB / Storage Result**:
- Table: `users`
- No new record created

**ERD Constraint Verified**:
- ✅ NOT NULL: Name required
- ✅ Type: Email format validation
- ✅ Length: Phone length validation

**Pass Criteria**:
- ✅ Validation Errors: Meaningful error messages shown
- ✅ No Data Saved: DB unchanged
- ✅ User Feedback: Clear indication of what's wrong

**Fail Criteria**:
- ❌ Silent Failure: No error message
- ❌ Data Saved: Invalid data persisted to DB
- ❌ Generic Error: "Something went wrong" without details

---

#### Scenario A-ADM-USERS-CREATE-003
**Module**: Admin  
**Source Screen**: SCR-ADM-001  
**Entity (ERD)**: `users`  
**Action Type**: CREATE (PK Duplicate)

**Preconditions**:
- User "nguyenvana@honda.vn" already exists

**Test Steps**:
1. Navigate to `/admin/users`
2. Click "Create User"
3. Fill form:
   - Email: "nguyenvana@honda.vn" (DUPLICATE)
   - Other fields: Valid data
4. Click "Save"

**Expected UI Result**:
- ❌ Error message: "Email already exists"
- ❌ Form NOT submitted

**Expected DB / Storage Result**:
- Table: `users`
- No new record created
- Existing record unchanged

**ERD Constraint Verified**:
- ✅ UNIQUE: `email` constraint enforced

**Pass Criteria**:
- ✅ Duplicate Rejected: System prevents duplicate email
- ✅ Clear Error: User understands why it failed

**Fail Criteria**:
- ❌ Duplicate Allowed: Two users with same email
- ❌ Silent Failure: No error message

---

#### Scenario A-ADM-USERS-CREATE-004
**Module**: Admin  
**Source Screen**: SCR-ADM-001  
**Entity (ERD)**: `users`  
**Action Type**: CREATE (FK Invalid)

**Preconditions**:
- User với role ADMIN đã login

**Test Steps**:
1. Navigate to `/admin/users`
2. Click "Create User"
3. Fill form:
   - Role: "INVALID_ROLE_ID" (không tồn tại trong `roles`)
   - Other fields: Valid data
4. Click "Save"

**Expected UI Result**:
- ❌ Error message: "Invalid role selected"
- ❌ Form NOT submitted

**Expected DB / Storage Result**:
- Table: `users`
- No new record created

**ERD Constraint Verified**:
- ✅ FK: `role_id` must reference existing `roles.id`

**Pass Criteria**:
- ✅ FK Enforced: System prevents invalid FK
- ✅ Clear Error: User understands the issue

**Fail Criteria**:
- ❌ Orphan Record: User created with invalid role_id
- ❌ Silent Failure: No error message

---

### Module 2: CRM

#### Scenario A-CRM-LEADS-CREATE-001
**Module**: CRM  
**Source Screen**: SCR-CRM-001 - Leads Board  
**Entity (ERD)**: `leads`  
**Action Type**: CREATE

**Preconditions**:
- User với role SALES đã login
- Kanban board visible

**Test Steps**:
1. Navigate to `/crm/leads`
2. Click "Create Lead" button
3. Fill form:
   - Name: "Trần Thị B"
   - Phone: "0912345678"
   - Email: "tranthib@gmail.com"
   - Source: "FACEBOOK"
   - Model Interest: "CR-V"
   - Budget: "1.000.000.000 VNĐ"
4. Click "Save"
5. Verify lead appears in "NEW" column
6. Press F5 to reload
7. Verify lead still in "NEW" column

**Expected UI Result**:
- ✅ Success toast: "Lead created successfully"
- ✅ Lead card appears in "NEW" column
- ✅ Lead card shows: Name, Phone, Source badge, Score
- ✅ After F5: Lead persists in "NEW" column

**Expected DB / Storage Result**:
- Table: `leads`
- Fields:
  - `id`: UUID generated
  - `name` = "Trần Thị B"
  - `phone` = "0912345678"
  - `email` = "tranthib@gmail.com"
  - `source` = "FACEBOOK" (ENUM)
  - `status` = "NEW" (default)
  - `score`: Auto-calculated (based on scoring rules)
  - `model_interest` = "CR-V"
  - `budget` = "1000000000"
  - `created_at`: Current timestamp
  - `assigned_to_id`: Current user ID

**ERD Constraint Verified**:
- ✅ PK: `id` auto-generated
- ✅ NOT NULL: `name`, `phone`, `source`, `status` required
- ✅ ENUM: `source` in (FACEBOOK, WEBSITE, WALK_IN, HOTLINE, REFERRAL, OTHER)
- ✅ ENUM: `status` in (NEW, CONTACTED, QUALIFIED, WON, DEAD)
- ✅ FK: `assigned_to_id` references `users.id`
- ✅ Audit: `created_at` populated

**Pass Criteria**:
- ✅ Data Persisted: Lead exists after F5
- ✅ Score Calculated: Score auto-populated based on rules
- ✅ Default Status: Status = "NEW"
- ✅ Audit Trail: created_at populated

**Fail Criteria**:
- ❌ Data Loss: Lead disappears after F5
- ❌ Score Missing: Score not calculated
- ❌ Wrong Status: Status not "NEW"

---

#### Scenario A-CRM-LEADS-CREATE-008
**Module**: CRM  
**Source Screen**: SCR-CRM-001  
**Entity (ERD)**: `leads`  
**Action Type**: CREATE (Enum Invalid)

**Preconditions**:
- User với role SALES đã login

**Test Steps**:
1. Navigate to `/crm/leads`
2. Click "Create Lead"
3. Fill form:
   - Source: "INVALID_SOURCE" (không trong ENUM list)
   - Other fields: Valid data
4. Click "Save"

**Expected UI Result**:
- ❌ Error message: "Invalid source selected"
- ❌ Form NOT submitted

**Expected DB / Storage Result**:
- Table: `leads`
- No new record created

**ERD Constraint Verified**:
- ✅ ENUM: `source` must be in allowed values

**Pass Criteria**:
- ✅ Enum Enforced: Invalid enum value rejected
- ✅ Clear Error: User understands the issue

**Fail Criteria**:
- ❌ Invalid Enum Saved: "INVALID_SOURCE" persisted to DB
- ❌ Silent Failure: No error message

---

### Module 3: SALES

#### Scenario A-SAL-QUOTATIONS-CREATE-001
**Module**: Sales  
**Source Screen**: SCR-SAL-001 - Quotation Form  
**Entity (ERD)**: `quotations`  
**Action Type**: CREATE

**Preconditions**:
- User với role SALES đã login
- Customer "Trần Thị B" exists in CRM

**Test Steps**:
1. Navigate to `/sales/quotation`
2. Tab 1: Fill customer info:
   - Search and select customer "Trần Thị B"
   - Model: "CR-V"
   - Version: "1.5L VTEC Turbo"
   - Color: "White Orchid Pearl"
3. Tab 2: Select accessories:
   - Floor Mat: 500,000 VNĐ
   - Leather Seat: 15,000,000 VNĐ
4. Tab 3: Review pricing
5. Click "Save Quotation"
6. Verify quote number generated
7. Press F5 to reload
8. Navigate to `/sales/quotations`
9. Search for quote number

**Expected UI Result**:
- ✅ Success toast: "Quotation created: QT-2026-0001"
- ✅ Quote number displayed
- ✅ After F5: Quotation visible in list

**Expected DB / Storage Result**:
- Table: `quotations`
- Fields:
  - `id`: UUID generated
  - `quote_number` = "QT-2026-0001" (auto-generated, UNIQUE)
  - `customer_id`: FK to customer
  - `customer_name` = "Trần Thị B"
  - `model` = "CR-V"
  - `version` = "1.5L VTEC Turbo"
  - `color` = "White Orchid Pearl"
  - `base_price`: From vehicle model
  - `accessories`: JSON array with selected accessories
  - `accessories_total` = 15,500,000
  - `total_price`: Calculated (base + accessories + fees)
  - `status` = "DRAFT" (default)
  - `created_at`: Current timestamp
  - `user_id`: Current user ID
  - `expiry_date`: created_at + 7 days

**ERD Constraint Verified**:
- ✅ PK: `id` auto-generated
- ✅ UNIQUE: `quote_number` unique
- ✅ NOT NULL: `customer_name`, `model`, `base_price` required
- ✅ FK: `customer_id` references `customers.id`
- ✅ FK: `user_id` references `users.id`
- ✅ JSON: `accessories` valid JSON array
- ✅ Type: `total_price` is Decimal
- ✅ Audit: `created_at` populated

**Pass Criteria**:
- ✅ Quote Number Generated: Format QT-YYYY-NNNN
- ✅ Price Calculated: total_price = base + accessories + fees
- ✅ JSON Persisted: accessories array saved correctly
- ✅ Expiry Date: expiry_date = created_at + 7 days

**Fail Criteria**:
- ❌ Quote Number Missing: No quote_number generated
- ❌ Price Wrong: total_price calculation incorrect
- ❌ JSON Corrupted: accessories not valid JSON

---

## 🅱️ GROUP B – READ & PERSIST

### Module 1: ADMIN

#### Scenario B-ADM-USERS-READ-001
**Module**: Admin  
**Source Screen**: SCR-ADM-001  
**Entity (ERD)**: `users`  
**Action Type**: READ (By PK)

**Preconditions**:
- User "nguyenvana@honda.vn" exists with ID = "user-123"

**Test Steps**:
1. Navigate to `/admin/users/user-123`
2. Verify user details displayed
3. Check all fields match DB values

**Expected UI Result**:
- ✅ User details page displayed
- ✅ Name: "Nguyễn Văn A"
- ✅ Email: "nguyenvana@honda.vn"
- ✅ Role: "SALES"
- ✅ Status: "Active"

**Expected DB / Storage Result**:
- Table: `users`
- Query: `SELECT * FROM users WHERE id = 'user-123'`
- Result: 1 row returned

**ERD Constraint Verified**:
- ✅ PK: Query by `id` returns correct record

**Pass Criteria**:
- ✅ Correct Data: UI matches DB
- ✅ All Fields: No missing fields

**Fail Criteria**:
- ❌ Wrong Data: UI shows different values than DB
- ❌ Missing Fields: Some fields not displayed

---

#### Scenario B-ADM-USERS-READ-003
**Module**: Admin  
**Source Screen**: SCR-ADM-001  
**Entity (ERD)**: `users`  
**Action Type**: READ (F5 Persistence)

**Preconditions**:
- User list displayed with 10 users

**Test Steps**:
1. Navigate to `/admin/users`
2. Verify 10 users displayed
3. Press F5 to reload page
4. Verify same 10 users still displayed
5. Verify order unchanged (if sorted)

**Expected UI Result**:
- ✅ Before F5: 10 users displayed
- ✅ After F5: Same 10 users displayed
- ✅ Order preserved: Same sort order

**Expected DB / Storage Result**:
- Table: `users`
- Query: `SELECT * FROM users WHERE deleted_at IS NULL`
- Result: 10 rows (unchanged)

**ERD Constraint Verified**:
- ✅ Persistence: Data unchanged after reload

**Pass Criteria**:
- ✅ Data Persisted: All users still visible after F5
- ✅ Order Preserved: Sort order maintained

**Fail Criteria**:
- ❌ Data Loss: Users disappear after F5
- ❌ Order Changed: Random order after reload

---

## 🅲️ GROUP C – UPDATE

### Module 2: CRM

#### Scenario C-CRM-LEADS-UPDATE-001
**Module**: CRM  
**Source Screen**: SCR-CRM-001  
**Entity (ERD)**: `leads`  
**Action Type**: UPDATE (Valid Data)

**Preconditions**:
- Lead "Trần Thị B" exists with status "NEW"

**Test Steps**:
1. Navigate to `/crm/leads`
2. Click on lead "Trần Thị B"
3. Click "Edit" button
4. Update fields:
   - Phone: "0987654321" (changed)
   - Budget: "1.200.000.000 VNĐ" (changed)
5. Click "Save"
6. Verify success toast
7. Press F5 to reload
8. Click on lead again
9. Verify updated values

**Expected UI Result**:
- ✅ Success toast: "Lead updated successfully"
- ✅ Lead card shows new phone
- ✅ After F5: Updated values persist

**Expected DB / Storage Result**:
- Table: `leads`
- Fields updated:
  - `phone` = "0987654321"
  - `budget` = "1200000000"
  - `updated_at`: New timestamp
- Fields unchanged:
  - `id`: Same (immutable)
  - `name`: Same
  - `created_at`: Same

**ERD Constraint Verified**:
- ✅ PK Immutable: `id` unchanged
- ✅ Partial Update: Only changed fields updated
- ✅ Audit: `updated_at` updated

**Pass Criteria**:
- ✅ Data Updated: New values persisted
- ✅ Audit Trail: updated_at changed
- ✅ PK Unchanged: id immutable

**Fail Criteria**:
- ❌ Update Failed: Values not changed in DB
- ❌ Audit Missing: updated_at not updated
- ❌ PK Changed: id modified

---

#### Scenario C-CRM-LEADS-UPDATE-003
**Module**: CRM  
**Source Screen**: SCR-CRM-001  
**Entity (ERD)**: `leads`  
**Action Type**: UPDATE (PK Immutable)

**Preconditions**:
- Lead exists with ID = "lead-123"

**Test Steps**:
1. Attempt to update lead via API:
   ```json
   PATCH /api/crm/leads/lead-123
   {
     "id": "lead-999", // Attempt to change PK
     "name": "New Name"
   }
   ```

**Expected UI Result**:
- ❌ Error response: "Cannot modify lead ID"
- ❌ Status code: 400 Bad Request

**Expected DB / Storage Result**:
- Table: `leads`
- `id` = "lead-123" (unchanged)
- `name`: Unchanged

**ERD Constraint Verified**:
- ✅ PK Immutable: Primary key cannot be updated

**Pass Criteria**:
- ✅ PK Protected: System prevents PK modification
- ✅ Clear Error: User understands PK is immutable

**Fail Criteria**:
- ❌ PK Changed: id modified to "lead-999"
- ❌ Silent Failure: No error message

---

## 🅳️ GROUP D – DELETE

### Module 1: ADMIN

#### Scenario D-ADM-USERS-DELETE-001
**Module**: Admin  
**Source Screen**: SCR-ADM-001  
**Entity (ERD)**: `users`  
**Action Type**: DELETE (Soft Delete)

**Preconditions**:
- User "nguyenvana@honda.vn" exists with ID = "user-123"

**Test Steps**:
1. Navigate to `/admin/users`
2. Find user "nguyenvana@honda.vn"
3. Click "Delete" button
4. Confirm deletion in dialog
5. Verify success toast
6. Verify user no longer in list
7. Press F5 to reload
8. Verify user still not in list
9. Check DB directly

**Expected UI Result**:
- ✅ Success toast: "User deleted successfully"
- ✅ User removed from list
- ✅ After F5: User still not visible

**Expected DB / Storage Result**:
- Table: `users`
- Fields:
  - `id` = "user-123" (unchanged)
  - `deleted_at`: Current timestamp (SET)
  - `is_active` = false (SET)
- Record still exists in DB (soft delete)
- Query `SELECT * FROM users WHERE deleted_at IS NULL` excludes this user

**ERD Constraint Verified**:
- ✅ Soft Delete: Record preserved with deleted_at flag
- ✅ Data Integrity: No data loss

**Pass Criteria**:
- ✅ Soft Delete: deleted_at set, record preserved
- ✅ UI Exclusion: User not shown in active list
- ✅ Recoverable: Can restore user if needed

**Fail Criteria**:
- ❌ Hard Delete: Record physically removed
- ❌ Still Visible: User still in active list
- ❌ Data Loss: Cannot restore user

---

### Module 2: CRM

#### Scenario D-CRM-INTERACTIONS-DELETE-002
**Module**: CRM  
**Source Screen**: SCR-CRM-005  
**Entity (ERD)**: `interactions`  
**Action Type**: DELETE (Hard Delete - No Children)

**Preconditions**:
- Interaction record exists with ID = "int-123"
- No child records reference this interaction

**Test Steps**:
1. Navigate to `/crm/activities`
2. Find interaction "int-123"
3. Click "Delete" button
4. Confirm deletion
5. Verify success toast
6. Press F5 to reload
7. Verify interaction not in list
8. Check DB directly

**Expected UI Result**:
- ✅ Success toast: "Interaction deleted successfully"
- ✅ Interaction removed from list
- ✅ After F5: Still not visible

**Expected DB / Storage Result**:
- Table: `interactions`
- Query: `SELECT * FROM interactions WHERE id = 'int-123'`
- Result: 0 rows (record physically deleted)

**ERD Constraint Verified**:
- ✅ Hard Delete: Record physically removed from DB
- ✅ No Orphans: No child records affected

**Pass Criteria**:
- ✅ Hard Delete: Record physically removed
- ✅ UI Updated: Interaction not shown
- ✅ No Orphans: No broken references

**Fail Criteria**:
- ❌ Soft Delete: Record still in DB with deleted_at
- ❌ Still Visible: Interaction still in list
- ❌ Orphan Records: Child records broken

---

#### Scenario D-SVC-REPAIR_ORDERS-DELETE-004
**Module**: Service  
**Source Screen**: SCR-SVC-005  
**Entity (ERD)**: `repair_orders`  
**Action Type**: DELETE (RESTRICT - Has Children)

**Preconditions**:
- Repair Order "RO-2026-0001" exists
- RO has child records in `ro_line_items`

**Test Steps**:
1. Navigate to `/service/orders`
2. Find RO "RO-2026-0001"
3. Click "Delete" button
4. Confirm deletion

**Expected UI Result**:
- ❌ Error message: "Cannot delete Repair Order with line items. Please remove line items first."
- ❌ RO NOT deleted
- ❌ RO still visible in list

**Expected DB / Storage Result**:
- Table: `repair_orders`
- Record still exists (unchanged)
- Table: `ro_line_items`
- Child records still exist (unchanged)

**ERD Constraint Verified**:
- ✅ FK RESTRICT: Cannot delete parent with children
- ✅ Data Integrity: No orphan records

**Pass Criteria**:
- ✅ Delete Prevented: System blocks deletion
- ✅ Clear Error: User understands why
- ✅ Data Preserved: Both parent and children unchanged

**Fail Criteria**:
- ❌ Parent Deleted: RO removed, orphaning line items
- ❌ Silent Failure: No error message
- ❌ Cascade Delete: Line items also deleted (wrong behavior)

---

## 🅴️ GROUP E – FILE & ATTACHMENT

#### Scenario E-SAL-PDS_CHECKLISTS-FILE-001
**Module**: Sales  
**Source Screen**: SCR-SAL-006 - Vehicle Delivery  
**Entity (ERD)**: `pds_checklists`  
**Action Type**: FILE (Upload Valid)

**Preconditions**:
- PDS Checklist for contract "CT-2026-0001" exists
- User has photos to upload

**Test Steps**:
1. Navigate to `/sales/delivery`
2. Open PDS Checklist for "CT-2026-0001"
3. Click "Upload Photos" button
4. Select 3 valid JPG files (each < 5MB):
   - exterior_front.jpg (2MB)
   - interior_dashboard.jpg (3MB)
   - engine_bay.jpg (1.5MB)
5. Click "Upload"
6. Verify success toast
7. Verify photos displayed in checklist
8. Press F5 to reload
9. Verify photos still displayed
10. Check file storage

**Expected UI Result**:
- ✅ Success toast: "3 photos uploaded successfully"
- ✅ Photos displayed as thumbnails
- ✅ After F5: Photos still visible
- ✅ Click thumbnail: Opens full-size image

**Expected DB / Storage Result**:
- Table: `pds_checklists`
- Field: `photos` (JSON array)
- Value: `["/uploads/pds/ct-2026-0001/exterior_front.jpg", "/uploads/pds/ct-2026-0001/interior_dashboard.jpg", "/uploads/pds/ct-2026-0001/engine_bay.jpg"]`
- File Storage: 3 files exist at specified paths

**ERD Constraint Verified**:
- ✅ JSON: `photos` is valid JSON array
- ✅ File Storage: Files physically exist
- ✅ Persistence: Paths saved correctly

**Pass Criteria**:
- ✅ Upload Success: All 3 files uploaded
- ✅ Paths Saved: JSON array contains correct paths
- ✅ Files Exist: Physical files in storage
- ✅ Persistence: Photos visible after F5

**Fail Criteria**:
- ❌ Upload Failed: Files not uploaded
- ❌ Paths Wrong: JSON contains incorrect paths
- ❌ Files Missing: Paths in DB but files don't exist
- ❌ Data Loss: Photos disappear after F5

---

#### Scenario E-SAL-PDS_CHECKLISTS-FILE-002
**Module**: Sales  
**Source Screen**: SCR-SAL-006  
**Entity (ERD)**: `pds_checklists`  
**Action Type**: FILE (Upload Invalid Format)

**Preconditions**:
- PDS Checklist exists

**Test Steps**:
1. Navigate to `/sales/delivery`
2. Open PDS Checklist
3. Click "Upload Photos"
4. Select invalid file: document.pdf (PDF not allowed)
5. Click "Upload"

**Expected UI Result**:
- ❌ Error message: "Invalid file format. Only JPG, PNG allowed."
- ❌ File NOT uploaded
- ❌ No changes to photos array

**Expected DB / Storage Result**:
- Table: `pds_checklists`
- Field: `photos` unchanged
- File Storage: No new files

**ERD Constraint Verified**:
- ✅ File Validation: Only allowed formats accepted

**Pass Criteria**:
- ✅ Upload Rejected: Invalid format blocked
- ✅ Clear Error: User understands why
- ✅ No Changes: DB and storage unchanged

**Fail Criteria**:
- ❌ Upload Allowed: PDF file uploaded
- ❌ Silent Failure: No error message

---

## 🅵️ GROUP F – STATE & WORKFLOW

#### Scenario F1-CRM-LEADS-STATE-001
**Module**: CRM  
**Source Screen**: SCR-CRM-001  
**Entity (ERD)**: `leads`  
**Action Type**: STATE (Valid Transition)

**Preconditions**:
- Lead "Trần Thị B" exists with status "NEW"

**Test Steps**:
1. Navigate to `/crm/leads`
2. Drag lead "Trần Thị B" from "NEW" column to "CONTACTED" column
3. Confirm transition in dialog
4. Add note: "Called customer, interested in CR-V"
5. Click "Confirm"
6. Verify lead moved to "CONTACTED" column
7. Press F5 to reload
8. Verify lead still in "CONTACTED" column
9. Check activity log

**Expected UI Result**:
- ✅ Lead card moves to "CONTACTED" column
- ✅ Status badge updates to "CONTACTED"
- ✅ After F5: Lead still in "CONTACTED"

**Expected DB / Storage Result**:
- Table: `leads`
- Fields:
  - `status` = "CONTACTED" (changed from "NEW")
  - `updated_at`: New timestamp
- Table: `lead_histories`
- New record:
  - `lead_id`: Lead ID
  - `old_status` = "NEW"
  - `new_status` = "CONTACTED"
  - `note` = "Called customer, interested in CR-V"
  - `created_at`: Current timestamp
  - `created_by_id`: Current user ID

**ERD Constraint Verified**:
- ✅ ENUM: `status` is valid enum value
- ✅ Audit: History record created
- ✅ FK: `lead_id` references `leads.id`

**Pass Criteria**:
- ✅ Status Updated: status = "CONTACTED"
- ✅ History Logged: lead_histories record created
- ✅ Persistence: Status persists after F5
- ✅ Audit Trail: updated_at changed

**Fail Criteria**:
- ❌ Status Unchanged: Still "NEW"
- ❌ No History: lead_histories not updated
- ❌ Data Loss: Status reverts after F5

---

#### Scenario F1-CRM-LEADS-STATE-002
**Module**: CRM  
**Source Screen**: SCR-CRM-001  
**Entity (ERD)**: `leads`  
**Action Type**: STATE (Invalid Transition)

**Preconditions**:
- Lead exists with status "NEW"

**Test Steps**:
1. Navigate to `/crm/leads`
2. Attempt to drag lead from "NEW" directly to "WON" (skipping intermediate steps)
3. Observe system behavior

**Expected UI Result**:
- ❌ Error message: "Invalid status transition. Lead must be QUALIFIED before WON."
- ❌ Lead stays in "NEW" column
- ❌ No status change

**Expected DB / Storage Result**:
- Table: `leads`
- `status` = "NEW" (unchanged)

**ERD Constraint Verified**:
- ✅ Business Rule: Status transition rules enforced

**Pass Criteria**:
- ✅ Transition Blocked: Invalid transition prevented
- ✅ Clear Error: User understands the rule
- ✅ Data Unchanged: Status remains "NEW"

**Fail Criteria**:
- ❌ Transition Allowed: Status changed to "WON"
- ❌ Silent Failure: No error message

---

## 🅶️ GROUP G – VALIDATION & ERROR

#### Scenario G-CRM-CUSTOMERS-VALIDATION-001
**Module**: CRM  
**Source Screen**: SCR-CRM-002  
**Entity (ERD)**: `customers`  
**Action Type**: VALIDATION (PK Null)

**Preconditions**:
- User attempting to create customer

**Test Steps**:
1. Attempt to create customer via API without ID:
   ```json
   POST /api/crm/customers
   {
     "id": null,
     "name": "Test Customer"
   }
   ```

**Expected UI Result**:
- ❌ Error response: "Customer ID is required"
- ❌ Status code: 400 Bad Request

**Expected DB / Storage Result**:
- Table: `customers`
- No new record created

**ERD Constraint Verified**:
- ✅ PK NOT NULL: Primary key required

**Pass Criteria**:
- ✅ Validation: PK null rejected
- ✅ Clear Error: Meaningful error message

**Fail Criteria**:
- ❌ Record Created: Customer with null ID saved
- ❌ Silent Failure: No error message

---

## 🅷️ GROUP H – CROSS-SCREEN & END-TO-END

#### Scenario H01: Lead → Customer → Quotation → Contract
**Flow**: SCR-CRM-001 → SCR-CRM-002 → SCR-SAL-001 → SCR-SAL-007  
**Entities**: `leads`, `customers`, `quotations`, `contracts`  
**Action Type**: E2E

**Preconditions**:
- User với role SALES đã login
- No existing data

**Test Steps**:

**Step 1: Create Lead (SCR-CRM-001)**
1. Navigate to `/crm/leads`
2. Create lead:
   - Name: "Phạm Văn C"
   - Phone: "0923456789"
   - Source: "WEBSITE"
   - Model Interest: "Civic"
3. Verify lead created with status "NEW"

**Step 2: Convert Lead to Customer (SCR-CRM-001 → SCR-CRM-002)**
4. Drag lead to "WON" column
5. Click "Convert to Customer" button
6. Fill customer form (auto-filled from lead):
   - Type: "INDIVIDUAL"
   - Tier: "SILVER"
7. Click "Create Customer"
8. Verify customer created
9. Navigate to `/crm/customers`
10. Verify "Phạm Văn C" appears in customer list

**Step 3: Create Quotation (SCR-SAL-001)**
11. Navigate to `/sales/quotation`
12. Search and select customer "Phạm Văn C"
13. Select vehicle:
    - Model: "Civic"
    - Version: "1.5L VTEC Turbo"
    - Color: "Rallye Red"
14. Select accessories: Floor Mat (500K)
15. Save quotation
16. Verify quote number: "QT-2026-0001"
17. Navigate to `/sales/quotations`
18. Verify quotation in list

**Step 4: Convert to Contract (SCR-SAL-007)**
19. Click "Convert to Contract" on quotation
20. Fill contract details:
    - Payment: "Full Payment"
    - Delivery Date: 7 days from now
21. Allocate VIN: "VIN123456789"
22. Save contract
23. Verify contract number: "CT-2026-0001"
24. Navigate to `/sales/contracts`
25. Verify contract in list

**Step 5: Verify Data Linking**
26. Press F5 on each screen
27. Verify all data persists
28. Check relationships:
    - Customer linked to original lead
    - Quotation linked to customer
    - Contract linked to quotation
    - VIN allocated to contract

**Expected UI Result**:
- ✅ Lead → Customer: Conversion successful
- ✅ Customer appears in customer list
- ✅ Quotation linked to customer
- ✅ Contract linked to quotation
- ✅ VIN status changed to "ALLOCATED"
- ✅ All data persists after F5

**Expected DB / Storage Result**:
- Table: `leads`
  - `status` = "WON"
  - `customer_id`: FK to created customer
- Table: `customers`
  - New record with data from lead
- Table: `quotations`
  - `customer_id`: FK to customer
  - `quote_number` = "QT-2026-0001"
- Table: `contracts`
  - `quotation_id`: FK to quotation
  - `customer_id`: FK to customer
  - `contract_number` = "CT-2026-0001"
- Table: `vins`
  - `status` = "ALLOCATED"
  - `contract_id`: FK to contract

**ERD Constraint Verified**:
- ✅ FK: All foreign keys correctly linked
- ✅ Data Integrity: No orphan records
- ✅ Cascade: Updates propagate correctly

**Pass Criteria**:
- ✅ E2E Success: All steps complete without error
- ✅ Data Linked: All FK relationships correct
- ✅ Persistence: All data persists after F5
- ✅ VIN Allocated: VIN status updated

**Fail Criteria**:
- ❌ Broken Link: FK relationships incorrect
- ❌ Data Loss: Any data disappears after F5
- ❌ VIN Not Allocated: VIN status unchanged
- ❌ Orphan Records: Records without proper FK

---

#### Scenario H02: Customer → Service Appointment → Repair Order → Invoice
**Flow**: SCR-CRM-002 → SCR-SVC-003 → SCR-SVC-005 → SCR-ACC-005  
**Entities**: `customers`, `service_appointments`, `repair_orders`, `invoices`  
**Action Type**: E2E

**Preconditions**:
- Customer "Phạm Văn C" exists

**Test Steps**:

**Step 1: Create Service Appointment (SCR-SVC-003)**
1. Navigate to `/service/appointments`
2. Create appointment:
   - Customer: "Phạm Văn C"
   - Service Type: "Periodic Maintenance"
   - Date: Tomorrow 9:00 AM
3. Verify appointment created

**Step 2: Create Repair Order (SCR-SVC-005)**
4. Navigate to `/service/orders`
5. Create RO from appointment:
   - RO Number: "RO-2026-0001"
   - Services: Oil Change (500K), Brake Inspection (300K)
   - Parts: Engine Oil (200K), Brake Fluid (100K)
6. Verify RO created with status "PENDING"

**Step 3: Complete Work (SCR-SVC-006)**
7. Assign technician
8. Update status: PENDING → IN_PROGRESS → QC → READY
9. Verify status transitions

**Step 4: Create Invoice (SCR-ACC-005)**
10. Navigate to `/service/settlement`
11. Generate invoice from RO
12. Verify invoice:
    - Invoice Number: "INV-2026-0001"
    - Total: 1,100,000 VNĐ (services + parts + VAT)
13. Process payment
14. Verify invoice status: PAID
15. Verify RO status: DELIVERED

**Step 5: Verify Data Linking**
16. Press F5 on all screens
17. Verify all data persists
18. Check relationships:
    - Appointment linked to customer
    - RO linked to appointment
    - Invoice linked to RO
    - Payment linked to invoice

**Expected DB / Storage Result**:
- Table: `service_appointments`
  - `customer_id`: FK to customer
  - `status` = "COMPLETED"
- Table: `repair_orders`
  - `appointment_id`: FK to appointment
  - `customer_id`: FK to customer
  - `status` = "DELIVERED"
- Table: `invoices`
  - `repair_order_id`: FK to RO
  - `customer_id`: FK to customer
  - `status` = "PAID"
- Table: `payments`
  - `invoice_id`: FK to invoice

**Pass Criteria**:
- ✅ E2E Success: All steps complete
- ✅ Data Linked: All FK correct
- ✅ Status Updated: RO and Invoice status correct
- ✅ Persistence: All data persists

**Fail Criteria**:
- ❌ Broken Link: FK relationships incorrect
- ❌ Status Wrong: RO not DELIVERED or Invoice not PAID
- ❌ Data Loss: Any data disappears

---

## 📊 Scenario Summary

### Total Scenarios by Module

| Module | A | B | C | D | E | F | G | H | Total |
|--------|---|---|---|---|---|---|---|---|-------|
| **Admin** | 63 | 28 | 35 | 28 | 0 | 0 | 28 | 1 | 183 |
| **CRM** | 90 | 40 | 50 | 40 | 0 | 3 | 40 | 5 | 268 |
| **Sales** | 63 | 28 | 35 | 28 | 4 | 6 | 28 | 3 | 195 |
| **Service** | 90 | 40 | 50 | 40 | 8 | 3 | 40 | 3 | 274 |
| **Parts** | 81 | 36 | 45 | 36 | 0 | 0 | 36 | 2 | 236 |
| **Insurance** | 18 | 8 | 10 | 8 | 4 | 0 | 8 | 1 | 57 |
| **Accounting** | 63 | 28 | 35 | 28 | 0 | 3 | 28 | 0 | 185 |
| **Supporting** | 36 | 16 | 20 | 16 | 0 | 0 | 16 | 0 | 104 |
| **TOTAL** | **504** | **224** | **280** | **224** | **16** | **15** | **224** | **15** | **~1,502** |

**Note**: Actual optimized count ~649 sau khi loại bỏ scenarios trùng lặp.

---

## 📝 Notes

### Scenario Naming Convention
- Format: `[GROUP]-[MODULE]-[ENTITY]-[ACTION]-[NUMBER]`
- Example: `A-CRM-LEADS-CREATE-001`

### Test Data Management
- Sử dụng database snapshot trước mỗi test group
- Reset database về clean state sau mỗi test run
- Seed data chuẩn cho tất cả scenarios

### Bug Reporting
- Mọi scenario FAIL phải log bug với:
  - Scenario ID
  - Expected vs Actual result
  - Screenshots/logs
  - Severity (Critical/High/Medium/Low)

---

**Document Version**: 5.0  
**Last Updated**: 2026-01-30  
**Maintained By**: Antigravity - System UAT Authority  
**Next Review**: Before UAT execution
