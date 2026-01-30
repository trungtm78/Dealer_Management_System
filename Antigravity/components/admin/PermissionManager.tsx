"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  Settings, 
  Plus,
  Save,
  Edit,
  Trash2,
  Check,
  X,
  Key,
  Eye,
  FileText,
  DollarSign,
  Wrench,
  Package
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

// --- Mock Data ---

const ROLES = [
  {
    id: "1",
    name: "ADMIN",
    displayName: "Quản Trị Viên",
    description: "Quyền truy cập toàn bộ hệ thống",
    color: "bg-red-500",
    userCount: 3,
    isSystem: true
  },
  {
    id: "2",
    name: "MANAGER",
    displayName: "Quản Lý",
    description: "Quyền quản lý bộ phận và báo cáo",
    color: "bg-blue-500",
    userCount: 5,
    isSystem: true
  },
  {
    id: "3",
    name: "SALES",
    displayName: "Nhân Viên Bán Hàng",
    description: "Quyền bán hàng và quản lý khách hàng",
    color: "bg-green-500",
    userCount: 12,
    isSystem: true
  },
  {
    id: "4",
    name: "SERVICE",
    displayName: "Nhân Viên Dịch Vụ",
    description: "Quyền sửa chữa và dịch vụ",
    color: "bg-purple-500",
    userCount: 8,
    isSystem: true
  },
  {
    id: "5",
    name: "PARTS",
    displayName: "Nhân Viên Phụ Tùng",
    description: "Quyền quản lý kho và phụ tùng",
    color: "bg-orange-500",
    userCount: 4,
    isSystem: true
  },
  {
    id: "6",
    name: "ACCOUNTING",
    displayName: "Kế Toán",
    description: "Quyền tài chính và kế toán",
    color: "bg-indigo-500",
    userCount: 2,
    isSystem: true
  },
  {
    id: "7",
    name: "INSURANCE",
    displayName: "Chuyên Viên Bảo Hiểm",
    description: "Quyền quản lý bảo hiểm",
    color: "bg-teal-500",
    userCount: 3,
    isSystem: true
  }
];

const PERMISSIONS = [
  {
    category: "Dashboard",
    icon: Eye,
    permissions: [
      { key: "dashboard.view", name: "Xem Dashboard", description: "Xem dashboard tổng quan" },
      { key: "dashboard.reports", name: "Xem Báo Cáo", description: "Xem và xuất báo cáo" }
    ]
  },
  {
    category: "CRM",
    icon: Users,
    permissions: [
      { key: "crm.customers.view", name: "Xem Khách Hàng", description: "Xem thông tin khách hàng" },
      { key: "crm.customers.create", name: "Tạo Khách Hàng", description: "Tạo khách hàng mới" },
      { key: "crm.customers.edit", name: "Sửa Khách Hàng", description: "Chỉnh sửa thông tin khách hàng" },
      { key: "crm.customers.delete", name: "Xóa Khách Hàng", description: "Xóa khách hàng" },
      { key: "crm.leads.view", name: "Xem Leads", description: "Xem danh sách leads" },
      { key: "crm.leads.create", name: "Tạo Lead", description: "Tạo lead mới" }
    ]
  },
  {
    category: "Sales",
    icon: DollarSign,
    permissions: [
      { key: "sales.quotations.view", name: "Xem Báo Giá", description: "Xem báo giá" },
      { key: "sales.quotations.create", name: "Tạo Báo Giá", description: "Tạo báo giá mới" },
      { key: "sales.contracts.view", name: "Xem Hợp Đồng", description: "Xem hợp đồng" },
      { key: "sales.contracts.create", name: "Tạo Hợp Đồng", description: "Tạo hợp đồng mới" }
    ]
  },
  {
    category: "Service",
    icon: Wrench,
    permissions: [
      { key: "service.appointments.view", name: "Xem Lịch Hẹn", description: "Xem lịch hẹn dịch vụ" },
      { key: "service.appointments.create", name: "Tạo Lịch Hẹn", description: "Tạo lịch hẹn mới" },
      { key: "service.repair_orders.view", name: "Xem Lệnh Sửa Chữa", description: "Xem lệnh sửa chữa" },
      { key: "service.repair_orders.create", name: "Tạo Lệnh Sửa Chữa", description: "Tạo lệnh sửa chữa mới" }
    ]
  },
  {
    category: "Parts",
    icon: Package,
    permissions: [
      { key: "parts.inventory.view", name: "Xem Kho", description: "Xem tồn kho phụ tùng" },
      { key: "parts.inventory.edit", name: "Sửa Kho", description: "Chỉnh sửa tồn kho" },
      { key: "parts.purchase.create", name: "Tạo Đơn Mua", description: "Tạo đơn hàng mua" }
    ]
  },
  {
    category: "Admin",
    icon: Settings,
    permissions: [
      { key: "admin.users.view", name: "Xem Users", description: "Xem danh sách users" },
      { key: "admin.users.create", name: "Tạo User", description: "Tạo user mới" },
      { key: "admin.roles.view", name: "Xem Roles", description: "Xem danh sách roles" },
      { key: "admin.audit.view", name: "Xem Audit Log", description: "Xem audit log hệ thống" }
    ]
  }
];

