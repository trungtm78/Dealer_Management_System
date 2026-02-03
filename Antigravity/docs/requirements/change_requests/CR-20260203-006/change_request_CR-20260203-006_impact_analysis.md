# CR IMPACT ANALYSIS: CR-20260203-006

## Document Information
- **CR ID**: CR-20260203-006
- **Title**: GetDataForFK - API Helper for Foreign Key Dropdown Data
- **Created**: 03/02/2026
- **Author**: Antigravity - Business Analyst
- **Status**: APPROVED in CR-01

---

## Executive Summary

**Change Type**: Technical Infrastructure Enhancement (API Layer + UI Pattern)

**Scope**: **CROSS-MODULE** - Affects ALL modules with Foreign Key references

**Impact Level**: **HIGH** (All modules, but low-risk non-breaking changes)

**Core Requirement**: 
All Foreign Key fields across the entire system must be displayed as dropdown/select components, loading data from Master Data APIs instead of requiring manual text input.

**Business Value**:
- ✅ Ensures data integrity (prevents invalid FK references)
- ✅ Improves UX consistency across all modules
- ✅ Reduces data entry errors 
- ✅ Standardizes dropdown pattern system-wide

---

## 1. Impact Matrix

| Document Type | Impact Level | Changes Required | Version Increment |
|--------------|--------------|------------------|-------------------|
| BRD | ❌ NONE | No business process changes | No change |
| FRD (All Modules) | ⭐⭐⭐ HIGH | Specify dropdown for ALL FK fields | v1.X → v1.(X+1) for each module |
| ERD | ❌ NONE | No database schema changes | No change |
| API Spec (All Modules) | ⭐⭐ MEDIUM | Add missing list endpoints + `?for_dropdown` param | v1.X → v1.(X+1) for affected modules |
| UI Spec (All Modules) | ⭐⭐⭐ HIGH | Specify dropdown component usage for FK fields | v1.X → v1.(X+1) for each module |
| Refs | ⭐ LOW | Verify dropdown components exist (they do) | No change (existing components) |

---

## 2. BRD Impact

### Assessment
❌ **NO IMPACT**

**Rationale**:
- Business objectives unchanged
- No new actors
- No business process changes
- Implementation detail only (UI/UX improvement)

**Conclusion**: BRD documents DO NOT require updates

---

## 3. FRD Impact (HIGH)

### Overview
**ALL FRD documents** need updates to specify dropdown requirement for FK fields.

### 3.1 Affected Modules

#### Module 1: CRM (frd_crm_v1.0 → v1.1)

**FK Fields Requiring Dropdown**:

| Screen | Field Name | FK Reference | Data Source API |
|--------|-----------|--------------|-----------------|
| Lead Create/Edit | `assigned_to` | users.id | `GET /api/users?for_dropdown=true` |
| Lead Create/Edit | `model_interest` | vehicle_models.id | `GET /api/vehicle-models?for_dropdown=true` |
| Customer Create/Edit | `vehicle_model_id` | vehicle_models.id | `GET /api/vehicle-models?for_dropdown=true` |
| Customer Create/Edit | `assigned_sales_rep` | users.id (role=Sales) | `GET /api/users?role=sales&for_dropdown=true` |
| Test Drive Request | `vehicle_model_id` | vehicle_models.id | `GET /api/vehicle-models?for_dropdown=true` |
| Test Drive Request | `lead_id` | leads.id | `GET /api/leads?for_dropdown=true` |

**FRD Changes**:
- Update Data Requirements: Add dropdown specification for FK fields
- Update Screen Specs: Specify dropdown component for each FK field
- Add Business Rule: "FK fields MUST use dropdown with data from Master Data APIs"

---

#### Module 2: Sales (frd_sales_v1.1 → v1.2)

**FK Fields Requiring Dropdown**:

| Screen | Field Name | FK Reference | Data Source API |
|--------|-----------|--------------|-----------------|
| Quotation Create/Edit | `customer_id` | customers.id | `GET /api/customers?for_dropdown=true` |
| Quotation Create/Edit | `vehicle_model_id` | vehicle_models.id | `GET /api/vehicle-models?for_dropdown=true` |
| Quotation Create/Edit | `sales_rep_id` | users.id (role=Sales) | `GET /api/users?role=sales&for_dropdown=true` |
| Quotation Items | `accessory_id` | accessories.id | `GET /api/accessories?for_dropdown=true` |
| Contract Create/Edit | `quotation_id` | quotations.id | `GET /api/quotations?for_dropdown=true` |
| Contract Create/Edit | `customer_id` | customers.id | `GET /api/customers?for_dropdown=true` |

