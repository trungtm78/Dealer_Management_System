# API Implementation Plan: CR-20260203-006

## Overview
Implement 24 API changes (14 NEW + 10 MODIFIED endpoints) for GetDataForFK feature.

## Pattern
```typescript
// GET /api/{entity}?for_dropdown=true
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

## Endpoints by Module

### Module 1: Master Data (api_spec_master_data_v1.2 → v1.3)
**NEW Endpoints (8)**:
- ✅ `GET /api/suppliers?for_dropdown=true`
- ✅ `GET /api/warehouses?for_dropdown=true`
- ✅ `GET /api/uoms?for_dropdown=true`
- ✅ `GET /api/departments?for_dropdown=true`
- ✅ `GET /api/positions?for_dropdown=true`
- ✅ `GET /api/part-categories?for_dropdown=true`
- ✅ `GET /api/accessory-categories?for_dropdown=true`
- ✅ `GET /api/service-categories?for_dropdown=true`

**MODIFIED Endpoints (4)**:
- ✅ `GET /api/vehicle-models` (add `?for_dropdown`)
- ✅ `GET /api/accessories` (add `?for_dropdown`)
- ✅ `GET /api/service-catalog` (add `?for_dropdown`)
- ✅ `GET /api/service-bays` (add `?for_dropdown`)

### Module 2: Sales (api_spec_sales_v1.1 → v1.2)
**NEW Endpoints (1)**:
- ✅ `GET /api/quotations?for_dropdown=true`

**MODIFIED Endpoints**: 0

### Module 3: Service (api_spec_service_v1.0 → v1.1)
**NEW Endpoints (1)**:
- ✅ `GET /api/vehicles?for_dropdown=true`

**MODIFIED Endpoints**: 0

### Module 4: Parts (api_spec_parts_v1.0 → v1.1)
**NEW Endpoints**: 0

**MODIFIED Endpoints (1)**:
- ✅ `GET /api/parts` (add `?for_dropdown`)

### Module 5: CRM (api_spec_crm_v1.0 → v1.1)
**NEW Endpoints**: 0

**MODIFIED Endpoints (2)**:
- ✅ `GET /api/customers?for_dropdown` (add param)
- ✅ `GET /api/leads?for_dropdown` (add param)

### Module 6: Admin (api_spec_admin_v2.0 → v2.1)
**NEW Endpoints**: 0

**MODIFIED Endpoints (3)**:
- ✅ `GET /api/users` (add `?for_dropdown`)
- ✅ `GET /api/roles` (add `?for_dropdown`)
- ✅ `GET /api/permissions` (add `?for_dropdown`)

### Module 7: Accounting (api_spec_accounting_v1.0 → v1.1)
**NEW Endpoints (2)**:
- ✅ `GET /api/invoices?for_dropdown=true`
- ✅ `GET /api/payment-methods?for_dropdown=true`

**MODIFIED Endpoints**: 0

### Module 8: Insurance (api_spec_insurance_v1.0 → v1.1)
**NEW Endpoints (2)**:
- ✅ `GET /api/insurance-providers?for_dropdown=true`
- ✅ `GET /api/insurance-packages?for_dropdown=true`

**MODIFIED Endpoints**: 0

## Total
- **NEW Endpoints**: 14
- **MODIFIED Endpoints**: 10
- **TOTAL API Changes**: 24

## Response Format
All endpoints return:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Display Name",
      "status": "ACTIVE"
    }
  ]
}
```

## Implementation Order
1. Master Data (12 endpoints) - Day 1-2
2. CRM, Sales, Service (3 endpoints) - Day 2-3
3. Parts, Admin, Accounting, Insurance (9 endpoints) - Day 3-4
4. Testing all endpoints - Day 4-5

## Files to Create/Modify
```
/app/api/suppliers/route.ts (NEW)
/app/api/warehouses/route.ts (NEW)
/app/api/uoms/route.ts (NEW)
/app/api/departments/route.ts (NEW)
/app/api/positions/route.ts (NEW)
/app/api/part-categories/route.ts (NEW)
/app/api/accessory-categories/route.ts (NEW)
/app/api/service-categories/route.ts (NEW)
/app/api/vehicle-models/route.ts (MODIFY)
/app/api/accessories/route.ts (MODIFY)
/app/api/service-catalog/route.ts (MODIFY)
/app/api/service-bays/route.ts (MODIFY)
/app/api/quotations/route.ts (NEW)
/app/api/vehicles/route.ts (NEW)
/app/api/parts/route.ts (MODIFY)
/app/api/customers/route.ts (MODIFY)
/app/api/leads/route.ts (MODIFY)
/app/api/users/route.ts (MODIFY)
/app/api/roles/route.ts (MODIFY)
/app/api/permissions/route.ts (MODIFY)
/app/api/invoices/route.ts (NEW)
/app/api/payment-methods/route.ts (NEW)
/app/api/insurance-providers/route.ts (NEW)
/app/api/insurance-packages/route.ts (NEW)
```

## Testing Requirements
- ✅ Unit tests for all 24 endpoints
- ✅ Test `?for_dropdown=true` returns minimal fields
- ✅ Test `?for_dropdown=false` returns full fields
- ✅ Test `?status=ACTIVE` filters correctly
- ✅ Test empty results when no records
