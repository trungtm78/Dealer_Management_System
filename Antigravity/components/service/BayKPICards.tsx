"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, LayoutGrid, AlertCircle } from "lucide-react";
import { BayKPIs } from "@/lib/types/service_bay";

interface BayKPICardsProps {
    data: BayKPIs;
}

export default function BayKPICards({ data }: BayKPICardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tổng số khoang</CardTitle>
                    <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.total_bays}</div>
                    <p className="text-xs text-muted-foreground">Khoang hoạt động: {data.working_bays}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hiệu suất sử dụng</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.utilization_rate}%</div>
                    <p className="text-xs text-muted-foreground">Khoang trống: {data.idle_bays}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tiến độ trung bình</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.avg_progress}%</div>
                    <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${data.avg_progress}%` }}></div>
                    </div>
                </CardContent>
            </Card>
            <Card className={data.delayed_count > 0 ? "border-red-200 bg-red-50" : ""}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Khoang bị trễ</CardTitle>
                    <AlertCircle className={data.delayed_count > 0 ? "h-4 w-4 text-red-600" : "h-4 w-4 text-muted-foreground"} />
                </CardHeader>
                <CardContent>
                    <div className={data.delayed_count > 0 ? "text-2xl font-bold text-red-600" : "text-2xl font-bold"}>
                        {data.delayed_count}
                    </div>
                    <p className="text-xs text-muted-foreground">Yêu cầu can thiệp ngay</p>
                </CardContent>
            </Card>
        </div>
    );
}
