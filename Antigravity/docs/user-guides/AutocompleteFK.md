# AutocompleteFK - User Guide

## Overview

AutocompleteFK là một dropdown thông minh giúp bạn tìm và chọn items nhanh chóng. Nó có các tính năng:

- **Real-time Search**: Gõ từ khóa để tìm kiếm ngay lập tức
- **Infinite Scroll**: Cuộn xuống để xem thêm items
- **Quick Create**: Tạo mới item ngay từ dropdown
- **Keyboard Navigation**: Sử dụng keyboard để chọn nhanh

## Basic Usage

### 1. Mở Dropdown

Click vào dropdown để mở. 5 items đầu tiên sẽ được hiển thị.

### 2. Tìm Kiếm

Gõ từ khóa vào ô tìm kiếm:
- Kết quả sẽ được lọc real-time
- Hỗ trợ tìm kiếm theo tên, mã, và các fields khác
- Gõ ít nhất 1 ký tự

### 3. Chọn Item

Click hoặc nhấn Enter để chọn item:
- Dropdown sẽ tự động đóng
- Item được chọn sẽ được hiển thị

### 4. Tạo Mới Item (Quick Create)

Nếu không tìm thấy item bạn cần:

1. Gõ từ khóa tìm kiếm
2. Click **"+ Tạo mới..."** ở cuối danh sách
3. Form tạo mới sẽ mở trong tab mới
4. Điền thông tin và save
5. Tab mới sẽ tự động đóng
6. Item mới sẽ được tự động chọn trong dropdown

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **↑** | Navigate lên |
| **↓** | Navigate xuống |
| **Enter** | Chọn item |
| **Esc** | Đóng dropdown |
| **Tab** | Đóng dropdown và chuyển sang field tiếp theo |

## Features Detail

### Real-time Search

- **Debounce**: Kết quả sẽ hiển thị sau 300ms (tránh spam API)
- **Partial Match**: Hỗ trợ tìm kiếm một phần (ví dụ: "city" sẽ tìm thấy "Honda City")
- **Case-insensitive**: Không phân biệt chữ hoa/thường

### Infinite Scroll

- **Page Size**: 5 items mỗi trang
- **Lazy Loading**: Items tiếp theo được tải khi cuộn đến cuối (90%)
- **Loading Indicator**: Spinner hiển thị khi đang tải
- **Performance**: Mượt mà, không lag

### Quick Create Flow

1. **Save Form Draft**: Form hiện tại được tự động lưu trước khi chuyển tab
2. **Navigate**: Mở form tạo mới trong tab mới
3. **Complete Form**: Điền thông tin và save
4. **Auto-Return**: Tab mới tự động đóng
5. **Auto-Select**: Item mới được tự động chọn

## Tips

1. **Tìm kiếm bằng tên**: Gõ tên item (ví dụ: "Honda City")
2. **Tìm kiếm bằng mã**: Gõ mã item (ví dụ: "MOD/2026/001")
3. **Sử dụng keyboard**: Nhanh hơn việc click chuột
4. **Quick Create**: Sử dụng quick create thay vì đóng form để tạo mới

## Error Handling

### No Results

Nếu không tìm thấy kết quả:
- Message "Không tìm thấy kết quả" sẽ hiển thị
- Option "+ Tạo mới..." sẽ hiển thị để bạn tạo mới

### Network Error

Nếu có lỗi kết nối:
- Message lỗi sẽ hiển thị
- Hãy thử lại sau

### Loading

Khi đang tìm kiếm hoặc tải thêm items:
- Spinner loading sẽ hiển thị
- Hãy đợi loading hoàn thành

## Examples

### Example 1: Tìm Khách Hàng

1. Click dropdown "Khách hàng"
2. Gõ "Nguyen Van A"
3. Kết quả sẽ được lọc theo tên
4. Click hoặc Enter để chọn

### Example 2: Tìm Dòng Xe

1. Click dropdown "Dòng xe"
2. Gõ "City"
3. Kết quả: "Honda City RS", "Honda City Hatchback"
4. Scroll xuống để xem thêm nếu có

### Example 3: Tạo Mới Phụ Tùng

1. Click dropdown "Phụ tùng"
2. Gõ "Bình xăng xe máy"
3. Không tìm thấy kết quả
4. Click "+ Tạo mới 'Bình xăng xe máy'"
5. Form tạo phụ tùng mở trong tab mới
6. Điền thông tin và save
7. Tab đóng, phụ tùng mới được chọn

## Troubleshooting

### Dropdown không mở

- Check xem field có bị disabled không
- Refresh trang và thử lại

### Không thấy kết quả

- Gõ từ khóa khác
- Check spelling
- Thử gõ ít ký tự hơn

### Quick create không hoạt động

- Check xem bạn có quyền tạo mới không
- Check xem popup bị block bởi browser
- Thử click chuột phải và chọn "Open in new tab"

### Slow performance

- Đợi loading hoàn thành trước khi tiếp tục
- Check mạng internet
- Contact IT support

## Contact

Nếu bạn gặp vấn đề không được giải quyết:
- Contact IT support
- Vào Settings để xem permissions của bạn

---

**Last Updated**: 03/02/2026
