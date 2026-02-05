# HANDOVER TO OPENCODE: CR-20260205-PERF-001

**CR ID:** CR-20260205-PERF-001  
**Title:** System-Wide Performance Refactoring  
**Handover Date:** 2026-02-05  
**From:** Antigravity (Design Authority)  
**To:** OpenCode (Implementation Executor)  
**Status:** ✅ READY FOR IMPLEMENTATION  

---

## 🎯 IMPLEMENTATION MANDATE

### Core Principles

**YOU MUST:**
1. ✅ Implement **EXACTLY** as specified in this handover
2. ✅ Read and follow ALL main documents listed below
3. ✅ Execute in phases as outlined
4. ✅ Test comprehensively after EACH phase
5. ✅ **PRESERVE 100% business logic** - ZERO functional changes

**YOU MUST NOT:**
1. ❌ Make ANY business logic changes
2. ❌ Change API contracts (endpoints, request/response formats)
3. ❌ Modify database schema structure (only add indexes)
4. ❌ Skip testing phases
5. ❌ Deviate from this specification without approval

---

## 📚 MAIN DOCUMENTS TO READ

### Must-Read Documents (In Order)

1. **Performance Analysis (Source)**
   - File: `docs/design/change_requests/CR-20260205-PERF-001/performance_analysis_refactoring_plan.md`
   - Version: Latest
   - Purpose: Understand 15 identified bottlenecks and refactoring strategy

2. **CR Executive Summary**
   - File: `docs/design/change_requests/CR-20260205-PERF-001/CR-20260205-PERF-001.md`
   - Version: Latest
   - Purpose: Understand CR scope, risks, rollback plans

3. **ERD Performance Indexes DRAFT**
   - File: `docs/requirements/change_requests/CR-20260205-PERF-001/drafts/ERD_DRAFT_performance_indexes.md`
   - Purpose: Database indexes to implement (30+ indexes)

4. **CR-03 Draft Summary**
   - File: `docs/requirements/change_requests/CR-20260205-PERF-001/change_request_CR-20260205-PERF-001_draft_summary.md`
   - Purpose: Overview of ALL changes (ERD, API, UI, Technical Arch)

5. **Prisma Schema (Current)**
   - File: `prisma/schema.prisma`
   - Purpose: Current database schema to modify

---

## 🗂️ FILES ALLOWED TO MODIFY

### Phase 1: Database Indexes (2 days)

**ALLOWED FILES:**
```
prisma/
└── schema.prisma  (Add @@index declarations only)
```

**MODIFICATIONS:**
- Add 30+ `@@index([...])` declarations to existing models
- NO model structure changes
- NO field additions/deletions
- NO relationship changes

**Example:**
```prisma
model Customer {
  // ... existing fields ...
  
  // EXISTING indexes
  @@index([status])
  @@index([tier])
  @@index([phone])
  @@index([name])
  
  // NEW indexes (CR-20260205-PERF-001)
  @@index([email])
  @@index([mobile])
  @@index([vat])
  @@index([created_at])
  @@index([member_since])
}
```

---

### Phase 2: React Query Setup (1 day)

**ALLOWED FILES:**
```
components/
└── providers.tsx  (Update with QueryClientProvider)

package.json  (Verify @tanstack/react-query installed)
```

**MODIFICATIONS:**
- Setup QueryClientProvider in providers.tsx
- Configure default query options
- NO other changes yet

---

### Phase 3: Frontend Migration (5 days - By Module)

**ALLOWED FILE PATTERNS:**
```
components/crm/**/*.tsx      (CRM module components)
components/sales/**/*.tsx    (Sales module components)
components/service/**/*.tsx  (Service module components)
... (all modules)

hooks/
├── useCustomers.ts      (NEW)
├── useLeads.ts          (NEW)
├── useQuotations.ts     (NEW)
└── ... (30+ new hooks)

components/ui/
└── skeleton.tsx         (NEW)
```

**MODIFICATIONS:**
- Migrate data fetching from useState+useEffect to React Query hooks
- Add loading skeletons
- Add code splitting (dynamic imports)
- Add virtualization for large lists (>100 items)

**FILES COUNT:** ~119 page components + 30+ new hooks

---

### Phase 4: API/Service Layer (2 days)

**ALLOWED FILES:**
```
services/
├── crm.service.ts       (Update cache policy)
├── sales.service.ts     (Update cache policy)
├── service.service.ts   (Update cache policy)
└── ... (all service files)

app/api/**/route.ts      (Add SELECT clauses, optimize includes)
```

