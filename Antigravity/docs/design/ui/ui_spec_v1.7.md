# UI Specification v1.7
**Date**: 2026-02-04
**Change Log**: v1.7: Added SmartSelect Component (CR-20260204-001).

## 1. Revisions
- **SCR-SAL-001 (Quotation Form)**: Updated Layout to 5 Tabs.
- **SCR-SAL-002 (Quotation List)**: Added Dashboard Stats.

## 2. Design System
- Use Antigravity Design System.
- Follow Refs for exact component usage.

## 3. Global Components

### 3.1 SmartSelect
**Goal:** Unified Foreign Key selection component with Odoo-like UX.

### 3.1 SmartSelect
**Goal:** Unified Foreign Key selection component with Odoo-like UX.

**Reference Source:** `C:/Honda/BK/SelectComponent.txt`

#### A. Detailed Features
- **Real-time Search:** Triggered on typing (debounce 200ms).
- **Multi-field Logic:** Search matches `name` OR `phone` OR `email` OR `code` OR `tax_id`.
- **Infinite Scroll:** Cursor-based loading (nextCursor).
- **Context Awareness:** 
    - `companyId`: Filter by company.
    - `onlyActive`: Show only active records.
    - `preferredIds` / `recentIds`: Prioritize specific items.
- **Create In-Place:** If no results found, allow creation of new item with the current query `q`.

#### B. TypeScript Contract
```typescript
type ID = string | number;

interface SelectItem {
    id: ID;
    label: string;      // Primary display (Name)
    subtitle?: string;  // Secondary display (Code • Phone • Email)
    meta?: any;         // Raw object for form side-effects
}

interface SearchContext {
    companyId?: ID;
    onlyActive?: boolean;
    preferredIds?: ID[];
    recentIds?: ID[];
    createEnabled?: boolean;
    defaultCreatePayload?: Record<string, any>;
}

interface SearchFilter {
    [key: string]: any; // Strict filters (AND condition)
}

interface SearchRequest {
    q: string;
    context: SearchContext;
    filter?: SearchFilter;
    limit: number;
    cursor?: string | null;
}

interface SearchResponse {
    items: SelectItem[];
    nextCursor?: string | null;
}

interface SelectDataSource {
    search(req: SearchRequest): Promise<SearchResponse>;
    create?(payload: any, ctx: SearchContext): Promise<SelectItem>;
}
```

#### C. Component Logic & States
1.  **Open Dropdown**:
    - Call `search(q="", reset=true)`.
    - Show "Loading" skeleton.
2.  **Typing**:
    - Debounce 200ms.
    - Call `search(q=currentUserInput, reset=true)`.
    - **Anti-Race Condition**: Drop responses from outdated request IDs.
3.  **Scrolling (Infinite)**:
    - When scroll nears bottom -> Call `search(q, reset=false)` with `cursor`.
    - Append results to list.
4.  **Creation Flow**:
    - Trigger: User clicks "Create 'query'" (only visible if `createEnabled`=true AND `q.length >= MIN_LEN` AND no exact match).
    - Action: Call `dataSource.create({ name: q, ...defaultCreatePayload })`.
    - Post-Action: Auto-select the newly returned item and close dropdown.

#### D. Interaction
- **Click**: Open & Focus Input.
- **Keyboard**:
    - `ArrowDown/Up`: Move highlight.
    - `Enter`: Select highlighted item OR Trigger Create if "Create" option is highlighted.
    - `Esc`: Close dropdown.
