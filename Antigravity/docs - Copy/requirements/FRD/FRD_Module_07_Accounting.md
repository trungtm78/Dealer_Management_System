# Functional Requirements Document (FRD)
## Honda Dealer Management System - Module 7: Kế Toán (Accounting)

---

## 📋 Document Control

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Module** | Module 7 - Kế Toán (Accounting) |
| **Số Screens** | 11 |
| **Phiên Bản** | 1.0 |
| **Ngày Tạo** | 28/01/2026 |

---

## 📊 Module Overview

**Mục đích**: Báo cáo tài chính và quản lý công nợ

**Screens trong Module**:

| # | Screen ID | Screen Name | Route | Component File |
|---|-----------|-------------|-------|----------------|
| 1 | SCR-ACC-001 | Dashboard Tài Chính | `/accounting/dashboard` | `FinancialDashboard.tsx` |
| 2 | SCR-ACC-002 | Báo Cáo Lãi Lỗ | `/accounting/pnl` | `PnLReport.tsx` |
| 3 | SCR-ACC-003 | Bảng Cân Đối | `/accounting/balance-sheet` | `BalanceSheet.tsx` |
| 4 | SCR-ACC-004 | Dòng Tiền | `/accounting/cashflow` | `CashFlow.tsx` |
| 5 | SCR-ACC-005 | Công Nợ Phải Thu | `/accounting/receivables` | `Receivables.tsx` |
| 6 | SCR-ACC-006 | Công Nợ Phải Trả | `/accounting/payables` | `Payables.tsx` |
| 7 | SCR-ACC-007 | Báo Cáo Thuế | `/accounting/tax` | `TaxReport.tsx` |
| 8 | SCR-ACC-008 | Báo Cáo Quản Lý | `/accounting/management` | `ManagementReport.tsx` |
| 9 | SCR-ACC-009 | Tài Sản Cố Định | `/accounting/assets` | `FixedAssets.tsx` |
| 10 | SCR-ACC-010 | Khấu Hao | `/accounting/depreciation` | `Depreciation.tsx` |
| 11 | SCR-ACC-011 | Phân Tích Chi Phí | `/accounting/analysis` | `CostAnalysis.tsx` |

---

## 🎯 SCR-ACC-001: Dashboard Tài Chính

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-ACC-001 |
| **Screen Name** | Dashboard Tài Chính |
| **Route** | `/accounting/dashboard` |
| **Component** | `FinancialDashboard.tsx` |
| **Access Control** | ACCOUNTING, CFO, ADMIN |

### 2. UI References

**Layout Structure**:
```tsx
<div className="p-6">
  {/* KPI Cards */}
  <div className="grid grid-cols-4 gap-4">
    <Card>
      <CardTitle>Doanh Thu Tháng</CardTitle>
      <CardContent>{revenue}</CardContent>
      <Badge>+12.5% vs tháng trước</Badge>
    </Card>
    <Card>
      <CardTitle>Lợi Nhuận</CardTitle>
      <CardContent>{profit}</CardContent>
    </Card>
    <Card>
      <CardTitle>Tiền Mặt</CardTitle>
      <CardContent>{cashBalance}</CardContent>
    </Card>
    <Card>
      <CardTitle>Công Nợ</CardTitle>
      <CardContent>AR: {ar} | AP: {ap}</CardContent>
    </Card>
  </div>
  
  {/* Charts */}
  <div className="grid grid-cols-2 gap-6">
    <Card>
      <LineChart title="Xu Hướng Doanh Thu" />
    </Card>
    <Card>
      <PieChart title="Cơ Cấu Chi Phí" />
    </Card>
  </div>
</div>
```

### 3. Functional Specifications

**KPIs**:
- Revenue (monthly, YTD)
- Gross Profit & Margin
- Net Profit & Margin
- Cash Balance
- AR/AP totals
- Working Capital

**Charts**:
- Revenue trend (Line chart)
- Expense breakdown (Pie chart)
- Profit margin trend (Line chart)

---

## 🎯 SCR-ACC-002: Báo Cáo Lãi Lỗ (P&L)

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-ACC-002 |
| **Screen Name** | Báo Cáo Lãi Lỗ |
| **Component** | `PnLReport.tsx` |

### 2. Functional Specifications

