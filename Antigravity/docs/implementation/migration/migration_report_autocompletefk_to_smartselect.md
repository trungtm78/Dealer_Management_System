# Migration Status Report: AutocompleteFK → SmartSelect

**Report ID**: MIG-REPORT-001
**Date**: 2026-02-04
**Reporter**: OpenCode - UAT Execution Authority
**Related CR**: CR-20260204-001 (Smart Search Component & Data Retrieval Standard)
**Status**: COMPLETE (Audit Only - No Fixes Applied)

---

## Executive Summary

**Total Files Using AutocompleteFK (Old Component)**: 17 components  
**Total AutocompleteFK Instances Found**: 23 instances  
**SmartSelect Integration Status**: **INCOMPLETE** (1/12+ required endpoints created)

**Key Finding**: CR-20260204-001 successfully implemented `SmartSelect` component and demo, but the migration of existing forms from `AutocompleteFK` to `SmartSelect` was **NOT** completed as part of the CR.

---

## Background

CR-20260204-001 introduced:
1. ✅ `SmartSelect` component with advanced features (anti-race, infinite scroll, multi-field search)
2. ✅ TypeScript interfaces (types/smart-select.ts)
3. ✅ Demo page (app/demo/smart-select/page.tsx)
4. ✅ API endpoint: `/api/shared/search/vehicle-models`

**However, the following was NOT included in CR-20260204-001:**
- ❌ Migration of existing forms using `AutocompleteFK` to `SmartSelect`
- ❌ Creation of `/api/shared/search/customers` endpoint
- ❌ Creation of `/api/shared/search/suppliers` endpoint
- ❌ Creation of `/api/shared/search/users` endpoint
- ❌ Creation of `/api/shared/search/employees` endpoint
- ❌ Other entity-specific search endpoints

---

## Component Migration Status by Module

### 1. SALES MODULE (5 instances)

| Component | File | Line | Resource | AutocompleteFK Count | Migration Status |
|-----------|------|------|----------|---------------------|------------------|
| QuotationForm | components/sales/QuotationForm.tsx | 265, 312 | crm/customers, master/vehicle-models | 2 | ❌ NOT MIGRATED |
| TestDriveSchedule | components/sales/TestDriveSchedule.tsx | 293 | master/vehicle-models | 1 | ❌ NOT MIGRATED |
| VinAllocation | components/sales/VinAllocation.tsx | 121 | master/vehicle-models | 1 | ❌ NOT MIGRATED |
| PdsList | components/sales/PdsList.tsx | 140 | master/vehicle-models | 1 | ❌ NOT MIGRATED |

**User Impact**: 
- Sales staff cannot search customers by phone/email, only by name
- No infinite scroll for vehicle model selection
- No context filtering (companyId, onlyActive)
- No create in-place functionality

---

### 2. SERVICE MODULE (5 instances)

| Component | File | Line | Resource | AutocompleteFK Count | Migration Status |
|-----------|------|------|----------|---------------------|------------------|
| RepairOrderList | components/service/RepairOrderList.tsx | 149, 266 | master/vehicle-models, users | 2 | ❌ NOT MIGRATED |
| AppointmentList | components/service/AppointmentList.tsx | 123 | master/vehicle-models | 1 | ❌ NOT MIGRATED |
| BayAssignmentDialog | components/service/BayAssignmentDialog.tsx | 80 | master/vehicle-models | 1 | ❌ NOT MIGRATED |
| ServiceQuoteCreate | components/service/ServiceQuoteCreate.tsx | 209 | master/vehicle-models | 1 | ❌ NOT MIGRATED |

**Note**: `AppointmentList.tsx` has a typo in filename ("Appoint" vs "Appointment")

**User Impact**:
- Service staff cannot search vehicle models by code, only by name
- No context filtering for active vehicles only
- No create in-place for new vehicle models

---

### 3. INSURANCE MODULE (4 instances)

| Component | File | Line | Resource | AutocompleteFK Count | Migration Status |
|-----------|------|------|----------|---------------------|------------------|
| InsuranceContractForm | components/insurance/InsuranceContractForm.tsx | 120, 226, 282 | crm/customers, master/vehicle-models, master/providers | 3 | ❌ NOT MIGRATED |
| InsuranceClaimForm | components/insurance/InsuranceClaimForm.tsx | 131 | insurance/contracts | 1 | ❌ NOT MIGRATED |

