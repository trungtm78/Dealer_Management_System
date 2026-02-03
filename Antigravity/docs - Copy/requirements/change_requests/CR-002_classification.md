# CR-002 Classification & Impact Analysis

**CR-ID**: CR-002  
**Title**: Add File Type Validation for Insurance Claims  
**Date**: 2026-01-29  
**Requested By**: UAT Authority (via UAT-INS-003-VAL-001 FAIL)  
**Processed By**: Antigravity - Change Request Authority

---

## BƯỚC 1: PHÂN LOẠI CHANGE REQUEST

### CR Details

**Description**:
Add file type validation for insurance claim document uploads. Currently, the system accepts all file types without validation. Need to restrict to JPG, PNG, and PDF only.

**Source**:
- UAT Classification v1.1
- Scenario: UAT-INS-003-VAL-001 (Insurance Claim File Validation)
- Root Cause: Specification gap - file validation not in FRD/API/UI specs

### CR Type Classification

| Type | Applicable | Details |
|------|------------|---------|
| **Business logic change** | ✅ Yes | Add validation rule for claim documents |
| **Functional flow change** | ✅ Yes | Add validation step before file upload |
| **Data model change** | ❌ No | No database schema changes |
| **API contract change** | ✅ Yes | Add validation to API endpoint |
| **UI/UX change** | ✅ Yes | Add client-side validation + error message |
| **Non-functional** | ❌ No | No performance/maintainability changes |

**Primary Type**: Business logic + Functional flow + API + UI

### Impact Level

**Level**: 🟡 **MEDIUM**

**Justification**:
- Affects 1 module (Insurance)
- Affects 1 screen (Claim Detail)
- Affects 3 documents (FRD, API Spec, UI Spec)
- No database changes
- No breaking changes to existing functionality
- Backward compatible (existing files remain valid)

---

## BƯỚC 2: PHÂN TÍCH IMPACT

### Impact Analysis Table

| Document | Affected | Reason |
|----------|----------|--------|
| **BRD** | ❌ No | Business requirements unchanged - claim document upload already required |
| **FRD Insurance** | ✅ Yes | Need to add validation rule: "Claim documents must be JPG, PNG, or PDF only" |
| **FRD Admin** | ❌ No | Not related to Admin module |
| **ERD** | ❌ No | No database schema changes - files stored as paths/URLs |
| **API Spec Insurance** | ✅ Yes | Need to add file type validation to POST `/api/insurance/claims/{id}/documents` |
| **API Spec Admin** | ❌ No | Not related to Admin APIs |
| **UI Spec** | ✅ Yes | Need to add file input restrictions to DocumentUploader component (when used for insurance claims) |
| **UAT Plan** | ✅ Yes | UAT-INS-003-VAL-001 already expects this validation - no change needed, just re-run |

### Detailed Impact

#### 1. FRD Insurance v1.0 → v1.1 (MINOR)

**Section Affected**: SCR-INS-002 (Insurance Claim Management)

**Changes Required**:
- Add validation rule under "Business Rules" section
- Specify allowed file types: JPG, PNG, PDF
- Specify max file size (if not already defined)
- Add error message specification

**Version Change**: v1.0 → v1.1 (MINOR - adding validation rule)

---

#### 2. API Spec Insurance v1.0 → v1.1 (MINOR)

**Endpoint Affected**: POST `/api/insurance/claims/{id}/documents`

**Changes Required**:
- Add request validation: File type must be JPG, PNG, or PDF
- Add error response: 400 Bad Request with error code `INS_INVALID_FILE_TYPE`
- Update request body documentation
- Add validation logic specification

**Version Change**: v1.0 → v1.1 (MINOR - adding validation)

---

#### 3. UI Spec v1.0 → v1.1 (MINOR)

**Component Affected**: DocumentUploader (when used for insurance claims)

**Changes Required**:
- Add `accept` attribute: `.jpg,.jpeg,.png,.pdf`
- Add client-side validation before upload
- Add error message display: "Invalid file type. Allowed: JPG, PNG, PDF"
- Update component props to support file type restrictions

**Version Change**: v1.0 → v1.1 (MINOR - adding validation)

---

### Impact Summary

**Documents to Update**: 3 (FRD Insurance, API Spec Insurance, UI Spec)  
**Version Changes**: All MINOR (v1.0 → v1.1)  
**Breaking Changes**: None  
**Backward Compatibility**: Yes (existing valid files remain valid)

---

## BƯỚC 3: CẬP NHẬT TÀI LIỆU

### Document Update Plan

**Approach**: Create change summary documents (not full rewrites)

| Document | Current Version | New Version | Change Type | File |
|----------|----------------|-------------|-------------|------|
| FRD Insurance | v1.0 | v1.1 | MINOR | `FRD_Module_06_Insurance_changes_v1.1_CR-002.md` |
| API Spec Insurance | v1.0 | v1.1 | MINOR | `api_spec_06_insurance_changes_v1.1_CR-002.md` |
| UI Spec | v1.0 | v1.1 | MINOR | `ui_spec_changes_v1.1_CR-002.md` |

**Note**: These are incremental changes on top of existing v1.0 documents.

---

## BƯỚC 4: CHANGE REQUEST LOG

**Entry to Add**:

```markdown
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
| FRD Insurance | **Yes** | Need to add validation rule |
| API Spec Insurance | **Yes** | Need to add file type validation |
| UI Spec | **Yes** | Need to add file input restrictions |

**Changes Made**:

1. **FRD Insurance v1.0 → v1.1**: Added file validation rule
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
- Classification: `docs/design/testing/uat_classification_v1.1.md`
- Execution Instruction: `docs/technical/change_execution/change_execution_v1.1.md`
```

---

## BƯỚC 5: CHANGE EXECUTION INSTRUCTION

**File**: `docs/technical/change_execution/change_execution_v1.1.md`

**Content Summary**:
- CR-002 details
- Updated documents (3 files with paths)
- Scope: FE + BE validation
- Testing: Re-run UAT-INS-003-VAL-001

---

**Classification Complete**: ✅  
**Ready for**: Document updates (Step 3)

---

**End of CR-002 Classification & Impact Analysis**
