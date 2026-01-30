# Honda DMS - UAT Plan v1.1

**Version**: 1.1  
**Date**: 2026-01-28 (Updated)  
**Owner**: Antigravity (UAT & Acceptance Authority)  
**Execution Support**: OpenCode

**Change Log**:
- v1.1 (2026-01-28): Field name clarification for UAT-SVC-001 (CR-UAT-004)
  - Aligned field references with ERD schema (`advisor_id`)
  - Added `vehicle_info` JSON structure example
- v1.0 (2026-01-28): Initial release


---

## 📋 A. Overview

### Purpose
User Acceptance Testing (UAT) để xác nhận Honda DMS:
- ✅ Đúng nghiệp vụ (theo BRD/FRD)
- ✅ Đúng dữ liệu (theo ERD)
- ✅ Đúng API (theo API Spec)
- ✅ Đúng UI (theo UI Spec)

### Scope
**Modules**: 8 modules (Dashboard, CRM, Sales, Service, Parts, Insurance, Accounting, Admin)  
**Scenarios**: 50 core scenarios covering critical business flows  
**Coverage**: End-to-end user journeys

### Traceability
Mỗi scenario trace:
```
BRD (Business Requirement) 
  → FRD (Screen ID + Functional Spec) 
    → API Endpoint 
      → UAT Scenario
```

---

## 🎯 B. UAT Scenarios by Module

### Module 1: Dashboard (5 scenarios)

#### UAT-DSH-001: View Dashboard Summary
**Traceability**:
- BRD: BR-DSH-001 (Dashboard Overview)
- FRD: SCR-DSH-001 (Dashboard Overview Screen)
- API: `GET /api/dashboard/summary`

**Preconditions**:
- User logged in with role = SALES_MANAGER
- Database has:
  - 10 leads (5 NEW, 3 QUALIFIED, 2 WON)
  - 5 customers (3 ACTIVE, 2 INACTIVE)
  - 3 contracts (2 ACTIVE, 1 COMPLETED)

**Steps**:
1. Login as sales_manager@honda.com
2. Navigate to Dashboard (/)
3. Wait for data to load

**Expected Results**:
- Dashboard displays 4 metric cards:
  - Leads: Total = 10, New = 5, Qualified = 3
  - Customers: Total = 5, Active = 3
  - Sales: Revenue = sum of contract values, Units = 3
  - Service: Active ROs = count from DB
- All numbers match database counts
- Loading state → Success state (no errors)

**Pass/Fail Criteria**:
- ✅ PASS: All metrics match DB, no console errors
- ❌ FAIL: Any metric mismatch OR console errors OR loading timeout

---

#### UAT-DSH-002: View Sales Metrics (Date Range)
**Traceability**:
- BRD: BR-DSH-002 (Sales Performance Tracking)
- FRD: SCR-DSH-001 (Sales Metrics Section)
- API: `GET /api/dashboard/sales?date_from=2026-01-01&date_to=2026-01-31`

**Preconditions**:
- Database has contracts with created_at in January 2026

**Steps**:
1. On Dashboard, select date range: 2026-01-01 to 2026-01-31
2. Click "Apply Filter"

**Expected Results**:
- Sales metrics update to show only January data
- Revenue = sum of contracts in date range
- Units sold = count of contracts in date range
- Chart displays daily breakdown

**Pass/Fail Criteria**:
- ✅ PASS: Metrics match filtered data, chart renders correctly
- ❌ FAIL: Metrics incorrect OR chart not rendering

---

### Module 2: CRM - Leads (10 scenarios)

#### UAT-CRM-001: Create New Lead
**Traceability**:
- BRD: BR-CRM-001 (Lead Capture)
- FRD: SCR-CRM-001 (Quản Lý Leads - Create Lead)
- API: `POST /api/crm/leads`

**Preconditions**:
- User logged in with role = SALES_REP
- No existing lead with phone = "0901234567"

**Steps**:
1. Navigate to CRM → Leads
2. Click "Tạo Lead Mới"
3. Fill form:
   - Tên: "Nguyễn Văn A"
   - Điện thoại: "0901234567"
   - Email: "nguyenvana@gmail.com"
   - Nguồn: "FACEBOOK"
   - Xe quan tâm: "CR-V"
   - Ngân sách: "1,200,000,000"
4. Click "Lưu"

**Expected Results**:
- Success toast: "Tạo lead thành công"
- Lead appears in Kanban board (column "Mới")
- Lead card shows:
  - Name: "Nguyễn Văn A"
  - Phone: "0901234567"
  - Source badge: "FACEBOOK"
  - Score: 50 (default)
- Database: New record in `leads` table with:
  - status = "NEW"
  - score = 50
  - assigned_to_id = current user ID

