# CR INTAKE: CR-20260203-007

## Document Information
- **CR ID**: CR-20260203-007
- **Title**: GetDataForFK v2 - Enhanced FK Dropdown với Search, Pagination & Create New
- **Created**: 03/02/2026
- **Author**: Antigravity - Business Analyst
- **Source**: GetDataForFK.md (Updated version)
- **Status**: PENDING APPROVAL

---

## 1. Change Request Summary

**Requirement**: Nâng cấp tất cả Foreign Key fields thành enhanced dropdown/select components theo pattern Odoo 18, bao gồm:
1. **Search Context**: Real-time search khi gõ
2. **Pagination**: Hiển thị 5 items mặc định, lazy loading khi scroll
3. **Create New Data**: Link to Master Data screen khi không tìm thấy

**Original Request (CR-20260203-006)**: Basic dropdown cho FK fields  
**Enhanced Request (CR-20260203-007)**: Advanced dropdown với Odoo 18 features

---

## 2. Business Justification

### Business Value
- ✅ **Data Integrity**: Đảm bảo FK references hợp lệ
- ✅ **User Experience**: Tìm kiếm nhanh, không cần load hết data
- ✅ **Performance**: Pagination giảm load time (chỉ 5 items vs toàn bộ)
- ✅ **Workflow Continuity**: Tạo Master Data ngay khi cần, không rời màn hình
- ✅ **Consistency**: Thống nhất UX pattern toàn hệ thống

### Use Cases

**Use Case 1**: Chọn dòng xe cho phụ tùng
- **Current**: Nhập tay vehicle_model_id (error-prone)
- **Basic (006)**: Dropdown tĩnh với toàn bộ models
- **Enhanced (007)**: Dropdown với search + pagination + link "Tạo dòng xe mới"

**Use Case 2**: Chọn customer cho quotation (hệ thống có 10,000+ customers)
- **Current**: Nhập tay customer_id
- **Basic (006)**: Dropdown load 10,000 customers (chậm)
- **Enhanced (007)**: 
  - Hiển thị 5 customers đầu
  - Gõ tên → filter real-time
  - Scroll → lazy load thêm
  - Không tìm thấy → "Tạo khách hàng mới" → link to CRM

---

## 3. Comparison vs CR-20260203-006

| Feature | CR-006 (Basic) | CR-007 (Enhanced) |
|---------|---------------|-------------------|
| FK Dropdown | ✅ | ✅ |
| Load all data | ✅ | ❌ (only 5 items) |
| Search when typing | ❌ | ✅ |
| Pagination/Lazy Loading | ❌ | ✅ |
| Create New Data Link | ❌ | ✅ |
| API ?for_dropdown | ✅ | ✅ (+ search & limit params) |
| Scope | 48 FK fields | 48 FK fields |
| Complexity | LOW | MEDIUM-HIGH |

**Key Differences**:
1. **API Layer**: Thêm `?search=` và `?limit=5&offset=0` params
2. **Frontend**: Reusable Autocomplete component (advanced search)
3. **Routing**: "Create New" button → navigate to Master Data screen
4. **State Management**: Track scroll position, search query

---

## 4. Phạm vi (Scope)

### 4.1 Modules Affected
**ALL 8 modules** (same as CR-006):
1. CRM (6 FK fields)
2. Sales (6 FK fields)
3. Service (9 FK fields)
4. Parts (8 FK fields)
5. Master Data (7 FK fields)
6. Admin (4 FK fields)
7. Accounting (4 FK fields)
8. Insurance (4 FK fields)

**Total**: 48 FK fields

### 4.2 New Features (vs CR-006)

**Feature 1: Search Context**
- **Requirement**: Real-time search khi người dùng gõ
- **Example**: Gõ "Honda" → filter danh sách chỉ hiển thị items có "Honda"
- **API**: `GET /api/customers?search=Honda&limit=5`
- **Frontend**: Autocomplete component với debounce (300ms)

**Feature 2: Pagination**
- **Requirement**: Hiển thị mặc định 5 items, lazy load khi scroll
- **Example**: Initial load → 5 customers, scroll to bottom → load thêm 5
- **API**: `GET /api/customers?limit=5&offset=0` (initial), `?limit=5&offset=5` (next page)
- **Frontend**: InfiniteScroll hoặc "Load more" button

**Feature 3: Create New Data**
- **Requirement**: Link to Master Data screen khi không tìm thấy
- **Example**: Dropdown không có customer cần → "Tạo khách hàng mới" → navigate to `/crm/customers/new`
- **Behavior**: Sau khi tạo xong, quay lại màn hình hiện tại và auto-select customer mới
- **Frontend**: Navigation + state persistence

