-- ============================================================================
-- SQL SCRIPT CHUẨN HÓA DỮ LIỆU HÓA ĐƠN TỪ HỆ THỐNG POS30
-- ============================================================================
-- Mục đích: Extract và transform dữ liệu hóa đơn từ hệ thống POS30
--           sang định dạng chuẩn hóa
--
-- Sử dụng: Thay thế đường dẫn file CSV với đường dẫn thực tế
--          Chạy script trong SQL Server, MySQL, PostgreSQL hoặc PostgreSQL
--
-- Tác giả: AI Data Analyst
-- Ngày: 03/02/2026
-- ============================================================================

-- ============================================================================
-- PHẦN 1: IMPORT DỮ LIỆU TỪ CSV VÀO DATABASE
-- ============================================================================

-- Lưu ý: Đây là ví dụ cho SQL Server. Với MySQL/PostgreSQL cần điều chỉnh cú pháp

-- BẮT ĐẦU TRANSACTION
BEGIN TRANSACTION;

-- ========================================
-- TẠO TEMP TABLE ĐỂ IMPORT DỮ LIỆU
-- ========================================

-- Bảng Business Document Header
IF OBJECT_ID('tempdb..#B30BizDoc') IS NOT NULL DROP TABLE #B30BizDoc;
SELECT *
INTO #B30BizDoc
FROM OPENROWSET(
    BULK 'C:/Users/Than Minh Trung/Desktop/Lumina/POS30/vw_tmp_B30BizDoc.csv',
    FORMATFILE = 'C:/Users/Than Minh Trung/Desktop/Lumina/POS30/format_files/B30BizDoc_format.xml',
    FIRSTROW = 2
) AS t;

-- Bảng Business Document Detail
IF OBJECT_ID('tempdb..#B30BizDocDetail') IS NOT NULL DROP TABLE #B30BizDocDetail;
SELECT *
INTO #B30BizDocDetail
FROM OPENROWSET(
    BULK 'C:/Users/Than Minh Trung/Desktop/Lumina/POS30/vw_tmp_B30BizDocDetail.csv',
    FORMATFILE = 'C:/Users/Than Minh Trung/Desktop/Lumina/POS30/format_files/B30BizDocDetail_format.xml',
    FIRSTROW = 2
) AS t;

-- Bảng Customer
IF OBJECT_ID('tempdb..#B20Customer') IS NOT NULL DROP TABLE #B20Customer;
SELECT *
INTO #B20Customer
FROM OPENROWSET(
    BULK 'C:/Users/Than Minh Trung/Desktop/Lumina/POS30/vw_tmp_B20Customer.csv',
    FORMATFILE = 'C:/Users/Than Minh Trung/Desktop/Lumina/POS30/format_files/B20Customer_format.xml',
    FIRSTROW = 2
) AS t;

-- Bảng Item
IF OBJECT_ID('tempdb..#B20Item') IS NOT NULL DROP TABLE #B20Item;
SELECT *
INTO #B20Item
FROM OPENROWSET(
    BULK 'C:/Users/Than Minh Trung/Desktop/Lumina/POS30/vw_tmp_B20Item.csv',
    FORMATFILE = 'C:/Users/Than Minh Trung/Desktop/Lumina/POS30/format_files/B20Item_format.xml',
    FIRSTROW = 2
) AS t;

-- Bảng Retail Data
IF OBJECT_ID('tempdb..#B30RetailData') IS NOT NULL DROP TABLE #B30RetailData;
SELECT *
INTO #B30RetailData
FROM OPENROWSET(
    BULK 'C:/Users/Than Minh Trung/Desktop/Lumina/POS30/vw_tmp_B30RetailData.csv',
    FORMATFILE = 'C:/Users/Than Minh Trung/Desktop/Lumina/POS30/format_files/B30RetailData_format.xml',
    FIRSTROW = 2
) AS t;

-- Bảng Retail Detail Data
IF OBJECT_ID('tempdb..#B30RetailDetailData') IS NOT NULL DROP TABLE #B30RetailDetailData;
SELECT *
INTO #B30RetailDetailData
FROM OPENROWSET(
    BULK 'C:/Users/Than Minh Trung/Desktop/Lumina/POS30/vw_tmp_B30RetailDetailData.csv',
    FORMATFILE = 'C:/Users/Than Minh Trung/Desktop/Lumina/POS30/format_files/B30RetailDetailData_format.xml',
    FIRSTROW = 2
) AS t;