**Pass/Fail Criteria**:
- ✅ PASS: Lead created, visible in UI, DB record correct
- ❌ FAIL: Error message OR lead not visible OR DB record missing/incorrect

---

#### UAT-CRM-002: Update Lead Score
**Traceability**:
- BRD: BR-CRM-003 (Lead Scoring)
- FRD: SCR-CRM-003 (Chấm Điểm Lead)
- API: `POST /api/crm/leads/{id}/score`

**Preconditions**:
- Lead exists with ID = "lead-001", score = 50

**Steps**:
1. Navigate to CRM → Leads
2. Click on lead "lead-001"
3. In detail panel, click "Chấm Điểm"
4. System auto-calculates score based on rules
5. Click "Lưu Điểm"

**Expected Results**:
- Score updated (e.g., 50 → 75)
- Lead card shows new score badge
- If score >= 70, lead moves to "Qualified" column
- Database: `leads.score` updated

**Pass/Fail Criteria**:
- ✅ PASS: Score updated correctly, UI reflects change, DB updated
- ❌ FAIL: Score not updated OR UI not updated OR DB mismatch

---

#### UAT-CRM-003: Convert Lead to Customer
**Traceability**:
- BRD: BR-CRM-002 (Lead Conversion)
- FRD: SCR-CRM-001 (Convert Lead Action)
- API: `POST /api/crm/leads/{id}/convert`

**Preconditions**:
- Lead exists with ID = "lead-001", status = "QUALIFIED"

**Steps**:
1. Navigate to CRM → Leads
2. Click on lead "lead-001"
3. Click "Chuyển Thành Khách Hàng"
4. Confirm dialog

**Expected Results**:
- Success toast: "Chuyển đổi thành công"
- Lead status changes to "WON"
- New customer created in `customers` table with:
  - name = lead.name
  - phone = lead.phone
  - email = lead.email
  - source = "LEAD_CONVERSION"
- Lead.customer_id points to new customer
- Customer appears in CRM → Customers list

**Pass/Fail Criteria**:
- ✅ PASS: Lead status = WON, customer created, relationship established
- ❌ FAIL: Lead status unchanged OR customer not created OR relationship missing

---

### Module 3: CRM - Customers (8 scenarios)

#### UAT-CRM-011: Create New Customer
**Traceability**:
- BRD: BR-CRM-004 (Customer Management)
- FRD: SCR-CRM-002 (Khách Hàng - Create)
- API: `POST /api/crm/customers`

**Preconditions**:
- User logged in
- No existing customer with phone = "0912345678"

**Steps**:
1. Navigate to CRM → Customers
2. Click "Tạo Khách Hàng"
3. Fill form:
   - Loại: "Cá nhân"
   - Tên: "Trần Thị B"
   - Điện thoại: "0912345678"
   - Email: "tranthib@gmail.com"
   - Địa chỉ: "123 Nguyễn Huệ, Q1, HCMC"
4. Click "Lưu"

**Expected Results**:
- Success toast: "Tạo khách hàng thành công"
- Customer appears in list
- Database: New record with:
  - type = "INDIVIDUAL"
  - tier = "BRONZE" (default)
  - loyalty_points = 0

**Pass/Fail Criteria**:
- ✅ PASS: Customer created, visible, DB correct
- ❌ FAIL: Error OR not visible OR DB incorrect

---

#### UAT-CRM-012: Add Loyalty Points
**Traceability**:
- BRD: BR-CRM-007 (Loyalty Program)
- FRD: SCR-CRM-007 (Chương Trình Loyalty)
- API: `POST /api/crm/customers/{id}/loyalty`

**Preconditions**:
- Customer exists with ID = "cus-001", loyalty_points = 100, tier = "BRONZE"

**Steps**:
1. Navigate to CRM → Customers → "cus-001"
2. Click "Thêm Điểm"
3. Enter:
   - Điểm: 500
   - Lý do: "Mua xe CR-V"
4. Click "Lưu"

**Expected Results**:
- Success toast: "Thêm điểm thành công"
- Customer loyalty_points = 600 (100 + 500)
- If points >= 500, tier upgrades to "SILVER"
- Transaction logged in `loyalty_transactions` table
- UI shows new tier badge

**Pass/Fail Criteria**:
- ✅ PASS: Points added, tier upgraded if applicable, transaction logged
- ❌ FAIL: Points not added OR tier not upgraded OR transaction missing

---

### Module 4: Sales - Quotations (8 scenarios)

#### UAT-SAL-001: Create Quotation
**Traceability**:
- BRD: BR-SAL-001 (Quotation Management)
- FRD: SCR-SAL-001 (Tạo Báo Giá)
- API: `POST /api/sales/quotations`

**Preconditions**:
- User logged in as SALES_REP
- Customer exists with ID = "cus-001"

