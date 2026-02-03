# CR INTAKE: CR-20260203-005

## Document Information
- **CR ID**: CR-20260203-005
- **Title**: Add Part-Vehicle Compatibility Feature
- **Date**: 03/02/2026
- **Author**: Antigravity - Business Analyst
- **Status**: APPROVED

---

## 1. Change Request Summary

### 1.1 Requestor Information
- **Submitted by**: Product Owner
- **Priority**: HIGH
- **Module**: Master Data / Parts Management
- **Type**: Feature Enhancement

### 1.2 Request Description

**Original Request**:
```
Sửa phần đăng ký phụ tùng
Chức năng tại master data đăng ký phụ tùng thì cần điền chỉnh
- Một phụ tùng có thể tương thích với nhiều dòng xe khác nhau
- Vì vậy phụ tùng cho phép chọn được tương thích với những dòng khác nhau
```

**Business Context**:
Hiện tại, trong hệ thống Parts Management (FRD Parts v1.0), phụ tùng được quản lý độc lập mà KHÔNG có thông tin về việc phụ tùng đó tương thích với dòng xe nào. Điều này dẫn đến:
- Nhân viên không biết phụ tùng nào fit với vehicle model nào
- Khó khăn trong việc tìm kiếm và đề xuất phụ tùng phù hợp cho khách hàng
- Rủi ro bán sai phụ tùng cho dòng xe không tương thích
- Không thể filter parts by vehicle model trong Service RO hoặc Quotation

---

## 2. Classification

### 2.1 CR Type
✅ **FEATURE_ENHANCEMENT**

**Rationale**:
- Bổ sung tính năng mới (vehicle compatibility) vào existing Parts entity
- KHÔNG thay đổi existing business logic của Parts
- Mở rộng khả năng của hệ thống
- Backward compatible (không breaking existing functionality)

### 2.2 Impact Level
✅ **MEDIUM** (Impacts 2 modules)

**Affected Modules**:
1. **Master Data Module** (FRD Master Data v1.2): Add compatibility management UI
2. **Parts Module** (FRD Parts v1.0): Add compatibility field to Part entity

### 2.3 Breaking Change Assessment
❌ **NON-BREAKING**

**Rationale**:
- Compatibility là optional field (một phụ tùng CÓ THỂ không có compatibility nếu là universal part)
- Existing Parts records vẫn valid (null compatibility = universal)
- Existing APIs vẫn hoạt động bình thường (backward compatible)
- Database migration sử dụng nullable field

---

## 3. Validation

### 3.1 Business Validation

**✅ VALID Business Need**:
- Đúng pain point thực tế: Nhân viên cần biết parts fit với vehicles nào
- Tăng độ chính xác khi chọn parts cho Service RO hoặc Sales Quotation
- Giảm lỗi bán sai phụ tùng
- Tăng trải nghiệm khách hàng

**✅ Alignment with System Goals**:
- Phù hợp với vision "Data-driven Honda SPICE ERP"
- Master Data integrity (dropdown consistency)
- Integration với existing modules (Service, Sales)

### 3.2 Technical Feasibility

**✅ FEASIBLE**:
- **Database**: Sử dụng junction table `part_vehicle_compatibility` (many-to-many)
- **UI**: Reuse existing multi-select pattern from Accessory Compatibility Matrix
- **API**: Standard CRUD endpoints cho compatibility management
- **No Technical Blockers**

### 3.3 Scope Validation

**✅ CLEAR AND BOUNDED**:
Scope rõ ràng:
- Add `compatible_models` field to Part entity
- UI: Multi-select dropdown for vehicle models
- UI: Compatibility matrix view (optional)
- API: CRUD for part-vehicle compatibility
- Database: Junction table with FKs

**Out of Scope** (explicitly):
- ❌ Advanced compatibility rules (e.g., year-specific, trim-specific)
- ❌ Cross-reference with OEM part numbers
- ❌ Compatibility suggestions based on ML

### 3.4 Risk Assessment

