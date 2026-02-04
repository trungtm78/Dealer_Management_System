"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SmartSelect } from "@/components/SmartSelect";
import type { SelectDataSource } from "@/types/smart-select";

interface BayAssignmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bayId: string | null;
    onSuccess: () => void;
}

export default function BayAssignmentDialog({ open, onOpenChange, bayId, onSuccess }: BayAssignmentDialogProps) {
    const [repairOrders, setRepairOrders] = useState<any[]>([]);
    const [selectedRO, setSelectedRO] = useState<number | null>(null);
    const [duration, setDuration] = useState("60");
    const [notes, setNotes] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetch('/api/service/repair-orders')
                .then(res => res.json())
                .then(data => {
                    // Filter for pending ROs that are not yet assigned
                    setRepairOrders(data.filter((ro: any) => ro.status === 'PENDING'));
                });
        }
    }, [open]);

    const repairOrderDataSource: SelectDataSource = {
        search: async (req) => {
            const res = await fetch('/api/shared/search/repair-orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req)
            });
            return res.json();
        }
    };

    const handleAssign = async () => {
        if (!selectedRO) {
            toast.error("Vui lòng chọn lệnh sửa chữa");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/service/bays/${bayId}/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    repair_order_id: String(selectedRO),
                    estimated_duration_minutes: Number(duration),
                    notes,
                    user_id: 'usr-admin' // Mock logged in user
                })
            });

            const result = await res.json();
            if (result.success) {
                toast.success("Điều phối công việc thành công");
                onSuccess();
                onOpenChange(false);
            } else {
                toast.error("Lỗi: " + result.error.message);
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi điều phối");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Điều phối công việc vào khoang</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Chọn Lệnh sửa chữa (Chờ điều phối)</Label>
                        <SmartSelect
                            dataSource={repairOrderDataSource}
                            value={selectedRO}
                            onChange={(id, item) => setSelectedRO(id as number | null)}
                            label="Lệnh Sửa Chữa"
                            placeholder="Chọn RO..."
                            required={true}
                            filter={{ status: "PENDING" }}
                            className="w-full"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="duration">Thời gian dự kiến (phút)</Label>
                        <Input
                            id="duration"
                            type="number"
                            value={duration}
                            onChange={e => setDuration(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Ghi chú điều phối</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Nhập ghi chú cho kỹ thuật viên..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
                    <Button onClick={handleAssign} disabled={isLoading} className="bg-[#E60012] hover:bg-[#c50010]">Bắt đầu thực hiện</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
