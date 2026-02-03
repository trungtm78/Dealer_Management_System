# Honda DMS - ERD Description v1.0

**Version**: 1.0  
**Date**: 2026-01-28  
**Author**: Antigravity - Data Design Authority  
**Database**: PostgreSQL (Production) / SQLite (Demo)

---

## 📋 Document Overview

Tài liệu này mô tả Entity Relationship Diagram (ERD) cho Honda Dealer Management System. ERD này là **nguồn sự thật DUY NHẤT** cho cấu trúc dữ liệu. Frontend và Backend **PHẢI** triển khai STRICTLY theo ERD này.

---

## 📊 Entity Summary

### Tổng Quan

| Metric | Value |
|--------|-------|
| **Total Tables** | 49 |
| **Master Data Tables** | 10 |
| **Transaction Tables** | 36 |
| **Reference/Lookup Tables** | 3 |
| **Total Relationships** | 52 |

### Phân Loại Theo Module

| Module | Tables | Master | Transaction |
|--------|--------|--------|-------------|
| **Admin** | 3 | 1 | 2 |
| **CRM** | 8 | 2 | 6 |
| **Sales** | 7 | 1 | 6 |
| **Service** | 7 | 0 | 7 |
| **Parts** | 9 | 2 | 7 |
| **Insurance** | 2 | 0 | 2 |
| **Accounting** | 7 | 1 | 6 |
| **Supporting** | 6 | 3 | 0 |

---

## 🗂️ Entity Classification

### MASTER DATA (10 tables)
Master data là dữ liệu **tham chiếu**, ít thay đổi, được sử dụng bởi nhiều transaction.

| # | Table | Purpose | Update Frequency |
|---|-------|---------|------------------|
| 1 | `users` | Người dùng hệ thống | Low - chỉ khi thêm/xóa user |
| 2 | `customers` | Khách hàng chính thức | Medium - khi có KH mới |
| 3 | `scoring_rules` | Quy tắc chấm điểm lead | Low - config |
| 4 | `parts` | Phụ tùng | Medium - quantity update qua stock_movements |
| 5 | `suppliers` | Nhà cung cấp | Low |
| 6 | `vins` | VIN inventory | Medium - status update |
| 7 | `fixed_assets` | Tài sản cố định | Low |
| 8 | `vehicle_models` | Danh mục model xe | Low - config |
| 9 | `accessories` | Danh mục phụ kiện | Low - config |
| 10 | `services_catalog` | Danh mục dịch vụ | Low - config |

### TRANSACTION DATA (36 tables)
Transaction data là dữ liệu **nghiệp vụ**, thay đổi thường xuyên, ghi lại các hoạt động kinh doanh.

#### Module: Admin (2)
- `activity_logs` - Audit log (append-only)
- `system_metrics` - System monitoring

#### Module: CRM (6)
- `leads` - Khách hàng tiềm năng
- `interactions` - Lịch sử tương tác
- `reminders` - Nhắc nhở
- `loyalty_transactions` - Lịch sử điểm
- `complaints` - Khiếu nại
- `marketing_campaigns` - Chiến dịch marketing

#### Module: Sales (6)
- `quotations` - Báo giá
- `test_drives` - Lái thử
- `contracts` - Hợp đồng mua xe
- `deposits` - Đặt cọc
- `pds_checklists` - Pre-Delivery Service

#### Module: Service (7)
- `service_quotes` - Báo giá dịch vụ
- `service_appointments` - Lịch hẹn
- `repair_orders` - Lệnh sửa chữa
- `ro_line_items` - Chi tiết RO
- `work_logs` - Nhật ký KTV
- `qc_checklists` - Kiểm tra chất lượng

#### Module: Parts (7)
- `stock_movements` - Nhập xuất kho (append-only)
- `purchase_orders` - Đơn mua hàng
- `po_line_items` - Chi tiết PO
- `stock_takes` - Phiên kiểm kê
- `stock_take_items` - Chi tiết kiểm kê

#### Module: Insurance (2)
- `insurance_contracts` - Hợp đồng bảo hiểm
- `insurance_claims` - Bồi thường