**User Impact**:
- Insurance staff cannot search contracts by customer phone/email
- No advanced search capabilities for providers
- No create in-place for new customers/contracts

---

### 4. CRM MODULE (2 instances)

| Component | File | Line | Resource | AutocompleteFK Count | Migration Status |
|-----------|------|------|----------|---------------------|------------------|
| LeadDialog | components/crm/LeadDialog.tsx | 304 | master/vehicle-models | 1 | ❌ NOT MIGRATED |
| CreateLeadDialog | components/crm/CreateLeadDialog.tsx | 227 | master/vehicle-models | 1 | ❌ NOT MIGRATED |

**User Impact**:
- CRM staff cannot search vehicle models by code
- No context filtering for active vehicles

---

### 5. MASTER DATA MODULE (4 instances)

| Component | File | Line | Resource | AutocompleteFK Count | Migration Status |
|-----------|------|------|----------|---------------------|------------------|
| GenericMasterDataForm | components/master/GenericMasterDataForm.tsx | 188 | Dynamic (depends on config) | 1+ | ❌ NOT MIGRATED |
| EmployeeManagement | components/master/EmployeeManagement.tsx | 287, 303, 319 | master/departments, master/positions, master/levels | 3 | ❌ NOT MIGRATED |

**User Impact**:
- Admin staff cannot search departments/positions/levels by code
- No advanced search capabilities
- No infinite scroll for large master data sets

---

### 6. PARTS MODULE (1 instance)

| Component | File | Line | Resource | AutocompleteFK Count | Migration Status |
|-----------|------|------|----------|---------------------|------------------|
| PurchaseList | components/parts/PurchaseList.tsx | 107 | master/suppliers | 1 | ❌ NOT MIGRATED |

**User Impact**:
- Parts staff cannot search suppliers by phone/email, only by name
- No create in-place for new suppliers

---

### 7. ADMIN MODULE (2 instances)

| Component | File | Line | Resource | AutocompleteFK Count | Migration Status |
|-----------|------|------|----------|---------------------|------------------|
| UserForm | components/admin/UserForm.tsx | 94, 114 | admin/roles, master/departments | 2 | ❌ NOT MIGRATED |

**User Impact**:
- Admin cannot search roles/departments
- No advanced search capabilities

---

### 8. ACCOUNTING MODULE (1 instance)

| Component | File | Line | Resource | AutocompleteFK Count | Migration Status |
|-----------|------|------|----------|---------------------|------------------|
| FixedAssets | components/accounting/FixedAssets.tsx | 78 | master/suppliers | 1 | ❌ NOT MIGRATED |

**User Impact**:
- Accounting staff cannot search suppliers by phone/email

---

### 9. DEMO MODULE (4 instances)

| Component | File | Line | Resource | AutocompleteFK Count | Migration Status |
|-----------|------|------|----------|---------------------|------------------|
| DemoPage | app/demo/autocomplete-fk/page.tsx | 30, 54, 78, 101 | crm/customers, master/suppliers, master/vehicle-models, admin/users | 4 | ❌ KEEP AS REFERENCE |

**Note**: This is the demo page for the old component and should be kept for reference.

---

## API Endpoint Status

### Required Search Endpoints (per SmartSelect Spec)

| Entity | Endpoint Pattern | Status | Created In CR-20260204-001? |
|--------|------------------|--------|------------------------------|
| Customers | `/api/shared/search/customers` | ❌ MISSING | NO |
| Suppliers | `/api/shared/search/suppliers` | ❌ MISSING | NO |
| Vehicle Models | `/api/shared/search/vehicle-models` | ✅ EXISTS | YES |
| Users | `/api/shared/search/users` | ❌ MISSING | NO |
| Employees | `/api/shared/search/employees` | ❌ MISSING | NO |
| Departments | `/api/shared/search/departments` | ❌ MISSING | NO |
| Positions | `/api/shared/search/positions` | ❌ MISSING | NO |
| Levels | `/api/shared/search/levels` | ❌ MISSING | NO |
| Providers | `/api/shared/search/providers` | ❌ MISSING | NO |
| Contracts | `/api/shared/search/contracts` | ❌ MISSING | NO |

