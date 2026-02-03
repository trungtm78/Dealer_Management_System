# Change Request: CR-MD-003

## Document Information
- CR ID: **CR-MD-003**
- Type: **CUSTOMER-INITIATED CR**
- Version: 1.0
- Status: APPROVED
- Created Date: 30/01/2026
- Last Updated: 30/01/2026
- Author: Antigravity - Business Analyst
- Project: Honda SPICE ERP System

## 1. Request Information

### 1.1 Source
- Requested By: Honda SPICE ERP - Product Owner
- Role/Organization: Service Operations Team
- Request Date: 30/01/2026
- Request Channel: System Analysis & Master Data Review

### 1.2 Request Summary
ServiceCatalog Master Data Management - Tạo màn hình quản lý danh mục dịch vụ để chuẩn hóa pricing và labor hours.

## 2. Business Context

### 2.1 Business Driver
- Driver: **Service Standardization & Cost Accuracy**
- Background: ServiceCatalog chuẩn hóa các dịch vụ bảo trì
- Urgency: **CRITICAL** (🔴)

### 2.2 Current State & Problems

**Danh mục dịch vụ (ServiceCatalog)** chuẩn hóa các dịch vụ bảo trì:
- **Standard Services**: Oil Change, Tire Rotation, Brake Inspection
- **Repair Services**: Engine Repair, Transmission Repair
- **Inspection Services**: 10,000km Inspection, 20,000km Inspection

**Vấn đề hiện tại**:
- Service Advisor nhập tay tên dịch vụ → Không chuẩn
- Labor hours và labor rate hardcoded → Khó điều chỉnh
- Không thể tính toán tự động chi phí dịch vụ

### 2.3 Business Impact

**Tác động nghiệp vụ**:
- ❌ **Pricing Inconsistency**: Mỗi advisor quote giá khác nhau
- ❌ **No Cost Control**: Không kiểm soát labor cost
- ❌ **Manual Calculation**: Advisor phải tính tay → Slow & error-prone

### 2.4 Desired State
- Có màn hình quản lý ServiceCatalog với CRUD đầy đủ
- Labor hours và labor rate chuẩn hóa
- Auto-calculate service cost
- Service package builder

### 2.5 Business Value

**Expected Benefits:**
- Pricing consistency: 100% standardized service pricing
- Time saved: 40% faster service quote creation
- Cost accuracy: Auto-calculated labor + parts cost
- Package selling: Increase service revenue 15%

**Target Users:**
- Admin: Quản lý service catalog
- Service Advisors: Select services khi tạo Service Quote

**Success Metrics:**
- 100% pricing consistency
- 15% increase in service package sales
- 40% faster quote creation

### 2.6 ROI Estimate
- Investment: 3 ngày development
- Expected Return: 15% increase in service revenue
- Payback Period: ~1.5 months

## 3. Technical Feasibility

### 3.1 Feasibility Assessment
- Feasibility Level: **HIGH**
- Reasoning: 
  * Table đã tồn tại trong DB
  * GET/POST APIs đã có
  * Chỉ cần: PATCH/DELETE APIs + UI + Package builder

### 3.2 Complexity Assessment
- Complexity: **MODERATE**
- Reasoning:
  * Database: ✅ Đã có (ServiceCatalog table)
  * API: ⚠️ Cần thêm PATCH, DELETE
  * UI: ❌ Chưa có
  * Extra: Service Package builder (new feature)

### 3.3 Risk Assessment
- Risk Level: **LOW**
- Key Risks:
  * Package builder UX → **Mitigation**: Multi-select with preview
  * Parts integration → **Mitigation**: Link to Parts table

### 3.4 Dependencies
- **Blocking**: Không
- **Blocked by this**: CR-INT-001 (Dropdown Integration cần ServiceCatalog)

## 4. Functional Requirements

### FR-MD-003-01: CRUD ServiceCatalog

**Create**: Form với fields:
- `service_code` (auto: SVC-001)
  * Format: SVC-XXX
  * Auto-increment
  * Unique constraint
  
- `service_name` (required)
  * Validation: Required, max 200 chars
  * Unique constraint
  * Example: "Oil Change", "10K Inspection"
  