**LOW RISK**:
- Similar pattern đã implemented cho Accessory-Vehicle Compatibility (FRD Master Data v1.2, FR-MD-002-05)
- Proven architecture (junction table)
- No breaking changes
- Rollback dễ dàng (drop compatibility table)

---

## 4. Similarity Analysis

### 4.1 Existing Similar Features

**FOUND: Accessory Compatibility Matrix** (FRD Master Data v1.2, FR-MD-002-05)

**Similarities**:
| Aspect | Accessory Compatibility | Part Compatibility (New) |
|--------|------------------------|--------------------------|
| **Entity** | Accessory | Part |
| **Relationship** | Accessory ↔ VehicleModel | Part ↔ VehicleModel |
| **Cardinality** | Many-to-Many | Many-to-Many |
| **DB Pattern** | Junction table: `accessory_model_compatibility` | Junction table: `part_vehicle_compatibility` |
| **UI Pattern** | Multi-select dropdown + Matrix view | Same |
| **Validation** | At least 1 model selected | Same |
| **API** | CRUD for compatibility | Same |

**Reuse Strategy**:
✅ Reuse 100% architecture from Accessory Compatibility
✅ Reuse UI components (multi-select, matrix view)
✅ Reuse API patterns
✅ Reuse validation rules

---

## 5. Requirements Summary

### 5.1 Functional Requirements

**FR-NEW-001: Manage Part-Vehicle Compatibility**

**Description**: Admin có thể định nghĩa một phụ tùng tương thích với những vehicle models nào.

**User Stories**:
- **US-001**: Khi tạo/edit Part, Admin chọn được compatible vehicle models từ multi-select dropdown
- **US-002**: System lưu compatibility vào junction table
- **US-003**: Khi user filter parts by vehicle model, system chỉ hiển thị compatible parts
- **US-004**: Admin có thể view và edit Compatibility Matrix (Part × VehicleModel grid)

**Validation Rules**:
- VR-001: Mỗi part CÓ THỂ tương thích với 0 hoặc nhiều vehicle models (optional)
- VR-002: Nếu part không có compatibility data = Universal part (fit all vehicles)
- VR-003: Tất cả selected vehicle models phải ACTIVE
- VR-004: Không cho phép duplicate compatibility records

### 5.2 Non-Functional Requirements

**NFR-001: Performance**
- Compatibility lookup: < 100ms
- Matrix view load: < 500ms (for 100 parts × 50 models)

**NFR-002: Data Integrity**
- Foreign key constraints (part_id → parts, model_id → vehicle_models)
- Cascade delete: If vehicle model deleted → remove compatibility records
- Cascade delete: If part deleted → remove compatibility records

**NFR-003: Backward Compatibility**
- Existing Parts without compatibility = Universal parts
- Existing APIs still work without compatibility filter

---

## 6. Acceptance Criteria

### 6.1 Definition of Done

**✅ CR is DONE when**:
1. Database migration created và applied
2. Part entity có field `compatible_models`
3. UI: Create/Edit Part form có multi-select dropdown
4. UI: Compatibility Matrix view available
5. API: GET /api/parts?vehicle_model_id=XXX returns only compatible parts
6. API: POST/PUT/DELETE /api/part-compatibility works
7. All validation rules enforced
8. Unit tests: 100% pass
9. Integration tests: 100% pass
10. UAT: 100% pass

### 6.2 Test Scenarios

**TS-001: Create Part with Compatibility**
- Input: Part name = "Engine Oil Filter", Compatible Models = [City, Civic]
- Expected: Part created, 2 compatibility records inserted

**TS-002: Edit Part Compatibility**
- Input: Remove City, Add Accord
- Expected: City compatibility deleted, Accord compatibility added

**TS-003: Filter Parts by Vehicle Model**
- Input: GET /api/parts?vehicle_model_id=CITY_ID
- Expected: Only parts compatible with City (or universal parts)

**TS-004: Compatibility Matrix**
- Input: View matrix for 10 parts × 5 models
- Expected: Grid with checkboxes, current state loaded, can toggle and save

---

## 7. Dependencies

### 7.1 Document Dependencies

