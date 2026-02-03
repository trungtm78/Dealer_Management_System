# Business Requirement Document
## Honda Dealer Management System

---

## 📋 Document Control

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Dự Án** | Honda Dealer Management System (Honda DMS) |
| **Phiên Bản BRD** | 2.1 - Consolidated |
| **Ngày Tạo** | 28/01/2026 |
| **Cập Nhật** | 31/01/2026 (CR-20250131-002) |
| **Loại Tài Liệu** | Business Requirements Document |
| **Phạm Vi** | Toàn bộ hệ thống quản lý đại lý |

---

## 📖 Mục Lục

1. [Executive Summary](#1-executive-summary)
2. [Business Objectives](#2-business-objectives)
3. [Scope & Boundaries](#3-scope--boundaries)
4. [Actors & Stakeholders](#4-actors--stakeholders)
5. [Business Requirements](#5-business-requirements)
   - [5.1 Master Data Management](#51-master-data-management)
   - [5.2 CRM & Customer Management](#52-crm--customer-management)
   - [5.3 Sales Operations](#53-sales-operations)
   - [5.4 Service Operations](#54-service-operations)
   - [5.5 Parts & Inventory](#55-parts--inventory)
   - [5.6 Insurance Management](#56-insurance-management)
   - [5.7 Financial Management](#57-financial-management)
   - [5.8 System Administration](#58-system-administration)
6. [Business Rules & Constraints](#6-business-rules--constraints)
7. [Success Criteria](#7-success-criteria)

---

## 1. Executive Summary

### 1.1 Bối Cảnh Dự Án

Honda Oto Cộng Hòa cần một hệ thống quản lý toàn diện để tối ưu hóa quy trình kinh doanh từ tiếp thị, bán hàng, dịch vụ sau bán đến quản lý tài chính. Hệ thống hiện tại phân mảnh, thiếu tích hợp, dẫn đến:

- ❌ Mất thông tin khách hàng tiềm năng
- ❌ Quy trình bán hàng chậm, thủ công
- ❌ Khó theo dõi lịch sử dịch vụ khách hàng
- ❌ Quản lý tồn kho phụ tùng không hiệu quả
- ❌ Báo cáo tài chính chậm, thiếu chính xác

### 1.2 Giải Pháp

Xây dựng Honda DMS - một nền tảng quản lý tích hợp, số hóa toàn bộ quy trình nghiệp vụ, cung cấp khả năng:

✅ **Quản lý khách hàng 360°** - Từ lead đến khách hàng trung thành  
✅ **Tự động hóa quy trình bán hàng** - Báo giá, đặt cọc, giao xe  
✅ **Tối ưu dịch vụ sau bán** - Lịch hẹn, sửa chữa, bảo dưỡng  
✅ **Kiểm soát tồn kho** - Phụ tùng, VIN, backorder  
✅ **Minh bạch tài chính** - Báo cáo real-time, phân tích lợi nhuận  

### 1.3 Lợi Ích Kinh Doanh

| Lĩnh Vực | Lợi Ích Mong Đợi |
|----------|------------------|
| **Doanh Thu** | Tăng 15-20% conversion rate từ lead |
| **Hiệu Quả** | Giảm 30% thời gian xử lý báo giá |
| **Khách Hàng** | Tăng 25% customer retention |
| **Vận Hành** | Giảm 40% thời gian quản lý tồn kho |
| **Tài Chính** | Báo cáo real-time thay vì end-of-month |

> **Lưu ý UI/UX**: Toàn bộ giao diện người dùng sẽ được triển khai dựa trên UI References hiện có của dự án. BRD này tập trung vào business logic và flows.

---

## 2. Business Objectives

### 2.1 Mục Tiêu Chính

#### OBJ-001: Tăng Hiệu Quả Chuyển Đổi Lead
**Mục tiêu**: Tăng tỷ lệ chuyển đổi từ lead sang khách hàng từ 15% lên 25%

**Cách đo lường**:
- Lead conversion rate hàng tháng
- Thời gian trung bình từ lead → customer
- Số lead lost và lý do

**Yêu cầu hệ thống**:
- Lead scoring tự động
- Workflow quản lý lead theo stage
- Reminder tự động cho follow-up
- Báo cáo hiệu quả nguồn lead

---

#### OBJ-002: Cải Thiện Trải Nghiệm Khách Hàng
**Mục tiêu**: Đạt CSAT score ≥ 4.5/5.0

**Cách đo lường**:
- Customer satisfaction surveys
- Net Promoter Score (NPS)
- Repeat purchase rate
- Service appointment no-show rate

**Yêu cầu hệ thống**:
- Lịch sử tương tác 360° với khách hàng
- Chương trình loyalty tự động
- Nhắc nhở bảo dưỡng định kỳ
- Xử lý khiếu nại có tracking

---

#### OBJ-003: Tối Ưu Quy Trình Bán Hàng
**Mục tiêu**: Giảm 50% thời gian từ báo giá đến ký hợp đồng

**Cách đo lường**:
- Thời gian trung bình tạo báo giá
- Số báo giá được approve
- Thời gian từ deposit → delivery

**Yêu cầu hệ thống**:
- Template báo giá chuẩn
- Auto-calculate pricing
- Workflow approval
- Tracking VIN allocation

---

#### OBJ-004: Nâng Cao Hiệu Quả Dịch Vụ
**Mục tiêu**: Tăng 30% số lượng appointments và giảm 20% waiting time

**Cách đo lường**:
- Số appointments/tháng
- Bay utilization rate
- Average repair time
- First-time-fix rate

**Yêu cầu hệ thống**:
- Online appointment booking
- Bay management & scheduling
- Parts availability check
- Service history tracking

---

#### OBJ-005: Kiểm Soát Tồn Kho Phụ Tùng
**Mục tiêu**: Giảm 25% vốn tồn kho và tăng inventory turnover

**Cách đo lường**:
- Inventory turnover ratio
- Stock-out rate
- Obsolete inventory value
- Fill rate for service orders

**Yêu cầu hệ thống**:
- Real-time inventory tracking
- Auto reorder point
- Aging analysis
- Demand forecasting

---

### 2.2 Mục Tiêu Phụ

- **Compliance**: Đảm bảo tuân thủ quy định thuế, kế toán Việt Nam
- **Scalability**: Hỗ trợ mở rộng lên 3-5 showrooms
- **Integration**: Sẵn sàng tích hợp với Honda Vietnam systems
- **Mobility**: Hỗ trợ truy cập từ tablet cho sales/service staff

---

## 3. Scope & Boundaries

### 3.1 In Scope

#### ✅ Chức Năng Nghiệp Vụ

| Module | Chức Năng |
|--------|-----------|
| **Master Data** | VehicleModel, Accessory, ServiceCatalog, ServiceBay, ScoringRule, SystemSetting management |
| **CRM** | Lead management, Customer 360, Loyalty program, Marketing campaigns, Complaint handling |
| **Sales** | Quotation, Test drive scheduling, Deposit management, VIN allocation, PDS & Delivery |
| **Service** | Appointment booking, Reception, Repair orders, Technician workflow, QC, Settlement |
| **Parts** | Inventory management, Stock movements, Purchase requisition, Aging analysis, Pricing |
| **Insurance** | Contract management, Claims processing, Renewal reminders |
| **Accounting** | P&L, Balance sheet, Cash flow, AR/AP, Tax reports, Fixed assets |
| **Admin** | User management, Permissions, System settings, System monitoring, Audit logs |

#### ✅ Tích Hợp

- Email notifications (SMTP)
- SMS gateway (cho reminders)
- Export to Excel/PDF
- Backup & restore

### 3.2 Out of Scope

#### ❌ Không Bao Gồm

- ❌ Mobile apps (iOS/Android native)
- ❌ Tích hợp với Honda Vietnam DMS
- ❌ E-commerce / Online sales
- ❌ Chatbot / AI assistant
- ❌ Video call / Virtual showroom
- ❌ Blockchain / Cryptocurrency payment
- ❌ IoT vehicle tracking

### 3.3 Assumptions

1. **Infrastructure**: Đại lý có internet ổn định (≥10 Mbps)
2. **Devices**: Users có desktop/laptop (Windows/Mac)
3. **Data**: Dữ liệu khách hàng hiện tại sẽ được migrate
4. **Training**: Staff sẽ được đào tạo sử dụng hệ thống
5. **Support**: Có IT support nội bộ hoặc outsource

### 3.4 Constraints

1. **Budget**: Giới hạn ngân sách cho phase 1
2. **Timeline**: Go-live trong 6 tháng
3. **Resources**: Team size giới hạn
4. **Technology**: Sử dụng tech stack hiện có (Next.js, Prisma)
5. **Compliance**: Tuân thủ PDPA (Personal Data Protection Act)

---

## 4. Actors & Stakeholders

### 4.1 Primary Actors (Người Dùng Trực Tiếp)

(See previous BRD v2.0 for full actor list - retained)

#### 👤 Sales Consultant
#### 👤 Service Advisor
#### 👤 Technician (KTV)
#### 👤 Parts Manager
#### 👤 Accountant
#### 👤 Manager
#### 👤 System Administrator

### 4.2 Secondary Stakeholders

| Stakeholder | Vai Trò | Mối Quan Tâm |
|-------------|---------|--------------|
| **Dealer Owner** | Chủ đại lý | ROI, business growth, compliance |
| **Honda Vietnam** | Nhà sản xuất | Brand standards, data reporting |
| **Customers** | Khách hàng | Service quality, transparency |
| **Suppliers** | Nhà cung cấp | Order processing, payment |
| **IT Support** | Hỗ trợ kỹ thuật | System stability, maintenance |

---

## 5. Business Requirements

### 5.1 to 5.7
(Retained from BRD v2.0 - See original document for MDM, CRM, Sales, Service, Parts, Insurance, Accounting sections)

---

### 5.8 System Administration

#### BR-ADMIN-001: User Management
**Business Need**: Quản lý tài khoản người dùng và thông tin cá nhân.
**Business Rules**:
- BR-ADMIN-001-R1: Email phải là duy nhất.
- BR-ADMIN-001-R2: Password complexity (min 8 chars, mixed case, numbers).

#### BR-ADMIN-002: Permission Management
**Business Need**: Quản lý roles và permissions chi tiết để kiểm soát truy cập theo nguyên tắc least privilege.
**Actors**: System Administrator, Manager

**Business Flow**:
Admin tạo Role (e.g., SALES_REP) → Assign Permissions → Assign Role to User → System enforce permissions

**Business Rules**:
- BR-ADMIN-002-R1: Mỗi user có ít nhất 1 role
- BR-ADMIN-002-R2: Permissions format: `module.entity.action`
- BR-ADMIN-002-R3: Super Admin role không thể xóa
- BR-ADMIN-002-R4: Permission changes log vào audit trail

**Success Criteria**:
- 100% users có role phù hợp
- 0% unauthorized access
- Permission check time < 50ms

#### BR-ADMIN-003: Audit Logs
**Business Need**: Ghi nhận mọi critical actions để compliance và troubleshooting.
**Business Rules**:
- BR-ADMIN-003-R1: Log tất cả CREATE/UPDATE/DELETE operations
- BR-ADMIN-003-R2: Logs append-only (không sửa/xóa)
- BR-ADMIN-003-R3: Retention: 12 tháng minimum
- BR-ADMIN-003-R4: Log format: timestamp, user, action, entity, details

#### BR-ADMIN-004: System Settings
**Business Need**: Cấu hình hệ thống tập trung (email, SMS, notifications).
**Business Rules**:
- BR-ADMIN-004-R1: Settings theo format key-value với type validation
- BR-ADMIN-004-R2: Changes require Manager approval
- BR-ADMIN-004-R3: Sensitive settings encrypted

#### BR-ADMIN-005: System Monitoring
**Business Need**: Giám sát health và performance của hệ thống.
**Business Rules**:
- BR-ADMIN-005-R1: Metrics thu thập mỗi 5 phút
- BR-ADMIN-005-R2: Alert khi CPU > 80%, Memory > 90%
- BR-ADMIN-005-R3: Retention: 30 ngày

---

## 6. Business Rules & Constraints
(Retained from v2.0)

## 7. Success Criteria
(Retained from v2.0)

---

## Change Log

| Version | Date | Changes | Related |
|---------|------|---------|---------|
| 2.1 | 31/01/2026 | Added 4 System Admin requirements (BR-ADMIN-002 to 005) for RBAC, Audit, Settings, Monitoring | CR-20250131-002 |
| 2.0 | 28/01/2026 | Major update for full system scope | - |

**End of BRD v2.1**
