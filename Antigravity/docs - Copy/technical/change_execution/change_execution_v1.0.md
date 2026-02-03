# Change Execution Instruction v1.0

**CR-ID**: CR-001  
**Date**: 2026-01-29  
**Target**: OpenCode (Implementation Agent)  
**Authority**: Antigravity (Change Request Authority)

---

## 📋 A. CR SUMMARY

**Title**: Complete Missing Screens Implementation  
**Scope**: 7 screens (Insurance: 2, Admin: 5)  
**Priority**: 🔴 CRITICAL (Security & Compliance)  
**Timeline**: 7 weeks (278 hours)

---

## 📚 B. UPDATED DOCUMENTS (VERSION MỚI)

OpenCode PHẢI đọc các tài liệu version mới sau:

| # | Document | Version | File Path |
|---|----------|---------|-----------|
| 1 | **BRD** | v2.1 | `docs/requirements/BRD/BRD_changes_v2.1.md` |
| 2 | **FRD Insurance** | v1.1 | `docs/requirements/FRD/FRD_Module_06_Insurance_changes_v1.1.md` |
| 3 | **FRD Admin** | v2.0 | `docs/requirements/FRD/FRD_Module_08_Admin_changes_v2.0.md` |
| 4 | **ERD** | v1.1 | `docs/design/database/erd/erd_changes_v1.1.md` |
| 5 | **API Spec Insurance** | v1.1 | `docs/design/api/api_spec_06_insurance_changes_v1.1.md` |
| 6 | **API Spec Admin** | v2.0 | `docs/design/api/api_spec_08_admin_changes_v2.0.md` |
| 7 | **UI Spec** | v1.1 | `docs/design/ui/ui_spec_changes_v1.1.md` |
| 8 | **UAT Plan** | v1.2 | `docs/design/testing/uat_plan_changes_v1.2.md` |

**Note**: Các files trên là **change summary documents** - chỉ chứa phần thay đổi so với version trước. Để xem full content, tham khảo files gốc (v1.0/v2.0).

---

## 🎯 C. PHẠM VI SỬA (ALLOWED TO MODIFY)

### Phase 1: Insurance Module (Weeks 1-2)

**INS-001: Insurance Contracts** (`/insurance/contracts`)
- ✅ Tạo/sửa: `app/(main)/insurance/contracts/page.tsx`
- ✅ Tạo: `components/insurance/InsuranceContractList.tsx`
- ✅ Tạo: `components/insurance/InsuranceContractForm.tsx`
- ✅ Tạo: `components/insurance/InsuranceContractDetail.tsx`
- ✅ Tạo: `components/insurance/ReminderScheduler.tsx`
- ❌ KHÔNG SỬA: `actions/insurance/contracts.ts` (đã hoàn chỉnh)
- ❌ KHÔNG SỬA: `app/api/insurance/contracts/route.ts` (đã hoàn chỉnh)

**INS-002: Insurance Claims** (`/insurance/claims`)
- ✅ Tạo: `app/api/insurance/claims/route.ts`
- ✅ Tạo: `app/api/insurance/claims/[id]/route.ts`
- ✅ Tạo: `app/api/insurance/claims/[id]/approve/route.ts`
- ✅ Tạo: `actions/insurance/claims.ts`
- ✅ Tạo/sửa: `app/(main)/insurance/claims/page.tsx`
- ✅ Tạo: `components/insurance/InsuranceClaimList.tsx`
- ✅ Tạo: `components/insurance/InsuranceClaimForm.tsx`
- ✅ Tạo: `components/insurance/InsuranceClaimDetail.tsx`
- ✅ Tạo: `components/insurance/DocumentUploader.tsx`

### Phase 2: Admin Module - Users (Week 3)

