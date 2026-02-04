# Functional Requirements Document: Master Data Management

## Module Information
- **Module**: Master Data Management
- **Version**: 1.4
- **Created**: 31/01/2026
- **Updated**: 04/02/2026
- **Updated by**: CR-20260204-001 (Smart Search)
- **Previous Version**: 1.3
- **Author**: Antigravity - Business Analyst
- **Project**: Honda SPICE ERP System

---

## 📋 Change Summary (v1.3 → v1.4)

**CR-20260204-001**: Smart Search Component & Data Retrieval Standard

**Changes**:
- Added FR-SYS-001: Smart Search Standard
  - Defines search behavior, data structure, and interaction flow for all FKs.

---

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

---

## FR-MD-009: Part-Vehicle Compatibility Management
(Refer to v1.3 for details)

---

## Change Log

### Version 1.4 - 04/02/2026
#### Added (CR-20260204-001)
- FR-SYS-001: Smart Search & Data Retrieval Standard

### Version 1.3 - 03/02/2026
- Added Part-Vehicle Compatibility (FR-MD-009)

---

**End of FRD Master Data v1.4**