#### Module: Accounting (6)
- `invoices` - Hóa đơn
- `payments` - Thanh toán
- `transactions` - Giao dịch kế toán
- `depreciation_schedules` - Lịch khấu hao
- `tax_declarations` - Khai báo thuế

---

## 🔗 Key Relationships

### Core Business Flow

```
Lead → Customer → Quotation → Contract → VIN → PDS → Delivery
  ↓        ↓          ↓
Interaction  TestDrive  Deposit
```

### Service Flow

```
Customer → ServiceAppointment → RepairOrder → ROLineItem
                                      ↓
                                  WorkLog → QCChecklist
```

### Parts Flow

```
Supplier → PurchaseOrder → POLineItem → StockMovement → Part
                                              ↓
                                         RepairOrder (consumption)
```

### Accounting Flow

```
Contract/RepairOrder → Invoice → Payment → Transaction
```

---

## 📋 Relationship Details

### 1:1 Relationships (One-to-One)

| Parent | Child | Description |
|--------|-------|-------------|
| `quotations` | `contracts` | Approved quotation → Contract |
| `service_appointments` | `repair_orders` | Appointment → RO |
| `contracts` | `pds_checklists` | Contract → PDS |
| `contracts` | `vins` | Contract → VIN allocation |

### 1:N Relationships (One-to-Many)

| Parent | Child | Description |
|--------|-------|-------------|
| `users` | `leads` | User assigns leads |
| `users` | `quotations` | User creates quotations |
| `users` | `activity_logs` | User creates logs |
| `customers` | `leads` | Lead converts to customer |
| `customers` | `quotations` | Customer receives quotes |
| `customers` | `test_drives` | Customer books test drives |
| `customers` | `contracts` | Customer signs contracts |
| `customers` | `deposits` | Customer makes deposits |
| `customers` | `service_appointments` | Customer books appointments |
| `customers` | `repair_orders` | Customer has ROs |
| `customers` | `insurance_contracts` | Customer holds insurance |
| `customers` | `invoices` | Customer receives invoices |
| `customers` | `complaints` | Customer files complaints |
| `leads` | `interactions` | Lead has interactions |
| `repair_orders` | `ro_line_items` | RO has line items |
| `repair_orders` | `work_logs` | RO has work logs |
| `repair_orders` | `qc_checklists` | RO has QC checks |
| `parts` | `stock_movements` | Part has movements |
| `purchase_orders` | `po_line_items` | PO has line items |
| `suppliers` | `purchase_orders` | Supplier receives POs |
| `suppliers` | `parts` | Supplier supplies parts |
| `invoices` | `payments` | Invoice receives payments |
| `insurance_contracts` | `insurance_claims` | Contract has claims |
| `fixed_assets` | `depreciation_schedules` | Asset has depreciation |

### N:M Relationships (Many-to-Many)
*Implemented via junction tables or JSON fields*

| Entity A | Entity B | Implementation |
|----------|----------|----------------|
| `quotations` | `accessories` | JSON field in quotations |
| `quotations` | `services_catalog` | JSON field in quotations |
| `service_quotes` | `services_catalog` | JSON field in service_quotes |
| `service_quotes` | `parts` | JSON field in service_quotes |

---

## 🔐 Data Constraints

### UNIQUE Constraints

| Table | Column(s) | Purpose |
|-------|-----------|---------|
| `users` | `email` | Prevent duplicate accounts |
| `customers` | `phone` | Prevent duplicate customers |
| `leads` | - | No unique (can have duplicate phones) |
| `quotations` | `quote_number` | Business key |
| `contracts` | `contract_number` | Business key |
| `deposits` | `receipt_number` | Business key |
| `vins` | `vin_number` | Physical constraint |
| `parts` | `part_number` | Business key |
| `invoices` | `invoice_number` | Business key |
| `repair_orders` | `ro_number` | Business key |

### NOT NULL Constraints

**Critical Fields** (must always have value):
- All `id` (primary keys)
- All `created_at`, `updated_at` timestamps
- Business identifiers (quote_number, contract_number, etc.)
- Customer/User references in transactions
- Status fields
- Amount fields in financial transactions

### DEFAULT Values

