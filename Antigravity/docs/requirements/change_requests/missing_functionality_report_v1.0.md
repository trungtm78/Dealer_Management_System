# Missing Functionality Report & Gap Analysis
**Date**: 2026-02-01
**Source**: User Feedback & UAT-20260201-01
**Status**: CRITICAL GAPS FOUND

---

## 1. EXECUTIVE SUMMARY
The user report confirms the UAT findings: The system currently lacks core functionality.
-   **Critical Omission**: The **"Master Data"** module (Vehicle Models, Accessories, Services) is **completely missing** from the Navigation Menu (missed in CR-003).
-   **Implementation Gap**: The **Insurance** and **Admin** modules have menus, but the screens are **non-functional placeholders** (No "Create" buttons, no Lists, no Logic).

---

## 2. DETAILED GAP ANALYSIS

### 2.1 MISSING MODULE: Master Data (Hoàn toàn chưa có menu)
*Requirement Source*: `change_request_complete_missing_screens_v1.0.md` (Section 3.7.1)

| Requirement | Status | Gap Details |
|-------------|--------|-------------|
| **Menu: Master Data** | 🔴 MISSING | Menu "Dữ Liệu Nguồn" doesn't exist in Sidebar. |
| **Screen: Vehicle Models** | 🔴 MISSING | Cannot access /master/vehicle-models. |
| **Screen: Accessories** | 🔴 MISSING | Cannot access /master/accessories. |
| **Screen: Service Catalog** | 🔴 MISSING | Cannot access /master/services. |
| **Screen: Service Bays** | 🔴 MISSING | Cannot access /master/bays. |

### 2.2 NON-FUNCTIONAL MODULE: Insurance (Có menu, rỗng ruột)
*Requirement Source*: FRD Module 06 v1.1

| Feature | Status | Gap Details |
|---------|--------|-------------|
| **Menu: Hợp Đồng** | 🟡 PARTIAL | Menu exists. |
| **View Contract List** | 🔴 FAILED | Shows placeholder text only. No table/data. |
| **Create Contract** | 🔴 FAILED | **No "Create" button**. No form. Cannot input data. |
| **Menu: Bồi Thường** | 🟡 PARTIAL | Menu exists. |
| **View/Create Claims** | 🔴 FAILED | Shows placeholder text only. |

### 2.3 NON-FUNCTIONAL MODULE: Admin (Có menu, rỗng ruột)
*Requirement Source*: FRD Module 08 v2.0

| Feature | Status | Gap Details |
|---------|--------|-------------|
| **Permissions (RBAC)** | 🔴 FAILED | Shows placeholder. No Matrix. **Security Risk**. |
| **Audit Logs** | 🔴 FAILED | Shows placeholder. No Logs view. |
| **System Settings** | 🔴 FAILED | Shows placeholder. No Config forms. |
| **Access Control** | 🔴 FAILED | Admin menu visible to everyone (No Guards). |

---

## 3. REMEDIATION PLAN (KẾ HOẠCH KHẮC PHỤC)

To resolve these gaps, we must execute the following **Implmentation Phase 2**:

### Step 1: Fix Navigation (Immediate)
-   **Task**: Update `App.tsx` to add "Master Data" menu group.
-   **Items**: Vehicle Models, Accessories, Services, Bays.

### Step 2: Implement Master Data Screens
-   Create components for Master Data (List/Create/Edit) which are currently missing even as placeholders.

### Step 3: Implement Functional Logic (Replace Placeholders)
-   **Insurance**: Build actual Table, Form, and API integration.
-   **Admin**: Build actual Permission Matrix, Log Viewer, Settings Form.

---

## 4. NEXT ACTION
Authorized OpenCode to:
1.  **ADD** Master Data to `App.tsx` (CR-003 Addendum).
2.  **IMPLEMENT** the functional components for all 3 modules immediately.
