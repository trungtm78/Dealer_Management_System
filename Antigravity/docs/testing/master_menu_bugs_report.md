# Master Menu Bugs Report

**Ngày**: 02/02/2026  
**Người Kiểm Tra**: Antigravity  
**Trạng Thái**: 🔴 CRITICAL - Nhiều bugs nghiêm trọng

---

## 🎯 Tóm Tắt Executive

### Severity: 🔴 CRITICAL
- **Total Bugs**: 11+
- **Missing API Routes**: 10
- **Architecture Issues**: 1
- **Impact**: Master menu KHÔNG hoạt động

### Phân Loại Bugs
1. **🔴 P0 - BLOCKER**: Missing API routes (10 entities)
2. **🟡 P1 - HIGH**: Architecture issues (1 entity)

---

## 📊 Master Entities Checklist

### Schema Master Entities (11 total)

Từ `prisma/schema.prisma`, các master entities:

| # | Entity | Table | Schema Line | API Route Exists? | Status |
|---|--------|-------|-------------|-------------------|--------|
| 1 | Vehicle Models | `vehicle_models` | 957 | ❌ NO | 🔴 MISSING |
| 2 | Accessories | `accessories` | 779 | ❌ NO | 🔴 MISSING |
| 3 | Service Bays | `service_bays` | 901 | ❌ NO | 🔴 MISSING |
| 4 | Service Catalogs | `service_catalogs` | 915 | ❌ NO | 🔴 MISSING |
| 5 | Departments | `master_departments` | 843 | ❌ NO | 🔴 MISSING |
| 6 | Positions | `master_positions` | 865 | ❌ NO | 🔴 MISSING |
| 7 | Levels | `master_levels` | 854 | ❌ NO | 🔴 MISSING |
| 8 | Warehouses | `warehouses` | 969 | ✅ YES | ✅ OK |
| 9 | Employees | `employees` | 823 | ✅ YES | ✅ OK |
| 10 | Insurance Products | `insurance_products` | 1058 | ⚠️ PARTIAL | 🟡 INCOMPLETE |
| 11 | Warranty Types | `warranty_types` | 1190 | ⚠️ PARTIAL | 🟡 INCOMPLETE |

### API Routes Status (23 folders)

**Existing API Folders** in `app/api/master/`:
```
✅ account-codes/          → route.ts EXISTS
✅ bank-accounts/          → route.ts EXISTS
✅ commission-structures/  → route.ts EXISTS
✅ districts/              → route.ts EXISTS
✅ employees/              → route.ts EXISTS
✅ holidays/               → route.ts EXISTS
✅ insurance-companies/    → route.ts EXISTS
⚠️ insurance-products/     → route.ts MISSING
✅ interest-rates/         → route.ts EXISTS
✅ part-categories/        → route.ts EXISTS
✅ part-locations/         → route.ts EXISTS
✅ payment-methods/        → route.ts EXISTS
✅ promotions/             → route.ts EXISTS
✅ provinces/              → route.ts EXISTS
✅ service-types/          → route.ts EXISTS
✅ suppliers/              → route.ts EXISTS
✅ tax-rates/              → route.ts EXISTS
✅ uoms/                   → route.ts EXISTS
✅ vehicle-colors/         → route.ts EXISTS
✅ vehicle-engines/        → route.ts EXISTS
⚠️ wards/                  → route.ts MISSING
✅ warehouses/             → route.ts EXISTS
⚠️ warranty-types/         → route.ts MISSING
```

**Missing API Folders** (không tồn tại):
```
❌ vehicle-models/         → ENTIRE FOLDER MISSING
❌ accessories/            → ENTIRE FOLDER MISSING
❌ service-bays/           → ENTIRE FOLDER MISSING
❌ service-catalogs/       → ENTIRE FOLDER MISSING
❌ departments/            → ENTIRE FOLDER MISSING
❌ positions/              → ENTIRE FOLDER MISSING
❌ levels/                 → ENTIRE FOLDER MISSING
```

---

## 🐛 Detailed Bugs

### BUG-001: API Routes Missing route.ts
**Severity**: 🟡 P1 - HIGH  
**Type**: Missing Implementation

**Affected Entities** (3):
1. `insurance-products` - Folder exists, route.ts MISSING
2. `wards` - Folder exists, route.ts MISSING
3. `warranty-types` - Folder exists, route.ts MISSING

**Impact**:
- API calls to these endpoints return 404
- Frontend cannot CRUD these entities
- Database tables tồn tại nhưng không access được

**Evidence**:
```bash
# Folders exist
app/api/master/insurance-products/  ✅
app/api/master/wards/              ✅
app/api/master/warranty-types/     ✅

# But route.ts files MISSING
app/api/master/insurance-products/route.ts  ❌
app/api/master/wards/route.ts              ❌
app/api/master/warranty-types/route.ts     ❌
```

