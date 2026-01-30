import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

import { addLeadActivity } from "@/actions/crm/leads";

interface ScheduleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onScheduled: () => void;
    leadId: string;
}

export function ScheduleDialog({ open, onOpenChange, onScheduled, leadId }: ScheduleDialogProps) {
    const [type, setType] = useState("call");
    const [date, setDate] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!date) {
            toast.error("Vui lòng chọn ngày giờ");
            return;
        }

        setLoading(true);

        // Map type to Interaction Type
        // Note: Generic addLeadActivity accepts string type.
        // We'll format the content to include the schedule date.
        const formattedDate = new Date(date).toLocaleString('vi-VN');
        const activityType = type === 'meeting' ? 'MEETING' : type === 'email' ? 'EMAIL' : 'CALL';
        const content = `[Lên lịch] ${type === 'call' ? 'Gọi điện' : type === 'meeting' ? 'Gặp mặt' : 'Gửi Email'} vào lúc ${formattedDate}. Ghi chú: ${note}`;

        const res = await addLeadActivity(leadId, activityType, content);

        if (res.success) {
            toast.success(`Đã lên lịch ${type === 'call' ? 'Gọi điện' : type === 'meeting' ? 'Gặp mặt' : 'Email'} thành công!`);
            onScheduled(); // Triggers refresh
            onOpenChange(false);
            // Reset form
            setDate("");
            setNote("");
        } else {
            toast.error("Lỗi khi lưu lịch hẹn");
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Lên lịch hoạt động</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="type">Loại hoạt động</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="call">📞 Gọi điện</SelectItem>
                                <SelectItem value="meeting">📅 Gặp mặt</SelectItem>
                                <SelectItem value="email">✉️ Gửi Email</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="date">Thời gian</Label>
                        <Input
                            id="date"
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="note">Ghi chú</Label>
                        <Textarea
                            id="note"
                            placeholder="Nhập nội dung ghi chú..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Huỷ</Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-[#E60012] hover:bg-[#cc0010]">
                        {loading ? "Đang lưu..." : "Lưu lịch hẹn"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
