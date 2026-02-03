# Honda DMS - Data Dictionary

**Version**: 1.0  
**Date**: 2026-01-28  
**Total Tables**: 49

---

## Purpose

Thư mục này chứa Data Dictionary cho tất cả 49 tables trong Honda DMS ERD. Mỗi table có 1 file markdown riêng với format chuẩn.

---

## Dictionary Format

Mỗi file dictionary bao gồm:

### 1. Header
- Module
- Type (MASTER / TRANSACTION)
- Purpose

### 2. Table Information
- Table name
- Primary key
- Unique constraints
- Indexes
- Soft delete policy

### 3. Fields
- Complete field list với type, null, default, description

### 4. Relationships
- Incoming (N:1)
- Outgoing (1:N)

### 5. Business Rules
- Rule ID
- Rule description
- Enforcement method (Database / Application)

### 6. Usage by Screens
- FRD Screen IDs
- Operations (SELECT, CREATE, UPDATE, DELETE)
- Sample queries

### 7. Data Lifecycle
- Status transitions
- Notes

### 8. Sample Data
- SQL INSERT examples

---

## Completed Dictionaries

### ✅ Core Tables (3)

| # | Table | Module | Type | File |
|---|-------|--------|------|------|
| 1 | `users` | Admin | MASTER | [users.md](./users.md) |
| 2 | `customers` | CRM | MASTER | [customers.md](./customers.md) |
| 3 | `leads` | CRM | TRANSACTION | [leads.md](./leads.md) |

---

## Pending Dictionaries (46)

### Module: Admin (2)
- [ ] `activity_logs.md`
- [ ] `system_metrics.md`

### Module: CRM (5)
- [ ] `interactions.md`
- [ ] `scoring_rules.md`
- [ ] `reminders.md`
- [ ] `loyalty_transactions.md`
- [ ] `complaints.md`
- [ ] `marketing_campaigns.md`

### Module: Sales (6)
- [ ] `quotations.md`
- [ ] `test_drives.md`
- [ ] `vins.md`
- [ ] `contracts.md`
- [ ] `deposits.md`
- [ ] `pds_checklists.md`

### Module: Service (6)
- [ ] `service_quotes.md`
- [ ] `service_appointments.md`
- [ ] `repair_orders.md`
- [ ] `ro_line_items.md`
- [ ] `work_logs.md`
- [ ] `qc_checklists.md`

### Module: Parts (7)
- [ ] `parts.md`
- [ ] `suppliers.md`
- [ ] `stock_movements.md`
- [ ] `purchase_orders.md`
- [ ] `po_line_items.md`
- [ ] `stock_takes.md`
- [ ] `stock_take_items.md`

### Module: Insurance (2)
- [ ] `insurance_contracts.md`
- [ ] `insurance_claims.md`

### Module: Accounting (7)
- [ ] `invoices.md`
- [ ] `payments.md`
- [ ] `transactions.md`
- [ ] `fixed_assets.md`
- [ ] `depreciation_schedules.md`
- [ ] `tax_declarations.md`

### Module: Supporting (3)
- [ ] `vehicle_models.md`
- [ ] `accessories.md`
- [ ] `services_catalog.md`

---

## How to Create Dictionary

### Step 1: Copy Template

Sử dụng `users.md`, `customers.md`, hoặc `leads.md` làm template.

### Step 2: Fill Information

1. **Header**: Module, Type, Purpose
2. **Table Info**: PK, constraints, indexes
3. **Fields**: Copy từ DBML file
4. **Relationships**: Trace từ ERD diagram
5. **Business Rules**: Extract từ FRD
6. **Usage**: Map với FRD screens
7. **Sample Data**: Tạo 2-3 rows

### Step 3: Validate

- ✅ All fields documented
- ✅ All relationships traced
- ✅ All business rules from FRD included
- ✅ Sample queries provided
- ✅ Sample data provided

---

## Quick Reference

### Master Data Tables (10)

| Table | Module | Purpose |
|-------|--------|---------|
| `users` | Admin | Người dùng hệ thống |
| `customers` | CRM | Khách hàng chính thức |
| `scoring_rules` | CRM | Quy tắc chấm điểm |
| `parts` | Parts | Phụ tùng |
| `suppliers` | Parts | Nhà cung cấp |
| `vins` | Sales | VIN inventory |
| `fixed_assets` | Accounting | Tài sản cố định |
| `vehicle_models` | Supporting | Danh mục model |
| `accessories` | Supporting | Danh mục phụ kiện |
| `services_catalog` | Supporting | Danh mục dịch vụ |

### Transaction Tables (36)

See ERD Description for complete list.

---

## Naming Conventions

### File Names
- Lowercase
- Underscore separator
- Match table name exactly
- Example: `repair_orders.md`

### Table Names
- Lowercase
- Underscore separator
- Plural form
- Example: `repair_orders`

### Field Names
- Lowercase
- Underscore separator
- Descriptive
- Example: `customer_id`, `created_at`

---

## Notes

- **Consistency**: Tất cả dictionaries phải follow cùng format
- **Completeness**: Không được bỏ qua bất kỳ section nào
- **Traceability**: Mọi business rule phải trace về FRD/BRD
- **Accuracy**: Sample queries phải test được

---

**Last Updated**: 2026-01-28  
**Completion**: 3/49 (6%)
