# API Implementation Plan: CR-001

## 1. Overview
Implement 27+ new endpoints for Admin and Insurance modules.

## 2. Admin Module APIs

### Role Management
- `GET /admin/roles`: List roles
- `GET /admin/roles/:id`: Get role details
- `POST /admin/roles`: Create role
- `PUT /admin/roles/:id`: Update role
- `DELETE /admin/roles/:id`: Delete role (Soft)

### Permission Management
- `GET /admin/permissions`: List all permissions
- `GET /admin/roles/:roleId/permissions`: Get role permissions
- `POST /admin/roles/:roleId/permissions`: Assign permissions (Bulk)

### System Settings
- `GET /admin/settings`: Get all settings
- `PUT /admin/settings`: Bulk update settings

### Audit & Monitoring
- `GET /admin/audit-logs`: Search logs with filters
- `GET /admin/monitoring/stats`: Get system stats

## 3. Insurance Module APIs

### Contracts
- `GET /insurance/contracts`: List contracts
- `GET /insurance/contracts/:id`: Get details
- `POST /insurance/contracts`: Create contract
- `POST /insurance/contracts/:id/renew`: Renew action

### Claims
- `GET /insurance/claims`: List claims
- `GET /insurance/claims/:id`: Get details
- `POST /insurance/claims`: Submit claim
- `PUT /insurance/claims/:id/status`: Update status (Approve/Reject)

## 4. Security Implementation
- **Middleware**: `requirePermission(permissionCode)`
- Apply middleware to all above routes.
