# HANDOVER TO OPENCODE: CR-20260203-009

## Document Information
- **CR ID**: CR-20260203-009
- **Title**: Enhanced FK Dropdown - GetDataForFK
- **Date**: 03/02/2026
- **Handover By**: Antigravity - Design Authority
- **Implement By**: OpenCode Team
- **Status**: ✅ **READY_FOR_IMPLEMENTATION**

---

## ⭐ MISSION STATEMENT

**Implement enhanced Foreign Key (FK) dropdowns across the entire system** với 3 tính năng chính:
1. **Real-time search** (debounce 300ms)
2. **Pagination** (5 items/page, lazy loading)
3. **Quick create** (navigate to master data + auto return)

**Scope**:
- ~90 FK fields across 8 modules
- ~80-100 screens
- Universal AutocompleteFK component pattern

**Effort**: 46 SP (~184 hours, 4-5 weeks suggested)

---

## 📖 Required Reading (IN ORDER)

### 1️⃣ PRIMARY SOURCE (START HERE)

**CR-20260203-009 Draft Summary**:
```
C:\Honda\Antigravity\docs\requirements\change_requests\CR-20260203-009\change_request_CR-20260203-009_draft_summary.md
```

**READ THESE SECTIONS**:
- ✅ **Section 3**: FRD Pattern (AutocompleteFK specs) - Universal pattern
- ✅ **Section 5**: API Spec Enhancement (pagination + search) - Universal pattern
- ✅ **Section 6**: UI Spec (AutocompleteFK component) - Complete implementation specs

---

### 2️⃣ SECONDARY SOURCES (For Context)

**Current Main Documents** (latest versions):

**Reference as needed for existing FK fields and context**:
- `docs/requirements/FRD/frd_{module}_vX.Y.md` (current version)
- `docs/design/api/api_spec_{module}_vX.Y.md` (current version)
- `docs/design/ui/ui_spec_v1.6.md`
- `docs/design/database/erd/erd_description_v1.2.md` (unchanged)

**Refs Components**:
- `Refs/src/app/components/ui/combobox.tsx` (base component to extend)
- shadcn/ui documentation

---

### 3️⃣ THIS HANDOVER FILE

**Read**:
- ✅ Implementation Checklist (Section 3)
- ✅ Test Focus Areas (Section 4)
- ✅ Success Criteria (Section 5)
- ✅ Migration Strategy (Section 6)

---

## ✅ Implementation Checklist

### Phase 0: Setup & Preparation (Week 1, Days 1-2)

- [ ] **Read Draft Summary thoroughly**
  - [ ] Section 3: AutocompleteFK Pattern (FRD)
  - [ ] Section 5: Pagination + Search Pattern (API Spec)
  - [ ] Section 6: AutocompleteFK Component (UI Spec)

- [ ] **Survey existing FK fields**
  - [ ] Create spreadsheet: Screen ID | FK Field | Target Resource | Create Permission
  - [ ] Verify ~90 FK fields identified (as per Draft Summary section 3.3)

- [ ] **Install dependencies**
  - [ ] `@tanstack/react-query` (for API + infinite scroll)
  - [ ] `use-debounce` (for search debounce)
  - [ ] Verify shadcn/ui components available (Combobox, Popover, Command)

---

### Phase 1: AutocompleteFK Component (Week 1, Days 3-5)

- [ ] **Create `AutocompleteFK.tsx`**
  - [ ] Props interface (as per Draft Summary section 6.3.1)
  - [ ] Base on shadcn/ui Combobox
  - [ ] Add search debounce (300ms)
  - [ ] Add pagination logic (React Query `useInfiniteQuery`)
  - [ ] Add "Create new" option rendering
  - [ ] Add navigation flow (localStorage + window.open)

- [ ] **UI States Implementation**
  - [ ] IDLE (closed)
  - [ ] OPEN (default 5 items)
  - [ ] SEARCHING (loading spinner)
  - [ ] RESULTS (filtered items)
  - [ ] NO RESULTS (with "Create new" option)
  - [ ] ERROR

- [ ] **Keyboard Navigation**
  - [ ] ↑/↓: Navigate items
  - [ ] Enter: Select item
  - [ ] Tab: Close + next field
  - [ ] Esc: Close dropdown

- [ ] **Unit Tests**
  - [ ] Render states
  - [ ] Search debounce
  - [ ] Pagination trigger (scroll 90%)
  - [ ] Quick create flow (localStorage)
  - [ ] Error handling

- [ ] **Storybook/Demo**
  - [ ] Create demo page với AutocompleteFK examples
  - [ ] Test all states manually
  - [ ] Share với team for feedback

