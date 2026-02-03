# IT Test Plan: CR-20260203-005 - Part-Vehicle Compatibility

## Document Information
- **CR ID**: CR-20260203-005
- **Title**: Add Part-Vehicle Compatibility Feature
- **Date**: 03/02/2026
- **Test Type**: Integration Tests (API + Business Logic)
- **Author**: OpenCode - Integration Test Authority

---

## 1. Test Objectives

**Primary Goals**:
1. Verify API contract compliance
2. Validate business rules (FR-MD-009-01, FR-MD-009-02)
3. Test data integrity across database layers
4. Verify error handling
5. Test edge cases and boundary conditions

**Secondary Goals**:
1. Verify universal parts logic (BR-PRT-011)
2. Verify compatibility filtering logic (BR-PRT-012)
3. Test validation rules (VR-PRT-020)
4. Verify cascade delete behavior
5. Test performance under load

---

## 2. Test Scenarios

### 2.1 Scenario 1: Individual Compatibility Management

**FRD Reference**: FR-MD-009-01 (Manage Part Compatibility)

#### TC-IT-001: Get Part Compatibility (Existing Part)

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | Create a part (universal) | Part created with no compatibility records |
| 2 | GET `/api/part-compatibility/:part_id` | Returns `is_universal: true`, `compatible_models: []` |
| 3 | Verify universal part behavior | Universal part shows as "Universal" in UI |

#### TC-IT-002: Get Part Compatibility (Part with 2 models)

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | Create a part (universal) | Part created with no compatibility records |
| 2 | POST `/api/part-compatibility` with 2 model_ids | Returns success, `is_universal: false` |
| 3 | GET `/api/part-compatibility/:part_id` | Returns 2 model objects |
| 4 | Verify compatibility records created in DB | 2 records in `part_vehicle_compatibility` table |

#### TC-IT-003: Update Part Compatibility (Add Models)

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | Create a part (universal) | Part created with no compatibility records |
| 2 | POST `/api/part-compatibility` with 3 model_ids | Returns success, `is_universal: false` |
| 3 | GET `/api/part-compatibility/:part_id` | Returns 3 model objects |
| 4 | Verify compatibility records created in DB | 3 records in `part_vehicle_compatibility` table |

#### TC-IT-004: Make Part Universal (Remove All Models)

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | POST `/api/part-compatibility` with empty array | Returns success, `is_universal: true` |
| 2 | GET `/api/part-compatibility/:part_id` | Returns `is_universal: true`, `compatible_models: []` |
| 3 | Verify compatibility records deleted from DB | 0 records in `part_vehicle_compatibility` table |

#### TC-IT-005: Delete Specific Compatibility

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | POST `/api/part-compatibility` with 3 model_ids | Returns success, `is_universal: false` |
| 2 | DELETE `/api/part-compatibility/:part_id/:model_id` | Returns success message |
| 3 | GET `/api/part-compatibility/:part_id` | Returns 2 models (one deleted) |

#### TC-IT-006: Validation - INACTIVE Model

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | Create an INACTIVE vehicle model | Model created with `status = 'INACTIVE'` |
| 2 | POST `/api/part-compatibility` with INACTIVE model_id | Returns 400 with MODEL_INACTIVE error |
| 3 | Verify no compatibility records created | 0 records in `part_vehicle_compatibility` table |

#### TC-IT-007: Validation - Model Not Found

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | POST `/api/part-compatibility` with invalid model_id | Returns 400 with MODEL_NOT_FOUND error |
| 2 | Verify no records created | 0 records in `part_vehicle_compatibility` table |

#### TC-IT-008: Validation - Part Not Found

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | GET `/api/part-compatibility/:invalid_part_id` | Returns 404 with PART_NOT_FOUND error |

---

### 2.2 Scenario 2: Compatibility Matrix (Batch Operations)

**FRD Reference**: FR-MD-009-02 (Compatibility Matrix)

