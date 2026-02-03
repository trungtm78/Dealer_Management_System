# Change Request: CR-MD-001

## Document Information
- CR ID: **CR-MD-001**
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
- Role/Organization: Business Operations Team
- Request Date: 30/01/2026
- Request Channel: System Analysis & Master Data Review

### 1.2 Request Summary
VehicleModel Master Data Management - Tạo màn hình quản lý danh mục xe để chuẩn hóa dữ liệu và loại bỏ việc nhập tay không nhất quán.

## 2. Business Context

### 2.1 Business Driver
- Driver: **Data Consistency & Process Efficiency**
- Background: VehicleModel là master data quan trọng nhất trong nghiệp vụ bán xe
- Urgency: **CRITICAL** (🔴)

### 2.2 Current State & Problems

Trong nghiệp vụ bán xe, **danh mục xe (VehicleModel)** là master data quan trọng nhất. Hiện tại hệ thống không có màn hình quản lý, dẫn đến:

1. **Inconsistent Data**: Sales nhập tay `model_interest` trong Lead → Sai chính tả, không chuẩn
   - Ví dụ: "Honda City", "HONDA CITY", "City", "city", "City 2024" → Không thể báo cáo

2. **Manual Pricing**: Base price hardcoded trong code → Khó cập nhật khi có thay đổi giá

3. **No Product Control**: Không kiểm soát được danh sách xe đang bán, xe ngừng bán

### 2.3 Business Impact

**Tác động nghiệp vụ**:
- ❌ **Sales Dashboard**: Không thể group by model chính xác
- ❌ **Quotation**: Không tự động fill base_price từ master
- ❌ **Inventory**: Không track được VIN theo model chuẩn

### 2.4 Desired State
- Có màn hình quản lý VehicleModel với CRUD đầy đủ
- Sales chọn từ dropdown thay vì nhập tay
- Base price tự động từ master data
- Data consistent 100%

### 2.5 Business Value

**Expected Benefits:**
- Data consistency: 100% (loại bỏ typos)
- Time saved: 50% faster data entry cho Sales
- Error reduction: 90% fewer data entry errors
- Reporting accuracy: 100% accurate sales by model reports

**Target Users:**
- Admin: Quản lý master data
- Sales Team: Sử dụng dropdown khi tạo Lead/Quotation

**Success Metrics:**
- 100% data consistency (no typos)
- 90% user adoption (không nhập tay)
- Sales Dashboard có thể group by model chính xác

### 2.6 ROI Estimate
- Investment: 5 ngày development
- Expected Return: 10 hours/week saved across Sales team (5 users)
- Payback Period: ~2 months

## 3. Technical Feasibility

### 3.1 Feasibility Assessment
- Feasibility Level: **HIGH**
- Reasoning: 
  * Table đã tồn tại trong DB
  * GET/POST APIs đã có
  * Chỉ cần: PATCH/DELETE APIs + UI

### 3.2 Complexity Assessment
- Complexity: **MODERATE**
- Reasoning:
  * Database: ✅ Đã có (VehicleModel table)
  * API: ⚠️ Cần thêm PATCH, DELETE
  * UI: ❌ Chưa có (cần tạo mới)
  * Pattern: Tái sử dụng từ components có sẵn

### 3.3 Risk Assessment
- Risk Level: **LOW**
- Key Risks:
  * Migration existing data → **Mitigation**: CR-INT-002 handles migration
  * User adoption → **Mitigation**: Training + dropdown UX tốt

### 3.4 Dependencies
- **Blocking**: Không
- **Blocked by this**: CR-INT-001 (Dropdown Integration cần VehicleModel)

## 4. Functional Requirements

### FR-MD-001-01: CRUD VehicleModel

**Create**: Form tạo model mới với fields:
- `model_code` (auto-generated: MOD/2026/001)
  * Format: MOD/YYYY/XXX
  * Auto-increment per year
  * Unique constraint
  
- `model_name` (required, text, max 100 chars)
  * Validation: Required, không để trống
  * Unique constraint
  * Example: "Honda City RS", "CR-V L"
  
- `category` (dropdown: SEDAN, SUV, HATCHBACK, MPV)
  * Required
  * Enum validation
  * Default: SEDAN
  
- `base_price` (required, currency VND)
  * Validation: > 0
  * Format: Currency với separator
  * Example: 559,000,000₫
  
- `status` (default: ACTIVE)
  * Enum: ACTIVE, INACTIVE
  * Default: ACTIVE
  * Soft delete sử dụng status

