# Change Request Intake: CR-20260201-005

**CR-ID**: CR-20260201-005
**Date**: 2026-02-01
**Submitted By**: Antigravity - Quality Assurance
**Source**: `docs/reports/insurance_functionality_issues.md`
**Priority**: HIGH
**Status**: APPROVED

---

## 1. CHANGE REQUEST OVERVIEW

### 1.1 Summary
This CR addresses 2 distinct requirements:
1.  **Bug Fix (Insurance)**: The "Create Contract" and "Create Claim" buttons are non-functional. We must create the missing pages and forms.
2.  **UI Adjustment (Navigation)**: Reorder the Sidebar menu so **Master Data** appears below Accounting and above Admin.

### 1.2 Business Justification
-   **Blocked Workflow**: Currently impossible to create new contracts/claims.
-   **Usability**: Menu ordering needs logical grouping for admin users.

### 1.3 Scope of Changes

#### A. Insurance Module (Functional Fixes)
-   Create page `contracts/create/page.tsx`.
-   Create page `claims/create/page.tsx`.
-   Create component `InsuranceContractForm.tsx`.
-   Create component `InsuranceClaimForm.tsx`.
-   Link "Create" buttons to these new pages.

#### B. Navigation (UI Adjustment)
-   Modify `App.tsx` (or `SideBar` logic).
-   **New Order**:
    1.  ...
    2.  Sales (Bán Hàng)
    3.  Service (Dịch Vụ)
    4.  Accounting (Kế Toán)
    5.  **Master Data (Dữ Liệu Nguồn)**  <-- Moved Here
    6.  Admin (Quản Trị)
    7.  ...

## 2. APPROVAL DECISION
**Decision**: ✅ **APPROVED**
**Rationale**: High priority fixes required for production readiness.
