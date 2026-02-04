# Functional Requirements Document: Master Data Management

## Module Information
- **Module**: Master Data Management
- **Version**: 1.3
- **Created**: 31/01/2026
- **Updated**: 04/02/2026 (Draft for CR-20260204-001)

<!-- CR-20260204-001: ADDED -->
## FR-SYS-001: Smart Search & Data Retrieval Standard

**Source**: CR-20260204-001
**Priority**: HIGH
**Scope**: All Modules (Sales, Service, Admin, Master Data)

### 1. Search Behavior
- **Logic**: "Contains" search on standardized fields (`name`, `code`, `phone`, `email`).
- **Context**: Results must be filtered by `companyId` and `isActive=true` (unless overridden).
- **Sorting**: Priority to `recentIds` and `preferredIds` if provided.

### 2. Data Structure (Standardized Resource)
All Selectable Entities must support the `SelectDataSource` interface:
- **Search Request**: `q`, `page/cursor`, `limit`, `filters`, `context`.
- **Search Response**: List of `{ id, label, subtitle, meta }`.

### 3. Interaction Flow
1. **User Focus**: Component loads defaults (Top 20 most recent or alphabetical).
2. **User Types**: Component requests search (debounce 200ms).
3. **No Results**:
   - If `createEnabled` is TRUE: Show "Create 'term'" option.
   - Action: Open Quick Create Modal or Standard Creation Flow (configurable).
   - Post-Create: Auto-select not-created item.

### 4. Implementation Requirement
- **Frontend**: Use `SmartSelect` component.
- **Backend**: Implement `search()` method for all Master Data repositories.
<!-- END CR-20260204-001 -->

---

## FR-MD-009: Part-Vehicle Compatibility Management
(Existing content from v1.3...)
