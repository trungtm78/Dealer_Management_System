# CR-003 Classification & Impact Analysis

**CR-ID**: CR-003  
**Title**: Add Bay Utilization Management Screen  
**Date**: 2026-01-29  
**Requested By**: Business (Service Department - Auto Maintenance)  
**Processed By**: Antigravity - Change Request Authority

---

## BƯỚC 1: PHÂN LOẠI CHANGE REQUEST

### CR Details

**Description**:
Thêm màn hình "Tình Trạng Sử Dụng Bay Dịch Vụ" để quản lý và theo dõi tình trạng sử dụng các bay sửa chữa trong xưởng dịch vụ. Màn hình này phục vụ cho chuyên ngành bảo trì xe hơi, giúp:
- Theo dõi real-time tình trạng từng bay (Rảnh/Đang làm/Trễ hạn/Hoàn thành)
- Quản lý Work Order đang thực hiện tại mỗi bay
- Theo dõi tiến độ công việc và cảnh báo trễ hạn
- Tối ưu hóa việc phân công công việc cho các bay

**Source**:
- Business request mới
- UI Reference có sẵn: `C:\Honda\Antigravity\Refs\src\app\components\BayUtilization.tsx`

**Business Context**:
Trong ngành bảo trì xe hơi, "Bay" (Service Bay) là khu vực làm việc cố định nơi kỹ thuật viên thực hiện sửa chữa/bảo dưỡng xe. Việc quản lý hiệu quả các bay giúp:
- Tăng năng suất xưởng dịch vụ
- Giảm thời gian chờ của khách hàng
- Tối ưu hóa phân công nhân lực
- Phát hiện sớm các công việc bị trễ hạn

### CR Type Classification

| Type | Applicable | Details |
|------|------------|---------|
| **Business logic change** | ✅ Yes | Thêm logic quản lý bay, tracking status, delay detection |
| **Functional flow change** | ✅ Yes | Thêm workflow mới: assign work to bay, update progress, complete work |
| **Data model change** | ✅ Yes | Cần thêm tables: ServiceBay, BayAssignment, BayStatusLog |
| **API contract change** | ✅ Yes | Thêm APIs mới cho bay management |
| **UI/UX change** | ✅ Yes | Thêm màn hình mới với dashboard, KPI cards, bay grid |
| **Non-functional** | ❌ No | Không có thay đổi về performance/maintainability |

**Primary Type**: NEW FEATURE (Full stack - DB + API + UI + Business Logic)

### Impact Level

**Level**: 🔴 **HIGH**

**Justification**:
- Thêm chức năng hoàn toàn mới (không phải sửa existing)
- Ảnh hưởng nhiều documents (BRD, FRD, ERD, API Spec, UI Spec, UAT)
- Cần thêm database tables mới
- Cần thêm APIs mới
- Cần thêm UI screen mới
- Liên quan đến Service module (core business)

---

## BƯỚC 2: PHÂN TÍCH IMPACT

### Impact Analysis Table

| Document | Affected | Reason |
|----------|----------|--------|
| **BRD** | ✅ Yes | Cần thêm BR mới cho Bay Management (BR-SVC-007) |
| **FRD Service** | ✅ Yes | Cần thêm screen mới SCR-SVC-006 (Bay Utilization Management) |
| **FRD Admin** | ❌ No | Không liên quan Admin module |
| **ERD** | ✅ Yes | Cần thêm 3 tables: ServiceBay, BayAssignment, BayStatusLog |
| **API Spec Service** | ✅ Yes | Cần thêm 8-10 APIs mới cho bay management |
| **API Spec Admin** | ❌ No | Không liên quan Admin APIs |
| **UI Spec** | ✅ Yes | Cần thêm BayUtilization screen + components |
| **UAT Plan** | ✅ Yes | Cần thêm UAT scenarios cho bay management |

**Total**: 6/8 documents impacted

---

### Detailed Impact

#### 1. BRD v1.0 → v1.1 (MINOR)

**Section to Add**: BR-SVC-007 (Bay Utilization Management)

**New Business Requirements**:
- BR-SVC-007.1: Hệ thống phải theo dõi real-time tình trạng từng bay
- BR-SVC-007.2: Hệ thống phải cảnh báo khi công việc bị trễ hạn
- BR-SVC-007.3: Hệ thống phải tính toán tỷ lệ sử dụng bay
- BR-SVC-007.4: Hệ thống phải cho phép phân công công việc cho bay rảnh

**Version Change**: v1.0 → v1.1 (MINOR - adding new BR section)

---

#### 2. FRD Service v1.0 → v1.1 (MINOR)

**Screen to Add**: SCR-SVC-006 (Bay Utilization Management)

**Screen Components**:
1. **KPI Dashboard**:
   - Tổng số bay
   - Số bay rảnh
   - Số bay đang làm việc
   - Số bay trễ hạn
   - Tỷ lệ sử dụng (%)

2. **Alert Section**:
   - Cảnh báo khi có bay trễ hạn
   - Link đến bay bị trễ

3. **Bay Grid** (4 columns):
   - Bay card với status badge
   - Work Order info
   - Vehicle info
   - Technician info
   - Time tracking (Start/Estimated End)
   - Progress bar
   - Delay warning

4. **Utilization Chart**:
   - Biểu đồ thanh ngang cho từng status

**Functional Requirements**:
- FR-SVC-006.1: View bay status dashboard
- FR-SVC-006.2: Assign work order to idle bay
- FR-SVC-006.3: Update work progress
- FR-SVC-006.4: Complete work and free bay
- FR-SVC-006.5: View bay utilization chart

**Version Change**: v1.0 → v1.1 (MINOR - adding new screen)

