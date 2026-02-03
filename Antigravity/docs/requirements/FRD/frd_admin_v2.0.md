# Functional Requirements Document (FRD)
## Honda Dealer Management System - Module 8: Quản Trị (Admin)

---

## 📋 Document Control

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Module** | Module 8 - Quản Trị (Admin) |
| **Số Screens** | 5 |
| **Phiên Bản** | 2.0 |
| **Ngày Tạo** | 28/01/2026 |
| **Cập Nhật** | 31/01/2026 (CR-20250131-002) |
| **Status** | ✅ **READY FOR IMPLEMENTATION** |

---

## 📊 Module Overview

**Mục đích**: Quản lý hệ thống, phân quyền, cấu hình và giám sát.

**Screens trong Module**:

| # | Screen ID | Screen Name | Route | Status |
|---|-----------|-------------|-------|--------|
| 1 | SCR-ADM-001 | Quản Lý User | `/admin/users` | ✅ DEFINED |
| 2 | SCR-ADM-002 | Phân Quyền | `/admin/permissions` | ✅ NEW |
| 3 | SCR-ADM-003 | Nhật Ký Audit | `/admin/audit-logs` | ✅ NEW |
| 4 | SCR-ADM-004 | Cấu Hình HT | `/admin/settings` | ✅ NEW |
| 5 | SCR-ADM-005 | Giám Sát HT | `/admin/monitoring` | ✅ MOVED |

---

## 🎯 SCR-ADM-001: Quản Lý Người Dùng

### 1. Screen Information
**ID**: SCR-ADM-001 | **Route**: `/admin/users`

### 2. Required UI Components
- **UserTable**: List users with Role, Status columns.
- **UserForm**: Create/Edit user, assign Role.
- **Actions**: Reset Password, Deactivate.

### 3. Functional Specifications
- **CRUD**: Full Create/Read/Update/Delete (Soft) for users.
- **Role Assignment**: Select from defined Roles.
- **Security**: Emails unique. Passwords valid.

---

## 🎯 SCR-ADM-002: Phân Quyền (Permission Management)

### 1. Screen Information
**ID**: SCR-ADM-002 | **Route**: `/admin/permissions`

### 2. Required UI Components
- **RoleList**: List of roles (e.g., ADMIN, MANAGER, SALES).
- **PermissionMatrix**: Grid view [Role] x [Permission]. Checkboxes to toggle.
- **RoleForm**: Create new custom role.

### 3. Functional Specifications
- **Manage Roles**: Create/Update roles.
- **Manage Permissions**: Toggle permissions for each role.
- **Matrix View**: Visual grid to see who can do what.

### 4. Data Requirements
**Entities**: `roles`, `permissions`, `role_permissions`
- `roles`: id, name, description, is_system
- `permissions`: id, module, action
- `role_permissions`: role_id, permission_id

---

## 🎯 SCR-ADM-003: Nhật Ký Audit (Audit Logs)

### 1. Screen Information
**ID**: SCR-ADM-003 | **Route**: `/admin/audit-logs`

### 2. Required UI Components
- **AuditLogViewer**: Table view of logs.
- **Filters**: User, Date Range, Action Type, Entity.
- **LogDetail**: View diff (old vs new value).

### 3. Functional Specifications
- **Logging**: System automatically logs critical actions.
- **Viewing**: Admin can search and filter logs.
- **Retention**: Logs specific retention period.

### 4. Data Requirements
**Entity**: `activity_logs`
- id, user_id, action, entity, details, timestamp.

---

## 🎯 SCR-ADM-004: Cấu Hình Hệ Thống (System Settings)

### 1. Screen Information
**ID**: SCR-ADM-004 | **Route**: `/admin/settings`

### 2. Required UI Components
- **SettingsCategoryList**: Email, SMS, Notification, General.
- **SettingEditor**: Typed input based on setting type (Text, boolean, number).

### 3. Functional Specifications
- **View**: Categorized settings.
- **Edit**: Update value. Validate data type.
- **Security**: Encrypt sensitive values.

### 4. Data Requirements
**Entity**: `system_settings`
- key, value, type, category, is_public.

---

## 🎯 SCR-ADM-005: Giám Sát Hệ Thống (Monitoring)

### 1. Screen Information
**ID**: SCR-ADM-005 | **Route**: `/admin/monitoring`

### 2. Required UI Components
- **PerformanceDashboard**: CPU, Memory, Disk charts.
- **BusinessMetrics**: Active users, Request volume.
- **HealthChecks**: Database status, API status.

### 3. Functional Specifications
- **Real-time**: Refresh every 30-60s.
- **Alerts**: Highlight critical thresholds.

---

## Change Log

| Version | Date | Changes | Related |
|---------|------|---------|---------|
| 2.0 | 31/01/2026 | Added SCR-ADM-002 (Permissions), 003 (Audit), 004 (Settings). Moved Monitoring to 005. | CR-20250131-002 |
| 1.0 | 28/01/2026 | Initial Draft (Screens 001-003 partial) | - |

**End of FRD Module 08 v2.0**
