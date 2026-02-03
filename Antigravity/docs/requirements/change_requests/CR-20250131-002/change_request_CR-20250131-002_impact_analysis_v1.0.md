# Impact Analysis - CR-20250131-002

**CR ID**: CR-20250131-002 (Complete Missing Screens)  
**Version**: 1.0  
**Date**: 31/01/2026  
**Author**: Antigravity - Design Authority & BA

---

## 1. EXECUTIVE SUMMARY

### Impact Overview

| Aspect | Impact Level | Details |
|--------|--------------|---------|
| **Scope** | HIGH | 7 screens, 2 modules, 27 APIs, 4 DB tables |
| **Documents** | 100% | 8/8 documents affected |
| **Effort** | HIGH | 372 hours (~9.3 weeks) |
| **Risk** | HIGH | Security-critical (permissions system) |

### Documents Affected

| Document | Version Change | Impact Level | Reason |
|----------|----------------|--------------|--------|
| BRD | v2.0 → v2.1 | MINOR | +3 BR sections (ADM-002, 003, 004) |
| FRD Insurance | v1.0 → v1.1 | MINOR | +UI specs for INS-001, INS-002 |
| FRD Admin | v1.0 → v2.0 | **MAJOR** | +5 screens full specs |
| ERD | v1.0 → v1.1 | MINOR | +4 tables (roles, permissions, role_permissions, system_settings) |
| API Spec Insurance | v1.0 → v1.1 | MINOR | +5 APIs (claims) |
| API Spec Admin | v1.0 → v2.0 | **MAJOR** | +22 APIs |
| UI Spec | v1.0 → v1.1 | MINOR | +7 screens + 6 infrastructure components |
| UAT Plan | v1.1 → v1.2 | MINOR | +7 test suites |

---

## 2. BRD IMPACT ANALYSIS

### 2.1 Current State (BRD v2.0)

**Section 5.8 System Administration** hiện có:
- BR-ADMIN-001: User Management (basic)

**Missing**:
- BR-ADMIN-002: Permission Management
- BR-ADMIN-003: System Settings
- BR-ADMIN-004: System Monitoring
- BR-ADMIN-005: Audit Logs

### 2.2 Required Changes

#### BR-ADMIN-002: Permission Management (NEW)

**Business Need**: Quản lý roles và permissions chi tiết để kiểm soát truy cập theo nguyên tắc least privilege.

**Actors**: System Administrator, Manager

**Business Flow**:
```
Admin tạo Role → Assign Permissions → Assign Role to User → System enforce permissions
```

**Business Rules**:
- BR-ADMIN-002-R1: Mỗi user có ít nhất 1 role
- BR-ADMIN-002-R2: Permissions theo format: `module.entity.action` (e.g., `sales.quotation.create`)
- BR-ADMIN-002-R3: Super Admin role không thể xóa
- BR-ADMIN-002-R4: Permission changes log vào audit trail

**Success Criteria**:
- 100% users có role phù hợp
- 0% unauthorized access
- Permission check time < 50ms

#### BR-ADMIN-003: Audit Logs (NEW)

**Business Need**: Ghi nhận mọi critical actions để compliance và troubleshooting.

**Business Rules**:
- BR-ADMIN-003-R1: Log tất cả CREATE/UPDATE/DELETE operations
- BR-ADMIN-003-R2: Logs append-only (không sửa/xóa)
- BR-ADMIN-003-R3: Retention: 12 tháng minimum
- BR-ADMIN-003-R4: Log format: timestamp, user, action, entity, old_value, new_value

#### BR-ADMIN-004: System Settings (NEW)

**Business Need**: Cấu hình hệ thống tập trung (email, SMS, notifications).

**Business Rules**:
- BR-ADMIN-004-R1: Settings theo format key-value với type validation
- BR-ADMIN-004-R2: Changes require Manager approval
- BR-ADMIN-004-R3: Settings có default values
- BR-ADMIN-004-R4: Sensitive settings encrypted

#### BR-ADMIN-005: System Monitoring (NEW)

**Business Need**: Giám sát health và performance của hệ thống.

**Business Rules**:
- BR-ADMIN-005-R1: Metrics thu thập mỗi 5 phút
- BR-ADMIN-005-R2: Alert khi CPU > 80%, Memory > 90%
- BR-ADMIN-005-R3: Retention: 30 ngày

### 2.3 Version Change

