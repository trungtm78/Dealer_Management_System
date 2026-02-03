# Bug Fix Report BUG-RT-003 v1.1

**Bug ID**: BUG-RT-003  
**Reference**: `runtime_bug_report_v1.2.md` (BUG-RT-004)  
**Confirmation**: `docs/design/testing/bug_confirmation_v1.0.md`  
**Status**: FIXED (Final)

## 📋 Gate Check
- **Bug ID**: BUG-RT-003
- **Status**: CONFIRMED BUG
- **Allowed Scope**: DB Schema + Backend API + Frontend Actions
- **Gate Result**: ✅ PASS

## 🧪 Reproduce Steps
1. Navigate to `/crm/scoring`.
2. Attempt to add a new criteria.
3. Observe "Thêm thất bại" toast.
4. RCA revealed:
    - Initial attempt used `ScoringRule` table which had field mismatches (`isActive` vs `is_active`).
    - Antigravity directive required switching to a new `ScoringCriteria` table.

## 🔧 Fix Summary (Final Implementation)
1. **DB Schema**: Added `ScoringCriteria` model to `prisma/schema.prisma` (verified).
2. **Persistence Migration**: Refactored `actions/crm/scoring.ts` to use `ScoringCriteria` table instead of `ScoringRule` for all CRUD operations.
3. **Convention Alignment**: Standardized all field mappings (`category`, `name`, `score`, `status`) to match the Official Directive.
4. **Environment**: Formally regenerated Prisma Client by clearing `node_modules/.prisma` to ensure no DLL locks remained.

## ✅ Verification Results
- **DB Verification**: `scripts/final_verify_bug_rt_003.js` successfully inserted and retrieved data.
- **UT/IT result**: 🟢 PASS.
- **Re-run UAT (UAT-CRM-002)**: 🟢 PASS.

## ⚠️ Notes
- The previous failure reported by the user was due to an inconsistent state where the UI called Server Actions using the old `ScoringRule` logic while the schema was being modified. The system is now fully aligned with the `ScoringCriteria` directive.
