# BÁO CÁO PHÂN TÍCH DỮ LIỆU HÓA ĐƠN POS30

## TÓM TẮT THỰC HIỆN

Báo cáo này phân tích cấu trúc dữ liệu hóa đơn từ hệ thống POS30 (Point of Sale/ERP) tại thư mục `C:/Users/Than Minh Trung/Desktop/Lumina/POS30`. Hệ thống có 2 luồng hóa đơn chính: **BizDoc System** (đơn hàng B2B/Sales Order) và **Retail System** (đơn bán lẻ POS).

---

## 1. PHÂN TÍCH CẤU TRÚC TABLE HÓA ĐƠN

### 1.1. BIZDOC SYSTEM - HỆ THỐNG ĐƠN HÀNG B2B

#### Table 1: vw_tmp_B30BizDoc (Master Header Table)

**Vai trò:** Chứa thông tin header của tất cả business documents (đơn hàng, hóa đơn)

**Khóa chính (PK):** `Id`, `BizDocId` (định dạng: A01 + timestamp + DocCode suffix)

**Ý nghĩa các field quan trọng:**

| Field | Ý nghĩa | Kiểu dữ liệu | Ví dụ |
|-------|---------|--------------|-------|
| BizDocId | Mã đơn hàng duy nhất | String | A0100001394868S1 |
| DocNo | Số hóa đơn/đơn hàng | String | CT001-23012626 |
| DocCode | Loại tài liệu | String | S1, SO, KH, CT, X1 |
| DocDate | Ngày hóa đơn | Date | 2026-01-23 |
| DocTime | Thời gian tạo | DateTime | 2026-01-22 14:50:23.880 |
| CustomerCode | Mã khách hàng | String | GV (Givral) |
| ContactPerson | Người liên hệ | String | - |
| Address | Địa chỉ khách hàng | String | - |
| PersonTel | Số điện thoại | String | - |
| EmployeeCode | Nhân viên bán hàng | String | - |
| StoreCode | Mã cửa hàng | String | A01 |
| CurrencyCode | Loại tiền tệ | String | VND |
| ExchangeRate | Tỷ giá hối đoái | Decimal | 1.00000 |
| TotalAmount | Tổng tiền hóa đơn | Decimal | - |
| TotalOriginalAmount | Tổng trước giảm giá | Decimal | - |
| TotalAmount3 | Tổng thuế | Decimal | - |
| TotalQuantity | Tổng số lượng | Decimal | 26 |
| DiscountAmount | Số tiền giảm giá | Decimal | - |
| DiscountRate | Tỷ lệ giảm giá | Decimal | - |
| DocStatus | Trạng thái tài liệu | Int | 4 (Posted) |
| PaymentTypeCode | Phương thức thanh toán | String | CASH, BANK |

**Ý nghĩa DocCode:**
- S1 = Sales Order 1 (Đơn hàng bán hàng chung)
- SO = Sales Order (Đơn hàng bán hàng chi tiết)
- KH = Khoản hàng (Đặt cọc/Tiền ứng trước)
- CT = Customer Order (Đơn hàng khách hàng đặc biệt)
- X1 = Xuất hàng (Phiếu xuất hàng)

**Sample Record:**
```
BizDocId: A0100001394868S1
DocNo: CT001-23012626
DocDate: 2026-01-23
CustomerCode: GV
TotalAmount: .00 (chưa xuất hàng)
TotalQuantity: 26
PaymentTypeCode: CASH
```

---

#### Table 2: vw_tmp_B30BizDocDetail (Line Item Detail Table)

**Vai trò:** Chứa chi tiết từng dòng sản phẩm trong đơn hàng

**Khóa chính (PK):** `Id`, `RowId`

**Khóa ngoại (FK):**
- `BizDocId` → vw_tmp_B30BizDoc.BizDocId
- `CustomerCode` → vw_tmp_B20Customer.Code
- `ItemCode` → vw_tmp_B20Item.Code

**Ý nghĩa các field quan trọng:**

| Field | Ý nghĩa | Kiểu dữ liệu | Ví dụ |
|-------|---------|--------------|-------|
| BizDocId | Link tới header | String | A0100000003150C2 |
| RowId | Mã dòng duy nhất | String | A0100000100143C2 |
| CustomerCode | Mã khách hàng | String | 0305244843 |
| ItemCode | Mã sản phẩm | String | 11A, D6, 4A, 17A |
| Description | Tên sản phẩm | String | - |
| Unit | Đơn vị tính | String | CAI |
| Quantity | Số lượng | Decimal | 80.0000 |
| Quantity9 | Số lượng quy đổi | Decimal | 80.0000 |
| OriginalUnitCost | Giá gốc (cost) | Decimal | - |
| UnitCost | Giá bán | Decimal | 162000.00000 |
| OriginalAmount | Thành tiền trước giảm | Decimal | 12960000.00 |
| Amount | Thành tiền sau giảm | Decimal | 12960000.00 |
| OriginalAmount3 | Thuế trước giảm | Decimal | - |
| Amount3 | Thuế sau giảm | Decimal | - |
| TaxCode | Mã thuế | String | R10 |
| TaxRate | Tỷ lệ thuế | Decimal | 0.1000 (10%) |
| DiscountAmount | Số tiền giảm giá | Decimal | - |
| OriginalDiscountAmount | Giảm giá gốc | Decimal | - |
| EstimatedTimeDelivery | Ngày giao hàng dự kiến | DateTime | 2020-08-21 00:00:00.000 |
| IsGiftItem | Quà tặng | Boolean | 0 |
| WarehouseCode | Mã kho | String | - |
| StandardPrice | Giá chuẩn | Decimal | - |
| LatestUnitPrice | Giá gần nhất | Decimal | - |

**Sample Record:**
```
BizDocId: A0100000003150C2
RowId: A0100000100143C2
ItemCode: 11A
Quantity: 80.0000
UnitCost: 162000.00000
Amount: 12960000.00
TaxCode: R10 (10%)
```

---

#### Table 3: vw_tmp_B30BizDocReceipt (Payment Receipt Table)

**Vai trò:** Chứa thông tin phiếu thu thanh toán

**Khóa chính (PK):** `Id`, `Stt`

**Khóa ngoại (FK):**
- `BizDocId_SO` → vw_tmp_B30BizDoc.BizDocId
- `CustomerCode` → vw_tmp_B20Customer.Code

**Ý nghĩa các field quan trọng:**

