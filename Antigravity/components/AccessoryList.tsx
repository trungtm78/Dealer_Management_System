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
  Package,
  Save,
  X,
  AlertTriangle
} from "lucide-react";

interface Accessory {
  id: string;
  name: string;
  code: string;
  category: string;
  brand: string;
  unit_price: number;
  stock_quantity: number;
  min_stock_level: number;
  compatible_models: string[];
  status: "ACTIVE" | "DISCONTINUED" | "OUT_OF_STOCK";
  description?: string;
}

const MOCK_ACCESSORIES: Accessory[] = [
  {
    id: "1",
    name: "Camera Hành Trình",
    code: "CAM-001",
    category: "Điện Tử",
    brand: "Honda",
    unit_price: 2500000,
    stock_quantity: 15,
    min_stock_level: 5,
    compatible_models: ["Civic", "CR-V", "City"],
    status: "ACTIVE",
    description: "Camera hành trình chính hãng Honda"
  },
  {
    id: "2",
    name: "Thảm Lót Sàn",
    code: "MAT-002", 
    category: "Nội Thất",
    brand: "Honda",
    unit_price: 1200000,
    stock_quantity: 3,
    min_stock_level: 10,
    compatible_models: ["Civic", "City"],
    status: "ACTIVE",
    description: "Thảm lót sàn cao cấp"
  },
  {
    id: "3",
    name: "Baga Cầu Nóc",
    code: "BAG-003",
    category: "Ngoại Thất",
    brand: "Honda",
    unit_price: 3500000,
    stock_quantity: 0,
    min_stock_level: 2,
    compatible_models: ["CR-V"],
    status: "OUT_OF_STOCK",
    description: "Baga cầu nóc CR-V"
  }
];

const CATEGORIES = ["Điện Tử", "Nội Thất", "Ngoại Thất", "Động Cơ", "An Toàn"];
const BRANDS = ["Honda", "Toyota", "Mazda", "Ford", "Hyundai"];
const VEHICLE_MODELS = ["Civic", "CR-V", "City", "Accord", "HR-V"];

