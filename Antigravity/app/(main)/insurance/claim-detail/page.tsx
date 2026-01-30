"use client";

import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Circle, Clock, DollarSign, FileText, Image as ImageIcon, MapPin, User, Shield } from "lucide-react";
import { useInsurance } from "@/context/InsuranceContext";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams, useRouter } from "next/navigation";

function ClaimDetailContent() {
    const { state, updateClaimStatus } = useInsurance();
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get("id");

    const claim = state.claims.find(c => c.id === id);

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    if (!id || !claim) {
        return <div className="p-8">Hồ sơ không tồn tại. <Button variant="link" onClick={() => router.push('/insurance/claims')}>Quay lại danh sách</Button></div>;
    }

    const handleApprove = () => {
        updateClaimStatus(claim.id, "Approved");
        toast.success("Đã duyệt hồ sơ bồi thường!");
    };

    const handleReject = () => {
        if (!rejectReason) {
            toast.error("Vui lòng nhập lý do từ chối!");
            return;
        }
        updateClaimStatus(claim.id, "Rejected", rejectReason);
        toast.error("Đã từ chối hồ sơ!");
        setRejectDialogOpen(false);
    };

    return (
        <div className="h-full p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-bold tracking-tight">Hồ Sơ Bồi Thường #{claim.id}</h2>
                        <Badge className={`border-none ${claim.status === "Approved" ? "bg-green-100 text-green-700" :
                            claim.status === "Rejected" ? "bg-red-100 text-red-700" :
                                "bg-blue-100 text-blue-700"
                            }`}>
                            {claim.status === "New" ? "Mới" :
                                claim.status === "Approved" ? "Đã Duyệt" :
                                    claim.status === "Rejected" ? "Từ Chối" : "Đang Xử Lý"}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">{claim.description}</p>
                </div>
                <div className="flex gap-2">
                    {claim.status !== "Rejected" && claim.status !== "Approved" && (
                        <>
                            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setRejectDialogOpen(true)}>Từ Chối</Button>
                            <Button className="bg-[#E60012] hover:bg-[#B8000E]" onClick={handleApprove}>Duyệt Hồ Sơ</Button>
                        </>
                    )}
                </div>
            </div>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Từ Chối Hồ Sơ</DialogTitle>
                        <DialogDescription>Vui lòng nhập lý do từ chối bồi thường để thông báo cho khách hàng.</DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder="Nhập lý do..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Hủy</Button>
                        <Button variant="destructive" onClick={handleReject}>Xác Nhận Từ Chối</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Progress Stepper (Visual Only) */}
            <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
                <div className="relative z-10 flex justify-between">
                    <div className="flex flex-col items-center gap-2 bg-white px-2">
                        <CheckCircle2 className="h-8 w-8 text-green-600 bg-white" />
                        <span className="text-sm font-medium">Tiếp Nhận</span>
                        <span className="text-xs text-muted-foreground">{claim.incidentDate}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 bg-white px-2">
                        <Circle className={`h-8 w-8 bg-white ${claim.status === "Approved" ? "text-green-600 fill-green-100" : "text-blue-600 fill-blue-100"}`} />
                        <span className="text-sm font-medium text-blue-600">Giám Định</span>
                        <span className="text-xs text-muted-foreground">Đang xử lý</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 bg-white px-2">
                        <Circle className={`h-8 w-8 bg-white ${claim.status === "Approved" ? "text-green-600" : "text-gray-300"}`} />
                        <span className="text-sm text-muted-foreground">Duyệt Giá</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 bg-white px-2">
                        <Circle className="h-8 w-8 text-gray-300 bg-white" />
                        <span className="text-sm text-muted-foreground">Sửa Chữa</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 bg-white px-2">
                        <Circle className="h-8 w-8 text-gray-300 bg-white" />
                        <span className="text-sm text-muted-foreground">Thanh Toán</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Claim Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông Tin Vụ Việc</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Ngày Giờ Xảy Ra</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Clock className="h-4 w-4" /> {claim.incidentDate}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Địa Điểm</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <MapPin className="h-4 w-4" /> {claim.location || "Chưa cập nhật"}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-muted-foreground">Mô Tả Diễn Biến</p>
                                    <p className="mt-1">
                                        {claim.description}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Hạng Mục Thiệt Hại (Ước Tính)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <span>Chi tiết thiệt hại chung</span>
                                    <span>{claim.estimatedAmount?.toLocaleString()} ₫</span>
                                </div>
                                <div className="flex items-center justify-between font-bold text-[#E60012] pt-2">
                                    <span>Tổng Cộng</span>
                                    <span>{claim.estimatedAmount?.toLocaleString()} ₫</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Hình Ảnh Hiện Trường</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-muted-foreground">
                                    <ImageIcon className="h-8 w-8" />
                                </div>
                                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-muted-foreground">
                                    <ImageIcon className="h-8 w-8" />
                                </div>
                                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-muted-foreground">
                                    <ImageIcon className="h-8 w-8" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Contract & Contact Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Shield className="h-4 w-4" /> Thông Tin Hợp Đồng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3">
                            <div>
                                <p className="text-muted-foreground">Số Hợp Đồng</p>
                                <p className="font-medium text-blue-600 cursor-pointer" onClick={() => router.push(`/insurance/contract-detail?id=${claim.contractId}`)}>{claim.contractId}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Đơn Vị Bảo Hiểm</p>
                                <p className="font-medium">PVI</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-muted-foreground">Mức Miễn Thường</p>
                                <p className="font-medium">500,000 ₫</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Chế Tài (%)</p>
                                <p className="font-medium">0%</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <User className="h-4 w-4" /> Người Liên Hệ
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3">
                            <div>
                                <p className="text-muted-foreground">Tên Người Lái</p>
                                <p className="font-medium">{claim.driverName || "Chưa cập nhật"}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Điện Thoại</p>
                                <p className="font-medium">{claim.driverPhone || "Chưa cập nhật"}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default function ClaimDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ClaimDetailContent />
        </Suspense>
    );
}
