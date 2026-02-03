# Change Execution Instruction - CR-001
**Version**: 1.0  
**Date**: 2026-01-29  
**CR-ID**: CR-001  
**Target**: OpenCode (Implementation Agent)  
**Authority**: Antigravity (Change Request Authority)

---

## 📋 EXECUTIVE SUMMARY

**Change Request**: Complete Missing Screens Implementation  
**Scope**: 7 màn hình chưa hoàn thiện (Insurance: 2, Admin: 5)  
**Timeline**: 7 weeks (278 hours)  
**Priority**: 🔴 CRITICAL (Security & Compliance)

---

## 🎯 IMPLEMENTATION SCOPE

### ✅ ALLOWED TO MODIFY

#### Phase 1: Insurance Module (Weeks 1-2)
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
- ✅ Tạo: `actions/insurance/claims.ts`
- ✅ Tạo/sửa: `app/(main)/insurance/claims/page.tsx`
- ✅ Tạo: `components/insurance/InsuranceClaimList.tsx`
- ✅ Tạo: `components/insurance/InsuranceClaimForm.tsx`
- ✅ Tạo: `components/insurance/InsuranceClaimDetail.tsx`
- ✅ Tạo: `components/insurance/DocumentUploader.tsx`

#### Phase 2: Admin Module - Users (Week 3)
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

#### Phase 3: Admin Module - Permissions (Week 4)
**ADM-002: Permissions** (`/admin/permissions`)
- ✅ Chạy migration: `prisma/migrations/add_rbac_tables.sql`
- ✅ Tạo: `app/api/admin/roles/route.ts`
- ✅ Tạo: `app/api/admin/roles/[id]/route.ts`
- ✅ Tạo: `app/api/admin/permissions/route.ts`
- ✅ Tạo: `app/api/admin/permissions/matrix/route.ts`
- ✅ Tạo: `actions/admin/permissions.ts`
- ✅ Tạo: `app/(main)/admin/permissions/page.tsx`
- ✅ Tạo: `components/admin/PermissionMatrix.tsx`
- ✅ Tạo: `components/admin/RoleEditor.tsx`
- ✅ Tạo: `components/admin/CustomRoleDialog.tsx`

#### Phase 4: Admin Module - Audit & Settings (Weeks 5-6)
**ADM-003: Audit Logs** (`/admin/audit`)
- ✅ Tạo: `app/api/admin/audit-logs/route.ts`
- ✅ Tạo: `app/api/admin/audit-logs/[id]/route.ts`
- ✅ Tạo: `app/api/admin/audit-logs/export/route.ts`
- ✅ Tạo: `actions/admin/audit.ts`
- ✅ Tạo: `app/(main)/admin/audit/page.tsx`
- ✅ Tạo: `components/admin/AuditLogViewer.tsx`
- ✅ Tạo: `components/admin/LogDetailDialog.tsx`

**ADM-004: System Settings** (`/admin/settings`)
- ✅ Chạy migration: `prisma/migrations/add_system_settings.sql`
- ✅ Tạo: `app/api/admin/settings/route.ts`
- ✅ Tạo: `app/api/admin/settings/[key]/route.ts`
- ✅ Tạo: `actions/admin/settings.ts`
- ✅ Tạo: `app/(main)/admin/settings/page.tsx`
- ✅ Tạo: `components/admin/SystemSettings.tsx`
- ✅ Tạo: `components/admin/SettingEditor.tsx`

#### Phase 5: Admin Module - Monitoring (Week 7)
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

### ❌ KHÔNG ĐƯỢC ĐỘNG ĐẾN

#### Database Schema (Prisma)
- ❌ **KHÔNG SỬA**: `prisma/schema.prisma`
- ✅ **CHỈ CHẠY**: Migration scripts được cung cấp

#### Existing Completed Modules
- ❌ KHÔNG SỬA: CRM module (đã hoàn chỉnh)
- ❌ KHÔNG SỬA: Sales module (đã hoàn chỉnh)
- ❌ KHÔNG SỬA: Service module (đã hoàn chỉnh)
- ❌ KHÔNG SỬA: Parts module (đã hoàn chỉnh)
- ❌ KHÔNG SỬA: Accounting module (đã hoàn chỉnh)

#### Locked UI Components
- ❌ KHÔNG SỬA: `components/ui/*` (shadcn components)
- ❌ KHÔNG SỬA: `components/common/*` (shared components)
- ✅ CHỈ REUSE: Sử dụng existing components

---

## 📚 REFERENCE DOCUMENTS

### Updated Documents (Version Mới)

| Document | Version | Path |
|----------|---------|------|
| **BRD** | v2.1 | `docs/requirements/BRD/BRD_Honda_DMS_v2.1.md` |
| **FRD Insurance** | v1.1 | `docs/requirements/FRD/FRD_Module_06_Insurance_v1.1.md` |
| **FRD Admin** | v2.0 | `docs/requirements/FRD/FRD_Module_08_Admin_v2.0.md` |
| **ERD** | v1.1 | `docs/design/database/erd/erd_description_v1.1.md` |
| **API Spec Insurance** | v1.1 | `docs/design/api/api_spec_06_insurance_v1.1.md` |
| **API Spec Admin** | v2.0 | `docs/design/api/api_spec_08_admin_v2.0.md` |
| **UI Spec** | v1.1 | `docs/design/ui/ui_spec_v1.1.md` |
| **UAT Plan** | v1.2 | `docs/design/testing/uat_plan_v1.2.md` |