**BRD v2.0 → v2.1** (MINOR)
- Thêm 4 BR sections mới
- Không thay đổi existing BRs

---

## 3. FRD IMPACT ANALYSIS

### 3.1 FRD Insurance Module

#### 3.1.1 Data Requirements Changes

**Entity: insurance_contracts** (EXISTING - Minor Changes)

| Field | Type | Constraints | Change |
|-------|------|-------------|--------|
| id | UUID | PK | Existing |
| customer_id | UUID | FK → customers, NOT NULL | Existing |
| policy_number | VARCHAR(50) | UNIQUE, NOT NULL | Existing |
| provider | VARCHAR(100) | NOT NULL | Existing |
| type | ENUM | ('COMPREHENSIVE', 'THIRD_PARTY') | Existing |
| start_date | DATE | NOT NULL | Existing |
| end_date | DATE | NOT NULL, > start_date | Existing |
| premium | DECIMAL(15,2) | NOT NULL, > 0 | Existing |
| status | ENUM | ('ACTIVE', 'EXPIRED', 'CANCELLED') | Existing |
| **renewal_reminder_sent** | BOOLEAN | DEFAULT false | **NEW** |

**Relationships**:
- insurance_contracts → customers (N:1) - Existing
- insurance_contracts → insurance_claims (1:N) - Existing

**Entity: insurance_claims** (EXISTING - No Changes)

Existing fields sufficient. No schema changes needed.

#### 3.1.2 Screens Impact

**SCR-INS-001: Insurance Contracts Management** (ENHANCE)

Current: Có database + partial UI  
Required: Full CRUD UI

**Components Needed**:
- InsuranceContractList (table với search, filters)
- InsuranceContractForm (create/edit)
- InsuranceContractDetail (view)

**Validation Rules**:
- end_date > start_date
- premium > 0
- policy_number unique

**SCR-INS-002: Insurance Claims Management** (NEW)

Current: Database only  
Required: Full CRUD + Approval workflow

**Components Needed**:
- InsuranceClaimsList
- InsuranceClaimForm
- InsuranceClaimDetail (với approval buttons)

**Workflow**:
```
PENDING → UNDER_REVIEW → APPROVED/REJECTED → SETTLED
```

### 3.2 FRD Admin Module

#### 3.2.1 Data Requirements Changes

**Entity: roles** (NEW)

| Field | Type | Constraints | Classification |
|-------|------|-------------|----------------|
| id | UUID | PK | System |
| name | VARCHAR(50) | UNIQUE, NOT NULL | Business |
| description | TEXT | NULL | Business |
| is_system | BOOLEAN | DEFAULT false | System |
| created_at | TIMESTAMP | DEFAULT now() | System |
| updated_at | TIMESTAMP | DEFAULT now() | System |

**Classification**: Master Data  
**Relationships**: roles → role_permissions (1:N)

**Entity: permissions** (NEW)

| Field | Type | Constraints | Classification |
|-------|------|-------------|----------------|
| id | UUID | PK | System |
| code | VARCHAR(100) | UNIQUE, NOT NULL | Business |
| module | VARCHAR(50) | NOT NULL | Business |
| entity | VARCHAR(50) | NOT NULL | Business |
| action | VARCHAR(50) | NOT NULL | Business |
| description | TEXT | NULL | Business |

**Classification**: Master Data  
**Format**: code = `{module}.{entity}.{action}` (e.g., `sales.quotation.create`)

**Entity: role_permissions** (NEW - Junction Table)

| Field | Type | Constraints | Classification |
|-------|------|-------------|----------------|
| id | UUID | PK | System |
| role_id | UUID | FK → roles, NOT NULL | Business |
| permission_id | UUID | FK → permissions, NOT NULL | Business |

**Unique Constraint**: (role_id, permission_id)

**Entity: system_settings** (NEW)

| Field | Type | Constraints | Classification |
|-------|------|-------------|----------------|
| id | UUID | PK | System |
| key | VARCHAR(100) | UNIQUE, NOT NULL | Business |
| value | TEXT | NOT NULL | Business |
| type | ENUM | ('STRING', 'NUMBER', 'BOOLEAN', 'JSON') | Business |
| category | VARCHAR(50) | NOT NULL | Business |
| description | TEXT | NULL | Business |
| is_sensitive | BOOLEAN | DEFAULT false | System |
| updated_at | TIMESTAMP | DEFAULT now() | System |
| updated_by | UUID | FK → users | Business |

