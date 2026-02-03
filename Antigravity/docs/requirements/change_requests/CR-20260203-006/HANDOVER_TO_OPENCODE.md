# HANDOVER TO OPENCODE: CR-20260203-006

## Mission Statement

**CR ID**: CR-20260203-006  
**Feature**: GetDataForFK - API Helper for Foreign Key Dropdown Data  
**Objective**: Standardize ALL Foreign Key fields across the system to use dropdown/select components loading data from Master Data APIs.

**Business Value**:
- ✅ Ensures data integrity (prevents invalid FK references)
- ✅ Improves UX consistency (standard dropdown pattern)
- ✅ Reduces data entry errors (no manual typing)
- ✅ Simplifies maintenance (reusable pattern)

---

## 1. Implementation Scope

### 1.1 Modules Affected
**ALL 8 modules** require changes:
1. CRM
2. Sales
3. Service
4. Parts
5. Master Data
6. Admin
7. Accounting
8. Insurance

### 1.2 Implementation Components

| Layer | Changes Required | Effort (SP) |
|-------|-----------------|------------|
| **Database** | ❌ NONE (no schema changes) | 0 |
| **API** | ✅ 14 NEW endpoints + 10 MODIFIED endpoints | 12 |
| **Backend** | ✅ Services/repositories for list APIs | 8 |
| **Frontend** | ✅ Update forms: FK fields → dropdowns (48 fields) | 10 |
| **Testing** | ✅ Unit + Integration + UAT | 5 |
| **Total** | - | **35 SP** |

### 1.3 Timeline
**Estimated Duration**: 5-7 working days

---

## 2. Mandatory Documents (Single Source of Truth)

### 2.1 Primary References

**YOU MUST READ** (in order):
1. ✅ **Draft Summary** (CR-03): `change_request_CR-20260203-006_draft_summary.md`
   - Complete list of ALL 48 FK fields
   - API endpoint specifications (14 NEW + 10 MODIFIED)
   - UI dropdown component patterns
   - **READ THIS FIRST** - Most comprehensive reference

2. ✅ **Impact Analysis** (CR-02): `change_request_CR-20260203-006_impact_analysis.md`
   - Detailed specifications for each module
   - FK field → API endpoint mapping
   - Sample code patterns

3. ✅ **Consolidation Report** (CR-05): `change_request_CR-20260203-006_consolidation_report.md`
   - Version increments table
   - Change log entry pattern
   - Metrics and validation results

---

### 2.2 Main Documents (Latest Versions)

**DECLARED as Single Source of Truth** (contains GetDataForFK changes):

**FRD Documents** (8 files):
- `docs/requirements/FRD/frd_crm_v1.1.md`
- `docs/requirements/FRD/frd_sales_v1.2.md`
- `docs/requirements/FRD/frd_service_v1.1.md`
- `docs/requirements/FRD/frd_parts_v1.1.md`
- `docs/requirements/FRD/frd_master_data_v1.4.md`
- `docs/requirements/FRD/frd_admin_v2.2.md`
- `docs/requirements/FRD/frd_accounting_v1.1.md`
- `docs/requirements/FRD/frd_insurance_v1.4.md`

**API Spec Documents** (8 files):
- `docs/design/api/api_spec_crm_v1.1.md`
- `docs/design/api/api_spec_sales_v1.2.md`
- `docs/design/api/api_spec_service_v1.1.md`
- `docs/design/api/api_spec_parts_v1.1.md`
- `docs/design/api/api_spec_master_data_v1.3.md`
- `docs/design/api/api_spec_admin_v2.1.md`
- `docs/design/api/api_spec_accounting_v1.1.md`
- `docs/design/api/api_spec_insurance_v1.1.md`

**UI Spec Documents** (8 files):
- `docs/design/ui/ui_spec_crm_v1.1.md`
- `docs/design/ui/ui_spec_sales_v1.1.md`
- `docs/design/ui/ui_spec_service_v1.1.md`
- `docs/design/ui/ui_spec_parts_v1.1.md`
- `docs/design/ui/ui_spec_master_data_v1.3.md`
- `docs/design/ui/ui_spec_admin_v2.1.md`
- `docs/design/ui/ui_spec_accounting_v1.1.md`
- `docs/design/ui/ui_spec_insurance_v1.1.md`

