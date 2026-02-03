Yêu cầu về Foreign Key (FK) trong các màn hình
Mô tả:
Toàn bộ các trường Foreign Key (FK) trong tất cả các màn hình của hệ thống cần phải được hiển thị dưới dạng dropdown/select box, cho phép người dùng chọn giá trị từ danh sách dữ liệu có sẵn thay vì nhập tay.
Nguồn dữ liệu:
Dữ liệu cho các dropdown/select box phải được lấy từ các màn hình quản lý dữ liệu chính (Master Data) tương ứng.
Ví dụ cụ thể:

Màn hình: Quản lý Phụ tùng
Trường FK: Dòng xe tương thích
Yêu cầu: Phải có dropdown "Dòng xe" cho phép người dùng chọn
Nguồn dữ liệu: Lấy danh sách từ màn hình Master Data "Dòng xe"

Phạm vi áp dụng:
Áp dụng cho tất cả các trường FK trong toàn bộ các màn hình của hệ thống (màn hình thêm mới, màn hình chỉnh sửa, màn hình tìm kiếm/lọc).

Chức năng Dropdown/Select Box:
Các dropdown/select box sẽ hoạt động tương tự như dropdown/select box của Odoo 18, bao gồm các tính năng sau:

1. Search Context (Tìm kiếm khi gõ):
   - Cho phép người dùng tìm kiếm bằng cách gõ từ khóa trực tiếp vào dropdown
   - Kết quả sẽ được lọc theo thời gian thực khi người dùng nhập liệu

2. Hiển thị dữ liệu phân trang:
   - Khi chưa gõ: Hiển thị mặc định 5 items đầu tiên
   - Khi gõ từ khóa: Hiển thị danh sách kết quả theo kết quả tìm kiếm
   - Hỗ trợ lazy loading/pagination khi scroll để tải thêm dữ liệu

3. Tạo dữ liệu mới (Create New Data):
   - Trường hợp không tìm thấy dữ liệu phù hợp: Hiển thị option "Tạo mới..." hoặc "Create new data"
   - Khi click vào option này: Chuyển hướng (link) đến màn hình Master Data tương ứng để tạo dữ liệu mới
   - Sau khi tạo xong, tự động quay lại màn hình hiện tại và chọn dữ liệu vừa tạo

Lợi ích:

Đảm bảo tính toàn vẹn dữ liệu (data integrity)
Tránh lỗi nhập liệu sai
Cải thiện trải nghiệm người dùng với khả năng tìm kiếm nhanh
Cho phép tạo dữ liệu master ngay khi cần thiết mà không cần rời khỏi workflow
Thống nhất cách thức nhập liệu trong toàn hệ thống
Tối ưu hiệu suất với việc chỉ load dữ liệu cần thiết