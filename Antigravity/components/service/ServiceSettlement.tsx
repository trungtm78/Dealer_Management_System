"use client";

import { useState, useEffect } from "react";
import { ServiceDataService, RepairOrder } from "@/services/service-data-service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Printer, Search, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ServiceSettlement() {
    const [ros, setRos] = useState<RepairOrder[]>([]);
    const [filter, setFilter] = useState("");
    const [selectedRO, setSelectedRO] = useState<RepairOrder | null>(null);

    useEffect(() => {
        // Show READY or WASHING or DELIVERED
        setRos(ServiceDataService.getROs().filter(r => ['READY', 'WASHING', 'DELIVERED', 'QC_PENDING'].includes(r.status)));
    }, []);

    const handlePayment = () => {
        if (!selectedRO) return;

        // Mock Payment
        ServiceDataService.updateROStatus(selectedRO.roNumber, 'DELIVERED');
        // Update local object manually for UI
        const updated = { ...selectedRO, status: 'DELIVERED' as const, paymentStatus: 'PAID' as const };
        setSelectedRO(updated);

        // Refresh List
        setRos(prev => prev.map(r => r.roNumber === updated.roNumber ? updated : r));

        toast.success(`Thanh toán thành công ${updated.totalAmount.toLocaleString()}đ!`);
        toast.info("Đã in Gate Pass cho khách hàng.");
    };

    return (
        <div className="p-6 h-full bg-gray-50/50 flex flex-col lg:flex-row gap-6">
            {/* List */}
            <div className="w-full lg:w-1/3 bg-white rounded-xl shadow border border-gray-100 p-4 h-[calc(100vh-100px)] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Danh Sách Chờ Thu</h2>
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input className="pl-9" placeholder="Tìm biển số, khách hàng..." value={filter} onChange={e => setFilter(e.target.value)} />
                </div>

                <div className="space-y-3">
                    {ros.filter(r => r.plateNumber.includes(filter) || r.customerName.toLowerCase().includes(filter.toLowerCase())).map(ro => (
                        <div
                            key={ro.roNumber}
                            onClick={() => setSelectedRO(ro)}
                            className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedRO?.roNumber === ro.roNumber ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-gray-800">{ro.plateNumber}</span>
                                <Badge variant={ro.status === 'DELIVERED' ? 'secondary' : 'default'} className={ro.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : ''}>
                                    {ro.status === 'DELIVERED' ? 'Đã Giao' : ro.status}
                                </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{ro.customerName}</div>
                            <div className="mt-2 font-mono text-red-600 font-bold text-right">{ro.totalAmount.toLocaleString()} đ</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail */}
            <div className="w-full lg:w-2/3">
                {selectedRO ? (
                    <Card className="p-8 h-full shadow-lg border-t-4 border-t-red-600 flex flex-col">
                        <div className="border-b pb-6 mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">QUYẾT TOÁN DỊCH VỤ</h1>
                                    <p className="text-gray-500 mt-1">Số phiếu: {selectedRO.roNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Ngày: {new Date().toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="font-bold text-gray-700 border-b pb-2 mb-3">Khách Hàng</h3>
                                <p className="font-semibold">{selectedRO.customerName}</p>
                                <p>{selectedRO.phone}</p>
                                <p className="text-gray-500">{selectedRO.plateNumber} - {selectedRO.vehicleModel}</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-700 border-b pb-2 mb-3">Chi Phí</h3>
                                <div className="flex justify-between py-1 border-b border-dashed">
                                    <span>Công thợ (Labor)</span>
                                    <span>{selectedRO.services.reduce((s, i) => s + i.laborCost, 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-dashed">
                                    <span>Phụ tùng (Parts)</span>
                                    <span>{selectedRO.parts.reduce((s, i) => s + (i.unitPrice * i.quantity), 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-1 text-red-600 font-bold text-xl mt-2">
                                    <span>TỔNG CỘNG</span>
                                    <span>{selectedRO.totalAmount.toLocaleString()} đ</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-6 border-t flex justify-end gap-4">
                            <Button variant="outline" size="lg">
                                <Printer className="w-5 h-5 mr-2" /> In Hóa Đơn
                            </Button>
                            <Button
                                size="lg"
                                className={`min-w-[200px] ${selectedRO.status === 'DELIVERED' ? 'bg-green-600 hover:bg-green-700' : 'bg-[#E60012] hover:bg-[#c50010]'}`}
                                onClick={handlePayment}
                                disabled={selectedRO.status === 'DELIVERED'}
                            >
                                {selectedRO.status === 'DELIVERED' ? (
                                    <><CheckCircle className="w-5 h-5 mr-2" /> ĐÃ THANH TOÁN</>
                                ) : (
                                    <><CreditCard className="w-5 h-5 mr-2" /> THANH TOÁN & GIAO XE</>
                                )}
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 bg-white rounded-xl border border-dashed">
                        <div className="text-center">
                            <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p>Chọn phiếu để thanh toán</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
