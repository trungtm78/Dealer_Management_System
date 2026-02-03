# Functional Requirements Document (FRD)
## Honda Dealer Management System - Module 5: Phụ Tùng (Parts)

---

## 📋 Document Control

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Module** | Module 5 - Phụ Tùng (Parts) |
| **Số Screens** | 10 |
| **Phiên Bản** | 1.0 (DRAFT: Updating to v1.1) |
| **Ngày Tạo** | 28/01/2026 |
| **Ngày Cập Nhật** | 03/02/2026 |
| **CR** | CR-20260203-005 (Part-Vehicle Compatibility) |

---

## 📊 Module Overview

**Mục đích**: Quản lý toàn bộ quy trình phụ tùng từ Mua Hàng → Nhập Kho → Tồn Kho → Xuất Kho → Kiểm Kê

**Screens trong Module**:

| # | Screen ID | Screen Name | Route | Component File |
|---|-----------|-------------|-------|----------------|
| 1 | SCR-PRT-001 | Tổng Quan Tồn Kho | `/parts/inventory` | `InventoryList.tsx` |
| 2 | SCR-PRT-002 | Hàng Backorder | `/parts/backorder` | `BackorderList.tsx` |
| 3 | SCR-PRT-003 | Nhập Xuất Kho | `/parts/movements` | `StockMovements.tsx` |
| 4 | SCR-PRT-004 | Yêu Cầu Mua Hàng | `/parts/purchases` | `PurchaseList.tsx` |
| 5 | SCR-PRT-005 | Phân Tích Tuổi Tồn | `/parts/aging` | `InventoryAging.tsx` |
| 6 | SCR-PRT-006 | Kiểm Kê Kho | `/parts/stock-take` | `PartsStockTake.tsx` |
| 7 | SCR-PRT-007 | Picking & Packing | `/parts/picking` | `PickingPacking.tsx` |
| 8 | SCR-PRT-008 | KPIs Phụ Tùng | `/parts/kpi` | `PartsKPI.tsx` |
| 9 | SCR-PRT-009 | Định Giá PT | `/parts/pricing` | `PartsPricing.tsx` |
| 10 | SCR-PRT-010 | Trả Hàng NCC | `/parts/return` | `PartsReturnSupplier.tsx` |

---

## 🎯 SCR-PRT-001: Tổng Quan Tồn Kho

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-PRT-001 |
| **Screen Name** | Tổng Quan Tồn Kho |
| **Route** | `/parts/inventory` |
| **Component** | `InventoryList.tsx` (15,740 bytes) |
| **Access Control** | PARTS, MANAGER, ADMIN |

### 2. UI References

**Primary Component**: `InventoryList.tsx`

**UI Patterns**:
- Table view with advanced filters
- Stock level indicators
- Search by part number/name
- Quick actions menu

**Layout Structure**:
```tsx
<div className="p-6">
  {/* KPI Cards */}
  <div className="grid grid-cols-4 gap-4">
    <Card>Total Parts</Card>
    <Card>Low Stock</Card>
    <Card>Out of Stock</Card>
    <Card>Total Value</Card>
  </div>
  
  {/* Filters */}
  <Card>
    <Input placeholder="Search..." />
    <Select>Category</Select>
    <Select>Stock Status</Select>
    <!-- CR-20260203-005: ADDED -->
    <Select>Vehicle Model</Select> {/* NEW: Filter by vehicle model */}
    <!-- END CR-20260203-005 -->
  </Card>
  
  {/* Parts Table */}
  <Table>
    <TableRow>
      <TableCell>Part Number</TableCell>
      <TableCell>Name</TableCell>
      <TableCell>Category</TableCell>
      <TableCell>Quantity</TableCell>
      <TableCell>Min Stock</TableCell>
      <TableCell>Price</TableCell>
      <!-- CR-20260203-005: ADDED -->
      <TableCell>Compatible Models</TableCell> {/* NEW */}
      <!-- END CR-20260203-005 -->
      <TableCell>Status</TableCell>
      <TableCell>Actions</TableCell>
    </TableRow>
  </Table>
</div>
```

