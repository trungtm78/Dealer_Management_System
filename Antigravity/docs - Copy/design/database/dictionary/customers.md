# Table: `customers`

**Module**: CRM  
**Type**: MASTER DATA  
**Purpose**: Quản lý khách hàng chính thức (đã mua xe hoặc sử dụng dịch vụ)

---

## Table Information

| Property | Value |
|----------|-------|
| **Table Name** | `customers` |
| **Primary Key** | `id` (varchar) |
| **Unique Constraints** | `phone` |
| **Indexes** | PK on `id`, UNIQUE on `phone`, INDEX on `tier` |
| **Soft Delete** | No (permanent records) |

---

## Fields

| # | Column | Type | Null | Default | Description |
|---|--------|------|------|---------|-------------|
| 1 | `id` | varchar | NO | - | Primary key, UUID |
| 2 | `name` | varchar | NO | - | Tên khách hàng |
| 3 | `type` | enum | NO | - | INDIVIDUAL / COMPANY |
| 4 | `phone` | varchar | NO | - | SĐT chính, UNIQUE |
| 5 | `mobile` | varchar | YES | NULL | SĐT di động phụ |
| 6 | `email` | varchar | YES | NULL | Email |
| 7 | `street` | varchar | YES | NULL | Địa chỉ |
| 8 | `ward` | varchar | YES | NULL | Phường/Xã |
| 9 | `district` | varchar | YES | NULL | Quận/Huyện |
| 10 | `city` | varchar | YES | NULL | Tỉnh/TP |
| 11 | `vat` | varchar | YES | NULL | Mã số thuế (cho COMPANY) |
| 12 | `tier` | enum | NO | 'BRONZE' | BRONZE, SILVER, GOLD, PLATINUM, DIAMOND |
| 13 | `points` | int | NO | 0 | Điểm hiện tại (có thể redeem) |
| 14 | `total_points` | int | NO | 0 | Tổng điểm tích lũy (lifetime) |
| 15 | `tags` | text | YES | NULL | JSON array: ["VIP", "Loyal"] |
| 16 | `notes` | text | YES | NULL | Ghi chú |
| 17 | `member_since` | timestamp | NO | now() | Ngày trở thành KH |
| 18 | `last_transaction_date` | timestamp | YES | NULL | Giao dịch cuối |
| 19 | `created_at` | timestamp | NO | now() | Ngày tạo |
| 20 | `updated_at` | timestamp | NO | now() | Ngày cập nhật |

---

## Relationships

### Incoming (N:1)

| Source Table | Relationship | Description |
|--------------|--------------|-------------|
| `leads` | `leads.customer_id` → `customers.id` | Lead converted to customer |

### Outgoing (1:N)

| Target Table | Relationship | Description |
|--------------|--------------|-------------|
| `quotations` | `customers.id` ← `quotations.customer_id` | Customer receives quotations |
| `test_drives` | `customers.id` ← `test_drives.customer_id` | Customer books test drives |
| `contracts` | `customers.id` ← `contracts.customer_id` | Customer signs contracts |
| `deposits` | `customers.id` ← `deposits.customer_id` | Customer makes deposits |
| `service_appointments` | `customers.id` ← `service_appointments.customer_id` | Customer books service |
| `repair_orders` | `customers.id` ← `repair_orders.customer_id` | Customer has ROs |
| `insurance_contracts` | `customers.id` ← `insurance_contracts.customer_id` | Customer holds insurance |
| `invoices` | `customers.id` ← `invoices.customer_id` | Customer receives invoices |
| `complaints` | `customers.id` ← `complaints.customer_id` | Customer files complaints |
| `interactions` | `customers.id` ← `interactions.customer_id` | Customer interactions |
| `reminders` | `customers.id` ← `reminders.customer_id` | Customer reminders |
| `loyalty_transactions` | `customers.id` ← `loyalty_transactions.customer_id` | Loyalty points |

---

