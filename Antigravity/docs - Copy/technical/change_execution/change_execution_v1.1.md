# Change Execution Instruction v1.1

**CR-ID**: CR-002  
**Date**: 2026-01-29  
**Target**: OpenCode (Implementation Agent)  
**Authority**: Antigravity (Change Request Authority)

---

## 📋 A. CR SUMMARY

**Title**: Add File Type Validation for Insurance Claims  
**Scope**: Insurance module - Claim document upload  
**Priority**: 🟡 MEDIUM  
**Timeline**: 1 day (4 hours)

---

## 📚 B. UPDATED DOCUMENTS (VERSION MỚI)

OpenCode PHẢI đọc các tài liệu version mới sau:

| # | Document | Version | File Path |
|---|----------|---------|-----------|
| 1 | **FRD Insurance** | v1.1 | `docs/requirements/FRD/FRD_Module_06_Insurance_changes_v1.1_CR-002.md` |
| 2 | **API Spec Insurance** | v1.1 | `docs/design/api/api_spec_06_insurance_changes_v1.1_CR-002.md` |
| 3 | **UI Spec** | v1.1 | `docs/design/ui/ui_spec_changes_v1.1_CR-002.md` |

**Note**: Các files trên là **change summary documents** - chỉ chứa phần thay đổi so với version trước.

---

## 🎯 C. PHẠM VI SỬA (ALLOWED TO MODIFY)

### Frontend (FE)

**Component to Modify**: `components/insurance/DocumentUploader.tsx`

**Changes Required**:
1. ✅ Add props: `accept`, `allowedTypes`, `maxFileSize`, `maxFiles`
2. ✅ Add client-side validation before upload
3. ✅ Add error message display
4. ✅ Highlight invalid files in red
5. ✅ Disable upload button if any file is invalid

**Example Implementation**:
```tsx
<DocumentUploader
  accept=".jpg,.jpeg,.png,.pdf"
  allowedTypes={["image/jpeg", "image/png", "application/pdf"]}
  maxFileSize={10485760}  // 10 MB
  maxFiles={10}
  onValidationError={(errors) => {
    toast.error(errors[0].message);
  }}
/>
```

---

### Backend (BE)

**File to Modify**: `app/api/insurance/claims/[id]/documents/route.ts`

**Changes Required**:
1. ✅ Add file type validation (MIME type check)
2. ✅ Add file size validation (max 10 MB per file)
3. ✅ Add file quantity validation (max 10 files)
4. ✅ Return 400 Bad Request for invalid files
5. ✅ Use error code: `INS_INVALID_FILE_TYPE`

**Validation Logic**:
```typescript
// Pseudo-code
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 10;

for (const file of files) {
  // 1. Check MIME type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({
      success: false,
      error: {
        code: "INS_INVALID_FILE_TYPE",
        message: "Invalid file type. Allowed: JPG, PNG, PDF"
      }
    }, { status: 400 });
  }
  
  // 2. Check file size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({
      success: false,
      error: {
        code: "INS_FILE_TOO_LARGE",
        message: "File size exceeds 10 MB limit"
      }
    }, { status: 400 });
  }
}

// 3. Check file quantity
if (files.length > MAX_FILES) {
  return NextResponse.json({
    success: false,
    error: {
      code: "INS_TOO_MANY_FILES",
      message: "Maximum 10 files allowed"
    }
  }, { status: 400 });
}
```

---

## ❌ D. KHÔNG ĐƯỢC ĐỘNG ĐẾN

### Database Schema
- ❌ **KHÔNG SỬA**: `prisma/schema.prisma` (No schema changes)

### Existing Modules
- ❌ KHÔNG SỬA: CRM, Sales, Service, Parts, Accounting, Admin modules

### Other Components
- ❌ KHÔNG SỬA: DocumentUploader khi dùng cho modules khác (chỉ sửa khi dùng cho Insurance)

---

## 🔧 E. TECHNICAL REQUIREMENTS

### Validation Rules (MUST FOLLOW)