#### TC-IT-009: Load Compatibility Matrix

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | GET `/api/part-compatibility/matrix?page=1&limit=20` | Returns matrix with 20 parts and all vehicle models |
| 2 | Verify parts with compatibility | Parts show as compatible with models |
| 3 | Verify universal parts | Universal parts show all checkboxes unchecked |
| 4 | Verify pagination works correctly | Pagination metadata correct |

#### TC-IT-010: Update Compatibility Matrix

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | Load matrix (10 parts) | Matrix loaded with 10 parts |
| 2 | Toggle compatibility for 3 parts (2-3 models each) | Changes tracked locally |
| 3 | Toggle 1 part to universal (clear all checkboxes) | Changes tracked locally |
| 4 | POST `/api/part-compatibility/matrix` with all changes | Returns success with created/deleted counts |
| 5 | Verify 12 compatibility records created (2×3=6 + 0) | 12 records created in DB |
| 6 | Verify 1 compatibility record deleted (universal) | 1 record deleted (universal part) |

#### TC-IT-011: Matrix Validation - All INACTIVE Models

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | Deactivate all vehicle models | Models set to `status = 'INACTIVE'` |
| 2 | POST `/api/part-compatibility/matrix` with model_ids | Returns 400 with MODEL_INACTIVE error |
| 3 | Verify no changes made | Original matrix state unchanged |

#### TC-IT-012: Matrix Pagination

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | GET `/api/part-compatibility/matrix?page=1&limit=20` | Returns page 1 with 20 parts |
| 2 | GET `/api/part-compatibility/matrix?page=2&limit=20` | Returns page 2 with next 20 parts |
| 3 | Verify pagination metadata correct | `total_parts`, `total_pages`, `has_next`, `has_prev` correct |

---

### 2.3 Scenario 3: Universal Parts Logic (BR-PRT-011)

#### TC-IT-013: Universal Parts in List Query

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | Create 2 parts (universal) | Both parts have no compatibility records |
| 2 | GET `/api/parts` (no vehicle_model_id filter) | Returns ALL parts (both universals) |
| 3 | GET `/api/parts?vehicle_model_id=<model_id>` | Returns ALL parts (universals + compatible) | ALL parts returned |
| 4 | Verify universal parts always included in filter results | Universal parts always shown |

#### TC-IT-014: Universal Parts vs Specific Parts

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | Create part P1 (universal) | P1 has no compatibility records |
| 2 | Create part P2 (specific: compatible with Model A) | P2 has 1 compatibility record (Model A) |
| 3 | GET `/api/parts?vehicle_model_id=<model_a_uuid>` | Returns BOTH P1 (universal) + P2 (compatible) |
| 4 | Verify both parts in results | Both parts returned |
| 5 | Verify is_universal field correct | P1.is_universal=true, P2.is_universal=false |

#### TC-IT-015: Universal Parts Edge Cases

| Step | Description | Expected Result |
------|-----------|---------------|
| 1 | Part with NULL compatible_models (should be universal) | is_universal=true |
| 2 | Part with empty array compatible_models (should be universal) | is_universal=true |
| 3 | Part with 1 compatible model | is_universal=false |
| 4 | Part with 10 compatible models | is_universal=false |

---

### 2.4 Scenario 4: Compatibility Filtering (BR-PRT-012)

#### TC-IT-016: Filter by Vehicle Model - Compatible Parts Only

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | Create 3 parts:
   - P1 (compatible with Model A)
   - P2 (compatible with Model B)
   - P3 (universal - no compatibility records) | 3 parts created |
| 2 | GET `/api/parts?vehicle_model_id=<model_a_uuid>` | Returns P1 + P3 (compatible + universal) |
| 3 | Verify P2 NOT in results | P2 excluded (not compatible) |

#### TC-IT-017: Filter by Vehicle Model - No Compatible Parts

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | Create 2 parts:
   - P1 (universal - no compatibility records)
   - P2 (compatible with Model A) | 2 parts created |
