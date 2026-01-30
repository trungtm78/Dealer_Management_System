
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const BS_ITEMS = [
    { category: "TÀI SẢN", isHeader: true },
    { category: "A. TÀI SẢN NGẮN HẠN", amount: 5000000000, isSubHeader: true },
    { category: "I. Tiền và các khoản tương đương tiền", amount: 1500000000, indent: 1 },
    { category: "II. Đầu tư tài chính ngắn hạn", amount: 500000000, indent: 1 },
    { category: "III. Các khoản phải thu ngắn hạn", amount: 1800000000, indent: 1 },
    { category: "IV. Hàng tồn kho", amount: 1200000000, indent: 1 },
    { category: "B. TÀI SẢN DÀI HẠN", amount: 8000000000, isSubHeader: true },
    { category: "I. Tài sản cố định", amount: 7500000000, indent: 1 },
    { category: "II. Tài sản dở dang dài hạn", amount: 500000000, indent: 1 },
    { category: "TỔNG CỘNG TÀI SẢN", amount: 13000000000, isTotal: true },

    { category: "NGUỒN VỐN", isHeader: true, className: "mt-4" },
    { category: "A. NỢ PHẢI TRẢ", amount: 4000000000, isSubHeader: true },
    { category: "I. Nợ ngắn hạn", amount: 2500000000, indent: 1 },
    { category: "II. Nợ dài hạn", amount: 1500000000, indent: 1 },
    { category: "B. VỐN CHỦ SỞ HỮU", amount: 9000000000, isSubHeader: true },
    { category: "I. Vốn góp của chủ sở hữu", amount: 8000000000, indent: 1 },
    { category: "II. Lợi nhuận sau thuế chưa phân phối", amount: 1000000000, indent: 1 },
    { category: "TỔNG CỘNG NGUỒN VỐN", amount: 13000000000, isTotal: true },
];

export default function BalanceSheet() {
    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Bảng Cân Đối Kế Toán</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Lọc Kỳ</Button>
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Xuất Báo Cáo</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[70%]">Chỉ Tiêu</TableHead>
                            <TableHead className="text-right">Số Cuối Kỳ (VND)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {BS_ITEMS.map((item, index) => {
                            if (item.isHeader) {
                                return (
                                    <TableRow key={index} className="bg-slate-100 hover:bg-slate-200">
                                        <TableCell colSpan={2} className="font-extrabold text-lg text-slate-800 uppercase">{item.category}</TableCell>
                                    </TableRow>
                                );
                            }
                            if (item.isSubHeader) {
                                return (
                                    <TableRow key={index} className="bg-slate-50">
                                        <TableCell className="font-bold">{item.category}</TableCell>
                                        <TableCell className="text-right font-bold">{formatCurrency(item.amount || 0)}</TableCell>
                                    </TableRow>
                                );
                            }
                            if (item.isTotal) {
                                return (
                                    <TableRow key={index} className="bg-blue-50 border-t-2 border-blue-200">
                                        <TableCell className="font-extrabold text-blue-800 uppercase">{item.category}</TableCell>
                                        <TableCell className="text-right font-extrabold text-blue-800 text-lg">{formatCurrency(item.amount || 0)}</TableCell>
                                    </TableRow>
                                );
                            }
                            return (
                                <TableRow key={index}>
                                    <TableCell>
                                        <span style={{ paddingLeft: `${(item.indent || 0) * 20}px` }}>{item.category}</span>
                                    </TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.amount || 0)}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
