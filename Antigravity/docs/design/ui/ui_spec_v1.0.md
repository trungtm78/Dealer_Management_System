# Honda DMS - UI Mapping Specification v1.0

**Version**: 1.0  
**Date**: 2026-01-28  
**Author**: Antigravity - UI/UX Design Authority  
**Purpose**: Định nghĩa mapping giữa FRD screens và UI components, quy tắc reuse/extend/locked

---

## 📋 Document Overview

Tài liệu này là **nguồn sự thật DUY NHẤT** cho UI implementation. Frontend developers **PHẢI** tuân thủ STRICTLY theo spec này.

**Scope**:
- 56 screens (53 implemented + 3 missing)
- 90+ components
- Component classification (Reuse / Extend / Locked)
- Layout specifications

---

## 🎯 Component Classification

### 🔒 LOCKED Components (TUYỆT ĐỐI KHÔNG SỬA)

**Định nghĩa**: Components đã hoàn chỉnh, stable, được sử dụng bởi nhiều screens. **KHÔNG ĐƯỢC** modify.

| Component | Path | Reason | Screens Using |
|-----------|------|--------|---------------|
| `Card` | `components/ui/card.tsx` | UI Primitive | ALL (90+ screens) |
| `Button` | `components/ui/button.tsx` | UI Primitive | ALL (90+ screens) |
| `Table` | `components/ui/table.tsx` | UI Primitive | 50+ screens |
| `Dialog` | `components/ui/dialog.tsx` | UI Primitive | 40+ screens |
| `Input` | `components/ui/input.tsx` | UI Primitive | 60+ screens |
| `Select` | `components/ui/select.tsx` | UI Primitive | 50+ screens |
| `Badge` | `components/ui/badge.tsx` | UI Primitive | 40+ screens |
| `Sidebar` | `components/Sidebar.tsx` | Layout | ALL screens |
| `CustomerSearch` | `components/common/CustomerSearch.tsx` | Business Logic | 15+ screens |

**Rules**:
- ❌ **KHÔNG** được modify code
- ❌ **KHÔNG** được thêm props mới
- ❌ **KHÔNG** được thay đổi behavior
- ✅ **CHỈ** được sử dụng as-is
- ✅ Nếu cần customize → tạo wrapper component

---

### ♻️ REUSABLE Components (Dùng Nguyên Trạng)

**Định nghĩa**: Components hoàn chỉnh, có thể reuse cho nhiều screens. **KHÔNG NÊN** modify trừ khi có lý do chính đáng.

#### CRM Components

| Component | Path | Purpose | Reuse For |
|-----------|------|---------|-----------|
| `LeadsBoard` | `components/crm/LeadsBoard.tsx` | Kanban board cho leads | Lead management |
| `CustomerList` | `components/crm/CustomerList.tsx` | Customer table | Customer lookup |
| `ScoringDashboard` | `components/crm/ScoringDashboard.tsx` | Lead scoring | Scoring config |
| `LeadSourcePerformance` | `components/crm/LeadSourcePerformance.tsx` | Source analytics | Reports |
| `LoyaltyDashboard` | `components/crm/LoyaltyDashboard.tsx` | Loyalty program | Customer tier |
| `MarketingDashboard` | `components/crm/MarketingDashboard.tsx` | Campaign management | Marketing |
| `ComplaintManagementSystem` | `components/crm/ComplaintManagementSystem.tsx` | Complaint handling | Customer service |

#### Sales Components

| Component | Path | Purpose | Reuse For |
|-----------|------|---------|-----------|
| `QuotationForm` | `components/sales/QuotationForm.tsx` | Multi-step quotation | Quote creation |
| `QuoteList` | `components/sales/QuoteList.tsx` | Quotation table | Quote management |
| `TestDriveCalendar` | `components/sales/TestDriveCalendar.tsx` | Calendar view | Test drive scheduling |
| `VinAllocation` | `components/sales/VinAllocation.tsx` | VIN assignment | VIN management |
| `VinInventory` | `components/sales/VinInventory.tsx` | VIN inventory | Stock management |
| `DepositList` | `components/sales/DepositList.tsx` | Deposit receipts | Payment tracking |

