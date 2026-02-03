# Functional Requirements Document: Master Data Management

## Module Information
- **Module**: Master Data Management
- **Version**: 1.0
- **Created**: 31/01/2026
- **Updated by**: CR-MD-001
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

**Future Scope**:
- 🔜 Accessory Master Data (CR-MD-002)
- 🔜 ServiceCatalog Master Data (CR-MD-003)
- 🔜 Other Masters: ServiceBay, ScoringRule, SystemSetting (CR-MD-004)

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

---

#### FR-MD-001-01: Create VehicleModel

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.CREATE

**Main Flow**:
1. Admin navigates to `/master/vehicle-models`
2. Admin clicks "+ New" button
3. System displays Create VehicleModel dialog
4. System auto-generates `model_code`:
   - Format: `MOD/YYYY/XXX`
   - Example: `MOD/2026/001`
   - Auto-increment XXX per year
5. Admin enters required fields:
   - `model_name` (text input, required)
   - `category` (dropdown: SEDAN/SUV/HATCHBACK/MPV, required)
   - `base_price` (currency input VND, required)
   - `status` (radio: ACTIVE/INACTIVE, default ACTIVE)
6. Admin clicks "Save" button
7. System validates inputs:
   - `model_name`: not empty, max 100 chars, unique (case-insensitive)
   - `category`: must be valid enum value
   - `base_price`: must be > 0
8. If validation passes:
   - System creates VehicleModel record
   - System logs to `activity_logs` table
   - System displays success message: "VehicleModel created successfully"
   - System closes dialog
   - System refreshes table to show new record
9. If validation fails:
   - System displays error messages inline
   - System keeps dialog open for corrections

**Alternate Flow 1**: Duplicate model_name
- At step 7: If `model_name` already exists
- System displays error: "Model name already exists. Please use a different name."
- User corrects and retries

**Alternate Flow 2**: Invalid price
- At step 7: If `base_price` ≤ 0
- System displays error: "Price must be greater than 0"
- User corrects and retries

**Postconditions**:
- VehicleModel created with status = ACTIVE (or as selected)
- Audit log entry created with action = CREATE
- Model available in dropdowns across system (CRM, Sales, Inventory)

**Validation Rules**: VR-MD-001, VR-MD-002, VR-MD-003, VR-MD-004

---

#### FR-MD-001-02: Read VehicleModel List

**Preconditions**:
- User is authenticated
- User has permission: MASTER_DATA.READ

**Main Flow**:
1. User navigates to `/master/vehicle-models`
2. System displays VehicleModel table with columns:
   - Model Code (sortable)
   - Model Name (sortable)
   - Category (filterable, badge display)
   - Base Price (sortable, currency format)
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
- User sees current list of VehicleModels
- Filters and sort preferences saved in URL query params

**Validation Rules**: None

---

#### FR-MD-001-03: Update VehicleModel

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.UPDATE
- VehicleModel exists

**Main Flow**:
1. Admin clicks Edit icon (✎) on a VehicleModel row
2. System displays Edit VehicleModel dialog
3. System pre-fills form with current values:
   - `model_code` (read-only, grayed out)
   - `model_name` (editable)
   - `category` (editable)
   - `base_price` (editable)
   - `status` (editable)
4. Admin modifies fields (except model_code)
5. Admin clicks "Save" button
6. System validates inputs (same as Create)
7. If validation passes:
   - System updates VehicleModel record
   - System logs to `activity_logs` with old_value and new_value
   - System displays success message: "VehicleModel updated successfully"
   - System closes dialog
   - System refreshes table
8. If validation fails:
   - System displays error messages
   - System keeps dialog open

**Alternate Flow 1**: Attempt to edit model_code
- At step 4: If Admin tries to edit `model_code` field
- System prevents editing (field is disabled)
- System shows tooltip: "Model code cannot be changed after creation"

**Alternate Flow 2**: No changes made
- At step 5: If Admin clicks Save without making changes
- System closes dialog without update
- No audit log entry created

**Postconditions**:
- VehicleModel updated with new values
- Audit log entry created with action = UPDATE
- Changes reflected in all dropdowns immediately

**Validation Rules**: VR-MD-002, VR-MD-003, VR-MD-004

---

#### FR-MD-001-04: Delete VehicleModel (Soft Delete)

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.DELETE
- VehicleModel exists

**Main Flow**:
1. Admin clicks Delete icon (🗑) on a VehicleModel row
2. System displays confirmation dialog:
   - Title: "Deactivate Vehicle Model?"
   - Message: "This will set the model status to INACTIVE. The model will no longer appear in dropdowns but historical data will be preserved."
   - Buttons: "Cancel", "Deactivate"
3. Admin clicks "Deactivate" button
4. System performs soft delete:
   - SET `status` = 'INACTIVE'
   - SET `deleted_at` = NOW()
   - NOT hard delete (preserve record)
