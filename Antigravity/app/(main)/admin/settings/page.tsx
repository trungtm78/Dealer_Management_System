"use client";

import { useAdmin } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function SettingsPage() {
    const { state, updateSettings } = useAdmin();
    const [formData, setFormData] = useState(state.settings);

    useEffect(() => {
        setFormData(state.settings);
    }, [state.settings]);

    const handleSave = () => {
        updateSettings(formData);
        toast.success("Cập nhật cấu hình hệ thống thành công!");
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Cấu Hình Hệ Thống</h2>
                <p className="text-muted-foreground">Quản lý thông tin đại lý và các tham số vận hành.</p>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Thông Tin Đại Lý</CardTitle>
                        <CardDescription>Thông tin hiển thị trên các báo cáo và chứng từ.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="dealerName">Tên Đại Lý</Label>
                            <Input id="dealerName" value={formData.dealerName} onChange={(e) => setFormData({ ...formData, dealerName: e.target.value })} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Địa Chỉ</Label>
                            <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Hotline</Label>
                                <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Liên Hệ</Label>
                                <Input id="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tham Số Tài Chính</CardTitle>
                        <CardDescription>Cấu hình tiền tệ và thuế suất mặc định.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="taxCode">Mã Số Thuế</Label>
                                <Input id="taxCode" value={formData.taxCode} onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="vat">Thuế GTGT Mặc Định (%)</Label>
                                <Input id="vat" type="number" value={formData.vatRate} onChange={(e) => setFormData({ ...formData, vatRate: Number(e.target.value) })} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="currency">Đơn Vị Tiền Tệ</Label>
                            <Input id="currency" value={formData.currency} disabled className="bg-gray-100" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end bg-gray-50 p-4 border-t rounded-b-lg">
                        <Button className="bg-[#E60012] hover:bg-[#B8000E]" onClick={handleSave}>Lưu Cấu Hình</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
