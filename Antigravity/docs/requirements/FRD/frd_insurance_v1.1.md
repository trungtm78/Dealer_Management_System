# Functional Requirements Document (FRD)
## Honda Dealer Management System - Module 6: Bảo Hiểm (Insurance)

---

## 📋 Document Control

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Module** | Module 6 - Bảo Hiểm (Insurance) |
| **Số Screens** | 5 |
| **Phiên Bản** | 1.1 |
| **Ngày Tạo** | 28/01/2026 |
| **Cập Nhật** | 31/01/2026 (CR-20250131-002) |
| **Status** | ✅ **READY FOR IMPLEMENTATION** |

---

## 📊 Module Overview

**Mục đích**: Quản lý hợp đồng bảo hiểm và quy trình bồi thường

**Screens trong Module**:

| # | Screen ID | Screen Name | Route | Status |
|---|-----------|-------------|-------|--------|
| 1 | SCR-INS-001 | Tổng Quan BH | `/insurance/dashboard` | ✅ DEFINED |
| 2 | SCR-INS-002 | Danh Sách HĐ | `/insurance/contracts` | ✅ DEFINED |
| 3 | SCR-INS-003 | Chi Tiết HĐ | `/insurance/contract-detail` | ✅ DEFINED |
| 4 | SCR-INS-004 | DS Bồi Thường | `/insurance/claims` | ✅ DEFINED |
| 5 | SCR-INS-005 | CT Bồi Thường | `/insurance/claim-detail` | ✅ DEFINED |

---

## 🎯 SCR-INS-001: Tổng Quan Bảo Hiểm

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-INS-001 |
| **Screen Name** | Tổng Quan Bảo Hiểm |
| **Route** | `/insurance/dashboard` |
| **Access Control** | INSURANCE, MANAGER, ADMIN |

### 2. Required UI Components
(See v1.0 for layout details - Retained)

### 3. Functional Specifications
- **Display KPIs**: Active Contracts, Expiring, Claims Month/Ratio, Revenue.
- **Charts**: Contracts by Type, Claims Trend.

---

## 🎯 SCR-INS-002: Danh Sách Hợp Đồng

### 1. Screen Information
**ID**: SCR-INS-002 | **Route**: `/insurance/contracts`

### 2. Required UI Components
**Component**: `InsuranceContractList.tsx`
- Filters: Search, Status, Type, Date Range.
- Table: Contract No, Customer, Vehicle, Premium, Dates, Status.

### 3. Functional Specifications
- **View**: List all contracts with pagination.
- **Filter**: Filter by implementation status.
- **Actions**: View detail, Renew, Cancel.

### 4. Data Requirements
**Entity**: `insurance_contracts`
- Fields: id, contract_number, customer_id, vehicle_id, type, premium, dates, status.

---

## 🎯 SCR-INS-003: Chi Tiết Hợp Đồng

### 1. Screen Information
**ID**: SCR-INS-003 | **Route**: `/insurance/contract-detail/:id`

### 2. Required UI Components
**Component**: `InsuranceContractDetail.tsx`
- Sections: Info, Customer/Vehicle, Coverage, Payment History, Claims History, Documents.

### 3. Functional Specifications
- **Edit**: Modify contract details.
- **Renew**: Trigger renewal workflow.
- **Upload**: Attach policy docs/receipts.

---

## 🎯 SCR-INS-004: Danh Sách Bồi Thường

### 1. Screen Information
**ID**: SCR-INS-004 | **Route**: `/insurance/claims`

### 2. Required UI Components
**Component**: `InsuranceClaimList.tsx`
- Filters: Search, Status (Submitted, Reviewing, Approved, Paid, Rejected).
- Table: Claim No, Contract, Customer, Amount, Status.

### 3. Functional Specifications
- **Workflow**: List claims by status.
- **Actions**: View detail, Process status.

### 4. Data Requirements
**Entity**: `insurance_claims`
- Fields: id, claim_number, contract_id, incident_date, amount, status.

---

## 🎯 SCR-INS-005: Chi Tiết Bồi Thường

### 1. Screen Information
**ID**: SCR-INS-005 | **Route**: `/insurance/claim-detail/:id`

### 2. Required UI Components
**Component**: `InsuranceClaimDetail.tsx`
- Sections: Claim Info, Contract, Incident Report (Photos), Approval Flow.

### 3. Functional Specifications
- **Workflow**:
    - SUBMITTED -> REVIEWING (Staff)
    - REVIEWING -> APPROVED/REJECTED (Manager)
    - APPROVED -> PAID (Accountant)
- **Rules**:
    - Claims < 10M: Auto-approve possible via rule.
    - Claims >= 10M: Manager approval required.

---

## Change Log

| Version | Date | Changes | Related |
|---------|------|---------|---------|
| 1.1 | 31/01/2026 | Finalized specs for SCR-INS-001 to 005. Updated status to READY. | CR-20250131-002 |
| 1.0 | 28/01/2026 | Initial Draft | - |

**End of FRD Module 06 v1.1**
