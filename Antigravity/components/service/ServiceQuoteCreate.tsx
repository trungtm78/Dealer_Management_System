"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, Printer, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";


// import { PartsService } from "@/services/parts.service"; // REMOVED
// Actually I need to create parts service frontend if not exists, but I recall seeing inventory service.
// Checking actions/inventory/parts.ts, we need a service for it or use VehicleService if it covers it (unlikely).
// Let's assume PartsService needs to be imported or used. 
// Wait, I saw components/inventory/VehicleList.tsx using VehicleService.
// I will create simple PartsService in this file if not exists or use inventory service.
// Let's check if I can import InventoryService.
// For now, I will use a direct fetch or minimal service definition here to avoid too many files.
// BETTER: Check if I can use existing InventoryService or create a new one.
// I'll create a simple helper for parts here for now to save time, or use PartDTO.

import { PartDTO } from "@/lib/types/inventory";
import { toast } from "sonner";
import { CustomerSearch } from "@/components/common/CustomerSearch";
import { ServiceService } from "@/services/service.service";

// Temporary Parts Service helper
const PartsServiceHelper = {
    getParts: async (): Promise<PartDTO[]> => {
        const res = await fetch('/api/inventory/parts'); // Need to ensure this API exists or use server action wrapper
        if (!res.ok) return [];
        return res.json();
    }
};

