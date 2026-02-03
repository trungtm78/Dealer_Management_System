# Functional Requirements Documentation (FRD)
## Honda Dealer Management System

---

## 📋 Overview

Thư mục này chứa tài liệu Functional Requirements (FRD) chi tiết cho toàn bộ hệ thống Honda DMS.

**Phiên bản**: 1.0  
**Ngày tạo**: 28/01/2026  
**Tổng số screens**: 53  
**Screens đã implement**: 45 (85%)

---

## 📁 Danh Sách Tài Liệu FRD

### ✅ Module 1: Dashboard (1 screen)
**File**: [`FRD_Module_01_Dashboard.md`](./FRD_Module_01_Dashboard.md)

**Screens**:
- SCR-DASH-001: Dashboard Điều Hành

**Status**: ✅ **100% Complete** - No GAPs

---

### ✅ Module 2: CRM (10 screens)
**File**: [`FRD_Module_02_CRM.md`](./FRD_Module_02_CRM.md)

**Screens**:
- SCR-CRM-001: Quản Lý Leads (Kanban Board)
- SCR-CRM-002: Khách Hàng
- SCR-CRM-003: Chấm Điểm Lead
- SCR-CRM-004: Hiệu Quả Nguồn Lead
- SCR-CRM-005: Lịch Sử & Hoạt Động
- SCR-CRM-006: Nhắc Bảo Dưỡng
- SCR-CRM-007: Chương Trình Loyalty
- SCR-CRM-008: Chăm Sóc Sau Bán
- SCR-CRM-009: Quản Lý Khiếu Nại
- SCR-CRM-010: Chiến Dịch Marketing

**Status**: ✅ **100% Complete** - No GAPs

---

### ✅ Module 3: Bán Hàng (8 screens)
**File**: [`FRD_Module_03_Sales.md`](./FRD_Module_03_Sales.md)

**Screens**:
- SCR-SAL-001: Tạo Báo Giá (Multi-step form)
- SCR-SAL-002: Danh Sách Báo Giá
- SCR-SAL-003: Lịch Lái Thử (Calendar)
- SCR-SAL-004: Chi Tiết Lái Thử
- SCR-SAL-005: Phân Bổ VIN
- SCR-SAL-006: Tồn Kho VIN
- SCR-SAL-007: Quản Lý Đặt Cọc
- SCR-SAL-008: Giao Hàng PDS

**Status**: ✅ **100% Complete** - No GAPs

---

### ✅ Module 4: Dịch Vụ (8 screens)
**File**: [`FRD_Module_04_Service.md`](./FRD_Module_04_Service.md)

**Screens**:
- SCR-SVC-001: Báo Giá Dịch Vụ
- SCR-SVC-002: Danh Sách Báo Giá DV
- SCR-SVC-003: Đặt Lịch Hẹn
- SCR-SVC-004: Tiếp Nhận
- SCR-SVC-005: Lệnh Sửa Chữa (RO)
- SCR-SVC-006: Giao Diện KTV
- SCR-SVC-007: Kiểm Tra Chất Lượng
- SCR-SVC-008: Thanh Toán

**Status**: ✅ **100% Complete** - No GAPs

---

### ✅ Module 5: Phụ Tùng (10 screens)
**File**: [`FRD_Module_05_Parts.md`](./FRD_Module_05_Parts.md)

**Screens**:
- SCR-PRT-001: Tổng Quan Tồn Kho
- SCR-PRT-002: Hàng Backorder
- SCR-PRT-003: Nhập Xuất Kho
- SCR-PRT-004: Yêu Cầu Mua Hàng
- SCR-PRT-005: Phân Tích Tuổi Tồn
- SCR-PRT-006: Kiểm Kê Kho
- SCR-PRT-007: Picking & Packing
- SCR-PRT-008: KPIs Phụ Tùng
- SCR-PRT-009: Định Giá PT
- SCR-PRT-010: Trả Hàng NCC

**Status**: ✅ **100% Complete** - No GAPs

---

### ⚠️ Module 6: Bảo Hiểm (5 screens)
**File**: [`FRD_Module_06_Insurance.md`](./FRD_Module_06_Insurance.md)

**Screens**:
- SCR-INS-001: Tổng Quan BH
- SCR-INS-002: Danh Sách HĐ
- SCR-INS-003: Chi Tiết HĐ
- SCR-INS-004: DS Bồi Thường
- SCR-INS-005: CT Bồi Thường

