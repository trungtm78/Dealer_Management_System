
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
import { Search, Filter, AlertCircle, Car, Plus, RefreshCw } from "lucide-react";
import { VehicleService } from "@/services/vehicle.service";
import { VehicleDTO, VehicleStatus } from "@/lib/types/inventory";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function VehicleList() {
    const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [loading, setLoading] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // New Vehicle Form State
    const [newVehicle, setNewVehicle] = useState({
        vin: "",
        model: "",
        version: "",
        color: "",
        engineNumber: "",
        warehouse: "",
        status: "AVAILABLE"
    });

    const loadVehicles = async () => {
        setLoading(true);
        try {
            const data = await VehicleService.getVehicles();
            setVehicles(data);
        } catch (error) {
            toast.error("Failed to load vehicles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVehicles();
    }, []);

    const handleCreate = async () => {
        if (!newVehicle.vin || !newVehicle.model || !newVehicle.color) {
            toast.error("Vui lòng điền các thông tin bắt buộc (*)");
            return;
        }

        const res = await VehicleService.createVehicle({
            ...newVehicle,
            status: newVehicle.status as VehicleStatus // Simple cast for now
        });

        if (res.success) {
            toast.success("Thêm xe mới thành công");
            setIsCreateOpen(false);
            setNewVehicle({
                vin: "", model: "", version: "", color: "", engineNumber: "", warehouse: "", status: "AVAILABLE"
            });
            loadVehicles();
        } else {
            toast.error(res.error || "Thêm xe thất bại");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa xe này?")) {
            const res = await VehicleService.deleteVehicle(id);
            if (res.success) {
                toast.success("Đã xóa xe");
                loadVehicles();
            } else {
                toast.error(res.error || "Xóa thất bại");
            }
        }
    }

    const filteredVehicles = vehicles.filter((v) => {
        const matchesSearch =
            v.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.model.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === "ALL" || v.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const styles: any = {
            AVAILABLE: "bg-green-100 text-green-800 border-green-200",
            RESERVED: "bg-yellow-100 text-yellow-800 border-yellow-200",
            SOLD: "bg-blue-100 text-blue-800 border-blue-200",
            IN_TRANSIT: "bg-purple-100 text-purple-800 border-purple-200",
            PDS: "bg-orange-100 text-orange-800 border-orange-200"
        };
        const labels: any = {
            AVAILABLE: "Sẵn Sàng",
            RESERVED: "Đã Đặt Cọc",
            SOLD: "Đã Bán",
            IN_TRANSIT: "Đang Về",
            PDS: "Đang K.Tra (PDS)"
        };
        return <Badge variant="outline" className={styles[status] || ""}>{labels[status] || status}</Badge>;
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Car className="h-6 w-6 text-primary" />
                        Kho Xe (Vehicles)
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={loadVehicles}>
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button><Plus className="mr-2 h-4 w-4" /> Nhập Xe Mới</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Nhập Xe Mới Vào Kho</DialogTitle>
                                    <DialogDescription>
                                        Nhập thông tin chi tiết xe. Số VIN là bắt buộc và duy nhất.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="vin">Số VIN (*)</Label>
                                            <Input id="vin" value={newVehicle.vin} onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="model">Dòng Xe (Model) (*)</Label>
                                            <Input id="model" value={newVehicle.model} onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="version">Phiên Bản</Label>
                                            <Input id="version" value={newVehicle.version} onChange={(e) => setNewVehicle({ ...newVehicle, version: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="color">Màu Sắc (*)</Label>
                                            <Input id="color" value={newVehicle.color} onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="engine">Số Máy</Label>
                                        <Input id="engine" value={newVehicle.engineNumber} onChange={(e) => setNewVehicle({ ...newVehicle, engineNumber: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="warehouse">Kho Lưu Trữ</Label>
                                        <Input id="warehouse" value={newVehicle.warehouse} onChange={(e) => setNewVehicle({ ...newVehicle, warehouse: e.target.value })} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Hủy</Button>
                                    <Button onClick={handleCreate}>Lưu Xe</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm theo VIN hoặc Model..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Trạng Thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất Cả</SelectItem>
                                <SelectItem value="AVAILABLE">Sẵn Sàng</SelectItem>
                                <SelectItem value="RESERVED">Đã Đặt Cọc</SelectItem>
                                <SelectItem value="PDS">Đang PDS</SelectItem>
                                <SelectItem value="SOLD">Đã Bán</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Số VIN</TableHead>
                                    <TableHead>Dòng Xe</TableHead>
                                    <TableHead>Phiên Bản</TableHead>
                                    <TableHead>Màu Sắc</TableHead>
                                    <TableHead>Kho</TableHead>
                                    <TableHead>Ngày Nhập</TableHead>
                                    <TableHead className="text-center">Trạng Thái</TableHead>
                                    <TableHead className="text-right">Thao Tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredVehicles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                                            {loading ? "Đang tải..." : "Không tìm thấy xe nào."}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredVehicles.map((v) => (
                                        <TableRow key={v.id} className="hover:bg-muted/50">
                                            <TableCell className="font-mono font-medium">{v.vin}</TableCell>
                                            <TableCell className="font-bold">{v.model}</TableCell>
                                            <TableCell>{v.version}</TableCell>
                                            <TableCell>{v.color}</TableCell>
                                            <TableCell>{v.warehouse || "-"}</TableCell>
                                            <TableCell>{v.arrivalDate ? new Date(v.arrivalDate).toLocaleDateString('vi-VN') : "-"}</TableCell>
                                            <TableCell className="text-center">
                                                {getStatusBadge(v.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(v.id)}>
                                                    Xóa
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
