# Functional Requirements Document (FRD)
## Honda Dealer Management System - Module 3: Bán Hàng (Sales)

---

## 📋 Document Control

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Module** | Module 3 - Bán Hàng (Sales) |
| **Số Screens** | 8 |
| **Phiên Bản** | 1.0 |
| **Ngày Tạo** | 28/01/2026 |

---

## 📊 Module Overview

**Mục đích**: Quản lý toàn bộ quy trình bán xe từ Báo Giá → Lái Thử → Đặt Cọc → Hợp Đồng → Giao Xe

**Screens trong Module**:

| # | Screen ID | Screen Name | Route | Component File |
|---|-----------|-------------|-------|----------------|
| 1 | SCR-SAL-001 | Tạo Báo Giá | `/sales/quotation` | `QuotationForm.tsx` |
| 2 | SCR-SAL-002 | Danh Sách Báo Giá | `/sales/quotations` | `QuotationList.tsx` |
| 3 | SCR-SAL-003 | Lịch Lái Thử | `/sales/test-drive` | `TestDriveSchedule.tsx` |
| 4 | SCR-SAL-004 | Quản Lý Đặt Cọc | `/sales/deposits` | `DepositManagement.tsx` |
| 5 | SCR-SAL-005 | Hợp Đồng Mua Bán | `/sales/contracts` | `ContractManagement.tsx` |
| 6 | SCR-SAL-006 | Giao Xe (PDS) | `/sales/delivery` | `VehicleDelivery.tsx` |
| 7 | SCR-SAL-007 | Kho VIN | `/sales/inventory` | `VinInventory.tsx` |
| 8 | SCR-SAL-008 | Báo Cáo Bán Hàng | `/sales/reports` | `SalesReports.tsx` |

---

## 🎯 SCR-SAL-001: Tạo Báo Giá

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-SAL-001 |
| **Screen Name** | Tạo Báo Giá |
| **Route** | `/sales/quotation` |
| **Component** | `components/sales/QuotationForm.tsx` |
| **Access Control** | SALES, MANAGER, ADMIN |

### 2. UI References

**Primary Component**: `QuotationForm.tsx` (521 lines)

**UI Patterns**:

| Pattern | Component | Description |
|---------|-----------|-------------|
| **Multi-Step Form** | `Tabs` component | 3 tabs: Basic Info, Accessories, Analysis |
| **Customer Search** | `CustomerSearch.tsx` | Autocomplete search |
| **Price Calculator** | Custom logic | Real-time price calculation |
| **Color Picker** | Custom buttons | Visual color selection |
| **Currency Input** | `CurrencyInput.tsx` | VNĐ formatting |

**Layout Structure**:
```tsx
<div className="min-h-screen bg-gray-50">
  {/* Header - Sticky */}
  <header className="sticky top-0 bg-white border-b">
    <h1>BÁO GIÁ MỚI</h1>
    <Button>Lưu Báo Giá</Button>
    <Button>In Báo Giá</Button>
  </header>
  
  {/* Tabs */}
  <Tabs value={activeTab}>
    <TabsList>
      <TabsTrigger value="basic">1. Thông tin & Xe</TabsTrigger>
      <TabsTrigger value="accessories">2. Phụ kiện & Dịch vụ</TabsTrigger>
      <TabsTrigger value="analysis">3. Phân tích Giá</TabsTrigger>
    </TabsList>
    
    {/* Tab 1: Basic Info */}
    <TabsContent value="basic">
      <div className="grid grid-cols-2 gap-6">
        <Card> <!-- Customer Info -->
        <Card> <!-- Vehicle Info -->
      </div>
      <Card> <!-- Price Summary -->
    </TabsContent>
    
    {/* Tab 2: Accessories */}
    <TabsContent value="accessories">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card> <!-- Ngoại thất -->
          <Card> <!-- Nội thất -->
          <Card> <!-- Công nghệ -->
        </div>
        <Card> <!-- Summary Sidebar -->
      </div>
    </TabsContent>
    
    {/* Tab 3: Analysis */}
    <TabsContent value="analysis">
      <Card> <!-- Config: Discount, Commission -->
      <div className="grid lg:grid-cols-2 gap-6">
        <Card> <!-- Revenue Breakdown -->
        <Card> <!-- Profit Analysis -->
      </div>
    </TabsContent>
  </Tabs>
</div>
```

### 3. Functional Specifications

#### 3.1 Tab 1: Thông Tin & Xe

**Customer Info Section**:
- Customer Search (autocomplete từ CRM)
- Auto-fill: Name, Phone khi select customer
- Fields: Name*, Phone*, Email, Source

