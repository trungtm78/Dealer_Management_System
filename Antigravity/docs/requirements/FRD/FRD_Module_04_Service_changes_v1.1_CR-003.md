# FRD Service Changes v1.1 (CR-003)

**Document**: Functional Requirements Document - Service Module  
**Version**: v1.0 → v1.1  
**Change Type**: MINOR (Adding new screen)  
**CR-ID**: CR-003  
**Date**: 2026-01-29

---

## CHANGE SUMMARY

**Added**: SCR-SVC-006 (Bay Utilization Management Screen)

**Reason**: Thêm màn hình mới để quản lý và theo dõi tình trạng sử dụng các bay sửa chữa.

---

## NEW SCREEN: SCR-SVC-006 - Bay Utilization Management

### Screen Information

**Screen ID**: SCR-SVC-006  
**Screen Name**: Tình Trạng Sử Dụng Bay Dịch Vụ  
**Route**: `/service/bays`  
**Access**: Service Advisor, Service Manager, Admin  
**Parent Menu**: Dịch Vụ → Quản Lý Bay

### Screen Layout

#### 1. Header Section
- Breadcrumb: Dịch Vụ / Quản Lý Bay
- Title: "Tình Trạng Sử Dụng Bay Dịch Vụ"
- Timestamp: "Cập nhật lúc HH:MM"

#### 2. KPI Dashboard (5 cards)

| KPI | Calculation | Display |
|-----|-------------|---------|
| Tổng Bay | Count all bays | Number |
| Rảnh | Count bays with status='idle' | Number (gray) |
| Đang làm | Count bays with status='working' | Number (blue) |
| Trễ hạn | Count bays with status='delayed' | Number (red) |
| Tỷ lệ sử dụng | (Total - Idle) / Total * 100 | Percentage (green) |

#### 3. Alert Section (conditional)
- Show only if delayed bays > 0
- Message: "Cảnh báo: {count} bay đang bị trễ hạn"
- Submessage: "Vui lòng kiểm tra và điều chỉnh tiến độ công việc"
- Style: Red background, alert icon

#### 4. Bay Grid (4 columns)

**Each Bay Card shows**:
- Bay name (e.g., "Bay 1")
- Status badge (Rảnh/Đang làm việc/Trễ hạn/Hoàn thành)
- Work Order ID (if working)
- Vehicle name (if working)
- Technician name (if working)
- Start time (if working)
- Estimated end time (if working)
- Progress bar with percentage (if working)
- Delay warning (if delayed)
- Action button: "Phân công công việc" (if idle) or "Xem chi tiết" (if working)

#### 5. Utilization Chart
- Horizontal bar chart
- 4 bars: Rảnh, Đang làm việc, Trễ hạn, Hoàn thành
- Each bar shows: count / total

---

### Functional Requirements

#### FR-SVC-006.1: View Bay Status Dashboard

**Description**: User có thể xem tổng quan tình trạng tất cả các bay.

**Preconditions**:
- User đã đăng nhập
- User có quyền Service Advisor/Manager/Admin

**Flow**:
1. User navigate to `/service/bays`
2. System loads bay data from API
3. System calculates KPIs
4. System displays dashboard

**Postconditions**:
- Dashboard hiển thị đầy đủ KPIs
- Bay grid hiển thị tất cả bays
- Chart hiển thị utilization

**Business Rules**:
- BR-SVC-007.1: Real-time bay status tracking
- BR-SVC-007.2: Delay alert system
- BR-SVC-007.3: Utilization rate calculation

---

#### FR-SVC-006.2: Assign Work Order to Idle Bay

**Description**: User có thể phân công Work Order cho bay rảnh.

**Preconditions**:
- Bay status = 'idle'
- Work Order exists and status = 'PENDING'

**Flow**:
1. User clicks "Phân công công việc" on idle bay card
2. System shows dialog with Work Order selection
3. User selects Work Order
4. User enters estimated end time
5. User clicks "Xác nhận"
6. System creates bay assignment
7. System updates bay status to 'working'
8. System refreshes dashboard

**Postconditions**:
- Bay assignment created in database
- Bay status changed to 'working'
- Work Order status changed to 'IN_PROGRESS'
- Dashboard updated

**Business Rules**:
- BR-SVC-007.4: Work assignment to idle bay
- One bay can only have one active assignment
- One Work Order can only be assigned to one bay

---

#### FR-SVC-006.3: Update Work Progress

**Description**: User có thể cập nhật tiến độ công việc.

**Preconditions**:
- Bay has active assignment
- User is Service Advisor or assigned Technician

**Flow**:
1. User clicks "Xem chi tiết" on working bay card
2. System shows progress update dialog
3. User updates progress percentage (0-100%)
4. User adds notes (optional)
5. User clicks "Cập nhật"
6. System updates assignment progress
7. System checks for delay
8. System refreshes dashboard

**Postconditions**:
- Assignment progress updated
- Delay status updated if needed
- Dashboard refreshed

**Business Rules**:
- Progress can only increase (not decrease)
- If current time > estimated end and progress < 100%, status = 'delayed'
- Delay minutes = current time - estimated end time

---

#### FR-SVC-006.4: Complete Work and Free Bay

**Description**: User có thể hoàn thành công việc và giải phóng bay.

**Preconditions**:
- Bay has active assignment
- Progress = 100% (recommended)

**Flow**:
1. User clicks "Hoàn thành" in bay detail dialog
2. System confirms completion
3. System updates assignment status to 'COMPLETED'
4. System records actual end time
5. System updates bay status to 'idle'
6. System updates Work Order status to 'READY'
7. System refreshes dashboard

**Postconditions**:
- Assignment completed
- Bay freed (status = 'idle')
- Work Order ready for delivery
- Dashboard updated

**Business Rules**:
- Actual end time recorded
- Bay immediately available for new assignment
- Work Order moves to QC/Delivery stage

---

#### FR-SVC-006.5: View Bay Utilization Chart

**Description**: User có thể xem biểu đồ sử dụng bay.

**Preconditions**:
- User on bay utilization screen

**Flow**:
1. System calculates bay counts by status
2. System renders horizontal bar chart
3. Each bar shows: count / total

**Postconditions**:
- Chart displays utilization breakdown

**Business Rules**:
- BR-SVC-007.3: Utilization rate calculation
- Chart updates real-time with dashboard

---

### Data Requirements

**Input Data**:
- Service bays (from `service_bays` table)
- Bay assignments (from `bay_assignments` table)
- Repair orders (from `repair_orders` table)
- Users (from `users` table)

**Output Data**:
- Bay status dashboard
- KPI metrics
- Utilization chart

---

### UI/UX Requirements

**Colors**:
- Idle: Gray (#6B7280)
- Working: Blue (#3B82F6)
- Delayed: Red (#EF4444)
- Completed: Green (#10B981)

**Animations**:
- Delayed bay cards: pulse animation
- Progress bar: smooth transition

**Responsive**:
- Desktop: 4 columns grid
- Tablet: 2 columns grid
- Mobile: 1 column grid

---

## CHANGE LOG

| Date | Version | CR-ID | Changes | Author |
|------|---------|-------|---------|--------|
| 2026-01-29 | v1.1 | CR-003 | Added SCR-SVC-006 (Bay Utilization Management) | Antigravity |

---

**Document Owner**: Business Analyst  
**Last Updated**: 2026-01-29  
**Status**: ✅ APPROVED

---

**End of FRD Service Changes v1.1 (CR-003)**