### 3. Functional Specifications

#### 3.1 Stock Level Indicators

**Color Coding**:
- 🔴 **OUT_OF_STOCK**: Quantity = 0
- 🟡 **LOW_STOCK**: Quantity < Min Stock
- 🟢 **OK**: Quantity >= Min Stock

**UI Reference**:
```tsx
const getStockBadge = (qty: number, minStock: number) => {
  if (qty === 0) return <Badge className="bg-red-500">Hết hàng</Badge>;
  if (qty < minStock) return <Badge className="bg-yellow-500">Sắp hết</Badge>;
  return <Badge className="bg-green-500">Còn hàng</Badge>;
};
```

#### 3.2 Filters

**Available Filters**:
- Search: Part number, Name, Description
- Category: Engine, Body, Electrical, Accessories, etc.
- Stock Status: All, In Stock, Low Stock, Out of Stock
- Supplier: Filter by supplier
<!-- CR-20260203-005: ADDED -->
- **Vehicle Model**: Filter parts by compatible vehicle model (NEW)
<!-- END CR-20260203-005 -->

<!-- CR-20260203-005: ADDED -->
#### 3.2.1 Vehicle Model Filter (NEW)

**Purpose**: Show only parts compatible with selected vehicle model

**UI**:
- Dropdown: Select from active VehicleModels
- Placeholder: "Filter by Vehicle Model"
- Default: All (no filter)

**Behavior**:
- User selects a vehicle model from dropdown
- System filters parts:
  - Show parts with compatibility records for this model
  - Show parts with NO compatibility records (universal parts)
- Result count updated: "Showing X parts compatible with [Model Name]"

**Query Parameter**: `?vehicle_model_id={uuid}`

**API Call**: `GET /api/parts?vehicle_model_id={uuid}`
<!-- END CR-20260203-005 -->

#### 3.3 Quick Actions

**Actions Menu**:
- 📝 Adjust Stock (manual adjustment)
- 📊 View History (movement history)
- 🛒 Create Purchase Order
- 💰 Update Price
<!-- CR-20260203-005: ADDED -->
- 🔗 **Manage Compatibility** (NEW: Open compatibility dialog)
<!-- END CR-20260203-005 -->
- 🗑️ Deactivate Part

### 4. Data Requirements

**Model**: `Part`

<!-- CR-20260203-005: MODIFIED -->
```typescript
{
  id: string,
  partNumber: string, // Unique
  name: string,
  description?: string,
  category: string,
  quantity: number,
  minStock: number,
  maxStock: number,
  unitPrice: number,
  costPrice: number,
  supplierId?: string,
  location?: string, // Warehouse location
  status: 'ACTIVE' | 'INACTIVE',
  // 🆕 NEW FIELD (CR-20260203-005)
  compatible_models?: string[], // Array of VehicleModel IDs, optional
  // If null or empty → Universal part (fits all vehicles)
  // If has values → Part only fits specified models
  createdAt: DateTime,
  updatedAt: DateTime
}
```
<!-- END CR-20260203-005 -->

### 5. Business Rules

| Rule ID | Description |
|---------|-------------|
| BR-PRT-001 | Min stock triggers auto PO creation |
| BR-PRT-002 | Part number must be unique |
| BR-PRT-003 | Negative quantity not allowed |
| BR-PRT-004 | Price update requires approval if > 10% change |
<!-- CR-20260203-005: ADDED -->
| BR-PRT-011 | If compatible_models is NULL or empty → Part is universal (fits all vehicles) |
| BR-PRT-012 | If compatible_models has values → Part only fits specified models |
| BR-PRT-013 | All selected vehicle models MUST be ACTIVE |
| BR-PRT-014 | When filtering by vehicle model → Return compatible parts + universal parts |
<!-- END CR-20260203-005 -->

