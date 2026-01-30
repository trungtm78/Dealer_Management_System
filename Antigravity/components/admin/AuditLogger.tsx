"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Activity, 
  Search, 
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Database,
  Settings,
  Shield
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// --- Mock Data ---

const AUDIT_LOGS = [
  {
    id: "1",
    timestamp: "2024-01-30 14:23:45",
    user: "Nguyễn Văn A",
    role: "ADMIN",
    action: "CREATE_USER",
    resource: "users",
    resourceId: "user-123",
    details: "Created new user: Trần Thị B (Sales)",
    status: "success",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0.0.0"
  },
  {
    id: "2",
    timestamp: "2024-01-30 14:15:32",
    user: "Trần Thị B",
    role: "SALES",
    action: "UPDATE_QUOTATION",
    resource: "quotations",
    resourceId: "QT-2024-001",
    details: "Updated quotation price: 850,000,000 VND",
    status: "success",
    ipAddress: "192.168.1.101",
    userAgent: "Chrome/120.0.0.0"
  },
  {
    id: "3",
    timestamp: "2024-01-30 14:10:18",
    user: "Lê Văn C",
    role: "MANAGER",
    action: "DELETE_RECORD",
    resource: "customers",
    resourceId: "customer-456",
    details: "Attempted to delete customer with active contracts",
    status: "failed",
    ipAddress: "192.168.1.102",
    userAgent: "Chrome/120.0.0.0"
  },
  {
    id: "4",
    timestamp: "2024-01-30 14:05:55",
    user: "Phạm D",
    role: "SERVICE",
    action: "ACCESS_RESTRICTED",
    resource: "admin_panel",
    resourceId: null,
    details: "Attempted to access admin panel without permission",
    status: "blocked",
    ipAddress: "192.168.1.103",
    userAgent: "Chrome/120.0.0.0"
  },
  {
    id: "5",
    timestamp: "2024-01-30 13:58:22",
    user: "System",
    role: "SYSTEM",
    action: "BACKUP_COMPLETED",
    resource: "database",
    resourceId: "backup-2024-01-30",
    details: "Automated backup completed successfully",
    status: "success",
    ipAddress: "localhost",
    userAgent: "System Agent"
  }
];

const ACTION_TYPES = [
  { value: "all", label: "Tất cả hành động" },
  { value: "CREATE_USER", label: "Tạo người dùng" },
  { value: "UPDATE_RECORD", label: "Cập nhật bản ghi" },
  { value: "DELETE_RECORD", label: "Xóa bản ghi" },
  { value: "ACCESS_RESTRICTED", label: "Truy cập hạn chế" },
  { value: "BACKUP_COMPLETED", label: "Sao lưu hoàn tất" }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'text-green-600 bg-green-50';
    case 'failed': return 'text-red-600 bg-red-50';
    case 'blocked': return 'text-orange-600 bg-orange-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'blocked': return <Shield className="h-4 w-4 text-orange-500" />;
    default: return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getActionIcon = (action: string) => {
  switch (action) {
    case 'CREATE_USER': return <User className="h-4 w-4" />;
    case 'UPDATE_RECORD': return <Settings className="h-4 w-4" />;
    case 'DELETE_RECORD': return <Database className="h-4 w-4" />;
    case 'ACCESS_RESTRICTED': return <Shield className="h-4 w-4" />;
    case 'BACKUP_COMPLETED': return <Database className="h-4 w-4" />;
    default: return <Activity className="h-4 w-4" />;
  }
};

export default function AuditLogger() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredLogs = AUDIT_LOGS.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = selectedAction === "all" || log.action === selectedAction;
    const matchesStatus = selectedStatus === "all" || log.status === selectedStatus;
    
    return matchesSearch && matchesAction && matchesStatus;
  });

  const handleExport = () => {
    // Implementation for export functionality
    console.log("Exporting audit logs...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Audit Logger</h2>
          <p className="text-muted-foreground">
            Theo dõi hoạt động và sự kiện hệ thống
          </p>
        </div>
        <Button className="bg-[#E60012] hover:bg-[#c50010]" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Xuất Báo Cáo
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Sự Kiện</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{AUDIT_LOGS.length}</div>
            <p className="text-xs text-muted-foreground">
              24 giờ qua
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thành Công</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {AUDIT_LOGS.filter(log => log.status === 'success').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((AUDIT_LOGS.filter(log => log.status === 'success').length / AUDIT_LOGS.length) * 100)}% thành công
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thất Bại</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {AUDIT_LOGS.filter(log => log.status === 'failed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Cần kiểm tra
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bị Chặn</CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {AUDIT_LOGS.filter(log => log.status === 'blocked').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Bảo vệ hệ thống
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ Lọc</CardTitle>
          <CardDescription>Lọc log theo điều kiện</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm người dùng, hành động..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn hành động" />
              </SelectTrigger>
              <SelectContent>
                {ACTION_TYPES.map((action) => (
                  <SelectItem key={action.value} value={action.value}>
                    {action.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="success">Thành công</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
                <SelectItem value="blocked">Bị chặn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Nhật Ký Hệ Thống</CardTitle>
          <CardDescription>
            {filteredLogs.length} sự kiện được tìm thấy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời Gian</TableHead>
                  <TableHead>Người Dùng</TableHead>
                  <TableHead>Hành Động</TableHead>
                  <TableHead>Chi Tiết</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {new Date(log.timestamp).toLocaleString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{log.user}</p>
                        <Badge variant="outline">{log.role}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getActionIcon(log.action)}
                        <span className="font-medium">{log.action.replace(/_/g, ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm truncate" title={log.details}>
                        {log.details}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(log.status)}
                        <Badge className={getStatusColor(log.status)}>
                          {log.status.toUpperCase()}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.ipAddress}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}