# Backend Data Mapping Report v1.0

**Date**: 2026-01-28
**Objective**: Mapping API Endpoints to Database Entities & Relations

## 🔗 Traceability Matrix

| FRD Screen ID | API Endpoint | Primary Table | Relations / Joins |
|---------------|--------------|---------------|-------------------|
| SCR-DASH-001 | `GET /api/dashboard/kpis` | `leads` | `customers`, `quotations`, `test_drives` |
| SCR-CRM-001 | `GET /api/crm/leads` | `leads` | `users` (assigned_to) |
| SCR-CRM-001 | `POST /api/crm/leads/:id/convert` | `leads` | `customers` (Transaction) |
| SCR-CRM-002 | `GET /api/crm/customers` | `customers` | N/A |
| SCR-CRM-002 | `GET /api/crm/customers/:id` | `customers` | `contracts` (count), `leads` (count) |
| SCR-CRM-007 | `POST /api/crm/customers/:id/loyalty` | `loyalty_transactions` | `customers` (points update) |
| SCR-SAL-001 | `POST /api/sales/quotations` | `quotations` | `users` (created_by) |
| SCR-SAL-005 | `POST /api/sales/contracts` | `contract` | `quotations` (status update), `customers` |
| SCR-SVC-005 | `GET /api/service/orders/:id` | `repair_orders` | `line_items`, `work_logs`, `technician` |

## 📐 Logic Patterns
- **Aggregation**: Used in Dashboard for real-time KPIs.
- **Transactions**: Used in Lead Conversion and Contract Creation to ensure data consistency across multiple tables.
- **Auto-generation**: Custom logic for Business Keys (Quote Numbers, Contract Numbers).
- **Soft Delete**: Implemented via status updates (e.g., status='DEAD' for leads) as per ERD requirements.
