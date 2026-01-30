
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

const CF_ITEMS = [
    { category: "I. Lưu chuyển tiền từ hoạt động kinh doanh", isHeader: true },
    { category: "1. Tiền thu từ bán hàng, cung cấp dịch vụ", amount: 25000000000 },
    { category: "2. Tiền chi trả cho người cung cấp hàng hóa", amount: -15000000000 },
    { category: "3. Tiền chi trả cho người lao động", amount: -5000000000 },
    { category: "4. Tiền chi trả lãi vay", amount: -200000000 },
    { category: "5. Tiền chi nộp thuế TNDN", amount: -500000000 },
    { category: "Lưu chuyển tiền thuần từ HĐKD", amount: 4300000000, isTotal: true },

    { category: "II. Lưu chuyển tiền từ hoạt động đầu tư", isHeader: true },
    { category: "1. Tiền chi mua sắm TSCĐ", amount: -2000000000 },
    { category: "2. Tiền thu từ thanh lý TSCĐ", amount: 500000000 },
    { category: "Lưu chuyển tiền thuần từ HĐĐT", amount: -1500000000, isTotal: true },

    { category: "III. Lưu chuyển tiền từ hoạt động tài chính", isHeader: true },
    { category: "1. Tiền thu từ phát hành cổ phiếu", amount: 0 },
    { category: "2. Tiền chi trả nợ gốc vay", amount: -1000000000 },
    { category: "Lưu chuyển tiền thuần từ HĐTC", amount: -1000000000, isTotal: true },

    { category: "Lưu chuyển tiền thuần trong kỳ", amount: 1800000000, isGrandTotal: true },
    { category: "Tiền và tương đương tiền đầu kỳ", amount: 600000000 },
    { category: "Tiền và tương đương tiền cuối kỳ", amount: 2400000000, isGrandTotal: true },
];

export default function CashFlow() {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Báo Cáo Lưu Chuyển Tiền Tệ</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[70%]">Chỉ Tiêu</TableHead>
                            <TableHead className="text-right">Số Tiền (VND)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {CF_ITEMS.map((item, index) => {
                            if (item.isHeader) {
                                return (
                                    <TableRow key={index} className="bg-muted/30">
                                        <TableCell className="font-bold">{item.category}</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                );
                            }
                            if (item.isTotal) {
                                return (
                                    <TableRow key={index} className="bg-muted/50">
                                        <TableCell className="font-bold italic">{item.category}</TableCell>
                                        <TableCell className={`text-right font-bold ${item.amount! < 0 ? 'text-red-600' : 'text-green-700'}`}>
                                            {formatCurrency(item.amount || 0)}
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                            if (item.isGrandTotal) {
                                return (
                                    <TableRow key={index} className="bg-primary/5 border-t-2 border-primary/20">
                                        <TableCell className="font-extrabold uppercase text-primary">{item.category}</TableCell>
                                        <TableCell className="text-right font-extrabold text-primary text-lg">
                                            {formatCurrency(item.amount || 0)}
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                            return (
                                <TableRow key={index}>
                                    <TableCell className="pl-6">{item.category}</TableCell>
                                    <TableCell className={`text-right ${item.amount! < 0 ? 'text-red-500' : ''}`}>
                                        {formatCurrency(item.amount || 0)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
