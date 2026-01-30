"use client";

import { useState, useEffect } from "react";
import { ServiceDataService, Appointment } from "@/services/service-data-service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, ArrowRight, Printer } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ReceptionBoard() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        // Load TODAY's appointments or all pending
        setAppointments(ServiceDataService.getAppointments().filter(a => a.status === 'CONFIRMED'));
    }, []);

    const handleCheckIn = (apptId: string) => {
        const ro = ServiceDataService.createROFromAppointment(apptId);
        toast.success(`Đã tiếp nhận xe ${ro.plateNumber}! Tạo RO: ${ro.roNumber}`);
        // Refresh list
        setAppointments(ServiceDataService.getAppointments().filter(a => a.status === 'CONFIRMED'));
    };

    return (
        <div className="p-6 h-full bg-gray-50">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Tiếp Nhận Dịch Vụ (Check-in)</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appointments.length === 0 ? (
                    <p className="text-gray-500 col-span-3 text-center py-10">Không có lịch hẹn nào đang chờ tiếp nhận.</p>
                ) : appointments.map((appt) => (
                    <Card key={appt.id} className="p-4 border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-lg">{appt.customerName}</h3>
                                <p className="text-sm text-gray-500">{appt.phone}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">{appt.time}</div>
                                <div className="text-xs text-gray-400">{appt.date}</div>
                            </div>
                        </div>

                        <div className="bg-gray-100 p-3 rounded-lg mb-4 flex justify-between items-center">
                            <div>
                                <span className="block text-xs text-gray-500">Xe / Biển số</span>
                                <span className="font-mono font-bold text-gray-800">{appt.plateNumber}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs text-gray-500">Dòng xe</span>
                                <span className="text-sm font-semibold">{appt.vehicleModel}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" onClick={() => toast.info("In phiếu tiếp nhận...")}>
                                <Printer className="w-4 h-4 mr-2" /> In Phiếu
                            </Button>
                            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleCheckIn(appt.id)}>
                                <CheckCircle className="w-4 h-4 mr-2" /> Tạo RO
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
