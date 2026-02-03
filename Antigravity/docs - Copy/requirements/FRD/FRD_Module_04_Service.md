# Functional Requirements Document (FRD)
## Honda Dealer Management System - Module 4: Dịch Vụ (Service)

---

## 📋 Document Control

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Module** | Module 4 - Dịch Vụ (Service) |
| **Số Screens** | 8 |
| **Phiên Bản** | 1.0 |
| **Ngày Tạo** | 28/01/2026 |

---

## 📊 Module Overview

**Mục đích**: Quản lý toàn bộ quy trình dịch vụ từ Đặt Lịch → Tiếp Nhận → Sửa Chữa → Kiểm Tra → Thanh Toán

**Screens trong Module**:

| # | Screen ID | Screen Name | Route | Component File |
|---|-----------|-------------|-------|----------------|
| 1 | SCR-SVC-001 | Báo Giá Dịch Vụ | `/service/quotations` | `ServiceQuoteCreate.tsx` |
| 2 | SCR-SVC-002 | Danh Sách Báo Giá DV | `/service/quotes` | `ServiceQuoteList.tsx` |
| 3 | SCR-SVC-003 | Đặt Lịch Hẹn | `/service/appointments` | `AppointmentList.tsx` |
| 4 | SCR-SVC-004 | Tiếp Nhận | `/service/reception` | `ReceptionBoard.tsx` |
| 5 | SCR-SVC-005 | Lệnh Sửa Chữa (RO) | `/service/orders` | `RepairOrderList.tsx` |
| 6 | SCR-SVC-006 | Giao Diện KTV | `/service/technician` | `TechnicianView.tsx` |
| 7 | SCR-SVC-007 | Kiểm Tra Chất Lượng | `/service/qc` | `QualityControl.tsx` |
| 8 | SCR-SVC-008 | Thanh Toán | `/service/settlement` | `ServiceSettlement.tsx` |

---

## 🎯 SCR-SVC-001: Báo Giá Dịch Vụ

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-SVC-001 |
| **Screen Name** | Báo Giá Dịch Vụ |
| **Route** | `/service/quotations` |
| **Component** | `ServiceQuoteCreate.tsx` (21,257 bytes) |
| **Access Control** | SERVICE, MANAGER, ADMIN |

### 2. UI References

**Primary Component**: `ServiceQuoteCreate.tsx`

**UI Patterns**:
- Multi-section form
- Service item picker
- Parts picker
- Price calculator
- Customer search integration

**Layout Structure**:
```tsx
<div className="space-y-6">
  {/* Customer Section */}
  <Card>
    <CustomerSearch />
    <VehicleInfo />
  </Card>
  
  {/* Services Section */}
  <Card>
    <ServiceItemPicker />
    <LaborCostCalculator />
  </Card>
  
  {/* Parts Section */}
  <Card>
    <PartsSearch />
    <PartsTable />
  </Card>
  
  {/* Summary */}
  <Card>
    <PriceSummary />
    <Button>Tạo Báo Giá</Button>
  </Card>
</div>
```

### 3. Functional Specifications

#### 3.1 Service Items

**Categories**:
- Bảo dưỡng định kỳ (Periodic Maintenance)
- Sửa chữa (Repair)
- Chẩn đoán (Diagnosis)
- Rửa xe & Detailing

**Service Item Fields**:
- Service code
- Description
- Labor hours
- Labor rate
- Total labor cost

**UI Reference**:
```tsx
<Table>
  <TableRow>
    <TableCell>{service.code}</TableCell>
    <TableCell>{service.description}</TableCell>
    <TableCell>
      <Input type="number" value={laborHours} />
    </TableCell>
    <TableCell>{formatCurrency(laborCost)}</TableCell>
  </TableRow>
</Table>
```

#### 3.2 Parts Selection

**Features**:
- Search parts by code/name
- Auto-suggest from inventory
- Quantity input
- Price display
- Stock availability check

#### 3.3 Price Calculation

**Formula**:
```typescript
const totalLabor = services.reduce((sum, s) => sum + (s.hours * s.rate), 0);
const totalParts = parts.reduce((sum, p) => sum + (p.qty * p.price), 0);
const subTotal = totalLabor + totalParts;
const vat = subTotal * 0.1; // 10%
const totalAmount = subTotal + vat;
```

### 4. Data Requirements

