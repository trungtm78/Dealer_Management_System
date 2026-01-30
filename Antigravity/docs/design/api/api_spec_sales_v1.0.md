# Honda DMS - API Specification
## Module 3: Sales

**Version**: 1.0  
**Date**: 2026-01-28  
**Module**: Sales  
**Total APIs**: 35

---

## 📋 Module Overview

**Purpose**: Quản lý toàn bộ quy trình bán xe từ Báo Giá → Lái Thử → Đặt Cọc → Hợp Đồng → Giao Xe

**FRD References**: SCR-SAL-001 to SCR-SAL-008

**Sub-modules**:
1. **Quotations** (8 APIs) - SCR-SAL-001, SCR-SAL-002
2. **Test Drives** (6 APIs) - SCR-SAL-003
3. **VIN Management** (6 APIs) - SCR-SAL-007
4. **Contracts** (5 APIs) - SCR-SAL-005
5. **Deposits** (5 APIs) - SCR-SAL-004
6. **PDS (Pre-Delivery Service)** (5 APIs) - SCR-SAL-006

---

## 🔹 Sub-module 1: Quotations (8 APIs)

### API-SAL-001: List Quotations
- **Endpoint**: `GET /api/sales/quotations`
- **FRD**: SCR-SAL-002 (Danh Sách Báo Giá)
- **ERD**: `quotations` table, JOIN `customers`, `users`
- **Request**: Query params (status, customer_id, model, date_from, date_to, page, limit)
- **Response**: Array of quotations with pagination
- **Rules**:
  - BR-SAL-001: Quote number format: QT-YYYY-NNNN (auto-increment)
  - BR-SAL-002: Quote expires after 7 days (configurable)
  - Order by created_at DESC

### API-SAL-002: Create Quotation
- **Endpoint**: `POST /api/sales/quotations`
- **FRD**: SCR-SAL-001 (Tạo Báo Giá)
- **ERD**: `quotations` INSERT
- **Request**: Body (customer_id, customer_name*, customer_phone*, model*, version*, color*, base_price*, accessories, services, insurance, registration_tax, discount, promotion_value, total_price*)
- **Response**: Created quotation with quote_number, status=DRAFT, expiry_date
- **Rules**:
  - BR-SAL-003: Insurance = basePrice * 1.5%
  - BR-SAL-004: Registration tax = basePrice * 10%
  - BR-SAL-005: Registration fee = 20M VNĐ (HN/HCM)
  - Auto-generate quote_number, expiry_date = now() + 7 days

### API-SAL-003: Get Quotation Detail
- **Endpoint**: `GET /api/sales/quotations/{id}`
- **FRD**: SCR-SAL-001, SCR-SAL-002
- **ERD**: `quotations`, JOIN `customers`, `users` (created_by)
- **Request**: Path param (id)
- **Response**: Full quotation details + customer + creator info
- **Rules**:
  - Include accessories/services breakdown (parse JSON)
  - Include profit analysis if user role = MANAGER/ADMIN

### API-SAL-004: Update Quotation
- **Endpoint**: `PUT /api/sales/quotations/{id}`
- **FRD**: SCR-SAL-001 (Edit quotation)
- **ERD**: `quotations` UPDATE
- **Request**: Path param (id), Body (partial update)
- **Response**: Updated quotation
- **Rules**:
  - Only allow update if status = DRAFT
  - Recalculate total_price if price components change

### API-SAL-005: Delete Quotation
- **Endpoint**: `DELETE /api/sales/quotations/{id}`
- **FRD**: SCR-SAL-002
- **ERD**: `quotations` DELETE (soft delete)
- **Request**: Path param (id)
- **Response**: Success message
- **Rules**:
  - Only allow delete if status = DRAFT
  - Soft delete: UPDATE status = 'DELETED'

### API-SAL-006: Send Quotation
- **Endpoint**: `POST /api/sales/quotations/{id}/send`
- **FRD**: SCR-SAL-002 (Send to customer)
- **ERD**: `quotations` UPDATE status='SENT'
- **Request**: Path param (id), Body (send_method: EMAIL/SMS/PRINT)
- **Response**: Send result
- **Rules**:
  - Update status = SENT
  - Generate PDF quotation
  - Send via email/SMS if applicable

### API-SAL-007: Approve Quotation
- **Endpoint**: `POST /api/sales/quotations/{id}/approve`
- **FRD**: SCR-SAL-002 (Customer approval)
- **ERD**: `quotations` UPDATE status='APPROVED'
- **Request**: Path param (id)
- **Response**: Approved quotation
- **Rules**:
  - Update status = APPROVED
  - Ready for contract creation

