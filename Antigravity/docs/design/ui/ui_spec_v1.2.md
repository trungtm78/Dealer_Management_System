# UI Specification v1.2

**Version**: 1.2
**Date**: 2026-02-01
**Status**: Ready
**Related CR**: CR-20260201-002 (Navigation)

---

## I. Global UI Standards
(See v1.0)

## II. Component Registry Updates
(See v1.1)

## III. Screen Mappings
(See v1.1)

## IV. Navigation Structure & Sitemap

### 1. Navigation Principles
- **Sidebar Layout**: Fixed left sidebar, collapsible.
- **Grouping**: Logical grouping by Business Module.
- **Access Control**: Menu items hidden if user lacks permission.

### 2. Sitemap Definition

#### A. Master Data Group
*Required Permission: `master.view` OR `admin`*
- **Vehicle Models** (`/master/vehicle-models`) - Icon: `Car`
- **Accessories** (`/master/accessories`) - Icon: `Package`
- **Service Catalog** (`/master/services`) - Icon: `Wrench`
- **Service Bays** (`/master/bays`) - Icon: `Grid`

#### B. Insurance Group
*Required Permission: `insurance.view`*
- **Dashboard** (`/insurance/dashboard`) - Icon: `BarChart2`
- **Contracts** (`/insurance/contracts`) - Icon: `FileText`
- **Claims** (`/insurance/claims`) - Icon: `ShieldAlert`

#### C. Admin Group
*Required Permission: `admin.view`*
- **User Management** (`/admin/users`) - Icon: `Users`
- **Permissions** (`/admin/permissions`) - Icon: `Lock`
- **Audit Logs** (`/admin/audit-logs`) - Icon: `FileClock`
- **System Settings** (`/admin/settings`) - Icon: `Settings`
- **Monitoring** (`/admin/monitoring`) - Icon: `Activity`

---

## Change Log
| Version | Changes |
|---------|---------|
| 1.2 | Added Detailed Navigation Structure (CR-20260201-002). |
| 1.1 | Added components for CR-20250131-002. |
| 1.0 | Initial UI Spec. |
