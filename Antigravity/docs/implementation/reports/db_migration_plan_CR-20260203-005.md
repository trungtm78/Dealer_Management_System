# DB Migration Plan: CR-20260203-005 - Part-Vehicle Compatibility

## Document Information
- **CR ID**: CR-20260203-005
- **Title**: Add Part-Vehicle Compatibility Feature
- **Date**: 03/02/2026
- **Author**: OpenCode - Database Implementation Authority

---

## 1. Migration Overview

**Purpose**: Add junction table `part_vehicle_compatibility` to support many-to-many relationship between Parts and VehicleModels.

**ERD Reference**: `change_request_CR-20260203-005_impact_analysis.md` Section 3.1.1 (lines 286-306)

**Migration Type**: Non-breaking (additive only)

---

## 2. Migration Files

### 2.1 Migration: Add Part-Vehicle Compatibility Table

**File**: `src/database/prisma/migrations/YYYYMMDDHHMMSS_add_part_vehicle_compatibility/migration.sql`

**Prerequisites**:
- `parts` table exists (from Parts module)
- `vehicle_models` table exists (from Master Data module)
- `users` table exists (from Admin module)

---

## 3. SQL Schema

```sql
-- Migration: Add Part-Vehicle Compatibility
-- CR: CR-20260203-005
-- ERD: part_vehicle_compatibility junction table
-- Date: 2026-02-03

-- Create junction table for part-vehicle compatibility
CREATE TABLE part_vehicle_compatibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id UUID NOT NULL,
  vehicle_model_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID,

  -- Foreign Keys
  CONSTRAINT fk_part FOREIGN KEY (part_id)
    REFERENCES parts(id) ON DELETE CASCADE,

  CONSTRAINT fk_vehicle_model FOREIGN KEY (vehicle_model_id)
    REFERENCES vehicle_models(id) ON DELETE CASCADE,

  CONSTRAINT fk_created_by FOREIGN KEY (created_by)
    REFERENCES users(id) ON DELETE SET NULL,

  -- Unique Constraint (prevent duplicates)
  CONSTRAINT uq_part_model UNIQUE(part_id, vehicle_model_id)
);

-- Performance Indexes
CREATE INDEX idx_part_compatibility_part ON part_vehicle_compatibility(part_id);
CREATE INDEX idx_part_compatibility_model ON part_vehicle_compatibility(vehicle_model_id);
CREATE INDEX idx_part_compatibility_created_at ON part_vehicle_compatibility(created_at);

-- Comment on table
COMMENT ON TABLE part_vehicle_compatibility IS 'Junction table for Parts-VehicleModels many-to-many relationship';
```

---

## 4. Rollback Plan

```sql
-- Rollback: Drop Part-Vehicle Compatibility table
DROP TABLE IF EXISTS part_vehicle_compatibility CASCADE;
```

**Safety Notes**:
- CASCADE DROP will remove indexes and foreign key constraints automatically
- Existing `parts` and `vehicle_models` tables are NOT modified
- Historical data is preserved (no existing compatibility records to lose)

---

## 5. Data Migration

**Migration Strategy**: NO DATA MIGRATION REQUIRED

**Rationale**:
- Existing parts have NO compatibility records
- By definition, parts with NO compatibility records are UNIVERSAL (fit all models)
- This maintains backward compatibility
- Users can assign compatibility to parts after migration

---

## 6. Affected Tables

| Table | Type | Change | Impact |
|-------|------|---------|--------|
| `parts` | Existing | No change | ✅ Safe |
| `vehicle_models` | Existing | No change | ✅ Safe |
| `users` | Existing | No change | ✅ Safe |
| `part_vehicle_compatibility` | **NEW** | Created | ✅ Additive |

---

## 7. Foreign Key Constraints

| FK Name | Column | References | On Delete | On Update |
|----------|--------|------------|-----------|-----------|
| `fk_part` | `part_id` | `parts(id)` | CASCADE | (inherited) |
| `fk_vehicle_model` | `vehicle_model_id` | `vehicle_models(id)` | CASCADE | (inherited) |
| `fk_created_by` | `created_by` | `users(id)` | SET NULL | (inherited) |

**Business Rules**:
- CASCADE DELETE on `part_id`: When a part is deleted, all compatibility records are deleted
- CASCADE DELETE on `vehicle_model_id`: When a model is deleted, all compatibility records are deleted
- SET NULL on `created_by`: When a user is deleted, audit trail is preserved but `created_by` is null

---

## 8. Indexes for Performance

| Index Name | Columns | Purpose | Type |
|------------|---------|---------|------|
| PRIMARY KEY | `id` | Unique row identifier | B-tree |
| `idx_part_compatibility_part` | `part_id` | Fast lookup: "What models fit this part?" | B-tree |
| `idx_part_compatibility_model` | `vehicle_model_id` | Fast lookup: "What parts fit this model?" | B-tree |
| `idx_part_compatibility_created_at` | `created_at` | Audit trail sorting | B-tree |
| `uq_part_model` | `(part_id, vehicle_model_id)` | Prevent duplicate compatibility | Unique |

**Query Patterns Optimized**:
1. `SELECT * FROM part_vehicle_compatibility WHERE part_id = ?` → Uses `idx_part_compatibility_part`
2. `SELECT * FROM part_vehicle_compatibility WHERE vehicle_model_id = ?` → Uses `idx_part_compatibility_model`
3. `INSERT` duplicate prevention → Uses `uq_part_model`

