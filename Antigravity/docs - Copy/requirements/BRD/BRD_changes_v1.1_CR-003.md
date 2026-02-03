# BRD Changes v1.1 (CR-003)

**Document**: Business Requirements Document (BRD)  
**Version**: v1.0 → v1.1  
**Change Type**: MINOR (Adding new business requirement)  
**CR-ID**: CR-003  
**Date**: 2026-01-29

---

## CHANGE SUMMARY

**Added**: BR-SVC-007 (Bay Utilization Management)

**Reason**: Thêm yêu cầu nghiệp vụ mới để quản lý và theo dõi tình trạng sử dụng các bay sửa chữa trong xưởng dịch vụ.

---

## NEW SECTION: BR-SVC-007 - Bay Utilization Management

### Business Objective

Tối ưu hóa việc sử dụng các bay sửa chữa (service bays) trong xưởng dịch vụ để:
- Tăng năng suất xưởng dịch vụ
- Giảm thời gian chờ của khách hàng
- Tối ưu hóa phân công nhân lực
- Phát hiện sớm các công việc bị trễ hạn

### Business Requirements

#### BR-SVC-007.1: Real-time Bay Status Tracking

**Requirement**: Hệ thống PHẢI theo dõi real-time tình trạng từng bay sửa chữa.

**Details**:
- Mỗi bay có 4 trạng thái: Rảnh (Idle), Đang làm việc (Working), Trễ hạn (Delayed), Hoàn thành (Completed)
- Trạng thái được cập nhật tự động dựa trên:
  - Phân công công việc → Working
  - Thời gian ước tính kết thúc < hiện tại và chưa hoàn thành → Delayed
  - Hoàn thành công việc → Completed → Idle
- Hiển thị thông tin chi tiết cho mỗi bay:
  - Lệnh sửa chữa (Work Order) đang thực hiện
  - Xe đang sửa
  - Kỹ thuật viên phụ trách
  - Thời gian bắt đầu và dự kiến kết thúc
  - Tiến độ công việc (%)

**Business Value**: Quản lý viên có thể nắm bắt tình hình xưởng dịch vụ một cách toàn diện và real-time.

---

#### BR-SVC-007.2: Delay Alert System

**Requirement**: Hệ thống PHẢI cảnh báo khi có công việc bị trễ hạn.

**Details**:
- Tự động phát hiện bay có công việc trễ hạn (thời gian thực tế > thời gian ước tính)
- Hiển thị cảnh báo nổi bật trên dashboard
- Tính toán số phút trễ hạn
- Cho phép xem danh sách tất cả bay đang trễ hạn

**Business Value**: Phát hiện sớm vấn đề để có biện pháp xử lý kịp thời, tránh ảnh hưởng đến khách hàng.

---

#### BR-SVC-007.3: Bay Utilization Rate Calculation

**Requirement**: Hệ thống PHẢI tính toán tỷ lệ sử dụng bay.

**Details**:
- Công thức: `Utilization Rate = (Total Bays - Idle Bays) / Total Bays * 100%`
- Hiển thị các KPI:
  - Tổng số bay
  - Số bay rảnh
  - Số bay đang làm việc
  - Số bay trễ hạn
  - Tỷ lệ sử dụng (%)
- Cập nhật real-time

**Business Value**: Đánh giá hiệu quả sử dụng tài nguyên xưởng dịch vụ, cơ sở cho quyết định mở rộng hoặc tối ưu.

---

#### BR-SVC-007.4: Work Assignment to Idle Bay

**Requirement**: Hệ thống PHẢI cho phép phân công công việc cho bay rảnh.

**Details**:
- Hiển thị danh sách bay rảnh
- Cho phép chọn Work Order để phán công
- Tự động cập nhật trạng thái bay từ Idle → Working
- Ghi nhận thời gian bắt đầu và ước tính kết thúc

**Business Value**: Tối ưu hóa quy trình phân công công việc, giảm thời gian bay rảnh không cần thiết.

---

### Success Criteria

1. ✅ Tỷ lệ sử dụng bay tăng ít nhất 15% sau 3 tháng triển khai
2. ✅ Giảm 30% số công việc bị trễ hạn không được phát hiện kịp thời
3. ✅ Giảm 20% thời gian chờ trung bình của khách hàng
4. ✅ 100% Service Advisor sử dụng dashboard để quản lý bay

---

## CHANGE LOG

| Date | Version | CR-ID | Changes | Author |
|------|---------|-------|---------|--------|
| 2026-01-29 | v1.1 | CR-003 | Added BR-SVC-007 (Bay Utilization Management) | Antigravity |

---

**Document Owner**: Business Analyst  
**Last Updated**: 2026-01-29  
**Status**: ✅ APPROVED

---

**End of BRD Changes v1.1 (CR-003)**
