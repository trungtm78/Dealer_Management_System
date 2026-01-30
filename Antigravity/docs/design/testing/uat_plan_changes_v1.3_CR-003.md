# UAT Plan Changes v1.3 (CR-003)

**Document**: User Acceptance Testing Plan  
**Version**: v1.2 → v1.3  
**Change Type**: MINOR (Adding 6 new scenarios)  
**CR-ID**: CR-003  
**Date**: 2026-01-29

---

## CHANGE SUMMARY

**Added**: UAT-SVC-006 test suite (Bay Utilization Management)

**Scenarios**: 6 new test scenarios

---

## NEW TEST SUITE: UAT-SVC-006

### Test Suite Information

**Suite ID**: UAT-SVC-006  
**Suite Name**: Bay Utilization Management  
**Module**: Service  
**Priority**: HIGH  
**Estimated Time**: 3 hours

---

### UAT-SVC-006-001: View Bay Utilization Dashboard

**Scenario**: User views bay utilization dashboard

**Preconditions**:
- User logged in as Service Advisor
- At least 8 bays exist in system
- Some bays have active assignments

**Test Steps**:
1. Navigate to `/service/bays`
2. Verify page loads successfully
3. Verify KPI cards display:
   - Tổng Bay = 8
   - Rảnh = count of idle bays
   - Đang làm = count of working bays
   - Trễ hạn = count of delayed bays
   - Tỷ lệ sử dụng = calculated percentage
4. Verify bay grid displays 8 bay cards
5. Verify each bay card shows correct status
6. Verify utilization chart displays at bottom

**Expected Results**:
- ✅ Dashboard loads within 2 seconds
- ✅ All KPIs display correct values
- ✅ All 8 bays visible in grid
- ✅ Status colors match specification
- ✅ Chart displays correct data

**Test Data**:
- 8 bays: 2 idle, 3 working, 2 delayed, 1 completed

---

### UAT-SVC-006-002: Assign Work Order to Idle Bay

**Scenario**: User assigns work order to idle bay

**Preconditions**:
- At least 1 bay with status = 'idle'
- At least 1 repair order with status = 'PENDING'

**Test Steps**:
1. Identify idle bay card
2. Click "Phân công công việc" button
3. Verify assignment dialog opens
4. Select repair order from dropdown
5. Set estimated end time (current time + 2 hours)
6. Add notes: "Test assignment"
7. Click "Xác nhận"
8. Verify dialog closes
9. Verify bay card updates to "Đang làm việc"
10. Verify work order info displays on bay card

**Expected Results**:
- ✅ Dialog opens successfully
- ✅ Repair order dropdown shows pending orders
- ✅ Assignment created successfully
- ✅ Bay status changes to 'working'
- ✅ Bay card displays work order details
- ✅ KPI cards update (Rảnh -1, Đang làm +1)

**Test Data**:
- Bay: Bay 3 (idle)
- Repair Order: WO-2026-0130
- Estimated End: Current time + 2 hours

---

### UAT-SVC-006-003: Update Work Progress

**Scenario**: User updates work progress

**Preconditions**:
- At least 1 bay with active assignment
- Current progress < 100%

**Test Steps**:
1. Click "Xem chi tiết" on working bay card
2. Verify progress dialog opens
3. Verify current progress displays
4. Move progress slider to 75%
5. Add notes: "Engine work completed"
6. Click "Cập nhật"
7. Verify dialog closes
8. Verify progress bar updates on bay card

**Expected Results**:
- ✅ Dialog opens with current progress
- ✅ Slider allows values >= current progress
- ✅ Progress updates successfully
- ✅ Bay card shows new progress (75%)
- ✅ Progress bar visually updates

**Test Data**:
- Bay: Bay 1 (working, current progress 50%)
- New Progress: 75%

---

### UAT-SVC-006-004: Complete Work and Free Bay

**Scenario**: User completes work and frees bay

**Preconditions**:
- At least 1 bay with active assignment
- Progress = 100% (recommended)

**Test Steps**:
1. Click "Xem chi tiết" on working bay card
2. Click "Hoàn thành" button
3. Verify confirmation dialog
4. Click "Xác nhận"
5. Verify bay status changes to 'idle'
6. Verify bay card shows "Bay đang rảnh"
7. Verify "Phân công công việc" button appears
8. Verify KPIs update

