# CR-20260201-004 HANDOVER TO OPENCODE

**CR-ID**: CR-20260201-004
**Priority**: CRITICAL
**Deadline**: IMMEDIATE

---

## 1. OBJECTIVE
Implement the "Missing Features" (Master Data) and "Logic" (Insurance/Admin) to replace critical placeholders.

## 2. INPUT ARTIFACTS
- **FRD Admin v2.1**: Logic for Permissions, Logs, Settings.
- **FRD Insurance v1.2**: Logic for Contracts, Claims.
- **UI Spec v1.4**: Navigation for Master Data.

## 3. TASKS
1.  **Modify `App.tsx`**: Add "Master Data" menu group.
2.  **Create Components (Master Data)**:
    -   `VehicleModelList`, `AccessoryList`, `ServiceCatalog`, `BayList`.
3.  **Refactor Components (Admin)**:
    -   `PermissionMatrix.tsx`: Implement Roles/Permissions grid + API.
    -   `AuditLogViewer.tsx`: Implement Log Table + API.
    -   `SystemSettings.tsx`: Implement Config Form + API.
4.  **Refactor Components (Insurance)**:
    -   `InsurancePolicies.tsx`: Implement Contract Table + Create Form.
    -   `InsuranceClaimsList.tsx`: Implement Claims Table/Form + Workflow.

## 4. VERIFICATION
-   All "Placeholder" texts must be gone.
-   Forms must validate and submit data.
-   Navigation must be fully expanded (Master Data visible).
