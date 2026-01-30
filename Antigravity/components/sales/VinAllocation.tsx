"use client";

import { useState } from "react";
import { Search, Filter, Car, CheckCircle, Clock } from "lucide-react";
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

import { SalesService, Allocation, InventoryItem } from "@/services/sales-service";
import { useEffect } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function VinAllocation() {
    const [searchTerm, setSearchTerm] = useState("");
    const [allocations, setAllocations] = useState<Allocation[]>([]);
    const [selectedContract, setSelectedContract] = useState<string | null>(null);
    const [availableVins, setAvailableVins] = useState<InventoryItem[]>([]);
    const [selectedVin, setSelectedVin] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const loadData = () => {
        setAllocations(SalesService.getAllocations());
        setAvailableVins(SalesService.getInventory().filter(i => i.status === 'AVAILABLE'));
    }

    useEffect(() => {
        loadData();
    }, []);

    const handleAssignVin = () => {
        if (!selectedContract || !selectedVin) return;
        SalesService.assignVin(selectedContract, selectedVin);
        SalesService.createPdsRequest(selectedVin, "Honda Vehicle", "White"); // Auto Request PDS
        toast.success("Đã gán VIN thành công và tạo yêu cầu PDS!");
        setIsDialogOpen(false);
        loadData();
    };

    return (
        <div className="h-full bg-gray-50/50 p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Phân Bổ VIN</h1>
                    <p className="text-sm text-gray-500 mt-1">Gán xe (VIN) cho các hợp đồng chờ giao</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-100 flex gap-4 justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm hợp đồng..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã Hợp Đồng</TableHead>
                            <TableHead>Khách Hàng</TableHead>
                            <TableHead>Xe Đặt</TableHead>
                            <TableHead>Màu Sắc</TableHead>
                            <TableHead>Số VIN</TableHead>
                            <TableHead>Ngày Ký</TableHead>
                            <TableHead>Trạng Thái</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allocations.map((item) => (
                            <TableRow key={item.contractId} className="hover:bg-gray-50">
                                <TableCell className="font-medium text-blue-600">{item.contractId}</TableCell>
                                <TableCell className="font-medium">{item.customer}</TableCell>
                                <TableCell>{item.model}</TableCell>
                                <TableCell>{item.color}</TableCell>
                                <TableCell className="font-mono">{item.vin}</TableCell>
                                <TableCell>{item.date}</TableCell>
                                <TableCell>
                                    {item.status === 'PENDING' ? (
                                        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">Chờ Phân Bổ</Badge>
                                    ) : (
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Đã Gán Xe</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {item.status === 'PENDING' && (
                                        <Dialog open={isDialogOpen && selectedContract === item.contractId} onOpenChange={(open) => { setIsDialogOpen(open); if (open) setSelectedContract(item.contractId); }}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" className="bg-[#E60012] hover:bg-[#c50010]">Gán VIN</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Chọn số VIN để gán</DialogTitle>
                                                </DialogHeader>
                                                <div className="py-4 space-y-4">
                                                    <div>
                                                        <p className="font-semibold mb-2">Hợp đồng: {item.contractId}</p>
                                                        <p>Xe: {item.model} - {item.color}</p>
                                                    </div>
                                                    <Select onValueChange={setSelectedVin}>
                                                        <SelectTrigger className={!selectedVin ? "border-red-200" : ""}><SelectValue placeholder="Chọn số VIN phù hợp (*)" /></SelectTrigger>
                                                        <SelectContent>
                                                            {availableVins.length === 0 ? <div className="p-2 text-sm text-gray-500">Không có xe phù hợp</div> :
                                                                availableVins
                                                                    // .filter(v => v.model.includes(item.model.split(' ')[0])) // Filter logic mock (too loose currently)
                                                                    .map(v => (
                                                                        <SelectItem key={v.vin} value={v.vin}>{v.vin} - {v.color} ({v.days} ngày)</SelectItem>
                                                                    ))
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                    <Button
                                                        className="w-full bg-[#E60012]"
                                                        onClick={() => {
                                                            if (!selectedVin) { toast.error("Vui lòng chọn số VIN để phân bổ"); return; }
                                                            handleAssignVin();
                                                        }}
                                                    >
                                                        Xác Nhận
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