| Field Pattern | Default | Rationale |
|---------------|---------|-----------|
| `status` | First enum value | Initial state |
| `created_at` | `now()` | Auto-timestamp |
| `updated_at` | `now()` | Auto-timestamp |
| `points` | 0 | No points initially |
| `quantity` | 0 | No stock initially |
| `score` | 10 | Default lead score |

---

## 📊 Indexes Strategy

### Primary Indexes (Auto-created)
- All `id` fields (Primary Key)

### Business Key Indexes
```sql
-- Unique business identifiers
idx_quotations_number ON quotations(quote_number)
idx_ro_number ON repair_orders(ro_number)
idx_invoices_number ON invoices(invoice_number)
idx_vins_number ON vins(vin_number)
idx_parts_number ON parts(part_number)
idx_customers_phone ON customers(phone)
```

### Foreign Key Indexes
```sql
-- Improve join performance
idx_leads_assigned ON leads(assigned_to_id)
idx_leads_customer ON leads(customer_id)
idx_stock_movements_part ON stock_movements(part_id)
```

### Status Indexes
```sql
-- Improve filtering performance
idx_leads_status ON leads(status)
idx_quotations_status ON quotations(status)
idx_ro_status ON repair_orders(status)
idx_invoices_status ON invoices(status)
idx_vins_status ON vins(status)
```

### Date Indexes
```sql
-- Improve date range queries
idx_stock_movements_date ON stock_movements(created_at)
```

---

## 🔄 Data Lifecycle & Status Transitions

### Lead Lifecycle
```
NEW → CONTACTED → QUALIFIED → PROPOSAL → NEGOTIATION → WON/DEAD
```

### Quotation Lifecycle
```
DRAFT → SENT → APPROVED → CONTRACT
                    ↓
                  LOST/EXPIRED
```

### Repair Order Lifecycle
```
PENDING → IN_PROGRESS → QC → READY → DELIVERED
```

### Invoice Lifecycle
```
UNPAID → PARTIAL → PAID
```

### VIN Lifecycle
```
AVAILABLE → ALLOCATED → SOLD
```

---

## 🚫 Data Rules & Constraints

### Business Rules Enforced by Database

| Rule ID | Table | Constraint | Enforcement |
|---------|-------|------------|-------------|
| BR-001 | `customers` | Phone UNIQUE | Database constraint |
| BR-002 | `users` | Email UNIQUE | Database constraint |
| BR-003 | `vins` | VIN UNIQUE | Database constraint |
| BR-004 | `activity_logs` | Append-only | No DELETE permission |
| BR-005 | `stock_movements` | Append-only | No DELETE permission |
| BR-006 | `leads` | Must have assigned_to_id | Application logic |
| BR-007 | `quotations` | valid_until ≥ created_at | Application logic |
| BR-008 | `deposits` | amount > 0 | Application logic |
| BR-009 | `parts` | quantity ≥ 0 | Application logic |
| BR-010 | `invoices` | paid_amount ≤ total_amount | Application logic |

### Soft Delete vs Hard Delete

**Soft Delete** (status = INACTIVE):
- `users`
- `customers`
- `parts`
- `suppliers`
- `vehicle_models`
- `accessories`
- `services_catalog`

**Hard Delete** (physical deletion):
- None - All transaction data is retained for audit

**Append-Only** (no UPDATE/DELETE):
- `activity_logs`
- `stock_movements`
- `transactions`

---

## 📝 JSON Fields Documentation

### Why JSON?

JSON fields được sử dụng cho:
1. **Flexibility**: Dữ liệu có cấu trúc thay đổi
2. **Performance**: Tránh tạo nhiều bảng junction
3. **Simplicity**: Giảm complexity của schema

### JSON Fields by Table

