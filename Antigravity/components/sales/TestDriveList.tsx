"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Calendar, MoreHorizontal, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function TestDriveList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [testDrives, setTestDrives] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTestDrives();
    }, []);

    const loadTestDrives = async () => {
        try {
            const { getTestDrives } = await import('@/actions/sales/test-drives');
            const data = await getTestDrives();
            setTestDrives(data);
        } catch (error) {
            console.error('Failed to load test drives:', error);
            toast.error('Không thể tải danh sách lái thử');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: any) => {
        try {
            const { updateTestDriveStatus } = await import('@/actions/sales/test-drives');
            const result = await updateTestDriveStatus(id, status);

            if (result.success) {
                toast.success('Đã cập nhật trạng thái');
                loadTestDrives();
            } else {
                toast.error(result.error || 'Cập nhật thất bại');
            }
        } catch (error) {
            toast.error('Lỗi khi cập nhật');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'SCHEDULED': return <Badge className="bg-blue-100 text-blue-700">Đã Đặt</Badge>;
            case 'COMPLETED': return <Badge className="bg-green-100 text-green-700">Hoàn Thành</Badge>;
            case 'CANCELLED': return <Badge className="bg-red-100 text-red-700">Đã Hủy</Badge>;
            case 'NO_SHOW': return <Badge className="bg-gray-100 text-gray-700">Không Đến</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const filteredTestDrives = testDrives.filter(td =>
        td.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        td.customerPhone.includes(searchTerm) ||
        td.model.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Lịch Lái Thử</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý lịch hẹn lái thử xe (Database: HD_CH_SYS)</p>
                </div>
                <Button className="bg-[#E60012] hover:bg-[#CC0010]">
                    <Plus className="w-4 h-4 mr-2" /> Đặt Lịch Mới
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm khách hàng, SĐT, dòng xe..."
                            className="pl-9 bg-gray-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead>Khách Hàng</TableHead>
                            <TableHead>Dòng Xe</TableHead>
                            <TableHead>Ngày Hẹn</TableHead>
                            <TableHead>Giờ</TableHead>
                            <TableHead>Nhân Viên</TableHead>
                            <TableHead>Trạng Thái</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTestDrives.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    Chưa có lịch lái thử nào
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTestDrives.map((td) => (
                                <TableRow key={td.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{td.customerName}</div>
                                            <div className="text-xs text-gray-500">{td.customerPhone}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{td.model}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {new Date(td.scheduledDate).toLocaleDateString('vi-VN')}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            {td.scheduledTime}
                                        </div>
                                    </TableCell>
                                    <TableCell>{td.assignedTo?.name || 'Chưa phân'}</TableCell>
                                    <TableCell>{getStatusBadge(td.status)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="text-green-600" onClick={() => handleUpdateStatus(td.id, 'COMPLETED')}>
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Hoàn Thành
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleUpdateStatus(td.id, 'CANCELLED')}>
                                                    <XCircle className="mr-2 h-4 w-4" /> Hủy Lịch
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(td.id, 'NO_SHOW')}>
                                                    Khách Không Đến
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
                    Hiển thị {filteredTestDrives.length} lịch hẹn từ database
                </div>
            </div>
        </div>
    );
}