-- Bảng Retail Customer
IF OBJECT_ID('tempdb..#B20RetailCustomer') IS NOT NULL DROP TABLE #B20RetailCustomer;
SELECT *
INTO #B20RetailCustomer
FROM OPENROWSET(
    BULK 'C:/Users/Than Minh Trung/Desktop/Lumina/POS30/vw_tmp_B20RetailCustomer.csv',
    FORMATFILE = 'C:/Users/Than Minh Trung/Desktop/Lumina/POS30/format_files/B20RetailCustomer_format.xml',
    FIRSTROW = 2
) AS t;

-- ============================================================================
-- PHẦN 2: CHUẨN HÓA DỮ LIỆU HÓA ĐƠN B2B (BIZDOC)
-- ============================================================================

-- ========================================
-- TẠO BẢNG HÓA ĐƠN B2B HEADER ĐÃ CHUẨN HÓA
-- ========================================

IF OBJECT_ID('dbo.INVOICE_B2B') IS NOT NULL DROP TABLE dbo.INVOICE_B2B;
CREATE TABLE dbo.INVOICE_B2B (
    InvoiceID VARCHAR(50) PRIMARY KEY,
    InvoiceNo VARCHAR(50),
    InvoiceDate DATE,
    InvoiceTime DATETIME,
    InvoiceType VARCHAR(10),          -- S1, SO, KH, CT, X1
    SystemType VARCHAR(20) DEFAULT 'BIZDOC',

    -- Thông tin khách hàng
    CustomerID VARCHAR(50),
    CustomerName VARCHAR(255),
    CustomerAddress VARCHAR(500),
    CustomerPhone VARCHAR(50),
    CustomerTaxID VARCHAR(50),
    ContactPerson VARCHAR(100),

    -- Thông tin thanh toán
    PaymentMethod VARCHAR(50),
    TotalAmount DECIMAL(18,0),
    TotalDiscount DECIMAL(18,0),
    TotalTax DECIMAL(18,0),
    GrandTotal DECIMAL(18,0),
    TotalQuantity DECIMAL(10,2),

    -- Thông tin hệ thống
    BranchCode VARCHAR(10),
    StoreCode VARCHAR(20),
    EmployeeCode VARCHAR(50),
    DocStatus INT,

    -- Metadata
    CreatedAt DATETIME DEFAULT GETDATE(),
    CreatedBy VARCHAR(50) DEFAULT 'SYSTEM',

    INDEX idx_invoice_no (InvoiceNo),
    INDEX idx_invoice_date (InvoiceDate),
    INDEX idx_customer (CustomerID),
    INDEX idx_status (DocStatus)
);

-- ========================================
-- TẠO BẢNG CHI TIẾT HÓA ĐƠN B2B
-- ========================================

IF OBJECT_ID('dbo.INVOICE_B2B_DETAIL') IS NOT NULL DROP TABLE dbo.INVOICE_B2B_DETAIL;
CREATE TABLE dbo.INVOICE_B2B_DETAIL (
    DetailID VARCHAR(50) PRIMARY KEY,
    InvoiceID VARCHAR(50) NOT NULL,

    -- Thông tin sản phẩm
    ItemCode VARCHAR(50),
    ItemName VARCHAR(255),
    ItemUnit VARCHAR(20),
    ItemDescription VARCHAR(500),

    -- Thông tin giá & số lượng
    Quantity DECIMAL(10,2),
    UnitPrice DECIMAL(18,0),
    LineAmount DECIMAL(18,0),
    LineDiscount DECIMAL(18,0),
    LineAmountAfterDiscount DECIMAL(18,0),

    -- Thông tin thuế
    TaxCode VARCHAR(20),
    TaxRate DECIMAL(5,4),
    TaxAmount DECIMAL(18,0),

    -- Thông tin khác
    SequenceNumber INT,
    IsGift BIT DEFAULT 0,

    -- Metadata
    CreatedAt DATETIME DEFAULT GETDATE(),
    CreatedBy VARCHAR(50) DEFAULT 'SYSTEM',

    FOREIGN KEY (InvoiceID) REFERENCES dbo.INVOICE_B2B(InvoiceID) ON DELETE CASCADE,
    INDEX idx_invoice (InvoiceID),
    INDEX idx_item (ItemCode)
);

