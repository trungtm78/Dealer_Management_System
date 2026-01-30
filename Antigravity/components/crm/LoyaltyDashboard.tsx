"use client";

import { useState } from "react";
import { Award, Gift, Star, Search, TrendingUp, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerDTO, LoyaltyTier } from "@/lib/types/crm";
import { updateCustomerTier } from "@/actions/crm/loyalty";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface LoyaltyDashboardProps {
    initialCustomers: CustomerDTO[];
}

const getTierStyle = (tier: LoyaltyTier) => {
    switch (tier) {
        case 'PLATINUM': return {
            bg: 'bg-gradient-to-br from-slate-900 to-slate-700',
            text: 'text-white',
            icon: '💎'
        };
        case 'GOLD': return {
            bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
            text: 'text-white',
            icon: '🥇'
        };
        default: return {
            bg: 'bg-gradient-to-br from-gray-200 to-gray-400',
            text: 'text-gray-800',
            icon: '🥈'
        };
    }
}

export default function LoyaltyDashboard({ initialCustomers }: LoyaltyDashboardProps) {
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDTO | null>(initialCustomers.length > 0 ? initialCustomers[0] : null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
    const [targetTier, setTargetTier] = useState<LoyaltyTier>('SILVER');

    // Use derived state for display to reflect updates immediately if re-render happens with new props, 
    // but typically we need to update local state or rely on router refresh. 
    // Next.js router.refresh() (called by revalidatePath) will update props.
    // However, selectedCustomer is local state. We might need to update it manually or sync it.

    // Simple approach: When props change, if selected matches, update it? 
    // For now, just rely on the action success.

    const filteredCustomers = initialCustomers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    const tierStyle = selectedCustomer ? getTierStyle(selectedCustomer.tier) : getTierStyle('SILVER');

    const handleUpgrade = async () => {
        if (!selectedCustomer) return;

        const res = await updateCustomerTier(selectedCustomer.id, targetTier);
        if (res.success) {
            toast.success(`Đã cập nhật hạng thành viên lên ${targetTier}`);
            setIsUpgradeOpen(false);
            // Updating local state to reflect change immediately while waiting for server re-render
            setSelectedCustomer({
                ...selectedCustomer,
                tier: targetTier
            });
        } else {
            toast.error("Không thể cập nhật hạng thành viên");
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Loyalty Program</h1>
                    <p className="text-gray-500 text-sm">Quản lý hạng thành viên và đổi điểm thưởng</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Gift className="w-4 h-4 mr-2" /> Quản Lý Voucher</Button>
                    <Button
                        className="bg-[#E60012] hover:bg-[#c50010]"
                        onClick={() => {
                            if (selectedCustomer) {
                                setTargetTier(selectedCustomer.tier);
                                setIsUpgradeOpen(true);
                            } else {
                                toast.info("Vui lòng chọn khách hàng");
                            }
                        }}
                    >
                        <Award className="w-4 h-4 mr-2" /> Nâng Hạng Thủ Công
                    </Button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">

                {/* Left: Customer List */}
                <Card className="col-span-1 flex flex-col border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Tìm thành viên (Tên, SĐT)..."
                                className="pl-9 bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {filteredCustomers.map(cus => (
                            <div
                                key={cus.id}
                                onClick={() => setSelectedCustomer(cus)}
                                className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all ${selectedCustomer?.id === cus.id ? 'bg-red-50 border border-red-100' : 'hover:bg-gray-50 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm ${getTierStyle(cus.tier).bg} text-white`}>
                                        {getTierStyle(cus.tier).icon}
                                    </div>
                                    <div>
                                        <p className={`font-semibold text-sm ${selectedCustomer?.id === cus.id ? 'text-[#E60012]' : 'text-gray-800'}`}>{cus.name}</p>
                                        <p className="text-xs text-gray-500">{cus.phone}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600 text-sm">{cus.points.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Right: Detail View */}
                <div className="col-span-2 flex flex-col gap-6 overflow-y-auto pr-2">
                    {selectedCustomer ? (
                        <>
                            {/* Virtual Card */}
                            <div className={`w-full max-w-md mx-auto aspect-video rounded-2xl shadow-xl p-6 relative overflow-hidden flex flex-col justify-between ${tierStyle.bg} ${tierStyle.text}`}>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-20 pointer-events-none"></div>

                                <div className="flex justify-between items-start z-10">
                                    <div>
                                        <h3 className="font-bold text-lg tracking-widest uppercase opacity-90">Honda Member</h3>
                                        <p className="text-xs opacity-70">Vietnam Official</p>
                                    </div>
                                    <div className="text-2xl">{tierStyle.icon}</div>
                                </div>

                                <div className="z-10">
                                    <p className="text-2xl font-mono tracking-widest mb-1 shadow-black/10 drop-shadow-md">
                                        •••• •••• •••• {selectedCustomer.phone.slice(-4)}
                                    </p>
                                    <div className="flex justify-between items-end mt-4">
                                        <div>
                                            <p className="text-[10px] uppercase opacity-60">Thành viên</p>
                                            <p className="font-semibold">{selectedCustomer.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase opacity-60">Hạng</p>
                                            <p className="font-bold tracking-wide">{selectedCustomer.tier}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats & Actions */}
                            <div className="grid grid-cols-3 gap-4">
                                <Card className="p-4 flex items-center gap-3 border-green-200 bg-green-50">
                                    <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700">
                                        <Star className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Điểm khả dụng</p>
                                        <p className="text-xl font-bold text-green-700">{selectedCustomer.points.toLocaleString()}</p>
                                    </div>
                                </Card>
                                <Card className="p-4 flex items-center gap-3 border-blue-200 bg-blue-50">
                                    <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Tổng tích lũy</p>
                                        <p className="text-xl font-bold text-blue-700">{selectedCustomer.total_points ? selectedCustomer.total_points.toLocaleString() : '0'}</p>
                                    </div>
                                </Card>
                                <Card className="p-4 flex items-center gap-3 border-purple-200 bg-purple-50">
                                    <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Đã chi tiêu</p>
                                        <p className="text-xl font-bold text-purple-700">--</p>
                                    </div>
                                </Card>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-400">Chọn thành viên để xem chi tiết</div>
                    )}
                </div>
            </div>

            {/* Upgrade Dialog */}
            <Dialog open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nâng Hạng Thủ Công</DialogTitle>
                        <DialogDescription>
                            Thay đổi hạng thành viên cho khách hàng <strong>{selectedCustomer?.name}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Chọn Hạng Mới</label>
                            <Select value={targetTier} onValueChange={(v) => setTargetTier(v as LoyaltyTier)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SILVER">SILVER (Bạc)</SelectItem>
                                    <SelectItem value="GOLD">GOLD (Vàng)</SelectItem>
                                    <SelectItem value="PLATINUM">PLATINUM (Bạch Kim)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUpgradeOpen(false)}>Hủy</Button>
                        <Button className="bg-[#E60012] hover:bg-[#c50010]" onClick={handleUpgrade}>Cập Nhật</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
