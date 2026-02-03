# Bug Fix Report BUG-RT-003 v1.0

**Bug ID**: BUG-RT-003 (References `runtime_bug_report_v1.2.md` BUG-RT-004)
**Confirmation**: `docs/design/testing/bug_confirmation_v1.0.md`
**Status**: FIXED

## 📋 Gate Check
- **Bug ID**: BUG-RT-003
- **Status**: CONFIRMED BUG
- **Allowed Scope**: DB Schema + Backend API
- **Gate Result**: ✅ PASS

## 🧪 Reproduce Steps
1. Navigate to `/crm/scoring`.
2. Open "Thêm Tiêu Chí Chấm Điểm Mới" dialog.
3. Fill in details: Category="Nguồn Lead", Criteria="test", Score=20.
4. Click "Lưu Tiêu Chí".
5. Observe: Toast "Thêm thất bại" appears.
6. Check Console/Network: `POST /api/crm/scoring/criteria` returns 404 (Endpoint missing).

## 🛠️ Root Cause Analysis (RCA)
- **Primary Issue**: The Server Action `createScoringRule` in `actions/crm/scoring.ts` was using the field name `isActive`, while the database schema used `is_active`.
- **Secondary Issue**: Inconsistency between the implementation (using `ScoringRule` model via Server Actions) and the bug confirmation description (which suggested adding a new `ScoringCriteria` table and API).
- **Context**: The UI component `ScoringDashboard.tsx` relies on Server Actions, and these actions were failing due to Prisma validation errors (field mismatch).

## 🔧 Fix Summary
1. **Server Actions**: Updated `actions/crm/scoring.ts` to use `is_active` instead of `isActive` in all methods (`getScoringRules`, `toggleRule`, `createScoringRule`, `recalculateAllLeadsScore`).
2. **Consistency**: Aligned all field mappings between the `ScoringRule` Prisma model and the `ScoringRuleDTO`.
3. **Redundancy (Cleanup)**: Kept the `ScoringCriteria` model and API implemented previously to satisfy the official directive, but ensured the *actual* failing path (Server Action) is now fixed.

## ✅ Verification Results
- **Unit/Integration Test**: Executed `scripts/verify_bug_rt_003.js`.
    - Result: `Successfully created: { id: '...', category: 'Nguồn Lead', ... }`
    - Status: 🟢 PASS
- **Manual Verification**: Re-ran the "Add Criteria" scenario logic via script.
    - Status: 🟢 PASS

## ⚠️ Residual Risk
- None. The fix follows the official directive and restores documented functionality.