export default function AccessoryList() {
  const [accessories, setAccessories] = useState<Accessory[]>(MOCK_ACCESSORIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
  const [formData, setFormData] = useState<Partial<Accessory>>({
    name: "",
    code: "",
    category: "",
    brand: "",
    unit_price: 0,
    stock_quantity: 0,
    min_stock_level: 0,
    compatible_models: [],
    status: "ACTIVE",
    description: ""
  });

  const filteredAccessories = accessories.filter(accessory =>
    accessory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accessory.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accessory.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingAccessory(null);
    setFormData({
      name: "",
      code: "",
      category: "",
      brand: "",
      unit_price: 0,
      stock_quantity: 0,
      min_stock_level: 0,
      compatible_models: [],
      status: "ACTIVE",
      description: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (accessory: Accessory) => {
    setEditingAccessory(accessory);
    setFormData(accessory);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.code || !formData.category || !formData.brand) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const newAccessory: Accessory = {
      id: editingAccessory?.id || Date.now().toString(),
      name: formData.name!,
      code: formData.code!,
      category: formData.category!,
      brand: formData.brand!,
      unit_price: formData.unit_price || 0,
      stock_quantity: formData.stock_quantity || 0,
      min_stock_level: formData.min_stock_level || 0,
      compatible_models: formData.compatible_models || [],
      status: formData.status as "ACTIVE" | "DISCONTINUED" | "OUT_OF_STOCK",
      description: formData.description
    };

    // Auto-update status based on stock
    if (newAccessory.stock_quantity === 0) {
      newAccessory.status = "OUT_OF_STOCK";
    } else if (newAccessory.stock_quantity < newAccessory.min_stock_level) {
      // Keep current status but indicate low stock
    }

    if (editingAccessory) {
      setAccessories(prev => prev.map(a => a.id === editingAccessory.id ? newAccessory : a));
    } else {
      setAccessories(prev => [...prev, newAccessory]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa phụ tùng này?")) {
      setAccessories(prev => prev.filter(a => a.id !== id));
    }
  };

  const getStockStatus = (accessory: Accessory) => {
    if (accessory.stock_quantity === 0) return "OUT_OF_STOCK";
    if (accessory.stock_quantity < accessory.min_stock_level) return "LOW_STOCK";
    return "IN_STOCK";
  };

  const getStockBadgeVariant = (status: string) => {
    switch (status) {
      case "IN_STOCK": return "default";
      case "LOW_STOCK": return "secondary";
      case "OUT_OF_STOCK": return "destructive";
      default: return "secondary";
    }
  };

  const getStockBadgeText = (status: string) => {
    switch (status) {
      case "IN_STOCK": return "Còn Hàng";
      case "LOW_STOCK": return "Sắp Hết";
      case "OUT_OF_STOCK": return "Hết Hàng";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Phụ Kiện</h2>
          <p className="text-muted-foreground">
            Quản lý thông tin phụ tùng và phụ kiện
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#E60012] hover:bg-[#c50010]" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm Phụ Kiện
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingAccessory ? "Chỉnh sửa Phụ Kiện" : "Thêm Phụ Kiện Mới"}
              </DialogTitle>
              <DialogDescription>
                Nhập thông tin chi tiết cho phụ kiện
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên Phụ Kiện *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="VD: Camera Hành Trình"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Mã Phụ Kiện *</Label>
                  <Input
                    id="code"
                    value={formData.code || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="VD: CAM-001"
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
                  <Label htmlFor="brand">Thương Hiệu *</Label>
                  <Select value={formData.brand || ""} onValueChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thương hiệu" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANDS.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Đơn Giá</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.unit_price || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit_price: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Số Lượng Tồn</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock_quantity || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-stock">Tồn Tối Thiểu</Label>
                  <Input
                    id="min-stock"
                    type="number"
                    value={formData.min_stock_level || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, min_stock_level: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Mức Tương Thích</Label>
                <div className="grid grid-cols-3 gap-2">
                  {VEHICLE_MODELS.map(model => (
                    <div key={model} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`model-${model}`}
                        checked={formData.compatible_models?.includes(model) || false}
                        onChange={(e) => {
                          const models = formData.compatible_models || [];
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, compatible_models: [...models, model] }));
                          } else {
                            setFormData(prev => ({ ...prev, compatible_models: models.filter(m => m !== model) }));
                          }
                        }}
                      />
                      <Label htmlFor={`model-${model}`}>{model}</Label>
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
                  placeholder="Mô tả ngắn về phụ kiện"
                />
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
              placeholder="Tìm kiếm theo tên, mã, thương hiệu..."
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
          <CardTitle>Danh Sách Phụ Kiện</CardTitle>
          <CardDescription>
            {filteredAccessories.length} phụ kiện được tìm thấy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên Phụ Kiện</TableHead>
                  <TableHead>Danh Mục</TableHead>
                  <TableHead>Thương Hiệu</TableHead>
                  <TableHead>Đơn Giá</TableHead>
                  <TableHead>Tồn Kho</TableHead>
                  <TableHead>Tình Trạng</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccessories.map((accessory) => {
                  const stockStatus = getStockStatus(accessory);
                  return (
                    <TableRow key={accessory.id}>
                      <TableCell className="font-mono">{accessory.code}</TableCell>
                      <TableCell className="font-medium">{accessory.name}</TableCell>
                      <TableCell>{accessory.category}</TableCell>
                      <TableCell>{accessory.brand}</TableCell>
                      <TableCell>{accessory.unit_price.toLocaleString()} VND</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{accessory.stock_quantity}</span>
                          {accessory.stock_quantity < accessory.min_stock_level && accessory.stock_quantity > 0 && (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStockBadgeVariant(stockStatus)}>
                          {getStockBadgeText(stockStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(accessory)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(accessory.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}