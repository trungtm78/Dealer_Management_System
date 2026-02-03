# FRD Module 06 - Insurance v1.1 - Change Summary (CR-002)

**Base Version**: v1.0  
**New Version**: v1.1  
**Date**: 2026-01-29  
**CR-ID**: CR-002  
**Change Type**: Specification Enhancement

---

## Changes from v1.0

### SCR-INS-002: Insurance Claim Management - File Validation

**Added Business Rule**: BR-INS-003 - Claim Document Validation

**Validation Requirements**:

1. **Allowed File Types**:
   - JPG / JPEG (image/jpeg)
   - PNG (image/png)
   - PDF (application/pdf)

2. **File Size Limits**:
   - Maximum file size: 10 MB per file
   - Maximum total upload: 50 MB per claim

3. **File Quantity**:
   - Minimum: 1 file (at least one supporting document required)
   - Maximum: 10 files per claim

4. **Validation Rules**:
   - File extension must match allowed types
   - MIME type must match allowed types
   - File size must not exceed limits
   - Malicious files must be rejected

**Error Messages**:

| Error Condition | Error Message |
|----------------|---------------|
| Invalid file type | "Invalid file type. Allowed: JPG, PNG, PDF" |
| File too large | "File size exceeds 10 MB limit" |
| Too many files | "Maximum 10 files allowed per claim" |
| No files uploaded | "At least 1 supporting document is required" |

**UI Behavior**:
- Client-side validation before upload
- Error message displayed immediately
- Invalid files highlighted in red
- User can remove and re-upload

**API Behavior**:
- Server-side validation after upload
- Return 400 Bad Request for invalid files
- Error code: `INS_INVALID_FILE_TYPE`
- Detailed error message in response

---

## Change Log

| Version | Date | CR-ID | Changes | Author |
|---------|------|-------|---------|--------|
| 1.1 | 2026-01-29 | CR-002 | Added file validation rule (BR-INS-003) for claim documents | Antigravity |
| 1.0 | 2026-01-28 | - | Initial FRD for Insurance module | Antigravity |

---

**Note**: For full FRD Module 06 v1.0 content, refer to `FRD_Module_06_Insurance.md`. This document only contains changes introduced in v1.1.

**End of FRD Module 06 v1.1 Change Summary (CR-002)**
