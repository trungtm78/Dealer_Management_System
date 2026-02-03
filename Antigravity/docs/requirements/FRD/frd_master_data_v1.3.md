# Functional Requirements Document: Master Data Management

## Module Information
- **Module**: Master Data Management
- **Version**: 1.3
- **Created**: 31/01/2026
- **Updated**: 03/02/2026
- **Updated by**: CR-20260203-005 (Part-Vehicle Compatibility)
- **Previous Version**: 1.2
- **Author**: Antigravity - Business Analyst
- **Project**: Honda SPICE ERP System

---

## 📋 Change Summary (v1.2 → v1.3)

**CR-20260203-005**: Part-Vehicle Compatibility Feature

**Changes**:
- Added FR-MD-009: Part-Vehicle Compatibility Management
  - FR-MD-009-01: Manage Part Compatibility (Individual Dialog)
  - FR-MD-009-02: Compatibility Matrix (Batch Management)
- Pattern: 100% reuse from FR-MD-002-05 (Accessory Compatibility)

**Related Documents**:
- FRD Parts v1.1: Part entity with `compatible_models` field
- ERD v1.3: Junction table `part_vehicle_compatibility`
- API Spec Master Data v1.3: Compatibility endpoints
- UI Spec Master Data v1.3: Compatibility UI components

---

## FR-MD-009: Part-Vehicle Compatibility Management

**Source**: CR-20260203-005  
**Priority**: HIGH (P1)  
**Actors**: Admin (CRUD), Parts Manager (Read only)

---

### FR-MD-009-01: Manage Part Compatibility (Individual)

**Preconditions**:
- User has role: Admin or Parts Manager
- User is authenticated
- User has permission: MASTER_DATA.UPDATE

**Main Flow**:
1. Admin clicks "Manage Compatibility" icon on a Part row (from Parts module)
2. System displays Part Compatibility dialog:
   -Title: "Manage Compatibility - [Part Name]"
   - Layout: Multi-select dropdown for Vehicle Models
3. System loads current compatibility:
   - If part has NO compatibility records → "Universal (All Models)" badge shown
   - If part has compatibility records → Show selected models
4. Admin modifies compatibility:
   - Option 1: Check "Universal (All Models)" → Clears all selections, part becomes universal
   - Option 2: Uncheck "Universal" and select specific models from dropdown
5. System shows real-time preview:
   - "This part will be available for: [City, Civic, Accord]"
   - OR: "This part will be available for: All Models (Universal)"
6. Admin clicks "Save" button
7. System validates:
   - If Universal → OK, delete all compatibility records
   - If specific models → Check all models are ACTIVE
8. If validation passes:
   - System deletes existing compatibility records for this part
   - System inserts new compatibility records (if not universal)
   - System logs to `activity_logs`
   - System displays success message
9. If validation fails:
   - System displays error message
   - System keeps dialog open

**Postconditions**:
- Part compatibility updated
- Audit log entry created
- New compatibility available for filtering in Service/Sales modules

**Validation Rules**: VR-PRT-020 (All selected models must be ACTIVE)

**UI Component**: `PartCompatibilityDialog.tsx` (reuse from `AccessoryCompatibilityDialog.tsx`)

---

### FR-MD-009-02: Compatibility Matrix (Batch Management)

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.UPDATE

**Main Flow**:
1. Admin navigates to `/master/part-compatibility-matrix`
2. System displays Compatibility Matrix:
   - Title: "Part-Vehicle Compatibility Matrix"
   - Layout: Grid with Parts as rows, VehicleModels as columns
   - Cells: Checkboxes (checked = compatible)
3. System loads current compatibility data:
   - Rows: All active Parts (paginated, 20 per page)
   - Columns: All active VehicleModels
   - Check state: From `part_vehicle_compatibility` table
   - If part has NO compatibility records → All checkboxes unchecked (Universal)
4. Admin can modify compatibility:
   - Click individual checkboxes to toggle
   - "Select All Models" button for a part row (makes universal)
   - "Select All Parts" button for a model column
   - "Clear All" button to reset all selections
