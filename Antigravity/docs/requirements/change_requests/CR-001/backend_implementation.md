# Backend Implementation Plan: CR-001

## 1. Services Architecture

### 1.1 RBAC Service (`PermissionService`)
- `checkPermission(userId, permission)`: Main check function.
- `assignPermissions(roleId, permissionIds)`: Transactional assignment.
- Cache user permissions in Redis/Memory for performance.

### 1.2 Audit Service (`AuditService`)
- `log(userId, action, entity, resourceId, details)`: Async logging.
- Intercept critical actions (Create/Update/Delete) via Middleware or Service hooks.

### 1.3 Settings Service (`SystemSettingService`)
- `get(key)`: Typed retrieval.
- `set(key, value)`: Validation options based on type.

### 1.4 Insurance Services
- `InsuranceContractService`: Handle renewals, expiration checks.
- `InsuranceClaimService`: Handle state machine for claims (Submitted -> Approved -> Paid).

## 2. Business Logic Implementation

### 2.1 Permission Logic
- System Actions (`admin.system.*`) require ADMIN role or specific permission.
- Data Scoping: Sales consultants only see THEIR leads (Row Level Security logic in Service).

### 2.2 Claim Approval Workflow
- Claims < 10M: Auto-pre-approve (set status REVIEWING).
- Claims >= 10M: Require MANAGER role to Approve.