export default function ServiceQuoteCreate() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [customerId, setCustomerId] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [plateNumber, setPlateNumber] = useState("");
    const [advisor, setAdvisor] = useState("usr-admin"); // Updated from user-1 to a valid seed ID


    // Line Items
    const [selectedLabors, setSelectedLabors] = useState<any[]>([]);
    const [selectedParts, setSelectedParts] = useState<any[]>([]);

    // Master Data
    const [laborMaster, setLaborMaster] = useState<any[]>([
        { id: 'l1', name: 'Thay dầu máy', price: 150000, hour: 0.5 },
        { id: 'l2', name: 'Bảo dưỡng phanh 4 bánh', price: 450000, hour: 1.5 },
        { id: 'l3', name: 'Cân bằng động lốp', price: 200000, hour: 0.8 },
        { id: 'l4', name: 'Thay lọc gió động cơ', price: 50000, hour: 0.2 },
    ]); // Keep mock labor for now as I didn't create labor master backend
    const [partsMaster, setPartsMaster] = useState<PartDTO[]>([]);

    useEffect(() => {
        // Load Parts
        const loadParts = async () => {
            try {
                // Try to fetch from API if exists, or use actions
                const { getParts } = await import('@/actions/inventory/parts');
                const data = await getParts();
                setPartsMaster(data);
            } catch (e) {
                console.error("Failed to load parts", e);
            }
        };
        loadParts();
    }, []);

    const handleAddLabor = (laborId: string) => {
        const labor = laborMaster.find(l => l.id === laborId);
        if (labor && !selectedLabors.some(l => l.id === laborId)) {
            setSelectedLabors([...selectedLabors, {
                id: labor.id,
                name: labor.name,
                laborCost: labor.price,
                hours: labor.hour
            }]);
        }
    };

    const handleAddPart = (partId: string) => {
        const part = partsMaster.find(p => p.id === partId);
        if (part) {
            // Check if already exists, increment qty
            const existing = selectedParts.find(p => p.id === part.id);
            if (existing) {
                setSelectedParts(selectedParts.map(p =>
                    p.id === part.id ? { ...p, quantity: p.quantity + 1 } : p
                ));
            } else {
                setSelectedParts([...selectedParts, {
                    id: part.id,
                    partNumber: part.partNumber,
                    name: part.name,
                    quantity: 1,
                    unitPrice: part.price
                }]);
            }
        }
    };

    const removeLabor = (id: string) => {
        setSelectedLabors(selectedLabors.filter(l => l.id !== id));
    };

    const removePart = (id: string) => {
        setSelectedParts(selectedParts.filter(p => p.id !== id));
    };

    const updatePartQty = (id: string, qty: number) => {
        if (qty < 1) return;
        setSelectedParts(selectedParts.map(p =>
            p.id === id ? { ...p, quantity: qty } : p
        ));
    };

    // Calculations
    const totalLabor = selectedLabors.reduce((sum, l) => sum + l.laborCost, 0);
    const totalParts = selectedParts.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
    const subTotal = totalLabor + totalParts;
    const vat = subTotal * 0.1;
    const grandTotal = subTotal + vat;

    const handleSubmit = async () => {
        if (!customerId || !plateNumber) {
            toast.error("Vui lòng nhập thông tin khách hàng và xe");
            return;
        }

        setIsLoading(true);
        try {
            const result = await ServiceService.createQuote({
                customerId: customerId,
                advisorId: advisor,
                vehicleInfo: {
                    model: vehicleModel,
                    plateNumber: plateNumber
                },
                services: selectedLabors,
                parts: selectedParts,
                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +7 days
                notes: 'Created via Web App'
            });

            if (result.success) {
                toast.success("Tạo báo giá thành công!");
                router.push(`/service/quotations`);
            } else {
                toast.error("Lỗi: " + result.error);
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra");
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">Tạo Báo Giá Dịch Vụ Mới</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={handleSubmit} disabled={isLoading} className="bg-[#E60012] hover:bg-[#CC0010]">
                            <Save className="w-4 h-4 mr-2" /> Lưu Báo Giá
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Left Column: Info & Selection */}
                    <div className="col-span-2 space-y-6">
                        {/* 1. Customer Info */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">1</span>
                                Thông Tin Khách Hàng & Xe
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tên Khách Hàng</Label>
                                    <CustomerSearch
                                        onSelect={(c) => {
                                            setCustomerId(c.id);
                                            setCustomerName(c.name);
                                            if (c.phone) setPhone(c.phone);
                                        }}
                                        placeholder="Tìm khách hàng..."
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Số Điện Thoại</Label>
                                    <Input value={phone} onChange={e => setPhone(e.target.value)} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label>Dòng Xe (Model)</Label>
                                    <Select value={vehicleModel} onValueChange={setVehicleModel}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn dòng xe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Honda CR-V">Honda CR-V</SelectItem>
                                            <SelectItem value="Honda City">Honda City</SelectItem>
                                            <SelectItem value="Honda Civic">Honda Civic</SelectItem>
                                            <SelectItem value="Honda HR-V">Honda HR-V</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Biển Số Xe</Label>
                                    <Input value={plateNumber} onChange={e => setPlateNumber(e.target.value)} placeholder="VD: 30A-123.45" />
                                </div>
                            </div>
                        </Card>

                        {/* 2. Items */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">2</span>
                                Chi Tiết Công Việc & Phụ Tùng
                            </h2>

                            {/* Labor Selection */}
                            <div className="mb-6">
                                <Label className="mb-2 block text-gray-700 font-medium">Thêm Công Việc (Tiền Công)</Label>
                                <Select onValueChange={handleAddLabor}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Tìm kiếm và chọn công việc..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {laborMaster.map(l => (
                                            <SelectItem key={l.id} value={l.id}>
                                                {l.name} - {formatCurrency(l.price)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {selectedLabors.length > 0 && (
                                    <Table className="mt-4 border rounded-md">
                                        <TableHeader>
                                            <TableRow className="bg-gray-50">
                                                <TableHead>Mô tả công việc</TableHead>
                                                <TableHead className="w-[100px]">Giờ công</TableHead>
                                                <TableHead className="text-right">Thành tiền</TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedLabors.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>{item.hours}h</TableCell>
                                                    <TableCell className="text-right">{formatCurrency(item.laborCost)}</TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="sm" onClick={() => removeLabor(item.id)} className="text-red-500 hover:text-red-700">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>

                            {/* Parts Selection */}
                            <div>
                                <Label className="mb-2 block text-gray-700 font-medium">Thêm Phụ Tùng / Vật Tư</Label>
                                <Select onValueChange={handleAddPart}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Tìm kiếm và chọn phụ tùng (theo Tên hoặc Mã)..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {partsMaster.map(p => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.partNumber} - {p.name} (Tồn: {p.quantity || 0})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {selectedParts.length > 0 && (
                                    <Table className="mt-4 border rounded-md">
                                        <TableHeader>
                                            <TableRow className="bg-gray-50">
                                                <TableHead>Mã PT</TableHead>
                                                <TableHead>Tên Phụ Tùng</TableHead>
                                                <TableHead className="w-[100px]">Số lượng</TableHead>
                                                <TableHead className="text-right">Đơn giá</TableHead>
                                                <TableHead className="text-right">Thành tiền</TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedParts.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-mono text-xs">{item.partNumber}</TableCell>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>
                                                        <CurrencyInput
                                                            min={1}
                                                            value={item.quantity}
                                                            onChange={(val) => updatePartQty(item.id, val)}
                                                            className="h-8 w-20"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                                    <TableCell className="text-right font-medium">{formatCurrency(item.unitPrice * item.quantity)}</TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="sm" onClick={() => removePart(item.id)} className="text-red-500 hover:text-red-700">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="col-span-1">
                        <Card className="p-6 sticky top-6">
                            <h2 className="text-lg font-semibold mb-4">Tổng Cộng</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tổng Tiền Công:</span>
                                    <span>{formatCurrency(totalLabor)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tổng Tiền Phụ Tùng:</span>
                                    <span>{formatCurrency(totalParts)}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-semibold text-gray-900">
                                    <span>Thành Tiền (Trước VAT):</span>
                                    <span>{formatCurrency(subTotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>VAT (10%):</span>
                                    <span>{formatCurrency(vat)}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between text-xl font-bold text-[#E60012]">
                                    <span>Tổng Thanh Toán:</span>
                                    <span>{formatCurrency(grandTotal)}</span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div>
                                    <Label className="text-xs text-gray-500">Ghi chú báo giá</Label>
                                    <Textarea placeholder="Nhập ghi chú cho khách hàng..." className="mt-1 h-24" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
