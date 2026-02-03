# Functional Requirements Document (FRD)
## Honda Dealer Management System - Module 3: Bán Hàng (Sales)

---

## 📋 Document Control

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Module** | Module 3 - Bán Hàng (Sales) |
| **Số Screens** | 8 |
| **Phiên Bản** | 1.1 [DRAFT CR-20260202-004] |
| **Ngày Tạo** | 02/02/2026 |

---

## 📊 Module Overview

**Mục đích**: Quản lý toàn bộ quy trình bán xe từ Báo Giá → Lái Thử → Đặt Cọc → Hợp Đồng → Giao Xe

**Screens trong Module**:

| # | Screen ID | Screen Name | Route | Component File |
|---|-----------|-------------|-------|----------------|
| 1 | SCR-SAL-001 | Tạo Báo Giá | `/sales/quotation` | `QuotationForm.tsx` |
| 2 | SCR-SAL-002 | Danh Sách Báo Giá | `/sales/quotations` | `QuotationList.tsx` |
| ... | ... | ... | ... | ... |

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

**Ui Patterns**:

| Pattern | Component | Description |
|---------|-----------|-------------|
| **Multi-Step Form** | `Tabs` component | **5 tabs**: Info, Accessories, **Payment**, Analysis, **Notes** |
| **Promotion Engine** | `PromotionDialog` | Flexible promotion types (Cash, Gift, Service) |
| **Installment Calc** | `PaymentCalculator` | Real-time banking simulation |

### 3. Functional Specifications

#### 3.1 Tab 1: Thông Tin & Xe
*(No major changes, retain v1.0 logic)*

#### 3.2 Tab 2: Phụ Kiện & Dịch Vụ
*(No major changes, retain v1.0 logic)*

#### 3.3 Tab 3: Thanh Toán (Payment) [NEW]
**Purpose**: Calculate installment plan and payment schedule.

**Fields**:
- **Payment Method**: Cash / Installment (Trả góp)
- **Bank Selection**: Dropdown (from Master Data)
- **Loan Ratio**: Slider/Input (e.g., 80% of vehicle value)
- **Loan Term**: 12/24/36/48/60/72/84 months
- **Interest Rate**: % per year (editable, default from Bank)
- **Prepayment**: Amount (Calculate: `Total - Loan Amount`)

**Output Display**:
- Monthly Payment (PMT calculation)
- Total Interest
- Total Payment Amount

#### 3.4 Tab 4: Phân Tích Giá (Analysis)
**Config Section**:
- **Discount input**: Removed (moved to Promotions)
- **Commission input**: Editable
- **Promotions**: "Add Promotion" Button -> Opens Dialog.

**Promotion Dialog**:
- Type: Money Discount / Gift Item / Service Package
- Value: Amount or Item Name
- Description: Custom text
- Apply to: OTR Price

**Profit Analysis Card**:
- Updated to include detailed breakdown of "Promotions" (Cash/Gift/Service costs).
- Collapsible sections for "Vehicle Cost", "Accessory Cost", "Operation Cost".
- **Margin Warning**: Color-coded (Red < 1%, Orange < 3%, Green > 3%).

#### 3.5 Tab 5: Ghi Chú (Notes) [NEW]
**Sections**:
1. **Customer Notes**: Text area (Will appear on printed Quote).
2. **Internal Notes**: Text area (Only visible to Sales/Manager).
3. **Attachments**: Upload ID Card, Household Book, etc.

---

## 🎯 SCR-SAL-002: Danh Sách Báo Giá

### 3. Functional Specifications

**New Dashboard Header**:
- Cards: Total Quotes, Draft, Sent, Approved, Total Value (VND).

**Table Columns**:
- Added: **Discount** (Amount), **Final Price**, **Expiry Date**.

**Actions (Direct Icons)**:
- 👁️ View
- ✏️ Edit
- 📞 VOIP Call (Click to dial)
- 📧 Email
- 📄 PDF Export

---

## Data Requirements (Updated)

**Entity: Sales_Quotations**
- Add `payment_method` (ENUM)
- Add `loan_amount`, `loan_term`, `interest_rate`, `bank_id`
- Add `customer_notes`, `internal_notes`
- Add `promotions` (JSON or Related Table)

---
**End of Module 3 FRD v1.1**
