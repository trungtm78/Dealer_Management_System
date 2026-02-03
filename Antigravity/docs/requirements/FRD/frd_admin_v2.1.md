# FRD Admin v2.1

**Version**: 2.1
**Date**: 2026-02-01
**Status**: ACTIVE
**Previous**: v2.0

(Includes all v2.0 content)

## 6. Functional Specs (Updates)

### SCR-ADM-002: Permission Matrix
**Logic**:
-   **Load**: Fetch Roles list + Permissions list.
-   **Display**: Grid (Rows=Permissions, Cols=Roles).
-   **Action**: Toggle checkbox -> Call `POST /api/admin/roles/{id}/permissions`.

### SCR-ADM-003: Audit Log Viewer
**Logic**:
-   **Load**: Fetch `GET /api/admin/audit-logs`.
-   **Detail**: Click row -> Show JSON Diff.

### SCR-ADM-004: System Settings
**Logic**:
-   **Load**: Get Settings.
-   **Save**: Batch Update.
