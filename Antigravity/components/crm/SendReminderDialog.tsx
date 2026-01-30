"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Mail, MessageSquare, CheckCircle } from "lucide-react";

interface SendReminderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    type: 'batch' | 'single';
}

export default function SendReminderDialog({ open, onOpenChange, type }: SendReminderDialogProps) {
    const [step, setStep] = useState<'config' | 'sending' | 'done'>('config');
    const [progress, setProgress] = useState(0);
    const [channel, setChannel] = useState("sms");

    const handleSend = () => {
        setStep('sending');
        setProgress(0);

        // Simulate sending progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setStep('done');
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    const handleClose = () => {
        onOpenChange(false);
        setStep('config');
        setProgress(0);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{type === 'batch' ? 'Gửi Nhắc Nhở Hàng Loạt' : 'Gửi Nhắc Nhở Cá Nhân'}</DialogTitle>
                </DialogHeader>

                {step === 'config' && (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Kênh Gửi</Label>
                            <Select value={channel} onValueChange={setChannel}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sms">SMS Brandname</SelectItem>
                                    <SelectItem value="zalo">Zalo OA</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Mẫu Tin Nhắn</Label>
                            <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600 italic">
                                "Chào [Ten_Khach], xe [Bien_So] của Quý khách sắp đến hạn bảo dưỡng [Cap_Bao_Duong]. Vui lòng đặt hẹn..."
                            </div>
                        </div>
                        <div className="p-3 bg-yellow-50 text-yellow-800 text-sm rounded-md border border-yellow-200">
                            Đã chọn: <strong>{type === 'batch' ? '15 khách hàng' : '1 khách hàng'}</strong> sắp đến hạn.
                        </div>
                    </div>
                )}

                {step === 'sending' && (
                    <div className="space-y-6 py-8 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <Mail className="w-8 h-8 text-blue-500 animate-bounce" />
                            <p className="text-gray-600">Đang gửi tin nhắn...</p>
                        </div>
                        <Progress value={progress} className="w-full" />
                        <p className="text-xs text-gray-500">{progress}% hoàn thành</p>
                    </div>
                )}

                {step === 'done' && (
                    <div className="space-y-6 py-8 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                            <p className="text-lg font-semibold text-green-700">Gửi Thành Công!</p>
                            <p className="text-gray-600">Đã gửi tin nhắn đến {type === 'batch' ? '15' : '1'} khách hàng.</p>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {step === 'config' && (
                        <>
                            <Button variant="outline" onClick={handleClose}>Hủy</Button>
                            <Button onClick={handleSend} className="bg-[#E60012] hover:bg-[#c50010]">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Gửi Ngay
                            </Button>
                        </>
                    )}
                    {step === 'done' && (
                        <Button onClick={handleClose} className="w-full">Đóng</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