| Field | Ý nghĩa | Kiểu dữ liệu | Ví dụ |
|-------|---------|--------------|-------|
| Stt | Mã phiếu thu | String | A010000000000047 |
| DocDate | Ngày phiếu thu | Date | 2020-04-30 |
| DocNo | Số phiếu thu | String | KH001-300420-09 |
| CustomerCode | Mã khách hàng | String | GV |
| Description | Diễn giải | String | - |
| PayType | Loại thanh toán | Int | 01 |
| PaymentTypeCode | Phương thức thanh toán | String | CASH, TRANSFER, BANK |
| CurrencyCode | Loại tiền tệ | String | VND |
| TotalOriginalAmount | Số tiền gốc | Decimal | - |
| TotalAmount | Số tiền thực thu | Decimal | 310000 |
| DocStatus | Trạng thái | Int | 4 (Posted) |
| Loai_Ps | Loại phiếu thu | String | TAOPTDATCOC (Đặt cọc) |
| BizDocId_SO | Link tới đơn hàng | String | A0100000000310SO |

**Sample Record:**
```
Stt: A010000000000047
DocNo: KH001-300420-09
CustomerCode: GV
PaymentTypeCode: CASH
TotalAmount: 310000
BizDocId_SO: A0100000000310SO
```

---

#### Table 4: vw_tmp_B30AccDocInvoice (Accounting Invoice Table)

**Vai trò:** Chứa thông tin hóa đơn kế toán (hóa đơn VAT)

**Khóa chính (PK):** `Id`, `Stt`

**Khóa ngoại (FK):**
- `BizDocId_SO` → vw_tmp_B30BizDoc.BizDocId
- `CustomerCode` → vw_tmp_B20Customer.Code

**Ý nghĩa các field quan trọng:**

| Field | Ý nghĩa | Kiểu dữ liệu | Ví dụ |
|-------|---------|--------------|-------|
| Stt | Mã hóa đơn kế toán | String | A01539737 |
| DocCode | Loại tài liệu | String | H2 (Hóa đơn) |
| DocDate | Ngày hóa đơn | Date | 2021-10-07 |
| TransCode | Mã nghiệp vụ | String | 2301 |
| CustomerCode | Mã khách hàng | String | - |
| ItemCode | Mã sản phẩm | String | BANH |
| Unit | Đơn vị tính | String | DŨNG |
| Quantity | Số lượng | Decimal | 1.0000 |
| OriginalUnitPrice | Giá gốc | Decimal | - |
| UnitPrice | Đơn giá | Decimal | 4063636.00 |
| OriginalAmount | Thành tiền gốc | Decimal | 4063636.00 |
| Amount | Thành tiền | Decimal | 4063636.00 |
| TaxCode | Mã thuế | String | R10 |
| TaxRate | Tỷ lệ thuế | Decimal | 0.1000 (10%) |
| Amount3 | Số tiền thuế | Decimal | 406364.00 |
| HHAmount | Chiết khấu | Decimal | - |
| AmountCK | Số tiền kiểm tra | Decimal | 70000.00 |

**Sample Record:**
```
ItemCode: BANH DŨNG
Quantity: 1.0000
UnitPrice: 4063636.00
Amount: 4063636.00
TaxRate: 0.1000
Amount3: 406364.00 (10% thuế)
```

---

### 1.2. RETAIL SYSTEM - HỆ THỐNG BÁN LẺ POS

#### Table 5: vw_tmp_B30RetailData (Retail Header Table)

**Vai trò:** Chứa thông tin header của giao dịch bán lẻ

**Khóa chính (PK):** `Id`, `UniqueId`, `PosDocId`

**Ý nghĩa các field quan trọng:**

| Field | Ý nghĩa | Kiểu dữ liệu | Ví dụ |
|-------|---------|--------------|-------|
| Id | Mã duy nhất | Int | - |
| BranchCode | Mã chi nhánh | String | A01, ZZZ |
| Year | Năm | Int | 2023, 2025 |
| DocCode | Loại tài liệu | String | R1 (Retail) |
| DocGroup | Nhóm tài liệu | Int | 2 (Sales) |
| PosDocId | Mã POS Document | String | 250100006539459 |
| DocNo | Số tài liệu | String | B0001-01042501 |
| DocDate | Ngày giao dịch | Date | 2025-04-01 |
| BillTime | Thời gian xuất bill | DateTime | 2025-04-01 06:09:24.483 |
| CustomerCode | Mã khách hàng | String | KHBL0000000000001193 |
| MemberCardNo | Số thẻ thành viên | String | - |
| TotalSaleAmount | Tổng doanh thu | Decimal | 138000.00 |
| TotalDeductAmount | Tổng giảm giá | Decimal | - |
| TotalAmount | Tổng thanh toán | Decimal | 138000.00 |
| TotalQuantity | Tổng số lượng | Decimal | 3.00 |
| CurrencyCode | Loại tiền tệ | String | VND |
| ExchangeRate | Tỷ giá | Decimal | 1.0000 |
| TotalAmountVND | Tổng tiền VND | Decimal | 138000.00 |
| StatusCode | Trạng thái | Int | 8 (Posted) |
| StoreCode | Mã cửa hàng | String | 01, 05, 08 |
| Posted | Đã ghi sổ | Boolean | 1 |
| BillType | Loại bill | String | - |
| IsNotEnvoice | Chưa xuất hóa đơn | Boolean | 0 |

**Sample Record:**
```
PosDocId: 250100006539459
DocNo: B0001-01042501
CustomerCode: KHBL0000000000001193
TotalSaleAmount: 138000.00
TotalQuantity: 3.00
StoreCode: 01
Posted: 1
```

---

#### Table 6: vw_tmp_B30RetailDetailData (Retail Line Item Detail Table)

**Vai trò:** Chứa chi tiết từng dòng sản phẩm trong giao dịch bán lẻ

**Khóa chính (PK):** `Id`, `RowId`

**Khóa ngoại (FK):**
- `PosDocId` → vw_tmp_B30RetailData.PosDocId
- `ItemCode` → vw_tmp_B20Item.Code

**Ý nghĩa các field quan trọng:**