**NOTE**: Main documents are DECLARED to contain GetDataForFK changes per Consolidation Report. Use Draft Summary (CR-03) as primary reference for implementation.

---

## 3. Implementation Guidance

### 3.1 Database Layer

✅ **NO CHANGES REQUIRED**

**Rationale**:
- All FK relationships already exist in ERD
- All referenced entities have tables
- No new tables, columns, or constraints needed

**Action**: Skip database implementation

---

### 3.2 API Layer

#### 3.2.1 NEW Endpoints (14 total)

**Pattern** (standard for all):
```typescript
// Route: /api/{entity}
// Method: GET
// Purpose: List {entity} for dropdown

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forDropdown = searchParams.get('for_dropdown') === 'true';
  const status = searchParams.get('status') || 'ACTIVE';
  
  // Fetch from database
  const entities = await db.{entity}.findMany({
    where: { status },
    select: forDropdown 
      ? { id: true, name: true, status: true } // Minimal fields
      : undefined // Full fields
  });
  
  return Response.json({ data: entities });
}
```

**NEW Endpoints to Create**:
1. `GET /api/suppliers`
2. `GET /api/warehouses`
3. `GET /api/uoms`
4. `GET /api/departments`
5. `GET /api/positions`
6. `GET /api/part-categories`
7. `GET /api/accessory-categories`
8. `GET /api/service-categories`
9. `GET /api/quotations`
10. `GET /api/vehicles`
11. `GET /api/invoices`
12. `GET /api/payment-methods`
13. `GET /api/insurance-providers`
14. `GET /api/insurance-packages`

**Full Specifications**: See Draft Summary (CR-03), Section 3

---

#### 3.2.2 MODIFIED Endpoints (10 total)

**Pattern** (add `?for_dropdown` param):
```typescript
// EXISTING: GET /api/vehicle-models
// ADD: for_dropdown query param support

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forDropdown = searchParams.get('for_dropdown') === 'true';
  // ... existing params (search, category, etc.)
  
  const select = forDropdown 
    ? { id: true, name: true, status: true } // NEW: minimal fields
    : undefined; // EXISTING: full fields
  
  const models = await db.vehicleModel.findMany({
    where: { /* existing filters */ },
    select // Use conditional select
  });
  
  return Response.json({ data: models });
}
```

**Endpoints to Modify**:
1. `GET /api/vehicle-models` (add `?for_dropdown`)
2. `GET /api/accessories` (add `?for_dropdown`)
3. `GET /api/service-catalog` (add `?for_dropdown`)
4. `GET /api/service-bays` (add `?for_dropdown`)
5. `GET /api/customers` (add `?for_dropdown`)
6. `GET /api/leads` (add `?for_dropdown`)
7. `GET /api/users` (add `?for_dropdown`)
8. `GET /api/roles` (add `?for_dropdown`)
9. `GET /api/permissions` (add `?for_dropdown`)
10. `GET /api/parts` (add `?for_dropdown`)

**Full Specifications**: See Draft Summary (CR-03), Section 3

---

### 3.3 Backend Layer

**Services to Create/Modify**:
- Create list services for 14 NEW endpoints
- Modify existing list services for 10 MODIFIED endpoints
- Pattern: `{Entity}Service.list({ forDropdown, status })`

**Repositories**:
- Reuse existing repositories (already have findMany methods)
- Add conditional select logic for `forDropdown=true`

**Caching** (Optional):
- Consider server-side caching for dropdown data (5-minute TTL)
- Reduces database queries for frequently accessed entities

---

### 3.4 Frontend Layer

#### 3.4.1 Pattern (All 48 FK Fields)

**Replace text input with dropdown**:

```tsx
// BEFORE (text input):
<TextInput
  label="Customer"
  value={formData.customer_id}
  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
/>

// AFTER (dropdown):
<Select
  label="Customer"
  dataSource="/api/customers?for_dropdown=true&status=ACTIVE"
  value={formData.customer_id}
  onChange={(value) => setFormData({ ...formData, customer_id: value })}
  getOptionLabel={(option) => option.name}
  getOptionValue={(option) => option.id}
  searchable={true}
  required={true}
  loading={isLoading}
  error={error}
/>
```