**File Types**:
- Allowed MIME types: `image/jpeg`, `image/png`, `application/pdf`
- Allowed extensions: `.jpg`, `.jpeg`, `.png`, `.pdf`

**File Size**:
- Max per file: 10 MB (10,485,760 bytes)
- Max total: 50 MB (52,428,800 bytes)

**File Quantity**:
- Min: 1 file
- Max: 10 files

### Error Codes (MUST USE)

| Error Code | HTTP Status | Message |
|-----------|-------------|---------|
| `INS_INVALID_FILE_TYPE` | 400 | "Invalid file type. Allowed: JPG, PNG, PDF" |
| `INS_FILE_TOO_LARGE` | 400 | "File size exceeds 10 MB limit" |
| `INS_TOO_MANY_FILES` | 400 | "Maximum 10 files allowed" |
| `INS_NO_FILES` | 400 | "At least 1 supporting document is required" |

### Security Requirements

1. ✅ MUST: Validate MIME type from file content (not just extension)
2. ✅ MUST: Sanitize filename before storage
3. ✅ MUST: Store files outside web root
4. ✅ MUST: Generate unique filenames to prevent overwrite
5. ❌ NEVER: Trust file extension alone

---

## ✅ F. TESTING REQUIREMENTS

### Unit Tests (UT)

**Frontend Tests**:
- Test file type validation (valid: JPG, PNG, PDF / invalid: EXE, DOC)
- Test file size validation (valid: < 10 MB / invalid: > 10 MB)
- Test file quantity validation (valid: 1-10 / invalid: 0, 11+)
- Test error message display

**Backend Tests**:
- Test API validation for invalid file types
- Test API validation for oversized files
- Test API validation for too many files
- Test error response format

### User Acceptance Tests (UAT)

**Re-run**: UAT-INS-003-VAL-001

**Expected Result**:
- ✅ Upload valid files (JPG, PNG, PDF) → SUCCESS
- ✅ Upload invalid file (.exe) → ERROR: "Invalid file type. Allowed: JPG, PNG, PDF"
- ✅ Upload oversized file (> 10 MB) → ERROR: "File size exceeds 10 MB limit"
- ✅ Upload too many files (> 10) → ERROR: "Maximum 10 files allowed"

---

## 🚨 G. CRITICAL RULES

### Validation (MUST FOLLOW)

1. ✅ MUST: Implement BOTH client-side AND server-side validation
2. ✅ MUST: Validate MIME type from file content (use file-type library)
3. ✅ MUST: Return proper error codes (INS_INVALID_FILE_TYPE, etc.)
4. ❌ NEVER: Trust client-side validation alone
5. ❌ NEVER: Allow file upload without validation

### Error Handling

1. ✅ MUST: Display user-friendly error messages
2. ✅ MUST: Highlight invalid files in UI
3. ✅ MUST: Allow user to remove and re-upload
4. ❌ NEVER: Show technical error messages to user

---

## 📅 H. TIMELINE & CHECKPOINTS

| Phase | Deliverable | Estimated Time | Checkpoint |
|-------|-------------|----------------|------------|
| **Phase 1** | Frontend validation | 2 hours | Client-side validation works |
| **Phase 2** | Backend validation | 1.5 hours | API returns proper errors |
| **Phase 3** | Testing | 0.5 hours | All UT + UAT pass |
| **TOTAL** | CR-002 complete | **4 hours** | UAT-INS-003-VAL-001 PASS |

---

## 🔗 I. DEPENDENCIES

**Dependencies**: None (standalone change)

**Affected Scenarios**: UAT-INS-003-VAL-001 only

---

## 📞 J. ESCALATION

**Questions về**:
- Business logic → Antigravity (BA)
- Technical design → Antigravity (Design Authority)
- Validation rules → Antigravity (Change Request Authority)

**Blockers**: Report immediately, do not proceed if blocked.

---

**Issued By**: Antigravity (Change Request Authority)  
**Date**: 2026-01-29  
**Status**: ✅ READY FOR EXECUTION

---

**End of Change Execution Instruction v1.1**
