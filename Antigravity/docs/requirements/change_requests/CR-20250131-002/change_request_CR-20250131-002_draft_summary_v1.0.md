# Draft Documents Summary - CR-20250131-002

**CR ID**: CR-20250131-002  
**Date**: 31/01/2026  
**Author**: Antigravity - Design Authority & BA  
**Status**: DRAFT PREPARATION

---

## 1. OVERVIEW

Tài liệu này tóm tắt các DRAFT documents cần tạo cho CR-20250131-002 (Complete Missing Screens Implementation).

### Documents to Draft

| # | Document | Base Version | Draft Version | Changes | Priority |
|---|----------|--------------|---------------|---------|----------|
| 1 | BRD | v2.0 | v2.1 DRAFT | +4 BR sections | HIGH |
| 2 | FRD Insurance | v1.0 | v1.1 DRAFT | +2 screens specs | MEDIUM |
| 3 | FRD Admin | v1.0 | v2.0 DRAFT | +5 screens specs | HIGH |
| 4 | ERD | v1.0 | v1.1 DRAFT | +4 tables, +5 columns | CRITICAL |
| 5 | API Spec Insurance | v1.0 | v1.1 DRAFT | +5 APIs | MEDIUM |
| 6 | API Spec Admin | v1.0 | v2.0 DRAFT | +22 APIs | HIGH |
| 7 | UI Spec | v1.0 | v1.1 DRAFT | +7 screens +6 components | MEDIUM |
| 8 | UAT Plan | v1.1 | v1.2 DRAFT | +7 test suites | MEDIUM |

---

## 2. DRAFT FOLDER STRUCTURE

```
docs/requirements/change_requests/CR-20250131-002/drafts/
├── BRD_CR-20250131-002_v2.1_DRAFT.md
├── FRD_Module_06_Insurance_CR-20250131-002_v1.1_DRAFT.md
├── FRD_Module_08_Admin_CR-20250131-002_v2.0_DRAFT.md
├── ERD_CR-20250131-002_v1.1_DRAFT/
│   ├── erd_description_DRAFT.md
│   ├── erd_changes_DRAFT.md
│   └── dictionary/
│       ├── roles_DRAFT.md
│       ├── permissions_DRAFT.md
│       ├── role_permissions_DRAFT.md
│       └── system_settings_DRAFT.md
├── API_Spec_06_Insurance_CR-20250131-002_v1.1_DRAFT.md
├── API_Spec_08_Admin_CR-20250131-002_v2.0_DRAFT.md
├── UI_Spec_CR-20250131-002_v1.1_DRAFT.md
└── UAT_Plan_CR-20250131-002_v1.2_DRAFT.md
```

---

## 3. DRAFT CONTENT SUMMARY

### 3.1 BRD v2.1 DRAFT

**Base**: `docs/requirements/BRD/brd_honda_dms_v2.0.md`

**Changes to Add**:

#### Section 5.8: System Administration (EXPAND)

**Current**: BR-ADMIN-001 only

**Add**:

```markdown
<!-- CR-20250131-002: ADDED -->
#### BR-ADMIN-002: Permission Management

**Business Need**: Quản lý roles và permissions chi tiết để kiểm soát truy cập.

**Actors**: System Administrator, Manager

**Business Flow**:
- Admin tạo Role (e.g., SALES_REP, SERVICE_ADVISOR)
- Assign Permissions (e.g., sales.quotation.create, service.ro.view)
- Assign Role to User
- System enforce permissions

**Business Rules**:
- BR-ADMIN-002-R1: Mỗi user có ít nhất 1 role
- BR-ADMIN-002-R2: Permissions format: `module.entity.action`
- BR-ADMIN-002-R3: Super Admin role không thể xóa
- BR-ADMIN-002-R4: Permission changes log vào audit trail

**Success Criteria**:
- 100% users có role phù hợp
- 0% unauthorized access
- Permission check time < 50ms

---

#### BR-ADMIN-003: Audit Logs

**Business Need**: Ghi nhận mọi critical actions để compliance.

**Business Rules**:
- BR-ADMIN-003-R1: Log tất cả CREATE/UPDATE/DELETE
- BR-ADMIN-003-R2: Logs append-only
- BR-ADMIN-003-R3: Retention: 12 tháng minimum
- BR-ADMIN-003-R4: Format: timestamp, user, action, entity, old_value, new_value

---

#### BR-ADMIN-004: System Settings

**Business Need**: Cấu hình hệ thống tập trung.

**Business Rules**:
- BR-ADMIN-004-R1: Settings key-value với type validation
- BR-ADMIN-004-R2: Changes require Manager approval
- BR-ADMIN-004-R3: Sensitive settings encrypted

---

#### BR-ADMIN-005: System Monitoring

**Business Need**: Giám sát health và performance.

**Business Rules**:
- BR-ADMIN-005-R1: Metrics thu thập mỗi 5 phút
- BR-ADMIN-005-R2: Alert khi CPU > 80%, Memory > 90%
- BR-ADMIN-005-R3: Retention: 30 ngày
<!-- END CR-20250131-002 -->
```