**Status**: ⚠️ **0% Complete** - All screens missing (GAP-INS-001)

---

### ✅ Module 7: Kế Toán (11 screens)
**File**: [`FRD_Module_07_Accounting.md`](./FRD_Module_07_Accounting.md)

**Screens**:
- SCR-ACC-001: Dashboard Tài Chính
- SCR-ACC-002: Báo Cáo Lãi Lỗ
- SCR-ACC-003: Bảng Cân Đối
- SCR-ACC-004: Dòng Tiền
- SCR-ACC-005: Công Nợ Phải Thu
- SCR-ACC-006: Công Nợ Phải Trả
- SCR-ACC-007: Báo Cáo Thuế
- SCR-ACC-008: Báo Cáo Quản Lý
- SCR-ACC-009: Tài Sản Cố Định
- SCR-ACC-010: Khấu Hao
- SCR-ACC-011: Phân Tích Chi Phí

**Status**: ✅ **100% Complete** - No GAPs

---

### ⚠️ Module 8: Quản Trị (3 screens)
**File**: [`FRD_Module_08_Admin.md`](./FRD_Module_08_Admin.md)

**Screens**:
- SCR-ADM-001: Quản Lý User
- SCR-ADM-002: Giám Sát HT
- SCR-ADM-003: Cấu Hình API

**Status**: ⚠️ **0% Complete** - All screens missing (GAP-ADM-001)

---

## 📊 Implementation Status

| Module | Total Screens | Implemented | Missing | Coverage |
|--------|---------------|-------------|---------|----------|
| 1. Dashboard | 1 | 1 | 0 | 100% |
| 2. CRM | 10 | 10 | 0 | 100% |
| 3. Sales | 8 | 8 | 0 | 100% |
| 4. Service | 8 | 8 | 0 | 100% |
| 5. Parts | 10 | 10 | 0 | 100% |
| 6. Insurance | 5 | 0 | 5 | 0% |
| 7. Accounting | 11 | 11 | 0 | 100% |
| 8. Admin | 3 | 0 | 3 | 0% |
| **TOTAL** | **56** | **48** | **8** | **86%** |

---

## ⚠️ GAPs Summary

### GAP-INS-001: Insurance Module (5 screens)
**Severity**: Medium  
**Screens Missing**:
- Insurance Dashboard
- Contract List & Detail
- Claims List & Detail

**Recommendation**: Implement sau khi hoàn tất core modules

---

### GAP-ADM-001: Admin Module (3 screens)
**Severity**: High (Critical for production)  
**Screens Missing**:
- User Management
- System Monitoring
- API Configuration

**Recommendation**: Implement trong Phase 2 trước khi go-live

---

## 🎯 UI Components Inventory

### ✅ Reusable Components (Đã có sẵn)
- **Radix UI Primitives**: Card, Button, Input, Select, Dialog, Table, Badge, Tabs, Checkbox, etc.
- **Custom Components**: CustomerSearch, CurrencyInput
- **Charts**: Recharts (BarChart, LineChart, PieChart)
- **Patterns**: Kanban Board, Calendar View, Multi-step Forms

### ⚠️ Components Cần Tạo Mới
- Insurance contract form
- Claims workflow UI
- User management table
- System monitoring dashboard

---

## 📝 Business Rules Summary

**Total Business Rules**: 50+

**Key Rules by Module**:
- **Sales**: Auto-numbering, Price calculations, Quote expiry
- **Service**: VAT calculation, RO workflows, Time tracking
- **Parts**: FIFO, Min stock triggers, Aging analysis
- **CRM**: Lead scoring, Stage transitions, Activity logging
- **Accounting**: Financial reporting, AR/AP aging, Depreciation

---

## 🔗 Related Documents

- **BRD**: [`../BRD/BRD_Honda_DMS_v2.md`](../BRD/BRD_Honda_DMS_v2.md)
- **Screen Inventory**: [Artifact - SCREEN_INVENTORY.md](../../brain/SCREEN_INVENTORY.md)
- **Database Schema**: `../../database/schema.sql`

---

## 📌 Notes

1. **UI References**: Tất cả screens đều map với components hiện có, không có thiết kế UI mới
2. **GAPs**: Chỉ có 2 modules chưa implement (Insurance & Admin) - 8/56 screens (14%)
3. **Priority**: Core business modules (CRM, Sales, Service, Parts, Accounting) đã hoàn tất 100%
4. **Next Steps**: Implement Insurance & Admin modules theo priority

---

**End of FRD Index**
