"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Building, User, Phone, Mail, Globe, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CustomerDTO } from "@/lib/types/crm";
import { CRMService } from "@/services/crm.service";

interface CustomerFormProps {
    initialData?: CustomerDTO | null;
}

export function CustomerForm({ initialData }: CustomerFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        type: "INDIVIDUAL", // INDIVIDUAL | COMPANY
        phone: "",
        mobile: "",
        email: "",
        website: "",
        vat: "", // Tax ID
        street: "",
        city: "",
        district: "",
        ward: "",
        state: "",
        country: "Việt Nam",
        jobTitle: "",
        notes: "",
        tags: [] as string[],
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                type: initialData.type,
                phone: initialData.phone,
                mobile: initialData.mobile || "",
                email: initialData.email || "",
                website: "", // Need to add to DTO if we want to sync back
                vat: initialData.vat || "",
                street: initialData.street || "",
                city: initialData.city || "",
                district: initialData.district || "",
                ward: initialData.ward || "",
                state: "",
                country: "Việt Nam",
                jobTitle: "",
                notes: "",
                tags: Array.isArray(initialData.tags) 
                    ? initialData.tags 
                    : (typeof initialData.tags === 'string' ? JSON.parse(initialData.tags) : []),
            });
        }
    }, [initialData]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.phone) {
            toast.error("Vui lòng nhập Tên và Số điện thoại");
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                name: formData.name,
                type: formData.type as any, // Cast to CustomerType
                phone: formData.phone,
                mobile: formData.mobile || undefined,
                email: formData.email || undefined,
                street: formData.street || undefined,
                city: formData.city || undefined,
                district: formData.district || undefined,
                ward: formData.ward || undefined,
                state: formData.state || undefined,
                vat: formData.vat || undefined,
                notes: formData.notes || undefined,
                tags: formData.tags
            };

            let result;
            if (initialData?.id) {
                result = await CRMService.updateCustomer(initialData.id, payload);
            } else {
                result = await CRMService.createCustomer(payload);
            }

            if (result.success) {
                toast.success(initialData ? "Cập nhật thành công!" : "Tạo mới thành công!");
                router.push("/crm/customers");
            } else {
                toast.error(result.error || "Có lỗi xảy ra");
            }
        } catch (error) {
            toast.error("Lỗi hệ thống");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {initialData ? `Khách Hàng: ${initialData.name}` : "Đăng Ký Khách Hàng Mới"}
                        </h1>
                    </div>
                    <Button onClick={handleSubmit} disabled={isLoading} className="bg-[#E60012] hover:bg-[#CC0010]">
                        <Save className="w-4 h-4 mr-2" /> Lưu Hồ Sơ
                    </Button>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Main Form Area */}
                    <div className="col-span-12 lg:col-span-9 space-y-6">
                        {/* Top Card: Basic Info similar to Odoo Header */}
                        <Card className="p-6">
                            <div className="flex gap-6">
                                {/* Avatar Placeholder */}
                                <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 shrink-0">
                                    <User className="w-10 h-10" />
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1 w-full max-w-lg">
                                            <Label className="uppercase text-xs text-gray-500 font-bold">Tên khách hàng</Label>
                                            <Input
                                                value={formData.name}
                                                onChange={e => handleChange('name', e.target.value)}
                                                className="text-lg font-semibold h-10"
                                                placeholder="Nhập tên cá nhân hoặc công ty..."
                                            />
                                        </div>
                                        <RadioGroup
                                            value={formData.type}
                                            onValueChange={(val) => handleChange('type', val)}
                                            className="flex gap-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="INDIVIDUAL" id="r1" />
                                                <Label htmlFor="r1" className="cursor-pointer flex items-center gap-1"><User className="w-3 h-3" /> Cá nhân</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="COMPANY" id="r2" />
                                                <Label htmlFor="r2" className="cursor-pointer flex items-center gap-1"><Building className="w-3 h-3" /> Công ty</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {formData.type === 'COMPANY' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Mã Số Thuế (VAT)</Label>
                                                <Input value={formData.vat} onChange={e => handleChange('vat', e.target.value)} placeholder="010..." />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Website</Label>
                                                <div className="relative">
                                                    <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                                    <Input className="pl-8" value={formData.website} onChange={e => handleChange('website', e.target.value)} placeholder="www.example.com" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Notebook Tabs */}
                        <Card className="min-h-[500px]">
                            <Tabs defaultValue="general" className="w-full">
                                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                                    <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#E60012] data-[state=active]:bg-transparent px-6 py-2">
                                        Thông tin chung
                                    </TabsTrigger>
                                    <TabsTrigger value="sales" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#E60012] data-[state=active]:bg-transparent px-6 py-2">
                                        Bán hàng & Mua hàng
                                    </TabsTrigger>
                                    <TabsTrigger value="notes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#E60012] data-[state=active]:bg-transparent px-6 py-2">
                                        Ghi chú
                                    </TabsTrigger>
                                </TabsList>
                                <div className="p-6">
                                    <TabsContent value="general" className="space-y-6 m-0">
                                        <div className="grid grid-cols-2 gap-8">
                                            {/* Left Column: Address */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-gray-800 font-medium">
                                                    <MapPin className="w-4 h-4" /> Địa chỉ
                                                </div>
                                                <div className="space-y-3">
                                                    <Input value={formData.street} onChange={e => handleChange('street', e.target.value)} placeholder="Số nhà, đường phố..." />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Input value={formData.ward} onChange={e => handleChange('ward', e.target.value)} placeholder="Phường / Xã" />
                                                        <Input value={formData.district} onChange={e => handleChange('district', e.target.value)} placeholder="Quận / Huyện" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Input value={formData.city} onChange={e => handleChange('city', e.target.value)} placeholder="Tỉnh / Thành phố" />
                                                        <Input value={formData.country} onChange={e => handleChange('country', e.target.value)} placeholder="Quốc gia" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column: Contact */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-gray-800 font-medium">
                                                    <Phone className="w-4 h-4" /> Liên hệ
                                                </div>
                                                <div className="space-y-3">
                                                    <div>
                                                        <Label className="text-xs">Điện thoại</Label>
                                                        <Input value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Di động</Label>
                                                        <Input value={formData.mobile} onChange={e => handleChange('mobile', e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Email</Label>
                                                        <Input value={formData.email} onChange={e => handleChange('email', e.target.value)} placeholder="name@example.com" />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Tags</Label>
                                                        <div className="flex items-center gap-2">
                                                            <Tag className="w-4 h-4 text-gray-400" />
                                                            <Input
                                                                placeholder="Nhập tag..."
                                                                value={formData.tags.join(', ')}
                                                                onChange={e => handleChange('tags', e.target.value.split(',').map(s => s.trim()))}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="sales" className="m-0">
                                        <div className="text-sm text-gray-500">
                                            Chưa có thông tin bán hàng.
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="notes" className="m-0">
                                        <Textarea
                                            className="h-64"
                                            placeholder="Ghi chú nội bộ về khách hàng này..."
                                            value={formData.notes}
                                            onChange={e => handleChange('notes', e.target.value)}
                                        />
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </Card>
                    </div>

                    {/* Right Sidebar (Optional for stats) */}
                    <div className="col-span-12 lg:col-span-3 space-y-6">
                        {/* Example Odoo-like smart buttons */}
                        <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" className="h-16 flex flex-col items-center justify-center border-dashed">
                                <span className="text-xl font-bold">0</span>
                                <span className="text-xs text-gray-500">Đơn hàng</span>
                            </Button>
                            <Button variant="outline" className="h-16 flex flex-col items-center justify-center border-dashed">
                                <span className="text-xl font-bold">0</span>
                                <span className="text-xs text-gray-500">Báo giá</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
