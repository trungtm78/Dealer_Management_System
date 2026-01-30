"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
    Save,
    Trash2,
    History
} from "lucide-react"
import { LeadActivityTimeline } from "./LeadActivityTimeline"
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
import { toast } from "sonner"
import { validateLeadForm } from "@/lib/utils/validations"
import { CRMService } from "@/services/crm.service"
import { LeadDTO, LeadSource } from "@/lib/types/crm"

interface LeadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved: () => void;
    initialData?: LeadDTO | null;
}

export function LeadDialog({ open, onOpenChange, onSaved, initialData }: LeadDialogProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        // General
        name: "",
        phone: "",
        email: "",
        address: "",
        source: "WALK_IN",

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

    // Populate data when editing
    useEffect(() => {
        if (initialData) {
            const data = initialData as any;
            setFormData({
                name: data.name,
                phone: data.phone,
                email: data.email || "",
                address: data.address || "",
                source: data.source,
                model: data.model_interest || "",
                version: data.model_version || "",
                color: data.color || "",
                testDrive: data.is_test_drive || false,
                testDriveDate: data.test_drive_date ? new Date(data.test_drive_date).toISOString().split('T')[0] : "",
                type: data.customer_type || "individual",
                paymentMethod: data.payment_method || "cash",
                budget: data.budget || 0,
                timeframe: data.timeframe || "1_month",
                tradeIn: !!data.trade_in_car,
                tradeInCar: data.trade_in_car || "",
                notes: data.notes || ""
            });

        } else {
            // Reset for new lead
            if (open) {
                setFormData({
                    name: "", phone: "", email: "", address: "", source: "WALK_IN",
                    model: "", version: "", color: "", testDrive: false, testDriveDate: "",
                    type: "individual", paymentMethod: "cash", budget: 0, timeframe: "1_month",
                    tradeIn: false, tradeInCar: "", notes: ""
                });
            }
        }
    }, [initialData, open]);

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

        const payload: any = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            source: formData.source as LeadSource,
            model_interest: formData.model,
            model_version: formData.version,
            budget: formData.budget,
            customer_type: formData.type,
            address: formData.address,
            notes: formData.notes,
        };


        let result;
        if (initialData) {
            result = await CRMService.updateLead(initialData.id, payload);
        } else {
            result = await CRMService.createLead(payload);
        }

        if (result.success) {
            toast.success(initialData ? "Đã cập nhật Lead thành công!" : "Đã tạo Lead mới thành công!");
            onOpenChange(false);
            onSaved();
        } else {
            toast.error("Lỗi: " + result.error);
        }

        setIsLoading(false)
    }

    const handleDelete = async () => {
        if (!initialData) return;
        if (!confirm("Bạn có chắc chắn muốn xóa Lead này không? Hành động này không thể hoàn tác.")) return;

        setIsLoading(true);
        const res = await CRMService.deleteLead(initialData.id);
        if (res.success) {
            toast.success("Đã xóa Lead thành công!");
            onOpenChange(false);
            onSaved();
        } else {
            toast.error("Xóa thất bại: " + res.error);
        }
        setIsLoading(false);
    }

    const handleConvert = async () => {
        if (!initialData) return;
        if (!confirm("Bạn có chắc chắn muốn chuyển đổi Lead này thành Khách Hàng chính thức?")) return;

        setIsLoading(true);
        const res = await CRMService.convertLeadToCustomer(initialData.id);
        if (res.success) {
            toast.success("Chuyển đổi thành công! Đang chuyển hướng đến hồ sơ khách hàng...");
            onOpenChange(false);
            onSaved();
            // Redirect to new customer page
            router.push(`/crm/customers/${res.customerId}`);
        } else {
            toast.error("Chuyển đổi thất bại: " + res.error);
        }
        setIsLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Cập Nhật Thông Tin Lead" : "Tạo Lead Mới"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Chỉnh sửa thông tin khách hàng." : "Nhập thông tin chi tiết khách hàng tiềm năng. Các trường có dấu * là bắt buộc."}
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="general" className="w-full mt-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="general">Thông Tin Chung</TabsTrigger>
                        <TabsTrigger value="vehicle">Nhu Cầu Xe</TabsTrigger>
                        <TabsTrigger value="qualification">Phân Loại & Tiềm Năng</TabsTrigger>
                        <TabsTrigger value="history">Lịch Sử & HĐ</TabsTrigger>
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
                                <Label className="flex items-center gap-2"><Car className="w-4 h-4" /> Dòng Xe Quan Tâm <span className="text-red-500">(*)</span></Label>
                                <Select
                                    value={formData.model}
                                    onValueChange={(val) => setFormData({ ...formData, model: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn dòng xe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="city">Honda City</SelectItem>
                                        <SelectItem value="crv">Honda CR-V</SelectItem>
                                        <SelectItem value="hrv">Honda HR-V</SelectItem>
                                        <SelectItem value="civic">Honda Civic</SelectItem>
                                        <SelectItem value="accord">Honda Accord</SelectItem>
                                    </SelectContent>
                                </Select>
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
                    <TabsContent value="history" className="py-4">
                        {initialData ? (
                            <LeadActivityTimeline
                                leadId={initialData.id}
                                activities={[
                                    ...(initialData.interactions || []),
                                    ...(initialData.history || []).map(h => ({
                                        id: h.id,
                                        type: 'HISTORY_LOG',
                                        content: `Thay đổi ${h.field === 'STATUS' ? 'Trạng thái' : h.field} từ ${h.old_value || '(trống)'} sang ${h.new_value}`,
                                        lead_id: h.lead_id,
                                        user_id: h.changed_by_id,
                                        created_at: h.created_at,
                                        actorName: h.changed_by?.name || 'Hệ thống'
                                    } as any))
                                ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())}

                                onActivityAdded={onSaved}
                            />
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Vui lòng tạo Lead trước khi thêm hoạt động.
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <DialogFooter className="mt-4 sm:justify-between gap-2">
                    {initialData ? (
                        <div className="flex gap-2">
                            <Button variant="destructive" onClick={handleDelete} disabled={isLoading} type="button">
                                <Trash2 className="w-4 h-4 mr-2" /> Xóa
                            </Button>
                            {initialData.status !== 'WON' && initialData.status !== 'DEAD' && (
                                <Button variant="secondary" onClick={handleConvert} disabled={isLoading} type="button" className="bg-green-100 text-green-700 hover:bg-green-200">
                                    <User className="w-4 h-4 mr-2" /> Chuyển thành Khách Hàng
                                </Button>
                            )}
                        </div>
                    ) : <div></div>}

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy Bỏ</Button>
                        <Button onClick={handleSave} className="bg-[#E60012] hover:bg-[#cc0010]" disabled={isLoading}>
                            {isLoading ? "Đang lưu..." : <><Save className="w-4 h-4 mr-2" /> {initialData ? "Cập Nhật" : "Tạo Lead"}</>}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
