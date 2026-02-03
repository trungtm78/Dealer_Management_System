# Change Request: CR-MD-002

## Document Information
- CR ID: **CR-MD-002**
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
Accessory Master Data Management - Tạo màn hình quản lý phụ kiện xe để chuẩn hóa giá và tăng doanh thu từ upselling.

## 2. Business Context

### 2.1 Business Driver
- Driver: **Revenue Growth & Data Standardization**
- Background: Phụ kiện là sản phẩm bổ sung quan trọng với margin cao
- Urgency: **CRITICAL** (🔴)

### 2.2 Current State & Problems

**Phụ kiện (Accessory)** là sản phẩm bổ sung quan trọng trong nghiệp vụ bán xe:
- Tăng doanh thu: Phụ kiện có margin cao (30-50%)
- Upsell opportunity: Sales suggest phụ kiện khi tạo Quotation
- Customization: Khách hàng cá nhân hóa xe

**Vấn đề hiện tại**:
- Hardcoded list trong `QuotationForm.tsx` → Không thể cập nhật
- Không có giá chính thức → Sales tự ước lượng
- Không track được phụ kiện nào bán chạy

### 2.3 Business Impact

**Tác động nghiệp vụ**:
- ❌ **Revenue Loss**: Không track được accessories revenue
- ❌ **Pricing Inconsistency**: Mỗi sales quote giá khác nhau
- ❌ **No Analytics**: Không biết phụ kiện nào bán chạy

### 2.4 Desired State
- Có màn hình quản lý Accessory với CRUD đầy đủ
- Giá phụ kiện chuẩn hóa
- Compatibility matrix với VehicleModel
- Pricing history tracking

### 2.5 Business Value

**Expected Benefits:**
- Revenue tracking: 100% accurate accessories revenue
- Pricing consistency: Giá chuẩn cho tất cả sales
- Analytics: Biết được top-selling accessories
- Upsell efficiency: Sales suggest đúng accessories cho từng model

**Target Users:**
- Admin: Quản lý master data accessories
- Sales Team: Select accessories khi tạo Quotation

**Success Metrics:**
- 100% pricing consistency
- 20% increase in accessories attachment rate
- Accurate accessories revenue reporting

### 2.6 ROI Estimate
- Investment: 3 ngày development
- Expected Return: 15% increase in accessories revenue
- Payback Period: ~1 month

## 3. Technical Feasibility

### 3.1 Feasibility Assessment
- Feasibility Level: **HIGH**
- Reasoning: 
  * Table đã tồn tại trong DB
  * GET/POST APIs đã có
  * Chỉ cần: PATCH/DELETE APIs + UI + Compatibility matrix

### 3.2 Complexity Assessment
- Complexity: **MODERATE**
- Reasoning:
  * Database: ✅ Đã có (Accessory table)
  * API: ⚠️ Cần thêm PATCH, DELETE
  * UI: ❌ Chưa có (cần tạo mới)
  * Extra: Compatibility matrix (new feature)

### 3.3 Risk Assessment
- Risk Level: **LOW**
- Key Risks:
  * Compatibility matrix UX complexity → **Mitigation**: Use checkbox grid pattern
  * Pricing history storage → **Mitigation**: Separate table accessory_price_history

### 3.4 Dependencies
- **Blocking**: Không
- **Blocked by this**: CR-INT-001 (Dropdown Integration cần Accessory)

## 4. Functional Requirements

### FR-MD-002-01: CRUD Accessory

**Create**: Form với fields:
- `accessory_code` (auto: ACC-001, ACC-002...)
  * Format: ACC-XXX
  * Auto-increment
  * Unique constraint
  
- `accessory_name` (required)
  * Validation: Required, max 200 chars
  * Unique constraint
  * Example: "Floor Mat Premium", "Body Kit Sport"
  
- `category` (dropdown: INTERIOR, EXTERIOR, TECH, SAFETY)
  * Required
  * Enum validation
  * Default: INTERIOR
  
- `price` (required, VND)
  * Validation: > 0
  * Format: Currency với separator
  * Example: 500,000₫
  
- `compatible_models` (multi-select từ VehicleModel)
  * Optional
  * Multi-select dropdown
  * Can select multiple models
  * Example: ["City RS", "Civic RS"]
  
- `installation_required` (boolean)
  * Checkbox
  * Default: false
  * If true: Cần technician install
  
- `warranty_period_months` (number)
  * Optional
  * Range: 0-60 months
  * Default: 12
  
- `status` (ACTIVE/INACTIVE)
  * Enum: ACTIVE, INACTIVE
  * Default: ACTIVE

**Read**: Table với pagination (20 items/page)
- Columns: Code, Name, Category, Price, Compatible Models, Status, Actions
- Sort by: created_at DESC

**Update**: Edit dialog
- Allow update: All fields except accessory_code
- Validation: Same as Create
- Pricing change: Log to accessory_price_history

**Delete**: Soft delete
- Action: Set status = INACTIVE
- Confirmation required

### FR-MD-002-02: Compatibility Matrix

**UI hiển thị bảng**: Accessory x VehicleModel
- Rows: Accessories (all active)
- Columns: VehicleModels (all active)
- Cells: Checkbox (tick = compatible)
- Admin tick vào ô để đánh dấu compatible
- Example: "Body Kit Sport" chỉ compatible với City RS, Civic RS

**Bulk operations**:
- Select all models for an accessory
- Select all accessories for a model
- Clear all selections

