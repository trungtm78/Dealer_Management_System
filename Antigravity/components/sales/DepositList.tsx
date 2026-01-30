"use client";

import { useState, useEffect } from "react";
import { Plus, Search, DollarSign, MoreHorizontal, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { SalesService } from "@/services/sales.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DepositList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [deposits, setDeposits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newDeposit, setNewDeposit] = useState({
        customerName: "",
        amount: 0,
        contractNumber: "",
        paymentMethod: "Transfer",
        notes: ""
    });

    useEffect(() => {
        loadDeposits();
    }, []);

    const loadDeposits = async () => {
        try {
            const data = await SalesService.getDeposits();
            setDeposits(data);
        } catch (error) {
            console.error('Failed to load deposits:', error);
            toast.error('Không thể tải danh sách phiếu thu');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: any) => {
        try {
            const result = await SalesService.updateDepositStatus(id, status);

            if (result.success) {
                toast.success('Đã cập nhật trạng thái');
                loadDeposits();
            } else {
                toast.error(result.error || 'Cập nhật thất bại');
            }
        } catch (error) {
            toast.error('Lỗi khi cập nhật');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID': return <Badge className="bg-green-100 text-green-700">Đã Thu</Badge>;
            case 'REFUNDED': return <Badge className="bg-orange-100 text-orange-700">Đã Hoàn</Badge>;
            case 'CANCELLED': return <Badge className="bg-red-100 text-red-700">Đã Hủy</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatPrice = (price: number) => price.toLocaleString('vi-VN') + ' ₫';

    const filteredDeposits = deposits.filter(d =>
        d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="h-full bg-gray-50/50 p-6 flex items-center justify-center">
            <div className="text-gray-500">Đang tải...</div>
        </div>;
    }



    const handleCreate = async () => {
        if (!newDeposit.customerName || !newDeposit.amount) {
            toast.error("Vui lòng nhập tên khách hàng và số tiền");
            return;
        }

        try {
            const result = await SalesService.createDeposit({
                ...newDeposit,
                receivedById: "user-1", // Mock User ID for now
                customerId: undefined // Optional
            });

            if (result.success) {
                toast.success("Tạo phiếu thu thành công");
                setIsCreateOpen(false);
                setNewDeposit({
                    customerName: "",
                    amount: 0,
                    contractNumber: "",
                    paymentMethod: "Transfer",
                    notes: ""
                });
                loadDeposits();
            } else {
                toast.error(result.error || "Tạo phiếu thu thất bại");
            }
        } catch (error) {
            toast.error("Lỗi hệ thống");
        }
    };

    return (
        <div className="h-full bg-gray-50/50 p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quản Lý Đặt Cọc</h1>
                    <p className="text-sm text-gray-500 mt-1">Danh sách phiếu thu tiền cọc (Database: HD_CH_SYS)</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#E60012] hover:bg-[#CC0010]">
                            <Plus className="w-4 h-4 mr-2" /> Tạo Phiếu Thu
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tạo Phiếu Thu Mới</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="customerName">Tên Khách Hàng <span className="text-red-500">*</span></Label>
                                <Input id="customerName" value={newDeposit.customerName} onChange={(e) => setNewDeposit({ ...newDeposit, customerName: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Số Tiền (VNĐ) <span className="text-red-500">*</span></Label>
                                <CurrencyInput
                                    id="amount"
                                    value={newDeposit.amount}
                                    onChange={(val) => setNewDeposit({ ...newDeposit, amount: val })}
                                    placeholder="0"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="contractNumber">Số Hợp Đồng</Label>
                                <Input id="contractNumber" value={newDeposit.contractNumber} onChange={(e) => setNewDeposit({ ...newDeposit, contractNumber: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="paymentMethod">Phương Thức TT</Label>
                                <Select value={newDeposit.paymentMethod} onValueChange={(val) => setNewDeposit({ ...newDeposit, paymentMethod: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn phương thức" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cash">Tiền Mặt</SelectItem>
                                        <SelectItem value="Transfer">Chuyển Khoản</SelectItem>
                                        <SelectItem value="Card">Thẻ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="notes">Ghi Chú</Label>
                                <Input id="notes" value={newDeposit.notes} onChange={(e) => setNewDeposit({ ...newDeposit, notes: e.target.value })} />
                            </div>
                            <Button onClick={handleCreate} className="w-full mt-2 bg-[#E60012] hover:bg-[#CC0010]">Xác Nhận Thu Tiền</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm mã phiếu, khách hàng..."
                            className="pl-9 bg-gray-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead>Mã Phiếu</TableHead>
                            <TableHead>Khách Hàng</TableHead>
                            <TableHead className="text-right">Số Tiền</TableHead>
                            <TableHead>Hợp Đồng</TableHead>
                            <TableHead>Nhân Viên Thu</TableHead>
                            <TableHead>Ngày Thu</TableHead>
                            <TableHead>Trạng Thái</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDeposits.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                    Chưa có phiếu thu nào
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredDeposits.map((deposit) => (
                                <TableRow key={deposit.id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium text-blue-600">{deposit.receiptNumber}</TableCell>
                                    <TableCell>{deposit.customerName}</TableCell>
                                    <TableCell className="text-right font-bold text-green-600">
                                        <div className="flex items-center justify-end gap-1">
                                            <DollarSign className="w-4 h-4" />
                                            {formatPrice(deposit.amount)}
                                        </div>
                                    </TableCell>
                                    <TableCell>{deposit.contractNumber || 'N/A'}</TableCell>
                                    <TableCell>{deposit.receivedBy?.name || 'N/A'}</TableCell>
                                    <TableCell>{new Date(deposit.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                    <TableCell>{getStatusBadge(deposit.status)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Xem Chi Tiết
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-orange-600" onClick={() => handleUpdateStatus(deposit.id, 'REFUNDED')}>
                                                    Hoàn Tiền
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <div className="p-4 border-t border-gray-100 text-sm text-gray-500">
                    Hiển thị {filteredDeposits.length} phiếu thu từ database
                </div>
            </div>
        </div>
    );
}
