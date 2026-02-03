# UAT Specification: Complete Missing Screens
**Run ID**: UAT-20260201-01
**Module**: Missing Screens Implementation (Admin & Insurance)
**Date**: 2026-02-01
**Status**: DRAFT
**Input Documents**:
- BRD: v2.2
- FRD Admin: v2.0
- FRD Insurance: v1.1
- UI Spec: v1.3

---

## 1. TEST OBJECTIVES
Verify the functionality and usability of the 7 newly implemented screens and the associated navigation structure.

## 2. SCOPE
- **Module 06: Insurance** (2 Screens)
- **Module 08: Admin** (5 Screens)
- **Navigation Menu** (Sidebar Updates)

---

## 3. TEST SCENARIOS (BUSINESS VIEW)

### GROUP 1: INSURANCE MODULE

#### TS-INS-01: Quản Lý Hợp Đồng Bảo Hiểm (Script: SCR-INS-001)
*Trace: FRD-INS-001 | BR-INS-01*

| TC ID | Scenario | Pre-conditions | Test Steps | Expected Result | Result |
|-------|----------|----------------|------------|-----------------|--------|
| **TC-INS-01-01** | Xem danh sách hợp đồng | Login as Staff | 1. Click Menu "Bỏa Hiểm" > "Hợp Đồng"<br>2. Observe List | List shows Contracts with Status/Dates. | |
| **TC-INS-01-02** | Tạo hợp đồng mới | - | 1. Click "Tạo Mới"<br>2. Fill Customer, Vehicle Info<br>3. Save | Contract created. Success Message shown. | |
| **TC-INS-01-03** | Validate dữ liệu thiếu | - | 1. Leave mandatory fields empty<br>2. Click Save | Error messages appear under fields. | |

#### TS-INS-02: Quản Lý Bồi Thường (Script: SCR-INS-002)
*Trace: FRD-INS-002 | BR-INS-04*

| TC ID | Scenario | Pre-conditions | Test Steps | Expected Result | Result |
|-------|----------|----------------|------------|-----------------|--------|
| **TC-INS-02-01** | Tạo hồ sơ bồi thường | Existing Contract | 1. Select Contract<br>2. Click "Tạo Claim"<br>3. Enter Amount, Date | Claim created with Status "SUBMITTED". | |
| **TC-INS-02-02** | Duyệt bồi thường | Login as Manager | 1. Open Claim (Status: SUBMITTED)<br>2. Click "Approve" | Status changes to "APPROVED". | |
| **TC-INS-02-03** | Từ chối bồi thường | Login as Manager | 1. Open Claim (Status: SUBMITTED)<br>2. Click "Reject" | Status changes to "REJECTED". | |

---

### GROUP 2: ADMIN MODULE

#### TS-ADM-02: Phân Quyền (Script: SCR-ADM-002)
*Trace: FRD-ADM-002 | BR-ADMIN-002*

| TC ID | Scenario | Pre-conditions | Test Steps | Expected Result | Result |
|-------|----------|----------------|------------|-----------------|--------|
| **TC-ADM-02-01** | Xem ma trận phân quyền | Login as Admin | 1. Click Admin > Phân Quyền | Matrix of Roles vs Permissions displayed. | |
| **TC-ADM-02-02** | Cấp quyền cho Role | - | 1. Find "Sales" Role<br>2. Check "insurance.view"<br>3. Save | Permission saved. | |
| **TC-ADM-02-03** | Kiểm tra hiệu lực quyền | New Permission | 1. Logout<br>2. Login as Sales User<br>3. Check Menu | Menu "Bảo Hiểm" appears (was hidden). | |

#### TS-ADM-03: Audit Logs (Script: SCR-ADM-003)
*Trace: FRD-ADM-003 | BR-ADMIN-001*

| TC ID | Scenario | Pre-conditions | Test Steps | Expected Result | Result |
|-------|----------|----------------|------------|-----------------|--------|
| **TC-ADM-03-01** | Xem nhật ký hệ thống | Recent Actions | 1. Click Admin > Nhật Ký | List of user actions displayed (Time, User, Action). | |
| **TC-ADM-03-02** | Xem chi tiết thay đổi | Update Action | 1. Click "View Detail" on a Log | JSON Diff (Before/After) displayed. | |

#### TS-ADM-04: Cấu Hình Hệ Thống (Script: SCR-ADM-004)
*Trace: FRD-ADM-004 | BR-ADMIN-003*

| TC ID | Scenario | Pre-conditions | Test Steps | Expected Result | Result |
|-------|----------|----------------|------------|-----------------|--------|
| **TC-ADM-04-01** | Thay đổi cấu hình | Login as Admin | 1. Change "Session Timeout" to 30m<br>2. Save | Config saved. | |

---

### GROUP 3: NAVIGATION

#### TS-NAV-01: Menu Visibility
*Trace: UI Spec v1.3*

| TC ID | Scenario | Pre-conditions | Test Steps | Expected Result | Result |
|-------|----------|----------------|------------|-----------------|--------|
| **TC-NAV-01-01** | Admin Menu Visibility | Login as Admin | Check Sidebar | "Admin" group visible with all 5 sub-items. | |
| **TC-NAV-01-02** | User Menu Restriction | Login as Staff | Check Sidebar | "Admin" group HIDDEN or restricted. | |

---

## 4. TRACEABILITY MATRIX

| TC ID | Screen ID | FRD Section | BRD Requirement |
|-------|-----------|-------------|-----------------|
| TC-INS-01-XX | SCR-INS-001 | 2.1 Contracts | BR-INS-01 Policy Mgmt |
| TC-INS-02-XX | SCR-INS-002 | 2.2 Claims | BR-INS-04 Claim Mgmt |
| TC-ADM-02-XX | SCR-ADM-002 | 3.2 Permission | BR-ADMIN-002 RBAC |
| TC-ADM-03-XX | SCR-ADM-003 | 3.3 Audit | BR-ADMIN-001 Compliance |
| TC-ADM-04-XX | SCR-ADM-004 | 3.4 Settings | BR-ADMIN-003 Config |
