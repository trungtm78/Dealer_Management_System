# Database Migration Plan v1.0

**Date:** 2026-01-28
**Authority:** OpenCode – Database Implementation Authority
**Reference:** ERD v1.0, Data Dictionary v1.0

## 1. Summary of Changes
This migration aligns the database schema with the official ERD v1.0. It introduces missing modules (Accounting, Parts, Insurance) and enforces strict data types and constraints as defined in the Data Dictionary.

## 2. Affected Tables

### 2.1 New Tables
- `activity_logs`: Audit tracking.
- `system_metrics`: Performance monitoring.
- `reminders`: Customer notifications.
- `loyalty_transactions`: Points history.
- `complaints`: Customer feedback management.
- `vins`: Master inventory (replacing `VehicleInventory`).
- `contracts`: Vehicle sales contracts.
- `pds_checklists`: Pre-delivery service records.
- `ro_line_items`: Detailed repair order items.
- `work_logs`: Technician activity logs.
- `qc_checklists`: Quality control records.
- `suppliers`: Parts suppliers.
- `purchase_orders` & `po_line_items`: Parts procurement.
- `stock_takes` & `stock_take_items`: Inventory auditing.
- `invoices` & `payments`: Financial management.
- `transactions`: General ledger entries.
- `fixed_assets` & `depreciation_schedules`: Asset management.
- `tax_declarations`: Tax reporting.
- `vehicle_models`, `accessories`, `services_catalog`: Master data.

### 2.2 Modified Tables
- `users`: Renamed `password` to `password_hash`, updated `role` to Enum, added `department`, `phone`, `status`.
- `leads`: Added `customer_type`, `customer_id` (FK), updated `status` and `source` to Enums.
- `customers`: Updated `type` and `tier` to Enums.
- `quotations`: Updated `status` to Enum, aligned fields with ERD.
- `interactions`: Updated `type` to `ActivityType` Enum.
- `deposits`: Updated `status` and `payment_method` to Enums.

## 3. Enums Introduced
- `UserRole`, `LeadSource`, `LeadStatus`, `CustomerType`, `LoyaltyTier`, `QuotationStatus`, `TestDriveStatus`, `VinStatus`, `DepositStatus`, `ServiceAppointmentStatus`, `RepairOrderStatus`, `StockMovementType`, `PurchaseOrderStatus`, `InsuranceContractStatus`, `InsuranceClaimStatus`, `PaymentMethod`, `TransactionType`, `ActivityType`, `ReminderType`, `ComplaintStatus`, `CampaignType`, `CampaignStatus`.

## 4. Constraints & Indexes
- Enforced `UNIQUE` on `customers.phone`.
- Enforced `UNIQUE` on `users.email`.
- Enforced `UNIQUE` on all `_number` fields (QT, RO, INV, etc.).
- Added performance indexes on `status`, `created_at`, and foreign keys.

## 5. Compliance Check
- PK: All tables use `String` ID (CUID).
- FK: All relationships reflect 1:N or 1:1 as per ERD.
- Datatypes: Prices/Amounts use `Decimal` for precision.
