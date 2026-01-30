# Integration Test Cases v1.0

**Date**: 2026-01-28
**Author**: OpenCode - Integration Test Executor
**Version**: 1.0

## 🧪 Module: CRM - Leads

### IT-CRM-LEAD-001: Create Lead (Happy Path)
- **Endpoint**: `POST /api/crm/leads`
- **FRD**: SCR-CRM-001
- **ERD**: `leads`
- **Payload**:
    ```json
    { "name": "IT Test Lead", "phone": "0900111222", "source": "WEBSITE" }
    ```
- **Expected Response**: `201 Created`, schema matches `Lead` entity, `status: "NEW"`, `score: 10`.
- **Expected DB State**: One new record in `leads` table with provided info.

### IT-CRM-LEAD-002: Create Lead (Validation Fail)
- **Endpoint**: `POST /api/crm/leads`
- **Payload**: `{ "name": "A", "phone": "123" }`
- **Expected Response**: `400 Bad Request`.
- **Error Condition**: `name` too short, `phone` invalid length.

### IT-CRM-LEAD-003: Get Lead Detail
- **Endpoint**: `GET /api/crm/leads/{id}`
- **Precondition**: Lead with ID from IT-CRM-LEAD-001 exists.
- **Expected Response**: `200 OK`, includes `assignedTo` and `interactions` objects.

### IT-CRM-LEAD-004: Convert Lead to Customer
- **Endpoint**: `POST /api/crm/leads/{id}/convert`
- **Payload**: `{ "create_new": true }`
- **Expected Response**: `201 Created`, returns the new `Customer` object.
- **Expected DB State**: 
    - Lead status in DB is `WON`.
    - New record in `customers` table with Lead's phone.

## 🧪 Module: CRM - Customers

### IT-CRM-CUS-001: List Customers (Filtering)
- **Endpoint**: `GET /api/crm/customers?tier=SILVER`
- **Expected Response**: `200 OK`, only customers with `tier: "SILVER"` and `status: "ACTIVE"` returned.

### IT-CRM-CUS-002: Add Loyalty Points
- **Endpoint**: `POST /api/crm/customers/{id}/loyalty`
- **Payload**: `{ "points": 1000, "description": "IT Test Bonus" }`
- **Expected Response**: `201 Created`, returns `new_tier: "SILVER"` (if starting from BRONZE).
- **Expected DB State**:
    - New record in `loyalty_transactions`.
    - Customer `points` incremented by 1000.