| Table | Field | Structure | Example |
|-------|-------|-----------|---------|
| `customers` | `tags` | `string[]` | `["VIP", "Loyal"]` |
| `quotations` | `accessories` | `{code, name, price}[]` | `[{code:"ACC001", name:"Floor Mat", price:500000}]` |
| `quotations` | `services` | `{code, name, price}[]` | `[{code:"SVC001", name:"Coating", price:5000000}]` |
| `service_quotes` | `vehicle_info` | `{model, plateNumber, vin, mileage}` | `{model:"CR-V", plateNumber:"29A-12345", ...}` |
| `service_quotes` | `services` | `{code, name, hours, rate}[]` | - |
| `service_quotes` | `parts` | `{code, name, qty, price}[]` | - |
| `repair_orders` | `vehicle_info` | `{model, plateNumber, vin, mileage}` | - |
| `pds_checklists` | `exterior_check` | `{item, status}[]` | - |
| `pds_checklists` | `photos` | `string[]` | `["/uploads/pds/123.jpg", ...]` |
| `work_logs` | `photos` | `string[]` | - |
| `qc_checklists` | `checklist_items` | `{item, status}[]` | - |
| `interactions` | `metadata` | `object` | Flexible structure |
| `scoring_rules` | `condition` | `object` | Rule engine conditions |
| `marketing_campaigns` | `target_segment` | `object` | Segmentation criteria |

---

## 🎯 Mapping với FRD Screens

### Module 1: Dashboard
**Screen**: Dashboard Điều Hành

**Tables Used** (Read-only):
- `leads` - Count new leads
- `customers` - Count total customers
- `quotations` - Revenue calculation
- `test_drives` - Count appointments
- `repair_orders` - Service metrics

---

### Module 2: CRM

#### SCR-CRM-001: Quản Lý Leads
**Tables**: `leads`, `users`, `customers`  
**Operations**: SELECT, CREATE, UPDATE, DELETE (soft)

#### SCR-CRM-002: Quản Lý Khách Hàng
**Tables**: `customers`, `loyalty_transactions`  
**Operations**: SELECT, CREATE, UPDATE

#### SCR-CRM-003: Chấm Điểm Lead
**Tables**: `scoring_rules`, `leads`  
**Operations**: SELECT, CREATE, UPDATE (rules)

#### SCR-CRM-004: Hiệu Quả Nguồn Lead
**Tables**: `leads` (read-only)  
**Operations**: SELECT (aggregation)

#### SCR-CRM-005: Lịch Sử & Hoạt Động
**Tables**: `interactions`, `leads`, `customers`  
**Operations**: SELECT, CREATE

#### SCR-CRM-006: Nhắc Bảo Dưỡng
**Tables**: `reminders`, `customers`  
**Operations**: SELECT, CREATE, UPDATE

#### SCR-CRM-007: Chương Trình Loyalty
**Tables**: `customers`, `loyalty_transactions`  
**Operations**: SELECT, CREATE (transactions)

#### SCR-CRM-008: Chăm Sóc Sau Bán
**Tables**: `customers`, `interactions`  
**Operations**: SELECT, CREATE

#### SCR-CRM-009: Quản Lý Khiếu Nại
**Tables**: `complaints`, `customers`  
**Operations**: SELECT, CREATE, UPDATE

#### SCR-CRM-010: Chiến Dịch Marketing
**Tables**: `marketing_campaigns`, `customers`  
**Operations**: SELECT, CREATE, UPDATE

---

### Module 3: Sales

#### SCR-SAL-001: Tạo Báo Giá
**Tables**: `quotations`, `customers`, `vehicle_models`, `accessories`, `services_catalog`  
**Operations**: CREATE quotation, SELECT master data

#### SCR-SAL-002: Danh Sách Báo Giá
**Tables**: `quotations`  
**Operations**: SELECT, UPDATE (status)

#### SCR-SAL-003: Lịch Lái Thử
**Tables**: `test_drives`, `customers`, `users`  
**Operations**: SELECT, CREATE, UPDATE

#### SCR-SAL-004: Chi Tiết Lái Thử
**Tables**: `test_drives`  
**Operations**: SELECT

#### SCR-SAL-005: Phân Bổ VIN
**Tables**: `vins`, `contracts`  
**Operations**: SELECT, UPDATE (allocation)

#### SCR-SAL-006: Tồn Kho VIN
**Tables**: `vins`  
**Operations**: SELECT, CREATE, UPDATE

#### SCR-SAL-007: Quản Lý Đặt Cọc
**Tables**: `deposits`, `customers`, `contracts`  
**Operations**: SELECT, CREATE, UPDATE