#### Service Components

| Component | Path | Purpose | Reuse For |
|-----------|------|---------|-----------|
| `ServiceQuoteForm` | `components/service/ServiceQuoteForm.tsx` | Service quotation | Quote creation |
| `AppointmentCalendar` | `components/service/AppointmentCalendar.tsx` | Appointment booking | Scheduling |
| `RepairOrderList` | `components/service/RepairOrderList.tsx` | RO management | Service tracking |
| `ServiceHistory` | `components/service/ServiceHistory.tsx` | Service records | Customer history |

#### Parts Components

| Component | Path | Purpose | Reuse For |
|-----------|------|---------|-----------|
| `InventoryList` | `components/parts/InventoryList.tsx` | Parts inventory | Stock management |
| `PurchaseList` | `components/parts/PurchaseList.tsx` | Purchase orders | Procurement |
| `BackorderList` | `components/parts/BackorderList.tsx` | Backorder tracking | Supply chain |
| `PartsKPI` | `components/parts/PartsKPI.tsx` | Parts KPIs | Analytics |

#### Accounting Components

| Component | Path | Purpose | Reuse For |
|-----------|------|---------|-----------|
| `FinancialDashboard` | `components/accounting/FinancialDashboard.tsx` | Financial overview | Reporting |
| `PnLReport` | `components/accounting/PnLReport.tsx` | P&L statement | Financial reports |
| `BalanceSheet` | `components/accounting/BalanceSheet.tsx` | Balance sheet | Financial reports |
| `CashFlow` | `components/accounting/CashFlow.tsx` | Cash flow | Financial reports |
| `Receivables` | `components/accounting/Receivables.tsx` | AR aging | Collections |
| `Payables` | `components/accounting/Payables.tsx` | AP aging | Payments |

**Rules**:
- ✅ **SỬ DỤNG** as-is cho screens tương tự
- ⚠️ **CÂN NHẮC** trước khi modify
- ✅ Nếu cần customize nhỏ → pass props
- ❌ Nếu cần customize lớn → tạo component mới

---

### 🔧 EXTENDABLE Components (Được Phép Extend)

**Định nghĩa**: Components có thể extend/customize cho use cases mới. **ĐƯỢC PHÉP** modify nhưng phải maintain backward compatibility.

#### Dialog Components (Extendable)

| Component | Path | Extension Rules |
|-----------|------|-----------------|
| `CreateLeadDialog` | `components/crm/CreateLeadDialog.tsx` | ✅ Add fields, ❌ Change structure |
| `LeadDialog` | `components/crm/LeadDialog.tsx` | ✅ Add tabs, ❌ Change layout |
| `CreateCampaignDialog` | `components/crm/CreateCampaignDialog.tsx` | ✅ Add campaign types |
| `ScoringConfigDialog` | `components/crm/ScoringConfigDialog.tsx` | ✅ Add scoring categories |
| `SendReminderDialog` | `components/crm/SendReminderDialog.tsx` | ✅ Add reminder types |
| `ScheduleDialog` | `components/crm/ScheduleDialog.tsx` | ✅ Add schedule options |

**Extension Rules**:
1. **Backward Compatibility**: Existing props MUST work
2. **Optional Props**: New features via optional props
3. **Default Behavior**: Default behavior unchanged
4. **Testing**: Add tests for new features

#### Form Components (Extendable)

| Component | Path | Extension Rules |
|-----------|------|-----------------|
| `CustomerForm` | `components/crm/CustomerForm.tsx` | ✅ Add fields (optional), ❌ Remove fields |
| `QuotationForm` | `components/sales/QuotationForm.tsx` | ✅ Add accessories, ❌ Change steps |
| `ServiceQuoteForm` | `components/service/ServiceQuoteForm.tsx` | ✅ Add services, ❌ Change calculation |
| `RepairOrderForm` | `components/service/RepairOrderForm.tsx` | ✅ Add line items, ❌ Change workflow |

