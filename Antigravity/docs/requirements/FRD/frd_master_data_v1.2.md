# Functional Requirements Document: Master Data Management

## Module Information
- **Module**: Master Data Management
- **Version**: 1.2
- **Created**: 31/01/2026
- **Updated**: 02/02/2026
- **Updated by**: CR-20260202-001 (Emergency Master Data)
- **Author**: Antigravity - Business Analyst
- **Project**: Honda SPICE ERP System

---

## 📋 Mục Lục

1. [Module Overview](#1-module-overview)
2. [Functional Requirements](#2-functional-requirements)
3. [Validation Rules](#3-validation-rules)
4. [Permission Matrix](#4-permission-matrix)
5. [Integration Points](#5-integration-points)
6. [Traceability](#6-traceability)

---

## 1. Module Overview

### 1.1 Scope

Master Data Management module quản lý các danh mục chuẩn trong hệ thống Honda SPICE ERP.

**Current Scope** (CR-MD-001):
- ✅ VehicleModel Master Data

**Enhanced Scope** (CR-MD-002/003/004):
- ✅ VehicleModel Master Data (CR-MD-001)
- ✅ Accessory Master Data (CR-MD-002)
- ✅ ServiceCatalog Master Data (CR-MD-003)
- ✅ Other Masters: ServiceBay, ScoringRule, SystemSetting (CR-MD-004)

**Emergency Scope** (CR-20260202-001):
- ✅ Employee Management
- ✅ Supplier Management
- ✅ Inventory Masters (Warehouse, UOM)

### 1.2 Business Context

Master Data là nền tảng của data consistency trong toàn bộ hệ thống. Thay vì nhập tay, users sẽ chọn từ dropdown, đảm bảo:
- 100% data consistency (no typos)
- Faster data entry
- Accurate reporting
- Centralized pricing management

---

## 2. Functional Requirements

### FR-MD-001: VehicleModel Management

**Source**: CR-MD-001  
**Priority**: CRITICAL (P0)  
**Actors**: Admin (CRUD), Sales/Service (Read only)

*(Existing requirements from v1.0)*

---

### FR-MD-002: Accessory Management

**Source**: CR-MD-002  
**Priority**: CRITICAL (P0)  
**Actors**: Admin (CRUD), Sales/Service (Read only)

---

#### FR-MD-002-01: Create Accessory

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.CREATE

**Main Flow**:
1. Admin navigates to `/master/accessories`
2. Admin clicks "+ New" button
3. System displays Create Accessory dialog
4. System auto-generates `accessory_code`:
   - Format: `ACC-XXX`
   - Example: `ACC-001`, `ACC-002`
   - Auto-increment XXX
5. Admin enters required fields:
   - `accessory_name` (text input, required)
   - `category` (dropdown: INTERIOR/EXTERIOR/TECH/SAFETY, required)
   - `price` (currency input VND, required)
   - `compatible_models` (multi-select from VehicleModel, optional)
   - `installation_required` (checkbox, default false)
   - `warranty_period_months` (number, optional, default 12)
   - `status` (radio: ACTIVE/INACTIVE, default ACTIVE)
6. Admin clicks "Save" button
7. System validates inputs:
   - `accessory_name`: not empty, max 200 chars, unique (case-insensitive)
   - `category`: must be valid enum value
   - `price`: must be > 0
   - `compatible_models`: must be valid VehicleModel IDs
8. If validation passes:
   - System creates Accessory record
   - System logs to `activity_logs` table
   - System displays success message: "Accessory created successfully"
   - System closes dialog
   - System refreshes table to show new record
9. If validation fails:
   - System displays error messages inline
   - System keeps dialog open for corrections

**Postconditions**:
- Accessory created with status = ACTIVE (or as selected)
- Audit log entry created with action = CREATE
- Accessory available in dropdowns across system (Sales Quotation)

**Validation Rules**: VR-MD-005, VR-MD-006, VR-MD-007, VR-MD-008

---

#### FR-MD-002-02: Read Accessory List

**Preconditions**:
- User is authenticated
- User has permission: MASTER_DATA.READ

**Main Flow**:
1. User navigates to `/master/accessories`
2. System displays Accessory table with columns:
   - Accessory Code (sortable)
   - Accessory Name (sortable)
   - Category (filterable, badge display)
   - Price (sortable, currency format)
   - Compatible Models (comma-separated list)
   - Installation Required (boolean icon)
   - Warranty Period (months)
   - Status (filterable, badge display)
   - Actions (Edit, Delete icons)
3. System loads data:
   - Default sort: `created_at DESC` (newest first)
   - Default filter: `status = ACTIVE`
   - Pagination: 20 items per page
4. User can interact with table:
   - Click column headers to sort
   - Use search box to filter
   - Use category/status dropdowns to filter
   - Click row to view details (optional)
   - Click Edit icon to modify
   - Click Delete icon to soft delete

**Postconditions**:
- User sees current list of Accessories
- Filters and sort preferences saved in URL query params

---

#### FR-MD-002-03: Update Accessory

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.UPDATE
- Accessory exists

**Main Flow**:
1. Admin clicks Edit icon (✎) on an Accessory row
2. System displays Edit Accessory dialog
3. System pre-fills form with current values:
   - `accessory_code` (read-only, grayed out)
   - `accessory_name` (editable)
   - `category` (editable)
   - `price` (editable)
   - `compatible_models` (editable)
   - `installation_required` (editable)
   - `warranty_period_months` (editable)
   - `status` (editable)
4. Admin modifies fields (except accessory_code)
5. Admin clicks "Save" button
6. System validates inputs (same as Create)
7. If validation passes:
   - System updates Accessory record
   - If price changed: Log to accessory_price_history table
   - System logs to `activity_logs` with old_value and new_value
   - System displays success message: "Accessory updated successfully"
   - System closes dialog
   - System refreshes table
8. If validation fails:
   - System displays error messages
   - System keeps dialog open

**Postconditions**:
- Accessory updated with new values
- Price changes logged to history
- Audit log entry created with action = UPDATE
- Changes reflected in all dropdowns immediately

**Validation Rules**: VR-MD-006, VR-MD-007, VR-MD-008

---

#### FR-MD-002-04: Delete Accessory (Soft Delete)

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.DELETE
- Accessory exists

**Main Flow**:
1. Admin clicks Delete icon (🗑) on an Accessory row
2. System displays confirmation dialog:
   - Title: "Deactivate Accessory?"
   - Message: "This will set the accessory status to INACTIVE. The accessory will no longer appear in dropdowns but historical data will be preserved."
   - Buttons: "Cancel", "Deactivate"
3. Admin clicks "Deactivate" button
4. System performs soft delete:
   - SET `status` = 'INACTIVE'
   - SET `deleted_at` = NOW()
   - NOT hard delete (preserve record)
5. System logs to `activity_logs` with action = DELETE
6. System displays success message: "Accessory deactivated successfully"
7. System refreshes table (record disappears if filter = ACTIVE only)

**Postconditions**:
- Accessory status = INACTIVE
- `deleted_at` timestamp set
- Audit log entry created
- Accessory no longer appears in dropdowns (filtered by status = ACTIVE)
- Historical data preserved (Quotation still reference this accessory)

---

#### FR-MD-002-05: Manage Compatibility Matrix

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.UPDATE

**Main Flow**:
1. Admin clicks "Compatibility Matrix" button on Accessory page
2. System displays Compatibility Matrix dialog:
   - Title: "Accessory Compatibility Matrix"
   - Layout: Grid with Accessories as rows, VehicleModels as columns
   - Cells: Checkboxes (checked = compatible)
3. System loads current compatibility data:
   - Rows: All active Accessories
   - Columns: All active VehicleModels
   - Check state: From accessory_model_compatibility table
4. Admin can modify compatibility:
   - Click individual checkboxes to toggle
   - "Select All Models" button for an accessory row
   - "Select All Accessories" button for a model column
   - "Clear All" button to reset all selections
5. Admin clicks "Save Compatibility Matrix" button
6. System validates:
   - At least 1 model selected per accessory
   - All selected models are active
7. If validation passes:
   - System deletes existing compatibility records for updated accessories
   - System inserts new compatibility records
   - System logs to `activity_logs`
   - System displays success message: "Compatibility matrix updated successfully"
   - System closes dialog
8. If validation fails:
   - System displays error: "Each accessory must be compatible with at least 1 vehicle model"
   - System keeps dialog open for corrections

**Postconditions**:
- Accessory-model compatibility updated
- Audit log entry created with action = UPDATE
- New compatibility available for quotation selection

**Validation Rules**: VR-MD-009

---

#### FR-MD-002-06: View Pricing History

**Preconditions**:
- User is authenticated
- User has permission: MASTER_DATA.READ
- Accessory exists

**Main Flow**:
1. Admin clicks View History icon on Accessory row (or in Edit dialog)
2. System displays Pricing History dialog:
   - Title: "Pricing History - [Accessory Name]"
   - Layout: Timeline view
   - Columns: Date, Old Price, New Price, Changed By, Change %, Notes
3. System loads pricing history:
   - From accessory_price_history table
   - Sort by changed_at DESC (newest first)
   - Format prices as currency (VND)
   - Calculate percentage change
4. System displays summary:
   - Current price: [Current Price]₫
   - Price changes: X changes since creation
   - Price range: [Min Price]₫ - [Max Price]₫
5. User can filter history:
   - Date range picker
   - "Apply Filter" button
6. User can export history:
   - "Export to Excel" button
   - Download .xlsx file with history data

**Postconditions**:
- Pricing history displayed with full audit trail
- All price changes tracked and visible
- Export capability for reporting

---

#### FR-MD-002-07: Search Accessory

**Preconditions**:
- User is on `/master/accessories` page
- User has permission: MASTER_DATA.READ

**Main Flow**:
1. User types in search box (placeholder: "Search by accessory name or code...")
2. System waits for 300ms after last keystroke (debounce)
3. System performs search:
   - Match against: `accessory_name` OR `accessory_code`
   - Match type: Partial match, case-insensitive
   - Example: "mat" matches "Floor Mat Premium", "ACC-001" (if contains "mat")
4. System updates table with filtered results
5. System shows result count: "Showing X results for 'search term'"
6. If no results found:
   - System displays: "No accessories found matching 'search term'"
   - System shows "Clear search" button

**Postconditions**:
- Table shows only matching records
- Search term saved in URL query param
- Other filters (category, status) still applied (AND logic)

---

#### FR-MD-002-08: Filter Accessory

**Preconditions**:
- User is on `/master/accessories` page
- User has permission: MASTER_DATA.READ

**Main Flow**:
1. User selects filter options:
   - **Category Filter** (multi-select dropdown):
     * Options: All, INTERIOR, EXTERIOR, TECH, SAFETY
     * Default: All selected
     * Can select multiple
   - **Status Filter** (single-select dropdown):
     * Options: All, ACTIVE, INACTIVE
     * Default: ACTIVE only
     * Single selection
   - **Installation Required Filter** (single-select dropdown):
     * Options: All, Yes, No
     * Default: All selected
2. System applies filters immediately on selection
3. System combines filters with AND logic:
   - Example: Category (INTERIOR, EXTERIOR) AND Status (ACTIVE) AND Installation (Yes)
4. System updates table with filtered results
5. System shows filter summary: "Filtered by: Category (INTERIOR, EXTERIOR), Status (ACTIVE), Installation (Yes)"

**Postconditions**:
- Table shows only records matching all filter criteria
- Filters saved in URL query params
- Search still applied if active (AND logic)

---

#### FR-MD-002-09: Import/Export Accessory

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.IMPORT/EXPORT

**Main Flow**:
1. Admin clicks "Import Excel" button
2. System displays Import dialog
3. System shows "Download Template" button
4. Admin clicks "Download Template":
   - System downloads `accessory_template.xlsx`
   - Template columns: Accessory Code (optional), Accessory Name*, Category*, Price*, Compatible Models
5. Admin clicks "Choose File" and selects .xlsx file
6. Admin clicks "Upload" button
7. System validates file:
   - File type: .xlsx only
   - File size: < 10MB
   - Column headers match template
8. System parses and validates each row:
   - `accessory_code`: If empty, auto-generate; if provided, check unique
   - `accessory_name`: Required, max 200 chars, unique
   - `category`: Required, must be INTERIOR/EXTERIOR/TECH/SAFETY
   - `price`: Required, must be number > 0
   - `compatible_models`: Optional, must be valid VehicleModel names
9. System displays preview table:
   - Valid rows: Green checkmark
   - Invalid rows: Red X with error message
   - Summary: "X valid rows, Y invalid rows"
10. Admin reviews preview
11. Admin clicks "Import Valid Rows" button
12. System imports only valid rows:
   - Create Accessory records
   - Create compatibility matrix entries
   - Log to activity_logs (action = IMPORT)
13. System displays summary:
   - "Successfully imported X accessories"
   - "Failed to import Y accessories (see errors below)"
   - Download error report (.xlsx with error details)

**Export Flow**:
1. User clicks "Export Excel" button
2. System generates .xlsx file:
    - Filename: `accessories_YYYYMMDD_HHMMSS.xlsx`
    - Include: All visible rows (after filters applied)
    - Columns: Accessory Code, Accessory Name, Category, Price, Compatible Models, Installation Required, Warranty Period, Status, Created At, Updated At
    - Format: Currency for price, Date for timestamps
3. System downloads file to user's browser
4. System logs export action to activity_logs

**Postconditions**:
- Valid Accessories created
- Compatibility matrix updated
- Audit log entries created for import/export
- Error report available for download
- Table refreshed to show new records

**Validation Rules**: VR-MD-005, VR-MD-006, VR-MD-007, VR-MD-008

---

### FR-MD-003: ServiceCatalog Management

**Source**: CR-MD-003  
**Priority**: CRITICAL (P0)  
**Actors**: Admin (CRUD), Service Advisor/Sales (Read only)

---

#### FR-MD-003-01: Create ServiceCatalog

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.CREATE

**Main Flow**:
1. Admin navigates to `/master/services`
2. Admin clicks "+ New" button
3. System displays Create ServiceCatalog dialog
4. System auto-generates `service_code`:
   - Format: `SVC-XXX`
   - Example: `SVC-001`, `SVC-002`
   - Auto-increment XXX
5. Admin enters required fields:
   - `service_name` (text input, required)
   - `category` (dropdown: MAINTENANCE/REPAIR/INSPECTION/BODYWORK, required)
   - `labor_hours` (decimal input, required)
   - `labor_rate` (currency input VND/hour, required)
   - `parts_required` (multi-select from Parts, optional)
   - `recommended_interval_km` (number input, optional)
   - `status` (radio: ACTIVE/INACTIVE, default ACTIVE)
6. System auto-calculates `total_cost` in real-time:
   - Formula: `(labor_hours * labor_rate) + sum(parts.price)`
   - Display as currency format
7. Admin clicks "Save" button
8. System validates inputs:
   - `service_name`: not empty, max 200 chars, unique (case-insensitive)
   - `category`: must be valid enum value
   - `labor_hours`: must be > 0 and ≤ 100
   - `labor_rate`: must be > 0
   - `parts_required`: must be valid Part IDs
9. If validation passes:
   - System creates ServiceCatalog record
   - System logs to `activity_logs` table
   - System displays success message: "Service created successfully"
   - System closes dialog
   - System refreshes table to show new record
10. If validation fails:
    - System displays error messages inline
    - System keeps dialog open for corrections

**Postconditions**:
- ServiceCatalog created with status = ACTIVE (or as selected)
- Audit log entry created with action = CREATE
- Service available in dropdowns across system (Service RO, Quotation)

**Validation Rules**: VR-MD-010, VR-MD-011, VR-MD-012, VR-MD-013

---

#### FR-MD-003-02: Read ServiceCatalog List

**Preconditions**:
- User is authenticated
- User has permission: MASTER_DATA.READ

**Main Flow**:
1. User navigates to `/master/services`
2. System displays ServiceCatalog table with columns:
   - Service Code (sortable)
   - Service Name (sortable)
   - Category (filterable, badge display)
   - Labor Hours (sortable)
   - Labor Rate (sortable, currency format)
   - Parts Required (comma-separated list)
   - Total Cost (sortable, currency format)
   - Recommended Interval (km)
   - Status (filterable, badge display)
   - Actions (Edit, Delete icons)
3. System loads data:
   - Default sort: `category ASC`, `service_name ASC`
   - Default filter: `status = ACTIVE`
   - Pagination: 20 items per page
4. System displays total cost calculation for each row:
   - Format: "(Labor: X hours × Y rate) + Parts: Z = Total"
   - Auto-calculated in real-time
5. User can interact with table:
   - Click column headers to sort
   - Use search box to filter
   - Use category/status dropdowns to filter
   - Click row to view details (optional)
   - Click Edit icon to modify
   - Click Delete icon to soft delete

**Postconditions**:
- User sees current list of Services
- Filters and sort preferences saved in URL query params
- Total cost calculations visible for each service

---

#### FR-MD-003-03: Update ServiceCatalog

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.UPDATE
- ServiceCatalog exists

**Main Flow**:
1. Admin clicks Edit icon (✎) on a ServiceCatalog row
2. System displays Edit ServiceCatalog dialog
3. System pre-fills form with current values:
   - `service_code` (read-only, grayed out)
   - `service_name` (editable)
   - `category` (editable)
   - `labor_hours` (editable)
   - `labor_rate` (editable)
   - `parts_required` (editable)
   - `recommended_interval_km` (editable)
   - `status` (editable)
4. System displays real-time cost calculation:
   - Shows breakdown: Labor Cost + Parts Cost = Total Cost
   - Updates automatically when fields change
5. Admin modifies fields (except service_code)
6. Admin clicks "Save" button
7. System validates inputs (same as Create)
8. If validation passes:
   - System updates ServiceCatalog record
   - System logs to `activity_logs` with old_value and new_value
   - System displays success message: "Service updated successfully"
   - System closes dialog
   - System refreshes table
9. If validation fails:
   - System displays error messages
   - System keeps dialog open

**Postconditions**:
- ServiceCatalog updated with new values
- Audit log entry created with action = UPDATE
- Changes reflected in all dropdowns immediately

**Validation Rules**: VR-MD-011, VR-MD-012, VR-MD-013

---

#### FR-MD-003-04: Delete ServiceCatalog (Soft Delete)

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.DELETE
- ServiceCatalog exists

**Main Flow**:
1. Admin clicks Delete icon (🗑) on a ServiceCatalog row
2. System displays confirmation dialog:
   - Title: "Deactivate Service?"
   - Message: "This will set the service status to INACTIVE. The service will no longer appear in dropdowns but historical data will be preserved."
   - Buttons: "Cancel", "Deactivate"
3. Admin clicks "Deactivate" button
4. System performs soft delete:
   - SET `status` = 'INACTIVE'
   - SET `deleted_at` = NOW()
   - NOT hard delete (preserve record)
5. System logs to `activity_logs` with action = DELETE
6. System displays success message: "Service deactivated successfully"
7. System refreshes table (record disappears if filter = ACTIVE only)

**Postconditions**:
- ServiceCatalog status = INACTIVE
- `deleted_at` timestamp set
- Audit log entry created
- Service no longer appears in dropdowns (filtered by status = ACTIVE)
- Historical data preserved (Repair Orders still reference this service)

---

#### FR-MD-003-05: Build Service Package

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.CREATE

**Main Flow**:
1. Admin clicks "+ Create Package" button on ServiceCatalog page
2. System displays Service Package Builder dialog:
   - Title: "Create Service Package"
   - Layout: Multi-column form with real-time calculation
3. Admin enters package information:
   - `package_name` (text input, required)
   - `services` (multi-select from ServiceCatalog, required)
   - `discount_percentage` (slider: 0-50%, default 0)
4. System auto-calculates pricing:
   - Base Price = Sum of selected services' total costs
   - Discount Amount = Base Price × (discount_percentage / 100)
   - Total Price = Base Price - Discount Amount
   - Display all calculations in real-time
5. System shows preview of selected services:
   - List with individual prices
   - Running total
   - Discount applied
   - Final package price
6. Admin adjusts discount percentage:
   - Slider: 0% ◄─────●─────► 50%
   - Real-time price updates
7. Admin clicks "Create Package" button
8. System validates:
   - Package name not empty, max 200 chars, unique
   - At least 2 services selected
   - Discount percentage between 0-50
9. If validation passes:
   - System creates service_packages record
   - System creates service_package_items records (one per service)
   - System logs to `activity_logs`
   - System displays success message: "Service package created successfully"
   - System closes dialog
   - System refreshes table to show new package
10. If validation fails:
    - System displays error messages inline
    - System keeps dialog open for corrections

**Postconditions**:
- Service package created with bundled services
- Pricing calculated with discount
- Package available for selection in Repair Orders and Quotations
- Audit log entry created with action = CREATE

**Validation Rules**: VR-MD-014

---

#### FR-MD-003-06: Search ServiceCatalog

**Preconditions**:
- User is on `/master/services` page
- User has permission: MASTER_DATA.READ

**Main Flow**:
1. User types in search box (placeholder: "Search by service name or code...")
2. System waits for 300ms after last keystroke (debounce)
3. System performs search:
   - Match against: `service_name` OR `service_code`
   - Match type: Partial match, case-insensitive
   - Example: "oil" matches "Oil Change", "SVC-001" (if contains "oil")
4. System updates table with filtered results
5. System shows result count: "Showing X results for 'search term'"
6. If no results found:
   - System displays: "No services found matching 'search term'"
   - System shows "Clear search" button

**Postconditions**:
- Table shows only matching records
- Search term saved in URL query param
- Other filters (category, status) still applied (AND logic)

---

#### FR-MD-003-07: Filter ServiceCatalog

**Preconditions**:
- User is on `/master/services` page
- User has permission: MASTER_DATA.READ

**Main Flow**:
1. User selects filter options:
   - **Category Filter** (multi-select dropdown):
     * Options: All, MAINTENANCE, REPAIR, INSPECTION, BODYWORK
     * Default: All selected
     * Can select multiple
   - **Status Filter** (single-select dropdown):
     * Options: All, ACTIVE, INACTIVE
     * Default: ACTIVE only
     * Single selection
   - **Labor Hours Filter** (range input):
     * Min hours, Max hours
     * Default: No filter
2. System applies filters immediately on selection
3. System combines filters with AND logic:
   - Example: Category (MAINTENANCE) AND Status (ACTIVE) AND Labor Hours (0.5-2.0)
4. System updates table with filtered results
5. System shows filter summary: "Filtered by: Category (MAINTENANCE), Status (ACTIVE), Labor Hours (0.5-2.0)"

**Postconditions**:
- Table shows only records matching all filter criteria
- Filters saved in URL query params
- Search still applied if active (AND logic)

---

#### FR-MD-003-08: Real-time Pricing Calculator

**Preconditions**:
- User is viewing ServiceCatalog form (Create/Edit)
- User has permission: MASTER_DATA.READ

**Main Flow**:
1. User is on ServiceCatalog form
2. System displays pricing calculator section:
   - Title: "Pricing Calculator"
   - Layout: Breakdown table
3. System shows calculation breakdown:
   ```
   Labor Cost:   [1.5] hours × [200,000]₫/hour = [300,000]₫
   Parts Cost:   [Oil Filter: 50,000₫] + [Engine Oil: 150,000₫] = [200,000]₫
   ──────────────────────────────────────────────────────────
   Total Cost:                                        [500,000]₫
   ```
4. System updates calculations in real-time:
   - When labor_hours changes → Recalculate Labor Cost and Total
   - When labor_rate changes → Recalculate Labor Cost and Total
   - When parts added/removed → Recalculate Parts Cost and Total
5. System displays all calculations with currency formatting
6. System highlights the Total Cost field

**Postconditions**:
- Real-time pricing calculation displayed
- Users can see exactly how pricing is calculated
- Transparency in service pricing

---

#### FR-MD-003-09: Manage Service Package

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.UPDATE

**Main Flow**:
1. User navigates to `/master/service-packages` (or tab on Service page)
2. System displays Service Packages table:
   - Columns: Package Code, Package Name, Services Count, Base Price, Discount, Total Price, Status, Actions
3. System loads all service packages
4. User can:
   - View package details
   - Edit package (change services, discount)
   - Delete package (soft delete)
   - View package breakdown
5. Admin clicks Edit icon on package
6. System displays Edit Package dialog:
   - Pre-filled with current package data
   - Can modify services selection
   - Can adjust discount percentage
   - Real-time price updates
7. Admin makes changes and clicks "Update Package"
8. System validates and updates:
   - Update service_packages record
   - Delete old service_package_items
   - Insert new service_package_items
   - Log to activity_logs

**Postconditions**:
- Service packages managed effectively
- Pricing updated in real-time
- Audit trail maintained for package changes

---

#### FR-MD-003-10: Import/Export ServiceCatalog

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.IMPORT/EXPORT

**Main Flow**:
1. Admin clicks "Import Excel" button on Service page
2. System displays Import dialog
3. System shows "Download Template" button
4. Amin clicks "Download Template":
   - System downloads `service_catalog_template.xlsx`
   - Template columns: Service Code (optional), Service Name*, Category*, Labor Hours*, Labor Rate*, Parts Required, Interval (km)
5. Admin clicks "Choose File" and selects .xlsx file
6. Admin clicks "Upload" button
7. System validates file:
   - File type: .xlsx only
   - File size: < 10MB
   - Column headers match template
8. System parses and validates each row:
   - `service_code`: If empty, auto-generate; if provided, check unique
   - `service_name`: Required, max 200 chars, unique
   - `category`: Required, must be MAINTENANCE/REPAIR/INSPECTION/BODYWORK
   - `labor_hours`: Required, > 0, ≤ 100
   - `labor_rate`: Required, > 0
   - `parts_required`: Optional, must be valid Part names
9. System displays preview table:
   - Valid rows: Green checkmark
   - Invalid rows: Red X with error message
   - Summary: "X valid rows, Y invalid rows"
10. Admin reviews preview
11. Admin clicks "Import Valid Rows" button
12. System imports only valid rows:
    - Create ServiceCatalog records
    - Create service-parts relationships if parts specified
    - Log to activity_logs (action = IMPORT)
13. System displays summary:
    - "Successfully imported X services"
    - "Failed to import Y services (see errors below)"
    - Download error report (.xlsx with error details)

**Export Flow**:
1. User clicks "Export Excel" button
2. System generates .xlsx file:
    - Filename: `service_catalog_YYYYMMDD_HHMMSS.xlsx`
    - Include: All visible rows (after filters applied)
    - Columns: Service Code, Service Name, Category, Labor Hours, Labor Rate, Parts Required, Recommended Interval, Status, Created At, Updated At
    - Format: Currency for labor_rate, Decimal for labor_hours
3. System downloads file to user's browser
4. System logs export action to activity_logs

**Postconditions**:
- Valid ServiceCatalogs created
- Audit log entries created for import/export
- Error report available for download
- Table refreshed to show new services

**Validation Rules**: VR-MD-010, VR-MD-011, VR-MD-012, VR-MD-013

---

### FR-MD-004: Other Masters Management

**Source**: CR-MD-004  
**Priority**: HIGH (P1)  
**Actors**: Admin (CRUD), Service Manager/Sales Manager (Read only)

---

#### FR-MD-004-01: Manage ServiceBay

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.CREATE

**Main Flow**:
1. Admin navigates to `/master/service-bays`
2. System displays ServiceBay table with columns:
   - Name, Location, Capacity, Equipment, Status, Availability, Utilization, Actions
3. Admin clicks "+ New" button
4. System displays Create ServiceBay dialog:
   - Fields: name (required), location (optional), capacity (optional), equipment (JSON array), status (default ACTIVE), is_available (default true)
5. Admin enters service bay information:
   - Name: e.g., "Bay 1", "Bay 2"
   - Location: e.g., "Area A", "Area B"
   - Capacity: Max vehicles (default 1)
   - Equipment: Multi-select with custom input options
6. Admin clicks "Save" button
7. System validates and creates ServiceBay
8. System refreshes table with utilization metrics:
   - Current assignments count
   - Utilization percentage: (current / capacity) × 100
   - Status indicators: AVAILABLE, FULL, MAINTENANCE

**Postconditions**:
- ServiceBay created with capacity tracking
- Utilization metrics calculated and displayed
- Service bays available for appointment scheduling

**Validation Rules**: VR-MD-015

---

#### FR-MD-004-02: View Bay Utilization

**Preconditions**:
- User is authenticated
- User has permission: MASTER_DATA.READ

**Main Flow**:
1. User is on ServiceBay page
2. System displays utilization dashboard:
   - Overall bay utilization percentage
   - Individual bay status cards:
     ```
     Bay 1: 2/3 vehicles (67% utilization) [AVAILABLE]
     Bay 2: 3/3 vehicles (100% utilization) [FULL]
     Bay 3: 0/2 vehicles (0% utilization) [AVAILABLE]
     ```
   - Color coding: Green (available), Red (full), Yellow (maintenance)
3. System shows current assignments:
   - List of appointments/repair orders assigned to each bay
   - Estimated completion times
4. System shows utilization chart:
   - Daily/weekly/Monthly utilization trends
   - Peak hours analysis

**Postconditions**:
- Real-time bay utilization visibility
- Data-driven scheduling decisions
- Capacity planning insights

---

#### FR-MD-004-03: Manage ScoringRule

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.CREATE

**Main Flow**:
1. Admin navigates to `/master/scoring-rules`
2. System displays ScoringRule table with columns:
   - Rule Name, Category, Field, Operator, Value, Points, Status, Actions
3. Admin clicks "+ New" button
4. System displays Visual Rule Builder dialog:
   - JSON editor with syntax highlighting (Monaco editor)
   - Form fields for basic properties
   - Test simulator section
5. Admin creates scoring rule:
   - Rule Name: e.g., "High Budget Lead"
   - Category: e.g., "BUDGET"
   - Condition: JSON structure
   ```json
   {
     "field": "budget",
     "operator": ">=",
     "value": 500000000,
     "points": 20,
     "is_active": true
   }
   ```
   - Supported fields: budget, source, model_interest, contact_method
   - Supported operators: =, !=, >, <, >=, <=, contains, in
6. Admin clicks "Validate Rule" button
7. System validates JSON structure and logic
8. Admin clicks "Save Rule" button
9. System creates ScoringRule record
10. System refreshes table with new rule

**Postconditions**:
- Custom lead scoring rules created
- JSON structure validated for correctness
- Rules available for lead scoring calculations

**Validation Rules**: VR-MD-016

---

#### FR-MD-004-04: Test ScoringRule

**Preconditions**:
- User has role: Admin or Sales Manager
- User is authenticated
- User has permission: MASTER_DATA.READ

**Main Flow**:
1. User clicks "Test Rule" button on ScoringRule page
2. System displays Test Scoring Rules dialog:
   - Title: "Test Scoring Rules"
   - Input section: Sample lead data form
   - Output section: Calculated score and applied rules
3. User enters sample lead data:
   - Budget: [600,000,000₫]
   - Source: [WEBSITE ▼]
   - Model: [City RS ▼]
   - Contact Method: [PHONE ▼]
4. User clicks "Calculate Score" button
5. System calculates score using all active rules:
   - Apply each rule condition to sample data
   - Sum points for matching rules
   - Categorize result: COLD (0-15), WARM (16-30), HOT (31+)
6. System displays results:
   ```
   Applied Rules:
   ✓ High Budget Lead (+20 points)
   ✓ Website Source (+10 points)
   ✓ Premium Model Interest (+15 points)
   ─────────────────────────────────────
   Total Score: 45 points (HOT)
   ```
7. User can modify sample data and recalculate
8. User can save test scenarios for later use

**Postconditions**:
- Scoring rules tested with real data
- Lead scoring transparency for sales team
- Confidence in scoring accuracy

---

#### FR-MD-004-05: Manage SystemSetting

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.CREATE

**Main Flow**:
1. Admin navigates to `/master/system-settings`
2. System displays SystemSettings with category tabs:
   - Tab: General
   - Tab: Email
   - Tab: SMS
   - Tab: Notifications
   - Tab: Features
3. Admin selects a category tab
4. System displays settings for that category:
   ```
   Category: Email
   ─────────────────────────────────────
   SMTP Host:     [smtp.gmail.com     ] (string)
   SMTP Port:     [587                ] (number)
   Use TLS:       ○ On  ● Off           (boolean)
   From Address:  [noreply@honda.com  ] (string)
   ```
5. System renders type-safe editors:
   - `data_type: string` → Text input
   - `data_type: number` → Number input
   - `data_type: boolean` → Toggle switch
   - `data_type: json` → JSON editor (Monaco)
6. Admin modifies setting values
7. Admin clicks "Save Changes" button
8. System validates data types and values
9. System updates SystemSetting records
10. System logs configuration changes
11. System may trigger system reload for critical settings

**Postconditions**:
- System configuration managed through UI
- No code deployments needed for configuration changes
- Type-safe editing prevents configuration errors

**Validation Rules**: VR-MD-017

---

#### FR-MD-004-06: Validate SystemSetting

**Preconditions**:
- User is editing SystemSetting
- User has permission: MASTER_DATA.UPDATE

**Main Flow**:
1. User modifies a SystemSetting value
2. System validates based on data_type:
   - **string**: Max length, pattern validation
   - **number**: Range validation, decimal places
   - **boolean**: Must be true/false
   - **json**: Valid JSON syntax, structure validation
3. System shows validation errors inline:
   - "Value must be a valid email address"
   - "Value must be between 1 and 65535"
   - "Invalid JSON format"
4. System prevents saving invalid values
5. System provides helpful error messages
6. System shows data type requirements in field tooltips

**Postconditions**:
- All system settings validated before saving
- Configuration integrity maintained
- Clear error guidance for administrators

---

#### FR-MD-004-07: Export Configuration

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.EXPORT

**Main Flow**:
1. User clicks "Export Configuration" button on SystemSettings page
2. System displays Export Options dialog:
   - Categories to include: [✓] General [✓] Email [✓] SMS [✓] Notifications [✓] Features
   - Format: [JSON ◉] [YAML ○] [INI ○]
   - Include sensitive: [✓] Passwords/API Keys
3. User selects export options
4. User clicks "Export Configuration" button
5. System generates configuration file:
   - Format selected by user
   - Structure organized by category
   - Sensitive data masked if requested
6. System downloads file to user's browser
7. System logs export action with details

**Postconditions**:
- System configuration exported for backup
- Environment-specific configurations easily shared
- Audit trail of configuration exports

---

#### FR-MD-004-08: Import Configuration

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.IMPORT

**Main Flow**:
1. User clicks "Import Configuration" button on SystemSettings page
2. System displays Import Configuration dialog:
   - File upload: [Choose File] No file selected
   - Import mode: [○ Replace all ● Update existing ○ Merge new]
   - Backup: [✓] Create backup before import
3. User selects configuration file (.json, .yaml, .ini)
4. User selects import mode
5. User clicks "Validate Configuration" button
6. System validates file:
   - Format parsing
   - Data type validation
   - Required fields present
   - No duplicate settings
7. System displays validation results:
   - ✅ X settings valid
   - ❌ Y settings invalid (list errors)
   - ⚠ Z settings will be overwritten
8. User reviews validation results
9. User clicks "Import Configuration" button
10. System creates backup if requested
11. System imports configuration based on mode:
    - Replace: Delete all existing, insert new
    - Update: Update existing settings, insert new
    - Merge: Only insert new settings
12. System logs import action with details
13. System may trigger system reload for critical changes

**Postconditions**:
- System configuration imported safely
- Backup created for rollback capability
- Different import strategies for different needs

---

#### FR-MD-004-09: Audit Configuration Changes

**Preconditions**:
- Any SystemSetting change occurs
- User has permission: MASTER_DATA.READ

**Main Flow**:
1. System intercepts all SystemSetting changes
2. System captures detailed audit information:
   - user_id: User making change
   - action: CREATE/UPDATE/DELETE
   - entity: "SystemSetting"
   - entity_id: Setting ID
   - details:
     ```json
     {
       "setting_key": "smtp_host",
       "old_value": "old.smtp.com",
       "new_value": "new.smtp.com",
       "data_type": "string",
       "category": "Email"
     }
     ```
   - ip_address: User's IP
   - timestamp: Change timestamp
3. System stores audit log in `activity_logs` table
4. System provides audit log viewer:
   - Filter by date, user, category, setting key
   - Show before/after values
   - Export audit trail for compliance

**Postconditions**:
- Complete audit trail of all configuration changes
- Compliance and troubleshooting capabilities
- Security monitoring for configuration changes

---

### FR-MD-005: Employee Management

**Source**: CR-20260202-001
**Priority**: CRITICAL
**Actors**: Admin, HR Manager

#### FR-MD-005-01: Manage Employees
- **Goal**: Create/Update employee profiles linked to User accounts.
- **Fields**: Employee Code (EMP-XXX), Full Name, Department (Ref), Position (Ref), Level, Join Date, Status.
- **Rules**: Employee Code unique. User account optional (for non-system users).

#### FR-MD-005-02: Manage Structure
- **Goal**: Manage Key Lists: Departments, Positions, Levels.

---

### FR-MD-006: Supplier Management

**Source**: CR-20260202-001
**Priority**: CRITICAL
**Actors**: Admin, Procurement

#### FR-MD-006-01: Manage Suppliers
- **Goal**: Manage supplier database for Parts/Sales.
- **Fields**: Supplier Code (SUP-XXX), Name, Tax ID, Address, Contact Person, Phone, Email, Status.
- **Rules**: Tax ID unique.

#### FR-MD-006-02: Supplier Contacts
- **Goal**: Multiple contacts per supplier.

---

### FR-MD-007: Warehouse Management

**Source**: CR-20260202-001
**Priority**: CRITICAL

#### FR-MD-007-01: Manage Warehouses
- **Goal**: Define physical storage locations.
- **Fields**: Warehouse Code (WH-XXX), Name, Location/Address, Manager (Ref Employee).

---

### FR-MD-008: UOM Management

**Source**: CR-20260202-001
**Priority**: CRITICAL

#### FR-MD-008-01: Manage UOMs
- **Goal**: Define standard Units of Measure.
- **Fields**: Code (PCS, KG, L), Name (Piece, Kilogram, Liter), Description.

---

## 3. Validation Rules

### Existing VR-MD-001 to VR-MD-004 (VehicleModel)

*(From v1.0)*

### VR-MD-005: Accessory Code Validation

**Rule**: Accessory code must follow format ACC-XXX

**Details**:
- Format: `ACC-XXX`
- XXX: Sequential number (3 digits, zero-padded)
- Example: `ACC-001`, `ACC-002`, ..., `ACC-999`
- Auto-generated by system
- Unique constraint
- Immutable after creation

**Error Messages**:
- N/A (system-generated, no user input)

---

### VR-MD-006: Accessory Name Validation

**Rule**: Accessory name must be unique, required, max 200 characters

**Details**:
- Required: Cannot be empty or null
- Max length: 200 characters
- Unique: Case-insensitive uniqueness check
- Trim: Leading and trailing spaces removed
- Example valid: "Floor Mat Premium", "Body Kit Sport"
- Example invalid: "" (empty), "A" * 201 (too long)

**Error Messages**:
- Empty: "Accessory name is required"
- Too long: "Accessory name must not exceed 200 characters"
- Duplicate: "Accessory name already exists. Please use a different name."

---

### VR-MD-007: Accessory Category Validation

**Rule**: Category must be one of the predefined enum values

**Details**:
- Required: Cannot be empty or null
- Enum values: INTERIOR, EXTERIOR, TECH, SAFETY
- Case-sensitive: Must match exactly
- No custom values allowed

**Error Messages**:
- Empty: "Category is required"
- Invalid: "Category must be one of: INTERIOR, EXTERIOR, TECH, SAFETY"

---

### VR-MD-008: Accessory Price Validation

**Rule**: Price must be greater than 0

**Details**:
- Required: Cannot be empty or null
- Type: Decimal(15,2)
- Range: Must be > 0
- Currency: VND (Vietnamese Dong)
- Format: Display with thousand separators

**Error Messages**:
- Empty: "Price is required"
- Invalid: "Price must be greater than 0"
- Format: "Please enter a valid number"

---

### VR-MD-009: Compatibility Matrix Validation

**Rule**: Each accessory must be compatible with at least 1 vehicle model

**Details**:
- Required: At least 1 model selected
- Validation: Check compatibility matrix before saving
- All selected models must be active (not soft deleted)
- Business logic: Cannot sell accessory that fits no vehicles

**Error Messages**:
- Empty: "Each accessory must be compatible with at least 1 vehicle model"
- Inactive model: "Cannot select inactive vehicle models"

---

### VR-MD-010: Service Code Validation

**Rule**: Service code must follow format SVC-XXX

**Details**:
- Format: `SVC-XXX`
- XXX: Sequential number (3 digits, zero-padded)
- Example: `SVC-001`, `SVC-002`, ..., `SVC-999`
- Auto-generated by system
- Unique constraint
- Immutable after creation

**Error Messages**:
- N/A (system-generated, no user input)

---

### VR-MD-011: Service Name Validation

**Rule**: Service name must be unique, required, max 200 characters

**Details**:
- Required: Cannot be empty or null
- Max length: 200 characters
- Unique: Case-insensitive uniqueness check
- Trim: Leading and trailing spaces removed
- Example valid: "Oil Change", "10K Inspection"
- Example invalid: "" (empty), "A" * 201 (too long)

**Error Messages**:
- Empty: "Service name is required"
- Too long: "Service name must not exceed 200 characters"
- Duplicate: "Service name already exists. Please use a different name."

---

### VR-MD-012: Service Category Validation

**Rule**: Category must be one of the predefined enum values

**Details**:
- Required: Cannot be empty or null
- Enum values: MAINTENANCE, REPAIR, INSPECTION, BODYWORK
- Case-sensitive: Must match exactly
- No custom values allowed

**Error Messages**:
- Empty: "Category is required"
- Invalid: "Category must be one of: MAINTENANCE, REPAIR, INSPECTION, BODYWORK"

---

### VR-MD-013: Service Labor Validation

**Rule**: Labor hours and rate must be valid positive numbers

**Details**:
- `labor_hours`: Required, > 0, ≤ 100
- `labor_rate`: Required, > 0
- Type: Decimal for both
- Units: hours for labor_hours, VND/hour for labor_rate

**Error Messages**:
- Labor hours required: "Labor hours are required"
- Labor hours invalid: "Labor hours must be greater than 0 and not exceed 100"
- Labor rate required: "Labor rate is required"
- Labor rate invalid: "Labor rate must be greater than 0"

---

### VR-MD-014: Service Package Validation

**Rule**: Service package must have valid structure and pricing

**Details**:
- Package name: Required, max 200 chars, unique
- Services: At least 2 services selected
- Discount percentage: 0-50 (inclusive)
- All selected services must be active
- Auto-calculate total price correctly

**Error Messages**:
- Name empty: "Package name is required"
- Name too long: "Package name must not exceed 200 characters"
- Name duplicate: "Package name already exists"
- Too few services: "Package must include at least 2 services"
- Invalid discount: "Discount percentage must be between 0 and 50"
- Inactive service: "Cannot include inactive services in package"

---

### VR-MD-015: ServiceBay Validation

**Rule**: ServiceBay must have valid capacity and equipment

**Details**:
- Name: Required, max 100 chars, unique
- Capacity: Optional, > 0 if specified
- Equipment: JSON array, valid format
- Status: Enum (ACTIVE/INACTIVE/MAINTENANCE)
- Is available: Boolean, consistent with status

**Error Messages**:
- Name required: "Bay name is required"
- Name duplicate: "Bay name already exists"
- Capacity invalid: "Capacity must be greater than 0"
- Equipment invalid: "Equipment must be valid JSON array"

---

### VR-MD-016: ScoringRule Validation

**Rule**: ScoringRule must have valid JSON structure and logic

**Details**:
- Rule name: Required, max 100 chars, unique
- Category: Required, enum (BUDGET, SOURCE, MODEL, CONTACT)
- JSON structure: Must be valid, all required fields present
- Field: Must be one of supported fields
- Operator: Must be one of supported operators
- Value: Must match data type of field
- Points: Must be integer > 0

**Error Messages**:
- JSON invalid: "Invalid JSON format"
- Missing field: "Missing required field: field/operator/value/points"
- Invalid field: "Field must be one of: budget, source, model_interest, contact_method"
- Invalid operator: "Operator not supported for this field type"
- Invalid value: "Value type does not match field type"
- Invalid points: "Points must be a positive integer"

---

### VR-MD-017: SystemSetting Validation

**Rule**: SystemSetting must have valid data type and value

**Details**:
- Setting key: Required, max 100 chars, unique
- Category: Required, enum (GENERAL, EMAIL, SMS, NOTIFICATIONS, FEATURES)
- Data type: Required, enum (STRING, NUMBER, BOOLEAN, JSON)
- Value: Must match data type validation
- JSON value: Must be valid JSON if data_type = JSON

**Error Messages**:
- Key required: "Setting key is required"
- Key duplicate: "Setting key already exists"
- Invalid category: "Category must be one of: GENERAL, EMAIL, SMS, NOTIFICATIONS, FEATURES"
- Invalid data type: "Data type must be one of: STRING, NUMBER, BOOLEAN, JSON"
- Value mismatch: "Value does not match data type"
- JSON invalid: "Value must be valid JSON when data_type is JSON"

---

### VR-MD-018 to VR-MD-020: Additional Validation Rules

**VR-MD-018: Compatible Models Validation**
- All selected vehicle models must exist and be active
- Cannot create compatibility with inactive models

**VR-MD-019: Parts Required Validation**
- All selected parts must exist and be active
- Cannot require inactive parts in services

**VR-MD-020: Configuration Security Validation**
- Sensitive settings (passwords, API keys) must be encrypted
- Cannot view sensitive values in UI (show masked)
- Audit log required for all sensitive setting changes

---

## 4. Permission Matrix

### VehicleModel (Existing)

| Role | Create | Read | Update | Delete | Import | Export |
|------|--------|------|--------|--------|--------|--------|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Sales Manager** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Sales** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Service Manager** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Service Advisor** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Technician** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Parts Manager** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Accountant** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |

### Accessory Management

| Role | Create | Read | Update | Delete | Import | Export | Compatibility |
|------|--------|------|--------|--------|--------|--------|---------------|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Sales Manager** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Sales** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Service Manager** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Service Advisor** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Parts Manager** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Accountant** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |

### ServiceCatalog Management

| Role | Create | Read | Update | Delete | Import | Export | Package Builder |
|------|--------|------|--------|--------|--------|--------|-----------------|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Sales Manager** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Sales** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Service Manager** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Service Advisor** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Parts Manager** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Accountant** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |

### Other Masters (ServiceBay, ScoringRule, SystemSetting)

| Role | ServiceBay | ScoringRule | SystemSetting |
|------|-----------|------------|---------------|
| **Admin** | ✅ | ✅ | ✅ |
| **Sales Manager** | ✅ (Read) | ✅ (Read/Test) | ❌ |
| **Sales** | ✅ (Read) | ❌ | ❌ |
| **Service Manager** | ✅ (Read) | ❌ | ❌ |
| **Service Advisor** | ✅ (Read) | ❌ | ❌ |
| **Parts Manager** | ❌ | ❌ | ❌ |
| **Accountant** | ❌ | ❌ | ❌ |

---

## 5. Integration Points

### 5.1 CRM Module

**VehicleModel Integration**:
- **Endpoint**: `GET /api/vehicle-models?status=ACTIVE`
- **Used by**: Lead form, `model_interest` dropdown
- **Purpose**: Populate dropdown with active models

**Accessory Integration**:
- **Endpoint**: `GET /api/accessories?status=ACTIVE`
- **Used by**: Quotation form, accessory selection
- **Purpose**: Populate dropdown with active accessories
- **Compatibility**: Filter by selected VehicleModel

**ScoringRule Integration**:
- **Endpoint**: `GET /api/crm/scoring-rules?is_active=true`
- **Used by**: Lead scoring engine
- **Purpose**: Calculate lead scores automatically

### 5.2 Sales Module

**VehicleModel Integration**:
- **Endpoint**: `GET /api/vehicle-models?status=ACTIVE`
- **Used by**: Quotation form, `vehicle_model_id` dropdown
- **Purpose**: Auto-fill base price

**Accessory Integration**:
- **Endpoint**: `GET /api/accessories/by-vehicle/{modelId}`
- **Used by**: Quotation form, accessory compatibility
- **Purpose**: Show only compatible accessories for selected model

### 5.3 Service Module

**ServiceCatalog Integration**:
- **Endpoint**: `GET /api/services-catalog?status=ACTIVE`
- **Used by**: Repair Order form, service selection
- **Purpose**: Auto-calculate labor cost

**ServiceBay Integration**:
- **Endpoint**: `GET /api/service-bays/availability`
- **Used by**: Appointment booking
- **Purpose**: Check bay availability for scheduling

### 5.4 System Module

**SystemSetting Integration**:
- **Endpoint**: `GET /api/system-settings/by-category/{category}`
- **Used by**: All system components
- **Purpose**: Retrieve configuration values

---

## 6. Traceability

| FR ID | CR ID | BRD Section | ERD Entity | UI Screen | API Endpoint |
|-------|-------|-------------|------------|-----------|--------------|
| FR-MD-002-01 | CR-MD-002 | BR-MD-002 | Accessory | /master/accessories | POST /api/accessories |
| FR-MD-002-02 | CR-MD-002 | BR-MD-002 | Accessory | /master/accessories | GET /api/accessories |
| FR-MD-002-03 | CR-MD-002 | BR-MD-002 | Accessory | /master/accessories | PATCH /api/accessories/[id] |
| FR-MD-002-04 | CR-MD-002 | BR-MD-002 | Accessory | /master/accessories | DELETE /api/accessories/[id] |
| FR-MD-002-05 | CR-MD-002 | BR-MD-002 | accessory_model_compatibility | /master/accessories | POST /api/accessories/compatibility-matrix |
| FR-MD-002-06 | CR-MD-002 | BR-MD-002 | accessory_price_history | /master/accessories | GET /api/accessories/[id]/price-history |
| FR-MD-002-07 | CR-MD-002 | - | Accessory | /master/accessories | GET /api/accessories?search= |
| FR-MD-002-08 | CR-MD-002 | - | Accessory | /master/accessories | GET /api/accessories?category= |
| FR-MD-002-09 | CR-MD-002 | - | Accessory | /master/accessories | POST /api/accessories/import |
| FR-MD-003-01 | CR-MD-003 | BR-MD-003 | ServiceCatalog | /master/services | POST /api/services-catalog |
| FR-MD-003-02 | CR-MD-003 | BR-MD-003 | ServiceCatalog | /master/services | GET /api/services-catalog |
| FR-MD-003-03 | CR-MD-003 | BR-MD-003 | ServiceCatalog | /master/services | PATCH /api/services-catalog/[id] |
| FR-MD-003-04 | CR-MD-003 | BR-MD-003 | ServiceCatalog | /master/services | DELETE /api/services-catalog/[id] |
| FR-MD-003-05 | CR-MD-003 | BR-MD-003 | service_packages, service_package_items | /master/service-packages | POST /api/service-packages |
| FR-MD-003-06 | CR-MD-003 | - | ServiceCatalog | /master/services | GET /api/services-catalog?search= |
| FR-MD-003-07 | CR-MD-003 | - | ServiceCatalog | /master/services | GET /api/services-catalog?category= |
| FR-MD-003-08 | CR-MD-003 | - | ServiceCatalog | /master/services | - (Real-time calculation) |
| FR-MD-003-09 | CR-MD-003 | - | service_packages | /master/service-packages | PATCH /api/service-packages/[id] |
| FR-MD-003-10 | CR-MD-003 | - | ServiceCatalog | /master/services | POST /api/services-catalog/import |
| FR-MD-004-01 | CR-MD-004 | BR-MD-004 | ServiceBay | /master/service-bays | POST /api/service-bays |
| FR-MD-004-02 | CR-MD-004 | BR-MD-004 | ServiceBay | /master/service-bays | GET /api/service-bays/utilization |
| FR-MD-004-03 | CR-MD-004 | BR-MD-004 | ScoringRule | /master/scoring-rules | POST /api/crm/scoring-rules |
| FR-MD-004-04 | CR-MD-004 | BR-MD-004 | ScoringRule | /master/scoring-rules | POST /api/crm/scoring-rules/test |
| FR-MD-004-05 | CR-MD-004 | BR-MD-004 | SystemSetting | /master/system-settings | PATCH /api/system-settings/[id] |
| FR-MD-004-06 | CR-MD-004 | BR-MD-004 | SystemSetting | /master/system-settings | - (Validation) |
| FR-MD-004-07 | CR-MD-004 | BR-MD-004 | SystemSetting | /master/system-settings | GET /api/system-settings/export |
| FR-MD-004-08 | CR-MD-004 | BR-MD-004 | SystemSetting | /master/system-settings | POST /api/system-settings/import |
| FR-MD-004-09 | CR-MD-004 | BR-MD-004 | SystemSetting | /master/system-settings | GET /api/activity-logs (audit) |

## Change Log

### v1.0 (31/01/2026) - CR-MD-001
- Initial FRD created for Master Data Management module
- Added FR-MD-001: VehicleModel Management (9 functional requirements)
  * FR-MD-001-01: Create VehicleModel
  * FR-MD-001-02: Read VehicleModel List
  * FR-MD-001-03: Update VehicleModel
  * FR-MD-001-04: Delete VehicleModel (Soft)
  * FR-MD-001-05: Search VehicleModel
  * FR-MD-001-06: Filter VehicleModel
  * FR-MD-001-07: Import VehicleModel (Excel)
  * FR-MD-001-08: Export VehicleModel (Excel)
  * FR-MD-001-09: Audit Trail
- Added Validation Rules VR-MD-001 to VR-MD-004
- Added Permission Matrix for all roles
- Added Integration Points (CRM, Sales, Inventory)
- Added Traceability Matrix

### v1.1 (31/01/2026) - CR-MD-002/003/004
- **Added FR-MD-002: Accessory Management** (9 functional requirements)
  * FR-MD-002-01: Create Accessory
  * FR-MD-002-02: Read Accessory List
  * FR-MD-002-03: Update Accessory
  * FR-MD-002-04: Delete Accessory (Soft)
  * FR-MD-002-05: Manage Compatibility Matrix
  * FR-MD-002-06: View Pricing History
  * FR-MD-002-07: Search Accessory
  * FR-MD-002-08: Filter Accessory
  * FR-MD-002-09: Import/Export Accessory

- **Added FR-MD-003: ServiceCatalog Management** (10 functional requirements)
  * FR-MD-003-01: Create ServiceCatalog
  * FR-MD-003-02: Read ServiceCatalog List
  * FR-MD-003-03: Update ServiceCatalog
  * FR-MD-003-04: Delete ServiceCatalog (Soft)
  * FR-MD-003-05: Build Service Package
  * FR-MD-003-06: Search ServiceCatalog
  * FR-MD-003-07: Filter ServiceCatalog
  * FR-MD-003-08: Real-time Pricing Calculator
  * FR-MD-003-09: Manage Service Package
  * FR-MD-003-10: Import/Export ServiceCatalog

- **Added FR-MD-004: Other Masters Management** (9 functional requirements)
  * FR-MD-004-01: Manage ServiceBay
  * FR-MD-004-02: View Bay Utilization
  * FR-MD-004-03: Manage ScoringRule
  * FR-MD-004-04: Test ScoringRule
  * FR-MD-004-05: Manage SystemSetting
  * FR-MD-004-06: Validate SystemSetting
  * FR-MD-004-07: Export Configuration
  * FR-MD-004-08: Import Configuration
  * FR-MD-004-09: Audit Configuration Changes

- **Added Validation Rules VR-MD-005 to VR-MD-020**
  * VR-MD-005 to VR-MD-009: Accessory validation
  * VR-MD-010 to VR-MD-014: ServiceCatalog validation
  * VR-MD-015 to VR-MD-017: Other Masters validation
  * VR-MD-018 to VR-MD-020: Additional validation rules

- **Enhanced Permission Matrix**
  * Added Accessory permissions
  * Added ServiceCatalog permissions
  * Added Other Masters permissions

- **Expanded Integration Points**
  * Added Accessory integration with CRM/Sales
  * Added ServiceCatalog integration with Service module
  * Added ScoringRule integration with CRM module
  * Added SystemSetting integration with all modules

- **Updated Traceability Matrix**
  * Added 28 new FR mappings
  * All requirements traceable from CR → BRD → FRD → ERD → UI → API

- **Total**: 28 functional requirements added (9 + 10 + 9)
- **Entities**: 6 master data entities covered
- **API Endpoints**: 24 endpoints defined
- **Validation Rules**: 20 validation rules defined

### v1.2 (02/02/2026) - CR-20260202-001 (Emergency Master Data)
- ADDED: Employee Management (FR-MD-005)
- ADDED: Supplier Management (FR-MD-006)
- ADDED: Inventory Masters (FR-MD-007, FR-MD-008)
- NOTE: Emergency implementation to unblock implementation phase.

---

**End of Document**
