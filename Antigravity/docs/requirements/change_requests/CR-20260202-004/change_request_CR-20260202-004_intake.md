# CR Intake: Upgrade Quotation Module to Match Refs

**CR ID**: CR-20260202-004
**Date**: 2026-02-02
**Author**: Antigravity (on behalf of User)
**Status**: APPROVED

## 1. Description
Upgrade the current "Quotation" (Báo giá) module in the Sales system to match the features and UX/UI of the Reference implementation (Refs). The current implementation is an MVP missing critical sales functionalities found in the Refs version.

**Scope of Work**:
- **Quotation Form (UI/UX)**:
    - Add **Payment Tab**: Installment calculation, bank selection, prepayment logic.
    - Add **Notes Tab**: Internal notes vs Customer notes, attachment management.
    - **Promotion Logic**: Replace simple checkboxes with a flexible "Add Promotion" system (Discount, Gifts, Services) allowing custom descriptions and values.
    - **Analysis Dashboard**: enhance with Margin warnings, Commission scenarios, and collapsible cost breakdowns.
- **Quotation List (UI/UX)**:
    - **Dashboard**: Add top-level stats cards (Total, Draft, Approved, Total Value).
    - **Table**: Add columns for Discount, Final Amount, Expiry Date.
    - **Actions**: Replace dropdown with direct action icons (View, Edit, VOIP Call, Email, PDF).
- **Backend/API**:
    - Support new data structures for Payment methodology, complex Promotions, and rich Notes.
    - Update Pricing Engine to handle new promotion types and cost calculations.

## 2. Justification
The current Quotation module (`components/sales/QuotationForm.tsx`) lacks 40-50% of the features present in the Reference design (`Refs/...`). Missing features like Installment Calculation and flexible Promotions are critical for the car sales process. Aligning with Refs ensures the system meets business needs for a professional Sales tool.

## 3. Impact Assessment (High Level)
- **BRD**: No change to high-level goals, but "Sales Process" flow details will be refined.
- **FRD**: Major updates to **Sales Module** (Quotation Screen, Quotation List). New logic for Pricing & Promotions.
- **ERD**: Updates to `Sales_Quotations`, `Sales_Promotion_Items`, `Sales_Payment_Plans` (new entities likely needed).
- **API**: Update `POST /quotations` to accept complex nested data (payment, notes). New endpoints for calculating installments or retrieving promotion config.
- **UI**: Significant overhaul of `QuotationForm` and `QuoteList` to match Refs structure.

## 4. Priority
**HIGH** - The disparity between implementation and design (Refs) is significant and affects the core value of the Sales module.

## 5. Decision
**APPROVED** based on User Request and Gap Analysis Report.