**Expected Results**:
- ✅ Confirmation dialog appears
- ✅ Assignment marked as completed
- ✅ Bay status changes to 'idle'
- ✅ Bay card updates to idle state
- ✅ KPI cards update (Đang làm -1, Rảnh +1)
- ✅ Repair order status changes to 'READY'

**Test Data**:
- Bay: Bay 1 (working, progress 100%)

---

### UAT-SVC-006-005: View Delayed Bay Alert

**Scenario**: System displays alert for delayed bays

**Preconditions**:
- At least 1 bay with delayed status
- Current time > estimated end time

**Test Steps**:
1. Navigate to `/service/bays`
2. Verify alert box displays at top
3. Verify alert message: "Cảnh báo: {count} bay đang bị trễ hạn"
4. Verify delayed bay cards have red border
5. Verify delayed bay cards have pulse animation
6. Verify delay warning displays on bay card
7. Verify delay minutes calculated correctly

**Expected Results**:
- ✅ Alert box visible with red background
- ✅ Alert shows correct count of delayed bays
- ✅ Delayed bay cards highlighted (red border + pulse)
- ✅ Delay warning shows "Trễ {minutes} phút"
- ✅ Delay minutes = current time - estimated end

**Test Data**:
- 2 delayed bays
- Bay 2: 45 minutes delayed
- Bay 8: 120 minutes delayed

---

### UAT-SVC-006-006: View Bay Utilization Chart

**Scenario**: User views utilization chart

**Preconditions**:
- Bays with various statuses exist

**Test Steps**:
1. Scroll to bottom of page
2. Verify "Biểu Đồ Sử Dụng Bay" section displays
3. Verify 4 horizontal bars display:
   - Rảnh (gray)
   - Đang làm việc (blue)
   - Trễ hạn (red)
   - Hoàn thành (green)
4. Verify each bar shows count / total
5. Verify bar width matches percentage
6. Verify colors match specification

**Expected Results**:
- ✅ Chart section visible
- ✅ All 4 bars display
- ✅ Counts match KPI cards
- ✅ Bar widths proportional to percentages
- ✅ Colors correct (gray/blue/red/green)

**Test Data**:
- 8 bays: 2 idle, 3 working, 2 delayed, 1 completed

---

## TEST DATA SETUP

### Seed Data Required

**Service Bays** (8 bays):
```json
[
  { "name": "Bay 1", "status": "ACTIVE", "location": "Workshop A" },
  { "name": "Bay 2", "status": "ACTIVE", "location": "Workshop A" },
  { "name": "Bay 3", "status": "ACTIVE", "location": "Workshop A" },
  { "name": "Bay 4", "status": "ACTIVE", "location": "Workshop A" },
  { "name": "Bay 5", "status": "ACTIVE", "location": "Workshop B" },
  { "name": "Bay 6", "status": "ACTIVE", "location": "Workshop B" },
  { "name": "Bay 7", "status": "ACTIVE", "location": "Workshop B" },
  { "name": "Bay 8", "status": "ACTIVE", "location": "Workshop B" }
]
```

**Bay Assignments** (6 active):
- Bay 1: Working, 65% progress, no delay
- Bay 2: Delayed, 75% progress, 45 min delay
- Bay 3: Idle (no assignment)
- Bay 4: Working, 40% progress, no delay
- Bay 5: Completed, 100% progress
- Bay 6: Idle (no assignment)
- Bay 7: Working, 25% progress, no delay
- Bay 8: Delayed, 90% progress, 120 min delay

**Repair Orders** (at least 2 pending):
- WO-2026-0130: PENDING
- WO-2026-0131: PENDING

---

## ACCEPTANCE CRITERIA

**All scenarios must PASS** for UAT-SVC-006 to be considered successful.

**Performance**:
- Dashboard load time < 2 seconds
- Real-time updates within 30 seconds

**Data Accuracy**:
- KPI calculations 100% accurate
- Delay calculations 100% accurate
- Status updates reflected immediately

**UI/UX**:
- All colors match specification
- Animations work smoothly
- Responsive on all devices

---

## CHANGE LOG

| Date | Version | CR-ID | Changes | Author |
|------|---------|-------|---------|--------|
| 2026-01-29 | v1.3 | CR-003 | Added UAT-SVC-006 (6 scenarios for Bay Utilization) | Antigravity |

---

**Document Owner**: QA Lead  
**Last Updated**: 2026-01-29  
**Status**: ✅ APPROVED

---

**End of UAT Plan Changes v1.3 (CR-003)**