**Model**: `ServiceQuote`

```typescript
{
  id: string,
  quoteNumber: string, // SQ-YYYY-NNNN
  customerId: string,
  vehicleInfo: {
    vin?: string,
    licensePlate: string,
    model: string,
    year: number,
    mileage: number
  },
  services: ServiceItem[],
  parts: PartItem[],
  totalLabor: number,
  totalParts: number,
  subTotal: number,
  vat: number,
  totalAmount: number,
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'RO_CREATED',
  advisorId: string,
  expiryDate: DateTime,
  createdAt: DateTime
}
```

### 5. Business Rules

| Rule ID | Description |
|---------|-------------|
| BR-SVC-001 | Quote number format: SQ-YYYY-NNNN |
| BR-SVC-002 | VAT = 10% of subtotal |
| BR-SVC-003 | Quote expires after 30 days |
| BR-SVC-004 | Labor rate configurable per service type |
| BR-SVC-005 | Parts price from inventory (auto-update) |

---

## 🎯 SCR-SVC-002 đến SCR-SVC-008: Summary

### SCR-SVC-002: Danh Sách Báo Giá DV

**Component**: `ServiceQuoteList.tsx`

**Features**:
- Table view with filters
- Status badges
- Search by customer/vehicle
- Actions: View, Edit, Convert to RO

---

### SCR-SVC-003: Đặt Lịch Hẹn

**Component**: `AppointmentList.tsx`

**Features**:
- Calendar view (day/week/month)
- Time slot booking
- Service advisor assignment
- Customer notification (SMS/Email)
- Status: SCHEDULED, CONFIRMED, ARRIVED, CANCELLED

---

### SCR-SVC-004: Tiếp Nhận

**Component**: `ReceptionBoard.tsx`

**Features**:
- Check-in interface
- Vehicle inspection checklist
- Customer signature
- Create RO from appointment
- Photo upload (vehicle condition)

---

### SCR-SVC-005: Lệnh Sửa Chữa (RO)

**Component**: `RepairOrderList.tsx` (17,164 bytes)

**Features**:
- RO list with filters
- Status workflow: OPEN → IN_PROGRESS → QC → READY → DELIVERED
- Assign technician
- Track progress
- Add/remove services & parts
- Time tracking

**UI Patterns**:
- Kanban board (similar to LeadsBoard)
- Detail dialog
- Status badges

---

### SCR-SVC-006: Giao Diện KTV

**Component**: `TechnicianView.tsx`

**Features**:
- My assigned ROs
- Start/Pause/Complete work
- Request parts
- Add notes/findings
- Upload photos
- Clock in/out

---

### SCR-SVC-007: Kiểm Tra Chất Lượng

**Component**: `QualityControl.tsx`

**Features**:
- QC checklist
- Test drive verification
- Photo documentation
- Approve/Reject RO
- Rework assignment

---

### SCR-SVC-008: Thanh Toán

**Component**: `ServiceSettlement.tsx`

**Features**:
- Invoice generation
- Payment methods (CASH/CARD/TRANSFER)
- Discount application
- Print invoice
- Customer signature
- Update RO status to DELIVERED

---

## 📝 Module 4 Summary

### UI Components Inventory

**Reused Components**:
- ✅ `Card`, `Button`, `Input`, `Table`
- ✅ `Dialog`, `Select`, `Checkbox`
- ✅ `CustomerSearch` (from common)
- ✅ Kanban board pattern (from CRM)

**Custom Components**:
- ✅ Service item picker
- ✅ Parts search & selection
- ✅ Vehicle info form
- ✅ QC checklist

### GAPs Analysis

**✅ NO GAPS IDENTIFIED**

Tất cả UI patterns đã có sẵn. Service module reuse nhiều patterns từ Sales và CRM.

### Data Models

**Primary Models**:
- `ServiceQuote` - Báo giá dịch vụ
- `Appointment` - Lịch hẹn
- `RepairOrder` - Lệnh sửa chữa
- `ServiceItem` - Dịch vụ
- `WorkLog` - Nhật ký công việc KTV

### Business Rules Summary

**Total Rules**: 15+ (BR-SVC-001 to BR-SVC-015)

**Key Rules**:
- Quote/RO numbering
- VAT calculation
- Status workflows
- Time tracking
- Parts allocation

---

**End of Module 4 FRD**