**Extension Rules**:
1. **Add Fields**: Via optional props
2. **Validation**: Extend validation schema
3. **Calculation**: Extend calculation logic
4. **Submission**: Maintain submit interface

---

## 📐 Screen-to-Component Mapping

### Module 1: Dashboard (1 screen)

#### SCR-DASH-001: Dashboard Điều Hành
**Route**: `/dashboard`  
**Status**: ✅ IMPLEMENTED

**Components**:
- 🔒 **LOCKED**: `OperationalDashboard.tsx` (150 lines)
  - KPI Cards (Card, Badge)
  - Charts (Recharts)
  - Quick Actions (Button)

**Layout**: Dashboard Layout (Full width, Grid)

**Data Sources**: Aggregated from leads, customers, quotations, test_drives, repair_orders

**Rules**:
- ❌ KHÔNG sửa OperationalDashboard
- ✅ Có thể thêm KPI cards mới (extend)
- ✅ Có thể thêm charts mới (extend)

---

### Module 2: CRM (10 screens)

#### SCR-CRM-001: Quản Lý Leads
**Route**: `/crm/leads`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `LeadsBoard.tsx` (850 lines)
  - Kanban board
  - Drag & drop
  - Lead cards
- 🔧 **EXTENDABLE**: `CreateLeadDialog.tsx`
- 🔧 **EXTENDABLE**: `LeadDialog.tsx`
- 🔧 **EXTENDABLE**: `ScheduleDialog.tsx`

**Layout**: Full width, Kanban columns

**Data**: `leads` table

**Rules**:
- ❌ KHÔNG sửa LeadsBoard core logic
- ✅ Có thể extend dialogs (thêm fields)
- ✅ Có thể customize lead card (via props)

---

#### SCR-CRM-002: Khách Hàng
**Route**: `/crm/customers`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `CustomerList.tsx` (181 lines)
- 🔧 **EXTENDABLE**: `CustomerForm.tsx`
- 🔒 **LOCKED**: `CustomerSearch.tsx` (used by 15+ screens)

**Layout**: Table layout with filters

**Data**: `customers` table

**Rules**:
- ❌ KHÔNG sửa CustomerSearch (locked)
- ✅ Có thể extend CustomerForm (add fields)
- ✅ Có thể customize table columns

---

#### SCR-CRM-003: Chấm Điểm Lead
**Route**: `/crm/scoring`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `ScoringDashboard.tsx` (20KB)
- 🔧 **EXTENDABLE**: `ScoringConfigDialog.tsx`
- ♻️ **REUSABLE**: `ScoringSimulator.tsx`

**Layout**: Dashboard + Config panel

**Data**: `scoring_rules`, `leads`

**Rules**:
- ✅ Có thể thêm scoring categories
- ✅ Có thể customize scoring algorithm
- ❌ KHÔNG thay đổi UI structure

---

#### SCR-CRM-004: Hiệu Quả Nguồn Lead
**Route**: `/crm/sources`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `LeadSourcePerformance.tsx` (24KB)
  - Performance table
  - Bar chart (Recharts)
  - Filters

**Layout**: Report layout

**Data**: `leads` (aggregated)

**Rules**:
- ❌ KHÔNG sửa component (stable)
- ✅ Có thể thêm filters
- ✅ Có thể thêm metrics

---

#### SCR-CRM-005: Lịch Sử & Hoạt Động
**Route**: `/crm/activities`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `LeadActivitiesList.tsx` (12KB)
- ♻️ **REUSABLE**: `LeadActivityTimeline.tsx`

**Layout**: Timeline layout

**Data**: `interactions`

**Rules**:
- ✅ Có thể thêm activity types
- ❌ KHÔNG thay đổi timeline UI

---

#### SCR-CRM-006: Nhắc Bảo Dưỡng
**Route**: `/crm/reminders`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `MaintenanceReminderSystem.tsx` (24KB)
- 🔧 **EXTENDABLE**: `SendReminderDialog.tsx`

**Layout**: List + Calendar view

**Data**: `reminders`, `customers`

