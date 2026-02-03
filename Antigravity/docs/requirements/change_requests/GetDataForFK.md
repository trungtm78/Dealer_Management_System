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
Lợi ích:

Đảm bảo tính toàn vẹn dữ liệu (data integrity)
Tránh lỗi nhập liệu sai
Cải thiện trải nghiệm người dùng
Thống nhất cách thức nhập liệu trong toàn hệ thống