-- ========================================
-- INSERT DỮ LIỆU HÓA ĐƠN B2B HEADER
-- ========================================

INSERT INTO dbo.INVOICE_B2B (
    InvoiceID,
    InvoiceNo,
    InvoiceDate,
    InvoiceTime,
    InvoiceType,
    CustomerID,
    CustomerName,
    CustomerAddress,
    CustomerPhone,
    CustomerTaxID,
    ContactPerson,
    PaymentMethod,
    TotalAmount,
    TotalDiscount,
    TotalTax,
    GrandTotal,
    TotalQuantity,
    BranchCode,
    StoreCode,
    EmployeeCode,
    DocStatus
)
SELECT
    h.BizDocId AS InvoiceID,
    h.DocNo AS InvoiceNo,
    CAST(h.DocDate AS DATE) AS InvoiceDate,
    h.DocTime AS InvoiceTime,
    h.DocCode AS InvoiceType,
    h.CustomerCode AS CustomerID,
    c.Name AS CustomerName,
    c.Address AS CustomerAddress,
    c.PersonTel AS CustomerPhone,
    c.TaxRegNo AS CustomerTaxID,
    c.Person AS ContactPerson,
    h.PaymentTypeCode AS PaymentMethod,
    ROUND(ISNULL(h.TotalAmount, 0), 0) AS TotalAmount,
    ROUND(ISNULL(h.DiscountAmount, 0), 0) AS TotalDiscount,
    ROUND(ISNULL(h.TotalAmount3, 0), 0) AS TotalTax,
    ROUND(ISNULL(h.TotalAmount, 0), 0) AS GrandTotal,
    ROUND(ISNULL(h.TotalQuantity, 0), 2) AS TotalQuantity,
    h.BranchCode,
    h.StoreCode,
    h.EmployeeCode,
    h.DocStatus
FROM #B30BizDoc h
LEFT JOIN #B20Customer c ON h.CustomerCode = c.Code
WHERE h.DocCode IN ('S1', 'SO', 'KH', 'CT', 'X1')
  AND h.BizDocId IS NOT NULL;

-- ========================================
-- INSERT DỮ LIỆU CHI TIẾT HÓA ĐƠN B2B
-- ========================================

INSERT INTO dbo.INVOICE_B2B_DETAIL (
    DetailID,
    InvoiceID,
    ItemCode,
    ItemName,
    ItemUnit,
    ItemDescription,
    Quantity,
    UnitPrice,
    LineAmount,
    LineDiscount,
    LineAmountAfterDiscount,
    TaxCode,
    TaxRate,
    TaxAmount,
    SequenceNumber,
    IsGift
)
SELECT
    d.RowId AS DetailID,
    d.BizDocId AS InvoiceID,
    d.ItemCode,
    ISNULL(i.Name, 'Unknown') AS ItemName,
    d.Unit AS ItemUnit,
    d.Description AS ItemDescription,
    ROUND(ISNULL(d.Quantity, 0), 2) AS Quantity,
    ROUND(ISNULL(d.UnitCost, 0), 0) AS UnitPrice,
    ROUND(ISNULL(d.Amount, 0), 0) AS LineAmount,
    ROUND(ISNULL(d.DiscountAmount, 0), 0) AS LineDiscount,
    ROUND(ISNULL(d.Amount - d.DiscountAmount, 0), 0) AS LineAmountAfterDiscount,
    d.TaxCode,
    ISNULL(d.TaxRate, 0) AS TaxRate,
    ROUND(ISNULL(d.Amount3, 0), 0) AS TaxAmount,
    d.BuiltinOrder AS SequenceNumber,
    CASE WHEN d.IsGiftItem = 1 THEN 1 ELSE 0 END AS IsGift
FROM #B30BizDocDetail d
LEFT JOIN #B20Item i ON d.ItemCode = i.Code
WHERE d.BizDocId IS NOT NULL;

-- ============================================================================
-- PHẦN 3: CHUẨN HÓA DỮ LIỆU HÓA ĐƠN B2C (RETAIL)
-- ============================================================================

