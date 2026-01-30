# Honda DMS - API Specification
## Module 5: Parts

**Version**: 1.0  
**Date**: 2026-01-28  
**Module**: Parts  
**Total APIs**: 25

---

## 📋 Module Overview

**Purpose**: Quản lý kho phụ tùng, nhập xuất, đặt hàng, kiểm kê

**FRD References**: SCR-PRT-001 to SCR-PRT-010

**Sub-modules**:
1. **Inventory** (5 APIs)
2. **Stock Movements** (5 APIs)
3. **Purchase Orders** (8 APIs)
4. **Stock Take** (5 APIs)
5. **Pricing** (2 APIs)

---

## 🔹 Inventory (5 APIs)

### API-PRT-001: List Parts
- **Endpoint**: `GET /api/parts`
- **ERD**: `parts` table, JOIN `suppliers`
- **Response**: Array of parts with stock levels

### API-PRT-002: Create Part
- **Endpoint**: `POST /api/parts`
- **ERD**: `parts` INSERT
- **Response**: Created part

### API-PRT-003: Update Part
- **Endpoint**: `PUT /api/parts/{id}`
- **ERD**: `parts` UPDATE
- **Response**: Updated part

### API-PRT-004: Get Part Detail
- **Endpoint**: `GET /api/parts/{id}`
- **ERD**: `parts`, JOIN `suppliers`, aggregate `stock_movements`
- **Response**: Full part details + stock history

### API-PRT-005: Search Parts
- **Endpoint**: `GET /api/parts/search`
- **ERD**: `parts` with full-text search
- **Response**: Array of matching parts

---

## 🔹 Stock Movements (5 APIs)

### API-PRT-006: List Stock Movements
- **Endpoint**: `GET /api/parts/movements`
- **ERD**: `stock_movements`, JOIN `parts`, `users`
- **Response**: Array of movements with pagination

### API-PRT-007: Create Stock Movement (IN)
- **Endpoint**: `POST /api/parts/movements/in`
- **ERD**: `stock_movements` INSERT, `parts` UPDATE quantity
- **Response**: Created movement

### API-PRT-008: Create Stock Movement (OUT)
- **Endpoint**: `POST /api/parts/movements/out`
- **ERD**: `stock_movements` INSERT, `parts` UPDATE quantity
- **Response**: Created movement

### API-PRT-009: Transfer Stock
- **Endpoint**: `POST /api/parts/movements/transfer`
- **ERD**: `stock_movements` INSERT (2 records)
- **Response**: Transfer result

### API-PRT-010: Adjust Stock
- **Endpoint**: `POST /api/parts/movements/adjust`
- **ERD**: `stock_movements` INSERT, `parts` UPDATE quantity
- **Response**: Adjustment result

---

## 🔹 Purchase Orders (8 APIs)

### API-PRT-011: List Purchase Orders
- **Endpoint**: `GET /api/parts/purchase-orders`
- **ERD**: `purchase_orders`, JOIN `suppliers`
- **Response**: Array of POs

### API-PRT-012: Create Purchase Order
- **Endpoint**: `POST /api/parts/purchase-orders`
- **ERD**: `purchase_orders` INSERT, `po_line_items` INSERT
- **Response**: Created PO with po_number

### API-PRT-013: Get PO Detail
- **Endpoint**: `GET /api/parts/purchase-orders/{id}`
- **ERD**: `purchase_orders`, JOIN `suppliers`, `po_line_items`
- **Response**: Full PO details

### API-PRT-014: Update PO
- **Endpoint**: `PUT /api/parts/purchase-orders/{id}`
- **ERD**: `purchase_orders` UPDATE
- **Response**: Updated PO

### API-PRT-015: Send PO to Supplier
- **Endpoint**: `POST /api/parts/purchase-orders/{id}/send`
- **ERD**: `purchase_orders` UPDATE status='SENT'
- **Response**: Send result

### API-PRT-016: Receive PO
- **Endpoint**: `POST /api/parts/purchase-orders/{id}/receive`
- **ERD**: `purchase_orders` UPDATE, `po_line_items` UPDATE received_quantity, `stock_movements` INSERT
- **Response**: Receive result

### API-PRT-017: Close PO
- **Endpoint**: `POST /api/parts/purchase-orders/{id}/close`
- **ERD**: `purchase_orders` UPDATE status='CLOSED'
- **Response**: Closed PO

### API-PRT-018: Cancel PO
- **Endpoint**: `POST /api/parts/purchase-orders/{id}/cancel`
- **ERD**: `purchase_orders` UPDATE status='CANCELLED'
- **Response**: Cancelled PO

---

## 🔹 Stock Take (5 APIs)

### API-PRT-019: List Stock Takes
- **Endpoint**: `GET /api/parts/stock-take`
- **ERD**: `stock_takes`, JOIN `users`
- **Response**: Array of stock take sessions

### API-PRT-020: Create Stock Take
- **Endpoint**: `POST /api/parts/stock-take`
- **ERD**: `stock_takes` INSERT
- **Response**: Created session with session_number

### API-PRT-021: Add Stock Take Item
- **Endpoint**: `POST /api/parts/stock-take/{id}/items`
- **ERD**: `stock_take_items` INSERT
- **Response**: Created item

### API-PRT-022: Complete Stock Take
- **Endpoint**: `POST /api/parts/stock-take/{id}/complete`
- **ERD**: `stock_takes` UPDATE status='COMPLETED', create adjustments
- **Response**: Completion result with variances

### API-PRT-023: Get Stock Take Detail
- **Endpoint**: `GET /api/parts/stock-take/{id}`
- **ERD**: `stock_takes`, JOIN `stock_take_items`, `parts`
- **Response**: Full stock take details

---

## 🔹 Pricing (2 APIs)

### API-PRT-024: Update Part Price
- **Endpoint**: `PUT /api/parts/{id}/price`
- **ERD**: `parts` UPDATE unit_price, cost_price
- **Response**: Updated part

### API-PRT-025: Get Price History
- **Endpoint**: `GET /api/parts/{id}/price-history`
- **ERD**: Aggregate from audit logs or price history table
- **Response**: Price change history

---

**End of Module 5: Parts (25 APIs)**