**FRD Changes**: Same pattern as CRM

---

#### Module 3: Service (frd_service_v1.0 → v1.1)

**FK Fields Requiring Dropdown**:

| Screen | Field Name | FK Reference | Data Source API |
|--------|-----------|--------------|-----------------|
| Repair Order Create/Edit | `customer_id` | customers.id | `GET /api/customers?for_dropdown=true` |
| Repair Order Create/Edit | `vehicle_id` | vehicles.id | `GET /api/vehicles?for_dropdown=true` |
| Repair Order Create/Edit | `bay_id` | service_bays.id | `GET /api/service-bays?for_dropdown=true` |
| Repair Order Create/Edit | `technician_id` | users.id (role=Technician) | `GET /api/users?role=technician&for_dropdown=true` |
| Service Items | `service_catalog_id` | service_catalog.id | `GET /api/service-catalog?for_dropdown=true` |
| Service Items | `part_id` | parts.id | `GET /api/parts?for_dropdown=true` |
| Appointment Create/Edit | `customer_id` | customers.id | `GET /api/customers?for_dropdown=true` |
| Appointment Create/Edit | `vehicle_id` | vehicles.id | `GET /api/vehicles?for_dropdown=true` |
| Appointment Create/Edit | `bay_id` | service_bays.id | `GET /api/service-bays?for_dropdown=true` |

**FRD Changes**: Same pattern

---

#### Module 4: Parts (frd_parts_v1.0 → v1.1)

**FK Fields Requiring Dropdown**:

| Screen | Field Name | FK Reference | Data Source API |
|--------|-----------|--------------|-----------------|
| Part Create/Edit | `supplier_id` | suppliers.id | `GET /api/suppliers?for_dropdown=true` |
| Part Create/Edit | `category_id` | part_categories.id | `GET /api/part-categories?for_dropdown=true` |
| Part Create/Edit | `warehouse_id` | warehouses.id | `GET /api/warehouses?for_dropdown=true` |
| Part Create/Edit | `uom_id` | uoms.id (Unit of Measure) | `GET /api/uoms?for_dropdown=true` |
| Part Compatibility | `vehicle_model_id` | vehicle_models.id | `GET /api/vehicle-models?for_dropdown=true` |
| Part Movement | `from_warehouse_id` | warehouses.id | `GET /api/warehouses?for_dropdown=true` |
| Part Movement | `to_warehouse_id` | warehouses.id | `GET /api/warehouses?for_dropdown=true` |
| Part Movement | `approved_by` | users.id | `GET /api/users?for_dropdown=true` |

**FRD Changes**: Same pattern

---

#### Module 5: Master Data (frd_master_data_v1.3 → v1.4)

**FK Fields Requiring Dropdown**:

| Screen | Field Name | FK Reference | Data Source API |
|--------|-----------|--------------|-----------------|
| Accessory Create/Edit | `category_id` | accessory_categories.id | `GET /api/accessory-categories?for_dropdown=true` |
| Accessory Compatibility | `vehicle_model_id` | vehicle_models.id | `GET /api/vehicle-models?for_dropdown=true` |
| Service Catalog Create/Edit | `category_id` | service_categories.id | `GET /api/service-categories?for_dropdown=true` |
| Service Package Items | `service_id` | service_catalog.id | `GET /api/service-catalog?for_dropdown=true` |
| Employee Create/Edit | `user_id` | users.id | `GET /api/users?for_dropdown=true` |
| Employee Create/Edit | `department_id` | departments.id | `GET /api/departments?for_dropdown=true` |
| Employee Create/Edit | `position_id` | positions.id | `GET /api/positions?for_dropdown=true` |

**FRD Changes**: Same pattern

---

#### Module 6: Admin (frd_admin_v2.1 → v2.2)

**FK Fields Requiring Dropdown**:

| Screen | Field Name | FK Reference | Data Source API |
|--------|-----------|--------------|-----------------|
| User Create/Edit | `role_id` | roles.id | `GET /api/roles?for_dropdown=true` |
| User Create/Edit | `department_id` | departments.id | `GET /api/departments?for_dropdown=true` |
| Role Permission Assignment | `permission_id` | permissions.id | `GET /api/permissions?for_dropdown=true` |
| Activity Log Filter | `user_id` | users.id | `GET /api/users?for_dropdown=true` |

