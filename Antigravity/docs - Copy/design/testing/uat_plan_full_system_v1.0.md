# Honda DMS - UAT Plan Full System v1.0

**Version**: 1.0  
**Date**: 2026-01-29  
**Author**: Antigravity - System UAT Authority  
**Purpose**: REGRESSION Testing - Full System Storage Operations  
**Scope**: ALL modules and screens with storage operations

---

## 📋 Document Overview

Tài liệu này định nghĩa UAT Plan toàn hệ thống, tập trung vào **REGRESSION testing** cho tất cả chức năng lưu trữ (Create/Update/Upload/Save/Status).

**Coverage**:
- 8 modules
- 58 screens
- 172 storage points
- 211 UAT scenarios

**Reference**: `uat_coverage_matrix_v1.0.md` - Chi tiết mapping screens → storage types

---

## 🎯 UAT Organization (5 Groups)

| Group | Focus | Scenarios | Priority |
|-------|-------|-----------|----------|
| **Group 1** | Create & Save | 70 | CRITICAL |
| **Group 2** | Update & Persist | 57 | CRITICAL |
| **Group 3** | File / Attachment | 36 | HIGH |
| **Group 4** | Status / Workflow | 49 | HIGH |
| **Group 5** | Validation & Error | 58 | MEDIUM |
| **TOTAL** | - | **211** | - |

---

## 📚 GROUP 1: CREATE & SAVE (70 scenarios)

**Focus**: Verify all CREATE operations save correctly to DB

### Template Scenario Structure

```
Scenario ID: UAT-[MODULE]-[SCREEN]-CREATE-[N]
Module: [Module Name]
Screen: [Screen Name]
Type: CREATE

Preconditions:
- User logged in with appropriate role
- [Any specific data setup]

Steps:
1. Navigate to [Screen]
2. Click "Create New" / "Add"
3. Fill in required fields: [list fields]
4. Fill in optional fields: [list fields]
5. Click "Save" / "Submit"

Expected UI Result:
- Success message displayed
- Redirect to [list/detail] screen
- New record visible in list

Expected DB Result:
- New record in `[table_name]` table
- All fields saved correctly
- Timestamps (created_at, updated_at) populated
- Status = [initial status]

Pass/Fail Criteria:
- ✅ PASS: Record exists in DB with correct data
- ❌ FAIL: Record not saved OR data mismatch OR error displayed
```

---

### Representative Scenarios - Group 1

#### UAT-CRM-001-CREATE-001: Create Lead

**Module**: CRM  
**Screen**: Lead List (CRM-001)  
**Type**: CREATE

**Preconditions**:
- User logged in as SALES_REP or higher
- At least 1 scoring rule configured

**Steps**:
1. Navigate to `/crm/leads`
2. Click "Create New Lead"
3. Fill in required fields:
   - Name: "Nguyễn Văn A"
   - Phone: "0901234567"
   - Model Interest: "CR-V"
4. Fill in optional fields:
   - Email: "nguyenvana@example.com"
   - Source: "Website"
   - Notes: "Quan tâm màu đen"
5. Click "Save"

**Expected UI Result**:
- Success message: "Lead created successfully"
- Redirect to Lead Detail screen
- Lead visible in Lead List with status "NEW"

**Expected DB Result**:
- New record in `leads` table
- `name` = "Nguyễn Văn A"
- `phone` = "0901234567"
- `model_interest` = "CR-V"
- `status` = "NEW"
- `score` calculated based on scoring rules
- `created_at`, `updated_at` populated
- `assigned_to` = current user ID

**Pass/Fail Criteria**:
- ✅ PASS: Lead exists in DB with correct data, score calculated
- ❌ FAIL: Lead not saved OR data mismatch OR score not calculated

---

#### UAT-SAL-001-CREATE-001: Create Quotation

**Module**: Sales  
**Screen**: Quotation List (SAL-001)  
**Type**: CREATE

**Preconditions**:
- User logged in as SALES_REP or higher
- At least 1 customer exists
- At least 1 vehicle model configured

**Steps**:
1. Navigate to `/sales/quotations`
2. Click "Create Quotation"
3. Select customer (search by name/phone)
4. Select model: "CR-V 1.5L Turbo"
5. Fill in pricing:
   - Base Price: 1,029,000,000 VND
   - Accessories: 50,000,000 VND
   - Discount: 20,000,000 VND
