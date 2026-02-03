# UI Specification v1.3

**Version**: 1.3
**Date**: 2026-02-01
**Status**: Ready
**Related CR**: CR-20260201-003 (App.tsx Navigation)

---

## I. Global UI Standards
(See v1.0)

## II. Component Registry Updates
(See v1.1)

## III. Screen Mappings
(See v1.1)

## IV. Navigation Implementation (`App.tsx` Mapping)

### 1. File Structure
The navigation is monolithic within `src/app/App.tsx`.

### 2. Menu Configuration (`menuGroups`)
The following IDs must be added to the `menuGroups` object:

#### Admin Group
*Icon: Settings (already imported)*
| ID | Label | Icon Type | Component |
|----|-------|-----------|-----------|
| `admin-permissions` | Phân Quyền | `Lock` | `PermissionMatrix` |
| `admin-audit` | Nhật Ký Hệ Thống | `FileClock` | `AuditLogViewer` |
| `admin-settings` | Cấu Hình | `Settings` | `SystemSettings` |

#### Insurance Group
*Icon: Shield (already imported)*
| ID | Label | Icon Type | Component |
|----|-------|-----------|-----------|
| `insurance-claims` | Bồi Thường | `ShieldAlert` | `InsuranceClaimsList` (Exists) |

### 3. Component Imports
Ensure the following are imported in `App.tsx`:
- `import { PermissionMatrix } from "./components/PermissionMatrix";`
- `import { AuditLogViewer } from "./components/AuditLogViewer";`
- `import { SystemSettings } from "./components/SystemSettings";`

---

## Change Log
| Version | Changes |
|---------|---------|
| 1.3 | Updated Implementation Mapping for App.tsx (CR-20260201-003). |
| 1.2 | Added Logical Sitemap (CR-20260201-002). |