---

#### 3. ERD v1.1 → v1.2 (MINOR)

**Tables to Add**: 3 new tables

##### Table 1: `service_bays`
```sql
CREATE TABLE service_bays (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,              -- "Bay 1", "Bay 2", etc.
  location TEXT,                   -- "Workshop A", "Zone 1", etc.
  capacity TEXT,                   -- "Standard", "Large Vehicle", etc.
  equipment TEXT,                  -- JSON: ["Lift", "Diagnostic Tool", etc.]
  status TEXT DEFAULT 'ACTIVE',   -- ACTIVE, INACTIVE, MAINTENANCE
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

##### Table 2: `bay_assignments`
```sql
CREATE TABLE bay_assignments (
  id TEXT PRIMARY KEY,
  bay_id TEXT NOT NULL,
  repair_order_id TEXT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  estimated_end TIMESTAMP,
  actual_end TIMESTAMP,
  status TEXT DEFAULT 'ASSIGNED',  -- ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED
  progress_percent INTEGER DEFAULT 0,
  delay_minutes INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (bay_id) REFERENCES service_bays(id),
  FOREIGN KEY (repair_order_id) REFERENCES repair_orders(id)
);
```

##### Table 3: `bay_status_logs`
```sql
CREATE TABLE bay_status_logs (
  id TEXT PRIMARY KEY,
  bay_id TEXT NOT NULL,
  assignment_id TEXT,
  status TEXT NOT NULL,            -- IDLE, WORKING, DELAYED, COMPLETED
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  changed_by TEXT,
  notes TEXT,
  
  FOREIGN KEY (bay_id) REFERENCES service_bays(id),
  FOREIGN KEY (assignment_id) REFERENCES bay_assignments(id),
  FOREIGN KEY (changed_by) REFERENCES users(id)
);
```

**Version Change**: v1.1 → v1.2 (MINOR - adding 3 tables)

---

#### 4. API Spec Service v1.0 → v1.1 (MINOR)

**APIs to Add**: 10 new endpoints

##### Bay Management APIs

1. **GET /api/service/bays** - List all bays
2. **GET /api/service/bays/{id}** - Get bay details
3. **POST /api/service/bays** - Create new bay
4. **PUT /api/service/bays/{id}** - Update bay info
5. **DELETE /api/service/bays/{id}** - Delete bay

##### Bay Assignment APIs

6. **GET /api/service/bays/utilization** - Get bay utilization dashboard
7. **POST /api/service/bays/{id}/assign** - Assign work order to bay
8. **PUT /api/service/bays/{id}/progress** - Update work progress
9. **POST /api/service/bays/{id}/complete** - Complete work and free bay
10. **GET /api/service/bays/{id}/history** - Get bay status history

**Version Change**: v1.0 → v1.1 (MINOR - adding 10 APIs)

---

#### 5. UI Spec v1.1 → v1.2 (MINOR)

**Screen to Add**: BayUtilization

**Components to Add**:
1. **BayUtilizationDashboard** - Main screen
2. **BayKPICards** - KPI metrics display
3. **BayCard** - Individual bay status card
4. **BayAssignmentDialog** - Assign work to bay
5. **BayProgressDialog** - Update progress
6. **BayUtilizationChart** - Utilization chart

**Version Change**: v1.1 → v1.2 (MINOR - adding new screen + 6 components)

---

#### 6. UAT Plan v1.2 → v1.3 (MINOR)

**Test Suites to Add**: UAT-SVC-006 (Bay Utilization)

**Scenarios**:
- UAT-SVC-006-001: View bay utilization dashboard
- UAT-SVC-006-002: Assign work order to idle bay
- UAT-SVC-006-003: Update work progress
- UAT-SVC-006-004: Complete work and free bay
- UAT-SVC-006-005: View delayed bay alert
- UAT-SVC-006-006: View bay utilization chart

**Version Change**: v1.2 → v1.3 (MINOR - adding 6 scenarios)

---

### Impact Summary

**Documents to Update**: 6 (BRD, FRD Service, ERD, API Spec Service, UI Spec, UAT Plan)  
**Version Changes**: All MINOR  
**Breaking Changes**: None  
**Backward Compatibility**: Yes (new feature, không ảnh hưởng existing)

**New Entities**:
- 3 database tables
- 10 API endpoints
- 1 screen + 6 components
- 6 UAT scenarios

---

## BƯỚC 3: CẬP NHẬT TÀI LIỆU

### Document Update Plan

**Approach**: Create change summary documents

| Document | Current Version | New Version | Change Type | File |
|----------|----------------|-------------|-------------|------|
| BRD | v1.0 | v1.1 | MINOR | `BRD_changes_v1.1_CR-003.md` |
| FRD Service | v1.0 | v1.1 | MINOR | `FRD_Module_04_Service_changes_v1.1_CR-003.md` |
| ERD | v1.1 | v1.2 | MINOR | `erd_changes_v1.2_CR-003.md` |
| API Spec Service | v1.0 | v1.1 | MINOR | `api_spec_04_service_changes_v1.1_CR-003.md` |
| UI Spec | v1.1 | v1.2 | MINOR | `ui_spec_changes_v1.2_CR-003.md` |
| UAT Plan | v1.2 | v1.3 | MINOR | `uat_plan_changes_v1.3_CR-003.md` |

---

## BƯỚC 4: CHANGE REQUEST LOG

**Entry to Add**: CR-003

---

## BƯỚC 5: CHANGE EXECUTION INSTRUCTION

**File**: `change_execution_v1.2.md`

---

**Classification Complete**: ✅  
**Ready for**: Document updates (Step 3)

---

**End of CR-003 Classification & Impact Analysis**
