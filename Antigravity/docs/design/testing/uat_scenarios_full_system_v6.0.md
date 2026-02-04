# UAT Scenarios - Honda SPICE ERP System (Full System)

**Phiên Bản**: 6.0  
**Ngày Tạo**: 2026-02-04  
**Người Tạo**: Antigravity - System UAT Authority  
**Trạng Thái**: 🔄 DRAFT (Chờ phê duyệt)  
**Database Schema**: ERD v1.6 Consolidated (67 tables)  
**UAT Plan**: `uat_plan_full_system_v6.0.md`

---

## 📋 MỤC LỤC

- [Overview](#overview)
- [GROUP A – CREATE & SAVE](#group-a--create--save)
- [GROUP B – READ & PERSIST](#group-b--read--persist)
- [GROUP C – UPDATE](#group-c--update)
- [GROUP D – DELETE](#group-d--delete)
- [GROUP E – FILE & ATTACHMENT](#group-e--file--attachment)
- [GROUP F – STATE & WORKFLOW](#group-f--state--workflow)
- [GROUP G – VALIDATION & ERROR](#group-g--validation--error)
- [GROUP H – CROSS-SCREEN & E2E](#group-h--cross-screen--e2e)

---

## Overview

### Total Scenarios

| Group | Scenarios | Entities | Total |
|-------|-----------|----------|-------|
| **A - CREATE** | 9 patterns | 67 | ~600 |
| **B - READ** | 4 patterns | 67 | ~268 |
| **C - UPDATE** | 5 patterns | 67 | ~335 |
| **D - DELETE** | 5 patterns | 67 | ~335 |
| **E - FILE** | 4 patterns | ~10 | ~40 |
| **F - STATE** | 3 patterns | ~20 | ~60 |
| **G - VALIDATION** | 4 patterns | 67 | ~268 |
| **H - E2E** | 15 specific | 1 | ~75 |
| **TOTAL** | | | **~2,000** |

### ⚠️ LƯU Ý QUAN TRỌNG

> **CRITICAL**: Scenarios dưới đây là **PATTERN TEMPLATES**. Mỗi pattern sẽ được **áp dụng lặp lại** cho từng entity phù hợp.  
> 
> **Ví dụ**: Scenario A01 (Create với valid data) sẽ có ~67 test cases thực tế:
> - A01-USERS: Create user với email/phone valid
> - A01-CUSTOMERS: Create customer với phone/email valid
> - A01-QUOTATIONS: Create quotation với customer_id, vehicle_model_id valid
> - ... (64 entities khác)

---

## GROUP A – CREATE & SAVE

**Purpose**: Verify record creation and data persistence.

---

### SCENARIO A01: Create với Valid Data → Success

**MODULE**: ALL (67 entities)  
**ACTION**: CREATE  
**ENTITY**: Pattern áp dụng cho tất cả entities

#### PRECONDITIONS
- User đã login với role phù hợp
- Database có seed data cần thiết (FK references)
- Form/screen tương ứng đã load

#### STEPS
1. Navigate đến màn hình Create/Add của entity
2. Nhập **tất cả required fields** với **valid data**
3. Nhập **optional fields** (nếu có) với valid data
4. Click **"Save"** hoặc **"Submit"**
5. Verify success message hiển thị
6. Navigate đến màn hình List/Detail
7. Tìm record vừa tạo bằng PK hoặc filter

#### EXPECTED UI
- ✅ Success message: "Tạo [Entity] thành công" hoặc tương đương
- ✅ Redirect về List hoặc Detail screen
- ✅ Record hiển thị trong danh sách
- ✅ Tất cả fields hiển thị đúng giá trị đã nhập

#### EXPECTED DB
- ✅ **Table**: `[entity_table]`
- ✅ **New Record**: 1 row mới với `id` = auto-generated
- ✅ **Fields**: Tất cả fields match input
- ✅ **Audit Fields**:
  - `created_at` = thời điểm hiện tại (timestamp)
  - `created_by` = user_id của user đang login (nếu có)
  - `updated_at` = thời điểm hiện tại (timestamp, nếu có)
  - `deleted_at` = NULL (nếu có soft delete)

#### ERD CONSTRAINTS
- ✅ **PK**: Auto-generated, unique
- ✅ **FK**: Tất cả FK references tồn tại trong parent tables
- ✅ **UNIQUE**: Không vi phạm (nếu có UNIQUE constraints)
- ✅ **NOT NULL**: Tất cả required fields được populate
- ✅ **ENUM**: Tất cả ENUM fields có giá trị hợp lệ

#### PASS IF
- UI hiển thị success message
- Record xuất hiện trong List/Detail
- DB có 1 row mới với data chính xác
- Audit fields auto-populated

#### FAIL IF
- Error message xuất hiện
- Record không tồn tại trong DB
- Audit fields = NULL hoặc incorrect

#### EXAMPLE INSTANCES

**A01-USERS**:
```
Input:
- email: "test@honda.com"
- name: "Nguyễn Văn A"
- role_id: 2 (Sales)
- phone: "0901234567"
- password: "password123"

Expected DB:
- users.id: auto-generated
- users.email: "test@honda.com"
- users.created_at: 2026-02-04 16:00:00
- users.created_by: 1 (nếu có)
```

**A01-CUSTOMERS**:
```
Input:
- phone: "0909123456" (UNIQUE)
- name: "Trần Thị B"
- email: "tranb@gmail.com"

Expected DB:
- customers.id: auto-generated
- customers.phone: "0909123456"
- customers.created_at: timestamp
```

**A01-QUOTATIONS**:
```
Input:
- quote_number: "QT/2026/001" (UNIQUE, auto-generated hoặc manual)
- customer_id: 1 (FK → customers)
- vehicle_model_id: 2 (FK → vehicle_models)
- base_price: 1029000000.00
- status: "DRAFT" (ENUM)

Expected DB:
- quotations.id: auto-generated
- quotations.customer_id: 1 (FK valid)
- quotations.vehicle_model_id: 2 (FK valid)
- quotations.status: "DRAFT" (ENUM valid)
```

> **Note**: Tạo tương tự cho **64 entities còn lại**.

---

### SCENARIO A02: Create với Invalid Data → Reject + Error

**MODULE**: ALL (67 entities)  
**ACTION**: CREATE  
**ENTITY**: Pattern áp dụng cho tất cả entities

#### PRECONDITIONS
- User đã login
- Form Create đã load

#### STEPS
1. Navigate đến màn hình Create
2. Nhập **1 hoặc nhiều fields** với **INVALID data**:
   - Email sai format (e.g., "abc@")
   - Phone sai format (e.g., "123")
   - Number là string (e.g., "abc" thay vì 100)
   - Date sai format
   - Enum value không hợp lệ
3. Click **"Save"**

#### EXPECTED UI
- ❌ **Error message** hiển thị rõ ràng:
  - "Email không hợp lệ"
  - "Số điện thoại phải có 10 chữ số"
  - "Giá trị phải là số"
  - "Vui lòng chọn giá trị hợp lệ" (ENUM)
- ❌ Form **KHÔNG submit**
- ❌ User **vẫn ở màn hình Create**

#### EXPECTED DB
- ❌ **NO NEW RECORD** - Database không thay đổi

#### ERD CONSTRAINTS
- ✅ **Type Validation**: Ngăn chặn data type mismatch
- ✅ **Format Validation**: Email, phone format enforced

#### PASS IF
- UI hiển thị error message rõ ràng
- Form không submit
- DB không có record mới

#### FAIL IF
- Record được tạo với invalid data
- Không có error message
- Error message không rõ ràng (e.g., "Error 500")

#### EXAMPLE INSTANCES

**A02-USERS**:
```
Invalid Input:
- email: "invalid-email" (không có @)

Expected Error:
- "Email không hợp lệ"
```

**A02-CUSTOMERS**:
```
Invalid Input:
- phone: "123" (quá ngắn)

Expected Error:
- "Số điện thoại phải có 10 chữ số"
```

---

### SCENARIO A03: Create với PK Duplicate → Reject

**MODULE**: Entities with UNIQUE constraints  
**ACTION**: CREATE  
**ENTITY**: `users`, `customers`, `parts`, `quotations`, etc.

#### PRECONDITIONS
- Database đã có record với UNIQUE value (e.g., email, phone, code)

#### STEPS
1. Navigate đến Create screen
2. Nhập data với **UNIQUE field = existing value**:
   - `users.email` = email đã tồn tại
   - `customers.phone` = phone đã tồn tại
   - `parts.part_number` = part_number đã tồn tại
3. Click "Save"

#### EXPECTED UI
- ❌ Error message: "Email đã tồn tại", "Số điện thoại đã được sử dụng", "Mã phụ tùng đã tồn tại"

#### EXPECTED DB
- ❌ NO NEW RECORD

#### ERD CONSTRAINTS
- ✅ **UNIQUE**: Constraint enforced

#### PASS IF
- Error message rõ ràng về duplicate
- DB không có record mới

#### FAIL IF
- Duplicate record được tạo (vi phạm UNIQUE)

---

### SCENARIO A04: Create với FK Invalid → Reject

**MODULE**: ALL entities with FK  
**ACTION**: CREATE  
**ENTITY**: ~60 entities có FK references

#### PRECONDITIONS
- User đã login

#### STEPS
1. Navigate đến Create screen
2. Nhập **FK field** với giá trị **KHÔNG TỒN TẠI** trong parent table:
   - `quotations.customer_id` = 99999 (không tồn tại trong `customers`)
   - `repair_orders.customer_id` = 88888
3. Click "Save"

#### EXPECTED UI
- ❌ Error: "Khách hàng không tồn tại", "ID không hợp lệ"

#### EXPECTED DB
- ❌ NO NEW RECORD

#### ERD CONSTRAINTS
- ✅ **FK Validation**: FK references must exist

#### PASS IF
- Error message về FK invalid
- DB không có record mới

---

### SCENARIO A05: Create với Required Field NULL → Reject

**MODULE**: ALL (67 entities)  
**ACTION**: CREATE

#### PRECONDITIONS
- User đã login

#### STEPS
1. Navigate đến Create screen
2. **BỎ TRỐNG** 1 hoặc nhiều **required fields** (NOT NULL)
3. Click "Save"

#### EXPECTED UI
- ❌ Error: "Trường này là bắt buộc", "[Field name] không được để trống"

#### EXPECTED DB
- ❌ NO NEW RECORD

#### ERD CONSTRAINTS
- ✅ **NOT NULL**: Enforced

#### PASS IF
- Error message về required field
- DB không thay đổi

---

### SCENARIO A06: Create với Data Type Mismatch → Reject

**MODULE**: ALL (67 entities)  
**ACTION**: CREATE

#### PRECONDITIONS
- User đã login

#### STEPS
1. Navigate đến Create screen
2. Nhập **string** vào **numeric field** (e.g., `base_price` = "abc")
3. Nhập **invalid date** vào **date field**
4. Click "Save"

#### EXPECTED UI
- ❌ Error: "Giá trị phải là số", "Ngày không hợp lệ"

#### EXPECTED DB
- ❌ NO NEW RECORD

#### ERD CONSTRAINTS
- ✅ **Type Validation**: INT, DECIMAL, DATE, TIMESTAMP enforced

---

### SCENARIO A07: Create với Length Exceeded → Reject

**MODULE**: Entities with VARCHAR(N) constraints  
**ACTION**: CREATE

#### PRECONDITIONS
- User đã login

#### STEPS
1. Navigate đến Create screen
2. Nhập **string > max length**:
   - `users.email` > 255 chars
   - `parts.part_number` > 20 chars
3. Click "Save"

#### EXPECTED UI
- ❌ Error: "Email quá dài (tối đa 255 ký tự)", "Mã phụ tùng không được vượt quá 20 ký tự"

#### EXPECTED DB
- ❌ NO NEW RECORD

---

### SCENARIO A08: Create với Enum Invalid → Reject

**MODULE**: Entities with ENUM fields  
**ACTION**: CREATE  
**ENTITY**: `leads.status`, `quotations.status`, `repair_orders.status`, etc.

#### PRECONDITIONS
- User đã login

#### STEPS
1. Navigate đến Create screen
2. Chọn (hoặc inject) **ENUM value không hợp lệ**:
   - `leads.status` = "INVALID_STATUS" (không nằm trong NEW, CONTACTED, QUALIFIED, etc.)
3. Click "Save"

#### EXPECTED UI
- ❌ Error: "Trạng thái không hợp lệ", "Vui lòng chọn giá trị hợp lệ"

#### EXPECTED DB
- ❌ NO NEW RECORD

---

### SCENARIO A09: Verify Audit Fields Auto-Populated

**MODULE**: ALL (67 entities)  
**ACTION**: CREATE

#### PRECONDITIONS
- User đã login (known user_id)

#### STEPS
1. Create valid record (theo A01)
2. Query DB để check audit fields

#### EXPECTED UI
- ✅ Success (như A01)

#### EXPECTED DB
- ✅ **`created_at`**: Timestamp = thời điểm hiện tại (tolerance ±5 seconds)
- ✅ **`created_by`**: user_id của user đang login (nếu có field này)
- ✅ **`updated_at`**: Timestamp = created_at (hoặc NULL nếu chưa update)
- ✅ **`deleted_at`**: NULL (soft delete entities)

#### PASS IF
- `created_at` auto-populated
- `created_by` = current user_id (nếu có)

#### FAIL IF
- Audit fields = NULL
- `created_by` = incorrect user_id

---

## GROUP B – READ & PERSIST

**Purpose**: Verify data retrieval and persistence after reload.

---

### SCENARIO B01: Read by PK → Correct

**MODULE**: ALL (67 entities)  
**ACTION**: READ

#### PRECONDITIONS
- Database có ít nhất 1 existing record

#### STEPS
1. Navigate đến List screen
2. Click vào 1 record để xem Detail
3. Verify **ALL fields** hiển thị chính xác

#### EXPECTED UI
- ✅ Detail screen hiển thị đầy đủ thông tin
- ✅ Tất cả fields match với DB

#### EXPECTED DB
- ✅ Query `SELECT * FROM [table] WHERE id = [record_id]` trả về đúng record

#### PASS IF
- UI hiển thị đúng tất cả fields

#### FAIL IF
- Một hoặc nhiều fields hiển thị sai
- Record không load được

---

### SCENARIO B02: Read by Filter → Correct

**MODULE**: ALL (67 entities)  
**ACTION**: READ (with filter)

#### PRECONDITIONS
- Database có nhiều records với values khác nhau

#### STEPS
1. Navigate đến List screen
2. Apply **filter** (e.g., status = "ACTIVE", category = "SEDAN")
3. Verify kết quả **chỉ hiển thị records match filter**

#### EXPECTED UI
- ✅ List hiển thị chỉ records thỏa filter
- ✅ Số lượng records correct

#### EXPECTED DB
- ✅ Query `SELECT * FROM [table] WHERE [filter_condition]` match UI

#### PASS IF
- UI hiển thị đúng records filtered

#### FAIL IF
- Hiển thị records không thỏa filter
- Thiếu records thỏa filter

---

### SCENARIO B03: Reload Page (F5) → Data Persists

**MODULE**: ALL (67 entities)  
**ACTION**: READ (after reload)

#### PRECONDITIONS
- User đã navigate đến List hoặc Detail screen

#### STEPS
1. Navigate đến List/Detail screen (hiển thị data)
2. Press **F5** (browser reload)
3. Verify data **vẫn hiển thị chính xác**

#### EXPECTED UI
- ✅ Sau reload, tất cả data vẫn hiển thị
- ✅ Không mất data
- ✅ Không redirect về blank screen

#### EXPECTED DB
- ✅ Data không thay đổi

#### PASS IF
- Data persists sau F5

#### FAIL IF
- Data biến mất sau reload
- Redirect về trang khác
- Error 404 / blank screen

---

### SCENARIO B04: Query with JOIN → Related Data Correct

**MODULE**: Entities with FK relationships  
**ACTION**: READ (with JOIN)

#### PRECONDITIONS
- Database có records với FK relationships

#### STEPS
1. Navigate đến screen hiển thị **related data** (e.g., Quotation detail hiển thị Customer Name)
2. Verify **related fields** hiển thị đúng

#### EXPECTED UI
- ✅ Related data hiển thị chính xác:
  - `quotations` screen hiển thị `customers.name`
  - `repair_orders` screen hiển thị `vehicle_models.model_name`

#### EXPECTED DB
- ✅ Query với JOIN:
  ```sql
  SELECT q.*, c.name AS customer_name
  FROM quotations q
  JOIN customers c ON q.customer_id = c.id
  WHERE q.id = [quote_id]
  ```
- ✅ `customer_name` match UI

#### PASS IF
- Related data hiển thị đúng

#### FAIL IF
- Related data = NULL hoặc incorrect
- FK không được resolve

---

## GROUP C – UPDATE

**Purpose**: Verify record modification.

---

### SCENARIO C01: Update với Valid Data → Success

**MODULE**: ALL (67 entities)  
**ACTION**: UPDATE

#### PRECONDITIONS
- Database có existing record

#### STEPS
1. Navigate đến Edit/Update screen cho 1 record
2. Modify 1 hoặc nhiều fields với **valid data**
3. Click "Save"
4. Verify success message
5. Check DB

#### EXPECTED UI
- ✅ Success message: "Cập nhật thành công"
- ✅ Redirect về Detail hoặc List
- ✅ Updated fields hiển thị giá trị mới

#### EXPECTED DB
- ✅ Record updated với giá trị mới
- ✅ `updated_at` = timestamp hiện tại
- ✅ `updated_by` = current user_id (nếu có)
- ✅ Fields không modify **không thay đổi**

#### PASS IF
- UI hiển thị success
- DB có updated values
- `updated_at` auto-updated

#### FAIL IF
- Data không update
- `updated_at` không thay đổi

---

### SCENARIO C02: Update với Invalid Data → Reject

**MODULE**: ALL (67 entities)  
**ACTION**: UPDATE

#### PRECONDITIONS
- Database có existing record

#### STEPS
1. Navigate đến Edit screen
2. Modify field với **invalid data** (email sai format, phone sai, etc.)
3. Click "Save"

#### EXPECTED UI
- ❌ Error message (tương tự A02)

#### EXPECTED DB
- ❌ NO CHANGE - Record không update

#### PASS IF
- Error message hiển thị
- DB không thay đổi

---

### SCENARIO C03: Update PK → Reject (Immutable)

**MODULE**: ALL (67 entities)  
**ACTION**: UPDATE (attempt PK change)

#### PRECONDITIONS
- Database có existing record

#### STEPS
1. Navigate đến Edit screen
2. Attempt to modify **PK field** (e.g., `id`)
3. Click "Save"

#### EXPECTED UI
- ❌ PK field **disabled** (không thể edit) HOẶC
- ❌ Error: "ID không thể thay đổi"

#### EXPECTED DB
- ❌ PK không thay đổi

#### PASS IF
- PK field disabled HOẶC error message

---

### SCENARIO C04: Update FK Invalid → Reject

**MODULE**: Entities with FK  
**ACTION**: UPDATE

#### PRECONDITIONS
- Database có existing record

#### STEPS
1. Navigate đến Edit screen
2. Update **FK field** với giá trị **không tồn tại**
3. Click "Save"

#### EXPECTED UI
- ❌ Error: "Khách hàng không tồn tại"

#### EXPECTED DB
- ❌ NO CHANGE

---

### SCENARIO C05: Partial Update → Only Changed Fields

**MODULE**: ALL (67 entities)  
**ACTION**: UPDATE (partial)

#### PRECONDITIONS
- Database có record với nhiều fields

#### STEPS
1. Navigate đến Edit screen
2. Modify **CHỈ 1 FIELD** (e.g., `customers.phone`)
3. Click "Save"
4. Query DB

#### EXPECTED UI
- ✅ Success

#### EXPECTED DB
- ✅ **Chỉ field được modify** thay đổi
- ✅ **Tất cả fields khác** KHÔNG THAY ĐỔI
- ✅ `updated_at` thay đổi

#### PASS IF
- Chỉ modified field update
- Các fields khác giữ nguyên

#### FAIL IF
- Các fields khác bị clear/reset về NULL

---

## GROUP D – DELETE

**Purpose**: Verify delete behaviors (soft/hard/cascade/restrict).

---

### SCENARIO D01: Soft Delete → Flag Set, Data Preserved

**MODULE**: Entities with soft delete (deleted_at)  
**ACTION**: DELETE (soft)  
**ENTITY**: `users`, `customers`, `parts`, `suppliers`, etc.

#### PRECONDITIONS
- Database có existing record

#### STEPS
1. Navigate đến List screen
2. Select 1 record
3. Click "Delete" hoặc "Deactivate"
4. Confirm deletion
5. Query DB directly

#### EXPECTED UI
- ✅ Success message: "Xóa thành công" hoặc "Vô hiệu hóa thành công"
- ✅ Record **biến mất** khỏi List screen (if soft delete filters out)

#### EXPECTED DB
- ✅ Record **VẪN TỒN TẠI** trong table
- ✅ **`deleted_at`** = timestamp hiện tại (NOT NULL)
- ✅ Hoặc **`status`** = "INACTIVE" (nếu dùng status flag)
- ✅ Tất cả data **được bảo toàn**

#### PASS IF
- `deleted_at` được set
- Data vẫn trong DB
- UI không hiển thị record (nếu filter by deleted_at IS NULL)

#### FAIL IF
- Record bị **xóa vật lý** (hard delete)
- `deleted_at` = NULL

---

### SCENARIO D02: Hard Delete No Children → Success

**MODULE**: Entities without FK references  
**ACTION**: DELETE (hard)  
**ENTITY**: `scoring_rules`, `system_settings`, etc. (nếu không có child records)

#### PRECONDITIONS
- Database có record **KHÔNG CÓ** child records (FK references)

#### STEPS
1. Navigate đến List
2. Select record
3. Click "Delete"
4. Confirm
5. Query DB

#### EXPECTED UI
- ✅ Success: "Xóa thành công"

#### EXPECTED DB
- ✅ Record **BỊ XÓA VẬT LÝ** (không tồn tại trong table)

#### PASS IF
- Record không còn trong DB

#### FAIL IF
- Record vẫn tồn tại

---

### SCENARIO D03: Hard Delete CASCADE → All Deleted

**MODULE**: Entities with CASCADE FK  
**ACTION**: DELETE (cascade)  
**ENTITY**: `roles` → `role_permissions` (CASCADE)

#### PRECONDITIONS
- Database có parent record (`roles`)
- Parent có child records (`role_permissions`)

#### STEPS
1. Xác định parent record có children (e.g., role_id = 2 có 5 permissions)
2. Delete parent record (`roles.id = 2`)
3. Confirm
4. Query DB

#### EXPECTED UI
- ✅ Success

#### EXPECTED DB
- ✅ **Parent record** bị xóa vật lý
- ✅ **ALL child records** bị xóa vật lý (CASCADE):
  - `role_permissions` WHERE role_id = 2 → ALL DELETED

#### PASS IF
- Parent + children đều bị xóa

#### FAIL IF
- Children vẫn tồn tại (orphaned records)

---

### SCENARIO D04: Hard Delete RESTRICT → Reject

**MODULE**: Entities with RESTRICT FK  
**ACTION**: DELETE (attempt with children)  
**ENTITY**: `customers` có `quotations` (RESTRICT)

#### PRECONDITIONS
- Database có parent record có children
- FK onDelete = RESTRICT

#### STEPS
1. Attempt to delete parent record có child records
2. Confirm

#### EXPECTED UI
- ❌ Error: "Không thể xóa. Khách hàng này có báo giá liên kết", "Vui lòng xóa báo giá trước"

#### EXPECTED DB
- ❌ **NO CHANGE** - Parent và children đều **VẪN TỒN TẠI**

#### PASS IF
- Error message rõ ràng
- Data không bị xóa

#### FAIL IF
- Parent hoặc children bị xóa (vi phạm data integrity)

---

### SCENARIO D05: Delete Record with File → File Removed

**MODULE**: Entities with file uploads  
**ACTION**: DELETE  
**ENTITY**: `pds_checklists` (photos), `work_logs` (photos)

#### PRECONDITIONS
- Database có record với file uploads (photos array)
- Files exist trong storage

#### STEPS
1. Xác định record có files (e.g., `pds_checklists.photos = ["/uploads/pds/123.jpg", "/uploads/pds/456.jpg"]`)
2. Delete record
3. Check storage directory

#### EXPECTED UI
- ✅ Success

#### EXPECTED DB
- ✅ Record deleted (soft hoặc hard)

#### EXPECTED FILE SYSTEM
- ✅ **Files bị xóa** từ storage:
  - `/uploads/pds/123.jpg` → NOT FOUND
  - `/uploads/pds/456.jpg` → NOT FOUND

#### PASS IF
- Record deleted
- Files removed từ storage

#### FAIL IF
- Files vẫn tồn tại (orphaned files)

---

## GROUP E – FILE & ATTACHMENT

**Purpose**: Verify file upload/delete/persistence.

**Entities with File Fields**:
- `pds_checklists.photos` (JSON array)
- `work_logs.photos` (JSON array)
- `qc_checklists.photos` (JSON array, nếu có)

---

### SCENARIO E01: Upload Valid File → Success, Correct Path

**MODULE**: Service  
**ACTION**: FILE UPLOAD  
**ENTITY**: `pds_checklists`, `work_logs`

#### PRECONDITIONS
- User đã login
- PDS hoặc Work Log form đã load

#### STEPS
1. Navigate đến PDS Create/Edit hoặc Work Log form
2. Click "Upload Photo"
3. Select **valid image file** (e.g., .jpg, .png, < max_upload_size)
4. Confirm upload
5. Click "Save"
6. Query DB

#### EXPECTED UI
- ✅ File preview hiển thị (thumbnail)
- ✅ Success message
- ✅ File name hiển thị trong form

#### EXPECTED DB
- ✅ **`photos`** field (JSON array) chứa path:
  ```json
  ["/uploads/pds/20260204_160000_image1.jpg"]
  ```
- ✅ Path format đúng chuẩn

#### EXPECTED FILE SYSTEM
- ✅ File **tồn tại** tại path:
  - `/uploads/pds/20260204_160000_image1.jpg`
- ✅ File size, format chính xác

#### PASS IF
- File uploaded
- Path saved in DB
- File exists in storage

#### FAIL IF
- File không tồn tại
- Path incorrect
- File corrupted

---

### SCENARIO E02: Upload Invalid Format → Reject

**MODULE**: Service  
**ACTION**: FILE UPLOAD (invalid)  
**ENTITY**: `pds_checklists`, `work_logs`

#### PRECONDITIONS
- User đã login

#### STEPS
1. Navigate đến Upload form
2. Attempt to upload **invalid file format** (e.g., .exe, .zip, .pdf)
3. Confirm

#### EXPECTED UI
- ❌ Error: "Chỉ chấp nhận file ảnh (.jpg, .png, .gif)", "Định dạng file không hợp lệ"

#### EXPECTED DB
- ❌ NO CHANGE

#### EXPECTED FILE SYSTEM
- ❌ File **KHÔNG được lưu**

#### PASS IF
- Error message
- File không upload

---

### SCENARIO E03: Upload Exceed Size → Reject

**MODULE**: Service  
**ACTION**: FILE UPLOAD (large file)  
**ENTITY**: `pds_checklists`, `work_logs`

#### PRECONDITIONS
- System setting `max_upload_size` = 10MB (ví dụ)

#### STEPS
1. Navigate đến Upload form
2. Attempt to upload **file > max_upload_size** (e.g., 15MB)
3. Confirm

#### EXPECTED UI
- ❌ Error: "File quá lớn. Kích thước tối đa: 10MB"

#### EXPECTED DB
- ❌ NO CHANGE

#### EXPECTED FILE SYSTEM
- ❌ File không được lưu

---

### SCENARIO E04: Delete Record → File Removed

**MODULE**: Service  
**ACTION**: DELETE (with files)  
**ENTITY**: `pds_checklists`, `work_logs`

> **Note**: Scenario này **overlap với D05**. Có thể reference D05.

#### (Xem D05 - Delete Record with File)

---

## GROUP F – STATE & WORKFLOW

**Purpose**: Verify lifecycle transitions and business rules.

**Entities with State**:
- `leads` (NEW → CONTACTED → QUALIFIED → PROPOSAL → NEGOTIATION → WON/DEAD)
- `quotations` (DRAFT → SENT → APPROVED → CONTRACT / LOST/EXPIRED)
- `repair_orders` (PENDING → IN_PROGRESS → QC → READY → DELIVERED)
- `bay_assignments` (ASSIGNED → IN_PROGRESS → COMPLETED/CANCELLED)
- `invoices` (UNPAID → PARTIAL → PAID)
- `vins` (AVAILABLE → ALLOCATED → SOLD)

---

### SCENARIO F01: Valid Transition → Success

**MODULE**: CRM, Sales, Service, Accounting  
**ACTION**: STATE CHANGE (valid)  
**ENTITY**: Pattern cho entities có workflow

#### PRECONDITIONS
- Database có record ở trạng thái ban đầu

#### STEPS
1. Navigate đến Detail/Edit screen
2. Change status từ **current state → next valid state**:
   - Lead: NEW → CONTACTED
   - Quotation: DRAFT → SENT
   - RO: PENDING → IN_PROGRESS
3. Click "Save" hoặc "Update Status"

#### EXPECTED UI
- ✅ Success message
- ✅ Status hiển thị **new state**

#### EXPECTED DB
- ✅ **`status`** field updated to new state
- ✅ **`updated_at`** updated

#### PASS IF
- Status transition success
- DB updated

#### FAIL IF
- Status không thay đổi

#### EXAMPLE INSTANCES

**F01-LEADS**:
```
Before:
- leads.status = "NEW"

Action:
- Change status to "CONTACTED"

After:
- leads.status = "CONTACTED" ✅
```

**F01-QUOTATIONS**:
```
Before:
- quotations.status = "DRAFT"

Action:
- Click "Send Quotation"

After:
- quotations.status = "SENT" ✅
```

---

### SCENARIO F02: Invalid Transition → Reject

**MODULE**: CRM, Sales, Service  
**ACTION**: STATE CHANGE (invalid)

#### PRECONDITIONS
- Database có record ở trạng thái ban đầu

#### STEPS
1. Navigate đến Detail/Edit
2. Attempt **INVALID transition**:
   - Lead: NEW → WON (skip CONTACTED, QUALIFIED, PROPOSAL, NEGOTIATION)
   - Quotation: DRAFT → CONTRACT (skip SENT, APPROVED)
   - RO: PENDING → DELIVERED (skip IN_PROGRESS, QC, READY)
3. Click "Save"

#### EXPECTED UI
- ❌ Error: "Chuyển trạng thái không hợp lệ", "Vui lòng chuyển trạng thái theo quy trình"
- ❌ HOẶC UI **KHÔNG CHO PHÉP** chọn invalid state (dropdown filtered)

#### EXPECTED DB
- ❌ **Status KHÔNG THAY ĐỔI**

#### PASS IF
- Error message HOẶC UI prevent invalid transition
- DB không update

#### FAIL IF
- Invalid transition được phép
- Status jump qua các bước

---

### SCENARIO F03: State Change → Audit Logged

**MODULE**: Service (Bay Status Logs)  
**ACTION**: STATE CHANGE (with audit)  
**ENTITY**: `bay_assignments` → `bay_status_logs`

#### PRECONDITIONS
- Database có `bay_assignments` record ở trạng thái ASSIGNED

#### STEPS
1. Update `bay_assignments.status` từ ASSIGNED → IN_PROGRESS
2. Click "Save"
3. Query `bay_status_logs` table

#### EXPECTED UI
- ✅ Success

#### EXPECTED DB
- ✅ **`bay_assignments.status`** = "IN_PROGRESS"
- ✅ **`bay_status_logs`** có **NEW RECORD**:
  ```sql
  bay_status_logs:
  - bay_id: [ID]
  - assignment_id: [ID]
  - old_status: "ASSIGNED"
  - new_status: "IN_PROGRESS"
  - changed_at: timestamp
  - changed_by: user_id
  ```

#### PASS IF
- Status updated
- Audit log created

#### FAIL IF
- Audit log không được tạo

---

## GROUP G – VALIDATION & ERROR

**Purpose**: Verify meaningful error messages.

> **Note**: Group G **overlap** với nhiều scenarios trong A02, A03, A04, A05, A06, A07, A08, C02, C03, C04, D04.  
> Group G tập trung vào **quality of error messages**, không phải logic validation.

---

### SCENARIO G01: PK Null/Duplicate → Reject with Clear Message

> **Reference**: A03 (Duplicate), A05 (NULL)

#### EXPECTED UI
- ❌ **Clear, user-friendly error message**:
  - ✅ "Email đã tồn tại" (thay vì "Error: Unique constraint violation")
  - ✅ "Số điện thoại đã được sử dụng"
  - ✅ "Trường này là bắt buộc" (thay vì "Error: NOT NULL constraint")

---

### SCENARIO G02: FK Non-Existent → Reject with Clear Message

> **Reference**: A04, C04

#### EXPECTED UI
- ❌ "Khách hàng không tồn tại. Vui lòng chọn khách hàng hợp lệ."
- ❌ KHÔNG PHẢI: "Error: Foreign key constraint failed"

---

### SCENARIO G03: Required Null → Reject with Clear Message

> **Reference**: A05

#### EXPECTED UI
- ❌ "Part Number là bắt buộc"
- ❌ "Vui lòng nhập Email"

---

### SCENARIO G04: Business Rule Violation → Reject + Meaningful Error

**MODULE**: Sales, Accounting  
**ACTION**: CREATE/UPDATE (violate business rules)

#### PRECONDITIONS
- System settings:
  - `max_discount_percentage` = 10
  - `deposit_percentage_min` = 10

#### STEPS
1. Attempt to create Quotation với **discount > 10%**
2. Click "Save"

#### EXPECTED UI
- ❌ **Meaningful error**: "Chiết khấu không được vượt quá 10% (cần phê duyệt quản lý)"
- ❌ KHÔNG PHẢI: "Error: Validation failed"

#### EXPECTED DB
- ❌ NO CHANGE

#### PASS IF
- Error message rõ ràng, hướng dẫn user (e.g., "cần phê duyệt")

#### FAIL IF
- Generic error (e.g., "Error 500", "Invalid input")

#### OTHER EXAMPLES

**G04-DEPOSIT**:
```
Business Rule: Deposit >= 10% base_price

Attempt:
- base_price = 1,000,000,000
- deposit_amount = 50,000,000 (5% < 10%)

Expected Error:
- "Tiền đặt cọc tối thiểu phải từ 10% giá xe (100,000,000 VND)"
```

---

## GROUP H – CROSS-SCREEN & END-TO-END

**Purpose**: Verify data consistency across modules.

---

### SCENARIO H01: Create at A → Visible at B

**MODULE**: CRM → Sales  
**ACTION**: CREATE (cross-module visibility)

#### PRECONDITIONS
- User đã login

#### STEPS
1. **Module CRM**: Create new Customer (phone = "0909888777")
2. Click "Save"
3. Navigate đến **Module Sales** → Create Quotation
4. Search customer bằng phone "0909888777"

#### EXPECTED UI
- ✅ Customer **xuất hiện trong dropdown/search** trong Sales module
- ✅ Có thể select customer để tạo Quotation

#### EXPECTED DB
- ✅ `customers` table có record mới
- ✅ `quotations.customer_id` có thể reference customer này

#### PASS IF
- Customer visible cross-module

#### FAIL IF
- Customer không xuất hiện trong Sales

---

### SCENARIO H02: Update at A → Reflected at B

**MODULE**: CRM → Sales  
**ACTION**: UPDATE (cross-module reflection)

#### PRECONDITIONS
- Database có Customer (id = 10, phone = "0909111222")
- Quotation (id = 5, customer_id = 10) đã tồn tại

#### STEPS
1. **Module CRM**: Update Customer (id = 10) → change phone to "0909333444"
2. Click "Save"
3. Navigate đến **Module Sales** → View Quotation (id = 5)

#### EXPECTED UI
- ✅ Quotation detail hiển thị **customer phone mới**: "0909333444"

#### EXPECTED DB
- ✅ `customers.phone` = "0909333444"
- ✅ JOIN query reflect updated value

#### PASS IF
- Updated data reflected cross-module

---

### SCENARIO H03: Delete at A → Handled at B

**MODULE**: CRM → Sales (RESTRICT)  
**ACTION**: DELETE (cross-module constraint)

#### PRECONDITIONS
- Customer (id = 10) có Quotation (id = 5)

#### STEPS
1. **Module CRM**: Attempt to delete Customer (id = 10)
2. Confirm

#### EXPECTED UI
- ❌ Error: "Không thể xóa. Khách hàng này có báo giá liên kết."

#### EXPECTED DB
- ❌ Customer **VẪN TỒN TẠI**

#### PASS IF
- Delete rejected (RESTRICT FK)

#### ALTERNATIVE (SOFT DELETE):

**STEPS**:
1. **Module CRM**: Soft delete Customer (id = 10) (set deleted_at)
2. Navigate đến **Module Sales** → View Quotation (id = 5)

#### EXPECTED UI
- ✅ Quotation hiển thị Customer với indicator: "Khách hàng đã bị xóa" hoặc strikethrough

#### EXPECTED DB
- ✅ `customers.deleted_at` NOT NULL
- ✅ `quotations.customer_id` vẫn reference customer

---

### SCENARIO H04: File Upload at A → Accessible from B

**MODULE**: Service (PDS) → Sales (Contract)  
**ACTION**: FILE (cross-screen access)

#### PRECONDITIONS
- Contract (id = 1) có link đến PDS (id = 10)
- PDS (id = 10) có photos

#### STEPS
1. **Module Service**: Upload photos vào PDS (id = 10)
2. Navigate đến **Module Sales** → View Contract (id = 1)
3. Click vào "View PDS Photos"

#### EXPECTED UI
- ✅ Photos hiển thị chính xác

#### EXPECTED DB
- ✅ `pds_checklists.photos` JSON array có paths
- ✅ Files tồn tại trong storage

---

### SCENARIO H05: Multi-Screen Workflow → Data Consistent

**Purpose**: Test 15 key E2E flows.

---

#### E2E FLOW 1: Lead → Customer → Quotation → Contract → Invoice → Payment

**Modules**: CRM → Sales → Accounting

**STEPS**:
1. **CRM**: Create Lead (phone = "0909555666", status = NEW)
2. **CRM**: Update Lead → status = CONTACTED
3. **CRM**: Update Lead → status = QUALIFIED
4. **CRM**: Convert Lead → Customer (customer_id = 100)
5. **Sales**: Create Quotation (customer_id = 100, quote_number = "QT/2026/999")
6. **Sales**: Update Quotation → status = SENT
7. **Sales**: Update Quotation → status = APPROVED
8. **Sales**: Create Contract (quotation_id = 50, contract_number = "CT/2026/888")
9. **Accounting**: Create Invoice (contract_id = 50, invoice_number = "INV/2026/777")
10. **Accounting**: Create Payment (invoice_id = 80, amount = 1,000,000,000)
11. **Accounting**: Update Invoice → status = PAID

**EXPECTED UI**:
- ✅ Mỗi bước hiển thị success
- ✅ Cross-module references chính xác
- ✅ Lead history logged

**EXPECTED DB**:
- ✅ `leads` (id = X, status = QUALIFIED)
- ✅ `customers` (id = 100, converted từ lead)
- ✅ `quotations` (id = Y, customer_id = 100, status = APPROVED)
- ✅ `contracts` (id = 50, quotation_id = Y)
- ✅ `invoices` (id = 80, contract_id = 50, status = PAID)
- ✅ `payments` (invoice_id = 80, amount match)

**PASS IF**:
- Toàn bộ flow thành công
- Data consistency across 3 modules

---

#### E2E FLOW 2: Customer → Test Drive → Quotation → VIN Allocation → PDS

**Modules**: CRM → Sales → Service

**STEPS**:
1. **CRM**: Create Customer (id = 101)
2. **Sales**: Create Test Drive (customer_id = 101, vehicle_model_id = 2)
3. **Sales**: Create Quotation (customer_id = 101, vehicle_model_id = 2)
4. **Sales**: Update Quotation → APPROVED
5. **Sales**: Allocate VIN (vin_number = "VIN123456", quotation_id = X)
6. **Sales**: Update VIN → status = ALLOCATED
7. **Sales**: Create Contract (quotation_id = X, vin_id = Y)
8. **Service**: Create PDS Checklist (contract_id = Z)
9. **Service**: Upload PDS photos
10. **Service**: Complete PDS
11. **Sales**: Update VIN → status = SOLD

**EXPECTED UI**:
- ✅ Mỗi màn hình hiển thị đúng data
- ✅ VIN status transitions correct

**EXPECTED DB**:
- ✅ `test_drives` linked to customer + model
- ✅ `vins` status: AVAILABLE → ALLOCATED → SOLD
- ✅ `pds_checklists` linked to contract
- ✅ Photos tồn tại

---

#### E2E FLOW 3: Customer → Service Appointment → RO → Work Log → QC → Invoice

**Modules**: CRM → Service → Accounting

**STEPS**:
1. **CRM**: Create Customer (id = 102)
2. **Service**: Create Service Appointment (customer_id = 102, bay_id = 1)
3. **Service**: Create Repair Order (appointment_id = X, status = PENDING)
4. **Service**: Update RO → status = IN_PROGRESS
5. **Service**: Create Bay Assignment (ro_id = Y, bay_id = 1)
6. **Service**: Create Work Log (ro_id = Y, photos uploaded)
7. **Service**: Update RO → status = QC
8. **Service**: Create QC Checklist (ro_id = Y, result = PASS)
9. **Service**: Update RO → status = READY
10. **Accounting**: Create Invoice (ro_id = Y)
11. **Accounting**: Update Invoice → PAID

**EXPECTED DB**:
- ✅ `service_appointments` → `repair_orders` linkage
- ✅ `bay_assignments` linked
- ✅ `work_logs` với photos
- ✅ `qc_checklists` linked
- ✅ `invoices` linked to RO
- ✅ `bay_status_logs` có audit trail

---

#### E2E FLOW 4-15: (Tương tự, chi tiết trong execution)

**FLOW 4**: Part → Stock Movement → PO → Stock Take  
**FLOW 5**: Accessory → Quotation → Contract  
**FLOW 6**: Service Package → Service Quote → RO  
**FLOW 7**: Employee → RO Assignment → Bay Assignment  
**FLOW 8**: Complaint → Interaction → Resolution  
**FLOW 9**: Marketing Campaign → Lead → Conversion  
**FLOW 10**: Insurance Contract → Claim → Payment  
**FLOW 11**: Fixed Asset → Depreciation → Accounting  
**FLOW 12**: Supplier → PO → Stock Movement  
**FLOW 13**: VIN → Contract → Delivery  
**FLOW 14**: Bay → Assignment → RO → Bay Status Log  
**FLOW 15**: Loyalty Points → Transaction → Redemption

> **Note**: Chi tiết steps cho FLOW 4-15 sẽ được expand trong execution phase.

---

## 📊 SUMMARY

### Total Scenario Patterns

| Group | Patterns | Notes |
|-------|----------|-------|
| **A** | 9 | Apply to 67 entities |
| **B** | 4 | Apply to 67 entities |
| **C** | 5 | Apply to 67 entities |
| **D** | 5 | Apply to 67 entities |
| **E** | 4 | Apply to ~10 entities with files |
| **F** | 3 | Apply to ~20 entities with state |
| **G** | 4 | Overlap with A/C/D, focus on error message quality |
| **H** | 15 | Specific E2E flows |
| **TOTAL** | **49 patterns** | **~2,000 test cases** when applied to entities |

---

## ✅ NEXT STEPS

1. **Review & Approve** - Antigravity review scenarios
2. **Execution** - OpenCode execute theo UAT Plan
3. **Logging** - Record results trong UAT Execution Log
4. **Classification** - Classify failures as BUG or CR
5. **Remediation** - Fix bugs, re-test
6. **Sign-off** - Final approval

---

**End of UAT Scenarios v6.0**
