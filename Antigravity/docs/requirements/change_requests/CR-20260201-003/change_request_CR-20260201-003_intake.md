# Change Request Intake: CR-20260201-003

**CR-ID**: CR-20260201-003
**Date**: 2026-02-01
**Submitted By**: Antigravity - UI Architect
**Source**: Implementation Gap Analysis & Refs Codebase Study
**Priority**: HIGH
**Status**: APPROVED

---

## 1. CHANGE REQUEST OVERVIEW

### 1.1 Summary
Implement Navigation Menu updates by directly modifying `Refs/src/app/App.tsx`.
Existing analysis of `Refs` confirms that navigation logic (menus, routing, component mapping) is centralized in `App.tsx`, not in a separate Sidebar component.
This CR defines the specific code changes required to expose the new Admin and Insurance screens.

### 1.2 Business Justification
- Users currently cannot access the newly specified functionality (Permissions, Audit, Insurance Claims).
- Implementation must follow the existing pattern in `App.tsx` to work.

### 1.3 Scope of Changes
1.  **Modify `Refs/src/app/App.tsx`**:
    -   **Imports**: Add `PermissionMatrix`, `AuditLogViewer`, `SystemSettings`.
    -   **Types**: Update `Screen` union type.
    -   **Menu Configuration**: Update `menuGroups` constant.
    -   **Routing**: Update `screenComponents` map.

## 2. APPROVAL DECISION
**Decision**: ✅ **APPROVED**
**Rationale**: Required for system usability and follows architectural standards.
