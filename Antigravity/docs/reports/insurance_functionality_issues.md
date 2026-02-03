# BÁO CÁO VỀ CHỨC NĂNG BẢO HIỂM - CÁC VẤN ĐỀ VÀ KHẮC PHỤC

**Ngày báo cáo:** 2025-07-08  
**Người kiểm tra:** OpenCode Assistant  
**Module:** Bảo hiểm (Insurance)  
**Trạng thái:** Cần khắc phục ngay  

---

## TÓM TẮT

Báo cáo này xác định **2 chức năng quan trọng không hoạt động** trong module Bảo hiểm:
1. Chức năng "Tạo Hợp Đồng Mới" 
2. Chức năng "Tạo Yêu Cầu Bồi Thường Mới"

Cả hai nút chức năng này đều hiển thị trên giao diện nhưng khi người dùng nhấp vào không có phản ứng, gây gián đoạn quy trình công việc.

---

## TÌNH HÌNH HIỆN TẠI

### 1. CHỨC NĂNG "TẠO HỢP ĐỒNG MỚI" KHÔNG HOẠT ĐỘNG

**Vị trí phát hiện lỗi:** `app/(main)/insurance/contracts/page.tsx:52-54`

```tsx
<Button className="bg-[#E60012] hover:bg-[#B8000E]">
    <Plus className="mr-2 h-4 w-4" /> Tạo Hợp Đồng Mới
</Button>
```

**Nguyên nhân:**
- Nút "Tạo Hợp Đồng Mới" không có sự kiện `onClick` hoặc liên kết `href`
- Không tồn tại trang tạo hợp đồng `app/(main)/insurance/contracts/create/page.tsx`
- Thiếu thành phần `InsuranceContractForm.tsx` để nhập thông tin hợp đồng mới

### 2. CHỨC NĂNG "TẠO YÊU CẦU MỚI" KHÔNG HOẠT ĐỘNG

**Vị trí phát hiện lỗi:** `app/(main)/insurance/claims/page.tsx:21-23`

```tsx
<Button className="bg-[#E60012] hover:bg-[#c50010]">
    <Plus className="mr-2 h-4 w-4" /> Tạo Yêu Cầu Mới
</Button>
```

**Nguyên nhân:**
- Nút "Tạo Yêu Cầu Mới" không có sự kiện `onClick` hoặc liên kết `href`
- Không tồn tại trang tạo yêu cầu bồi thường `app/(main)/insurance/claims/create/page.tsx`
- Thiếu thành phần `InsuranceClaimForm.tsx` để nhập thông tin yêu cầu mới

---

## CÁC THÀNH PHẦN ĐÃ CÓ VÀ THIẾU

### ✅ THÀNH PHẦN ĐÃ TRIỂN KHAI
1. **InsuranceContractList.tsx** - Hiển thị danh sách hợp đồng
2. **InsuranceClaimList.tsx** - Hiển thị danh sách yêu cầu bồi thường
3. **InsuranceContractDetail.tsx** - Chi tiết hợp đồng (chỉ xem/sửa)
4. **InsuranceClaimDetail.tsx** - Chi tiết yêu cầu (chỉ xem)
5. **Trang danh sách contracts và claims** - Có nút tạo mới nhưng không hoạt động

### ❌ THÀNH PHẦN THIẾU
1. **InsuranceContractForm.tsx** - Form tạo hợp đồng mới
2. **InsuranceClaimForm.tsx** - Form tạo yêu cầu bồi thường mới
3. **Trang tạo hợp đồng** - `app/(main)/insurance/contracts/create/page.tsx`
4. **Trang tạo yêu cầu** - `app/(main)/insurance/claims/create/page.tsx`
5. **API endpoints** cho tạo hợp đồng và yêu cầu mới

---

## TÁC ĐỘNG ĐẾN NGƯỜI DÙNG