**Save**:
- Button: "Save Compatibility Matrix"
- Update: accessory_model_compatibility table
- Validation: At least 1 model per accessory

### FR-MD-002-03: Pricing History

**Track lịch sử thay đổi giá**:
- Table: accessory_price_history
- Columns: Date, Old Price, New Price, Changed By
- Display: Timeline view
- Filter: By accessory, by date range

**Auto-log when**:
- Admin updates price in Edit form
- Import Excel with price changes

**Display format**:
```
2026-01-30 10:30 | Admin User | 450,000₫ → 500,000₫ (+11.1%)
2026-01-15 14:20 | Admin User | 400,000₫ → 450,000₫ (+12.5%)
```

## 5. UI Reference

### 5.1 Refs Status
**Refs**: `PartsPricing.tsx` (layout tương tự)

### 5.2 Wireframe - Main Page

```
┌─────────────────────────────────────────────────────────┐
│ Master Data / Accessories                       [+ New] │
├─────────────────────────────────────────────────────────┤
│ [Search...]  [Category ▼] [Compatible Model ▼]         │
│ [Compatibility Matrix] [Import Excel] [Export Excel]    │
├──────┬──────────────┬──────────┬──────────┬────────┬────┤
│ Code │ Name         │ Category │ Price    │ Status │ Act│
├──────┼──────────────┼──────────┼──────────┼────────┼────┤
│ ACC- │ Floor Mat    │ INTERIOR │ 500,000₫ │ ACTIVE │ ✎ 🗑│
│ 001  │ Premium      │          │          │        │    │
├──────┼──────────────┼──────────┼──────────┼────────┼────┤
│ ACC- │ Body Kit     │ EXTERIOR │2,000,000₫│ ACTIVE │ ✎ 🗑│
│ 002  │ Sport        │          │          │        │    │
└──────┴──────────────┴──────────┴──────────┴────────┴────┘
```

### 5.3 Wireframe - Compatibility Matrix

```
┌─────────────────────────────────────────────────────────┐
│ Compatibility Matrix                           [X Close]│
├─────────────────────────────────────────────────────────┤
│                  │ City RS │ CR-V L │ Civic RS │ Accord │
├──────────────────┼─────────┼────────┼──────────┼────────┤
│ Floor Mat        │    ☑    │   ☑    │    ☑     │   ☑    │
│ Body Kit Sport   │    ☑    │   ☐    │    ☑     │   ☐    │
│ Roof Rack        │    ☐    │   ☑    │    ☐     │   ☐    │
└──────────────────┴─────────┴────────┴──────────┴────────┘
                                    [Cancel]  [Save]
```

## 6. Acceptance Criteria

- [ ] CRUD Accessory hoạt động đầy đủ
- [ ] Admin có thể tạo accessory với 8 fields
- [ ] System auto-generates accessory_code theo format ACC-XXX
- [ ] Compatible models: Multi-select dropdown từ VehicleModel
- [ ] Compatibility matrix: Admin có thể assign accessories to models
- [ ] Compatibility matrix: Checkbox grid với bulk operations
- [ ] Pricing history: Log mọi thay đổi giá
- [ ] Pricing history: Display timeline view
- [ ] Search & filter: By name, category, compatible model
- [ ] Import/Export Excel
- [ ] API: PATCH, DELETE endpoints
- [ ] Audit logging

## 7. Technical Notes

### 7.1 Current Status
**Database**: ✅ Table `Accessory` đã có  
**API**: ⚠️ Thiếu PATCH, DELETE  
**UI**: ❌ Chưa có

### 7.2 Database Schema

**New table needed**: `accessory_model_compatibility`
```sql
CREATE TABLE accessory_model_compatibility (
  accessory_id BIGINT NOT NULL,
  model_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (accessory_id, model_id),
  FOREIGN KEY (accessory_id) REFERENCES Accessory(id),
  FOREIGN KEY (model_id) REFERENCES VehicleModel(id)
);
```

**New table needed**: `accessory_price_history`
```sql
CREATE TABLE accessory_price_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  accessory_id BIGINT NOT NULL,
  old_price DECIMAL(15,2),
  new_price DECIMAL(15,2),
  changed_by BIGINT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (accessory_id) REFERENCES Accessory(id),
  FOREIGN KEY (changed_by) REFERENCES User(id)
);
```

### 7.3 Implementation Checklist

**Backend**:
1. [ ] Create tables: accessory_model_compatibility, accessory_price_history
2. [ ] PATCH /api/accessories/[id]
3. [ ] DELETE /api/accessories/[id]
4. [ ] GET /api/accessories/compatibility-matrix
5. [ ] POST /api/accessories/compatibility-matrix
6. [ ] GET /api/accessories/[id]/price-history

**Frontend**:
1. [ ] Page: app/(main)/master/accessories/page.tsx
2. [ ] Component: AccessoryManagement.tsx
3. [ ] Form: AccessoryForm.tsx
4. [ ] Dialog: CompatibilityMatrixDialog.tsx
5. [ ] Component: PricingHistoryTimeline.tsx

## 8. Implementation Effort

### 8.1 Effort Breakdown
- **Database**: 0.5 day (2 new tables)
- **API**: 1 day (PATCH, DELETE, compatibility endpoints)
- **Frontend Page**: 1 day
- **Compatibility Matrix**: 0.5 day
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
- **Planned Start**: 2026-02-08
- **Target Completion**: 2026-02-10 (3 days)
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