**FRD Changes**: Same pattern

---

#### Module 7: Accounting (frd_accounting_v1.0 → v1.1)

**FK Fields Requiring Dropdown**:

| Screen | Field Name | FK Reference | Data Source API |
|--------|-----------|--------------|-----------------|
| Invoice Create/Edit | `customer_id` | customers.id | `GET /api/customers?for_dropdown=true` |
| Invoice Create/Edit | `quotation_id` | quotations.id | `GET /api/quotations?for_dropdown=true` |
| Payment Create/Edit | `invoice_id` | invoices.id | `GET /api/invoices?for_dropdown=true` |
| Payment Create/Edit | `payment_method_id` | payment_methods.id | `GET /api/payment-methods?for_dropdown=true` |

**FRD Changes**: Same pattern

---

#### Module 8: Insurance (frd_insurance_v1.3 → v1.4)

**FK Fields Requiring Dropdown**:

| Screen | Field Name | FK Reference | Data Source API |
|--------|-----------|--------------|-----------------|
| Insurance Policy Create/Edit | `customer_id` | customers.id | `GET /api/customers?for_dropdown=true` |
| Insurance Policy Create/Edit | `vehicle_id` | vehicles.id | `GET /api/vehicles?for_dropdown=true` |
| Insurance Policy Create/Edit | `provider_id` | insurance_providers.id | `GET /api/insurance-providers?for_dropdown=true` |
| Insurance Policy Create/Edit | `package_id` | insurance_packages.id | `GET /api/insurance-packages?for_dropdown=true` |

**FRD Changes**: Same pattern

---

### 3.2 FRD Update Pattern (Standard for ALL modules)

**Section to Update**: Data Requirements

**Add for EACH FK Field**:
```markdown
#### Field: {field_name} (FK)
- **Type**: UUID / BIGINT (Foreign Key)
- **Reference**: {referenced_table}.id
- **UI Component**: Dropdown/Select
- **Data Source**: GET /api/{entity}?for_dropdown=true
- **Display Field**: name / display_name
- **Value Field**: id
- **Validation**: Must reference existing active record
- **Required**: {Yes/No}
```

**Add Business Rule**:
```markdown
### BR-XX: Foreign Key Dropdown Requirement
- All Foreign Key fields MUST be displayed as dropdown/select components
- Data loaded from Master Data API endpoints
- Only ACTIVE records shown in dropdown options
- Required FK fields: Dropdown selection is mandatory
- Optional FK fields: Dropdown includes "None" / empty option
```

---

## 4. ERD Impact

### Assessment
❌ **NO IMPACT**

**Rationale**:
- No database schema changes required
- FK constraints already exist
- No new tables
- No new columns
- No index changes

**Conclusion**: ERD documents DO NOT require updates

---

## 5. API Spec Impact (MEDIUM)

### Overview
Need to:
1. ✅ **Reuse existing** list endpoints (already exist for most entities)
2. ✅ **Add missing** list endpoints (for entities without GET list APIs)
3. ✅ **Add query param** `?for_dropdown=true` to optimize response (optional)

### 5.1 Existing List Endpoints (REUSE AS-IS)

**api_spec_master_data_v1.2.md**:
- ✅ `GET /api/vehicle-models` (exists)
- ✅ `GET /api/accessories` (exists)
- ✅ `GET /api/service-catalog` (exists)
- ✅ `GET /api/service-bays` (exists)

**api_spec_crm_v1.0.md**:
- ✅ `GET /api/customers` (exists)
- ✅ `GET /api/leads` (exists)

**api_spec_admin_v2.0.md**:
- ✅ `GET /api/users` (exists)
- ✅ `GET /api/roles` (exists)
- ✅ `GET /api/permissions` (exists)

**api_spec_parts_v1.0.md**:
- ✅ `GET /api/parts` (exists)

---

### 5.2 Missing List Endpoints (ADD NEW)

#### api_spec_master_data_v1.2 → v1.3

**New Endpoints Required**:

