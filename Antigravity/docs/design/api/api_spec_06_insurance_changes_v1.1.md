# API Spec 06 - Insurance v1.1 - Change Summary

**Base Version**: v1.0  
**New Version**: v1.1  
**Date**: 2026-01-29  
**CR-ID**: CR-001

---

## Changes from v1.0

### Added APIs for Insurance Claims (5 new endpoints)

#### 1. GET /api/insurance/claims
**Purpose**: List all insurance claims with filters  
**Query Params**:
- `status`: SUBMITTED | REVIEWING | APPROVED | REJECTED | PAID
- `contract_id`: Filter by contract
- `claim_type`: ACCIDENT | THEFT | DAMAGE | OTHER
- `from_date`, `to_date`: Date range filter

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "claim_xxx",
      "claim_number": "CLM-2026-0001",
      "contract_id": "contract_xxx",
      "incident_date": "2026-01-15",
      "incident_type": "ACCIDENT",
      "claim_amount": 15000000,
      "approved_amount": 12000000,
      "status": "APPROVED",
      "documents": ["url1", "url2"],
      "created_at": "2026-01-16T10:00:00Z"
    }
  ],
  "meta": { "total": 50, "page": 1, "limit": 20 }
}
```

---

#### 2. POST /api/insurance/claims
**Purpose**: Create new insurance claim  
**Request Body**:
```json
{
  "contract_id": "contract_xxx",
  "incident_date": "2026-01-15",
  "incident_type": "ACCIDENT",
  "incident_description": "Rear-end collision at intersection",
  "claim_amount": 15000000,
  "documents": ["file1.jpg", "file2.pdf"]
}
```

**Response**: Created claim object (201)

---

#### 3. GET /api/insurance/claims/{id}
**Purpose**: Get claim detail with full history  
**Response**: Full claim object with timeline

---

#### 4. PUT /api/insurance/claims/{id}
**Purpose**: Update claim (status, approved amount)  
**Request Body**:
```json
{
  "status": "APPROVED",
  "approved_amount": 12000000,
  "reviewer_notes": "Approved with deductible"
}
```

---

#### 5. POST /api/insurance/claims/{id}/approve
**Purpose**: Approve claim (workflow action)  
**Request Body**:
```json
{
  "approved_amount": 12000000,
  "notes": "Approved"
}
```

**Business Rules**:
- Only MANAGER role can approve
- Claims > 10M VND require manager approval
- Auto-send email notification on status change

---

## Change Log

| Version | Date | CR-ID | Changes | Author |
|---------|------|-------|---------|--------|
| 1.1 | 2026-01-29 | CR-001 | Added 5 APIs for insurance claims management | Antigravity |
| 1.0 | 2026-01-28 | - | Initial API spec for Insurance module (contracts only) | Antigravity |

---

**Total APIs**: 10 (v1.0) → 15 (v1.1) = +5

**End of API Spec 06 v1.1 Change Summary**
