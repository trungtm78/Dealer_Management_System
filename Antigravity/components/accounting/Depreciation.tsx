
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

const DEPRECIATION_DATA = [
    { code: "TSCĐ001", name: "Xe ô tô Toyota Fortuner", cost: 1200000000, accumulated: 400000000, monthly: 10000000, remain: 800000000 },
    { code: "TSCĐ002", name: "Máy chủ Dell PowerEdge", cost: 150000000, accumulated: 60000000, monthly: 2500000, remain: 90000000 },
    { code: "TSCĐ003", name: "Hệ thống Cầu Nâng", cost: 800000000, accumulated: 200000000, monthly: 8333333, remain: 600000000 },
];

export default function Depreciation() {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Bảng Tính Khấu Hao Tài Sản</CardTitle>
                <CardDescription>Kỳ tính: Tháng 01/2026</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã TS</TableHead>
                            <TableHead>Tên Tài Sản</TableHead>
                            <TableHead className="text-right">Nguyên Giá</TableHead>
                            <TableHead className="text-right">Lũy Kế Đã KH</TableHead>
                            <TableHead className="text-right">Mức KH Tháng</TableHead>
                            <TableHead className="text-right">Giá Trị Còn Lại</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {DEPRECIATION_DATA.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{item.code}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.cost)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.accumulated)}</TableCell>
                                <TableCell className="text-right font-bold text-orange-600">{formatCurrency(item.monthly)}</TableCell>
                                <TableCell className="text-right font-bold text-blue-700">{formatCurrency(item.remain)}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow className="bg-muted/50 font-bold border-t-2">
                            <TableCell colSpan={2} className="text-right uppercase">Tổng Cộng</TableCell>
                            <TableCell className="text-right">{formatCurrency(2150000000)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(660000000)}</TableCell>
                            <TableCell className="text-right text-orange-700">{formatCurrency(20833333)}</TableCell>
                            <TableCell className="text-right text-blue-800">{formatCurrency(1490000000)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