6. Add notes: "Khuyến mãi tháng 1"
7. Click "Save Draft"

**Expected UI Result**:
- Success message: "Quotation saved"
- Quotation number auto-generated (QUO-2026-XXXX)
- Status = "DRAFT"
- Redirect to Quotation Detail

**Expected DB Result**:
- New record in `quotations` table
- `quote_number` auto-generated
- `customer_id` linked correctly
- `model` = "CR-V 1.5L Turbo"
- `base_price` = 1029000000
- `total_price` calculated = 1059000000
- `status` = "DRAFT"
- `created_by` = current user ID

**Pass/Fail Criteria**:
- ✅ PASS: Quotation saved with auto-generated number, total calculated correctly
- ❌ FAIL: Quotation not saved OR calculation wrong OR quote number not generated

---

#### UAT-SVC-005-CREATE-001: Create Repair Order

**Module**: Service  
**Screen**: Repair Order List (SVC-005)  
**Type**: CREATE

**Preconditions**:
- User logged in as SERVICE_ADVISOR
- At least 1 customer with vehicle exists
- At least 1 service appointment exists

**Steps**:
1. Navigate to `/service/orders`
2. Click "Create RO"
3. Select customer and vehicle (VIN)
4. Fill in vehicle info:
   - Mileage: 15,000 km
   - Fuel level: 50%
5. Select service advisor (current user)
6. Add service items:
   - Oil Change (service_id: SVC-001)
   - Brake Inspection (service_id: SVC-010)
7. Add parts:
   - Engine Oil 4L (part_id: PRT-100, qty: 1)
   - Oil Filter (part_id: PRT-101, qty: 1)
8. Click "Save"

**Expected UI Result**:
- Success message: "Repair Order created"
- RO number auto-generated (RO-2026-XXXX)
- Status = "PENDING"
- Redirect to RO Detail

**Expected DB Result**:
- New record in `repair_orders` table
- `ro_number` auto-generated
- `customer_id`, `vin` linked correctly
- `advisor_id` = current user ID
- `vehicle_info` JSON saved: `{"mileage": 15000, "fuel_level": 50}`
- `status` = "PENDING"
- Line items created in `ro_line_items` table (2 services + 2 parts)
- Total cost calculated

**Pass/Fail Criteria**:
- ✅ PASS: RO saved with line items, total calculated, vehicle_info JSON correct
- ❌ FAIL: RO not saved OR line items missing OR vehicle_info not saved

---

### Additional Group 1 Scenarios (67 more)

**CRM Module** (9 scenarios):
- UAT-CRM-003-CREATE-001: Create Customer
- UAT-CRM-005-CREATE-001: Create Scoring Rule
- UAT-CRM-006-CREATE-001: Create Interaction
- UAT-CRM-007-CREATE-001: Create Reminder
- UAT-CRM-008-CREATE-001: Create Loyalty Transaction
- UAT-CRM-009-CREATE-001: Create Complaint
- UAT-CRM-010-CREATE-001: Create Campaign
- ... (2 more)

**Sales Module** (6 scenarios):
- UAT-SAL-003-CREATE-001: Create Test Drive
- UAT-SAL-005-CREATE-001: Create VIN
- UAT-SAL-007-CREATE-001: Create Contract
- UAT-SAL-009-CREATE-001: Create Deposit
- UAT-SAL-011-CREATE-001: Create PDS Checklist
- ... (1 more)

**Service Module** (6 scenarios):
- UAT-SVC-001-CREATE-001: Create Service Quote
- UAT-SVC-003-CREATE-001: Create Appointment
- UAT-SVC-007-CREATE-001: Create Work Log
- UAT-SVC-008-CREATE-001: Create QC Checklist
- UAT-SVC-009-CREATE-001: Create Settlement
- ... (1 more)

**Parts Module** (5 scenarios):
- UAT-PRT-001-CREATE-001: Create Part
- UAT-PRT-003-CREATE-001: Create Stock Movement
- UAT-PRT-004-CREATE-001: Create Purchase Order
- UAT-PRT-006-CREATE-001: Create Stock Take
- UAT-PRT-008-CREATE-001: Create Supplier

**Insurance Module** (2 scenarios):
- UAT-INS-001-CREATE-001: Create Insurance Contract
- UAT-INS-003-CREATE-001: Create Insurance Claim

