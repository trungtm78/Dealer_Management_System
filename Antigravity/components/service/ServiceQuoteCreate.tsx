"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Plus, Trash2, Printer, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SmartSelect } from "@/components/SmartSelect";
import type { SelectDataSource } from "@/types/smart-select";
import { toast } from "sonner";
import { CustomerSearch } from "@/components/common/CustomerSearch";
import { PartDTO } from "@/lib/types/inventory";

interface SelectedPart extends PartDTO {
    selectedQuantity: number;
}

const laborMaster = [
    { id: 'l1', name: 'Thay dầu máy', price: 150000, hour: 0.5 },
    { id: 'l2', name: 'Bảo dưỡng định kỳ 10.000km', price: 450000, hour: 1.5 },
    { id: 'l3', name: 'Cân bằng bánh', price: 80000, hour: 0.3 },
    { id: 'l4', name: 'Thay lốp xe', price: 300000, hour: 0.8 },
];

export default function ServiceQuoteCreate() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [customerId, setCustomerId] = useState<string | undefined>(undefined);
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [vehicleModelId, setVehicleModelId] = useState<number | null>(null);
    const [plateNumber, setPlateNumber] = useState("");
    const [advisor, setAdvisor] = useState("usr-admin");

    const [selectedLabors, setSelectedLabors] = useState<any[]>([]);
    const [selectedParts, setSelectedParts] = useState<SelectedPart[]>([]);

    const [partsMaster, setPartsMaster] = useState<PartDTO[]>([]);

    const vehicleModelDataSource: SelectDataSource = {
        search: async (req) => {
            const res = await fetch('/api/shared/search/vehicle-models', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req)
            });
            return res.json();
        }
    };

    useEffect(() => {
        const loadParts = async () => {
            try {
                const res = await fetch('/api/inventory/parts');
                const data = await res.json();
                setPartsMaster(data.data || []);
            } catch (e) {
                console.error("Failed to load parts", e);
            }
        };
        loadParts();
    }, []);

    const handleAddLabor = (laborId: string) => {
        const labor = laborMaster.find((l: any) => l.id === laborId);
        if (labor && !selectedLabors.some((l: any) => l.id === laborId)) {
            setSelectedLabors([...selectedLabors, {
                id: labor.id,
                name: labor.name,
                laborCost: labor.price,
                hours: labor.hour
            }]);
        }
    };

    const handleAddPart = (partId: string) => {
        const part = partsMaster.find((p: PartDTO) => p.id === partId);
        if (part) {
            const existing = selectedParts.find((p: SelectedPart) => p.id === partId);
            if (existing) {
                setSelectedParts(selectedParts.map((p: SelectedPart) =>
                    p.id === partId ? { ...p, selectedQuantity: p.selectedQuantity + 1 } : p
                ));
            } else {
                setSelectedParts([...selectedParts, {
                    ...part,
                    selectedQuantity: 1
                }]);
            }
        }
    };

    const removeLabor = (id: string) => {
        setSelectedLabors(selectedLabors.filter((l: any) => l.id !== id));
    };

    const removePart = (id: string) => {
        setSelectedParts(selectedParts.filter((p: SelectedPart) => p.id !== id));
    };

    const updatePartQty = (id: string, qty: number) => {
        if (qty < 1) return;
        setSelectedParts(selectedParts.map((p: SelectedPart) =>
            p.id === id ? { ...p, selectedQuantity: qty } : p
        ));
    };

    const totalLabor = selectedLabors.reduce((sum, l: any) => sum + l.laborCost, 0);
    const totalParts = selectedParts.reduce((sum, p: SelectedPart) => sum + (p.selectedQuantity * p.price), 0);
    const subTotal = totalLabor + totalParts;
    const vat = subTotal * 0.1;
    const grandTotal = subTotal + vat;

    const formatPrice = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    const handleSubmit = async () => {
        if (!customerId || !plateNumber) {
            toast.error("Vui lòng nhập thông tin khách hàng và biển số xe");
            return;
        }

        setIsLoading(true);
        try {
            const result = await fetch('/api/service/quotations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: customerId,
                    advisorId: advisor,
                    vehicleInfo: {
                        vehicleModelId: vehicleModelId,
                        plateNumber: plateNumber
                    },
                    services: selectedLabors,
                    parts: selectedParts,
                    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    notes: 'Created via Web App'
                })
            });

            if (result.ok) {
                toast.success("Tạo báo giá dịch vụ thành công!");
                router.push('/service/quotations');
            } else {
                const error = await result.json();
                toast.error("Lỗi: " + (error.error || "Không thể tạo báo giá dịch vụ"));
            }
        } catch (error) {
            console.error('Error creating service quote:', error);
            toast.error('Có lỗi xảy ra');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">Tạo Báo Giá Dịch Vụ Mới</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? 'Đang lưu...' : (
                                <>
                                    <Save className="w-4 h-4 mr-2" /> Lưu Báo Giá
                                </>
                            )}
                        </Button>
                        <Button variant="outline" onClick={() => window.print()}>
                            <Printer className="w-4 h-4 mr-2" /> In Báo Giá
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Thông tin Khách hàng</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label>Khách hàng *</Label>
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Số điện thoại</Label>
                                        <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="09xx..." />
                                    </div>
                                    <div>
                                        <Label>Biển số xe</Label>
                                        <Input value={plateNumber} onChange={e => setPlateNumber(e.target.value)} placeholder="99A-12345" />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Thông tin Xe</h3>
                            <div className="space-y-4">
                                <div>
                                    <SmartSelect
                                        dataSource={vehicleModelDataSource}
                                        value={vehicleModelId}
                                        onChange={(id, item) => {
                                            setVehicleModelId(id as number | null);
                                        }}
                                        label="Dòng xe"
                                        placeholder="Chọn dòng xe..."
                                        required
                                        context={{ onlyActive: true }}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </Card>

                        <div className="space-y-4">
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Dịch vụ</h3>
                                <div className="mb-4">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-24">Tên dịch vụ</TableHead>
                                                <TableHead className="w-16">Giá</TableHead>
                                                <TableHead className="w-16">Giờ</TableHead>
                                                <TableHead className="w-16">Thành tiền</TableHead>
                                                <TableHead className="w-10">Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {laborMaster.map(labor => (
                                                <TableRow key={labor.id}>
                                                    <TableCell>{labor.name}</TableCell>
                                                    <TableCell>{formatPrice(labor.price)}</TableCell>
                                                    <TableCell>{labor.hour}</TableCell>
                                                    <TableCell>{formatPrice(labor.price * labor.hour)}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleAddLabor(labor.id)}
                                                            disabled={selectedLabors.some((l: any) => l.id === labor.id)}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Phụ tùng</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-40">Mã phụ tùng</TableHead>
                                            <TableHead className="w-32">Tên phụ tùng</TableHead>
                                            <TableHead className="w-16">Đơn giá</TableHead>
                                            <TableHead className="w-16">Số lượng</TableHead>
                                            <TableHead className="w-10">Thao tác</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {partsMaster.slice(0, 10).map(part => (
                                            <TableRow key={part.id}>
                                                <TableCell>{part.partNumber}</TableCell>
                                                <TableCell>{part.name}</TableCell>
                                                <TableCell>{formatPrice(part.price)}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAddPart(part.id)}
                                                        disabled={selectedParts.some((p: SelectedPart) => p.id === part.id)}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6 border-t-4 border-t-gray-200">
                            <h3 className="text-lg font-semibold mb-4">Dịch vụ đã chọn</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tên dịch vụ</TableHead>
                                        <TableHead>Giá</TableHead>
                                        <TableHead>Giờ</TableHead>
                                        <TableHead>Thành tiền</TableHead>
                                        <TableHead>Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedLabors.map(labor => (
                                        <TableRow key={labor.id}>
                                            <TableCell>{labor.name}</TableCell>
                                            <TableCell>{formatPrice(labor.price)}</TableCell>
                                            <TableCell>{labor.hour}</TableCell>
                                            <TableCell>{formatPrice(labor.price * labor.hour)}</TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => removeLabor(labor.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {selectedLabors.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                                                Chưa chọn dịch vụ nào
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Phụ tùng đã chọn</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mã phụ tùng</TableHead>
                                        <TableHead>Tên phụ tùng</TableHead>
                                        <TableHead>Đơn giá</TableHead>
                                        <TableHead>Số lượng</TableHead>
                                        <TableHead>Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedParts.map(part => (
                                        <TableRow key={part.id}>
                                            <TableCell>{part.partNumber}</TableCell>
                                            <TableCell>{part.name}</TableCell>
                                            <TableCell>{formatPrice(part.price)}</TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    className="w-20"
                                                    min="1"
                                                    value={selectedParts.find((p: SelectedPart) => p.id === part.id)?.selectedQuantity || ""}
                                                    onChange={(e) => {
                                                        const newQty = parseInt(e.target.value) || 1;
                                                        updatePartQty(part.id, newQty);
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>{formatPrice(part.selectedQuantity * part.price)}</TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => removePart(part.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {selectedParts.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                                                Chưa chọn phụ tùng nào
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Tổng kết</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Dịch vụ:</span>
                                    <span className="font-semibold">{formatPrice(totalLabor)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phụ tùng:</span>
                                    <span className="font-semibold">{formatPrice(totalParts)}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between text-base">
                                    <span className="font-bold">Tổng cộng (chưa VAT):</span>
                                    <span className="font-bold">{formatPrice(subTotal)}</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="font-bold">VAT (10%):</span>
                                    <span className="font-bold text-red-600">{formatPrice(vat)}</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="text-lg font-bold text-gray-900">Tổng cộng (đã bao gồm VAT):</span>
                                    <span className="text-xl font-bold text-[#E60012]">{formatPrice(grandTotal)}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Ghi chú</h3>
                            <Textarea
                                placeholder="Nhập ghi chú về báo giá dịch vụ..."
                                className="min-h-[100px]"
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
