# Functional Requirements Document (FRD)
## Honda Dealer Management System - Module 2: CRM

---

## 📋 Document Control

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Module** | Module 2 - CRM (Customer Relationship Management) |
| **Số Screens** | 10 |
| **Phiên Bản** | 1.0 |
| **Ngày Tạo** | 28/01/2026 |

---

## 📊 Module Overview

**Mục đích**: Quản lý toàn bộ vòng đời khách hàng từ Lead → Customer → Loyalty

**Screens trong Module**:

| # | Screen ID | Screen Name | Route | Component File |
|---|-----------|-------------|-------|----------------|
| 1 | SCR-CRM-001 | Quản Lý Leads | `/crm/leads` | `LeadsBoard.tsx` |
| 2 | SCR-CRM-002 | Khách Hàng | `/crm/customers` | `CustomerList.tsx` |
| 3 | SCR-CRM-003 | Chấm Điểm Lead | `/crm/scoring` | `ScoringDashboard.tsx` |
| 4 | SCR-CRM-004 | Hiệu Quả Nguồn Lead | `/crm/sources` | `LeadSourcePerformance.tsx` |
| 5 | SCR-CRM-005 | Lịch Sử & Hoạt Động | `/crm/activities` | `LeadActivitiesList.tsx` |
| 6 | SCR-CRM-006 | Nhắc Bảo Dưỡng | `/crm/reminders` | `MaintenanceReminderSystem.tsx` |
| 7 | SCR-CRM-007 | Chương Trình Loyalty | `/crm/loyalty` | `LoyaltyDashboard.tsx` |
| 8 | SCR-CRM-008 | Chăm Sóc Sau Bán | `/crm/care` | `PostSalesCustomerCare.tsx` |
| 9 | SCR-CRM-009 | Quản Lý Khiếu Nại | `/crm/complaints` | `ComplaintManagementSystem.tsx` |
| 10 | SCR-CRM-010 | Chiến Dịch Marketing | `/crm/marketing` | `MarketingDashboard.tsx` |

---

## 🎯 SCR-CRM-001: Quản Lý Leads

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-CRM-001 |
| **Screen Name** | Quản Lý Leads |
| **Route** | `/crm/leads` |
| **Component** | `components/crm/LeadsBoard.tsx` |
| **Access Control** | SALES, MANAGER, ADMIN |

### 2. UI References

**Primary Component**: `LeadsBoard.tsx` (850 lines)

**UI Patterns**:

| Pattern | Component | Description |
|---------|-----------|-------------|
| **Kanban Board** | Custom implementation | Drag & drop columns |
| **Lead Cards** | `Card` component | Compact lead info cards |
| **Filters** | `Select`, `Input`, `DropdownMenu` | Advanced filtering |
| **View Toggle** | `Button` | Kanban ↔ List view |
| **Dialogs** | `LeadDialog.tsx`, `ScheduleDialog.tsx` | Create/Edit lead, Schedule |

**Layout Structure**:
```tsx
<div className="h-full flex flex-col">
  {/* Stats Dashboard - 4 KPI Cards */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <Card /> <!-- Tổng leads tháng -->
    <Card /> <!-- Tỷ lệ chuyển đổi -->
    <Card /> <!-- Điểm trung bình -->
    <Card /> <!-- Cảnh báo quá hạn -->
  </div>
  
  {/* Actions Bar */}
  <div className="flex items-center justify-between">
    <Input /> <!-- Search -->
    <Select /> <!-- Source filter -->
    <DropdownMenu /> <!-- Advanced filters -->
    <Button /> <!-- View toggle -->
    <Button /> <!-- Create Lead -->
  </div>
  
  {/* Kanban Board OR List View */}
  {viewMode === 'kanban' ? (
    <div className="flex items-start">
      {columns.map(col => (
        <div className="w-[280px]">
          <div className="p-3">{col.label}</div>
          <div className="space-y-3">
            {leads.map(lead => <Card />)}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <Table />
  )}
</div>
```

### 3. Functional Specifications

#### 3.1 Kanban Board

**Columns** (Customizable):
- NEW (Mới)
- CONTACTED (Đã Liên Hệ)
- QUALIFIED (Tiềm Năng)
- WON (Thành Công)
- DEAD (Thất Bại)

