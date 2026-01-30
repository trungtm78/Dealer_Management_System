"use client";

import { useState, useEffect } from "react";
import { ServiceService } from "@/services/service.service";
import { RepairOrderDTO } from "@/lib/types/service";
import { UserService, UserDTO } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, Settings, Plus, User } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CustomerSearch } from "@/components/common/CustomerSearch";

export default function RepairOrderList() {
    const [ros, setRos] = useState<RepairOrderDTO[]>([]);
    const [selectedRO, setSelectedRO] = useState<RepairOrderDTO | null>(null);
    const [techs, setTechs] = useState<UserDTO[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [newRO, setNewRO] = useState({
        plateNumber: "",
        model: "",
        customerId: "",
        symptoms: "",
        mileage: 0,
        advisor: ""
    });

    const loadData = async () => {
        try {
            const [rosData, techsData] = await Promise.all([
                ServiceService.getRepairOrders(),
                UserService.getTechnicians(),
            ]);
            setRos(rosData);
            setTechs(techsData);
        } catch (error) {
            toast.error("Failed to load service data");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAssignTech = async (roId: string, techId: string) => {
        try {
            const result = await ServiceService.updateRepairOrder(roId, { technicianId: techId });
            if (result.success) {
                toast.success("Phân công kỹ thuật viên thành công");
                loadData();
                if (selectedRO && selectedRO.id === roId) {
                    setSelectedRO({ ...selectedRO, technicianId: techId });
                }
            } else {
                toast.error("Phân công thất bại: " + result.error);
            }
        } catch (error) {
            toast.error("Lỗi hệ thống");
        }
    };

    const handleUpdateStatus = async (roId: string, status: any) => {
        try {
            const result = await ServiceService.updateRepairOrderStatus(roId, status);
            if (result.success) {
                toast.success(`Cập nhật trạng thái thành công`);
                // Optimistic update or reload
                const updatedList = await ServiceService.getRepairOrders();
                setRos(updatedList);

                if (selectedRO && selectedRO.id === roId) {
                    const updatedRO = updatedList.find(r => r.id === roId);
                    if (updatedRO) setSelectedRO(updatedRO);
                }
            } else {
                toast.error("Cập nhật thất bại");
            }
        } catch (error) {
            toast.error("Lỗi hệ thống");
        }
    };

    const handleCreateRO = async () => {
        if (!newRO.plateNumber || !newRO.customerId || !newRO.symptoms) {
            toast.error("Vui lòng nhập Biển số, Khách hàng và Tình trạng xe");
            return;
        }

        try {
            const result = await ServiceService.createRepairOrder({
                customerId: newRO.customerId,
                vehicleInfo: { plateNumber: newRO.plateNumber, model: newRO.model },
                symptoms: newRO.symptoms,
            });

            if (result.success) {
                toast.success("Tạo lệnh sửa chữa thành công");
                setIsCreateOpen(false);
                setNewRO({ plateNumber: "", model: "", customerId: "", symptoms: "", mileage: 0, advisor: "" });
                loadData();
            } else {
                toast.error(result.error || "Tạo RO thất bại");
            }
        } catch (error) {
            toast.error("Lỗi hệ thống");
        }
    };

    const filteredROs = ros.filter(ro =>
        ro.vehicleInfo?.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ro.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 h-full bg-gray-50/50">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Lệnh Sửa Chữa (RO)</h1>
                    <p className="text-gray-500">Quản lý tiến độ và chi tiết sửa chữa</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#E60012] hover:bg-[#CC0010]">
                            <Plus className="w-4 h-4 mr-2" /> Tạo Lệnh Sửa Chữa
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tạo Lệnh Sửa Chữa Mới</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="plate">Biển Số Xe (*)</Label>
                                    <Input id="plate" value={newRO.plateNumber} onChange={(e) => setNewRO({ ...newRO, plateNumber: e.target.value })} placeholder="30A-123.45" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="model">Dòng Xe</Label>
                                    <Select value={newRO.model} onValueChange={(val) => setNewRO({ ...newRO, model: val })}>
                                        <SelectTrigger><SelectValue placeholder="Chọn xe" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Honda CR-V">Honda CR-V</SelectItem>
                                            <SelectItem value="Honda City">Honda City</SelectItem>
                                            <SelectItem value="Honda Civic">Honda Civic</SelectItem>
                                            <SelectItem value="Honda HR-V">Honda HR-V</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customer">Khách Hàng (*)</Label>
                                <CustomerSearch
                                    onSelect={(c) => setNewRO({ ...newRO, customerId: c.id })}
                                    placeholder="Tìm khách hàng..."
                                />
                                {newRO.customerId && <p className="text-xs text-green-600 mt-1">Đã chọn ID: {newRO.customerId}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="symptoms">Tình Trạng / Yêu Cầu (*)</Label>
                                <Input id="symptoms" value={newRO.symptoms} onChange={(e) => setNewRO({ ...newRO, symptoms: e.target.value })} placeholder="VD: Thay dầu, kiểm tra phanh..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mileage">Số Km (Odo)</Label>
                                    <Input id="mileage" type="number" value={newRO.mileage} onChange={(e) => setNewRO({ ...newRO, mileage: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="advisor">Cố Vấn Dịch Vụ</Label>
                                    <Input id="advisor" value={newRO.advisor} onChange={(e) => setNewRO({ ...newRO, advisor: e.target.value })} placeholder="Tên CVDV" />
                                </div>
                            </div>
                            <Button onClick={handleCreateRO} className="w-full mt-2 bg-[#E60012] hover:bg-[#CC0010]">Tạo Phiếu RO</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LIST */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow border border-gray-100 p-4 h-[calc(100vh-140px)] overflow-y-auto">
                    <Input
                        placeholder="Tìm RO, Biển số..."
                        className="mb-4"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="space-y-3">
                        {filteredROs.map(ro => (
                            <div
                                key={ro.id}
                                onClick={() => setSelectedRO(ro)}
                                className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedRO?.id === ro.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}
                            >
                                <div className="flex justify-between mb-1">
                                    <span className="font-bold text-sm">{ro.orderNumber}</span>
                                    <Badge variant="outline">{ro.status}</Badge>
                                </div>
                                <div className="text-sm font-semibold">{ro.vehicleInfo?.plateNumber} - {ro.vehicleInfo?.model}</div>
                                <div className="text-xs text-gray-500 mt-2">KH: {ro.customerName}</div>
                                {ro.technicianName && <div className="text-xs text-blue-600 mt-1 font-medium">KTV: {ro.technicianName}</div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* DETAIL */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow border border-gray-100 p-6 h-[calc(100vh-140px)] overflow-y-auto">
                    {selectedRO ? (
                        <>
                            <div className="border-b pb-4 mb-4 flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold">{selectedRO.vehicleInfo?.plateNumber} - {selectedRO.customerName}</h2>
                                    <p className="text-sm text-gray-500">Mã RO: {selectedRO.orderNumber}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-red-600">{(selectedRO.totalCost || 0).toLocaleString()} đ</div>
                                    <Badge className="bg-blue-100 text-blue-700">{selectedRO.status}</Badge>
                                </div>
                            </div>

                            <Tabs defaultValue="jobs">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="jobs">Công Việc & Phụ Tùng</TabsTrigger>
                                    <TabsTrigger value="assign">Phân Công</TabsTrigger>
                                </TabsList>

                                <TabsContent value="jobs">
                                    <h3 className="font-semibold mb-2 flex items-center"><Wrench className="w-4 h-4 mr-2" /> Nội dung sửa chữa</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <p className="font-medium text-gray-700">Yêu cầu/Tình trạng:</p>
                                        <p className="text-gray-600">{selectedRO.symptoms}</p>
                                    </div>

                                    {/* Placeholder for Services handling */}
                                    <p className="text-gray-400 italic mb-4">Danh sách công việc đang được cập nhật...</p>


                                    <h3 className="font-semibold mb-2 flex items-center"><Settings className="w-4 h-4 mr-2" /> Phụ Tùng (Parts)</h3>
                                    {/* Placeholder, assume partsUsed is array if exist */}
                                    <p className="text-gray-400 italic">Danh sách phụ tùng đang được cập nhật...</p>

                                    <div className="flex gap-2 justify-end mt-4">
                                        <Button variant="outline" onClick={() => toast.info("Tính năng thêm phụ tùng đang phát triển")}>+ Thêm Phụ Tùng</Button>
                                        <Button variant="outline" onClick={() => toast.info("Tính năng thêm công việc đang phát triển")}>+ Thêm Công Việc</Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="assign">
                                    <Card className="p-4 bg-gray-50">
                                        <Label className="mb-2 block">Chọn Kỹ Thuật Viên <span className="text-red-500">(*)</span></Label>
                                        <div className="flex gap-2">
                                            <Select onValueChange={(val) => handleAssignTech(selectedRO.id, val)} value={selectedRO.technicianId || ""}>
                                                <SelectTrigger className="w-[280px]">
                                                    <SelectValue placeholder={selectedRO.technicianName || "Chưa phân công"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {techs.map(t => (
                                                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="mt-8 space-y-2">
                                            <Label>Cập Nhật Trạng Thái</Label>
                                            <div className="flex gap-2 flex-wrap">
                                                <Button size="sm" variant={selectedRO.status === 'IN_PROGRESS' ? 'default' : 'outline'} onClick={() => handleUpdateStatus(selectedRO.id, 'IN_PROGRESS')}>Đang Sửa</Button>
                                                <Button size="sm" variant={selectedRO.status === 'QUALITY_CHECK' ? 'default' : 'outline'} className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100" onClick={() => handleUpdateStatus(selectedRO.id, 'QUALITY_CHECK')}>Chờ QC</Button>
                                                <Button size="sm" variant={selectedRO.status === 'COMPLETED' ? 'default' : 'outline'} className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100" onClick={() => handleUpdateStatus(selectedRO.id, 'COMPLETED')}>Hoàn Thành</Button>
                                            </div>
                                        </div>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 flex-col">
                            <Wrench className="w-16 h-16 mb-4 opacity-20" />
                            <p>Chọn một phiếu sửa chữa để xem chi tiết</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
