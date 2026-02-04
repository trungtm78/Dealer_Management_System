# HANDOVER TO OPENCODE: CR-20260203-008

## Mission

**CR ID**: CR-20260203-008 (Merged CR-006 + CR-007)  
**Feature**: GetDataForFK - Enhanced FK Dropdown với Search, Pagination, Create New

---

## Implementation Scope

**Effort**: 60 SP (10-12 working days)

| Layer | Tasks | SP |
|-------|-------|----|
| API | 24 endpoints + search/pagination | 15 |
| Backend | Services with search logic | 10 |
| Frontend | AutocompleteFK component + 48 fields | 20 |
| Routing | Create New navigation | 3 |
| Testing | Unit + Integration + UAT | 10 |
| Docs | Update specs | 2 |

---

## 1. AutocompleteFK Component (CRITICAL)

**Location**: `components/ui/autocomplete-fk.tsx`

**Features**:
1. **Search**: Real-time với debounce 300ms
2. **Pagination**: 5 items default, lazy loading
3. **Create New**: Navigate to Master Data, auto-select

**Full Specification**: See Draft Summary Section 1

---

## 2. API Enhancements

**Pattern**: Add to ALL 24 list endpoints:

```typescript
GET /api/{entity}?for_dropdown=true&search={query}&limit=5&offset=0

Response: {
  data: [{id, name, status}],
  total: 1234,
  limit: 5,
  offset: 0
}
```

**Endpoints**: 14 NEW + 10 MODIFIED (see Draft Summary Section 2)

---

## 3. Create New Data Flow

**Pattern**:
1. User clicks "Tạo {Entity} mới..."
2. Save form state → localStorage
3. Navigate to `createNewRoute`
4. After create → Return with `?created_id={id}`
5. Restore state, auto-select

**Mapping**: See Draft Summary Section 3.2 (createNewRoute table)

---

## 4. Implementation Order

**Phase 1**: Foundation (Master Data module)
- Create AutocompleteFK component
- Implement search + pagination APIs (12 endpoints)
- Test with 3 forms
- **Effort**: 20 SP, 4 days

**Phase 2**: Scale (7 remaining modules)
- Reuse AutocompleteFK for 41 fields
- Implement remaining 12 endpoints
- Complete testing
- **Effort**: 40 SP, 6-8 days

---

## 5. Testing Strategy

**Unit Tests**:
- AutocompleteFK: Search, pagination, navigation
- API: Search filtering, pagination

**Integration Tests**:  
- E2E: Create New flow (navigate → create → return → auto-select)

**UAT**:
- Test 1 form per module (8+ scenarios)

---

## 6. Success Criteria

✅ All 24 API endpoints support search + pagination  
✅ All 48 FK fields use AutocompleteFK  
✅ Create New navigation works for all entities  
✅ Search debounce = 300ms  
✅ Pagination loads 5 items initially  
✅ No breaking changes

---

## 7. Reference Documents

**MUST READ** (in order):
1. Draft Summary (Section 1: AutocompleteFK spec)
2. Draft Summary (Section 2: API pattern)
3. Draft Summary (Section 3: Create New flow)
4. Impact Analysis (detailed specs)

All documents in: `docs/requirements/change_requests/CR-20260203-008/`

---

## 8. Authority

**Approved By**: Antigravity - Design Authority  
**Date**: 03/02/2026  
**Status**: ✅ APPROVED FOR IMPLEMENTATION

---

**Status**: ✅ READY FOR OPENCODE IMPLEMENTATION

---

**END OF HANDOVER**
