# Table: `leads`

**Module**: CRM  
**Type**: TRANSACTION DATA  
**Purpose**: Quản lý khách hàng tiềm năng chưa mua xe

---

## Table Information

| Property | Value |
|----------|-------|
| **Table Name** | `leads` |
| **Primary Key** | `id` (varchar) |
| **Unique Constraints** | None (phone có thể trùng) |
| **Indexes** | PK on `id`, INDEX on `phone`, `status`, `assigned_to_id` |
| **Soft Delete** | No (status = 'DEAD') |

---

## Fields

| # | Column | Type | Null | Default | Description |
|---|--------|------|------|---------|-------------|
| 1 | `id` | varchar | NO | - | Primary key, UUID |
| 2 | `name` | varchar | NO | - | Tên khách hàng |
| 3 | `phone` | varchar | NO | - | SĐT (có thể trùng) |
| 4 | `email` | varchar | YES | NULL | Email |
| 5 | `address` | text | YES | NULL | Địa chỉ |
| 6 | `model_interest` | varchar | YES | NULL | Model quan tâm |
| 7 | `model_version` | varchar | YES | NULL | Version |
| 8 | `budget` | decimal | YES | NULL | Ngân sách |
| 9 | `source` | enum | NO | - | FACEBOOK, WEBSITE, WALK_IN, HOTLINE, REFERRAL, OTHER |
| 10 | `status` | enum | NO | 'NEW' | NEW, CONTACTED, QUALIFIED, PROPOSAL, NEGOTIATION, WON, DEAD |
| 11 | `score` | int | NO | 10 | Điểm chấm lead (1-100) |
| 12 | `notes` | text | YES | NULL | Ghi chú |
| 13 | `customer_type` | enum | YES | NULL | individual / company |
| 14 | `customer_id` | varchar | YES | NULL | FK to customers (NULL until converted) |
| 15 | `assigned_to_id` | varchar | YES | NULL | FK to users (sales consultant) |
| 16 | `created_at` | timestamp | NO | now() | Ngày tạo |
| 17 | `updated_at` | timestamp | NO | now() | Ngày cập nhật |

---

## Relationships

### Incoming (N:1)

| Source Table | Relationship | Description |
|--------------|--------------|-------------|
| `users` | `leads.assigned_to_id` → `users.id` | Assigned sales consultant |
| `customers` | `leads.customer_id` → `customers.id` | Converted customer |

### Outgoing (1:N)

| Target Table | Relationship | Description |
|--------------|--------------|-------------|
| `interactions` | `leads.id` ← `interactions.lead_id` | Lead interactions |

---

## Business Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| BR-CRM-101 | Phone NOT UNIQUE (có thể có nhiều leads từ cùng SĐT) | No constraint |
| BR-CRM-102 | Default score = 10 | Database default |
| BR-CRM-103 | Score tự động update khi thay đổi thông tin | Application (scoring engine) |
| BR-CRM-104 | Chỉ convert lead có status ≥ QUALIFIED | Application |
| BR-CRM-105 | Khi convert: tạo Customer hoặc link existing | Application |
| BR-CRM-106 | Khi convert: status → WON | Application |
| BR-CRM-107 | Auto-assign theo round-robin | Application |

---

## Status Lifecycle

```
NEW → CONTACTED → QUALIFIED → PROPOSAL → NEGOTIATION → WON
                                                      ↓
                                                    DEAD
```

**Status Descriptions**:
- **NEW**: Lead mới, chưa liên hệ
- **CONTACTED**: Đã liên hệ lần đầu
- **QUALIFIED**: Đủ điều kiện (có nhu cầu + ngân sách)
- **PROPOSAL**: Đã gửi báo giá
- **NEGOTIATION**: Đang đàm phán
- **WON**: Thành công (converted to customer)
- **DEAD**: Thất bại (lost)

---

## Lead Scoring

**Default Score**: 10

**Scoring Categories**:
1. **DEMOGRAPHIC** (0-25 points)
   - Budget match: +10
   - Location: +5
   - Company vs Individual: +10

