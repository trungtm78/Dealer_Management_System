"use client";

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, User, Car, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";

import { createTestDrive, getTestDrives } from '@/actions/sales/test-drives';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SmartSelect } from "@/components/SmartSelect";
import type { SelectDataSource } from "@/types/smart-select";

// UI Interface matching the component needs, mapped from DB
interface TestDriveUI {
    id: string;
    customerId?: string;
    customer: string;
    phone: string;
    model: string;
    date: string;
    time: string;
    status: string;
    staff: string;
    notes?: string;
}

export default function TestDriveSchedule() {
    const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('vi-VN'));
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedDrive, setSelectedDrive] = useState<TestDriveUI | null>(null);

    const [testDrivesData, setTestDrivesData] = useState<TestDriveUI[]>([]);
    const [loading, setLoading] = useState(false);

    // Booking Form State
    const [bookCustomerId, setBookCustomerId] = useState('');
    const [bookCustomer, setBookCustomer] = useState('');
    const [bookPhone, setBookPhone] = useState('');
    const [bookModel, setBookModel] = useState('Honda CR-V L');
    const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
    const [bookTime, setBookTime] = useState('09:00');
    const [bookDate, setBookDate] = useState(new Date().toISOString().split('T')[0]); // Default today YYYY-MM-DD
    const [bookNotes, setBookNotes] = useState('');

    const customerDataSource: SelectDataSource = {
        search: async (req) => {
            const res = await fetch('/api/shared/search/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req)
            });
            return res.json();
        }
    };

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

    // Errors
    const [errors, setErrors] = useState<{ customer?: string, phone?: string }>({});

    // Use useCallback to memoize loadData
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getTestDrives();
            // Map DB data to UI format
            const mapped: TestDriveUI[] = data.map((d: any) => ({
                id: d.id,
                customerId: d.customerId,
                customer: d.customerName,
                phone: d.customerPhone,
                model: d.model,
                date: new Date(d.scheduledDate).toLocaleDateString('vi-VN'),
                time: d.scheduledTime,
                status: d.status,
                staff: d.assignedTo ? d.assignedTo.name : 'Chưa phân công',
                notes: d.notes
            }));
            setTestDrivesData(mapped);
        } catch (error) {
            toast.error("Không thể tải dữ liệu lịch lái thử");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]); // Added loadData to dependency array

    const handleBooking = async () => {
        const newErrors: { customer?: string, phone?: string } = {};
        if (!bookCustomer.trim()) newErrors.customer = "Vui lòng nhập tên";
        if (!bookPhone.trim()) newErrors.phone = "Vui lòng nhập SĐT";
        else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(bookPhone)) newErrors.phone = "SĐT không hợp lệ";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const result = await createTestDrive({
                customerId: bookCustomerId || undefined,
                customerName: bookCustomer,
                customerPhone: bookPhone,
                model: bookModel,
                scheduledDate: bookDate,
                scheduledTime: bookTime,
                notes: bookNotes,
                assignedToId: 'user-1' // TODO: Get current user ID
            });

            if (result.success) {
                toast.success("Đã đặt lịch lái thử thành công!");
                setShowBookingModal(false);
                loadData();
                // Reset form
                setBookCustomerId('');
                setBookCustomer('');
                setBookPhone('');
                setBookNotes('');
                setSelectedModelId(null);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Lỗi khi tạo lịch đặt");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-200';
            case 'SCHEDULED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'COMPLETED': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const statusMap: Record<string, string> = {
        'SCHEDULED': 'Đã lên lịch',
        'CONFIRMED': 'Đã xác nhận',
        'COMPLETED': 'Hoàn thành',
        'CANCELLED': 'Đã hủy',
        'NO_SHOW': 'Khách không đến'
    };

    return (
        <div className="h-full bg-gray-50/50 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold font-heading tracking-tight text-gray-900">Lịch Lái Thử</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý lịch lái thử xe tại Showroom & Tận nhà</p>
                </div>
                <Button className="bg-[#E60012] hover:bg-[#c50010]" onClick={() => setShowBookingModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Đặt Lịch Mới
                </Button>
            </div>

            {/* Date Navigation */}
            <Card className="p-4 mb-6 border border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm min-w-[150px] justify-center">
                            <CalendarIcon className="w-5 h-5 text-gray-600" />
                            <span className="text-lg font-bold text-gray-900">{currentDate}</span>
                        </div>
                        <Button variant="outline" size="icon">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Tất cả Sales" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả Sales</SelectItem>
                                <SelectItem value="s1">Nguyễn Văn B</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Tất cả Dòng Xe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả Dòng Xe</SelectItem>
                                <SelectItem value="crv">Honda CR-V</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="secondary">Hôm nay</Button>
                    </div>
                </div>
            </Card>

            {/* Schedule List */}
            <div className="space-y-4">
                {loading ? <p className="text-center text-gray-500">Đang tải...</p> : testDrivesData.map((drive) => (
                    <Card key={drive.id} className="p-0 border border-t-0 border-r-0 border-b-0 border-l-[6px] border-l-[#E60012] shadow-sm hover:shadow-md transition-all">
                        <div className="p-5 flex flex-col md:flex-row gap-6 items-start md:items-center">

                            {/* Time Block */}
                            <div className="flex flex-col items-center justify-center bg-gray-100 rounded-xl px-4 py-3 min-w-[100px]">
                                <Clock className="w-5 h-5 text-gray-500 mb-1" />
                                <span className="text-xl font-black text-gray-900">{drive.time}</span>
                                <span className="text-xs text-gray-500">{drive.date}</span>
                            </div>

                            {/* Info Block */}
                            <div className="flex-1 space-y-3">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            {drive.customer}
                                            <Badge variant="outline" className={`${getStatusColor(drive.status)}`}>
                                                {statusMap[drive.status] || drive.status}
                                            </Badge>
                                        </h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-4 mt-1">
                                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {drive.phone}</span>
                                            <span className="flex items-center gap-1"><Car className="w-3 h-3" /> {drive.model}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">Phụ trách</div>
                                        <div className="font-semibold">{drive.staff}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => { setSelectedDrive(drive); setShowDetailModal(true); }}>
                                    Chi tiết
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                                    Báo Giá
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}

                {!loading && testDrivesData.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        <p>Không có lịch lái thử nào. Hãy tạo mới!</p>
                    </div>
                )}
            </div>

            {/* Booking Dialog */}
            <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Đặt Lịch Lái Thử Mới</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <SmartSelect
                                    dataSource={customerDataSource}
                                    value={newSchedule.customerId}
                                    onChange={(id, item) => {
                                        setNewSchedule({ ...newSchedule, customerId: id as string });
                                        setCustomerName(item?.label || '');
                                        if (item?.meta?.phone) setCustomerPhone(item.meta.phone);
                                    }}
                                    label="Khách hàng"
                                    placeholder="Chọn khách hàng..."
                                    required
                                    className={`w-full ${errors.customer ? "border-red-500" : ""}`}
                                />
                                {errors.customer && <p className="text-xs text-red-500">{errors.customer}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Số điện thoại <span className="text-red-500">(*)</span></Label>
                                <Input
                                    placeholder="09xx..."
                                    value={bookPhone}
                                    onChange={e => { setBookPhone(e.target.value); setErrors({ ...errors, phone: undefined }); }}
                                    className={errors.phone ? "border-red-500" : ""}
                                />
                                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <SmartSelect
                                    dataSource={vehicleModelDataSource}
                                    value={selectedModelId}
                                    onChange={(id, item) => {
                                        setSelectedModelId(id as number | null);
                                        setBookModel(item?.label || "");
                                    }}
                                    label="Dòng xe"
                                    placeholder="Chọn xe"
                                    required={false}
                                    context={{ onlyActive: true }}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Ngày</Label>
                                <Input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Thời gian</Label>
                            <Input type="time" value={bookTime} onChange={e => setBookTime(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Ghi chú</Label>
                            <Textarea
                                placeholder="Yêu cầu đặc biệt..."
                                value={bookNotes}
                                onChange={e => setBookNotes(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setShowBookingModal(false)}>Hủy</Button>
                        <Button className="bg-[#E60012] hover:bg-[#c50010]" onClick={handleBooking}>Xác Nhận</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Detail Dialog */}
            <Dialog open={showDetailModal} onOpenChange={(open) => !open && setShowDetailModal(false)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Chi Tiết Lịch Hẹn #{selectedDrive?.id}</DialogTitle>
                    </DialogHeader>
                    {selectedDrive && (
                        <div className="grid gap-6 py-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border shadow-sm">
                                        <User className="w-6 h-6 text-gray-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{selectedDrive.customer}</h4>
                                        <p className="text-gray-500 text-sm">{selectedDrive.phone}</p>
                                    </div>
                                </div>
                                <Badge className={getStatusColor(selectedDrive.status)}>{statusMap[selectedDrive.status] || selectedDrive.status}</Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <Label className="text-gray-500 text-xs uppercase">Dòng xe quan tâm</Label>
                                    <p className="font-semibold text-base">{selectedDrive.model}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-gray-500 text-xs uppercase">Nhân viên phụ trách</Label>
                                    <p className="font-semibold text-base">{selectedDrive.staff}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-gray-500 text-xs uppercase">Thời gian</Label>
                                    <p className="font-semibold text-base">{selectedDrive.time} - {selectedDrive.date}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-gray-500 text-xs uppercase">Ghi chú</Label>
                                    <p className="font-medium text-base text-gray-700">{selectedDrive.notes || 'Không có'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setShowDetailModal(false)}>Đóng</Button>
                        <Button className="text-blue-600 border-blue-200 hover:bg-blue-50" variant="outline"><Phone className="w-4 h-4 mr-2" /> Gọi</Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
