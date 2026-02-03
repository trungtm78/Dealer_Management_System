"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const contractFormSchema = z.object({
  customerName: z.string().min(1, { message: "Vui lòng nhập họ và tên khách hàng" }),
  customerPhone: z.string().regex(/^[0-9]{10,11}$/, { message: "Số điện thoại không hợp lệ" }),
  customerEmail: z.string().email({ message: "Email không hợp lệ" }),
  vehicleVin: z.string().min(17, { message: "VIN phải có 17 ký tự" }),
  vehicleMake: z.string().min(1, { message: "Vui lòng chọn hãng xe" }),
  vehicleModel: z.string().min(1, { message: "Vui lòng nhập dòng xe" }),
  vehicleYear: z.string().regex(/^[0-9]{4}$/, { message: "Năm sản xuất không hợp lệ" }),
  provider: z.string().min(1, { message: "Vui lòng chọn nhà cung cấp" }),
  policyType: z.string().min(1, { message: "Vui lòng chọn loại bảo hiểm" }),
  coverageAmount: z.string().min(1, { message: "Vui lòng nhập số tiền bảo hiểm" }),
  premium: z.string().min(1, { message: "Vui lòng nhập phí bảo hiểm" }),
  startDate: z.string().min(1, { message: "Vui lòng chọn ngày bắt đầu" }),
  endDate: z.string().min(1, { message: "Vui lòng chọn ngày kết thúc" }),
});

type ContractFormValues = z.infer<typeof contractFormSchema>;

export default function CreateContractPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      vehicleVin: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: "",
      provider: "",
      policyType: "",
      coverageAmount: "",
      premium: "",
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = async (data: ContractFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to create contract
      console.log("Contract data:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Đã tạo hợp đồng mới thành công");
      router.push("/insurance/contracts");
    } catch (error) {
      toast.error("Lỗi khi tạo hợp đồng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/insurance/contracts">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tạo Hợp Đồng Mới</h1>
          <p className="text-muted-foreground">Điền thông tin để tạo hợp đồng bảo hiểm mới</p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Khách Hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và Tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên khách hàng" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Điện Thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Xe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="vehicleVin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số Khung (VIN)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập VIN" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleMake"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hãng xe</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn hãng xe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Honda">Honda</SelectItem>
                          <SelectItem value="Toyota">Toyota</SelectItem>
                          <SelectItem value="Mazda">Mazda</SelectItem>
                          <SelectItem value="Ford">Ford</SelectItem>
                          <SelectItem value="Hyundai">Hyundai</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dòng xe</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập dòng xe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Năm sản xuất</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập năm sản xuất" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Policy Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Bảo Hiểm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhà cung cấp</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn nhà cung cấp" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Bảo Việt">Bảo Việt</SelectItem>
                          <SelectItem value="Prudential">Prudential</SelectItem>
                          <SelectItem value="Manulife">Manulife</SelectItem>
                          <SelectItem value="PVI">PVI</SelectItem>
                          <SelectItem value="Bảo Minh">Bảo Minh</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="policyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại bảo hiểm</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại bảo hiểm" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Vật chất xe">Bảo hiểm vật chất xe</SelectItem>
                          <SelectItem value="TNDS">TNDS chủ xe</SelectItem>
                          <SelectItem value="Người ngồi trên xe">Tai nạn người ngồi trên xe</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coverageAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số tiền bảo hiểm (VNĐ)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số tiền bảo hiểm" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="premium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phí bảo hiểm (VNĐ)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập phí bảo hiểm" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Contract Period */}
            <Card>
              <CardHeader>
                <CardTitle>Thời Hạn Hợp Đồng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày bắt đầu</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày kết thúc</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Link href="/insurance/contracts">
              <Button variant="outline" type="button">Hủy</Button>
            </Link>
            <Button type="submit" className="bg-[#E60012] hover:bg-[#B8000E]" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Đang tạo..." : "Tạo Hợp Đồng"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}