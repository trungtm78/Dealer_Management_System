# Frontend Implementation Plan: CR-001

## 1. UI Infrastructure Updates

### 1.1 Navigation & Routing
- Update `Sidebar.tsx`: Add "Master Data", "Insurance", "Admin" sections.
- Add Routes in `app/routes.tsx` or App Router:
  - `/master/*`
  - `/insurance/*`
  - `/admin/*`

### 1.2 Layouts
- Create `AdminLayout`: Includes Admin Header, Breadcrumbs.
- Create `InsuranceLayout`: Includes KPI Header.

### 1.3 Security Components
- Implement `<PermissionGuard section="admin">`: Wrap restricted routes.
- Implement `usePermission()` hook for conditional UI rendering.

## 2. Screen Implementation

### 2.1 Admin Screens
- **SCR-ADM-002 (Permissions)**:
  - Use `DataGrid` for Permission Matrix.
  - Rows = Permissions, Columns = Roles.
  - Interactive Checkboxes.
- **SCR-ADM-003 (Audit)**:
  - Table with JSON diff viewer for `details` column.
- **SCR-ADM-004 (Settings)**:
  - Dynamic form generator based on `setting.type`.

### 2.2 Insurance Screens
- **SCR-INS-002 (Contracts)**:
  - Clean data table with Status badges.
- **SCR-INS-004 (Claims)**:
  - Kanban or List view for Claim status.

## 3. Component Reusability
- `MasterDataTable`: Generic table for Master Data screens (VehicleModel, etc.).
- `StatusBadge`: Unified status colors across modules.