**Read**: Table với pagination (20 items/page)
- Columns: Model Code, Name, Category, Base Price, Status, Actions
- Sort by: created_at DESC (mới nhất trên cùng)
- Display format:
  * Code: MOD/XXX
  * Name: Text
  * Category: Badge với color
  * Price: Currency format với ₫
  * Status: Badge (green=ACTIVE, gray=INACTIVE)
  * Actions: Edit icon (✎), Delete icon (🗑)

**Update**: Inline edit hoặc dialog
- Allow update: model_name, category, base_price, status
- NOT allow update: model_code (immutable)
- Validation: Same as Create
- Audit: Log to activity_logs

**Delete**: Soft delete (status = INACTIVE)
- Action: Set status = INACTIVE, set deleted_at = NOW()
- NOT hard delete (preserve data for history)
- Confirmation: "Are you sure? This will deactivate the model."
- Audit: Log to activity_logs

### FR-MD-001-02: Search & Filter

**Search box**: Tìm theo `model_name` hoặc `model_code`
- Input: Text input với placeholder "Search by name or code..."
- Behavior: Search as you type (debounce 300ms)
- Match: Partial match, case-insensitive
- Example: "city" matches "Honda City RS", "City Sport"

**Filter**:
- **Category** (dropdown multi-select)
  * Options: All, SEDAN, SUV, HATCHBACK, MPV
  * Can select multiple
  * Default: All selected
  
- **Status** (dropdown)
  * Options: All, ACTIVE, INACTIVE
  * Single select
  * Default: ACTIVE only
  
- **Price range** (slider)
  * Min: 0₫
  * Max: 3,000,000,000₫
  * Step: 10,000,000₫
  * Display: "500M - 1.5B"

**Combined filters**: AND logic
Example: Category=SEDAN AND Status=ACTIVE AND Price 500M-1B

### FR-MD-001-03: Bulk Operations

**Import Excel**: Upload file .xlsx với template
- Button: "Import Excel"
- File format: .xlsx only
- Template columns:
  * Model Code (optional - auto-generate if empty)
  * Model Name (required)
  * Category (required - must be valid enum)
  * Base Price (required - must be number > 0)
  
- Validation:
  * Duplicate model_code → Error: "Code already exists"
  * Duplicate model_name → Error: "Name already exists"
  * Invalid category → Error: "Category must be SEDAN/SUV/HATCHBACK/MPV"
  * Price ≤ 0 → Error: "Price must be greater than 0"
  
- Process:
  1. Upload file
  2. Validate all rows
  3. Show preview with errors highlighted
  4. User confirms
  5. Import valid rows
  6. Show summary: X imported, Y errors
  
- Download template: Button "Download Template" (empty .xlsx)

**Export Excel**: Download danh sách hiện tại
- Button: "Export Excel"
- File name: vehicle_models_YYYYMMDD.xlsx
- Include: All visible rows (after filter applied)
- Columns: Same as table + created_at, updated_at

### FR-MD-001-04: Audit Trail

**Log mọi thay đổi** (Create, Update, Delete) vào `activity_logs`

**Fields logged**:
- `user_id`: User thực hiện action
- `action`: CREATE | UPDATE | DELETE
- `entity`: "VehicleModel"
- `entity_id`: ID của VehicleModel
- `details`: JSON với old_value, new_value
- `ip_address`: IP của user
- `created_at`: Timestamp

**Example log entry**:
```json
{
  "user_id": 123,
  "action": "UPDATE",
  "entity": "VehicleModel",
  "entity_id": 45,
  "details": {
    "old_value": {"base_price": 550000000},
    "new_value": {"base_price": 559000000}
  },
  "ip_address": "192.168.1.100",
  "created_at": "2026-01-30T10:30:00Z"
}
```

## 5. UI Reference

### 5.1 Refs Status
**Không có trong Refs** - Cần tạo mới dựa trên pattern:

**Pattern tham khảo**:
- Layout: Tương tự `PartsStockTake.tsx` (table + search + filters)
- Form dialog: Tương tự `QuotationForm.tsx` (multi-step nếu cần)
- Bulk import: Tương tự `PickingPacking.tsx` (file upload)

### 5.2 Wireframe - Main Page