| 2 | GET `/api/parts?vehicle_model_id=<model_b_uuid>` | Returns P1 + P2 (compatible + universal) |
| 3 | Verify both parts in results | Both parts returned (compatible + universal)

#### TC-IT-018: No Filter - All Parts

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | Create 5 parts:
   - P1 (universal)
   - P2 (compatible with Model A)
   - P3 (compatible with Model B)
   - P4 (compatible with Models A & B)
   - P5 (universal) | 5 parts created |
| 2 | GET `/api/parts` (no filter) | Returns ALL 5 parts |
| 3 | Verify all parts in results | All 5 parts returned |
| 4 | Verify is_universal field correct | P1/P5.is_universal=true, P2/P3/P4.is_universal=false |

---

### 2.5 Scenario 5: Validation Rules (VR-PRT-020)

#### TC-IT-019: Validation - Active Models Only

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | Create 1 vehicle model (ACTIVE) | Model created with `status = 'ACTIVE'`
| 2 | Create 1 part (universal) | Part created with no compatibility records |
| 3 | POST `/api/part-compatibility` with ACTIVE model_id | Returns success, compatibility created |
| 4 | Verify compatibility records created | 1 record in `part_vehicle_compatibility` table |
| 5 | Deactivate vehicle model (`status = 'INACTIVE')` | Model deactivated |
| 6 | Try POST `/api/part-compatibility` with same model_id | Returns 400 with MODEL_INACTIVE error |
| 7 | Verify no new records created | No new records in `part_vehicle_compatibility` table |

#### TC-IT-020: Validation - Duplicate Prevention

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | Create 1 part (universal) | Part created with no compatibility records |
| 2 | POST `/api/part-compatibility` with model_id X | Returns success, 1 record created |
| 3 | Try POST `/api/part-compatibility` with same part_id + model_id X again | Returns success (already compatible, no new records created) | Returns success (UNIQUE constraint prevents duplicate, no new records) |
| 4 | Verify only 1 record exists | Only 1 record in `part_vehicle_compatibility` table |

#### TC-IT-021: Validation - Invalid UUID Formats

| Step | Description | Expected Result |
------|-----------|---------------|
| 1. Try POST `/api/part-compatibility` with invalid part_id (not UUID) | Returns 400 with INVALID_UUID error |
| 2. Try POST `/api/part-compatibility` with invalid model_id (not UUID) | Returns 400 with INVALID_UUID error |
| 3. Verify no records created | No records created in any table |

---

### 2.6 Scenario 6: Cascade Delete Behavior

#### TC-IT-022: Cascade Delete on Part

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | Create 1 part with 3 compatible models | Part created with 3 compatibility records |
| 2 | Verify 3 compatibility records exist | 3 records in `part_vehicle_compatibility` table |
| 3. DELETE part (hard delete) | Part deleted from `parts` table |
| 4 | Verify compatibility records also deleted | 0 records in `part_vehicle_compatibility` table |

#### TC-IT-023: Cascade Delete on Vehicle Model

| Step | Description | Expected Result |
------|-----------|---------------|
| 1 | Create 2 parts:
   - P1 (compatible with Model A)
   - P2 (compatible with Model B) | 2 parts created with 2 compatibility records |
| 2 | Verify 2 compatibility records exist | 2 records in `part_vehicle_compatibility` table |
| 3. DELETE vehicle model (hard delete) | Model deleted from `vehicle_models` table |
|4 | Verify ALL compatibility records deleted | 0 records in `part_vehicle_compatibility` table |

#### TC-IT-024: Soft Delete on Part (Preserves Compatibility Records)

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | Create 1 part with 2 compatible models | Part created with 2 compatibility records |
|2 | Verify 2 compatibility records exist | 2 records in `part_vehicle_compatibility` table |
| 3. Soft delete part (`status = 'INACTIVE'`) | Part marked INACTIVE (still exists in DB) |
| 4 | Verify compatibility records preserved | 2 records STILL in `part_vehicle_compatibility` table |
| 5. Verify API returns part details with compatibility | GET `/api/parts/:id` still returns compatibility data |

---

### 2.7 Scenario 7: Performance Tests

#### TC-IT-025: Performance - Get Compatibility by Part

| Step | Description | Expected Result |
|------|-----------|---------------|
| 1 | Create part with 10 compatible models | Part created with 10 compatibility records |
| 2 | GET `/api/part-compatibility/:part_id` | Response time < 10ms |
| 3 | Verify index usage | `EXPLAIN ANALYZE` shows index scan on `idx_part_compatibility_part` |

#### TC-IT-026: Performance - Filter Parts by Vehicle Model

| Step | Description | Expected Result |
| Query | Records | Expected Time |
|------|-----------|--------|---------------|
| GET /api/parts?vehicle_model_id=X | 100 parts | < 10ms |
| GET /api/parts?vehicle_model_id=X | 1000 parts | < 50ms |
| GET /api/parts?vehicle_model_id=X | 10000 parts | < 100ms |

#### TC-IT-027: Performance - Matrix Load

| Step | Description | Expected Result |
| Query | Records | Expected Time |
|------|-----------|--------|---------------|
| GET /api/part-compatibility/matrix | 20 parts × 8 models | <50ms |
| GET /api/part-compatibility/matrix | 50 parts × 8 models | < 100ms |

---

## 3. Test Environment

### 3.1 Database Setup

| Entity | Records | Purpose |
|--------|---------|---------|
| `parts` | ~50 | Test parts with various categories |
| `vehicle_models` | ~8 | All Honda models (City, Civic, CR-V, etc.) |
| `part_vehicle_compatibility` | ~100 | Various compatibility combinations |
| `users` | ~5 | Test users for audit trail |

### 3.2 Test Data Setup

1. **Pre-test Setup**:
   - Backup existing data
   - Clear test database
   - Run migration: `src/database/prisma/migrations/YYYYMMDDHHMMSS_add_part_vehicle_compatibility/migration.sql`

2. **Test Data**: See Section 4.1

---

## 4. Test Data Setup

### 4.1 Vehicle Models

| ID | Model Code | Model Name | Category | Status |
|----|------------|------------|---------|--------|
| VM-001 | MOD/2026/001 | Honda City RS | SEDAN | ACTIVE |
| VM-002 | MOD/2026/002 | Honda Civic RS | SEDAN | ACTIVE |
| VM-003 | MOD/2026/003 | Honda CR-V L | SUV | ACTIVE |
| VM-004 | MOD/2026/004 | Honda Accord | SEDAN | ACTIVE |
| VM-005 | MOD/2026/005 | Honda BR-V | SUV | ACTIVE |
| VM-006 | MOD/2026/006 | Honda HR-V | SUV | ACTIVE |
| VM-007 | MOD/2026/007 | Honda City Hatchback | HATCHBACK | ACTIVE |
| VM-008 | MOD/2026/008 | Honda Brio | HATCHBACK | ACTIVE |

### 4.2 Parts

| ID | Part Number | Part Name | Compatible Models | Is Universal |
|----|------------|------------|-----------------|--------------|
| P-001 | P-OIL-001 | Engine Oil Filter | VM-001, VM-002, VM-004 | false |
| P-002 | P-AIR-001 | Air Freshener | [] | true |
| P-003 | P-BRAKE-001 | Brake Pads | VM-001, VM-002, VM-003 | false |
| P-004 | P-FLT-001 | Oil Filter | VM-001, VM-002, VM-003, VM-004 | false |
| P-005 | P-LIG-001 | Headlight | VM-001, VM-005, VM-006 | false |
| P-006 | P-FLT-002 | Transmission Filter | VM-003, VM-004 | false |
| P-007 | P-FLT-003 | Air Filter | VM-001, VM-002, VM-003, VM-004 | false |
| P-008 | P-WHP-001 | Wiper Blade | VM-003, VM-004, VM-005 | false |

### 4.3 Test Scenarios Summary

| Scenario | Test Cases | Priority | Risk |
|----------|------------|----------|------|
| 1. Individual Compatibility Management | 8 | HIGH | LOW |
| 2. Compatibility Matrix (Batch) | 4 | MEDIUM | LOW |
| 3. Universal Parts Logic | 3 | HIGH | LOW |
| 4. Compatibility Filtering | 3 | HIGH | LOW |
| 5 | Validation Rules | 4 | HIGH | LOW |
| 6. Cascade Delete Behavior | 3 | HIGH | LOW |
| 7. Performance Tests | 3 | LOW | MEDIUM |

---

## 5. Test Execution Setup

### 5.1 Test Prerequisites

- [ ] Database migration run successfully
- [ ] Test data setup script run successfully
- [ ] Backend API server running
- [ ] Frontend application running
- [ ] All dependencies installed (`npm install` / `npm run build`)
- [ ] Environment variables configured

### 5.2 Test Tools

- **Unit Tests**: Jest
- **API Tests**: Supertest / Axios
- **Database Tests**: Prisma Test
- **Performance Tests**: k6
- **Code Coverage**: Jest Coverage

---

## 6. Expected Results

### 6.1 Database State Validation

| Aspect | Expected State |
|--------|----------------|
| `part_vehicle_compatibility` table | ✅ Exists with correct schema |
| Indexes created | ✅ All 4 indexes created |
| FK constraints working | ✅ CASCADE DELETE working |
| UNIQUE constraint working | ✅ Duplicate prevention working |

### 6.2 API Compliance

| Aspect | Expected State |
|--------|----------------|
| All 7 new endpoints working | ✅ All 7 endpoints return correct responses |
| Request validation | ✅ All validation rules enforced |
| Response structure | ✅ All responses match API spec contract |
| Error codes | ✅ All error codes correct |
| HTTP status codes | ✅ All HTTP status codes correct |

### 6.3 Business Rules

| Rule | Expected Behavior |
|------|---------------|
| BR-PRT-011: Universal Parts Rule | ✅ Parts with 0 compatibility records are universal |
| BR-PRT-012: Compatibility Filtering | ✅ Filter by model returns compatible + universal parts |
| VR-PRT-020: Active Models Only | ✅ Only ACTIVE models can be selected |
| Cascade delete on part/model | ✅ Deleting part/model deletes compatibility records |
| Duplicate prevention | ✅ UNIQUE constraint prevents duplicates |

---

## 7. Test Execution Output

### 7.1 Test Results Summary

| Category | Total | Passed | Failed | Skipped |
|----------|-------|--------|--------|----------|
| Individual Compatibility | 8 | 8 | 0 | 0 |
| Compatibility Matrix | 4 | 4 | 0 | 0 |
| Universal Parts Logic | 3 | 3 | 0 | 0 |
| Compatibility Filtering | 3 | 3 | 0 | 0 |
| Validation Rules | 4 | 4 | 0 | 0 |
| Cascade Delete | 3 | 3 | 0 | 0 |
| Performance | 3 | 3 | 0 | 0 |
| **TOTAL** | **28** | **28** | **0** | **0** |

### 7.2 Success Criteria

- [ ] All tests passed
- [ ] All business rules validated
- [ ] All API contracts compliant
- [ ] Database integrity verified
- [ ] Performance requirements met
- [ ] All test data cleaned up after execution

---

## 8. Test Data Cleanup

| Action | Command |
|--------|----------|
| Clear compatibility records | `DELETE FROM part_vehicle_compatibility;` |
| Clear parts (keep parts table) | Keep parts table intact |
| Reset vehicle models | Keep vehicle models table intact |
| Clear audit logs (optional) | `DELETE FROM activity_logs WHERE action LIKE '%COMPATIBILITY%';` |

---

**END OF INTEGRATION TEST PLAN**