**Rules**:
- ✅ Có thể thêm reminder types
- ✅ Có thể customize reminder channels

---

#### SCR-CRM-007: Chương Trình Loyalty
**Route**: `/crm/loyalty`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `LoyaltyDashboard.tsx` (13KB)
  - Tier distribution (Pie chart)
  - Top customers table
  - Points history

**Layout**: Dashboard layout

**Data**: `customers`, `loyalty_transactions`

**Rules**:
- ✅ Có thể thêm loyalty tiers
- ❌ KHÔNG thay đổi points calculation

---

#### SCR-CRM-008: Chăm Sóc Sau Bán
**Route**: `/crm/care`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `PostSalesCustomerCare.tsx` (25KB)
  - Call schedule
  - Survey forms
  - CSAT tracking

**Layout**: Dashboard + Forms

**Data**: `customers`, `interactions`

**Rules**:
- ✅ Có thể thêm survey questions
- ✅ Có thể customize call schedule

---

#### SCR-CRM-009: Quản Lý Khiếu Nại
**Route**: `/crm/complaints`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `ComplaintManagementSystem.tsx` (30KB)
  - Complaint list
  - Status tracking
  - Resolution workflow

**Layout**: Table + Detail panel

**Data**: `complaints`, `customers`

**Rules**:
- ✅ Có thể thêm complaint categories
- ✅ Có thể customize workflow

---

#### SCR-CRM-010: Chiến Dịch Marketing
**Route**: `/crm/marketing`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `MarketingDashboard.tsx` (15KB)
- 🔧 **EXTENDABLE**: `CreateCampaignDialog.tsx`

**Layout**: Dashboard + Campaign list

**Data**: `marketing_campaigns`, `customers`

**Rules**:
- ✅ Có thể thêm campaign types
- ✅ Có thể customize targeting

---

### Module 3: Sales (8 screens)

#### SCR-SAL-001: Tạo Báo Giá
**Route**: `/sales/quotation`  
**Status**: ✅ IMPLEMENTED

**Components**:
- 🔧 **EXTENDABLE**: `QuotationForm.tsx` (521 lines)
  - Multi-step form
  - Price calculation
  - Accessories selection

**Layout**: Multi-step form layout

**Data**: `quotations`, `customers`, `vehicle_models`, `accessories`

**Rules**:
- ✅ Có thể thêm accessories
- ✅ Có thể thêm services
- ❌ KHÔNG thay đổi calculation logic
- ❌ KHÔNG thay đổi form steps

---

#### SCR-SAL-002: Danh Sách Báo Giá
**Route**: `/sales/quotations`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `QuoteList.tsx` (10KB)
  - Table with filters
  - Status badges
  - Actions dropdown

**Layout**: Table layout

**Data**: `quotations`

**Rules**:
- ✅ Có thể thêm filters
- ✅ Có thể thêm columns
- ❌ KHÔNG thay đổi table structure

---

#### SCR-SAL-003: Lịch Lái Thử
**Route**: `/sales/test-drive`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `TestDriveCalendar.tsx` (26KB)
  - Calendar view
  - Booking form
  - Filters (salesperson, model)

**Layout**: Calendar layout

**Data**: `test_drives`, `customers`, `users`

**Rules**:
- ❌ KHÔNG sửa calendar component
- ✅ Có thể thêm filters
- ✅ Có thể customize booking form

---

#### SCR-SAL-004: Chi Tiết Lái Thử
**Route**: `/sales/test-drives`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `TestDriveList.tsx` (9KB)

**Layout**: Table layout

**Data**: `test_drives`

---

#### SCR-SAL-005: Phân Bổ VIN
**Route**: `/sales/vin-allocation`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `VinAllocation.tsx` (8KB)

**Layout**: Table + Allocation panel

**Data**: `vins`, `contracts`

**Rules**:
- ❌ KHÔNG thay đổi allocation logic
- ✅ Có thể thêm filters

---

#### SCR-SAL-006: Tồn Kho VIN
**Route**: `/sales/vin-inventory`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `VinInventory.tsx` (7KB)

