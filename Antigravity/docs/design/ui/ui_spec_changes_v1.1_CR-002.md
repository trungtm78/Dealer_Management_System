# UI Spec v1.1 - Change Summary (CR-002)

**Base Version**: v1.0  
**New Version**: v1.1  
**Date**: 2026-01-29  
**CR-ID**: CR-002  
**Change Type**: UI Enhancement

---

## Changes from v1.0

### DocumentUploader Component - File Type Restrictions

**Component**: `components/insurance/DocumentUploader.tsx` (Insurance-specific variant)

**Added Props**:

```typescript
interface DocumentUploaderProps {
  // ... existing props
  
  // NEW: File type restrictions
  accept?: string;  // e.g., ".jpg,.jpeg,.png,.pdf"
  allowedTypes?: string[];  // e.g., ["image/jpeg", "image/png", "application/pdf"]
  maxFileSize?: number;  // in bytes, e.g., 10485760 (10 MB)
  maxFiles?: number;  // e.g., 10
  
  // NEW: Validation callbacks
  onValidationError?: (errors: ValidationError[]) => void;
}

interface ValidationError {
  filename: string;
  error: 'INVALID_TYPE' | 'FILE_TOO_LARGE' | 'TOO_MANY_FILES';
  message: string;
}
```

**Usage for Insurance Claims**:

```tsx
<DocumentUploader
  accept=".jpg,.jpeg,.png,.pdf"
  allowedTypes={["image/jpeg", "image/png", "application/pdf"]}
  maxFileSize={10485760}  // 10 MB
  maxFiles={10}
  onValidationError={(errors) => {
    // Display error messages
    toast.error(errors[0].message);
  }}
/>
```

**Client-Side Validation**:

```typescript
// Validation logic (pseudo-code)
function validateFile(file: File): ValidationError | null {
  // 1. Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      filename: file.name,
      error: 'INVALID_TYPE',
      message: 'Invalid file type. Allowed: JPG, PNG, PDF'
    };
  }
  
  // 2. Check file size
  if (file.size > maxFileSize) {
    return {
      filename: file.name,
      error: 'FILE_TOO_LARGE',
      message: `File size exceeds ${maxFileSize / 1024 / 1024} MB limit`
    };
  }
  
  return null;
}
```

**UI Behavior**:

1. **Before Upload**:
   - File input has `accept` attribute: `<input type="file" accept=".jpg,.jpeg,.png,.pdf" />`
   - Client-side validation on file selection
   - Invalid files highlighted in red
   - Error message displayed immediately

2. **Error Display**:
   - Toast notification: "Invalid file type. Allowed: JPG, PNG, PDF"
   - File list shows error icon next to invalid file
   - User can remove invalid file and re-select

3. **Upload Button**:
   - Disabled if any file is invalid
   - Enabled only when all files pass validation

**Error Messages**:

| Error Type | Message |
|-----------|---------|
| INVALID_TYPE | "Invalid file type. Allowed: JPG, PNG, PDF" |
| FILE_TOO_LARGE | "File size exceeds 10 MB limit" |
| TOO_MANY_FILES | "Maximum 10 files allowed" |

**Visual Design**:

```
┌─────────────────────────────────────┐
│ Upload Documents                     │
├─────────────────────────────────────┤
│ Drag & drop files here or click     │
│ [Browse Files]                       │
│                                      │
│ Allowed: JPG, PNG, PDF (max 10 MB)  │
├─────────────────────────────────────┤
│ ✓ accident_photo_1.jpg (2.1 MB)     │
│ ✓ police_report.pdf (1.5 MB)        │
│ ✗ malware.exe (Invalid type) [×]    │
├─────────────────────────────────────┤
│ [Cancel]  [Upload (2 files)]        │
└─────────────────────────────────────┘
```

---

## Change Log

| Version | Date | CR-ID | Changes | Author |
|---------|------|-------|---------|--------|
| 1.1 | 2026-01-29 | CR-002 | Added file type validation to DocumentUploader component | Antigravity |
| 1.0 | 2026-01-28 | - | Initial UI spec | Antigravity |

---

**Total Components**: 110+ (v1.0) → 110+ (v1.1) = No new components, validation added to existing

**End of UI Spec v1.1 Change Summary (CR-002)**