**File Size**: ~37KB (base) + ~2KB (additions) = ~39KB

---

### 3.2 FRD Insurance v1.1 DRAFT

**Base**: `docs/requirements/FRD/FRD_Module_06_Insurance_changes_v1.1.md` (already has changes)

**Additional Changes**: Minor enhancements to existing specs

**File Size**: ~3KB

---

### 3.3 FRD Admin v2.0 DRAFT

**Base**: `docs/requirements/FRD/FRD_Module_08_Admin_changes_v2.0.md` (if exists) or create new

**Changes to Add**:

```markdown
<!-- CR-20250131-002: ADDED -->
## Data Requirements

### Entity: roles (NEW)

**Purpose**: Quản lý roles trong hệ thống

**Classification**: Master Data

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| name | VARCHAR(50) | UNIQUE, NOT NULL | Role name (e.g., SALES_REP) |
| description | TEXT | NULL | Role description |
| is_system | BOOLEAN | DEFAULT false | System role (cannot delete) |
| created_at | TIMESTAMP | DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT now() | Update timestamp |

**Relationships**:
- roles → role_permissions (1:N)
- roles → users (1:N)

**Business Rules**:
- Name must be UPPERCASE with underscores
- System roles (is_system=true) cannot be deleted
- Cannot delete role if assigned to users

---

### Entity: permissions (NEW)

**Purpose**: Quản lý permissions trong hệ thống

**Classification**: Master Data

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| code | VARCHAR(100) | UNIQUE, NOT NULL | Permission code (e.g., sales.quotation.create) |
| module | VARCHAR(50) | NOT NULL | Module name (sales, service, etc.) |
| entity | VARCHAR(50) | NOT NULL | Entity name (quotation, ro, etc.) |
| action | VARCHAR(50) | NOT NULL | Action (create, read, update, delete) |
| description | TEXT | NULL | Permission description |

**Relationships**:
- permissions → role_permissions (1:N)

**Business Rules**:
- Code format: `{module}.{entity}.{action}`
- Code must be lowercase with dots

---

### Entity: role_permissions (NEW)

**Purpose**: Junction table linking roles to permissions

**Classification**: Transaction Data

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| role_id | UUID | FK → roles, NOT NULL | Role reference |
| permission_id | UUID | FK → permissions, NOT NULL | Permission reference |

**Unique Constraint**: (role_id, permission_id)

**Relationships**:
- role_permissions → roles (N:1)
- role_permissions → permissions (N:1)

---

### Entity: system_settings (NEW)

**Purpose**: Quản lý system configuration settings

**Classification**: Configuration Data

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| key | VARCHAR(100) | UNIQUE, NOT NULL | Setting key |
| value | TEXT | NOT NULL | Setting value |
| type | ENUM | ('STRING', 'NUMBER', 'BOOLEAN', 'JSON') | Value type |
| category | VARCHAR(50) | NOT NULL | Category (email, sms, notification) |
| description | TEXT | NULL | Setting description |
| is_sensitive | BOOLEAN | DEFAULT false | Sensitive data flag |
| updated_at | TIMESTAMP | DEFAULT now() | Last update |
| updated_by | UUID | FK → users | Updated by user |

**Relationships**:
- system_settings → users (N:1, updated_by)

**Business Rules**:
- Sensitive settings encrypted in database
- Type validation enforced on value
- Changes logged to audit trail

---

### Entity: users (MODIFY)

**Changes**: Add 4 new fields

**New Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| role_id | UUID | FK → roles, NULL | Assigned role |
| last_login_at | TIMESTAMP | NULL | Last login timestamp |
| failed_login_attempts | INTEGER | DEFAULT 0 | Failed login counter |
| locked_until | TIMESTAMP | NULL | Account lock expiry |

**Migration Strategy**:
1. Add columns as NULLABLE
2. Backfill role_id based on existing user type
3. Optionally make role_id NOT NULL after backfill

<!-- END CR-20250131-002 -->
```

**File Size**: ~15KB (new content)

---

### 3.4 ERD v1.1 DRAFT

**Base**: `docs/design/database/erd/erd_description_v1.0.md`

**Changes**:

#### erd_description_DRAFT.md