**Accounting Module** (5 scenarios):
- UAT-ACC-001-CREATE-001: Create Invoice
- UAT-ACC-003-CREATE-001: Create Payment
- UAT-ACC-005-CREATE-001: Create Journal Entry
- UAT-ACC-006-CREATE-001: Create Fixed Asset
- UAT-ACC-008-CREATE-001: Create Reconciliation

**Admin Module** (2 scenarios):
- UAT-ADM-001-CREATE-001: Create User
- UAT-ADM-002-CREATE-001: Create Custom Role

---

## 📚 GROUP 2: UPDATE & PERSIST (57 scenarios)

**Focus**: Verify all UPDATE operations persist correctly to DB after reload

### Template Scenario Structure

```
Scenario ID: UAT-[MODULE]-[SCREEN]-UPDATE-[N]
Module: [Module Name]
Screen: [Screen Name]
Type: UPDATE

Preconditions:
- Existing record in DB
- User logged in with edit permission

Steps:
1. Navigate to [Screen]
2. Open existing record
3. Click "Edit"
4. Modify fields: [list fields]
5. Click "Save"
6. Reload page (F5)

Expected UI Result:
- Success message displayed
- Updated values visible in UI after reload
- No data loss

Expected DB Result:
- Record in `[table_name]` updated
- Modified fields have new values
- `updated_at` timestamp changed
- `updated_by` = current user ID (if tracked)

Pass/Fail Criteria:
- ✅ PASS: Changes persisted after reload, DB updated correctly
- ❌ FAIL: Changes lost after reload OR DB not updated OR error
```

---

### Representative Scenarios - Group 2

#### UAT-CRM-002-UPDATE-001: Update Lead Status

**Module**: CRM  
**Screen**: Lead Detail (CRM-002)  
**Type**: UPDATE

**Preconditions**:
- Existing lead with status "NEW"
- User logged in as SALES_REP

**Steps**:
1. Navigate to `/crm/leads/[lead_id]`
2. Click "Edit"
3. Change status from "NEW" to "CONTACTED"
4. Add notes: "Đã gọi điện lần 1"
5. Click "Save"
6. Reload page (F5)

**Expected UI Result**:
- Success message: "Lead updated"
- Status badge shows "CONTACTED"
- Notes visible after reload
- Timeline shows status change event

**Expected DB Result**:
- `leads.status` = "CONTACTED"
- `leads.notes` updated
- `leads.updated_at` changed
- New interaction record created in `interactions` table with type "STATUS_CHANGE"

**Pass/Fail Criteria**:
- ✅ PASS: Status persisted, notes saved, interaction logged
- ❌ FAIL: Status reverted OR notes lost OR interaction not logged

---

#### UAT-SAL-002-UPDATE-001: Update Quotation Pricing

**Module**: Sales  
**Screen**: Quotation Detail (SAL-002)  
**Type**: UPDATE

**Preconditions**:
- Existing quotation with status "DRAFT"
- User logged in as SALES_REP

**Steps**:
1. Navigate to `/sales/quotations/[quote_id]`
2. Click "Edit"
3. Change discount from 20,000,000 to 30,000,000 VND
4. Add accessories: "Floor Mats" (5,000,000 VND)
5. Click "Save"
6. Reload page (F5)

**Expected UI Result**:
- Success message: "Quotation updated"
- Total price recalculated and displayed
- New accessories visible in list
- Discount updated

**Expected DB Result**:
- `quotations.discount` = 30000000
- `quotations.accessories` updated (JSON or separate table)
- `quotations.total_price` recalculated
- `quotations.updated_at` changed

**Pass/Fail Criteria**:
- ✅ PASS: Pricing updated, total recalculated correctly, changes persisted
- ❌ FAIL: Pricing reverted OR total wrong OR accessories lost

---

### Additional Group 2 Scenarios (55 more)

**All modules**: 1-2 update scenarios per screen with update capability (57 total)

---

## 📚 GROUP 3: FILE / ATTACHMENT (36 scenarios)

**Focus**: Verify file upload, storage, and retrieval

### Template Scenario Structure

