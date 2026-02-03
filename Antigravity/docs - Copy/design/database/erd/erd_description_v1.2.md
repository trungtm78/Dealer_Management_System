# Honda DMS - ERD Description v1.2 (Consolidated)

**Version**: 1.2  
**Date**: 2026-01-30  
**Author**: Antigravity - Data Design Authority  
**Database**: PostgreSQL (Production) / SQLite (Demo)  
**Source**: Consolidated from Prisma Schema + Change Logs v1.0, v1.1, v1.2

---

## 📋 Document Overview

Tài liệu này mô tả Entity Relationship Diagram (ERD) **CONSOLIDATED** cho Honda Dealer Management System. ERD này là **nguồn sự thật DUY NHẤT** cho cấu trúc dữ liệu. Frontend và Backend **PHẢI** triển khai STRICTLY theo ERD này.

**Version History**:
- v1.0 (2026-01-28): Initial design - 49 tables
- v1.1 (2026-01-29): Added RBAC + System Settings - 53 tables (+4)
- v1.2 (2026-01-30): Added Bay Management - 56 tables (+3)

---

## 📊 Entity Summary

### Tổng Quan

| Metric | Value |
|--------|-------|
| **Total Tables** | 56 |
| **Master Data Tables** | 12 |
| **Transaction Tables** | 41 |
| **Reference/Lookup Tables** | 3 |
| **Total Relationships** | 60+ |

### Phân Loại Theo Module

| Module | Tables | Master | Transaction |
|--------|--------|--------|-------------|
| **Admin** | 7 | 3 | 4 |
| **CRM** | 10 | 2 | 8 |
| **Sales** | 7 | 1 | 6 |
| **Service** | 10 | 1 | 9 |
| **Parts** | 9 | 2 | 7 |
| **Insurance** | 2 | 0 | 2 |
| **Accounting** | 7 | 1 | 6 |
| **Supporting** | 4 | 2 | 0 |

---

## 🗂️ Complete Entity List (56 Tables)

### MODULE 1: ADMIN (7 tables)
1. `users` - Người dùng hệ thống
2. `roles` - Vai trò RBAC *(v1.1)*
3. `permissions` - Quyền hạn *(v1.1)*
4. `role_permissions` - Junction table *(v1.1)*
5. `system_settings` - Cấu hình hệ thống *(v1.1)*
6. `activity_logs` - Audit log (append-only)
7. `system_metrics` - System monitoring

### MODULE 2: CRM (10 tables)
8. `customers` - Khách hàng chính thức
9. `leads` - Khách hàng tiềm năng
10. `lead_histories` - Lịch sử thay đổi lead
11. `interactions` - Lịch sử tương tác
12. `scoring_rules` - Quy tắc chấm điểm lead
13. `scoring_criteria` - Tiêu chí chấm điểm
14. `reminders` - Nhắc nhở
15. `loyalty_transactions` - Lịch sử điểm
16. `complaints` - Khiếu nại
17. `marketing_campaigns` - Chiến dịch marketing

### MODULE 3: SALES (7 tables)
18. `quotations` - Báo giá
19. `test_drives` - Lái thử
20. `vins` - VIN inventory
21. `contracts` - Hợp đồng mua xe
22. `deposits` - Đặt cọc
23. `pds_checklists` - Pre-Delivery Service

### MODULE 4: SERVICE (10 tables)
24. `service_quotes` - Báo giá dịch vụ
25. `service_appointments` - Lịch hẹn
26. `repair_orders` - Lệnh sửa chữa
27. `ro_line_items` - Chi tiết RO
28. `work_logs` - Nhật ký KTV
29. `qc_checklists` - Kiểm tra chất lượng
30. `service_bays` - Quản lý bay *(v1.2)*
31. `bay_assignments` - Phân công bay *(v1.2)*
32. `bay_status_logs` - Lịch sử trạng thái bay *(v1.2)*

### MODULE 5: PARTS (9 tables)
33. `parts` - Phụ tùng
34. `suppliers` - Nhà cung cấp
35. `stock_movements` - Nhập xuất kho (append-only)
36. `purchase_orders` - Đơn mua hàng
37. `po_line_items` - Chi tiết PO
38. `stock_takes` - Phiên kiểm kê
39. `stock_take_items` - Chi tiết kiểm kê

### MODULE 6: INSURANCE (2 tables)
40. `insurance_contracts` - Hợp đồng bảo hiểm
41. `insurance_claims` - Bồi thường

### MODULE 7: ACCOUNTING (7 tables)
42. `invoices` - Hóa đơn
43. `payments` - Thanh toán
44. `transactions` - Giao dịch kế toán
45. `fixed_assets` - Tài sản cố định
46. `depreciation_schedules` - Lịch khấu hao
47. `tax_declarations` - Khai báo thuế

### MODULE 8: SUPPORTING (4 tables)
48. `vehicle_models` - Danh mục model xe
49. `accessories` - Danh mục phụ kiện
50. `services_catalog` - Danh mục dịch vụ

---

## 🔑 CRITICAL: Naming Convention

**CONFIRMED FROM PRISMA SCHEMA**: Tất cả tables và fields sử dụng **snake_case**

