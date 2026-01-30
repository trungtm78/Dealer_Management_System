# Database Schema Snapshot v1.0

**Date:** 2026-01-28
**Status:** Implemented (Prisma Migrate)

## 1. Tables & Columns

### 1.1 Module: Admin
- **User**: `id`, `email`, `password_hash`, `name`, `role`, `department`, `phone`, `status`, `last_login`, `created_at`, `updated_at`.
- **ActivityLog**: `id`, `user_id`, `action`, `entity`, `entity_id`, `details`, `ip_address`, `created_at`.
- **SystemMetric**: `id`, `metric_type`, `value`, `unit`, `timestamp`.

### 1.2 Module: CRM
- **Lead**: `id`, `name`, `phone`, `email`, `address`, `model_interest`, `model_version`, `budget`, `source`, `status`, `score`, `notes`, `customer_type`, `customer_id`, `assigned_to_id`, `created_at`, `updated_at`.
- **Customer**: `id`, `name`, `type`, `phone`, `mobile`, `email`, `street`, `ward`, `district`, `city`, `vat`, `tier`, `points`, `total_points`, `tags`, `notes`, `member_since`, `last_transaction_date`, `created_at`, `updated_at`.
- **Interaction**: `id`, `lead_id`, `customer_id`, `user_id`, `type`, `outcome`, `notes`, `metadata`, `created_at`.
- **ScoringRule**: `id`, `name`, `category`, `condition`, `points`, `is_active`, `created_at`, `updated_at`.
- **Reminder**: `id`, `customer_id`, `type`, `scheduled_date`, `message`, `channel`, `status`, `sent_at`, `created_at`.
- **LoyaltyTransaction**: `id`, `customer_id`, `points`, `type`, `reason`, `reference_id`, `created_at`.
- **Complaint**: `id`, `customer_id`, `category`, `priority`, `status`, `description`, `resolution`, `assigned_to_id`, `created_at`, `updated_at`, `resolved_at`.
- **MarketingCampaign**: `id`, `name`, `type`, `status`, `target_segment`, `budget`, `start_date`, `end_date`, `sent_count`, `opened_count`, `clicked_count`, `converted_count`, `created_by_id`, `created_at`, `updated_at`.

### 1.3 Module: Sales
- **Quotation**: `id`, `quote_number`, `customer_id`, `customer_name`, `customer_phone`, `model`, `version`, `color`, `base_price`, `accessories`, `services`, `insurance`, `registration_tax`, `registration_fee`, `other_fees`, `discount`, `promotion_value`, `total_price`, `status`, `valid_until`, `created_by_id`, `created_at`, `updated_at`.
- **TestDrive**: `id`, `customer_id`, `model`, `scheduled_date`, `scheduled_time`, `status`, `sales_consultant_id`, `feedback`, `created_at`, `updated_at`.
- **Vin**: `id`, `vin_number`, `model`, `version`, `color`, `year`, `status`, `arrival_date`, `allocated_to_contract_id`, `created_at`, `updated_at`.
- **Contract**: `id`, `contract_number`, `quotation_id`, `customer_id`, `vin_id`, `total_amount`, `deposit_amount`, `remaining_amount`, `payment_method`, `contract_date`, `delivery_date`, `status`, `created_by_id`, `created_at`, `updated_at`.
- **Deposit**: `id`, `receipt_number`, `customer_id`, `customer_name`, `contract_id`, `contract_number`, `amount`, `payment_method`, `status`, `notes`, `received_by_id`, `created_at`, `updated_at`.
- **PDSChecklist**: `id`, `contract_id`, `vin_id`, `exterior_check`, `interior_check`, `mechanical_check`, `documentation_check`, `photos`, `inspector_id`, `customer_signature`, `inspector_signature`, `delivery_date`, `created_at`, `updated_at`.

### 1.4 Module: Service
- **ServiceQuote**: `id`, `quote_number`, `customer_id`, `vehicle_info`, `services`, `parts`, `total_labor`, `total_parts`, `sub_total`, `vat`, `total_amount`, `status`, `advisor_id`, `expiry_date`, `notes`, `created_at`, `updated_at`.
- **ServiceAppointment**: `id`, `customer_id`, `vehicle_info`, `service_type`, `scheduled_date`, `scheduled_time`, `status`, `advisor_id`, `bay_number`, `notes`, `created_at`, `updated_at`.
- **RepairOrder**: `id`, `ro_number`, `appointment_id`, `customer_id`, `vehicle_info`, `mileage`, `fuel_level`, `customer_complaints`, `inspection_notes`, `status`, `advisor_id`, `technician_id`, `bay_number`, `estimated_completion`, `actual_completion`, `created_at`, `updated_at`.
- **ROLineItem**: `id`, `ro_id`, `item_type`, `item_code`, `item_name`, `quantity`, `unit_price`, `total_price`, `created_at`.
- **WorkLog**: `id`, `ro_id`, `technician_id`, `work_description`, `hours_spent`, `status`, `photos`, `notes`, `created_at`, `updated_at`.
- **QCChecklist**: `id`, `ro_id`, `checklist_items`, `photos`, `qc_result`, `qc_by_id`, `rework_notes`, `created_at`.