-- ========================================
-- TẠO BẢNG HÓA ĐƠN B2C HEADER ĐÃ CHUẨN HÓA
-- ========================================

IF OBJECT_ID('dbo.INVOICE_B2C') IS NOT NULL DROP TABLE dbo.INVOICE_B2C;
CREATE TABLE dbo.INVOICE_B2C (
    InvoiceID VARCHAR(50) PRIMARY KEY,
    InvoiceNo VARCHAR(50),
    InvoiceDate DATE,
    InvoiceTime DATETIME,
    InvoiceType VARCHAR(10),          -- R1, R2
    SystemType VARCHAR(20) DEFAULT 'RETAIL',

    -- Thông tin khách hàng
    CustomerID VARCHAR(50),
    CustomerName VARCHAR(255),
    CustomerPhone VARCHAR(50),
    MemberCardNo VARCHAR(50),
    MemberLevel VARCHAR(20),

    -- Thông tin cửa hàng
    BranchCode VARCHAR(10),
    StoreCode VARCHAR(20),

    -- Thông tin thanh toán
    TotalAmount DECIMAL(18,0),
    TotalDiscount DECIMAL(18,0),
    TotalTax DECIMAL(18,0),         -- B2C thường không có thuế
    GrandTotal DECIMAL(18,0),
    TotalQuantity DECIMAL(10,2),

    -- Thông tin khác
    StatusCode INT,
    IsPosted BIT,

    -- Metadata
    CreatedAt DATETIME DEFAULT GETDATE(),
    CreatedBy VARCHAR(50) DEFAULT 'SYSTEM',

    INDEX idx_invoice_no (InvoiceNo),
    INDEX idx_invoice_date (InvoiceDate),
    INDEX idx_customer (CustomerID),
    INDEX idx_status (StatusCode)
);

-- ========================================
-- TẠO BẢNG CHI TIẾT HÓA ĐƠN B2C
-- ========================================

IF OBJECT_ID('dbo.INVOICE_B2C_DETAIL') IS NOT NULL DROP TABLE dbo.INVOICE_B2C_DETAIL;
CREATE TABLE dbo.INVOICE_B2C_DETAIL (
    DetailID VARCHAR(50) PRIMARY KEY,
    InvoiceID VARCHAR(50) NOT NULL,

    -- Thông tin sản phẩm
    ItemCode VARCHAR(50),
    ItemName VARCHAR(255),
    ItemUnit VARCHAR(20),

    -- Thông tin giá & số lượng
    Quantity DECIMAL(10,2),
    UnitPrice DECIMAL(18,0),
    LineAmount DECIMAL(18,0),
    LineDiscount DECIMAL(18,0),
    LineAmountAfterDiscount DECIMAL(18,0),

    -- Thông tin khác
    SequenceNumber INT,

    -- Metadata
    CreatedAt DATETIME DEFAULT GETDATE(),
    CreatedBy VARCHAR(50) DEFAULT 'SYSTEM',

    FOREIGN KEY (InvoiceID) REFERENCES dbo.INVOICE_B2C(InvoiceID) ON DELETE CASCADE,
    INDEX idx_invoice (InvoiceID),
    INDEX idx_item (ItemCode)
);

-- ========================================
-- INSERT DỮ LIỆU HÓA ĐƠN B2C HEADER
-- ========================================

INSERT INTO dbo.INVOICE_B2C (
    InvoiceID,
    InvoiceNo,
    InvoiceDate,
    InvoiceTime,
    InvoiceType,
    CustomerID,
    CustomerName,
    CustomerPhone,
    MemberCardNo,
    MemberLevel,
    BranchCode,
    StoreCode,
    TotalAmount,
    TotalDiscount,
    TotalTax,
    GrandTotal,
    TotalQuantity,
    StatusCode,
    IsPosted
)
SELECT
    CAST(h.PosDocId AS VARCHAR(50)) AS InvoiceID,
    h.DocNo AS InvoiceNo,
    CAST(h.DocDate AS DATE) AS InvoiceDate,
    h.BillTime AS InvoiceTime,
    h.DocCode AS InvoiceType,
    h.CustomerCode AS CustomerID,
    COALESCE(c.Name, 'Khách vãng lai') AS CustomerName,
    c.PhoneNumber AS CustomerPhone,
    c.MemberCardCode AS MemberCardNo,
    c.LevelCode AS MemberLevel,
    h.BranchCode,
    h.StoreCode,
    ROUND(ISNULL(h.TotalSaleAmount, 0), 0) AS TotalAmount,
    ROUND(ISNULL(h.TotalDeductAmount, 0), 0) AS TotalDiscount,
    0 AS TotalTax,                     -- B2C thường không có thuế
    ROUND(ISNULL(h.TotalAmount, 0), 0) AS GrandTotal,
    ROUND(ISNULL(h.TotalQuantity, 0), 2) AS TotalQuantity,
    h.StatusCode,
    h.IsPosted