**Deliverable**: `src/app/components/AutocompleteFK/AutocompleteFK.tsx` + tests + demo

---

### Phase 2: Backend API Enhancement (Week 2)

- [ ] **Database Indices**
  - [ ] Add index on `name` field (all resource tables)
  - [ ] Add index on `code` field (all resource tables)
  - [ ] Migration: Add indices for ~15-20 tables

- [ ] **API Middleware/Util**
  - [ ] Create `paginationQueryParser` util
    - [ ] Parse `search`, `page`, `limit` from query string
    - [ ] Validate params (limit max: 100)
    - [ ] Default values: page=1, limit=5

  - [ ] Create `buildSearchQuery` util
    - [ ] Build WHERE clause for search
    - [ ] Pattern: `LOWER(name) LIKE '%{keyword}%' OR LOWER(code) LIKE '%{keyword}%'`

- [ ] **Update GET Endpoints** (all resources)
  - [ ] Admin: `/api/users`, `/api/roles`, `/api/permissions`, `/api/departments`, `/api/positions`
  - [ ] CRM: `/api/customers`, `/api/leads`, `/api/scoring-rules`, `/api/campaigns`
  - [ ] Sales: `/api/quotations`, `/api/contracts`, `/api/vins`, `/api/vehicle-models`
  - [ ] Service: `/api/service-quotes`, `/api/appointments`, `/api/repair-orders`, `/api/service-bays`
  - [ ] Parts: `/api/parts`, `/api/suppliers`, `/api/warehouses`, `/api/purchase-orders`
  - [ ] Insurance: `/api/insurance-contracts`, `/api/insurance-claims`
  - [ ] Accounting: `/api/invoices`, `/api/payments`, `/api/transactions`, `/api/fixed-assets`
  - [ ] Master Data: `/api/accessories`, `/api/service-catalogs`, `/api/employees`

  **For each endpoint**:
  - [ ] Add pagination params check
  - [ ] Add search query builder
  - [ ] Return paginated response với meta: `{ total, page, limit, total_pages, has_next, has_prev }`

- [ ] **Backend Tests**
  - [ ] Test pagination (page 1, page 2, last page)
  - [ ] Test search (exact match, partial match, no results)
  - [ ] Test default params (no search, no page)
  - [ ] Test edge cases (limit >100, page <1, invalid search)

**Deliverable**: ~40 enhanced endpoints + tests

---

### Phase 3: Module Integration (Week 3-4)

**Incremental Rollout**: Implement module-by-module

#### Week 3: Master Data (Pilot)

- [ ] **Replace `<select>` với `<AutocompleteFK>`**
  - [ ] VehicleModel Form: All FK fields
  - [ ] Accessory Form: `compatible_model_ids`
  - [ ] Service Catalog Form: `part_ids`
  - [ ] Employee Form: `department_id`, `position_id`

- [ ] **Update Form Validation**
  - [ ] Ensure AutocompleteFK integrates với react-hook-form
  - [ ] Validation rules unchanged

- [ ] **E2E Tests**
  - [ ] Update selectors (from `select` → `AutocompleteFK`)
  - [ ] Test search flow
  - [ ] Test select flow
  - [ ] Test quick create flow

- [ ] **UAT (Master Data)**
  - [ ] Test với real users
  - [ ] Gather feedback
  - [ ] Measure: Time to complete form, errors, user satisfaction

- [ ] **Adjust Component** (if needed)
  - [ ] Fix bugs from UAT
  - [ ] Polish UX based on feedback

**Deliverable**: Master Data module with AutocompleteFK + UAT report

---

#### Week 4: Sales + Service (Core Modules)

- [ ] **Sales Module**
  - [ ] Quotation Form: `customer_id`, `vehicle_model_id`, `accessory_ids`, `service_ids`
  - [ ] Test Drive Form: `customer_id`, `vehicle_model_id`
  - [ ] Contract Form: `customer_id`, `quotation_id`, `vin_id`
  - [ ] E2E tests updated
  - [ ] UAT

- [ ] **Service Module**
  - [ ] Service Quote Form: `customer_id`, `service_catalog_ids`
  - [ ] Appointment Form: `customer_id`, `service_quote_id`, `bay_id`
  - [ ] Repair Order Form: `customer_id`, `part_ids`, `bay_id`
  - [ ] E2E tests updated
  - [ ] UAT

**Deliverable**: Sales + Service modules with AutocompleteFK + UAT reports

---

#### Week 5: Remaining Modules

- [ ] **CRM Module**
  - [ ] Lead Form, Customer Form, Interaction Form, etc.
  - [ ] ~15 FK fields
  - [ ] E2E tests updated
  - [ ] UAT

