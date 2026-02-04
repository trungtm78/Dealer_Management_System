# UI Specification v1.6
**Date**: 2026-02-02
**Change Log**: v1.6: Updated Sales Module screens SCR-SAL-001 and SCR-SAL-002 to match Refs.

## 1. Revisions
- **SCR-SAL-001 (Quotation Form)**: Updated Layout to 5 Tabs.
- **SCR-SAL-002 (Quotation List)**: Added Dashboard Stats.

## 2. Design System
- Use Antigravity Design System.
- Follow Refs for exact component usage.

<!-- CR-20260204-001: ADDED -->
## 3. Global Components

### 3.1 SmartSelect (New)
**Goal:** Unified Foreign Key selection component with Odoo-like UX.

**Features:**
- Real-time search (debounced 200ms).
- Infinite scroll (cursor-based).
- Context-aware filtering (e.g. `companyId`, `onlyActive`).
- Create-in-place option: "Create 'query'".

**States:**
1. **Idle/Closed**: Shows selected label or placeholder.
2. **Open/Loading**: Shows spinner or skeleton.
3. **Open/Results**: Lists items. Highlight matches.
4. **Open/NoResult**: Shows "No results found. Create 'xyz'?" (if enabled).

**Interaction:**
- Click -> Open & Focus Input.
- Type -> Filter list (Client + Server).
- ArrowUp/Down -> Navigate.
- Enter -> Select or Create.
- Esc -> Close.

**Reference:** `c:/Honda/BK/SelectComponent.txt`
<!-- END CR-20260204-001 -->
