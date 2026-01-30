'use client';

import { useState } from 'react';
import { TrendingUp, Package, AlertCircle, RotateCcw, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function PartsKPI() {
    const [period, setPeriod] = useState('thisMonth');

    const kpis = {
        fillRate: 94.5,
        fillRateTrend: '+2.3%',
        backorderRate: 5.5,
        backorderRateTrend: '-1.2%',
        inventoryTurnover: 8.2,
        inventoryTurnoverTrend: '+0.5',
        deadStock: 3.8,
        deadStockTrend: '-0.4%',
    };

    const monthlyData = [
        { month: 'T1', fillRate: 92, backorder: 8, turnover: 7.5, deadStock: 4.2 },
        { month: 'T2', fillRate: 93, backorder: 7, turnover: 7.8, deadStock: 4.0 },
        { month: 'T3', fillRate: 94.5, backorder: 5.5, turnover: 8.2, deadStock: 3.8 },
    ];

    return (
        <div className="min-h-screen bg-[#F6F7F9]">
            <header className="bg-white border-b border-[#E6E8EE] px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>Phụ Tùng</span>
                            <span>/</span>
                            <span>KPI Dashboard</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Parts KPI Dashboard</h1>
                    </div>
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="today">Hôm nay</option>
                        <option value="thisWeek">Tuần này</option>
                        <option value="thisMonth">Tháng này</option>
                        <option value="thisQuarter">Quý này</option>
                        <option value="thisYear">Năm nay</option>
                    </select>
                </div>
            </header>

            <div className="p-6">
                <div className="grid grid-cols-4 gap-6 mb-6">
                    <Card className="p-6 border border-[#E6E8EE] bg-gradient-to-br from-green-50 to-white">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <Package className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-semibold">
                                {kpis.fillRateTrend}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Fill Rate</p>
                        <p className="text-3xl font-bold text-gray-900">{kpis.fillRate}%</p>
                        <p className="text-xs text-gray-500 mt-1">Tỷ lệ đáp ứng đơn hàng</p>
                    </Card>

                    <Card className="p-6 border border-[#E6E8EE] bg-gradient-to-br from-red-50 to-white">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-semibold">
                                {kpis.backorderRateTrend}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Backorder Rate</p>
                        <p className="text-3xl font-bold text-gray-900">{kpis.backorderRate}%</p>
                        <p className="text-xs text-gray-500 mt-1">Tỷ lệ hàng chờ</p>
                    </Card>

                    <Card className="p-6 border border-[#E6E8EE] bg-gradient-to-br from-blue-50 to-white">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <RotateCcw className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-semibold">
                                {kpis.inventoryTurnoverTrend}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Inventory Turnover</p>
                        <p className="text-3xl font-bold text-gray-900">{kpis.inventoryTurnover}x</p>
                        <p className="text-xs text-gray-500 mt-1">Vòng quay hàng tồn kho</p>
                    </Card>

                    <Card className="p-6 border border-[#E6E8EE] bg-gradient-to-br from-yellow-50 to-white">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-yellow-600" />
                            </div>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-semibold">
                                {kpis.deadStockTrend}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Dead Stock</p>
                        <p className="text-3xl font-bold text-gray-900">{kpis.deadStock}%</p>
                        <p className="text-xs text-gray-500 mt-1">Hàng tồn chết</p>
                    </Card>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <Card className="border border-[#E6E8EE]">
                        <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                            <h2 className="text-lg font-semibold text-gray-900">Xu Hướng Fill Rate</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {monthlyData.map((data, idx) => {
                                    const maxFillRate = Math.max(...monthlyData.map(d => d.fillRate));
                                    return (
                                        <div key={idx}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">{data.month}</span>
                                                <span className="text-sm font-bold text-gray-900">{data.fillRate}%</span>
                                            </div>
                                            <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 transition-all flex items-center justify-end px-2"
                                                    style={{ width: `${(data.fillRate / maxFillRate) * 100}%` }}
                                                >
                                                    <span className="text-xs text-white font-semibold">{data.fillRate}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>

                    <Card className="border border-[#E6E8EE]">
                        <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                            <h2 className="text-lg font-semibold text-gray-900">Inventory Turnover Trend</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {monthlyData.map((data, idx) => {
                                    const maxTurnover = Math.max(...monthlyData.map(d => d.turnover));
                                    return (
                                        <div key={idx}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">{data.month}</span>
                                                <span className="text-sm font-bold text-gray-900">{data.turnover}x</span>
                                            </div>
                                            <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 transition-all flex items-center justify-end px-2"
                                                    style={{ width: `${(data.turnover / maxTurnover) * 100}%` }}
                                                >
                                                    <span className="text-xs text-white font-semibold">{data.turnover}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>

                    <Card className="border border-[#E6E8EE]">
                        <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                            <h2 className="text-lg font-semibold text-gray-900">Backorder Rate Trend</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {monthlyData.map((data, idx) => {
                                    const maxBackorder = Math.max(...monthlyData.map(d => d.backorder));
                                    return (
                                        <div key={idx}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">{data.month}</span>
                                                <span className="text-sm font-bold text-gray-900">{data.backorder}%</span>
                                            </div>
                                            <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-red-500 transition-all flex items-center justify-end px-2"
                                                    style={{ width: `${(data.backorder / maxBackorder) * 100}%` }}
                                                >
                                                    <span className="text-xs text-white font-semibold">{data.backorder}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>

                    <Card className="border border-[#E6E8EE]">
                        <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                            <h2 className="text-lg font-semibold text-gray-900">Dead Stock % Trend</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {monthlyData.map((data, idx) => {
                                    const maxDeadStock = Math.max(...monthlyData.map(d => d.deadStock));
                                    return (
                                        <div key={idx}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">{data.month}</span>
                                                <span className="text-sm font-bold text-gray-900">{data.deadStock}%</span>
                                            </div>
                                            <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-yellow-500 transition-all flex items-center justify-end px-2"
                                                    style={{ width: `${(data.deadStock / maxDeadStock) * 100}%` }}
                                                >
                                                    <span className="text-xs text-white font-semibold">{data.deadStock}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
