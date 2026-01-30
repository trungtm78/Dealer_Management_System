"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, User, Car, FileText, Star, MessageSquare, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface TestDrive {
    id: string;
    time: string;
    customer: string;
    phone: string;
    email?: string;
    model: string;
    salesperson: string;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
    feedback?: string;
    rating?: number;
    date: string;
}

export default function TestDriveCalendar() {
    const [currentDate, setCurrentDate] = useState('06/01/2026');
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedDrive, setSelectedDrive] = useState<TestDrive | null>(null);
    const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null);
    const [testDrivesData, setTestDrivesData] = useState<TestDrive[]>([
        {
            id: '1',
            time: '09:00',
            customer: 'Trần Văn A',
            phone: '0901234567',
            email: 'tranvana@email.com',
            model: 'Accord 1.5T',
            salesperson: 'Nguyễn Văn B',
            status: 'completed',
            feedback: 'Xe rất êm ái, không gian rộng rãi. Động cơ turbo mạnh mẽ nhưng vẫn tiết kiệm nhiên liệu. Rất thích tính năng Honda Sensing.',
            rating: 5,
            date: '05/01/2026'
        },
        {
            id: '2',
            time: '10:30',
            customer: 'Lê Thị C',
            phone: '0902345678',
            email: 'lethic@email.com',
            model: 'CR-V',
            salesperson: 'Phạm Thị D',
            status: 'completed',
            feedback: 'SUV đẹp, vận hành tốt. Hơi ồn khi tăng tốc. Cần thêm ưu đãi về giá.',
            rating: 4,
            date: '05/01/2026'
        },
        {
            id: '3',
            time: '14:00',
            customer: 'Hoàng Văn E',
            phone: '0903456789',
            model: 'City RS',
            salesperson: 'Nguyễn Văn B',
            status: 'confirmed',
            date: '06/01/2026'
        },
        {
            id: '4',
            time: '16:00',
            customer: 'Vũ Thị F',
            phone: '0904567890',
            email: 'vuthif@email.com',
            model: 'HR-V',
            salesperson: 'Trần Văn G',
            status: 'confirmed',
            date: '06/01/2026'
        },
    ]);
    const [bookingForm, setBookingForm] = useState({
        customer: '',
        phone: '',
        email: '',
        model: '',
        date: '',
        time: '',
        salesperson: '',
        notes: '',
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'confirmed': return 'Đã xác nhận';
            case 'pending': return 'Chờ xác nhận';
            case 'completed': return 'Đã hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    const handleStatusChange = (driveId: string, newStatus: 'confirmed' | 'pending' | 'completed' | 'cancelled') => {
        setTestDrivesData(prevData =>
            prevData.map(drive =>
                drive.id === driveId ? { ...drive, status: newStatus } : drive
            )
        );
        setShowStatusMenu(null);
        toast.success('Đã cập nhật trạng thái lịch hẹn');
    };

    const statusOptions: Array<{ value: 'confirmed' | 'pending' | 'completed' | 'cancelled'; label: string; icon: string }> = [
        { value: 'pending', label: 'Chờ xác nhận', icon: '⏳' },
        { value: 'confirmed', label: 'Đã xác nhận', icon: '✅' },
        { value: 'completed', label: 'Đã hoàn thành', icon: '🎉' },
        { value: 'cancelled', label: 'Đã hủy', icon: '❌' },
    ];

    return (
        <div className="min-h-screen bg-[#F6F7F9]">
            {/* Header */}
            <header className="bg-white border-b border-[#E6E8EE] px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>Bán Hàng</span>
                            <span>/</span>
                            <span>Lịch Lái Thử</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Lịch Lái Thử</h1>
                    </div>
                    <Button className="bg-[#E60012] hover:bg-[#c50010]" onClick={() => setShowBookingModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Đặt Lịch Lái Thử
                    </Button>
                </div>
            </header>

            <div className="p-6">
                {/* Date Navigation */}
                <Card className="p-4 mb-6 border border-[#E6E8EE]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="sm">
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-gray-600" />
                                <span className="text-lg font-semibold text-gray-900">{currentDate}</span>
                            </div>
                            <Button variant="outline" size="sm">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-3">
                            <select className="px-4 py-2 border border-[#E6E8EE] rounded-lg text-sm">
                                <option>Tất cả Sales</option>
                                <option>Nguyễn Văn B</option>
                                <option>Phạm Thị D</option>
                                <option>Trần Văn G</option>
                            </select>
                            <select className="px-4 py-2 border border-[#E6E8EE] rounded-lg text-sm">
                                <option>Tất cả Models</option>
                                <option>Accord</option>
                                <option>CR-V</option>
                                <option>City</option>
                                <option>HR-V</option>
                            </select>
                            <Button variant="outline">Hôm nay</Button>
                        </div>
                    </div>
                </Card>

                {/* Calendar View */}
                <div className="grid grid-cols-1 gap-4">
                    {testDrivesData.map((drive) => (
                        <Card key={drive.id} className="p-5 border border-[#E6E8EE] hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                {/* Time */}
                                <div className="flex flex-col items-center justify-center bg-[#E60012] text-white rounded-lg px-4 py-3 min-w-[80px]">
                                    <Clock className="w-5 h-5 mb-1" />
                                    <span className="text-lg font-bold">{drive.time}</span>
                                </div>

                                {/* Details */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{drive.customer}</h3>
                                            <p className="text-sm text-gray-600">{drive.phone}</p>
                                        </div>

                                        {/* Clickable Status Badge with Dropdown */}
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowStatusMenu(showStatusMenu === drive.id ? null : drive.id);
                                                }}
                                                className={`${getStatusColor(drive.status)} px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1.5`}
                                            >
                                                <span className="text-base">{statusOptions.find(s => s.value === drive.status)?.icon}</span>
                                                <span>{getStatusLabel(drive.status)}</span>
                                                <span className="text-xs">▼</span>
                                            </button>

                                            {/* Status Dropdown Menu */}
                                            {showStatusMenu === drive.id && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-10"
                                                        onClick={() => setShowStatusMenu(null)}
                                                    />
                                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden">
                                                        <div className="py-1">
                                                            {statusOptions.map((option) => (
                                                                <button
                                                                    key={option.value}
                                                                    onClick={() => handleStatusChange(drive.id, option.value)}
                                                                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${drive.status === option.value ? 'bg-blue-50' : ''
                                                                        }`}
                                                                >
                                                                    <span className="text-xl">{option.icon}</span>
                                                                    <div className="flex-1">
                                                                        <div className="font-medium text-gray-900">{option.label}</div>
                                                                    </div>
                                                                    {drive.status === option.value && (
                                                                        <span className="text-blue-600 font-bold">✓</span>
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2">
                                            <Car className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-700">Model:</span>
                                            <span className="text-sm font-semibold text-gray-900">{drive.model}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-700">Sales:</span>
                                            <span className="text-sm font-semibold text-gray-900">{drive.salesperson}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => { setSelectedDrive(drive); setShowDetailModal(true); }}
                                        className="text-blue-600 border-blue-300"
                                    >
                                        <MessageSquare className="w-3 h-3 mr-1" />
                                        Chi tiết
                                    </Button>
                                    {drive.status === 'completed' && drive.rating && (
                                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded">
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            <span className="text-xs font-semibold text-yellow-700">{drive.rating}/5</span>
                                        </div>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-[#E60012] border-[#E60012]"
                                    >
                                        <FileText className="w-3 h-3 mr-1" />
                                        Tạo Báo Giá
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Summary Footer */}
                <Card className="mt-6 p-4 border border-[#E6E8EE] bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div>
                                <span className="text-sm text-gray-600">Tổng Hôm Nay:</span>
                                <span className="ml-2 font-bold text-gray-900">{testDrivesData.length}</span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600">Đã Xác Nhận:</span>
                                <span className="ml-2 font-bold text-green-600">{testDrivesData.filter(d => d.status === 'confirmed').length}</span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600">Chờ Duyệt:</span>
                                <span className="ml-2 font-bold text-yellow-600">{testDrivesData.filter(d => d.status === 'pending').length}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="p-6 w-96 bg-white animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Đặt Lịch Lái Thử</h2>
                            <Button variant="outline" size="sm" onClick={() => setShowBookingModal(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            toast.success("Đã đặt lịch thành công!");
                            setShowBookingModal(false);
                        }}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Khách hàng</label>
                                <input
                                    required
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E60012] focus:border-[#E60012] sm:text-sm"
                                    value={bookingForm.customer}
                                    onChange={(e) => setBookingForm({ ...bookingForm, customer: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input
                                    required
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E60012] focus:border-[#E60012] sm:text-sm"
                                    value={bookingForm.phone}
                                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Model</label>
                                    <select
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E60012] focus:border-[#E60012] sm:text-sm"
                                        value={bookingForm.model}
                                        onChange={(e) => setBookingForm({ ...bookingForm, model: e.target.value })}
                                    >
                                        <option>Honda City</option>
                                        <option>Honda CR-V</option>
                                        <option>Honda Civic</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Giờ</label>
                                    <input
                                        type="time"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E60012] focus:border-[#E60012] sm:text-sm"
                                        value={bookingForm.time}
                                        onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="bg-[#E60012] hover:bg-[#c50010] w-full text-white">
                                Xác Nhận Đặt Lịch
                            </Button>
                        </form>
                    </Card>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedDrive && (
                <div className="fixed inset-0 bg-black/60 items-center justify-center flex z-50 p-4" onClick={() => setShowDetailModal(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="bg-[#E60012] px-6 py-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Car className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Chi Tiết Lái Thử</h2>
                                    <p className="text-sm opacity-90">{selectedDrive.date} - {selectedDrive.time}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} className="hover:bg-white/20 p-1 rounded-full"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="p-6 grid gap-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium uppercase mb-1">Khách Hàng</p>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedDrive.customer}</h3>
                                    <p className="flex items-center gap-2 text-gray-600 mt-1"><Phone className="w-4 h-4" /> {selectedDrive.phone}</p>
                                    {selectedDrive.email && <p className="flex items-center gap-2 text-gray-600 mt-1"><Mail className="w-4 h-4" /> {selectedDrive.email}</p>}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 font-medium uppercase mb-1">Trạng Thái</p>
                                    <Badge className={getStatusColor(selectedDrive.status)}>{getStatusLabel(selectedDrive.status)}</Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Dòng Xe</p>
                                    <p className="font-semibold">{selectedDrive.model}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Sales Phụ Trách</p>
                                    <p className="font-semibold">{selectedDrive.salesperson}</p>
                                </div>
                            </div>

                            {selectedDrive.feedback && (
                                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                    <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" /> Phản Hồi Khách Hàng
                                    </h4>
                                    <p className="text-blue-800 text-sm italic">"{selectedDrive.feedback}"</p>
                                    {selectedDrive.rating && (
                                        <div className="flex items-center gap-1 mt-2">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < selectedDrive.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                            <Button variant="outline" onClick={() => setShowDetailModal(false)}>Đóng</Button>
                            <Button className="bg-[#E60012] text-white hover:bg-[#c50010]">Gửi Email Nhắc Nhở</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
