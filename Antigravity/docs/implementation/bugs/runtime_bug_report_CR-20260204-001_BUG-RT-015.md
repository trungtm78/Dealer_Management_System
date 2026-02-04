# Runtime Bug Report

## Bug Information

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-RT-015 |
| **Related CR** | CR-20260204-001 |
| **Module** | Sales - Quotation Form (Bán hàng -> Tạo báo giá) |
| **Priority** | HIGH |
| **Severity** | MEDIUM |
| **Report Date** | 2026-02-04 |
| **Reporter** | OpenCode (UAT Execution Authority) |
| **Status** | OPEN |

---

## Bug Description

**Title**: Sales Quotation Form không thể tìm kiếm và chọn khách hàng

**Summary**: Tại menu "Bán hàng -> Tạo báo giá" (`/sales/quotation`), người dùng không thể tìm kiếm và chọn khách hàng trong dropdown. Component `AutocompleteFK` cũ được sử dụng thay vì `SmartSelect` component mới theo CR-20260204-001.

---

## Expected Behavior

Theo CR-20260204-001 (Smart Search Component & Data Retrieval Standard):

1. Tất cả Foreign Key dropdowns phải sử dụng `SmartSelect` component (theo UI Spec v1.7, Section 3.1)
2. Dropdown phải hỗ trợ:
   - Real-time search (debounce 200ms)
   - Search trên nhiều trường (name, phone, email, code, tax_id)
   - Infinite scroll (cursor-based pagination)
   - Context filtering (companyId, onlyActive, preferredIds, recentIds)
   - Keyboard navigation (Arrow keys, Enter, Esc, Tab)
   - Create in-place functionality

**Expected in Quotation Form:**
- Khách hàng dropdown: Có thể tìm kiếm theo tên, số điện thoại, email
- Dòng xe dropdown: Có thể tìm kiếm theo tên, mã model

---

## Actual Behavior

**Current Implementation:**

1. **QuotationForm** (`components/sales/QuotationForm.tsx`) sử dụng component cũ:
   - Dòng 65: `AutocompleteFK` cho khách hàng (`resource="crm/customers"`)
   - Dòng 312: `AutocompleteFK` cho dòng xe (`resource="master/vehicle-models"`)

2. **API Endpoints hiện tại** không tương thích với `SmartSelect`:
   - `/api/crm/customers` - Chỉ hỗ trợ `for_dropdown=true` query parameter
   - `/api/master/vehicle-models` - Chỉ hỗ trợ `for_dropdown=true` query parameter
   
3. **SmartSelect API endpoint** chỉ có cho vehicle-models:
   - `/api/shared/search/vehicle-models` - Đã được tạo (đúng theo spec)
   - `/api/shared/search/customers` - **KHÔNG TỒN TẠI**

4. **Hook không tương thích**:
   - `useFKData` hook được thiết kế cho `AutocompleteFK` (sử dụng query parameters)
   - `SmartSelect` cần hook khác hoặc API adapter

---

## Root Cause Analysis

### Vấn đề chính: **CR-20260204-001 chưa được tích hợp đầy đủ vào QuotationForm**

**Chi tiết:**

1. **Component không migrated**:
   - `QuotationForm` vẫn dùng `AutocompleteFK` component
   - Cần migrate sang `SmartSelect` với `SelectDataSource` pattern

2. **API endpoints thiếu**:
   - `/api/shared/search/customers` chưa được tạo
   - Chỉ có `/api/shared/search/vehicle-models`

3. **Data format khác biệt**:
   ```
   AutocompleteFK (cũ): 
   - GET /api/crm/customers?for_dropdown=true
   - Response: {data: [{id, name, status}]}
   
   SmartSelect (mới):
   - POST /api/shared/search/customers
   - Request: {q, limit, cursor, context, filter}
   - Response: {items: [{id, label, subtitle, meta}], nextCursor}
   ```

4. **Tìm kiếm giới hạn**:
   - AutocompleteFK: Chỉ search trên field hiển thị (name)
   - SmartSpec: Yêu cầu search trên nhiều field (name, phone, email, code, tax_id)

---

## Affected Components

| Component | File | Issue |
|-----------|------|-------|
| QuotationForm | `components/sales/QuotationForm.tsx` | Sử dụng AutocompleteFK (cũ) thay vì SmartSelect (mới) |
| useFKData hook | `hooks/useFKData.ts` | Chỉ hỗ trợ AutocompleteFK, không phải SmartSelect |
| Customer API | `app/api/crm/customers/route.ts` | Không có endpoint `/api/shared/search/customers` |

---

## Impact Assessment

