"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ServiceBayDTO } from '@/lib/types/service_bay';

interface BayProgressDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bay: ServiceBayDTO | null;
    onSuccess: () => void;
}

export default function BayProgressDialog({ open, onOpenChange, bay, onSuccess }: BayProgressDialogProps) {
    const activeAssignment = bay?.assignments?.[0];
    const [progress, setProgress] = useState(0);
    const [notes, setNotes] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (activeAssignment) {
            setProgress(activeAssignment.progress_percent);
        }
    }, [activeAssignment]);

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/service/bays/${bay?.id}/progress`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    progress_percent: progress,
                    notes,
                    user_id: 'usr-admin'
                })
            });

            const result = await res.json();
            if (result.success) {
                toast.success("Cập nhật tiến độ thành công");
                onSuccess();
                onOpenChange(false);
            } else {
                toast.error("Lỗi: " + result.error.message);
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cập nhật tiến độ công việc - {bay?.name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid gap-4">
                        <div className="flex justify-between">
                            <Label>Tiến độ hoàn thành (%)</Label>
                            <span className="text-sm font-bold text-blue-600">{progress}%</span>
                        </div>
                        <Input 
                            type="range"
                            value={progress} 
                            min={activeAssignment?.progress_percent || 0} 
                            max={100} 
                            step={5} 
                            onChange={(e) => setProgress(Number(e.target.value))}
                            className="h-2 cursor-pointer"
                        />
                        <Input 
                            type="number"
                            value={progress} 
                            min={activeAssignment?.progress_percent || 0} 
                            max={100} 
                            onChange={(e) => setProgress(Number(e.target.value))}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="progress-notes">Ghi chú tiến độ</Label>
                        <Textarea 
                            id="progress-notes" 
                            value={notes} 
                            onChange={e => setNotes(e.target.value)} 
                            placeholder="Mô tả các hạng mục đã xong..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Đóng</Button>
                    <Button onClick={handleUpdate} disabled={isLoading} className="bg-[#E60012] hover:bg-[#c50010]">Lưu cập nhật</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
