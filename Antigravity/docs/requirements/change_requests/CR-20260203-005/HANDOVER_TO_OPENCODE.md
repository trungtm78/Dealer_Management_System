# HANDOVER TO OPENCODE: CR-20260203-005

## Document Information
- **CR ID**: CR-20260203-005
- **Title**: Add Part-Vehicle Compatibility Feature
- **Status**: ✅ APPROVED & CONSOLIDATED - READY FOR IMPLEMENTATION
- **Date**: 03/02/2026
- **Handover From**: Antigravity (Business Analyst)
- **Handover To**: OpenCode (Implementation Team)

---

## 🎯 Mission

Implement Part-Vehicle Compatibility feature for Honda SPICE ERP.

**Objective**: Allow a single part to be compatible with multiple vehicle models using:
- Many-to-many database relationship (junction table)
- Multi-select UI for managing compatibility
- Filter parts by vehicle model in Parts list and other modules

---

## 📋 MANDATORY: Documents to Read (Single Source of Truth)

### ✅ READ THESE FILES ONLY (Latest Versions)

**Functional Requirements**:
1. `C:\Honda\Antigravity\docs\requirements\FRD\frd_parts_v1.1.md`
2. `C:\Honda\Antigravity\docs\requirements\FRD\frd_master_data_v1.3.md`

**Database Design**:
3. `C:\Honda\Antigravity\docs\design\database\erd\erd_master_data_v1.3.md` (if exists)
4. `C:\Honda\Antigravity\docs\design\database\dictionary\part_vehicle_compatibility.md`

**API Specifications**:
5. Impact Analysis: `C:\Honda\Antigravity\docs\requirements\change_requests\CR-20260203-005\change_request_CR-20260203-005_impact_analysis.md` (Section 4: API Spec)

**UI Specifications**:
6. Impact Analysis: `C:\Honda\Antigravity\docs\requirements\change_requests\CR-20260203-005\change_request_CR-20260203-005_impact_analysis.md` (Section 5: UI Spec)

### ❌ DO NOT READ (Obsolete)

- ❌ CR draft files (`drafts/*` folder)
- ❌ Previous versions (frd_parts_v1.0.md, etc.)
- ❌ Intake/Review documents (historical only)

---

## 🏗 Implementation Overview

### Architecture

**Pattern**: 100% REUSE from Accessory Compatibility (FRD Master Data v1.2, FR-MD-002-05)

**Components**:
1. **Database**: Junction table `part_vehicle_compatibility`
2. **Backend**: Compatibility CRUD APIs
3. **Frontend**: Compatibility management UI (dialog + matrix)

---

## 🗄 Database Implementation

### Step 1: Create Junction Table

**File**: Create new migration file
**Location**: `src/db/migrations/` (or equivalent)

**Migration SQL**:
```sql
-- Migration: Add Part-Vehicle Compatibility
CREATE TABLE part_vehicle_compatibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id UUID NOT NULL,
  vehicle_model_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID,
  
  CONSTRAINT fk_part FOREIGN KEY (part_id) 
    REFERENCES parts(id) ON DELETE CASCADE,
  CONSTRAINT fk_vehicle_model FOREIGN KEY (vehicle_model_id) 
    REFERENCES vehicle_models(id) ON DELETE CASCADE,
  CONSTRAINT fk_created_by FOREIGN KEY (created_by)
    REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT uq_part_model UNIQUE(part_id, vehicle_model_id)
);

-- Indexes for performance
CREATE INDEX idx_part_compatibility_part ON part_vehicle_compatibility(part_id);
CREATE INDEX idx_part_compatibility_model ON part_vehicle_compatibility(vehicle_model_id);
```

**Rollback**:
```sql
DROP TABLE IF EXISTS part_vehicle_compatibility CASCADE;
```

**Verification**:
- ✅ Run migration on dev database
- ✅ Verify FK constraints work (try inserting invalid part_id → should fail)
- ✅ Verify UNIQUE constraint (try duplicate part_id + model_id → should fail)
- ✅ Verify CASCADE DELETE (delete a part → compatibility records deleted automatically)

---

## 🔌 Backend API Implementation

### Step 2: Create API Endpoints

**Reference**: Impact Analysis Section 4.2 (API Spec Master Data v1.3)

**Endpoints to Create**:

1. **GET /api/part-compatibility/:part_id**
   - Get all compatible models for a part
   - Response: `{ part_id, compatible_models: [{ model_id, model_name }], is_universal }`

