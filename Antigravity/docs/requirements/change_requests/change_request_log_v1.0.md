# Honda DMS - Change Request Log

**Purpose**: Track all change requests và version updates

---

## Change Request History

### CR-UAT-004 (2026-01-28) - UAT Plan Field Name Correction

**Status**: ✅ IMPLEMENTED  
**Date**: 2026-01-28  
**Requested By**: UAT Execution (BUG-UAT-004)  
**Approved By**: Antigravity (Design Authority)

**Description**:
UAT Plan v1.0 có field name không khớp với ERD schema cho RepairOrder:
- UAT Plan (implicit): `service_advisor_id`
- ERD Schema (actual): `advisor_id`
- UAT Plan thiếu: `vehicle_info` JSON structure details

**Root Cause**:
Documentation inconsistency - UAT Plan không align với ERD schema

**Classification**: CHANGE REQUEST (Documentation Error)

**Impact Analysis**:

| Document | Affected | Reason |
|----------|----------|--------|
| BRD | No | Business requirement không đổi |
| FRD | No | Functional spec không đổi |
| ERD | No | Schema đã đúng (`advisor_id`) |
| API Spec | No | API spec đã đúng |
| UI Spec | No | UI không đổi |
| UAT Plan | **Yes** | Field name cần correction |

**Changes Made**:

1. **UAT Plan v1.0 → v1.1**:
   - File: `uat_plan_v1.0.md` → `uat_plan_v1.1.md`
   - UAT-SVC-001 Step 3: Clarified field alignment with ERD (`advisor_id`)
   - UAT-SVC-001 Preconditions: Added `vehicle_info` JSON structure example
   - Updated version metadata

**Version Updates**:
- UAT Plan: v1.0 → v1.1

**Implementation**:
- OpenCode aligned test scripts with ERD schema
- UAT-SVC-001 re-executed successfully (PASS)

**Verification**:
- ✅ UAT-SVC-001 executed with corrected field names
- ✅ RepairOrder created successfully
- ✅ All fields match ERD schema

---

## Change Request Process

### How to Submit a Change Request

1. **Identify Need**: Document why change is needed
2. **Classification**: Determine if BUG or CHANGE REQUEST
3. **Impact Assessment**: Analyze affected documents
4. **Approval**: Get approval from Antigravity
5. **Implementation**: Update documents, increment versions
6. **Verification**: Re-test affected scenarios

### Change Request Template

```markdown
### CR-XXX (YYYY-MM-DD) - [Title]

**Status**: DRAFT / APPROVED / IMPLEMENTED  
**Date**: YYYY-MM-DD  
**Requested By**: [Name/Source]  
**Approved By**: [Name]

**Description**:
[What needs to change and why]

**Root Cause**:
[Why this change is needed]

**Classification**: BUG / CHANGE REQUEST

**Impact Analysis**:

| Document | Affected | Reason |
|----------|----------|--------|
| BRD | Yes/No | |
| FRD | Yes/No | |
| ERD | Yes/No | |
| API Spec | Yes/No | |
| UI Spec | Yes/No | |
| UAT Plan | Yes/No | |

**Changes Made**:
[List of document updates]

**Version Updates**:
[Old version → New version]

**Implementation**:
[How change was implemented]

**Verification**:
[How change was verified]
```

---

## Version Control Rules

### Major Version (vX.0)
Increment when:
- Breaking changes to API contracts
- Major schema changes
- Significant functional changes

### Minor Version (vX.Y)
Increment when:
- Documentation corrections
- Field name clarifications
- Non-breaking enhancements

### Patch Version (vX.Y.Z) - Not used
Documents use Major.Minor only

---

## Related Documents

- **UAT Classification**: `docs/design/testing/uat_classification_v1.0.md`
- **Change Execution Instructions**: `docs/technical/change_execution/`
- **UAT Plan**: `docs/design/testing/uat_plan_v1.1.md`

---

### CR-001 (2026-01-29) - Complete Missing Screens Implementation

**Status**: ✅ DOCUMENTED  
**Date**: 2026-01-29  
**Requested By**: Implementation Gap Analysis  
**Approved By**: Antigravity (Change Request Authority)

**Description**:
Hoàn thiện 7 màn hình chưa được implement đầy đủ:
- Insurance: 2 màn (INS-001, INS-002)
- Admin: 5 màn (ADM-001, ADM-002, ADM-003, ADM-004, ADM-005)

**Root Cause**:
Implementation gap - Có UI mockup nhưng thiếu database/API/business logic hoặc chưa có gì

**Classification**: CHANGE REQUEST (Feature Completion)