**Features**:
- ✅ Drag & drop leads giữa các columns
- ✅ Collapse/Expand columns
- ✅ Add custom columns
- ✅ Delete columns
- ✅ Reorder columns (drag columns)
- ✅ LocalStorage persistence

**UI Reference**:
```tsx
// Drag & Drop
<Card
  draggable
  onDragStart={(e) => handleDragStart(e, lead)}
  onDrop={() => handleDrop(status)}
>
```

#### 3.2 Lead Card

**Displayed Info**:
- Name (bold)
- Source (badge)
- Score (color-coded badge)
- Model interest
- Phone
- Created date

**Actions Menu** (DropdownMenu):
- ✏️ Sửa thông tin
- 📞 Gọi điện (log activity)
- ✉️ Gửi Email
- 📅 Lên lịch
- 🗑️ Xóa Lead
- 📜 Xem lịch sử

**Score Color Coding**:
```tsx
const getScoreStyle = (score: number) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-red-500";
};
```

#### 3.3 Filters

**Basic Filters**:
- Search: Name, Phone, Email, Model, Notes
- Source: FACEBOOK, WEBSITE, WALK_IN, HOTLINE, REFERRAL, OTHER

**Advanced Filters** (DropdownMenu):
- Date range (Từ ngày - Đến ngày)
- Min score (slider 0-100)

**Clear Filters**: Button to reset all

#### 3.4 Stage Transition

**Confirmation Dialog**:
- Required for WON/DEAD status
- Mandatory note field
- Activity log auto-created

**UI Reference**:
```tsx
<Dialog open={confirmStageOpen}>
  <DialogHeader>
    <DialogTitle>Xác nhận chuyển trạng thái</DialogTitle>
  </DialogHeader>
  <Textarea 
    placeholder={isWonOrDead ? "Nhập lý do (Bắt buộc)" : "Ghi chú (Tùy chọn)"}
  />
  <DialogFooter>
    <Button onClick={confirmTransition}>Xác nhận</Button>
  </DialogFooter>
</Dialog>
```

### 4. Data Requirements

**Primary Model**: `Lead`

**Key Fields**:
```typescript
{
  id: string,
  name: string,
  phone: string,
  email?: string,
  source: LeadSource,
  status: LeadStatus,
  score: number,
  modelInterest?: string,
  modelVersion?: string,
  color?: string,
  budget?: string,
  timeframe?: string,
  customerType?: string,
  address?: string,
  notes?: string,
  createdAt: DateTime,
  timeCreated: string // Formatted
}
```

**API Endpoints**:
- `GET /api/crm/leads` - List leads
- `POST /api/crm/leads` - Create lead
- `PATCH /api/crm/leads/:id` - Update lead
- `DELETE /api/crm/leads/:id` - Delete lead
- `POST /api/crm/leads/:id/activity` - Log activity

### 5. Business Rules

| Rule ID | Description |
|---------|-------------|
| BR-CRM-001 | Lead status transition WON/DEAD requires mandatory note |
| BR-CRM-002 | Lead score auto-calculated based on scoring config |
| BR-CRM-003 | Overdue leads = NEW status > 3 days |
| BR-CRM-004 | Kanban column state persisted in LocalStorage |
| BR-CRM-005 | Phone call action auto-logs CALL activity |

---

## 🎯 SCR-CRM-002: Khách Hàng

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-CRM-002 |
| **Screen Name** | Khách Hàng |
| **Route** | `/crm/customers` |
| **Component** | `components/crm/CustomerList.tsx` |
| **Access Control** | ALL roles |

### 2. UI References

**Primary Component**: `CustomerList.tsx`

**UI Patterns**:
- **Table View**: `Table` component từ `@/components/ui/table`
- **Filters**: Search, Type filter, Tier filter
- **Actions**: Edit, Delete, View details
- **Tags**: `Badge` component

