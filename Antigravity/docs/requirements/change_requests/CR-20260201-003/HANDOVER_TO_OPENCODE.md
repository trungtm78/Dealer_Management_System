# CR-20260201-003 HANDOVER TO OPENCODE

**CR-ID**: CR-20260201-003
**Target Phase**: Implementation
**Priority**: CRITICAL

---

## 1. OBJECTIVE
Implement the Navigation Menu updates in `Refs/src/app/App.tsx` to expose the new Admin and Insurance screens.

## 2. INPUT ARTIFACTS
- **UI Spec v1.3**: `docs/design/ui/ui_spec_v1.3.md` (Defines the exact mapping).
- **Target File**: `Refs/src/app/App.tsx`.

## 3. REQUIRED ACTIONS

### 3.1 Component Check
Before modifying App.tsx, ensure these components exist in `src/app/components/`:
- `PermissionMatrix.tsx`
- `AuditLogViewer.tsx`
- `SystemSettings.tsx`
*(If missing, stub them out as simple placeholders).*

### 3.2 Modify `App.tsx`
1.  **Imports**: Add imports for the 3 new components.
2.  **Icons**: Import `Lock`, `FileClock` from `lucide-react`.
3.  **Type Definition**: Update `type Screen` to include:
    - `"admin-permissions"`
    - `"admin-audit"`
    - `"admin-settings"`
4.  **Menu Structure**: Update `menuGroups`:
    - Add items to "Quản Trị" group.
    - Check "Bảo Hiểm" group for Claims.
5.  **Screen Mapping**: Update `screenComponents` object.

## 4. VERIFICATION
- The application must compile without TypeScript errors.
- Clicking the new menu items must render the corresponding component (or placeholder).