**Schema Evidence**:
```prisma
// Line 1058
model insurance_products {
  id              String   @id @default(cuid())
  product_code    String   @unique
  product_name    String
  ...
}

// Line 1008
model wards {
  id         String   @id @default(cuid())
  ward_code  String   @unique
  ward_name  String
  ...
}

// Line 1190
model warranty_types {
  id            String   @id @default(cuid())
  warranty_code String   @unique
  warranty_name String
  ...
}
```

---

### BUG-002: API Routes Completely Missing
**Severity**: 🔴 P0 - BLOCKER  
**Type**: Missing Implementation

**Affected Entities** (7):
1. `vehicle-models` - NO API folder
2. `accessories` - NO API folder
3. `service-bays` - NO API folder
4. `service-catalogs` - NO API folder
5. `departments` (master_departments) - NO API folder
6. `positions` (master_positions) - NO API folder
7. `levels` (master_levels) - NO API folder

**Impact**:
- **CRITICAL**: Core master data không thể manage
- Frontend page tồn tại nhưng không có backend
- Vehicle Models page sẽ crash khi fetch data

**Evidence**:
```bash
# NO folders exist
app/api/master/vehicle-models/      ❌ NOT EXIST
app/api/master/accessories/         ❌ NOT EXIST
app/api/master/service-bays/        ❌ NOT EXIST
app/api/master/service-catalogs/    ❌ NOT EXIST
app/api/master/departments/         ❌ NOT EXIST
app/api/master/positions/           ❌ NOT EXIST
app/api/master/levels/              ❌ NOT EXIST
```

**Schema Evidence**:
```prisma
// Line 957 - vehicle_models
model vehicle_models {
  id         String   @id @default(cuid())
  model_code String   @unique
  model_name String   @unique
  category   String
  base_price Decimal
  ...
}

// Line 779 - accessories
model accessories {
  id            String   @id @default(cuid())
  accessory_code String  @unique
  accessory_name String
  ...
}

// Line 901 - service_bays
model service_bays {
  id       String   @id @default(cuid())
  bay_code String   @unique
  bay_name String
  ...
}

// Line 915 - service_catalogs
model service_catalogs {
  id           String   @id @default(cuid())
  service_code String   @unique
  service_name String
  ...
}

// Line 843 - master_departments
model master_departments {
  id              String   @id @default(cuid())
  department_code String   @unique
  department_name String
  ...
}

// Line 865 - master_positions
model master_positions {
  id            String   @id @default(cuid())
  position_code String   @unique
  position_name String
  ...
}

// Line 854 - master_levels
model master_levels {
  id         String   @id @default(cuid())
  level_code String   @unique
  level_name String
  ...
}
```

---

### BUG-003: Vehicle Models Page Architecture Issue
**Severity**: 🟡 P1 - HIGH  
**Type**: Architecture Violation

**File**: `src/app/(main)/master/vehicle-models/page.tsx`

**Issue**:
- Page sử dụng `useState`, `useEffect` (Client Component)
- File ở `src/app/` nhưng KHÔNG có `"use client"` directive
- Service import nhưng API route KHÔNG TỒN TẠI

**Evidence**:
```typescript
// Line 1 - Missing "use client"
import { useState, useEffect } from 'react';  // ❌ CLIENT HOOKS
import { VehicleModelService, VehicleModel } from '@/services/vehicle-model.service';

export default function VehicleModelsPage() {
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);  // ❌
  const [loading, setLoading] = useState(true);  // ❌
  
  useEffect(() => {  // ❌
    fetchVehicleModels();
  }, [filter]);
  
  // Calls service
  const response = await VehicleModelService.findAll(filter);  // 404 ERROR
}
```

**Impact**:
1. **Missing "use client"**: Page sẽ crash vì Next.js server component không support hooks
2. **Missing API**: `VehicleModelService.findAll()` gọi `/api/master/vehicle-models` → 404
3. **Runtime Error**: Page không load được

**Location**:
- File: `src/app/(main)/master/vehicle-models/page.tsx` (244 lines)
- Service: `@/services/vehicle-model.service.ts` (expected)
- API: `app/api/master/vehicle-models/route.ts` ❌ NOT EXIST

---

### BUG-004: Employee Page Missing
**Severity**: 🟡 P1 - HIGH  
**Type**: Missing UI Page

**Issue**:
- API route EXISTS: `app/api/master/employees/route.ts` ✅
- UI page EXISTS: `src/app/(main)/master/employee/page.tsx` ✅
- BUT: Page chỉ là placeholder (đã fix trước đó)

**Evidence**:
```typescript
// src/app/(main)/master/employee/page.tsx
export default function EmployeePage() {
  return (
    <div className="text-center py-12">
      <h3>Trang Quản Lý Nhân Viên</h3>
      <p>Chức năng đang được phát triển.</p>  // ❌ PLACEHOLDER
    </div>
  );
}
```

