'use client';

import { useState } from 'react';
import { CheckCircle, Package, Printer, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PickItem {
    id: string;
    partCode: string;
    partName: string;
    location: string;
    qtyOrdered: number;
    qtyPicked: number;
    picked: boolean;
}

export default function PickingPacking() {
    const [orderId] = useState('WO-2026-0123');
    const [customer] = useState('Nguyễn Văn Minh');
    const [items, setItems] = useState<PickItem[]>([
        { id: '1', partCode: '15400-RTA-003', partName: 'Lọc dầu động cơ', location: 'KHO-A-01-02', qtyOrdered: 2, qtyPicked: 0, picked: false },
        { id: '2', partCode: '17220-RTA-000', partName: 'Lọc gió động cơ', location: 'KHO-A-01-05', qtyOrdered: 1, qtyPicked: 0, picked: false },
        { id: '3', partCode: '0W20-SN-4L', partName: 'Dầu động cơ 0W-20 (4L)', location: 'KHO-B-02-01', qtyOrdered: 4, qtyPicked: 0, picked: false },
    ]);

    const handlePick = (id: string, qty: number) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, qtyPicked: qty, picked: qty === item.qtyOrdered } : item
        ));
    };

    const allPicked = items.every(item => item.picked);
    const pickedCount = items.filter(item => item.picked).length;

    // Group by location
    const groupedByLocation = items.reduce((acc, item) => {
        if (!acc[item.location]) {
            acc[item.location] = [];
        }
        acc[item.location].push(item);
        return acc;
    }, {} as Record<string, PickItem[]>);

    return (
        <div className="min-h-screen bg-[#F6F7F9]">
            <header className="bg-white border-b border-[#E6E8EE] px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>Phụ Tùng</span>
                            <span>/</span>
                            <span>Picking & Packing</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Lấy Hàng & Đóng Gói - {orderId}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline">
                            <Printer className="w-4 h-4 mr-2" />
                            In Pick List
                        </Button>
                        <Button className="bg-[#E60012] hover:bg-[#c50010]" disabled={!allPicked}>
                            <Package className="w-4 h-4 mr-2" />
                            Hoàn Tất & Sẵn Sàng Giao
                        </Button>
                    </div>
                </div>
            </header>

            <div className="p-6">
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        {/* Order Info */}
                        <Card className="border border-[#E6E8EE]">
                            <div className="p-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Đơn hàng</p>
                                        <p className="text-base font-semibold text-gray-900">{orderId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Khách hàng</p>
                                        <p className="text-base font-semibold text-gray-900">{customer}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Tiến độ</p>
                                        <p className="text-base font-semibold text-blue-600">{pickedCount}/{items.length} items</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Picking List - Grouped by Location */}
                        <Card className="border border-[#E6E8EE]">
                            <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                                <h2 className="text-lg font-semibold text-gray-900">Pick List - Theo Vị Trí Kho</h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {Object.entries(groupedByLocation).map(([location, locationItems]) => (
                                    <div key={location} className="p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <MapPin className="w-5 h-5 text-blue-600" />
                                            <h3 className="text-base font-bold text-gray-900">{location}</h3>
                                            <span className="ml-auto text-sm text-gray-600">
                                                {locationItems.filter(i => i.picked).length}/{locationItems.length} picked
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            {locationItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className={`p-4 border-2 rounded-lg transition-all ${item.picked
                                                        ? 'border-green-300 bg-green-50'
                                                        : 'border-gray-300 bg-white hover:border-blue-300'
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={item.picked}
                                                                    onChange={(e) => handlePick(item.id, e.target.checked ? item.qtyOrdered : 0)}
                                                                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                                                                />
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-900">{item.partName}</p>
                                                                    <p className="text-xs text-gray-600 font-mono">{item.partCode}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-6 ml-8 text-sm">
                                                                <div>
                                                                    <span className="text-gray-600">Yêu cầu: </span>
                                                                    <span className="font-bold text-gray-900">{item.qtyOrdered}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <label className="text-gray-600">Đã lấy:</label>
                                                                    <input
                                                                        type="number"
                                                                        value={item.qtyPicked}
                                                                        onChange={(e) => handlePick(item.id, parseInt(e.target.value) || 0)}
                                                                        max={item.qtyOrdered}
                                                                        min="0"
                                                                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center font-bold"
                                                                    />
                                                                </div>
                                                                {item.picked && (
                                                                    <span className="flex items-center gap-1 text-green-600 font-semibold">
                                                                        <CheckCircle className="w-4 h-4" />
                                                                        Hoàn tất
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="col-span-1 space-y-6">
                        {/* Progress */}
                        <Card className="border border-[#E6E8EE]">
                            <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                                <h3 className="font-semibold text-gray-900">Tiến Độ Picking</h3>
                            </div>
                            <div className="p-6">
                                <div className="text-center mb-4">
                                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-3">
                                        <div>
                                            <p className="text-3xl font-bold text-blue-600">{pickedCount}</p>
                                            <p className="text-xs text-blue-600">/ {items.length}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">items đã lấy</p>
                                </div>
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-500"
                                        style={{ width: `${(pickedCount / items.length) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-gray-600 mt-1">
                                    <span>0%</span>
                                    <span>{((pickedCount / items.length) * 100).toFixed(0)}%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                        </Card>

                        {/* Packing Slip Preview */}
                        <Card className="border border-[#E6E8EE]">
                            <div className="px-6 py-4 border-b border-[#E6E8EE] bg-gray-50">
                                <h3 className="font-semibold text-gray-900">Packing Slip</h3>
                            </div>
                            <div className="p-6">
                                <div className="bg-white border border-gray-300 rounded p-4 text-sm">
                                    <div className="border-b pb-2 mb-3">
                                        <p className="font-bold text-gray-900">HONDA PACKING SLIP</p>
                                        <p className="text-xs text-gray-600">Order: {orderId}</p>
                                    </div>
                                    <div className="mb-3">
                                        <p className="text-xs text-gray-600">Khách hàng:</p>
                                        <p className="font-semibold text-gray-900">{customer}</p>
                                    </div>
                                    <div className="border-t pt-2">
                                        <p className="text-xs text-gray-600 mb-2">Nội dung:</p>
                                        {items.filter(i => i.picked).map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-700">{item.partName}</span>
                                                <span className="font-semibold">x{item.qtyPicked}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full mt-3" size="sm" disabled={!allPicked}>
                                    <Printer className="w-4 h-4 mr-2" />
                                    In Packing Slip
                                </Button>
                            </div>
                        </Card>

                        {/* Status */}
                        {allPicked && (
                            <Card className="border-2 border-green-500 bg-green-50">
                                <div className="p-4 text-center">
                                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                                    <p className="font-bold text-green-900">Sẵn sàng giao hàng!</p>
                                    <p className="text-sm text-green-700 mt-1">Tất cả items đã được lấy đầy đủ</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
