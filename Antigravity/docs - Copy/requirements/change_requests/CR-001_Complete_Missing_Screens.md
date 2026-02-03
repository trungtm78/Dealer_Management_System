# Change Request CR-001: Complete Missing Screens Implementation

**CR-ID**: CR-001  
**Date**: 2026-01-29  
**Submitted By**: Antigravity - Change Request Authority  
**Source**: Implementation Gap Analysis (screen_implementation_status.md)  
**Priority**: CRITICAL  
**Status**: Draft

---

## 1. CHANGE REQUEST DESCRIPTION

### 1.1 Background

Sau khi phân tích implementation status của Honda DMS, phát hiện **7 màn hình** (12% tổng số) chưa được hiện thực đầy đủ:

- **5 màn hình** có database schema nhưng thiếu API/UI hoàn chỉnh
- **2 màn hình** chưa có gì (thiếu BRD, database, API, UI)

### 1.2 Business Impact

| Module | Màn Hình Thiếu | Business Impact |
|--------|----------------|-----------------|
| **Insurance** | 2 màn | ❌ Không thể quản lý hợp đồng BH và claims → Mất revenue stream |
| **Admin** | 5 màn | ❌ Không có user management, permissions, audit → Security risk CRITICAL |

**Rủi ro nếu không xử lý**:
- 🔴 **Security**: Không có permission system → Ai cũng truy cập được mọi data
- 🔴 **Compliance**: Không có audit logs → Không đáp ứng yêu cầu pháp lý
- 🟡 **Revenue**: Không quản lý insurance → Mất 15-20% revenue từ insurance commission

### 1.3 Requested Changes

Hoàn thiện 7 màn hình sau:

#### Insurance Module (2 màn)
1. **INS-001**: Quản Lý Hợp Đồng Bảo Hiểm
   - Hiện trạng: Có database + actions, UI chưa đủ
   - Cần: Hoàn thiện UI components

2. **INS-002**: Quản Lý Bồi Thường
   - Hiện trạng: Có database, thiếu API + UI
   - Cần: Tạo API endpoints + Actions + UI components

#### Admin Module (5 màn)
3. **ADM-001**: Quản Lý Người Dùng
   - Hiện trạng: Có database + POST API, thiếu GET/PUT/DELETE + UI
   - Cần: Bổ sung API endpoints + Actions + UI components

4. **ADM-002**: Phân Quyền
   - Hiện trạng: Chưa có gì
   - Cần: Tạo database schema + API + Actions + UI

5. **ADM-003**: Audit Logs
   - Hiện trạng: Có database, thiếu API + UI
   - Cần: Tạo API endpoints + Actions + UI

6. **ADM-004**: System Settings
   - Hiện trạng: Chưa có gì
   - Cần: Viết BRD + Tạo database + API + UI

7. **ADM-005**: System Monitoring
   - Hiện trạng: Có database (SystemMetric), thiếu API + UI
   - Cần: Tạo API endpoints + UI

---

## 2. CHANGE REQUEST CLASSIFICATION

### 2.1 CR Type (Multiple)

| Type | Applicable | Reason |
|------|------------|--------|
| ✅ **Business Logic Change** | Yes | Thêm business rules cho permissions, audit, insurance claims |
| ✅ **Functional Flow Change** | Yes | Thêm workflows mới (claim approval, permission assignment) |
| ✅ **Data Model Change** | Yes | Thêm tables mới (roles, permissions, role_permissions) |
| ✅ **API Contract Change** | Yes | Thêm 30+ API endpoints mới |
| ✅ **UI/UX Change** | Yes | Thêm 7 màn hình UI mới |
| ❌ **Non-functional** | No | Không thay đổi performance/maintainability |

### 2.2 Impact Level

**Overall Impact**: 🔴 **HIGH**

| Aspect | Impact | Justification |
|--------|--------|---------------|
| **Scope** | HIGH | 7 màn hình, 2 modules, 30+ APIs |
| **Complexity** | HIGH | Permissions system phức tạp, security-critical |
| **Risk** | HIGH | Security và compliance requirements |
| **Effort** | HIGH | ~278 hours = 7 weeks |
| **Dependencies** | MEDIUM | Admin module phụ thuộc lẫn nhau |

---

## 3. IMPACT ANALYSIS

### 3.1 BRD Impact

| Document | Impacted | Reason | Changes Required |
|----------|----------|--------|------------------|
| **BRD v2.0** | ✅ **YES** | Thiếu business requirements chi tiết cho ADM-002, ADM-004, ADM-005 | Bổ sung 3 sections mới:<br>- BR-ADMIN-002: Permission Management<br>- BR-ADMIN-003: System Settings<br>- BR-ADMIN-004: System Monitoring |