5. System logs to `activity_logs` with action = DELETE
6. System displays success message: "VehicleModel deactivated successfully"
7. System refreshes table (record disappears if filter = ACTIVE only)

**Alternate Flow 1**: Admin cancels
- At step 3: Admin clicks "Cancel"
- System closes dialog
- No changes made

**Alternate Flow 2**: Model has active references
- At step 4: If VehicleModel is referenced by active Quotations/Vehicles
- System displays warning: "This model is currently used in X active quotations. Are you sure you want to deactivate?"
- Admin confirms or cancels

**Postconditions**:
- VehicleModel status = INACTIVE
- `deleted_at` timestamp set
- Audit log entry created
- Model no longer appears in dropdowns (filtered by status = ACTIVE)
- Historical data preserved (Lead, Quotation, Vehicle still reference this model)

**Validation Rules**: None

---

#### FR-MD-001-05: Search VehicleModel

**Preconditions**:
- User is on `/master/vehicle-models` page
- User has permission: MASTER_DATA.READ

**Main Flow**:
1. User types in search box (placeholder: "Search by model name or code...")
2. System waits for 300ms after last keystroke (debounce)
3. System performs search:
   - Match against: `model_name` OR `model_code`
   - Match type: Partial match, case-insensitive
   - Example: "city" matches "Honda City RS", "City Sport", "MOD/2026/001" (if contains "city")
4. System updates table with filtered results
5. System shows result count: "Showing X results for 'search term'"
6. If no results found:
   - System displays: "No models found matching 'search term'"
   - System shows "Clear search" button

**Alternate Flow 1**: Clear search
- User clicks ✕ button in search box
- System clears search term
- System reloads full list (with other filters applied)

**Postconditions**:
- Table shows only matching records
- Search term saved in URL query param
- Other filters (category, status) still applied (AND logic)

**Validation Rules**: None

---

#### FR-MD-001-06: Filter VehicleModel

**Preconditions**:
- User is on `/master/vehicle-models` page
- User has permission: MASTER_DATA.READ

**Main Flow**:
1. User selects filter options:
   - **Category Filter** (multi-select dropdown):
     * Options: All, SEDAN, SUV, HATCHBACK, MPV
     * Default: All selected
     * Can select multiple
   - **Status Filter** (single-select dropdown):
     * Options: All, ACTIVE, INACTIVE
     * Default: ACTIVE only
     * Single selection
2. System applies filters immediately on selection
3. System combines filters with AND logic:
   - Example: Category IN (SEDAN, SUV) AND Status = ACTIVE
4. System updates table with filtered results
5. System shows filter summary: "Filtered by: Category (SEDAN, SUV), Status (ACTIVE)"

**Alternate Flow 1**: Reset filters
- User clicks "Clear Filters" button
- System resets all filters to default
- System reloads full list

**Postconditions**:
- Table shows only records matching all filter criteria
- Filters saved in URL query params
- Search still applied if active (AND logic)

**Validation Rules**: None

---

#### FR-MD-001-07: Import VehicleModel (Excel)

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.IMPORT

**Main Flow**:
1. Admin clicks "Import Excel" button
2. System displays Import dialog
3. System shows "Download Template" button
4. Admin clicks "Download Template" (optional):
   - System downloads `vehicle_model_template.xlsx`
   - Template columns: Model Code (optional), Model Name*, Category*, Base Price*
5. Admin clicks "Choose File" and selects .xlsx file
6. Admin clicks "Upload" button
7. System validates file:
   - File type: .xlsx only
   - File size: < 10MB
   - Column headers match template
8. System parses and validates each row:
   - `model_code`: If empty, auto-generate; if provided, check unique
   - `model_name`: Required, max 100 chars, unique
   - `category`: Required, must be SEDAN/SUV/HATCHBACK/MPV
   - `base_price`: Required, must be number > 0
9. System displays preview table:
   - Valid rows: Green checkmark
   - Invalid rows: Red X with error message
   - Summary: "X valid rows, Y invalid rows"
10. Admin reviews preview
11. Admin clicks "Import Valid Rows" button
12. System imports only valid rows:
    - Create VehicleModel records
    - Log to activity_logs (action = IMPORT)
13. System displays summary:
    - "Successfully imported X models"
    - "Failed to import Y models (see errors below)"
    - Download error report (.xlsx with error details)

**Alternate Flow 1**: All rows invalid
- At step 9: If all rows have validation errors
- System displays: "No valid rows to import. Please fix errors and try again."
- "Import" button disabled

**Alternate Flow 2**: Duplicate model_name in file
- At step 8: If file contains duplicate model_name
- System marks both rows as invalid
- Error: "Duplicate model name within file"

