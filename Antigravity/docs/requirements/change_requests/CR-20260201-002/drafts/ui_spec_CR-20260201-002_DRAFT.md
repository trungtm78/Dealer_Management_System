# UI Specification v1.x (Draft for CR-20260201-002)

**Status**: DRAFT
**Related CR**: CR-20260201-002 (Navigation Menu)

---

## I. Global UI Standards
(Retained)

## II. Component Registry
(Retained)

## III. Screen Mappings
(Retained)

## IV. Navigation Structure & Sitemap (NEW)

### 1. Navigation Principles
- **Sidebar Layout**: Fixed left sidebar, collapsible.
- **Grouping**: Logical grouping by Business Module.
- **Access Control**: Menu items hidden if user lacks permission.

### 2. Sitemap Definition

#### A. Master Data Group
*Required Permission: `master.view` OR `admin`*
- **Vehicle Models**
  - Route: `/master/vehicle-models`
  - Icon: `Car` (Lucide)
- **Accessories**
  - Route: `/master/accessories`
  - Icon: `Package`
- **Service Catalog**
  - Route: `/master/services`
  - Icon: `Wrench`
- **Service Bays**
  - Route: `/master/bays`
  - Icon: `Grid`

#### B. Insurance Group
*Required Permission: `insurance.view`*
- **Dashboard**
  - Route: `/insurance/dashboard`
  - Icon: `BarChart2`
- **Contracts**
  - Route: `/insurance/contracts`
  - Icon: `FileText`
- **Claims**
  - Route: `/insurance/claims`
  - Icon: `ShieldAlert`

#### C. Admin Group
*Required Permission: `admin.view`*
- **User Management**
  - Route: `/admin/users`
  - Icon: `Users`
- **Permissions (RBAC)**
  - Route: `/admin/permissions`
  - Icon: `Lock`
- **Audit Logs**
  - Route: `/admin/audit-logs`
  - Icon: `FileClock`
- **System Settings**
  - Route: `/admin/settings`
  - Icon: `Settings`
- **Monitoring**
  - Route: `/admin/monitoring`
  - Icon: `Activity`

### 3. Implementation Guidelines
- Use `SidebarGroup` component for collapsibles.
- Use `SidebarItem` for leaf nodes.
- Integate with `usePermission()` hook:
  ```tsx
  {hasPermission('insurance.view') && (
    <SidebarGroup title="Insurance">...</SidebarGroup>
  )}
  ```

---

## Change Log
| Version | Changes |
|---------|---------|
| 1.2 (Draft) | Added Section IV: Navigation Structure (CR-20260201-002) |
