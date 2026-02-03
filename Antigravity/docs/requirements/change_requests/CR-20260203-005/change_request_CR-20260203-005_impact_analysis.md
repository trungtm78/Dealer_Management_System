# CR IMPACT ANALYSIS: CR-20260203-005

## Document Information
- **CR ID**: CR-20260203-005
- **Title**: Add Part-Vehicle Compatibility Feature
- **Date**: 03/02/2026
- **Author**: Antigravity - Business Analyst
- **Status**: COMPLETED

---

## Executive Summary

**Impact Level**: 🟡 **MEDIUM**

**Documents Impacted**:
| Document | Current Version | Impact Level | New Version | Changes Required |
|----------|----------------|--------------|-------------|------------------|
| BRD | N/A (No BRD for Parts yet) | ❌ **NONE** | N/A | No BRD changes needed |
| FRD Parts | v1.0 | ✅ **HIGH** | v1.1 | Add compatibility field to Part entity |
| FRD Master Data | v1.2 | ✅ **MEDIUM** | v1.3 | Add Part Compatibility management screens (reuse Accessory pattern) |
| ERD Master Data | v1.2 | ✅ **HIGH** | v1.3 | Add junction table `part_vehicle_compatibility` |
| API Spec Parts | v1.0 | ✅ **HIGH** | v1.1 | Add compatibility endpoints |
| API Spec Master Data | v1.2 | ✅ **MEDIUM** | v1.3 | Add Part Compatibility CRUD APIs |
| UI Spec Master Data | v1.2 | ✅ **MEDIUM** | v1.3 | Add Part Compatibility UI components |

**Modules Affected**: 
- Master Data (PRIMARY)
- Parts (PRIMARY)
- Service (SECONDARY - filter by vehicle)
- Sales (SECONDARY - filter by vehicle)

---

## 1. Business Requirements Document (BRD) Impact

### 1.1 Impact Assessment

❌ **NO IMPACT**

**Rationale**:
- Parts module DOES NOT have a dedicated BRD
- No business objectives or actors change
- No high-level business flows change
- This is purely a data model enhancement, not a new business process

**Action Required**: 
- ✅ NONE

---

## 2. Functional Requirements Document (FRD) Impact

### 2.1 FRD Parts v1.0 → v1.1

**Impact Level**: ✅ **HIGH**

**Changes Required**:

#### 2.1.1 Data Requirements Changes