- `category` (dropdown: MAINTENANCE, REPAIR, INSPECTION, BODYWORK)
  * Required
  * Enum validation
  * Default: MAINTENANCE
  
- `labor_hours` (decimal, required)
  * Validation: > 0, max 100
  * Format: Decimal (0.5, 1.0, 2.5)
  * Example: 1.5 hours
  
- `labor_rate` (VND/hour, required)
  * Validation: > 0
  * Format: Currency
  * Example: 200,000₫/hour
  
- `parts_required` (multi-select từ Parts)
  * Optional
  * Multi-select dropdown
  * Example: ["Oil Filter", "Engine Oil 5W-30"]
  
- `recommended_interval_km` (number, optional)
  * Range: 0-100,000
  * Example: 10,000 km
  * Use for: Maintenance reminders
  
- `status` (ACTIVE/INACTIVE)
  * Default: ACTIVE

**Read**: Table với pagination
- Columns: Code, Name, Category, Labor Hours, Labor Rate, Total Cost, Status
- Sort by: category, created_at

**Update**: Edit dialog
- Allow update: All fields except service_code
- Auto-recalculate: total_cost when labor_hours or labor_rate changes

**Delete**: Soft delete
- Set status = INACTIVE

### FR-MD-003-02: Service Package Builder

**Admin có thể tạo "Service Package"** (combo nhiều services):
- Example: "10K Inspection Package" = Oil Change + Tire Rotation + Brake Check
- Discount cho package

**Package fields**:
- `package_code` (auto: PKG-001)
- `package_name` (required)
- `services` (multi-select từ ServiceCatalog)
- `discount_percentage` (0-50%)
- `total_price` (auto-calculated)

**Calculation**:
```
base_price = sum(service.labor_hours * service.labor_rate + service.parts_cost)
discount_amount = base_price * (discount_percentage / 100)
total_price = base_price - discount_amount
```

**UI**:
- Multi-select services
- Preview: Show selected services + individual prices
- Discount slider: 0-50%
- Total price: Auto-calculated + displayed

### FR-MD-003-03: Pricing Calculator

**Auto-calculate**: `total_cost = (labor_hours * labor_rate) + sum(parts.price)`

**Display trong form**:
```
Labor Cost:  1.5 hours × 200,000₫/hour = 300,000₫
Parts Cost:  Oil Filter (50,000₫) + Engine Oil (150,000₫) = 200,000₫
─────────────────────────────────────────────────────────
Total Cost:  500,000₫
```

**Real-time update**:
- When labor_hours changes → Recalculate
- When labor_rate changes → Recalculate
- When parts selected/deselected → Recalculate

## 5. UI Reference

### 5.1 Refs Status
**Refs**: `PartsPricing.tsx` (layout tương tự)

### 5.2 Wireframe - Main Page

```
┌─────────────────────────────────────────────────────────┐
│ Master Data / Service Catalog                   [+ New] │
├─────────────────────────────────────────────────────────┤
│ [Search...]  [Category ▼]  [+ Create Package]          │
├──────┬──────────────┬──────────┬──────┬────────┬────────┤
│ Code │ Name         │ Category │ Hours│ Rate   │ Cost   │
├──────┼──────────────┼──────────┼──────┼────────┼────────┤
│ SVC- │ Oil Change   │ MAINT.   │ 1.5h │200K/h  │ 300K₫  │
│ 001  │              │          │      │        │        │
├──────┼──────────────┼──────────┼──────┼────────┼────────┤
│ SVC- │ Brake Insp.  │ INSP.    │ 0.5h │200K/h  │ 100K₫  │
│ 002  │              │          │      │        │        │
└──────┴──────────────┴──────────┴──────┴────────┴────────┘
```

### 5.3 Wireframe - Package Builder

```
┌───────────────────────────────────────────────┐
│ Create Service Package              [X Close]│
├───────────────────────────────────────────────┤
│ Package Name*: [10K Inspection Package    ]  │
│                                               │
│ Select Services:                              │
│ ☑ Oil Change (300,000₫)                       │
│ ☑ Tire Rotation (100,000₫)                    │
│ ☑ Brake Inspection (100,000₫)                 │
│ ☐ Engine Diagnostic (500,000₫)                │
│                                               │
│ Discount: [10%        ] ◄─────────────► 50%   │
│                                               │
│ ┌─────────────────────────────────────────┐   │
│ │ Base Price:      500,000₫               │   │
│ │ Discount (10%):  -50,000₫               │   │
│ │ ─────────────────────────────────────   │   │
│ │ Total Price:     450,000₫               │   │
│ └─────────────────────────────────────────┘   │
│                                               │
│              [Cancel]  [Create Package]       │
└───────────────────────────────────────────────┘
```