**Status**: 1/12+ endpoints created (8.3%)

**Existing Endpoints** (using AutocompleteFK pattern):
- ✅ `/api/crm/customers?for_dropdown=true`
- ✅ `/api/master/suppliers?for_dropdown=true`
- ✅ `/api/master/vehicle-models?for_dropdown=true`
- ✅ `/api/admin/users?for_dropdown=true`
- ❌ `/api/master/employees` (missing for_dropdown endpoint)
- ❌ `/api/master/departments` (missing endpoint entirely)
- ❌ `/api/master/positions` (missing endpoint entirely)
- ❌ `/api/master/levels` (missing endpoint entirely)
- ❌ `/api/master/providers` (missing endpoint entirely)
- ❌ `/api/insurance/contracts` (missing for_dropdown endpoint)

---

## Feature Comparison: AutocompleteFK vs SmartSelect

| Feature | AutocompleteFK (Current) | SmartSelect (CR-20260204-001) | User Impact |
|---------|------------------------|--------------------------------|-------------|
| Search Fields | Single field (name) | Multiple fields (name, code, phone, email, tax_id) | 🔴 HIGH - Cannot search by phone/email |
| Debounce | None (immediate) | 200ms | 🔴 MEDIUM - Unnecessary API calls |
| Infinite Scroll | ❌ NO | ✅ YES (cursor-based) | 🔴 HIGH - All data loaded at once |
| Pagination | ❌ NO | ✅ YES | 🔴 HIGH - Performance issues with large datasets |
| Race Condition Handling | ❌ NO | ✅ YES (RequestId system) | 🟡 LOW - Only affects fast typists |
| Context Filtering | Partial (status only) | Full (companyId, onlyActive, preferredIds, recentIds) | 🔴 HIGH - Cannot filter by company/context |
| Create In-Place | ❌ NO | ✅ YES | 🟡 MEDIUM - UX improvement |
| Keyboard Navigation | Basic | Advanced (Arrow keys, Enter, Esc, Tab) | 🟡 LOW - Enhanced accessibility |
| API Pattern | `GET ?for_dropdown=true` | `POST /api/shared/search/:entity` | 🔴 HIGH - Need to create new endpoints |

---

## Critical Findings

### 1. API Endpoint Gap
**Severity**: 🔴 CRITICAL

**Issue**: Only 1 out of 12+ required search endpoints exists

**Missing Endpoints**:
- `/api/shared/search/customers` (required by QuotationForm, InsuranceContractForm)
- `/api/shared/search/suppliers` (required by PurchaseList, FixedAssets)
- `/api/shared/search/users` (required by EmployeeManagement, RepairOrderList)
- `/api/shared/search/employees` (required by EmployeeManagement)
- `/api/shared/search/departments` (required by EmployeeManagement, UserForm)
- `/api/shared/search/positions` (required by EmployeeManagement)
- `/api/shared/search/levels` (required by EmployeeManagement)
- `/api/shared/search/providers` (required by InsuranceContractForm)
- `/api/shared/search/contracts` (required by InsuranceClaimForm)

**Impact**: Any attempt to use SmartSelect without these endpoints will result in 404 errors.

---

### 2. Hook Incompatibility
**Severity**: 🔴 CRITICAL

**Issue**: `useFKData` hook is designed for AutocompleteFK pattern, not SmartSelect

**Current Hook**:
```typescript
// hooks/useFKData.ts
const { data, loading, error, refetch } = useFKData<{ id: string; name: string; status: string }>({
    entityName: resource,
    status,
    enabled: open
});
```

**Required Hook for SmartSelect**:
```typescript
// Would need new hook or adapter
const { search, create } = useSmartSelectDataSource({
    resource: 'crm/customers',
    context: { companyId, onlyActive: true }
});
```

**Impact**: Cannot easily switch components without creating new hook/adapter.

---

### 3. Data Structure Mismatch
**Severity**: 🟡 MEDIUM

**Issue**: Response format differs between old and new pattern

**AutocompleteFK Response**:
```json
{
    "data": [
        { "id": "123", "name": "Customer A", "status": "ACTIVE" }
    ]
}
```