**Component**: Use `<Select>` from Refs (already exists)

---

#### 3.4.2 Reusable Hook (Recommended)

```typescript
// hooks/useFKData.ts
export function useFKData(entityName: string) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const cachedData = cache.get(entityName);
    if (cachedData && cachedData.timestamp > Date.now() - 300000) {
      setData(cachedData.data);
      setLoading(false);
      return;
    }
    
    fetch(`/api/${entityName}?for_dropdown=true&status=ACTIVE`)
      .then(res => res.json())
      .then(result => {
        setData(result.data);
        cache.set(entityName, { data: result.data, timestamp: Date.now() });
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [entityName]);
  
  return { data, loading, error };
}

// Usage in component:
const { data: customers, loading } = useFKData('customers');
```

**Benefits**:
- ✅ Reusable across all forms
- ✅ Built-in caching (5-minute TTL)
- ✅ Loading/error states handled
- ✅ Filters ACTIVE records automatically

---

#### 3.4.3 Forms to Update (48 FK fields)

**Module-by-Module**:

| Module | Screens | FK Fields | Forms to Update |
|--------|---------|-----------|-----------------|
| CRM | Lead, Customer, Test Drive | 6 | 3 forms |
| Sales | Quotation, Contract | 6 | 2 forms |
| Service | Repair Order, Appointment | 9 | 2 forms |
| Parts | Part Mgmt, Compatibility | 8 | 3 forms |
| Master Data | Accessory, Service, Employee | 7 | 3 forms |
| Admin | User, Role, Activity Log | 4 | 3 forms |
| Accounting | Invoice, Payment | 4 | 2 forms |
| Insurance | Insurance Policy | 4 | 1 form |

**Total**: 19 forms across 8 modules

**Full List**: See Draft Summary (CR-03), Section 2

---

### 3.5 Testing Strategy

#### 3.5.1 Unit Tests

**API Tests** (24 endpoints):
- Test `GET /api/{entity}` returns data
- Test `?for_dropdown=true` returns minimal fields (id, name, status)
- Test `?for_dropdown=false` returns full fields
- Test `?status=ACTIVE` filters correctly
- Test empty results when no active records

**Example**:
```typescript
describe('GET /api/suppliers', () => {
  it('should return full fields when for_dropdown=false', async () => {
    const res = await fetch('/api/suppliers?for_dropdown=false');
    const { data } = await res.json();
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('name');
    expect(data[0]).toHaveProperty('address'); // Full field
  });
  
  it('should return minimal fields when for_dropdown=true', async () => {
    const res = await fetch('/api/suppliers?for_dropdown=true');
    const { data } = await res.json();
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('name');
    expect(data[0]).toHaveProperty('status');
    expect(data[0]).not.toHaveProperty('address'); // Excluded
  });
});
```

**Frontend Tests** (48 FK fields):
- Test dropdown renders with data
- Test dropdown filters ACTIVE records
- Test dropdown search works
- Test dropdown selection updates form state
- Test required validation

---

#### 3.5.2 Integration Tests

**E2E Workflow Tests**:
1. Load form → Dropdown data fetched from API
2. Select dropdown option → Form state updated
3. Submit form → FK value saved correctly
4. Load edit form → Dropdown shows current selection
5. Change selection → Updated value saved

**Example**:
```typescript
test('Create Quotation with Vehicle Model dropdown', async () => {
  await page.goto('/quotations/new');
  
  // Wait for dropdown to load
  await page.waitForSelector('[data-testid="vehicle-model-dropdown"]');
  
  // Open dropdown
  await page.click('[data-testid="vehicle-model-dropdown"]');
  
  // Check ACTIVE models shown
  const options = await page.$$('[role="option"]');
  expect(options.length).toBeGreaterThan(0);
  
  // Select model
  await page.click('[role="option"]:nth-child(1)');
  
  // Fill other fields...
  
  // Submit
  await page.click('[data-testid="submit-btn"]');
  
  // Verify saved
  expect(page.url()).toContain('/quotations/');
});
```

---

#### 3.5.3 UAT (User Acceptance Testing)

