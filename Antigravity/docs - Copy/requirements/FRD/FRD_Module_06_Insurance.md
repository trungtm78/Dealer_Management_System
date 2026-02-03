# Functional Requirements Document (FRD)
## Honda Dealer Management System - Module 6: Bảo Hiểm (Insurance)

---

## 📋 Document Control

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Module** | Module 6 - Bảo Hiểm (Insurance) |
| **Số Screens** | 5 |
| **Phiên Bản** | 1.0 |
| **Ngày Tạo** | 28/01/2026 |
| **Status** | ⚠️ **NOT IMPLEMENTED** - All screens missing |

---

## 📊 Module Overview

**Mục đích**: Quản lý hợp đồng bảo hiểm và quy trình bồi thường

**Screens trong Module**:

| # | Screen ID | Screen Name | Route | Component File | Status |
|---|-----------|-------------|-------|----------------|--------|
| 1 | SCR-INS-001 | Tổng Quan BH | `/insurance/dashboard` | ❌ **MISSING** | ⚠️ |
| 2 | SCR-INS-002 | Danh Sách HĐ | `/insurance/contracts` | ❌ **MISSING** | ⚠️ |
| 3 | SCR-INS-003 | Chi Tiết HĐ | `/insurance/contract-detail` | ❌ **MISSING** | ⚠️ |
| 4 | SCR-INS-004 | DS Bồi Thường | `/insurance/claims` | ❌ **MISSING** | ⚠️ |
| 5 | SCR-INS-005 | CT Bồi Thường | `/insurance/claim-detail` | ❌ **MISSING** | ⚠️ |

---

## 🎯 SCR-INS-001: Tổng Quan Bảo Hiểm

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-INS-001 |
| **Screen Name** | Tổng Quan Bảo Hiểm |
| **Route** | `/insurance/dashboard` |
| **Component** | ⚠️ **TO BE CREATED** |
| **Access Control** | INSURANCE, MANAGER, ADMIN |

### 2. Required UI Components

**Layout Structure**:
```tsx
<div className="p-6">
  {/* KPI Cards */}
  <div className="grid grid-cols-4 gap-4">
    <Card>
      <CardTitle>Tổng HĐ Hiệu Lực</CardTitle>
      <CardContent>{activeContracts}</CardContent>
    </Card>
    <Card>
      <CardTitle>HĐ Sắp Hết Hạn</CardTitle>
      <CardContent>{expiringContracts}</CardContent>
    </Card>
    <Card>
      <CardTitle>Bồi Thường Tháng Này</CardTitle>
      <CardContent>{claimsThisMonth}</CardContent>
    </Card>
    <Card>
      <CardTitle>Tỷ Lệ Bồi Thường</CardTitle>
      <CardContent>{claimRatio}%</CardContent>
    </Card>
  </div>
  
  {/* Charts */}
  <div className="grid grid-cols-2 gap-6">
    <Card>
      <CardTitle>HĐ Theo Loại</CardTitle>
      <PieChart /> {/* Comprehensive vs Third-party */}
    </Card>
    <Card>
      <CardTitle>Xu Hướng Bồi Thường</CardTitle>
      <LineChart /> {/* Claims trend over time */}
    </Card>
  </div>
  
  {/* Recent Activities */}
  <Card>
    <CardTitle>Hoạt Động Gần Đây</CardTitle>
    <Table>
      <TableRow>Recent contracts & claims</TableRow>
    </Table>
  </Card>
</div>
```

### 3. Functional Specifications

**KPIs to Display**:
- Total Active Contracts
- Contracts Expiring (next 30 days)
- Claims This Month (count & value)
- Claim Ratio (claims / contracts)
- Premium Revenue (monthly)

**Charts**:
- Contracts by Type (Pie chart)
- Claims Trend (Line chart)
- Premium Revenue Trend (Bar chart)

### 4. Data Requirements

**Models Needed**:
```typescript
interface InsuranceDashboardData {
  activeContracts: number;
  expiringContracts: number;
  claimsThisMonth: number;
  claimRatio: number;
  premiumRevenue: number;
  contractsByType: { type: string; count: number }[];
  claimsTrend: { month: string; count: number; value: number }[];
}
```

---

## 🎯 SCR-INS-002: Danh Sách Hợp Đồng

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-INS-002 |
| **Screen Name** | Danh Sách Hợp Đồng BH |
| **Route** | `/insurance/contracts` |
| **Component** | ⚠️ **TO BE CREATED** |

### 2. Required UI Components

