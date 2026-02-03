# Honda DMS - API Specification Index

**Version**: 1.0  
**Date**: 2026-01-28  
**Author**: Antigravity - System & API Design Authority

---

## 📋 Overview

API Specification cho Honda Dealer Management System được tổ chức theo **8 modules** để dễ maintain và navigate.

**Total APIs**: 175 endpoints across 8 modules

---

## 📂 Module Files

### Module 1: Dashboard (5 APIs)
**File**: [api_spec_01_dashboard.md](./api_spec_01_dashboard.md)

**APIs**:
- `GET /api/dashboard/kpis` - Get Dashboard KPIs
- `GET /api/dashboard/revenue-chart` - Get Revenue Chart Data
- `GET /api/dashboard/leads-chart` - Get Leads Source Chart Data
- `GET /api/dashboard/models-chart` - Get Top Models Chart Data
- `GET /api/dashboard/notifications` - Get Notifications

**FRD Reference**: SCR-DASH-001

---

### Module 2: CRM (40 APIs)
**File**: [api_spec_02_crm.md](./api_spec_02_crm.md)

**Sub-modules**:
- **Leads Management** (10 APIs) - SCR-CRM-001
- **Customers Management** (8 APIs) - SCR-CRM-002
- **Scoring Management** (5 APIs) - SCR-CRM-003
- **Interactions** (5 APIs) - SCR-CRM-005
- **Reminders** (4 APIs) - SCR-CRM-006
- **Complaints** (4 APIs) - SCR-CRM-009
- **Marketing** (4 APIs) - SCR-CRM-010

**Key Endpoints**:
- `/api/crm/leads` - Leads CRUD
- `/api/crm/customers` - Customers CRUD
- `/api/crm/scoring/rules` - Scoring configuration
- `/api/crm/interactions` - Activity tracking
- `/api/crm/reminders` - Maintenance reminders
- `/api/crm/complaints` - Complaint management
- `/api/crm/campaigns` - Marketing campaigns

---

### Module 3: Sales (35 APIs)
**File**: [api_spec_03_sales.md](./api_spec_03_sales.md)

**Sub-modules**:
- **Quotations** (8 APIs) - SCR-SAL-001, SCR-SAL-002
- **Test Drives** (6 APIs) - SCR-SAL-003, SCR-SAL-004
- **VIN Management** (6 APIs) - SCR-SAL-005, SCR-SAL-006
- **Contracts** (5 APIs) - SCR-SAL-007
- **Deposits** (5 APIs) - SCR-SAL-008
- **PDS (Pre-Delivery Service)** (5 APIs) - SCR-SAL-009

**Key Endpoints**:
- `/api/sales/quotations` - Quotation management
- `/api/sales/test-drives` - Test drive scheduling
- `/api/sales/vin` - VIN inventory & allocation
- `/api/sales/contracts` - Sales contracts
- `/api/sales/deposits` - Deposit management
- `/api/sales/pds` - Pre-delivery service

---

### Module 4: Service (30 APIs)
**File**: [api_spec_04_service.md](./api_spec_04_service.md)

**Sub-modules**:
- **Service Quotes** (5 APIs) - SCR-SVC-001
- **Appointments** (6 APIs) - SCR-SVC-002, SCR-SVC-003
- **Repair Orders** (10 APIs) - SCR-SVC-004, SCR-SVC-005
- **Quality Control** (4 APIs) - SCR-SVC-007
- **Settlement** (5 APIs) - SCR-SVC-008

**Key Endpoints**:
- `/api/service/quotes` - Service quotations
- `/api/service/appointments` - Service appointments
- `/api/service/orders` - Repair orders (RO)
- `/api/service/work-logs` - Technician work logs
- `/api/service/qc` - Quality control
- `/api/service/settlement` - Payment settlement

---

### Module 5: Parts (25 APIs)
**File**: [api_spec_05_parts.md](./api_spec_05_parts.md)

