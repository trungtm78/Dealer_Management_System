# FRD Admin v2.1 (DRAFT)
**Target**: `docs/requirements/FRD/frd_admin_v2.1.md`
**Changes**: Added Functional Logic for placeholders.

---

### SCR-ADM-002: Permission Matrix
**Logic**:
-   **Load**: Fetch Roles list + Permissions list.
-   **Display**: Grid (Rows=Permissions, Cols=Roles).
-   **Action**: Toggle checkbox -> Call `POST /api/admin/roles/{id}/permissions`.
-   **Validation**: Admin cannot revoke own "super-admin" permissions.

### SCR-ADM-003: Audit Log Viewer
**Logic**:
-   **Load**: Fetch `GET /api/admin/audit-logs` (Paginated, Sorted by Date DESC).
-   **Filter**: User, Action Type, Date Range.
-   **Detail**: Click row -> Show JSON Diff of `old_values` vs `new_values`.

### SCR-ADM-004: System Settings
**Logic**:
-   **Load**: Fetch `GET /api/admin/settings`.
-   **UI**: Form with Categories (General, Security, Notifications).
-   **Save**: `PUT /api/admin/settings` (Batch update).