### API-SAL-008: Calculate Quotation Profit
- **Endpoint**: `GET /api/sales/quotations/{id}/profit`
- **FRD**: SCR-SAL-001 Tab 3 (Profit Analysis)
- **ERD**: Read `quotations`, calculate profit
- **Request**: Path param (id)
- **Response**: Profit breakdown (revenue, costs, gross_profit, margin)
- **Rules**:
  - BR-SAL-006: Manufacturer cost = basePrice * 88%
  - BR-SAL-007: Accessory cost = retail * 60%
  - BR-SAL-008: Service cost = retail * 70%
  - Operating cost = 5M, Marketing cost = 2M
  - Only accessible by MANAGER/ADMIN

---

## 🔹 Sub-module 2: Test Drives (6 APIs)

### API-SAL-009: List Test Drives
- **Endpoint**: `GET /api/sales/test-drives`
- **FRD**: SCR-SAL-003 (Lịch Lái Thử)
- **ERD**: `test_drives` table, JOIN `customers`, `users`
- **Request**: Query params (customer_id, model, status, date_from, date_to, sales_consultant_id, page, limit)
- **Response**: Array of test drives with pagination
- **Rules**:
  - Order by scheduled_date ASC
  - Status: SCHEDULED, COMPLETED, CANCELLED, NO_SHOW

### API-SAL-010: Create Test Drive
- **Endpoint**: `POST /api/sales/test-drives`
- **FRD**: SCR-SAL-003 (Booking dialog)
- **ERD**: `test_drives` INSERT
- **Request**: Body (customer_id*, model*, scheduled_date*, scheduled_time*, sales_consultant_id)
- **Response**: Created test drive with id, status=SCHEDULED
- **Rules**:
  - Check vehicle availability (demo car)
  - Check time slot conflicts
  - Default status = SCHEDULED

### API-SAL-011: Get Test Drive Detail
- **Endpoint**: `GET /api/sales/test-drives/{id}`
- **FRD**: SCR-SAL-003
- **ERD**: `test_drives`, JOIN `customers`, `users`
- **Request**: Path param (id)
- **Response**: Full test drive details
- **Rules**:
  - Include customer + sales consultant info

### API-SAL-012: Update Test Drive
- **Endpoint**: `PUT /api/sales/test-drives/{id}`
- **FRD**: SCR-SAL-003 (Reschedule)
- **ERD**: `test_drives` UPDATE
- **Request**: Path param (id), Body (scheduled_date, scheduled_time, status, feedback)
- **Response**: Updated test drive
- **Rules**:
  - Check new time slot availability if rescheduling

### API-SAL-013: Cancel Test Drive
- **Endpoint**: `POST /api/sales/test-drives/{id}/cancel`
- **FRD**: SCR-SAL-003
- **ERD**: `test_drives` UPDATE status='CANCELLED'
- **Request**: Path param (id), Body (reason)
- **Response**: Cancelled test drive
- **Rules**:
  - Update status = CANCELLED
  - Notify customer

### API-SAL-014: Complete Test Drive
- **Endpoint**: `POST /api/sales/test-drives/{id}/complete`
- **FRD**: SCR-SAL-003
- **ERD**: `test_drives` UPDATE status='COMPLETED', feedback
- **Request**: Path param (id), Body (feedback)
- **Response**: Completed test drive
- **Rules**:
  - Update status = COMPLETED
  - Store customer feedback

---

## 🔹 Sub-module 3: VIN Management (6 APIs)

### API-SAL-015: List VINs
- **Endpoint**: `GET /api/sales/vins`
- **FRD**: SCR-SAL-007 (Kho VIN)
- **ERD**: `vins` table
- **Request**: Query params (model, version, color, status, arrival_date_from, arrival_date_to, page, limit)
- **Response**: Array of VINs with pagination
- **Rules**:
  - Status: AVAILABLE, ALLOCATED, SOLD
  - Order by arrival_date DESC

### API-SAL-016: Create VIN
- **Endpoint**: `POST /api/sales/vins`
- **FRD**: SCR-SAL-007 (Add new VIN)
- **ERD**: `vins` INSERT
- **Request**: Body (vin_number*, model*, version*, color*, year*, arrival_date)
- **Response**: Created VIN with id, status=AVAILABLE
- **Rules**:
  - vin_number must be UNIQUE
  - Default status = AVAILABLE

