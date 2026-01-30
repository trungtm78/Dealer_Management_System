"use client";

import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Calendar, Car, Download, FileText, Phone, Shield, User } from "lucide-react";
import { useInsurance } from "@/context/InsuranceContext";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

function ContractDetailContent() {
    const { state, renewContract } = useInsurance();
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get("id");

    const contract = state.contracts.find(c => c.id === id);
    const contractClaims = state.claims.filter(c => c.contractId === id);

    if (!id || !contract) {
        return <div className="p-8">Hợp đồng không tồn tại. <Button variant="link" onClick={() => router.push('/insurance/contracts')}>Quay lại</Button></div>;
    }

    const handleRenew = () => {
        renewContract(contract.id);
        toast.success(`Đã gia hạn hợp đồng ${contract.id} thêm 1 năm!`);
    };

    return (
        <div className="h-full p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-bold tracking-tight">Hợp Đồng #{contract.id}</h2>
                        <Badge className={contract.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                            {contract.status === "Active" ? "Hiệu Lực" : contract.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">Chi tiết hợp đồng bảo hiểm xe.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => toast.info("Đang tải xuống...")}>
                        <Download className="mr-2 h-4 w-4" /> Tải Hợp Đồng
                    </Button>
                    <Button className="bg-[#E60012] hover:bg-[#B8000E]" onClick={handleRenew}>Gia Hạn Hợp Đồng</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Customer & Car Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <User className="h-4 w-4" /> Thông Tin Khách Hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3">
                            <div>
                                <p className="text-muted-foreground">Tên Khách Hàng</p>
                                <p className="font-medium">{contract.customerName}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Điện Thoại</p>
                                <p className="font-medium">{contract.customerPhone || "Cập nhật sau"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Car className="h-4 w-4" /> Thông Tin Xe
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3">
                            <div>
                                <p className="text-muted-foreground">Mẫu Xe</p>
                                <p className="font-medium">{contract.carModel}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Biển Số</p>
                                <span className="bg-gray-100 px-2 py-0.5 rounded font-mono">{contract.licensePlate}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Contract Details */}
                <div className="md:col-span-2">
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="general">Thông Tin Chung</TabsTrigger>
                            <TabsTrigger value="coverage">Quyền Lợi & Phí</TabsTrigger>
                            <TabsTrigger value="history">Lịch Sử & Bồi Thường</TabsTrigger>
                        </TabsList>
                        <TabsContent value="general" className="mt-4 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Chi Tiết Hợp Đồng</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Số Hợp Đồng</p>
                                            <p className="font-medium">{contract.id}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Công Ty Bảo Hiểm</p>
                                            <p className="font-medium">{contract.provider}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Ngày Hiệu Lực</p>
                                            <p className="font-medium">{contract.startDate}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Ngày Hết Hạn</p>
                                            <p className="font-medium">{contract.endDate}</p>
                                        </div>
                                    </div>
                                    <Separator className="my-4" />
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">Ghi Chú</p>
                                        <p className="text-sm">Hợp đồng điện tử.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="coverage" className="mt-4 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quyền Lợi Bảo Hiểm</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm">
                                        {contract.coverage && contract.coverage.length > 0 ? (
                                            contract.coverage.map((item, index) => (
                                                <li key={index} className="flex justify-between p-2 rounded bg-gray-50">
                                                    <span>{item}</span>
                                                    <span className="font-bold text-green-600">Đã bao gồm</span>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="p-2 text-muted-foreground">Chưa cập nhật quyền lợi chi tiết.</li>
                                        )}
                                        <li className="flex justify-between p-2 rounded bg-white border mt-4">
                                            <span>Mức Miễn Thường</span>
                                            <span className="font-bold">{contract.deductible ? contract.deductible.toLocaleString() : "500,000"} ₫</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Phí Bảo Hiểm</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-base font-bold text-[#E60012]">
                                            <span>Tổng Cộng</span>
                                            <span>{contract.value.toLocaleString()} ₫</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="history" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Lịch Sử Bồi Thường ({contractClaims.length})</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {contractClaims.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Shield className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                                            <p>Chưa có hồ sơ bồi thường nào cho hợp đồng này.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {contractClaims.map(c => (
                                                <div key={c.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/insurance/claim-detail?id=${c.id}`)}>
                                                    <div>
                                                        <p className="font-medium text-sm">{c.id} - {c.description}</p>
                                                        <p className="text-xs text-muted-foreground">{c.incidentDate}</p>
                                                    </div>
                                                    <Badge>{c.status}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default function ContractDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ContractDetailContent />
        </Suspense>
    );
}