**Layout**:
```tsx
<div>
  {/* Filters */}
  <div className="flex gap-4">
    <Input placeholder="Tìm kiếm..." />
    <Select> <!-- Type filter -->
    <Select> <!-- Tier filter -->
    <Button>Tạo Khách Hàng</Button>
  </div>
  
  {/* Table */}
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Tên</TableHead>
        <TableHead>Loại</TableHead>
        <TableHead>Điện Thoại</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Tier</TableHead>
        <TableHead>Tags</TableHead>
        <TableHead>Hành Động</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {customers.map(c => <TableRow />)}
    </TableBody>
  </Table>
</div>
```

### 3. Functional Specifications

#### 3.1 Customer Table

**Columns**:
- Name (clickable → detail)
- Type (INDIVIDUAL / COMPANY)
- Phone
- Mobile
- Email
- Address (truncated)
- Tier (BRONZE/SILVER/GOLD/PLATINUM)
- Tags (JSON array → badges)
- Actions (Edit/Delete)

**Tags Display**:
```tsx
{JSON.parse(customer.tags).map(tag => (
  <Badge variant="secondary">{tag}</Badge>
))}
```

#### 3.2 Filters

- **Search**: Name, Phone, Mobile, Email, VAT
- **Type**: All / INDIVIDUAL / COMPANY
- **Tier**: All / BRONZE / SILVER / GOLD / PLATINUM

#### 3.3 Customer Form

**Component**: `CustomerForm.tsx`

**Fields**:
- Basic Info: Name, Type, Phone, Mobile, Email
- Address Info: Address, City, District, Ward
- Company Info (if COMPANY): VAT, Company Name
- Tags (multi-select or comma-separated)
- Notes

**Validation**:
- Name: Required
- Phone: Required, VN format
- Email: Valid email format
- VAT: Required if COMPANY type

### 4. Data Requirements

**Model**: `Customer`

```typescript
{
  id: string,
  name: string,
  type: 'INDIVIDUAL' | 'COMPANY',
  phone: string,
  mobile?: string,
  email?: string,
  address?: string,
  vat?: string,
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM',
  tags: string | string[], // JSON string in SQLite
  notes?: string,
  createdAt: DateTime
}
```

### 5. Business Rules

| Rule ID | Description |
|---------|-------------|
| BR-CRM-006 | Tags stored as JSON string in SQLite, parsed before display |
| BR-CRM-007 | Default tier = SILVER for new customers |
| BR-CRM-008 | VAT required for COMPANY type customers |
| BR-CRM-009 | Customer can be linked to multiple Leads |

---

## 🎯 SCR-CRM-003: Chấm Điểm Lead

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-CRM-003 |
| **Screen Name** | Chấm Điểm Lead |
| **Route** | `/crm/scoring` |
| **Component** | `components/crm/ScoringDashboard.tsx` |
| **Access Control** | MANAGER, ADMIN |

### 2. UI References

**Components**:
- `ScoringDashboard.tsx` - Main dashboard
- `ScoringConfigDialog.tsx` - Config editor
- `ScoringSimulator.tsx` - Test scoring logic

**UI Patterns**:
- **Config Cards**: Display scoring rules
- **Simulator**: Real-time score calculation
- **Charts**: Score distribution (Recharts)

### 3. Functional Specifications

#### 3.1 Scoring Config

**Criteria** (Configurable weights):
- Source (0-20 points)
- Budget (0-30 points)
- Timeframe (0-20 points)
- Model Interest (0-15 points)
- Customer Type (0-15 points)

**UI Reference**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Cấu Hình Chấm Điểm</CardTitle>
    <Button onClick={() => setConfigDialogOpen(true)}>
      Chỉnh Sửa
    </Button>
  </CardHeader>
  <CardContent>
    {criteria.map(c => (
      <div className="flex justify-between">
        <span>{c.name}</span>
        <span className="font-bold">{c.weight} điểm</span>
      </div>
    ))}
  </CardContent>
