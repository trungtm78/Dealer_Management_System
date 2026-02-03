# Integration Test Data Setup v1.0

**Date**: 2026-01-28
**Author**: OpenCode - Integration Test Executor
**Version**: 1.0

## 📦 Master Data Assumptions
The following data must exist in the database before running tests:

1.  **Users**:
    - `id: "user-1"`, `name: "Sale Consultant A"`, `role: "SALES"`
    - `id: "user-2"`, `name: "Manager B"`, `role: "MANAGER"`
2.  **Scoring Rules**:
    - Default rules for source and interaction frequency.

## 🔨 Transaction Data Setup

### 1. Lead Lifecycle Flow
- **Precondition**: No existing leads with phone `0909123456`.
- **Action**: Create lead via `POST /api/crm/leads`.
- **Expected**: Lead saved in `leads` table with `status: "NEW"`.

### 2. Conversion Flow
- **Precondition**: Lead with `id: "test-lead-001"` exists.
- **Action**: Convert lead via `POST /api/crm/leads/{id}/convert`.
- **Expected**: 
    - Record created in `customers` table.
    - Lead status updated to `WON`.
    - Lead linked to Customer via `customer_id`.

## 🧹 Cleanup Strategy
To ensure test isolation and repeatability:
- **Global Teardown**: Execute `DELETE` on all related tables using specific test prefixes or IDs.
- **Specific Cleanup**:
    ```sql
    DELETE FROM leads WHERE phone LIKE 'TEST%';
    DELETE FROM customers WHERE phone LIKE 'TEST%';
    DELETE FROM loyalty_transactions WHERE reason LIKE 'TEST%';
    ```
- **Automated Hook**: Tests implemented in Vitest use `beforeAll` or `afterEach` to reset relevant state.
