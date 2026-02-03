# CHANGE REQUEST IMPACT ANALYSIS: CR-20260202-002

## 1. IMPACT MATRIX
| Document | Status | Impact Level | Description |
|----------|--------|--------------|-------------|
| **BRD** | ✅ No Change | Low | Scope already covered by Master Data module definition. |
| **FRD** | ⚠️ Update | High | Need to add Functional Requirements for ~20 new secondary master screens. |
| **ERD** | ⚠️ Update | High | Need to define schemas for secondary entities (Colors, Versions, Depts, Locations, etc.). |
| **API** | ⚠️ Update | High | Need CRUD endpoints for all new secondary entities. |
| **UI** | ⚠️ Update | High | Significant UI Specification update to add Navigation and Screens for all sub-modules. |

## 2. DETAILED ANALYSIS

### 2.1 FRD Impact (Functional Requirements)
- **New Requirements**: Added FRs for Extended Master Data.
    - **Vehicle**: `FR-MD-009` (Versions), `FR-MD-010` (Colors), `FR-MD-011` (Specifications).
    - **Employee**: `FR-MD-012` (Departments), `FR-MD-013` (Positions), `FR-MD-014` (Levels).
    - **Supplier**: `FR-MD-015` (Contacts), `FR-MD-016` (Contracts).
    - **Systems**: `FR-MD-017` (Locations - Prov/Dist/Ward), `FR-MD-018` (Banks), `FR-MD-019` (Payment Methods).
- **Navigation**: Define the specific Menu Structure requirement.

### 2.2 ERD Impact (Data Model)
- **New Tables Required** (previously referenced but undefined or missing):
    - `VehicleVersion`, `VehicleColor`, `VehicleSpec`
    - `MasterDepartment`, `MasterPosition`, `MasterLevel`
    - `SupplierContact`, `SupplierContract`
    - `MasterLocation` (Province, District, Ward)
    - `MasterBank`, `MasterPaymentMethod`
- **Updates**:
    - Update `VehicleModel` relationships to new entities if needed.

### 2.3 API Spec Impact
- **New Endpoints**: ~15-20 new CRUD sets (GET, POST, PATCH, DELETE) for the new tables.
    - `/api/master/versions`, `/api/master/colors`, etc.
    - `/api/master/departments`, etc.
    - `/api/master/locations/*`
- **Breaking Changes**: None expected (additive changes).

### 2.4 UI Spec Impact
- **New Navigation**: Define Sidebar Menu structure for "Master Data".
- **New Screens**:
    - List/Detail/Form layouts for all new secondary masters.
    - Usage of standard "Master Data Layout" (List with Search/Filter + Modal/Drawer Form).
- **Refinement**: Update existing Employee/Supplier screens to use the new `Department`/`Position` dropdowns (linked to new APIs) instead of static enums/text if applicable.

## 3. EFFORT ESTIMATE
- **Complexity**: Medium-High (High volume of repetitive CRUD screens).
- **Risk**: Low (Isolated Master Data module).
- **Time**: ~3 days for documentation and consistency check.

## 4. RISK ASSESSMENT
- **Consistency**: High risk of inconsistency between so many new entities. Need strict naming conventions.
- **Migration**: Need to ensure any existing hardcoded data (e.g., in code enums) is migrated to DB-driven masters if replacing.

## 5. CONCLUSION
Proceed with creating Drafts (CR-03) covering all identified secondary masters.