**ADM-001: User Management** (`/admin/users`)
- ✅ Bổ sung: `app/api/admin/users/route.ts` (thêm GET, PUT, DELETE)
- ✅ Tạo: `app/api/admin/users/[id]/route.ts`
- ✅ Tạo: `app/api/admin/users/[id]/reset-password/route.ts`
- ✅ Tạo: `actions/admin/users.ts`
- ✅ Tạo/sửa: `app/(main)/admin/users/page.tsx`
- ✅ Tạo: `components/admin/UserManagement.tsx`
- ✅ Tạo: `components/admin/UserForm.tsx`
- ✅ Tạo: `components/admin/UserTable.tsx`
- ✅ Tạo: `components/admin/PasswordResetDialog.tsx`

### Phase 3: Admin Module - Permissions (Week 4)

**ADM-002: Permissions** (`/admin/permissions`)
- ✅ Tạo: `app/api/admin/roles/route.ts`
- ✅ Tạo: `app/api/admin/roles/[id]/route.ts`
- ✅ Tạo: `app/api/admin/permissions/route.ts`
- ✅ Tạo: `app/api/admin/permissions/matrix/route.ts`
- ✅ Tạo: `app/api/admin/roles/[id]/permissions/route.ts`
- ✅ Tạo: `actions/admin/permissions.ts`
- ✅ Tạo: `app/(main)/admin/permissions/page.tsx`
- ✅ Tạo: `components/admin/PermissionMatrix.tsx`
- ✅ Tạo: `components/admin/RoleEditor.tsx`
- ✅ Tạo: `components/admin/CustomRoleDialog.tsx`

### Phase 4: Admin Module - Audit & Settings (Weeks 5-6)

**ADM-003: Audit Logs** (`/admin/audit`)
- ✅ Tạo: `app/api/admin/audit-logs/route.ts`
- ✅ Tạo: `app/api/admin/audit-logs/[id]/route.ts`
- ✅ Tạo: `app/api/admin/audit-logs/export/route.ts`
- ✅ Tạo: `actions/admin/audit.ts`
- ✅ Tạo: `app/(main)/admin/audit/page.tsx`
- ✅ Tạo: `components/admin/AuditLogViewer.tsx`
- ✅ Tạo: `components/admin/LogDetailDialog.tsx`

**ADM-004: System Settings** (`/admin/settings`)
- ✅ Tạo: `app/api/admin/settings/route.ts`
- ✅ Tạo: `app/api/admin/settings/[key]/route.ts`
- ✅ Tạo: `app/api/admin/settings/reset/route.ts`
- ✅ Tạo: `actions/admin/settings.ts`
- ✅ Tạo: `app/(main)/admin/settings/page.tsx`
- ✅ Tạo: `components/admin/SystemSettings.tsx`
- ✅ Tạo: `components/admin/SettingEditor.tsx`

### Phase 5: Admin Module - Monitoring (Week 7)

**ADM-005: System Monitoring** (`/admin/monitoring`)
- ✅ Tạo: `app/api/admin/metrics/route.ts`
- ✅ Tạo: `app/api/admin/health/route.ts`
- ✅ Tạo: `app/api/admin/alerts/route.ts`
- ✅ Tạo: `actions/admin/monitoring.ts`
- ✅ Tạo: `app/(main)/admin/monitoring/page.tsx`
- ✅ Tạo: `components/admin/SystemMonitoring.tsx`
- ✅ Tạo: `components/admin/MetricChart.tsx`
- ✅ Tạo: `components/admin/AlertPanel.tsx`

---

## ❌ D. KHÔNG ĐƯỢC ĐỘNG ĐẾN

### Database Schema
- ❌ **KHÔNG SỬA**: `prisma/schema.prisma`
- ✅ **CHỈ CHẠY**: Migration scripts (sẽ được cung cấp riêng)

### Existing Modules
- ❌ KHÔNG SỬA: CRM, Sales, Service, Parts, Accounting modules (đã hoàn chỉnh)

### Locked Components
- ❌ KHÔNG SỬA: `components/ui/*` (shadcn components)
- ❌ KHÔNG SỬA: `components/common/*` (shared components)
- ✅ CHỈ REUSE: Sử dụng existing components

---

## 🔧 E. TECHNICAL REQUIREMENTS

### Database Migrations

