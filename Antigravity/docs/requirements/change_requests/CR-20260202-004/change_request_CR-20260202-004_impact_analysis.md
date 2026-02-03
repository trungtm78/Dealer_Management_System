# CR Impact Analysis: Upgrade Quotation Module

**CR ID**: CR-20260202-004
**Based on**: CR Intake (APPROVED), `quotation_gap_analysis_report.md`
**Date**: 2026-02-02

## 1. Impact Matrix

| Document | Current Version | Impact Level | Action |
| :--- | :--- | :--- | :--- |
| **BRD** | `brd_honda_dms_v2.2.md` | Low | Update Sales features list to include Installment Calculation & flexible Promotions. |
| **FRD** | `frd_sales_v1.0.md` | **High** | Rewrite Quotation Management section. Define details for Payment Tab, Notes Tab, Promotion Logic. |
| **ERD** | `erd_changes_v1.2.md` | **Medium** | Add columns/tables for `payment_method`, `down_payment`, `installment_period`, `promotions_json`, `notes_internal`. |
| **API Spec** | `api_spec_sales_v1.0.md` | **Medium** | Update Quotation Schema. Add `promotions` array, `payment_config` object. |
| **UI Spec** | `ui_spec_v1.5.md` | **High** | Replace previous wireframes with Refs-based design (5 Tabs, Dashboard List). |

## 2. Detailed Changes

### 2.1. BRD Impact
- **Module**: Sales
- **Change**: Explicitly mention "Financial Consultation" (Tính toán trả góp) and "Flexible Promotion Management" as key features of the Quotation system.

### 2.2. FRD Impact (Sales Module)
- **Screen: Quotation List**:
    - Add "Dashboard Stats" requirement.
    - Add "Quick Actions" requirement (VOIP, Email).
- **Screen: Quotation Form**:
    - **Tabs**: Require 5 tabs (Info, Accessories, Payment, Analysis, Notes).
    - **Logic**:
        - **Payment**: Calculate monthly payment based on Interest Rate, Loan Term, Prepayment %.
        - **Promotions**: Allow adding multiple promotions of different types (Discount, Gift, Service).
        - **Pricing**: `Final = Base + Acc + Service + Insurance + RegFees + OtherFees - Discount - Promotions(Cash)`.

### 2.3. ERD Impact
- **Table**: `Sales_Quotations`
    - Add: `payment_method` (ENUM), `bank_id` (FK), `loan_amount`, `loan_term`, `interest_rate`.
    - Add: `customer_notes` (TEXT), `internal_notes` (TEXT).
- **Table**: `Sales_Quotation_Promotions` (New or JSON in Quotations)
    - Suggest using a separate table `Sales_Quotation_Promotions` for normalized data: `quotation_id`, `type` (DISCOUNT/GIFT/SERVICE), `value`, `description`.
- **Table**: `Sales_Quotation_Attachments` (New)
    - `quotation_id`, `file_name`, `file_url`, `type`.

### 2.4. API Spec Impact
- **Endpoint**: `POST /api/v1/sales/quotations`
    - **Body**: Update to support `paymentInfo` object, `promotions` array, `notes` object.
- **Endpoint**: `GET /api/v1/sales/quotations/{id}`
    - **Response**: detailed object including all the above.
- **New Endpoint**: `POST /api/v1/sales/quotations/calculate-installment` (Optional, can be FE logic).

### 2.5. UI Spec Impact
- Standardize on `Refs/src/app/components/QuotationForm.tsx` as the **Golden Source**.
- **Requirement**: "UI must match Refs implementation 100% regarding layout and features."

## 3. Risk Assessment
- **Complexity**: Medium-High (New logic for OTR & Installments).
- **Risk**: Low (Refs code already exists, main risk is backend integration).
- **Effort**: 3-5 Man-days.

## 4. Next Steps (CR-03)
- Create drafts for FRD (Sales), API (Sales), ERD (Additions).
