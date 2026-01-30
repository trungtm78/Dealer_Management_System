# Honda DMS - API Specification
## Module 4: Service

**Version**: 1.0  
**Date**: 2026-01-28  
**Module**: Service  
**Total APIs**: 30

---

## 📋 Module Overview

**Purpose**: Quản lý toàn bộ quy trình dịch vụ từ Đặt Lịch → Tiếp Nhận → Sửa Chữa → Kiểm Tra → Thanh Toán

**FRD References**: SCR-SVC-001 to SCR-SVC-008

**Sub-modules**:
1. **Service Quotes** (5 APIs) - SCR-SVC-001, SCR-SVC-002
2. **Appointments** (6 APIs) - SCR-SVC-003
3. **Repair Orders** (10 APIs) - SCR-SVC-004, SCR-SVC-005
4. **Quality Control** (4 APIs) - SCR-SVC-007
5. **Settlement** (5 APIs) - SCR-SVC-008

---

## 🔹 Sub-module 1: Service Quotes (5 APIs)

### API-SVC-001: List Service Quotes
- **Endpoint**: `GET /api/service/quotes`
- **FRD**: SCR-SVC-002 (Danh Sách Báo Giá DV)
- **ERD**: `service_quotes` table, JOIN `customers`, `users`
- **Request**: Query params (customer_id, status, advisor_id, date_from, date_to, page, limit)
- **Response**: Array of service quotes with pagination
- **Rules**:
  - BR-SVC-001: Quote number format: SQ-YYYY-NNNN
  - Order by created_at DESC

### API-SVC-002: Create Service Quote
- **Endpoint**: `POST /api/service/quotes`
- **FRD**: SCR-SVC-001 (Báo Giá Dịch Vụ)
- **ERD**: `service_quotes` INSERT
- **Request**: Body (customer_id*, vehicle_info*, services*, parts*, advisor_id)
- **Response**: Created quote with quote_number, status=DRAFT, expiry_date
- **Rules**:
  - BR-SVC-002: VAT = 10% of subtotal
  - BR-SVC-003: Quote expires after 30 days
  - Auto-calculate: total_labor, total_parts, sub_total, vat, total_amount

### API-SVC-003: Get Service Quote Detail
- **Endpoint**: `GET /api/service/quotes/{id}`
- **FRD**: SCR-SVC-001, SCR-SVC-002
- **ERD**: `service_quotes`, JOIN `customers`, `users`
- **Request**: Path param (id)
- **Response**: Full quote details + customer + advisor info
- **Rules**:
  - Include services/parts breakdown (parse JSON)

### API-SVC-004: Update Service Quote
- **Endpoint**: `PUT /api/service/quotes/{id}`
- **FRD**: SCR-SVC-001 (Edit quote)
- **ERD**: `service_quotes` UPDATE
- **Request**: Path param (id), Body (services, parts, status)
- **Response**: Updated quote
- **Rules**:
  - Only allow update if status = DRAFT
  - Recalculate totals if services/parts change

### API-SVC-005: Convert Quote to RO
- **Endpoint**: `POST /api/service/quotes/{id}/convert`
- **FRD**: SCR-SVC-002 (Convert to RO)
- **ERD**: `service_quotes` UPDATE status='RO_CREATED', `repair_orders` INSERT
- **Request**: Path param (id)
- **Response**: Created RO details
- **Rules**:
  - Create new RO from quote
  - Update quote status = RO_CREATED
  - Copy services/parts to RO

---

## 🔹 Sub-module 2: Appointments (6 APIs)

### API-SVC-006: List Appointments
- **Endpoint**: `GET /api/service/appointments`
- **FRD**: SCR-SVC-003 (Đặt Lịch Hẹn)
- **ERD**: `service_appointments` table, JOIN `customers`, `users`
- **Request**: Query params (customer_id, status, advisor_id, scheduled_date_from, scheduled_date_to, page, limit)
- **Response**: Array of appointments with pagination
- **Rules**:
  - Order by scheduled_date ASC
  - Status: SCHEDULED, CONFIRMED, ARRIVED, IN_PROGRESS, COMPLETED, CANCELLED