```typescript
// 1. Suppliers
GET /api/suppliers?for_dropdown=true
Response: {
  data: [
    { id: 'uuid', name: 'Supplier A', status: 'ACTIVE' }
  ]
}

// 2. Warehouses
GET /api/warehouses?for_dropdown=true
Response: {
  data: [
    { id: 'uuid', name: 'Warehouse Central', status: 'ACTIVE' }
  ]
}

// 3. UOMs (Unit of Measure)
GET /api/uoms?for_dropdown=true
Response: {
  data: [
    { id: 'uuid', name: 'Piece', code: 'PC', status: 'ACTIVE' }
  ]
}

// 4. Departments
GET /api/departments?for_dropdown=true
Response: {
  data: [
    { id: 'uuid', name: 'Sales Department', status: 'ACTIVE' }
  ]
}

// 5. Positions
GET /api/positions?for_dropdown=true
Response: {
  data: [
    { id: 'uuid', name: 'Sales Manager', status: 'ACTIVE' }
  ]
}

// 6. Part Categories
GET /api/part-categories?for_dropdown=true
Response: {
  data: [
    { id: 'uuid', name: 'Engine Parts', status: 'ACTIVE' }
  ]
}

// 7. Accessory Categories
GET /api/accessory-categories?for_dropdown=true
Response: {
  data: [
    { id: 'uuid', name: 'Interior', status: 'ACTIVE' }
  ]
}

// 8. Service Categories
GET /api/service-categories?for_dropdown=true
Response: {
  data: [
    { id: 'uuid', name: 'Maintenance', status: 'ACTIVE' }
  ]
}
```

---

#### api_spec_sales_v1.1 → v1.2

**New Endpoints Required**:

```typescript
// 1. Quotations (for dropdown in Contract screen)
GET /api/quotations?for_dropdown=true
Response: {
  data: [
    { id: 'uuid', code: 'QUO-2026-001', customer_name: 'John Doe', status: 'APPROVED' }
  ]
}
```

---

#### api_spec_service_v1.0 → v1.1

**New Endpoints Required**:

```typescript
// 1. Vehicles (for dropdown in RO/Appointment screens)
GET /api/vehicles?for_dropdown=true
Response: {
  data: [
    { id: 'uuid', license_plate: 'ABC-123', model_name: 'Honda City RS', status: 'ACTIVE' }
  ]
}
```

---

#### api_spec_accounting_v1.0 → v1.1

**New Endpoints Required**:

```typescript
// 1. Invoices
GET /api/invoices?for_dropdown=true
Response: {
  data: [
    { id: 'uuid', invoice_number: 'INV-2026-001', customer_name: 'John Doe', status: 'PENDING' }
  ]
}

// 2. Payment Methods
GET /api/payment-methods?for_dropdown=true
Response: {
  data: [
    { id: 'uuid', name: 'Cash', code: 'CASH', status: 'ACTIVE' }
  ]
}
```

---

#### api_spec_insurance_v1.0 → v1.1

**New Endpoints Required**:

```typescript
// 1. Insurance Providers
GET /api/insurance-providers?for_dropdown=true
Response: {
  data: [
    { id: 'uuid', name: 'PVI Insurance', code: 'PVI', status: 'ACTIVE' }
  ]
}

// 2. Insurance Packages
GET /api/insurance-packages?for_dropdown=true
Response: {
  data: [
    { id: 'uuid', name: 'Comprehensive', provider_name: 'PVI', status: 'ACTIVE' }
  ]
}
```

---

### 5.3 Query Param Enhancement: `?for_dropdown=true`

**Purpose**: Optimize API response for dropdown usage (return minimal fields only)

**Standard Implementation**:
```typescript
GET /api/{entity}?for_dropdown=true

// Normal response (full fields)
GET /api/vehicle-models
{
  data: [
    {
      id: 'uuid',
      model_code: 'MOD/2026/001',
      model_name: 'Honda City RS',
      category: 'SEDAN',
      base_price: 559000000,
      status: 'ACTIVE',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-15T00:00:00Z'
    }
  ]
}

// Dropdown-optimized response (minimal fields)
GET /api/vehicle-models?for_dropdown=true
{
  data: [
    {
      id: 'uuid',
      name: 'Honda City RS',  // Display field
      status: 'ACTIVE'
    }
  ]
}
```

**Benefits**:
- ✅ Reduced payload size (faster loading)
- ✅ Only essential dropdown fields (id, name, status)
- ✅ Backward compatible (optional param)

---

### 5.4 API Spec Update Summary

