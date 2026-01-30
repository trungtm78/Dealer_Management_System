
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

import { AccountingDataService, Invoice } from "@/services/accounting-data-service";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function Payables() {
    const [items, setItems] = useState<Invoice[]>([]);

    useEffect(() => {
        setItems(AccountingDataService.getPayables());
    }, []);

    const handlePay = (id: string) => {
        const success = AccountingDataService.payInvoice(id);
        if (success) {
            toast.success("Thanh toán thành công!");
            setItems([...AccountingDataService.getPayables()]); // Refresh
        } else {
            toast.error("Lỗi thanh toán");
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng Phải Trả</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(items.reduce((sum, i) => sum + (i.amount - i.paidAmount), 0))}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Công Nợ Phải Trả Nhà Cung Cấp</CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Tìm nhà cung cấp..." className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nhà Cung Cấp</TableHead>
                                <TableHead>Số Hóa Đơn</TableHead>
                                <TableHead>Hạn Thanh Toán</TableHead>
                                <TableHead className="text-right">Số Tiền</TableHead>
                                <TableHead className="text-center">Trạng Thái</TableHead>
                                <TableHead className="text-right">Hành Động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.entityName}</TableCell>
                                    <TableCell>{item.invoiceNumber}</TableCell>
                                    <TableCell>{item.dueDate}</TableCell>
                                    <TableCell className="text-right font-bold">{formatCurrency(item.amount)}</TableCell>
                                    <TableCell className="text-center">
                                        {item.status === 'OVERDUE' && <Badge variant="destructive">Quá Hạn</Badge>}
                                        {item.status === 'PENDING' && <Badge variant="secondary">Chưa TT</Badge>}
                                        {item.status === 'PAID' && <Badge className="bg-green-600">Đã TT</Badge>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {item.status !== 'PAID' && (
                                            <Button size="sm" onClick={() => handlePay(item.id)}>
                                                <CreditCard className="mr-2 h-4 w-4" /> Thanh Toán
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