### API-SVC-007: Create Appointment
- **Endpoint**: `POST /api/service/appointments`
- **FRD**: SCR-SVC-003 (Booking)
- **ERD**: `service_appointments` INSERT
- **Request**: Body (customer_id*, vehicle_info*, service_type*, scheduled_date*, scheduled_time*, advisor_id)
- **Response**: Created appointment with id, status=SCHEDULED
- **Rules**:
  - Check time slot availability
  - Default status = SCHEDULED
  - Send confirmation (SMS/Email)

### API-SVC-008: Get Appointment Detail
- **Endpoint**: `GET /api/service/appointments/{id}`
- **FRD**: SCR-SVC-003
- **ERD**: `service_appointments`, JOIN `customers`, `users`
- **Request**: Path param (id)
- **Response**: Full appointment details
- **Rules**:
  - Include customer + advisor info

### API-SVC-009: Update Appointment
- **Endpoint**: `PUT /api/service/appointments/{id}`
- **FRD**: SCR-SVC-003 (Reschedule)
- **ERD**: `service_appointments` UPDATE
- **Request**: Path param (id), Body (scheduled_date, scheduled_time, status, notes)
- **Response**: Updated appointment
- **Rules**:
  - Check new time slot if rescheduling
  - Notify customer of changes

### API-SVC-010: Check-in Appointment
- **Endpoint**: `POST /api/service/appointments/{id}/checkin`
- **FRD**: SCR-SVC-004 (Tiếp Nhận)
- **ERD**: `service_appointments` UPDATE status='ARRIVED'
- **Request**: Path param (id)
- **Response**: Checked-in appointment
- **Rules**:
  - Update status = ARRIVED
  - Ready to create RO

### API-SVC-011: Cancel Appointment
- **Endpoint**: `POST /api/service/appointments/{id}/cancel`
- **FRD**: SCR-SVC-003
- **ERD**: `service_appointments` UPDATE status='CANCELLED'
- **Request**: Path param (id), Body (cancel_reason)
- **Response**: Cancelled appointment
- **Rules**:
  - Update status = CANCELLED
  - Notify customer

---

## 🔹 Sub-module 3: Repair Orders (10 APIs)

### API-SVC-012: List Repair Orders
- **Endpoint**: `GET /api/service/orders`
- **FRD**: SCR-SVC-005 (Lệnh Sửa Chữa)
- **ERD**: `repair_orders` table, JOIN `customers`, `users`
- **Request**: Query params (customer_id, status, advisor_id, technician_id, bay_number, page, limit)
- **Response**: Array of ROs with pagination
- **Rules**:
  - RO number format: RO-YYYY-NNNN
  - Order by created_at DESC
  - Status: PENDING, IN_PROGRESS, QC, READY, DELIVERED

### API-SVC-013: Create Repair Order
- **Endpoint**: `POST /api/service/orders`
- **FRD**: SCR-SVC-004 (Tiếp Nhận), SCR-SVC-005
- **ERD**: `repair_orders` INSERT
- **Request**: Body (appointment_id, customer_id*, vehicle_info*, mileage, fuel_level, customer_complaints, advisor_id*)
- **Response**: Created RO with ro_number, status=PENDING
- **Rules**:
  - Auto-generate ro_number
  - Default status = PENDING
  - Link to appointment if exists

### API-SVC-014: Get Repair Order Detail
- **Endpoint**: `GET /api/service/orders/{id}`
- **FRD**: SCR-SVC-005
- **ERD**: `repair_orders`, JOIN `customers`, `users`, `ro_line_items`, `work_logs`
- **Request**: Path param (id)
- **Response**: Full RO details + line items + work logs
- **Rules**:
  - Include customer, advisor, technician info
  - Include line items (services + parts)
  - Include work logs timeline

