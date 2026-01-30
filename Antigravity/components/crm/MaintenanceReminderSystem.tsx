"use client";

import { useState } from 'react';
import { Bell, Phone, Mail, MessageSquare, Calendar, Car, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import SendReminderDialog from "./SendReminderDialog";

interface MaintenanceReminder {
    id: string;
    customerId: string;
    customerName: string;
    phone: string;
    vehicle: string;
    plate: string;
    lastServiceDate: string;
    lastServiceKm: number;
    currentKmEstimate: number;
    nextServiceDue: string;
    nextServiceKm: number;
    daysUntilDue: number;
    reminderSent: boolean;
    reminderDate?: string;
    reminderChannel?: 'sms' | 'email' | 'zalo';
    customerResponse?: 'booked' | 'declined' | 'no-response';
    bookedDate?: string;
}

export default function MaintenanceReminderSystem() {
    const [filterStatus, setFilterStatus] = useState<'all' | 'due-soon' | 'overdue' | 'sent' | 'booked'>('all');
    const [isReminderOpen, setIsReminderOpen] = useState(false);
    const [reminderType, setReminderType] = useState<'batch' | 'single'>('batch');

    const [reminders] = useState<MaintenanceReminder[]>([
        {
            id: 'REM-001',
            customerId: 'CUS-00125',
            customerName: 'Nguyễn Văn An',
            phone: '0901234567',
            vehicle: 'Honda City RS 2025',
            plate: '51G-123.45',
            lastServiceDate: '15/07/2025',
            lastServiceKm: 4500,
            currentKmEstimate: 9800,
            nextServiceDue: '15/01/2026',
            nextServiceKm: 10000,
            daysUntilDue: 0,
            reminderSent: true,
            reminderDate: '10/01/2026',
            reminderChannel: 'sms',
            customerResponse: 'booked',
            bookedDate: '17/01/2026',
        },
        {
            id: 'REM-002',
            customerId: 'CUS-00126',
            customerName: 'Trần Thị Bình',
            phone: '0912345678',
            vehicle: 'Honda CR-V L 2024',
            plate: '59A-456.78',
            lastServiceDate: '10/12/2025',
            lastServiceKm: 29000,
            currentKmEstimate: 29800,
            nextServiceDue: '10/02/2026',
            nextServiceKm: 30000,
            daysUntilDue: 26,
            reminderSent: true,
            reminderDate: '08/01/2026',
            reminderChannel: 'zalo',
            customerResponse: 'no-response',
        },
        {
            id: 'REM-003',
            customerId: 'CUS-00127',
            customerName: 'Lê Minh Cường',
            phone: '0923456789',
            vehicle: 'Honda Accord 2023',
            plate: '30F-789.12',
            lastServiceDate: '20/06/2025',
            lastServiceKm: 14500,
            currentKmEstimate: 20300,
            nextServiceDue: '20/12/2025',
            nextServiceKm: 20000,
            daysUntilDue: -26,
            reminderSent: true,
            reminderDate: '15/12/2025',
            reminderChannel: 'sms',
            customerResponse: 'declined',
        },
        {
            id: 'REM-004',
            customerId: 'CUS-00128',
            customerName: 'Phạm Thị Dung',
            phone: '0934567890',
            vehicle: 'Honda HR-V RS 2025',
            plate: '51H-234.56',
            lastServiceDate: '05/11/2025',
            lastServiceKm: 9200,
            currentKmEstimate: 9750,
            nextServiceDue: '05/02/2026',
            nextServiceKm: 10000,
            daysUntilDue: 21,
            reminderSent: false,
        },
        {
            id: 'REM-005',
            customerId: 'CUS-00129',
            customerName: 'Hoàng Văn Em',
            phone: '0945678901',
            vehicle: 'Honda Civic RS 2024',
            plate: '43C-567.89',
            lastServiceDate: '25/10/2025',
            lastServiceKm: 4800,
            currentKmEstimate: 5200,
            nextServiceDue: '25/01/2026',
            nextServiceKm: 5000,
            daysUntilDue: 10,
            reminderSent: true,
            reminderDate: '12/01/2026',
            reminderChannel: 'email',
            customerResponse: 'no-response',
        },
    ]);

    const filteredReminders = reminders.filter(reminder => {
        switch (filterStatus) {
            case 'due-soon':
                return reminder.daysUntilDue > 0 && reminder.daysUntilDue <= 30;
            case 'overdue':
                return reminder.daysUntilDue < 0;
            case 'sent':
                return reminder.reminderSent;
            case 'booked':
                return reminder.customerResponse === 'booked';
            default:
                return true;
        }
    });

    const dueSoonCount = reminders.filter(r => r.daysUntilDue > 0 && r.daysUntilDue <= 30).length;
    const overdueCount = reminders.filter(r => r.daysUntilDue < 0).length;
    const bookedCount = reminders.filter(r => r.customerResponse === 'booked').length;
    const responseRate = Math.round(
        (reminders.filter(r => r.customerResponse && r.customerResponse !== 'no-response').length /
            reminders.filter(r => r.reminderSent).length) * 100
    );

    const getDaysColor = (days: number) => {
        if (days < 0) return 'text-red-600 bg-red-50';
        if (days <= 7) return 'text-orange-600 bg-orange-50';
        if (days <= 30) return 'text-yellow-600 bg-yellow-50';
        return 'text-green-600 bg-green-50';
    };

    const getDaysLabel = (days: number) => {
        if (days < 0) return `Quá hạn ${Math.abs(days)} ngày`;
        if (days === 0) return 'Đến hạn hôm nay';
        return `Còn ${days} ngày`;
    };

    const getResponseIcon = (response?: string) => {
        switch (response) {
            case 'booked':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'declined':
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            case 'no-response':
                return <AlertCircle className="w-4 h-4 text-gray-400" />;
            default:
                return null;
        }
    };

    const getResponseLabel = (response?: string) => {
        switch (response) {
            case 'booked':
                return 'Đã đặt lịch';
            case 'declined':
                return 'Từ chối';
            case 'no-response':
                return 'Chưa phản hồi';
            default:
                return 'Chưa gửi';
        }
    };

    return (
        <div className="min-h-screen bg-[#F6F7F9]">
            <header className="bg-white border-b border-[#E6E8EE] px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>CRM</span>
                            <span>/</span>
                            <span>Nhắc Bảo Dưỡng</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Hệ Thống Nhắc Bảo Dưỡng Định Kỳ</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => { setReminderType('batch'); setIsReminderOpen(true); }}>
                            <Mail className="w-4 h-4 mr-2" />
                            Gửi Email Hàng Loạt
                        </Button>
                        <Button className="bg-[#E60012] hover:bg-[#c50010]" onClick={() => { setReminderType('batch'); setIsReminderOpen(true); }}>
                            <Bell className="w-4 h-4 mr-2" />
                            Gửi Nhắc Nhở
                        </Button>
                    </div>
                </div>
            </header>

            <SendReminderDialog
                open={isReminderOpen}
                onOpenChange={setIsReminderOpen}
                type={reminderType}
            />

            <div className="p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-6 mb-6">
                    <Card className="p-6 border-l-4 border-yellow-500 bg-yellow-50">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Sắp đến hạn</p>
                                <p className="text-3xl font-bold text-yellow-700">{dueSoonCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-yellow-700" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Trong vòng 30 ngày</p>
                    </Card>

                    <Card className="p-6 border-l-4 border-red-500 bg-red-50">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Quá hạn</p>
                                <p className="text-3xl font-bold text-red-700">{overdueCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-red-200 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-red-700" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Cần liên hệ gấp</p>
                    </Card>

                    <Card className="p-6 border-l-4 border-green-500 bg-green-50">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Đã đặt lịch</p>
                                <p className="text-3xl font-bold text-green-700">{bookedCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-700" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Xác nhận thành công</p>
                    </Card>

                    <Card className="p-6 border-l-4 border-blue-500 bg-blue-50">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Tỷ lệ phản hồi</p>
                                <p className="text-3xl font-bold text-blue-700">{responseRate}%</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-blue-700" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Hiệu quả chiến dịch</p>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="border border-[#E6E8EE] mb-6">
                    <div className="p-4 flex items-center gap-4">
                        <span className="text-sm font-semibold text-gray-700">Lọc:</span>
                        <div className="flex gap-2">
                            {[
                                { value: 'all', label: 'Tất cả', count: reminders.length },
                                { value: 'due-soon', label: 'Sắp đến hạn', count: dueSoonCount },
                                { value: 'overdue', label: 'Quá hạn', count: overdueCount },
                                { value: 'sent', label: 'Đã gửi nhắc', count: reminders.filter(r => r.reminderSent).length },
                                { value: 'booked', label: 'Đã đặt lịch', count: bookedCount },
                            ].map((filter) => (
                                <button
                                    key={filter.value}
                                    onClick={() => setFilterStatus(filter.value as any)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterStatus === filter.value
                                        ? 'bg-[#E60012] text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {filter.label} ({filter.count})
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Reminders Table */}
                <Card className="border border-[#E6E8EE]">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Khách hàng</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Xe</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Lần cuối</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Km ước tính</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Đến hạn</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Nhắc nhở</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Phản hồi</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReminders.map((reminder) => (
                                    <tr key={reminder.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{reminder.customerName}</p>
                                                <p className="text-xs text-gray-600">{reminder.phone}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <Car className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm text-gray-900">{reminder.vehicle}</p>
                                                    <p className="text-xs font-mono text-blue-600">{reminder.plate}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <div>
                                                <p className="text-sm text-gray-900">{reminder.lastServiceDate}</p>
                                                <p className="text-xs text-gray-600">{reminder.lastServiceKm.toLocaleString()} km</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <p className="text-base font-semibold text-gray-900">
                                                {reminder.currentKmEstimate.toLocaleString()} km
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Còn ~{(reminder.nextServiceKm - reminder.currentKmEstimate).toLocaleString()} km
                                            </p>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <div>
                                                <p className="text-sm text-gray-900">{reminder.nextServiceDue}</p>
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getDaysColor(reminder.daysUntilDue)}`}>
                                                    {getDaysLabel(reminder.daysUntilDue)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {reminder.reminderSent ? (
                                                <div>
                                                    <div className="flex items-center justify-center gap-1 mb-1">
                                                        {reminder.reminderChannel === 'sms' && <MessageSquare className="w-4 h-4 text-green-600" />}
                                                        {reminder.reminderChannel === 'email' && <Mail className="w-4 h-4 text-blue-600" />}
                                                        {reminder.reminderChannel === 'zalo' && <span className="text-blue-600">Z</span>}
                                                        <span className="text-xs text-gray-600">{reminder.reminderDate}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">Chưa gửi</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                {getResponseIcon(reminder.customerResponse)}
                                                <span className="text-xs">
                                                    {getResponseLabel(reminder.customerResponse)}
                                                </span>
                                            </div>
                                            {reminder.customerResponse === 'booked' && (
                                                <p className="text-xs text-green-600 mt-1">{reminder.bookedDate}</p>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button size="sm" variant="outline" title="Gọi điện">
                                                    <Phone className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="outline" title="Gửi SMS">
                                                    <MessageSquare className="w-4 h-4" />
                                                </Button>
                                                {reminder.daysUntilDue < 0 && (
                                                    <Button size="sm" className="bg-[#E60012] hover:bg-[#c50010]">
                                                        Liên hệ
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Reminder Strategy */}
                <Card className="border border-[#E6E8EE] mt-6">
                    <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">📋 Chiến Lược Nhắc Nhở Tự Động</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                                <h3 className="font-semibold text-gray-900 mb-2">🔔 Nhắc nhở lần 1</h3>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• <strong>Thời điểm:</strong> 500km hoặc 30 ngày trước hạn</li>
                                    <li>• <strong>Kênh:</strong> SMS + Zalo</li>
                                    <li>• <strong>Nội dung:</strong> Thông báo sắp đến hạn bảo dưỡng</li>
                                    <li>• <strong>Link đặt lịch:</strong> Có</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                                <h3 className="font-semibold text-gray-900 mb-2">🔔 Nhắc nhở lần 2</h3>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• <strong>Thời điểm:</strong> 7 ngày trước hạn (nếu chưa phản hồi)</li>
                                    <li>• <strong>Kênh:</strong> SMS + Email</li>
                                    <li>• <strong>Nội dung:</strong> Nhắc lại với ưu đãi</li>
                                    <li>• <strong>Gọi điện:</strong> Có (cho khách VIP)</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                                <h3 className="font-semibold text-gray-900 mb-2">📞 Follow-up quá hạn</h3>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• <strong>Thời điểm:</strong> Ngay sau khi quá hạn</li>
                                    <li>• <strong>Kênh:</strong> Gọi điện trực tiếp</li>
                                    <li>• <strong>Nội dung:</strong> Quan tâm + nhắc nhở</li>
                                    <li>• <strong>Ưu đãi:</strong> Miễn phí kiểm tra</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
