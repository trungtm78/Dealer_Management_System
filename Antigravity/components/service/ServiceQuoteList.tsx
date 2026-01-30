"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal, FileText, CheckCircle, Mail, XCircle, FileInput } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServiceService } from "@/services/service.service";
// import { ServiceDataService, ServiceQuote } from "@/services/service-data-service"; // REMOVED
import { ServiceQuoteDTO } from "@/lib/types/service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ServiceQuoteList() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [quotes, setQuotes] = useState<ServiceQuoteDTO[]>([]);

    const loadQuotes = async () => {
        try {
            const data = await ServiceService.getQuotes();
            setQuotes(data);
        } catch (error) {
            toast.error("Không thể tải danh sách báo giá");
        }
    };

    useEffect(() => {
        loadQuotes();
    }, []);

    const handleConvert = async (id: string) => {
        const res = await ServiceService.convertQuoteToRO(id);
        if (res.success) {
            toast.success(`Đã chuyển báo giá thành Lệnh Sửa Chữa!`);
            loadQuotes();
        } else {
            toast.error(res.error || "Lỗi chuyển đổi");
        }
    };

    const handleStatusChange = async (id: string, status: string) => {
        const res = await ServiceService.updateQuoteStatus(id, status);
        if (res.success) {
            toast.success(`Cập nhật trạng thái thành công`);
            loadQuotes();
        } else {
            toast.error(res.error || "Lỗi cập nhật");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'DRAFT': return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Nháp</Badge>;
            case 'SENT': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Đã Gửi</Badge>;
            case 'APPROVED': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Đã Duyệt</Badge>;
            case 'REJECTED': return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">Từ Chối</Badge>;
            case 'CONVERTED': return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Đã Chuyển RO</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const filteredQuotes = quotes.filter(q =>
        (q.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.vehicleInfo?.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full bg-gray-50/50 p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Báo Giá Dịch Vụ</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý các báo giá sửa chữa & bảo dưỡng</p>
                </div>
                <Button className="bg-[#E60012] hover:bg-[#CC0010]" onClick={() => router.push('/service/quotations/create')}>
                    <Plus className="w-4 h-4 mr-2" /> Tạo Báo Giá
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm báo giá, KH, Biển số..."
                            className="pl-9 bg-gray-50 border-gray-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-9">
                            <Filter className="w-4 h-4 mr-2" /> Bộ Lọc
                        </Button>
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-[120px]">Mã BG</TableHead>
                            <TableHead>Khách Hàng</TableHead>
                            <TableHead>Xe / Biển Số</TableHead>
                            <TableHead>Cố Vấn</TableHead>
                            <TableHead className="text-right">Tổng Tiền</TableHead>
                            <TableHead>Ngày Hết Hạn</TableHead>
                            <TableHead>Trạng Thái</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredQuotes.map((quote) => (
                            <TableRow key={quote.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="font-medium text-blue-600 font-mono">{quote.quoteNumber}</TableCell>
                                <TableCell>
                                    <div className="font-medium">{quote.customerName}</div>
                                    <div className="text-xs text-gray-500">{quote.customerPhone}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{quote.vehicleInfo?.model}</div>
                                    <Badge variant="outline" className="text-xs font-mono mt-0.5">{quote.vehicleInfo?.plateNumber}</Badge>
                                </TableCell>
                                <TableCell>{quote.advisorName || quote.advisorId}</TableCell>
                                <TableCell className="text-right font-bold text-gray-900">{formatCurrency(quote.totalAmount)}</TableCell>
                                <TableCell className="text-sm">{quote.expiryDate}</TableCell>
                                <TableCell>{getStatusBadge(quote.status)}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleStatusChange(quote.id, 'SENT')}>
                                                <Mail className="mr-2 h-4 w-4" /> Gửi Email
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusChange(quote.id, 'APPROVED')}>
                                                <CheckCircle className="mr-2 h-4 w-4" /> Duyệt Báo Giá
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusChange(quote.id, 'REJECTED')} className="text-red-600">
                                                <XCircle className="mr-2 h-4 w-4" /> Từ Chối
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            {quote.status !== 'CONVERTED' && (
                                                <DropdownMenuItem onClick={() => handleConvert(quote.id)} className="text-purple-600 font-medium">
                                                    <FileInput className="mr-2 h-4 w-4" /> Chuyển sang RO
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
