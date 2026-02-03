# Báo cáo Phân tích: Quotation Screen (Current vs Refs)

## 1. Tổng quan
Sau khi rà soát code giữa phiên bản hiện tại (`components/sales/QuotationForm.tsx`, `QuoteList.tsx`) và phiên bản tham chiếu Reference (`Refs/src/app/components/QuotationForm.tsx`, `QuotationList.tsx`), tôi nhận thấy có sự chênh lệch **rất lớn** về mặt tính năng và độ hoàn thiện.

Phiên bản hiện tại (Current) dường như là một bản "rút gọn" hoặc "MVP" (Minimum Viable Product), trong khi phiên bản Refs là một sản phẩm hoàn chỉnh với đầy đủ nghiệp vụ bán hàng ô tô chuyên sâu.

## 2. Chi tiết chênh lệch UI/UX (Màn hình Báo giá - Form)

### 2.1. Cấu trúc Tabs & Luồng làm việc
| Đặc điểm | Hiện tại (Current) | Tham chiếu (Refs) | Đánh giá |
| :--- | :--- | :--- | :--- |
| **Số lượng Tab** | 3 Tabs: Thông tin & Xe, Phụ kiện & Dịch vụ, Phân tích giá. | **5 Tabs**: Thông tin cơ bản, Phụ kiện, **Thanh toán**, Phân tích giá, **Ghi chú**. | Thiếu hẳn 2 tab quan trọng là Thanh toán và Ghi chú. |
| **Trải nghiệm Tab 1** | Form nhập liệu đơn giản. Phần tổng hợp giá chỉ là một Card nhỏ preview. | Form nhập liệu chi tiết. Có bảng **OTR Calculator** (Chi phí lăn bánh) rất chi tiết, cho phép chỉnh sửa giảm giá trực tiếp ngay tại đây. | Refs tối ưu hơn cho trải nghiệm sales tư vấn khách hàng trực tiếp. |

### 2.2. Các tính năng "bị mất" (Missing Features)
1.  **Tab Thanh toán (Payment)**:
    *   **Hiện tại**: Không có.
    *   **Refs**: Cho phép chọn phương thức thanh toán (Trả góp/Trả thẳng). Tính toán lịch trả góp, chọn ngân hàng, tính số tiền trả trước và trả hàng tháng.
2.  **Tab Ghi chú (Notes)**:
    *   **Hiện tại**: Không có.
    *   **Refs**: Tách biệt "Ghi chú nội bộ" và "Ghi chú hiển thị cho khách hàng". Có giao diện quản lý file đính kèm (CMND, Hộ khẩu...).
3.  **Quản lý Khuyến mãi (Promotions)**:
    *   **Hiện tại**: Chỉ là danh sách checkbox đơn giản.
    *   **Refs**: Hệ thống thêm khuyến mãi linh hoạt (Button + Modal). Cho phép thêm:
        *   Giảm giá tiền mặt (Money Discount).
        *   Tặng phụ kiện (Gift Item).
        *   Tặng dịch vụ (Service Gift).
        *   Cho phép nhập lý do/mô tả khuyến mãi.

### 2.3. Dashboard Phân tích (Analysis Tab)
*   **Hiện tại**: Hiển thị bảng tính Doanh thu/Lợi nhuận cơ bản. Giao diện khá tĩnh.
*   **Refs**:
    *   Sử dụng các thẻ Card màu sắc (Green/Red/Orange) để cảnh báo mức độ lợi nhuận (Margin Warning).
    *   Có tính năng **Kịch bản hoa hồng** (Commission Scenarios): Cho phép Sale click nhanh để xem nếu mức hoa hồng thay đổi thì lợi nhuận thay đổi ra sao.
    *   Có Modal chi tiết (Popup) khi click vào thẻ Doanh thu hoặc Chi phí để xem breakdown chi tiết (Collapsible).

## 3. Chi tiết chênh lệch Màn hình Danh sách (List)

| Đặc điểm | Hiện tại (`QuoteList.tsx`) | Tham chiếu (`QuotationList.tsx`) |
| :--- | :--- | :--- |
| **Thống kê (Stats)** | Không có. | Có hàng Cards trên cùng thống kê: Tổng số, Nháp, Đã gửi, Đã duyệt, Tổng giá trị (Tỷ đồng). |
| **Cột bảng** | Cơ bản: Mã, KH, Xe, Giá, NV, Trạng thái. | Chi tiết hơn: Thêm cột **Giảm giá**, **Thành tiền**, **Hết hạn**, **Ngày giao xe**. |
| **Hành động (Actions)** | Dropdown Menu (Cần 2 click). | **Direct Icons**: Xem, Sửa, **Gọi điện (VOIP)**, Email, PDF, Xóa. Tiện hơn cho thao tác nhanh. |
| **Bộ lọc** | Chỉ search text + nút Filter chung chung. | Search + Dropdown Status rõ ràng + Date Range (ẩn dụ). |

## 4. Phân tích Xử lý Logic (Under the hood)

*   **Logic tính toán giá (Pricing Engine)**:
    *   Hiện tại: Logic tính tổng đơn giản: `Base + Acc + Service - Discount`.
    *   Refs: Logic phức tạp hơn, xử lý kỹ các loại khuyến mãi (âm tiền), xử lý VAT/Thuế phí chi tiết hơn trong OTR Calculator.
*   **Xử lý dữ liệu**:
    *   Hiện tại: Form validate đơn giản.
    *   Refs: Có vẻ hỗ trợ state management phức tạp hơn để xử lý việc thêm/xóa dynamic các item khuyến mãi tùy chỉnh.
*   **Tương tác (Interactivity)**:
    *   Refs hỗ trợ Collapsible (thu gọn/mở rộng) các mục chi phí để màn hình gọn gàng nhưng vẫn xem được chi tiết khi cần.

## 5. Kết luận & Đề xuất

Giao diện hiện tại (`Current`) đang thiếu hụt khoảng **40-50%** tính năng so với bản thiết kế tham chiếu (`Refs`), đặc biệt là các công cụ hỗ trợ tư vấn tài chính (Payment) và quản lý tiến trình (Notes, Documents).

**Đề xuất hành động:**
1.  **Nâng cấp Form Báo giá**: Bổ sung ngay 2 Tab "Thanh toán" và "Ghi chú". Đây là nghiệp vụ cốt lõi của sales ô tô (tư vấn trả góp).
2.  **Cải thiện Logic Khuyến mãi**: Chuyển từ checkbox list sang mô hình "Add Promotion" linh hoạt như Refs để Sale có thể deal giá tốt hơn.
3.  **Thay thế Table List**: Mang bộ Stats Dashboard và Action Icons của Refs sang để Sale quản lý pipeline hiệu quả hơn.
4.  **UI Polish**: Áp dụng các component Collapsible và Dialog chi tiết của Refs để trải nghiệm mượt mà hơn.