**Classification**: Configuration Data

**Entity: users** (MODIFY - Add Fields)

| Field | Type | Constraints | Change |
|-------|------|-------------|--------|
| **role_id** | UUID | FK → roles, NULL | **NEW** |
| **last_login_at** | TIMESTAMP | NULL | **NEW** |
| **failed_login_attempts** | INTEGER | DEFAULT 0 | **NEW** |
| **locked_until** | TIMESTAMP | NULL | **NEW** |

#### 3.2.2 Screens Impact

**SCR-ADM-001: User Management** (ENHANCE)

Current: Database + POST API only  
Required: Full CRUD + Role assignment

**Components**: UserTable, UserForm, UserDetail

**SCR-ADM-002: Permission Matrix** (NEW - CRITICAL)

Current: Nothing  
Required: Full implementation

**Components**:
- RoleList
- RoleForm
- PermissionMatrix (role × permission grid)

**Complexity**: HIGH (permission system core)

**SCR-ADM-003: Audit Logs** (NEW)

Current: Database only  
Required: Read-only viewer với filters

**Components**: AuditLogViewer, AuditLogFilters

**SCR-ADM-004: System Settings** (NEW)

Current: Nothing  
Required: Settings editor với type validation

**Components**: SettingsTable, SettingsForm

**SCR-ADM-005: System Monitoring** (NEW)

Current: Database only  
Required: Real-time metrics dashboard

**Components**: MetricsChart, AlertsList, HealthStatus

---

## 4. ERD IMPACT ANALYSIS

### 4.1 New Tables

#### Table: roles

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_roles_name ON roles(name);
```

**Migration Strategy**: 
- Create table
- Seed default roles: SUPER_ADMIN, ADMIN, MANAGER, SALES_REP, SERVICE_ADVISOR, TECHNICIAN, ACCOUNTANT

#### Table: permissions

```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) UNIQUE NOT NULL,
  module VARCHAR(50) NOT NULL,
  entity VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT
);

CREATE INDEX idx_permissions_code ON permissions(code);
CREATE INDEX idx_permissions_module ON permissions(module);
```

**Migration Strategy**:
- Create table
- Seed ~100 permissions covering all modules

#### Table: role_permissions

```sql
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);
```

#### Table: system_settings

```sql
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('STRING', 'NUMBER', 'BOOLEAN', 'JSON')),
  category VARCHAR(50) NOT NULL,
  description TEXT,
  is_sensitive BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT now(),
  updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_system_settings_key ON system_settings(key);
CREATE INDEX idx_system_settings_category ON system_settings(category);
```

### 4.2 Modified Tables

#### Table: users (ADD COLUMNS)

```sql
ALTER TABLE users 
  ADD COLUMN role_id UUID REFERENCES roles(id),
  ADD COLUMN last_login_at TIMESTAMP,
  ADD COLUMN failed_login_attempts INTEGER DEFAULT 0,
  ADD COLUMN locked_until TIMESTAMP;

CREATE INDEX idx_users_role ON users(role_id);
```

**Migration Strategy**:
- Add columns as NULLABLE first
- Backfill: Assign default role based on existing user type
- Make role_id NOT NULL after backfill (optional)

#### Table: insurance_contracts (ADD COLUMN)

```sql
ALTER TABLE insurance_contracts
  ADD COLUMN renewal_reminder_sent BOOLEAN DEFAULT false;
