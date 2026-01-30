
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Activity, Wallet } from "lucide-react";

import { formatCurrency } from "@/lib/utils";

const monthlyData = [
    { name: "T1", revenue: 4000000000, expense: 2400000000, profit: 1600000000 },
    { name: "T2", revenue: 3000000000, expense: 1398000000, profit: 1602000000 },
    { name: "T3", revenue: 2000000000, expense: 9800000000, profit: -7800000000 },
    { name: "T4", revenue: 2780000000, expense: 3908000000, profit: -1128000000 },
    { name: "T5", revenue: 1890000000, expense: 4800000000, profit: -2910000000 },
    { name: "T6", revenue: 2390000000, expense: 3800000000, profit: -1410000000 },
    { name: "T7", revenue: 3490000000, expense: 4300000000, profit: -810000000 },
];

export default function FinancialDashboard() {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng Doanh Thu</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(4523189000)}</div>
                        <p className="text-xs text-muted-foreground">+20.1% so với tháng trước</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chi Phí Hoạt Động</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(2350000000)}</div>
                        <p className="text-xs text-muted-foreground">+4% so với tháng trước</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lợi Nhuận Ròng</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(1203000000)}</div>
                        <p className="text-xs text-muted-foreground text-green-500">+12% so với tháng trước</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dòng Tiền (Net)</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(573000000)}</div>
                        <p className="text-xs text-muted-foreground">+200 triệu so với đầu kỳ</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Biểu Đồ Doanh Thu & Lợi Nhuận</CardTitle>
                        <CardDescription>Phân tích hiệu quả kinh doanh 7 tháng gần nhất</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[350px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-md border border-dashed">
                            <p className="text-sm">Biểu đồ doanh thu (Module Recharts chưa được cài đặt)</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Cơ Cấu Chi Phí</CardTitle>
                        <CardDescription>Tỷ trọng các nhóm chi phí chính</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                            {/* Placeholder for Pie Chart if needed, or keeping it simple for now */}
                            <p className="text-sm">Biểu đồ cơ cấu chi phí (Đang cập nhật)</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