### API-SVC-015: Update Repair Order
- **Endpoint**: `PUT /api/service/orders/{id}`
- **FRD**: SCR-SVC-005 (Edit RO)
- **ERD**: `repair_orders` UPDATE
- **Request**: Path param (id), Body (technician_id, bay_number, status, inspection_notes)
- **Response**: Updated RO
- **Rules**:
  - Log status changes
  - Update estimated_completion if needed

### API-SVC-016: Add RO Line Item
- **Endpoint**: `POST /api/service/orders/{id}/items`
- **FRD**: SCR-SVC-005 (Add service/part)
- **ERD**: `ro_line_items` INSERT
- **Request**: Path param (ro_id), Body (item_type*, item_code*, item_name*, quantity*, unit_price*)
- **Response**: Created line item
- **Rules**:
  - item_type: SERVICE or PART
  - Calculate total_price = quantity * unit_price
  - Check parts availability if item_type = PART

### API-SVC-017: Remove RO Line Item
- **Endpoint**: `DELETE /api/service/orders/{ro_id}/items/{item_id}`
- **FRD**: SCR-SVC-005
- **ERD**: `ro_line_items` DELETE
- **Request**: Path params (ro_id, item_id)
- **Response**: Success message
- **Rules**:
  - Only allow if RO status != DELIVERED

### API-SVC-018: Assign Technician
- **Endpoint**: `POST /api/service/orders/{id}/assign`
- **FRD**: SCR-SVC-005 (Assign technician)
- **ERD**: `repair_orders` UPDATE technician_id, status='IN_PROGRESS'
- **Request**: Path param (id), Body (technician_id*, bay_number)
- **Response**: Updated RO
- **Rules**:
  - Update status = IN_PROGRESS
  - Assign bay_number if provided

### API-SVC-019: Add Work Log
- **Endpoint**: `POST /api/service/orders/{id}/worklogs`
- **FRD**: SCR-SVC-006 (Giao Diện KTV)
- **ERD**: `work_logs` INSERT
- **Request**: Path param (ro_id), Body (work_description*, hours_spent, status*, photos, notes)
- **Response**: Created work log
- **Rules**:
  - Auto set technician_id = current user
  - Status: IN_PROGRESS, COMPLETED, PAUSED

### API-SVC-020: Get RO Work Logs
- **Endpoint**: `GET /api/service/orders/{id}/worklogs`
- **FRD**: SCR-SVC-006
- **ERD**: `work_logs` WHERE ro_id, JOIN `users`
- **Request**: Path param (ro_id)
- **Response**: Array of work logs
- **Rules**:
  - Order by created_at ASC
  - Include technician info

### API-SVC-021: Complete Repair Order
- **Endpoint**: `POST /api/service/orders/{id}/complete`
- **FRD**: SCR-SVC-005
- **ERD**: `repair_orders` UPDATE status='QC', actual_completion=now()
- **Request**: Path param (id)
- **Response**: Updated RO
- **Rules**:
  - Update status = QC (ready for quality control)
  - Set actual_completion = now()

---

## 🔹 Sub-module 4: Quality Control (4 APIs)

### API-SVC-022: List QC Checklists
- **Endpoint**: `GET /api/service/qc`
- **FRD**: SCR-SVC-007 (Kiểm Tra Chất Lượng)
- **ERD**: `qc_checklists` table, JOIN `repair_orders`, `users`
- **Request**: Query params (ro_id, qc_result, qc_by_id, page, limit)
- **Response**: Array of QC checklists with pagination
- **Rules**:
  - Order by created_at DESC
  - qc_result: PASS, FAIL, REWORK

### API-SVC-023: Create QC Checklist
- **Endpoint**: `POST /api/service/qc`
- **FRD**: SCR-SVC-007 (Start QC)
- **ERD**: `qc_checklists` INSERT
- **Request**: Body (ro_id*, checklist_items*, photos, qc_by_id)
- **Response**: Created QC checklist
- **Rules**:
  - checklist_items stored as JSON
  - Auto set qc_by_id = current user if not provided