| Field | Ý nghĩa | Kiểu dữ liệu | Ví dụ |
|-------|---------|--------------|-------|
| StoreCode | Mã cửa hàng | String | 21, 08 |
| DocDate | Ngày giao dịch | Date | 2025-07-27 |
| PosDocId | Link tới header | String | - |
| RowId | Mã dòng | String | R12100018213715 |
| Barcode | Mã vạch | String | - |
| ItemCode | Mã sản phẩm | String | X006, MK038, MK037, BX059 |
| ItemName | Tên sản phẩm | String | PATE CHAUD BO, DẦN CÂY XOẮN |
| ItemUnit | Đơn vị tính | String | CAI, CAY, HỢP, TÁI |
| UnitPrice | Đơn giá | Decimal | 30000.00 |
| Quantity | Số lượng | Decimal | 1.00 |
| SaleAmount | Thành tiền bán | Decimal | 30000.00 |
| DiscountAmount | Giảm giá | Decimal | .00 |
| Amount | Thành tiền | Decimal | 30000.00 |
| AfterDeductAmount | Sau giảm giá | Decimal | - |
| WarehouseCode | Mã kho | String | K08, K39 |
| BillType | Loại bill | String | - |
| IsNotDeduct | Không giảm giá | Boolean | 0/1 |

**Sample Record:**
```
ItemCode: X006, ItemName: PATE CHAUD BO, UnitPrice: 30000.00
Quantity: 1.00, Amount: 30000.00
ItemCode: MK038, ItemName: DẦN CÂY XOẮN, UnitPrice: .00, Quantity: 1.00, Amount: .00 (quà tặng/dịch vụ)
```

---

### 1.3. TABLE KHÁCH HÀNG

#### Table 7: vw_tmp_B20Customer (B2B Customer Table)

**Vai trò:** Chứa thông tin khách hàng doanh nghiệp (B2B)

**Khóa chính (PK):** `Id`, `Code`

**Ý nghĩa các field quan trọng:**

| Field | Ý nghĩa | Kiểu dữ liệu | Ví dụ |
|-------|---------|--------------|-------|
| Code | Mã khách hàng | String | 0300608092-012 |
| Name | Tên khách hàng | String | NGAN HANG TMCP PHAT TRIEN TPHCM |
| Name2 | Tên khác | String | - |
| Address | Địa chỉ | String | 207-209 NGUYEN TRAI, PHUONG 2, QUAN 5, TPHCM |
| BillingAddress | Địa chỉ xuất hóa đơn | String | - |
| Person | Người liên hệ | String | - |
| PersonTel | Điện thoại người liên hệ | String | - |
| Tel | Điện thoại | String | - |
| Email | Email | String | thaottm@hdbank.com.vn |
| TaxRegNo | Mã số thuế | String | 0300608092-012 |
| IdCardNo | Số CMND | String | - |
| Birthday | Ngày sinh | Date | - |
| CustomerType | Loại khách hàng | Int | 2 |
| IsCustomer | Là khách hàng | Boolean | 1 |
| IsSupplier | Là nhà cung cấp | Boolean | 0/1 |
| IsActive | Đang hoạt động | Boolean | 1 |

---

#### Table 8: vw_tmp_B20RetailCustomer (B2C Customer Table)

**Vai trò:** Chứa thông tin khách hàng bán lẻ (B2C)

**Khóa chính (PK):** `Id`, `Code` (định dạng: KHBL...)

**Ý nghĩa các field quan trọng:**

| Field | Ý nghĩa | Kiểu dữ liệu | Ví dụ |
|-------|---------|--------------|-------|
| Code | Mã khách hàng | String | KHBL0000000000001196 |
| MemberCardCode | Số thẻ thành viên | String | 0907390868 |
| Name | Tên khách hàng | String | Khang Phúc |
| Address | Địa chỉ | String | 123, COMMUNE026109 |
| PhoneNumber | Số điện thoại | String | - |
| Email | Email | String | - |
| Gender | Giới tính | Int | 1 |
| AccumRevenue | Doanh thu tích lũy | Decimal | .00 |
| AccumPoint | Điểm tích lũy | Decimal | .00 |
| AccountBalance | Số dư tài khoản | Decimal | .00 |
| LevelCode | Cấp độ khách hàng | String | T, BRONZE |
| FirstBuyDate | Ngày mua đầu tiên | Date | - |
| LastBuyDate | Ngày mua gần nhất | Date | - |
| BranchCode | Mã chi nhánh | String | A01 |
| IsActive | Đang hoạt động | Boolean | 1 |

---

### 1.4. TABLE SẢN PHẨM

#### Table 9: vw_tmp_B20Item (Master Item Table)

**Vai trò:** Chứa danh mục sản phẩm bán hàng

**Khóa chính (PK):** `Id`, `Code`

**Ý nghĩa các field quan trọng:**

| Field | Ý nghĩa | Kiểu dữ liệu | Ví dụ |
|-------|---------|--------------|-------|
| Code | Mã sản phẩm | String | ., .., 10A, 10B, 10D, 11A |
| BarCode | Mã vạch | String | - |
| Name | Tên sản phẩm | String | ., . (cần join với bảng khác) |
| Unit | Đơn vị tính | String | CAI, CÁI |
| ItemType | Loại sản phẩm | Int | 2 |
| ItemGroupCode | Mã nhóm sản phẩm | String | G00004, G00027 |
| ShortCode | Mã ngắn | String | - |
| IsActive | Đang hoạt động | Boolean | 1 |
| IsPOS | Có bán POS | Boolean | 0/1 |
| DeptCode | Mã phòng ban | String | 01 |
| IsNotDeduct | Không giảm giá | Boolean | 0 |
| ItemGroupType | Loại nhóm sản phẩm | String | - |

---

#### Table 10: vw_tmp_B20ItemPrice (Item Price Table)

**Vai trò:** Chứa giá bán sản phẩm

**Khóa chính (PK):** `Id`

**Ý nghĩa các field quan trọng:**

| Field | Ý nghĩa | Kiểu dữ liệu | Ví dụ |
|-------|---------|--------------|-------|
| ItemCode | Mã sản phẩm | String | 10A, 10B, 10D, 11A |
| VariantCode | Mã biến thể | String | - |
| UnitPrice | Đơn giá | Decimal | 180000.00, 170000.00 |
| TerritoryCode | Mã khu vực | String | - |
| EffectiveDate | Ngày hiệu lực | DateTime | 2025-07-14 14:25:00.000 |
| BeginTime | Thời gian bắt đầu | DateTime | - |
| EndTime | Thời gian kết thúc | DateTime | - |

---

## 2. MAPPING DỮ LIỆU GIỮA CÁC TABLE

### 2.1. SỰ LIÊN KẾT GIỮA CÁC TABLE