**P&L Structure**:
```
REVENUE
  - Sales Revenue
  - Service Revenue
  - Parts Revenue
  - Insurance Revenue
= TOTAL REVENUE

COST OF GOODS SOLD (COGS)
  - Vehicle Cost
  - Parts Cost
= GROSS PROFIT

OPERATING EXPENSES
  - Salaries & Wages
  - Rent
  - Utilities
  - Marketing
  - Depreciation
= OPERATING PROFIT

OTHER INCOME/EXPENSES
  - Interest Income
  - Interest Expense
= NET PROFIT BEFORE TAX

- Corporate Tax
= NET PROFIT AFTER TAX
```

**Features**:
- Period selection (Month, Quarter, Year)
- Comparison (YoY, MoM)
- Drill-down to details
- Export to Excel

---

## 🎯 SCR-ACC-003: Bảng Cân Đối (Balance Sheet)

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-ACC-003 |
| **Screen Name** | Bảng Cân Đối Kế Toán |
| **Component** | `BalanceSheet.tsx` |

### 2. Functional Specifications

**Balance Sheet Structure**:
```
ASSETS
  Current Assets
    - Cash & Cash Equivalents
    - Accounts Receivable
    - Inventory (Vehicles, Parts)
    - Prepaid Expenses
  
  Fixed Assets
    - Property, Plant & Equipment
    - Less: Accumulated Depreciation
    - Net Fixed Assets

= TOTAL ASSETS

LIABILITIES
  Current Liabilities
    - Accounts Payable
    - Short-term Loans
    - Accrued Expenses
  
  Long-term Liabilities
    - Long-term Loans
    - Deferred Tax

= TOTAL LIABILITIES

EQUITY
  - Share Capital
  - Retained Earnings
  - Current Year Profit

= TOTAL EQUITY

TOTAL LIABILITIES + EQUITY = TOTAL ASSETS
```

**Validation**:
- Assets = Liabilities + Equity (must balance)

---

## 🎯 SCR-ACC-004: Dòng Tiền (Cash Flow)

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-ACC-004 |
| **Screen Name** | Báo Cáo Dòng Tiền |
| **Component** | `CashFlow.tsx` |

### 2. Functional Specifications

**Cash Flow Structure**:
```
OPERATING ACTIVITIES
  + Cash from Sales
  - Cash for Purchases
  - Operating Expenses
  = Net Cash from Operations

INVESTING ACTIVITIES
  - Purchase of Fixed Assets
  + Sale of Fixed Assets
  = Net Cash from Investing

FINANCING ACTIVITIES
  + Loans Received
  - Loan Repayments
  - Dividends Paid
  = Net Cash from Financing

NET INCREASE/DECREASE IN CASH
+ Opening Cash Balance
= CLOSING CASH BALANCE
```

---

## 🎯 SCR-ACC-005: Công Nợ Phải Thu (AR)

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-ACC-005 |
| **Screen Name** | Công Nợ Phải Thu |
| **Component** | `Receivables.tsx` |

### 2. Functional Specifications

**Aging Analysis**:
```
Customer Aging Report
├── 0-30 days (Current)
├── 31-60 days (Overdue 1)
├── 61-90 days (Overdue 2)
└── 90+ days (Bad Debt Risk)
```

**Features**:
- Customer aging table
- Overdue invoices list
- Collection actions tracking
- Bad debt provision calculation
- Send payment reminders

**Table Columns**:
- Customer Name
- Invoice Number
- Invoice Date
- Due Date
- Amount
- Days Overdue
- Status
- Actions

---

## 🎯 SCR-ACC-006: Công Nợ Phải Trả (AP)

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-ACC-006 |
| **Screen Name** | Công Nợ Phải Trả |
| **Component** | `Payables.tsx` |

### 2. Functional Specifications

**Supplier Aging**:
- 0-30 days
- 31-60 days
- 61-90 days
- 90+ days

**Features**:
- Supplier aging report
- Payment due dates
- Payment scheduling
- Early payment discounts
- Payment batch processing

---

## 🎯 SCR-ACC-007: Báo Cáo Thuế

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-ACC-007 |
| **Screen Name** | Báo Cáo Thuế |
| **Component** | `TaxReport.tsx` |

### 2. Functional Specifications

**Tax Types**:

**1. VAT (Value Added Tax)**
```
Output VAT (Sales)
- Input VAT (Purchases)
= VAT Payable/Refundable
```

**2. Corporate Income Tax (CIT)**
```
Accounting Profit
+/- Tax Adjustments
= Taxable Income
* Tax Rate (20%)
= CIT Payable
```