```
┌─────────────────────────────────────────────────────────┐
│ Master Data / Vehicle Models                    [+ New] │
├─────────────────────────────────────────────────────────┤
│ [Search: Model name or code...]  [Category ▼] [Status ▼]│
│ [Import Excel] [Export Excel]                           │
├──────┬──────────┬──────────┬──────────────┬────────┬────┤
│ Code │ Name     │ Category │ Base Price   │ Status │ Act│
├──────┼──────────┼──────────┼──────────────┼────────┼────┤
│ MOD/ │ City RS  │ SEDAN    │ 559,000,000₫ │ ACTIVE │ ✎ 🗑│
│ 001  │          │          │              │        │    │
├──────┼──────────┼──────────┼──────────────┼────────┼────┤
│ MOD/ │ CR-V L   │ SUV      │ 1,029,000,000│ ACTIVE │ ✎ 🗑│
│ 002  │          │          │              │        │    │
├──────┼──────────┼──────────┼──────────────┼────────┼────┤
│ MOD/ │ Civic RS │ SEDAN    │ 799,000,000₫ │ ACTIVE │ ✎ 🗑│
│ 003  │          │          │              │        │    │
└──────┴──────────┴──────────┴──────────────┴────────┴────┘
[Pagination: < 1 2 3 ... 10 >]  [20 items per page ▼]
```

### 5.3 Wireframe - Create/Edit Dialog

```
┌───────────────────────────────────────────────┐
│ Create Vehicle Model                 [X Close]│
├───────────────────────────────────────────────┤
│                                               │
│ Model Code*: [MOD/2026/004        ] (auto)   │
│                                               │
│ Model Name*: [                            ]   │
│              Honda City RS                    │
│                                               │
│ Category*:   [SEDAN              ▼]          │
│                                               │
│ Base Price*: [                            ]₫  │
│              559,000,000                      │
│                                               │
│ Status:      ○ Active   ○ Inactive            │
│                                               │
│                                               │
│              [Cancel]  [Save]                 │
└───────────────────────────────────────────────┘
```

## 6. Acceptance Criteria

- [ ] Admin có thể tạo VehicleModel với đầy đủ 5 fields (code, name, category, price, status)
- [ ] System auto-generates model_code theo format MOD/YYYY/XXX
- [ ] System validates model_name: required, max 100 chars, unique
- [ ] System validates category: must be SEDAN/SUV/HATCHBACK/MPV
- [ ] System validates base_price: required, must be > 0
- [ ] Admin có thể sửa VehicleModel (name, category, price, status)
- [ ] Admin KHÔNG thể sửa model_code (immutable)
- [ ] Admin có thể soft delete VehicleModel (status → INACTIVE)
- [ ] Search box tìm theo name OR code (partial match, case-insensitive)
- [ ] Filter Category: multi-select, AND logic với other filters
- [ ] Filter Status: single select (All/ACTIVE/INACTIVE)
- [ ] Filter Price range: slider với min/max
- [ ] Import Excel: Validate duplicate code/name → hiển thị errors
- [ ] Import Excel: Validate invalid category/price → hiển thị errors
- [ ] Import Excel: Show preview before import
- [ ] Import Excel: Show summary after import (X imported, Y errors)
- [ ] Export Excel: Download current filtered list
- [ ] Audit log ghi nhận mọi CREATE/UPDATE/DELETE action
- [ ] Audit log includes: user_id, action, entity, entity_id, details (JSON), ip_address, timestamp
- [ ] Table pagination: 20 items/page
- [ ] Table sort by created_at DESC (newest first)
- [ ] API endpoints:
  - `GET /api/vehicle-models` ✅ (đã có)
  - `POST /api/vehicle-models` ✅ (đã có)
  - `PATCH /api/vehicle-models/[id]` ❌ (cần tạo)
  - `DELETE /api/vehicle-models/[id]` ❌ (cần tạo - soft delete)

## 7. Technical Notes

### 7.1 Current Status
**Database**: ✅ Table `VehicleModel` đã có  
**API**: ⚠️ Thiếu PATCH, DELETE endpoints  
**UI**: ❌ Chưa có

### 7.2 Database Schema
```sql
-- Table already exists
Table: VehicleModel
Columns:
- id (BIGINT, PK, AUTO_INCREMENT)
- model_code (VARCHAR(20), UNIQUE, NOT NULL)
- model_name (VARCHAR(100), UNIQUE, NOT NULL)
- category (ENUM('SEDAN','SUV','HATCHBACK','MPV'), NOT NULL)
- base_price (DECIMAL(15,2), NOT NULL)
- status (ENUM('ACTIVE','INACTIVE'), DEFAULT 'ACTIVE')
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE)
- deleted_at (TIMESTAMP, NULL)

Indexes:
- PRIMARY KEY (id)
- UNIQUE KEY idx_model_code (model_code)
- UNIQUE KEY idx_model_name (model_name)
- INDEX idx_status (status)
- INDEX idx_category (category)
```

