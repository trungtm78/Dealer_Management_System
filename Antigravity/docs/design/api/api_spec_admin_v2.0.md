# API Specification - Module 08: Admin v2.0

**Version**: 2.0  
**Date**: 31/01/2026  
**Status**: Ready  

---

## 1. User Management
(Enhanced from v1.0)

### `GET /api/v1/admin/users`
- **Params**: `page`, `limit`, `role`, `status`
- **Response**: List of users with Role info.

### `POST /api/v1/admin/users`
- **Body**: `email`, `name`, `role_id`, `password`
- **Response**: Created User

### `PUT /api/v1/admin/users/:id/role`
- **Body**: `role_id`
- **Response**: Success

---

## 2. Permission Management (NEW)

### `GET /api/v1/admin/roles`
- **Response**: List of basic roles.

### `GET /api/v1/admin/roles/:id/permissions`
- **Response**: List of permissions assigned to this role.

### `POST /api/v1/admin/roles`
- **Body**: `name`, `description`
- **Response**: Created Role

### `PUT /api/v1/admin/roles/:id/permissions`
- **Body**: `permission_ids` (Array of strings)
- **Response**: Updated permissions for role.

### `GET /api/v1/admin/permissions`
- **Response**: Master list of all available system permissions.

---

## 3. Audit Logs (NEW)

### `GET /api/v1/admin/audit-logs`
- **Params**: `startDate`, `endDate`, `user_id`, `action`, `entity`
- **Response**: Paginated list of logs.

---

## 4. System Settings (NEW)

### `GET /api/v1/admin/settings`
- **Params**: `category` (optional)
- **Response**: Map of settings { key: value }

### `PUT /api/v1/admin/settings`
- **Body**: `settings` (Array of { key, value })
- **Response**: Updated settings

### `GET /api/v1/admin/monitoring/stats`
- **Response**: System health metrics (CPU, Memory, DB Status)

---

## Change Log
| Version | Changes |
|---------|---------|
| 2.0 | Added APIs for Roles, Permissions, Audit, Settings, Monitoring. |
| 1.0 | Initial User APIs. |