**MODIFICATIONS:**
- Change `{ cache: 'no-store' }` to `{ next: { revalidate: 60 } }`
- Add SELECT clauses to Prisma queries
- Optimize include statements

**CRITICAL:** DO NOT change API response formats

---

### Phase 5: Architecture Cleanup (2 days)

**ALLOWED FILES:**
```
components/
├── Split monolithic files into smaller modules
└── Add proper TypeScript types

lib/
└── Add bundle analyzer config

next.config.js  (Add bundle analyzer plugin)
```

---

### Phase 6: Testing & Polish (3 days)

**ALLOWED FILES:**
```
Any files for bug fixes discovered during testing
```

---

## 📝 IMPLEMENTATION TASKS CHECKLIST

### Phase 1: Database Indexes ⚙️

- [ ] **Task 1.1:** Read ERD Draft (`drafts/ERD_DRAFT_performance_indexes.md`)
- [ ] **Task 1.2:** Add indexes to `prisma/schema.prisma`:
  - [ ] Customer table: +5 indexes
  - [ ] Lead table: +5 indexes
  - [ ] Quotation table: +4 indexes
  - [ ] ServiceAppointment table: +4 indexes
  - [ ] RepairOrder table: +4 indexes
  - [ ] Invoice table: +4 indexes
  - [ ] Part table: +3 indexes
  - [ ] Contract table: +3 indexes
  - [ ] ... (total 30+ indexes across 15 tables)
- [ ] **Task 1.3:** Run `npx prisma migrate dev --name add_performance_indexes`
- [ ] **Task 1.4:** Verify migration successful
- [ ] **Task 1.5:** Test database queries (benchmark before/after)

**Acceptance Criteria:**
- ✅ All 30+ indexes added successfully
- ✅ Migration applies without errors
- ✅ No schema structure changes
- ✅ Query performance improvement measurable

---

### Phase 2: React Query Setup ⚙️

- [ ] **Task 2.1:** Verify `@tanstack/react-query@5.90.20` installed
- [ ] **Task 2.2:** Update `components/providers.tsx`:
  ```typescript
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
  
  const queryClient = new QueryClient({
      defaultOptions: {
          queries: {
              staleTime: 60 * 1000,
              gcTime: 5 * 60 * 1000,
              refetchOnWindowFocus: false,
          },
      },
  });
  
  // Wrap children with QueryClientProvider
  ```
- [ ] **Task 2.3:** Test that app loads without errors

**Acceptance Criteria:**
- ✅ QueryClientProvider configured
- ✅ App loads successfully
- ✅ No console errors

---

### Phase 3: Frontend Migration (By Module) ⚙️

**Module 3.1: CRM (Day 1-2)**

- [ ] **Task 3.1.1:** Create hooks for CRM:
  - [ ] `hooks/useCustomers.ts`
  - [ ] `hooks/useLeads.ts`
  - [ ] `hooks/useInteractions.ts`
  - [ ] `hooks/useComplaints.ts`
  - [ ] ... (all CRM entities)
- [ ] **Task 3.1.2:** Create `components/ui/skeleton.tsx` component
- [ ] **Task 3.1.3:** Migrate CRM Components (10 components):
  - [ ] `CustomerList.tsx` → React Query + Skeleton
  - [ ] `LeadsBoard.tsx` → React Query + Code splitting
  - [ ] `ScoringDashboard.tsx` → React Query
  - [ ] ... (all 10 CRM screens)
- [ ] **Task 3.1.4:** Add virtualization to `CustomerList.tsx` (if >100 items)
- [ ] **Task 3.1.5:** Test CRM module thoroughly

**Module 3.2: Sales (Day 2-3)**

- [ ] **Task 3.2.1:** Create hooks for Sales
- [ ] **Task 3.2.2:** Migrate Sales components (7 components)
- [ ] **Task 3.2.3:** Add virtualization to large lists
- [ ] **Task 3.2.4:** Test Sales module

**Module 3.3: Service (Day 3-4)**

- [ ] **Task 3.3.1:** Create hooks for Service
- [ ] **Task 3.3.2:** Migrate Service components (10 components)
- [ ] **Task 3.3.3:** Test Service module

**Module 3.4: Master Data (Day 4)**

- [ ] **Task 3.4.1:** Create hooks for Master Data
- [ ] **Task 3.4.2:** Migrate Master Data components
- [ ] **Task 3.4.3:** Test Master Data module

