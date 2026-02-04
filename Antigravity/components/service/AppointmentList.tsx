"use client";

import { useState, useEffect } from "react";
import { ServiceService } from "@/services/service.service";
import { ServiceAppointmentDTO } from "@/lib/types/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { CustomerSearch } from "@/components/common/CustomerSearch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SmartSelect } from "@/components/SmartSelect";
import type { SelectDataSource } from "@/types/smart-select";

export default function AppointmentList() {
    const [appointments, setAppointments] = useState<ServiceAppointmentDTO[]>([]);
    const [filter, setFilter] = useState("");

    // Create Form State
    const [isOpen, setIsOpen] = useState(false);
    const [selectedVehicleModelId, setSelectedVehicleModelId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        customerId: '',
        phone: '', // Auto-filled from customer
        plateNumber: '',
        vehicleModel: '',
        date: '',
        time: '',
        serviceType: 'PERIODIC',
        advisor: ''
    });

    const loadData = async () => {
        try {
            const apptData = await ServiceService.getAppointments();
            setAppointments(apptData);
        } catch (error) {
            toast.error("Failed to load data");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const vehicleModelDataSource: SelectDataSource = {
        search: async (req) => {
            const res = await fetch('/api/shared/search/vehicle-models', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req)
            });
            return res.json();
        }
    };

    const handleCreate = async () => {
        // Validation
        if (!formData.customerId || !formData.date) {
            toast.error("Vui lòng nhập đầy đủ các trường bắt buộc (*)");
            return;
        }

        try {
            const result = await ServiceService.createAppointment({
                customerId: formData.customerId,
                vehicleInfo: { plateNumber: formData.plateNumber, model: formData.vehicleModel },
                appointmentDate: new Date(formData.date),
                appointmentTime: formData.time,
                serviceType: formData.serviceType as any,
                notes: `CVDV: ${formData.advisor}`
            });

            if (result.success) {
                toast.success(`Đã đặt lịch hẹn thành công!`);
                setIsOpen(false);
                loadData();
                setFormData({ customerId: '', phone: '', plateNumber: '', vehicleModel: '', date: '', time: '', serviceType: 'PERIODIC', advisor: '' });
                setSelectedVehicleModelId(null);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Failed to create appointment");
        }
    };

    return (
        <div className="p-6 h-full bg-gray-50/50">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Quản Lý Lịch Hẹn</h1>
                    <p className="text-gray-500">Đặt hẹn và theo dõi lịch bảo dưỡng khách hàng</p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#E60012] hover:bg-[#c50010] shadow-lg shadow-red-200">
                            <Plus className="w-4 h-4 mr-2" /> Đặt Hẹn Mới
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Tạo Lịch Hẹn Dịch Vụ</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Khách hàng <span className="text-red-500">(*)</span></Label>
                                <CustomerSearch
                                    onSelect={(c) => {
                                        setFormData({
                                            ...formData,
                                            customerId: c.id,
                                            phone: c.phone
                                        });
                                    }}
                                    placeholder="Tìm khách hàng..."
                                />
                                {formData.customerId && <p className="text-xs text-green-600 mt-1">Đã chọn ID: {formData.customerId}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Số điện thoại</Label>
                                <Input value={formData.phone} disabled className="bg-gray-100" />
                            </div>
                            <div className="space-y-2">
                                <Label>Biển số xe <span className="text-red-500">(*)</span></Label>
                                <Input value={formData.plateNumber} onChange={e => setFormData({ ...formData, plateNumber: e.target.value })} placeholder="30A-..." />
                            </div>
                            <div className="space-y-2">
                                <SmartSelect
                                    dataSource={vehicleModelDataSource}
                                    value={selectedVehicleModelId}
                                    onChange={(id, item) => {
                                        setSelectedVehicleModelId(id as number | null);
                                        setFormData({ ...formData, vehicleModel: item?.label || "" });
                                    }}
                                    label="Dòng xe"
                                    placeholder="Chọn xe"
                                    required={false}
                                    context={{ onlyActive: true }}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Ngày hẹn <span className="text-red-500">(*)</span></Label>
                                <Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Giờ hẹn</Label>
                                <Input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Loại dịch vụ</Label>
                                <Select value={formData.serviceType} onValueChange={v => setFormData({ ...formData, serviceType: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PERIODIC">Bảo dưỡng định kỳ</SelectItem>
                                        <SelectItem value="REPAIR">Sửa chữa chung</SelectItem>
                                        <SelectItem value="WARRANTY">Bảo hành</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Cố vấn dịch vụ (CVDV)</Label>
                                <Input value={formData.advisor} onChange={e => setFormData({ ...formData, advisor: e.target.value })} placeholder="Tên CVDV" />
                            </div>
                        </div>
                        <Button className="w-full bg-[#E60012]" onClick={handleCreate}>Lưu Lịch Hẹn</Button>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
                <div className="flex gap-4 mb-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input placeholder="Tìm biển số, khách hàng..." className="pl-9" value={filter} onChange={e => setFilter(e.target.value)} />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ngày Giờ</TableHead>
                            <TableHead>Khách Hàng</TableHead>
                            <TableHead>Xe / Biển Số</TableHead>
                            <TableHead>Loại Dịch Vụ</TableHead>
                            <TableHead>KTV / CVDV</TableHead>
                            <TableHead>Trạng Thái</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments.filter(a => (a.customerName || 'Unknown').toLowerCase().includes(filter.toLowerCase()) || a.vehicleInfo?.plateNumber?.includes(filter)).map((appt) => (
                            <TableRow key={appt.id} className="hover:bg-gray-50">
                                <TableCell>
                                    <div className="font-medium">{new Date(appt.appointmentDate).toLocaleDateString()}</div>
                                    <div className="text-xs text-gray-500">{appt.appointmentTime}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-semibold">{appt.customerName}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="badge badge-outline bg-blue-50 text-blue-700 border-none px-2 py-0.5 rounded text-xs font-mono">{appt.vehicleInfo?.plateNumber}</div>
                                    <div className="text-xs text-gray-600 mt-1">{appt.vehicleInfo?.model}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{appt.serviceType}</Badge>
                                </TableCell>
                                <TableCell>{appt.assignedTo ? appt.assignedTo.name : 'Chưa phân công'}</TableCell>
                                <TableCell>
                                    <Badge className={appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                        {appt.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