**User Impact:**
- Người dùng không thể tìm kiếm khách hàng theo số điện thoại hoặc email (chỉ tìm được theo tên)
- Không có infinite scroll (pagination limit: trả về tất cả data)
- Không có context filtering
- Không có create in-place functionality

**Business Impact:**
- Quy trình tạo báo giá bị chậm do không thể tìm nhanh khách hàng
- UX không nhất quán với Odoo-like behavior theo yêu cầu CR

**Scope:**
- Tất cả form có Foreign Key dropdowns (Quotation, Service Quote, v.v.) đều bị ảnh hưởng tương tự

---

## Reproduction Steps

1. Đăng nhập vào hệ thống với user: `admin`, password: `admin123`
2. Điều hướng: Bán hàng → Tạo báo giá
3. Thử:
   a. Tìm khách hàng theo số điện thoại → Không tìm được
   b. Tìm khách hàng theo email → Không tìm được
   c. Scroll xuống dưới → Không có infinite scroll (tất cả data đã load)
4. Kết quả: Không thể chọn khách hàng từ danh sách lớn

---

## Environment

| Field | Value |
|-------|-------|
| Database | SQLite (HD_CH_SYS) |
| Framework | Next.js 14.1.0 |
| UI Library | Radix UI + shadcn/ui |
| Test Date | 2026-02-04 |
| Test User | admin (admin123) |

---

## Solution Recommendations

### Ngắn hạn (Quick Fix):
1. **Tạo `/api/shared/search/customers` endpoint**
   - POST method
   - Accept SearchRequest (q, limit, cursor, context, filter)
   - Return SearchResponse (items, nextCursor)
   - Search trên: name, phone, mobile, email

2. **Tạo adapter hook hoặc update `useFKData`**
   - Hỗ trợ cả 2 pattern (AutocompleteFK và SmartSelect)

3. **Update QuotationForm**
   - Sử dụng SmartSelect với SelectDataSource pattern

### Dài hạn (Complete Migration):
1. Migrate tất cả forms sử dụng `AutocompleteFK` sang `SmartSelect`
2. Đảm bảo tất cả entities có `/api/shared/search/:entity` endpoint
3. Tích hợp context filtering (companyId, onlyActive)

---

## Notes

- Đây là **migration issue**, không phải bug logic
- CR-20260204-001 đã implement SmartSelect component nhưng chưa được tích hợp vào forms đang dùng
- Cần migration plan để cập nhật tất cả Foreign Key dropdowns

---

## Evidence

**Component sử dụng AutocompleteFK (cũ):**
```typescript
// components/sales/QuotationForm.tsx, line 65
<AutocompleteFK
    resource="crm/customers"
    value={customerId ? parseInt(customerId) : null}
    onChange={(id, item) => {
        setCustomerId(id ? id.toString() : undefined);
        if (item) {
            setCustomerName(item.name);
            setCustomerPhone(item.phone || "");
        }
    }}
    label="Khách hàng"
    placeholder="Tìm khách hàng..."
    required
    filters={{ status: "ACTIVE" }}
    className="w-full"
/>
```

**API endpoint hiện tại (không tương thích SmartSelect):**
```typescript
// app/api/crm/customers/route.ts, line 39-50
if (forDropdown) {
    const customers = await prisma.customer.findMany({
        where: { status },
        select: { id: true, name: true, status: true },
        orderBy: { name: 'asc' }
    });
    const dropdownData = customers.map(c => ({
        id: c.id,
        name: c.name,
        status: c.status
    }));
    return NextResponse.json({ data: dropdownData });
}
```

**Endpoint đang thiếu:**
```
POST /api/shared/search/customers
→ 404 Not Found
```

---

## Test Status

| Test Case | Expected | Actual | Status |
|-----------|----------|--------|--------|
| Tìm khách hàng theo tên | Hiển thị kết quả | Chỉ tìm được theo AutocompleteFK | PARTIAL |
| Tìm khách hàng theo SĐT | Hiển thị kết quả | Không tìm được | FAIL |
| Tìm khách hàng theo email | Hiển thị kết quả | Không tìm được | FAIL |
| Infinite scroll | Load thêm khi scroll | Tất cả đã load | FAIL |
| Context filtering | Lọc theo companyId | Không có | FAIL |

---

## Related CRs

- CR-20260204-001: Smart Search Component & Data Retrieval Standard

---

## Sign-off

**Bug Type**: Integration/Migration Issue (Not a Logic Bug)  
**Fix Required**: Yes - Migration needed  
**Priority**: HIGH (affects core sales workflow)  
**Status**: OPEN - Waiting for migration implementation

**Reported By**: OpenCode - UAT Execution Authority  
**Date**: 2026-02-04 22:30
