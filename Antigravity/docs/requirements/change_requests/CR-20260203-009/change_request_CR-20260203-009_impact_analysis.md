# CR Impact Analysis: CR-20260203-009

## Document Information
- **CR ID**: CR-20260203-009
- **Title**: Enhanced FK Dropdown - GetDataForFK
- **Date Created**: 03/02/2026
- **Created By**: Antigravity - Business Analyst
- **Status**: COMPLETED
- **Related Documents**: CR Intake CR-20260203-009

---

## 1. Executive Summary

### 1.1 Impact Overview

| Document | Impact Level | Change Type | Effort |
|----------|--------------|-------------|--------|
| BRD | LOW | Minor addition (UX objective) | 2 SP |
| FRD (all modules) | HIGH | Major (FK dropdown pattern specs) | 13 SP |
| ERD | NONE | No changes | 0 SP |
| API Spec (all modules) | MEDIUM | Moderate (pagination params) | 8 SP |
| UI Spec | HIGH | Major (new FK dropdown component) | 13 SP |

**Total Estimated Effort**: 36 Story Points (~144 hours)

### 1.2 Modules Affected

**All 8 Modules** (100% system-wide impact):
1. Admin - ~10 FK fields
2. CRM - ~15 FK fields
3. Sales - ~12 FK fields
4. Service - ~15 FK fields
5. Parts - ~10 FK fields
6. Insurance - ~8 FK fields
7. Accounting - ~10 FK fields
8. Master Data - ~10 FK fields

**Total FK Fields**: ~90 fields across ~80-100 screens

---

## 2. BRD Impact

### 2.1 Impact Level
**Level**: `LOW`

**Rationale**: Không thay đổi business objectives chính, chỉ thêm UX improvement objective

### 2.2 Changes Required

#### Section Affected: Section 3 - Business Objectives

**Addition**:
```markdown
### BO-09: Enhance User Experience với Smart Data Entry

**Objective**: Cải thiện trải nghiệm người dùng khi nhập liệu bằ cách cung cấp smart dropdowns cho Foreign Key fields

**Key Results**:
- Giảm thời gian nhập liệu: 30-50%
- Giảm lỗi data entry: 80-90%
- Tăng user satisfaction score: >4.5/5

**Features**:
- Real-time search trong FK dropdowns
- Pagination cho FK data
- Quick create new master data từ dropdown
```

#### Section Affected: Section 5 - Stakeholders

**Addition**:
```markdown
**All End Users**:
- Role: Primary beneficiaries của enhanced FK dropdowns
- Requirements: Fast, accurate data entry với minimal errors
```

### 2.3 Version Change
**Current**: BRD v2.1  
**New**: BRD v2.2  
**Change Type**: MINOR (v2.1 → v2.2)

---

## 3. FRD Impact (All Modules)

### 3.1 Impact Level
**Level**: `HIGH`

**Rationale**: Cần thêm specifications cho FK dropdown pattern vào TẤT CẢ FRD modules

### 3.2 New Functional Requirement Pattern

Cần thêm section mới vào mỗi FRD module:

#### FR-XXX-YYY: Foreign Key Dropdown Pattern

**Pattern Name**: AutocompleteFK  
**Applies To**: Tất cả FK fields trong module

**Functional Specifications**:

**1. Search Context (Real-time Search)**

**Preconditions**:
- User đã click vào FK dropdown field
- API endpoint hỗ trợ search parameter

**Main Flow**:
1. User clicks vào FK dropdown
2. System displays dropdown với:
   - Top 5 items (default)
   - Search textbox
   - "Tạo mới..." option (nếu có quyền CREATE)
3. User gõ từ khóa vào search textbox
4. System sends API request với search parameter:
   - Endpoint: `GET /api/{resource}?search={keyword}&limit=5`
   - Debounce: 300ms
5. System displays filtered results real-time
6. If no results: Hiển thị "Không tìm thấy. Tạo mới?"

