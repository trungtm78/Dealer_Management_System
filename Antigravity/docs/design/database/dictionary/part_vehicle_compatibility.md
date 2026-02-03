# Table: part_vehicle_compatibility

## Purpose
Junction table to store many-to-many relationship between Parts and VehicleModels.
Tracks which parts are compatible with which vehicle models for accurate part selection and filtering.

## Classification
**Transactional Data** (Junction Table)

## Columns

| Column Name | Data Type | Nullable | Default | Constraints | Description |
|-------------|-----------|----------|---------|-------------|-------------|
| `id` | UUID | NOT NULL | gen_random_uuid() | PRIMARY KEY | Unique identifier for compatibility record |
| `part_id` | UUID | NOT NULL | - | FK → parts(id) | Reference to Part |
| `vehicle_model_id` | UUID | NOT NULL | - | FK → vehicle_models(id) | Reference to VehicleModel |
| `created_at` | TIMESTAMP | NOT NULL | NOW() | - | Timestamp when compatibility was created |
| `created_by` | UUID | NULLABLE | - | FK → users(id) | User who created this compatibility (audit) |

### Column Details

#### id (UUID)
- **Purpose**: Primary key for the junction table
- **Generation**: Auto-generated via `gen_random_uuid()`
- **Usage**: Used for direct record manipulation (delete specific compatibility)

#### part_id (UUID)
- **Purpose**: Foreign key reference to parts table
- **Constraint**: REFERENCES parts(id) ON DELETE CASCADE
- **Business Logic**: When part is deleted → all compatibility records deleted automatically
- **Index**: Covered by `idx_part_compatibility_part`

#### vehicle_model_id (UUID)
- **Purpose**: Foreign key reference to vehicle_models table
- **Constraint**: REFERENCES vehicle_models(id) ON DELETE CASCADE  
- **Business Logic**: When vehicle model is deleted → all compatibility records deleted automatically
- **Index**: Covered by `idx_part_compatibility_model`

#### created_at (TIMESTAMP)
- **Purpose**: Audit trail - when compatibility was established
- **Default**: NOW()
- **Usage**: For historical tracking and reporting

#### created_by (UUID)
- **Purpose**: Audit trail - which admin created this compatibility
- **Nullable**: TRUE (optional tracking)
- **Constraint**: REFERENCES users(id) ON DELETE SET NULL
- **Usage**: For accountability and audit reports

## Indexes

### Primary Key
```sql
PRIMARY KEY (id)
```

### Unique Constraint
```sql
CONSTRAINT uq_part_model UNIQUE(part_id, vehicle_model_id)
```
- **Purpose**: Prevent duplicate compatibility records
- **Business Rule**: A part cannot be marked compatible with the same model twice

### Performance Indexes
```sql
CREATE INDEX idx_part_compatibility_part ON part_vehicle_compatibility(part_id);
CREATE INDEX idx_part_compatibility_model ON part_vehicle_compatibility(vehicle_model_id);
```

**Query Performance**:
- `idx_part_compatibility_part`: Fast lookup - "What models is this part compatible with?"
- `idx_part_compatibility_model`: Fast lookup - "What parts fit this vehicle model?"

## Relationships

### part_id → parts(id)
- **Type**: Many-to-One
- **Cardinality**: N compatibility records for 1 part
- **FK Constraint**: ON DELETE CASCADE
- **Business Logic**: Deleting a part removes all its compatibility records

### vehicle_model_id → vehicle_models(id)
- **Type**: Many-to-One
- **Cardinality**: N compatibility records for 1 vehicle model
- **FK Constraint**: ON DELETE CASCADE
- **Business Logic**: Deleting a vehicle model removes all compatibility records referencing it

### created_by → users(id)
- **Type**: Many-to-One (optional)
- **FK Constraint**: ON DELETE SET NULL
- **Business Logic**: If user is deleted, compatibility record remains but created_by becomes NULL

## Usage (Screens/APIs)

### Screens
- `/parts/inventory` (SCR-PRT-001): Display compatible models column
- `/master/part-compatibility-matrix` (NEW): Batch edit compatibility in grid view
- Part Compatibility Dialog (NEW): Manage compatibility for individual part

### APIs
- `GET /api/parts?vehicle_model_id={uuid}`: Filter parts by vehicle model compatibility
- `GET /api/part-compatibility/:part_id`: Get all compatible models for a part
- `POST /api/part-compatibility`: Create compatibility records
- `PUT /api/part-compatibility/:part_id`: Update compatibility (replace all)
- `DELETE /api/part-compatibility/:part_id/:model_id`: Remove specific compatibility
- `GET /api/part-compatibility/matrix`: Load matrix for grid view
- `POST /api/part-compatibility/matrix`: Batch update from matrix

## Business Rules

### BR-PRT-011: Universal Parts Logic
- If part has **ZERO compatibility records** in this table → Part is **Universal** (fits ALL vehicle models)
- Universal parts appear when filtering by ANY vehicle model

### BR-PRT-012: Specific Compatibility Logic
- If part has **ONE or MORE compatibility records** → Part only fits those specific models
- Part will NOT appear when filtering by a model not in compatibility records

### BR-PRT-013: Active Models Only
- All `vehicle_model_id` values MUST reference ACTIVE vehicle models
- Cannot create compatibility with INACTIVE or soft-deleted models
- Validation enforced at API level