---

## 9. Verification Steps

### 9.1 Migration Success Verification

```sql
-- 1. Check table exists
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'part_vehicle_compatibility';

-- Expected: 1 row

-- 2. Check structure
\d part_vehicle_compatibility;

-- Expected: All columns and constraints as defined

-- 3. Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'part_vehicle_compatibility';

-- Expected: 4 indexes (PK + 3 secondary indexes)

-- 4. Check FK constraints
SELECT conname, contype
FROM pg_constraint
WHERE conrelid = 'part_vehicle_compatibility'::regclass;

-- Expected: 3 FK constraints (fk_part, fk_vehicle_model, fk_created_by)
```

### 9.2 Functional Verification

```sql
-- 1. Insert test data (part compatible with 2 models)
INSERT INTO part_vehicle_compatibility (part_id, vehicle_model_id, created_by)
VALUES
  ('part-uuid-1', 'model-uuid-1', 'user-uuid-1'),
  ('part-uuid-1', 'model-uuid-2', 'user-uuid-1');

-- Expected: 2 rows inserted successfully

-- 2. Verify UNIQUE constraint (try duplicate)
INSERT INTO part_vehicle_compatibility (part_id, vehicle_model_id)
VALUES ('part-uuid-1', 'model-uuid-1');

-- Expected: ERROR: duplicate key value violates unique constraint "uq_part_model"

-- 3. Verify FK constraint (try invalid part_id)
INSERT INTO part_vehicle_compatibility (part_id, vehicle_model_id)
VALUES ('invalid-part-uuid', 'model-uuid-1');

-- Expected: ERROR: insert or update on table "part_vehicle_compatibility" violates foreign key constraint "fk_part"

-- 4. Verify FK constraint (try invalid model_id)
INSERT INTO part_vehicle_compatibility (part_id, vehicle_model_id)
VALUES ('part-uuid-1', 'invalid-model-uuid');

-- Expected: ERROR: insert or update on table "part_vehicle_compatibility" violates foreign key constraint "fk_vehicle_model"

-- 5. Verify CASCADE DELETE (delete part)
DELETE FROM parts WHERE id = 'part-uuid-1';

-- Expected: All compatibility records for this part are deleted automatically

-- 6. Verify universal parts logic (parts with NO compatibility records)
SELECT p.id, p.name, COUNT(pvc.vehicle_model_id) as compatible_count
FROM parts p
LEFT JOIN part_vehicle_compatibility pvc ON p.id = pvc.part_id
GROUP BY p.id, p.name;

-- Expected: Parts with compatible_count = 0 are UNIVERSAL
```

---

## 10. Sample Data (Optional)

```sql
-- Example: Engine Oil Filter is compatible with City and Civic
INSERT INTO part_vehicle_compatibility (part_id, vehicle_model_id, created_by)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001');

-- Example: Universal part (Air Freshener) has NO compatibility records
-- (Empty result = compatible with ALL models)
```

---

## 11. Performance Considerations

### 11.1 Expected Growth

**Estimated Records**:
- 100 parts × 8 vehicle models (average) = 800 compatibility records
- Growth rate: ~50 new parts/year × 8 models = 400 records/year
- 5-year projection: ~2,800 records

**Storage**: ~500 bytes/record = ~1.4MB for 2,800 records

### 11.2 Index Efficiency

All indexes are B-tree, optimized for:
- Equality lookups: `WHERE part_id = ?` or `WHERE vehicle_model_id = ?`
- Range scans: `WHERE created_at > ?` (audit queries)

### 11.3 Query Performance

**Expected query times** (with 2,800 records):
- Single part lookup: < 1ms (indexed on `part_id`)
- Single model lookup: < 1ms (indexed on `vehicle_model_id`)
- Universal parts filter: < 5ms (LEFT JOIN with WHERE IS NULL)

---

## 12. Security Considerations

### 12.1 Data Access

**Read Permissions**:
- `PARTS.READ`: Can view compatibility
- `MASTER_DATA.READ`: Can view vehicle models

**Write Permissions**:
- `MASTER_DATA.UPDATE`: Can create/update compatibility
- `ADMIN`: Full access

### 12.2 Audit Trail

All inserts to `part_vehicle_compatibility` are tracked via:
- `created_at` timestamp
- `created_by` user reference

---

## 13. Deployment Checklist

- [ ] Run migration on STAGING database
- [ ] Verify all constraints are created
- [ ] Run verification queries (Section 9)
- [ ] Test INSERT operations
- [ ] Test UNIQUE constraint violation
- [ ] Test FK constraint violation
- [ ] Test CASCADE DELETE behavior
- [ ] Backup PRODUCTION database before migration
- [ ] Run migration on PRODUCTION database
- [ ] Post-migration verification on PRODUCTION
- [ ] Monitor query performance after migration

---

## 14. Post-Migration Tasks

1. **Backend**: Update Prisma schema to include `part_vehicle_compatibility` model
2. **Backend**: Regenerate Prisma Client: `npx prisma generate`
3. **Backend**: Implement compatibility APIs (Prompt #07)
4. **Frontend**: Implement compatibility UI components (Prompt #09)
5. **Testing**: Run integration tests (Prompt #10)

---

**END OF MIGRATION PLAN**
