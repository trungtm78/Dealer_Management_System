'use client';

import { useState } from 'react';
import { Save, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PriceItem {
    id: string;
    category: string;
    partCode: string;
    partName: string;
    currentPrice: number;
    newPrice: number;
    margin: number;
    effectiveDate: string;
    status: 'pending' | 'approved';
}

export default function PartsPricing() {
    const [items, setItems] = useState<PriceItem[]>([
        { id: '1', category: 'Lọc', partCode: '15400-RTA-003', partName: 'Lọc dầu động cơ', currentPrice: 85000, newPrice: 90000, margin: 25, effectiveDate: '2026-02-01', status: 'pending' },
        { id: '2', category: 'Lọc', partCode: '17220-RTA-000', partName: 'Lọc gió động cơ', currentPrice: 145000, newPrice: 155000, margin: 28, effectiveDate: '2026-02-01', status: 'pending' },
        { id: '3', category: 'Dầu nhớt', partCode: '0W20-SN-4L', partName: 'Dầu động cơ 0W-20', currentPrice: 520000, newPrice: 550000, margin: 22, effectiveDate: '2026-02-01', status: 'pending' },
    ]);

    const updatePrice = (id: string, newPrice: number) => {
        setItems(items.map(item => item.id === id ? { ...item, newPrice } : item));
    };

    const updateMargin = (id: string, margin: number) => {
        setItems(items.map(item => item.id === id ? { ...item, margin } : item));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(amount);
    };

    const calculateChange = (current: number, newPrice: number) => {
        return ((newPrice - current) / current * 100).toFixed(1);
    };

    const categories = Array.from(new Set(items.map(item => item.category)));

    return (
        <div className="min-h-screen bg-[#F6F7F9]">
            <header className="bg-white border-b border-[#E6E8EE] px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>Phụ Tùng</span>
                            <span>/</span>
                            <span>Quản Lý Giá</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Giá Bán Phụ Tùng</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline">Hủy Thay Đổi</Button>
                        <Button className="bg-[#E60012] hover:bg-[#c50010]">
                            <Save className="w-4 h-4 mr-2" />
                            Lưu & Gửi Duyệt
                        </Button>
                    </div>
                </div>
            </header>

            <div className="p-6">
                <div className="grid grid-cols-3 gap-6 mb-6">
                    <Card className="p-6 border border-[#E6E8EE]">
                        <p className="text-sm text-gray-600 mb-1">Tổng items điều chỉnh</p>
                        <p className="text-3xl font-bold text-gray-900">{items.length}</p>
                    </Card>
                    <Card className="p-6 border border-[#E6E8EE]">
                        <p className="text-sm text-gray-600 mb-1">Hiệu lực từ</p>
                        <p className="text-xl font-bold text-blue-600">01/02/2026</p>
                    </Card>
                    <Card className="p-6 border border-[#E6E8EE]">
                        <p className="text-sm text-gray-600 mb-1">Margin trung bình</p>
                        <p className="text-3xl font-bold text-green-600">
                            {(items.reduce((sum, i) => sum + i.margin, 0) / items.length).toFixed(1)}%
                        </p>
                    </Card>
                </div>

                {categories.map(category => (
                    <Card key={category} className="border border-[#E6E8EE] mb-6">
                        <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                            <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Mã PT</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Tên phụ tùng</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Giá hiện tại</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Giá mới</th>
                                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Thay đổi</th>
                                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Margin %</th>
                                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Hiệu lực</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.filter(item => item.category === category).map((item) => {
                                        const change = parseFloat(calculateChange(item.currentPrice, item.newPrice));
                                        return (
                                            <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50">
                                                <td className="py-3 px-4 font-mono text-sm font-semibold text-gray-900">{item.partCode}</td>
                                                <td className="py-3 px-4 text-sm text-gray-900">{item.partName}</td>
                                                <td className="py-3 px-4 text-right text-sm text-gray-600">{formatCurrency(item.currentPrice)}</td>
                                                <td className="py-3 px-4">
                                                    <input
                                                        type="number"
                                                        value={item.newPrice}
                                                        onChange={(e) => updatePrice(item.id, parseInt(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 text-right font-semibold border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                                                    />
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${change > 0 ? 'bg-green-100 text-green-700' :
                                                        change < 0 ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {change > 0 ? '+' : ''}{change}%
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <input
                                                        type="number"
                                                        value={item.margin}
                                                        onChange={(e) => updateMargin(item.id, parseInt(e.target.value) || 0)}
                                                        className="w-20 px-2 py-1 text-center font-semibold border border-gray-300 rounded"
                                                        min="0"
                                                        max="100"
                                                    />
                                                </td>
                                                <td className="py-3 px-4 text-center text-sm text-gray-700">{item.effectiveDate}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                ))}

                {/* Comparison Chart */}
                <Card className="border border-[#E6E8EE]">
                    <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">So Sánh Giá Cũ vs Mới</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">{item.partName}</span>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-gray-600">{formatCurrency(item.currentPrice)}</span>
                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                            <span className="font-semibold text-blue-600">{formatCurrency(item.newPrice)}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1 h-8 bg-gray-200 rounded-lg overflow-hidden">
                                            <div
                                                className="h-full bg-gray-400 flex items-center justify-center text-white text-xs font-semibold"
                                                style={{ width: '100%' }}
                                            >
                                                {formatCurrency(item.currentPrice)}
                                            </div>
                                        </div>
                                        <div className="flex-1 h-8 bg-gray-200 rounded-lg overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold"
                                                style={{ width: `${(item.newPrice / Math.max(item.currentPrice, item.newPrice)) * 100}%` }}
                                            >
                                                {formatCurrency(item.newPrice)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
