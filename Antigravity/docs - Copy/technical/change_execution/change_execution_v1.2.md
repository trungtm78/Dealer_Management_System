# Change Execution Instruction v1.2

**CR-ID**: CR-003  
**Date**: 2026-01-29  
**Target**: OpenCode (Implementation Agent)  
**Authority**: Antigravity (Change Request Authority)

---

## 📋 A. CR SUMMARY

**Title**: Add Bay Utilization Management Screen  
**Scope**: Service Module - Bay Management (Full Stack)  
**Priority**: 🟡 MEDIUM  
**Timeline**: 2 weeks (80 hours)

---

## 📚 B. UPDATED DOCUMENTS (VERSION MỚI)

OpenCode PHẢI đọc các tài liệu version mới sau:

| # | Document | Version | File Path |
|---|----------|---------|-----------|
| 1 | **BRD** | v1.1 | `docs/requirements/BRD/BRD_changes_v1.1_CR-003.md` |
| 2 | **FRD Service** | v1.1 | `docs/requirements/FRD/FRD_Module_04_Service_changes_v1.1_CR-003.md` |
| 3 | **ERD** | v1.2 | `docs/design/database/erd/erd_changes_v1.2_CR-003.md` |
| 4 | **API Spec Service** | v1.1 | `docs/design/api/api_spec_04_service_changes_v1.1_CR-003.md` |
| 5 | **UI Spec** | v1.2 | `docs/design/ui/ui_spec_changes_v1.2_CR-003.md` |
| 6 | **UAT Plan** | v1.3 | `docs/design/testing/uat_plan_changes_v1.3_CR-003.md` |

**UI Reference**: `C:\Honda\Antigravity\Refs\src\app\components\BayUtilization.tsx`

**Note**: Các files trên là **change summary documents** - chỉ chứa phần thay đổi so với version trước.

---

## 🎯 C. PHẠM VI SỬA (ALLOWED TO MODIFY)

### Database (DB)

**Files to Modify**: 
- `prisma/schema.prisma`
- `prisma/seed.ts`

**Changes Required**:
1. ✅ Add 3 new models:
   - `ServiceBay`
   - `BayAssignment`
   - `BayStatusLog`
2. ✅ Add relations to existing models:
   - `User` → `BayStatusLog` (relation: "BayStatusChanger")
   - `RepairOrder` → `BayAssignment`
3. ✅ Add seed data: 8 service bays

**Migration**:
```bash
npx prisma migrate dev --name add_bay_management
npx prisma generate
```

---

### Backend (BE)

**Files to Create**:
1. `app/api/service/bays/route.ts` - GET, POST /api/service/bays
2. `app/api/service/bays/[id]/route.ts` - GET, PUT, DELETE
3. `app/api/service/bays/utilization/route.ts` - GET dashboard data
4. `app/api/service/bays/[id]/assign/route.ts` - POST assign work
5. `app/api/service/bays/[id]/progress/route.ts` - PUT update progress
6. `app/api/service/bays/[id]/complete/route.ts` - POST complete work
7. `app/api/service/bays/[id]/history/route.ts` - GET status history

**Business Logic**:
- Delay calculation: `max(0, current_time - estimated_end)` if not completed
- Utilization rate: `(total_bays - idle_bays) / total_bays * 100`
- Status auto-update: 
  - Assign work → status = 'working'
  - Complete work → status = 'idle'
  - Delayed if current_time > estimated_end

**Error Handling**:
- Use error codes: BAY_NOT_FOUND, BAY_NOT_AVAILABLE, REPAIR_ORDER_ALREADY_ASSIGNED
- Return proper HTTP status codes

---

### Frontend (FE)

**Files to Create**:
1. `app/(main)/service/bays/page.tsx` - Main dashboard page
2. `components/service/BayKPICards.tsx` - KPI cards component
3. `components/service/BayCard.tsx` - Individual bay card
4. `components/service/BayAssignmentDialog.tsx` - Assign work dialog
5. `components/service/BayProgressDialog.tsx` - Update progress dialog
6. `components/service/BayUtilizationChart.tsx` - Utilization chart

**Data Fetching**:
- Use SWR or React Query for real-time updates
- Refresh interval: 30 seconds
- Loading states: Skeleton UI

**Styling**:
- Follow UI Spec v1.2 colors and layout
- Use Tailwind CSS classes
- Responsive: 4 cols (desktop), 2 cols (tablet), 1 col (mobile)

**Reference Implementation**: `C:\Honda\Antigravity\Refs\src\app\components\BayUtilization.tsx`

---

## ❌ D. KHÔNG ĐƯỢC ĐỘNG ĐẾN

### Existing Modules
- ❌ KHÔNG SỬA: CRM, Sales, Parts, Accounting, Insurance, Admin modules
- ❌ KHÔNG SỬA: Existing Service screens (Appointments, Repair Orders, etc.)

### Existing Tables
- ❌ KHÔNG SỬA: `repair_orders` table structure (only add relation)
- ❌ KHÔNG SỬA: `users` table structure (only add relation)

### Other
- ❌ KHÔNG SỬA: Authentication, Authorization logic
- ❌ KHÔNG SỬA: Global layouts, navigation (except adding menu item)

---

## 🔧 E. TECHNICAL REQUIREMENTS

### Database Schema (MUST FOLLOW)

**ServiceBay Model**:
```prisma
model ServiceBay {
  id            String    @id @default(cuid())
  name          String
  location      String?
  capacity      String?
  equipment     String?    // JSON array
  status        String    @default("ACTIVE")
  is_available  Boolean   @default(true)
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt

  assignments   BayAssignment[]
  statusLogs    BayStatusLog[]

  @@map("service_bays")
}
```