| API Spec File | Current Version | New Version | Endpoints Added | Param Added |
|--------------|----------------|-------------|-----------------|-------------|
| api_spec_master_data | v1.2 | v1.3 | 8 new (suppliers, warehouses, uoms, etc.) | `?for_dropdown` |
| api_spec_sales | v1.1 | v1.2 | 1 new (quotations list) | `?for_dropdown` |
| api_spec_service | v1.0 | v1.1 | 1 new (vehicles list) | `?for_dropdown` |
| api_spec_parts | v1.0 | v1.1 | 0 (reuse existing) | `?for_dropdown` |
| api_spec_crm | v1.0 | v1.1 | 0 (reuse existing) | `?for_dropdown` |
| api_spec_admin | v2.0 | v2.1 | 0 (reuse existing) | `?for_dropdown` |
| api_spec_accounting | v1.0 | v1.1 | 2 new (invoices, payment methods) | `?for_dropdown` |
| api_spec_insurance | v1.0 | v1.1 | 2 new (providers, packages) | `?for_dropdown` |

**Total New Endpoints**: 14

---

## 6. UI Spec Impact (HIGH)

### Overview
All UI Spec documents need to specify dropdown component usage for FK fields.

### 6.1 Standard Dropdown Component Specification

**For EACH FK Field in UI Spec**:

```markdown
#### Field: {field_name}
- **Component**: Select/Dropdown (from Refs)
- **Data Source**: GET /api/{entity}?for_dropdown=true
- **Display Field**: name
- **Value Field**: id
- **Filter**: status = 'ACTIVE'
- **Searchable**: Yes (if > 10 options)
- **Required**: {Yes/No}
- **Empty Option**: {null / 'No Selection'} (for optional fields)
- **Loading State**: Show spinner while fetching data
- **Error State**: Show error message + retry button
- **Caching**: Cache dropdown data for 5 minutes
```

---

### 6.2 UI Spec Update Summary

| UI Spec File | Current Version | New Version | Changes |
|-------------|----------------|-------------|---------|
| ui_spec_crm | v1.0 | v1.1 | Add dropdown spec for 6 FK fields |
| ui_spec_sales | v1.0 | v1.1 | Add dropdown spec for 6 FK fields |
| ui_spec_service | v1.0 | v1.1 | Add dropdown spec for 9 FK fields |
| ui_spec_parts | v1.0 | v1.1 | Add dropdown spec for 8 FK fields |
| ui_spec_master_data | v1.2 | v1.3 | Add dropdown spec for 7 FK fields |
| ui_spec_admin | v2.0 | v2.1 | Add dropdown spec for 4 FK fields |
| ui_spec_accounting | v1.0 | v1.1 | Add dropdown spec for 4 FK fields |
| ui_spec_insurance | v1.0 | v1.1 | Add dropdown spec for 4 FK fields |

---

### 6.3 Refs Evaluation

**Existing Dropdown Components** (from Refs):
- ✅ `<Select>` component exists
- ✅ `<Autocomplete>` component exists (for searchable dropdowns)
- ✅ `<MultiSelect>` component exists (for junction tables)

**Conclusion**: ✅ **NO NEW COMPONENTS NEEDED** - All required dropdown components already exist in Refs

**Action**: Reuse existing components

---

## 7. Cross-Document Consistency

### 7.1 FRD ↔ API Spec Mapping

**Consistency Check**:
- ✅ Each FK field in FRD has corresponding API endpoint
- ✅ All API endpoints return data in standard format (id, name, status)
- ✅ All APIs filter by status = 'ACTIVE'

**Validation Rule**:
```
FOR each FK field in FRD:
  VERIFY: Corresponding GET /api/{entity}?for_dropdown=true exists in API Spec
  VERIFY: API response includes { id, name, status }
```

---

### 7.2 FRD ↔ UI Spec Mapping

**Consistency Check**:
- ✅ Each FK field in FRD has dropdown specification in UI Spec
- ✅ UI Spec references correct API endpoint
- ✅ UI Spec uses existing Refs components

**Validation Rule**:
```
FOR each FK field in FRD:
  VERIFY: UI Spec specifies dropdown component for this field
  VERIFY: UI Spec data source matches API Spec endpoint
```

---

### 7.3 API Spec ↔ ERD Mapping

**Consistency Check**:
- ✅ All FK relationships in ERD have corresponding API endpoints
- ✅ No database schema changes required

**Validation Rule**:
```
FOR each FK constraint in ERD:
  VERIFY: Referenced entity has list API endpoint
```

---

## 8. Effort Estimate

### Complexity
**MEDIUM** (Standard pattern, but affects many modules)

### Story Points Breakdown