**Postconditions**:
- Results được filtered theo từ khóa
- User có thể select hoặc create new

**Performance**:
- Search response time: < 300ms
- Debounce delay: 300ms

---

**2. Paged Display (Lazy Loading)**

**Preconditions**:
- Dropdown đã mở
- Total items > limit (5)

**Main Flow**:
1. System displays first 5 items
2. Dropdown shows scroll indicator nếu có more items
3. User scrolls down trong dropdown
4. When scroll reaches bottom:
   - System loads next page (5 items)
   - Append to dropdown list
5. Repeat until all items loaded hoặc user selects

**Postconditions**:
- All items accessible via scroll
- No performance lag

**API Parameters**:
- `page`: Page number (1-indexed)
- `limit`: Items per page (default: 5)

---

**3. Create New Data (Quick Create)**

**Preconditions**:
- User has permission: {RESOURCE}.CREATE
- User searched nhưng không tìm thấy desired item

**Main Flow**:
1. User clicks "Tạo mới..." option
2. System saves current form state (draft)
3. System navigates to Master Data screen:
   - Route: `/master/{resource}/new`
   - Mode: Modal or New Tab (tùy UX decision)
4. User completes creation form
5. User clicks "Lưu"
6. System creates new record
7. System returns to original form
8. System restores draft state
9. System auto-selects newly created item

**Postconditions**:
- New master data record created
- Original form restored với new item selected
- User có thể continue workflow

**Alternative Flow (Cancel)**:
- User clicks "Hủy" trong create form
- System returns to original form
- Draft state restored
- FK field remains unselected

---

### 3.3 FRD Modules to Update

**Danh sách FRD cần update**:

1. **frd_admin_v2.1.md** → **v2.2**
   - FK Fields: `role_id`, `user_id`, `department_id`, `position_id`
   - Add: FR-ADM-XXX (FK Dropdown Pattern)

2. **frd_cr_ v1.0.md** → **v1.1**
   - FK Fields: `customer_id`, `lead_id`, `scoring_rule_id`, `campaign_id`
   - Add: FR-CRM-XXX (FK Dropdown Pattern)

3. **frd_sales_v1.1.md** → **v1.2**
   - FK Fields: `customer_id`, `vehicle_model_id`, `accessory_id`, `vin_id`
   - Add: FR-SAL-XXX (FK Dropdown Pattern)

4. **frd_service_v1.0.md** → **v1.1**
   - FK Fields: `customer_id`, `vehicle_model_id`, `service_catalog_id`, `part_id`, `service_bay_id`
   - Add: FR-SVC-XXX (FK Dropdown Pattern)

5. **frd_parts_v1.0.md** → **v1.1**
   - FK Fields: `part_id`, `supplier_id`, `warehouse_id`
   - Add: FR-PRT-XXX (FK Dropdown Pattern)

6. **frd_insurance_v1.3.md** → **v1.4**
   - FK Fields: `customer_id`, `vehicle_model_id`, `contract_id`
   - Add: FR-INS-XXX (FK Dropdown Pattern)

7. **frd_accounting_v1.0.md** → **v1.1**
   - FK Fields: `customer_id`, `invoice_id`, `payment_method_id`
   - Add: FR-ACC-XXX (FK Dropdown Pattern)

8. **frd_master_data_v1.3.md** → **v1.4**
   - FK Fields: `vehicle_model_id`, `accessory_id`, `service_catalog_id`
   - Add: FR-MD-XXX (FK Dropdown Pattern)

**Total FRD Updates**: 8 files

### 3.4 Version Change Summary

| FRD | Current Version | New Version | Change Type |
|-----|----------------|-------------|-------------|
| frd_admin | v2.1 | v2.2 | MINOR |
| frd_crm | v1.0 | v1.1 | MINOR |
| frd_sales | v1.1 | v1.2 | MINOR |
| frd_service | v1.0 | v1.1 | MINOR |
| frd_parts | v1.0 | v1.1 | MINOR |
| frd_insurance | v1.3 | v1.4 | MINOR |
| frd_accounting | v1.0 | v1.1 | MINOR |
| frd_master_data | v1.3 | v1.4 | MINOR |