**Layout**:
```tsx
<div className="p-6">
  {/* Filters */}
  <Card className="p-4">
    <Input placeholder="Tìm kiếm HĐ, khách hàng..." />
    <Select>
      <SelectItem value="all">Tất cả trạng thái</SelectItem>
      <SelectItem value="ACTIVE">Hiệu lực</SelectItem>
      <SelectItem value="EXPIRED">Hết hạn</SelectItem>
      <SelectItem value="CANCELLED">Đã hủy</SelectItem>
    </Select>
    <Select>
      <SelectItem value="all">Tất cả loại</SelectItem>
      <SelectItem value="COMPREHENSIVE">Toàn diện</SelectItem>
      <SelectItem value="THIRD_PARTY">Bên thứ 3</SelectItem>
    </Select>
  </Card>
  
  {/* Contracts Table */}
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Số HĐ</TableHead>
        <TableHead>Khách Hàng</TableHead>
        <TableHead>Xe</TableHead>
        <TableHead>Loại BH</TableHead>
        <TableHead>Phí BH</TableHead>
        <TableHead>Ngày Bắt Đầu</TableHead>
        <TableHead>Ngày Hết Hạn</TableHead>
        <TableHead>Trạng Thái</TableHead>
        <TableHead>Hành Động</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {/* Contract rows */}
    </TableBody>
  </Table>
</div>
```

### 3. Functional Specifications

**Table Columns**:
- Contract Number (clickable → detail)
- Customer Name
- Vehicle (Model + Plate)
- Insurance Type
- Premium Amount
- Start Date
- End Date
- Status (ACTIVE/EXPIRED/CANCELLED)
- Actions (View, Renew, Cancel)

**Filters**:
- Search: Contract number, Customer name, Plate number
- Status: All, Active, Expired, Cancelled
- Type: All, Comprehensive, Third-party
- Date range: Start/End date

**Actions**:
- 👁️ View Details
- 🔄 Renew Contract
- ❌ Cancel Contract
- 📄 Print Certificate

### 4. Data Requirements

**Model**: `InsuranceContract`

```typescript
{
  id: string,
  contractNumber: string, // INS-YYYY-NNNN
  customerId: string,
  vehicleId: string,
  insuranceType: 'COMPREHENSIVE' | 'THIRD_PARTY',
  premiumAmount: number,
  coverageAmount: number,
  startDate: Date,
  endDate: Date,
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED',
  insuranceCompany: string,
  policyNumber: string,
  notes?: string,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## 🎯 SCR-INS-003: Chi Tiết Hợp Đồng

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-INS-003 |
| **Screen Name** | Chi Tiết Hợp Đồng BH |
| **Route** | `/insurance/contract-detail/:id` |
| **Component** | ⚠️ **TO BE CREATED** |

### 2. Required UI Components

**Sections**:
1. **Contract Information**
   - Contract number, Status
   - Insurance company, Policy number
   - Start/End dates

2. **Customer & Vehicle**
   - Customer details
   - Vehicle info (Model, Plate, VIN)

3. **Coverage Details**
   - Insurance type
   - Coverage amount
   - Premium amount
   - Deductible

4. **Payment History**
   - Payment date
   - Amount paid
   - Payment method
   - Receipt number

5. **Claims History**
   - Related claims
   - Claim status
   - Claim amount

6. **Documents**
   - Policy document
   - Payment receipts
   - Claim documents

### 3. Functional Specifications

**Actions**:
- Edit contract details
- Renew contract
- Cancel contract
- Print certificate
- Upload documents
- Create claim

---

## 🎯 SCR-INS-004: Danh Sách Bồi Thường

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-INS-004 |
| **Screen Name** | Danh Sách Bồi Thường |
| **Route** | `/insurance/claims` |
| **Component** | ⚠️ **TO BE CREATED** |

### 2. Required UI Components

**Layout**:
```tsx
<div className="p-6">
  {/* Filters */}
  <Card>
    <Input placeholder="Tìm kiếm..." />
    <Select>Status filter</Select>
    <DateRangePicker />
  </Card>
  
  {/* Claims Table */}
  <Table>
    <TableRow>
      <TableCell>Claim Number</TableCell>
      <TableCell>Contract Number</TableCell>
      <TableCell>Customer</TableCell>
      <TableCell>Incident Date</TableCell>
      <TableCell>Claim Amount</TableCell>
      <TableCell>Status</TableCell>
      <TableCell>Actions</TableCell>
    </TableRow>
  </Table>
