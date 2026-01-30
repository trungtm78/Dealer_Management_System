"use client";

import { useState, useTransition } from "react";
import {
    Mail, MessageSquare, BarChart3, DollarSign, Users, Target, Plus, MoreVertical, Play, Pause, PlayCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CampaignDTO, CampaignStatus, CampaignType } from "@/lib/types/crm";
import { toggleCampaignStatus } from "@/actions/crm/marketing";
import CreateCampaignDialog from "./CreateCampaignDialog";

interface MarketingDashboardProps {
    initialCampaigns: CampaignDTO[];
}

// ... helper functions (formatCurrency, getStatusColor, getChannelIcon) remain same ...
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(amount);
};

const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
        case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
        case 'COMPLETED': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'DRAFT': return 'bg-gray-100 text-gray-700 border-gray-200';
        case 'PAUSED': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const getChannelIcon = (type: CampaignType) => {
    switch (type) {
        case 'SMS': return <MessageSquare className="w-4 h-4 text-green-600" />;
        case 'EMAIL': return <Mail className="w-4 h-4 text-blue-600" />;
        case 'ZALO': return <span className="text-sm">💬</span>;
        case 'FACEBOOK': return <span className="text-sm">👍</span>;
        default: return null;
    }
};

export default function MarketingDashboard({ initialCampaigns }: MarketingDashboardProps) {
    const [isPending, startTransition] = useTransition();
    const [campaigns, setCampaigns] = useState<CampaignDTO[]>(initialCampaigns);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleToggleStatus = (id: string, currentStatus: CampaignStatus) => {
        startTransition(async () => {
            await toggleCampaignStatus(id, currentStatus);
            // Optimistic update
            setCampaigns(prev => prev.map(c =>
                c.id === id ? { ...c, status: currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : c
            ));
        });
    };

    const handleCreate = (newCampaign: CampaignDTO) => {
        setCampaigns(prev => [newCampaign, ...prev]);
    };

    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0);
    const totalConverted = campaigns.reduce((sum, c) => sum + c.converted, 0);

    return (
        <div className="space-y-6">
            <CreateCampaignDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onSave={handleCreate}
            />

            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Chiến Dịch Marketing</h1>
                    <p className="text-gray-500 text-sm">Quản lý các chiến dịch SMS, Email, Zalo & Facebook</p>
                </div>
                <Button className="bg-[#E60012] hover:bg-[#c50010]" onClick={() => setIsCreateOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo Chiến Dịch Mới
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 border-l-4 border-blue-500 shadow-sm relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Tổng Ngân Sách</p>
                            <h3 className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(totalBudget)}</h3>
                            <p className="text-xs text-gray-400 mt-2">Đã chi: {formatCurrency(totalSpent)}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-full">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-100">
                        <div className="h-full bg-blue-500" style={{ width: `${totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0}%` }}></div>
                    </div>
                </Card>

                <Card className="p-6 border-l-4 border-green-500 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Tin Nhắn Đã Gửi</p>
                            <h3 className="text-2xl font-bold text-green-700 mt-1">{(totalSent || 0).toLocaleString()}</h3>
                            <p className="text-xs text-gray-400 mt-2">{initialCampaigns.filter(c => c.status === 'ACTIVE').length} chiến dịch đang chạy</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full">
                            <MessageSquare className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                {/* Other cards kept same as layout */}
                <Card className="p-6 border-l-4 border-purple-500 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Chuyển Đổi (Sales)</p>
                            <h3 className="text-2xl font-bold text-purple-700 mt-1">{totalConverted}</h3>
                            <p className="text-xs text-green-600 mt-2 font-medium">
                                {totalSent > 0 ? `+${((totalConverted / totalSent) * 100).toFixed(1)}% Rate` : '0%'}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-full">
                            <Target className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-l-4 border-yellow-500 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Tổng Chiến Dịch</p>
                            <h3 className="text-2xl font-bold text-yellow-700 mt-1">{initialCampaigns.length}</h3>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-full">
                            <BarChart3 className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Campaign List */}
            <Card className="overflow-hidden border border-gray-100 shadow-sm">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Danh Sách Chiến Dịch</h3>
                    <Button variant="outline" size="sm" className="h-8">Xem Tất Cả</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên Chiến Dịch</th>
                                <th className="text-center py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kênh</th>
                                <th className="text-center py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời Gian</th>
                                <th className="text-center py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hiệu Quả</th>
                                <th className="text-center py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                                <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {campaigns.map((campaign) => (
                                <tr key={campaign.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{campaign.name}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Users className="w-3 h-3 text-gray-400" />
                                                <span className="text-xs text-gray-500">{(campaign.audienceSize || 0).toLocaleString()} target</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-700 shadow-sm">
                                            {getChannelIcon(campaign.type)}
                                            {campaign.type}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs text-gray-900 font-medium">
                                                {new Date(campaign.startDate).toLocaleDateString('vi-VN')}
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                đến {new Date(campaign.endDate).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col gap-1 w-32 mx-auto">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-500">Conv. Rate</span>
                                                <span className="font-bold text-purple-600">
                                                    {campaign.sent > 0 ? ((campaign.converted / campaign.sent) * 100).toFixed(1) : 0}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${campaign.sent > 0 ? (campaign.converted / campaign.sent) * 100 : 0}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <Badge variant="outline" className={`${getStatusColor(campaign.status)} border shadow-sm`}>
                                            {campaign.status}
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            {campaign.status === 'DRAFT' || campaign.status === 'PAUSED' ? (
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:bg-green-50" onClick={() => handleToggleStatus(campaign.id, campaign.status)}>
                                                    <PlayCircle className="w-5 h-5" />
                                                </Button>
                                            ) : campaign.status === 'ACTIVE' ? (
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-yellow-600 hover:bg-yellow-50" onClick={() => handleToggleStatus(campaign.id, campaign.status)}>
                                                    <Pause className="w-5 h-5" />
                                                </Button>
                                            ) : null}

                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Strategy Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-4 border-l-4 border-green-500 bg-green-50/50">
                    <div className="flex items-center gap-2 mb-2 font-bold text-gray-800">
                        <MessageSquare className="w-4 h-4 text-green-600" /> SMS Strategy
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                        <li>Tỷ lệ mở cao (98%)</li>
                        <li>Phản hồi tức thì</li>
                        <li>Dùng cho nhắc lịch hẹn</li>
                    </ul>
                </Card>
            </div>
        </div>
    );
}