**Vehicle Info Section**:
- Model selection: CR-V, City, Civic, Accord
- Version selection (dynamic based on model)
- Color picker (visual buttons)
- Base price display (auto-update)

**Price Summary**:
- OTR Total (On-The-Road)
- Continue button → Tab 2

**UI Reference - Color Picker**:
```tsx
<div className="flex gap-3">
  {colors.map(c => (
    <button
      onClick={() => setSelectedColor(c.id)}
      className={`w-8 h-8 rounded-full border-2 ${
        selectedColor === c.id 
          ? 'border-blue-600 ring-2 ring-blue-100' 
          : 'border-gray-200'
      }`}
      style={{ backgroundColor: c.color }}
    />
  ))}
</div>
```

#### 3.2 Tab 2: Phụ Kiện & Dịch Vụ

**Accessory Groups**:
1. **Ngoại thất**: Body kit, Spoiler, Chrome kit, LED fog
2. **Nội thất**: Floor mat, Leather seat, Ambient light, Armrest
3. **Công nghệ**: Camera 360, Dash cam, Android box, HUD
4. **Bảo vệ**: Film 3M, PPF, Ceramic coating, Undercoat

**Service Packages**:
- Bảo dưỡng miễn phí 3 lần (FREE)
- Gói bảo dưỡng 5 năm
- Bảo hành mở rộng 2 năm
- Cứu hộ 24/7 (3 năm)

**Selection UI**:
```tsx
<div className="grid md:grid-cols-2 gap-3">
  {accessories.map(acc => (
    <div 
      className={`p-3 border rounded-lg cursor-pointer ${
        selected ? 'border-red-500 bg-red-50' : ''
      }`}
      onClick={() => toggleSelection(acc.id)}
    >
      <Checkbox checked={selected} />
      <p className="font-medium">{acc.name}</p>
      <p className="text-red-600 font-bold">{formatPrice(acc.price)}</p>
    </div>
  ))}
</div>
```

**Summary Sidebar** (Sticky):
- Phụ kiện total
- Dịch vụ total
- Grand total
- Continue button → Tab 3

#### 3.3 Tab 3: Phân Tích Giá

**Config Section**:
- Discount input (VNĐ)
- Commission input (VNĐ)
- Promotion value (display only)

**Revenue Card**:
- Giá xe (niêm yết)
- Phụ kiện & Dịch vụ
- Các loại phí (insurance, tax, registration)
- Giảm giá & KM (negative)
- **TỔNG THU KHÁCH** (final price)

**Profit Analysis Card**:
- Doanh thu thuần (excluding fees)
- Tổng chi phí (cost breakdown)
- **LỢI NHUẬN GỘP** (Gross Profit)
- Margin % (profit / revenue)

**Cost Breakdown**:
```typescript
const manufacturerCost = basePrice * 0.88;
const accessoryCost = accessoriesTotal * 0.6;
const serviceCost = servicesTotal * 0.7;
const operatingCost = 5000000;
const marketingCost = 2000000;
const commissionCost = actualCommission;

const totalCost = manufacturerCost + accessoryCost + serviceCost 
                + operatingCost + marketingCost + commissionCost;

const grossProfit = totalRevenue - totalCost;
const profitMargin = (grossProfit / netRevenue) * 100;
```

**UI Reference - Profit Display**:
```tsx
<div className="p-4 rounded-lg bg-green-50 border border-green-200">
  <p className="text-sm text-green-800 uppercase">Lợi Nhuận Gộp</p>
  <p className={`text-4xl font-black ${
    grossProfit >= 0 ? 'text-green-600' : 'text-red-500'
  }`}>
    {formatPrice(grossProfit)}
  </p>
  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white">
    Margin: {profitMargin.toFixed(2)}%
  </div>
</div>
```

### 4. Data Requirements

**Primary Model**: `Quotation`

```typescript
{
  id: string,
  quoteNumber: string, // Auto-generated: QT-YYYY-NNNN
  customerId?: string,
  customerName: string,
  customerPhone: string,
  customerEmail?: string,
  model: string,
  version: string,
  color: string,
  basePrice: number,
  accessories: string[], // IDs
  services: string[], // IDs
  accessoriesTotal: number,
  servicesTotal: number,
  insurance: number,
  registrationTax: number,
  registration: number,
  otherFees: number,
  discount: number,
  promotionValue: number,
  totalPrice: number,
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'CONTRACT',
  userId: string, // Sales person
  createdAt: DateTime,
  expiryDate: DateTime // Default: +7 days
}
```