---

## 🎯 SCR-PRT-002: Hàng Backorder

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-PRT-002 |
| **Screen Name** | Hàng Backorder |
| **Component** | `BackorderList.tsx` |

### 2. Functional Specifications

**Features**:
- List of parts on backorder
- Expected arrival date
- Customer/RO allocation
- Auto-notify when parts arrive
- Priority sorting

**Table Columns**:
- Part Number
- Part Name
- Quantity Ordered
- Quantity Backor ordered
- Expected Date
- Allocated To (Customer/RO)
- Status

---

## 🎯 SCR-PRT-003: Nhập Xuất Kho

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-PRT-003 |
| **Screen Name** | Nhập Xuất Kho |
| **Component** | `StockMovements.tsx` |

### 2. Functional Specifications

**Movement Types**:
- **IN**: Purchase receipt, Return from customer
- **OUT**: Issue to RO, Sale
- **ADJUSTMENT**: Stock take adjustment, Damage

**Table Columns**:
- Date & Time
- Type (IN/OUT/ADJUSTMENT)
- Part Number
- Part Name
- Quantity
- Reference (PO/RO number)
- User
- Notes

---

## 🎯 SCR-PRT-004: Yêu Cầu Mua Hàng

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-PRT-004 |
| **Screen Name** | Yêu Cầu Mua Hàng |
| **Component** | `PurchaseList.tsx` |

### 2. Functional Specifications

**PO Status Workflow**:
```
DRAFT → SENT → CONFIRMED → RECEIVED → CLOSED
```

**Features**:
- Create PO from low stock parts
- Supplier selection
- Expected delivery date
- Partial receiving
- GRN (Goods Receipt Note) generation

---

## 🎯 SCR-PRT-005: Phân Tích Tuổi Tồn

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-PRT-005 |
| **Screen Name** | Phân Tích Tuổi Tồn |
| **Component** | `InventoryAging.tsx` |

### 2. Functional Specifications

**Aging Buckets**:
- 0-30 days: Fresh stock
- 31-60 days: Normal
- 61-90 days: Slow-moving
- 90+ days: Obsolete

**Charts**:
- Pie chart: Value by aging category
- Bar chart: Quantity by aging bucket
- Table: Top slow-moving parts

**Actions**:
- Mark as obsolete
- Create clearance promotion
- Return to supplier

---

## 🎯 SCR-PRT-006: Kiểm Kê Kho

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-PRT-006 |
| **Screen Name** | Kiểm Kê Kho |
| **Component** | `PartsStockTake.tsx` |

### 2. Functional Specifications

**Stock Take Process**:
1. Create stock take session
2. Print count sheets
3. Physical count (scan/manual entry)
4. Review variances
5. Post adjustments

**Variance Threshold**:
- < 5%: Auto-approve
- >= 5%: Requires manager approval

---

## 🎯 SCR-PRT-007: Picking & Packing

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-PRT-007 |
| **Screen Name** | Picking & Packing |
| **Component** | `PickingPacking.tsx` |

### 2. Functional Specifications

**Features**:
- Pick list from RO
- Barcode scanning
- Bin location guidance
- Packing slip generation
- Delivery tracking

---

## 🎯 SCR-PRT-008: KPIs Phụ Tùng

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-PRT-008 |
| **Screen Name** | KPIs Phụ Tùng |
| **Component** | `PartsKPI.tsx` |

### 2. Functional Specifications

**KPIs**:
- Inventory Turnover Ratio
- Fill Rate (%)
- Stock-out Frequency
- Obsolete Inventory Value
- Average Days in Stock

**Charts**:
- Turnover trend (Line chart)
- Fill rate by category (Bar chart)
- Top sellers (Table)

---

## 🎯 SCR-PRT-009: Định Giá PT

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-PRT-009 |
| **Screen Name** | Định Giá PT |
| **Component** | `PartsPricing.tsx` |