</div>
```

### 3. Functional Specifications

**Claim Status Workflow**:
```
SUBMITTED → REVIEWING → APPROVED → PAID
          ↓
       REJECTED
```

**Table Columns**:
- Claim Number
- Contract Number (link)
- Customer Name
- Vehicle
- Incident Date
- Claim Amount
- Approved Amount
- Status
- Actions

**Filters**:
- Search: Claim number, Customer, Contract
- Status: All, Submitted, Reviewing, Approved, Paid, Rejected
- Date range: Incident date

### 4. Data Requirements

**Model**: `InsuranceClaim`

```typescript
{
  id: string,
  claimNumber: string, // CLM-YYYY-NNNN
  contractId: string,
  incidentDate: Date,
  incidentType: string, // Accident, Theft, Fire, etc.
  incidentDescription: string,
  claimAmount: number,
  approvedAmount?: number,
  status: 'SUBMITTED' | 'REVIEWING' | 'APPROVED' | 'PAID' | 'REJECTED',
  documents: string[], // Photo URLs
  notes?: string,
  reviewedBy?: string,
  reviewedAt?: DateTime,
  paidAt?: DateTime,
  createdAt: DateTime
}
```

---

## 🎯 SCR-INS-005: Chi Tiết Bồi Thường

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-INS-005 |
| **Screen Name** | Chi Tiết Bồi Thường |
| **Route** | `/insurance/claim-detail/:id` |
| **Component** | ⚠️ **TO BE CREATED** |

### 2. Required UI Components

**Sections**:
1. **Claim Information**
   - Claim number, Status
   - Incident date, type
   - Description

2. **Contract & Customer**
   - Contract details (link)
   - Customer info
   - Vehicle info

3. **Claim Details**
   - Requested amount
   - Approved amount
   - Deductible
   - Net payout

4. **Incident Report**
   - Description
   - Photos/Videos upload
   - Police report (if any)
   - Witness information

5. **Approval Workflow**
   - Submitted by
   - Reviewed by
   - Approval status
   - Rejection reason (if rejected)

6. **Payment Tracking**
   - Payment date
   - Payment method
   - Payment reference

### 3. Functional Specifications

**Actions**:
- Submit for review (if DRAFT)
- Approve claim (MANAGER only)
- Reject claim (MANAGER only)
- Process payment
- Upload documents
- Add notes

**Approval Rules**:
- Claims < 10M: Auto-approve
- Claims >= 10M: Requires manager approval
- Claims > 50M: Requires director approval

---

## 📝 Module 6 Summary

### Implementation Status

**⚠️ CRITICAL GAP**: Toàn bộ module chưa được implement

**Screens Missing**: 5/5 (100%)

### UI Components Required

**To Implement**:
- ⚠️ Insurance dashboard layout
- ⚠️ Contract list & detail views
- ⚠️ Claim list & detail views
- ⚠️ Photo/document upload component
- ⚠️ Approval workflow UI

**Can Reuse from Existing Modules**:
- ✅ Table, Card, Button, Dialog (from ui/)
- ✅ Form components (Input, Select, DatePicker)
- ✅ Charts (Recharts from Dashboard)
- ✅ File upload pattern (similar to Service module)

### Recommended Implementation Approach

**Phase 1: Basic CRUD**
1. Create `InsuranceContract` model & API
2. Implement SCR-INS-002 (Contract List)
3. Implement SCR-INS-003 (Contract Detail)

**Phase 2: Claims Management**
4. Create `InsuranceClaim` model & API
5. Implement SCR-INS-004 (Claims List)
6. Implement SCR-INS-005 (Claim Detail)

**Phase 3: Dashboard & Analytics**
7. Implement SCR-INS-001 (Dashboard)
8. Add reporting features

### Data Models Summary

**Primary Models**:
- `InsuranceContract` - Hợp đồng bảo hiểm
- `InsuranceClaim` - Bồi thường
- `InsurancePayment` - Thanh toán phí BH
- `ClaimDocument` - Tài liệu bồi thường

### Business Rules

| Rule ID | Description |
|---------|-------------|
| BR-INS-001 | Contract number format: INS-YYYY-NNNN |
| BR-INS-002 | Claim number format: CLM-YYYY-NNNN |
| BR-INS-003 | Claims < 10M auto-approve |
| BR-INS-004 | Claims >= 10M require manager approval |
| BR-INS-005 | Contract renewal reminder 30 days before expiry |

---

**End of Module 6 FRD**
