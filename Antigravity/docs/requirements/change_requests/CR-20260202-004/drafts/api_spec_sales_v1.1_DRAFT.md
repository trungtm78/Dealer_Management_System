# Honda DMS - API Specification
## Module 3: Sales

**Version**: 1.1 [DRAFT CR-20260202-004]
**Date**: 2026-02-02

---

## 🔹 Sub-module 1: Quotations (Updated)

### API-SAL-002: Create Quotation
- **Endpoint**: `POST /api/sales/quotations`
- **Request Body (Updated)**:
```json
{
  "customer_id": "uuid",
  "model": "CR-V",
  "version": "L",
  "color": "White",
  "price_components": {
    "base_price": 1000000000,
    "registration_tax": 100000000,
    "registration_fee": 20000000,
    "insurance": 15000000,
    "other_fees": 3000000
  },
  "accessories": ["id1", "id2"],
  "services": ["id3"],
  "promotions": [
    { "type": "DISCOUNT", "value": 5000000, "description": "New Year Sale" },
    { "type": "GIFT", "item_id": "g1", "description": "Free Carpet" }
  ],
  "payment_info": {
    "method": "INSTALLMENT", // or CASH
    "bank_id": "bidv_01",
    "loan_ratio": 80,
    "loan_term": 60,
    "interest_rate": 7.5
  },
  "notes": {
    "customer": "Please deliver on weekend",
    "internal": "Customer considering Mazda CX-5"
  }
}
```

### API-SAL-003: Get Quotation Detail
- **Endpoint**: `GET /api/sales/quotations/{id}`
- **Response (Updated)**:
  - Return full `promotions`, `payment_info`, `notes` objects.
  - Return `profit_analysis` (if Manager) including promotion cost breakdown.

### API-SAL-036: Calculate Installment (New)
- **Endpoint**: `POST /api/sales/quotations/calculate-installment`
- **Request**: `{ total_price, loan_ratio, loan_term, interest_rate }`
- **Response**:
```json
{
  "loan_amount": 800000000,
  "prepayment": 200000000,
  "monthly_payment": 15000000,
  "total_interest": 100000000,
  "schedule": [ ... ] // Array of monthly breakdown
}
```

---
**End of Module 3 API Spec v1.1**