**BayAssignment Model**:
```prisma
model BayAssignment {
  id                String    @id @default(cuid())
  bay_id            String
  repair_order_id   String
  assigned_at       DateTime  @default(now())
  started_at        DateTime?
  estimated_end     DateTime?
  actual_end        DateTime?
  status            String    @default("ASSIGNED")
  progress_percent  Int       @default(0)
  delay_minutes     Int       @default(0)
  notes             String?
  created_at        DateTime  @default(now())
  updated_at        DateTime  @updatedAt

  bay           ServiceBay   @relation(fields: [bay_id], references: [id])
  repairOrder   RepairOrder  @relation(fields: [repair_order_id], references: [id])
  statusLogs    BayStatusLog[]

  @@map("bay_assignments")
}
```

**BayStatusLog Model**:
```prisma
model BayStatusLog {
  id             String    @id @default(cuid())
  bay_id         String
  assignment_id  String?
  status         String
  changed_at     DateTime  @default(now())
  changed_by     String?
  notes          String?

  bay        ServiceBay     @relation(fields: [bay_id], references: [id])
  assignment BayAssignment? @relation(fields: [assignment_id], references: [id])
  changedBy  User?          @relation("BayStatusChanger", fields: [changed_by], references: [id])

  @@map("bay_status_logs")
}
```

### API Response Format (MUST USE)

**Success Response**:
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "BAY_NOT_FOUND",
    "message": "Bay not found"
  }
}
```

### Business Rules (MUST IMPLEMENT)

1. ✅ One bay can only have one active assignment
2. ✅ One repair order can only be assigned to one bay
3. ✅ Delay auto-calculated when current_time > estimated_end
4. ✅ Progress can only increase (not decrease)
5. ✅ Bay freed immediately after work completion
6. ✅ Status log created for every status change

---

## ✅ F. TESTING REQUIREMENTS

### Unit Tests (UT)

**Backend Tests**:
- Test all 10 API endpoints
- Test business logic (delay calculation, utilization rate)
- Test error handling (bay not found, already assigned, etc.)

**Frontend Tests**:
- Test component rendering
- Test user interactions (assign, update progress, complete)
- Test data fetching and error states

### Integration Tests (IT)

**Test Flows**:
1. Assign work to idle bay → Bay status changes to working
2. Update progress → Progress bar updates
3. Complete work → Bay freed, repair order status updated
4. Delay detection → Alert displays, bay highlighted

### User Acceptance Tests (UAT)

**Execute**: UAT-SVC-006 (6 scenarios)
- UAT-SVC-006-001: View dashboard
- UAT-SVC-006-002: Assign work
- UAT-SVC-006-003: Update progress
- UAT-SVC-006-004: Complete work
- UAT-SVC-006-005: View delayed alert
- UAT-SVC-006-006: View chart

**Expected**: All 6 scenarios PASS

---

## 📅 G. TIMELINE & CHECKPOINTS

| Phase | Deliverable | Estimated Time | Checkpoint |
|-------|-------------|----------------|------------|
| **Phase 1** | Database schema + migration | 4 hours | 3 tables created, seed data loaded |
| **Phase 2** | Backend APIs (10 endpoints) | 24 hours | All APIs functional, UT passing |
| **Phase 3** | Frontend components (6) | 32 hours | All components working, IT passing |
| **Phase 4** | Integration & testing | 16 hours | UAT-SVC-006 all PASS |
| **Phase 5** | Polish & documentation | 4 hours | Code review, comments, README |
| **TOTAL** | CR-003 complete | **80 hours** | Production ready |

---

## 🔗 H. DEPENDENCIES

**Required Tables** (must exist):
- ✅ `repair_orders` - Already exists (ERD v1.1)
- ✅ `users` - Already exists

**Required APIs** (must be functional):
- ✅ GET /api/service/repair-orders - For assignment dropdown

**Blocked By**:
- None (can implement in parallel with other CRs)

**Blocks**:
- None (new feature, no dependencies)

---

## 🚨 I. CRITICAL RULES

### Data Integrity (MUST FOLLOW)

1. ✅ MUST: Create status log for every status change
2. ✅ MUST: Validate bay availability before assignment
3. ✅ MUST: Prevent duplicate assignments (one RO → one bay)
4. ✅ MUST: Auto-calculate delay_minutes on every progress update
5. ❌ NEVER: Allow progress to decrease
6. ❌ NEVER: Delete bay with active assignment

### Security

1. ✅ MUST: Check user permissions (Service Advisor/Manager/Admin only)
2. ✅ MUST: Validate all input data
3. ✅ MUST: Sanitize JSON equipment field
4. ❌ NEVER: Expose sensitive data in logs

### Performance

1. ✅ MUST: Dashboard load time < 2 seconds
2. ✅ MUST: Use database indexes on bay_id, status, changed_at
3. ✅ MUST: Implement pagination for history API (max 50 records)

---

## 📞 J. ESCALATION

**Questions về**:
- Business logic → Antigravity (BA)
- Technical design → Antigravity (Design Authority)
- Database schema → Antigravity (Change Request Authority)

**Blockers**: Report immediately, do not proceed if blocked.

**Completion**: Report to Antigravity when all phases complete and UAT-SVC-006 PASS.

---

**Issued By**: Antigravity (Change Request Authority)  
**Date**: 2026-01-29  
**Status**: ✅ READY FOR EXECUTION

---

**End of Change Execution Instruction v1.2**