**API Endpoints**:
- `POST /api/sales/quotations` - Create quotation
- `GET /api/sales/quotations/:id` - Get quotation
- `PATCH /api/sales/quotations/:id` - Update quotation
- `POST /api/sales/quotations/:id/send` - Send to customer (email/print)

### 5. Business Rules

| Rule ID | Description |
|---------|-------------|
| BR-SAL-001 | Quote number format: QT-YYYY-NNNN (auto-increment) |
| BR-SAL-002 | Quote expires after 7 days (configurable) |
| BR-SAL-003 | Insurance = basePrice * 1.5% |
| BR-SAL-004 | Registration tax = basePrice * 10% |
| BR-SAL-005 | Registration fee = 20M VNĐ (HN/HCM) |
| BR-SAL-006 | Manufacturer cost = basePrice * 88% |
| BR-SAL-007 | Accessory cost = retail * 60% |
| BR-SAL-008 | Service cost = retail * 70% |
| BR-SAL-009 | Customer search links to CRM database |
| BR-SAL-010 | Profit analysis for MANAGER+ only (optional) |

---

## 🎯 SCR-SAL-002: Danh Sách Báo Giá

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-SAL-002 |
| **Screen Name** | Danh Sách Báo Giá |
| **Route** | `/sales/quotations` |
| **Component** | `components/sales/QuotationList.tsx` |

### 2. UI References

**UI Patterns**:
- Table view (`Table` component)
- Status badges (`Badge`)
- Actions menu (`DropdownMenu`)
- Filters (Search, Status, Date range)

### 3. Functional Specifications

**Table Columns**:
- Quote Number (clickable)
- Customer Name
- Model + Version
- Total Price
- Status (DRAFT/SENT/APPROVED/CONTRACT)
- Created Date
- Expiry Date
- Actions (View/Edit/Send/Delete)

**Status Colors**:
```tsx
const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SENT: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  CONTRACT: 'bg-purple-100 text-purple-800'
};
```

**Actions**:
- 👁️ View details (readonly)
- ✏️ Edit (if DRAFT)
- 📧 Send to customer
- 📄 Convert to Contract
- 🗑️ Delete (if DRAFT)

---

## 🎯 SCR-SAL-003: Lịch Lái Thử

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-SAL-003 |
| **Screen Name** | Lịch Lái Thử |
| **Route** | `/sales/test-drive` |
| **Component** | `components/sales/TestDriveSchedule.tsx` |

### 2. UI References

**UI Patterns**:
- Calendar view (FullCalendar hoặc custom)
- Booking dialog (`Dialog`)
- Time slot picker
- Vehicle availability check

### 3. Functional Specifications

**Calendar Features**:
- Month/Week/Day views
- Color-coded by status (SCHEDULED/COMPLETED/CANCELLED)
- Click to view details
- Drag to reschedule

**Booking Dialog**:
- Customer selection (from CRM)
- Model selection
- Date & Time picker
- Duration (30min/1hr)
- Sales person assignment
- Notes

**Vehicle Availability**:
- Check if demo vehicle available
- Show conflicts
- Suggest alternative slots

---

## 🎯 SCR-SAL-004: Quản Lý Đặt Cọc

### 1. Screen Information

| Thuốc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-SAL-004 |
| **Screen Name** | Quản Lý Đặt Cọc |
| **Route** | `/sales/deposits` |
| **Component** | `components/sales/DepositManagement.tsx` |

### 2. UI References

**UI Patterns**:
- Table view with filters
- Deposit form dialog
- Payment tracking
- Status workflow

### 3. Functional Specifications

**Deposit Info**:
- Deposit Number (auto: DP-YYYY-NNNN)
- Customer
- Quotation reference
- Vehicle (Model, Version, Color)
- Deposit amount (default: 10% of total)
- Payment method (CASH/TRANSFER/CARD)
- Status (PENDING/CONFIRMED/CANCELLED/REFUNDED)

**Status Workflow**:
```
PENDING → CONFIRMED → Contract Created
       ↓
    CANCELLED → REFUNDED
```

**Actions**:
- Confirm deposit (upload payment proof)
- Cancel deposit
- Process refund
- Convert to Contract

---

## 🎯 SCR-SAL-005: Hợp Đồng Mua Bán

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-SAL-005 |
| **Screen Name** | Hợp Đồng Mua Bán |
| **Route** | `/sales/contracts` |
| **Component** | `components/sales/ContractManagement.tsx` |

### 2. UI References

**UI Patterns**:
- Table view
- Contract form (multi-page)
- Document upload
- E-signature (optional)

### 3. Functional Specifications

