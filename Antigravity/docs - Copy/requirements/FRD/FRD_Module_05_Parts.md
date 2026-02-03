# Functional Requirements Document (FRD)
## Honda Dealer Management System - Module 5: Phụ Tùng (Parts)

---

## 📋 Document Control

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Module** | Module 5 - Phụ Tùng (Parts) |
| **Số Screens** | 10 |
| **Phiên Bản** | 1.0 |
| **Ngày Tạo** | 28/01/2026 |

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

#### 3.3 Quick Actions

**Actions Menu**:
- 📝 Adjust Stock (manual adjustment)
- 📊 View History (movement history)
- 🛒 Create Purchase Order
- 💰 Update Price
- 🗑️ Deactivate Part

### 4. Data Requirements

**Model**: `Part`

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
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### 5. Business Rules

| Rule ID | Description |
|---------|-------------|
| BR-PRT-001 | Min stock triggers auto PO creation |
| BR-PRT-002 | Part number must be unique |
| BR-PRT-003 | Negative quantity not allowed |
| BR-PRT-004 | Price update requires approval if > 10% change |

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
- Quantity Backordered
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

**Custom Components**:
- ✅ Stock level indicator
- ✅ Barcode scanner integration
- ✅ Aging analysis chart

### GAPs Analysis

**✅ NO GAPS IDENTIFIED**

Tất cả 10 screens đã có components implementation đầy đủ.

### Data Models

**Primary Models**:
- `Part` - Phụ tùng
- `StockMovement` - Nhập xuất kho
- `PurchaseOrder` - Đơn mua hàng
- `StockTake` - Kiểm kê
- `PartsPricing` - Định giá

### Business Rules Summary

**Total Rules**: 10+ (BR-PRT-001 to BR-PRT-010)

**Key Rules**:
- FIFO for parts issuing
- Min stock triggers auto PO
- Aging > 90 days = Obsolete
- Price markup formulas
- Stock take variance approval threshold

---

**End of Module 5 FRD**
