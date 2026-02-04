
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
import { ShoppingCart, Plus, CheckCircle2, Truck } from "lucide-react";
import { PartsDataService, PurchaseOrder, Supplier } from "@/services/parts-data-service";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartSelect } from "@/components/SmartSelect";
import type { SelectDataSource } from "@/types/smart-select";

export default function PurchaseList() {
    const [pos, setPos] = useState<PurchaseOrder[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
    const [newPO, setNewPO] = useState({
        supplierId: '',
        totalAmount: 0 // Simplified for demo, normally calculated from items
    });

    useEffect(() => {
        setPos(PartsDataService.getPurchaseOrders());
        setSuppliers(PartsDataService.getSuppliers());
    }, []);

    const handleReceive = (poId: string) => {
        const success = PartsDataService.receivePurchaseOrder(poId);
        if (success) {
            toast.success("Đã nhập kho đơn hàng thành công!");
            setPos(PartsDataService.getPurchaseOrders()); // Refresh
        } else {
            toast.error("Không thể nhập kho đơn hàng này.");
        }
    };

    const handleCreate = () => {
        if (!newPO.supplierId) {
            toast.error("Vui lòng chọn nhà cung cấp");
            return;
        }

        // Mock creating a PO with a generic item
        PartsDataService.createPurchaseOrder({
            supplierId: newPO.supplierId,
            date: new Date().toISOString(),
            totalAmount: 10000000,
            items: [{ partId: '1', quantity: 50, price: 200000 }] // Mock item
        });

        toast.success("Đã tạo yêu cầu mua hàng mới!");
        setIsOpen(false);
        setPos(PartsDataService.getPurchaseOrders());
    };

    const supplierDataSource: SelectDataSource = {
        search: async (req) => {
            const res = await fetch('/api/shared/search/suppliers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req)
            });
            return res.json();
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'RECEIVED': return <Badge className="bg-green-600">Đã Nhập Kho</Badge>;
            case 'PENDING': return <Badge variant="secondary">Đang Chờ</Badge>;
            case 'ORDERED': return <Badge className="bg-blue-600">Đã Đặt Hàng</Badge>;
            case 'CANCELLED': return <Badge variant="destructive">Đã Hủy</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getSupplierName = (id: string) => suppliers.find(s => s.id === id)?.name || id;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6 text-primary" />
                        Quản Lý Mua Hàng
                    </CardTitle>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button><Plus className="mr-2 h-4 w-4" /> Tạo Đơn Mua Mới</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo Đơn Mua Hàng (PO)</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <SmartSelect
                                        dataSource={supplierDataSource}
                                        value={selectedSupplierId}
                                        onChange={(id, item) => {
                                            setSelectedSupplierId(id as number | null);
                                            setNewPO({ ...newPO, supplierId: id ? String(id) : '' });
                                        }}
                                        label="Nhà Cung Cấp"
                                        placeholder="Chọn NCC"
                                        required={true}
                                        context={{ onlyActive: true }}
                                        className="w-full"
                                    />
                                </div>
                                {/* Simplified form for demo */}
                                <div className="text-sm text-muted-foreground text-center">
                                    * Phiên bản demo sẽ tạo tự động danh sách hàng hóa mẫu.
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate}>Xác Nhận Tạo</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Số PO</TableHead>
                                    <TableHead>Nhà Cung Cấp</TableHead>
                                    <TableHead>Ngày Tạo</TableHead>
                                    <TableHead className="text-right">Tổng Tiền</TableHead>
                                    <TableHead className="text-center">Trạng Thái</TableHead>
                                    <TableHead className="text-right">Hành Động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pos.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            Chưa có đơn hàng nào.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pos.map((po) => (
                                        <TableRow key={po.id}>
                                            <TableCell className="font-medium">{po.poNumber}</TableCell>
                                            <TableCell>{getSupplierName(po.supplierId)}</TableCell>
                                            <TableCell>{new Date(po.date).toLocaleDateString('vi-VN')}</TableCell>
                                            <TableCell className="text-right font-bold">
                                                {formatCurrency(po.totalAmount)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {getStatusBadge(po.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {po.status !== 'RECEIVED' && po.status !== 'CANCELLED' && (
                                                    <Button variant="outline" size="sm" onClick={() => handleReceive(po.id)}>
                                                        <Truck className="mr-2 h-4 w-4" /> Nhập Kho
                                                    </Button>
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
