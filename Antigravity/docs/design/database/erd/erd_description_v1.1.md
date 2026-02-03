# Honda DMS - ERD Description v1.1

**Version**: 1.1 - Consolidated  
**Date**: 31/01/2026 (CR-20250131-002)  
**Author**: Antigravity - Data Design Authority  

---

## 📋 Document Overview

This document describes the updated ERD v1.1 including changes for System Administration (RBAC, Audit, Settings).

---

## 📊 Entity Summary

| Metric | Value |
|--------|-------|
| **Total Tables** | 53 (+4 from v1.0) |
| **Master Data Tables** | 11 (+1) |
| **Transaction Tables** | 39 (+3) |

---

## 🗂️ Entity Changes (v1.1)

### New Tables (Admin Module)

#### 1. `roles`
- **Purpose**: Define user roles (e.g., SALES_REP, ADMIN).
- **Columns**: `id`, `name` (unique), `description`, `is_system`, `created_at`, `updated_at`.

#### 2. `permissions`
- **Purpose**: Granular permissions (e.g., `lead.create`).
- **Columns**: `id`, `module`, `action`, `description`.

#### 3. `role_permissions`
- **Purpose**: Mapping Role-to-Permission (N:M).
- **Columns**: `role_id`, `permission_id`.

#### 4. `system_settings`
- **Purpose**: System-wide configuration.
- **Columns**: `id`, `key` (unique), `value`, `data_type`, `category`, `is_public`, `updated_by`.

### Modified Tables

#### `users`
- Added: `last_login`, `failed_login_attempts`, `password_changed_at`, `is_active`, `role_id`.

---

## 🔗 Relationships Updates

- `users` (N) -> `roles` (1)
- `roles` (1) -> `role_permissions` (N)
- `permissions` (1) -> `role_permissions` (N)
- `users` (1) -> `system_settings` (N) (Created/Updated By)

---

## 📅 Version History

| Version | Date | Changes | Related |
|---------|------|---------|---------|
| 1.1 | 31/01/2026 | Added 4 tables for Admin (RBAC/Settings). Updated Users. | CR-20250131-002 |
| 1.0 | 28/01/2026 | Initial Release | - |

**End of ERD Description v1.1**