### 4.3 Screens Affected
**ALL screens với FK fields** (same 19 forms as CR-006):
- Lead Create/Edit, Customer Create/Edit, Test Drive (CRM)
- Quotation Create/Edit, Contract Create/Edit (Sales)
- Repair Order, Appointment (Service)
- Part Management, Compatibility (Parts)
- Accessory, Service Catalog, Employee (Master Data)
- User, Role, Activity Log (Admin)
- Invoice, Payment (Accounting)
- Insurance Policy (Insurance)

---

## 5. Requirements Analysis

### 5.1 Functional Requirements

**FR-1: Search Context**
- User gõ từ khóa vào dropdown
- Hệ thống filter kết quả real-time
- Highlight matching text
- Debounce 300ms để tránh API calls quá nhiều

**FR-2: Pagination**
- Initial load: 5 items đầu tiên
- Scroll to bottom: Load thêm 5 items
- Support "Load more" button as alternative
- Show loading indicator khi fetch

**FR-3: Create New Data**
- Item cuối cùng: "Tạo mới..." option với icon "+"
- Click → Navigate to Master Data screen (e.g., `/master/vehicle-models/new`)
- Sau khi save → Quay lại màn hình gốc
- Auto-select item vừa tạo

### 5.2 Non-Functional Requirements

**NFR-1: Performance**
- API response time < 200ms (search + pagination)
- Dropdown load time < 500ms
- Smooth scroll (60fps)
- Client-side cache for repeated searches (5 min TTL)

**NFR-2: Usability**
- Keyboard navigation (arrow keys, enter, esc)
- Focus management (auto-focus search input)
- Clear visual feedback (loading, empty state, error)

**NFR-3: Accessibility**
- ARIA labels for screen readers
- Keyboard accessible
- Clear contrast for readability

---

## 6. Dependencies & Assumptions

### 6.1 Dependencies
- ✅ **Refs Components**: Need Autocomplete component (if not exist, create)
- ✅ **Routing**: Next.js router for navigation to Master Data screens
- ✅ **State Management**: React state or context for "Create New" flow
- ✅ **API Layer**: Backend must support `?search=` and pagination params

### 6.2 Assumptions
- ✅ All Master Data screens have Create pages (e.g., `/master/suppliers/new`)
- ✅ API returns total count for pagination (e.g., `{ data: [...], total: 1000 }`)
- ✅ Search is case-insensitive, matches by `name` field
- ✅ "Create New" link navigates to correct Master Data screen per entity

---

## 7. Risks & Mitigation

### 7.1 Technical Risks

**Risk 1: Complexity Increase**
- **Impact**: High - Search + Pagination + Create New adds significant complexity vs CR-006
- **Probability**: High
- **Mitigation**: 
  - Create reusable `AutocompleteFK` component
  - Implement in 1 pilot module first (Master Data)
  - Validate pattern before scaling to 7 modules

**Risk 2: Performance Degradation**
- **Impact**: Medium - Too many API calls if search not debounced
- **Probability**: Medium
- **Mitigation**:
  - Implement 300ms debounce
  - Client-side caching (5 min)
  - Backend: Add index on searchable fields

**Risk 3: Navigation State Loss**
- **Impact**: Medium - "Create New" → form state may be lost
- **Probability**: Medium
- **Mitigation**:
  - Persist form state to localStorage before navigation
  - Restore state after return from Master Data
  - Use URL params to pass back created item ID

### 7.2 Project Risks

**Risk 4: Extended Timeline**
- **Impact**: High - CR-007 scope > CR-006 (estimated +50% effort)
- **Probability**: High
- **Estimated Effort**: 
  - CR-006: 35 SP (base dropdown)
  - CR-007: **50-60 SP** (enhanced features)
- **Mitigation**: 
  - Incremental rollout (pilot → scale)
  - Parallel work on API + Frontend

---

## 8. Similarity Analysis

### 8.1 Similar to Existing Patterns?
**YES** - Odoo 18 dropdown pattern

**Existing Implementation**:
- Refs may already have Autocomplete component
- Similar search patterns may exist in current codebase

**Action**: Check Refs for reusable Autocomplete before implementing new

### 8.2 Related to Previous CRs?
**YES** - CR-20260203-006 (GetDataForFK v1)

**Relationship**: CR-007 is **ENHANCEMENT** of CR-006
- Shares same goal (FK → dropdown)
- Adds 3 advanced features (Search, Pagination, Create New)

**Decision Required**:
- **Option A**: REPLACE CR-006 với CR-007 (if CR-006 not implemented yet)
- **Option B**: Implement CR-006 first (basic), then CR-007 as enhancement
- **Recommendation**: Option A (if CR-006 not started), save effort by doing enhanced version directly