5. Admin clicks "Save Matrix" button
6. System validates:
   - All selected models are ACTIVE
7. If validation passes:
   - System performs batch update:
     - DELETE existing compatibility records for modified parts
     - INSERT new compatibility records
   - System logs to `activity_logs` (batch action)
   - System displays success message
8. If validation fails:
   - System displays error
   - System keeps matrix open

**Postconditions**:
- Batch compatibility update completed
- Audit log entry created
- Matrix reflects new state

**UI Component**: `PartCompatibilityMatrix.tsx` (reuse from `AccessoryCompatibilityMatrix.tsx`)

---

## Implementation Notes

### Pattern Reuse

**Source Pattern**: FR-MD-002-05 (Accessory Compatibility Matrix) from FRD Master Data v1.2

**Reuse Strategy**:
- UI Components: 100% copy from Accessory Compatibility
- Database: Same junction table pattern (`part_vehicle_compatibility` mirrors `accessory_model_compatibility`)
- API Endpoints: Same CRUD pattern
- Business Logic: Same universal vs specific compatibility logic

### Database

**Junction Table**: `part_vehicle_compatibility`
- Many-to-many relationship between Parts and VehicleModels
- NULL compatibility = Universal part (fits all models)
- See ERD v1.3 dictionary for full specification

### API Endpoints

**New Endpoints** (see API Spec Master Data v1.3):
- `GET /api/part-compatibility/:part_id`
- `POST /api/part-compatibility`
- `PUT /api/part-compatibility/:part_id`
- `DELETE /api/part-compatibility/:part_id/:model_id`
- `GET /api/part-compatibility/matrix`
- `POST /api/part-compatibility/matrix`

---

## Detailed Specifications

**For complete and detailed specifications**, please refer to:

1. **Impact Analysis**: `docs/requirements/change_requests/CR-20260203-005/change_request_CR-20260203-005_impact_analysis.md`
   - Sections 2.2, 4.2, 5.1: Complete FR-MD-009 specifications
   - Section 3: ERD design for junction table
   - Section 4: API endpoint specifications
   - Section 5: UI component specifications

2. **FRD Master Data v1.2**: FR-MD-002-05 (Accessory Compatibility Matrix)
   - Reference implementation pattern to reuse

---

## Change Log

### Version 1.3 - 03/02/2026
#### Added (CR-20260203-005)
- FR-MD-009: Part-Vehicle Compatibility Management
  - FR-MD-009-01: Individual compatibility management dialog
  - FR-MD-009-02: Batch compatibility matrix
- Pattern reuse from Accessory Compatibility (FR-MD-002-05)

#### Related
- FRD Parts: v1.0 → v1.1 (Part entity updated)
- ERD: v1.2 → v1.3 (Junction table added)
- API Spec: v1.2 → v1.3 (Compatibility endpoints)
- UI Spec: v1.2 → v1.3 (Compatibility components)

### Version 1.2 - 02/02/2026
#### Emergency Master Data additions
- Employee Management
- Supplier Management
- Inventory Masters (Warehouse, UOM)

### Version 1.1 - 01/02/2026
#### Added
- Accessory Master Data (FR-MD-002)
- ServiceCatalog Master Data (FR-MD-003)
- Other Masters: ServiceBay, ScoringRule, SystemSetting (FR-MD-004)

### Version 1.0 - 31/01/2026
#### Initial Release
- VehicleModel Master Data (FR-MD-001)

---

**Note**: This is a SUMMARY document for FRD Master Data v1.3. For full previous content (FR-MD-001 through FR-MD-008), please refer to FRD Master Data v1.2. This version ONLY documents the NEW FR-MD-009 requirement added by CR-20260203-005.

**For implementation**, developers should read:
1. This document (FR-MD-009 summary)
2. Impact Analysis document (detailed specifications)
3. FRD Master Data v1.2 (FR-MD-002-05 pattern reference)

---

**End of FRD Master Data v1.3**
