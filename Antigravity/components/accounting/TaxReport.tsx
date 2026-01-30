
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const VAT_IN = [
    { invoice: "HĐ-001", date: "2024-01-05", supplier: "Nhà Cung Cấp A", amount: 50000000, vat: 5000000 },
    { invoice: "HĐ-002", date: "2024-01-12", supplier: "Nhà Cung Cấp B", amount: 120000000, vat: 12000000 },
];

const VAT_OUT = [
    { invoice: "XK-1001", date: "2024-01-10", customer: "Khách Hàng X", amount: 15000000, vat: 1500000 },
    { invoice: "XK-1002", date: "2024-01-15", customer: "Khách Hàng Y", amount: 28000000, vat: 2800000 },
];

export default function TaxReport() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Tổng Hợp Nghĩa Vụ Thuế</CardTitle>
                    <CardDescription>Kỳ báo cáo: Tháng 01/2024</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-sm font-medium text-blue-600">Thuế GTGT Phải Nộp</p>
                            <p className="text-2xl font-bold text-blue-900">{formatCurrency(15000000)}</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                            <p className="text-sm font-medium text-orange-600">Thuế TNDN Tạm Tính</p>
                            <p className="text-2xl font-bold text-orange-900">{formatCurrency(48000000)}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                            <p className="text-sm font-medium text-green-600">Thuế TNCN Đã Khấu Trừ</p>
                            <p className="text-2xl font-bold text-green-900">{formatCurrency(12500000)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="vat">
                <TabsList>
                    <TabsTrigger value="vat">Tờ Khai GTGT</TabsTrigger>
                    <TabsTrigger value="cit">Tờ Khai TNDN</TabsTrigger>
                    <TabsTrigger value="pit">Tờ Khai TNCN</TabsTrigger>
                </TabsList>
                <TabsContent value="vat" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Bảng Kê Hóa Đơn GTGT</CardTitle>
                            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Xuất XML (HTKK)</Button>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold mb-2">Đầu Vào (Mua Hàng)</h3>
                            <Table className="mb-6">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Số HĐ</TableHead>
                                        <TableHead>Ngày HĐ</TableHead>
                                        <TableHead>Nhà Cung Cấp</TableHead>
                                        <TableHead className="text-right">Doanh Số</TableHead>
                                        <TableHead className="text-right">Thuế GTGT</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {VAT_IN.map((item, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{item.invoice}</TableCell>
                                            <TableCell>{item.date}</TableCell>
                                            <TableCell>{item.supplier}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.vat)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <h3 className="font-semibold mb-2">Đầu Ra (Bán Hàng)</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Số HĐ</TableHead>
                                        <TableHead>Ngày HĐ</TableHead>
                                        <TableHead>Khách Hàng</TableHead>
                                        <TableHead className="text-right">Doanh Số</TableHead>
                                        <TableHead className="text-right">Thuế GTGT</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {VAT_OUT.map((item, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{item.invoice}</TableCell>
                                            <TableCell>{item.date}</TableCell>
                                            <TableCell>{item.customer}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.vat)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="cit">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground p-8">Giao diện Tờ khai Quyết toán Thuế TNDN đang được cập nhật...</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="pit">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground p-8">Giao diện Tờ khai Thuế TNCN (Mẫu 05/KK-TNCN) đang được cập nhật...</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