### 1. Trải nghiệm người dùng kém
- Người dùng thấy nút "Tạo" nhưng khi nhấp vào không có phản ứng
- Gây nhầm lẫn và thất vọng khi không thể thực hiện chức năng cơ bản

### 2. Gián đoạn quy trình công việc
- Nhân viên bảo hiểm không thể tạo hợp đồng mới cho khách hàng
- Không thể đăng ký yêu cầu bồi thường khi có sự cố
- Phải sử dụng phương pháp thủ công hoặc hệ thống khác

### 3. Khó khăn trong quản lý
- Không thể mở rộng danh sách hợp đồng
- Không thể theo dõi các yêu cầu mới phát sinh
- Dữ liệu không được cập nhật kịp thời

---

## GIẢI PHÁP ĐỀ XUẤT

### Giai đoạn 1: Khắc phục ngay (Ưu tiên cao)

#### 1.1 Tạo trang tạo hợp đồng mới
```
app/(main)/insurance/contracts/create/page.tsx
```

**Mẫu code cơ bản:**
```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreateContractPage() {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    vehicleVin: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    provider: "",
    policyType: "",
    coverageAmount: "",
    premium: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to create contract
    toast.success("Đã tạo hợp đồng mới thành công");
    // TODO: Redirect to contract detail page
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/insurance/contracts">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tạo Hợp Đồng Mới</h1>
          <p className="text-muted-foreground">Điền thông tin để tạo hợp đồng bảo hiểm mới</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Khách Hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">Họ và Tên</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Điện Thoại</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Xe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vehicleVin">Số Khung (VIN)</Label>
                <Input
                  id="vehicleVin"
                  value={formData.vehicleVin}
                  onChange={(e) => setFormData({...formData, vehicleVin: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="vehicleMake">Hãng xe</Label>
                <Select value={formData.vehicleMake} onValueChange={(value) => setFormData({...formData, vehicleMake: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hãng xe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Honda">Honda</SelectItem>
                    <SelectItem value="Toyota">Toyota</SelectItem>
                    <SelectItem value="Mazda">Mazda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vehicleModel">Dòng xe</Label>
                <Input
                  id="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="vehicleYear">Năm sản xuất</Label>
                <Input
                  id="vehicleYear"
                  type="number"
                  value={formData.vehicleYear}
                  onChange={(e) => setFormData({...formData, vehicleYear: e.target.value})}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Policy Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Bảo Hiểm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="provider">Nhà cung cấp</Label>
                <Select value={formData.provider} onValueChange={(value) => setFormData({...formData, provider: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhà cung cấp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bảo Việt">Bảo Việt</SelectItem>
                    <SelectItem value="Prudential">Prudential</SelectItem>
                    <SelectItem value="Manulife">Manulife</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="policyType">Loại bảo hiểm</Label>
                <Select value={formData.policyType} onValueChange={(value) => setFormData({...formData, policyType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại bảo hiểm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vật chất xe">Bảo hiểm vật chất xe</SelectItem>
                    <SelectItem value="TNDS">TNDS chủ xe</SelectItem>
                    <SelectItem value="Người ngồi trên xe">Tai nạn người ngồi trên xe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="coverageAmount">Số tiền bảo hiểm (VNĐ)</Label>
                <Input
                  id="coverageAmount"
                  type="number"
                  value={formData.coverageAmount}
                  onChange={(e) => setFormData({...formData, coverageAmount: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="premium">Phí bảo hiểm (VNĐ)</Label>
                <Input
                  id="premium"
                  type="number"
                  value={formData.premium}
                  onChange={(e) => setFormData({...formData, premium: e.target.value})}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Contract Period */}
          <Card>
            <CardHeader>
              <CardTitle>Thời Hạn Hợp Đồng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Link href="/insurance/contracts">
            <Button variant="outline">Hủy</Button>
          </Link>
          <Button type="submit" className="bg-[#E60012] hover:bg-[#B8000E]">
            <Save className="mr-2 h-4 w-4" />
            Tạo Hợp Đồng
          </Button>
        </div>
      </form>
    </div>
  );
}
```