**Alternate Flow 3**: Admin cancels
- At any step: Admin clicks "Cancel"
- System closes dialog
- No import performed

**Postconditions**:
- Valid VehicleModels created
- Audit log entries created for each import
- Error report available for download
- Table refreshed to show new records

**Validation Rules**: VR-MD-001, VR-MD-002, VR-MD-003, VR-MD-004

---

#### FR-MD-001-08: Export VehicleModel (Excel)

**Preconditions**:
- User is authenticated
- User has permission: MASTER_DATA.EXPORT

**Main Flow**:
1. User clicks "Export Excel" button
2. System generates .xlsx file:
   - Filename: `vehicle_models_YYYYMMDD_HHMMSS.xlsx`
   - Include: All visible rows (after filters applied)
   - Columns: Model Code, Model Name, Category, Base Price, Status, Created At, Updated At
   - Format: Currency for price, Date for timestamps
3. System downloads file to user's browser
4. System logs export action to activity_logs

**Postconditions**:
- Excel file downloaded
- Audit log entry created with action = EXPORT

**Validation Rules**: None

---

#### FR-MD-001-09: Audit Trail

**Mapping**: CR-MD-001 Section 4.4  
**Priority**: HIGH

**Preconditions**:
- Any CRUD operation on VehicleModel

**Main Flow**:
1. System intercepts all VehicleModel operations (Create, Update, Delete, Import, Export)
2. System captures:
   - `user_id`: ID of user performing action
   - `action`: CREATE | UPDATE | DELETE | IMPORT | EXPORT
   - `entity`: "VehicleModel"
   - `entity_id`: ID of VehicleModel (null for Import/Export)
   - `details`: JSON object with:
     * For CREATE: `new_value` (full object)
     * For UPDATE: `old_value` and `new_value` (changed fields only)
     * For DELETE: `old_value` (full object before delete)
     * For IMPORT: `count` (number of records imported)
     * For EXPORT: `count` (number of records exported)
   - `ip_address`: User's IP address
   - `created_at`: Timestamp
3. System inserts record into `activity_logs` table
4. System continues with main operation

**Example Log Entries**:

```json
// CREATE
{
  "user_id": 123,
  "action": "CREATE",
  "entity": "VehicleModel",
  "entity_id": 45,
  "details": {
    "new_value": {
      "model_code": "MOD/2026/001",
      "model_name": "Honda City RS",
      "category": "SEDAN",
      "base_price": 559000000,
      "status": "ACTIVE"
    }
  },
  "ip_address": "192.168.1.100",
  "created_at": "2026-01-31T10:30:00Z"
}

// UPDATE
{
  "user_id": 123,
  "action": "UPDATE",
  "entity": "VehicleModel",
  "entity_id": 45,
  "details": {
    "old_value": {"base_price": 559000000},
    "new_value": {"base_price": 569000000}
  },
  "ip_address": "192.168.1.100",
  "created_at": "2026-01-31T14:30:00Z"
}

// DELETE
{
  "user_id": 123,
  "action": "DELETE",
  "entity": "VehicleModel",
  "entity_id": 45,
  "details": {
    "old_value": {
      "model_code": "MOD/2026/001",
      "model_name": "Honda City RS",
      "status": "ACTIVE"
    }
  },
  "ip_address": "192.168.1.100",
  "created_at": "2026-01-31T16:00:00Z"
}
```

**Postconditions**:
- All operations logged
- Audit trail available for compliance and troubleshooting

**Validation Rules**: None

---

## 3. Validation Rules

### VR-MD-001: Model Code Validation

**Rule**: Model code must follow format MOD/YYYY/XXX

**Details**:
- Format: `MOD/YYYY/XXX`
- YYYY: Current year (4 digits)
- XXX: Sequential number (3 digits, zero-padded)
- Example: `MOD/2026/001`, `MOD/2026/002`, ..., `MOD/2026/999`
- Auto-generated by system
- Unique constraint
- Immutable after creation (cannot be edited)

**Error Messages**:
- N/A (system-generated, no user input)

---

### VR-MD-002: Model Name Validation

**Rule**: Model name must be unique, required, max 100 characters

**Details**:
- Required: Cannot be empty or null
- Max length: 100 characters
- Unique: Case-insensitive uniqueness check
- Trim: Leading and trailing spaces removed
- Example valid: "Honda City RS", "CR-V L", "Accord Hybrid"
- Example invalid: "" (empty), "A" * 101 (too long), "Honda City RS" (if already exists)

**Error Messages**:
- Empty: "Model name is required"
- Too long: "Model name must not exceed 100 characters"
- Duplicate: "Model name already exists. Please use a different name."

---

### VR-MD-003: Category Validation

**Rule**: Category must be one of the predefined enum values

**Details**:
- Required: Cannot be empty or null
- Enum values: SEDAN, SUV, HATCHBACK, MPV
- Case-sensitive: Must match exactly
- No custom values allowed

