# Frontend Data Binding Report v1.0

**Date**: 2026-01-28
**Author**: OpenCode - Frontend Execution Authority
**Version**: 1.0

## 🔗 API to ERD Mapping

| Screen ID | API Endpoint | ERD Table(s) | Key Fields / Data Mapping |
|-----------|--------------|--------------|---------------------------|
| SCR-DASH-001 | `GET /api/dashboard/kpis` | `leads`, `customers`, `quotations`, `test_drives`, `repair_orders` | Aggregate counts and revenue sums. |
| SCR-CRM-001 | `GET /api/crm/leads` | `leads` | `id`, `name`, `status`, `score`, `assigned_to_id` |
| SCR-CRM-002 | `GET /api/crm/customers` | `customers` | `id`, `name`, `tier`, `points`, `phone` |
| SCR-CRM-003 | `GET /api/crm/scoring/rules` | `scoring_rules` | `name`, `weight`, `condition` (JSON) |
| SCR-CRM-005 | `GET /api/crm/leads/{id}/activities` | `interactions` | `type`, `notes`, `created_at` |
| SCR-CRM-007 | `GET /api/crm/customers/{id}/loyalty` | `loyalty_transactions` | `points`, `type`, `reason` |
| SCR-SAL-001 | `POST /api/sales/quotations` | `quotations` | `quote_number`, `total_price`, `accessories` (JSON) |
| SCR-SAL-003 | `GET /api/sales/test-drives` | `test_drives` | `scheduled_date`, `model`, `customer_id` |
| SCR-SAL-005 | `GET /api/sales/contracts` | `contracts`, `vins` | `contract_number`, `vin_id` (allocation) |
| SCR-SVC-001 | `GET /api/service/quotations` | `service_quotes` | `vehicle_info` (JSON), `total_amount` |
| SCR-SVC-003 | `GET /api/service/repair-orders` | `repair_orders` | `ro_number`, `status`, `vehicle_info` (JSON) |
| SCR-PRT-001 | `GET /api/parts` | `parts` | `part_number`, `quantity`, `unit_price` |
| SCR-ACC-001 | `GET /api/accounting/dashboard` | `invoices`, `payments` | `total_amount`, `paid_amount`, `status` |

## 📐 Field Mapping Exceptions / Complex Logic

1.  **JSON Fields**: Several entities (`quotations`, `service_quotes`, `repair_orders`, `customers`) use JSON fields for flexible data (tags, vehicle info, line items). These are parsed on the client-side for display.
2.  **Aggregation**: Dashboard KPIs are calculated via backend aggregation APIs to minimize payload size.
3.  **Soft Deletes**: List screens filter out records with `status: "DEAD"` or `status: "INACTIVE"` depending on the module.
