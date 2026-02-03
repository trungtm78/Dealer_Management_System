# UI Specification v1.1

**Version**: 1.1  
**Date**: 31/01/2026  
**Status**: Ready  

---

## I. Global UI Standards
(See v1.0)

## II. Component Registry Updates (v1.1)

### Module: Insurance
| Component ID | Name | Type | Description |
|--------------|------|------|-------------|
| UI-INS-001 | `InsuranceContractList` | REUSABLE | Table with renewable filters. |
| UI-INS-002 | `InsuranceContractForm` | EXTENDABLE | Form for contract creation. |
| UI-INS-003 | `InsuranceClaimList` | REUSABLE | Claims workflow monitoring. |
| UI-INS-004 | `InsuranceClaimDetail` | COMPOSITE | Detail view + Approval actions. |

### Module: Admin
| Component ID | Name | Type | Description |
|--------------|------|------|-------------|
| UI-ADM-001 | `PermissionMatrix` | COMPLEX | Grid for Role x Permission toggle. |
| UI-ADM-002 | `AuditLogViewer` | REUSABLE | Log table with diff viewer. |
| UI-ADM-003 | `SystemSettingsEditor` | EXTENDABLE | Category-based settings form. |
| UI-ADM-004 | `MonitoringDashboard` | DASHBOARD | Real-time charts. |

---

## III. Screen Mappings

### Admin Screens
- **SCR-ADM-002 (Permissions)**: Uses `PermissionMatrix`.
- **SCR-ADM-003 (Audit)**: Uses `AuditLogViewer`.

### Insurance Screens
- **SCR-INS-004 (Claims)**: Uses `InsuranceClaimList`.

---

## Change Log
| Version | Changes |
|---------|---------|
| 1.1 | Added components for CR-20250131-002 (Admin & Insurance). |
| 1.0 | Initial UI Spec. |
