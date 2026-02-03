# HANDOVER TO OPENCODE: CR-20260202-002

**CR ID:** CR-20260202-002
**Title:** Master Data UI/UX & Navigation Gap Completion
**Status:** READY_FOR_IMPLEMENTATION
**Date:** 2026-02-02

## 1. MISSION
Implement the comprehensive Master Data UI/UX and Navigation structure. This involves building ~25 new screens for secondary master data (Versions, Colors, Departments, Locations, etc.) and implementing their corresponding API endpoints and database tables.

## 2. SOURCES OF TRUTH (Read These ONLY)
- **Functional Requirements**: `docs/requirements/FRD/frd_master_data_v1.3.md`
- **Database Schema**: `docs/design/database/erd/erd_master_data_v1.3.md`
- **API Specification**: `docs/design/api/api_spec_master_data_v1.3.md`
- **UI Specification**: `docs/design/ui/ui_spec_master_data_v1.3.md`

## 3. SUMMARY OF CHANGES

### 3.1 Frontend (UI/UX)
- **Navigation**: Implement the 5-group "Master Data" sidebar menu as defined in UI Spec v1.3.
- **Screens**: Implement "Standard Master Layout" (List + Drawer) for:
    - **Vehicle**: Versions, Colors, Specs.
    - **Employee**: Departments, Positions, Levels.
    - **Supplier**: Contacts, Contracts.
    - **System**: Locations, Banks, Payment Methods, UOMs, Warehouses.
- **Components**: Reuse standard `DataTable`, `FilterBar`, and `SlideOver` components.

### 3.2 Backend (API)
- **Endpoints**: Implement ~25 new CRUD resource sets (GET/POST/PUT/DELETE) matching API Spec v1.3.
- **Logic**: Ensure `GET /api/master/employees/[id]` returns expanded objects for Department/Position.

### 3.3 Database
- **Migrations**: Create new tables:
    - `VehicleVersion`, `VehicleColor`, `VehicleSpec`
    - `MasterDepartment`, `MasterPosition`, `MasterLevel`
    - `SupplierContact`, `SupplierContract`
    - `MasterProvince`, `MasterDistrict`, `MasterWard`
    - `MasterBank`, `MasterPaymentMethod`
- **Relationships**: Ensure Foreign Keys are correctly set up as per ERD v1.3.

## 4. IMPLEMENTATION ORDER
1. **DB**: Run prompt #06 with ERD v1.3.
2. **API**: Run prompt #07 with API Spec v1.3.
3. **Frontend**: Run prompt #09 with UI Spec v1.3.

## 5. TEST FOCUS
- **Navigation**: Verify clicking menu items loads correct screens.
- **Hierarchy**: Verify Department/Location dropdowns work (e.g., selecting Province filters District).
- **CRUD**: Verify Create/Edit works for all new entities.
