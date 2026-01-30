
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const PNL_ITEMS = [
    { category: "Doanh Thu Bán Hàng", code: "511", amount: 15400000000, type: "revenue", indent: 0 },
    { category: "Các khoản giảm trừ", code: "521", amount: 400000000, type: "revenue", indent: 1 },
    { category: "Doanh thu thuần", code: "10", amount: 15000000000, type: "total", indent: 0 },
    { category: "Giá vốn hàng bán", code: "632", amount: 9000000000, type: "expense", indent: 0 },
    { category: "Lợi nhuận gộp", code: "20", amount: 6000000000, type: "total", indent: 0 },
    { category: "Doanh thu tài chính", code: "515", amount: 200000000, type: "revenue", indent: 0 },
    { category: "Chi phí tài chính", code: "635", amount: 150000000, type: "expense", indent: 0 },
    { category: "Chi phí bán hàng", code: "641", amount: 2500000000, type: "expense", indent: 0 },
    { category: "Chi phí quản lý DN", code: "642", amount: 1500000000, type: "expense", indent: 0 },
    { category: "Lợi nhuận thuần từ HĐKD", code: "30", amount: 2050000000, type: "total", indent: 0 },
    { category: "Thu nhập khác", code: "711", amount: 50000000, type: "revenue", indent: 0 },
    { category: "Chi phí khác", code: "811", amount: 20000000, type: "expense", indent: 0 },
    { category: "Lợi nhuận khác", code: "40", amount: 30000000, type: "total", indent: 0 },
    { category: "Tổng lợi nhuận kế toán trước thuế", code: "50", amount: 2080000000, type: "total", indent: 0 },
    { category: "Chi phí thuế TNDN hiện hành", code: "821", amount: 416000000, type: "expense", indent: 0 },
    { category: "Lợi nhuận sau thuế TNDN", code: "60", amount: 1664000000, type: "total", indent: 0 },
];

export default function PnLReport() {
    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Báo Cáo Kết Quả Hoạt Động Kinh Doanh</CardTitle>
                <div className="flex gap-2">
                    <Select defaultValue="2024">
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Năm" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="T12">
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Kỳ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="T12">Tháng 12</SelectItem>
                            <SelectItem value="Q4">Quý 4</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Xuất Excel</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60%]">Chỉ Tiêu</TableHead>
                            <TableHead className="text-center">Mã Số</TableHead>
                            <TableHead className="text-right">Số Tiền (VND)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {PNL_ITEMS.map((item, index) => (
                            <TableRow key={index} className={item.type === 'total' ? 'bg-muted/50 font-bold' : ''}>
                                <TableCell>
                                    <span style={{ paddingLeft: `${item.indent * 20}px` }}>{item.category}</span>
                                </TableCell>
                                <TableCell className="text-center">{item.code}</TableCell>
                                <TableCell className={`text-right ${item.amount < 0 || item.type === 'expense' ? 'text-red-600' : 'text-blue-900'}`}>
                                    {formatCurrency(item.amount)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