**Impact Analysis**:

| Document | Affected | Reason |
|----------|----------|--------|
| BRD | **Yes** | Thiếu BR cho ADM-002, ADM-003, ADM-004 |
| FRD - Insurance | **Yes** | UI specs chưa đầy đủ |
| FRD - Admin | **Yes** | Thiếu functional specs cho 5 màn |
| ERD | **Yes** | Thiếu tables: roles, permissions, role_permissions, system_settings |
| API Spec - Insurance | **Yes** | Thiếu APIs cho claims |
| API Spec - Admin | **Yes** | Thiếu APIs cho admin module |
| UI Spec | **Yes** | Thiếu component specs cho 7 màn |
| UAT Plan | **Yes** | Thiếu test cases cho 7 màn |

**Changes Made**:

1. **BRD v2.0 → v2.1**: Added 3 BR sections (ADM-002, ADM-003, ADM-004)
   - File: `docs/requirements/BRD/BRD_changes_v2.1.md`
   
2. **FRD Insurance v1.0 → v1.1**: Added UI components and workflows
   - File: `docs/requirements/FRD/FRD_Module_06_Insurance_changes_v1.1.md`
   
3. **FRD Admin v1.0 → v2.0**: Added 5 new screens (MAJOR)
   - File: `docs/requirements/FRD/FRD_Module_08_Admin_changes_v2.0.md`
   
4. **ERD v1.0 → v1.1**: Added 4 tables (roles, permissions, role_permissions, system_settings)
   - File: `docs/design/database/erd/erd_changes_v1.1.md`
   
5. **API Spec Insurance v1.0 → v1.1**: Added 5 APIs for claims
   - File: `docs/design/api/api_spec_06_insurance_changes_v1.1.md`
   
6. **API Spec Admin v1.0 → v2.0**: Added 22 APIs (MAJOR)
   - File: `docs/design/api/api_spec_08_admin_changes_v2.0.md`
   
7. **UI Spec v1.0 → v1.1**: Added 20 UI components
   - File: `docs/design/ui/ui_spec_changes_v1.1.md`
   
8. **UAT Plan v1.1 → v1.2**: Added 7 test suites (37 scenarios)
   - File: `docs/design/testing/uat_plan_changes_v1.2.md`

**Version Updates**:
- BRD: v2.0 → v2.1 (MINOR)
- FRD Insurance: v1.0 → v1.1 (MINOR)
- FRD Admin: v1.0 → v2.0 (MAJOR)
- ERD: v1.0 → v1.1 (MINOR)
- API Spec Insurance: v1.0 → v1.1 (MINOR)
- API Spec Admin: v1.0 → v2.0 (MAJOR)
- UI Spec: v1.0 → v1.1 (MINOR)
- UAT Plan: v1.1 → v1.2 (MINOR)

**Implementation**:
- Timeline: 7 weeks (278 hours)
- Priority: CRITICAL (Security & Compliance)
- Dependencies: ADM-002 → ADM-001 → ADM-003

**Verification**:
- ✅ All 8 change summary documents created
- ⏳ Pending OpenCode implementation

**Reference**: 
- Classification: `docs/requirements/change_requests/CR-001_classification.md`
- Execution Instruction: `docs/technical/change_execution/change_execution_v1.0.md`

---

### CR-002 (2026-01-29) - Add File Type Validation for Insurance Claims

**Status**: ✅ DOCUMENTED  
**Date**: 2026-01-29  
**Requested By**: UAT Authority (UAT-INS-003-VAL-001 FAIL)  
**Approved By**: Antigravity (Change Request Authority)

**Description**:
Add file type validation for insurance claim document uploads. Restrict to JPG, PNG, and PDF only.

**Root Cause**:
Specification gap - file validation not specified in FRD/API/UI specs

**Classification**: CHANGE REQUEST (Specification Enhancement)

**Impact Analysis**:

| Document | Affected | Reason |
|----------|----------|--------|
| FRD Insurance | **Yes** | Need to add validation rule (BR-INS-003) |
| API Spec Insurance | **Yes** | Need to add file type validation to upload endpoint |
| UI Spec | **Yes** | Need to add file input restrictions to DocumentUploader |

**Changes Made**:

1. **FRD Insurance v1.0 → v1.1**: Added file validation rule (BR-INS-003)
   - File: `docs/requirements/FRD/FRD_Module_06_Insurance_changes_v1.1_CR-002.md`
   
2. **API Spec Insurance v1.0 → v1.1**: Added file type validation
   - File: `docs/design/api/api_spec_06_insurance_changes_v1.1_CR-002.md`
   