### 7.3 API Changes Required

**Create missing endpoints**:

1. **PATCH /api/vehicle-models/[id]**
   - Request body: {model_name?, category?, base_price?, status?}
   - Validation: Same as POST
   - NOT allow: model_code update (immutable)
   - Response: Updated VehicleModel object
   - Status: 200 OK | 400 Bad Request | 404 Not Found

2. **DELETE /api/vehicle-models/[id]** (Soft delete)
   - Action: SET status = 'INACTIVE', deleted_at = NOW()
   - NOT hard delete
   - Response: Success message
   - Status: 200 OK | 404 Not Found

### 7.4 Implementation Checklist

**Backend (API)**:
1. [ ] Create endpoint: PATCH /api/vehicle-models/[id]
   - Controller: VehicleModelController.update()
   - Service: VehicleModelService.update()
   - DTO: UpdateVehicleModelDto
   - Validation: name unique, category enum, price > 0

2. [ ] Create endpoint: DELETE /api/vehicle-models/[id]
   - Controller: VehicleModelController.delete()
   - Service: VehicleModelService.softDelete()
   - Action: Update status + deleted_at

3. [ ] Add audit logging to all CRUD operations
   - Middleware: AuditLogMiddleware
   - Log to: activity_logs table

**Frontend (UI)**:
1. [ ] Create page: `app/(main)/master/vehicle-models/page.tsx`
   - Route: /master/vehicle-models
   - Layout: Table + Search + Filters + Actions

2. [ ] Create component: `components/master/VehicleModelManagement.tsx`
   - Table with pagination
   - Search box
   - Filter dropdowns
   - Import/Export buttons

3. [ ] Create form dialog: `components/master/VehicleModelForm.tsx`
   - Create mode (empty form)
   - Edit mode (pre-filled form)
   - Validation
   - Submit handler

4. [ ] Create import dialog: `components/master/VehicleModelImport.tsx`
   - File upload
   - Validation + Preview
   - Import execution
   - Summary display

5. [ ] Add to sidebar navigation
   - Menu: Master Data → Vehicle Models
   - Icon: Car icon
   - Route: /master/vehicle-models

**Testing**:
1. [ ] Unit tests:
   - VehicleModelService.create/update/delete
   - VehicleModelForm validation
   - Import validation logic

2. [ ] Integration tests:
   - POST /api/vehicle-models
   - PATCH /api/vehicle-models/[id]
   - DELETE /api/vehicle-models/[id]
   - GET with filters

3. [ ] E2E tests:
   - Create vehicle model flow
   - Edit vehicle model flow
   - Delete vehicle model flow
   - Import Excel flow
   - Export Excel flow

## 8. Implementation Effort

### 8.1 Effort Breakdown
- **Database**: 0 days (already exists)
- **API**: 1 day (PATCH, DELETE endpoints + audit)
- **Backend Services**: 0.5 day (update, delete logic)
- **Frontend Page**: 1.5 days (table + search + filters)
- **Frontend Form**: 1 day (create/edit dialog)
- **Frontend Import**: 1 day (upload + validation + preview)
- **Testing**: 1 day (UT + IT + E2E)
- **Total**: **5 days**

### 8.2 Dependencies
- **Blocks**: CR-INT-001 (Dropdown Integration needs VehicleModel API)
- **Blocked by**: None

## 9. Evaluation & Approval

### 9.1 Evaluation Score

| Criterion | Score | Max | Reasoning |
|-----------|-------|-----|-----------|
| Business Value | 10 | 10 | Critical master data, high impact |
| Technical Feasibility | 9 | 10 | Table exists, straightforward implementation |
| Resource Availability | 9 | 10 | Team available, 5 days feasible |
| Risk Assessment | 9 | 10 | Low risk, well-defined requirements |
| Strategic Alignment | 10 | 10 | Aligns with data consistency goals |
| **TOTAL** | **47** | **50** | **94%** |

### 9.2 Decision
**Decision**: APPROVED  
**Priority**: P0 (CRITICAL - 🔴)  
**Reasoning**: 
- Critical master data affecting multiple modules
- Clear requirements and feasible implementation
- Blocks other CRs (INT-001)
- High ROI (data consistency + time savings)

### 9.3 Timeline
- **Planned Start**: 2026-02-03 (Week 1, Phase 1)
- **Target Completion**: 2026-02-07 (5 days)
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
- Effort: 5 days
- Phase: Phase 1 - Critical Masters
- Source: Honda SPICE ERP Master Data Analysis
