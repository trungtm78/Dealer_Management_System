# Database Migration Plan: CR-20260201-001

## 1. Goal
Implement tables for RBAC (Roles/Permissions) and System Settings as defined in ERD v1.2.

## 2. Schema Changes (Prisma)
- New Model: `Role` (roles)
- New Model: `Permission` (permissions)
- New Model: `RolePermission` (role_permissions)
- New Model: `SystemSetting` (system_settings)
- Update Model: `User` (add `roleId`, `lastLogin`, `failedLoginAttempts`)

## 3. Migration Strategy
1. Create models in `schema.prisma`.
2. Generate migration: `npx prisma migrate dev --name add_rbac_system`.
3. Seed default roles (ADMIN, MANAGER) and permissions.