## 6. Acceptance Criteria

- [ ] CRUD ServiceCatalog đầy đủ
- [ ] Admin có thể tạo service với 8 fields
- [ ] System auto-generates service_code theo format SVC-XXX
- [ ] Parts required: Multi-select từ Parts table
- [ ] Pricing calculator: Auto-calculate total_cost
- [ ] Service Package Builder hoạt động
- [ ] Package builder: Multi-select services
- [ ] Package builder: Discount slider 0-50%
- [ ] Package builder: Auto-calculate total price
- [ ] Search & filter: By name, category
- [ ] API: PATCH, DELETE endpoints
- [ ] Audit logging

## 7. Technical Notes

### 7.1 Current Status
**Database**: ✅ Table `ServiceCatalog` đã có  
**API**: ⚠️ Thiếu PATCH, DELETE  
**UI**: ❌ Chưa có

### 7.2 Database Schema

**New table needed**: `service_packages`
```sql
CREATE TABLE service_packages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  package_code VARCHAR(20) UNIQUE NOT NULL,
  package_name VARCHAR(200) UNIQUE NOT NULL,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  total_price DECIMAL(15,2),
  status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**New table needed**: `service_package_items`
```sql
CREATE TABLE service_package_items (
  package_id BIGINT NOT NULL,
  service_id BIGINT NOT NULL,
  PRIMARY KEY (package_id, service_id),
  FOREIGN KEY (package_id) REFERENCES service_packages(id),
  FOREIGN KEY (service_id) REFERENCES ServiceCatalog(id)
);
```

### 7.3 Implementation Checklist

**Backend**:
1. [ ] Create tables: service_packages, service_package_items
2. [ ] PATCH /api/services-catalog/[id]
3. [ ] DELETE /api/services-catalog/[id]
4. [ ] POST /api/service-packages
5. [ ] GET /api/service-packages
6. [ ] PATCH /api/service-packages/[id]

**Frontend**:
1. [ ] Page: app/(main)/master/services/page.tsx
2. [ ] Component: ServiceCatalogManagement.tsx
3. [ ] Form: ServiceCatalogForm.tsx
4. [ ] Dialog: ServicePackageBuilder.tsx
5. [ ] Component: PricingCalculator.tsx

## 8. Implementation Effort

### 8.1 Effort Breakdown
- **Database**: 0.5 day (2 new tables)
- **API**: 1 day (PATCH, DELETE, package endpoints)
- **Frontend Page**: 1 day
- **Package Builder**: 0.5 day
- **Total**: **3 days**

### 8.2 Dependencies
- **Blocks**: CR-INT-001
- **Blocked by**: None

## 9. Evaluation & Approval

### 9.1 Evaluation Score

| Criterion | Score | Max |
|-----------|-------|-----|
| Business Value | 9 | 10 |
| Technical Feasibility | 9 | 10 |
| Resource Availability | 9 | 10 |
| Risk Assessment | 9 | 10 |
| Strategic Alignment | 9 | 10 |
| **TOTAL** | **45** | **50** |

### 9.2 Decision
**Decision**: APPROVED  
**Priority**: P0 (CRITICAL - 🔴)

### 9.3 Timeline
- **Planned Start**: 2026-02-11
- **Target Completion**: 2026-02-13 (3 days)
- **Phase**: Phase 1 - Critical Masters

## 10. Approval Record

- [x] Product Owner: Honda SPICE ERP Team - 30/01/2026
- [x] Tech Lead: Development Team Lead - 30/01/2026
- [x] Antigravity: Business Analyst - 30/01/2026

## 11. Change Log

### v1.0 (30/01/2026)
- Initial CR document created
- Status: APPROVED
- Priority: P0 (CRITICAL)
- Effort: 3 days
