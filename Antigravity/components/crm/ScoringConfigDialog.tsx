"use client";

import { useState, useEffect, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getSystemSetting, updateSystemSetting } from "@/actions/admin/settings";
import { cookies } from "next/headers";

export type TierConfig = {
    min: number;
    label: string;
    color: string;
};

export type ScoringConfigType = {
    hot: TierConfig;
    warm: TierConfig;
    cold: TierConfig;
};

const DEFAULT_CONFIG: ScoringConfigType = {
    hot: { min: 80, label: "Hot Lead", color: "green" },
    warm: { min: 50, label: "Warm Lead", color: "yellow" },
    cold: { min: 0, label: "Cold Lead", color: "gray" },
};

interface ScoringConfigDialogProps {
    onConfigChange: (config: ScoringConfigType) => void;
}

export default function ScoringConfigDialog({ onConfigChange }: ScoringConfigDialogProps) {
    const [open, setOpen] = useState(false);
    const [config, setConfig] = useState<ScoringConfigType>(DEFAULT_CONFIG);
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);

    // Load from Database on mount
    useEffect(() => {
        async function loadConfig() {
            try {
                const savedConfig = await getSystemSetting('scoring_config');
                if (savedConfig) {
                    const parsedConfig = typeof savedConfig === 'string' ? JSON.parse(savedConfig) : savedConfig;
                    setConfig(parsedConfig as ScoringConfigType);
                    onConfigChange(parsedConfig as ScoringConfigType);
                } else {
                    // First load - use default
                    onConfigChange(DEFAULT_CONFIG);
                }
            } catch (e) {
                console.error("Failed to load config", e);
                onConfigChange(DEFAULT_CONFIG);
            } finally {
                setIsLoading(false);
            }
        }
        loadConfig();
    }, []);

    const handleSave = () => {
        // Validate logic
        if (config.hot.min <= config.warm.min) {
            toast.error("Điểm tối thiểu của Hot Lead phải lớn hơn Warm Lead");
            return;
        }

        startTransition(async () => {
            try {
                // Get current user ID from cookie (set during login)
                const userId = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('user_id='))
                    ?.split('=')[1] || 'system';

                const result = await updateSystemSetting(
                    'scoring_config',
                    config,
                    userId,
                    'Cấu hình phân loại Lead theo điểm số'
                );

                if (result.success) {
                    onConfigChange(config);
                    setOpen(false);
                    toast.success("Đã lưu cấu hình phân loại");
                } else {
                    toast.error("Lưu thất bại: " + result.error);
                }
            } catch (error) {
                console.error("Failed to save config:", error);
                toast.error("Có lỗi xảy ra khi lưu cấu hình");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Settings2 className="w-4 h-4" /> Cấu hình phân loại
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Cấu Hình Phân Loại Khách Hàng</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    {/* Hot Lead */}
                    <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <h4 className="font-bold text-green-700">Mức 1 (Cao nhất)</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs">Tên nhãn hiển thị <span className="text-red-500">(*)</span></Label>
                                <Input
                                    value={config.hot.label}
                                    onChange={(e) => setConfig({ ...config, hot: { ...config.hot, label: e.target.value } })}
                                    className="bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Điểm tối thiểu (&ge;) <span className="text-red-500">(*)</span></Label>
                                <Input
                                    type="number"
                                    value={config.hot.min}
                                    onChange={(e) => setConfig({ ...config, hot: { ...config.hot, min: parseInt(e.target.value) || 0 } })}
                                    className="bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Warm Lead */}
                    <div className="space-y-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <h4 className="font-bold text-yellow-700">Mức 2 (Tiềm năng)</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs">Tên nhãn hiển thị <span className="text-red-500">(*)</span></Label>
                                <Input
                                    value={config.warm.label}
                                    onChange={(e) => setConfig({ ...config, warm: { ...config.warm, label: e.target.value } })}
                                    className="bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Điểm tối thiểu (&ge;) <span className="text-red-500">(*)</span></Label>
                                <Input
                                    type="number"
                                    value={config.warm.min}
                                    onChange={(e) => setConfig({ ...config, warm: { ...config.warm, min: parseInt(e.target.value) || 0 } })}
                                    className="bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cold Lead */}
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100 opacity-80">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                            <h4 className="font-bold text-gray-700">Mức 3 (Thấp)</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs">Tên nhãn hiển thị</Label>
                                <Input
                                    value={config.cold.label}
                                    onChange={(e) => setConfig({ ...config, cold: { ...config.cold, label: e.target.value } })}
                                    className="bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Điểm tối thiểu (&ge;)</Label>
                                <Input
                                    type="number"
                                    value={config.cold.min}
                                    disabled // Always 0
                                    className="bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>Hủy</Button>
                    <Button onClick={handleSave} className="bg-[#E60012] hover:bg-[#c50010]" disabled={isPending}>
                        {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Lưu Cấu Hình
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