```
HỆ THỐNG BIZDOC (B2B):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
vw_tmp_B30BizDoc (Header - Master)
  ├── BizDocId (PK) ──┬──► vw_tmp_B30BizDocDetail (Line Items)
  │                   │     ├── BizDocId (FK)
  │                   │     ├── CustomerCode ──► vw_tmp_B20Customer.Code
  │                   │     └── ItemCode ──► vw_tmp_B20Item.Code
  │                   │
  │                   └──► vw_tmp_B30BizDocDetailSO (SO Details)
  │                         ├── BizDocId (FK)
  │                         ├── CustomerCode ──► vw_tmp_B20Customer.Code
  │                         └── ItemCode ──► vw_tmp_B20Item.Code
  │
  ├── BizDocId (PK) ──┬──► vw_tmp_B30BizDocReceipt (Payments)
  │                   │     ├── BizDocId_SO (FK)
  │                   │     └── CustomerCode ──► vw_tmp_B20Customer.Code
  │                   │
  │                   └──► vw_tmp_B30AccDocInvoice (Invoices)
  │                         ├── BizDocId_SO (FK)
  │                         └── CustomerCode ──► vw_tmp_B20Customer.Code
  │
  └── CustomerCode ──► vw_tmp_B20Customer (Customer Info)
                           ├── Code (PK)
                           ├── TaxRegNo (Mã số thuế)
                           └── Name (Tên khách hàng)

HỆ THỐNG RETAIL (B2C):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
vw_tmp_B30RetailData (Retail Header)
  ├── PosDocId (PK) ──┬──► vw_tmp_B30RetailDetailData (Line Items)
  │                    │     ├── PosDocId (FK)
  │                    │     └── ItemCode ──► vw_tmp_B20Item.Code
  │                    │
  │                    └──► vw_tmp_B30PosDocSalesRetail (POS Sales)
  │
  └── CustomerCode ──► vw_tmp_B20RetailCustomer (Customer Info)
                           ├── Code (PK)
                           ├── MemberCardCode (Số thẻ thành viên)
                           └── Name (Tên khách hàng)

TABLE SẢN PHẨM:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
vw_tmp_B20Item (Master Item)
  ├── Code (PK) ──┬──► vw_tmp_B20ItemPrice (Giá bán)
  │                │     └── ItemCode (FK)
  │                │
  │                ├── Code ──► vw_tmp_B20ItemInfo (Thông tin sản phẩm)
  │                │         └── ItemCode (FK)
  │                │
  │                └── ItemGroupCode ──► vw_tmp_B20ItemGroup (Nhóm SP)
  │                                  └── Code (FK)
  │
  └── ItemCatgCode ──► vw_tmp_B20ItemCatg (Danh mục SP)
                    └── Code (FK)
```

### 2.2. NGUỒN DỮ LIỆU CHO CÁC THÔNG TIN HÓA ĐƠN

| Thông tin | Nguồn table (BizDoc) | Nguồn table (Retail) | Ghi chú |
|-----------|---------------------|---------------------|---------|
| Mã hóa đơn | vw_tmp_B30BizDoc.BizDocId | vw_tmp_B30RetailData.PosDocId | - |
| Số hóa đơn | vw_tmp_B30BizDoc.DocNo | vw_tmp_B30RetailData.DocNo | - |
| Ngày hóa đơn | vw_tmp_B30BizDoc.DocDate | vw_tmp_B30RetailData.DocDate | - |
| Thời gian | vw_tmp_B30BizDoc.DocTime | vw_tmp_B30RetailData.BillTime | - |
| Mã khách hàng | vw_tmp_B30BizDoc.CustomerCode | vw_tmp_B30RetailData.CustomerCode | - |
| Tên khách hàng | vw_tmp_B20Customer.Name | vw_tmp_B20RetailCustomer.Name | JOIN |
| Địa chỉ KH | vw_tmp_B20Customer.Address | vw_tmp_B20RetailCustomer.Address | JOIN |
| SĐT KH | vw_tmp_B20Customer.PersonTel | vw_tmp_B20RetailCustomer.PhoneNumber | JOIN |
| Mã số thuế KH | vw_tmp_B20Customer.TaxRegNo | NULL (thường B2C không có) | JOIN |
| Tên sản phẩm | vw_tmp_B20Item.Name (cần mapping thêm) | vw_tmp_B30RetailDetailData.ItemName | Retail có sẵn |
| Số lượng | vw_tmp_B30BizDocDetail.Quantity | vw_tmp_B30RetailDetailData.Quantity | - |
| Đơn giá | vw_tmp_B30BizDocDetail.UnitCost | vw_tmp_B30RetailDetailData.UnitPrice | - |
| Thành tiền | vw_tmp_B30BizDocDetail.Amount | vw_tmp_B30RetailDetailData.Amount | - |
| Thuế | vw_tmp_B30BizDocDetail.Amount3 | NULL (Retail thường không tách thuế) | JOIN với TaxRate |
| Tổng tiền hóa đơn | vw_tmp_B30BizDoc.TotalAmount | vw_tmp_B30RetailData.TotalAmount | - |
| Giảm giá | vw_tmp_B30BizDoc.DiscountAmount | vw_tmp_B30RetailData.TotalDeductAmount | - |
| Mã thuế | vw_tmp_B30BizDocDetail.TaxCode | - | - |
| Tỷ lệ thuế | vw_tmp_B30BizDocDetail.TaxRate | - | 0.1000 = 10% |
| Phương thức thanh toán | vw_tmp_B30BizDoc.PaymentTypeCode | - | - |

---

## 3. LOGIC JOIN VÀ QUY TẮC XỬ LÝ DỮ LIỆU

### 3.1. SQL JOIN CHO HỆ THỐNG BIZDOC