| Task | Story Points | Hours |
|------|-------------|-------|
| FRD Updates (8 modules) | 16 SP | 24h (3h per module) |
| API Spec Updates (14 new endpoints) | 7 SP | 10.5h (0.75h per endpoint) |
| UI Spec Updates (8 modules) | 8 SP | 12h (1.5h per module) |
| Consistency Checks | 2 SP | 3h |
| Review & Approval | 2 SP | 3h |
| **TOTAL** | **35 SP** | **52.5h (~7 days)** |

### Timeline
**7-9 working days** (Documentation work only, no code implementation)

---

## 9. Risk Assessment

### Risk Level
**LOW-MEDIUM**

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Missing FK relationships not identified | Medium | Medium | Comprehensive ERD review + Cross-reference with current screens |
| Inconsistent dropdown data format | Low | Medium | Standardize API response structure + validation rules |
| Performance issues (large dropdown lists) | Medium | Medium | Implement pagination, search, caching |
| Existing endpoints don't support `?for_dropdown` | Low | Low | Param is optional, can add incrementally |
| UI Refs components missing features | Low | Low | All required components already exist |

---

## 10. Implementation Notes

### 10.1 Validation Rules

**Required FK Fields**:
- Dropdown selection is mandatory
- Cannot submit form with empty FK value
- Error message: "Please select a {entity_name}"

**Optional FK Fields**:
- Dropdown includes "None" / "No Selection" option
- Can submit form with null FK value

**Active Records Only**:
- All dropdown lists filter by `status = 'ACTIVE'`
- Inactive records not shown in dropdown
- Exception: If editing existing record with inactive FK, show both active + currently selected inactive record

---

### 10.2 Frontend Pattern (Reference Implementation)

```typescript
// Reusable React Hook
function useFKData(entityName: string) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(`/api/${entityName}?for_dropdown=true&status=ACTIVE`)
      .then(res => res.json())
      .then(result => setData(result.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [entityName]);
  
  return { data, loading, error };
}

// Usage in Form Component
function QuotationForm() {
  const { data: customers, loading } = useFKData('customers');
  const { data: vehicleModels } = useFKData('vehicle-models');
  
  return (
    <form>
      <Select
        label="Customer"
        options={customers}
        loading={loading}
        getOptionLabel={(opt) => opt.name}
        getOptionValue={(opt) => opt.id}
        required
      />
      <Select
        label="Vehicle Model"
        options={vehicleModels}
        getOptionLabel={(opt) => opt.name}
        getOptionValue={(opt) => opt.id}
        required
      />
    </form>
  );
}
```

---

## 11. Dependencies

### Internal Dependencies
- ✅ Master Data Module (source of dropdown data)
- ✅ ERD (FK relationship definitions)
- ✅ Refs (dropdown components)
- ✅ All modules (consume dropdown pattern)

### External Dependencies
- ❌ None

---

## 12. Acceptance Criteria

### Documentation Complete (CR-05 Consolidation)
- ✅ All FRD documents updated with dropdown specifications
- ✅ All API Spec documents updated with list endpoints
- ✅ All UI Spec documents updated with dropdown component specs
- ✅ Consistency checks passed (FRD ↔ API ↔ UI ↔ ERD)
- ✅ All CR markers removed from consolidated documents
- ✅ Version numbers incremented correctly
- ✅ Change logs updated

### Implementation Complete (CR-06 OpenCode)
- ✅ All FK fields use dropdown components (no manual text input)
- ✅ All dropdown data loaded from Master Data APIs
- ✅ Only ACTIVE records shown in dropdowns
- ✅ Required FK fields enforce selection
- ✅ Optional FK fields allow null selection
- ✅ Dropdown search works for lists > 10 items
- ✅ Loading states displayed while fetching data
- ✅ Error handling + retry functionality works

---

## 13. Next Steps (CR-03: Create Drafts)

### Actions Required
1. ✅ Create DRAFT FRD documents for all 8 modules
   - Add dropdown specification for each FK field
   - Add business rule for FK dropdown requirement
2. ✅ Create DRAFT API Spec documents for affected modules
   - Add 14 new list endpoints with standard format
   - Add `?for_dropdown` query param specification
3. ✅ Create DRAFT UI Spec documents for all 8 modules
   - Add dropdown component specification for each FK field
   - Reference existing Refs components
4. ✅ Create Draft Summary document

---

**Status**: ✅ **READY FOR CR-03 (Create Drafts)**

---

**END OF CR IMPACT ANALYSIS**