```
Scenario ID: UAT-[MODULE]-[SCREEN]-FILE-[N]
Module: [Module Name]
Screen: [Screen Name]
Type: FILE UPLOAD

Preconditions:
- Existing record (if uploading to existing record)
- Test files prepared (PDF, JPG, PNG, DOCX)

Steps:
1. Navigate to [Screen]
2. Click "Upload" / "Attach File"
3. Select file(s): [file names]
4. Click "Upload"
5. Wait for upload completion
6. Reload page (F5)

Expected UI Result:
- Upload progress indicator
- Success message: "File uploaded"
- File(s) visible in attachment list
- Download link functional

Expected Storage Result:
- File(s) saved to storage (S3/local)
- File path/URL saved in DB
- File metadata saved (name, size, type, uploaded_by, uploaded_at)

Pass/Fail Criteria:
- ✅ PASS: File uploaded, visible after reload, downloadable
- ❌ FAIL: Upload failed OR file not visible OR download broken
```

---

### Representative Scenarios - Group 3

#### UAT-CRM-004-FILE-001: Upload Customer Documents

**Module**: CRM  
**Screen**: Customer Detail (CRM-004)  
**Type**: FILE UPLOAD

**Preconditions**:
- Existing customer record
- Test files: `CMND_front.jpg` (2MB), `CMND_back.jpg` (2MB)

**Steps**:
1. Navigate to `/crm/customers/[customer_id]`
2. Go to "Documents" tab
3. Click "Upload Document"
4. Select file type: "ID Card"
5. Select files: `CMND_front.jpg`, `CMND_back.jpg`
6. Click "Upload"
7. Wait for upload completion
8. Reload page (F5)

**Expected UI Result**:
- Upload progress bar (0% → 100%)
- Success message: "2 files uploaded"
- Files visible in Documents tab
- Thumbnails displayed for images
- Download buttons functional

**Expected Storage Result**:
- Files saved to `/uploads/customers/[customer_id]/`
- File paths saved in DB (JSON or separate table)
- Metadata: `{name, size, type, uploaded_by, uploaded_at}`

**Pass/Fail Criteria**:
- ✅ PASS: Both files uploaded, visible, downloadable
- ❌ FAIL: Upload failed OR files missing OR download broken

---

#### UAT-INS-003-FILE-001: Upload Claim Documents (Multiple Files)

**Module**: Insurance  
**Screen**: Claim Detail (INS-004)  
**Type**: FILE UPLOAD (Multiple)

**Preconditions**:
- Existing insurance claim with status "SUBMITTED"
- Test files: `accident_photo_1.jpg`, `accident_photo_2.jpg`, `accident_photo_3.jpg`, `police_report.pdf`

**Steps**:
1. Navigate to `/insurance/claims/[claim_id]`
2. Go to "Documents" tab
3. Click "Upload Documents"
4. Select multiple files (4 files)
5. Click "Upload All"
6. Wait for batch upload completion
7. Reload page (F5)

**Expected UI Result**:
- Batch upload progress (4 files)
- Success message: "4 files uploaded"
- All files visible in gallery view
- Image preview functional
- PDF download functional

**Expected Storage Result**:
- 4 files saved to `/uploads/insurance/claims/[claim_id]/`
- All file paths saved in DB
- Metadata for each file saved

**Pass/Fail Criteria**:
- ✅ PASS: All 4 files uploaded, visible, preview/download work
- ❌ FAIL: Any file missing OR preview broken OR download failed

---

### Additional Group 3 Scenarios (34 more)

**Screens with file upload** (18 screens × 2 scenarios each = 36 total):
- CRM: Customer documents
- Sales: Quotation attachments, Contract documents, VIN photos, PDS photos
- Service: RO attachments, Work log photos, QC photos
- Parts: Stock take photos
- Insurance: Contract documents, Claim documents
- Accounting: Invoice attachments, Payment receipts, Asset photos

---

## 📚 GROUP 4: STATUS / WORKFLOW (49 scenarios)

**Focus**: Verify status transitions persist correctly

### Template Scenario Structure

```
Scenario ID: UAT-[MODULE]-[SCREEN]-STATUS-[N]
Module: [Module Name]
Screen: [Screen Name]
Type: STATUS TRANSITION

Preconditions:
- Existing record with status [initial_status]
- User has permission for status change

Steps:
1. Navigate to [Screen]
2. Open record with status [initial_status]
3. Click "Change Status" / workflow button
4. Select new status: [new_status]
5. Fill in required fields (if any)
6. Click "Confirm"
7. Reload page (F5)

Expected UI Result:
- Success message: "Status updated to [new_status]"
- Status badge updated
- Workflow timeline shows transition
- Status-specific fields visible/hidden

Expected DB Result:
- `[table].status` = [new_status]
- `[table].updated_at` changed
- Status history logged (if tracked)
- Workflow-triggered actions executed (notifications, etc.)

Pass/Fail Criteria:
- ✅ PASS: Status persisted, timeline updated, actions triggered
- ❌ FAIL: Status reverted OR timeline missing OR actions not triggered
```

