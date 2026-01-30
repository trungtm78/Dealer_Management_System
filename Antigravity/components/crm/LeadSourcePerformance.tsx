"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Target, Award, Calendar, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getLeadSourceStats, SourceStat } from '@/actions/crm/reports';
import { toast } from 'sonner';

export default function LeadSourcePerformance() {
    const [dateRange, setDateRange] = useState('all');
    const [selectedSalesperson, setSelectedSalesperson] = useState('all');
    const [stats, setStats] = useState<SourceStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await getLeadSourceStats();
            if (res.success && res.data) {
                setStats(res.data);
            } else {
                toast.error("Không thể tải dữ liệu báo cáo");
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    // Mapping real data to UI format
    // Mock Revenue (Estimate 800M per Won Lead as we don't have Orders DB yet)
    const EST_REVENUE_PER_WON = 800_000_000;

    const sourcesData = stats.map(s => ({
        name: s.source,
        leads: s.total,
        qualified: s.won, // In chart use won as qualified
        converted: Math.floor(s.won * 0.4), // Mock conversion from qualified (since we track Lead status mostly)
        avgScore: s.avgScore,
        color: getColorForSource(s.source),
        revenue: Math.floor(s.won * 0.4) * EST_REVENUE_PER_WON
    }));

    function getColorForSource(sourceName: string) {
        const colors: Record<string, string> = {
            'Facebook Ads': '#1877F2',
            'Website': '#001E62',
            'Showroom (Walk-in)': '#E60012',
            'Hotline': '#10B981',
            'Giới thiệu': '#F59E0B',
            'Khác': '#8B5CF6'
        };
        return colors[sourceName] || '#9CA3AF';
    }

    const totalLeads = sourcesData.reduce((sum, s) => sum + s.leads, 0);
    const totalConverted = sourcesData.reduce((sum, s) => sum + s.converted, 0);
    const overallConversionRate = totalLeads > 0 ? (totalConverted / totalLeads * 100).toFixed(1) : "0.0";
    const avgScore = sourcesData.length > 0 ? (sourcesData.reduce((sum, s) => sum + s.avgScore, 0) / sourcesData.length).toFixed(0) : "0";
    const totalRevenue = sourcesData.reduce((sum, s) => sum + s.revenue, 0);

    const maxLeads = Math.max(...sourcesData.map(s => s.leads));

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-[#F6F7F9]">
            {/* Header */}
            <header className="bg-white border-b border-[#E6E8EE] px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>Bán Hàng</span>
                            <span>/</span>
                            <span>Phân Tích</span>
                            <span>/</span>
                            <span>Nguồn Lead</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Hiệu Quả Nguồn Lead</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={selectedSalesperson}
                            onChange={(e) => setSelectedSalesperson(e.target.value)}
                            className="px-4 py-2 border border-[#E6E8EE] rounded-lg text-sm"
                        >
                            <option value="all">Tất cả Sales</option>
                            <option value="nvb">Nguyễn Văn B</option>
                            <option value="ptd">Phạm Thị D</option>
                            <option value="tvg">Trần Văn G</option>
                        </select>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-4 py-2 border border-[#E6E8EE] rounded-lg text-sm"
                        >
                            <option value="today">Hôm nay</option>
                            <option value="thisWeek">Tuần này</option>
                            <option value="thisMonth">Tháng này</option>
                            <option value="lastMonth">Tháng trước</option>
                            <option value="thisQuarter">Quý này</option>
                            <option value="thisYear">Năm nay</option>
                        </select>
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Xuất Excel
                        </Button>
                    </div>
                </div>
            </header>

            <div className="p-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-4 gap-6 mb-6">
                    <Card className="p-6 border border-[#E6E8EE] bg-gradient-to-br from-blue-50 to-white">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-semibold">
                                +12.5%
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Tổng Leads</p>
                        <p className="text-3xl font-bold text-gray-900">{totalLeads.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">So với tháng trước</p>
                    </Card>

                    <Card className="p-6 border border-[#E6E8EE] bg-gradient-to-br from-green-50 to-white">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <Target className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-semibold">
                                +3.2%
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Tỷ Lệ Chuyển Đổi</p>
                        <p className="text-3xl font-bold text-gray-900">{overallConversionRate}%</p>
                        <p className="text-xs text-gray-500 mt-1">{totalConverted} leads đã chuyển đổi</p>
                    </Card>

                    <Card className="p-6 border border-[#E6E8EE] bg-gradient-to-br from-yellow-50 to-white">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                <Award className="w-6 h-6 text-yellow-600" />
                            </div>
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-semibold">
                                Ổn định
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Điểm TB</p>
                        <p className="text-3xl font-bold text-gray-900">{avgScore}</p>
                        <p className="text-xs text-gray-500 mt-1">Trên 100 điểm</p>
                    </Card>

                    <Card className="p-6 border border-[#E6E8EE] bg-gradient-to-br from-red-50 to-white">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-[#E60012]" />
                            </div>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-semibold">
                                +18.4%
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Doanh Thu</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue).replace('₫', 'tỷ')}</p>
                        <p className="text-xs text-gray-500 mt-1">Từ leads đã chuyển đổi</p>
                    </Card>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Bar Chart - Leads by Source */}
                    <div className="col-span-2">
                        <Card className="p-6 border border-[#E6E8EE]">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Leads Theo Nguồn</h2>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar className="w-4 h-4" />
                                    <span>Tháng 1, 2026</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {sourcesData.map((source) => (
                                    <div key={source.name}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: source.color }}
                                                />
                                                <span className="text-sm font-medium text-gray-900">{source.name}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs text-gray-500">
                                                    Chuyển đổi: {((source.converted / source.leads) * 100).toFixed(1)}%
                                                </span>
                                                <span className="text-sm font-bold text-gray-900">
                                                    {source.leads} leads
                                                </span>
                                            </div>
                                        </div>
                                        <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${(source.leads / maxLeads) * 100}%`,
                                                    backgroundColor: source.color,
                                                }}
                                            />
                                            <div className="absolute inset-0 flex items-center px-3 text-xs text-white font-semibold">
                                                {source.leads} leads
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Detailed Table */}
                        <Card className="p-6 border border-[#E6E8EE] mt-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Chi Tiết Theo Nguồn</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase">Nguồn</th>
                                            <th className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase">Leads</th>
                                            <th className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase">Qualified</th>
                                            <th className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase">Converted</th>
                                            <th className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase">Tỷ lệ</th>
                                            <th className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase">Điểm TB</th>
                                            <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase">Doanh thu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sourcesData.map((source, index) => (
                                            <tr key={source.name} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-2">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-2 h-2 rounded-full"
                                                            style={{ backgroundColor: source.color }}
                                                        />
                                                        <span className="text-sm font-medium text-gray-900">{source.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2 text-center text-sm text-gray-900">{source.leads}</td>
                                                <td className="py-3 px-2 text-center text-sm text-gray-900">{source.qualified}</td>
                                                <td className="py-3 px-2 text-center text-sm font-semibold text-green-600">{source.converted}</td>
                                                <td className="py-3 px-2 text-center">
                                                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded">
                                                        {((source.converted / source.leads) * 100).toFixed(1)}%
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2 text-center">
                                                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${source.avgScore >= 70 ? 'bg-green-100 text-green-700' :
                                                        source.avgScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {source.avgScore}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2 text-right text-sm font-semibold text-gray-900">
                                                    {formatCurrency(source.revenue)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    {/* Funnel Chart */}
                    <div className="col-span-1">
                        <Card className="p-6 border border-[#E6E8EE]">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Phễu Chuyển Đổi</h2>

                            <div className="space-y-4">
                                {/* Lead Stage */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Lead</span>
                                        <span className="text-sm font-bold text-gray-900">{totalLeads}</span>
                                    </div>
                                    <div className="h-16 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        100%
                                    </div>
                                </div>

                                {/* Qualified Stage */}
                                <div className="pl-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Qualified</span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {sourcesData.reduce((sum, s) => sum + s.qualified, 0)}
                                        </span>
                                    </div>
                                    <div className="h-14 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-lg flex items-center justify-center text-white font-bold shadow-lg" style={{ width: '85%' }}>
                                        {((sourcesData.reduce((sum, s) => sum + s.qualified, 0) / totalLeads) * 100).toFixed(0)}%
                                    </div>
                                </div>

                                {/* Converted Stage */}
                                <div className="pl-12">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Converted</span>
                                        <span className="text-sm font-bold text-gray-900">{totalConverted}</span>
                                    </div>
                                    <div className="h-12 bg-gradient-to-r from-green-500 to-green-400 rounded-lg flex items-center justify-center text-white font-bold shadow-lg" style={{ width: '60%' }}>
                                        {overallConversionRate}%
                                    </div>
                                </div>

                                {/* Drop-off Info */}
                                <div className="pt-4 mt-4 border-t border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Tỷ lệ rơi</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Lead → Qualified</span>
                                            <span className="font-semibold text-red-600">
                                                {(((totalLeads - sourcesData.reduce((sum, s) => sum + s.qualified, 0)) / totalLeads) * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Qualified → Converted</span>
                                            <span className="font-semibold text-red-600">
                                                {(((sourcesData.reduce((sum, s) => sum + s.qualified, 0) - totalConverted) / sourcesData.reduce((sum, s) => sum + s.qualified, 0)) * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Top Performers */}
                        <Card className="p-6 border border-[#E6E8EE] mt-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Nguồn Hiệu Quả Nhất</h2>
                            <div className="space-y-3">
                                {[...sourcesData]
                                    .sort((a, b) => (b.converted / b.leads) - (a.converted / a.leads))
                                    .slice(0, 3)
                                    .map((source, index) => (
                                        <div key={source.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-yellow-400 text-yellow-900' :
                                                index === 1 ? 'bg-gray-300 text-gray-700' :
                                                    'bg-orange-400 text-orange-900'
                                                }`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-900">{source.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {((source.converted / source.leads) * 100).toFixed(1)}% chuyển đổi
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-green-600">{source.converted}</p>
                                                <p className="text-xs text-gray-500">đơn hàng</p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
