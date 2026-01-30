"use client";

import { useState, useEffect } from "react";
import { Plus, Search, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { SalesService } from "@/services/sales.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PdsList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [pdsList, setPdsList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPDS();
    }, []);

    const loadPDS = async () => {
        try {
            const data = await SalesService.getPDSList();
            setPdsList(data);
        } catch (error) {
            console.error('Failed to load PDS:', error);
            toast.error('Không thể tải danh sách PDS');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: any) => {
        try {
            const result = await SalesService.updatePDSStatus(id, status);

            if (result.success) {
                toast.success('Đã cập nhật trạng thái');
                loadPDS();
            } else {
                toast.error(result.error || 'Cập nhật thất bại');
            }
        } catch (error) {
            toast.error('Lỗi khi cập nhật');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING': return <Badge className="bg-gray-100 text-gray-700">Chờ Kiểm Tra</Badge>;
            case 'IN_PROGRESS': return <Badge className="bg-blue-100 text-blue-700">Đang Kiểm</Badge>;
            case 'PASSED': return <Badge className="bg-green-100 text-green-700">Đạt</Badge>;
            case 'FAILED': return <Badge className="bg-red-100 text-red-700">Không Đạt</Badge>;
            case 'REWORK': return <Badge className="bg-orange-100 text-orange-700">Làm Lại</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const filteredPDS = pdsList.filter(p =>
        p.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.model.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="h-full bg-gray-50/50 p-6 flex items-center justify-center">
            <div className="text-gray-500">Đang tải...</div>
        </div>;
    }

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newPds, setNewPds] = useState({
        vin: "",
        model: "",
        color: "",
        inspectorId: ""
    });

    const handleCreate = async () => {
        if (!newPds.vin || !newPds.model || !newPds.color) {
            toast.error("Vui lòng nhập VIN, dòng xe và màu sắc");
            return;
        }

        try {
            const result = await SalesService.createPDS({
                ...newPds,
                inspectorId: newPds.inspectorId || undefined
            });

            if (result.success) {
                toast.success("Tạo yêu cầu PDS thành công");
                setIsCreateOpen(false);
                setNewPds({
                    vin: "",
                    model: "",
                    color: "",
                    inspectorId: ""
                });
                loadPDS();
            } else {
                toast.error(result.error || "Tạo PDS thất bại");
            }
        } catch (error) {
            toast.error("Lỗi hệ thống");
        }
    };

    return (
        <div className="h-full bg-gray-50/50 p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Kiểm Tra Giao Xe (PDS)</h1>
                    <p className="text-sm text-gray-500 mt-1">Pre-Delivery Service - Kiểm tra trước giao xe (Database: HD_CH_SYS)</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#E60012] hover:bg-[#CC0010]">
                            <Plus className="w-4 h-4 mr-2" /> Tạo Yêu Cầu PDS
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tạo Yêu Cầu PDS Mới</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="vin">Số VIN <span className="text-red-500">*</span></Label>
                                <Input id="vin" placeholder="Nhập số khung..." value={newPds.vin} onChange={(e) => setNewPds({ ...newPds, vin: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="model">Dòng Xe <span className="text-red-500">*</span></Label>
                                <Select value={newPds.model} onValueChange={(val) => setNewPds({ ...newPds, model: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn dòng xe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CR-V">Honda CR-V</SelectItem>
                                        <SelectItem value="City">Honda City</SelectItem>
                                        <SelectItem value="Civic">Honda Civic</SelectItem>
                                        <SelectItem value="HR-V">Honda HR-V</SelectItem>
                                        <SelectItem value="BR-V">Honda BR-V</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="color">Màu Sắc <span className="text-red-500">*</span></Label>
                                <Select value={newPds.color} onValueChange={(val) => setNewPds({ ...newPds, color: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn màu sắc" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="White">Trắng (White)</SelectItem>
                                        <SelectItem value="Black">Đen (Black)</SelectItem>
                                        <SelectItem value="Red">Đỏ (Red)</SelectItem>
                                        <SelectItem value="Blue">Xanh (Blue)</SelectItem>
                                        <SelectItem value="Silver">Bạc (Silver)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="inspector">Kiểm Tra Viên (Optional)</Label>
                                <Select value={newPds.inspectorId} onValueChange={(val) => setNewPds({ ...newPds, inspectorId: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn KTV" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user-tech-1">Nguyễn Văn A</SelectItem>
                                        <SelectItem value="user-tech-2">Trần Văn B</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleCreate} className="w-full mt-2 bg-[#E60012] hover:bg-[#CC0010]">Tạo Yêu Cầu</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm VIN, dòng xe..."
                            className="pl-9 bg-gray-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead>VIN</TableHead>
                            <TableHead>Dòng Xe</TableHead>
                            <TableHead>Màu</TableHead>
                            <TableHead>Kiểm Tra Viên</TableHead>
                            <TableHead>Ngày Tạo</TableHead>
                            <TableHead>Trạng Thái</TableHead>
                            <TableHead>Thao Tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPDS.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    Chưa có yêu cầu PDS nào
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPDS.map((pds) => (
                                <TableRow key={pds.id} className="hover:bg-gray-50">
                                    <TableCell className="font-mono text-sm font-medium">{pds.vin}</TableCell>
                                    <TableCell>{pds.model}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: pds.color.toLowerCase() }}></div>
                                            {pds.color}
                                        </div>
                                    </TableCell>
                                    <TableCell>{pds.inspector?.name || 'Chưa phân'}</TableCell>
                                    <TableCell>{new Date(pds.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                    <TableCell>{getStatusBadge(pds.status)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button size="sm" variant="ghost" onClick={() => handleUpdateStatus(pds.id, 'IN_PROGRESS')}>
                                                <Clock className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="text-green-600" onClick={() => handleUpdateStatus(pds.id, 'PASSED')}>
                                                <CheckCircle className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleUpdateStatus(pds.id, 'FAILED')}>
                                                <XCircle className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="text-orange-600" onClick={() => handleUpdateStatus(pds.id, 'REWORK')}>
                                                <AlertTriangle className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <div className="p-4 border-t border-gray-100 text-sm text-gray-500">
                    Hiển thị {filteredPDS.length} yêu cầu PDS từ database
                </div>
            </div>
        </div>
    );
}