FROM #B30RetailData h
LEFT JOIN #B20RetailCustomer c ON h.CustomerCode = c.Code
WHERE h.DocCode = 'R1'
  AND h.PosDocId IS NOT NULL;

-- ========================================
-- INSERT DỮ LIỆU CHI TIẾT HÓA ĐƠN B2C
-- ========================================

INSERT INTO dbo.INVOICE_B2C_DETAIL (
    DetailID,
    InvoiceID,
    ItemCode,
    ItemName,
    ItemUnit,
    Quantity,
    UnitPrice,
    LineAmount,
    LineDiscount,
    LineAmountAfterDiscount,
    SequenceNumber
)
SELECT
    d.RowId AS DetailID,
    CAST(d.PosDocId AS VARCHAR(50)) AS InvoiceID,
    d.ItemCode,
    COALESCE(d.ItemName, 'Unknown') AS ItemName,
    d.ItemUnit AS ItemUnit,
    ROUND(ISNULL(d.Quantity, 0), 2) AS Quantity,
    ROUND(ISNULL(d.UnitPrice, 0), 0) AS UnitPrice,
    ROUND(ISNULL(d.Amount, 0), 0) AS LineAmount,
    ROUND(ISNULL(d.DiscountAmount, 0), 0) AS LineDiscount,
    ROUND(ISNULL(d.Amount - d.DiscountAmount, 0), 0) AS LineAmountAfterDiscount,
    d.BuiltinOrder AS SequenceNumber
FROM #B30RetailDetailData d
WHERE d.PosDocId IS NOT NULL;

-- ============================================================================
-- PHẦN 4: TẠO VIEW HỢP NHẤT DỮ LIỆU HÓA ĐƠN
-- ============================================================================

-- ========================================
-- VIEW HÓA ĐƠN HEADER
-- ========================================

IF OBJECT_ID('dbo.V_INVOICE_ALL') IS NOT NULL DROP VIEW dbo.V_INVOICE_ALL;
GO
CREATE VIEW dbo.V_INVOICE_ALL AS
SELECT
    InvoiceID,
    InvoiceNo,
    InvoiceDate,
    InvoiceTime,
    InvoiceType,
    SystemType,
    CustomerID,
    CustomerName,
    COALESCE(CustomerAddress, '') AS CustomerAddress,
    COALESCE(CustomerPhone, '') AS CustomerPhone,
    COALESCE(CustomerTaxID, '') AS CustomerTaxID,
    COALESCE(PaymentMethod, 'Unknown') AS PaymentMethod,
    TotalAmount,
    TotalDiscount,
    TotalTax,
    GrandTotal,
    TotalQuantity,
    BranchCode,
    StoreCode,
    DocStatus,
    StatusCode,
    CreatedAt
FROM dbo.INVOICE_B2B
UNION ALL
SELECT
    InvoiceID,
    InvoiceNo,
    InvoiceDate,
    InvoiceTime,
    InvoiceType,
    SystemType,
    CustomerID,
    CustomerName,
    COALESCE(CustomerAddress, '') AS CustomerAddress,
    COALESCE(CustomerPhone, '') AS CustomerPhone,
    COALESCE(CustomerTaxID, '') AS CustomerTaxID,
    'CASH' AS PaymentMethod,          -- B2C mặc định tiền mặt
    TotalAmount,
    TotalDiscount,
    TotalTax,
    GrandTotal,
    TotalQuantity,
    BranchCode,
    StoreCode,
    DocStatus,
    StatusCode,
    CreatedAt
FROM dbo.INVOICE_B2C;
GO

-- ========================================
-- VIEW HÓA ĐƠN CHI TIẾT
-- ========================================