```

### 4.3 Breaking Changes Check

**Breaking Changes**: ❌ NONE

- All new tables → No impact on existing code
- users table: New columns NULLABLE → Backward compatible
- insurance_contracts: New column with DEFAULT → Backward compatible

### 4.4 Version Change

**ERD v1.0 → v1.1** (MINOR)
- +4 new tables
- +5 new columns (users: 4, insurance_contracts: 1)
- +6 new indexes

---

## 5. API SPEC IMPACT ANALYSIS

### 5.1 Insurance APIs

#### New APIs (5)

| # | Method | Path | FRD Mapping | ERD Mapping |
|---|--------|------|-------------|-------------|
| 1 | GET | `/api/insurance/claims` | SCR-INS-002 | insurance_claims |
| 2 | POST | `/api/insurance/claims` | SCR-INS-002 | insurance_claims |
| 3 | GET | `/api/insurance/claims/:id` | SCR-INS-002 | insurance_claims |
| 4 | PATCH | `/api/insurance/claims/:id` | SCR-INS-002 | insurance_claims |
| 5 | POST | `/api/insurance/claims/:id/approve` | SCR-INS-002 | insurance_claims (workflow) |

**Breaking Changes**: ❌ NONE (all new endpoints)

### 5.2 Admin APIs

#### New APIs (22)

**User Management (3)**:
| Method | Path | FRD | ERD |
|--------|------|-----|-----|
| GET | `/api/admin/users` | SCR-ADM-001 | users |
| PATCH | `/api/admin/users/:id` | SCR-ADM-001 | users |
| DELETE | `/api/admin/users/:id` | SCR-ADM-001 | users (soft delete) |

**Roles & Permissions (8)**:
| Method | Path | FRD | ERD |
|--------|------|-----|-----|
| GET | `/api/admin/roles` | SCR-ADM-002 | roles |
| POST | `/api/admin/roles` | SCR-ADM-002 | roles |
| GET | `/api/admin/roles/:id` | SCR-ADM-002 | roles |
| PATCH | `/api/admin/roles/:id` | SCR-ADM-002 | roles |
| DELETE | `/api/admin/roles/:id` | SCR-ADM-002 | roles |
| GET | `/api/admin/permissions` | SCR-ADM-002 | permissions |
| POST | `/api/admin/roles/:id/permissions` | SCR-ADM-002 | role_permissions |
| DELETE | `/api/admin/roles/:id/permissions/:permissionId` | SCR-ADM-002 | role_permissions |

**Audit Logs (2)**:
| Method | Path | FRD | ERD |
|--------|------|-----|-----|
| GET | `/api/admin/audit-logs` | SCR-ADM-003 | activity_logs |
| GET | `/api/admin/audit-logs/:id` | SCR-ADM-003 | activity_logs |

**System Settings (5)**:
| Method | Path | FRD | ERD |
|--------|------|-----|-----|
| GET | `/api/admin/settings` | SCR-ADM-004 | system_settings |
| GET | `/api/admin/settings/:key` | SCR-ADM-004 | system_settings |
| PUT | `/api/admin/settings/:key` | SCR-ADM-004 | system_settings |
| POST | `/api/admin/settings` | SCR-ADM-004 | system_settings |
| DELETE | `/api/admin/settings/:key` | SCR-ADM-004 | system_settings |

**System Monitoring (4)**:
| Method | Path | FRD | ERD |
|--------|------|-----|-----|
| GET | `/api/admin/metrics` | SCR-ADM-005 | system_metrics |
| GET | `/api/admin/metrics/summary` | SCR-ADM-005 | system_metrics (aggregated) |
| GET | `/api/admin/health` | SCR-ADM-005 | system_metrics |
| GET | `/api/admin/alerts` | SCR-ADM-005 | system_metrics |

### 5.3 Versioning Strategy

**No API versioning needed** - All new endpoints, no breaking changes

### 5.4 Version Changes

- API Spec Insurance: v1.0 → v1.1 (MINOR)
- API Spec Admin: v1.0 → v2.0 (MAJOR - significant additions)

---

## 6. UI SPEC & REFS EVALUATION

### 6.1 Refs Evaluation Summary

| Screen | Refs Status | Evaluation | Action |
|--------|-------------|------------|--------|
| INS-001 | Partial | `InsurancePolicies.tsx` exists | ✅ Extend Allowed |
| INS-002 | Partial | `InsuranceClaimsList.tsx`, `InsuranceClaimDetail.tsx` exist | ✅ Extend Allowed |
| ADM-001 | Partial | `UserRoleManagement.tsx` exists (lines 108-137) | ✅ Extend Allowed |
| ADM-002 | Partial | `UserRoleManagement.tsx` (roles sidebar only) | ⚠️ Extend Required |
| ADM-003 | None | No audit log viewer | ⚠️ Component Not Available |
| ADM-004 | None | No settings editor | ⚠️ Component Not Available |
| ADM-005 | Mockup | `SystemMonitoring.tsx` (mockup only) | ✅ Extend Allowed |

### 6.2 UI Infrastructure Components

**Required (6 components)**:

1. **ProtectedRoute** - Route guard với permission check
2. **PermissionGuard** - Component-level permission wrapper
3. **MasterDataTable** - Reusable table cho master data screens
4. **AuditTimeline** - Timeline component cho audit logs
5. **MetricCard** - Card component cho metrics display
6. **SettingsForm** - Type-safe form cho settings editor

**Refs Availability**: ❌ Not Available - Cần tạo mới

### 6.3 Navigation & Routing

**Menu Changes**:
- Master Data menu (NEW)
- Insurance menu (NEW)
- Admin menu (EXPAND - thêm 4 items)

**Routes** (+11):
- `/master/vehicle-models`, `/master/accessories`, `/master/services`, `/master/bays`
- `/insurance/contracts`, `/insurance/claims`
- `/admin/users`, `/admin/permissions`, `/admin/audit-logs`, `/admin/settings`, `/admin/monitoring`

### 6.4 Version Change

**UI Spec v1.0 → v1.1** (MINOR)
- +7 screen specs
- +6 infrastructure components
- +11 routes

---

## 7. EFFORT ESTIMATION

### 7.1 Complexity Assessment

| Screen | Complexity | Reason |
|--------|------------|--------|
| INS-001 | MEDIUM | CRUD + existing pattern |
| INS-002 | HIGH | CRUD + workflow (approval) |
| ADM-001 | MEDIUM | CRUD + role assignment |
| ADM-002 | **CRITICAL** | Permission matrix, RBAC core |
| ADM-003 | MEDIUM | Read-only viewer với filters |
| ADM-004 | MEDIUM | Type-safe settings editor |
| ADM-005 | MEDIUM | Real-time metrics dashboard |

### 7.2 Effort Breakdown

| Component | Effort | Details |
|-----------|--------|---------|
| **Screens** | 214h | 7 screens × 30.6h avg |
| **APIs** | 54h | 27 endpoints × 2h avg |
| **Database** | 8h | 4 tables + migrations |
| **UI Infrastructure** | 64h | Menus (8h), Routes (4h), Layouts (12h), Guards (16h), Components (16h), Sidebar (8h) |
| **Testing** | 32h | 7 UAT suites × 4.6h avg |
| **Total** | **372h** | ~9.3 weeks |

### 7.3 Story Points

**Total**: 93 SP (assuming 4h/SP)

---

## 8. RISK ASSESSMENT

### 8.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Permission system bugs | CRITICAL | MEDIUM | Extensive testing, security review |
| UI infrastructure breaking existing features | HIGH | MEDIUM | Feature flags, incremental rollout |
| Database migration failures | HIGH | LOW | Test in staging, rollback plan |
| Performance degradation (permission checks) | MEDIUM | MEDIUM | Cache permissions, optimize queries |

### 8.2 Implementation Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| ADM-002 delay blocks Week 5 | CRITICAL | MEDIUM | Start early, allocate best resources |
| Refs UI patterns insufficient | MEDIUM | LOW | Extend patterns, reuse components |
| Scope creep | MEDIUM | HIGH | Strict scope control, change management |

---

## 9. DEPENDENCIES

### 9.1 Internal Dependencies

**Critical Path**:
```
Week 0: UI Infrastructure → Week 4: ADM-002 (Permissions) → Week 5: Guards Integration
```

**Blocking Relationships**:
- ADM-002 BLOCKS: Permission Guards (Week 5), Dynamic Menu (Week 5)
- UI Infrastructure ENABLES: All screens (Week 1-8)

### 9.2 External Dependencies

- None

---

## 10. NEXT STEPS

### 10.1 Document Updates Required

1. **BRD v2.1**: Add BR-ADMIN-002, 003, 004, 005
2. **FRD Insurance v1.1**: Enhance INS-001, INS-002 specs
3. **FRD Admin v2.0**: Add ADM-001-005 full specs
4. **ERD v1.1**: Add 4 tables, modify users table
5. **API Spec Insurance v1.1**: Add 5 APIs
6. **API Spec Admin v2.0**: Add 22 APIs
7. **UI Spec v1.1**: Add 7 screens + 6 components
8. **UAT Plan v1.2**: Add 7 test suites

### 10.2 Implementation Sequence

1. Week 0: UI Infrastructure
2. Week 1-3: Insurance + ADM-001
3. Week 4: **ADM-002 (CRITICAL)**
4. Week 5: Guards Integration
5. Week 6-8: ADM-003, 004, 005
6. Week 9: Integration Testing

---

**End of Impact Analysis**