---

## 4. ERD Impact

### 4.1 Impact Level
**Level**: `NONE`

**Rationale**: 
- FK relationships đã tồn tại trong ERD v1.2
- Không cần thêm tables, columns, hoặc relationships
- **Đây là UI/UX enhancement, không phải data model change**

### 4.2 Changes Required
**None** - ERD version vẫn là **v1.2** (NO INCREMENT)

---

## 5. API Spec Impact (All Modules)

### 5.1 Impact Level
**Level**: `MEDIUM`

**Rationale**: Các API endpoints hiện tại CẦN thêm pagination và search params

### 5.2 Changes Required

#### 5.2.1 Standard GET Endpoint Enhancement

**Tất cả GET list endpoints** cần support:

**New Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | - | Search keyword (partial match on name/code fields) |
| `page` | number | No | 1 | Page number (1-indexed) |
| `limit` | number | No | 5 | Items per page (max: 100) |

**Example Endpoints to Update**:

1. **GET /api/vehicle-models**
   ```
   Existing: ?category=SEDAN&status=ACTIVE
   New: ?category=SEDAN&status=ACTIVE&search=city&page=1&limit=5
   ```

2. **GET /api/accessories**
   ```
   Existing: ?category=INTERIOR&status=ACTIVE
   New: ?category=INTERIOR&status=ACTIVE&search=mat&page=1&limit=5
   ```

3. **GET /api/service-catalogs**
   ```
   Existing: ?category=MAINTENANCE&status=ACTIVE
   New: ?category=MAINTENANCE&status=ACTIVE&search=oil&page=1&limit=5
   ```

**Pattern applies to**:
- `/api/vehicle-models`
- `/api/accessories`
- `/api/service-catalogs`
- `/api/parts`
- `/api/suppliers`
- `/api/customers`
- `/api/leads`
- `/api/employees`
- `/api/warehouses`
- `/api/service-bays`
- ... ALL resource list endpoints

#### 5.2.2 Response Format Change

**Current Response**:
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "total_pages": 5
  }
}
```

**No Change Required** - Response format đã hỗ trợ pagination

#### 5.2.3 Breaking Change Analysis

**Breaking Changes**: ✅ **NONE**

**Rationale**:
- `search`, `page`, `limit` là optional parameters
- Existing API calls vẫn hoạt động bình thường (backward compatible)
- Default values ensure no breaking changes

### 5.3 API Spec Files to Update

**Danh sách API Spec cần update**:

1. **api_spec_admin_v2.0.md** → **v2.1**
   - Add pagination params to user, role endpoints

2. **api_spec_crm_v1.0.md** → **v1.1**
   - Add pagination params to customer, lead endpoints

3. **api_spec_sales_v1.1.md** → **v1.2**
   - Add pagination params to quotation endpoints

4. **api_spec_service_v1.0.md** → **v1.1**
   - Add pagination params to service endpoints

5. **api_spec_parts_v1.0.md** → **v1.1**
   - Add pagination params to parts, supplier endpoints

6. **api_spec_insurance_v1.0.md** → **v1.1**
   - Add pagination params to insurance endpoints

7. **api_spec_accounting_v1.0.md** → **v1.1**
   - Add pagination params to invoice, payment endpoints

8. **api_spec_master_data_v1.2.md** → **v1.3**
   - Add pagination params to master data endpoints

**Total API Spec Updates**: 8 files

### 5.4 Version Change Summary

| API Spec | Current Version | New Version | Change Type |
|----------|----------------|-------------|-------------|
| api_spec_admin | v2.0 | v2.1 | MINOR |
| api_spec_crm | v1.0 | v1.1 | MINOR |
| api_spec_sales | v1.1 | v1.2 | MINOR |
| api_spec_service | v1.0 | v1.1 | MINOR |
| api_spec_parts | v1.0 | v1.1 | MINOR |
| api_spec_insurance | v1.0 | v1.1 | MINOR |
| api_spec_accounting | v1.0 | v1.1 | MINOR |
| api_spec_master_data | v1.2 | v1.3 | MINOR |

---

## 6. UI Spec Impact

### 6.1 Impact Level
**Level**: `HIGH`

**Rationale**: Cần define new UI component pattern (AutocompleteFK) và apply to all FK fields

### 6.2 New UI Component: AutocompleteFK

#### 6.2.1 Component Specification

**Component Name**: `AutocompleteFK`

**Props**:

```typescript
interface AutocompleteFKProps {
  // Required
  resource: string;              // API resource name (e.g., 'vehicle-models')
  value: number | null;          // Selected FK ID
  onChange: (id: number | null, item: any) => void;
  
