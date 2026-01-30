"use client";

import { useState, useEffect } from "react";
import { ServiceDataService, RepairOrder } from "@/services/service-data-service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, XCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export default function QualityControl() {
    const [pendingQC, setPendingQC] = useState<RepairOrder[]>([]);

    useEffect(() => {
        const ros = ServiceDataService.getROs();
        setPendingQC(ros.filter(r => r.status === 'QC_PENDING'));
    }, []);

    const handleQC = (ro: RepairOrder, result: 'PASS' | 'FAIL') => {
        if (result === 'PASS') {
            ServiceDataService.updateROStatus(ro.roNumber, 'WASHING'); // Or READY
            toast.success(`RO ${ro.roNumber} đã ĐẠT kiểm tra chất lượng!`);
        } else {
            ServiceDataService.updateROStatus(ro.roNumber, 'IN_PROGRESS'); // Return to Tech
            toast.error(`RO ${ro.roNumber} KHÔNG ĐẠT. Đã trả về kỹ thuật viên.`);
        }
        // Refresh
        setPendingQC(ServiceDataService.getROs().filter(r => r.status === 'QC_PENDING'));
    };

    return (
        <div className="p-6 bg-gray-50 h-full">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Kiểm Tra Chất Lượng (QC)</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingQC.length === 0 ? (
                    <div className="col-span-3 text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                        <CheckSquare className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                        <h3 className="text-lg font-medium text-gray-500">Không có xe chờ QC</h3>
                    </div>
                ) : pendingQC.map(ro => (
                    <Card key={ro.roNumber} className="p-6 border-t-4 border-t-orange-500">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg font-mono">{ro.roNumber}</h3>
                                <p className="text-sm font-semibold">{ro.plateNumber}</p>
                            </div>
                            <Badge variant="outline" className="bg-orange-50 text-orange-700">Chờ QC</Badge>
                        </div>
                        <div className="bg-gray-50 p-3 rounded mb-4 text-sm">
                            <p><span className="text-gray-500">Xe:</span> {ro.vehicleModel}</p>
                            <p><span className="text-gray-500">KTV:</span> {ro.technician}</p>
                            <p><span className="text-gray-500">Khách:</span> {ro.customerName}</p>
                        </div>

                        <div className="space-y-2 mb-4">
                            <label className="text-xs font-semibold uppercase text-gray-500">Ghi chú QC</label>
                            <Textarea placeholder="Nhập ghi chú kiểm tra..." className="h-20 text-sm" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleQC(ro, 'FAIL')}>
                                <XCircle className="w-4 h-4 mr-2" /> KHÔNG ĐẠT
                            </Button>
                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleQC(ro, 'PASS')}>
                                <CheckCircle className="w-4 h-4 mr-2" /> ĐẠT 100%
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
