"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CampaignDTO, CampaignType } from "@/lib/types/crm";
import { toast } from "sonner";

interface CreateCampaignDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (campaign: CampaignDTO) => void;
}

export default function CreateCampaignDialog({ open, onOpenChange, onSave }: CreateCampaignDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [type, setType] = useState<CampaignType>("SMS");
    const [budget, setBudget] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSave = async () => {
        if (!name || !startDate || !endDate || !budget) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newCampaign: CampaignDTO = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            type,
            status: "DRAFT",
            startDate,
            endDate,
            targetSegment: "All Customers",
            audienceSize: 1000, // Mock default
            budget: Number(budget),
            spent: 0,
            sent: 0,
            opened: 0,
            clicked: 0,
            converted: 0
        };

        onSave(newCampaign);
        toast.success("Đã tạo chiến dịch thành công");
        setIsLoading(false);
        onOpenChange(false);

        // Reset form
        setName("");
        setBudget("");
        setStartDate("");
        setEndDate("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tạo Chiến Dịch Mới</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Tên chiến dịch
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            placeholder="VD: Khuyến mãi Tết 2026"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Kênh
                        </Label>
                        <Select value={type} onValueChange={(v) => setType(v as CampaignType)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn kênh" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SMS">SMS Brandname</SelectItem>
                                <SelectItem value="EMAIL">Email Marketing</SelectItem>
                                <SelectItem value="ZALO">Zalo OA</SelectItem>
                                <SelectItem value="FACEBOOK">Facebook Ads</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="budget" className="text-right">
                            Ngân sách
                        </Label>
                        <Input
                            id="budget"
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="col-span-3"
                            placeholder="VNĐ"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="start" className="text-right">
                            Bắt đầu
                        </Label>
                        <Input
                            id="start"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="end" className="text-right">
                            Kết thúc
                        </Label>
                        <Input
                            id="end"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
                    <Button onClick={handleSave} disabled={isLoading} className="bg-[#E60012] hover:bg-[#c50010]">
                        {isLoading ? "Đang tạo..." : "Lưu Chiến Dịch"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