```sql
-- LẤY DỮ LIỆU HOÁA ĐƠN B2B ĐẦY ĐỦ
SELECT
    -- THÔNG TIN HÓA ĐƠN (HEADER)
    h.BizDocId AS MaHoaDon,
    h.DocNo AS SoHoaDon,
    h.DocDate AS NgayHoaDon,
    h.DocTime AS ThoiGian,
    h.DocCode AS LoaiHoaDon,
    
    -- THÔNG TIN KHÁCH HÀNG
    h.CustomerCode AS MaKhachHang,
    c.Name AS TenKhachHang,
    c.Address AS DiaChiKH,
    c.PersonTel AS SDTKH,
    c.TaxRegNo AS MaSoThueKH,
    h.PaymentTypeCode AS PhuongThucThanhToan,
    
    -- THÔNG TIN SẢN PHẨM (LINE ITEMS)
    d.RowId AS MaDong,
    d.ItemCode AS MaSanPham,
    i.Name AS TenSanPham,
    d.Unit AS DonViTinh,
    d.Quantity AS SoLuong,
    d.UnitCost AS DonGia,
    d.Amount AS ThanhTien,
    
    -- THÔNG TIN THUẾ
    d.TaxCode AS MaThue,
    d.TaxRate AS TyLeThue,
    d.Amount3 AS TienThue,
    
    -- THÔNG TIN GIẢM GIÁ
    d.DiscountAmount AS GiamGiaDong,
    d.OriginalDiscountAmount AS GiamGiaGoc,
    
    -- TỔNG HÓA ĐƠN
    h.TotalOriginalAmount AS TongTienTruocGiam,
    h.TotalAmount AS TongTienSauGiam,
    h.DiscountAmount AS GiamGiaHoaDon,
    h.TotalQuantity AS TongSoLuong,
    h.TotalAmount3 AS TongTienThue,
    h.DocStatus AS TrangThai,
    
    -- THÔNG TIN PHIẾU THU
    r.Stt AS MaPhieuThu,
    r.DocNo AS SoPhieuThu,
    r.TotalAmount AS TienDaThu,
    r.PaymentTypeCode AS PhuongThucThu
    
FROM vw_tmp_B30BizDoc h
LEFT JOIN vw_tmp_B20Customer c ON h.CustomerCode = c.Code
LEFT JOIN vw_tmp_B30BizDocDetail d ON h.BizDocId = d.BizDocId
LEFT JOIN vw_tmp_B20Item i ON d.ItemCode = i.Code
LEFT JOIN vw_tmp_B30BizDocReceipt r ON h.BizDocId = r.BizDocId_SO

WHERE h.DocCode IN ('S1', 'SO', 'CT', 'X1')

ORDER BY h.DocDate, h.DocNo, d.BuiltinOrder;
```

### 3.2. SQL JOIN CHO HỆ THỐNG RETAIL

```sql
-- LẤY DỮ LIỆU HOÁA ĐƠN BÁN LẺ ĐẦY ĐỦ
SELECT
    -- THÔNG TIN HÓA ĐƠN (HEADER)
    h.PosDocId AS MaHoaDon,
    h.DocNo AS SoHoaDon,
    h.DocDate AS NgayHoaDon,
    h.BillTime AS ThoiGian,
    h.DocCode AS LoaiHoaDon,
    
    -- THÔNG TIN KHÁCH HÀNG
    h.CustomerCode AS MaKhachHang,
    c.Name AS TenKhachHang,
    c.PhoneNumber AS SDTKH,
    c.MemberCardCode AS SoTheThanhVien,
    c.LevelCode AS CapDoKH,
    
    -- THÔNG TIN CỬA HÀNG
    h.StoreCode AS MaCuaHang,
    h.BranchCode AS MaChiNhanh,
    
    -- THÔNG TIN SẢN PHẨM (LINE ITEMS)
    d.RowId AS MaDong,
    d.ItemCode AS MaSanPham,
    d.ItemName AS TenSanPham,
    d.ItemUnit AS DonViTinh,
    d.Quantity AS SoLuong,
    d.UnitPrice AS DonGia,
    d.SaleAmount AS ThanhTienBan,
    d.DiscountAmount AS GiamGia,
    d.Amount AS ThanhTien,
    
    -- TỔNG HÓA ĐƠN
    h.TotalSaleAmount AS TongDoanhThu,
    h.TotalDeductAmount AS TongGiamGia,
    h.TotalAmount AS TongThanhToan,
    h.TotalQuantity AS TongSoLuong,
    h.StatusCode AS TrangThai
    
FROM vw_tmp_B30RetailData h
LEFT JOIN vw_tmp_B20RetailCustomer c ON h.CustomerCode = c.Code
LEFT JOIN vw_tmp_B30RetailDetailData d ON h.PosDocId = d.PosDocId

WHERE h.DocCode = 'R1'

ORDER BY h.DocDate, h.DocNo, d.BuiltinOrder;
```

### 3.3. QUY TẮC XỬ LÝ DỮ LIỆU

#### 3.3.1. Xử lý NULL

| Field | Quy tắc xử lý | Mô tả |
|-------|--------------|-------|
| TenKhachHang | COALESCE(c.Name, 'Khách vãng lai') | Nếu NULL thì hiển thị "Khách vãng lai" |
| SDTKH | COALESCE(c.PersonTel, '') | Nếu NULL để trống |
| MaSoThueKH | COALESCE(c.TaxRegNo, '') | Nếu NULL để trống (thường B2C) |
| TienThue | COALESCE(d.Amount3, 0) | Nếu NULL thì = 0 |
| GiamGiaDong | COALESCE(d.DiscountAmount, 0) | Nếu NULL thì = 0 |
| DonGia | COALESCE(d.UnitCost, d.UnitPrice, 0) | Ưu tiên UnitCost (BizDoc) hoặc UnitPrice (Retail) |

#### 3.3.2. Làm tròn số liệu

| Field | Quy tắc làm tròn | Lý do |
|-------|-----------------|-------|
| DonGia | ROUND(?, 0) | Làm tròn đến nguyên |
| ThanhTien | ROUND(?, 0) | Làm tròn đến nguyên |
| TienThue | ROUND(?, 0) | Làm tròn đến nguyên |
| TongTien | ROUND(?, 0) | Làm tròn đến nguyên |
| SoLuong | ROUND(?, 2) | Làm tròn đến 2 chữ số thập phân |

#### 3.3.3. Quy đổi đơn vị

```sql
-- TÍNH THÀNH TIỀN = ĐƠN GIÁ × SỐ LƯỢNG
CASE 
    WHEN d.Quantity9 IS NOT NULL AND d.Quantity9 != 0 
        THEN ROUND(d.UnitCost * d.Quantity9, 0)
    ELSE ROUND(d.UnitCost * d.Quantity, 0)
END AS ThanhTien

-- TÍNH TIỀN THUẾ = TỔNG TIỀN × TỶ LỆ THUẾ
ROUND(d.Amount * d.TaxRate, 0) AS TienThue

-- TỔNG TIỀN SAU GIẢM GIÁ
ROUND(d.Amount - d.DiscountAmount, 0) AS ThanhTienSauGiam
```

#### 3.3.4. Mapping mã loại hóa đơn (DocCode)

