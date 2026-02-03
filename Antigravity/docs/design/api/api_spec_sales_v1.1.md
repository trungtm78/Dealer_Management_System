# Honda DMS - API Specification
## Module 3: Sales

**Version**: 1.1 (Enhanced)
**Date**: 2026-02-02
**Change Log**: v1.1: Added Payment/Notes fields to Quotation. Added Calculate Installment API. Added detailed calculation specs from Refs. (CR-20260202-004)

---

## 🔹 Sub-module 1: Quotations (Enhanced)

### API-SAL-002: Create Quotation
- **Endpoint**: `POST /api/sales/quotations`
- **Request Body**:
```json
{
  "customer_id": "uuid",
  "model": "CR-V",
  "version": "L",
  "color": "White",
  "price_components": {
    "base_price": 1319000000,
    "insurance": 23000000,
    "registration_tax": 131900000,
    "registration": 15000000,
    "other_fees": 2500000
  },
  "accessories": ["id1", "id2"],
  "services": ["id3"],
  "promotions": [
    { "type": "DISCOUNT", "value": -15000000, "description": "New Year Sale" },
    { "type": "GIFT", "item_id": "g1", "description": "Free Carpet" }
  ],
  "discount": 0,
  "payment_info": {
    "method": "INSTALLMENT",
    "bank_id": "vpbank",
    "prepayment_ratio": 0.3,
    "loan_term": 36,
    "interest_rate": 8.5
  },
  "notes": {
    "customer": "Delivery on weekend",
    "internal": "Customer considering Mazda CX-5"
  }
}
```

### API-SAL-003: Get Quotation Detail
- **Endpoint**: `GET /api/sales/quotations/{id}`
- **Response**:
```json
{
  "id": "uuid",
  "quote_number": "QT-2026-0001",
  "customer": { ... },
  "vehicle": { ... },
  "price_components": { ... },
  "accessories": [ ... ],
  "services": [ ... ],
  "promotions": [ ... ],
  "discount": 0,
  "otr_total": 1491400000,
  "final_total": 1476400000,
  "payment_info": { ... },
  "notes": { ... },
  "profit_analysis": {
    "total_revenue": 1476400000,
    "total_cost": 1350000000,
    "gross_profit": 126400000,
    "profit_margin": 8.56,
    "cost_breakdown": {
      "manufacturer": 1150000000,
      "accessories": 14000000,
      "services": 9000000,
      "insurance": 23000000,
      "registration_tax": 131900000,
      "registration": 15000000,
      "other_fees": 2500000,
      "operating": 25000000,
      "marketing": 15000000,
      "promotion": 15000000,
      "discount": 0,
      "commission": 40000000
    }
  }
}
```

### API-SAL-036: Calculate Installment (New)
- **Endpoint**: `POST /api/sales/quotations/calculate-installment`
- **Request**:
```json
{
  "total_price": 1476400000,
  "prepayment_ratio": 0.3,
  "loan_term": 36,
  "interest_rate": 8.5
}
```
- **Response**:
```json
{
  "loan_amount": 1033480000,
  "prepayment": 442920000,
  "monthly_payment": 32500000,
  "total_interest": 136520000,
  "total_payment": 1170000000,
  "schedule": [
    { "month": 1, "principal": 25000000, "interest": 7500000, "balance": 1008480000 },
    { "month": 2, "principal": 25200000, "interest": 7300000, "balance": 983280000 },
    ...
  ]
}
```

**Calculation Logic**:
```typescript
// PMT Formula
const P = loanAmount;
const r = (interestRate / 12) / 100;
const n = loanTerm;

const monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
```

### API-SAL-037: Calculate Profit Analysis (New)
- **Endpoint**: `POST /api/sales/quotations/calculate-profit`
- **Request**:
```json
{
  "base_price": 1319000000,
  "accessories_total": 20000000,
  "services_total": 18000000,
  "promotions_value": -15000000,
  "discount": 0,
  "actual_commission": 40000000
}
```
- **Response**:
```json
{
  "total_revenue": 1476400000,
  "total_cost": 1350000000,
  "gross_profit": 126400000,
  "profit_margin": 8.56,
  "margin_status": "MEDIUM",
  "cost_breakdown": { ... }
}
```

---
**End of Module 3 API Spec v1.1 (Enhanced)**