### BR-PRT-014: Filter Logic
```sql
-- Get parts compatible with vehicle_model_id = 'XXX'
SELECT p.* FROM parts p
LEFT JOIN part_vehicle_compatibility pvc ON p.id = pvc.part_id
WHERE 
  -- Universal parts (no compatibility records)
  NOT EXISTS (SELECT 1 FROM part_vehicle_compatibility WHERE part_id = p.id)
  OR
  -- Parts with specific compatibility to this model
  pvc.vehicle_model_id = 'XXX';
```

## Sample Data

```sql
-- Example 1: Engine Oil Filter is compatible with City and Civic
INSERT INTO part_vehicle_compatibility (part_id, vehicle_model_id, created_by) VALUES
  ('aaaaaaaa-1111-4111-8111-111111111111', 'model-city-uuid', 'admin-user-uuid'),
  ('aaaaaaaa-1111-4111-8111-111111111111', 'model-civic-uuid', 'admin-user-uuid');

-- Example 2: Brake Pad Set is compatible with Accord only
INSERT INTO part_vehicle_compatibility (part_id, vehicle_model_id, created_by) VALUES
  ('bbbbbbbb-2222-4222-8222-222222222222', 'model-accord-uuid', 'admin-user-uuid');

-- Example 3: Air Freshener has NO compatibility records → Universal part
-- (No INSERT needed - absence of records means universal)
```

**Interpretation**:
- Engine Oil Filter: Appears when filtering by City OR Civic OR "All" (2 compatibility records)
- Brake Pad Set: Appears when filtering by Accord OR "All" (1 compatibility record)
- Air Freshener: Appears when filtering by ANY model OR "All" (0 compatibility records = universal)

## Migration Notes

### Migration Strategy
**Type**: NON-BREAKING (Additive only)

**Steps**:
1. CREATE TABLE `part_vehicle_compatibility` with all constraints
2. CREATE INDEXES for performance (`idx_part_compatibility_part`, `idx_part_compatibility_model`)
3. VERIFY constraints (FK, UNIQUE)
4. NO DATA MIGRATION (existing parts remain universal by default)

**Migration SQL**:
```sql
-- Step 1: Create table
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

-- Step 2: Create indexes
CREATE INDEX idx_part_compatibility_part ON part_vehicle_compatibility(part_id);
CREATE INDEX idx_part_compatibility_model ON part_vehicle_compatibility(vehicle_model_id);

-- Step 3: Verify
-- Run test queries to ensure constraints work
```

### Data Impact
- ✅ **Existing Parts**: NO CHANGE
  - Will have zero compatibility records
  - Interpreted as universal parts (backward compatible)
- ✅ **Existing APIs**: NO BREAKING
  - Parts table unchanged
  - New filter param is optional
- ✅ **Existing Queries**: NO CHANGE
  - No changes to parts table schema

### Rollback Plan
```sql
-- If needed, drop table and indexes
DROP TABLE IF EXISTS part_vehicle_compatibility CASCADE;
-- Indexes dropped automatically with table
```

**Rollback Impact**: SAFE
- No data loss (parts table untouched)
- System returns to previous state (all parts universal)
- No FK constraints from other tables to this junction table

## Performance Considerations

### Query Performance
- **Indexed Lookups**: O(log n) for both directions (part → models, model → parts)
- **Matrix Load**: Pagination required (20 parts × 50 models per page)
- **Filter Query**: Optimized with LEFT JOIN and EXISTS

### Scalability
**Estimated Data Volume**:
- Parts: ~1,000
- Vehicle Models: ~50
- Compatibility Records: ~3,000-5,000 (average 3-5 models per part)

**Index Size**: < 1MB (UUID indexes very efficient)

**Query Performance**:
- Single part compatibility lookup: < 10ms
- Filter parts by model: < 50ms (with index)
- Matrix load (20 parts × 50 models): < 100ms

## Security & Permissions

**CRUD Operations**:
- **CREATE**: Admin, Parts Manager
- **READ**: All authenticated users
- **UPDATE**: Admin, Parts Manager
- **DELETE**: Admin only

**Audit Trail**:
- `created_by` tracks who created compatibility
- `created_at` tracks when
- `activity_logs` table logs all compatibility changes (separate audit trail)

## Testing Checklist

### Unit Tests
- ✅ Create compatibility record
- ✅ Prevent duplicate compatibility (UNIQUE constraint)
- ✅ Cascade delete when part deleted
- ✅ Cascade delete when vehicle model deleted
- ✅ NULL compatibility = Universal part

### Integration Tests
- ✅ Filter parts by vehicle model (includes universals)
- ✅ GET compatibility for part
- ✅ POST create compatibility
- ✅ PUT update compatibility (replace all)
- ✅ DELETE specific compatibility

### Performance Tests
- ✅ Matrix load with 20 parts × 50 models < 100ms
- ✅ Filter query with 1000 parts < 50ms

---

**Related Documents**:
- FRD Parts v1.1: Updated Part entity with `compatible_models` field
- FRD Master Data v1.3: FR-MD-009 (Part Compatibility Management)
- API Spec Parts v1.1: Filter endpoint `GET /api/parts?vehicle_model_id={uuid}`
- API Spec Master Data v1.3: Compatibility CRUD endpoints

**Created**: 03/02/2026  
**CR**: CR-20260203-005 (Part-Vehicle Compatibility)  
**Author**: Antigravity - Database Architect
