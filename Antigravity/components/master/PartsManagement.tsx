"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Search, Filter, Package } from "lucide-react"
import { toast } from "sonner"

interface VehicleModel {
    id: string
    model_code: string
    model_name: string
    category: string
    status: string
}

interface PartWithCompatibility {
    id: string
    part_number: string
    name: string
    description?: string
    category: string
    quantity: number
    min_stock: number
    unit_price: number
    location?: string
    status: string
    compatible_vehicles: VehicleModel[]
}

interface PartFormData {
    part_number: string
    name: string
    description: string
    category: string
    quantity: number
    min_stock: number
    unit_price: number
    cost_price: number
    location: string
    compatible_vehicle_model_ids: string[]
}

export function PartsManagement() {
    const [parts, setParts] = useState<PartWithCompatibility[]>([])
    const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingPart, setEditingPart] = useState<PartWithCompatibility | null>(null)
    const [formData, setFormData] = useState<PartFormData>({
        part_number: "",
        name: "",
        description: "",
        category: "SPARE_PART",
        quantity: 0,
        min_stock: 10,
        unit_price: 0,
        cost_price: 0,
        location: "",
        compatible_vehicle_model_ids: []
    })

    const categories = [
        { value: "OIL", label: "Dầu Nhớt" },
        { value: "SPARE_PART", label: "Phụ Tùng Thay Thế" },
        { value: "CONSUMABLE", label: "Vật Tư Tiêu Hao" },
        { value: "ACCESSORY", label: "Phụ Kiện" }
    ]

    useEffect(() => {
        fetchParts()
        fetchVehicleModels()
    }, [])

    const fetchParts = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/master/parts")
            if (response.ok) {
                const data = await response.json()
                setParts(data.data || [])
            } else {
                toast.error("Không thể tải danh sách phụ tùng")
            }
        } catch (error) {
            toast.error("Lỗi tải danh sách phụ tùng")
        } finally {
            setLoading(false)
        }
    }

    const fetchVehicleModels = async () => {
        try {
            const response = await fetch("/api/master/vehicle-models?status=ACTIVE")
            if (response.ok) {
                const data = await response.json()
                setVehicleModels(data.data || [])
            }
        } catch (error) {
            console.error("Failed to load vehicle models:", error)
        }
    }

    const handleCreateOrUpdate = async () => {
        if (!formData.part_number || !formData.name) {
            toast.error("Vui lòng nhập Mã và Tên phụ tùng")
            return
        }

        try {
            const url = editingPart ? `/api/master/parts/${editingPart.id}` : "/api/master/parts"
            const method = editingPart ? "PATCH" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                toast.success(editingPart ? "Cập nhật phụ tùng thành công" : "Tạo phụ tùng mới thành công")
                fetchParts()
                setIsDialogOpen(false)
                resetForm()
            } else {
                const error = await response.json()
                toast.error(error.error || "Thao tác thất bại")
            }
        } catch (error) {
            toast.error("Lỗi hệ thống")
        }
    }

    const handleDelete = async (part: PartWithCompatibility) => {
        if (!confirm(`Bạn có chắc muốn xóa phụ tùng ${part.name}?`)) {
            return
        }

        try {
            const response = await fetch(`/api/master/parts/${part.id}`, {
                method: "DELETE"
            })

            if (response.ok) {
                toast.success("Xóa phụ tùng thành công")
                fetchParts()
            } else {
                toast.error("Không thể xóa phụ tùng")
            }
        } catch (error) {
            toast.error("Lỗi hệ thống")
        }
    }

    const handleEdit = (part: PartWithCompatibility) => {
        setEditingPart(part)
        setFormData({
            part_number: part.part_number,
            name: part.name,
            description: part.description || "",
            category: part.category,
            quantity: part.quantity,
            min_stock: part.min_stock,
            unit_price: Number(part.unit_price),
            cost_price: 0, // We don't expose cost_price in view
            location: part.location || "",
            compatible_vehicle_model_ids: part.compatible_vehicles.map(v => v.id)
        })
        setIsDialogOpen(true)
    }

    const resetForm = () => {
        setEditingPart(null)
        setFormData({
            part_number: "",
            name: "",
            description: "",
            category: "SPARE_PART",
            quantity: 0,
            min_stock: 10,
            unit_price: 0,
            cost_price: 0,
            location: "",
            compatible_vehicle_model_ids: []
        })
    }

    const toggleVehicleModel = (modelId: string) => {
        const currentIds = formData.compatible_vehicle_model_ids
        if (currentIds.includes(modelId)) {
            setFormData({
                ...formData,
                compatible_vehicle_model_ids: currentIds.filter(id => id !== modelId)
            })
        } else {
            setFormData({
                ...formData,
                compatible_vehicle_model_ids: [...currentIds, modelId]
            })
        }
    }

    const filteredParts = parts.filter(part => {
        const searchMatch = searchTerm === "" ||
            part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            part.part_number.toLowerCase().includes(searchTerm.toLowerCase())

        const categoryMatch = selectedCategory === "" || part.category === selectedCategory

        return searchMatch && categoryMatch
    })

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Quản Lý Phụ Tùng</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm Phụ Tùng
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingPart ? "Sửa Phụ Tùng" : "Thêm Phụ Tùng Mới"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="part_number">Mã Phụ Tùng (*)</Label>
                                    <Input
                                        id="part_number"
                                        value={formData.part_number}
                                        onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
                                        placeholder="VD: PT001"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="category">Danh Mục</Label>
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="name">Tên Phụ Tùng (*)</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="VD: Lọc dầu động cơ"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Mô Tả</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Mô tả chi tiết"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="unit_price">Giá Bán (VNĐ)</Label>
                                    <Input
                                        id="unit_price"
                                        type="number"
                                        value={formData.unit_price}
                                        onChange={(e) => setFormData({ ...formData, unit_price: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="location">Vị Trí Kho</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="VD: A1-02"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="quantity">Số Lượng Tồn</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="min_stock">Mức Tồn Tối Thiểu</Label>
                                    <Input
                                        id="min_stock"
                                        type="number"
                                        value={formData.min_stock}
                                        onChange={(e) => setFormData({ ...formData, min_stock: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            {/* Vehicle Compatibility Section */}
                            <div className="border-t pt-4 mt-2">
                                <Label className="text-base font-semibold mb-3 block">
                                    Dòng Xe Tương Thích
                                </Label>
                                <div className="border rounded-md p-4 max-h-[250px] overflow-y-auto space-y-2 bg-muted/20">
                                    {vehicleModels.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">Đang tải danh sách dòng xe...</p>
                                    ) : (
                                        vehicleModels.map((model) => (
                                            <div key={model.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`vehicle-${model.id}`}
                                                    checked={formData.compatible_vehicle_model_ids.includes(model.id)}
                                                    onCheckedChange={() => toggleVehicleModel(model.id)}
                                                />
                                                <label
                                                    htmlFor={`vehicle-${model.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                                                >
                                                    {model.model_code} - {model.model_name}
                                                </label>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Đã chọn: {formData.compatible_vehicle_model_ids.length} dòng xe
                                    {formData.compatible_vehicle_model_ids.length === 0 && " (Phụ tùng universal - dùng cho tất cả)"}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Hủy
                            </Button>
                            <Button onClick={handleCreateOrUpdate}>
                                {editingPart ? "Cập Nhật" : "Tạo Mới"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Bộ Lọc
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Tìm kiếm theo Mã hoặc Tên phụ tùng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Tất Cả Danh Mục</option>
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Danh Sách Phụ Tùng
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Đang tải dữ liệu...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã PT</TableHead>
                                    <TableHead>Tên Phụ Tùng</TableHead>
                                    <TableHead>Danh Mục</TableHead>
                                    <TableHead>Dòng Xe Tương Thích</TableHead>
                                    <TableHead className="text-right">Tồn Kho</TableHead>
                                    <TableHead className="text-right">Giá Bán</TableHead>
                                    <TableHead className="text-center">Thao Tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredParts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                            Không tìm thấy phụ tùng nào.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredParts.map((part) => (
                                        <TableRow key={part.id}>
                                            <TableCell className="font-medium">{part.part_number}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{part.name}</span>
                                                    {part.description && (
                                                        <span className="text-xs text-muted-foreground">{part.description}</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {categories.find(c => c.value === part.category)?.label || part.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {part.compatible_vehicles.length === 0 ? (
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                        Universal
                                                    </Badge>
                                                ) : (
                                                    <div className="flex flex-wrap gap-1">
                                                        {part.compatible_vehicles.slice(0, 3).map((vehicle) => (
                                                            <Badge key={vehicle.id} variant="outline" className="text-xs">
                                                                {vehicle.model_code}
                                                            </Badge>
                                                        ))}
                                                        {part.compatible_vehicles.length > 3 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{part.compatible_vehicles.length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right font-bold">
                                                {part.quantity} <span className="text-xs font-normal text-muted-foreground">pcs</span>
                                            </TableCell>
                                            <TableCell className="text-right text-primary font-semibold">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(part.unit_price))}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex gap-2 justify-center">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(part)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(part)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