### API-SVC-024: Complete QC
- **Endpoint**: `POST /api/service/qc/{id}/complete`
- **FRD**: SCR-SVC-007 (Approve/Reject)
- **ERD**: `qc_checklists` UPDATE qc_result, `repair_orders` UPDATE status
- **Request**: Path param (id), Body (qc_result*, rework_notes)
- **Response**: Completed QC
- **Rules**:
  - If qc_result = PASS: Update RO status = READY
  - If qc_result = FAIL: Update RO status = IN_PROGRESS, assign rework
  - Require rework_notes if qc_result = FAIL

### API-SVC-025: Get QC Detail
- **Endpoint**: `GET /api/service/qc/{id}`
- **FRD**: SCR-SVC-007
- **ERD**: `qc_checklists`, JOIN `repair_orders`, `users`
- **Request**: Path param (id)
- **Response**: Full QC checklist details
- **Rules**:
  - Include RO + QC inspector info
  - Include photos

---

## 🔹 Sub-module 5: Settlement (5 APIs)

### API-SVC-026: Get RO Invoice
- **Endpoint**: `GET /api/service/orders/{id}/invoice`
- **FRD**: SCR-SVC-008 (Thanh Toán)
- **ERD**: Calculate from `repair_orders`, `ro_line_items`
- **Request**: Path param (ro_id)
- **Response**: Invoice details (line items, subtotal, vat, total, discounts)
- **Rules**:
  - Calculate from RO line items
  - Apply discounts if any
  - VAT = 10%

### API-SVC-027: Apply Discount
- **Endpoint**: `POST /api/service/orders/{id}/discount`
- **FRD**: SCR-SVC-008 (Discount application)
- **ERD**: `repair_orders` UPDATE (store discount in metadata)
- **Request**: Path param (id), Body (discount_type, discount_value, reason)
- **Response**: Updated invoice total
- **Rules**:
  - discount_type: PERCENTAGE or FIXED_AMOUNT
  - Require MANAGER approval if discount > threshold

### API-SVC-028: Process Payment
- **Endpoint**: `POST /api/service/orders/{id}/payment`
- **FRD**: SCR-SVC-008 (Process payment)
- **ERD**: Create `invoices`, `payments`, UPDATE `repair_orders` status='DELIVERED'
- **Request**: Path param (id), Body (payment_method*, amount*, received_by_id)
- **Response**: Payment receipt + invoice
- **Rules**:
  - Create invoice record
  - Create payment record
  - Update RO status = DELIVERED
  - Generate invoice PDF

### API-SVC-029: Print Invoice
- **Endpoint**: `GET /api/service/orders/{id}/invoice/print`
- **FRD**: SCR-SVC-008 (Print invoice)
- **ERD**: Read `repair_orders`, `ro_line_items`, `invoices`
- **Request**: Path param (id)
- **Response**: PDF invoice
- **Rules**:
  - Generate PDF invoice
  - Include company header, RO details, line items, totals

### API-SVC-030: Get Settlement Summary
- **Endpoint**: `GET /api/service/settlement/summary`
- **FRD**: SCR-SVC-008 (Dashboard)
- **ERD**: Aggregate from `repair_orders`, `invoices`, `payments`
- **Request**: Query params (date_from, date_to, advisor_id)
- **Response**: Settlement summary (total_revenue, total_invoices, payment_methods_breakdown)
- **Rules**:
  - Aggregate by date range
  - Group by payment method
  - Include advisor performance

---

**End of Module 4: Service (30 APIs)**

**Summary**:
- ✅ Service Quotes: 5 APIs
- ✅ Appointments: 6 APIs
- ✅ Repair Orders: 10 APIs
- ✅ Quality Control: 4 APIs
- ✅ Settlement: 5 APIs
