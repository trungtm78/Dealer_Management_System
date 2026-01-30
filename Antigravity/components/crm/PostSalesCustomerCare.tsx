"use client";

import { useState } from 'react';
import { Phone, Mail, MessageSquare, Calendar, CheckCircle, AlertTriangle, Star, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CustomerCare {
    id: string;
    customerId: string;
    customerName: string;
    phone: string;
    vehicle: string;
    plate: string;
    purchaseDate: string;
    daysSincePurchase: number;
    followUpTasks: FollowUpTask[];
    satisfactionScore?: number;
    feedback?: string;
    issues: Issue[];
    nextActionDue: string;
}

interface FollowUpTask {
    id: string;
    type: 'call' | 'visit' | 'survey';
    dueDate: string;
    status: 'pending' | 'completed' | 'overdue';
    completedDate?: string;
    notes?: string;
}

interface Issue {
    id: string;
    title: string;
    status: 'open' | 'resolved';
    priority: 'low' | 'medium' | 'high';
    createdDate: string;
    resolvedDate?: string;
}

export default function PostSalesCustomerCare() {
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerCare | null>(null);

    const [customers] = useState<CustomerCare[]>([
        {
            id: 'CARE-001',
            customerId: 'CUS-00125',
            customerName: 'Nguyễn Văn An',
            phone: '0901234567',
            vehicle: 'Honda City RS 2026',
            plate: '51G-123.45',
            purchaseDate: '15/12/2025',
            daysSincePurchase: 23,
            followUpTasks: [
                {
                    id: 'TASK-001',
                    type: 'call',
                    dueDate: '22/12/2025',
                    status: 'completed',
                    completedDate: '21/12/2025',
                    notes: 'Khách hàng hài lòng, không có vấn đề',
                },
                {
                    id: 'TASK-002',
                    type: 'survey',
                    dueDate: '15/01/2026',
                    status: 'completed',
                    completedDate: '14/01/2026',
                },
            ],
            satisfactionScore: 5,
            feedback: 'Rất hài lòng với xe và dịch vụ của đại lý',
            issues: [],
            nextActionDue: '15/03/2026',
        },
        {
            id: 'CARE-002',
            customerId: 'CUS-00126',
            customerName: 'Trần Thị Bình',
            phone: '0912345678',
            vehicle: 'Honda CR-V L 2026',
            plate: '59A-456.78',
            purchaseDate: '20/12/2025',
            daysSincePurchase: 18,
            followUpTasks: [
                {
                    id: 'TASK-003',
                    type: 'call',
                    dueDate: '27/12/2025',
                    status: 'completed',
                    completedDate: '26/12/2025',
                },
                {
                    id: 'TASK-004',
                    type: 'survey',
                    dueDate: '20/01/2026',
                    status: 'pending',
                },
            ],
            satisfactionScore: 4,
            issues: [
                {
                    id: 'ISS-001',
                    title: 'Tiếng kêu lạ từ gầm xe',
                    status: 'open',
                    priority: 'medium',
                    createdDate: '05/01/2026',
                },
            ],
            nextActionDue: '20/01/2026',
        },
        {
            id: 'CARE-003',
            customerId: 'CUS-00127',
            customerName: 'Lê Minh Cường',
            phone: '0923456789',
            vehicle: 'Honda Accord 2026',
            plate: '30F-789.12',
            purchaseDate: '28/12/2025',
            daysSincePurchase: 10,
            followUpTasks: [
                {
                    id: 'TASK-005',
                    type: 'call',
                    dueDate: '04/01/2026',
                    status: 'overdue',
                },
            ],
            issues: [],
            nextActionDue: '04/01/2026',
        },
    ]);

    const totalCustomers = customers.length;
    const avgSatisfaction = (
        customers.filter(c => c.satisfactionScore).reduce((sum, c) => sum + (c.satisfactionScore || 0), 0) /
        customers.filter(c => c.satisfactionScore).length
    ).toFixed(1);
    const pendingTasks = customers.reduce(
        (sum, c) => sum + c.followUpTasks.filter(t => t.status === 'pending' || t.status === 'overdue').length,
        0
    );
    const openIssues = customers.reduce((sum, c) => sum + c.issues.filter(i => i.status === 'open').length, 0);

    const getTaskIcon = (type: string) => {
        switch (type) {
            case 'call': return <Phone className="w-4 h-4" />;
            case 'visit': return <Calendar className="w-4 h-4" />;
            case 'survey': return <MessageSquare className="w-4 h-4" />;
            default: return null;
        }
    };

    const getTaskLabel = (type: string) => {
        switch (type) {
            case 'call': return 'Gọi điện';
            case 'visit': return 'Thăm hỏi';
            case 'survey': return 'Khảo sát';
            default: return type;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700 border-green-300';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'overdue': return 'bg-red-100 text-red-700 border-red-300';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'low': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
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
                            <span>Chăm Sóc Sau Bán Xe</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Post-Sales Customer Care</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline">
                            <Mail className="w-4 h-4 mr-2" />
                            Gửi Survey Hàng Loạt
                        </Button>
                        <Button className="bg-[#E60012] hover:bg-[#c50010]">
                            <Phone className="w-4 h-4 mr-2" />
                            Tạo Follow-up Task
                        </Button>
                    </div>
                </div>
            </header>

            <div className="p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-6 mb-6">
                    <Card className="p-6 border-l-4 border-blue-500 bg-blue-50">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Tổng khách hàng</p>
                                <p className="text-3xl font-bold text-blue-700">{totalCustomers}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-blue-700" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Trong 90 ngày qua</p>
                    </Card>

                    <Card className="p-6 border-l-4 border-green-500 bg-green-50">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Mức độ hài lòng TB</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-3xl font-bold text-green-700">{avgSatisfaction}</p>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < parseFloat(avgSatisfaction) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
                                <Star className="w-6 h-6 text-green-700" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Trung bình 5 sao</p>
                    </Card>

                    <Card className="p-6 border-l-4 border-yellow-500 bg-yellow-50">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Công việc chờ xử lý</p>
                                <p className="text-3xl font-bold text-yellow-700">{pendingTasks}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-700" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Tasks cần hoàn thành</p>
                    </Card>

                    <Card className="p-6 border-l-4 border-red-500 bg-red-50">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Vấn đề chưa giải quyết</p>
                                <p className="text-3xl font-bold text-red-700">{openIssues}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-red-200 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-700" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Cần xử lý gấp</p>
                    </Card>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Customer List */}
                    <div className="col-span-2">
                        <Card className="border border-[#E6E8EE]">
                            <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                                <h2 className="text-lg font-semibold text-gray-900">Danh Sách Khách Hàng</h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {customers.map((customer) => (
                                    <div
                                        key={customer.id}
                                        onClick={() => setSelectedCustomer(customer)}
                                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedCustomer?.id === customer.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className="text-base font-semibold text-gray-900">{customer.customerName}</p>
                                                <p className="text-sm text-gray-600">{customer.phone}</p>
                                            </div>
                                            {customer.satisfactionScore && (
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < customer.satisfactionScore! ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                            <span>🚗 {customer.vehicle}</span>
                                            <span>📅 {customer.purchaseDate}</span>
                                            <span className="text-blue-600 font-medium">{customer.daysSincePurchase} ngày</span>
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap">
                                            {customer.followUpTasks.map((task) => (
                                                <span
                                                    key={task.id}
                                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                                        task.status
                                                    )}`}
                                                >
                                                    {getTaskIcon(task.type)}
                                                    {getTaskLabel(task.type)}
                                                </span>
                                            ))}
                                            {customer.issues.filter(i => i.status === 'open').length > 0 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    {customer.issues.filter(i => i.status === 'open').length} vấn đề
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Customer Detail */}
                    <div>
                        {selectedCustomer ? (
                            <Card className="border border-[#E6E8EE]">
                                <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                                    <h2 className="text-lg font-semibold text-gray-900">Chi Tiết</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">{selectedCustomer.customerName}</h3>
                                        <p className="text-sm text-gray-600">{selectedCustomer.vehicle}</p>
                                        <p className="text-sm text-gray-600">{selectedCustomer.plate}</p>
                                    </div>

                                    {selectedCustomer.satisfactionScore && (
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <p className="text-xs text-gray-600 mb-1">Đánh giá</p>
                                            <div className="flex items-center gap-2 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-5 h-5 ${i < selectedCustomer.satisfactionScore!
                                                                ? 'text-yellow-500 fill-yellow-500'
                                                                : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            {selectedCustomer.feedback && (
                                                <p className="text-sm text-gray-700 italic">&quot;{selectedCustomer.feedback}&quot;</p>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Follow-up Tasks</h4>
                                        <div className="space-y-2">
                                            {selectedCustomer.followUpTasks.map((task) => (
                                                <div key={task.id} className="p-2 bg-gray-50 rounded text-sm">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-medium">{getTaskLabel(task.type)}</span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                                                            {task.status === 'completed' ? '✓ Hoàn thành' :
                                                                task.status === 'overdue' ? '⚠ Quá hạn' : 'Chờ xử lý'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-600">Hạn: {task.dueDate}</p>
                                                    {task.notes && <p className="text-xs text-gray-500 mt-1">{task.notes}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedCustomer.issues.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Vấn đề</h4>
                                            <div className="space-y-2">
                                                {selectedCustomer.issues.map((issue) => (
                                                    <div key={issue.id} className="p-2 bg-red-50 rounded text-sm border border-red-200">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-medium text-red-900">{issue.title}</span>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(issue.priority)}`}>
                                                                {issue.priority === 'high' ? 'Cao' : issue.priority === 'medium' ? 'TB' : 'Thấp'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-600">Tạo: {issue.createdDate}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-gray-200">
                                        <Button className="w-full bg-[#E60012] hover:bg-[#c50010]">
                                            <Phone className="w-4 h-4 mr-2" />
                                            Gọi điện ngay
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <Card className="border border-[#E6E8EE] p-6">
                                <div className="text-center text-gray-500">
                                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                    <p className="text-sm">Chọn khách hàng để xem chi tiết</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Follow-up Schedule */}
                <Card className="border border-[#E6E8EE] mt-6">
                    <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">📅 Lịch Trình Chăm Sóc Tự Động</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                <h3 className="font-semibold text-gray-900 mb-2">Tuần 1 (7 ngày sau mua)</h3>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>📞 <strong>Gọi điện:</strong> Hỏi thăm trải nghiệm</li>
                                    <li>📧 <strong>Email:</strong> Hướng dẫn sử dụng xe</li>
                                    <li>📊 <strong>Survey:</strong> Đánh giá dịch vụ bán hàng</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <h3 className="font-semibold text-gray-900 mb-2">Tháng 1 (30 ngày sau mua)</h3>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>📞 <strong>Gọi điện:</strong> Nhắc bảo dưỡng 1,000km</li>
                                    <li>🎁 <strong>Ưu đãi:</strong> Voucher miễn phí rửa xe</li>
                                    <li>📊 <strong>Survey:</strong> Mức độ hài lòng tổng thể</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                                <h3 className="font-semibold text-gray-900 mb-2">Tháng 3 (90 ngày sau mua)</h3>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>📞 <strong>Gọi điện:</strong> Thăm hỏi định kỳ</li>
                                    <li>💬 <strong>SMS:</strong> Nhắc bảo dưỡng 5,000km</li>
                                    <li>⭐ <strong>Loyalty:</strong> Tặng điểm thưởng</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