- [ ] **Parts Module**
  - [ ] Part Form, PO Form, Stock Movement Form
  - [ ] ~10 FK fields
  - [ ] E2E tests updated
  - [ ] UAT

- [ ] **Insurance Module**
  - [ ] Insurance Contract Form, Claim Form
  - [ ] ~8 FK fields
  - [ ] E2E tests updated
  - [ ] UAT

- [ ] **Accounting Module**
  - [ ] Invoice Form, Payment Form, Transaction Form
  - [ ] ~10 FK fields
  - [ ] E2E tests updated
  - [ ] UAT

- [ ] **Admin Module**
  - [ ] User Form, Role Form
  - [ ] ~10 FK fields
  - [ ] E2E tests updated
  - [ ] UAT

**Deliverable**: All 8 modules with AutocompleteFK + UAT reports

---

### Phase 4: Final Testing & Documentation (Week 5, End)

- [ ] **Full System Testing**
  - [ ] Run ALL E2E tests (entire test suite)
  - [ ] Performance test: Measure search response times (<300ms target)
  - [ ] Load test: Test với large datasets (>1000 items)
  - [ ] Cross-browser test: Chrome, Edge, Firefox

- [ ] **UAT Summary**
  - [ ] Compile UAT results from all modules
  - [ ] Measure KPIs:
    - Time reduction: Target 30-50%
    - Error reduction: Target 80-90%
    - User satisfaction: Target >4.5/5
  - [ ] Report findings to Antigravity

- [ ] **Documentation**
  - [ ] **User Guide**: How to use AutocompleteFK (với screenshots)
  - [ ] **Developer Guide**: How to add AutocompleteFK to new screens
  - [ ] **API Documentation**: Pagination + search params guide

- [ ] **Code Review**
  - [ ] Component code review (Antigravity or Senior Dev)
  - [ ] API changes review
  - [ ] E2E tests review

**Deliverable**: Production-ready code + documentation + UAT summary

---

## 🧪 Test Focus Areas

### Critical Flows to Verify

1. **Search Flow**
   - User opens dropdown → sees 5 items
   - User types "city" → results filter real-time
   - User types invalid keyword → "No results" shown
   - Debounce works (300ms, no API spam)

2. **Pagination Flow**
   - User scrolls dropdown → loads next 5 items
   - No lag, smooth scroll
   - Loading spinner appears briefly
   - All items accessible

3. **Quick Create Flow**
   - User clicks "+ Tạo mới..."
   - Form draft saved to localStorage
   - New tab opens with create form
   - User completes creation
   - Tab closes, original form restores
   - New item auto-selected

4. **Error Handling**
   - API timeout → error message shown
   - Network offline → error message shown
   - Invalid data → validation error shown
   - Create flow cancelled → draft restored

5. **Performance**
   - Search response: <300ms
   - Dropdown open: <200ms
   - Lazy load next page: <200ms

---

## ✅ Success Criteria

### Functional

- [ ] ✅ All ~90 FK fields use AutocompleteFK
- [ ] ✅ Search works correctly (partial match, case-insensitive)
- [ ] ✅ Pagination works (5 items/page, lazy loading to 100%)
- [ ] ✅ Quick create works (navigate + auto return + auto select)
- [ ] ✅ Keyboard navigation works (↑/↓/Enter/Esc/Tab)
- [ ] ✅ Error states handled gracefully

### Non-Functional

- [ ] ✅ Search response time: <300ms (95th percentile)
- [ ] ✅ Dropdown open time: <200ms
- [ ] ✅ Form completion time: Reduced 30-50%
- [ ] ✅ Data entry errors: Reduced 80-90%
- [ ] ✅ User satisfaction: >4.5/5
- [ ] ✅ All E2E tests passing (100%)
- [ ] ✅ Unit test coverage: >80% for AutocompleteFK component

### Code Quality

- [ ] ✅ Component follows React best practices
- [ ] ✅ Props typed correctly (TypeScript)
- [ ] ✅ No console errors/warnings
- [ ] ✅ Code reviewed và approved
- [ ] ✅ Documented (JSDoc comments)

---

## 🚀 Migration Strategy

### Incremental Rollout

**Phase 1: Pilot (Week 3)**
- Module: Master Data
- Users: Internal team only
- Rollback: Easy (single module)

**Phase 2: Core Modules (Week 4)**
- Modules: Sales + Service
- Users: Power users (early adopters)
- Rollback: Moderate (2 modules)

**Phase 3: All Modules (Week 5)**
- Modules: CRM, Parts, Insurance, Accounting, Admin
- Users: All users
- Rollback: Difficult (full system)