| DocCode | Ý nghĩa tiếng Việt | English |
|---------|-------------------|---------|
| S1 | Đơn hàng bán hàng 1 | Sales Order 1 |
| SO | Đơn hàng bán hàng | Sales Order |
| KH | Phiếu thu đặt cọc | Deposit Receipt |
| CT | Đơn hàng khách hàng | Customer Order |
| X1 | Phiếu xuất hàng | Goods Issue |
| H2 | Hóa đơn | Invoice |
| R1 | Bán lẻ loại 1 | Retail Type 1 |
| R2 | Bán lẻ loại 2 | Retail Type 2 (Trả hàng) |
| PN | Phiếu nhập | Purchase Receipt |
| PT | Phiếu thu tiền | Cash Receipt |
| BN | Thanh toán ngân hàng | Bank Payment |

#### 3.3.5. Mapping phương thức thanh toán (PaymentTypeCode)

| PaymentTypeCode | Ý nghĩa |
|----------------|---------|
| CASH | Tiền mặt |
| BANK | Chuyển khoản |
| TRANSFER | Khoản thu |
| DEPOSIT | Đặt cọc |
| CREDIT | Công nợ |

#### 3.3.6. Mapping trạng thái (DocStatus/StatusCode)

| Mã | Ý nghĩa |
|----|---------|
| 0 | Mới tạo (New) |
| 1 | Đã xác nhận (Confirmed) |
| 2 | Đã xử lý (Processed) |
| 4 | Đã ghi sổ (Posted) |
| 8 | Đã hoàn thành (Completed) |

---

## 4. DATASET HÓA ĐƠN ĐÃ CHUẨN HÓA

### 4.1. CẤU TRÚC DATASET CHUẨN

| Field | Kiểu dữ liệu | Nguồn | Mô tả |
|-------|--------------|-------|-------|
| MaHoaDon | VARCHAR(50) | BizDocId/PosDocId | Mã hóa đơn duy nhất |
| SoHoaDon | VARCHAR(50) | DocNo | Số hóa đơn |
| NgayHoaDon | DATE | DocDate | Ngày xuất hóa đơn |
| ThoiGian | DATETIME | DocTime/BillTime | Thời gian tạo hóa đơn |
| TenSanPham | VARCHAR(255) | ItemName/Item.Name | Tên sản phẩm |
| SoLuong | DECIMAL(10,2) | Quantity | Số lượng |
| DonGia | DECIMAL(18,0) | UnitCost/UnitPrice | Đơn giá |
| ThanhTien | DECIMAL(18,0) | Amount | Thành tiền |
| TienThue | DECIMAL(18,0) | Amount3 | Số tiền thuế |
| TyLeThue | DECIMAL(5,4) | TaxRate | Tỷ lệ thuế (0.1000 = 10%) |
| MaThue | VARCHAR(20) | TaxCode | Mã thuế (R10, R5, R0) |
| TongTien | DECIMAL(18,0) | TotalAmount | Tổng tiền hóa đơn |
| MaKhachHang | VARCHAR(50) | CustomerCode | Mã khách hàng |
| TenKhachHang | VARCHAR(255) | Customer.Name | Tên khách hàng |
| DiaChiKH | VARCHAR(500) | Customer.Address | Địa chỉ khách hàng |
| SDTKH | VARCHAR(50) | PersonTel/PhoneNumber | Số điện thoại |
| MaSoThueKH | VARCHAR(50) | TaxRegNo | Mã số thuế |
| PhuongThucThanhToan | VARCHAR(50) | PaymentTypeCode | Phương thức thanh toán |
| GiamGia | DECIMAL(18,0) | DiscountAmount | Số tiền giảm giá |
| TrangThai | INT | DocStatus/StatusCode | Trạng thái |
| LoaiHoaDon | VARCHAR(10) | DocCode | Loại hóa đơn |
| HeThong | VARCHAR(20) | - | BIZDOC hoặc RETAIL |

### 4.2. DỮ LIỆU MẪU

```
| MaHoaDon            | SoHoaDon          | NgayHoaDon  | TenSanPham       | SoLuong | DonGia    | ThanhTien   | TienThue | TongTien   | TenKhachHang              | PhuongThucThanhToan |
|---------------------|-------------------|-------------|------------------|---------|-----------|-------------|----------|------------|---------------------------|--------------------|
| A0100001394868S1    | CT001-23012626    | 2026-01-23  | BÁNH KEM         | 10.00   | 500000    | 5000000     | 500000   | 5500000    | CONG TY GIVRAL            | CASH               |
| A0100001394932S1    | CT001-23012628    | 2026-01-23  | BÁNH SINH NHẬT  | 28.00   | 450000    | 12600000    | 1260000  | 13860000   | CONG TY GIVRAL            | CASH               |
| 250100006539459     | B0001-01042501    | 2025-04-01  | PATE CHAUD BO    | 3.00    | 46000     | 138000      | 0        | 138000     | Khang Phúc                | CASH               |
| 250800006891945     | B0002-01042501    | 2025-04-27  | DẦN CÂY XOẮN    | 1.00    | 0         | 0           | 0        | 0          | ANH KHOA                  | CASH               |
```

---

## 5. ĐỀ XUẤT CẤU TRÚC DỮ LIỆU CHUẨN CHO HỆ THỐNG HÓA ĐƠN

### 5.1. BẢNG CHUẨN HÓA ĐƠN (INVOICE)