**Current Part Entity** (FRD Parts v1.0, line 131-151):
```typescript
{
  id: string,
  partNumber: string, // Unique
  name: string,
  description?: string,
  category: string,
  quantity: number,
  minStock: number,
  maxStock: number,
  unitPrice: number,
  costPrice: number,
  supplierId?: string,
  location?: string,
  status: 'ACTIVE' | 'INACTIVE',
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**NEW Part Entity** (v1.1):
```typescript
{
  id: string,
  partNumber: string, // Unique
  name: string,
  description?: string,
  category: string,
  quantity: number,
  minStock: number,
  maxStock: number,
  unitPrice: number,
  costPrice: number,
  supplierId?: string,
  location?: string,
  status: 'ACTIVE' | 'INACTIVE',
  // 🆕 NEW FIELD
  compatible_models?: string[], // Array of VehicleModel IDs, optional (universal if null)
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Changes**:
- ➕ **ADD**: `compatible_models` field (optional array of VehicleModel IDs)
- ⚙️ **Classification**: Optional field (0 or many vehicle models)
- 🔗 **Relationships**: Many-to-Many with VehicleModel via junction table

#### 2.1.2 Screen Changes

**Existing Screen**: SCR-PRT-001 (Tổng Quan Tồn Kho)

**Changes Required**:
1. **Table Columns**: Add "Compatible Models" column (comma-separated list)
2. **Filters**: Add "Vehicle Model" filter (dropdown, filter parts by compatibility)
3. **Quick Actions**: Add "Manage Compatibility" action

**Layout Update**:
```tsx
<Table>
  <TableRow>
    <TableCell>Part Number</TableCell>
    <TableCell>Name</TableCell>
    <TableCell>Category</TableCell>
    <TableCell>Quantity</TableCell>
    <TableCell>Min Stock</TableCell>
    <TableCell>Price</TableCell>
    // 🆕 NEW COLUMN
    <TableCell>Compatible Models</TableCell>
    <TableCell>Status</TableCell>
    <TableCell>Actions</TableCell>
  </TableRow>
</Table>
```

#### 2.1.3 New Business Rules

**BR-PRT-011**: Part Compatibility Validation
- If `compatible_models` is NULL or empty → Part is universal (fits all vehicles)
- If `compatible_models` has values → Part only fits specified models
- All selected models MUST be ACTIVE
- Cannot have duplicate compatibility records

**BR-PRT-012**: Compatibility Filtering
- When filtering parts by vehicle model → Return parts where:
  - `compatible_models` contains vehicle_model_id OR
  - `compatible_models` is NULL (universal parts)

#### 2.1.4 New Validation Rules

**VR-PRT-020**: Compatible Models Validation
- All selected vehicle models MUST exist in `vehicle_models` table
- All selected vehicle models MUST have `status = 'ACTIVE'`
- Cannot select inactive or soft-deleted models

---

### 2.2 FRD Master Data v1.2 → v1.3

**Impact Level**: ✅ **MEDIUM**

**Changes Required**:

#### 2.2.1 New Functional Requirement: FR-MD-009

**FR-MD-009: Part-Vehicle Compatibility Management**

**Source**: CR-20260203-005  
**Priority**: HIGH (P1)  
**Actors**: Admin (CRUD), Parts Manager (Read only)

---

#### FR-MD-009-01: Manage Part Compatibility (Individual)

**Preconditions**:
- User has role: Admin or Parts Manager
- User is authenticated
- User has permission: MASTER_DATA.UPDATE

**Main Flow**:
1. Admin navigates to `/master/parts` (from Parts module)
2. Admin clicks "Manage Compatibility" icon on a Part row
3. System displays Part Compatibility dialog:
   - Title: "Manage Compatibility - [Part Name]"
   - Layout: Multi-select dropdown for Vehicle Models
4. System loads current compatibility:
   - If `compatible_models` is NULL → "Universal (All Models)" badge shown
   - If `compatible_models` has values → Show selected models
5. Admin modifies compatibility:
   - Option 1: Check "Universal (All Models)" → Clears all selections, sets to NULL
   - Option 2: Uncheck "Universal" and select specific models from dropdown
6. System shows real-time preview:
   - "This part will be available for: [City, Civic, Accord]"
   - OR: "This part will be available for: All Models (Universal)"
7. Admin clicks "Save" button
8. System validates:
   - If Universal → OK, set `compatible_models` = NULL
   - If specific models → Check all models are ACTIVE
9. If validation passes:
   - System deletes existing compatibility records for this part
   - System inserts new compatibility records (if not universal)
   - System logs to `activity_logs`
   - System displays success message: "Compatibility updated successfully"
10. If validation fails:
    - System displays error: "One or more selected models are inactive"
    - System keeps dialog open

**Postconditions**:
- Part compatibility updated
- Audit log entry created
- New compatibility available for filtering in Service/Sales modules

**Validation Rules**: VR-PRT-020

---

#### FR-MD-009-02: Compatibility Matrix (Batch Management)

**Preconditions**:
- User has role: Admin
- User is authenticated
- User has permission: MASTER_DATA.UPDATE

**Main Flow**:
1. Admin navigates to `/master/part-compatibility-matrix`
2. System displays Compatibility Matrix dialog:
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
   - System displays success message: "Compatibility matrix updated successfully"
8. If validation fails:
   - System displays error: "Cannot save: Some models are inactive"
   - System keeps dialog open

**Postconditions**:
- Batch compatibility update completed
- Audit log entry created
- Matrix reflects new state

**UI Reference**: 
- Reuse pattern from FR-MD-002-05 (Accessory Compatibility Matrix)
- Same grid layout, same checkbox interaction
- Same validation logic

---

## 3. Entity Relationship Diagram (ERD) Impact

### 3.1 ERD Master Data v1.2 → v1.3

**Impact Level**: ✅ **HIGH**

**Changes Required**:

#### 3.1.1 New Entity (Junction Table)

**Table Name**: `part_vehicle_compatibility`

**Purpose**: Store many-to-many relationship between Parts and VehicleModels

**Classification**: Transactional Data (junction table)

**Table Structure**:
```sql
CREATE TABLE part_vehicle_compatibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id UUID NOT NULL,
  vehicle_model_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID, -- Optional: track who created compatibility
  
  -- Foreign Keys
  CONSTRAINT fk_part FOREIGN KEY (part_id) 
    REFERENCES parts(id) ON DELETE CASCADE,
  CONSTRAINT fk_vehicle_model FOREIGN KEY (vehicle_model_id) 
    REFERENCES vehicle_models(id) ON DELETE CASCADE,
  
  -- Unique Constraint (prevent duplicates)
  CONSTRAINT uq_part_model UNIQUE(part_id, vehicle_model_id)
);

-- Indexes for performance
CREATE INDEX idx_part_compatibility_part ON part_vehicle_compatibility(part_id);
CREATE INDEX idx_part_compatibility_model ON part_vehicle_compatibility(vehicle_model_id);
```

**Columns**:
| Column Name | Data Type | Nullable | Constraints | Description |
|-------------|-----------|----------|-------------|-------------|
| `id` | UUID | NOT NULL | PRIMARY KEY | Unique identifier |
| `part_id` | UUID | NOT NULL | FK → parts(id) | Reference to Part |
| `vehicle_model_id` | UUID | NOT NULL | FK → vehicle_models(id) | Reference to VehicleModel |
| `created_at` | TIMESTAMP | NOT NULL | DEFAULT NOW() | Timestamp of creation |
| `created_by` | UUID | NULLABLE | FK → users(id) | User who created (audit) |

**Relationships**:
- `part_id` → `parts.id` (Many-to-One, CASCADE DELETE)
- `vehicle_model_id` → `vehicle_models.id` (Many-to-One, CASCADE DELETE)
- `created_by` → `users.id` (Many-to-One, SET NULL on delete)

**Indexes**:
- PRIMARY KEY on `id`
- UNIQUE INDEX on `(part_id, vehicle_model_id)` — Prevent duplicate compatibility
- INDEX on `part_id` — Fast lookup: "What models is this part compatible with?"
- INDEX on `vehicle_model_id` — Fast lookup: "What parts fit this vehicle model?"

**Usage (Screens/APIs)**:
- `/master/parts` — Display compatible models
- `/master/part-compatibility-matrix` — Grid view
- `GET /api/parts?vehicle_model_id=XXX` — Filter parts by model
- `GET /api/part-compatibility/:part_id` — Get compatibility for a part
- `POST /api/part-compatibility` — Create compatibility
- `DELETE /api/part-compatibility/:id` — Remove compatibility

**Business Rules**:
- BR-PRT-011: NULL compatibility records = Universal part
- BR-PRT-012: Filter logic includes universal parts

**Sample Data**:
```sql
-- Example: Engine Oil Filter is compatible with City and Civic
INSERT INTO part_vehicle_compatibility (part_id, vehicle_model_id) VALUES
  ('part-oil-filter-uuid', 'model-city-uuid'),
  ('part-oil-filter-uuid', 'model-civic-uuid');

-- Example: Universal part (Air Freshener) has NO compatibility records
-- (Empty result = compatible with ALL models)
```

**Migration Notes**:
- **Strategy**: Additive (no data loss)
- **Existing Parts**: Will have NO compatibility records → Treated as Universal
- **Rollback**: DROP TABLE `part_vehicle_compatibility` (safe, no FK constraints from parts table)

---

#### 3.1.2 ERD Diagram Update

**Changes to Diagram**:
1. Add new entity: `part_vehicle_compatibility` (junction table)
2. Add relationship: `parts` (1) ↔ (N) `part_vehicle_compatibility`
3. Add relationship: `vehicle_models` (1) ↔ (N) `part_vehicle_compatibility`

**Diagram Notation** (DBML):
```dbml
Table part_vehicle_compatibility {
  id UUID [pk]
  part_id UUID [ref: > parts.id]
  vehicle_model_id UUID [ref: > vehicle_models.id]
  created_at TIMESTAMP
  created_by UUID [ref: > users.id]
  
  indexes {
    (part_id, vehicle_model_id) [unique]
  }
}
```

---

#### 3.1.3 ERD Dictionary

**New File Required**: 
`docs/design/database/dictionary/part_vehicle_compatibility.md`

**Content** (as per ERD template):
```markdown
# Table: part_vehicle_compatibility

## Purpose
Junction table to store many-to-many relationship between Parts and VehicleModels.
Tracks which parts are compatible with which vehicle models.

## Classification
Transactional Data (junction table)

## Columns
... (as detailed in 3.1.1 above)

## Indexes
... (as detailed in 3.1.1 above)

## Relationships
... (as detailed in 3.1.1 above)

## Usage
... (as detailed in 3.1.1 above)

## Business Rules
... (as detailed in 3.1.1 above)

## Sample Data
... (as detailed in 3.1.1 above)

## Migration Notes
... (as detailed in 3.1.1 above)
```

---

#### 3.1.4 Migration Strategy

**Migration Type**: **NON-BREAKING** (additive only)

**Migration Steps**:
1. CREATE TABLE `part_vehicle_compatibility` with all constraints
2. CREATE INDEXES for performance
3. NO DATA MIGRATION (existing parts remain universal by default)
4. VERIFY constraints and indexes

**Rollback Plan**:
```sql
DROP TABLE IF EXISTS part_vehicle_compatibility CASCADE;
```

**Data Impact**:
- ✅ Existing parts: NO CHANGE (will have zero compatibility records = universal)
- ✅ Existing APIs: NO BREAKING (backward compatible)
- ✅ Existing queries: NO CHANGE (parts table unchanged)

---

## 4. API Specification Impact

### 4.1 API Spec Parts v1.0 → v1.1

**Impact Level**: ✅ **HIGH**

**Changes Required**:

#### 4.1.1 Existing Endpoint Changes

**Endpoint**: `GET /api/parts`

**Current Behavior** (v1.0):
```
GET /api/parts
Returns all active parts, no filtering by vehicle model
```

**NEW Behavior** (v1.1):
```
GET /api/parts?vehicle_model_id={uuid}
Returns parts compatible with specified vehicle model:
- Parts with compatibility records for this model
- Parts with NO compatibility records (universal parts)
```

**Query Parameters** (NEW):
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vehicle_model_id` | UUID | OPTIONAL | Filter parts by vehicle model compatibility |

**Response** (UNCHANGED):
```json
{
  "parts": [
    {
      "id": "uuid",
      "partNumber": "string",
      "name": "string",
      "category": "string",
      "compatible_models": ["uuid", "uuid"], // 🆕 NEW FIELD
      "status": "ACTIVE"
    }
  ],
  "total": 100
}
```

**Breaking Change Assessment**: ❌ **NON-BREAKING**
- New query param is optional
- Response schema adds optional field `compatible_models`
- Existing clients will ignore new field (backward compatible)

---

#### 4.1.2 Existing Endpoint Changes (Continued)

**Endpoints**: `POST /api/parts`, `PUT /api/parts/:id`

**Request Body Change** (v1.1):
```json
{
  "partNumber": "string",
  "name": "string",
  "category": "string",
  "compatible_models": ["uuid", "uuid"], // 🆕 NEW FIELD (optional)
  "status": "ACTIVE"
}
```

**Validation**:
- If `compatible_models` provided:
  - Must be array of valid UUIDs
  - All UUIDs must exist in `vehicle_models` table
  - All models must be ACTIVE
- If `compatible_models` is NULL or empty:
  - Part is universal (no compatibility records created)

**Breaking Change Assessment**: ❌ **NON-BREAKING**
- New field is optional
- Existing requests without `compatible_models` still work (universal parts)

---

### 4.2 API Spec Master Data v1.2 → v1.3

**Impact Level**: ✅ **MEDIUM**

**Changes Required**:

#### 4.2.1 New Endpoints

**Endpoint 1**: Get Part Compatibility

```
GET /api/part-compatibility/:part_id
```

**FRD Mapping**: FR-MD-009-01 (Manage Part Compatibility)  
**ERD Mapping**: `part_vehicle_compatibility` table

**Purpose**: Retrieve all vehicle models compatible with a specific part

**Request**:
- Path param: `part_id` (UUID)

**Response**:
```json
{
  "part_id": "uuid",
  "compatible_models": [
    {
      "model_id": "uuid",
      "model_name": "City",
      "created_at": "2026-02-03T10:00:00Z"
    }
  ],
  "is_universal": false
}
```

**Error Codes**:
- 404: Part not found
- 403: Insufficient permissions

---

**Endpoint 2**: Create/Update Part Compatibility (Batch)

```
POST /api/part-compatibility
PUT /api/part-compatibility/:part_id
```

**FRD Mapping**: FR-MD-009-01 (Manage Part Compatibility)  
**ERD Mapping**: `part_vehicle_compatibility` table

**Purpose**: Set vehicle models compatible with a part (replaces existing)

**Request**:
```json
{
  "part_id": "uuid",
  "vehicle_model_ids": ["uuid", "uuid"], // Empty array or null = universal
  "replace": true // If true, delete existing and insert new
}
```

**Validation**:
- `part_id` must exist in `parts` table
- All `vehicle_model_ids` must exist and be ACTIVE
- If `vehicle_model_ids` is empty or null → Delete all compatibility records (universal)

**Response**:
```json
{
  "success": true,
  "part_id": "uuid",
  "compatible_models_count": 2,
  "message": "Compatibility updated successfully"
}
```

**Error Codes**:
- 400: Invalid request (inactive models, invalid UUIDs)
- 404: Part not found
- 403: Insufficient permissions

---

**Endpoint 3**: Delete Part Compatibility

```
DELETE /api/part-compatibility/:part_id/:vehicle_model_id
DELETE /api/part-compatibility/:part_id (delete all)
```

**Purpose**: Remove specific compatibility or make part universal

**Error Codes**:
- 404: Compatibility record not found
- 403: Insufficient permissions

---

**Endpoint 4**: Get Compatibility Matrix

```
GET /api/part-compatibility/matrix
```

**FRD Mapping**: FR-MD-009-02 (Compatibility Matrix)  
**ERD Mapping**: `part_vehicle_compatibility` table

**Purpose**: Get full compatibility matrix for UI grid

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | OPTIONAL | Page number (default 1) |
| `limit` | number | OPTIONAL | Items per page (default 20) |

**Response**:
```json
{
  "parts": [
    {
      "id": "uuid",
      "partNumber": "P001",
      "name": "Engine Oil Filter",
      "compatible_model_ids": ["uuid1", "uuid2"]
    }
  ],
  "vehicle_models": [
    {
      "id": "uuid1",
      "model_name": "City"
    },
    {
      "id": "uuid2",
      "model_name": "Civic"
    }
  ],
  "total_parts": 100,
  "total_models": 50
}
```

---

**Endpoint 5**: Update Compatibility Matrix (Batch)

```
POST /api/part-compatibility/matrix
```

**FRD Mapping**: FR-MD-009-02 (Compatibility Matrix)  
**ERD Mapping**: `part_vehicle_compatibility` table

**Purpose**: Batch update compatibility matrix from UI grid

**Request**:
```json
{
  "updates": [
    {
      "part_id": "uuid",
      "vehicle_model_ids": ["uuid1", "uuid2"]
    },
    {
      "part_id": "uuid2",
      "vehicle_model_ids": [] // Universal
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "updated_parts_count": 2,
  "message": "Compatibility matrix updated successfully"
}
```

---

#### 4.2.2 API Summary (New Endpoints)

| Endpoint | Method | FRD | ERD | Purpose |
|----------|--------|-----|-----|---------|
| `/api/parts?vehicle_model_id={id}` | GET | FR-MD-009 | `part_vehicle_compatibility` | Filter parts by vehicle |
| `/api/part-compatibility/:part_id` | GET | FR-MD-009-01 | `part_vehicle_compatibility` | Get part compatibility |
| `/api/part-compatibility` | POST | FR-MD-009-01 | `part_vehicle_compatibility` | Create compatibility |
| `/api/part-compatibility/:part_id` | PUT | FR-MD-009-01 | `part_vehicle_compatibility` | Update compatibility |
| `/api/part-compatibility/:part_id/:model_id` | DELETE | FR-MD-009-01 | `part_vehicle_compatibility` | Delete compatibility |
| `/api/part-compatibility/matrix` | GET | FR-MD-009-02 | `part_vehicle_compatibility` | Get matrix |
| `/api/part-compatibility/matrix` | POST | FR-MD-009-02 | `part_vehicle_compatibility` | Batch update matrix |

**Breaking Change Assessment**: ❌ **NON-BREAKING**
- All new endpoints (no existing endpoints modified except optional params)
- Existing APIs remain unchanged

---

## 5. UI Specification Impact

### 5.1 UI Spec Master Data v1.2 → v1.3

**Impact Level**: ✅ **MEDIUM**

**Changes Required**:

#### 5.1.1 New Screen: Part Compatibility Management

**Screen ID**: SCR-MD-NEW-001  
**Screen Name**: Part Compatibility Dialog  
**Route**: N/A (Dialog)  
**Component**: `PartCompatibilityDialog.tsx` (NEW)

**UI Reference**: 
- Reuse pattern from `AccessoryCompatibilityDialog.tsx`
- Multi-select dropdown for Vehicle Models
- "Universal (All Models)" checkbox
- Save/Cancel buttons

**Layout**:
```tsx
<Dialog title="Manage Compatibility - {partName}">
  <div className="space-y-4">
    {/* Universal Toggle */}
    <Checkbox
      checked={isUniversal}
      onChange={handleUniversalToggle}
      label="Universal (Fits All Models)"
    />
    
    {/* Multi-select Dropdown (disabled if universal) */}
    {!isUniversal && (
      <MultiSelect
        options={vehicleModels}
        value={selectedModels}
        onChange={handleModelsChange}
        placeholder="Select compatible models..."
      />
    )}
    
    {/* Preview */}
    <Card>
      <p>This part will be available for:</p>
      {isUniversal ? (
        <Badge>All Models (Universal)</Badge>
      ) : (
        <div className="flex flex-wrap gap-2">
          {selectedModels.map(model => (
            <Badge key={model.id}>{model.name}</Badge>
          ))}
        </div>
      )}
    </Card>
    
    {/* Actions */}
    <DialogFooter>
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      <Button onClick={handleSave}>Save</Button>
    </DialogFooter>
  </div>
</Dialog>
```

**Refs Mapping**:
- ✅ Dialog: Existing component
- ✅ Checkbox: Existing component
- ✅ MultiSelect: Existing component (reuse from Accessories)
- ✅ Badge: Existing component
- ✅ Button: Existing component

**Refs Strategy**: ✅ **REUSE AS-IS** (No new components needed)

---

#### 5.1.2 New Screen: Compatibility Matrix

**Screen ID**: SCR-MD-NEW-002  
**Screen Name**: Part-Vehicle Compatibility Matrix  
**Route**: `/master/part-compatibility-matrix`  
**Component**: `PartCompatibilityMatrix.tsx` (NEW)

**UI Reference**: 
- Reuse pattern from `AccessoryCompatibilityMatrix.tsx` (FR-MD-002-05)
- Grid layout with Parts as rows, VehicleModels as columns
- Checkboxes in cells

**Layout**:
```tsx
<div className="p-6">
  <h1>Part-Vehicle Compatibility Matrix</h1>
  
  {/* Actions */}
  <div className="flex gap-2">
    <Button onClick={handleSaveMatrix}>Save Matrix</Button>
    <Button variant="outline" onClick={handleClearAll}>Clear All</Button>
  </div>
  
  {/* Matrix Grid */}
  <div className="overflow-x-auto">
    <table className="matrix-table">
      <thead>
        <tr>
          <th>Part</th>
          {vehicleModels.map(model => (
            <th key={model.id}>{model.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {parts.map(part => (
          <tr key={part.id}>
            <td>{part.name}</td>
            {vehicleModels.map(model => (
              <td key={model.id}>
                <Checkbox
                  checked={isCompatible(part.id, model.id)}
                  onChange={() => toggleCompatibility(part.id, model.id)}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  {/* Pagination */}
  <Pagination total={totalParts} pageSize={20} current={page} />
</div>
```

**Refs Mapping**:
- ✅ Table: Existing component
- ✅ Checkbox: Existing component
- ✅ Button: Existing component
- ✅ Pagination: Existing component

**Refs Strategy**: ✅ **REUSE AS-IS** (No new components needed)

---

#### 5.1.3 Existing Screen Changes: Parts List (SCR-PRT-001)

**Screen**: `/parts/inventory` (`InventoryList.tsx`)

**Changes**:
1. **Table Column**: Add "Compatible Models" column
   ```tsx
   <TableCell>
     {part.compatible_models.length > 0 ? (
       part.compatible_models.map(m => m.name).join(', ')
     ) : (
       <Badge>Universal</Badge>
     )}
   </TableCell>
   ```

2. **Filters**: Add "Vehicle Model" filter
   ```tsx
   <Select
     options={vehicleModels}
     onChange={handleVehicleFilter}
     placeholder="Filter by Vehicle Model"
   />
   ```

3. **Quick Actions**: Add "Manage Compatibility" action
   ```tsx
   <DropdownMenuItem onClick={() => openCompatibilityDialog(part.id)}>
     Manage Compatibility
   </DropdownMenuItem>
   ```

**Refs Mapping**:
- ✅ TableCell: Existing
- ✅ Badge: Existing
- ✅ Select: Existing
- ✅ DropdownMenuItem: Existing

**Refs Strategy**: ✅ **REUSE AS-IS**

---

## 6. Integration Impact

### 6.1 Service Module Integration

**Impact**: 🟡 **LOW** (Optional enhancement)

**Use Case**: 
When creating a Service RO for a specific vehicle, filter parts to show only compatible parts.

**API Call**:
```javascript
GET /api/parts?vehicle_model_id={ro.vehicle_model_id}
```

**UI Change**:
- Parts dropdown in Service RO form → Filter by vehicle model from RO

**Status**: ✅ **OPTIONAL** (Can implement later as enhancement)

---

### 6.2 Sales Module Integration

**Impact**: 🟡 **LOW** (Optional enhancement)

**Use Case**: 
When creating a Sales Quotation for a specific vehicle, filter parts to show only compatible parts.

**API Call**:
```javascript
GET /api/parts?vehicle_model_id={quotation.vehicle_model_id}
```

**UI Change**:
- Parts dropdown in Quotation form → Filter by vehicle model from quotation

**Status**: ✅ **OPTIONAL** (Can implement later as enhancement)

---

## 7. Effort Estimate

### 7.1 Complexity Breakdown

| Component | Complexity | Story Points | Justification |
|-----------|-----------|--------------|---------------|
| **Database** | LOW | 1 | Simple junction table, proven pattern |
| **Backend API** | MEDIUM | 1.5 | Standard CRUD, reuse Accessory pattern |
| **Frontend UI** | MEDIUM | 1.5 | Reuse existing components, no new Refs |
| **Testing** | MEDIUM | 1 | Unit + Integration tests |
| **Documentation** | LOW | 0.5 | Update FRD/ERD/API/UI docs |

**Total Effort**: **5.5 Story Points**

**Estimated Duration**: **2-3 days**

---

### 7.2 Risk Assessment

**OVERALL RISK**: 🟢 **LOW**

**Risk Factors**:
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Performance degradation on matrix view | LOW | MEDIUM | Pagination (20 parts/page), DB indexes |
| Breaking existing Parts queries | VERY LOW | HIGH | Non-breaking changes, backward compatibility |
| UI component reuse fails | VERY LOW | MEDIUM | Already proven with Accessory Compatibility |
| Data migration issues | VERY LOW | LOW | No migration needed (additive only) |

**Mitigation Strategies**:
- ✅ Pagination on matrix view (max 20 parts × 50 models per page)
- ✅ DB indexes on junction table for fast lookups
- ✅ Backward compatibility: Existing APIs still work
- ✅ Universal parts default: Parts without compatibility records work as before

---

## 8. Testing Strategy

### 8.1 Test Coverage Requirements

**Unit Tests**:
- Part compatibility validation (required, active models)
- Universal parts logic (null compatibility)
- Duplicate prevention (unique constraint)
- Cascade delete behavior

**Integration Tests**:
- GET /api/parts?vehicle_model_id=XXX (filter by model)
- POST /api/part-compatibility (create compatibility)
- PUT /api/part-compatibility/:id (update compatibility)
- DELETE /api/part-compatibility/:id (remove compatibility)
- GET /api/part-compatibility/matrix (load matrix)
- POST /api/part-compatibility/matrix (batch update)

**E2E Tests**:
- Create part with compatibility → Verify in database
- Edit compatibility → Verify changes persisted
- Filter parts by vehicle model → Verify correct parts returned
- Compatibility matrix → Toggle checkboxes → Save → Verify updates

---

## 9. Implementation Notes

### 9.1 Recommended Implementation Order

1. **Database** (Day 1):
   - Create migration for `part_vehicle_compatibility` table
   - Add indexes
   - Test cascade delete

2. **Backend API** (Day 1-2):
   - Implement compatibility CRUD endpoints
   - Update `GET /api/parts` to support `vehicle_model_id` filter
   - Add validation logic
   - Write unit tests

3. **Frontend UI** (Day 2):
   - Create `PartCompatibilityDialog.tsx` (reuse Accessory pattern)
   - Create `PartCompatibilityMatrix.tsx` (reuse Accessory pattern)
   - Update `InventoryList.tsx` (add column, filter, action)
   - Write component tests

4. **Integration Testing** (Day 3):
   - Run integration tests
   - UAT scenarios
   - Performance testing (matrix view with 20x50 grid)

---

## 10. Conclusion

### 10.1 Summary

✅ **READY FOR DRAFTS**

**Key Points**:
- Impact: MEDIUM (affects FRD Parts, FRD Master Data, ERD, API, UI)
- Complexity: MEDIUM (5.5 SP, 2-3 days)
- Risk: LOW (proven pattern, non-breaking)
- Backward Compatibility: ✅ YES (all changes additive)
- Refs Strategy: ✅ REUSE AS-IS (no new components)

**Documents to Update**:
- FRD Parts: v1.0 → v1.1
- FRD Master Data: v1.2 → v1.3
- ERD Master Data: v1.2 → v1.3 (new junction table)
- API Spec Parts: v1.0 → v1.1
- API Spec Master Data: v1.2 → v1.3
- UI Spec Master Data: v1.2 → v1.3

**Next Step**: CR-03 (Create Drafts)

---

**END OF CR-02 IMPACT ANALYSIS**
