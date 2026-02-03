# Integration Test Plan: CR-20260201-001

## 1. Test Scenarios
- **Security**: Verify non-admin users cannot access `/admin/*` APIs.
- **RBAC**: updates to Permissions apply immediately (or after token refresh).
- **Audit**: Critical actions (Delete User, Change Permission) must generate audit logs.
- **Insurance**: Claim lifecycle (Submit -> Approve -> Pay) status transitions.

## 2. Execution
- Automated API tests.
- Manual verification of Permission Blockers on Frontend.
