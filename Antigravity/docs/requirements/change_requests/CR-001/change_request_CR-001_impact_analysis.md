# Change Request Impact Analysis: CR-001

**CR-ID**: CR-001
**Reference Intake**: change_request_CR-001_intake.md
**Status**: COMPLETED

---

## 1. IMPACT MATRIX

| Component | Impacted | Details |
|-----------|----------|---------|
| **BRD** | ✅ YES | v2.0 → v2.1. New sections for Admin (Permissions, Settings, Monitoring). |
| **FRD** | ✅ YES | Admin v1.0 → v2.0 (Major), Insurance v1.0 → v1.1. 7 new screens specs. |
| **ERD** | ✅ YES | v1.0 → v1.1. New tables: roles, permissions, role_permissions, system_settings. |
| **API Spec** | ✅ YES | Admin v1.0 → v2.0, Insurance v1.0 → v1.1. +27 new endpoints. |
| **UI Spec** | ✅ YES | v1.0 → v1.1. Specs for 7 new screens + layouts + navigation. |
| **UAT** | ✅ YES | v1.0 → v1.1. New test suites for all 7 screens. |

## 2. DETAILED ANALYSIS

### 2.1 Business Requirements (BRD)
- **New Requirements**:
  - BR-ADMIN-002: Permission Management (RBAC)
  - BR-ADMIN-003: System Settings (Configurable via UI)
  - BR-ADMIN-004: System Monitoring (Health checks & Metrics)
- **Impact**: Moderate structure change, High value impact.

### 2.2 Functional Requirements (FRD)
- **Insurance Module**:
  - `INS-001`, `INS-002`: Complete functional flows for Claims and Contracts.
- **Admin Module**:
  - `ADM-002`: **Permission Matrix** - Complex grid UI for role/permission assignment.
  - `ADM-003`: Audit Logs - Read-only view with filtering.
  - `ADM-004`: Settings - Key-Value pair editor or grouped forms.
  - `ADM-005`: Monitoring - Dashboard for system stats.

### 2.3 Data Model (ERD)
- **New Tables**:
  - `roles` (id, name, code, description)
  - `permissions` (id, code, module, description)
  - `role_permissions` (role_id, permission_id) - Many-to-Many
  - `system_settings` (key, value, group, type)
- **Modifications**:
  - `users` table: add `role_id` (or link to roles if N-N, generally 1-N or N-N). *Assumption: Users can have multiple roles, or single role. CR spec says "4 fields for users table".*

### 2.4 API Specifications
- **Admin**:
  - `/api/admin/roles/*` (CRUD)
  - `/api/admin/permissions/*` (Read, Assign)
  - `/api/admin/audit-logs/*` (Read)
  - `/api/admin/settings/*` (Read, Update)
  - `/api/admin/monitoring/*` (Read)
- **Insurance**:
  - `/api/insurance/claims/*`
  - `/api/insurance/contracts/*`

### 2.5 UI/UX & Infrastructure
- **Navigation**:
  - Add "Master Data", "Insurance", "Admin" groups to sidebar.
- **Routing**:
  - Add 11 new routes.
- **Security**:
  - Implement `PermissionGuard` component.
  - Wrap admin routes with permission checks.

## 3. EFFORT & RISK

### 3.1 Estimate
- **Total Effort**: ~372 hours (9.3 weeks).
- **Critical Path**: UI Infra -> Permissions (ADM-002) -> Guards -> Other Screens.

### 3.2 Risk Assessment
- **High Risk**: Permission system implementation (Security critical).
- **Mitigation**: Prioritize ADM-002 and Guards. Manual full regression test on permissions.

## 4. CONCLUSION
Proceed to create DRAFT specifications reflecting these changes.
