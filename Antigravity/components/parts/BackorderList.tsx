
"use client";

import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, BellRing, CheckCircle } from "lucide-react";
import { PartsDataService, Backorder, Part } from "@/services/parts-data-service";
import { toast } from "sonner";

export default function BackorderList() {
    const [items, setItems] = useState<Backorder[]>([]);
    const [parts, setParts] = useState<Part[]>([]);

    useEffect(() => {
        setItems(PartsDataService.getBackorders());
        setParts(PartsDataService.getParts());
    }, []);

    const getPartName = (partId: string) => {
        const part = parts.find(p => p.id === partId);
        return part ? `${part.partNumber} - ${part.name}` : partId;
    };

    const handleNotify = (item: Backorder) => {
        // Logic to check if stock is now available?
        // For now, just a mock notification action
        toast.success(`Đã gửi SMS thông báo có hàng cho khách ${item.customerName}!`);
    };

    const handleFulfill = (id: string) => {
        const success = PartsDataService.fulfillBackorder(id);
        if (success) {
            toast.success("Đã xuất kho trả hàng Backorder!");
            setItems([...PartsDataService.getBackorders()]); // Refresh
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Truck className="h-6 w-6 text-primary" />
                        Theo Dõi Hàng Nợ (Backorder)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã RO</TableHead>
                                    <TableHead>Khách Hàng</TableHead>
                                    <TableHead>Phụ Tùng</TableHead>
                                    <TableHead className="text-right">Số Lượng</TableHead>
                                    <TableHead>Ngày Đặt</TableHead>
                                    <TableHead className="text-center">Trạng Thái</TableHead>
                                    <TableHead className="text-right">Hành Động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                            Không có hàng nợ.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.roNumber}</TableCell>
                                            <TableCell>{item.customerName}</TableCell>
                                            <TableCell>{getPartName(item.partId)}</TableCell>
                                            <TableCell className="text-right font-bold">{item.quantity}</TableCell>
                                            <TableCell>{new Date(item.date).toLocaleDateString('vi-VN')}</TableCell>
                                            <TableCell className="text-center">
                                                {item.status === 'OPEN' ? (
                                                    <Badge variant="destructive">Chờ Hàng</Badge>
                                                ) : (
                                                    <Badge className="bg-green-600">Đã Trả</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right flex justify-end gap-2">
                                                {item.status === 'OPEN' && (
                                                    <>
                                                        <Button variant="outline" size="sm" onClick={() => handleNotify(item)}>
                                                            <BellRing className="mr-2 h-4 w-4" /> Báo Khách
                                                        </Button>
                                                        <Button size="sm" onClick={() => handleFulfill(item.id)}>
                                                            <CheckCircle className="mr-2 h-4 w-4" /> Trả Hàng
                                                        </Button>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
