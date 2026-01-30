'use client';

import { useState } from 'react';
import { Save, Plus, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ReturnItem {
    id: string;
    partCode: string;
    partName: string;
    quantity: number;
    reason: string;
    unitPrice: number;
}

export default function PartsReturnSupplier() {
    const [supplier, setSupplier] = useState('Honda Parts Vietnam');
    const [returnDate, setReturnDate] = useState('2026-01-06');
    const [status, setStatus] = useState<'draft' | 'sent' | 'completed'>('draft');
    const [items, setItems] = useState<ReturnItem[]>([
        { id: '1', partCode: '15400-RTA-003', partName: 'Lọc dầu động cơ', quantity: 5, reason: 'Lỗi sản xuất', unitPrice: 85000 },
        { id: '2', partCode: '17220-RTA-000', partName: 'Lọc gió động cơ', quantity: 3, reason: 'Hàng sai quy cách', unitPrice: 145000 },
    ]);

    const addItem = () => {
        setItems([...items, { id: Date.now().toString(), partCode: '', partName: '', quantity: 1, reason: '', unitPrice: 0 }]);
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id: string, field: string, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft': return 'bg-gray-100 text-gray-700 border-gray-300';
            case 'sent': return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'completed': return 'bg-green-100 text-green-700 border-green-300';
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
                            <span>Trả Hàng Nhà Cung Cấp</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Phiếu Trả Hàng Nhà Cung Cấp</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(status)}`}>
                            {status === 'draft' ? 'Nháp' : status === 'sent' ? 'Đã gửi' : 'Hoàn thành'}
                        </span>
                        <Button variant="outline">Hủy</Button>
                        <Button className="bg-[#E60012] hover:bg-[#c50010]">
                            <Save className="w-4 h-4 mr-2" />
                            {status === 'draft' ? 'Lưu & Gửi NCC' : 'Lưu'}
                        </Button>
                    </div>
                </div>
            </header>

            <div className="p-6">
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        {/* Supplier Info */}
                        <Card className="border border-[#E6E8EE]">
                            <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                                <h2 className="text-lg font-semibold text-gray-900">Thông Tin Nhà Cung Cấp</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nhà cung cấp *</label>
                                        <select
                                            value={supplier}
                                            onChange={(e) => setSupplier(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                                        >
                                            <option>Honda Parts Vietnam</option>
                                            <option>Honda Genuine Parts</option>
                                            <option>Honda OEM Supplier</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Ngày trả hàng</label>
                                        <input
                                            type="date"
                                            value={returnDate}
                                            onChange={(e) => setReturnDate(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Return Items */}
                        <Card className="border border-[#E6E8EE]">
                            <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Danh Sách Phụ Tùng Trả</h2>
                                <Button size="sm" onClick={addItem}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Thêm phụ tùng
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase w-32">Mã PT</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Tên phụ tùng</th>
                                            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase w-24">SL</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Lý do trả</th>
                                            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase w-32">Đơn giá</th>
                                            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase w-32">Thành tiền</th>
                                            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item) => (
                                            <tr key={item.id} className="border-b border-gray-100">
                                                <td className="py-3 px-4">
                                                    <input
                                                        type="text"
                                                        value={item.partCode}
                                                        onChange={(e) => updateItem(item.id, 'partCode', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded font-mono"
                                                        placeholder="Mã PT"
                                                    />
                                                </td>
                                                <td className="py-3 px-4">
                                                    <input
                                                        type="text"
                                                        value={item.partName}
                                                        onChange={(e) => updateItem(item.id, 'partName', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                                        placeholder="Tên phụ tùng"
                                                    />
                                                </td>
                                                <td className="py-3 px-4">
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                        className="w-full px-2 py-1 text-sm text-center border border-gray-300 rounded font-semibold"
                                                        min="1"
                                                    />
                                                </td>
                                                <td className="py-3 px-4">
                                                    <select
                                                        value={item.reason}
                                                        onChange={(e) => updateItem(item.id, 'reason', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                                    >
                                                        <option value="">Chọn lý do</option>
                                                        <option value="Lỗi sản xuất">Lỗi sản xuất</option>
                                                        <option value="Hàng sai quy cách">Hàng sai quy cách</option>
                                                        <option value="Giao sai hàng">Giao sai hàng</option>
                                                        <option value="Hư hỏng trong vận chuyển">Hư hỏng trong vận chuyển</option>
                                                        <option value="Khác">Khác</option>
                                                    </select>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <input
                                                        type="number"
                                                        value={item.unitPrice}
                                                        onChange={(e) => updateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                                                        className="w-full px-2 py-1 text-sm text-right border border-gray-300 rounded"
                                                    />
                                                </td>
                                                <td className="py-3 px-4 text-right font-semibold text-sm text-gray-900">
                                                    {formatCurrency(item.quantity * item.unitPrice)}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-1 hover:bg-red-50 rounded"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-gray-50 border-t-2 border-gray-300">
                                            <td colSpan={2} className="py-3 px-4 text-right font-semibold text-gray-900">TỔNG CỘNG:</td>
                                            <td className="py-3 px-4 text-center font-bold text-gray-900">{totalQty}</td>
                                            <td colSpan={2}></td>
                                            <td className="py-3 px-4 text-right text-lg font-bold text-[#E60012]">{formatCurrency(totalAmount)}</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </Card>

                        {/* Notes */}
                        <Card className="border border-[#E6E8EE]">
                            <div className="p-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                                    placeholder="Ghi chú thêm về phiếu trả hàng..."
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="col-span-1 space-y-6">
                        <Card className="border border-[#E6E8EE]">
                            <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                                <h3 className="font-semibold text-gray-900">Tóm Tắt</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Tổng số lượng:</span>
                                    <span className="text-sm font-bold text-gray-900">{totalQty}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Số loại PT:</span>
                                    <span className="text-sm font-bold text-gray-900">{items.length}</span>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">Tổng giá trị:</span>
                                        <span className="text-lg font-bold text-[#E60012]">{formatCurrency(totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="border border-[#E6E8EE]">
                            <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                                <h3 className="font-semibold text-gray-900">Trạng Thái Xử Lý</h3>
                            </div>
                            <div className="p-6">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className={`w-full px-4 py-2 border-2 rounded-lg font-semibold ${getStatusColor(status)}`}
                                >
                                    <option value="draft">Nháp</option>
                                    <option value="sent">Đã gửi NCC</option>
                                    <option value="completed">Hoàn thành</option>
                                </select>
                                <div className="mt-4 space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                                        <span className="text-gray-600">Tạo phiếu</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${status !== 'draft' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                                        <span className="text-gray-600">Gửi NCC</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                        <span className="text-gray-600">NCC xác nhận</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="border border-blue-200 bg-blue-50">
                            <div className="p-4">
                                <h3 className="font-semibold text-blue-900 mb-2">Lưu Ý</h3>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Kiểm tra kỹ lý do trả hàng</li>
                                    <li>• Chụp ảnh phụ tùng lỗi</li>
                                    <li>• Đóng gói cẩn thận</li>
                                    <li>• Lưu phiếu trả hàng</li>
                                </ul>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
