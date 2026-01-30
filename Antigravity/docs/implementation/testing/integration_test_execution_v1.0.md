# Integration Test Execution v1.0

**Date**: 2026-01-28
**Author**: OpenCode - Integration Test Executor
**Version**: 1.0

| IT-ID | Result | Evidence / Log | Notes |
|-------|--------|----------------|-------|
| IT-CRM-LEAD-001 | ❌ FAIL | `AssertionError: expected 400 to be 201` | Server Actions logic conflict with API route validation. |
| IT-CRM-LEAD-002 | ✅ PASS | `400 Bad Request` | Validation for phone/name length works. |
| IT-CRM-LEAD-003 | ❌ FAIL | `500 Internal Server Error` | Prisma field naming mismatch (`createdAt` vs `created_at`). |
| IT-CRM-LEAD-004 | ❌ FAIL | `500 Internal Server Error` | Transaction logic failed due to missing `wonAt` field in schema. |
| IT-CRM-CUS-001 | ❌ FAIL | `500 Internal Server Error` | Field mapping mismatch in filtering logic. |
| IT-CRM-CUS-002 | ❌ FAIL | `500 Internal Server Error` | Database validation error on `state` field (not in ERD). |

## 🕵️ Analysis of Failures

1.  **Contract Mismatch (BE Logic)**:
    - Backend services/actions are using `camelCase` (e.g., `createdAt`) while the Prisma schema/ERD defines `snake_case` (e.g., `created_at`).
2.  **Schema Discrepancy**:
    - Tests expected a `state` field in `Customer`, but it's not defined in `schema.prisma`.
    - API code references `wonAt` and `lostAt` in `Lead`, which are missing from the current `Lead` model in `schema.prisma`.
3.  **Validation Conflicts**:
    - `POST /api/crm/leads` returned `400` during happy path due to internal validation logic in Server Actions incorrectly flagging valid IT payloads.