**Impact**:
- User click Employee menu → see placeholder only
- Cannot manage employees via UI
- Backend OK, Frontend INCOMPLETE

---

## 📋 Summary Matrix

### API Routes Status

| Entity Category | Total | With route.ts | Missing route.ts | Missing Folder |
|----------------|-------|---------------|------------------|----------------|
| **Master Data** | 11 | 2 | 2 | 7 |
| **Supporting** | 20 | 18 | 1 | 1 |
| **TOTAL** | 31 | 20 | 3 | 8 |

### Coverage Analysis

**API Coverage**: 20/31 = 64.5% ❌  
**Complete Coverage**: 18/31 = 58.1% ❌  
**Target**: 100% ✅

---

## 🔧 Required Fixes (For OpenCode)

### Priority P0 - BLOCKERS (7 entities)

#### 1. Create API: vehicle-models
```bash
File: app/api/master/vehicle-models/route.ts
Schema: vehicle_models (line 957)
CRUD: GET, POST, PUT, DELETE
Unique: model_code, model_name
```

#### 2. Create API: accessories
```bash
File: app/api/master/accessories/route.ts
Schema: accessories (line 779)
CRUD: GET, POST, PUT, DELETE
Unique: accessory_code
```

#### 3. Create API: service-bays
```bash
File: app/api/master/service-bays/route.ts
Schema: service_bays (line 901)
CRUD: GET, POST, PUT, DELETE
Unique: bay_code
```

#### 4. Create API: service-catalogs
```bash
File: app/api/master/service-catalogs/route.ts
Schema: service_catalogs (line 915)
CRUD: GET, POST, PUT, DELETE
Unique: service_code
```

#### 5. Create API: departments
```bash
File: app/api/master/departments/route.ts
Schema: master_departments (line 843)
CRUD: GET, POST, PUT, DELETE
Unique: department_code
```

#### 6. Create API: positions
```bash
File: app/api/master/positions/route.ts
Schema: master_positions (line 865)
CRUD: GET, POST, PUT, DELETE
Unique: position_code
```

#### 7. Create API: levels
```bash
File: app/api/master/levels/route.ts
Schema: master_levels (line 854)
CRUD: GET, POST, PUT, DELETE
Unique: level_code
```

### Priority P1 - HIGH (3 entities)

#### 8. Complete API: insurance-products
```bash
File: app/api/master/insurance-products/route.ts (CREATE)
Folder: EXISTS
Schema: insurance_products (line 1058)
```

#### 9. Complete API: wards
```bash
File: app/api/master/wards/route.ts (CREATE)
Folder: EXISTS
Schema: wards (line 1008)
```

#### 10. Complete API: warranty-types
```bash
File: app/api/master/warranty-types/route.ts (CREATE)
Folder: EXISTS
Schema: warranty_types (line 1190)
```

### Priority P1 - Architecture (1 file)

#### 11. Fix: vehicle-models page
```bash
File: src/app/(main)/master/vehicle-models/page.tsx
Actions:
1. Add "use client" directive (line 1)
2. Implement proper CRUD UI
3. Fix service calls after API created
```

---

## 🎯 Validation Pattern

### API Route Template
Mỗi API route cần:

1. **CRUD Operations**:
   - GET: List với pagination, search, filter
   - POST: Create với validation
   - PUT: Update by ID
   - DELETE: Soft delete

2. **Validations**:
   - Required fields
   - UNIQUE constraints check
   - Proper error handling (P2002)

3. **Error Handling**:
   - 400 for validation errors
   - 404 for not found
   - 500 for server errors

**Reference**: 
- Good example: `app/api/master/warehouses/route.ts`
- Good example: `app/api/master/employees/route.ts`

---

## 📊 Testing Checklist

### After Fixes
- [ ] All 31 master entities có API routes
- [ ] All API routes có route.ts file
- [ ] All UNIQUE constraints validated
- [ ] Vehicle Models page có "use client"
- [ ] Employee page implement full CRUD
- [ ] Test mỗi API: GET, POST, PUT, DELETE
- [ ] Test duplicate validation
- [ ] Test pagination
- [ ] Test search/filter

---

## 🔗 Schema Reference

**File**: `prisma/schema.prisma` (1243 lines)

**Master Models**:
- Lines 779-791: `accessories`
- Lines 823-841: `employees`
- Lines 843-852: `master_departments`
- Lines 854-863: `master_levels`
- Lines 865-874: `master_positions`
- Lines 901-913: `service_bays`
- Lines 915-927: `service_catalogs`
- Lines 957-967: `vehicle_models`
- Lines 969-980: `warehouses`
- Lines 1008-1019: `wards`
- Lines 1058-1071: `insurance_products`
- Lines 1190-1202: `warranty_types`

---

**Report Status**: ✅ COMPLETE  
**For**: OpenCode Implementation  
**Next**: Fix theo priority P0 → P1