IF OBJECT_ID('dbo.V_INVOICE_DETAIL_ALL') IS NOT NULL DROP VIEW dbo.V_INVOICE_DETAIL_ALL;
GO
CREATE VIEW dbo.V_INVOICE_DETAIL_ALL AS
SELECT
    DetailID,
    InvoiceID,
    ItemCode,
    ItemName,
    ItemUnit,
    Quantity,
    UnitPrice,
    LineAmount,
    LineDiscount,
    LineAmountAfterDiscount,
    COALESCE(TaxCode, '') AS TaxCode,
    COALESCE(TaxRate, 0) AS TaxRate,
    COALESCE(TaxAmount, 0) AS TaxAmount,
    SequenceNumber,
    IsGift
FROM dbo.INVOICE_B2B_DETAIL
UNION ALL
SELECT
    DetailID,
    InvoiceID,
    ItemCode,
    ItemName,
    ItemUnit,
    Quantity,
    UnitPrice,
    LineAmount,
    LineDiscount,
    LineAmountAfterDiscount,
    '' AS TaxCode,
    0 AS TaxRate,
    0 AS TaxAmount,
    SequenceNumber,
    0 AS IsGift
FROM dbo.INVOICE_B2C_DETAIL;
GO

-- ============================================================================
-- PHẦN 5: QUERY LẤY DỮ LIỆU HÓA ĐƠN ĐÃ CHUẨN HÓA
-- ============================================================================

-- ========================================
-- QUERY 1: LẤY TẤT CẢ HÓA ĐƠN (HEADER + DETAIL)
-- ========================================

SELECT
    v.InvoiceID,
    v.InvoiceNo,
    v.InvoiceDate,
    v.InvoiceTime,
    v.InvoiceType,
    v.SystemType,
    v.CustomerID,
    v.CustomerName,
    v.CustomerPhone,
    v.PaymentMethod,
    v.TotalAmount,
    v.TotalDiscount,
    v.TotalTax,
    v.GrandTotal,
    v.TotalQuantity,

    -- Chi tiết sản phẩm
    d.DetailID,
    d.ItemCode,
    d.ItemName,
    d.ItemUnit,
    d.Quantity,
    d.UnitPrice,
    d.LineAmount,
    d.LineDiscount,
    d.LineAmountAfterDiscount,
    d.TaxCode,
    d.TaxRate,
    d.TaxAmount,
    d.SequenceNumber,

    -- Tính toán các chỉ số
    CASE WHEN d.UnitPrice > 0
        THEN ROUND(d.LineAmountAfterDiscount / d.UnitPrice, 2)
        ELSE 0
    END AS QuantityAfterDiscount,

    ROUND(d.LineAmountAfterDiscount * (1 + d.TaxRate), 0) AS LineAmountWithTax,

    -- Mapping loại hóa đơn
    CASE
        WHEN v.InvoiceType = 'S1' THEN 'Đơn hàng bán hàng 1'
        WHEN v.InvoiceType = 'SO' THEN 'Đơn hàng bán hàng'
        WHEN v.InvoiceType = 'KH' THEN 'Phiếu thu đặt cọc'
        WHEN v.InvoiceType = 'CT' THEN 'Đơn hàng khách hàng'
        WHEN v.InvoiceType = 'X1' THEN 'Phiếu xuất hàng'
        WHEN v.InvoiceType = 'R1' THEN 'Bán lẻ loại 1'
        WHEN v.InvoiceType = 'R2' THEN 'Bán lẻ loại 2 (Trả hàng)'
        ELSE 'Khác'
    END AS InvoiceTypeName,

    CASE
        WHEN v.SystemType = 'BIZDOC' THEN 'B2B - Doanh nghiệp'
        WHEN v.SystemType = 'RETAIL' THEN 'B2C - Bán lẻ'
        ELSE 'Khác'
    END AS SystemTypeName

FROM dbo.V_INVOICE_ALL v
INNER JOIN dbo.V_INVOICE_DETAIL_ALL d ON v.InvoiceID = d.InvoiceID
WHERE v.InvoiceDate >= '2025-01-01'  -- Filter theo ngày
ORDER BY v.InvoiceDate DESC, v.InvoiceNo, d.SequenceNumber;

-- ========================================
-- QUERY 2: BÁO CÁO DOANH THU THEO NGÀY
-- ========================================

