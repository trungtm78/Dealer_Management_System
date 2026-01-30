
"use client";

import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, AlertCircle, Package } from "lucide-react";
import { InventoryService } from "@/services/inventory.service"; // NEW Service
import { PartDTO } from "@/lib/types/inventory"; // NEW Types
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function InventoryList() {
    const [parts, setParts] = useState<PartDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("ALL");
    const [filterStock, setFilterStock] = useState("ALL"); // ALL, LOW, OUT

    const loadParts = async () => {
        try {
            const data = await InventoryService.getParts();
            setParts(data);
        } catch (error) {
            toast.error("Failed to load inventory");
        }
    };

    useEffect(() => {
        loadParts();
    }, []);

    const filteredParts = parts.filter((part) => {
        const matchesSearch =
            part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            part.partNumber.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === "ALL" || part.category === filterCategory;

        let matchesStock = true;
        if (filterStock === "LOW") {
            matchesStock = part.quantity <= part.minStock && part.quantity > 0;
        } else if (filterStock === "OUT") {
            matchesStock = part.quantity === 0;
        }

        return matchesSearch && matchesCategory && matchesStock;
    });

    const getStockStatus = (part: PartDTO) => {
        if (part.quantity === 0) return <Badge variant="destructive">Hết Hàng</Badge>;
        if (part.quantity <= part.minStock) return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">Sắp Hết</Badge>;
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Sẵn Sàng</Badge>;
    };

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newPart, setNewPart] = useState({
        partNumber: "",
        name: "",
        category: "OIL",
        price: 0,
        quantity: 0,
        minStock: 10,
        location: ""
    });

    const handleCreate = async () => {
        if (!newPart.partNumber || !newPart.name) {
            toast.error("Vui lòng nhập Mã và Tên phụ tùng");
            return;
        }

        try {
            const res = await InventoryService.createPart({
                ...newPart,
                price: Number(newPart.price),
                quantity: Number(newPart.quantity),
                minStock: Number(newPart.minStock)
            });

            if (res.success) {
                toast.success("Thêm phụ tùng mới thành công");
                setIsCreateOpen(false);
                setNewPart({ partNumber: "", name: "", category: "OIL", price: 0, quantity: 0, minStock: 10, location: "" });
                loadParts();
            } else {
                toast.error(res.error || "Thêm phụ tùng thất bại");
            }
        } catch (error) {
            toast.error("Lỗi hệ thống");
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Package className="h-6 w-6 text-primary" />
                        Kho Phụ Tùng
                    </CardTitle>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>+ Thêm Phụ Tùng Mới</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Thêm Phụ Tùng Mới</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="partNumber">Mã Phụ Tùng (*)</Label>
                                        <Input id="partNumber" value={newPart.partNumber} onChange={(e) => setNewPart({ ...newPart, partNumber: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Danh Mục</Label>
                                        <Select value={newPart.category} onValueChange={(val) => setNewPart({ ...newPart, category: val })}>
                                            <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="OIL">Dầu Nhớt</SelectItem>
                                                <SelectItem value="SPARE_PART">Phụ Tùng Thay Thế</SelectItem>
                                                <SelectItem value="CONSUMABLE">Vật Tư Tiêu Hao</SelectItem>
                                                <SelectItem value="ACCESSORY">Phụ Kiện</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Tên Phụ Tùng (*)</Label>
                                    <Input id="name" value={newPart.name} onChange={(e) => setNewPart({ ...newPart, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Giá Bán (VNĐ)</Label>
                                        <Input id="price" type="number" value={newPart.price} onChange={(e) => setNewPart({ ...newPart, price: Number(e.target.value) })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Vị Trí Kho</Label>
                                        <Input id="location" value={newPart.location} onChange={(e) => setNewPart({ ...newPart, location: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">Số Lượng Tồn</Label>
                                        <Input id="quantity" type="number" value={newPart.quantity} onChange={(e) => setNewPart({ ...newPart, quantity: Number(e.target.value) })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="minStock">Mức Tồn Tối Thiểu</Label>
                                        <Input id="minStock" type="number" value={newPart.minStock} onChange={(e) => setNewPart({ ...newPart, minStock: Number(e.target.value) })} />
                                    </div>
                                </div>
                                <Button onClick={handleCreate} className="w-full mt-2">Lưu Phụ Tùng</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm theo Mã PT hoặc Tên..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Danh Mục" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất Cả Danh Mục</SelectItem>
                                <SelectItem value="OIL">Dầu Nhớt</SelectItem>
                                <SelectItem value="SPARE_PART">Phụ Tùng Thay Thế</SelectItem>
                                <SelectItem value="CONSUMABLE">Vật Tư Tiêu Hao</SelectItem>
                                <SelectItem value="ACCESSORY">Phụ Kiện</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterStock} onValueChange={setFilterStock}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Trạng Thái Kho" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất Cả</SelectItem>
                                <SelectItem value="LOW">Sắp Hết Hàng</SelectItem>
                                <SelectItem value="OUT">Hết Hàng</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã Phụ Tùng</TableHead>
                                    <TableHead>Tên Phụ Tùng</TableHead>
                                    <TableHead>Danh Mục</TableHead>
                                    <TableHead>Vị Trí</TableHead>
                                    <TableHead className="text-right">Tồn Kho</TableHead>
                                    <TableHead className="text-right">Giá Bán</TableHead>
                                    <TableHead className="text-center">Trạng Thái</TableHead>
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
                                        <TableRow key={part.id} className="cursor-pointer hover:bg-muted/50">
                                            <TableCell className="font-medium">{part.partNumber}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>{part.name}</span>
                                                    {/* <span className="text-xs text-muted-foreground">Dùng cho: {part.compatibility.join(", ")}</span> */}
                                                </div>
                                            </TableCell>
                                            <TableCell>{part.category}</TableCell>
                                            <TableCell>{part.location}</TableCell>
                                            <TableCell className="text-right font-bold">
                                                {part.quantity} <span className="text-xs font-normal text-muted-foreground">pcs</span>
                                            </TableCell>
                                            <TableCell className="text-right text-primary font-semibold">
                                                {formatCurrency(part.price)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {getStockStatus(part)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-blue-700">{parts.length}</div>
                        <p className="text-sm text-blue-600">Tổng Mã Phụ Tùng</p>
                    </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-200">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-red-700">
                            {parts.filter(p => p.quantity === 0).length}
                        </div>
                        <p className="text-sm text-red-600">Mã Hết Hàng (Cần Nhập Ngay)</p>
                    </CardContent>
                </Card>
                <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-yellow-700">
                            {parts.filter(p => p.quantity <= p.minStock && p.quantity > 0).length}
                        </div>
                        <p className="text-sm text-yellow-600">Mã Sắp Hết (Cần Lưu Ý)</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