#### SCR-SAL-008: Giao Hàng PDS
**Tables**: `pds_checklists`, `contracts`, `vins`  
**Operations**: SELECT, CREATE, UPDATE

---

### Module 4: Service

#### SCR-SVC-001: Báo Giá Dịch Vụ
**Tables**: `service_quotes`, `customers`, `services_catalog`, `parts`  
**Operations**: CREATE, SELECT

#### SCR-SVC-002: Lịch Hẹn
**Tables**: `service_appointments`, `customers`  
**Operations**: SELECT, CREATE, UPDATE

#### SCR-SVC-003: Tiếp Nhận
**Tables**: `service_appointments`, `repair_orders`  
**Operations**: SELECT, CREATE

#### SCR-SVC-004: Lệnh Sửa Chữa
**Tables**: `repair_orders`, `ro_line_items`, `customers`  
**Operations**: SELECT, CREATE, UPDATE

#### SCR-SVC-005: Giao Diện KTV
**Tables**: `repair_orders`, `work_logs`, `ro_line_items`  
**Operations**: SELECT, UPDATE, CREATE (logs)

#### SCR-SVC-006: Sử Dụng Khoang
**Tables**: `repair_orders` (read-only)  
**Operations**: SELECT (bay_number grouping)

#### SCR-SVC-007: Kiểm Tra Chất Lượng
**Tables**: `qc_checklists`, `repair_orders`  
**Operations**: SELECT, CREATE

#### SCR-SVC-008: Thanh Toán
**Tables**: `invoices`, `payments`, `repair_orders`  
**Operations**: CREATE invoice, CREATE payment

---

### Module 5: Parts

#### SCR-PRT-001: Tổng Quan Tồn Kho
**Tables**: `parts` (read-only)  
**Operations**: SELECT

#### SCR-PRT-002: Hàng Backorder
**Tables**: `parts`, `purchase_orders`  
**Operations**: SELECT

#### SCR-PRT-003: Nhập Xuất Kho
**Tables**: `stock_movements`, `parts`  
**Operations**: SELECT, CREATE (movement)

#### SCR-PRT-004: Yêu Cầu Mua Hàng
**Tables**: `purchase_orders`, `po_line_items`, `suppliers`, `parts`  
**Operations**: SELECT, CREATE, UPDATE

#### SCR-PRT-005: Phân Tích Tuổi Tồn
**Tables**: `parts`, `stock_movements` (read-only)  
**Operations**: SELECT (aggregation)

#### SCR-PRT-006: Kiểm Kê Kho
**Tables**: `stock_takes`, `stock_take_items`, `parts`  
**Operations**: SELECT, CREATE, UPDATE

#### SCR-PRT-007: Picking & Packing
**Tables**: `repair_orders`, `ro_line_items`, `parts`  
**Operations**: SELECT, UPDATE

#### SCR-PRT-008: KPIs Phụ Tùng
**Tables**: `parts`, `stock_movements` (read-only)  
**Operations**: SELECT (aggregation)

#### SCR-PRT-009: Định Giá PT
**Tables**: `parts`  
**Operations**: SELECT, UPDATE (price)

#### SCR-PRT-010: Trả Hàng NCC
**Tables**: `purchase_orders`, `suppliers`  
**Operations**: SELECT, CREATE (return PO)

---

### Module 6: Insurance

#### SCR-INS-001: Tổng Quan BH
**Tables**: `insurance_contracts`, `insurance_claims` (read-only)  
**Operations**: SELECT (aggregation)

#### SCR-INS-002: Danh Sách HĐ
**Tables**: `insurance_contracts`, `customers`  
**Operations**: SELECT, CREATE, UPDATE

#### SCR-INS-003: Chi Tiết HĐ
**Tables**: `insurance_contracts`  
**Operations**: SELECT

#### SCR-INS-004: DS Bồi Thường
**Tables**: `insurance_claims`, `insurance_contracts`  
**Operations**: SELECT, CREATE, UPDATE

#### SCR-INS-005: CT Bồi Thường
**Tables**: `insurance_claims`  
**Operations**: SELECT, UPDATE

