# IMPEMENTATION HANDOVER: CR-20260204-001

## 1. Contract Info
- **CR ID**: CR-20260204-001
- **Feature**: Smart Search Component & Data Retrieval Standard
- **Status**: READY_FOR_IMPLEMENTATION
- **Date**: 2026-02-04

## 2. Single Source of Truth (Valid Documents)
OpenCode MUST only read the following documents. DO NOT read drafts.

### ✅ BRD
- Path: `docs/requirements/BRD/brd_honda_dms_v2.5.md`
- Requirement: **BR-SYS-001** (Smart Search)

### ✅ FRD
- Path: `docs/requirements/FRD/frd_master_data_v1.4.md`
- Requirement: **FR-SYS-001** (Smart Search Standard)

### ✅ API Spec
- Path: `docs/design/api/api_spec_master_data_v1.3.md`
- Section: **SelectDataSource Interface** & **SearchRequest Schema**

### ✅ UI Spec
- Path: `docs/design/ui/ui_spec_v1.7.md`
- Component: **3.1 SmartSelect**

## 3. Implementation Directives
OpenCode must implement the `SmartSelect` component adhering strictly to the following technical specifications.

### A. TypeScript Interface (Mandatory)
Implement these exact interfaces in your common types library:
```typescript
interface SelectDataSource {
    search(req: SearchRequest): Promise<SearchResponse>;
    create?(payload: any, ctx: SearchContext): Promise<SelectItem>;
}
// See UI Spec v1.7 for full type definitions of SearchRequest, SelectItem, etc.
```

### B. Logic Requirements
1.  **Anti-Race Condition**: You MUST implement a `requestId` system. If a search response arrives but the user has already typed more characters (triggering a new request), the old response MUST be ignored.
2.  **Debounce**: 200ms debounce on typing.
3.  **Infinite Scroll**: Use `IntersectionObserver` or scroll listener to trigger `search(q, nextCursor)` when reaching the bottom of the list.

### C. Search Logic (Backend)
The backend `search()` implementation must follow this logic:
-   **Normalize**: Trim, lowercase, collapse spaces.
-   **Fields**: `name` OR `phone` OR `email` OR `code` OR `tax_id` (Contains logic).
-   **Mandatory Filters**: `context.companyId` and `context.onlyActive` must be enforced unless explicitly overridden.

### D. Create Implementation
-   **Condition**: Show "Create 'q'" ONLY IF `createEnabled=true` AND `q.length >= minLength` AND no exact match found.
-   **Action**: `dataSource.create()` should handle the API call and return the fully formed `SelectItem`.
-   **UX**: Auto-select the created item immediately.

## 4. Verification Checkpoints
-   [ ] **Type Check**: Verify `SelectDataSource` interface matches the spec.
-   [ ] **Race Condition Test**: Rapidly type "ABC". Ensure only the results for "ABC" are shown, not "A" or "AB".
-   [ ] **Create Test**: Verify "Create 'New Costumer'" appears when no results found, and clicking it auto-selects the new customer.
-   [ ] **Context Test**: Verify searching with `companyId=X` does NOT return customers from `companyId=Y`.
