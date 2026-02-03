# UI Specification v1.3 (Draft for CR-20260201-003)

**Status**: DRAFT in CR-20260201-003
**Reference**: Refs/src/app/App.tsx

---

## I. Global UI Standards
(Retained)

## II. Component Registry
(Retained)

## III. Screen Mappings
(Retained)

## IV. Navigation Structure (Implementation Map)

### 1. Target File: `Refs/src/app/App.tsx`

### 2. Type `Screen` Updates
Append the following to the `Screen` type definition:
```typescript
| "admin-permissions"
| "admin-audit"
| "admin-settings"
| "master-vehicle"
| "master-service"
```

### 3. Missing Component Imports
Components that need to be created/imported in `App.tsx`:
- `PermissionMatrix` (for "admin-permissions") -> maps to `/components/PermissionMatrix.tsx`
- `AuditLogViewer` (for "admin-audit") -> maps to `/components/AuditLogViewer.tsx`
- `SystemSettings` (for "admin-settings") -> maps to `/components/SystemSettings.tsx`

*Note: `InsuranceClaimsList` and `UserRoleManagement` already exist in App.tsx imports.*

### 4. Menu Groups Configuration
Modify `const menuGroups`:

**Admin Group Additions**:
```typescript
{
  id: "admin-permissions",
  label: "Phân Quyền (RBAC)",
  icon: Lock // Import from lucide-react
},
{
  id: "admin-audit",
  label: "Nhật Ký Hệ Thống",
  icon: FileClock // Import from lucide-react
}
```

---
## Change Log
| Version | Changes |
|---------|---------|
| 1.3 | Updated Navigation Implementation to target App.tsx (CR-20260201-003). |
