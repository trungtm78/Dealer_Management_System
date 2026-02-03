# Functional Requirements Document (FRD)
## Honda Dealer Management System - Module 3: Bán Hàng (Sales)

---

## 📋 Document Control

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Module** | Module 3 - Bán Hàng (Sales) |
| **Số Screens** | 8 |
| **Phiên Bản** | 1.1 (Enhanced) |
| **Ngày Tạo** | 02/02/2026 |
| **Change Log** | v1.1: Updated Quotation Form (Payment/Notes/Promotions) & List (Dashboard) per CR-20260202-004. Added detailed calculation formulas from Refs. |

---

## 🎯 SCR-SAL-001: Tạo Báo Giá (Enhanced)

### 3. Functional Specifications

#### 3.3 Tab 3: Thanh Toán (Payment)
**Purpose**: Calculate installment plan and payment schedule.

**Fields**:
- **Payment Method**: Cash / Installment
- **Bank Selection**: Dropdown (VPBank, Vietcombank, BIDV, Techcombank, MB Bank)
- **Prepayment %**: 20%, 30%, 40%, 50%
- **Loan Term**: 12, 24, 36, 48, 60 months
- **Interest Rate**: % per year (default: 8.5%)

**Calculation Logic**:
```typescript
// PMT Formula (Monthly Payment)
const loanAmount = finalTotal * (1 - prepaymentRatio);
const monthlyRate = annualInterestRate / 12 / 100;
const numPayments = loanTerm;

const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                       (Math.pow(1 + monthlyRate, numPayments) - 1);

const totalInterest = (monthlyPayment * numPayments) - loanAmount;
```

**Output Display**:
- Monthly Payment (PMT)
- Total Interest
- Payment Schedule (Array of {month, principal, interest, balance})

#### 3.4 Tab 4: Phân Tích Giá (Analysis) - Enhanced

**OTR Calculator**:
```typescript
const otrTotal = basePrice + accessoriesTotal + servicesTotal + 
                 insurance + registrationTax + registration + otherFees;

// Where:
// insurance = 23,000,000 VND (fixed)
// registrationTax = basePrice * 10%
// registration = 15,000,000 VND (fixed)
// otherFees = 2,500,000 VND (fixed)
```

**Revenue Calculation**:
```typescript
const finalTotal = otrTotal + promotionValue - discountAmount;
// promotionValue is NEGATIVE (e.g., -15,000,000)
// discountAmount is POSITIVE

const totalRevenue = finalTotal;
```

**Cost Breakdown**:
```typescript
const manufacturerCost = 1,150,000,000; // Fixed for CR-V
const accessoryCost = accessoriesTotal * 0.7; // 70% of retail
const serviceCost = servicesTotal * 0.5; // 50% of retail
const promotionCost = Math.abs(promotionValue);
const discountCost = discountAmount;
const actualCommissionAmount = parseFloat(actualCommission) || 0;

const totalCost = manufacturerCost + accessoryCost + serviceCost + 
                  insurance + registrationTax + registration + otherFees +
                  operatingCost + marketingCost + promotionCost + 
                  discountCost + actualCommissionAmount;

// Fixed costs:
// operatingCost = 25,000,000 VND
// marketingCost = 15,000,000 VND
```

**Profit Analysis**:
```typescript
const grossProfit = totalRevenue - totalCost;
const profitMargin = (grossProfit / totalRevenue) * 100;
```

**Margin Warning Thresholds**:
- **Green** (Good): profitMargin >= 15%
- **Orange** (Medium): 10% <= profitMargin < 15%
- **Yellow** (Low): 5% <= profitMargin < 10%
- **Red** (Critical): profitMargin < 5%
- **Red** (Loss): profitMargin < 0%

**Commission Scenarios**:
- **Standard Commission**: 40,000,000 VND (fixed baseline)
- **Editable Commission**: User can adjust actual commission
- **Quick Scenarios**: 30M (Low), 40M (Standard), 50M (High), 60M (Very High)

**Interactive Features**:
- **Collapsible Sections**: Revenue breakdown (Accessories, Services, Promotions)
- **Collapsible Sections**: Cost breakdown (Manufacturer, Accessories, Services, Operating, Marketing, Commission)
- **Dialog Popups**: Click on Revenue/Cost cards to see detailed breakdown

#### 3.5 Tab 5: Ghi Chú (Notes)
- **Customer Notes**: Text area (visible on printed quote)
- **Internal Notes**: Text area (internal only)
- **Attachments**: File upload (ID Card, Household Book, etc.)

---

## 🎯 SCR-SAL-002: Danh Sách Báo Giá (Enhanced)

### 3. Functional Specifications

**Dashboard Stats (Top Cards)**:
- **Total Quotes**: Count of all quotations
- **Draft**: Count with status='DRAFT'
- **Sent**: Count with status='SENT'
- **Approved**: Count with status='APPROVED'
- **Total Value**: SUM(total_price) in Billion VND

**Table Columns**:
- Quote Number (clickable)
- Customer Name
- Model + Version
- **Discount** (Amount) [NEW]
- **Final Price** [NEW]
- Status (Badge with color)
- **Expiry Date** [NEW]
- Actions (Direct Icons)

**Actions (Direct Icons)**:
- 👁️ View (readonly)
- ✏️ Edit (if DRAFT)
- 📞 VOIP Call (click-to-dial)
- 📧 Email (send quote)
- 📄 PDF Export
- 🗑️ Delete (if DRAFT)

---

## Business Rules (Updated)

| Rule ID | Description | Formula |
|---------|-------------|---------|
| BR-SAL-011 | OTR Total Calculation | `basePrice + accessories + services + insurance + regTax + regFee + otherFees` |
| BR-SAL-012 | Final Total Calculation | `OTR + promotions - discount` |
| BR-SAL-013 | Manufacturer Cost | Fixed: 1,150,000,000 VND (CR-V) |
| BR-SAL-014 | Accessory Cost Rate | 70% of retail price |
| BR-SAL-015 | Service Cost Rate | 50% of retail price |
| BR-SAL-016 | Standard Commission | Fixed: 40,000,000 VND |
| BR-SAL-017 | Operating Cost | Fixed: 25,000,000 VND per deal |
| BR-SAL-018 | Marketing Cost | Fixed: 15,000,000 VND per deal |
| BR-SAL-019 | Profit Margin Warning | Red if < 5%, Orange if < 10%, Green if >= 15% |
| BR-SAL-020 | PMT Calculation | Standard loan amortization formula |

---
**End of Module 3 FRD v1.1 (Enhanced)**
