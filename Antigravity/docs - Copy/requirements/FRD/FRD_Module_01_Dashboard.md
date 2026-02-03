# Functional Requirements Document (FRD)
## Honda Dealer Management System

---

## 📋 Document Control

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Dự Án** | Honda Dealer Management System |
| **Phiên Bản FRD** | 1.0 |
| **Module** | Module 1 - Dashboard (Tổng Quan) |
| **Ngày Tạo** | 28/01/2026 |
| **Tham Chiếu** | BRD v2.0 |

---

## 🎯 Mục Đích Tài Liệu

FRD này mô tả chi tiết **functional requirements** cho từng màn hình, bao gồm:
- **Screen ID** và tên màn hình
- **UI References** - Component/Layout được reuse từ source code hiện có
- **Functional Specifications** - Chi tiết chức năng
- **Data Requirements** - Dữ liệu cần thiết
- **Business Rules** - Quy tắc nghiệp vụ
- **GAPs** - Các chức năng chưa có UI Reference (nếu có)

> **QUAN TRỌNG**: Tất cả UI sẽ được triển khai dựa trên **UI References** hiện có. KHÔNG thiết kế UI mới.

---

## 📊 Module 1: Dashboard (Tổng Quan)

### Overview

Module Dashboard cung cấp tổng quan về hoạt động kinh doanh của đại lý, bao gồm KPIs, charts, và quick actions.

**Số màn hình**: 1  
**Route**: `/dashboard`

---

### SCR-DASH-001: Dashboard Điều Hành

#### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-DASH-001 |
| **Screen Name** | Dashboard Điều Hành |
| **Route** | `/dashboard` |
| **Access Control** | ALL roles (ADMIN, SALES, SERVICE, MANAGER) |
| **Parent Menu** | Tổng Quan |

---

#### 2. UI References

**Primary Component**: `components/OperationalDashboard.tsx`

**UI Patterns Used**:

| Pattern | Component/File | Mô Tả |
|---------|---------------|-------|
| **KPI Cards** | `components/ui/card.tsx` | Card component từ Radix UI |
| **Stats Grid** | Grid layout (Tailwind) | 4-column responsive grid |
| **Icons** | `lucide-react` | Users, TrendingUp, DollarSign, Package |
| **Typography** | Tailwind classes | text-2xl font-bold, text-sm text-gray-500 |
| **Color Scheme** | Honda brand colors | Red (#E60012), Gray scale |

**Layout Structure**:
```
<div className="p-6">
  <h1>Dashboard Điều Hành</h1>
  
  <!-- KPI Cards Grid -->
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <Card /> <!-- KPI 1 -->
    <Card /> <!-- KPI 2 -->
    <Card /> <!-- KPI 3 -->
    <Card /> <!-- KPI 4 -->
  </div>
  
  <!-- Charts Section -->
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
    <Card /> <!-- Chart 1 -->
    <Card /> <!-- Chart 2 -->
  </div>
  
  <!-- Quick Actions -->
  <Card className="mt-6">
    <Button /> <!-- Action buttons -->
  </Card>
</div>
```

**Reusable Components**:
- `Card`, `CardHeader`, `CardTitle`, `CardContent` từ `@/components/ui/card`
- `Button` từ `@/components/ui/button`
- Icons từ `lucide-react`

---

#### 3. Functional Specifications

##### 3.1 KPI Cards

**Mục đích**: Hiển thị các chỉ số kinh doanh quan trọng

**KPI Cards**:

| # | KPI Name | Calculation | Icon | Color |
|---|----------|-------------|------|-------|
| 1 | **Doanh Thu Tháng** | SUM(quotations.totalPrice WHERE status='CONTRACT' AND month=current) | DollarSign | Blue |
| 2 | **Leads Mới** | COUNT(leads WHERE createdAt >= start_of_month) | Users | Green |
| 3 | **Xe Bán Tháng** | COUNT(deposits WHERE status='CONFIRMED' AND month=current) | TrendingUp | Yellow |
| 4 | **Appointments Hôm Nay** | COUNT(serviceAppointments WHERE date=today) | Calendar | Red |

**UI Behavior**:
- Hover effect: `hover:shadow-lg transition-shadow`
- Border left accent: `border-l-4 border-l-{color}`
- Auto-refresh: Every 5 minutes (optional)

**Data Source**:
- API: `GET /api/dashboard/kpis`
- Response format:
```typescript
{
  revenue: number,
  newLeads: number,
  carsSold: number,
  todayAppointments: number
}
```

---

##### 3.2 Charts Section

**Chart 1: Doanh Thu Theo Tháng**

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Chart Type** | Line Chart |
| **Library** | Recharts (recommended) hoặc Chart.js |
| **Data Points** | Last 6 months |
| **X-Axis** | Month (Tháng 1, Tháng 2, ...) |
| **Y-Axis** | Revenue (VNĐ) |

**UI Reference**: 
- Container: `Card` component
- Chart: Sử dụng library chart (chưa có trong source - **GAP-001**)

**Chart 2: Phân Bổ Leads Theo Nguồn**

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Chart Type** | Pie Chart hoặc Donut Chart |
| **Library** | Recharts (recommended) |
| **Data Points** | Lead sources (FACEBOOK, WEBSITE, WALK_IN, HOTLINE, REFERRAL, OTHER) |
| **Colors** | Distinct colors cho mỗi source |

**UI Reference**: 
- Container: `Card` component
- Chart: Sử dụng library chart (chưa có trong source - **GAP-001**)

---

##### 3.3 Quick Actions

**Mục đích**: Shortcuts cho các tác vụ thường dùng

**Actions**:

| # | Action Name | Route | Icon | Color |
|---|-------------|-------|------|-------|
| 1 | Tạo Lead Mới | `/crm/leads` (open dialog) | Plus | Red (Honda brand) |
| 2 | Tạo Báo Giá | `/sales/quotation` | FileText | Blue |
| 3 | Đặt Lịch Hẹn | `/service/appointments` (open dialog) | Calendar | Green |
| 4 | Xem Báo Cáo | `/accounting/dashboard` | BarChart | Purple |

**UI Reference**:
```tsx
<div className="flex gap-4">
  <Button className="bg-[#E60012] hover:bg-[#cc0010]">
    <Plus className="mr-2 h-4 w-4" />
    Tạo Lead Mới
  </Button>
  {/* More buttons */}
</div>
```

---

#### 4. Data Requirements

##### 4.1 Data Models

**Primary Models**:
- `Lead` - Cho KPI "Leads Mới"
- `Quotation` - Cho KPI "Doanh Thu"
- `Deposit` - Cho KPI "Xe Bán"
- `ServiceAppointment` - Cho KPI "Appointments"

**Aggregation Queries**:
```sql
-- Revenue This Month
SELECT SUM(totalPrice) 
FROM Quotation 
WHERE status = 'CONTRACT' 
  AND createdAt >= start_of_month

-- New Leads
SELECT COUNT(*) 
FROM Lead 
WHERE createdAt >= start_of_month

-- Cars Sold
SELECT COUNT(*) 
FROM Deposit 
WHERE status = 'CONFIRMED' 
  AND createdAt >= start_of_month

-- Today Appointments
SELECT COUNT(*) 
FROM ServiceAppointment 
WHERE scheduledDate = CURRENT_DATE
```

##### 4.2 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/dashboard/kpis` | GET | Lấy KPI numbers |
| `/api/dashboard/revenue-trend` | GET | Doanh thu 6 tháng |
| `/api/dashboard/lead-sources` | GET | Phân bổ leads theo nguồn |

**Response Example**:
```json
{
  "kpis": {
    "revenue": 5000000000,
    "newLeads": 45,
    "carsSold": 12,
    "todayAppointments": 8
  },
  "revenueTrend": [
    { "month": "T1", "value": 4500000000 },
    { "month": "T2", "value": 5200000000 }
  ],
  "leadSources": [
    { "source": "FACEBOOK", "count": 20 },
    { "source": "WEBSITE", "count": 15 }
  ]
}
```

---

#### 5. Business Rules

| Rule ID | Description |
|---------|-------------|
| BR-DASH-001 | KPIs chỉ tính cho tháng hiện tại (từ ngày 1 đến hôm nay) |
| BR-DASH-002 | Doanh thu chỉ tính quotations có status = 'CONTRACT' |
| BR-DASH-003 | Xe bán tính deposits có status = 'CONFIRMED' |
| BR-DASH-004 | Dashboard auto-refresh mỗi 5 phút (optional) |
| BR-DASH-005 | Tất cả roles đều xem được dashboard, nhưng data filter theo role (nếu cần) |

---

#### 6. User Interactions

##### 6.1 Page Load
1. User navigate to `/dashboard`
2. System loads KPIs từ API
3. System renders KPI cards với loading state
4. System loads charts data
5. System renders charts

**Loading State**:
- Skeleton loaders cho KPI cards
- Spinner cho charts

##### 6.2 Quick Actions
1. User clicks "Tạo Lead Mới"
2. System navigates to `/crm/leads` và mở LeadDialog
3. User fills form và saves
4. System refreshes dashboard KPIs

---

#### 7. UI States

| State | Description | UI Behavior |
|-------|-------------|-------------|
| **Loading** | Đang load data | Skeleton loaders, spinners |
| **Success** | Data loaded | Hiển thị KPIs và charts |
| **Error** | API error | Error message, retry button |
| **Empty** | No data | Empty state illustration |

**Error Handling**:
```tsx
{error && (
  <div className="text-center p-6">
    <p className="text-red-600">Không thể tải dữ liệu</p>
    <Button onClick={retry}>Thử lại</Button>
  </div>
)}
```

---

#### 8. Responsive Design

**Breakpoints** (Tailwind):
- **Mobile** (< 768px): 1 column grid
- **Tablet** (768px - 1024px): 2 columns grid
- **Desktop** (> 1024px): 4 columns grid

**UI Reference**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

---

#### 9. Performance Requirements

| Metric | Target |
|--------|--------|
| **Page Load Time** | < 2 seconds |
| **API Response Time** | < 500ms |
| **Chart Render Time** | < 1 second |
| **Auto-refresh Interval** | 5 minutes (configurable) |

---

#### 10. GAPs & Extensions

##### ✅ NO GAPS IDENTIFIED

**Chart Library Status**: ✅ **AVAILABLE**

**Current State**: 
- ✅ Recharts đã được tích hợp trong `OperationalDashboard.tsx` (line 6)
- ✅ Có sẵn: `BarChart`, `LineChart`, `PieChart`, `ResponsiveContainer`
- ✅ Đã implement: Revenue trend chart, Pie chart cho revenue mix

**UI Reference - Chart Implementation**:
```tsx
// From: components/OperationalDashboard.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
         ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Example: Bar Chart
<ResponsiveContainer width="100%" height={350}>
  <BarChart data={REVENUE_DATA}>
    <CartesianGrid strokeDasharray="3 3" vertical={false} />
    <XAxis dataKey="name" stroke="#888888" fontSize={12} />
    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
    <Tooltip formatter={(value: number) => formatCurrency(value)} />
    <Legend />
    <Bar dataKey="sales" name="Bán Xe" fill="#E60012" radius={[4, 4, 0, 0]} />
    <Bar dataKey="service" name="Dịch Vụ" fill="#007ACC" radius={[4, 4, 0, 0]} />
  </BarChart>
</ResponsiveContainer>

// Example: Pie Chart
<ResponsiveContainer width="100%" height="100%">
  <PieChart>
    <Pie data={MIX_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} 
         paddingAngle={5} dataKey="value">
      {MIX_DATA.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

**Reusable Patterns**:
- Honda brand color: `#E60012` (Red)
- Secondary color: `#007ACC` (Blue)
- Chart colors array: `['#E60012', '#007ACC', '#FFBB28']`
- Responsive container: Always wrap charts trong `ResponsiveContainer`
- Currency formatter: `formatCurrency()` từ `@/lib/utils`

**Status**: ✅ **No Extension Required** - Tất cả UI components đã sẵn sàng

---

## 📝 Summary

### Module 1: Dashboard - Checklist

- [x] Screen ID assigned: SCR-DASH-001
- [x] UI References mapped: `OperationalDashboard.tsx`, `Card`, `Button`
- [x] Functional specs documented
- [x] Data requirements defined
- [x] Business rules listed
- [x] GAPs identified: Chart library (GAP-001)
- [x] Extension proposed: Add Recharts

### Next Module

**Module 2: CRM** (10 screens)
- SCR-CRM-001: Quản Lý Leads
- SCR-CRM-002: Khách Hàng
- SCR-CRM-003: Chấm Điểm Lead
- ... (tiếp tục)

---

**End of Module 1 FRD**