**Required Documents** (Latest Versions):
- ✅ FRD Parts v1.0 (current)
- ✅ FRD Master Data v1.2 (contains Accessory Compatibility pattern)
- ✅ ERD Master Data v1.2 (database schema)
- ✅ API Spec Parts v1.0 (current)
- ✅ API Spec Master Data v1.2 (contains Accessory Compatibility APIs)
- ✅ UI Spec Master Data v1.2 (contains Compatibility Matrix UI)

### 7.2 Data Dependencies

**Master Data Required**:
- ✅ VehicleModel master data (already exists in system)
- ✅ Part master data (already exists in system)

**No External Dependencies**: All required data already in system.

### 7.3 Module Dependencies

**Impacted Modules**:
1. **Master Data** (HIGH): Add compatibility management UI
2. **Parts** (MEDIUM): Add compatibility field to Part entity
3. **Service** (LOW): Filter parts by vehicle model in RO
4. **Sales** (LOW): Filter parts by vehicle model in Quotation

---

## 8. Effort Estimate

### 8.1 Complexity Assessment

**MEDIUM Complexity**

**Justification**:
- Reuse existing pattern (Accessory Compatibility) → Giảm complexity
- Standard CRUD operations
- No complex business logic
- Proven architecture

### 8.2 Story Points

**Estimate**: **5 Story Points**

**Breakdown**:
- Database design & migration: 1 SP
- Backend API implementation: 1.5 SP
- Frontend UI implementation: 1.5 SP
- Testing (unit + integration): 1 SP

### 8.3 Timeline

**Estimated Duration**: **2-3 days**

---

## 9. Decision

### 9.1 Approval Status

✅ **APPROVED**

**Approved by**: Antigravity - Business Analyst  
**Date**: 03/02/2026

**Rationale**:
1. ✅ Valid business need
2. ✅ Clear and bounded scope
3. ✅ Technically feasible
4. ✅ Reuse existing proven pattern
5. ✅ No breaking changes
6. ✅ Low risk
7. ✅ Medium complexity, reasonable effort
8. ✅ All dependencies available

### 9.2 Next Steps

**Proceed to**:
- ✅ CR-02: Impact Analysis
- ✅ CR-03: Update Requirement Documents (DRAFT)
- ✅ CR-04: Review & Approve
- ✅ CR-05: Consolidate into Main Documents
- ✅ CR-06: Implementation (by OpenCode)

---

## 10. Notes

### 10.1 Special Considerations

**Pattern Reuse**:
Có thể tham khảo 100% implementation từ Accessory Compatibility:
- FRD Master Data v1.2: FR-MD-002-05 (Manage Compatibility Matrix)
- ERD Master Data v1.2: Table `accessory_model_compatibility`
- API Spec Master Data v1.2: Compatibility endpoints
- UI Spec Master Data v1.2: Compatibility Matrix component

**Migration Strategy**:
- Existing parts without compatibility = Universal parts (compatible with ALL vehicles)
- No data migration needed
- Purely additive change

### 10.2 Open Questions

❌ **NO OPEN QUESTIONS**

All requirements are clear and can proceed to Impact Analysis.

---

**END OF CR-01 INTAKE**

---

## Appendix A: Current State Analysis

### A.1 FRD Parts v1.0 - Part Entity (Current)

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
  // ❌ NO compatibility field
}
```

### A.2 FRD Master Data v1.2 - Accessory Entity (Reference Pattern)

```typescript
{
  id: string,
  accessory_code: string,
  accessory_name: string,
  category: enum,
  price: number,
  compatible_models: string[], // ✅ THIS IS THE PATTERN TO REUSE
  installation_required: boolean,
  warranty_period_months: number,
  status: enum
}
```

**Junction Table**: `accessory_model_compatibility`
```sql
CREATE TABLE accessory_model_compatibility (
  id UUID PRIMARY KEY,
  accessory_id UUID REFERENCES accessories(id) ON DELETE CASCADE,
  vehicle_model_id UUID REFERENCES vehicle_models(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(accessory_id, vehicle_model_id)
);
```

✅ **EXACTLY THIS PATTERN will be reused for Parts**

---

**END OF DOCUMENT**