2. **POST /api/part-compatibility**
   - Create/Replace compatibility for a part
   - Request: `{ part_id, vehicle_model_ids: [] }`
   - Validation: All model_ids must exist and be ACTIVE
   - Logic: DELETE existing + INSERT new records

3. **DELETE /api/part-compatibility/:part_id/:model_id**
   - Remove specific compatibility
   - Logic: DELETE WHERE part_id AND vehicle_model_id

4. **GET /api/part-compatibility/matrix**
   - Load matrix for grid view (paginated)
   - Response: `{ parts: [...], vehicle_models: [...] }`

5. **POST /api/part-compatibility/matrix**
   - Batch update from matrix
   - Request: `{ updates: [{ part_id, vehicle_model_ids: [] }] }`

6. **Update GET /api/parts**
   - Add optional query param: `?vehicle_model_id={uuid}`
   - Filter logic: Return parts WHERE:
     - No compatibility records (universal) OR
     - Has compatibility with specified model

**Pattern Reuse**: Copy from Accessory Compatibility APIs (if available)
**Location**: `src/app/api/part-compatibility/` (Next.js App Router) or equivalent

---

## 🎨 Frontend UI Implementation

### Step 3: Create UI Components

**Reference**: Impact Analysis Section 5 (UI Spec)

#### Component 1: PartCompatibilityDialog.tsx

**Pattern**: 100% copy from `AccessoryCompatibilityDialog.tsx` (if exists)

**Location**: `src/components/parts/PartCompatibilityDialog.tsx`

**Features**:
- Multi-select dropdown for Vehicle Models
- "Universal (All Models)" checkbox
- Preview section showing compatible models
- Save/Cancel buttons

**Props**:
```typescript
interface PartCompatibilityDialog Props {
  partId: string;
  partName: string;
  onClose: () => void;
  onSave: (vehicleModelIds: string[]) => void;
}
```

**API Calls**:
- Load: `GET /api/part-compatibility/:partId`
- Save: `POST /api/part-compatibility`

---

#### Component 2: PartCompatibilityMatrix.tsx

**Pattern**: 100% copy from `AccessoryCompatibilityMatrix.tsx` (if exists)

**Location**: `src/components/parts/PartCompatibilityMatrix.tsx`

**Features**:
- Grid: Parts (rows) × VehicleModels (columns)
- Checkboxes in cells (checked = compatible)
- Pagination (20 parts per page)
- "Save Matrix" / "Clear All" buttons

**API Calls**:
- Load: `GET /api/part-compatibility/matrix`
- Save: `POST /api/part-compatibility/matrix`

---

#### Component 3: Update InventoryList.tsx

**File**: `src/app/parts/inventory/page.tsx` or `src/components/parts/InventoryList.tsx`

**Changes**:
1. Add "Vehicle Model" filter dropdown
   ```tsx
   <Select
     options={vehicleModels}
     onChange={handleVehicleFilter}
     placeholder="Filter by Vehicle Model"
   />
   ```

2. Add "Compatible Models" table column
   ```tsx
   <TableCell>
     {part.compatible_models?.length > 0 ? (
       part.compatible_models.map(m => m.name).join(', ')
     ) : (
       <Badge>Universal</Badge>
     )}
   </TableCell>
   ```

3. Add "Manage Compatibility" quick action
   ```tsx
   <DropdownMenuItem onClick={() => openCompatibilityDialog(part.id)}>
     <Link className="w-4 h-4 mr-2" />
     Manage Compatibility
   </DropdownMenuItem>
   ```

---

## ✅ Testing Strategy

### Unit Tests

**Database**:
- ✅ Insert compatibility record → SUCCESS
- ✅ Insert duplicate (same part + model) → FAIL (UNIQUE constraint)
- ✅ Delete part → Compatibility records CASCADE deleted
- ✅ Delete vehicle model → Compatibility records CASCADE deleted

**API**:
- ✅ GET /api/parts?vehicle_model_id=X → Returns compatible parts + universals
- ✅ POST /api/part-compatibility with INACTIVE model → FAIL (validation)
- ✅ POST /api/part-compatibility with universal (empty array) → DELETE all records

### Integration Tests

**Full Flow**:
1. Create part (universal by default)
2. Open compatibility dialog
3. Select 2 vehicle models
4. Save → Verify 2 records created in DB
5. Filter parts by model → Part appears
6. Filter parts by different model → Part does NOT appear
7. Delete part → Compatibility records deleted (CASCADE)

### Manual Testing (UAT)