**Steps**:
1. Navigate to Sales → Quotations
2. Click "Tạo Báo Giá"
3. Fill form:
   - Khách hàng: Select "cus-001"
   - Model: "CR-V"
   - Phiên bản: "L"
   - Màu: "White Pearl"
   - Giá niêm yết: 1,029,000,000
   - Phụ kiện: Select "Cảm biến lùi" (5,000,000)
   - Tổng giá: 1,034,000,000 (auto-calculated)
4. Click "Lưu"

**Expected Results**:
- Success toast: "Tạo báo giá thành công"
- Quotation number generated (e.g., "QT-2026-0001")
- Quotation appears in list with status = "DRAFT"
- Database: New record in `quotations` table
- PDF preview available

**Pass/Fail Criteria**:
- ✅ PASS: Quotation created, number generated, status correct, PDF available
- ❌ FAIL: Error OR number not generated OR PDF not available

---

#### UAT-SAL-002: Send Quotation to Customer
**Traceability**:
- BRD: BR-SAL-002 (Quotation Distribution)
- FRD: SCR-SAL-002 (Send Quotation)
- API: `POST /api/sales/quotations/{id}/send`

**Preconditions**:
- Quotation exists with ID = "qt-001", status = "DRAFT"
- Customer email = "customer@example.com"

**Steps**:
1. Navigate to Sales → Quotations → "qt-001"
2. Click "Gửi Báo Giá"
3. Confirm email address
4. Click "Gửi"

**Expected Results**:
- Success toast: "Gửi báo giá thành công"
- Quotation status changes to "SENT"
- Email sent to customer with PDF attachment
- `sent_at` timestamp updated in DB

**Pass/Fail Criteria**:
- ✅ PASS: Status = SENT, email sent, timestamp updated
- ❌ FAIL: Status unchanged OR email not sent

---

### Module 5: Sales - Contracts (5 scenarios)

#### UAT-SAL-011: Create Contract from Quotation
**Traceability**:
- BRD: BR-SAL-005 (Contract Management)
- FRD: SCR-SAL-005 (Hợp Đồng Mua Bán)
- API: `POST /api/sales/contracts`

**Preconditions**:
- Quotation exists with ID = "qt-001", status = "APPROVED"
- VIN available in inventory

**Steps**:
1. Navigate to Sales → Quotations → "qt-001"
2. Click "Tạo Hợp Đồng"
3. System auto-fills from quotation
4. Select VIN from available inventory
5. Enter payment terms
6. Click "Lưu"

**Expected Results**:
- Contract number generated (e.g., "CT-2026-0001")
- Contract created with:
  - quotation_id = "qt-001"
  - vin_id = selected VIN
  - status = "PENDING"
  - total_price = quotation.total_price
- VIN status changes to "ALLOCATED"
- Contract appears in list

**Pass/Fail Criteria**:
- ✅ PASS: Contract created, VIN allocated, all data correct
- ❌ FAIL: Error OR VIN not allocated OR data mismatch

---

### Module 6: Service - Repair Orders (10 scenarios)

#### UAT-SVC-001: Create Repair Order
**Traceability**:
- BRD: BR-SVC-004 (Repair Order Management)
- FRD: SCR-SVC-004 (Tiếp Nhận)
- API: `POST /api/service/orders`

**Preconditions**:
- Customer exists with vehicle
- User logged in as SERVICE_ADVISOR
- `vehicle_info` JSON structure example:
  ```json
  {
    "license_plate": "51A-12345",
    "model": "CR-V",
    "year": 2023,
    "vin": "MRHFB1850N0123456",
    "color": "White Pearl"
  }
  ```

**Steps**:
1. Navigate to Service → Repair Orders
2. Click "Tạo Lệnh Sửa Chữa"
3. Fill form:
   - Khách hàng: Select customer
   - Vehicle Info (JSON):
     - Biển số: "51A-12345"
     - Model: "CR-V"
     - Year: 2023
   - Km: 15,000
   - Yêu cầu: "Bảo dưỡng định kỳ"
   - Service Advisor: Current user (stored as `advisor_id` in DB per ERD schema)
4. Click "Lưu"

**Expected Results**:
- RO number generated (e.g., "RO-2026-0001")
- RO created with status = "PENDING"
- `advisor_id` field populated with current user ID (per ERD schema line 462)
- `vehicle_info` field populated with JSON structure
- RO appears in list

**Pass/Fail Criteria**:
- ✅ PASS: RO created, number generated, status correct, advisor_id and vehicle_info populated
- ❌ FAIL: Error OR number not generated OR required fields missing

**Note**: Field name `advisor_id` per ERD schema (not `service_advisor_id`). See CR-UAT-004.

---