## Business Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| BR-CRM-001 | Phone UNIQUE (1 SĐT = 1 KH) | Database constraint |
| BR-CRM-002 | Auto upgrade tier khi đủ điểm | Application |
| BR-CRM-003 | Không downgrade tier (lifetime) | Application |
| BR-CRM-004 | Mua xe mới: +10,000 points | Application |
| BR-CRM-005 | Bảo dưỡng: +500 points | Application |
| BR-CRM-006 | Giới thiệu KH: +2,000 points | Application |
| BR-CRM-007 | Check duplicate phone khi tạo | Application |

---

## Loyalty Tier Rules

| Tier | Points Range | Benefits |
|------|--------------|----------|
| BRONZE | 0 - 999 | Standard |
| SILVER | 1,000 - 4,999 | 5% discount on service |
| GOLD | 5,000 - 9,999 | 10% discount + priority booking |
| PLATINUM | 10,000 - 19,999 | 15% discount + free car wash |
| DIAMOND | 20,000+ | 20% discount + VIP lounge |

**Upgrade Logic**:
```
IF total_points >= 20000 THEN tier = DIAMOND
ELSE IF total_points >= 10000 THEN tier = PLATINUM
ELSE IF total_points >= 5000 THEN tier = GOLD
ELSE IF total_points >= 1000 THEN tier = SILVER
ELSE tier = BRONZE
```

---

## Usage by Screens

### SCR-CRM-002: Quản Lý Khách Hàng

**Operations**: SELECT, CREATE, UPDATE

**Queries**:
```sql
-- List customers with filters
SELECT * FROM customers 
WHERE tier = ? AND type = ? 
ORDER BY total_points DESC;

-- Search by phone/name
SELECT * FROM customers 
WHERE phone LIKE ? OR name LIKE ?;

-- Create customer
INSERT INTO customers (id, name, type, phone, tier, points, total_points) 
VALUES (?, ?, ?, ?, 'BRONZE', 0, 0);

-- Update customer
UPDATE customers 
SET name = ?, email = ?, street = ?, ward = ?, district = ?, city = ?, updated_at = now()
WHERE id = ?;

-- Add loyalty points
UPDATE customers 
SET points = points + ?, total_points = total_points + ?, updated_at = now()
WHERE id = ?;
```

### SCR-CRM-007: Chương Trình Loyalty

**Operations**: SELECT, UPDATE (points)

**Queries**:
```sql
-- Loyalty dashboard
SELECT tier, COUNT(*) as count, SUM(points) as total_points
FROM customers
GROUP BY tier;

-- Top customers
SELECT id, name, tier, total_points
FROM customers
ORDER BY total_points DESC
LIMIT 10;
```

### All Sales/Service Screens

**Operations**: SELECT (read-only for customer lookup)

**Usage**: CustomerSearch component, dropdown

---

## Data Lifecycle

```
CREATE (from Lead conversion or direct) → ACTIVE (permanent)
```

**Notes**:
- Không xóa customers (permanent records)
- Giữ lại để maintain transaction history
- Update tier tự động khi points thay đổi

---

## Sample Data

```sql
INSERT INTO customers (id, name, type, phone, email, tier, points, total_points, member_since) VALUES
('cus-001', 'Nguyễn Văn A', 'INDIVIDUAL', '0901234567', 'nguyenvana@gmail.com', 'GOLD', 5500, 5500, '2024-01-15'),
('cus-002', 'Công ty TNHH ABC', 'COMPANY', '0287654321', 'contact@abc.com.vn', 'PLATINUM', 12000, 12000, '2023-06-20'),
('cus-003', 'Trần Thị B', 'INDIVIDUAL', '0912345678', 'tranthib@gmail.com', 'SILVER', 1200, 1200, '2025-03-10');
```

---

## Notes

- **MASTER DATA**: Core business entity
- **Phone UNIQUE**: Nghiệp vụ VN - 1 SĐT = 1 KH
- **Tier Auto-upgrade**: Trigger khi total_points thay đổi
- **Tags**: JSON array cho flexible categorization
- **Permanent**: Không được xóa (referential integrity)

---

**Last Updated**: 2026-01-28  
**Version**: 1.0