**Scenario 1: Individual Compatibility Management**:
1. Navigate to `/parts/inventory`
2. Click "Manage Compatibility" on a part
3. Select "City" and "Civic" from dropdown
4. Click "Save"
5. ✅ Verify: Compatible Models column shows "City, Civic"

**Scenario 2: Filter by Vehicle Model**:
1. Select "City" from Vehicle Model filter
2. ✅ Verify: Only parts compatible with City (or universal) are shown

**Scenario 3: Compatibility Matrix**:
1. Navigate to `/master/part-compatibility-matrix`
2. Check/uncheck boxes for parts and models
3. Click "Save Matrix"
4. ✅ Verify: Changes persisted in database

---

## 🚨 Critical Requirements

### 1. Universal Parts Logic

**Rule**: Parts with **ZERO** compatibility records are **UNIVERSAL** (fit ALL models)

**Implementation**:
- Filter query MUST include parts with NO compatibility records
- UI MUST show "Universal" badge when `compatible_models` is empty

### 2. Backward Compatibility

**Existing Parts**:
- All existing parts have NO compatibility records
- They MUST behave as universal parts (no filter excludes them)

**Existing APIs**:
- `GET /api/parts` without `vehicle_model_id` param → Returns ALL parts (no filter)

### 3. Validation

**Always Validate**:
- All `vehicle_model_ids` MUST exist in `vehicle_models` table
- All `vehicle_model_ids` MUST have `status = 'ACTIVE'`
- REJECT if any model is INACTIVE or not found

---

## 📊 Effort Estimate

**Total**: 5.5 Story Points, 2-3 days

| Task | Effort |
|------|--------|
| Database migration | 0.5 day |
| Backend APIs | 1 day |
| Frontend UI components | 1 day |
| Testing (unit + integration) | 0.5 day |

---

## 🎯 Success Criteria

**Database**:
- ✅ Junction table created
- ✅ FK constraints working
- ✅ CASCADE DELETE working

**Backend**:
- ✅ All 6 endpoints working
- ✅ Filter by vehicle model working
- ✅ Validation working (ACTIVE models only)

**Frontend**:
- ✅ Compatibility dialog working
- ✅ Matrix view working
- ✅ Parts list filter working
- ✅ "Universal" badge displayed correctly

**Tests**:
- ✅ All unit tests passing
- ✅ All integration tests passing
- ✅ Manual UAT scenarios passing

---

## 📚 Reference Materials

### Pattern Reuse (Accessory Compatibility)

**Source Files** (if available):
- `src/components/master/AccessoryCompatibilityDialog.tsx` → Copy to PartCompatibilityDialog
- `src/components/master/AccessoryCompatibilityMatrix.tsx` → Copy to PartCompatibilityMatrix
- `src/app/api/accessory-compatibility/*` → Copy to part-compatibility/*

**FRD Reference**:
- FRD Master Data v1.2, FR-MD-002-05: Manage Compatibility Matrix (Accessory)

### Business Rules

**BR-PRT-011**: If `compatible_models` is NULL or empty → Part is universal  
**BR-PRT-012**: If `compatible_models` has values → Part only fits specified models  
**BR-PRT-013**: All selected models MUST be ACTIVE  
**BR-PRT-014**: Filter logic includes universal parts  

---

## 🔒 Constraints

### MUST DO
- ✅ Read ONLY latest version documents (v1.1, v1.3)
- ✅ Implement junction table exactly as specified (FK, UNIQUE, indexes)
- ✅ Validate ALL vehicle_model_ids are ACTIVE before saving
- ✅ Support universal parts (NULL compatibility)
- ✅ Maintain backward compatibility (existing parts work as universal)

### MUST NOT DO
- ❌ Modify `parts` table schema (additive only via junction table)
- ❌ Break existing `GET /api/parts` calls (optional param only)
- ❌ Create new Refs components (reuse existing)
- ❌ Change Accessory Compatibility pattern (100% reuse)

---

## 📞 Questions & Support

**If Unclear**:
- Re-read Impact Analysis (Sections 3, 4, 5 for ERD, API, UI)
- Reference Accessory Compatibility pattern (FRD Master Data v1.2)
- Check ERD dictionary: `part_vehicle_compatibility.md`

**Blocking Issues**:
- Escalate to Antigravity (Business Analyst)

---

## ✅ Sign-Off

**Handover Completed by**: Antigravity  
**Date**: 03/02/2026  
**Status**: ✅ READY FOR IMPLEMENTATION

**OpenCode**: Please confirm receipt and estimated implementation timeline.

---

**END OF HANDOVER**