3. **UI Spec v1.0 → v1.1**: Added DocumentUploader file type restrictions
   - File: `docs/design/ui/ui_spec_changes_v1.1_CR-002.md`

**Version Updates**:
- FRD Insurance: v1.0 → v1.1 (MINOR)
- API Spec Insurance: v1.0 → v1.1 (MINOR)
- UI Spec: v1.0 → v1.1 (MINOR)

**Implementation**:
- Timeline: 1 day (4 hours)
- Priority: MEDIUM
- Dependencies: None

**Verification**:
- ✅ All 3 change summary documents created
- ⏳ Pending OpenCode implementation
- ⏳ Pending UAT-INS-003-VAL-001 re-run

**Reference**: 
- Classification: `docs/requirements/change_requests/CR-002_classification.md`
- Execution Instruction: `docs/technical/change_execution/change_execution_v1.1.md`

---

### CR-003 (2026-01-29) - Add Bay Utilization Management Screen

**Status**: ✅ DOCUMENTED  
**Date**: 2026-01-29  
**Requested By**: Business (Service Department)  
**Approved By**: Antigravity (Change Request Authority)

**Description**:
Thêm màn hình "Tình Trạng Sử Dụng Bay Dịch Vụ" để quản lý và theo dõi tình trạng sử dụng các bay sửa chữa trong xưởng dịch vụ.

**Root Cause**:
Business request mới - chuyên ngành bảo trì xe hơi cần quản lý bay hiệu quả

**Classification**: NEW FEATURE (Full Stack - DB + API + UI + Business Logic)

**Impact Analysis**:

| Document | Affected | Reason |
|----------|----------|--------|
| BRD | **Yes** | Need to add BR-SVC-007 (Bay Utilization Management) |
| FRD Service | **Yes** | Need to add SCR-SVC-006 (Bay Utilization screen) |
| ERD | **Yes** | Need to add 3 tables (service_bays, bay_assignments, bay_status_logs) |
| API Spec Service | **Yes** | Need to add 10 APIs for bay management |
| UI Spec | **Yes** | Need to add BayUtilization screen + 6 components |
| UAT Plan | **Yes** | Need to add 6 UAT scenarios |

**Changes Made**:

1. **BRD v1.0 → v1.1**: Added BR-SVC-007 (Bay Utilization Management)
   - File: `docs/requirements/BRD/BRD_changes_v1.1_CR-003.md`
   
2. **FRD Service v1.0 → v1.1**: Added SCR-SVC-006 (Bay Utilization screen)
   - File: `docs/requirements/FRD/FRD_Module_04_Service_changes_v1.1_CR-003.md`
   
3. **ERD v1.1 → v1.2**: Added 3 tables
   - File: `docs/design/database/erd/erd_changes_v1.2_CR-003.md`
   
4. **API Spec Service v1.0 → v1.1**: Added 10 APIs
   - File: `docs/design/api/api_spec_04_service_changes_v1.1_CR-003.md`
   
5. **UI Spec v1.1 → v1.2**: Added BayUtilization screen + 6 components
   - File: `docs/design/ui/ui_spec_changes_v1.2_CR-003.md`
   
6. **UAT Plan v1.2 → v1.3**: Added 6 UAT scenarios
   - File: `docs/design/testing/uat_plan_changes_v1.3_CR-003.md`

**Version Updates**:
- BRD: v1.0 → v1.1 (MINOR)
- FRD Service: v1.0 → v1.1 (MINOR)
- ERD: v1.1 → v1.2 (MINOR)
- API Spec Service: v1.0 → v1.1 (MINOR)
- UI Spec: v1.1 → v1.2 (MINOR)
- UAT Plan: v1.2 → v1.3 (MINOR)

**Implementation**:
- Timeline: 2 weeks (80 hours)
- Priority: MEDIUM
- Dependencies: RepairOrder table, User table

**New Entities**:
- 3 database tables
- 10 API endpoints
- 1 screen + 6 components
- 6 UAT scenarios

**Verification**:
- ✅ All 6 change summary documents created
- ⏳ Pending OpenCode implementation
- ⏳ Pending UAT-SVC-006 execution

**Reference**: 
- Classification: `docs/requirements/change_requests/CR-003_classification.md`
- Execution Instruction: `docs/technical/change_execution/change_execution_v1.2.md`
- UI Reference: `C:\Honda\Antigravity\Refs\src\app\components\BayUtilization.tsx`

---

**Maintained By**: Antigravity (Change Request Authority)  
**Last Updated**: 2026-01-29  
**Next CR ID**: CR-004


