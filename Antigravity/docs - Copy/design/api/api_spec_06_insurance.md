# Honda DMS - API Specification
## Module 6: Insurance

**Version**: 1.0  
**Date**: 2026-01-28  
**Module**: Insurance  
**Total APIs**: 10

---

## 📋 Module Overview

**Purpose**: Quản lý bảo hiểm xe và xử lý bồi thường

**FRD References**: SCR-INS-001 to SCR-INS-005

**Sub-modules**:
1. **Contracts** (5 APIs)
2. **Claims** (5 APIs)

---

## 🔹 Contracts (5 APIs)

### API-INS-001: List Insurance Contracts
- **Endpoint**: `GET /api/insurance/contracts`
- **ERD**: `insurance_contracts`, JOIN `customers`
- **Response**: Array of insurance contracts

### API-INS-002: Create Insurance Contract
- **Endpoint**: `POST /api/insurance/contracts`
- **ERD**: `insurance_contracts` INSERT
- **Response**: Created contract with contract_number

### API-INS-003: Get Contract Detail
- **Endpoint**: `GET /api/insurance/contracts/{id}`
- **ERD**: `insurance_contracts`, JOIN `customers`, `insurance_claims`
- **Response**: Full contract details + claims history

### API-INS-004: Update Contract
- **Endpoint**: `PUT /api/insurance/contracts/{id}`
- **ERD**: `insurance_contracts` UPDATE
- **Response**: Updated contract

### API-INS-005: Renew Contract
- **Endpoint**: `POST /api/insurance/contracts/{id}/renew`
- **ERD**: `insurance_contracts` INSERT (new contract)
- **Response**: Renewed contract

---

## 🔹 Claims (5 APIs)

### API-INS-006: List Insurance Claims
- **Endpoint**: `GET /api/insurance/claims`
- **ERD**: `insurance_claims`, JOIN `insurance_contracts`, `customers`
- **Response**: Array of claims

### API-INS-007: Create Insurance Claim
- **Endpoint**: `POST /api/insurance/claims`
- **ERD**: `insurance_claims` INSERT
- **Response**: Created claim with claim_number

### API-INS-008: Get Claim Detail
- **Endpoint**: `GET /api/insurance/claims/{id}`
- **ERD**: `insurance_claims`, JOIN `insurance_contracts`, `users`
- **Response**: Full claim details

### API-INS-009: Update Claim Status
- **Endpoint**: `PUT /api/insurance/claims/{id}/status`
- **ERD**: `insurance_claims` UPDATE status, reviewed_by_id, reviewed_at
- **Response**: Updated claim

### API-INS-010: Approve Claim Payment
- **Endpoint**: `POST /api/insurance/claims/{id}/approve`
- **ERD**: `insurance_claims` UPDATE status='APPROVED', approved_amount, paid_at
- **Response**: Approved claim

---

**End of Module 6: Insurance (10 APIs)**
