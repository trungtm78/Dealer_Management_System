"use client";

import { useEffect, useState } from "react";
import { ServiceDataService } from "@/services/service-data-service";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Wrench, CheckCircle, DollarSign } from "lucide-react";

export default function ServiceDashboard() {
    const [stats, setStats] = useState({ todayAppts: 0, inProgress: 0, completed: 0, revenue: 0 });

    useEffect(() => {
        setStats(ServiceDataService.getStats());
    }, []);

    const data = [
        { name: 'Thứ 2', revenue: 4000000, ro: 10 },
        { name: 'Thứ 3', revenue: 3000000, ro: 8 },
        { name: 'Thứ 4', revenue: 5000000, ro: 12 },
        { name: 'Thứ 5', revenue: 2000000, ro: 5 },
        { name: 'Thứ 6', revenue: 6000000, ro: 15 },
        { name: 'Thứ 7', revenue: 8000000, ro: 20 },
        { name: 'CN', revenue: 9000000, ro: 25 },
    ];

    return (
        <div className="p-6 bg-gray-50/50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Dashboard Dịch Vụ</h1>

            {/* HEADCARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 border-l-4 border-l-blue-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Lịch hẹn hôm nay</p>
                        <p className="text-3xl font-bold text-blue-700">{stats.todayAppts}</p>
                    </div>
                    <Calendar className="w-10 h-10 text-blue-200" />
                </Card>
                <Card className="p-6 border-l-4 border-l-orange-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Xe đang sửa</p>
                        <p className="text-3xl font-bold text-orange-700">{stats.inProgress}</p>
                    </div>
                    <Wrench className="w-10 h-10 text-orange-200" />
                </Card>
                <Card className="p-6 border-l-4 border-l-green-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Xe hoàn thành</p>
                        <p className="text-3xl font-bold text-green-700">{stats.completed}</p>
                    </div>
                    <CheckCircle className="w-10 h-10 text-green-200" />
                </Card>
                <Card className="p-6 border-l-4 border-l-red-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Doanh thu tạm tính</p>
                        <p className="text-2xl font-bold text-red-700">{stats.revenue.toLocaleString()}đ</p>
                    </div>
                    <DollarSign className="w-10 h-10 text-red-200" />
                </Card>
            </div>

            {/* CHART */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="font-bold text-gray-700 mb-4">Doanh Thu Tuần</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => value.toLocaleString() + ' đ'} />
                                <Legend />
                                <Bar dataKey="revenue" name="Doanh Thu" fill="#E60012" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-bold text-gray-700 mb-4">Lượt Xe Vào Xưởng</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="ro" name="Lượt xe" fill="#4f46e5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}