### 2. Functional Specifications

**Pricing Rules**:
- Cost-plus pricing: `Price = Cost * (1 + Markup%)`
- Competitor-based pricing
- Promotion pricing
- Volume discounts

---

## 🎯 SCR-PRT-010: Trả Hàng NCC

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-PRT-010 |
| **Screen Name** | Trả Hàng NCC |
| **Component** | `PartsReturnSupplier.tsx` |

### 2. Functional Specifications

**Return Reasons**:
- Defective
- Wrong part
- Excess stock
- Obsolete

**Process**:
1. Create return request
2. Supplier approval
3. Ship parts back
4. Receive credit note
5. Update inventory

---

## 📝 Module 5 Summary

### UI Components Inventory

**Reused Components**:
- ✅ Table, Card, Button, Input, Select
- ✅ Dialog, Badge, Date picker
- ✅ Recharts (Pie, Bar, Line charts)
<!-- CR-20260203-005: ADDED -->
- ✅ MultiSelect (for vehicle models)
<!-- END CR-20260203-005 -->

**Custom Components**:
- ✅ Stock level indicator
- ✅ Barcode scanner integration
- ✅ Aging analysis chart
<!-- CR-20260203-005: ADDED -->
- ✅ Part Compatibility Dialog (NEW - reuse from Accessory pattern)
<!-- END CR-20260203-005 -->

### GAPs Analysis

**✅ NO GAPS IDENTIFIED**

Tất cả 10 screens đã có components implementation đầy đủ.
<!-- CR-20260203-005: NOTE -->
Part Compatibility Dialog sẽ reuse 100% từ Accessory Compatibility Dialog (FRD Master Data v1.2).
<!-- END CR-20260203-005 -->

### Data Models

**Primary Models**:
- `Part` - Phụ tùng <!-- CR-20260203-005: Now includes compatible_models field -->
- `StockMovement` - Nhập xuất kho
- `PurchaseOrder` - Đơn mua hàng
- `StockTake` - Kiểm kê
- `PartsPricing` - Định giá

<!-- CR-20260203-005: ADDED -->
**New Junction Table** (managed in Master Data module):
- `part_vehicle_compatibility` - Part ↔ VehicleModel many-to-many relationship
<!-- END CR-20260203-005 -->

### Business Rules Summary

**Total Rules**: 10+ (BR-PRT-001 to BR-PRT-010)
<!-- CR-20260203-005: Updated to 14 rules (BR-PRT-001 to BR-PRT-014) -->

**Key Rules**:
- FIFO for parts issuing
- Min stock triggers auto PO
- Aging > 90 days = Obsolete
- Price markup formulas
- Stock take variance approval threshold
<!-- CR-20260203-005: ADDED -->
- Part compatibility validation (BR-PRT-011 to BR-PRT-014)
<!-- END CR-20260203-005 -->

---

<!-- CR-20260203-005: ADDED -->
## 📋 Change Log

### Version 1.1 - 03/02/2026
#### Changes (CR-20260203-005)
- Added `compatible_models` field to Part entity
- Added Vehicle Model filter to Parts List screen (SCR-PRT-001)
- Added Compatible Models column to Parts table
- Added "Manage Compatibility" quick action
- Added Business Rules BR-PRT-011 to BR-PRT-014

#### Related
- CR: CR-20260203-005 (Part-Vehicle Compatibility)
- FRD Master Data: v1.2 → v1.3 (Compatibility management UI)
- ERD: v1.2 → v1.3 (Junction table `part_vehicle_compatibility`)
- API Spec: v1.0 → v1.1 (Compatibility endpoints)

### Version 1.0 - 28/01/2026
#### Initial Release
- 10 screens for Parts module
- CRUD operations for Parts
- Stock management, Purchase Orders, Aging analysis, KPIs
<!-- END CR-20260203-005 -->

---

**End of Module 5 FRD (DRAFT v1.1)**