### Table Names
- ✅ `users`, `customers`, `quotations`, `repair_orders`
- ✅ `service_bays`, `bay_assignments`, `bay_status_logs`
- ✅ `system_settings`, `role_permissions`

### Field Names
- ✅ `quote_number`, `customer_name`, `base_price`
- ✅ `created_at`, `updated_at`, `deleted_at`
- ✅ `assigned_to_id`, `created_by_id`, `reviewed_by_id`
- ✅ `arrival_date`, `scheduled_date`, `invoice_date`

### ❌ KHÔNG SỬ DỤNG camelCase
- ❌ `quoteNumber`, `customerName`, `basePrice`
- ❌ `createdAt`, `updatedAt`, `deletedAt`
- ❌ `assignedToId`, `createdById`

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
| `roles` | `name` | Role name unique *(v1.1)* |
| `system_settings` | `key` | Setting key unique *(v1.1)* |
| `permissions` | `(module, action)` | Permission unique *(v1.1)* |

### Soft Delete vs Hard Delete

**Soft Delete** (status = INACTIVE or deleted_at):
- `users` (deleted_at field)
- `customers` (deleted_at field)
- `parts` (status field)
- `suppliers` (status field)
- `vehicle_models` (status field)
- `accessories` (status field)
- `services_catalog` (status field)

**Hard Delete** (physical deletion):
- None - All transaction data is retained for audit

**Append-Only** (no UPDATE/DELETE):
- `activity_logs`
- `stock_movements`
- `transactions`
- `bay_status_logs` *(v1.2)*

---

## 📝 JSON Fields Documentation

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
| `service_bays` | `equipment` | `string[]` | `["Lift", "Diagnostic Tool"]` *(v1.2)* |

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

### Bay Assignment Lifecycle *(v1.2)*
```
ASSIGNED → IN_PROGRESS → COMPLETED/CANCELLED
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

## 🆕 Changes in v1.1 (CR-001)

### Added Tables (4)
1. **`roles`** - RBAC role definitions
2. **`permissions`** - Granular permissions
3. **`role_permissions`** - Junction table (N:M)
4. **`system_settings`** - Centralized configuration

### Modified Tables (1)
- **`users`**: Added security fields
  - `last_login` (DateTime?)
  - `failed_login_attempts` (Int, default: 0)
  - `password_changed_at` (DateTime?)
  - `is_active` (Boolean, default: true)
  - `deleted_at` (DateTime?)

### New Relationships (4)
- `roles` → `role_permissions` (1:N)
- `permissions` → `role_permissions` (1:N)
- `users` → `system_settings` (1:N)

---

## 🆕 Changes in v1.2 (CR-003)

### Added Tables (3)
1. **`service_bays`** - Bay management
2. **`bay_assignments`** - Bay work assignment
3. **`bay_status_logs`** - Bay status history (append-only)

### New Relationships (4)
- `service_bays` → `bay_assignments` (1:N)
- `repair_orders` → `bay_assignments` (1:N)
- `service_bays` → `bay_status_logs` (1:N)
- `bay_assignments` → `bay_status_logs` (1:N)

### New Fields in Existing Tables
- **`repair_orders`**: Added `bay_number` (String?)

---

## 📅 Version History

| Version | Date | Author | Tables | Changes | Status |
|---------|------|--------|--------|---------|--------|
| 1.0 | 2026-01-28 | Antigravity | 49 | Initial design | ✅ APPROVED |
| 1.1 | 2026-01-29 | Antigravity | 53 | +4 tables (RBAC + Settings) | ✅ APPROVED |
| 1.2 | 2026-01-30 | Antigravity | 56 | +3 tables (Bay Management) | ✅ APPROVED |

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
**Decision**: Sử dụng soft delete (deleted_at hoặc status=INACTIVE) cho master data  
**Rationale**:
- Giữ referential integrity
- Audit trail
- Có thể restore

### Assumption 3: Append-Only Logs
**Decision**: activity_logs, stock_movements, transactions, bay_status_logs là append-only  
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

### Assumption 6: snake_case Naming Convention
**Decision**: Tất cả tables và fields sử dụng snake_case  
**Rationale**:
- PostgreSQL/SQLite best practice
- Consistency across database
- Avoid case-sensitivity issues
- Match Prisma schema convention

---

## 🔍 Traceability Matrix

Mỗi table đều có thể trace về:
1. **BRD Section 5** - Data Models
2. **FRD Module** - Functional specs
3. **Screen ID** - Specific screen usage

**Không có bảng "vô chủ"** - Tất cả 56 tables đều được sử dụng bởi ít nhất 1 screen.

---

## ✅ Validation Checklist

- ✅ All tables traced to FRD screens
- ✅ No "orphan" tables
- ✅ No "convenience" tables
- ✅ All business rules from BRD/FRD reflected
- ✅ Naming convention: snake_case (verified from Prisma schema)
- ✅ All relationships properly defined
- ✅ All indexes for performance
- ✅ All constraints (UNIQUE, NOT NULL, DEFAULT)

---

**End of ERD Description v1.2 (Consolidated)**