**Error Messages**:
- Empty: "Category is required"
- Invalid: "Category must be one of: SEDAN, SUV, HATCHBACK, MPV"

---

### VR-MD-004: Base Price Validation

**Rule**: Base price must be greater than 0

**Details**:
- Required: Cannot be empty or null
- Type: Decimal(15,2)
- Range: Must be > 0
- Currency: VND (Vietnamese Dong)
- Format: Display with thousand separators (e.g., 559,000,000₫)
- Example valid: 559000000, 1029000000
- Example invalid: 0, -100000, null

**Error Messages**:
- Empty: "Base price is required"
- Invalid: "Base price must be greater than 0"
- Format: "Please enter a valid number"

---

## 4. Permission Matrix

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

**Permission Keys**:
- `MASTER_DATA.CREATE`: Create new VehicleModel
- `MASTER_DATA.READ`: View VehicleModel list and details
- `MASTER_DATA.UPDATE`: Edit existing VehicleModel
- `MASTER_DATA.DELETE`: Soft delete VehicleModel
- `MASTER_DATA.IMPORT`: Import from Excel
- `MASTER_DATA.EXPORT`: Export to Excel

---

## 5. Integration Points

### 5.1 CRM Module

**Integration**: Lead.model_interest → VehicleModel dropdown

**Details**:
- **Screen**: Lead Form, Lead Detail
- **Field**: `model_interest` (currently free text)
- **Change**: Convert to dropdown populated from VehicleModel
- **Query**: `SELECT model_name FROM VehicleModel WHERE status = 'ACTIVE' ORDER BY model_name ASC`
- **Display**: Model name only (e.g., "Honda City RS")
- **Value**: Store model_name (soft reference, no FK constraint)

**Benefits**:
- Eliminate typos in model names
- Enable accurate "Sales by Model" reports
- Faster data entry for Sales

---

### 5.2 Sales Module

**Integration**: Quotation.vehicle_model_id → VehicleModel dropdown

**Details**:
- **Screen**: Quotation Form
- **Field**: `vehicle_model_id` (FK to VehicleModel)
- **Change**: Dropdown populated from VehicleModel
- **Query**: `SELECT id, model_name, base_price FROM VehicleModel WHERE status = 'ACTIVE' ORDER BY model_name ASC`
- **Display**: Model name (e.g., "Honda City RS - 559,000,000₫")
- **Value**: Store VehicleModel.id (FK constraint)
- **Auto-fill**: When model selected, auto-fill `base_price` field in quotation

**Benefits**:
- Automatic base price population
- Consistent pricing across quotations
- Simplified quotation creation

---

### 5.3 Inventory Module

**Integration**: Vehicle.model_id → VehicleModel link

**Details**:
- **Screen**: Vehicle List, Vehicle Detail
- **Field**: `model_id` (FK to VehicleModel)
- **Change**: Display VehicleModel.model_name instead of raw ID
- **Query**: `SELECT v.*, vm.model_name FROM Vehicle v JOIN VehicleModel vm ON v.model_id = vm.id`
- **Display**: Model name in vehicle list and detail pages
- **Filter**: Enable filtering by VehicleModel.category

**Benefits**:
- Consistent model naming in inventory
- Better inventory reports by model
- Easier vehicle search and filtering

---

## 6. Traceability

| FR ID | CR ID | BRD Section | ERD Entity | UI Screen | API Endpoint |
|-------|-------|-------------|------------|-----------|--------------|
| FR-MD-001-01 | CR-MD-001 | BR-MD-001 | VehicleModel | /master/vehicle-models | POST /api/vehicle-models |
| FR-MD-001-02 | CR-MD-001 | BR-MD-002 | VehicleModel | /master/vehicle-models | GET /api/vehicle-models |
| FR-MD-001-03 | CR-MD-001 | BR-MD-003 | VehicleModel | /master/vehicle-models | PATCH /api/vehicle-models/[id] |
| FR-MD-001-04 | CR-MD-001 | BR-MD-004 | VehicleModel | /master/vehicle-models | DELETE /api/vehicle-models/[id] |
| FR-MD-001-05 | CR-MD-001 | - | VehicleModel | /master/vehicle-models | GET /api/vehicle-models?search= |
| FR-MD-001-06 | CR-MD-001 | - | VehicleModel | /master/vehicle-models | GET /api/vehicle-models?category= |
| FR-MD-001-07 | CR-MD-001 | - | VehicleModel | /master/vehicle-models | POST /api/vehicle-models/import |
| FR-MD-001-08 | CR-MD-001 | - | VehicleModel | /master/vehicle-models | GET /api/vehicle-models/export |
| FR-MD-001-09 | CR-MD-001 | - | activity_logs | - | - |

---

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

---

**End of Document**