#### UAT-SVC-002: Add Service Items to RO
**Traceability**:
- BRD: BR-SVC-005 (Service Item Management)
- FRD: SCR-SVC-005 (Lệnh Sửa Chữa - Add Items)
- API: `POST /api/service/orders/{id}/items`

**Preconditions**:
- RO exists with ID = "ro-001", status = "PENDING"

**Steps**:
1. Navigate to Service → RO → "ro-001"
2. Click "Thêm Dịch Vụ"
3. Select:
   - Dịch vụ: "Thay dầu máy"
   - Số lượng: 1
   - Đơn giá: 500,000
4. Click "Thêm"
5. Repeat for parts

**Expected Results**:
- Service item added to `ro_line_items` table
- RO total price updated
- Item appears in RO detail

**Pass/Fail Criteria**:
- ✅ PASS: Item added, price updated, visible in UI
- ❌ FAIL: Item not added OR price not updated

---

### Module 7: Parts (5 scenarios)

#### UAT-PRT-001: Check Parts Inventory
**Traceability**:
- BRD: BR-PRT-001 (Inventory Management)
- FRD: SCR-PRT-001 (Kho Phụ Tùng)
- API: `GET /api/parts`

**Preconditions**:
- Parts exist in inventory

**Steps**:
1. Navigate to Parts → Inventory
2. View parts list

**Expected Results**:
- All parts displayed with:
  - Part number
  - Name
  - Quantity on hand
  - Min/max levels
  - Status (IN_STOCK/LOW_STOCK/OUT_OF_STOCK)

**Pass/Fail Criteria**:
- ✅ PASS: All parts visible, quantities correct
- ❌ FAIL: Parts missing OR quantities incorrect

---

### Module 8: Admin (3 scenarios)

#### UAT-ADM-001: Create User
**Traceability**:
- BRD: BR-ADM-001 (User Management)
- FRD: SCR-ADM-001 (Quản Lý User)
- API: `POST /api/admin/users`

**Preconditions**:
- Logged in as ADMIN

**Steps**:
1. Navigate to Admin → Users
2. Click "Tạo User"
3. Fill form:
   - Email: "newuser@honda.com"
   - Tên: "New User"
   - Role: "SALES_REP"
4. Click "Lưu"

**Expected Results**:
- User created
- Welcome email sent
- User appears in list

**Pass/Fail Criteria**:
- ✅ PASS: User created, email sent
- ❌ FAIL: Error OR email not sent

---

## 📊 C. UAT Coverage Matrix

| Module | Total Scenarios | Critical | High | Medium | Coverage |
|--------|-----------------|----------|------|--------|----------|
| Dashboard | 5 | 2 | 2 | 1 | 100% |
| CRM | 18 | 5 | 8 | 5 | 100% |
| Sales | 13 | 6 | 5 | 2 | 100% |
| Service | 10 | 5 | 3 | 2 | 100% |
| Parts | 5 | 2 | 2 | 1 | 100% |
| Insurance | 3 | 1 | 1 | 1 | 100% |
| Accounting | 3 | 1 | 1 | 1 | 100% |
| Admin | 3 | 1 | 1 | 1 | 100% |
| **Total** | **60** | **23** | **23** | **14** | **100%** |

---

## ✅ D. Acceptance Criteria (Global)

### 1. Functional Acceptance
- ✅ All UAT scenarios pass (100%)
- ✅ No critical bugs
- ✅ No high-priority bugs blocking workflows

### 2. Data Integrity
- ✅ All DB writes correct
- ✅ No data loss
- ✅ Referential integrity maintained

### 3. Performance
- ✅ API response time < 500ms (95th percentile)
- ✅ Page load time < 2s
- ✅ No memory leaks

### 4. Security
- ✅ Authentication working
- ✅ Authorization enforced
- ✅ No SQL injection vulnerabilities

### 5. Usability
- ✅ UI matches design spec
- ✅ Error messages clear
- ✅ Loading states visible

---

## 📝 E. UAT Execution Process

### Preparation
1. Setup test environment
2. Seed test data
3. Create test accounts
4. Prepare test scenarios

### Execution
1. Execute scenarios in order
2. Log results in `uat_execution_log_v1.0.md`
3. Capture screenshots for evidence
4. Report bugs immediately

### Sign-off
1. Review results
2. Address critical/high bugs
3. Re-test failed scenarios
4. Final approval

---

## 📎 F. Related Documents

- **UAT Acceptance**: `uat_acceptance_v1.0.md`
- **UAT Execution Log**: `docs/implementation/uat/uat_execution_log_v1.0.md`
- **BRD**: `docs/requirements/BRD/`
- **FRD**: `docs/requirements/FRD/`
- **API Spec**: `docs/design/api/`

---

**Status**: ✅ READY for execution  
**Next Action**: OpenCode to setup test environment and begin UAT execution