### Rollback Plan

**If critical issues detected**:
1. Revert affected screens to `<select>`
2. Keep AutocompleteFK for stable screens
3. Fix issues in dev environment
4. Re-deploy phased rollout

**Triggers for Rollback**:
- API response time >1s (P0)
- Data loss in quick create flow (P0)
- >10% of users unable to select FK items (P0)
- Critical bugs blocking workflow (P1)

---

## ⚠️ Known Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Performance degradation với large datasets | Database indices + pagination + caching |
| State loss during quick create | localStorage + session management + auto-save |
| UX confusion | Clear UI labels + user training materials |
| Breaking existing forms | Incremental rollout + extensive testing |
| API timeout | Debounce + query optimization + monitoring |
| E2E test failures | Update selectors BEFORE deployment |

---

## 📊 Monitoring & Metrics

### Post-Deployment Monitoring

**Performance Metrics**:
- [ ] Track API response times (search endpoints)
- [ ] Track dropdown open times
- [ ] Track form completion times

**Error Metrics**:
- [ ] Track AutocompleteFK errors (Console errors)
- [ ] Track API errors (4xx, 5xx)
- [ ] Track validation errors

**User Metrics**:
- [ ] Survey user satisfaction (NPS score)
- [ ] Count data entry errors (before vs after)
- [ ] Measure training time reduction

**Target Dashboard**:
- API Response Time (P95): <300ms ✅
- Dropdown Open Time: <200ms ✅
- Form Completion Time Reduction: >=30% ✅
- Data Entry Error Reduction: >=80% ✅
- User Satisfaction: >=4.5/5 ✅

---

## 🔗 References

### CR Documents
- CR Intake: `CR-20260203-009_intake.md`
- Impact Analysis: `CR-20260203-009_impact_analysis.md`
- **Draft Summary**: `CR-20260203-009_draft_summary.md` ⭐ (PRIMARY SOURCE)
- Review Decision: `CR-20260203-009_review_decision.md`
- Consolidation Report: `CR-20260203-009_consolidation_report.md`
- CONSOLIDATED Marker: `CONSOLIDATED.md`

### Main Documents (Current Versions)
- BRD: `BRD_changes_v2.1.md`
- FRD (8 modules): `frd_{module}_vX.Y.md`
- ERD: `erd_description_v1.2.md` (unchanged)
- API Spec (8 modules): `api_spec_{module}_vX.Y.md`
- UI Spec: `ui_spec_v1.6.md`

### External References
- shadcn/ui Combobox: https://ui.shadcn.com/docs/components/combobox
- React Query Infinite Queries: https://tanstack.com/query/latest/docs/react/guides/infinite-queries
- Odoo 18 Many2One widget: (Reference implementation)

---

## 📞 Contact & Support

**Antigravity**:
- **Role**: Design Authority, CR Owner
- **Availability**: For clarifications và design questions
- **Response Time**: Within 24 hours

**Questions**:
- If Draft Summary specs unclear → Contact Antigravity
- If implementation blockers → Contact Antigravity
- If UAT fails → Report to Antigravity for decision

---

## ✅ Definition of Done (DoD)

**CR-20260203-009 is DONE when**:

- [ ] ✅ AutocompleteFK component implemented + tested
- [ ] ✅ All ~90 FK fields updated to use AutocompleteFK
- [ ] ✅ All API endpoints enhanced với pagination + search
- [ ] ✅ All E2E tests updated và passing
- [ ] ✅ UAT completed for ALL 8 modules
- [ ] ✅ Success criteria MET (time reduction, error reduction, user satisfaction)
- [ ] ✅ Documentation created (user guide + dev guide)
- [ ] ✅ Code reviewed và approved
- [ ] ✅ Production deployment successful
- [ ] ✅ Post-deployment monitoring shows healthy metrics

**Sign-Off**:
- OpenCode Lead: _________________ Date: _________
- Antigravity: _________________ Date: _________

---

## 🎉 Expected Benefits

Post-implementation, the system will have:

✅ **30-50% faster form completion** (auto-suggest + quick search)  
✅ **80-90% fewer data entry errors** (dropdown prevents typos)  
✅ **Improved user satisfaction** (seamless workflow, no context switching)  
✅ **Consistent UX** across all 8 modules  
✅ **Scalable pattern** for future FK fields  

---

**STATUS**: ✅ **READY FOR IMPLEMENTATION**

**Handover Date**: 03/02/2026  
**Deadline**: 5 weeks from handover (estimated)  
**Next Review**: After Phase 1 (Master Data UAT)

---

**End of HANDOVER_TO_OPENCODE: CR-20260203-009**