### API-SAL-017: Get VIN Detail
- **Endpoint**: `GET /api/sales/vins/{id}`
- **FRD**: SCR-SAL-007 (VIN details dialog)
- **ERD**: `vins`, JOIN `contracts` (if allocated)
- **Request**: Path param (id)
- **Response**: Full VIN details + allocation info
- **Rules**:
  - Include contract details if allocated

### API-SAL-018: Allocate VIN
- **Endpoint**: `POST /api/sales/vins/{id}/allocate`
- **FRD**: SCR-SAL-007 (Allocate to contract)
- **ERD**: `vins` UPDATE status='ALLOCATED', allocated_to_contract_id
- **Request**: Path param (id), Body (contract_id*)
- **Response**: Allocated VIN
- **Rules**:
  - Only allow if status = AVAILABLE
  - Update status = ALLOCATED
  - Link to contract

### API-SAL-019: Mark VIN as Sold
- **Endpoint**: `POST /api/sales/vins/{id}/sold`
- **FRD**: SCR-SAL-007
- **ERD**: `vins` UPDATE status='SOLD'
- **Request**: Path param (id)
- **Response**: Updated VIN
- **Rules**:
  - Only allow if status = ALLOCATED
  - Update status = SOLD

### API-SAL-020: Get VIN History
- **Endpoint**: `GET /api/sales/vins/{id}/history`
- **FRD**: SCR-SAL-007 (View history)
- **ERD**: Aggregate from `vins`, `contracts`, `pds_checklists`
- **Request**: Path param (id)
- **Response**: VIN history timeline
- **Rules**:
  - Include allocation, PDS, delivery events

---

## 🔹 Sub-module 4: Contracts (5 APIs)

### API-SAL-021: List Contracts
- **Endpoint**: `GET /api/sales/contracts`
- **FRD**: SCR-SAL-005 (Hợp Đồng Mua Bán)
- **ERD**: `contracts` table, JOIN `customers`, `quotations`, `vins`
- **Request**: Query params (customer_id, status, contract_date_from, contract_date_to, page, limit)
- **Response**: Array of contracts with pagination
- **Rules**:
  - Contract number format: CT-YYYY-NNNN
  - Order by contract_date DESC

### API-SAL-022: Create Contract
- **Endpoint**: `POST /api/sales/contracts`
- **FRD**: SCR-SAL-005 (Create contract)
- **ERD**: `contracts` INSERT
- **Request**: Body (quotation_id*, customer_id*, vin_id, total_amount*, deposit_amount*, payment_method, contract_date*, delivery_date)
- **Response**: Created contract with contract_number, status=ACTIVE
- **Rules**:
  - Auto-generate contract_number
  - Link to quotation (update quotation.status = CONTRACT)
  - Calculate remaining_amount = total_amount - deposit_amount

### API-SAL-023: Get Contract Detail
- **Endpoint**: `GET /api/sales/contracts/{id}`
- **FRD**: SCR-SAL-005
- **ERD**: `contracts`, JOIN `customers`, `quotations`, `vins`, `deposits`
- **Request**: Path param (id)
- **Response**: Full contract details
- **Rules**:
  - Include customer, quotation, VIN, deposits info

### API-SAL-024: Update Contract
- **Endpoint**: `PUT /api/sales/contracts/{id}`
- **FRD**: SCR-SAL-005 (Edit contract)
- **ERD**: `contracts` UPDATE
- **Request**: Path param (id), Body (delivery_date, payment_method, status)
- **Response**: Updated contract
- **Rules**:
  - Only allow certain fields to be updated
  - Log changes in audit log

### API-SAL-025: Complete Contract
- **Endpoint**: `POST /api/sales/contracts/{id}/complete`
- **FRD**: SCR-SAL-005
- **ERD**: `contracts` UPDATE status='COMPLETED'
- **Request**: Path param (id)
- **Response**: Completed contract
- **Rules**:
  - Update status = COMPLETED
  - Trigger delivery process

---

## 🔹 Sub-module 5: Deposits (5 APIs)

### API-SAL-026: List Deposits
- **Endpoint**: `GET /api/sales/deposits`
- **FRD**: SCR-SAL-004 (Quản Lý Đặt Cọc)
- **ERD**: `deposits` table, JOIN `customers`, `contracts`
- **Request**: Query params (customer_id, contract_id, status, payment_method, page, limit)
- **Response**: Array of deposits with pagination
- **Rules**:
  - Deposit number format: DP-YYYY-NNNN
  - Order by created_at DESC