**SmartSelect Response**:
```json
{
    "items": [
        { 
            "id": "123", 
            "label": "Customer A",
            "subtitle": "0987654321",
            "meta": { ...full_object... }
        }
    ],
    "nextCursor": "cursor_value"
}
```

**Impact**: Cannot simply swap components without response mapping.

---

## Migration Recommendations

### Phase 1: API Endpoint Creation (Week 1)

**Priority**: 🔴 CRITICAL

**Tasks**:
1. Create `/api/shared/search/customers` endpoint
2. Create `/api/shared/search/suppliers` endpoint
3. Create `/api/shared/search/users` endpoint
4. Create `/api/shared/search/employees` endpoint
5. Create `/api/shared/search/departments` endpoint
6. Create `/api/shared/search/positions` endpoint
7. Create `/api/shared/search/levels` endpoint
8. Create `/api/shared/search/providers` endpoint
9. Create `/api/shared/search/contracts` endpoint

**Acceptance Criteria**:
- All endpoints accept POST request with SearchRequest format
- All endpoints return SearchResponse format with items + nextCursor
- All endpoints implement multi-field search (name, code, phone, email, tax_id as applicable)
- All endpoints implement cursor-based pagination
- All endpoints implement context filtering (companyId, onlyActive)

---

### Phase 2: Component Migration - High Priority (Week 2-3)

**Priority**: 🔴 HIGH

**Components to migrate**:
1. QuotationForm (2 instances: customers, vehicle-models)
2. InsuranceContractForm (3 instances: customers, vehicle-models, providers)
3. PurchaseList (1 instance: suppliers)
4. EmployeeManagement (3 instances: departments, positions, levels)
5. RepairOrderList (2 instances: vehicle-models, users)
6. ServiceQuoteCreate (1 instance: vehicle-models)

**Tasks**:
- Replace `<AutocompleteFK>` with `<SmartSelect>` in each component
- Update state management (if needed)
- Update onChange handlers to work with new component interface
- Test each migrated component

---

### Phase 3: Component Migration - Medium Priority (Week 4)

**Priority**: 🟡 MEDIUM

**Components to migrate**:
1. TestDriveSchedule (1 instance: vehicle-models)
2. VinAllocation (1 instance: vehicle-models)
3. PdsList (1 instance: vehicle-models)
4. AppointmentList (1 instance: vehicle-models)
5. BayAssignmentDialog (1 instance: vehicle-models)
6. LeadDialog (1 instance: vehicle-models)
7. CreateLeadDialog (1 instance: vehicle-models)
8. InsuranceClaimForm (1 instance: contracts)
9. UserForm (2 instances: roles, departments)
10. FixedAssets (1 instance: suppliers)

---

### Phase 4: Component Migration - Low Priority (Week 5)

**Priority**: 🟢 LOW

**Components to migrate**:
1. GenericMasterDataForm (dynamic - needs special handling)
2. Keep AutocompleteFK as deprecated component (for reference)

---

### Phase 5: Cleanup & Documentation (Week 6)

**Tasks**:
1. Update documentation to reflect new component usage
2. Create migration guide for future developers
3. Mark AutocompleteFK as deprecated
4. Update training materials
5. Delete or archive old demo pages (except reference)

---

## Risk Assessment

### Without Migration

| Risk | Severity | Impact |
|------|----------|--------|
| User Experience Degradation | 🔴 HIGH | Users cannot search efficiently, leading to frustration |
| Performance Issues | 🟡 MEDIUM | Loading all data at once causes slowdown with large datasets |
| Scalability Issues | 🟡 MEDIUM | System cannot handle >100 records efficiently |
| Maintenance Burden | 🟡 MEDIUM | Two components to maintain increases technical debt |
| Inconsistency | 🟡 MEDIUM | Old and new UX patterns coexist in system |

### With Migration

| Risk | Severity | Impact |
|------|----------|--------|
| Regression Bugs | 🟡 MEDIUM | Migration may introduce new bugs |
| Training Required | 🟢 LOW | Users need to learn new search features |
| Testing Required | 🟡 MEDIUM | Comprehensive testing needed for all migrated forms |

---

## Estimation

### Effort Breakdown

