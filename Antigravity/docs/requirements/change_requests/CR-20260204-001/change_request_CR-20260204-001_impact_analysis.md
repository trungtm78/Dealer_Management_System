# CR IMPACT ANALYSIS: Smart Search Component

## 1. Documents Impact Matrix
| Document | Current Version | Impact Level | Notes |
|----------|----------------|--------------|-------|
| BRD | v2.4 | Low | Add global functional requirement for Smart Search |
| FRD | v1.3 (Master Data) / v2.1 (Admin) | High | Define Smart Search behavior, pagination, filter logic for dropdowns |
| ERD | v1.2 (Master Data) | Medium | Add indexes for search performance (name, code, phone, etc.) |
| API Spec | v1.2 (Master Data) | High | Standardize list/search endpoints. Create `SearchRequest/Response` contract. |
| UI Spec | v1.6 | High | Define `SmartSelect` component, interactions, states (loading, empty, create) |

## 2. Detailed Impact Analysis

### 2.1. Business Requirements (BRD)
- **Goal:** Improve data entry efficiency and UX consistency.
- **Changes:**
    - Add "Smart Search FK" requirement: All Foreign Key inputs must support real-time search, "contains" logic, and in-place creation.
    - Users: All system users.

### 2.2. Functional Requirements (FRD)
- **Common Requirements:**
    - Screen Standard: Replace standard `<select>` or `Combobox` with `SmartSelect`.
    - Behavior: 
        - Click -> Load default (context-aware).
        - Type -> Debounced Search (200ms).
        - "No result" -> Dynamic "Create" option (if permission allowed).
    - Pagination: Infinite scroll support.
- **Data Requirements:**
    - Search Query (`q`) must apply to multiple fields (OR condition): `name`, `code`, `phone`, `email`.
    - Context params (`companyId`, `activeOnly`) must be enforced.

### 2.3. Data Model (ERD)
- **Schema:** No new tables.
- **Performance:** Need to verify/add indexes on searchable columns for heavy tables (Customers, Products, Vehicles):
    - `full_text_search` or standard b-tree indexes on `name`, `code`, `phone`, `email`.
    - **Note:** Implementation detail, but crucial for "realtime" feel.

### 2.4. API Specifications (API Spec)
- **Contract Change:** All "List/Select" endpoints must support:
    - `q` (string): Search query.
    - `limit` (number): Page size.
    - `cursor` (string): For infinite scroll.
    - `filters` (json): Additional filters.
- **New Interface:** `SelectDataSource` pattern.
    - `search(req: SearchRequest): Promise<SearchResponse>`
    - `create(payload: any): Promise<SelectItem>`

### 2.5. UI Specifications (UI Spec)
- **New Component:** `SmartSelect`
    - Props: `dataSource`, `placeholder`, `allowCreate`, `renderItem`, `context`.
    - States: Idle, Loading, Loaded, Creating, Error.
    - Interaction: 
        - Auto-focus input on open.
        - Highlight matches.
        - Keyboard navigation (Up/Down/Enter/Esc).

## 3. Effort Estimate
- **Complexity:** Complex (System-wide impact, requires generic component + backend standardization).
- **Risk:** Medium (Potential performance issues if backend search is slow. Regression risk for existing dropdowns).
- **Estimate:** 
    - FE Component: 16h
    - BE API Standardization: 24h
    - DB Indexing: 4h
    - Integration & Testing: 16h
    - **Total:** ~60h

## 4. Conclusion
- **Decision:** PROCEED
- **Recommendation:** Implement as a shared library definition first, then rollout module by module.