**Layout**: Table layout

**Data**: `vins`

---

#### SCR-SAL-007: Quản Lý Đặt Cọc
**Route**: `/sales/deposits`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `DepositList.tsx` (13KB)
  - Deposit table
  - Create deposit dialog
  - Receipt printing

**Layout**: Table + Dialog

**Data**: `deposits`, `customers`, `contracts`

**Rules**:
- ✅ Có thể customize receipt template
- ❌ KHÔNG thay đổi payment logic

---

#### SCR-SAL-008: Giao Hàng PDS
**Route**: `/sales/pds`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `PdsList.tsx` (13KB)

**Layout**: Table + Checklist

**Data**: `pds_checklists`, `contracts`, `vins`

---

### Module 4: Service (8 screens)

#### SCR-SVC-001: Báo Giá Dịch Vụ
**Route**: `/service/quotations`  
**Status**: ✅ IMPLEMENTED

**Components**:
- 🔧 **EXTENDABLE**: `ServiceQuoteForm.tsx`
  - Service selection
  - Parts selection
  - Price calculation

**Layout**: Form layout

**Data**: `service_quotes`, `customers`, `services_catalog`, `parts`

**Rules**:
- ✅ Có thể thêm services
- ✅ Có thể thêm parts
- ❌ KHÔNG thay đổi calculation (labor + parts + VAT)

---

#### SCR-SVC-002: Đặt Lịch Hẹn
**Route**: `/service/appointments`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `AppointmentCalendar.tsx`

**Layout**: Calendar layout

**Data**: `service_appointments`, `customers`

---

#### SCR-SVC-003: Lệnh Sửa Chữa (RO)
**Route**: `/service/repair-orders`  
**Status**: ✅ IMPLEMENTED

**Components**:
- ♻️ **REUSABLE**: `RepairOrderList.tsx`
- 🔧 **EXTENDABLE**: `RepairOrderForm.tsx`

**Layout**: Table + Form

**Data**: `repair_orders`, `ro_line_items`

**Rules**:
- ✅ Có thể thêm line items
- ❌ KHÔNG thay đổi RO workflow

---

#### SCR-SVC-004 to SCR-SVC-008
**Status**: ✅ IMPLEMENTED

**Components**: ServiceSettlement, ServiceHistory, TechnicianManagement, TechnicianSchedule, ServiceReports

**Classification**: ♻️ REUSABLE

---

### Module 5: Parts (10 screens)

**Status**: ✅ ALL IMPLEMENTED (11 components)

**Components**:
- ♻️ REUSABLE: InventoryList, PurchaseList, BackorderList, PartsKPI, etc.
- 🔧 EXTENDABLE: PartsPricing (pricing rules)

**Rules**:
- ❌ KHÔNG sửa inventory calculation
- ✅ Có thể thêm pricing rules
- ✅ Có thể customize reports

---

### Module 6: Insurance (2 screens)

#### ⚠️ SCR-INS-001: Quản Lý Hợp Đồng BH
**Route**: `/insurance/contracts`  
**Status**: ❌ **NOT IMPLEMENTED**

**Required Components** (TO BE CREATED):
- `InsuranceContractList.tsx`
- `InsuranceContractForm.tsx`

**Layout**: Table + Form

**Data**: `insurance_contracts`, `customers`

**Design Guidelines**:
- ♻️ REUSE: Table, Dialog, Form components
- 🔧 EXTEND: CustomerSearch for customer lookup
- 📋 PATTERN: Follow QuoteList.tsx structure

---

#### ⚠️ SCR-INS-002: Quản Lý Bồi Thường
**Route**: `/insurance/claims`  
**Status**: ❌ **NOT IMPLEMENTED**

**Required Components** (TO BE CREATED):
- `InsuranceClaimList.tsx`
- `InsuranceClaimForm.tsx`

**Layout**: Table + Detail panel

**Data**: `insurance_claims`, `insurance_contracts`

**Design Guidelines**:
- ♻️ REUSE: Table, Dialog, Badge (for status)
- 📋 PATTERN: Follow ComplaintManagementSystem.tsx structure

