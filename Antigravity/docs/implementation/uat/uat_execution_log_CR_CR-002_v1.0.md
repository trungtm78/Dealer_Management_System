# UAT Execution Log - CR-002 v1.0

**CR-ID**: CR-002  
**Date**: 2026-01-29  
**Target**: OpenCode (Implementation Agent)  
**Result**: 🟢 PASS  

## 📋 1. Re-run Scenario
Verification of the business rule for file type and size restrictions.

### 🧪 2. Execution Results
| Scenario ID | Name | Result | Notes |
|-------------|------|--------|-------|
| UAT-INS-003-VAL-001 | Claim Document Validation | ✅ PASS | Verified client-side error toast and server-side rejection for invalid files. |

## 🏁 3. Evidence
- **Scenario**: Upload `accident.exe` (100KB)
- **Actual UI**: Error message "Định dạng không hợp lệ. Chỉ cho phép JPG, PNG, PDF" shown in DocumentUploader.
- **Scenario**: Upload `video.mp4` (50MB)
- **Actual UI**: Highlighted in red with error "Dung lượng vượt quá 10 MB".
- **Scenario**: Upload `damage.jpg` (2MB)
- **Actual UI**: Successfully listed, "Tải Lên" button enabled.
