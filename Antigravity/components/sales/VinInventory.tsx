"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Warehouse, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export default function VinInventory() {
    const [searchTerm, setSearchTerm] = useState("");
    const [inventory, setInventory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            const { getVehicles } = await import('@/actions/sales/inventory');
            const data = await getVehicles();
            setInventory(data);
        } catch (error) {
            console.error('Failed to load inventory:', error);
            toast.error('Không thể tải kho xe');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'AVAILABLE': return <Badge className="bg-green-100 text-green-700">Sẵn Sàng</Badge>;
            case 'RESERVED': return <Badge className="bg-yellow-100 text-yellow-700">Đã Giữ</Badge>;
            case 'SOLD': return <Badge className="bg-gray-100 text-gray-700">Đã Bán</Badge>;
            case 'IN_TRANSIT': return <Badge className="bg-blue-100 text-blue-700">Đang Vận Chuyển</Badge>;
            case 'PDS': return <Badge className="bg-purple-100 text-purple-700">Đang PDS</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const filteredData = inventory.filter(i =>
        i.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.model.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tồn Kho Xe (VIN)</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý danh sách xe thực tế trong kho (Database: HD_CH_SYS)</p>
                </div>
                <div className="flex gap-4 items-center bg-white p-2 rounded-lg border shadow-sm">
                    <div className="text-center px-4 border-r">
                        <p className="text-xs text-gray-500">Tổng xe</p>
                        <p className="text-xl font-bold text-blue-600">{inventory.length}</p>
                    </div>
                    <div className="text-center px-4 border-r">
                        <p className="text-xs text-gray-500">Sẵn sàng</p>
                        <p className="text-xl font-bold text-green-600">{inventory.filter(i => i.status === 'AVAILABLE').length}</p>
                    </div>
                    <div className="text-center px-4">
                        <p className="text-xs text-gray-500">Tồn lâu (&gt;30 ngày)</p>
                        <p className="text-xl font-bold text-red-600">{inventory.filter(i => i.daysInStock > 30).length}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-100 flex gap-4 justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm VIN, Model..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" /> Bộ Lọc</Button>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Số VIN</TableHead>
                            <TableHead>Dòng Xe</TableHead>
                            <TableHead>Màu Sắc</TableHead>
                            <TableHead>Số Máy</TableHead>
                            <TableHead>Vị Trí Kho</TableHead>
                            <TableHead>Tồn Kho</TableHead>
                            <TableHead>Trạng Thái</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <AlertCircle className="w-8 h-8 text-gray-400" />
                                        <p>Chưa có xe nào trong kho</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((item) => (
                                <TableRow key={item.id} className="hover:bg-gray-50">
                                    <TableCell className="font-mono font-medium text-blue-600">{item.vin}</TableCell>
                                    <TableCell>{item.model} {item.version}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full border shadow-sm`} style={{ backgroundColor: item.color }}></div>
                                            {item.color}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-gray-500 text-sm">{item.engineNumber || 'N/A'}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <Warehouse className="w-3 h-3 text-gray-400" /> {item.warehouse || 'Chưa phân'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`${item.daysInStock > 30 ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                                            {item.daysInStock} ngày
                                        </span>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <div className="p-4 border-t border-gray-100 text-sm text-gray-500">
                    Hiển thị {filteredData.length} xe từ database
                </div>
            </div>
        </div>
    );
}
