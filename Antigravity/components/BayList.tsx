"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Activity,
  MapPin,
  Settings,
  Save,
  X,
  User,
  Clock
} from "lucide-react";

interface ServiceBay {
  id: string;
  name: string;
  code: string;
  bay_type: "GENERAL" | "SPECIALIZED" | "PREMIUM" | "QUICK_SERVICE";
  location: string;
  capacity: number;
  current_status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "RESERVED";
  current_assignment?: {
    technician_id: string;
    technician_name: string;
    service_order_id: string;
    estimated_end_time: string;
  };
  equipment: string[];
  is_active: boolean;
  description?: string;
}

const MOCK_SERVICE_BAYS: ServiceBay[] = [
  {
    id: "1",
    name: "Khoang Dịch Vụ 1",
    code: "KV-001",
    bay_type: "GENERAL",
    location: "Tầng 1 - Khu A",
    capacity: 2,
    current_status: "OCCUPIED",
    current_assignment: {
      technician_id: "TECH-001",
      technician_name: "Nguyễn Văn A",
      service_order_id: "SO-2024-001",
      estimated_end_time: "2024-01-30 16:00"
    },
    equipment: ["Máy nâng", "Hệ thống khí nén", "Bộ dụng cụ cơ bản"],
    is_active: true,
    description: "Khoang dịch vụ tổng hợp"
  },
  {
    id: "2",
    name: "Khoang Dịch Vụ 2",
    code: "KV-002",
    bay_type: "GENERAL",
    location: "Tầng 1 - Khu A",
    capacity: 2,
    current_status: "AVAILABLE",
    equipment: ["Máy nâng", "Hệ thống khí nén", "Bộ dụng cụ cơ bản"],
    is_active: true,
    description: "Khoang dịch vụ tổng hợp"
  },
  {
    id: "3",
    name: "Khoang Sơn",
    code: "KS-001",
    bay_type: "SPECIALIZED",
    location: "Tầng 2 - Khu B",
    capacity: 1,
    current_status: "MAINTENANCE",
    equipment: ["Phun sơn", "Hệ thống thông gió", "Đèn sấy"],
    is_active: false,
    description: "Khoang sơn chuyên dụng"
  },
  {
    id: "4",
    name: "Khoang Dịch Vụ Nhanh",
    code: "KV-003",
    bay_type: "QUICK_SERVICE",
    location: "Tầng 1 - Khu C",
    capacity: 4,
    current_status: "AVAILABLE",
    equipment: ["Máy rửa xe", "Hệ thống thay dầu", "Bộ dụng cụ nhanh"],
    is_active: true,
    description: "Dịch vụ nhanh (thay dầu, rửa xe)"
  }
];

const BAY_TYPES = [
  { value: "GENERAL", label: "Tổng Hợp" },
  { value: "SPECIALIZED", label: "Chuyên Dụng" },
  { value: "PREMIUM", label: "Cao Cấp" },
  { value: "QUICK_SERVICE", label: "Dịch Vụ Nhanh" }
];

const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Trống", color: "default" },
  { value: "OCCUPIED", label: "Đang Sử Dụng", color: "secondary" },
  { value: "MAINTENANCE", label: "Bảo Trì", color: "destructive" },
  { value: "RESERVED", label: "Đặt Trước", color: "outline" }
];

const EQUIPMENT_OPTIONS = [
  "Máy nâng", "Hệ thống khí nén", "Bộ dụng cụ cơ bản", "Phun sơn", 
  "Hệ thống thông gió", "Đèn sấy", "Máy rửa xe", "Hệ thống thay dầu", 
  "Bộ dụng cụ nhanh", "Máy cân bánh", "Hệ thống chẩn đoán"
];

