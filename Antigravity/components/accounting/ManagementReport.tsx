
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { formatCurrency } from "@/lib/utils";

const COST_DATA = [
    { name: "Nhân Sự", value: 4500000000 },
    { name: "Mặt Bằng", value: 1200000000 },
    { name: "Marketing", value: 800000000 },
    { name: "Vận Hành", value: 1500000000 },
    { name: "Khác", value: 500000000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ManagementReport() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Báo Cáo Quản Trị Nội Bộ</h2>
                <Select defaultValue="T1">
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Chọn Kỳ" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="T1">Quý 1/2024</SelectItem>
                        <SelectItem value="T2">Năm 2023</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Cơ Cấu Chi Phí Vận Hành</CardTitle>
                        <CardDescription>Phân tích tỷ trọng các khoản chi lớn</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-md border border-dashed">
                            <p>Biểu đồ cơ cấu chi phí (Vui lòng cài đặt Recharts để xem)</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Hiệu Suất Theo Bộ Phận</CardTitle>
                        <CardDescription>Doanh thu & Lợi nhuận gộp theo phòng ban</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center text-muted-foreground h-[300px]">
                        (Biểu đồ so sánh hiệu quả Service vs Sales vs Parts)
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
