# CR INTAKE: CR-20260203-006

## Document Information
- **CR ID**: CR-20260203-006
- **Title**: GetDataForFK - API Helper for Foreign Key Dropdown Data
- **Created**: 03/02/2026
- **Author**: Antigravity - Business Analyst
- **Status**: PENDING APPROVAL

---

## 1. Change Request Summary

### Original Request
**Source**: `docs/requirements/change_requests/GetDataForFK.md`

**Yêu cầu**: 
Toàn bộ các trường Foreign Key (FK) trong tất cả các màn hình của hệ thống cần phải được hiển thị dưới dạng dropdown/select box, cho phép người dùng chọn giá trị từ danh sách dữ liệu có sẵn thay vì nhập tay.

**Nguồn dữ liệu**:
Dữ liệu cho các dropdown/select box phải được lấy từ các màn hình quản lý dữ liệu chính (Master Data) tương ứng.

**Ví dụ cụ thể**:
- Màn hình: Quản lý Phụ tùng
- Trường FK: Dòng xe tương thích
- Yêu cầu: Phải có dropdown "Dòng xe" cho phép người dùng chọn
- Nguồn dữ liệu: Lấy danh sách từ màn hình Master Data "Dòng xe"

**Phạm vi áp dụng**:
Áp dụng cho tất cả các trường FK trong toàn bộ các màn hình của hệ thống (màn hình thêm mới, màn hình chỉnh sửa, màn hình tìm kiếm/lọc).

**Lợi ích**:
- Đảm bảo tính toàn vẹn dữ liệu (data integrity)
- Tránh lỗi nhập liệu sai
- Cải thiện trải nghiệm người dùng
- Thống nhất cách thức nhập liệu trong toàn hệ thống

---

## 2. CR Classification

### Type
**Technical Infrastructure Enhancement** (API Layer)

### Category
- **Backend**: API Endpoints (New)
- **Pattern**: Standard CRUD List for Dropdown/Select Data
- **Scope**: Cross-Module (All modules with FK references)

### Priority
**HIGH** (P1)

**Rationale**:
- Affects data integrity across entire system
- Required for better UX consistency
- Foundation for proper referential integrity
- Enables proper validation at UI layer

---

## 3. Business Validation

### Business Need
✅ **VALID**

**Justification**:
1. **Data Integrity**: Preventing invalid FK references through UI validation
2. **User Experience**: Dropdown is standard UX pattern for selecting from fixed lists
3. **Consistency**: Unified approach across all modules
4. **Error Prevention**: Eliminates typos and invalid entries

### Stakeholder Impact
- **Users**: Better UX, fewer errors
- **Admins**: Easier data management
- **Developers**: Standard pattern to follow
- **QA**: Easier to test with predictable dropdown options

---

## 4. Technical Validation

### Current State Analysis

**Existing FK References** (Samp các modules chính):

1. **CRM Module**:
   - `leads.assigned_to` → users
   - `customers.vehicle_model_id` → vehicle_models
   - `test_drives.vehicle_model_id` → vehicle_models

2. **Sales Module**:
   - `quotations.customer_id` → customers
   - `quotations.vehicle_model_id` → vehicle_models
   - `quotation_items.accessory_id` → accessories

3. **Service Module**:
   - `repair_orders.customer_id` → customers
   - `repair_orders.vehicle_id` → vehicles
   - `service_items.service_catalog_id` → service_catalog

4. **Parts Module**:
   - `parts.supplier_id` → suppliers
   - `part_vehicle_compatibility.vehicle_model_id` → vehicle_models

5. **Master Data Module**:
   - `accessories.compatible_models` → vehicle_models (junction table)
   - `employees.department_id` → departments

**Pattern**: Tất cả các FK references cần dropdown data

---

## 5. Similarity Analysis

### Similar Existing Patterns

#### Pattern 1: Master Data Endpoints
**Location**: `docs/design/api/api_spec_master_data_v1.2.md`

**Existing Endpoints**:
```
GET /api/vehicle-models       → List all vehicle models
GET /api/accessories          → List all accessories  
GET /api/service-catalog      → List all service catalog
GET /api/users                → List all users
```

**Pattern**: Simple GET endpoints returning array of entities with `id` and `name` for dropdown usage

✅ **REUSABLE**: 100% pattern match

#### Pattern 2: Dropdown Data Structure
**Common Response Format**:
```typescript
{
  data: [
    { id: 'uuid-1', name: 'Honda City', status: 'ACTIVE' },
    { id: 'uuid-2', name: 'Honda Civic', status: 'ACTIVE' }
  ]
}
```

✅ **STANDARDIZED**: Already consistent across existing endpoints

---

## 6. Proposed Solution

### Approach

**Option 1** (❌ NOT RECOMMENDED): Tạo riêng FK lookup endpoint cho mỗi entity
- Con: Too many endpoints (1 per FK relationship)
- Con: Maintenance overhead
- Con: Không scale

**Option 2** (✅ RECOMMENDED): Reuse existing Master Data endpoints + Add missing ones
- Pro: Leverage existing GET endpoints
- Pro: Standard pattern already proven
- Pro: Minimal changes needed
- Pro: Easy to maintain

### Recommended Solution