**Specific Changes**:
- **Section 5.7 (System Administration)**: Hiện tại chỉ có BR-ADMIN-001 (User Management)
- **Cần thêm**:
  - BR-ADMIN-002: Permission Matrix, Role Management, Permission Assignment
  - BR-ADMIN-003: System Settings (Email, SMS, Notification configs)
  - BR-ADMIN-004: System Monitoring (Metrics, Alerts, Health checks)

**Version Change**: v2.0 → **v2.1**

---

### 3.2 FRD Impact

| Document | Impacted | Reason | Changes Required |
|----------|----------|--------|------------------|
| **FRD Module 06 (Insurance)** | ✅ **YES** | UI specs chưa đầy đủ cho INS-001, INS-002 | Bổ sung UI components, workflows, validation rules |
| **FRD Module 08 (Admin)** | ✅ **YES** | Thiếu functional specs chi tiết cho 5 màn hình | Bổ sung screens, workflows, business rules |

**Specific Changes**:

#### FRD_Module_06_Insurance.md
- **SCR-INS-001**: Bổ sung UI components (InsuranceContractList, Form, Detail)
- **SCR-INS-002**: Bổ sung full functional spec (workflow, validation, document upload)

#### FRD_Module_08_Admin.md
- **SCR-ADM-001**: Bổ sung UI components (UserManagement, UserForm, UserTable)
- **SCR-ADM-002**: Tạo mới full functional spec (PermissionMatrix, RoleEditor)
- **SCR-ADM-003**: Tạo mới full functional spec (AuditLogViewer)
- **SCR-ADM-004**: Tạo mới full functional spec (SystemSettings)
- **SCR-ADM-005**: Tạo mới full functional spec (SystemMonitoring)

**Version Changes**:
- FRD_Module_06_Insurance.md: v1.0 → **v1.1**
- FRD_Module_08_Admin.md: v1.0 → **v2.0** (major change)

---

### 3.3 ERD Impact

| Document | Impacted | Reason | Changes Required |
|----------|----------|--------|------------------|
| **ERD v1.0** | ✅ **YES** | Thiếu tables cho permissions system | Thêm 3 tables mới + modify 1 table |

**Specific Changes**: Thêm 3 tables (roles, permissions, role_permissions) và 4 fields cho users table

**Version Change**: v1.0 → **v1.1**

---

### 3.4 API Spec Impact

| Document | Impacted | Reason | Changes Required |
|----------|----------|--------|------------------|
| **API Spec 06 (Insurance)** | ✅ **YES** | Thiếu API specs cho claims | Thêm 5 APIs cho insurance claims |
| **API Spec 08 (Admin)** | ✅ **YES** | Thiếu API specs cho 4 màn hình | Thêm 22 APIs cho admin module |

**Total APIs**: 175 → **202** (+27)

**Version Changes**:
- api_spec_06_insurance.md: v1.0 → **v1.1**
- api_spec_08_admin.md: v1.0 → **v2.0** (major change)

---

### 3.5 UI Spec Impact

| Document | Impacted | Reason | Changes Required |
|----------|----------|--------|------------------|
| **UI Spec v1.0** | ✅ **YES** | Thiếu UI component specs cho 7 màn hình | Bổ sung 20 components mới |

**Version Change**: v1.0 → **v1.1**

---

### 3.6 Test / UAT Impact

| Document | Impacted | Reason | Changes Required |
|----------|----------|--------|------------------|
| **UAT Plan v1.0** | ✅ **YES** | Thiếu test cases cho 7 màn hình | Thêm 7 UAT test suites mới |

**Version Change**: uat_plan_v1.0.md → **uat_plan_v1.1.md**

---

## 4. SUMMARY TABLE

| Tài Liệu | Version Hiện Tại | Version Mới | Mức Độ Thay Đổi |
|----------|------------------|-------------|------------------|
| **BRD** | v2.0 | **v2.1** | MINOR |
| **FRD - Insurance** | v1.0 | **v1.1** | MINOR |
| **FRD - Admin** | v1.0 | **v2.0** | MAJOR |
| **ERD** | v1.0 | **v1.1** | MINOR |
| **API Spec - Insurance** | v1.0 | **v1.1** | MINOR |
| **API Spec - Admin** | v1.0 | **v2.0** | MAJOR |
| **UI Spec** | v1.0 | **v1.1** | MINOR |
| **UAT Plan** | v1.0 | **v1.1** | MINOR |

**Total Documents Impacted**: 8/8 (100%)

---

## 5. TIMELINE

| Week | Deliverables | Effort |
|------|--------------|--------|
| **Week 1** | INS-001 UI completion | 24h |
| **Week 2** | INS-002 API + UI | 40h |
| **Week 3** | ADM-001 API + UI | 48h |
| **Week 4** | ADM-002 Full implementation | 60h |
| **Week 5** | ADM-003 API + UI | 32h |
| **Week 6** | ADM-004 Full implementation | 42h |
| **Week 7** | ADM-005 Full implementation | 32h |

**Total Duration**: 7 weeks = **278 hours**

---

**End of Change Request CR-001**
