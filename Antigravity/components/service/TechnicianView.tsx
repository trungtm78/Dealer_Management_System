"use client";

import { useState, useEffect } from "react";
import { ServiceDataService, RepairOrder } from "@/services/service-data-service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Play, CheckSquare, Coffee } from "lucide-react";
import { toast } from "sonner";

export default function TechnicianView() {
    const [myRO, setMyRO] = useState<RepairOrder | undefined>(undefined);
    // Mock logged in as Tech A
    const currentTechName = "Tech A";

    useEffect(() => {
        const ros = ServiceDataService.getROs();
        // Find RO assigned to me that is active
        const active = ros.find(r => r.technician?.includes(currentTechName) && (r.status === 'IN_PROGRESS' || r.status === 'ARRIVED'));
        setMyRO(active);
    }, []);

    const handleAction = (action: string) => {
        if (!myRO) return;
        if (action === 'start') {
            ServiceDataService.updateROStatus(myRO.roNumber, 'IN_PROGRESS');
            toast.success("Bắt đầu sửa chữa!");
        } else if (action === 'finish') {
            ServiceDataService.updateROStatus(myRO.roNumber, 'QC_PENDING');
            toast.success("Đã hoàn thành! Chuyển QC.");
        }
        // Refresh
        const ros = ServiceDataService.getROs();
        const active = ros.find(r => r.roNumber === myRO.roNumber);
        setMyRO(active);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Giao Diện Kỹ Thuật Viên ({currentTechName})</h1>

            {myRO ? (
                <Card className="p-6 border-t-4 border-t-blue-600 shadow-xl">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="text-sm text-gray-500">Lệnh Sửa Chữa</span>
                            <h2 className="text-3xl font-bold font-mono">{myRO.roNumber}</h2>
                        </div>
                        <Badge className="text-lg px-3 py-1">{myRO.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
                        <div>
                            <span className="block text-xs uppercase text-gray-500">Xe</span>
                            <span className="block font-semibold text-lg">{myRO.vehicleModel}</span>
                            <span className="block font-mono text-blue-600">{myRO.plateNumber}</span>
                        </div>
                        <div>
                            <span className="block text-xs uppercase text-gray-500">Cố vấn</span>
                            <span className="block font-semibold">{myRO.advisor}</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-bold mb-2 border-b pb-1">Nội dung công việc:</h3>
                        <ul className="space-y-2">
                            {myRO.services.map(s => (
                                <li key={s.id} className="flex items-center gap-2">
                                    <Wrench className="w-4 h-4 text-gray-400" /> {s.name}
                                </li>
                            ))}
                        </ul>
                        {myRO.notes && (
                            <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-sm rounded">
                                <strong>Lưu ý:</strong> {myRO.notes}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {myRO.status === 'ARRIVED' && (
                            <Button className="h-16 text-xl bg-blue-600 hover:bg-blue-700" onClick={() => handleAction('start')}>
                                <Play className="w-6 h-6 mr-2" /> BẮT ĐẦU CÔNG VIỆC
                            </Button>
                        )}
                        {myRO.status === 'IN_PROGRESS' && (
                            <Button className="h-16 text-xl bg-green-600 hover:bg-green-700" onClick={() => handleAction('finish')}>
                                <CheckSquare className="w-6 h-6 mr-2" /> HOÀN THÀNH
                            </Button>
                        )}
                    </div>
                </Card>
            ) : (
                <Card className="p-10 text-center text-gray-500">
                    <Coffee className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold">Hiện không có công việc nào</h3>
                    <p>Vui lòng chờ điều phối viên phân công.</p>
                </Card>
            )}
        </div>
    );
}