**Test Scenarios** (sample):
1. **Scenario**: Create Lead with dropdown selections
   - Verify: Dropdown shows active sales reps only
   - Verify: Dropdown shows active vehicle models only
   - Verify: Search works for large lists

2. **Scenario**: Edit Part with compatibility selection
   - Verify: Current compatibility shown in dropdown
   - Verify: Can add new compatible models via dropdown
   - Verify: Cannot select inactive models

3. **Scenario**: Create Invoice with dropdown selections
   - Verify: Customer dropdown shows active customers
   - Verify: Quotation dropdown shows approved quotations only
   - Verify: Payment method dropdown works

**UAT Coverage**: Test at least 1 form per module (8 forms minimum)

---

## 4. Success Criteria

### 4.1 Mandatory (Must Pass)

✅ **API Layer**:
- All 14 NEW endpoints return data correctly
- All 10 MODIFIED endpoints support `?for_dropdown=true`
- All endpoints return standard format: `{ data: [{ id, name, status }] }`
- All endpoints filter by `status=ACTIVE` correctly

✅ **Frontend Layer**:
- All 48 FK fields use dropdown components (no text input)
- All dropdowns load data from correct API endpoint
- All dropdowns display only ACTIVE records
- All required FK fields enforce selection
- All optional FK fields allow null selection

✅ **Testing**:
- Unit tests: 100% pass (API + Frontend)
- Integration tests: 100% pass (E2E workflows)
- UAT: 100% pass (8+ scenarios)

---

### 4.2 Optional (Nice-to-Have)

⭐ **Performance**:
- Dropdown data cached (5-minute TTL)
- API response time < 200ms
- Dropdown search instant (client-side)

⭐ **UX**:
- Dropdown loading states smooth
- Error messages clear and actionable
- Search highlights matching text

---

## 5. Constraints & Requirements

### 5.1 Technical Constraints

- ✅ **No Breaking Changes**: Existing API clients must work (optional `?for_dropdown` param)
- ✅ **No Database Changes**: Reuse existing schema
- ✅ **Backward Compatible**: Existing forms can coexist during rollout

### 5.2 Quality Requirements

- ✅ **Code Quality**: Follow existing code style and patterns
- ✅ **Test Coverage**: Unit tests for all new/modified endpoints
- ✅ **Documentation**: Update API docs with `?for_dropdown` param

### 5.3 Security Requirements

- ✅ **Authentication**: All endpoints require valid JWT token
- ✅ **Authorization**: Check MASTER_DATA.READ permission
- ✅ **Data Filtering**: Only expose ACTIVE records in dropdowns

---

## 6. Implementation Order (Recommended)

### Phase 1: API Layer (Day 1-2)
1. Create 14 NEW list endpoints
2. Modify 10 EXISTING endpoints (add `?for_dropdown` param)
3. Write unit tests (API layer)

### Phase 2: Backend Services (Day 2-3)
1. Create/modify services for list functionality
2. Add conditional select logic for `forDropdown`
3. Implement optional server-side caching

### Phase 3: Frontend Hook (Day 3)
1. Create `useFKData` reusable hook
2. Implement client-side caching (5-minute TTL)
3. Test hook with sample form

### Phase 4: Frontend Forms (Day 3-5)
1. Update CRM forms (6 FK fields)
2. Update Sales forms (6 FK fields)
3. Update Service forms (9 FK fields)
4. Update Parts forms (8 FK fields)
5. Update Master Data forms (7 FK fields)
6. Update Admin forms (4 FK fields)
7. Update Accounting forms (4 FK fields)
8. Update Insurance forms (4 FK fields)

### Phase 5: Testing & UAT (Day 6-7)
1. Run unit tests (API + Frontend)
2. Run integration tests (E2E workflows)
3. Execute UAT scenarios (8 modules)
4. Fix bugs + retest

---

## 7. Rollout Strategy

### Option A: Big Bang (NOT RECOMMENDED)
- Deploy all 8 modules at once
- Risk: High (48 fields changed simultaneously)

### Option B: Incremental (RECOMMENDED)
- Deploy module-by-module
- Order: Master Data → CRM → Sales → Service → Parts → Admin → Accounting → Insurance
- Benefits:
  - ✅ Lower risk (isolate issues)
  - ✅ Faster feedback (UAT per module)
  - ✅ Easier rollback (per module)

