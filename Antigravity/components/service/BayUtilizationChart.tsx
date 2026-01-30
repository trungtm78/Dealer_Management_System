"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from "recharts";
import { BayKPIs } from "@/lib/types/service_bay";

interface BayUtilizationChartProps {
    data: BayKPIs;
}

export default function BayUtilizationChart({ data }: BayUtilizationChartProps) {
    const pieData = [
        { name: 'Đang hoạt động', value: data.working_bays, color: '#E60012' },
        { name: 'Đang trống', value: data.idle_bays, color: '#E5E7EB' },
    ];

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="text-lg">Biểu đồ hiệu suất sử dụng khoang</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