**Module 3.5-3.8: Others (Day 5)**

- [ ] Insurance, Accounting, Dashboard, Admin modules
- [ ] Test all modules

**Acceptance Criteria (Per Module):**
- ✅ All components migrated to React Query
- ✅ Loading skeletons added
- ✅ Code splitting for heavy components (>50KB)
- ✅ Virtualization for large lists (>100 items)
- ✅ All features working identically
- ✅ NO business logic changes

---

### Phase 4: API/Service Optimization ⚙️

- [ ] **Task 4.1:** Update cache policy in all service files:
  ```typescript
  // BEFORE
  const res = await fetch(url, { cache: 'no-store' });
  
  // AFTER
  const res = await fetch(url, { next: { revalidate: 60 } });
  ```
- [ ] **Task 4.2:** Add SELECT optimization to API routes (30+ files):
  ```typescript
  // Example: GET /api/crm/customers
  const customers = await prisma.customer.findMany({
      where,
      select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          tier: true,
          status: true
          // NOT fetching large fields
      }
  });
  ```
- [ ] **Task 4.3:** Add include optimization to prevent N+1 queries
- [ ] **Task 4.4:** Test API responses (verify same format)

**Acceptance Criteria:**
- ✅ Cache policy updated in all services
- ✅ SELECT optimization added to list endpoints
- ✅ Include optimization prevents N+1 queries
- ✅ API response formats unchanged
- ✅ Response time improved -30% to -70%

---

### Phase 5: Architecture Cleanup ⚙️

- [ ] **Task 5.1:** Split monolithic service files (if >500 lines)
- [ ] **Task 5.2:** Add proper TypeScript response types
- [ ] **Task 5.3:** Setup bundle analyzer:
  ```bash
  npm install --save-dev @next/bundle-analyzer
  ```
- [ ] **Task 5.4:** Analyze bundle size, optimize if needed
- [ ] **Task 5.5:** Code quality review

**Acceptance Criteria:**
- ✅ Code better organized
- ✅ TypeScript types complete
- ✅ Bundle size optimized

---

### Phase 6: Testing & Polish ⚙️

- [ ] **Task 6.1:** Full regression testing (all modules)
- [ ] **Task 6.2:** Performance benchmarking:
  - [ ] Page load times (before/after)
  - [ ] API response times (before/after)
  - [ ] Bundle size (before/after)
  - [ ] Database query times (before/after)
- [ ] **Task 6.3:** Fix any bugs discovered
- [ ] **Task 6.4:** User Acceptance Testing (UAT) with key users
- [ ] **Task 6.5:** Performance monitoring setup

**Acceptance Criteria:**
- ✅ All features working
- ✅ Performance targets met:
  - Page load: <2s (from 3-4s)
  - API response: <150ms average
  - Database queries: <50ms
  - Bundle size: <400KB initial
- ✅ Zero business logic regressions
- ✅ UAT passed

---

## 🎯 ACCEPTANCE CRITERIA (Overall)

### Functional Acceptance

- [ ] **ALL business logic preserved** (zero functional changes)
- [ ] **ALL features working** identically to before
- [ ] **API contracts  unchanged** (same endpoints, same formats)
- [ ] **Database schema structure unchanged** (indexes only)
- [ ] **User workflows unchanged**

### Performance Acceptance

- [ ] **Page load time:** <2s (Target: -40% to -60%)
- [ ] **API response time:** <150ms average (Target: -70%)
- [ ] **Database query time:** <50ms (Target: -83%)
- [ ] **Bundle size:** <400KB initial (Target: -50%)
- [ ] **Cache hit rate:** >70%

### Quality Acceptance

- [ ] **Zero console errors**
- [ ] **Zero TypeScript errors**
- [ ] **Zero accessibility regressions**
- [ ] **All tests passing** (unit + integration)
- [ ] **Code quality maintained** (no new linting errors)

---

## 🧪 TEST REQUIREMENTS

### Automated Tests

**Unit Tests:**
- [ ] All existing unit tests still pass
- [ ] Add tests for new React Query hooks
- [ ] Add tests for skeleton components

**Integration Tests:**
- [ ] Test data fetching with React Query
- [ ] Test cache invalidation
- [ ] Test optimistic updates

