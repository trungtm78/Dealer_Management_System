
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { AccountingDataService, Asset } from "@/services/accounting-data-service";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";


export default function FixedAssets() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [open, setOpen] = useState(false);
    const [newItem, setNewItem] = useState<Partial<Asset>>({});

    useEffect(() => {
        setAssets(AccountingDataService.getAssets());
    }, []);

    const handleCreate = () => {
        if (!newItem.code || !newItem.name || !newItem.cost) {
            toast.error("Vui lòng nhập đủ thông tin");
            return;
        }

        AccountingDataService.addAsset({
            code: newItem.code,
            name: newItem.name,
            cost: Number(newItem.cost),
            purchaseDate: newItem.purchaseDate || new Date().toISOString().split('T')[0],
            department: newItem.department || "General",
            lifeYears: Number(newItem.lifeYears) || 5,
            status: 'ACTIVE'
        });

        toast.success("Đã thêm tài sản mới!");
        setAssets([...AccountingDataService.getAssets()]);
        setOpen(false);
        setNewItem({});
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Danh Mục Tài Sản Cố Định</CardTitle>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Thêm Tài Sản</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Thêm Tài Sản Mới</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="code">Mã TS</Label>
                                <Input id="code" value={newItem.code || ''} onChange={e => setNewItem({ ...newItem, code: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Tên Tài Sản</Label>
                                <Input id="name" value={newItem.name || ''} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="cost">Nguyên Giá (VND)</Label>
                                <Input id="cost" type="number" value={newItem.cost || ''} onChange={e => setNewItem({ ...newItem, cost: Number(e.target.value) })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dept">Bộ Phận</Label>
                                <Input id="dept" value={newItem.department || ''} onChange={e => setNewItem({ ...newItem, department: e.target.value })} />
                            </div>
                        </div>
                        <Button onClick={handleCreate}>Lưu Tài Sản</Button>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã TS</TableHead>
                            <TableHead>Tên Tài Sản</TableHead>
                            <TableHead>Ngày Đưa Vào SD</TableHead>
                            <TableHead>Bộ Phận SD</TableHead>
                            <TableHead className="text-right">Nguyên Giá</TableHead>
                            <TableHead className="text-right">Thời Gian KH (Năm)</TableHead>
                            <TableHead className="text-center">Trạng Thái</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assets.map((asset, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{asset.code}</TableCell>
                                <TableCell>{asset.name}</TableCell>
                                <TableCell>{asset.purchaseDate}</TableCell>
                                <TableCell>{asset.department}</TableCell>
                                <TableCell className="text-right">{formatCurrency(asset.cost)}</TableCell>
                                <TableCell className="text-right">{asset.lifeYears}</TableCell>
                                <TableCell className="text-center">{asset.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