SELECT
    InvoiceDate AS Ngay,
    SystemType AS HeThong,
    COUNT(DISTINCT InvoiceID) AS SoLuongHoaDon,
    COUNT(DISTINCT CustomerID) AS SoLuongKhachHang,
    SUM(TotalAmount) AS TongDoanhThu,
    SUM(TotalDiscount) AS TongGiamGia,
    SUM(TotalTax) AS TongThue,
    SUM(GrandTotal) AS TongThanhToan,
    AVG(TotalAmount) AS DoanhThuTrungBinh,
    ROUND(SUM(TotalDiscount) * 100.0 / NULLIF(SUM(TotalAmount), 0), 2) AS TyLeGiamGia
FROM dbo.V_INVOICE_ALL
WHERE InvoiceDate >= '2025-01-01'
GROUP BY InvoiceDate, SystemType
ORDER BY InvoiceDate DESC, SystemType;

-- ========================================
-- QUERY 3: BÁO CÁO DOANH THU THEO KHÁCH HÀNG
-- ========================================

SELECT
    CustomerID AS MaKhachHang,
    CustomerName AS TenKhachHang,
    CustomerPhone AS SDT,
    SystemType AS HeThong,
    COUNT(DISTINCT InvoiceID) AS SoLuongHoaDon,
    SUM(TotalAmount) AS TongDoanhThu,
    SUM(TotalDiscount) AS TongGiamGia,
    SUM(GrandTotal) AS TongThanhToan,
    MIN(InvoiceDate) AS NgayMuaDau,
    MAX(InvoiceDate) AS NgayMuaCuoi,
    AVG(TotalAmount) AS DoanhThuTrungBinh
FROM dbo.V_INVOICE_ALL
WHERE InvoiceDate >= '2025-01-01
  AND CustomerID IS NOT NULL
GROUP BY CustomerID, CustomerName, CustomerPhone, SystemType
ORDER BY TongThanhToan DESC;

-- ========================================
-- QUERY 4: BÁO CÁO DOANH THU THEO SẢN PHẨM
-- ========================================

SELECT
    d.ItemCode AS MaSanPham,
    d.ItemName AS TenSanPham,
    v.SystemType AS HeThong,
    COUNT(DISTINCT d.InvoiceID) AS SoLuongHoaDon,
    SUM(d.Quantity) AS TongSoLuong,
    SUM(d.LineAmount) AS TongDoanhThu,
    SUM(d.LineDiscount) AS TongGiamGia,
    SUM(d.LineAmountAfterDiscount) AS TongThanhToan,
    AVG(d.UnitPrice) AS DonGiaTrungBinh
FROM dbo.V_INVOICE_DETAIL_ALL d
INNER JOIN dbo.V_INVOICE_ALL v ON d.InvoiceID = v.InvoiceID
WHERE v.InvoiceDate >= '2025-01-01'
GROUP BY d.ItemCode, d.ItemName, v.SystemType
ORDER BY TongThanhToan DESC;

-- ========================================
-- QUERY 5: BÁO CÁO THUẾ
-- ========================================

SELECT
    d.TaxCode AS MaThue,
    CASE
        WHEN d.TaxRate = 0.1000 THEN 'VAT 10%'
        WHEN d.TaxRate = 0.0500 THEN 'VAT 5%'
        WHEN d.TaxRate = 0.0000 THEN 'Không chịu thuế'
        ELSE 'Khác'
    END AS TenThue,
    d.TaxRate AS TyLeThue,
    COUNT(DISTINCT d.InvoiceID) AS SoLuongHoaDon,
    SUM(d.LineAmount) AS TongDoanhThuTruocThue,
    SUM(d.TaxAmount) AS TongTienThue,
    SUM(d.LineAmount + d.TaxAmount) AS TongTienSauThue
FROM dbo.V_INVOICE_DETAIL_ALL d
INNER JOIN dbo.V_INVOICE_ALL v ON d.InvoiceID = v.InvoiceID
WHERE v.InvoiceDate >= '2025-01-01'
  AND d.TaxRate > 0
GROUP BY d.TaxCode, d.TaxRate
ORDER BY d.TaxRate DESC;

-- ============================================================================
-- PHẦN 6: VALIDATION DỮ LIỆU
-- ============================================================================