### API-SAL-027: Create Deposit
- **Endpoint**: `POST /api/sales/deposits`
- **FRD**: SCR-SAL-004 (Create deposit)
- **ERD**: `deposits` INSERT
- **Request**: Body (customer_id, customer_name*, contract_id, contract_number, amount*, payment_method*, notes)
- **Response**: Created deposit with receipt_number, status=PAID
- **Rules**:
  - Auto-generate receipt_number
  - Default status = PAID
  - Default amount = 10% of contract total

### API-SAL-028: Get Deposit Detail
- **Endpoint**: `GET /api/sales/deposits/{id}`
- **FRD**: SCR-SAL-004
- **ERD**: `deposits`, JOIN `customers`, `contracts`, `users` (received_by)
- **Request**: Path param (id)
- **Response**: Full deposit details
- **Rules**:
  - Include customer, contract, receiver info

### API-SAL-029: Refund Deposit
- **Endpoint**: `POST /api/sales/deposits/{id}/refund`
- **FRD**: SCR-SAL-004 (Process refund)
- **ERD**: `deposits` UPDATE status='REFUNDED'
- **Request**: Path param (id), Body (refund_reason)
- **Response**: Refunded deposit
- **Rules**:
  - Update status = REFUNDED
  - Log refund reason

### API-SAL-030: Cancel Deposit
- **Endpoint**: `POST /api/sales/deposits/{id}/cancel`
- **FRD**: SCR-SAL-004
- **ERD**: `deposits` UPDATE status='CANCELLED'
- **Request**: Path param (id), Body (cancel_reason)
- **Response**: Cancelled deposit
- **Rules**:
  - Update status = CANCELLED
  - May trigger refund process

---

## 🔹 Sub-module 6: PDS (Pre-Delivery Service) (5 APIs)

### API-SAL-031: List PDS Checklists
- **Endpoint**: `GET /api/sales/pds`
- **FRD**: SCR-SAL-006 (Giao Xe - PDS)
- **ERD**: `pds_checklists` table, JOIN `contracts`, `vins`
- **Request**: Query params (contract_id, vin_id, status, page, limit)
- **Response**: Array of PDS checklists with pagination
- **Rules**:
  - Order by created_at DESC

### API-SAL-032: Create PDS Checklist
- **Endpoint**: `POST /api/sales/pds`
- **FRD**: SCR-SAL-006 (Start PDS)
- **ERD**: `pds_checklists` INSERT
- **Request**: Body (contract_id*, vin_id*, inspector_id*)
- **Response**: Created PDS checklist with id
- **Rules**:
  - Initialize empty checklist items (JSON)
  - Link to contract and VIN

### API-SAL-033: Update PDS Checklist
- **Endpoint**: `PUT /api/sales/pds/{id}`
- **FRD**: SCR-SAL-006 (Update checklist)
- **ERD**: `pds_checklists` UPDATE
- **Request**: Path param (id), Body (exterior_check, interior_check, mechanical_check, documentation_check, photos)
- **Response**: Updated PDS checklist
- **Rules**:
  - Store checklist items as JSON
  - Upload photos (array of URLs)

### API-SAL-034: Complete PDS
- **Endpoint**: `POST /api/sales/pds/{id}/complete`
- **FRD**: SCR-SAL-006 (Complete delivery)
- **ERD**: `pds_checklists` UPDATE with signatures, delivery_date
- **Request**: Path param (id), Body (customer_signature, inspector_signature, delivery_date)
- **Response**: Completed PDS
- **Rules**:
  - All checklist items must be completed
  - Require customer + inspector signatures
  - Set delivery_date = now()

### API-SAL-035: Get PDS Detail
- **Endpoint**: `GET /api/sales/pds/{id}`
- **FRD**: SCR-SAL-006
- **ERD**: `pds_checklists`, JOIN `contracts`, `vins`, `users`
- **Request**: Path param (id)
- **Response**: Full PDS checklist details
- **Rules**:
  - Include contract, VIN, inspector info
  - Include photos and signatures

---

**End of Module 3: Sales (35 APIs)**

**Summary**:
- ✅ Quotations: 8 APIs
- ✅ Test Drives: 6 APIs
- ✅ VIN Management: 6 APIs
- ✅ Contracts: 5 APIs
- ✅ Deposits: 5 APIs
- ✅ PDS: 5 APIs
