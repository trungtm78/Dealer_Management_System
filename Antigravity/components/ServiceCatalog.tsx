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
  Wrench,
  Clock,
  DollarSign,
  Save,
  X,
  Users
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  standard_duration: number; // in minutes
  base_price: number;
  required_skills: string[];
  required_parts: string[];
  status: "ACTIVE" | "INACTIVE";
  is_premium: boolean;
  warranty_months: number;
}

const MOCK_SERVICES: Service[] = [
  {
    id: "1",
    name: "Bảo Dưỡng Định Kỳ 10.000km",
    code: "BD-10K",
    category: "Bảo Dưỡng",
    description: "Bảo dưỡng định kỳ cho xe 10.000km",
    standard_duration: 120,
    base_price: 1500000,
    required_skills: ["KTV Cơ Bản"],
    required_parts: ["Dầu nhớt", "Lọc dầu", "Lọc gió"],
    status: "ACTIVE",
    is_premium: false,
    warranty_months: 3
  },
  {
    id: "2",
    name: "Thay Lốp",
    code: "TL-001",
    category: "Lốp",
    description: "Thay lốp xe",
    standard_duration: 60,
    base_price: 800000,
    required_skills: ["KTV Cơ Bản"],
    required_parts: ["Lốp xe"],
    status: "ACTIVE",
    is_premium: false,
    warranty_months: 6
  },
  {
    id: "3",
    name: "Sơn Xe Chuyên Nghiệp",
    code: "SX-001",
    category: "Sơn",
    description: "Sơn xe chuyên nghiệp công nghệ cao",
    standard_duration: 480,
    base_price: 5000000,
    required_skills: ["KTV Sơn", "KTV Chuyên Sâu"],
    required_parts: ["Sơn xe", "Bột bả", "Màu sơn"],
    status: "ACTIVE",
    is_premium: true,
    warranty_months: 12
  }
];

const CATEGORIES = ["Bảo Dưỡng", "Sửa Chữa", "Sơn", "Lốp", "Điện Tử", "Gầm"];
const SKILLS = ["KTV Cơ Bản", "KTV Chuyên Sâu", "KTV Sơn", "KTV Điện", "KTV Gầm"];
const PARTS = ["Dầu nhớt", "Lọc dầu", "Lọc gió", "Lốp xe", "Sơn xe", "Bột bả", "Màu sơn", "Bugi", "Phanh"];

export default function ServiceCatalog() {
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({
    name: "",
    code: "",
    category: "",
    description: "",
    standard_duration: 60,
    base_price: 0,
    required_skills: [],
    required_parts: [],
    status: "ACTIVE",
    is_premium: false,
    warranty_months: 3
  });

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingService(null);
    setFormData({
      name: "",
      code: "",
      category: "",
      description: "",
      standard_duration: 60,
      base_price: 0,
      required_skills: [],
      required_parts: [],
      status: "ACTIVE",
      is_premium: false,
      warranty_months: 3
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData(service);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.code || !formData.category || !formData.description) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const newService: Service = {
      id: editingService?.id || Date.now().toString(),
      name: formData.name!,
      code: formData.code!,
      category: formData.category!,
      description: formData.description!,
      standard_duration: formData.standard_duration || 60,
      base_price: formData.base_price || 0,
      required_skills: formData.required_skills || [],
      required_parts: formData.required_parts || [],
      status: formData.status as "ACTIVE" | "INACTIVE",
      is_premium: formData.is_premium || false,
      warranty_months: formData.warranty_months || 3
    };

    if (editingService) {
      setServices(prev => prev.map(s => s.id === editingService.id ? newService : s));
    } else {
      setServices(prev => [...prev, newService]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? mins + 'p' : ''}`;
    }
    return `${mins}p`;
  };

  const getSkillBadges = (skills: string[]) => {
    return skills.map(skill => (
      <Badge key={skill} variant="outline" className="text-xs">
        {skill}
      </Badge>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dịch Vụ</h2>
          <p className="text-muted-foreground">
            Quản lý danh mục dịch vụ và báo giá
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#E60012] hover:bg-[#c50010]" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm Dịch Vụ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Chỉnh sửa Dịch Vụ" : "Thêm Dịch Vụ Mới"}
              </DialogTitle>
              <DialogDescription>
                Nhập thông tin chi tiết cho dịch vụ
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên Dịch Vụ *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="VD: Bảo Dưỡng Định Kỳ"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Mã Dịch Vụ *</Label>
                  <Input
                    id="code"
                    value={formData.code || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="VD: BD-10K"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Danh Mục *</Label>
                  <Select value={formData.category || ""} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng Thái</Label>
                  <Select value={formData.status || "ACTIVE"} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as "ACTIVE" | "INACTIVE" }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Hoạt Động</SelectItem>
                      <SelectItem value="INACTIVE">Ngừng Hoạt Động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô Tả *</Label>
                <Input
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả chi tiết về dịch vụ"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Thời Gian (phút)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.standard_duration || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, standard_duration: parseInt(e.target.value) || 60 }))}
                    placeholder="60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Giá Cơ Bản</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.base_price || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, base_price: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warranty">Bảo Hành (tháng)</Label>
                  <Input
                    id="warranty"
                    type="number"
                    value={formData.warranty_months || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, warranty_months: parseInt(e.target.value) || 3 }))}
                    placeholder="3"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Kỹ Năng Bắt Buộc</Label>
                <div className="grid grid-cols-3 gap-2">
                  {SKILLS.map(skill => (
                    <div key={skill} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`skill-${skill}`}
                        checked={formData.required_skills?.includes(skill) || false}
                        onChange={(e) => {
                          const skills = formData.required_skills || [];
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, required_skills: [...skills, skill] }));
                          } else {
                            setFormData(prev => ({ ...prev, required_skills: skills.filter(s => s !== skill) }));
                          }
                        }}
                      />
                      <Label htmlFor={`skill-${skill}`} className="text-sm">{skill}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Vật Tư Cần Thiết</Label>
                <div className="grid grid-cols-4 gap-2">
                  {PARTS.map(part => (
                    <div key={part} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`part-${part}`}
                        checked={formData.required_parts?.includes(part) || false}
                        onChange={(e) => {
                          const parts = formData.required_parts || [];
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, required_parts: [...parts, part] }));
                          } else {
                            setFormData(prev => ({ ...prev, required_parts: parts.filter(p => p !== part) }));
                          }
                        }}
                      />
                      <Label htmlFor={`part-${part}`} className="text-sm">{part}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is-premium"
                  checked={formData.is_premium || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_premium: e.target.checked }))}
                />
                <Label htmlFor="is-premium">Dịch Vụ Cao Cấp</Label>
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
              placeholder="Tìm kiếm theo tên, mã, danh mục..."
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
          <CardTitle>Danh Mục Dịch Vụ</CardTitle>
          <CardDescription>
            {filteredServices.length} dịch vụ được tìm thấy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên Dịch Vụ</TableHead>
                  <TableHead>Danh Mục</TableHead>
                  <TableHead>Thời Gian</TableHead>
                  <TableHead>Giá Cơ Bản</TableHead>
                  <TableHead>Kỹ Năng</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-mono">{service.code}</TableCell>
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <span>{service.name}</span>
                        {service.is_premium && (
                          <Badge variant="default" className="text-xs">Cao Cấp</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDuration(service.standard_duration)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>{service.base_price.toLocaleString()} VND</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {getSkillBadges(service.required_skills)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={service.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {service.status === 'ACTIVE' ? 'Hoạt Động' : 'Ngừng Hoạt Động'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)}>
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