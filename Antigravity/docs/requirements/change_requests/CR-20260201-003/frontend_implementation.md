# Frontend Implementation Plan: CR-20260201-003

## 1. Target File
`Refs/src/app/App.tsx` (Monolithic entry point)

## 2. Changes Required

### 2.1 Import New Components
Add imports for the components created in CR-001 (Admin/Insurance):
```typescript
import { PermissionMatrix } from "./components/PermissionMatrix";
import { AuditLogViewer } from "./components/AuditLogViewer";
import SystemSettings from "./components/SystemSettings"; // Check export type
```

### 2.2 Update `Screen` Type
Add union types for new screens:
```typescript
| "admin-permissions"
| "admin-audit"
| "admin-settings"
// ...
```

### 2.3 Update `menuGroups`
Add new items to the "Admin" (Quản Trị) group and "Insurance" (Bảo Hiểm) group.
- Use `lucide-react` icons (Lock, FileClock, Settings).

### 2.4 Update `screenComponents` Mapping
Map the new Screen IDs to the imported Components.

## 3. Pre-requisites
- Ensure `PermissionMatrix.tsx`, `AuditLogViewer.tsx`, and `SystemSettings.tsx` exist in `/components` (Output of CR-001 Implementation).
