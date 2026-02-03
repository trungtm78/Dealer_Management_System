# Backend Implementation Plan: CR-20260201-001

## 1. Services
- `PermissionService`: Handle logic for Role assignment and Permission checking.
- `AuditService`: Async logger for user activities.
- `SettingsService`: Typed configuration manager.
- `InsuranceService`: Business logic for claims and policies.

## 2. Integration
- Integrate `AuditService` into shared Prisma middleware or service wrappers.