  // Optional
  label?: string;                // Field label
  placeholder?: string;          // Placeholder text
  required?: boolean;            // Required field?
  disabled?: boolean;            // Disabled state
  
  // Display
  displayField?: string;         // Field to display (default: 'name')
  searchFields?: string[];       // Fields to search (default: ['name', 'code'])
  
  // Behavior
  pageSize?: number;             // Items per page (default: 5)
  debounceMs?: number;           // Search debounce (default: 300ms)
  
  // Quick Create
  canCreate?: boolean;           // Show "Tạo mới..." option? (default: check permission)
  createRoute?: string;          // Route to create form (default: '/master/{resource}/new')
  
  // Filters
  filters?: Record<string, any>; // Additional filters (e.g., {status: 'ACTIVE'})
}
```

#### 6.2.2 Component Behavior

**States**:
1. **Idle**: Dropdown closed
2. **Open**: Dropdown open, showing default 5 items
3. **Searching**: User typing, debouncing
4. **Loading**: Fetching data from API
5. **Results**: Displaying search results
6. **No Results**: No items found
7. **Creating**: User navigated to create form

**UI States**:

```
┌─────────────────────────────┐
│ Dòng xe *                   │ ← Idle (closed)
│ [Chọn dòng xe...]         ▼ │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Dòng xe *                   │ ← Open
│ [Search...]               ▼ │
├─────────────────────────────┤
│ Honda City RS               │ ← Top 5 items
│ Honda CR-V L                │
│ Honda Civic RS              │
│ Honda Accord                │
│ Honda HR-V                  │
│ ───────────────────────────│
│ + Tạo mới...                │ ← Quick create option
└─────────────────────────────┘