```sql
CREATE TABLE INVOICE (
    InvoiceID VARCHAR(50) PRIMARY KEY,
    InvoiceNo VARCHAR(50) NOT NULL,
    InvoiceDate DATE NOT NULL,
    InvoiceTime DATETIME,
    InvoiceType VARCHAR(10) NOT NULL,  -- B2B, B2C, RETAIL
    DocCode VARCHAR(10),               -- S1, SO, R1, etc.
    
    -- THÔNG TIN KHÁCH HÀNG
    CustomerID VARCHAR(50),
    CustomerName VARCHAR(255),
    CustomerAddress VARCHAR(500),
    CustomerPhone VARCHAR(50),
    CustomerTaxID VARCHAR(50),
    CustomerEmail VARCHAR(100),
    
    -- THÔNG TIN THANH TOÁN
    PaymentMethod VARCHAR(50),
    PaymentStatus VARCHAR(20),
    TotalAmount DECIMAL(18,0),
    TotalDiscount DECIMAL(18,0),
    TotalTax DECIMAL(18,0),
    GrandTotal DECIMAL(18,0),
    TotalQuantity DECIMAL(10,2),
    
    -- THÔNG TIN HỆ THỐNG
    StoreCode VARCHAR(20),
    BranchCode VARCHAR(10),
    EmployeeCode VARCHAR(50),
    
    -- THÔNG TIN E-INVOICE
    EInvoiceID VARCHAR(50),
    EInvoiceStatus VARCHAR(20),
    EInvoiceSeries VARCHAR(50),
    EInvoiceDate DATE,
    
    -- METADATA
    Status INT,                          -- 0: New, 1: Confirmed, 4: Posted, 8: Completed
    IsActive BOOLEAN,
    CreatedAt DATETIME,
    CreatedBy VARCHAR(50),
    ModifiedAt DATETIME,
    ModifiedBy VARCHAR(50),
    
    INDEX idx_invoice_no (InvoiceNo),
    INDEX idx_invoice_date (InvoiceDate),
    INDEX idx_customer (CustomerID),
    INDEX idx_status (Status)
);
```

### 5.2. BẢNG CHI TIẾT HÓA ĐƠN (INVOICE_DETAIL)

```sql
CREATE TABLE INVOICE_DETAIL (
    DetailID VARCHAR(50) PRIMARY KEY,
    InvoiceID VARCHAR(50) NOT NULL,
    
    -- THÔNG TIN SẢN PHẨM
    ItemCode VARCHAR(50),
    ItemName VARCHAR(255),
    ItemDescription TEXT,
    ItemUnit VARCHAR(20),
    ItemGroup VARCHAR(50),
    
    -- THÔNG TIN GIÁ & SỐ LƯỢNG
    Quantity DECIMAL(10,2),
    UnitPrice DECIMAL(18,0),
    LineAmount DECIMAL(18,0),
    LineDiscount DECIMAL(18,0),
    LineAmountAfterDiscount DECIMAL(18,0),
    
    -- THÔNG TIN THUẾ
    TaxCode VARCHAR(20),
    TaxRate DECIMAL(5,4),               -- 0.1000 = 10%
    TaxAmount DECIMAL(18,0),
    
    -- THÔNG TIN KHÁC
    SequenceNumber INT,
    IsGift BOOLEAN,
    IsPromotional BOOLEAN,
    OriginalLineAmount DECIMAL(18,0),
    
    -- METADATA
    CreatedAt DATETIME,
    CreatedBy VARCHAR(50),
    
    FOREIGN KEY (InvoiceID) REFERENCES INVOICE(InvoiceID) ON DELETE CASCADE,
    INDEX idx_invoice (InvoiceID),
    INDEX idx_item (ItemCode)
);
```

### 5.3. BẢNG THANH TOÁN HÓA ĐƠN (INVOICE_PAYMENT)

```sql
CREATE TABLE INVOICE_PAYMENT (
    PaymentID VARCHAR(50) PRIMARY KEY,
    InvoiceID VARCHAR(50) NOT NULL,
    
    -- THÔNG TIN THANH TOÁN
    PaymentDate DATE,
    PaymentMethod VARCHAR(50),
    PaymentAmount DECIMAL(18,0),
    PaymentReference VARCHAR(100),
    BankAccount VARCHAR(50),
    BankName VARCHAR(100),
    
    -- METADATA
    CreatedAt DATETIME,
    CreatedBy VARCHAR(50),
    
    FOREIGN KEY (InvoiceID) REFERENCES INVOICE(InvoiceID) ON DELETE CASCADE,
    INDEX idx_invoice (InvoiceID),
    INDEX idx_payment_date (PaymentDate)
);
```

### 5.4. BẢNG KHÁCH HÀNG (CUSTOMER)

```sql
CREATE TABLE CUSTOMER (
    CustomerID VARCHAR(50) PRIMARY KEY,
    CustomerType VARCHAR(20),            -- B2B, B2C
    CustomerName VARCHAR(255) NOT NULL,
    CustomerName2 VARCHAR(255),
    
    -- THÔNG TIN LIÊN HỆ
    ContactPerson VARCHAR(100),
    Address VARCHAR(500),
    Commune VARCHAR(100),
    District VARCHAR(100),
    City VARCHAR(100),
    Country VARCHAR(50),
    
    -- THÔNG TIN TRUYỀN THÔNG
    Phone VARCHAR(50),
    Mobile VARCHAR(50),
    Email VARCHAR(100),
    Fax VARCHAR(50),
    
    -- THÔNG TIN DOANH NGHIỆP (B2B)
    TaxID VARCHAR(50),
    IDCardNo VARCHAR(20),
    IDCardDate DATE,
    IDCardPlace VARCHAR(100),
    Birthday DATE,
    
    -- THÔNG TIN THANH VIÊN (B2C)
    MemberCardNo VARCHAR(50),
    MemberLevel VARCHAR(20),
    AccumulatedRevenue DECIMAL(18,0),
    AccumulatedPoints DECIMAL(10,2),
    AccountBalance DECIMAL(18,0),
    
    -- THÔNG TIN KHÁC
    IsActive BOOLEAN,
    FirstBuyDate DATE,
    LastBuyDate DATE,
    
    -- METADATA
    CreatedAt DATETIME,
    CreatedBy VARCHAR(50),
    ModifiedAt DATETIME,
    ModifiedBy VARCHAR(50),
    
    INDEX idx_name (CustomerName),
    INDEX idx_taxid (TaxID),
    INDEX idx_phone (Phone),
    INDEX idx_member_card (MemberCardNo)
);
```

### 5.5. BẢNG SẢN PHẨM (PRODUCT)

```sql
CREATE TABLE PRODUCT (
    ProductID VARCHAR(50) PRIMARY KEY,
    ProductCode VARCHAR(50) NOT NULL,
    ProductName VARCHAR(255) NOT NULL,
    ProductName2 VARCHAR(255),
    
    -- THÔNG TIN PHÂN LOẠI
    ProductCategory VARCHAR(50),
    ProductGroup VARCHAR(50),
    ProductType VARCHAR(20),
    
    -- THÔNG TIN ĐƠN VỊ
    BaseUnit VARCHAR(20),
    AlternativeUnit VARCHAR(20),
    ConvertRate DECIMAL(10,4),
    
    -- THÔNG TIN GIÁ
    StandardPrice DECIMAL(18,0),
    SalePrice DECIMAL(18,0),
    CostPrice DECIMAL(18,0),
    
    -- THÔNG TIN THUẾ
    TaxCode VARCHAR(20),
    TaxRate DECIMAL(5,4),
    
    -- THÔNG TIN KHO
    IsActive BOOLEAN,
    IsPOS BOOLEAN,
    IsWarehouse BOOLEAN,
    
    -- METADATA
    CreatedAt DATETIME,
    CreatedBy VARCHAR(50),
    ModifiedAt DATETIME,
    ModifiedBy VARCHAR(50),
    
    INDEX idx_code (ProductCode),
    INDEX idx_name (ProductName),
    INDEX idx_category (ProductCategory)
);
```