---

## 9. CR Classification

### 9.1 Type
**Enhancement** (Feature Upgrade)

**Subtype**: Technical Infrastructure + UX/UI Improvement

### 9.2 Priority
**P1** - HIGH PRIORITY

**Rationale**:
- Affects ALL modules (cross-cutting concern)
- Critical for data integrity
- High user impact (48 FK fields = majority of forms)
- Performance improvement (pagination reduces load)

### 9.3 Complexity
**MEDIUM-HIGH**

**Factors**:
- API changes: MEDIUM (add search & pagination params)
- Frontend changes: HIGH (advanced component with state management)
- Testing: HIGH (search behavior, pagination, navigation)
- Scope: HIGH (48 FK fields, 19 forms)

### 9.4 Estimated Effort

| Layer | Effort (SP) | Notes |
|-------|------------|-------|
| **API** | 15 SP | Add search & pagination params to 24 endpoints (CR-006) |
| **Backend** | 10 SP | Services/repositories with search + pagination logic |
| **Frontend** | 20 SP | AutocompleteFK component + 48 field implementations |
| **Routing** | 3 SP | "Create New" navigation logic |
| **Testing** | 10 SP | Unit + Integration + UAT (search, pagination, create) |
| **Documentation** | 2 SP | Update specs, guides |
| **TOTAL** | **60 SP** | **~10-12 working days** |

**Note**: CR-006 was 35 SP, CR-007 adds +25 SP (71% increase) due to advanced features

---

## 10. CR Decision

### 10.1 Recommendation
✅ **APPROVE** - Proceed with CR-007 (Enhanced version)

**Rationale**:
1. ✅ High business value (UX + Performance + Workflow continuity)
2. ✅ Aligns with modern UX patterns (Odoo 18 standard)
3. ✅ Solves performance issue for large datasets (10,000+ records)
4. ✅ Adds strategic value (Create New workflow)

### 10.2 Conditions
1. **Incremental Implementation**: Pilot with 1-2 modules first
2. **Reusable Component**: Create `AutocompleteFK` component to reduce duplication
3. **Performance Monitoring**: Track API response times, set SLA < 200ms
4. **Fallback Plan**: If Create New too complex, defer to CR-007-Phase2

### 10.3 Alternative Approaches

**Alternative 1**: Implement CR-006 first, then CR-007 as Phase 2
- **Pros**: Lower risk, faster initial delivery
- **Cons**: Double work (refactor basic → advanced dropdown)

**Alternative 2**: Defer Search + Pagination, implement Create New only
- **Pros**: Reduced scope, faster delivery
- **Cons**: Misses performance benefits, incomplete Odoo pattern

**Alternative 3**: Implement CR-007 as-is (recommended)
- **Pros**: Complete solution, best UX
- **Cons**: Higher initial effort

---

## 11. Next Steps (if APPROVED)

### 11.1 Immediate Actions
1. **CR-02 Impact Analysis**: Detailed specs for API, Frontend, Routing changes
2. **Refs Review**: Check if Autocomplete component exists, assess reusability
3. **Pilot Selection**: Choose 1 module (recommend: Master Data) for pilot

### 11.2 Implementation Phases

**Phase 1: Foundation** (Master Data Module)
- Create `AutocompleteFK` reusable component
- Implement search + pagination API endpoints (suppliers, warehouses, etc.)
- Test with Master Data forms (Employee, Accessory, Service Catalog)
- **Effort**: 15-20 SP, 3-4 days

**Phase 2: Scale** (Remaining 7 Modules)
- Reuse `AutocompleteFK` for all 41 remaining FK fields
- Implement Create New navigation for each FK type
- Comprehensive testing
- **Effort**: 35-40 SP, 6-7 days

**Total**: 50-60 SP, 9-11 working days

---

## 12. Approval Signatures

**Submitted By**: Antigravity - Business Analyst  
**Date**: 03/02/2026  
**Recommendation**: ✅ **APPROVE**

**Pending Approval From**:
- [ ] Design Authority (Antigravity)
- [ ] Technical Lead
- [ ] Product Owner

---

## 13. Appendix

### 13.1 Reference Documents
- GetDataForFK.md (updated requirement)
- CR-20260203-006 documents (baseline for comparison)

### 13.2 Key Terminology
- **Search Context**: Real-time filtering khi user gõ
- **Pagination**: Load dữ liệu theo batch (e.g., 5 items)
- **Lazy Loading**: Load thêm data khi scroll/click "Load more"
- **Create New**: Link to Master Data screen để tạo data mới

---

**Status**: ⏳ **AWAITING CR-02 (IMPACT ANALYSIS)**

---

**END OF CR-01 INTAKE**