Update entity summary:
- Total Tables: 49 → **53** (+4)
- Master Data Tables: 10 → **12** (+2: roles, permissions)
- Transaction Tables: 36 → **37** (+1: role_permissions)
- Configuration Tables: 3 → **4** (+1: system_settings)

#### Dictionary Files (NEW)

Create 4 new dictionary files in `dictionary/` folder:

1. **roles_DRAFT.md**
2. **permissions_DRAFT.md**
3. **role_permissions_DRAFT.md**
4. **system_settings_DRAFT.md**

Each dictionary file format:
```markdown
# Table: {table_name}

## Purpose
{Description}

## Classification
Master Data / Transaction Data / Configuration Data

## Columns
| Column | Type | Nullable | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
...

## Indexes
...

## Relationships
...

## Usage
**Screens**: SCR-ADM-XXX  
**APIs**: GET /api/admin/...

## Business Rules
...

## Sample Data
...

## Migration Notes
...
```

**File Size**: ~20KB total (4 files × ~5KB each)

---

### 3.5 API Spec Insurance v1.1 DRAFT

**Base**: Create new or extend existing

**Changes**: Add 5 new APIs

```markdown
<!-- CR-20250131-002: ADDED -->
## Insurance Claims APIs

### GET /api/insurance/claims
**FRD**: SCR-INS-002  
**ERD**: insurance_claims  
**Description**: List all insurance claims with filters

**Request**:
- Query params: status, customer_id, date_from, date_to, page, limit

**Response**: 200 OK
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### POST /api/insurance/claims
**FRD**: SCR-INS-002  
**ERD**: insurance_claims  
**Description**: Create new insurance claim

### GET /api/insurance/claims/:id
### PATCH /api/insurance/claims/:id
### POST /api/insurance/claims/:id/approve
<!-- END CR-20250131-002 -->
```

**File Size**: ~5KB

---

### 3.6 API Spec Admin v2.0 DRAFT

**Base**: Create new or extend existing

**Changes**: Add 22 new APIs (Users: 3, Roles: 8, Audit: 2, Settings: 5, Monitoring: 4)

**File Size**: ~20KB

---

### 3.7 UI Spec v1.1 DRAFT

**Base**: Extend existing UI Spec

**Changes**: Add 7 screens + 6 infrastructure components

**File Size**: ~15KB

---

### 3.8 UAT Plan v1.2 DRAFT

**Base**: Extend existing UAT Plan

**Changes**: Add 7 test suites (INS-001, INS-002, ADM-001-005)

**File Size**: ~10KB

---

## 4. CHANGE MARKING CONVENTION

All changes marked with:
```markdown
<!-- CR-20250131-002: ADDED -->
{new content}
<!-- END CR-20250131-002 -->
```

For modified sections:
```markdown
<!-- CR-20250131-002: MODIFIED -->
{modified content}
<!-- END CR-20250131-002 -->
```

---

## 5. TOTAL EFFORT ESTIMATE

| Task | Effort | Notes |
|------|--------|-------|
| BRD Draft | 1h | Add 4 BR sections |
| FRD Insurance Draft | 0.5h | Minor additions |
| FRD Admin Draft | 3h | Full data requirements + 5 screens |
| ERD Draft | 2h | Update description + 4 dictionary files |
| API Spec Insurance Draft | 1h | 5 APIs |
| API Spec Admin Draft | 3h | 22 APIs |
| UI Spec Draft | 2h | 7 screens + 6 components |
| UAT Plan Draft | 1.5h | 7 test suites |
| **Total** | **14h** | ~2 days |

---

## 6. NEXT STEPS

1. ✅ Create draft folder structure
2. ⏭️ Create BRD v2.1 DRAFT
3. ⏭️ Create FRD Insurance v1.1 DRAFT
4. ⏭️ Create FRD Admin v2.0 DRAFT
5. ⏭️ Create ERD v1.1 DRAFT (description + 4 dictionaries)
6. ⏭️ Create API Spec Insurance v1.1 DRAFT
7. ⏭️ Create API Spec Admin v2.0 DRAFT
8. ⏭️ Create UI Spec v1.1 DRAFT
9. ⏭️ Create UAT Plan v1.2 DRAFT
10. ⏭️ Review all drafts
11. ⏭️ Notify user for approval

---

## 7. APPROVAL CHECKLIST

Before proceeding to create full drafts:

- [ ] Confirm draft folder structure is correct
- [ ] Confirm change marking convention is acceptable
- [ ] Confirm all 8 documents need drafts
- [ ] Confirm priority order (ERD → FRD → API → UI → UAT)
- [ ] Confirm effort estimate is reasonable

---

**Status**: READY FOR APPROVAL  
**Next Action**: Await user confirmation to proceed with draft creation

**End of Draft Summary**