Sẽ được cung cấp riêng trong folder `prisma/migrations/`:
1. `20260129_add_rbac_tables.sql` - Tạo roles, permissions, role_permissions
2. `20260205_add_system_settings.sql` - Tạo system_settings table

### API Response Format (MUST FOLLOW)

```typescript
// Success
{
  "success": true,
  "data": T,
  "meta"?: { "page": number, "limit": number, "total": number }
}

// Error
{
  "success": false,
  "error": {
    "code": string,  // Format: MODULE_HTTP_CODE
    "message": string,
    "details"?: any
  }
}
```

---

## ✅ F. TESTING REQUIREMENTS

### Unit Tests (UT)
- API endpoints: `__tests__/api/[module]/[resource].test.ts`
- Actions: `__tests__/actions/[module]/[resource].test.ts`
- Components: `__tests__/components/[module]/[component].test.tsx`

### User Acceptance Tests (UAT)
**Reference**: `docs/design/testing/uat_plan_changes_v1.2.md`

**Test Suites** (7 new):
- UAT-INS-001: Insurance Contract Management (5 scenarios)
- UAT-INS-002: Insurance Claim Management (6 scenarios)
- UAT-ADM-001: User Management (7 scenarios)
- UAT-ADM-002: Permission Management (6 scenarios)
- UAT-ADM-003: Audit Logs (4 scenarios)
- UAT-ADM-004: System Settings (5 scenarios)
- UAT-ADM-005: System Monitoring (4 scenarios)

**Total**: 37 scenarios, ~18 hours

---

## 🚨 G. CRITICAL RULES

### Security (ADM-002)
1. ✅ MUST: Implement permission check middleware
2. ✅ MUST: Validate user permissions before CRUD operations
3. ✅ MUST: Log all permission changes to audit_logs
4. ❌ NEVER: Hardcode permissions
5. ❌ NEVER: Bypass permission checks

### Audit Logging (ADM-003)
1. ✅ MUST: Log all CREATE, UPDATE, DELETE operations
2. ✅ MUST: Include user_id, action, entity, entity_id
3. ✅ MUST: Use append-only pattern (no UPDATE/DELETE on logs)
4. ❌ NEVER: Log sensitive data (passwords, tokens)

### Data Validation
1. ✅ MUST: Validate all inputs server-side
2. ✅ MUST: Return proper error codes (400, 404, 409, 500)
3. ✅ MUST: Use Zod schemas for validation

---

## 📅 H. TIMELINE & CHECKPOINTS

| Week | Deliverable | Checkpoint |
|------|-------------|------------|
| **Week 1** | INS-001 complete | UAT-INS-001 PASS |
| **Week 2** | INS-002 complete | UAT-INS-002 PASS |
| **Week 3** | ADM-001 complete | UAT-ADM-001 PASS |
| **Week 4** | ADM-002 complete | UAT-ADM-002 PASS |
| **Week 5** | ADM-003 complete | UAT-ADM-003 PASS |
| **Week 6** | ADM-004 complete | UAT-ADM-004 PASS |
| **Week 7** | ADM-005 complete | UAT-ADM-005 PASS |

---

## 🔗 I. DEPENDENCIES

```
ADM-002 (Permissions) → ADM-001 (Users) → ADM-003 (Audit)
                                        ↓
                                  All other modules
```

**Critical Path**:
1. Implement ADM-002 first (RBAC foundation)
2. Then ADM-001 (uses permissions)
3. Then ADM-003 (uses user context)
4. Insurance modules can run parallel
5. ADM-004, ADM-005 can run parallel

---

## 📞 J. ESCALATION

**Questions về**:
- Business logic → Antigravity (BA)
- Technical design → Antigravity (Design Authority)
- Database schema → Antigravity (Data Design Authority)
- API contracts → Antigravity (API Design Authority)

**Blockers**: Report immediately, do not proceed if blocked.

---

**Issued By**: Antigravity (Change Request Authority)  
**Date**: 2026-01-29  
**Status**: ✅ READY FOR EXECUTION

---

**End of Change Execution Instruction v1.0**