#### 1.2 Tạo trang tạo yêu cầu mới
```
app/(main)/insurance/claims/create/page.tsx
```

#### 1.3 Phát triển thành phần form
```
components/insurance/InsuranceContractForm.tsx
components/insurance/InsuranceClaimForm.tsx
```

#### 1.4 Kết nối nút với trang tạo
```tsx
// Trong contracts/page.tsx
<Link href="/insurance/contracts/create">
  <Button className="bg-[#E60012] hover:bg-[#B8000E]">
    <Plus className="mr-2 h-4 w-4" /> Tạo Hợp Đồng Mới
  </Button>
</Link>

// Trong claims/page.tsx
<Link href="/insurance/claims/create">
  <Button className="bg-[#E60012] hover:bg-[#c50010]">
    <Plus className="mr-2 h-4 w-4" /> Tạo Yêu Cầu Mới
  </Button>
</Link>
```

### Giai đoạn 2: Hoàn thiện chức năng (Ưu tiên trung bình)

#### 2.1 Xây dựng API endpoints
- `POST /api/insurance/contracts` - Tạo hợp đồng mới
- `POST /api/insurance/claims` - Tạo yêu cầu mới

#### 2.2 Phát triển form với đầy đủ tính năng
- Xác thực dữ liệu đầu vào
- Tính toán tự động (phí bảo hiểm, số tiền bồi thường dự kiến)
- Upload tài liệu đính kèm

#### 2.3 Tích hợp với các thành phần hiện có
- Cập nhật danh sách sau khi tạo mới
- Chuyển hướng đến trang chi tiết sau khi tạo thành công

### Giai đoạn 3: Nâng cao (Ưu tiên thấp)

#### 3.1 Workflow tự động
- Tự động gửi email xác nhận
- Tự động tạo số hợp đồng/yêu cầu
- Thông báo cho nhân viên liên quan

#### 3.2 Quy trình phê duyệt
- Tích hợp quy trình phê duyệt hợp đồng
- Xác thực thông tin khách hàng với hệ thống CRM

---

## ƯU TIÊN THỰC HIỆN

| Mức ưu tiên | Tác vụ | Thời gian dự kiến | Người phụ trách |
|------------|--------|------------------|----------------|
| Cao | Tạo trang tạo hợp đồng | 1-2 ngày | Frontend Developer |
| Cao | Tạo trang tạo yêu cầu | 1-2 ngày | Frontend Developer |
| Cao | Kết nối nút với trang tạo | 1 giờ | Frontend Developer |
| Trung bình | Xây dựng API endpoints | 2-3 ngày | Backend Developer |
| Trung bình | Xác thực dữ liệu form | 1-2 ngày | Frontend Developer |
| Thấp | Workflow tự động | 1-2 tuần | Fullstack Developer |

---

## KẾT LUẬN

Hai chức năng "Tạo Hợp Đồng Mới" và "Tạo Yêu Cầu Mới" là **chức năng cốt lõi** của module Bảo hiểm nhưng hiện đang **không hoạt động** do thiếu kết nối giữa giao diện người dùng và logic xử lý.

Việc khắc phục những vấn đề này là **ưu tiên cao** để:
- Hoàn thiện chức năng cơ bản của hệ thống
- Đảm bảo trải nghiệm người dùng
- Hỗ trợ quy trình công việc của nhân viên bảo hiểm

**Khuyến nghị:** Triển khai ngay theo Giai đoạn 1 để nhanh chóng đưa các chức năng này vào hoạt động, sau đó tiếp tục các giai đoạn 2 và 3 để hoàn thiện hệ thống.

---

**Người phê duyệt:** ____________________  
**Ngày phê duyệt:** ____________________