export default function BayList() {
  const [serviceBays, setServiceBays] = useState<ServiceBay[]>(MOCK_SERVICE_BAYS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBay, setEditingBay] = useState<ServiceBay | null>(null);
  const [formData, setFormData] = useState<Partial<ServiceBay>>({
    name: "",
    code: "",
    bay_type: "GENERAL",
    location: "",
    capacity: 1,
    current_status: "AVAILABLE",
    equipment: [],
    is_active: true,
    description: ""
  });

  const filteredBays = serviceBays.filter(bay =>
    bay.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bay.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bay.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingBay(null);
    setFormData({
      name: "",
      code: "",
      bay_type: "GENERAL",
      location: "",
      capacity: 1,
      current_status: "AVAILABLE",
      equipment: [],
      is_active: true,
      description: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (bay: ServiceBay) => {
    setEditingBay(bay);
    setFormData(bay);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.code || !formData.location) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const newBay: ServiceBay = {
      id: editingBay?.id || Date.now().toString(),
      name: formData.name!,
      code: formData.code!,
      bay_type: formData.bay_type as ServiceBay["bay_type"] || "GENERAL",
      location: formData.location!,
      capacity: formData.capacity || 1,
      current_status: formData.current_status as ServiceBay["current_status"] || "AVAILABLE",
      equipment: formData.equipment || [],
      is_active: formData.is_active || true,
      description: formData.description
    };

    if (editingBay) {
      setServiceBays(prev => prev.map(b => b.id === editingBay.id ? newBay : b));
    } else {
      setServiceBays(prev => [...prev, newBay]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa khoang dịch vụ này?")) {
      setServiceBays(prev => prev.filter(b => b.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(opt => opt.value === status);
    return (
      <Badge variant={statusOption?.color as any}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  const getBayTypeLabel = (type: string) => {
    const bayType = BAY_TYPES.find(t => t.value === type);
    return bayType?.label || type;
  };

  const getUtilizationRate = (bay: ServiceBay) => {
    if (bay.current_status === "AVAILABLE") return "0%";
    if (bay.current_status === "OCCUPIED") return "100%";
    if (bay.current_status === "MAINTENANCE") return "Bảo trì";
    return "Đặt trước";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Khoang Dịch Vụ</h2>
          <p className="text-muted-foreground">
            Quản lý khoang dịch vụ và trạng thái hoạt động
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#E60012] hover:bg-[#c50010]" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm Khoang Dịch Vụ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingBay ? "Chỉnh sửa Khoang Dịch Vụ" : "Thêm Khoang Dịch Vụ Mới"}
              </DialogTitle>
              <DialogDescription>
                Nhập thông tin chi tiết cho khoang dịch vụ
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên Khoang *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="VD: Khoang Dịch Vụ 1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Mã Khoang *</Label>
                  <Input
                    id="code"
                    value={formData.code || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="VD: KV-001"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bay-type">Loại Khoang *</Label>
                  <Select value={formData.bay_type || "GENERAL"} onValueChange={(value) => setFormData(prev => ({ ...prev, bay_type: value as ServiceBay["bay_type"] }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại khoang" />
                    </SelectTrigger>
                    <SelectContent>
                      {BAY_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng Thái</Label>
                  <Select value={formData.current_status || "AVAILABLE"} onValueChange={(value) => setFormData(prev => ({ ...prev, current_status: value as ServiceBay["current_status"] }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(status => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Vị Trí *</Label>
                  <Input
                    id="location"
                    value={formData.location || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="VD: Tầng 1 - Khu A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Sức Chứa</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                    placeholder="1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Thiết Bị</Label>
                <div className="grid grid-cols-3 gap-2">
                  {EQUIPMENT_OPTIONS.map(equipment => (
                    <div key={equipment} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`equipment-${equipment}`}
                        checked={formData.equipment?.includes(equipment) || false}
                        onChange={(e) => {
                          const equipmentList = formData.equipment || [];
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, equipment: [...equipmentList, equipment] }));
                          } else {
                            setFormData(prev => ({ ...prev, equipment: equipmentList.filter(eq => eq !== equipment) }));
                          }
                        }}
                      />
                      <Label htmlFor={`equipment-${equipment}`} className="text-sm">{equipment}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô Tả</Label>
                <Input
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả ngắn về khoang dịch vụ"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is-active"
                  checked={formData.is_active || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                />
                <Label htmlFor="is-active">Hoạt Động</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Hủy
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Lưu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, mã, vị trí..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Khoang Dịch Vụ</CardTitle>
          <CardDescription>
            {filteredBays.length} khoang dịch vụ được tìm thấy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên Khoang</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Vị Trí</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>Hiệu Suất</TableHead>
                  <TableHead>Thiết Bị</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBays.map((bay) => (
                  <TableRow key={bay.id}>
                    <TableCell className="font-mono">{bay.code}</TableCell>
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <span>{bay.name}</span>
                        {!bay.is_active && (
                          <Badge variant="destructive" className="text-xs">Ngừng Hoạt Động</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getBayTypeLabel(bay.bay_type)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{bay.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(bay.current_status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span>{getUtilizationRate(bay)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {bay.equipment.slice(0, 2).map(eq => (
                          <Badge key={eq} variant="outline" className="text-xs">
                            {eq}
                          </Badge>
                        ))}
                        {bay.equipment.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{bay.equipment.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(bay)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(bay.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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