### Existing Documents (Không đổi)
- Prisma Schema: `prisma/schema.prisma` (reference only)
- API Spec Index: `docs/design/api/api_spec_index.md`

---

## 🔧 TECHNICAL REQUIREMENTS

### Database Migrations

#### Migration 1: RBAC Tables (Week 4)
**File**: `prisma/migrations/20260129_add_rbac_tables/migration.sql`
```sql
-- Tạo roles table
CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tạo permissions table
CREATE TABLE permissions (
  id TEXT PRIMARY KEY,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  UNIQUE(module, action)
);

-- Tạo role_permissions junction table
CREATE TABLE role_permissions (
  role_id TEXT NOT NULL,
  permission_id TEXT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

-- Update users table
ALTER TABLE users ADD COLUMN last_login DATETIME;
ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN password_changed_at DATETIME;
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;
```

#### Migration 2: System Settings (Week 6)
**File**: `prisma/migrations/20260205_add_system_settings/migration.sql`
```sql
CREATE TABLE system_settings (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  data_type TEXT NOT NULL, -- string, number, boolean, json
  category TEXT NOT NULL, -- email, sms, notification, general
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  updated_by TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id)
);
```

### API Response Format (MUST FOLLOW)
```typescript
// Success Response
{
  success: true,
  data: T,
  meta?: {
    page: number,
    limit: number,
    total: number
  }
}

// Error Response
{
  success: false,
  error: {
    code: string,  // Format: MODULE_HTTP_CODE (e.g., "ADM_404")
    message: string,
    details?: any
  }
}
```

### TypeScript Types (MUST USE)
```typescript
// Insurance
import { InsuranceContractDTO, CreateContractInput } from '@/lib/types/insurance'
import { InsuranceClaimDTO, CreateClaimInput } from '@/lib/types/insurance'

// Admin
import { UserDTO, CreateUserInput, UpdateUserInput } from '@/lib/types/admin'
import { RoleDTO, PermissionDTO } from '@/lib/types/admin'
import { AuditLogDTO } from '@/lib/types/admin'
```

---

## ✅ TESTING REQUIREMENTS

### Unit Tests (UT)
**Required for each module**:
- API endpoints: `__tests__/api/[module]/[resource].test.ts`
- Actions: `__tests__/actions/[module]/[resource].test.ts`
- Components: `__tests__/components/[module]/[component].test.tsx`

### User Acceptance Tests (UAT)
**Reference**: `docs/design/testing/uat_plan_v1.2.md`

**Test Suites**:
- UAT-INS-001: Insurance Contract Management
- UAT-INS-002: Insurance Claim Management
- UAT-ADM-001: User Management
- UAT-ADM-002: Permission Management
- UAT-ADM-003: Audit Logs
- UAT-ADM-004: System Settings
- UAT-ADM-005: System Monitoring

**Execution Order**:
1. Run UT first (must PASS 100%)
2. Run UAT per module after implementation
3. Report results in `docs/design/testing/uat_results_CR-001.md`

---

## 🚨 CRITICAL RULES

### Security (ADM-002 Permissions)
1. ✅ **MUST**: Implement permission check middleware
2. ✅ **MUST**: Validate user permissions before CRUD operations
3. ✅ **MUST**: Log all permission changes to audit_logs
4. ❌ **NEVER**: Hardcode permissions in code
5. ❌ **NEVER**: Bypass permission checks

### Audit Logging (ADM-003)
1. ✅ **MUST**: Log all CREATE, UPDATE, DELETE operations
2. ✅ **MUST**: Include user_id, action, entity, entity_id
3. ✅ **MUST**: Use append-only pattern (no UPDATE/DELETE on logs)
4. ❌ **NEVER**: Log sensitive data (passwords, tokens)

### Data Validation
1. ✅ **MUST**: Validate all inputs server-side
2. ✅ **MUST**: Return proper error codes (400, 404, 409, 500)
3. ✅ **MUST**: Use Zod schemas for validation
4. ❌ **NEVER**: Trust client-side validation alone

---

## 📊 DELIVERABLES

### Per Phase
- [ ] Code implementation (FE + BE)
- [ ] Unit tests (PASS 100%)
- [ ] UAT execution (PASS 100%)
- [ ] Code review (by Tech Lead)

### Final Deliverables (Week 7)
- [ ] All 7 screens fully functional
- [ ] All 27 APIs working
- [ ] All UT passing
- [ ] All UAT passing
- [ ] Documentation updated
- [ ] Walkthrough report

---

## 📅 TIMELINE & CHECKPOINTS

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

## 🔗 DEPENDENCIES

```
ADM-002 (Permissions) → ADM-001 (Users) → ADM-003 (Audit)
                                        ↓
                                  All other modules
```

**Critical Path**:
1. Implement ADM-002 first (foundation)
2. Then ADM-001 (uses permissions)
3. Then ADM-003 (uses user context)
4. Insurance modules can run parallel
5. ADM-004, ADM-005 can run parallel

---

## 📞 ESCALATION

**Questions về**:
- Business logic → Antigravity (BA)
- Technical design → Tech Lead
- Database schema → Antigravity (Data Design Authority)
- API contracts → Antigravity (API Design Authority)

**Blockers**:
- Report immediately via notify_user
- Do not proceed if blocked

---

**Issued By**: Antigravity (Change Request Authority)  
**Date**: 2026-01-29  
**Valid Until**: Implementation Complete  
**Status**: ✅ APPROVED FOR EXECUTION

---

**End of Change Execution Instruction CR-001**
