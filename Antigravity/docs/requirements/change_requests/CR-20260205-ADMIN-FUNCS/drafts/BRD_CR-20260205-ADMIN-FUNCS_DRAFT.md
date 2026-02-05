# BRD v2.5

**Version**: 2.5
**Date**: 2026-02-04
**Status**: ACTIVE
**Previous**: v2.4

(Includes all v2.4 content)

## 5.8 Module 09: Master Data Management
**Goal**: Manage standardized data for Vehicles, Services, Accessories, and System entities.

| Req ID | Requirement | Description |
|--------|-------------|-------------|
| **BR-MD-001** | Vehicle Model Management | Manage standard list of models (Name, Type, Year). |
| **BR-MD-002** | Accessories Catalog | Manage list of accessories. |
| **BR-MD-003** | Service Catalog | Manage standard services. |
| **BR-MD-004** | Service Bays | Manage list of repair bays. |
| **BR-MD-005** | Employee Management | Manage employee profiles. |
<!-- CR-20260205-ADMIN-FUNCS: ADDED -->
| **BR-MD-005-01** | Employee CRUD | Create, Read, Update, Delete employee records with full_name, email, department, position, level. |
| **BR-MD-005-02** | Structure Management | Manage Key Lists: Departments, Positions, Levels via UI (not database tools). |
| **BR-MD-005-03** | User Linking | Link employees to user accounts for system access. |
| **BR-MD-005-04** | Lifecycle Management | Automated warnings when terminated employees have active user accounts. |
<!-- END CR-20260205-ADMIN-FUNCS -->
| **BR-MD-006** | Supplier Management | Manage supplier profiles. |
| **BR-MD-007** | Inventory Master | Manage standard Units of Measure (UOM). |
| **BR-MD-008** | Common Master | Manage system-wide lists. |

## 5.9 System-Wide Requirements
| Req ID | Requirement | Description |
|--------|-------------|-------------|
| **BR-SYS-001** | Smart Search Dropdowns | All Foreign Key selection inputs must support real-time search (contains logic), pagination, and create-in-place functionality. UX must align with Odoo behavior. |
