# UAT Specification: CR-003 & CR-004 Validation
**Run ID**: UAT-20260201-02
**Module**: missing_screens_fix_check
**Date**: 2026-02-01
**Status**: DRAFT
**Input Documents**:
- BRD: v2.3 (Master Data added)
- FRD Admin: v2.1 (Logic added)
- FRD Insurance: v1.2 (Logic added)
- UI Spec: v1.4 (Master Data Nav added)

---

## 1. TEST OBJECTIVES
Verify that the critical gaps identified in "Missing Functionality Report v1.0" have been resolved.
1.  **Navigation**: "Master Data" menu is present.
2.  **Functionality**: Insurance and Admin screens are NO LONGER placeholders and perform actual CRUD/Logic.

---

## 2. TEST SCENARIOS

### GROUP 1: MASTER DATA (CR-004 - NEW)

#### TS-MD-01: Vehicle Model Management
*Trace: BR-MD-001 | UI Spec v1.4*

| TC ID | Scenario | Test Steps | Expected Result |
|-------|----------|------------|-----------------|
| **TC-MD-01-01** | Verify Menu | Check Sidebar | "Master Data" group exists. "Mẫu Xe" item exists. |
| **TC-MD-01-02** | View List | Click "Mẫu Xe" | List of Vehicle Models displayed (Not placeholder). |
| **TC-MD-01-03** | Create Model | Click "Create" -> Enter Name "Civic 2026" -> Save | New model appears in list. |

#### TS-MD-02: Accessories & Services
*Trace: BR-MD-002, BR-MD-003*

| TC ID | Scenario | Test Steps | Expected Result |
|-------|----------|------------|-----------------|
| **TC-MD-02-01** | Create Accessory | Menu "Phụ Tùng" -> Create "Camera Journey" | Accessory created successfully. |
| **TC-MD-02-02** | Create Service | Menu "Dịch Vụ" -> Create "Oil Change" | Service created successfully. |

### GROUP 2: INSURANCE MODULE (CR-004 - LOGIC FIX)

#### TS-INS-01: Contract Logic
*Trace: FRD-INS-001 v1.2*

| TC ID | Scenario | Test Steps | Expected Result |
|-------|----------|------------|-----------------|
| **TC-INS-01-01** | Create Contract | Click "Tạo Mới" (Was missing) -> Fill Form -> Save | Form validates -> Saves -> Redirects to List. |
| **TC-INS-01-02** | Data Persistence | Refresh Page | Created contract still visible (Not static data). |

#### TS-INS-02: Claims Logic
*Trace: FRD-INS-002 v1.2*

| TC ID | Scenario | Test Steps | Expected Result |
|-------|----------|------------|-----------------|
| **TC-INS-02-01** | Submit Claim | Click "Tạo Claim" -> Select Contract -> Submit | Claim Status = "PENDING". |
| **TC-INS-02-02** | Approve Claim | (Manager) Click "Approve" | Status updates to "APPROVED". |

### GROUP 3: ADMIN MODULE (CR-004 - LOGIC FIX)

#### TS-ADM-02: Permission Matrix
*Trace: FRD-ADM-002 v2.1*

| TC ID | Scenario | Test Steps | Expected Result |
|-------|----------|------------|-----------------|
| **TC-ADM-02-01** | View Matrix | Open "Phân Quyền" | Grid displayed (Roles x Permissions). Checkboxes are interactive. |
| **TC-ADM-02-02** | Update Permission | Uncheck "insurance.view" for "Sales" -> Save | Success message. |

#### TS-ADM-03: Settings & Logs
*Trace: FRD-ADM-003, 004 v2.1*

| TC ID | Scenario | Test Steps | Expected Result |
|-------|----------|------------|-----------------|
| **TC-ADM-03-01** | Audit Logs | Open "Nhật Ký" | Real logs displayed (e.g. recent "Approve Claim" action). |
| **TC-ADM-04-01** | System Settings | Change Config -> Save | Settings persisted. |

### GROUP 4: NAVIGATION (CR-003 - STRUCTURE)

#### TS-NAV-01: Structural Integrity
*Trace: UI Spec v1.4*

| TC ID | Scenario | Test Steps | Expected Result |
|-------|----------|------------|-----------------|
| **TC-NAV-01-01** | All Menus Present | Check Sidebar | Admin, Insurance, Master Data (New) groups present. |
| **TC-NAV-01-02** | Route Linking | Click all 11 new menu items | Each links to correct URL (e.g. /master/bays), no 404s. |

---

## 3. PASS CRITERIA
1.  **Zero Placeholders**: Any screen referencing "Component Placeholder" results in automatic FAILURE.
2.  **Data Flow**: Data created in one screen must be visible in list view.
