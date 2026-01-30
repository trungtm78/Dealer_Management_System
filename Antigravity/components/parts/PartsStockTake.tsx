'use client';

import { useState } from 'react';
import { Search, Download, Save, CheckCircle, AlertTriangle, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StockTakeItem {
    partNumber: string;
    partName: string;
    location: string;
    systemQty: number;
    countedQty: number | null;
    variance: number;
    value: number;
    counted: boolean;
}

export default function PartsStockTake() {
    const [sessionInfo] = useState({
        sessionNumber: 'COUNT/2026/0001',
        date: '15/01/2026',
        location: 'Kho A - Tầng 1',
        status: 'in-progress',
        responsible: 'Nguyễn Văn Phụ Tùng',
        startTime: '08:00',
    });

    const [items, setItems] = useState<StockTakeItem[]>([
        {
            partNumber: '15400-RTA-003',
            partName: 'Lọc dầu động cơ',
            location: 'A-01-15',
            systemQty: 45,
            countedQty: 43,
            variance: -2,
            value: 180000,
            counted: true,
        },
        {
            partNumber: '17220-RTA-000',
            partName: 'Lọc gió động cơ',
            location: 'A-01-16',
            systemQty: 32,
            countedQty: 32,
            variance: 0,
            value: 250000,
            counted: true,
        },
        {
            partNumber: '80292-SDA-A01',
            partName: 'Lọc gió điều hòa',
            location: 'A-01-17',
            systemQty: 28,
            countedQty: null,
            variance: 0,
            value: 320000,
            counted: false,
        },
        {
            partNumber: '04465-0E010-91',
            partName: 'Má phanh trước',
            location: 'A-02-03',
            systemQty: 15,
            countedQty: 16,
            variance: 1,
            value: 1250000,
            counted: true,
        },
        {
            partNumber: '04466-0E010',
            partName: 'Má phanh sau',
            location: 'A-02-04',
            systemQty: 12,
            countedQty: null,
            variance: 0,
            value: 980000,
            counted: false,
        },
        {
            partNumber: '45251-TF0-G01',
            partName: 'Giảm xóc trước',
            location: 'A-03-01',
            systemQty: 8,
            countedQty: 7,
            variance: -1,
            value: 2850000,
            counted: true,
        },
    ]);

    const totalItems = items.length;
    const countedItems = items.filter(i => i.counted).length;
    const itemsWithVariance = items.filter(i => i.counted && i.variance !== 0).length;
    const completionRate = Math.round((countedItems / totalItems) * 100);
    const totalVarianceValue = items
        .filter(i => i.counted)
        .reduce((sum, i) => sum + (i.variance * i.value), 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(amount);
    };

    const updateCount = (partNumber: string, count: number) => {
        setItems(prev => prev.map(item => {
            if (item.partNumber === partNumber) {
                const variance = count - item.systemQty;
                return {
                    ...item,
                    countedQty: count,
                    variance,
                    counted: true,
                };
            }
            return item;
        }));
    };

    return (
        <div className="min-h-screen bg-[#F6F7F9]">
            <header className="bg-white border-b border-[#E6E8EE] px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>Phụ Tùng</span>
                            <span>/</span>
                            <span>Kiểm Kê Thực Tế</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Physical Stock Take</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Xuất Báo Cáo
                        </Button>
                        <Button variant="outline">
                            <Save className="w-4 h-4 mr-2" />
                            Lưu Nháp
                        </Button>
                        <Button className="bg-[#E60012] hover:bg-[#c50010]">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Hoàn Tất Kiểm Kê
                        </Button>
                    </div>
                </div>
            </header>

            <div className="p-6">
                {/* Session Info */}
                <Card className="border border-[#E6E8EE] mb-6">
                    <div className="p-6">
                        <div className="grid grid-cols-6 gap-6">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Số phiên</p>
                                <p className="text-base font-mono font-bold text-blue-600">{sessionInfo.sessionNumber}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Ngày kiểm</p>
                                <p className="text-base font-semibold text-gray-900">{sessionInfo.date}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Kho</p>
                                <p className="text-base font-semibold text-gray-900">{sessionInfo.location}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Người chịu trách nhiệm</p>
                                <p className="text-base font-semibold text-gray-900">{sessionInfo.responsible}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                    Đang tiến hành
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Bắt đầu</p>
                                <p className="text-base font-semibold text-gray-900">{sessionInfo.startTime}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Progress Cards */}
                <div className="grid grid-cols-4 gap-6 mb-6">
                    <Card className="p-6 border-l-4 border-blue-500 bg-blue-50">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Tiến độ kiểm kê</p>
                                <p className="text-3xl font-bold text-blue-700">{completionRate}%</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                                <Package className="w-6 h-6 text-blue-700" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">{countedItems}/{totalItems} mặt hàng</p>
                    </Card>

                    <Card className="p-6 border-l-4 border-green-500 bg-green-50">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Khớp đúng</p>
                                <p className="text-3xl font-bold text-green-700">
                                    {countedItems - itemsWithVariance}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-700" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Không chênh lệch</p>
                    </Card>

                    <Card className="p-6 border-l-4 border-yellow-500 bg-yellow-50">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Có chênh lệch</p>
                                <p className="text-3xl font-bold text-yellow-700">{itemsWithVariance}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-yellow-700" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Cần xử lý</p>
                    </Card>

                    <Card className="p-6 border-l-4 border-purple-500 bg-purple-50">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Giá trị chênh lệch</p>
                                <p className={`text-xl font-bold ${totalVarianceValue < 0 ? 'text-red-700' : 'text-green-700'}`}>
                                    {formatCurrency(Math.abs(totalVarianceValue))}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
                                <span className="text-2xl">{totalVarianceValue < 0 ? '📉' : '📈'}</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">
                            {totalVarianceValue < 0 ? 'Thiếu hụt' : totalVarianceValue > 0 ? 'Thừa' : 'Cân bằng'}
                        </p>
                    </Card>
                </div>

                {/* Stock Take Table */}
                <Card className="border border-[#E6E8EE]">
                    <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Danh Sách Kiểm Kê</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm mã/tên phụ tùng..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E60012] w-80"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Mã phụ tùng</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Tên phụ tùng</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Vị trí</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Hệ thống</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Đếm thực tế</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Chênh lệch</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Giá trị CL</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.partNumber} className={`border-b border-gray-100 ${item.counted && item.variance !== 0 ? 'bg-yellow-50' : 'hover:bg-gray-50'
                                        }`}>
                                        <td className="py-3 px-4">
                                            <p className="text-sm font-mono font-semibold text-gray-900">{item.partNumber}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-gray-900">{item.partName}</p>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono">
                                                {item.location}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <p className="text-base font-semibold text-gray-900">{item.systemQty}</p>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {item.counted ? (
                                                <p className="text-base font-bold text-blue-600">{item.countedQty}</p>
                                            ) : (
                                                <input
                                                    type="number"
                                                    placeholder="Nhập SL"
                                                    className="w-20 px-2 py-1 border-2 border-blue-300 rounded text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    onChange={(e) => updateCount(item.partNumber, parseInt(e.target.value) || 0)}
                                                />
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {item.counted && (
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${item.variance === 0 ? 'bg-green-100 text-green-700' :
                                                    item.variance > 0 ? 'bg-blue-100 text-blue-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {item.variance > 0 ? '+' : ''}{item.variance}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            {item.counted && item.variance !== 0 && (
                                                <p className={`text-base font-bold ${item.variance < 0 ? 'text-red-600' : 'text-blue-600'
                                                    }`}>
                                                    {item.variance < 0 ? '-' : '+'}{formatCurrency(Math.abs(item.variance * item.value))}
                                                </p>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {item.counted ? (
                                                <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                                            ) : (
                                                <AlertTriangle className="w-5 h-5 text-yellow-600 mx-auto" />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Instructions */}
                <Card className="border border-[#E6E8EE] mt-6">
                    <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">📋 Quy Trình Kiểm Kê</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-4 gap-6">
                            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                <h3 className="font-semibold text-gray-900 mb-2">1. Chuẩn bị</h3>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>✓ Tạo phiên kiểm kê</li>
                                    <li>✓ Chọn kho & vị trí</li>
                                    <li>✓ Phân công người đếm</li>
                                    <li>✓ In danh sách</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <h3 className="font-semibold text-gray-900 mb-2">2. Thực hiện đếm</h3>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>✓ Đếm từng item</li>
                                    <li>✓ Nhập số lượng thực tế</li>
                                    <li>✓ Đối chiếu hệ thống</li>
                                    <li>✓ Ghi chú nếu có</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                                <h3 className="font-semibold text-gray-900 mb-2">3. Xử lý chênh lệch</h3>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>✓ Xác nhận chênh lệch</li>
                                    <li>✓ Tìm nguyên nhân</li>
                                    <li>✓ Đếm lại nếu cần</li>
                                    <li>✓ Tạo điều chỉnh</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                                <h3 className="font-semibold text-gray-900 mb-2">4. Hoàn tất</h3>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>✓ Duyệt kết quả</li>
                                    <li>✓ Cập nhật tồn kho</li>
                                    <li>✓ Xuất báo cáo</li>
                                    <li>✓ Lưu trữ</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