</Card>
```

#### 3.2 Scoring Simulator

**Purpose**: Test scoring logic before applying

**Features**:
- Input lead attributes
- Real-time score calculation
- Breakdown by criteria
- Save as template

### 4. Business Rules

| Rule ID | Description |
|---------|-------------|
| BR-CRM-010 | Total score max = 100 points |
| BR-CRM-011 | Score auto-recalculated when config changes |
| BR-CRM-012 | High priority: score >= 80 |
| BR-CRM-013 | Medium priority: 50 <= score < 80 |
| BR-CRM-014 | Low priority: score < 50 |

---

## 🎯 SCR-CRM-004 đến SCR-CRM-010: Summary

### SCR-CRM-004: Hiệu Quả Nguồn Lead

**Component**: `LeadSourcePerformance.tsx`

**Features**:
- Chart: Leads by source (Bar chart)
- Conversion rate by source
- Average score by source
- Time series analysis

**UI Refs**: Recharts (BarChart, LineChart)

---

### SCR-CRM-005: Lịch Sử & Hoạt Động

**Component**: `LeadActivitiesList.tsx`, `LeadActivityTimeline.tsx`

**Features**:
- Activity timeline (vertical)
- Filter by type (CALL, EMAIL, MEETING, NOTE)
- Filter by date range
- Activity details

**UI Refs**: Timeline component (custom), `Badge` for activity types

---

### SCR-CRM-006: Nhắc Bảo Dưỡng

**Component**: `MaintenanceReminderSystem.tsx`

**Features**:
- Upcoming reminders table
- Send reminder (SMS/Email)
- Reminder history
- Auto-reminder rules

**UI Refs**: `Table`, `SendReminderDialog.tsx`

---

### SCR-CRM-007: Chương Trình Loyalty

**Component**: `LoyaltyDashboard.tsx`

**Features**:
- Tier distribution (Pie chart)
- Points leaderboard
- Tier upgrade/downgrade rules
- Rewards catalog

**UI Refs**: Recharts (PieChart), `Table`

---

### SCR-CRM-008: Chăm Sóc Sau Bán

**Component**: `PostSalesCustomerCare.tsx`

**Features**:
- Follow-up schedule
- Satisfaction surveys
- Issue tracking
- Call logs

**UI Refs**: `Table`, `Dialog` for surveys

---

### SCR-CRM-009: Quản Lý Khiếu Nại

**Component**: `ComplaintManagementSystem.tsx`

**Features**:
- Complaint tickets (Kanban)
- Status: OPEN, IN_PROGRESS, RESOLVED, CLOSED
- Priority levels
- Resolution tracking

**UI Refs**: Kanban board (similar to LeadsBoard), `Badge`

---

### SCR-CRM-010: Chiến Dịch Marketing

**Component**: `MarketingDashboard.tsx`, `CreateCampaignDialog.tsx`

**Features**:
- Campaign list
- Performance metrics (reach, conversion)
- Create campaign
- Target audience selection

**UI Refs**: `Table`, `Dialog`, Charts (Recharts)

---

## 📝 Module 2 Summary

### UI Components Inventory

**Reused Components**:
- ✅ `Card`, `CardHeader`, `CardTitle`, `CardContent`
- ✅ `Button`, `Input`, `Select`, `Checkbox`
- ✅ `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`
- ✅ `Dialog`, `DialogContent`, `DialogHeader`, `DialogFooter`
- ✅ `DropdownMenu`, `Badge`, `Tabs`
- ✅ Recharts (BarChart, LineChart, PieChart)

**Custom Components**:
- ✅ Kanban Board (LeadsBoard, ComplaintManagement)
- ✅ Timeline (LeadActivityTimeline)
- ✅ Scoring Simulator

### GAPs Analysis

**✅ NO GAPS IDENTIFIED**

Tất cả UI patterns đã có sẵn trong source code. Không cần thiết kế UI mới.

### Data Models

**Primary Models**:
- `Lead` - Quản lý leads
- `Customer` - Quản lý khách hàng
- `LeadActivity` - Lịch sử hoạt động
- `ScoringConfig` - Cấu hình chấm điểm
- `MaintenanceReminder` - Nhắc bảo dưỡng
- `LoyaltyProgram` - Chương trình loyalty
- `Complaint` - Khiếu nại
- `Campaign` - Chiến dịch marketing

### Business Rules Summary

**Total Rules**: 14 (BR-CRM-001 to BR-CRM-014)

**Key Rules**:
- Lead scoring auto-calculation
- Stage transition validation
- Tags JSON serialization (SQLite)
- Kanban state persistence
- Activity auto-logging

---

**End of Module 2 FRD**