---

### Module 7: Accounting (11 screens)

**Status**: ✅ ALL IMPLEMENTED (12 components)

**Components**:
- ♻️ REUSABLE: FinancialDashboard, PnLReport, BalanceSheet, CashFlow, Receivables, Payables, TaxReport, ManagementReport, FixedAssets, Depreciation, CostAnalysis

**Rules**:
- ❌ KHÔNG sửa financial calculations
- ❌ KHÔNG sửa report formats
- ✅ Có thể thêm filters
- ✅ Có thể export formats

---

### Module 8: Admin (3 screens)

#### ⚠️ SCR-ADM-001: Quản Lý Người Dùng
**Route**: `/admin/users`  
**Status**: ❌ **NOT IMPLEMENTED**

**Required Components** (TO BE CREATED):
- `UserManagement.tsx`
- `UserForm.tsx`

**Layout**: Table + Form

**Data**: `users`, `activity_logs`

**Design Guidelines**:
- ♻️ REUSE: Table, Dialog, Badge
- 📋 PATTERN: Follow CustomerList.tsx structure
- 🔐 SECURITY: Role-based permissions

---

#### ⚠️ SCR-ADM-002: Phân Quyền
**Route**: `/admin/permissions`  
**Status**: ❌ **NOT IMPLEMENTED**

**Required Components** (TO BE CREATED):
- `PermissionMatrix.tsx`

**Layout**: Matrix table

**Data**: `users` (roles)

**Design Guidelines**:
- ♻️ REUSE: Table, Checkbox
- 📋 PATTERN: Matrix layout

---

#### ⚠️ SCR-ADM-003: Audit Logs
**Route**: `/admin/audit`  
**Status**: ❌ **NOT IMPLEMENTED**

**Required Components** (TO BE CREATED):
- `AuditLogViewer.tsx`

**Layout**: Table with filters

**Data**: `activity_logs`

**Design Guidelines**:
- ♻️ REUSE: Table, Badge, DatePicker
- 📋 PATTERN: Follow LeadActivitiesList.tsx structure

---

## 🎨 Layout Specifications

### Layout Types

#### 1. Dashboard Layout
**Used By**: Dashboard, Financial Dashboard, Loyalty Dashboard, Marketing Dashboard

**Structure**:
```tsx
<div className="p-6">
  {/* KPI Cards Row */}
  <div className="grid grid-cols-4 gap-4 mb-6">
    <Card>KPI 1</Card>
    <Card>KPI 2</Card>
    <Card>KPI 3</Card>
    <Card>KPI 4</Card>
  </div>
  
  {/* Charts Row */}
  <div className="grid grid-cols-2 gap-6">
    <Card>Chart 1</Card>
    <Card>Chart 2</Card>
  </div>
</div>
```

**Rules**:
- ✅ Responsive: 4 cols → 2 cols → 1 col
- ✅ Consistent spacing (gap-4, gap-6)
- ❌ KHÔNG thay đổi grid structure

---

#### 2. Table Layout
**Used By**: Most list screens (CustomerList, QuoteList, etc.)

**Structure**:
```tsx
<div className="p-6">
  {/* Header with Actions */}
  <div className="flex justify-between items-center mb-6">
    <h1>Title</h1>
    <Button>Action</Button>
  </div>
  
  {/* Filters */}
  <Card className="p-4 mb-6">
    <div className="flex gap-4">
      <Input placeholder="Search..." />
      <Select>Filters</Select>
    </div>
  </Card>
  
  {/* Table */}
  <Card>
    <Table>...</Table>
  </Card>
</div>
```

**Rules**:
- ✅ Filters always in Card
- ✅ Table always in Card
- ✅ Pagination at bottom

---

#### 3. Form Layout
**Used By**: QuotationForm, ServiceQuoteForm, CustomerForm

**Structure**:
```tsx
<div className="p-6">
  <Card>
    <CardHeader>
      <CardTitle>Form Title</CardTitle>
    </CardHeader>
    <CardContent>
      <form>
        <div className="grid gap-4">
          {/* Form fields */}
        </div>
      </form>
    </CardContent>
    <CardFooter>
      <Button>Submit</Button>
    </CardFooter>
  </Card>
</div>
```