---

### Representative Scenarios - Group 4

#### UAT-CRM-001-STATUS-001: Lead Status Workflow

**Module**: CRM  
**Screen**: Lead List (CRM-001)  
**Type**: STATUS TRANSITION

**Workflow**: NEW → CONTACTED → QUALIFIED → CONVERTED

**Preconditions**:
- Lead with status "NEW"

**Steps**:
1. Navigate to `/crm/leads`
2. Select lead with status "NEW"
3. Click "Mark as Contacted"
4. Add interaction notes: "Gọi điện thành công"
5. Click "Save"
6. Reload page (F5)
7. Verify status = "CONTACTED"
8. Click "Mark as Qualified"
9. Fill in qualification criteria
10. Click "Save"
11. Reload page (F5)
12. Verify status = "QUALIFIED"

**Expected UI Result**:
- Status badge changes: NEW → CONTACTED → QUALIFIED
- Timeline shows all transitions
- Interaction records visible

**Expected DB Result**:
- `leads.status` = "QUALIFIED"
- All status transitions logged in `interactions` table
- Lead score updated based on qualification

**Pass/Fail Criteria**:
- ✅ PASS: All transitions persisted, timeline complete, score updated
- ❌ FAIL: Status reverted OR transitions missing OR score not updated

---

#### UAT-INS-003-STATUS-001: Claim Approval Workflow

**Module**: Insurance  
**Screen**: Claim Detail (INS-004)  
**Type**: STATUS TRANSITION

**Workflow**: SUBMITTED → REVIEWING → APPROVED → PAID

**Preconditions**:
- Claim with status "SUBMITTED"
- User logged in as MANAGER

**Steps**:
1. Navigate to `/insurance/claims/[claim_id]`
2. Click "Start Review"
3. Status changes to "REVIEWING"
4. Review claim details
5. Click "Approve"
6. Enter approved amount: 12,000,000 VND
7. Add reviewer notes: "Approved with deductible"
8. Click "Confirm Approval"
9. Reload page (F5)
10. Verify status = "APPROVED"

**Expected UI Result**:
- Status badge: SUBMITTED → REVIEWING → APPROVED
- Approved amount displayed
- Reviewer notes visible
- Email notification sent to customer

**Expected DB Result**:
- `insurance_claims.status` = "APPROVED"
- `insurance_claims.approved_amount` = 12000000
- `insurance_claims.reviewer_notes` saved
- `insurance_claims.reviewed_by` = current user ID
- `insurance_claims.reviewed_at` = current timestamp

**Pass/Fail Criteria**:
- ✅ PASS: Status persisted, approved amount saved, email sent
- ❌ FAIL: Status reverted OR amount lost OR email not sent

---

### Additional Group 4 Scenarios (47 more)

**All modules with workflow** (49 total scenarios covering all status transitions)

---

## 📚 GROUP 5: VALIDATION & ERROR (58 scenarios)

**Focus**: Verify validation rules and error handling

### Template Scenario Structure

```
Scenario ID: UAT-[MODULE]-[SCREEN]-VAL-[N]
Module: [Module Name]
Screen: [Screen Name]
Type: VALIDATION

Preconditions:
- User logged in

Steps:
1. Navigate to [Screen]
2. Click "Create" / "Edit"
3. [Trigger validation error - see specific scenario]
4. Click "Save"

Expected UI Result:
- Validation error message displayed
- Field highlighted in red
- Form NOT submitted
- User can correct and retry

Expected DB Result:
- NO record created/updated
- DB state unchanged

Pass/Fail Criteria:
- ✅ PASS: Error displayed, form not submitted, DB unchanged
- ❌ FAIL: Form submitted with invalid data OR no error shown
```

---

### Representative Scenarios - Group 5

#### UAT-CRM-001-VAL-001: Lead - Missing Required Fields