2. **BEHAVIOR** (0-25 points)
   - Website visits: +5 per visit
   - Brochure download: +10
   - Test drive request: +15

3. **ENGAGEMENT** (0-25 points)
   - Email open: +5
   - Email click: +10
   - Call answered: +10

4. **INTENT** (0-25 points)
   - Timeframe < 1 month: +25
   - Timeframe 1-3 months: +15
   - Timeframe > 3 months: +5

**Total Score Range**: 1-100

**Priority**:
- **HOT** (80-100): Immediate follow-up
- **WARM** (50-79): Follow-up within 24h
- **COLD** (1-49): Follow-up within 3 days

---

## Usage by Screens

### SCR-CRM-001: Quản Lý Leads (Kanban Board)

**Operations**: SELECT, CREATE, UPDATE, DELETE (soft)

**Queries**:
```sql
-- Kanban board (group by status)
SELECT status, COUNT(*) as count
FROM leads
WHERE assigned_to_id = ? AND status != 'DEAD'
GROUP BY status;

-- Get leads by status
SELECT * FROM leads
WHERE status = ? AND assigned_to_id = ?
ORDER BY score DESC, created_at DESC;

-- Create lead
INSERT INTO leads (id, name, phone, source, status, score, assigned_to_id)
VALUES (?, ?, ?, ?, 'NEW', 10, ?);

-- Update lead status (drag & drop)
UPDATE leads
SET status = ?, updated_at = now()
WHERE id = ?;

-- Convert lead to customer
UPDATE leads
SET customer_id = ?, status = 'WON', updated_at = now()
WHERE id = ?;
```

### SCR-CRM-003: Chấm Điểm Lead

**Operations**: SELECT, UPDATE (score)

**Queries**:
```sql
-- Update lead score
UPDATE leads
SET score = ?, updated_at = now()
WHERE id = ?;

-- Get leads by score range
SELECT * FROM leads
WHERE score >= ? AND score <= ?
ORDER BY score DESC;
```

### SCR-CRM-004: Hiệu Quả Nguồn Lead

**Operations**: SELECT (read-only, aggregation)

**Queries**:
```sql
-- Lead source performance
SELECT 
  source,
  COUNT(*) as total_leads,
  SUM(CASE WHEN status = 'WON' THEN 1 ELSE 0 END) as won_leads,
  AVG(score) as avg_score,
  (SUM(CASE WHEN status = 'WON' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as conversion_rate
FROM leads
WHERE created_at >= ? AND created_at <= ?
GROUP BY source;
```

---

## Data Lifecycle

```
CREATE → NEW → ... → WON (converted to customer)
                  ↓
                DEAD (lost)
```

**Notes**:
- Không xóa vật lý (keep for analytics)
- DEAD leads có thể reactivate
- WON leads link to customer_id

---

## Sample Data

```sql
INSERT INTO leads (id, name, phone, email, source, status, score, model_interest, assigned_to_id) VALUES
('lead-001', 'Nguyễn Văn X', '0901111111', 'nguyenvanx@gmail.com', 'FACEBOOK', 'NEW', 10, 'CR-V', 'usr-002'),
('lead-002', 'Trần Thị Y', '0902222222', 'tranthiy@gmail.com', 'WEBSITE', 'QUALIFIED', 65, 'City', 'usr-002'),
('lead-003', 'Lê Văn Z', '0903333333', 'levanz@gmail.com', 'WALK_IN', 'PROPOSAL', 85, 'Accord', 'usr-002');
```

---

## Notes

- **TRANSACTION DATA**: Frequent changes
- **Phone NOT UNIQUE**: Có thể có nhiều leads từ cùng SĐT (khác nguồn)
- **Scoring**: Auto-update via scoring engine
- **Conversion**: Link to customer_id khi WON
- **Analytics**: Giữ lại DEAD leads cho phân tích

---

**Last Updated**: 2026-01-28  
**Version**: 1.0
