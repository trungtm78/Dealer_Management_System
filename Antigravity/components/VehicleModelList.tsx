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
  Car,
  Save,
  X
} from "lucide-react";

interface VehicleModel {
  id: string;
  name: string;
  code: string;
  brand: string;
  category: string;
  year: number;
  status: "ACTIVE" | "DISCONTINUED";
  base_price: number;
  engine_type: string;
  transmission: string;
}

const MOCK_VEHICLE_MODELS: VehicleModel[] = [
  {
    id: "1",
    name: "Civic",
    code: "CIV-2024",
    brand: "Honda",
    category: "Sedan",
    year: 2024,
    status: "ACTIVE",
    base_price: 850000000,
    engine_type: "1.5L Turbo",
    transmission: "CVT"
  },
  {
    id: "2", 
    name: "CR-V",
    code: "CRV-2024",
    brand: "Honda",
    category: "SUV",
    year: 2024,
    status: "ACTIVE",
    base_price: 1100000000,
    engine_type: "1.5L Turbo",
    transmission: "CVT"
  },
  {
    id: "3",
    name: "City",
    code: "CTY-2023",
    brand: "Honda", 
    category: "Sedan",
    year: 2023,
    status: "ACTIVE",
    base_price: 520000000,
    engine_type: "1.5L",
    transmission: "CVT"
  }
];

const BRANDS = ["Honda", "Toyota", "Mazda", "Ford", "Hyundai"];
const CATEGORIES = ["Sedan", "SUV", "Hatchback", "Pickup", "Van"];
const ENGINE_TYPES = ["1.5L", "1.5L Turbo", "2.0L", "2.0L Turbo", "Hybrid"];
const TRANSMISSIONS = ["Manual", "CVT", "Automatic"];

export default function VehicleModelList() {
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>(MOCK_VEHICLE_MODELS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<VehicleModel | null>(null);
  const [formData, setFormData] = useState<Partial<VehicleModel>>({
    name: "",
    code: "",
    brand: "",
    category: "",
    year: new Date().getFullYear(),
    status: "ACTIVE",
    base_price: 0,
    engine_type: "",
    transmission: ""
  });

  const filteredModels = vehicleModels.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingModel(null);
    setFormData({
      name: "",
      code: "",
      brand: "",
      category: "",
      year: new Date().getFullYear(),
      status: "ACTIVE",
      base_price: 0,
      engine_type: "",
      transmission: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (model: VehicleModel) => {
    setEditingModel(model);
    setFormData(model);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.code || !formData.brand || !formData.category) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const newModel: VehicleModel = {
      id: editingModel?.id || Date.now().toString(),
      name: formData.name!,
      code: formData.code!,
      brand: formData.brand!,
      category: formData.category!,
      year: formData.year || new Date().getFullYear(),
      status: formData.status as "ACTIVE" | "DISCONTINUED",
      base_price: formData.base_price || 0,
      engine_type: formData.engine_type || "",
      transmission: formData.transmission || ""
    };

    if (editingModel) {
      setVehicleModels(prev => prev.map(m => m.id === editingModel.id ? newModel : m));
    } else {
      setVehicleModels(prev => [...prev, newModel]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa dòng xe này?")) {
      setVehicleModels(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dòng Xe</h2>
          <p className="text-muted-foreground">
            Quản lý thông tin các dòng xe
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#E60012] hover:bg-[#c50010]" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm Dòng Xe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingModel ? "Chỉnh sửa Dòng Xe" : "Thêm Dòng Xe Mới"}
              </DialogTitle>
              <DialogDescription>
                Nhập thông tin chi tiết cho dòng xe
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên Dòng Xe *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="VD: Civic, CR-V"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Mã Dòng Xe *</Label>
                  <Input
                    id="code"
                    value={formData.code || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="VD: CIV-2024"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Hãng *</Label>
                  <Select value={formData.brand || ""} onValueChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn hãng" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANDS.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Loại Xe *</Label>
                  <Select value={formData.category || ""} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại xe" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Năm SX</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng Thái</Label>
                  <Select value={formData.status || "ACTIVE"} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as "ACTIVE" | "DISCONTINUED" }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Đang Bán</SelectItem>
                      <SelectItem value="DISCONTINUED">Ngừng Kinh Doanh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Giá Gốc</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.base_price || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, base_price: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="engine">Động Cơ</Label>
                  <Select value={formData.engine_type || ""} onValueChange={(value) => setFormData(prev => ({ ...prev, engine_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn động cơ" />
                    </SelectTrigger>
                    <SelectContent>
                      {ENGINE_TYPES.map(engine => (
                        <SelectItem key={engine} value={engine}>{engine}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transmission">Hộp Số</Label>
                  <Select value={formData.transmission || ""} onValueChange={(value) => setFormData(prev => ({ ...prev, transmission: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn hộp số" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSMISSIONS.map(trans => (
                        <SelectItem key={trans} value={trans}>{trans}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
              placeholder="Tìm kiếm theo tên, mã, hãng..."
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
          <CardTitle>Danh Sách Dòng Xe</CardTitle>
          <CardDescription>
            {filteredModels.length} dòng xe được tìm thấy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên Dòng Xe</TableHead>
                  <TableHead>Hãng</TableHead>
                  <TableHead>Loại Xe</TableHead>
                  <TableHead>Năm SX</TableHead>
                  <TableHead>Giá Gốc</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModels.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="font-mono">{model.code}</TableCell>
                    <TableCell className="font-medium">{model.name}</TableCell>
                    <TableCell>{model.brand}</TableCell>
                    <TableCell>{model.category}</TableCell>
                    <TableCell>{model.year}</TableCell>
                    <TableCell>{model.base_price.toLocaleString()} VND</TableCell>
                    <TableCell>
                      <Badge variant={model.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {model.status === 'ACTIVE' ? 'Đang Bán' : 'Ngừng Kinh Doanh'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(model)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(model.id)}>
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