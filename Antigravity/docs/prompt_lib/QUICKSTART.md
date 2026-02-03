# QUICK START - PROMPT LIBRARY

## 🚀 5 BƯỚC SỬ DỤNG NGAY

### ✅ Bước 1: Download folder này
Download toàn bộ folder `prompt_lib/`

### ✅ Bước 2: Upload vào Claude
Kéo thả folder `prompt_lib/` vào chat Claude

### ✅ Bước 3: Copy template
Mở file `USAGE_GUIDE.md`, copy template phù hợp

### ✅ Bước 4: Điền thông tin
Thay [TÊN MODULE], [Requirements], etc. bằng thông tin thực

### ✅ Bước 5: Chạy!
Paste vào Claude chat và Enter

---

## 📝 VÍ DỤ CỤ THỂ

### Scenario: Tạo module Loyalty Program

**Bước 1-2:** Upload folder prompt_lib

**Bước 3:** Copy template này từ USAGE_GUIDE.md:

```
Hãy dùng các prompts đã được định nghĩa tại /mnt/user-data/uploads/prompt_lib/
và thực hiện tuần tự các prompts: #01, #02, #03, #04, #05

Module: Customer Loyalty Program

Requirements:
- Khách hàng tích điểm khi mua hàng (1000 VND = 1 điểm)
- Quy đổi điểm thành voucher giảm giá (100 điểm = voucher 10%)
- Xem lịch sử giao dịch điểm

Tài liệu hiện có:
- Refs: /project/refs-ui (React TypeScript components)
- CRD: N/A
- ERD hiện tại: Tạo mới
- Instructions: /project/instructions.md

Yêu cầu thực hiện:
[... rest of template ...]
```

**Bước 4:** Đã điền sẵn ở trên ↑

**Bước 5:** Paste vào Claude → Enter

**Kết quả:**
```
Claude sẽ:
✅ Đọc prompt_01.md → Tạo BRD
✅ Đọc prompt_02.md → Tạo FRD
✅ Đọc prompt_03.md → Tạo ERD
✅ Đọc prompt_04.md → Tạo UI Spec
✅ Đọc prompt_05.md → Tạo API Specs
✅ Tạo Handover document

Done trong 1 lần chạy!
```

---

## 🎯 CHỌN TEMPLATE PHÙ HỢP

| Bạn muốn | Dùng Template | File trong USAGE_GUIDE.md |
|----------|---------------|---------------------------|
| Thiết kế module mới | Template 1 | Design Phase |
| Code module đã design | Template 2 | Implementation Phase |
| Thay đổi yêu cầu | Template 3 | Change Request |
| Test UAT | Template 5 | UAT Process |
| Fix bug | Template 4 | Bug Management |
| Deploy | Template 6 | Single Prompt (#19) |

---

## 💡 TIPS QUAN TRỌNG

1. **Luôn upload folder prompt_lib/ TRƯỚC khi chạy**
2. **Path sẽ là `/mnt/user-data/uploads/prompt_lib/`**
3. **Điền ĐẦY ĐỦ thông tin trong template**
4. **Đọc README.md để hiểu cấu trúc**
5. **Đọc USAGE_GUIDE.md để có templates chi tiết**

---

## 🆘 TRỢ GIÚP

**Q: Làm sao biết folder đã upload đúng chưa?**
A: Hỏi Claude: "List files in /mnt/user-data/uploads/prompt_lib/"

**Q: Template chạy nhưng không có kết quả?**
A: Check xem đã điền đầy đủ thông tin module chưa

**Q: Muốn chạy 1 prompt riêng lẻ?**
A: Dùng Template 6 trong USAGE_GUIDE.md

**Q: Files có bị mất không?**
A: Files tồn tại trong conversation hiện tại. Conversation mới cần upload lại.

---

## 📚 ĐỌC THÊM

- `README.md` - Tổng quan chi tiết
- `USAGE_GUIDE.md` - Tất cả templates
- Các file `prompt_XX.md` - Nội dung từng prompt

---

## ✅ CHECKLIST

- [ ] Downloaded folder prompt_lib
- [ ] Uploaded to Claude chat
- [ ] Opened USAGE_GUIDE.md
- [ ] Copied appropriate template
- [ ] Filled in module information
- [ ] Pasted and ran in Claude
- [ ] Got results!

---

🎉 **You're ready!** Chúc bạn develop hiệu quả với Antigravity Process!
