# CR-20260201-005 HANDOVER TO OPENCODE

**CR-ID**: CR-20260201-005
**Priority**: HIGH
**Deadline**: ASAP

---

## 1. OBJECTIVE
1.  Implement "Create" pages for Insurance Contracts/Claims.
2.  Reorder the Sidebar Menu to specific layout.

## 2. TASKS
1.  **Modify `App.tsx` (Navigation)**:
    -   Rearrange menu items to match Strict Order:
        1. Dashboard
        2. CRM
        3. Sales
        4. Service
        5. Insurance
        6. Parts
        7. Accounting
        8. Master Data
        9. Admin
2.  **Create Pages (Insurance)**:
    -   `app/(main)/insurance/contracts/create/page.tsx`
    -   `app/(main)/insurance/claims/create/page.tsx`
3.  **Create Components (Insurance)**:
    -   `components/insurance/InsuranceContractForm.tsx` (Use React Hook Form + Zod).
    -   `components/insurance/InsuranceClaimForm.tsx` (Use React Hook Form + Zod).
4.  **Update Links**:
    -   In `contracts/page.tsx`, link "Create" button to `/insurance/contracts/create`.
    -   In `claims/page.tsx`, link "Create" button to `/insurance/claims/create`.

## 3. VERIFICATION
-   Clicking "Create New Contract" opens the form.
-   Sidebar order matches exactly: Dashboard -> CRM -> Sales -> Service -> Insurance -> Parts -> Accounting -> Master Data -> Admin.
