# Functional Requirements Document (FRD)
## Honda Dealer Management System - Module 8: Quản Trị (Admin)

---

## 📋 Document Control

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Module** | Module 8 - Quản Trị (Admin) |
| **Số Screens** | 3 |
| **Phiên Bản** | 1.0 |
| **Ngày Tạo** | 28/01/2026 |
| **Status** | ⚠️ **NOT IMPLEMENTED** - All screens missing |

---

## 📊 Module Overview

**Mục đích**: Quản lý người dùng, phân quyền, và giám sát hệ thống

**Screens trong Module**:

| # | Screen ID | Screen Name | Route | Component File | Status |
|---|-----------|-------------|-------|----------------|--------|
| 1 | SCR-ADM-001 | Quản Lý User | `/admin/users` | ❌ **MISSING** | ⚠️ |
| 2 | SCR-ADM-002 | Giám Sát HT | `/admin/monitoring` | ❌ **MISSING** | ⚠️ |
| 3 | SCR-ADM-003 | Cấu Hình API | `/admin/api` | ❌ **MISSING** | ⚠️ |

---

## 🎯 SCR-ADM-001: Quản Lý Người Dùng

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-ADM-001 |
| **Screen Name** | Quản Lý Người Dùng |
| **Route** | `/admin/users` |
| **Component** | ⚠️ **TO BE CREATED** |
| **Access Control** | ADMIN only |

### 2. Required UI Components