**Module**: CRM  
**Screen**: Lead List (CRM-001)  
**Type**: VALIDATION

**Steps**:
1. Navigate to `/crm/leads`
2. Click "Create New Lead"
3. Leave "Name" field empty
4. Fill in "Phone": "0901234567"
5. Click "Save"

**Expected UI Result**:
- Error message: "Name is required"
- "Name" field highlighted in red
- Form NOT submitted
- User remains on form

**Expected DB Result**:
- NO new record in `leads` table

**Pass/Fail Criteria**:
- ✅ PASS: Error shown, form not submitted, DB unchanged
- ❌ FAIL: Form submitted OR no error OR record created

---

#### UAT-SAL-001-VAL-001: Quotation - Invalid Price

**Module**: Sales  
**Screen**: Quotation List (SAL-001)  
**Type**: VALIDATION

**Steps**:
1. Navigate to `/sales/quotations`
2. Click "Create Quotation"
3. Fill in all required fields
4. Enter "Base Price": -1000000 (negative number)
5. Click "Save"

**Expected UI Result**:
- Error message: "Price must be greater than 0"
- "Base Price" field highlighted in red
- Form NOT submitted

**Expected DB Result**:
- NO new record in `quotations` table

**Pass/Fail Criteria**:
- ✅ PASS: Error shown, form not submitted
- ❌ FAIL: Negative price accepted

---

#### UAT-INS-003-VAL-001: Claim - Invalid File Type

**Module**: Insurance  
**Screen**: Claim Detail (INS-004)  
**Type**: VALIDATION (File Upload)

**Steps**:
1. Navigate to `/insurance/claims/[claim_id]`
2. Click "Upload Document"
3. Select file: `malware.exe` (invalid type)
4. Click "Upload"

**Expected UI Result**:
- Error message: "Invalid file type. Allowed: JPG, PNG, PDF"
- File NOT uploaded
- Upload button remains active

**Expected Storage Result**:
- NO file saved to storage
- NO file path in DB

**Pass/Fail Criteria**:
- ✅ PASS: Error shown, file rejected, storage unchanged
- ❌ FAIL: File uploaded OR no error

---

### Additional Group 5 Scenarios (55 more)

**Validation types** (58 total):
- Required field validation (20 scenarios)
- Data type validation (15 scenarios)
- Range validation (10 scenarios)
- File type/size validation (8 scenarios)
- API error handling (5 scenarios)

---

## 📊 UAT Execution Plan

### Phase 1: Critical Path (Weeks 1-2)
- Group 1: Create & Save (70 scenarios)
- Group 2: Update & Persist (57 scenarios)
- **Total**: 127 scenarios, ~40 hours

### Phase 2: File Operations (Week 3)
- Group 3: File / Attachment (36 scenarios)
- **Total**: 36 scenarios, ~12 hours

### Phase 3: Workflows (Week 4)
- Group 4: Status / Workflow (49 scenarios)
- **Total**: 49 scenarios, ~16 hours

### Phase 4: Validation (Week 5)
- Group 5: Validation & Error (58 scenarios)
- **Total**: 58 scenarios, ~18 hours

### Total Effort
- **211 scenarios**
- **~86 hours** (estimated)
- **5 weeks** (with buffer)

---

## ✅ UAT Execution Checklist

### Pre-Execution
- [ ] Test environment ready
- [ ] Test data prepared
- [ ] Test files prepared (images, PDFs, etc.)
- [ ] All test users created with appropriate roles
- [ ] Database backup taken

### During Execution
- [ ] Execute scenarios in order (Group 1 → 5)
- [ ] Log all PASS/FAIL results
- [ ] Capture screenshots for failures
- [ ] Report blockers immediately

### Post-Execution
- [ ] Compile UAT results report
- [ ] Log all bugs found
- [ ] Calculate pass rate
- [ ] Recommend go/no-go decision

---

## 📝 UAT Result Template

```
Scenario ID: UAT-XXX-XXX-XXX-XXX
Execution Date: YYYY-MM-DD
Executed By: [Name]
Result: PASS / FAIL
Notes: [Any observations]
Screenshots: [Links if FAIL]
Bug ID: [If FAIL]
```

---

**Maintained By**: Antigravity (System UAT Authority)  
**Last Updated**: 2026-01-29  
**Next Review**: After UAT execution

---

**End of UAT Plan Full System v1.0**