**Sub-modules**:
- **Inventory** (5 APIs) - SCR-PRT-001, SCR-PRT-002
- **Stock Movements** (5 APIs) - SCR-PRT-003
- **Purchase Orders** (8 APIs) - SCR-PRT-004, SCR-PRT-010
- **Stock Take** (5 APIs) - SCR-PRT-006
- **Pricing** (2 APIs) - SCR-PRT-009

**Key Endpoints**:
- `/api/parts/inventory` - Parts inventory
- `/api/parts/movements` - Stock movements
- `/api/parts/purchases` - Purchase orders
- `/api/parts/stock-take` - Stock taking
- `/api/parts/pricing` - Parts pricing

---

### Module 6: Insurance (10 APIs)
**File**: [api_spec_06_insurance.md](./api_spec_06_insurance.md)

**Sub-modules**:
- **Contracts** (5 APIs) - SCR-INS-002, SCR-INS-003
- **Claims** (5 APIs) - SCR-INS-004, SCR-INS-005

**Key Endpoints**:
- `/api/insurance/contracts` - Insurance contracts
- `/api/insurance/claims` - Insurance claims

---

### Module 7: Accounting (20 APIs)
**File**: [api_spec_07_accounting.md](./api_spec_07_accounting.md)

**Sub-modules**:
- **Invoices** (5 APIs) - SCR-ACC-005, SCR-ACC-006
- **Payments** (5 APIs) - SCR-ACC-005, SCR-ACC-006
- **Reports** (10 APIs) - SCR-ACC-001 to SCR-ACC-008

**Key Endpoints**:
- `/api/accounting/invoices` - Invoice management
- `/api/accounting/payments` - Payment processing
- `/api/accounting/reports/pl` - P&L Report
- `/api/accounting/reports/balance-sheet` - Balance Sheet
- `/api/accounting/reports/cash-flow` - Cash Flow
- `/api/accounting/reports/ar` - Accounts Receivable
- `/api/accounting/reports/ap` - Accounts Payable
- `/api/accounting/assets` - Fixed assets

---

### Module 8: Admin (10 APIs)
**File**: [api_spec_08_admin.md](./api_spec_08_admin.md)

**Sub-modules**:
- **Users** (5 APIs) - SCR-ADM-001
- **Permissions** (2 APIs) - SCR-ADM-001
- **Audit Logs** (3 APIs) - SCR-ADM-002

**Key Endpoints**:
- `/api/admin/users` - User management
- `/api/admin/permissions` - Permission management
- `/api/admin/audit-logs` - System audit logs
- `/api/admin/metrics` - System metrics

---

## 📐 API Design Principles

### Naming Convention
**Pattern**: `{HTTP_METHOD} /api/{module}/{resource}[/{id}][/{action}]`

**Examples**:
- `GET /api/crm/leads` - List leads
- `POST /api/crm/leads` - Create lead
- `GET /api/crm/leads/{id}` - Get lead detail
- `PUT /api/crm/leads/{id}` - Update lead
- `DELETE /api/crm/leads/{id}` - Delete lead
- `POST /api/crm/leads/{id}/convert` - Convert lead to customer

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "{MODULE}_{HTTP_CODE}",
    "message": "Error message",
    "details": { ... }
  }
}
```

### Error Code Pattern
- **Format**: `{MODULE}_{HTTP_CODE}`
- **Examples**: `CRM_404`, `SAL_400`, `SVC_409`

---

## 📊 Supporting Documents

### API Data Mapping
**File**: [api_data_mapping_v1.0.md](./api_data_mapping_v1.0.md)

Complete mapping matrix:
- API Name → Endpoint → Method
- Screen ID (FRD)
- Entity & Table (ERD)
- CRUD permissions

### API Change Log
**File**: [api_change_log.md](./api_change_log.md)

Version history and change tracking.

---

## 🎯 Traceability

Mỗi API **PHẢI** có full traceability:

```
FRD Screen ID → API Endpoint → ERD Table
```

**Example**:
```
SCR-CRM-001 (Quản Lý Leads)
  → GET /api/crm/leads
  → Table: leads
  → Relations: leads.assigned_to_id → users.id
```

---

## 📅 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-28 | Antigravity | Initial API design - 175 endpoints |

---

**End of API Specification Index**