**Rules**:
- ✅ Form always in Card
- ✅ Consistent gap-4 spacing
- ✅ Actions in CardFooter

---

#### 4. Calendar Layout
**Used By**: TestDriveCalendar, AppointmentCalendar

**Structure**:
```tsx
<div className="p-6">
  {/* Filters */}
  <Card className="p-4 mb-6">
    <div className="flex gap-4">
      <DatePicker />
      <Select>Filters</Select>
    </div>
  </Card>
  
  {/* Calendar */}
  <Card>
    <Calendar />
  </Card>
</div>
```

---

#### 5. Kanban Layout
**Used By**: LeadsBoard

**Structure**:
```tsx
<div className="p-6">
  {/* Filters */}
  <Card className="p-4 mb-6">
    <div className="flex gap-4">
      <Input placeholder="Search..." />
      <Select>Filters</Select>
    </div>
  </Card>
  
  {/* Kanban Columns */}
  <div className="flex gap-4 overflow-x-auto">
    <div className="flex-shrink-0 w-80">
      <Card>Column 1</Card>
    </div>
    <div className="flex-shrink-0 w-80">
      <Card>Column 2</Card>
    </div>
    {/* More columns */}
  </div>
</div>
```

**Rules**:
- ✅ Fixed column width (w-80)
- ✅ Horizontal scroll
- ❌ KHÔNG thay đổi drag & drop logic

---

## 📏 Component Rules Summary

### 🔒 LOCKED Components (9)
**TUYỆT ĐỐI KHÔNG SỬA**:
- All UI primitives (Card, Button, Table, Dialog, Input, Select, Badge)
- Sidebar
- CustomerSearch

**Penalty**: Breaking changes → Rollback required

---

### ♻️ REUSABLE Components (60+)
**KHÔNG NÊN SỬA** trừ khi có lý do chính đáng:
- All business components (LeadsBoard, CustomerList, QuotationForm, etc.)

**Rules**:
- Sử dụng as-is
- Customize via props
- Nếu cần thay đổi lớn → tạo component mới

---

### 🔧 EXTENDABLE Components (10+)
**ĐƯỢC PHÉP EXTEND** nhưng maintain backward compatibility:
- Dialog components (CreateLeadDialog, etc.)
- Form components (CustomerForm, QuotationForm, etc.)

**Rules**:
- Backward compatible
- Optional props only
- Add tests for new features

---

## ⚠️ Missing Components (5 screens)

### Priority 1: Admin Module (3 components)
1. `UserManagement.tsx` - User CRUD
2. `PermissionMatrix.tsx` - Role permissions
3. `AuditLogViewer.tsx` - Activity logs

### Priority 2: Insurance Module (2 components)
4. `InsuranceContractList.tsx` - Contract management
5. `InsuranceClaimList.tsx` - Claim management

**Design Guidelines**:
- ♻️ REUSE existing patterns
- 🔒 LOCKED UI primitives
- 📋 Follow similar screens (CustomerList, ComplaintManagement)

---

## ✅ Validation Checklist

### Component Coverage
- [x] All 56 screens mapped to components
- [x] All components classified (Locked/Reusable/Extendable)
- [x] 5 missing components identified
- [x] Design guidelines provided for missing components

### Layout Coverage
- [x] 5 layout types defined
- [x] Layout rules documented
- [x] Responsive behavior specified

### Rules Coverage
- [x] Locked components identified (9)
- [x] Reusable components identified (60+)
- [x] Extendable components identified (10+)
- [x] Extension rules documented

---

## 📚 Reference Documents

1. `SCREEN_INVENTORY.md` - Screen inventory
2. `FRD_Module_*.md` - Functional requirements (8 modules)
3. `components/` - Source code

---

## 📝 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-28 | Antigravity | Initial UI Mapping Spec |

---

**End of UI Mapping Specification v1.0**