const ROLE_PERMISSIONS = {
  "ADMIN": PERMISSIONS.flatMap(cat => cat.permissions.map(p => p.key)),
  "MANAGER": [
    "dashboard.view", "dashboard.reports",
    "crm.customers.view", "crm.customers.create", "crm.customers.edit",
    "crm.leads.view", "crm.leads.create",
    "sales.quotations.view", "sales.quotations.create",
    "sales.contracts.view", "sales.contracts.create",
    "service.appointments.view", "service.appointments.create",
    "service.repair_orders.view", "service.repair_orders.create",
    "parts.inventory.view", "parts.inventory.edit",
    "admin.users.view", "admin.audit.view"
  ],
  "SALES": [
    "dashboard.view",
    "crm.customers.view", "crm.customers.create", "crm.customers.edit",
    "crm.leads.view", "crm.leads.create",
    "sales.quotations.view", "sales.quotations.create",
    "sales.contracts.view"
  ],
  "SERVICE": [
    "dashboard.view",
    "crm.customers.view",
    "service.appointments.view", "service.appointments.create",
    "service.repair_orders.view", "service.repair_orders.create",
    "parts.inventory.view"
  ],
  "PARTS": [
    "dashboard.view",
    "crm.customers.view",
    "parts.inventory.view", "parts.inventory.edit", "parts.purchase.create"
  ],
  "ACCOUNTING": [
    "dashboard.view", "dashboard.reports",
    "crm.customers.view",
    "sales.contracts.view",
    "service.repair_orders.view"
  ],
  "INSURANCE": [
    "dashboard.view",
    "crm.customers.view", "crm.customers.create", "crm.customers.edit",
    "sales.contracts.view", "sales.contracts.create"
  ]
};

export default function PermissionManager() {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [permissions, setPermissions] = useState(ROLE_PERMISSIONS);
  const [isEditing, setIsEditing] = useState(false);

  const handlePermissionChange = (roleName: string, permissionKey: string, checked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [roleName]: checked 
        ? [...prev[roleName as keyof typeof prev], permissionKey]
        : prev[roleName as keyof typeof prev].filter((p: string) => p !== permissionKey)
    }));
  };

  const handleSavePermissions = () => {
    toast.success("Quyền đã được cập nhật thành công");
    setIsEditing(false);
  };

  const handleAddRole = () => {
    toast.success("Đã tạo role mới");
  };

  const handleDeleteRole = (roleName: string) => {
    if (roleName === 'ADMIN' || roleName === 'MANAGER') {
      toast.error("Không thể xóa role hệ thống");
      return;
    }
    toast.success(`Đã xóa role ${roleName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quản Lý Quyền Hạn</h2>
          <p className="text-muted-foreground">
            Quản lý roles và permissions hệ thống
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="mr-2 h-4 w-4" />
            {isEditing ? 'Hủy' : 'Chỉnh Sửa'}
          </Button>
          <Button className="bg-[#E60012] hover:bg-[#c50010]" onClick={handleSavePermissions}>
            <Save className="mr-2 h-4 w-4" />
            Lưu Thay Đổi
          </Button>
        </div>
      </div>

      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roles">Quản Lý Roles</TabsTrigger>
          <TabsTrigger value="permissions">Chi Tiết Quyền</TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Danh Sách Roles</CardTitle>
                  <CardDescription>
                    Các roles và số lượng người dùng trong hệ thống
                  </CardDescription>
                </div>
                <Button onClick={handleAddRole}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ROLES.map((role) => (
                  <Card 
                    key={role.id} 
                    className={`cursor-pointer transition-all ${
                      selectedRole.id === role.id ? 'ring-2 ring-[#E60012]' : ''
                    }`}
                    onClick={() => setSelectedRole(role)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className={`h-10 w-10 rounded-full ${role.color} flex items-center justify-center`}>
                            <Shield className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{role.displayName}</CardTitle>
                            <p className="text-sm text-muted-foreground">{role.name}</p>
                          </div>
                        </div>
                        {!role.isSystem && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRole(role.name);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        {role.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">
                          {role.userCount} users
                        </Badge>
                        {role.isSystem && (
                          <Badge variant="secondary">System</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ma Trận Quyền Hạn</CardTitle>
              <CardDescription>
                Phân quyền cho role: <span className="font-semibold">{selectedRole.displayName}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {PERMISSIONS.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.category} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Icon className="h-5 w-5" />
                        <h3 className="font-semibold text-lg">{category.category}</h3>
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {category.permissions.map((permission) => {
                          const hasPermission = permissions[selectedRole.name as keyof typeof permissions]?.includes(permission.key);
                          
                          return (
                            <div key={permission.key} className="flex items-center space-x-3 p-3 border rounded">
                              <Switch
                                checked={hasPermission}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(selectedRole.name, permission.key, checked)
                                }
                                disabled={!isEditing}
                              />
                              <div className="flex-1">
                                <Label className="font-medium">{permission.name}</Label>
                                <p className="text-sm text-muted-foreground">
                                  {permission.description}
                                </p>
                              </div>
                              {hasPermission && (
                                <Check className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}