-- ========================================
-- CHECK 1: KIỂM TRA TỔNG TIỀN HEADER VS DETAIL
-- ========================================

SELECT
    v.InvoiceID,
    v.InvoiceNo,
    v.GrandTotal AS HeaderTotal,
    SUM(d.LineAmountAfterDiscount) AS DetailTotal,
    v.GrandTotal - SUM(d.LineAmountAfterDiscount) AS Difference
FROM dbo.V_INVOICE_ALL v
INNER JOIN dbo.V_INVOICE_DETAIL_ALL d ON v.InvoiceID = d.InvoiceID
GROUP BY v.InvoiceID, v.InvoiceNo, v.GrandTotal
HAVING ABS(v.GrandTotal - SUM(d.LineAmountAfterDiscount)) > 1000  -- Sai số > 1000 VNĐ
ORDER BY Difference DESC;

-- ========================================
-- CHECK 2: KIỂM TRA SỐ LIỆU KHÁCH HÀNG NULL
-- ========================================

SELECT
    InvoiceID,
    InvoiceNo,
    InvoiceDate,
    SystemType
FROM dbo.V_INVOICE_ALL
WHERE CustomerID IS NULL OR CustomerName IS NULL OR CustomerName = ''
ORDER BY InvoiceDate DESC;

-- ========================================
-- CHECK 3: KIỂM TRA SẢN PHẨM KHÔNG TÊN
-- ========================================

SELECT
    InvoiceID,
    DetailID,
    ItemCode,
    ItemName
FROM dbo.V_INVOICE_DETAIL_ALL
WHERE ItemName IS NULL OR ItemName = '' OR ItemName = 'Unknown'
ORDER BY InvoiceID;

-- ========================================
-- CHECK 4: KIỂM TRA ĐƠN GIÁ = 0 NHƯNG SỐ LƯỢNG > 0
-- ========================================

SELECT
    d.InvoiceID,
    d.DetailID,
    d.ItemCode,
    d.ItemName,
    d.Quantity,
    d.UnitPrice,
    d.LineAmount,
    v.InvoiceNo
FROM dbo.V_INVOICE_DETAIL_ALL d
INNER JOIN dbo.V_INVOICE_ALL v ON d.InvoiceID = v.InvoiceID
WHERE d.UnitPrice = 0 AND d.Quantity > 0 AND d.LineAmount = 0
ORDER BY d.InvoiceID;

-- ============================================================================
-- KẾT THÚC TRANSACTION
-- ============================================================================

-- XÁC NHẬN TRANSACTION
-- Nếu mọi thứ OK, chạy:
-- COMMIT TRANSACTION;

-- Nếu có lỗi, rollback:
-- ROLLBACK TRANSACTION;

-- ============================================================================
-- HƯỚNG DẪN SỬ DỤNG
-- ============================================================================

/*
BƯỚC 1: Import dữ liệu từ CSV vào database
   - Thay đổi đường dẫn file CSV trong phần OPENROWSET
   - Tạo file format (XML) tương ứng nếu chưa có
   - Tham khảo SQL Server BULK IMPORT documentation

BƯỚC 2: Chạy script
   - Mở SQL Server Management Studio (SSMS)
   - Mở file script này
   - Thay đổi các tham số cần thiết (đường dẫn, ngày, v.v.)
   - Chạy script (F5)

BƯỚC 3: Validate dữ liệu
   - Chạy các query trong Phần 6 để kiểm tra tính chính xác
   - Kiểm tra kết quả và điều chỉnh nếu cần

BƯỚC 4: Export dữ liệu
   - Dùng các query trong Phần 5 để lấy dữ liệu cần thiết
   - Export ra Excel, CSV, hoặc định dạng khác

BƯỚC 5: Schedule (nếu cần)
   - Tạo SQL Agent Job để chạy định kỳ (hàng ngày/tuần/tháng)
   - Tự động import và chuẩn hóa dữ liệu

LƯU Ý:
- Script này được viết cho SQL Server
- Với MySQL/PostgreSQL cần điều chỉnh cú pháp
- Kiểm tra và điều chỉnh logic tùy theo yêu cầu nghiệp vụ thực tế
- Backup database trước khi chạy script lần đầu
*/

-- ============================================================================
-- END OF SCRIPT
-- ============================================================================
