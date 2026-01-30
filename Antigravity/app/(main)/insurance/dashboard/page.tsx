"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, AlertCircle, DollarSign, Activity } from "lucide-react";
import { useInsurance } from "@/context/InsuranceContext";

export default function InsuranceDashboard() {
    const { state } = useInsurance();
    const { contracts, claims } = state;

    // KPIs
    const totalContracts = contracts.length;
    const activeContracts = contracts.filter(c => c.status === "Active").length;
    const totalRevenue = contracts.reduce((sum, c) => sum + c.value, 0);
    const newClaims = claims.filter(c => c.status === "New").length;

    // Mock logic: renewal rate based on mock data distribution
    const renewalRate = 65;

    const recentContracts = [...contracts].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).slice(0, 5);

    const claimStatusCounts = {
        new: claims.filter(c => c.status === "New").length,
        processing: claims.filter(c => c.status === "Processing").length,
        approved: claims.filter(c => c.status === "Approved").length,
        rejected: claims.filter(c => c.status === "Rejected").length,
    };
    const totalClaims = claims.length || 1; // Avoid divide by zero

    const getPercent = (count: number) => Math.round((count / totalClaims) * 100);

    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Tổng Quan Bảo Hiểm</h2>
                <p className="text-muted-foreground">Theo dõi hiệu suất kinh doanh bảo hiểm và tình trạng bồi thường.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng Hợp Đồng</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalContracts}</div>
                        <p className="text-xs text-muted-foreground text-green-600">
                            {activeContracts} đang hiệu lực
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Doanh Thu Bảo Hiểm</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(totalRevenue / 1000000).toFixed(1)} Tr</div>
                        <p className="text-xs text-muted-foreground text-green-600">+15% so với tháng trước</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vụ Bồi Thường Mới</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{newClaims}</div>
                        <p className="text-xs text-muted-foreground text-red-600">Cần xử lý ngay</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tỷ Lệ Tái Tục</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{renewalRate}%</div>
                        <p className="text-xs text-muted-foreground text-green-600">+5% so với quý trước</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Hợp Đồng Mới Gần Đây</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentContracts.map((c, i) => (
                                <div key={c.id} className="flex items-center">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                        {c.id.slice(-2)}
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{c.customerName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {c.carModel} - {c.licensePlate}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">+{c.value.toLocaleString()} ₫</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Trạng Thái Bồi Thường</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Mới / Chờ Duyệt</span>
                                <span className="text-sm text-muted-foreground">{claimStatusCounts.new} vụ</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${getPercent(claimStatusCounts.new)}%` }}></div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Đang Xử Lý</span>
                                <span className="text-sm text-muted-foreground">{claimStatusCounts.processing} vụ</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${getPercent(claimStatusCounts.processing)}%` }}></div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Đã Duyệt / Hoàn Thành</span>
                                <span className="text-sm text-muted-foreground">{claimStatusCounts.approved} vụ</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${getPercent(claimStatusCounts.approved)}%` }}></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
