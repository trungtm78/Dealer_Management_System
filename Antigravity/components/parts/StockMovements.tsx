
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownUp, Search, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { InventoryService } from "@/services/inventory.service"; // NEW
import { StockMovementDTO, PartDTO } from "@/lib/types/inventory"; // NEW
import { toast } from "sonner";


export default function StockMovements() {
    const [transactions, setTransactions] = useState<StockMovementDTO[]>([]);
    // const [parts, setParts] = useState<PartDTO[]>([]); // API returns part details, no need to maintain parts list unless for filter
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadMovements();
    }, []);

    const loadMovements = async () => {
        try {
            const data = await InventoryService.getMovements();
            setTransactions(data);
        } catch (error) {
            toast.error("Failed to load movements");
        }
    };

    // const getPartName = (partId: string) => {
    //    // Done via DTO
    // };

    const filteredTransactions = transactions.filter((tx) => {
        const partName = (tx.partName || "").toLowerCase();
        const ref = (tx.reference || "").toLowerCase();
        const search = searchTerm.toLowerCase();
        return partName.includes(search) || ref.includes(search) || (tx.partNumber || "").toLowerCase().includes(search);
    });

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <ArrowDownUp className="h-6 w-6 text-primary" />
                        Lịch Sử Nhập Xuất Kho
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm theo Mã PT, Tên hoặc Mã chứng từ..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ngày Giao Dịch</TableHead>
                                    <TableHead>Loại Giao Dịch</TableHead>
                                    <TableHead>Phụ Tùng</TableHead>
                                    <TableHead className="text-right">Số Lượng</TableHead>
                                    <TableHead>Chứng Từ</TableHead>
                                    <TableHead>Người Thực Hiện</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTransactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            Không có giao dịch nào.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTransactions.map((tx) => (
                                        <TableRow key={tx.id}>
                                            <TableCell>{new Date(tx.createdAt).toLocaleString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</TableCell>
                                            <TableCell>
                                                {tx.type === 'IN' ? (
                                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200 gap-1">
                                                        <ArrowDownLeft className="h-3 w-3" /> Nhập Kho
                                                    </Badge>
                                                ) : tx.type === 'OUT' ? (
                                                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200 gap-1">
                                                        <ArrowUpRight className="h-3 w-3" /> Xuất Kho
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline">{tx.type}</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium">{tx.partNumber} - {tx.partName}</TableCell>
                                            <TableCell className="text-right font-bold">
                                                {tx.type === 'OUT' ? '-' : '+'}{tx.quantity}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{tx.reference || "N/A"}</Badge>
                                            </TableCell>
                                            <TableCell>{tx.createdByName}</TableCell>
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
