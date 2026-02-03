# Integration Test Plan v1.0

**Date**: 2026-01-28
**Author**: OpenCode - Integration Test Executor
**Version**: 1.0

## 📋 Scope: Module CRM

This plan covers the integration testing for the CRM module, ensuring connectivity and logic between the API Layer, Backend Services, and Database (SQLite/Prisma).

### 🎯 Endpoint Mapping

| Endpoint | Method | FRD mapping | ERD mapping |
|----------|--------|-------------|-------------|
| `/api/crm/leads` | GET | SCR-CRM-001 (List Leads) | `leads`, `users` |
| `/api/crm/leads` | POST | SCR-CRM-001 (Create Lead) | `leads` |
| `/api/crm/leads/{id}` | GET | SCR-CRM-001 (Lead Detail) | `leads`, `users`, `customers` |
| `/api/crm/leads/{id}` | PUT | SCR-CRM-001 (Update Lead) | `leads` |
| `/api/crm/leads/{id}` | DELETE | SCR-CRM-001 (Delete Lead) | `leads` (Soft Delete) |
| `/api/crm/leads/{id}/convert` | POST | SCR-CRM-001 (Convert) | `leads`, `customers` |
| `/api/crm/customers` | GET | SCR-CRM-002 (List Customers) | `customers` |
| `/api/crm/customers` | POST | SCR-CRM-002 (Create Customer) | `customers` |
| `/api/crm/customers/{id}` | GET | SCR-CRM-002 (Customer Detail) | `customers`, `contracts`, `leads` |
| `/api/crm/customers/{id}/loyalty` | POST | SCR-CRM-007 (Loyalty) | `loyalty_transactions`, `customers` |
| `/api/crm/leads/{id}/score` | POST | SCR-CRM-003 (Scoring) | `leads` |

## ⚙️ Environment & Tools
- **Backend**: NestJS (API Layer)
- **ORM**: Prisma Client v5.22
- **Database**: SQLite (dev.db)
- **Test Tool**: Vitest (Integration Suite)
- **Execution Level**: Contract + Business Logic + DB Persistence
