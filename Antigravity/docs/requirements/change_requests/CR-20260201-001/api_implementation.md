# API Implementation Plan: CR-20260201-001

## 1. Overview
Implement Admin and Insurance endpoints.

## 2. Endpoints
### Admin
- `GET/POST /admin/roles`
- `GET/POST /admin/roles/:id/permissions`
- `GET /admin/audit-logs`
- `GET/POST /admin/settings`

### Insurance
- `GET/POST /insurance/contracts`
- `GET/POST /insurance/claims`

## 3. Middleware
- `requirePermission`: Verify user has required permission string from JWT/DB.