---

### Module 7: Accounting

#### SCR-ACC-001: Dashboard Tài Chính
**Tables**: `invoices`, `payments`, `transactions` (read-only)  
**Operations**: SELECT (aggregation)

#### SCR-ACC-002: Báo Cáo Lãi Lỗ
**Tables**: `transactions` (read-only)  
**Operations**: SELECT (P&L calculation)

#### SCR-ACC-003: Bảng Cân Đối
**Tables**: `transactions`, `fixed_assets` (read-only)  
**Operations**: SELECT (Balance Sheet calculation)

#### SCR-ACC-004: Dòng Tiền
**Tables**: `transactions`, `payments` (read-only)  
**Operations**: SELECT (Cash Flow calculation)

#### SCR-ACC-005: Công Nợ Phải Thu
**Tables**: `invoices`, `payments`, `customers` (read-only)  
**Operations**: SELECT (AR aging)

#### SCR-ACC-006: Công Nợ Phải Trả
**Tables**: `purchase_orders`, `suppliers` (read-only)  
**Operations**: SELECT (AP aging)

#### SCR-ACC-007: Báo Cáo Thuế
**Tables**: `tax_declarations`, `transactions`  
**Operations**: SELECT, CREATE

#### SCR-ACC-008: Báo Cáo Quản Lý
**Tables**: All (read-only)  
**Operations**: SELECT (custom reports)

#### SCR-ACC-009: Tài Sản Cố Định
**Tables**: `fixed_assets`  
**Operations**: SELECT, CREATE, UPDATE

#### SCR-ACC-010: Khấu Hao
**Tables**: `fixed_assets`, `depreciation_schedules`  
**Operations**: SELECT, CREATE (schedule)

#### SCR-ACC-011: Phân Tích Chi Phí
**Tables**: `transactions` (read-only)  
**Operations**: SELECT (cost analysis)

---

### Module 8: Admin

#### SCR-ADM-001: Quản Lý User
**Tables**: `users`, `activity_logs`  
**Operations**: SELECT, CREATE, UPDATE (status/password)

#### SCR-ADM-002: Giám Sát HT
**Tables**: `system_metrics`, `activity_logs` (read-only)  
**Operations**: SELECT

#### SCR-ADM-003: Cấu Hình API
**Tables**: None (config stored in env/files)  
**Operations**: N/A

---

## 🔍 Traceability Matrix

Mỗi table đều có thể trace về:
1. **BRD Section 5** - Data Models
2. **FRD Module** - Functional specs
3. **Screen ID** - Specific screen usage

**Không có bảng "vô chủ"** - Tất cả 49 tables đều được sử dụng bởi ít nhất 1 screen.

---

## ⚠️ Assumptions & Design Decisions

### Assumption 1: JSON vs Normalized Tables
**Decision**: Sử dụng JSON cho accessories/services trong quotations  
**Rationale**: 
- Accessories/services là snapshot tại thời điểm báo giá
- Giá có thể thay đổi sau này
- Không cần query phức tạp trên accessories
- Giảm số lượng tables

### Assumption 2: Soft Delete
**Decision**: Sử dụng soft delete (status=INACTIVE) cho master data  
**Rationale**:
- Giữ referential integrity
- Audit trail
- Có thể restore

### Assumption 3: Append-Only Logs
**Decision**: activity_logs, stock_movements, transactions là append-only  
**Rationale**:
- Audit compliance
- Data integrity
- Historical accuracy

### Assumption 4: Phone as Customer Unique Key
**Decision**: Phone number là UNIQUE constraint cho customers  
**Rationale**:
- Nghiệp vụ Việt Nam: 1 SĐT = 1 KH
- Prevent duplicates
- Easy lookup

### Assumption 5: Lead Phone NOT Unique
**Decision**: Lead phone KHÔNG có UNIQUE constraint  
**Rationale**:
- Có thể có nhiều leads từ cùng 1 SĐT (khác nguồn)
- Merge khi convert thành customer

---

## 📅 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-28 | Antigravity | Initial ERD design - 49 tables |

---

**End of ERD Description v1.0**
