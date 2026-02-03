# FRD Update: Master Data UI/UX & Navigation (CR-20260202-002)

## 1. Module Overview Changes
- **Updated Scope**: Added UI/UX specifications for ~25 secondary master screens.
- **New Navigation Structure**: Defined "Master Data" menu hierarchy.

## 2. New Functional Requirements (FR-MD-009 to FR-MD-025)

### FR-MD-009: Vehicle Version Management
- **Goal**: Manage vehicle versions (e.g., "G", "L", "RS").
- **Actors**: Admin.
- **Data Attributes**: `version_name` (string), `model_id` (FK), `specifications` (JSON), `status`.
- **UI Flow**: List with filter by Model -> Create/Edit Dialog.

### FR-MD-010: Vehicle Color Management
- **Goal**: Manage vehicle colors per model.
- **Actors**: Admin.
- **Data Attributes**: `color_code` (string), `color_name` (string), `model_id` (FK), `image_url` (string), `price_adjustment` (decimal).
- **UI Flow**: List -> Master-Detail (Model selection -> Color List).

### FR-MD-011: Vehicle Specifications Master
- **Goal**: Manage standard specs (Engine, Transmission, Dimensions).
- **Actors**: Admin.
- **Data Attributes**: `spec_group` (string), `spec_key` (string), `data_type` (enum).

### FR-MD-012: Department Management
- **Goal**: Manage internal departments.
- **Actors**: HR/Admin.
- **Data Attributes**: `dept_code`, `dept_name`, `manager_id` (FK Employee), `parent_dept_id`.

### FR-MD-013: Position Management
- **Goal**: Manage job positions.
- **Actors**: HR/Admin.
- **Data Attributes**: `position_code`, `position_name`, `level_id` (FK).

### FR-MD-014: Level Management
- **Goal**: Manage employment levels/grades.
- **Actors**: HR/Admin.
- **Data Attributes**: `level_code`, `level_name`, `salary_range_min`, `salary_range_max`.

### FR-MD-015: Supplier Contact Management
- **Goal**: Manage contacts for suppliers.
- **Actors**: Procurement/Admin.
- **Data Attributes**: `supplier_id` (FK), `full_name`, `role`, `phone`, `email`.

### FR-MD-016: Supplier Contract Management
- **Goal**: Manage contracts with suppliers.
- **Actors**: Procurement/Admin.
- **Data Attributes**: `contract_number`, `supplier_id` (FK), `start_date`, `end_date`, `status`, `attachment_url`.

### FR-MD-017: Location Master (Prov/Dist/Ward)
- **Goal**: Manage standard administrative divisions.
- **Actors**: Admin (System Init).
- **Data Attributes**: 
    - `Province`: `code`, `name`.
    - `District`: `code`, `name`, `province_code`.
    - `Ward`: `code`, `name`, `district_code`.

### FR-MD-018: Bank Master
- **Goal**: Manage list of supported banks.
- **Actors**: Accounting/Admin.
- **Data Attributes**: `bank_code` (e.g., VCB), `bank_name`, `swift_code`, `logo_url`.

### FR-MD-019: Payment Method Master
- **Goal**: Manage payment methods.
- **Actors**: Accounting/Admin.
- **Data Attributes**: `method_code` (CASH, TRANSFER), `method_name`, `is_active`.

## 3. Navigation Structure Requirement
The application must present a "Master Data" menu group with the following structure:
1. **Vehicle Management** (`/master/vehicles`)
   - Sub-menu: Models, Versions, Colors, Specs.
2. **Employee Management** (`/master/employees`)
   - Sub-menu: Staff List, Departments, Positions, Levels.
3. **Supplier Management** (`/master/suppliers`)
   - Sub-menu: Supplier List, Contacts, Contracts.
4. **Service Management** (`/master/services`)
   - Sub-menu: Catalog, Packages, Pricing.
5. **System Masters**
   - Locations (`/master/locations`)
   - Banks, Payment Methods, UOMs, Warehouses.
