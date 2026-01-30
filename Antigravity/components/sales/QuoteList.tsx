"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal, FileText, Printer, Mail, XCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SalesService } from "@/services/sales.service";

export default function QuoteList() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuotes();
    }, []);



    const loadQuotes = async () => {
        try {
            const data = await SalesService.getQuotations();
            setQuotes(data);
        } catch (error) {
            console.error('Failed to load quotations:', error);
            toast.error('Không thể tải danh sách báo giá');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: any) => {
        try {
            const result = await SalesService.updateQuotationStatus(id, status);

            if (result.success) {
                toast.success('Đã cập nhật trạng thái');
                loadQuotes();
            } else {
                toast.error(result.error || 'Cập nhật thất bại');
            }
        } catch (error) {
            toast.error('Lỗi khi cập nhật');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'DRAFT': return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Nháp</Badge>;
            case 'SENT': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Đã Gửi</Badge>;
            case 'APPROVED': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Đã Chốt</Badge>;
            case 'CONTRACT': return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Hợp Đồng</Badge>;
            case 'LOST': return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">Thất Bại</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatPrice = (price: number) => price.toLocaleString('vi-VN') + ' ₫';

    const filteredQuotes = quotes.filter(q =>
        q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.customerPhone.includes(searchTerm)
    );

    if (loading) {
        return <div className="h-full bg-gray-50/50 p-6 flex items-center justify-center">
            <div className="text-gray-500">Đang tải...</div>
        </div>;
    }

    return (
        <div className="h-full bg-gray-50/50 p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Danh Sách Báo Giá</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý toàn bộ báo giá bán hàng (Database: HD_CH_SYS)</p>
                </div>
                <Button className="bg-[#E60012] hover:bg-[#CC0010]" onClick={() => router.push('/sales/quotation')}>
                    <Plus className="w-4 h-4 mr-2" /> Tạo Báo Giá Mới
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm mã, tên khách hàng, SĐT..."
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
                            <TableHead className="w-[140px]">Mã Báo Giá</TableHead>
                            <TableHead>Khách Hàng</TableHead>
                            <TableHead>Dòng Xe</TableHead>
                            <TableHead className="text-right">Tổng Giá Trị</TableHead>
                            <TableHead>Nhân Viên</TableHead>
                            <TableHead>Ngày Tạo</TableHead>
                            <TableHead>Trạng Thái</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredQuotes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                    Chưa có báo giá nào. Hãy tạo báo giá mới!
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredQuotes.map((quote) => (
                                <TableRow key={quote.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                                    <TableCell className="font-medium text-blue-600">{quote.quoteNumber}</TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{quote.customerName}</div>
                                            <div className="text-xs text-gray-500">{quote.customerPhone}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${quote.model.includes('CR-V') ? 'bg-orange-400' : 'bg-blue-400'}`}></div>
                                            {quote.model} {quote.version}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-gray-900">{formatPrice(quote.totalPrice)}</TableCell>
                                    <TableCell>{quote.createdBy?.name || 'N/A'}</TableCell>
                                    <TableCell>{new Date(quote.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                    <TableCell>{getStatusBadge(quote.status)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    <FileText className="mr-2 h-4 w-4" /> Xem chi tiết
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Printer className="mr-2 h-4 w-4" /> In báo giá
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(quote.id, 'SENT')}>
                                                    <Mail className="mr-2 h-4 w-4" /> Gửi Email
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-green-600" onClick={() => handleUpdateStatus(quote.id, 'APPROVED')}>
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Chốt Báo Giá
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleUpdateStatus(quote.id, 'LOST')}>
                                                    <XCircle className="mr-2 h-4 w-4" /> Hủy Báo Giá
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <div>Hiển thị {filteredQuotes.length} kết quả từ database HD_CH_SYS</div>
                </div>
            </div>
        </div>
    );
}
