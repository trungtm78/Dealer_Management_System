"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const ANALYSIS_DATA = [
    { name: "Tháng 8", budget: 4000000000, actual: 3800000000, profit: 500000000 },
    { name: "Tháng 9", budget: 4000000000, actual: 4200000000, profit: 300000000 },
    { name: "Tháng 10", budget: 4200000000, actual: 4100000000, profit: 600000000 },
    { name: "Tháng 11", budget: 4500000000, actual: 4800000000, profit: 450000000 },
    { name: "Tháng 12", budget: 5000000000, actual: 4900000000, profit: 800000000 },
    { name: "Tháng 1", budget: 4800000000, actual: 4600000000, profit: 700000000 },
];

const CATEGORY_DATA = [
    { name: "Lương & Nhân sự", value: 1500000000 },
    { name: "CSVC & Hạ tầng", value: 800000000 },
    { name: "Marketing", value: 600000000 },
    { name: "Vận hành", value: 1700000000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function CostAnalysis() {
    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Chi Phí Thực Tế (YTD)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(26400000000)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Ngân Sách (Budget)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(26500000000)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Chênh Lệch</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">- {formatCurrency(100000000)}</div>
                        <p className="text-xs text-muted-foreground">Dưới ngân sách (Tốt)</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Lợi Nhuận Ròng (YTD)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{formatCurrency(3350000000)}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Main Chart: Budget vs Actual */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Phân Tích Chi Phí: Ngân Sách vs Thực Tế</CardTitle>
                        <CardDescription>So sánh chi phí thực tế với ngân sách đã lập theo tháng.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={ANALYSIS_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value / 1000000000}B`}
                                />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="budget" name="Ngân sách" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="actual" name="Thực tế" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pie Chart: Cost Breakdown */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Cơ Cấu Chi Phí</CardTitle>
                        <CardDescription>Tỷ trọng các loại chi phí trong tháng hiện tại.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={CATEGORY_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {CATEGORY_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Line Chart: Profit Trend */}
            <Card>
                <CardHeader>
                    <CardTitle>Xu Hướng Lợi Nhuận</CardTitle>
                    <CardDescription>Biến động lợi nhuận ròng qua các tháng.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={ANALYSIS_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value / 1000000000}B`}
                            />
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend />
                            <Line type="monotone" dataKey="profit" name="Lợi nhuận" stroke="#ff7300" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