### 1.5 Module: Parts
- **Part**: `id`, `part_number`, `name`, `description`, `category`, `quantity`, `min_stock`, `max_stock`, `unit_price`, `cost_price`, `supplier_id`, `location`, `status`, `created_at`, `updated_at`.
- **Supplier**: `id`, `code`, `name`, `contact_person`, `phone`, `email`, `address`, `payment_terms`, `status`, `created_at`, `updated_at`.
- **StockMovement**: `id`, `part_id`, `type`, `quantity`, `reference_type`, `reference_id`, `notes`, `user_id`, `created_at`.
- **PurchaseOrder**: `id`, `po_number`, `supplier_id`, `status`, `order_date`, `expected_delivery_date`, `actual_delivery_date`, `total_amount`, `notes`, `created_by_id`, `created_at`, `updated_at`.
- **POLineItem**: `id`, `po_id`, `part_id`, `quantity`, `unit_price`, `total_price`, `received_quantity`, `created_at`.
- **StockTake**: `id`, `session_number`, `session_date`, `status`, `counted_by_id`, `approved_by_id`, `notes`, `created_at`, `completed_at`.
- **StockTakeItem**: `id`, `stock_take_id`, `part_id`, `system_quantity`, `actual_quantity`, `variance`, `notes`, `created_at`.

### 1.6 Module: Insurance
- **InsuranceContract**: `id`, `contract_number`, `customer_id`, `vehicle_id`, `insurance_type`, `insurance_company`, `policy_number`, `premium_amount`, `coverage_amount`, `start_date`, `end_date`, `status`, `notes`, `created_by_id`, `created_at`, `updated_at`.
- **InsuranceClaim**: `id`, `claim_number`, `contract_id`, `incident_date`, `incident_type`, `incident_description`, `claim_amount`, `approved_amount`, `status`, `documents`, `notes`, `reviewed_by_id`, `reviewed_at`, `paid_at`, `created_at`, `updated_at`.

### 1.7 Module: Accounting
- **Invoice**: `id`, `invoice_number`, `customer_id`, `invoice_type`, `reference_id`, `invoice_date`, `due_date`, `sub_total`, `vat`, `total_amount`, `paid_amount`, `status`, `notes`, `created_by_id`, `created_at`, `updated_at`.
- **Payment**: `id`, `payment_number`, `invoice_id`, `payment_date`, `amount`, `payment_method`, `reference_number`, `notes`, `received_by_id`, `created_at`.
- **Transaction**: `id`, `transaction_date`, `type`, `account_code`, `description`, `debit`, `credit`, `reference_type`, `reference_id`, `created_by_id`, `created_at`.
- **FixedAsset**: `id`, `asset_code`, `asset_name`, `category`, `acquisition_date`, `acquisition_cost`, `useful_life_years`, `depreciation_method`, `accumulated_depreciation`, `net_book_value`, `location`, `status`, `created_at`, `updated_at`.
- **DepreciationSchedule**: `id`, `asset_id`, `period_month`, `depreciation_amount`, `accumulated_depreciation`, `net_book_value`, `created_at`.
- **TaxDeclaration**: `id`, `declaration_number`, `tax_type`, `period`, `taxable_amount`, `tax_amount`, `status`, `filed_date`, `payment_date`, `created_by_id`, `created_at`, `updated_at`.

### 1.8 Master Data
- **VehicleModel**: `id`, `model_code`, `model_name`, `category`, `base_price`, `status`, `created_at`, `updated_at`.
- **Accessory**: `id`, `accessory_code`, `accessory_name`, `category`, `price`, `status`, `created_at`, `updated_at`.
- **ServiceCatalog**: `id`, `service_code`, `service_name`, `category`, `labor_hours`, `labor_rate`, `status`, `created_at`, `updated_at`.

## 2. Constraints Summary
- **PK**: All use CUID `String`.
- **Unique**: `users.email`, `customers.phone`, all document numbers (QT, RO, INV, etc.).
- **Enums**: Simulated via `String` with application-level validation (SQLite limitation).
- **Decimals**: Used for all currency/pricing fields.
