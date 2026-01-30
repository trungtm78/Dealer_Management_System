
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Phone, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

import { AccountingDataService, Invoice } from "@/services/accounting-data-service";
import { useState, useEffect } from "react";

export default function Receivables() {
    const [items, setItems] = useState<Invoice[]>([]);

    useEffect(() => {
        setItems(AccountingDataService.getReceivables());
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng Phải Thu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(items.reduce((sum, i) => sum + (i.amount - i.paidAmount), 0))}</div>
                        <p className="text-xs text-muted-foreground">{items.length} khách hàng</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quá Hạn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(404000000)}</div>
                        <p className="text-xs text-muted-foreground text-red-500">2 khoản nợ cần xử lý gấp</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh Sách Công Nợ Phải Thu</CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Tìm tên khách, số HD..." className="pl-8" />
                        </div>
                        <Button variant="outline"><Calendar className="mr-2 h-4 w-4" /> Lọc Ngày</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Khách Hàng</TableHead>
                                <TableHead>Số Hóa Đơn</TableHead>
                                <TableHead>Hạn Thanh Toán</TableHead>
                                <TableHead className="text-right">Tổng Tiền</TableHead>
                                <TableHead className="text-right">Đã Thu</TableHead>
                                <TableHead className="text-right">Còn Lại</TableHead>
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
                                    <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                    <TableCell className="text-right text-green-600">{formatCurrency(item.paidAmount)}</TableCell>
                                    <TableCell className="text-right font-bold text-red-600">{formatCurrency(item.amount - item.paidAmount)}</TableCell>
                                    <TableCell className="text-center">
                                        {item.status === 'OVERDUE' && <Badge variant="destructive">Quá Hạn</Badge>}
                                        {item.status === 'PENDING' && <Badge variant="secondary">Trong Hạn</Badge>}
                                        {item.status === 'PAID' && <Badge className="bg-green-600">Đã Thu</Badge>}
                                    </TableCell>
                                    <TableCell className="text-right flex justify-end gap-2">
                                        <Button variant="ghost" size="icon"><Mail className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
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
