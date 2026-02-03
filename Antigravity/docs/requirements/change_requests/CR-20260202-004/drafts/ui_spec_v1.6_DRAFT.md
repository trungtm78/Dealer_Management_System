# UI Spec v1.6 [DRAFT CR-20260202-004]

## 1. Screen: Quotation Form (`/sales/quotation`)
- **Structure**: 5 Tabs (Info, Accessories, Payment, Analysis, Notes).
- **Reference**: `Refs/src/app/components/QuotationForm.tsx`.
- **Key Changes**:
  - Implement **Payment Tab** UI from Refs.
  - Implement **Notes Tab** UI from Refs.
  - Replace Checklist Promotion with **Dynamic Promotion List** (Add/Edit/Delete logic).

## 2. Screen: Quotation List (`/sales/quotations`)
- **Structure**: Dashboard Header + Data Table.
- **Reference**: `Refs/src/app/components/QuotationList.tsx`.
- **Key Changes**:
  - Add 4 KPI Cards at top.
  - Add VOIP/Action icons to table rows.