**1. API Layer**:
- ✅ Reuse existing `GET /api/{entity-name}` endpoints
- ✅ Add query param `?for_dropdown=true` to return minimal fields (id, name, status only)
- ✅ Add missing endpoints for entities not yet having list APIs

**2. Frontend Pattern**:
- ✅ Create reusable `useFKData(entityName)` React hook hoặc utility function
- ✅ Hook calls appropriate `GET /api/{entity}?for_dropdown=true`
- ✅ Caches data to minimize API calls

**3. Scope**:
- ✅ Identify all FK relationships from ERD
- ✅ Ensure all referenced entities have list endpoints
- ✅ Update FRD to specify dropdown requirement for FK fields

---

## 7. Impact Assessment (Preliminary)

### Documents Affected

| Document | Impact Level | Reason |
|----------|--------------|--------|
| BRD | ❌ NONE | Business objectives unchanged |
| FRD (All modules) | ⭐ HIGH | Need to specify dropdown for ALL FK fields |
| ERD | ❌ NONE | Database schema unchanged |
| API Spec (All modules) | ⭐ MEDIUM | Add missing list endpoints + `?for_dropdown` param |
| UI Spec (All modules) | ⭐ HIGH | Specify dropdown component usage for FK fields |

### Modules Affected
- **ALL MODULES** (CRM, Sales, Service, Parts, Master Data, Admin, Accounting, Insurance, Dashboard)

**Reason**: Cross-cutting concern - every module has FK references

---

## 8. Effort Estimate

### Complexity
**Medium** (Standard pattern, but affects many modules)

### Story Points
**8 SP** (Divided across modules)

**Breakdown**:
- API: Add missing list endpoints: 2 SP
- API: Add `?for_dropdown` param to existing endpoints: 1 SP
- Frontend: Create reusable hook/utility: 1 SP
- FRD Updates: Document dropdown requirement for all FK fields: 2 SP
- UI Spec Updates: Specify dropdown usage: 1 SP
- Testing: Verify all FK dropdowns work: 1 SP

### Duration
**3-4 days** (Parallel work across modules)

---

## 9. Risk Assessment

### Risk Level
**LOW**

**Rationale**:
- ✅ Pattern already exists (Master Data endpoints)
- ✅ No breaking changes (additive only)
- ✅ Backend changes minimal (query param + new endpoints)
- ✅ Frontend changes follow established pattern

### Potential Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Performance issues nếu dropdown data lớn | Low | Medium | Implement pagination, caching |
| Missing FK endpoints | Medium | High | Comprehensive ERD review to identify all FKs |
| Inconsistent dropdown formats | Low | Medium | Standardize response structure |

---

## 10. Dependencies

### Internal Dependencies
- Master Data Module (source of FK data)
- ERD (identify all FK relationships)
- All modules (implement dropdown UX)

### External Dependencies
- ❌ None

---

## 11. Acceptance Criteria

### Must Have
1. ✅ All FK fields in all screens use dropdown/select components
2. ✅ All FK entities have list API endpoints
3. ✅ Dropdown data loaded from Master Data APIs
4. ✅ Active records only shown in dropdowns (status = 'ACTIVE')
5. ✅ Dropdowns work in Add, Edit, and Filter screens

### Should Have
1. ✅ Dropdown data cached to minimize API calls
2. ✅ Search functionality in dropdowns (if list > 10 items)
3. ✅ Loading state while fetching dropdown data

### Nice to Have
1. ⭐ Lazy loading for large dropdown lists
2. ⭐ Multi-select dropdowns for junction table relationships

---

## 12. Decision

### Recommendation
✅ **APPROVED**

**Rationale**:
1. ✅ Valid business need (data integrity, UX consistency)
2. ✅ Technical feasibility confirmed (pattern exists)
3. ✅ Low risk (non-breaking, additive changes)
4. ✅ Reasonable effort (8 SP, 3-4 days)
5. ✅ High impact (affects all modules positively)

### Next Steps
1. **CR-02**: Perform detailed Impact Analysis
   - List ALL FK relationships from ERD
   - Identify missing list endpoints
   - Detail FRD/API/UI changes per module

2. **CR-03**: Create DRAFT documents
   - Update FRD (all modules) với dropdown requirement
   - Update API Spec (all modules) với missing endpoints
   - Update UI Spec (all modules) với dropdown usage pattern

---

## 13. Notes

### Implementation Pattern (Reference)

**API Pattern**:
```typescript
// GET /api/vehicle-models?for_dropdown=true
{
  data: [
    { id: 'uuid', name: 'Honda City', status: 'ACTIVE' }
  ]
}
```

**Frontend Pattern**:
```tsx
// Reusable hook
const { data, loading } = useFKData('vehicle-models');

// Usage in form
<Select
  options={data}
  value={formData.vehicle_model_id}
  onChange={handleChange}
  getOptionLabel={(opt) => opt.name}
  getOptionValue={(opt) => opt.id}
/>
```

### Validation Rules
- Only ACTIVE records shown in dropdowns
- Required FK fields: dropdown is required
- Optional FK fields: dropdown allows null/empty selection

---

**Status**: ✅ READY FOR CR-02 (Impact Analysis)

---

**END OF CR INTAKE**
