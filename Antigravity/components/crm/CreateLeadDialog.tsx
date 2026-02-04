"use client"

import { useState } from "react"
import {
    Plus,
    User,
    Phone,
    Mail,
    MapPin,
    Car,
    Calendar,
    CreditCard,
    Briefcase,
    Tag,
    Save
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { SmartSelect } from "@/components/SmartSelect";
import type { SelectDataSource } from "@/types/smart-select";
import { toast } from "sonner"
import { validateLeadForm } from "@/lib/utils/validations"
import { CRMService } from "@/services/crm.service"
import { LeadSource } from "@/lib/types/crm"

interface CreateLeadDialogProps {
    onLeadCreated?: () => void;
}

export function CreateLeadDialog({ onLeadCreated }: CreateLeadDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [vehicleModelId, setVehicleModelId] = useState<number | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        // General
        name: "",
        phone: "",
        email: "",
        address: "",
        source: "WALK_IN",

        // Vehicle Interest

        // Vehicle Interest
        model: "",
        version: "",
        color: "",
        testDrive: false,
        testDriveDate: "",

        // Qualification
        type: "individual",
        paymentMethod: "cash",
        budget: 0,
        timeframe: "1_month",
        tradeIn: false,
        tradeInCar: "",

        notes: ""
    })

    const handleSave = async () => {
        // Validation Check
        const validation = validateLeadForm({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            source: formData.source,
            model: formData.model
        });

        if (!validation.isValid) {
            // Show errors (First error found for simplicity in this toast-based UI)
            const firstErrorKey = Object.keys(validation.errors)[0];
            toast.error(validation.errors[firstErrorKey]);
            return;
        }

        setIsLoading(true)

        const result = await CRMService.createLead({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            source: formData.source as LeadSource,
            modelInterest: formData.model,
            modelVersion: formData.version,
            budget: formData.budget,
            customerType: formData.type,
            address: formData.address,
            notes: formData.notes,
        });

        if (result.success) {
            toast.success("Đã tạo Lead mới thành công!");
            setOpen(false);

            // Reset form
            setFormData({
                name: "", phone: "", email: "", address: "", source: "WALK_IN",
                model: "", version: "", color: "", testDrive: false, testDriveDate: "",
                type: "individual", paymentMethod: "cash", budget: 0, timeframe: "1_month",
                tradeIn: false, tradeInCar: "", notes: ""
            });

            // Trigger Parent Refresh
            if (onLeadCreated) {
                onLeadCreated();
            }
        } else {
            toast.error("Lỗi khi tạo Lead: " + result.error);
        }

        setIsLoading(false)
    }

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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#E60012] hover:bg-[#cc0010]">
                    <Plus className="mr-2 h-4 w-4" /> Tạo Lead Mới
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tạo Lead Mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin chi tiết khách hàng tiềm năng. Các trường có dấu * là bắt buộc.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="general" className="w-full mt-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="general">Thông Tin Chung</TabsTrigger>
                        <TabsTrigger value="vehicle">Nhu Cầu Xe</TabsTrigger>
                        <TabsTrigger value="qualification">Phân Loại & Tiềm Năng</TabsTrigger>
                    </TabsList>

                    {/* TAB 1: GENERAL INFO */}
                    <TabsContent value="general" className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2"><User className="w-4 h-4" /> Tên Khách Hàng <span className="text-red-500">(*)</span></Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="w-4 h-4" /> Số Điện Thoại <span className="text-red-500">(*)</span></Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="0912..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
                                <Input
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="example@gmail.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="source" className="flex items-center gap-2"><Tag className="w-4 h-4" /> Nguồn Lead</Label>
                                <Select
                                    value={formData.source}
                                    onValueChange={(val) => setFormData({ ...formData, source: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn nguồn" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="WALK_IN">Showroom Walk-in</SelectItem>
                                        <SelectItem value="WEBSITE">Website / Fanpage</SelectItem>
                                        <SelectItem value="OTHER">Sự kiện lái thử</SelectItem>
                                        <SelectItem value="REFERRAL">Giới thiệu (Referral)</SelectItem>
                                        <SelectItem value="HOTLINE">Telesale</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="address" className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Địa Chỉ</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Số 123, Đường ABC, Quận XYZ..."
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB 2: VEHICLE INTEREST */}
                    <TabsContent value="vehicle" className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <SmartSelect
                                    dataSource={vehicleModelDataSource}
                                    value={vehicleModelId}
                                    onChange={(id, item) => {
                                        setVehicleModelId(id as number | null);
                                        if (item) {
                                            setFormData({ ...formData, model: item.label || "" });
                                        } else {
                                            setFormData({ ...formData, model: "" });
                                        }
                                    }}
                                    label="Dòng xe"
                                    placeholder="Chọn dòng xe..."
                                    required
                                    context={{ onlyActive: true }}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phiên Bản (Trim)</Label>
                                <Select
                                    value={formData.version}
                                    onValueChange={(val) => setFormData({ ...formData, version: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn phiên bản" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="g">G</SelectItem>
                                        <SelectItem value="l">L</SelectItem>
                                        <SelectItem value="rs">RS</SelectItem>
                                        <SelectItem value="e">E (Hybrid)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Màu Sắc Ưa Thích</Label>
                                <RadioGroup
                                    value={formData.color}
                                    onValueChange={(val) => setFormData({ ...formData, color: val })}
                                    className="flex gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="white" id="white" className="bg-white border-gray-400" />
                                        <Label htmlFor="white">Trắng</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="black" id="black" className="bg-black border-black text-white" />
                                        <Label htmlFor="black">Đen</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="red" id="red" className="bg-red-600 border-red-600 text-white" />
                                        <Label htmlFor="red">Đỏ</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="gray" id="gray" className="bg-gray-500 border-gray-500 text-white" />
                                        <Label htmlFor="gray">Xám</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="col-span-2 border rounded-lg p-4 bg-gray-50 flex flex-col gap-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="testDrive"
                                        checked={formData.testDrive}
                                        onCheckedChange={(c) => setFormData({ ...formData, testDrive: c as boolean })}
                                    />
                                    <Label htmlFor="testDrive" className="font-semibold text-gray-900">Khách hàng muốn lái thử?</Label>
                                </div>
                                {formData.testDrive && (
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <Label htmlFor="testDate" className="mb-2 block text-sm">Thời gian dự kiến</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input
                                                id="testDate"
                                                type="date"
                                                className="pl-9"
                                                value={formData.testDriveDate}
                                                onChange={(e) => setFormData({ ...formData, testDriveDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB 3: QUALIFICATION */}
                    <TabsContent value="qualification" className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> Loại Khách Hàng</Label>
                                <RadioGroup
                                    defaultValue="individual"
                                    value={formData.type}
                                    onValueChange={(v) => setFormData({ ...formData, type: v })}
                                    className="flex gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="individual" id="r1" />
                                        <Label htmlFor="r1">Cá nhân</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="company" id="r2" />
                                        <Label htmlFor="r2">Công ty</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> Hình Thức Thanh Toán</Label>
                                <Select
                                    value={formData.paymentMethod}
                                    onValueChange={(v) => setFormData({ ...formData, paymentMethod: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Tiền mặt (100%)</SelectItem>
                                        <SelectItem value="bank">Vay ngân hàng</SelectItem>
                                        <SelectItem value="leasing">Thuê mua tài chính</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Ngân Sách Dự Kiến (VNĐ)</Label>
                                <CurrencyInput
                                    placeholder="0"
                                    value={formData.budget}
                                    onChange={(val) => setFormData({ ...formData, budget: val })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Thời Gian Dự Kiến Mua</Label>
                                <Select
                                    value={formData.timeframe}
                                    onValueChange={(v) => setFormData({ ...formData, timeframe: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="immediate">Ngay trong tháng</SelectItem>
                                        <SelectItem value="1_month">1-2 tháng tới</SelectItem>
                                        <SelectItem value="3_months">3-6 tháng tới</SelectItem>
                                        <SelectItem value="unknown">Chưa xác định</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-span-2 space-y-2 border-t pt-4 mt-2">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Checkbox
                                        id="tradeIn"
                                        checked={formData.tradeIn}
                                        onCheckedChange={(c) => setFormData({ ...formData, tradeIn: c as boolean })}
                                    />
                                    <Label htmlFor="tradeIn" className="font-semibold text-gray-700">Có xe cũ cần thu đổi (Trade-in)?</Label>
                                </div>
                                {formData.tradeIn && (
                                    <Input
                                        placeholder="Nhập thông tin xe: Hãng, Dòng xe, Năm SX, ODO..."
                                        value={formData.tradeInCar}
                                        onChange={(e) => setFormData({ ...formData, tradeInCar: e.target.value })}
                                    />
                                )}
                            </div>

                            <div className="col-span-2 space-y-2">
                                <Label>Ghi Chú Thêm</Label>
                                <Textarea
                                    placeholder="Ghi chú về sở thích, tính cách khách hàng..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>Hủy Bỏ</Button>
                    <Button onClick={handleSave} className="bg-[#E60012] hover:bg-[#cc0010]" disabled={isLoading}>
                        {isLoading ? "Đang lưu..." : <><Save className="w-4 h-4 mr-2" /> Lưu Lead</>}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