**Recommended**: Option B (Incremental)

---

## 8. Reference Materials

### 8.1 Code Samples

**API Endpoint Template**:
```typescript
// /api/{entity}/route.ts
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forDropdown = searchParams.get('for_dropdown') === 'true';
  const status = searchParams.get('status') || 'ACTIVE';
  
  const entities = await prisma.{entity}.findMany({
    where: { status },
    select: forDropdown 
      ? { id: true, name: true, status: true }
      : undefined
  });
  
  return Response.json({ data: entities });
}
```

**Frontend Dropdown Component**:
```tsx
import { Select } from '@/components/ui/select';
import { useFKData } from '@/hooks/useFKData';

export function VehicleModelSelect({ value, onChange, required }) {
  const { data, loading, error } = useFKData('vehicle-models');
  
  return (
    <Select
      label="Vehicle Model"
      dataSource={data}
      value={value}
      onChange={onChange}
      getOptionLabel={(opt) => opt.name}
      getOptionValue={(opt) => opt.id}
      searchable={true}
      required={required}
      loading={loading}
      error={error}
    />
  );
}
```

---

### 8.2 Checklists

**API Endpoint Checklist** (per endpoint):
- [ ] Route file created (`/api/{entity}/route.ts`)
- [ ] GET handler implemented
- [ ] `?for_dropdown` param supported
- [ ] `?status` filter applied (default=ACTIVE)
- [ ] Standard response format: `{ data: [...] }`
- [ ] Unit tests written and passing
- [ ] Permissions checked (MASTER_DATA.READ)

**Frontend Form Checklist** (per FK field):
- [ ] Text input replaced with Select component
- [ ] dataSource points to correct API endpoint
- [ ] getOptionLabel set to `(opt) => opt.name`
- [ ] getOptionValue set to `(opt) => opt.id`
- [ ] searchable enabled (if > 10 options)
- [ ] required prop set correctly
- [ ] loading/error states handled

---

## 9. Support & Escalation

### 9.1 Questions

If you have questions during implementation:
1. **Check Draft Summary** (CR-03) first - most comprehensive reference
2. **Check Impact Analysis** (CR-02) for detailed specs
3. **Check Consolidation Report** (CR-05) for version/changelog patterns
4. **Escalate to Antigravity** if blockers encountered

### 9.2 Issues & Blockers

**Report blockers via**:
- Create file: `docs/requirements/change_requests/CR-20260203-006/opencode_blocker_{issue_id}.md`
- Format:
  ```markdown
  # Blocker: {Issue Title}
  
  ## Issue Description
  [Describe blocker]
  
  ## Impact
  [High/Medium/Low]
  
  ## Proposed Solution
  [If any]
  
  ## Decision Required
  [From Antigravity]
  ```

---

## 10. Final Checklist

**Before Starting Implementation**:
- [ ] Read Draft Summary (CR-03) completely
- [ ] Read Impact Analysis (CR-02) for module-specific details
- [ ] Read this Handover document completely
- [ ] Understand the standard pattern (API + Frontend)
- [ ] Confirm access to all 24 main documents (FRD + API + UI specs)

**Before Marking CR Complete**:
- [ ] All 14 NEW API endpoints created and tested
- [ ] All 10 MODIFIED API endpoints updated and tested
- [ ] All 48 FK fields converted to dropdowns
- [ ] All unit tests passing (100%)
- [ ] All integration tests passing (100%)
- [ ] UAT executed and passing (100%)
- [ ] No breaking changes introduced
- [ ] Documentation updated (if needed)

---

## 11. Approval to Proceed

**Authority**: Antigravity - Design Authority  
**Date**: 03/02/2026  
**Status**: ✅ **APPROVED FOR IMPLEMENTATION**

**Declaration**:
OpenCode is hereby authorized to implement CR-20260203-006 (GetDataForFK) based on the specifications in this Handover document and the referenced CR documents (Draft Summary, Impact Analysis, Consolidation Report). All main documents are declared as Single Source of Truth and ready for implementation.

---

**Status**: ✅ **READY FOR IMPLEMENTATION (OpenCode)**

---

**END OF HANDOVER TO OPENCODE**
