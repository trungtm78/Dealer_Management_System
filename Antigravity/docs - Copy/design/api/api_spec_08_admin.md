# Honda DMS - API Specification
## Module 8: Admin

**Version**: 1.0  
**Date**: 2026-01-28  
**Module**: Admin  
**Total APIs**: 10

---

## 📋 Module Overview

**Purpose**: Quản lý hệ thống, người dùng, phân quyền, audit logs

**FRD References**: SCR-ADM-001, SCR-ADM-002

**Sub-modules**:
1. **Users** (5 APIs)
2. **Permissions** (2 APIs)
3. **Audit Logs** (3 APIs)

---

## 🔹 Users (5 APIs)

### API-ADM-001: List Users
- **Endpoint**: `GET /api/admin/users`
- **ERD**: `users` table
- **Response**: Array of users

### API-ADM-002: Create User
- **Endpoint**: `POST /api/admin/users`
- **ERD**: `users` INSERT
- **Response**: Created user

### API-ADM-003: Update User
- **Endpoint**: `PUT /api/admin/users/{id}`
- **ERD**: `users` UPDATE
- **Response**: Updated user

### API-ADM-004: Deactivate User
- **Endpoint**: `POST /api/admin/users/{id}/deactivate`
- **ERD**: `users` UPDATE status='INACTIVE'
- **Response**: Deactivated user

### API-ADM-005: Reset Password
- **Endpoint**: `POST /api/admin/users/{id}/reset-password`
- **ERD**: `users` UPDATE password_hash
- **Response**: Success message

---

## 🔹 Permissions (2 APIs)

### API-ADM-006: Get User Permissions
- **Endpoint**: `GET /api/admin/users/{id}/permissions`
- **ERD**: Read from role-based permissions
- **Response**: User permissions list

### API-ADM-007: Update User Permissions
- **Endpoint**: `PUT /api/admin/users/{id}/permissions`
- **ERD**: Update role or custom permissions
- **Response**: Updated permissions

---

## 🔹 Audit Logs (3 APIs)

### API-ADM-008: List Audit Logs
- **Endpoint**: `GET /api/admin/audit-logs`
- **ERD**: `activity_logs`, JOIN `users`
- **Response**: Array of audit logs

### API-ADM-009: Get Audit Log Detail
- **Endpoint**: `GET /api/admin/audit-logs/{id}`
- **ERD**: `activity_logs`, JOIN `users`
- **Response**: Full audit log details

### API-ADM-010: Get System Metrics
- **Endpoint**: `GET /api/admin/metrics`
- **ERD**: `system_metrics` table
- **Response**: System performance metrics

---

**End of Module 8: Admin (10 APIs)**

---

**🎉 API Specification Complete: 175 APIs across 8 modules**