┌─────────────────────────────┐
│ Dòng xe *                   │ ← Searching
│ [city]                    ▼ │
├─────────────────────────────┤
│ 🔍 Đang tìm kiếm...         │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Dòng xe *                   │ ← Results
│ [city]                    ▼ │
├─────────────────────────────┤
│ Honda City RS               │ ← Filtered results
│ Honda City Hatchback        │
│ ───────────────────────────│
│ + Tạo mới "city"            │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Dòng xe *                   │ ← No Results
│ [xyz123]                  ▼ │
├─────────────────────────────┤
│ Không tìm thấy kết quả      │
│ + Tạo mới "xyz123"          │
└─────────────────────────────┘
```

#### 6.2.3 Refs Component Mapping

**Option 1: Use Existing shadcn/ui Combobox** (RECOMMENDED)

**Component**: `Combobox` from shadcn/ui
**Path**: `Refs/src/app/components/ui/combobox.tsx`
**Customization Needed**:
- Add pagination support
- Add "Create new" option
- Add debounce for search

**Effort**: 3 SP (extend existing component)

**Option 2: Build Custom Component**

**Base on**: shadcn/ui Combobox + Popover + Command
**Effort**: 8 SP (build from scratch)

**Decision**: Use Option 1 (extend shadcn/ui Combobox)

### 6.3 Screens to Update

**All screens with FK fields** (~80-100 screens):

**Admin Module**:
- User Form (role_id, department_id)
- Role Form (permission_ids)
- Activity Log Filter (user_id)

**CRM Module**:
- Lead Form (assigned_to_id, scoring_rule_id)
- Customer Form (tags)
- Interaction Form (customer_id, lead_id)
- Reminder Form (customer_id, lead_id)

**Sales Module**:
- Quotation Form (customer_id, vehicle_model_id, accessory_ids)
- Test Drive Form (customer_id, vehicle_model_id)
- Contract Form (customer_id, quotation_id, vin_id)

**Service Module**:
- Service Quote Form (customer_id, service_catalog_ids)
- Appointment Form (customer_id, service_quote_id, bay_id)
- Repair Order Form (customer_id, part_ids, bay_id)

**Parts Module**:
- Part Form (supplier_id, warehouse_id)
- Purchase Order Form (supplier_id, part_ids)
- Stock Movement Form (part_id, warehouse_id)

**Insurance Module**:
- Insurance Contract Form (customer_id, vehicle_model_id)
- Insurance Claim Form (contract_id)

**Accounting Module**:
- Invoice Form (customer_id, contract_id)
- Payment Form (invoice_id, customer_id)

**Master Data Module**:
- All master data forms (cross-references)

### 6.4 UI Spec Files to Update

**Cần update**:

1. **ui_spec_v1.6.md** → **v1.7**
   - Add AutocompleteFK component specification
   - Add FK dropdown pattern rules
   - Update all screen specs với AutocompleteFK

**OR**

**Create Module-specific UI Specs** (nếu chưa có):
- ui_spec_admin_vX.Y.md
- ui_spec_crm_vX.Y.md
- ui_spec_sales_vX.Y.md
- ... etc.

**Recommendation**: Update unified `ui_spec_v1.6.md` → `v1.7`

### 6.5 Version Change

**Current**: ui_spec_v1.6.md  
**New**: ui_spec_v1.7.md  
**Change Type**: MINOR

---

## 7. Effort Estimate

### 7.1 Effort Breakdown

| Phase | Task | Story Points | Hours |
|-------|------|--------------|-------|
| **Design & Analysis** | | | |
| | BRD updates | 1 | 4h |
| | FRD pattern definition | 3 | 12h |
| | API Spec updates | 2 | 8h |
| | UI Spec + component design | 3 | 12h |
| **Frontend Development** | | | |
| | AutocompleteFK component | 8 | 32h |
| | Integration with forms | 5 | 20h |
| **Backend Development** | | | |
| | API pagination + search | 5 | 20h |
| | Testing APIs | 3 | 12h |
| **Integration & Testing** | | | |
| | Component integration | 3 | 12h |
| | Cross-module testing | 5 | 20h |
| | UAT | 5 | 20h |
| **Documentation** | | | |
| | User guide | 2 | 8h |
| | Developer guide | 1 | 4h |
| **TOTAL** | | **46 SP** | **184h** |

**Estimated Duration**: 4-5 weeks (with 1 developer)

### 7.2 Complexity Assessment

**Complexity Level**: `COMPLEX`

**Factors**:
1. System-wide impact (8 modules, ~90 FK fields)
2. New UI component pattern
3. API enhancements across all modules
4. Navigation flow (quick create + return)
5. State management (draft save/restore)
6. Extensive testing required

### 7.3 Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Performance degradation với large datasets | Medium | High | Pagination + caching + indexing |
| State loss khi navigate to create form | Low | Medium | Local storage + session management |
| UX confusion với "create new" flow | Low | Medium | Clear UI labels + user training |
| Breaking existing forms | Low | High | Incremental rollout + regression testing |
| API timeout với slow search | Medium | Medium | Debounce + query optimization |

---

## 8. Dependencies

### 8.1 Technical Dependencies

**Frontend**:
- shadcn/ui Combobox component
- React state management (Context or Zustand)
- Navigation library (Next.js router)
- Debounce utility

**Backend**:
- Database full-text search indices
- API pagination support
- Query optimization

### 8.2 Process Dependencies

**Must Complete Before CR-03 (Drafts)**:
1. ✅ Finalize AutocompleteFK component design
2. ✅ Define FK pattern specifications
3. ✅ Identify all FK fields across modules

---

## 9. Refs Evaluation

### 9.1 Components Available in Refs

**Can Reuse** (✅):
1. `Combobox` - shadcn/ui (base component)
2. `Popover` - shadcn/ui (dropdown container)
3. `Command` - shadcn/ui (search + keyboard nav)
4. `Input` - shadcn/ui (search textbox)
5. `Badge` - shadcn/ui (tags display)

**Need to Extend** (⚠️):
1. Combobox + Pagination support
2. Combobox + "Create new" option
3. Combobox + Debounce

**NOT Available** (❌):
- None - All components có thể extend từ Refs

### 9.2 Refs Extension Strategy

**Strategy**: ✅ **EXTEND** existing Combobox

**Approach**:
1. Create `AutocompleteFK.tsx` wrapper around shadcn/ui Combobox
2. Add pagination logic
3. Add "Create new" option
4. Add debounce
5. Add navigation flow

**Compliance**: ✅ Tuân thủ Refs guidelines (extend, not rebuild)

---

## 10. Migration Strategy

### 10.1 Rollout Plan

**Phase 1: Pilot (Week 1-2)**
- Implement AutocompleteFK component
- Apply to Master Data module only
- Test thoroughly
- Gather feedback

**Phase 2: Core Modules (Week 3-4)**
- Rollout to Sales + Service modules
- Monitor performance
- Adjust pagination/caching if needed

**Phase 3: All Modules (Week 5)**
- Complete rollout to all remaining modules
- Full system testing
- UAT

### 10.2 Rollback Plan

**If issues detected**:
1. Revert to standard `<select>` for affected FK fields
2. Keep AutocompleteFK for stable modules
3. Fix issues in dev environment
4. Re-deploy phased rollout

---

## 11. Breaking Change Analysis

### 11.1 API Breaking Changes

**Breaking Changes**: ✅ **NONE**

**Rationale**:
- All new query params are optional
- Existing API calls still work
- Response format unchanged

### 11.2 UI Breaking Changes

**Breaking Changes**: ⚠️ **POTENTIAL**

**Potential Issues**:
1. Forms phụ thuộc vào `<select>` behavior có thể break
2. E2E tests có thể fail (selector changes)
3. Existing automated scripts có thể break

**Mitigation**:
1. Regression testing trước khi deploy
2. Update E2E tests
3. Provide fallback to `<select>` nếu cần

---

## 12. Next Steps

### 12.1 Immediate Actions

1. ✅ Approval of this Impact Analysis
2. Proceed to CR-03: Create Drafts
   - BRD_CR-20260203-009_DRAFT.md
   - frd_{module}_CR-20260203-009_DRAFT.md (x8)
   - api_spec_{module}_CR-20260203-009_DRAFT.md (x8)
   - ui_spec_CR-20260203-009_DRAFT.md
3. Define AutocompleteFK component contract
4. Map all FK fields trong hệ thống

### 12.2 Questions for Stakeholders

1. **UX Decision**: Quick create mở trong Modal hay New Tab?
2. **Performance**: Acceptable search response time?
3. **Rollout**: Pilot trong 1 module hay rollout toàn bộ?
4. **Training**: Cần training materials cho users không?

---

## 13. Traceability

### 13.1 Related Documents

**Input**:
- CR Intake: CR-20260203-009
- GetDataForFK.md (original request)

**Current State**:
- BRD v2.1
- FRD (all modules latest versions)
- ERD v1.2
- API Spec (all modules latest versions)
- UI Spec v1.6

**Output** (Next Step):
- CR-03: Drafts for all affected documents

---

**End of CR Impact Analysis: CR-20260203-009**
