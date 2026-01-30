"use client";

import { useState } from 'react';
import { AlertCircle, Clock, CheckCircle, User, MessageSquare, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CustomerSearch } from "@/components/common/CustomerSearch";

interface Ticket {
    id: string;
    ticketNumber: string;
    customerId: string;
    customerName: string;
    phone: string;
    issue: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    assignedTo?: string;
    createdDate: string;
    createdTime: string;
    slaDeadline: string;
    slaRemaining: number;
    resolvedDate?: string;
    resolution?: string;
    satisfactionRating?: number;
}

// Helper Component for creating tickets
function CreateTicketForm({ onCreate }: { onCreate: (ticket: Ticket) => void }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [issue, setIssue] = useState("");
    const [priority, setPriority] = useState<Ticket['priority']>("medium");
    const [description, setDescription] = useState("");

    const handleSubmit = () => {
        if (!name || !phone || !issue) {
            toast.error("Vui lòng điền các trường bắt buộc");
            return;
        }

        const newTicket: Ticket = {
            id: Math.random().toString(36).substr(2, 9),
            ticketNumber: `TICKET-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            customerId: `CUS-${Math.floor(Math.random() * 1000)}`,
            customerName: name,
            phone,
            issue,
            description,
            priority,
            status: 'open',
            createdDate: new Date().toLocaleDateString('vi-VN'),
            createdTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('vi-VN'),
            slaRemaining: 1440
        };

        onCreate(newTicket);
    };

    return (
        <div className="py-4 space-y-4">
            <div className="space-y-2">
                <Label>Khách hàng <span className="text-red-500">(*)</span></Label>
                <div className="flex gap-2">
                    <CustomerSearch
                        onSelect={(c) => {
                            setName(c.name);
                            if (c.phone) setPhone(c.phone);
                        }}
                        className="w-full"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Số điện thoại <span className="text-red-500">(*)</span></Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="09xxxx" />
            </div>
            <div className="space-y-2">
                <Label>Vấn đề <span className="text-red-500">(*)</span></Label>
                <Select onValueChange={setIssue}>
                    <SelectTrigger><SelectValue placeholder="Chọn loại vấn đề" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Dịch vụ">Dịch vụ</SelectItem>
                        <SelectItem value="Thái độ nhân viên">Thái độ nhân viên</SelectItem>
                        <SelectItem value="Chất lượng xe">Chất lượng xe</SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Mức độ <span className="text-red-500">(*)</span></Label>
                <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">Thấp</SelectItem>
                        <SelectItem value="medium">Trung bình</SelectItem>
                        <SelectItem value="high">Cao</SelectItem>
                        <SelectItem value="urgent">Khẩn cấp</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Mô tả chi tiết</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Nội dung khiếu nại..." />
            </div>
            <Button className="w-full bg-[#E60012] hover:bg-[#cc0010]" onClick={handleSubmit}>
                Lưu Ticket
            </Button>
        </div>
    );
}

export default function ComplaintManagementSystem() {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    const [tickets, setTickets] = useState<Ticket[]>([
        {
            id: 'TCK-001',
            ticketNumber: 'TICKET-2026-001',
            customerId: 'CUS-00125',
            customerName: 'Nguyễn Văn An',
            phone: '0901234567',
            issue: 'Tiếng kêu bất thường từ động cơ',
            description: 'Khi tăng tốc lên trên 80km/h có tiếng kêu lạ từ khoang động cơ. Đã mang xe đến bảo dưỡng nhưng vẫn chưa khắc phục được.',
            priority: 'high',
            status: 'in-progress',
            assignedTo: 'Trần Văn B - KTV Trưởng',
            createdDate: '14/01/2026',
            createdTime: '09:30',
            slaDeadline: '14/01/2026 13:30',
            slaRemaining: 120,
        },
        {
            id: 'TCK-002',
            ticketNumber: 'TICKET-2026-002',
            customerId: 'CUS-00126',
            customerName: 'Trần Thị Bình',
            phone: '0912345678',
            issue: 'Điều hòa không mát',
            description: 'Điều hòa hoạt động nhưng không lạnh. Đã thay gas lần trước nhưng giờ lại hết lạnh.',
            priority: 'medium',
            status: 'open',
            createdDate: '14/01/2026',
            createdTime: '10:15',
            slaDeadline: '14/01/2026 14:15',
            slaRemaining: 180,
        },
        {
            id: 'TCK-003',
            ticketNumber: 'TICKET-2026-003',
            customerId: 'CUS-00127',
            customerName: 'Lê Minh Cường',
            phone: '0923456789',
            issue: 'Thái độ nhân viên không tốt',
            description: 'Nhân viên tư vấn thiếu nhiệt tình, không giải đáp đầy đủ thắc mắc của tôi về bảo hiểm.',
            priority: 'urgent',
            status: 'resolved',
            assignedTo: 'Phạm Thị Dung - TP Dịch Vụ',
            createdDate: '13/01/2026',
            createdTime: '14:20',
            slaDeadline: '13/01/2026 16:20',
            slaRemaining: 0,
            resolvedDate: '13/01/2026 15:30',
            resolution: 'Đã gặp và xin lỗi khách hàng. Đào tạo lại nhân viên về kỹ năng giao tiếp. Tặng voucher bảo dưỡng miễn phí.',
            satisfactionRating: 4,
        },
        {
            id: 'TCK-004',
            ticketNumber: 'TICKET-2026-004',
            customerId: 'CUS-00128',
            customerName: 'Phạm Thị Dung',
            phone: '0934567890',
            issue: 'Chưa nhận được giấy tờ xe',
            description: 'Đã mua xe từ 15 ngày trước nhưng vẫn chưa nhận được đăng ký xe và bảo hiểm.',
            priority: 'high',
            status: 'in-progress',
            assignedTo: 'Nguyễn Văn An - NV Bán Hàng',
            createdDate: '14/01/2026',
            createdTime: '11:00',
            slaDeadline: '14/01/2026 15:00',
            slaRemaining: 150,
        },
    ]);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-700 border-red-300';
            case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'low': return 'bg-green-100 text-green-700 border-green-300';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'in-progress': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'resolved': return 'bg-green-100 text-green-700 border-green-300';
            case 'closed': return 'bg-gray-100 text-gray-700 border-gray-300';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'Khẩn cấp';
            case 'high': return 'Cao';
            case 'medium': return 'Trung bình';
            case 'low': return 'Thấp';
            default: return priority;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'open': return 'Mới';
            case 'in-progress': return 'Đang xử lý';
            case 'resolved': return 'Đã giải quyết';
            case 'closed': return 'Đã đóng';
            default: return status;
        }
    };

    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length;
    const urgentTickets = tickets.filter(t => t.priority === 'urgent').length;
    const slaBreached = tickets.filter(t => t.slaRemaining < 0).length;

    return (
        <div className="min-h-screen bg-[#F6F7F9]">
            <header className="bg-white border-b border-[#E6E8EE] px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>CRM</span>
                            <span>/</span>
                            <span>Quản Lý Khiếu Nại</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Hệ Thống Quản Lý Thắc Mắc & Khiếu Nại</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline">
                            <Search className="w-4 h-4 mr-2" />
                            Tìm Kiếm
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-[#E60012] hover:bg-[#c50010]">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Tạo Ticket Mới
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Tạo Ticket Khiếu Nại Mới</DialogTitle>
                                </DialogHeader>
                                <CreateTicketForm onCreate={(ticket) => {
                                    setTickets(prev => [ticket, ...prev]);
                                    toast.success("Đã tạo Ticket mới thành công!");
                                }} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>


            <div className="p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-6 mb-6">
                    <Card className="p-6 border-l-4 border-blue-500 bg-blue-50">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Tổng tickets</p>
                                <p className="text-3xl font-bold text-blue-700">{totalTickets}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-blue-700" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Hôm nay</p>
                    </Card>

                    <Card className="p-6 border-l-4 border-yellow-500 bg-yellow-50">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Đang xử lý</p>
                                <p className="text-3xl font-bold text-yellow-700">{openTickets}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-700" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Cần xử lý</p>
                    </Card>

                    <Card className="p-6 border-l-4 border-red-500 bg-red-50">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Khẩn cấp</p>
                                <p className="text-3xl font-bold text-red-700">{urgentTickets}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-red-200 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-red-700" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Ưu tiên cao nhất</p>
                    </Card>

                    <Card className="p-6 border-l-4 border-green-500 bg-green-50">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Đã giải quyết</p>
                                <p className="text-3xl font-bold text-green-700">
                                    {tickets.filter(t => t.status === 'resolved').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-700" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Hoàn thành</p>
                    </Card>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Ticket List */}
                    <div className="col-span-2">
                        <Card className="border border-[#E6E8EE]">
                            <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                                <h2 className="text-lg font-semibold text-gray-900">Danh Sách Tickets</h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {tickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        onClick={() => setSelectedTicket(ticket)}
                                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedTicket?.id === ticket.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-mono text-gray-500">{ticket.ticketNumber}</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(ticket.priority)}`}>
                                                        {getPriorityLabel(ticket.priority)}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ticket.status)}`}>
                                                        {getStatusLabel(ticket.status)}
                                                    </span>
                                                </div>
                                                <h3 className="font-semibold text-gray-900 mb-1">{ticket.issue}</h3>
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ticket.description}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span>👤 {ticket.customerName}</span>
                                                    <span>📞 {ticket.phone}</span>
                                                    <span>🕐 {ticket.createdDate} {ticket.createdTime}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {ticket.assignedTo && (
                                            <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50 rounded">
                                                <User className="w-4 h-4 text-gray-500" />
                                                <span className="text-xs text-gray-700">Người xử lý: {ticket.assignedTo}</span>
                                            </div>
                                        )}

                                        <div className="mt-2 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-500" />
                                            <span className="text-xs text-gray-600">
                                                SLA: {ticket.slaDeadline}
                                            </span>
                                            {ticket.slaRemaining > 0 ? (
                                                <span className="text-xs text-green-600 font-medium">
                                                    Còn {ticket.slaRemaining} phút
                                                </span>
                                            ) : ticket.slaRemaining < 0 ? (
                                                <span className="text-xs text-red-600 font-medium">
                                                    ⚠️ Quá hạn {Math.abs(ticket.slaRemaining)} phút
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-500">Đã xử lý</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Ticket Detail */}
                    <div>
                        {selectedTicket ? (
                            <Card className="border border-[#E6E8EE]">
                                <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                                    <h2 className="text-lg font-semibold text-gray-900">Chi Tiết Ticket</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Ticket Number</p>
                                        <p className="text-sm font-mono font-bold text-blue-600">{selectedTicket.ticketNumber}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(selectedTicket.priority)}`}>
                                            {getPriorityLabel(selectedTicket.priority)}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedTicket.status)}`}>
                                            {getStatusLabel(selectedTicket.status)}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Khách hàng</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedTicket.customerName}</p>
                                        <p className="text-sm text-gray-600">{selectedTicket.phone}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Vấn đề</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedTicket.issue}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Mô tả</p>
                                        <p className="text-sm text-gray-700">{selectedTicket.description}</p>
                                    </div>

                                    {selectedTicket.assignedTo && (
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <p className="text-xs text-gray-600 mb-1">Người xử lý</p>
                                            <p className="text-sm font-semibold text-blue-900">{selectedTicket.assignedTo}</p>
                                        </div>
                                    )}

                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-600 mb-1">SLA Deadline</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedTicket.slaDeadline}</p>
                                        {selectedTicket.slaRemaining > 0 && (
                                            <p className="text-xs text-green-600 mt-1">Còn {selectedTicket.slaRemaining} phút</p>
                                        )}
                                    </div>

                                    {selectedTicket.resolution && (
                                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                            <p className="text-xs text-gray-600 mb-1">Giải pháp</p>
                                            <p className="text-sm text-gray-700">{selectedTicket.resolution}</p>
                                            {selectedTicket.resolvedDate && (
                                                <p className="text-xs text-green-600 mt-2">✓ Giải quyết: {selectedTicket.resolvedDate}</p>
                                            )}
                                        </div>
                                    )}

                                    {selectedTicket.satisfactionRating && (
                                        <div className="p-3 bg-yellow-50 rounded-lg">
                                            <p className="text-xs text-gray-600 mb-2">Đánh giá của khách hàng</p>
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={`text-2xl ${i < selectedTicket!.satisfactionRating! ? 'text-yellow-500' : 'text-gray-300'
                                                            }`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-gray-200 space-y-2">
                                        {selectedTicket.status === 'open' && (
                                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                                Nhận xử lý
                                            </Button>
                                        )}
                                        {selectedTicket.status === 'in-progress' && (
                                            <Button className="w-full bg-green-600 hover:bg-green-700">
                                                Đánh dấu hoàn thành
                                            </Button>
                                        )}
                                        <Button variant="outline" className="w-full">
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            Thêm ghi chú
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <Card className="border border-[#E6E8EE] p-6">
                                <div className="text-center text-gray-500">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                    <p className="text-sm">Chọn ticket để xem chi tiết</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>

                {/* SLA Info */}
                <Card className="border border-[#E6E8EE] mt-6">
                    <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">⏱️ SLA (Service Level Agreement)</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-4 gap-6">
                            <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                                <h3 className="font-semibold text-gray-900 mb-2">Khẩn cấp</h3>
                                <p className="text-2xl font-bold text-red-600 mb-1">2 giờ</p>
                                <p className="text-xs text-gray-600">Thời gian phản hồi tối đa</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                                <h3 className="font-semibold text-gray-900 mb-2">Ưu tiên cao</h3>
                                <p className="text-2xl font-bold text-orange-600 mb-1">4 giờ</p>
                                <p className="text-xs text-gray-600">Thời gian phản hồi tối đa</p>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                                <h3 className="font-semibold text-gray-900 mb-2">Trung bình</h3>
                                <p className="text-2xl font-bold text-yellow-600 mb-1">8 giờ</p>
                                <p className="text-xs text-gray-600">Thời gian phản hồi tối đa</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <h3 className="font-semibold text-gray-900 mb-2">Thấp</h3>
                                <p className="text-2xl font-bold text-green-600 mb-1">24 giờ</p>
                                <p className="text-xs text-gray-600">Thời gian phản hồi tối đa</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div >
    );
}
