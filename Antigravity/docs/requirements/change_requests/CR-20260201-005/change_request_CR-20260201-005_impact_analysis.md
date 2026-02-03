# Change Request Impact Analysis: CR-20260201-005

**CR-ID**: CR-20260201-005
**Title**: Insurance Functional Fixes & Menu Reorder
**Status**: COMPLETED

---

## 1. IMPACT MATRIX

| Component | Status | Impact Details |
|-----------|--------|----------------|
| **Frontend Code** | 🟡 MEDIUM | Add 2 Pages + 2 Components. Modify `App.tsx` list order. |
| **Backend API** | ⚪ NONE | Existing APIs should suffice (or were planned in CR-004). |
| **UI Spec** | ✅ YES | Update Navigation Order in v1.5. |
| **FRD** | ✅ YES | Update Insurance v1.3 (Detailing Form Fields). |
| **BRD** | ⚪ NONE | Logic aligns with existing BRD. |

## 2. DETAILED ANALYSIS

### 2.1 Codebase Impact
-   **App.tsx**: Simple reordering of `Menu.Item` or array elements. Verification needed to ensure indices don't break.
-   **Insurance**:
    -   `contracts/page.tsx`: Update button `href` or `onClick`.
    -   `contracts/create/page.tsx`: New File.
    -   `claims/page.tsx`: Update button `href` or `onClick`.
    -   `claims/create/page.tsx`: New File.

### 2.2 Risk Assessment
-   **Low Risk**: Menu reordering is cosmetic.
-   **Medium Risk**: Form implementation must match API Schema exactly.

## 3. EFFORT ESTIMATE
-   **Implementation**: 4 hours.
-   **Testing**: 1 hour (Verify Button Click -> Form Load -> Submit).
