"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Activity, AlertTriangle, ArrowUpRight, DollarSign, Package, ShoppingCart, Users, Wrench } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// --- Mock Data ---

const KPI_DATA = [
    { label: "Doanh Thu Ngày", value: 350000000, trend: "+12.5%", icon: DollarSign, color: "text-green-600" },
    { label: "Lệnh Sửa Chữa (RO)", value: 42, trend: "+4", icon: Wrench, color: "text-blue-600" },
    { label: "Khách Hàng Mới", value: 18, trend: "+2", icon: Users, color: "text-purple-600" },
    { label: "Hàng Sắp Hết", value: 5, trend: "Cần nhập", icon: AlertTriangle, color: "text-orange-600" },
];

const REVENUE_DATA = [
    { name: "T2", sales: 120000000, service: 80000000 },
    { name: "T3", sales: 150000000, service: 90000000 },
    { name: "T4", sales: 180000000, service: 75000000 },
    { name: "T5", sales: 110000000, service: 95000000 },
    { name: "T6", sales: 210000000, service: 105000000 },
    { name: "T7", sales: 250000000, service: 120000000 },
    { name: "CN", sales: 190000000, service: 60000000 },
];

const MIX_DATA = [
    { name: "Xe Mới", value: 65 },
    { name: "Dịch Vụ", value: 25 },
    { name: "Phụ Tùng", value: 10 },
];

const COLORS = ['#E60012', '#007ACC', '#FFBB28'];

const RECENT_ACTIVITY = [
    { id: 1, user: "Nguyễn Văn A", action: "Tạo báo giá #BG-2024-001", time: "10 phút trước", type: "sales" },
    { id: 2, user: "Trần Thị B", action: "Hoàn tất RO #RO-9982", time: "25 phút trước", type: "service" },
    { id: 3, user: "Lê Văn C", action: "Nhập kho lô hàng PT-005", time: "40 phút trước", type: "inventory" },
    { id: 4, user: "Phạm D", action: "Thêm Lead mới: Honda CR-V", time: "1 giờ trước", type: "crm" },
];

export default function OperationalDashboard() {
    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {KPI_DATA.map((kpi, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
                            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{typeof kpi.value === 'number' && kpi.value > 1000 ? formatCurrency(kpi.value) : kpi.value}</div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                {kpi.trend.startsWith('+') ? <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" /> : null}
                                {kpi.trend} {kpi.trend.includes('%') ? 'so với hôm qua' : ''}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                {/* Main Chart: Revenue Trend */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Xu Hướng Doanh Thu (7 Ngày)</CardTitle>
                        <CardDescription>Doanh thu Bán hàng vs Dịch vụ</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={REVENUE_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value / 1000000}M`}
                                />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="sales" name="Bán Xe" fill="#E60012" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="service" name="Dịch Vụ" fill="#007ACC" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Right Column: Mix & Activity */}
                <div className="col-span-3 space-y-4">
                    {/* Mix Pie Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cơ Cấu Doanh Thu</CardTitle>
                            <CardDescription>Tỷ trọng nguồn thu tháng này</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={MIX_DATA}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {MIX_DATA.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Hoạt Động Gần Đây</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {RECENT_ACTIVITY.map((act) => (
                                    <div key={act.id} className="flex items-start pb-4 border-b last:border-0 last:pb-0">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{act.action}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {act.user} - {act.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
