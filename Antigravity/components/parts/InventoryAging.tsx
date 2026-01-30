'use client';

import { useState } from 'react';
import { AlertTriangle, TrendingDown, Package, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AgingItem {
    partCode: string;
    partName: string;
    category: string;
    qty: number;
    daysInStock: number;
    unitCost: number;
    totalValue: number;
    action: string;
}

export default function InventoryAging() {
    const [items] = useState<AgingItem[]>([
        { partCode: '12345-ABC-001', partName: 'Gương chiếu hậu trái (2020)', category: 'Body Parts', qty: 8, daysInStock: 245, unitCost: 850000, totalValue: 6800000, action: 'Liquidation' },
        { partCode: '67890-DEF-002', partName: 'Đèn hậu phải (2019)', category: 'Lighting', qty: 5, daysInStock: 312, unitCost: 1200000, totalValue: 6000000, action: 'Liquidation' },
        { partCode: '11111-GHI-003', partName: 'Cụm phanh ABS (2021)', category: 'Brake System', qty: 3, daysInStock: 189, unitCost: 3500000, totalValue: 10500000, action: 'Promotion' },
        { partCode: '22222-JKL-004', partName: 'Lọc dầu cũ', category: 'Filters', qty: 45, daysInStock: 156, unitCost: 75000, totalValue: 3375000, action: 'Return' },
    ]);

    const agingBuckets = {
        '0-30': items.filter(i => i.daysInStock <= 30),
        '31-60': items.filter(i => i.daysInStock > 30 && i.daysInStock <= 60),
        '61-90': items.filter(i => i.daysInStock > 60 && i.daysInStock <= 90),
        '>90': items.filter(i => i.daysInStock > 90),
    };

    const totalValue = items.reduce((sum, i) => sum + i.totalValue, 0);
    const deadStockValue = agingBuckets['>90'].reduce((sum, i) => sum + i.totalValue, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(amount);
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'Promotion': return 'bg-yellow-100 text-yellow-700';
            case 'Return': return 'bg-blue-100 text-blue-700';
            case 'Liquidation': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-[#F6F7F9]">
            <header className="bg-white border-b border-[#E6E8EE] px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>Phụ Tùng</span>
                            <span>/</span>
                            <span>Phân Tích Aging</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Inventory Aging Analysis</h1>
                    </div>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Xuất Excel
                    </Button>
                </div>
            </header>

            <div className="p-6">
                <div className="grid grid-cols-4 gap-6 mb-6">
                    {Object.entries(agingBuckets).map(([bucket, bucketItems]) => {
                        const value = bucketItems.reduce((sum, i) => sum + i.totalValue, 0);
                        const color = bucket === '>90' ? 'red' : bucket === '61-90' ? 'orange' : bucket === '31-60' ? 'yellow' : 'green';
                        return (
                            <Card key={bucket} className={`p-6 border-l-4 border-${color}-500 bg-${color}-50`}>
                                <p className="text-sm text-gray-600 mb-1">{bucket} ngày</p>
                                <p className="text-2xl font-bold text-gray-900">{bucketItems.length} items</p>
                                <p className="text-sm text-gray-600 mt-2">{formatCurrency(value)}</p>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                    <Card className="p-6 border border-[#E6E8EE]">
                        <div className="flex items-start justify-between mb-2">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Dead Stock (&gt;90 ngày)</p>
                        <p className="text-2xl font-bold text-red-600">{agingBuckets['>90'].length} items</p>
                        <p className="text-sm text-gray-600 mt-1">{formatCurrency(deadStockValue)}</p>
                    </Card>

                    <Card className="p-6 border border-[#E6E8EE]">
                        <div className="flex items-start justify-between mb-2">
                            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                <TrendingDown className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Slow Moving</p>
                        <p className="text-2xl font-bold text-yellow-600">{agingBuckets['61-90'].length} items</p>
                    </Card>

                    <Card className="p-6 border border-[#E6E8EE]">
                        <div className="flex items-start justify-between mb-2">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <Package className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Tổng Giá Trị Aging</p>
                        <p className="text-xl font-bold text-purple-600">{(totalValue / 1000000).toFixed(1)}M</p>
                    </Card>
                </div>

                <Card className="border border-[#E6E8EE]">
                    <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">Chi Tiết Hàng Tồn Lâu</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Mã PT</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Tên phụ tùng</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Danh mục</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">SL</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Tuổi tồn</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Giá trị</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.sort((a, b) => b.daysInStock - a.daysInStock).map((item, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-mono text-sm font-semibold text-gray-900">{item.partCode}</td>
                                        <td className="py-3 px-4 text-sm text-gray-900">{item.partName}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{item.category}</td>
                                        <td className="py-3 px-4 text-center font-semibold text-gray-900">{item.qty}</td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${item.daysInStock > 90 ? 'bg-red-100 text-red-700' :
                                                item.daysInStock > 60 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {item.daysInStock} ngày
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right font-semibold text-gray-900">{formatCurrency(item.totalValue)}</td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(item.action)}`}>
                                                {item.action}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card className="mt-6 border-l-4 border-yellow-500 bg-yellow-50">
                    <div className="p-6">
                        <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Khuyến Nghị Hành Động
                        </h3>
                        <div className="space-y-2 text-sm text-yellow-800">
                            <p>• <strong>Promotion:</strong> Giảm giá 20-30% cho hàng tồn 61-90 ngày</p>
                            <p>• <strong>Return:</strong> Trả lại nhà cung cấp nếu còn trong thời hạn bảo hành</p>
                            <p>• <strong>Liquidation:</strong> Thanh lý với giá vốn hoặc dưới giá vốn cho hàng &gt;90 ngày</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