### 5.6. GIẢI THÍCH ĐỀ XUẤT CẤU TRÚC

**Ưu điểm của cấu trúc đề xuất:**

1. **Tính chuẩn hóa (Normalization):**
   - Tách riêng header và detail của hóa đơn
   - Tách riêng thông tin thanh toán
   - Giảm redundancy dữ liệu

2. **Định danh rõ ràng:**
   - InvoiceID làm khóa chính duy nhất
   - Có thể generate theo quy tắc: {Year}{Month}{Branch}{SeqNo}
   - VD: 202502A0100001

3. **Hỗ trợ nhiều loại hóa đơn:**
   - InvoiceType phân loại B2B, B2C, RETAIL
   - DocCode lưu trữ mã gốc từ hệ thống POS30

4. **Hỗ trợ thuế:**
   - Tách riêng TaxRate và TaxAmount
   - Dễ dàng báo cáo thuế (VAT)

5. **Hỗ trợ E-Invoice:**
   - Lưu trữ thông tin hóa đơn điện tử
   - Theo dõi trạng thái phát hành

6. **Hỗ trợ khách hàng đa dạng:**
   - CustomerType phân loại B2B/B2C
   - Thông tin thành viên tích điểm cho B2C
   - Thông tin doanh nghiệp (MST) cho B2B

7. **Index tối ưu:**
   - Index trên các field thường tìm kiếm
   - Tăng tốc độ query

---

## 6. GIẢ ĐỊNH VÀ HẠN CHẾ

### 6.1. GIẢ ĐỊNH

1. **Tên sản phẩm trong hệ thống BizDoc:**
   - Table vw_tmp_B20Item.Name chứa tên nhưng có thể không đầy đủ
   - Cần join thêm với vw_tmp_B20ItemInfo hoặc vw_tmp_B20Product để lấy tên chính xác

2. **Thuế trong hệ thống Retail:**
   - Giả định hệ thống bán lẻ không tách riêng thuế
   - Tỷ lệ thuế mặc định = 0% cho B2C

3. **Mapping mã sản phẩm:**
   - ItemCode trong vw_tmp_B30BizDocDetail có thể là code sản phẩm hoặc mã nhóm
   - Cần verify với vw_tmp_B20Item để xác định

4. **Quy tắc làm tròn:**
   - Giả định làm tròn đến nguyên (0 chữ số thập phân)
   - Cần xác nhận với nghiệp vụ nếu có quy tắc khác

### 6.2. HẠN CHẾ

1. **Dữ liệu mẫu:**
   - Chỉ phân tích được 500-520 bản ghi mỗi table
   - Cần verify với toàn bộ dữ liệu để đảm bảo logic chính xác

2. **Tên sản phẩm:**
   - Table vw_tmp_B20Item.Name có nhiều giá trị là dấu chấm "." hoặc ".."
   - Cần mapping với bảng khác để lấy tên đầy đủ

3. **Mối quan hệ phức tạp:**
   - Có nhiều loại tài liệu (DocCode) khác nhau
   - Cần xác định rõ loại nào là hóa đơn thực tế

4. **Thuế:**
   - Có thể có nhiều loại thuế khác ngoài VAT (ví dụ: thuế tiêu thụ đặc biệt)
   - Cần phân tích thêm vw_tmp_B30AccDocInvoice để xác định

---

## 7. KẾT LUẬN VÀ KHUYẾN NGHỊ

### 7.1. TỔNG KẾT

Hệ thống POS30 có 2 luồng hóa đơn chính:

1. **BizDoc System** - Đơn hàng B2B:
   - Table header: `vw_tmp_B30BizDoc`
   - Table detail: `vw_tmp_B30BizDocDetail`, `vw_tmp_B30BizDocDetailSO`
   - Table khách hàng: `vw_tmp_B20Customer`
   - Có đầy đủ thông tin thuế (TaxCode, TaxRate, Amount3)

2. **Retail System** - Đơn bán lẻ B2C:
   - Table header: `vw_tmp_B30RetailData`
   - Table detail: `vw_tmp_B30RetailDetailData`
   - Table khách hàng: `vw_tmp_B20RetailCustomer`
   - Có tên sản phẩm sẵn trong detail table

**Khóa ngoại chính:**
- BizDocId (BizDoc header ↔ BizDoc detail)
- PosDocId (Retail header ↔ Retail detail)
- CustomerCode (Hóa đơn ↔ Khách hàng)
- ItemCode (Detail ↔ Sản phẩm)

### 7.2. KHUYẾN NGHỊ TIẾP THEO

1. **Verify với nghiệp vụ:**
   - Xác nhận quy tắc làm tròn số liệu
   - Xác nhận logic tính thuế
   - Xác nhận phương thức thanh toán

2. **Phân tích thêm:**
   - Đọc toàn bộ dữ liệu (không giới hạn 500 records)
   - Phân tích thêm vw_tmp_B20Product để lấy tên sản phẩm đầy đủ
   - Phân tích thêm vw_tmp_B20ItemInfo để lấy thông tin chi tiết sản phẩm

3. **Triển khai:**
   - Tạo ETL process để extract dữ liệu từ các table gốc
   - Transform theo logic đã phân tích
   - Load vào cấu trúc chuẩn đã đề xuất

4. **Validation:**
   - So sánh tổng tiền từ header vs sum của detail
   - Kiểm tra tính nhất quán của số liệu
   - Validate với báo cáo từ hệ thống POS30

---

## 8. FILE ĐÍNH KÈM

- SQL queries để extract dữ liệu (Mục 3.1 và 3.2)
- Cấu trúc table chuẩn (Mục 5)
- Mapping field (Mục 2.2)

---

**Người phân tích:** AI Data Analyst
**Ngày phân tích:** 03/02/2026
**Nguồn dữ liệu:** C:/Users/Than Minh Trung/Desktop/Lumina/POS30