**Performance Tests:**
```typescript
describe('Performance Metrics', () => {
    it('page load time < 2s', async () => {
        const start = Date.now();
        await page.goto('/crm/customers');
        expect(Date.now() - start).toBeLessThan(2000);
    });
    
    it('API response < 150ms', async () => {
        const start = Date.now();
        await fetch('/api/crm/customers');
        expect(Date.now() - start).toBeLessThan(150);
    });
});
```

### Manual Tests

**Test Scenarios:** Test ALL critical paths across ALL modules

**Example Test (CRM Module):**
1. Navigate to `/crm/customers`
2. ✅ Verify loading skeleton appears
3. ✅ Verify customer list loads (<2s)
4. ✅ Search for customer by email
5. ✅ Verify results correct
6. ✅ Create new customer
7. ✅ Verify customer appears in list immediately (optimistic update)
8. ✅ Edit customer
9. ✅ Verify changes reflected
10. ✅ Delete customer
11. ✅ Verify customer removed

**Repeat for ALL modules:** Sales, Service, Master Data, Insurance, Accounting, Dashboard, Admin

---

## 🔄 ROLLBACK PROCEDURES

### Database Rollback

```bash
# Revert migration
npx prisma migrate rollback

# Or manually drop indexes
DROP INDEX IF EXISTS "Customer_email_idx";
DROP INDEX IF EXISTS "Customer_mobile_idx";
# ... (all indexes)
```

### Code Rollback

**Option 1: Feature Flags**
```typescript
const USE_REACT_QUERY = process.env.ENABLE_REACT_QUERY === 'true';

// Conditional rendering based on flag
```

**Option 2: Git Revert**
```bash
git revert <commit-hash>
```

**Option 3: Restore from `.legacy` backups**
- Keep `.legacy` copies of modified files during migration

---

## 📊 REPORTING REQUIREMENTS

### Daily Progress Reports

**Format:**
```markdown
## Daily Report: Day X

**Phase:** [ ]
**Progress:** [ % completed]
**Tasks Completed:**
- Task 1
- Task 2

**Blockers:** [ None / List blockers ]
**Next Steps:** [ ]
```

### Phase Completion Reports

**After each phase:**
```markdown
## Phase X Completion Report

**Completed:** [ Date ]
**Duration:** [ X days ]
**Performance Improvements:**
- Metric 1: Before → After
- Metric 2: Before → After

**Issues Found:** [ Count ]
**Issues Resolved:** [ Count ]
**Issues Remaining:** [ Count ]

**Next Phase:** [ ]
```

### Final Implementation Report

**File:** `docs/requirements/change_requests/CR-20260205-PERF-001/implementation_summary.md`

**Include:**
- All files modified (list)
- Performance benchmarks (before/after)
- Test results
- Known issues
- Deployment notes

---

## ⚠️ CRITICAL REMINDERS

### DO NOT

1. ❌ **DO NOT change business logic**
2. ❌ **DO NOT modify API contracts**
3. ❌ **DO NOT change database schema structure**
4. ❌ **DO NOT skip testing**
5. ❌ **DO NOT deviate from spec without approval**

### DO

1. ✅ **DO test thoroughly after every change**
2. ✅ **DO preserve all existing functionality**
3. ✅ **DO measure performance improvements**
4. ✅ **DO report blockers immediately**
5. ✅ **DO ask for clarification if uncertain**

---

## 📞 CONTACT & ESCALATION

**For Questions/Clarifications:**
- Contact: Antigravity (Design Authority)
- Scope: Technical spec clarifications, design decisions

**For Blockers:**
- If blocked >4 hours, escalate immediately
- Document blocker details
- Propose solutions

**For Scope Changes:**
- ANY deviation from this spec requires approval
- Create new mini-CR if scope expansion needed

---

## ✅ HANDOVER CHECKLIST

- [x] All main documents listed and paths provided
- [x] All files allowed to modify clearly specified
- [x] All implementation tasks defined with acceptance criteria
- [x] Test requirements comprehensive
- [x] Rollback procedures documented
- [x] Reporting requirements clear
- [x] Critical reminders emphasized

---

**HANDOVER STATUS:** ✅ **READY FOR IMPLEMENTATION**

**Start Date:** As soon as approved  
**Target Completion:** 3 weeks from start (17 person-days)  
**Implementation Team:** OpenCode  

---

**Handed Over By:** Antigravity  
**Handover Date:** 2026-02-05  
**CR Status:** APPROVED, READY FOR IMPLEMENTATION  

**Good luck, OpenCode team! 🚀**

---

**END OF HANDOVER DOCUMENT**