| Phase | Components | Endpoints | Estimated Effort (days) |
|-------|------------|------------|------------------------|
| Phase 1: API Creation | - | 9 | 5-7 |
| Phase 2: High Priority Migration | 6 | - | 8-10 |
| Phase 3: Medium Priority Migration | 10 | - | 10-12 |
| Phase 4: Low Priority Migration | 2 | - | 3-4 |
| Phase 5: Cleanup & Documentation | - | - | 2-3 |
| **TOTAL** | **18** | **9** | **28-36** |

**Team Size Recommendation**: 2-3 developers
**Timeline**: 6-8 weeks

---

## Dependencies

### Blocked By

1. **CR for Migration Approval** - Need approval to proceed with migration
2. **API Team Availability** - Need API developers to create endpoints
3. **Testing Environment** - Need stable environment for testing

### Blocking

1. **Other CRs** - No other CRs specifically blocked by this
2. **Database Changes** - No database changes required (existing endpoints work)

---

## Related Bugs

| Bug ID | Description | Status |
|---------|-------------|--------|
| BUG-RT-015 | Quotation Form không thể tìm kiếm và chọn khách hàng | OPEN |

**Note**: BUG-RT-015 is a direct consequence of incomplete migration.

---

## Next Steps

### For Antigravity

1. **Review and Approve Migration Plan**
   - Review this report
   - Approve migration approach
   - Provide resources (developers, timeline)

2. **Assign Priority**
   - Determine migration priority (business-critical modules first)
   - Allocate team members

3. **Create New CR** (Recommended)
   - Create CR-20260205-001: "Migration of AutocompleteFK to SmartSelect"
   - Include scope, timeline, resources
   - Link to CR-20260204-001

### For Development Team

1. **Start with API Creation** (Phase 1)
   - Create all missing `/api/shared/search/:entity` endpoints
   - Follow the pattern from `/api/shared/search/vehicle-models`
   - Implement multi-field search, pagination, context filtering

2. **Migrate High Priority Components** (Phase 2)
   - Start with QuotationForm (most user-facing)
   - Then InsuranceContractForm
   - Then PurchaseList

3. **Test Thoroughly**
   - Create test cases for each migrated component
   - Ensure search, pagination, create in-place all work
   - Get UAT sign-off

---

## Appendix A: Complete File List

### Files Using AutocompleteFK (17 components)

```
components/sales/QuotationForm.tsx
components/sales/TestDriveSchedule.tsx
components/sales/VinAllocation.tsx
components/sales/PdsList.tsx

components/service/RepairOrderList.tsx
components/service/AppointmentList.tsx
components/service/BayAssignmentDialog.tsx
components/service/ServiceQuoteCreate.tsx

components/insurance/InsuranceContractForm.tsx
components/insurance/InsuranceClaimForm.tsx

components/crm/LeadDialog.tsx
components/crm/CreateLeadDialog.tsx

components/master/GenericMasterDataForm.tsx
components/master/EmployeeManagement.tsx

components/parts/PurchaseList.tsx

components/admin/UserForm.tsx

components/accounting/FixedAssets.tsx

app/demo/autocomplete-fk/page.tsx
```

---

## Appendix B: Search Field Requirements by Entity

| Entity | Required Search Fields | Current AutocompleteFK Support |
|--------|----------------------|-------------------------------|
| customers | name, phone, mobile, email | name only |
| suppliers | name, code, phone, email | name only |
| vehicle-models | model_name, model_code | model_name only |
| users | name, email | name only |
| employees | first_name, last_name, employee_code | first_name only (if applicable) |
| departments | name, code | name only |
| positions | name, code | name only |
| levels | name, code | name only |
| providers | name, code, phone, email | name only |
| contracts | contract_number, customer_name, customer_phone | name only |

---

## Sign-off

**Prepared By**: OpenCode - UAT Execution Authority  
**Date**: 2026-02-04 22:45  
**Report Type**: Audit/Migration Planning (No Code Changes)  
**Status**: READY_FOR_REVIEW

**Recommendation**: Create new CR for migration and begin with Phase 1 (API Endpoint Creation) immediately.

---

**Keywords**: AutocompleteFK, SmartSelect, Migration, CR-20260204-001, API Endpoints, Search, Pagination, Context Filtering