**Contract Info**:
- Contract Number (auto: CT-YYYY-NNNN)
- Customer details (from CRM)
- Vehicle details (from Quotation)
- Payment terms
- Delivery date
- Special conditions
- Attachments (ID, proof of income, etc.)

**Payment Terms**:
- Full payment
- Installment (bank financing)
- Trade-in value

**Status**:
- DRAFT → SIGNED → APPROVED → COMPLETED

---

## 🎯 SCR-SAL-006: Giao Xe (PDS)

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-SAL-006 |
| **Screen Name** | Giao Xe (Pre-Delivery Service) |
| **Route** | `/sales/delivery` |
| **Component** | `components/sales/VehicleDelivery.tsx` |

### 2. UI References

**UI Patterns**:
- Checklist form
- Photo upload
- Customer signature
- Handover certificate

### 3. Functional Specifications

**PDS Checklist**:
- ✅ Vehicle inspection (exterior/interior)
- ✅ Accessories installation check
- ✅ Documentation complete
- ✅ Customer orientation (features demo)
- ✅ Photo documentation
- ✅ Customer satisfaction survey
- ✅ Handover signature

**Deliverables**:
- Vehicle keys
- Registration documents
- Owner's manual
- Warranty card
- Service booklet

---

## 🎯 SCR-SAL-007: Kho VIN

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-SAL-007 |
| **Screen Name** | Kho VIN (Inventory) |
| **Route** | `/sales/inventory` |
| **Component** | `components/sales/VinInventory.tsx` |

### 2. UI References

**Primary Component**: `VinInventory.tsx`

**UI Patterns**:
- Table view with filters
- VIN details dialog
- Status badges
- Allocation tracking

### 3. Functional Specifications

**VIN Info**:
- VIN Number (unique)
- Model, Version, Color
- Manufacturing date
- Arrival date
- Status (IN_TRANSIT/AVAILABLE/ALLOCATED/SOLD)
- Allocated to (Customer/Contract)
- Location (Yard/Showroom)

**Filters**:
- Model
- Color
- Status
- Date range

**Actions**:
- Allocate to contract
- Mark as sold
- Transfer location
- View history

---

## 🎯 SCR-SAL-008: Báo Cáo Bán Hàng

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-SAL-008 |
| **Screen Name** | Báo Cáo Bán Hàng |
| **Route** | `/sales/reports` |
| **Component** | `components/sales/SalesReports.tsx` |

### 2. UI References

**UI Patterns**:
- KPI cards
- Charts (Recharts)
- Date range filter
- Export to Excel

### 3. Functional Specifications

**KPIs**:
- Total revenue
- Units sold
- Average selling price
- Conversion rate (Quote → Contract)
- Top selling models
- Sales by person

**Charts**:
- Revenue trend (Line chart)
- Sales by model (Pie chart)
- Sales funnel (Funnel chart)
- Performance by sales person (Bar chart)

---

## 📝 Module 3 Summary

### UI Components Inventory

**Reused Components**:
- ✅ `Card`, `Button`, `Input`, `Select`, `Checkbox`
- ✅ `Table`, `Dialog`, `Tabs`, `Badge`
- ✅ `CurrencyInput` (custom)
- ✅ `CustomerSearch` (from common)
- ✅ Recharts (charts)

**Custom Components**:
- ✅ Color Picker (visual buttons)
- ✅ Price Calculator (real-time)
- ✅ PDS Checklist
- ⚠️ Calendar View (GAP-002)

### GAPs Analysis

#### ✅ NO GAPS IDENTIFIED

**Calendar Component Status**: ✅ **AVAILABLE**

**Current State**:
- ✅ `TestDriveCalendar.tsx` đã được implement (26,472 bytes)
- ✅ Calendar view với month/week/day views
- ✅ Event handling và scheduling
- ✅ Color-coded appointments

**UI Reference - Calendar**:
```tsx
// From: components/sales/TestDriveCalendar.tsx
// Full-featured calendar component đã sẵn sàng sử dụng
```

**Status**: ✅ **No Extension Required**

### Data Models

**Primary Models**:
- `Quotation` - Báo giá
- `TestDrive` - Lịch lái thử
- `Deposit` - Đặt cọc
- `Contract` - Hợp đồng
- `Delivery` - Giao xe
- `VIN` - Kho VIN

### Business Rules Summary

**Total Rules**: 10 (BR-SAL-001 to BR-SAL-010)

**Key Rules**:
- Auto-numbering (QT-, DP-, CT-)
- Price calculations (insurance, tax, fees)
- Cost formulas (manufacturer, accessories, services)
- Status workflows
- Expiry dates

---

**End of Module 3 FRD**
