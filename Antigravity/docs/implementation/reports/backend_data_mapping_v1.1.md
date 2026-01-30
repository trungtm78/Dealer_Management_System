# Backend Data Mapping Report v1.1

**Date**: 2026-01-28
**Objective**: Mapping Remaining API Endpoints to Database Entities

## 🔗 Traceability Matrix (Support Modules)

| FRD Screen ID | API Endpoint | Primary Table | Relations / Joins |
|---------------|--------------|---------------|-------------------|
| SCR-PRT-001 | `GET /api/parts` | `parts` | `suppliers` |
| SCR-PRT-003 | `POST /api/parts/movements/in` | `stock_movements` | `parts` (quantity update) |
| SCR-INS-002 | `POST /api/insurance/contracts` | `insurance_contracts` | `customers` (via FK) |
| SCR-ACC-002 | `POST /api/accounting/invoices` | `invoices` | `customers`, `users` |
| SCR-ACC-007 | `POST /api/accounting/payments` | `payments` | `invoices` (status check) |
| SCR-ADM-001 | `GET /api/admin/users` | `users` | N/A |
| SCR-ADM-002 | `GET /api/admin/audit-logs` | `activity_logs` | `users` |

## 📐 Implementation Consistency
- **Naming Patterns**: Followed standard naming for auto-generated keys (`INV-`, `PAY-`, `CLM-`).
- **Entity Integrity**: Every WRITE operation ensures child/related records are updated or linked correctly.
- **Relational Loading**: Used Prisma `include` and `select` to optimize data retrieval based on API Spec requirements.
