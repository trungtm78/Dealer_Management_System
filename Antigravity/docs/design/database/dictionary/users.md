# Table: `users`

**Module**: Admin  
**Type**: MASTER DATA  
**Purpose**: Quản lý người dùng hệ thống và phân quyền

---

## Table Information

| Property | Value |
|----------|-------|
| **Table Name** | `users` |
| **Primary Key** | `id` (varchar) |
| **Unique Constraints** | `email` |
| **Indexes** | PK on `id` |
| **Soft Delete** | Yes (status = 'INACTIVE') |

---

## Fields

| # | Column | Type | Null | Default | Description |
|---|--------|------|------|---------|-------------|
| 1 | `id` | varchar | NO | - | Primary key, UUID |
| 2 | `email` | varchar | NO | - | Email đăng nhập, UNIQUE |
| 3 | `password_hash` | varchar | NO | - | Mật khẩu đã hash (bcrypt) |
| 4 | `name` | varchar | NO | - | Tên đầy đủ |
| 5 | `role` | enum | NO | - | Vai trò: ADMIN, MANAGER, SALES, SERVICE, PARTS, ACCOUNTING, INSURANCE |
| 6 | `department` | varchar | YES | NULL | Phòng ban |
| 7 | `phone` | varchar | YES | NULL | Số điện thoại |
| 8 | `status` | varchar | NO | 'ACTIVE' | ACTIVE / INACTIVE |
| 9 | `last_login` | timestamp | YES | NULL | Lần đăng nhập cuối |
| 10 | `created_at` | timestamp | NO | now() | Ngày tạo |
| 11 | `updated_at` | timestamp | NO | now() | Ngày cập nhật |

---

## Relationships

### Outgoing (1:N)

| Target Table | Relationship | Description |
|--------------|--------------|-------------|
| `leads` | `users.id` ← `leads.assigned_to_id` | User được gán leads |
| `quotations` | `users.id` ← `quotations.created_by_id` | User tạo báo giá |
| `activity_logs` | `users.id` ← `activity_logs.user_id` | User tạo activity logs |
| `interactions` | `users.id` ← `interactions.user_id` | User log interactions |
| `test_drives` | `users.id` ← `test_drives.sales_consultant_id` | Sales consultant |
| `service_appointments` | `users.id` ← `service_appointments.advisor_id` | Service advisor |
| `repair_orders` | `users.id` ← `repair_orders.advisor_id` | Service advisor |
| `repair_orders` | `users.id` ← `repair_orders.technician_id` | Technician |
| `work_logs` | `users.id` ← `work_logs.technician_id` | Technician |

---

## Business Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| BR-ADM-001 | Email UNIQUE | Database constraint |
| BR-ADM-002 | Password min 8 chars, uppercase, lowercase, number | Application |
| BR-ADM-003 | Only ADMIN can create/edit users | Application (RBAC) |
| BR-ADM-004 | Cannot delete users, only deactivate | Application |
| BR-ADM-005 | Activity logs retained for 1 year | Application |
| BR-ADM-006 | Failed login > 5 times → lock account | Application |
| BR-ADM-007 | Session timeout: 8 hours | Application |

---

## Usage by Screens

### SCR-ADM-001: Quản Lý User

**Operations**: SELECT, CREATE, UPDATE (status/password only)

**Queries**:
```sql
-- List all users
SELECT * FROM users WHERE status = 'ACTIVE' ORDER BY name;

-- Create user
INSERT INTO users (id, email, password_hash, name, role, status) 
VALUES (?, ?, ?, ?, ?, 'ACTIVE');

-- Deactivate user
UPDATE users SET status = 'INACTIVE', updated_at = now() WHERE id = ?;

-- Reset password
UPDATE users SET password_hash = ?, updated_at = now() WHERE id = ?;
```

### All Modules

**Operations**: SELECT (read-only for lookups)

**Usage**: Dropdown cho assigned_to, created_by, advisor, technician, etc.

---

## Data Lifecycle

```
CREATE → ACTIVE → INACTIVE (soft delete)
```

**Notes**:
- Không xóa vật lý (hard delete)
- Giữ lại để maintain referential integrity
- Deactivated users không thể login

---

## Sample Data

```sql
INSERT INTO users (id, email, password_hash, name, role, department, status) VALUES
('usr-001', 'admin@honda.vn', '$2b$10$...', 'Nguyễn Văn A', 'ADMIN', 'IT', 'ACTIVE'),
('usr-002', 'sales1@honda.vn', '$2b$10$...', 'Trần Thị B', 'SALES', 'Sales', 'ACTIVE'),
('usr-003', 'service1@honda.vn', '$2b$10$...', 'Lê Văn C', 'SERVICE', 'Service', 'ACTIVE');
```

---

## Notes

- **MASTER DATA**: Read-only sau khi tạo, chỉ update status/password
- **Security**: Password MUST be hashed với bcrypt (10 rounds minimum)
- **Audit**: Mọi thao tác với users phải log vào `activity_logs`

---

**Last Updated**: 2026-01-28  
**Version**: 1.0
