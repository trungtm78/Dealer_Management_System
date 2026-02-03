# Honda DMS - API Specification
## Module 7: Accounting

**Version**: 1.0  
**Date**: 2026-01-28  
**Module**: Accounting  
**Total APIs**: 20

---

## 📋 Module Overview

**Purpose**: Quản lý kế toán, hóa đơn, thanh toán, báo cáo tài chính

**FRD References**: SCR-ACC-001 to SCR-ACC-008

**Sub-modules**:
1. **Invoices** (5 APIs)
2. **Payments** (5 APIs)
3. **Reports** (10 APIs)

---

## 🔹 Invoices (5 APIs)

### API-ACC-001: List Invoices
- **Endpoint**: `GET /api/accounting/invoices`
- **ERD**: `invoices`, JOIN `customers`
- **Response**: Array of invoices

### API-ACC-002: Create Invoice
- **Endpoint**: `POST /api/accounting/invoices`
- **ERD**: `invoices` INSERT
- **Response**: Created invoice with invoice_number

### API-ACC-003: Get Invoice Detail
- **Endpoint**: `GET /api/accounting/invoices/{id}`
- **ERD**: `invoices`, JOIN `customers`, `payments`
- **Response**: Full invoice details

### API-ACC-004: Update Invoice
- **Endpoint**: `PUT /api/accounting/invoices/{id}`
- **ERD**: `invoices` UPDATE
- **Response**: Updated invoice

### API-ACC-005: Void Invoice
- **Endpoint**: `POST /api/accounting/invoices/{id}/void`
- **ERD**: `invoices` UPDATE status='VOIDED'
- **Response**: Voided invoice

---

## 🔹 Payments (5 APIs)

### API-ACC-006: List Payments
- **Endpoint**: `GET /api/accounting/payments`
- **ERD**: `payments`, JOIN `invoices`, `customers`
- **Response**: Array of payments

### API-ACC-007: Create Payment
- **Endpoint**: `POST /api/accounting/payments`
- **ERD**: `payments` INSERT, `invoices` UPDATE paid_amount
- **Response**: Created payment with payment_number

### API-ACC-008: Get Payment Detail
- **Endpoint**: `GET /api/accounting/payments/{id}`
- **ERD**: `payments`, JOIN `invoices`
- **Response**: Full payment details

### API-ACC-009: Refund Payment
- **Endpoint**: `POST /api/accounting/payments/{id}/refund`
- **ERD**: `payments` INSERT (negative amount)
- **Response**: Refund result

### API-ACC-010: Get Payment Summary
- **Endpoint**: `GET /api/accounting/payments/summary`
- **ERD**: Aggregate from `payments`
- **Response**: Payment summary by method, date range

---

## 🔹 Reports (10 APIs)

### API-ACC-011: Get P&L Report
- **Endpoint**: `GET /api/accounting/reports/pl`
- **ERD**: Aggregate from `transactions`, `invoices`, `payments`
- **Response**: Profit & Loss statement

### API-ACC-012: Get Balance Sheet
- **Endpoint**: `GET /api/accounting/reports/balance-sheet`
- **ERD**: Aggregate from `transactions`, `fixed_assets`
- **Response**: Balance sheet

### API-ACC-013: Get Cash Flow
- **Endpoint**: `GET /api/accounting/reports/cash-flow`
- **ERD**: Aggregate from `payments`, `transactions`
- **Response**: Cash flow statement

### API-ACC-014: Get AR Report
- **Endpoint**: `GET /api/accounting/reports/ar`
- **ERD**: Aggregate from `invoices` WHERE status='UNPAID'
- **Response**: Accounts Receivable aging

### API-ACC-015: Get AP Report
- **Endpoint**: `GET /api/accounting/reports/ap`
- **ERD**: Aggregate from `purchase_orders`, `invoices`
- **Response**: Accounts Payable aging

### API-ACC-016: Get Revenue Report
- **Endpoint**: `GET /api/accounting/reports/revenue`
- **ERD**: Aggregate from `invoices`, `payments`
- **Response**: Revenue by period, category

### API-ACC-017: Get Expense Report
- **Endpoint**: `GET /api/accounting/reports/expense`
- **ERD**: Aggregate from `transactions` WHERE type='DEBIT'
- **Response**: Expense by category

### API-ACC-018: Get Tax Report
- **Endpoint**: `GET /api/accounting/reports/tax`
- **ERD**: Aggregate from `invoices`, `tax_declarations`
- **Response**: Tax summary (VAT, CIT)

### API-ACC-019: Get Fixed Assets Report
- **Endpoint**: `GET /api/accounting/reports/assets`
- **ERD**: Aggregate from `fixed_assets`, `depreciation_schedules`
- **Response**: Fixed assets summary

### API-ACC-020: Export Report
- **Endpoint**: `GET /api/accounting/reports/{type}/export`
- **ERD**: Read from respective tables
- **Response**: Excel/PDF file

---

**End of Module 7: Accounting (20 APIs)**
