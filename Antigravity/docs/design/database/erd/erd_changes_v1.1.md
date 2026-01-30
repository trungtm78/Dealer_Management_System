# ERD Description v1.1 - Change Summary

**Base Version**: v1.0  
**New Version**: v1.1  
**Date**: 2026-01-29  
**CR-ID**: CR-001

---

## Changes from v1.0

### 1. New Tables Added (4 tables)

#### Table: `roles`
```sql
CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Define user roles for RBAC system  
**Indexes**: `idx_roles_name ON roles(name)`

---

#### Table: `permissions`
```sql
CREATE TABLE permissions (
  id TEXT PRIMARY KEY,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(module, action)
);
```

**Purpose**: Define granular permissions  
**Indexes**: `idx_permissions_module ON permissions(module)`

---

#### Table: `role_permissions`
```sql
CREATE TABLE role_permissions (
  role_id TEXT NOT NULL,
  permission_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);
```

**Purpose**: Junction table for N:M relationship between roles and permissions

---

#### Table: `system_settings`
```sql
CREATE TABLE system_settings (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  data_type TEXT NOT NULL, -- 'string', 'number', 'boolean', 'json'
  category TEXT NOT NULL, -- 'email', 'sms', 'notification', 'general'
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  updated_by TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id)
);
```

**Purpose**: Centralized system configuration  
**Indexes**: `idx_settings_category ON system_settings(category)`

---

### 2. Modified Tables (1 table)

#### Table: `users` - Added Security Fields
```sql
ALTER TABLE users ADD COLUMN last_login DATETIME;
ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN password_changed_at DATETIME;
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN role_id TEXT REFERENCES roles(id);
```

**Purpose**: Enhanced security tracking and RBAC integration

---

### 3. New Relationships

| Parent | Child | Type | Description |
|--------|-------|------|-------------|
| `roles` | `role_permissions` | 1:N | Role has many permissions |
| `permissions` | `role_permissions` | 1:N | Permission belongs to many roles |
| `roles` | `users` | 1:N | Role assigned to many users |
| `users` | `system_settings` | 1:N | User updates settings |

---

### 4. Updated Statistics

| Metric | v1.0 | v1.1 | Change |
|--------|------|------|--------|
| **Total Tables** | 49 | 53 | +4 |
| **Master Data Tables** | 10 | 11 | +1 (roles) |
| **Transaction Tables** | 36 | 39 | +3 |
| **Total Relationships** | 52 | 56 | +4 |

---

### 5. Module Classification Update

| Module | Tables (v1.0) | Tables (v1.1) | Change |
|--------|---------------|---------------|--------|
| **Admin** | 3 | 7 | +4 (roles, permissions, role_permissions, system_settings) |
| **CRM** | 8 | 8 | - |
| **Sales** | 7 | 7 | - |
| **Service** | 7 | 7 | - |
| **Parts** | 9 | 9 | - |
| **Insurance** | 2 | 2 | - |
| **Accounting** | 7 | 7 | - |
| **Supporting** | 6 | 6 | - |

---

## Change Log

| Version | Date | CR-ID | Changes | Author |
|---------|------|-------|---------|--------|
| 1.1 | 2026-01-29 | CR-001 | Added 4 tables (roles, permissions, role_permissions, system_settings), Modified users table with security fields | Antigravity |
| 1.0 | 2026-01-28 | - | Initial ERD design - 49 tables | Antigravity |

---

**Note**: For full ERD description v1.0 content, refer to `erd_description_v1.0.md`. This document only contains changes introduced in v1.1.

**End of ERD v1.1 Change Summary**