**Layout Structure**:
```tsx
<div className="p-6">
  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <h1>Quản Lý Người Dùng</h1>
    <Button onClick={handleCreateUser}>
      <Plus /> Tạo User Mới
    </Button>
  </div>
  
  {/* Filters */}
  <Card className="p-4 mb-6">
    <Input placeholder="Tìm kiếm user..." />
    <Select>
      <SelectItem value="all">Tất cả vai trò</SelectItem>
      <SelectItem value="ADMIN">Admin</SelectItem>
      <SelectItem value="MANAGER">Manager</SelectItem>
      <SelectItem value="SALES">Sales</SelectItem>
      <SelectItem value="SERVICE">Service</SelectItem>
    </Select>
    <Select>
      <SelectItem value="all">Tất cả trạng thái</SelectItem>
      <SelectItem value="ACTIVE">Hoạt động</SelectItem>
      <SelectItem value="INACTIVE">Ngừng hoạt động</SelectItem>
    </Select>
  </Card>
  
  {/* Users Table */}
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Tên</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Vai Trò</TableHead>
        <TableHead>Phòng Ban</TableHead>
        <TableHead>Trạng Thái</TableHead>
        <TableHead>Đăng Nhập Cuối</TableHead>
        <TableHead>Hành Động</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {users.map(user => (
        <TableRow key={user.id}>
          <TableCell>{user.name}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>
            <Badge>{user.role}</Badge>
          </TableCell>
          <TableCell>{user.department}</TableCell>
          <TableCell>
            {user.status === 'ACTIVE' ? (
              <Badge className="bg-green-100">Hoạt động</Badge>
            ) : (
              <Badge className="bg-gray-100">Ngừng</Badge>
            )}
          </TableCell>
          <TableCell>{formatDate(user.lastLogin)}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuItem onClick={() => handleEdit(user)}>
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                Reset mật khẩu
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeactivate(user)}>
                Vô hiệu hóa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewActivity(user)}>
                Xem hoạt động
              </DropdownMenuItem>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

### 3. Functional Specifications

#### 3.1 User Management

**User Roles**:
- **ADMIN**: Full system access
- **MANAGER**: Department management + reports
- **SALES**: CRM, Sales, Quotations
- **SERVICE**: Service, Appointments, RO
- **PARTS**: Inventory, Purchase orders
- **ACCOUNTING**: Financial reports, AR/AP
- **INSURANCE**: Insurance contracts & claims

**User Fields**:
- Name
- Email (unique, used for login)
- Password (hashed)
- Role
- Department
- Phone
- Status (ACTIVE/INACTIVE)
- Last Login
- Created At

#### 3.2 Actions

**Create User**:
- Dialog form with fields
- Email validation
- Default password generation
- Send welcome email

**Edit User**:
- Update user details
- Change role (requires confirmation)
- Update department

**Reset Password**:
- Generate temporary password
- Send email to user
- Force password change on next login

**Deactivate User**:
- Set status to INACTIVE
- Revoke all sessions
- Retain user data for audit

**View Activity Log**:
- Show user's recent actions
- Login history
- Changes made

### 4. Data Requirements

**Model**: `User`

```typescript
{
  id: string,
  name: string,
  email: string, // Unique
  passwordHash: string,
  role: 'ADMIN' | 'MANAGER' | 'SALES' | 'SERVICE' | 'PARTS' | 'ACCOUNTING' | 'INSURANCE',
  department?: string,
  phone?: string,
  status: 'ACTIVE' | 'INACTIVE',
  lastLogin?: DateTime,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Model**: `ActivityLog`

```typescript
{
  id: string,
  userId: string,
  action: string, // 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', etc.
  entity: string, // 'Lead', 'Customer', 'RO', etc.
  entityId?: string,
  details?: string,
  ipAddress?: string,
  createdAt: DateTime
}
```

### 5. Business Rules

| Rule ID | Description |
|---------|-------------|
| BR-ADM-001 | Email must be unique |
| BR-ADM-002 | Password min 8 characters, must include uppercase, lowercase, number |
| BR-ADM-003 | Only ADMIN can create/edit users |
| BR-ADM-004 | Cannot delete users, only deactivate |
| BR-ADM-005 | Activity logs retained for 1 year |

---

## 🎯 SCR-ADM-002: Giám Sát Hệ Thống

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-ADM-002 |
| **Screen Name** | Giám Sát Hệ Thống |
| **Route** | `/admin/monitoring` |
| **Component** | ⚠️ **TO BE CREATED** |
| **Access Control** | ADMIN only |

### 2. Required UI Components

**Layout Structure**:
```tsx
<div className="p-6">
  {/* System Health KPIs */}
  <div className="grid grid-cols-4 gap-4 mb-6">
    <Card>
      <CardTitle>Uptime</CardTitle>
      <CardContent className="text-2xl font-bold text-green-600">
        99.9%
      </CardContent>
    </Card>
    <Card>
      <CardTitle>Active Users</CardTitle>
      <CardContent className="text-2xl font-bold">
        {activeUsers}
      </CardContent>
    </Card>
    <Card>
      <CardTitle>Avg Response Time</CardTitle>
      <CardContent className="text-2xl font-bold">
        {avgResponseTime}ms
      </CardContent>
    </Card>
    <Card>
      <CardTitle>Errors (24h)</CardTitle>
      <CardContent className="text-2xl font-bold text-red-600">
        {errorCount}
      </CardContent>
    </Card>
  </div>
  
  {/* Charts */}
  <div className="grid grid-cols-2 gap-6 mb-6">
    <Card>
      <CardTitle>API Response Times</CardTitle>
      <LineChart data={responseTimesData} />
    </Card>
    <Card>
      <CardTitle>Request Volume</CardTitle>
      <BarChart data={requestVolumeData} />
    </Card>
  </div>
  
  {/* Error Logs */}
  <Card>
    <CardTitle>Recent Errors</CardTitle>
    <Table>
      <TableRow>
        <TableCell>Timestamp</TableCell>
        <TableCell>Error Type</TableCell>
        <TableCell>Message</TableCell>
        <TableCell>User</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </Table>
  </Card>
  
  {/* Database Performance */}
  <Card className="mt-6">
    <CardTitle>Database Performance</CardTitle>
    <div className="grid grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-gray-500">Connections</p>
        <p className="text-xl font-bold">{dbConnections}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Query Time (avg)</p>
        <p className="text-xl font-bold">{avgQueryTime}ms</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Slow Queries</p>
        <p className="text-xl font-bold text-yellow-600">{slowQueries}</p>
      </div>
    </div>
  </Card>
</div>
```

### 3. Functional Specifications

**Metrics to Monitor**:

**1. System Health**
- Uptime percentage
- Server CPU usage
- Memory usage
- Disk space

**2. Application Performance**
- Active users (real-time)
- API response times
- Request volume
- Error rate

**3. Database Performance**
- Connection pool status
- Query execution times
- Slow queries (> 1s)
- Database size

**4. Error Tracking**
- Error logs (last 24h, 7d, 30d)
- Error types & frequency
- Stack traces
- Affected users

**Features**:
- Real-time monitoring
- Auto-refresh (every 30s)
- Alert notifications
- Export logs

### 4. Data Requirements

**Model**: `SystemMetric`

```typescript
{
  id: string,
  metricType: 'CPU' | 'MEMORY' | 'DISK' | 'API_RESPONSE' | 'ERROR',
  value: number,
  unit: string,
  timestamp: DateTime
}
```

**Model**: `ErrorLog`

```typescript
{
  id: string,
  errorType: string,
  message: string,
  stackTrace?: string,
  userId?: string,
  endpoint?: string,
  statusCode?: number,
  timestamp: DateTime
}
```

---

## 🎯 SCR-ADM-003: Cấu Hình API

### 1. Screen Information

| Thuộc Tính | Giá Trị |
|------------|---------|
| **Screen ID** | SCR-ADM-003 |
| **Screen Name** | Cấu Hình API |
| **Route** | `/admin/api` |
| **Component** | ⚠️ **TO BE CREATED** |
| **Access Control** | ADMIN only |

### 2. Required UI Components

**Layout Structure**:
```tsx
<div className="p-6">
  {/* API Keys Management */}
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>API Keys</CardTitle>
      <Button onClick={handleCreateApiKey}>
        <Plus /> Tạo API Key Mới
      </Button>
    </CardHeader>
    <CardContent>
      <Table>
        <TableRow>
          <TableCell>Key Name</TableCell>
          <TableCell>API Key</TableCell>
          <TableCell>Permissions</TableCell>
          <TableCell>Created</TableCell>
          <TableCell>Last Used</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </Table>
    </CardContent>
  </Card>
  
  {/* Rate Limiting */}
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Rate Limiting</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <Label>Requests per minute</Label>
          <Input type="number" value={rateLimit} />
        </div>
        <div>
          <Label>Burst limit</Label>
          <Input type="number" value={burstLimit} />
        </div>
        <Button>Save Settings</Button>
      </div>
    </CardContent>
  </Card>
  
  {/* Webhooks */}
  <Card>
    <CardHeader>
      <CardTitle>Webhooks</CardTitle>
      <Button onClick={handleCreateWebhook}>
        <Plus /> Thêm Webhook
      </Button>
    </CardHeader>
    <CardContent>
      <Table>
        <TableRow>
          <TableCell>Event</TableCell>
          <TableCell>URL</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </Table>
    </CardContent>
  </Card>
</div>
```

### 3. Functional Specifications

**API Key Management**:
- Generate API keys
- Set permissions (read/write)
- Revoke keys
- Track usage

**Rate Limiting**:
- Configure requests per minute
- Burst limit
- IP-based limiting
- API key-based limiting

**Webhooks**:
- Configure webhook URLs
- Select events (Lead created, RO completed, etc.)
- Test webhooks
- View delivery logs

**Integration Settings**:
- Third-party integrations
- OAuth configuration
- API documentation link

### 4. Data Requirements

**Model**: `ApiKey`

```typescript
{
  id: string,
  name: string,
  key: string, // Hashed
  permissions: string[], // ['read:leads', 'write:customers']
  status: 'ACTIVE' | 'REVOKED',
  lastUsed?: DateTime,
  createdAt: DateTime
}
```

**Model**: `Webhook`

```typescript
{
  id: string,
  event: string, // 'lead.created', 'ro.completed'
  url: string,
  secret: string,
  status: 'ACTIVE' | 'INACTIVE',
  createdAt: DateTime
}
```

---

## 📝 Module 8 Summary

### Implementation Status

**⚠️ CRITICAL GAP**: Toàn bộ module chưa được implement

**Screens Missing**: 3/3 (100%)

**Priority**: **HIGH** - Required for production deployment

### UI Components Required

**To Implement**:
- ⚠️ User management table & forms
- ⚠️ Role permission matrix
- ⚠️ System monitoring dashboard
- ⚠️ API configuration forms
- ⚠️ Activity log viewer

**Can Reuse from Existing Modules**:
- ✅ Table, Card, Button, Dialog
- ✅ Form components (Input, Select)
- ✅ Charts (Recharts from Dashboard)
- ✅ Badge, DropdownMenu

### Recommended Implementation Approach

**Phase 1: User Management (Critical)**
1. Create `User` model & authentication
2. Implement SCR-ADM-001 (User Management)
3. Implement role-based access control (RBAC)

**Phase 2: System Monitoring**
4. Set up logging infrastructure
5. Implement SCR-ADM-002 (System Monitoring)
6. Configure alerts

**Phase 3: API Configuration**
7. Implement API key management
8. Implement SCR-ADM-003 (API Config)
9. Set up webhooks

### Data Models Summary

**Primary Models**:
- `User` - Người dùng
- `ActivityLog` - Nhật ký hoạt động
- `SystemMetric` - Metrics hệ thống
- `ErrorLog` - Nhật ký lỗi
- `ApiKey` - API keys
- `Webhook` - Webhooks

### Business Rules

| Rule ID | Description |
|---------|-------------|
| BR-ADM-001 | Email must be unique |
| BR-ADM-002 | Password complexity requirements |
| BR-ADM-003 | Only ADMIN can manage users |
| BR-ADM-004 | Activity logs retained for 1 year |
| BR-ADM-005 | API rate limit: 100 requests/minute |
| BR-ADM-006 | Failed login attempts > 5 = Account lock |
| BR-ADM-007 | Session timeout: 8 hours |

---

**End of Module 8 FRD**