**3. Personal Income Tax (PIT)**
- Employee salary tax
- Withholding tax

**Features**:
- Monthly VAT declaration
- Quarterly CIT declaration
- Annual CIT finalization
- Tax filing status tracking
- Export tax reports

---

## 🎯 SCR-ACC-008: Báo Cáo Quản Lý

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-ACC-008 |
| **Screen Name** | Báo Cáo Quản Lý |
| **Component** | `ManagementReport.tsx` |

### 2. Functional Specifications

**Custom KPIs**:
- Revenue by department
- Profit by product line
- Sales per employee
- Customer acquisition cost
- Customer lifetime value

**Features**:
- Customizable dashboard
- Department performance
- Variance analysis (Budget vs Actual)
- Executive summary
- Export to PDF

---

## 🎯 SCR-ACC-009: Tài Sản Cố Định

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-ACC-009 |
| **Screen Name** | Tài Sản Cố Định |
| **Component** | `FixedAssets.tsx` |

### 2. Functional Specifications

**Asset Categories**:
- Land & Buildings
- Machinery & Equipment
- Vehicles
- Furniture & Fixtures
- Computers & IT Equipment

**Asset Register Fields**:
- Asset Code
- Description
- Category
- Acquisition Date
- Acquisition Cost
- Useful Life (years)
- Depreciation Method
- Accumulated Depreciation
- Net Book Value
- Location
- Status (ACTIVE/DISPOSED)

**Actions**:
- Add new asset
- Dispose asset
- Transfer asset
- Revalue asset

---

## 🎯 SCR-ACC-010: Khấu Hao

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-ACC-010 |
| **Screen Name** | Khấu Hao Tài Sản |
| **Component** | `Depreciation.tsx` |

### 2. Functional Specifications

**Depreciation Methods**:

**1. Straight-Line Method**
```
Annual Depreciation = (Cost - Salvage Value) / Useful Life
```

**2. Declining Balance Method**
```
Annual Depreciation = Net Book Value * Depreciation Rate
```

**Features**:
- Depreciation schedule
- Monthly depreciation calculation
- Accumulated depreciation tracking
- Net book value calculation
- Depreciation journal entries

---

## 🎯 SCR-ACC-011: Phân Tích Chi Phí

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-ACC-011 |
| **Screen Name** | Phân Tích Chi Phí |
| **Component** | `CostAnalysis.tsx` |

### 2. Functional Specifications

**Cost Centers**:
- Sales Department
- Service Department
- Parts Department
- Administration
- Marketing

**Analysis Types**:
- Budget vs Actual
- Variance analysis
- Cost per unit
- Cost trends
- Cost optimization recommendations

**Charts**:
- Cost breakdown (Pie chart)
- Cost trends (Line chart)
- Budget variance (Bar chart)

---

## 📝 Module 7 Summary

### UI Components Inventory

**Reused Components**:
- ✅ Card, Table, Button, Input
- ✅ Select, DatePicker, Badge
- ✅ Recharts (Line, Pie, Bar charts)

**Custom Components**:
- ✅ Financial statement layouts
- ✅ Aging analysis tables
- ✅ Variance charts

### GAPs Analysis

**✅ NO GAPS IDENTIFIED**

Tất cả 11 screens đã có components implementation đầy đủ.

### Data Models

**Primary Models**:
- `Transaction` - Giao dịch kế toán
- `Invoice` - Hóa đơn
- `Payment` - Thanh toán
- `FixedAsset` - Tài sản cố định
- `TaxDeclaration` - Khai báo thuế

### Business Rules

| Rule ID | Description |
|---------|-------------|
| BR-ACC-001 | VAT = 10% for most transactions |
| BR-ACC-002 | AR aging > 90 days = Bad debt provision |
| BR-ACC-003 | Depreciation: Straight-line over useful life |
| BR-ACC-004 | Financial reports: Monthly close by day 5 |
| BR-ACC-005 | Budget variance > 10% requires explanation |
| BR-ACC-006 | Balance Sheet must balance (Assets = Liabilities + Equity) |
| BR-ACC-007 | CIT rate = 20% of taxable income |
| BR-ACC-008 | Fixed assets > 30M: Capitalize & depreciate |
| BR-ACC-009 | Fixed assets < 30M: Expense immediately |
| BR-ACC-010 | Depreciation starts from month of acquisition |

---

**End of Module 7 FRD**
