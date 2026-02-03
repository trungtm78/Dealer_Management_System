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
import { ArrowLeft, Save, Upload, FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const claimFormSchema = z.object({
  contractNumber: z.string().min(1, { message: "Vui lòng chọn hợp đồng bảo hiểm" }),
  incidentDate: z.string().min(1, { message: "Vui lòng chọn ngày xảy ra sự việc" }),
  incidentTime: z.string().min(1, { message: "Vui lòng nhập giờ xảy ra sự việc" }),
  incidentLocation: z.string().min(1, { message: "Vui lòng nhập địa điểm xảy ra sự việc" }),
  incidentDescription: z.string().min(10, { message: "Vui lòng mô tả chi tiết sự việc (tối thiểu 10 ký tự)" }),
  claimAmount: z.string().min(1, { message: "Vui lòng nhập số tiền yêu cầu bồi thường" }),
  estimatedRepairCost: z.string().min(1, { message: "Vui lòng nhập chi phí sửa chữa ước tính" }),
  policeReport: z.boolean().optional(),
  witnessInfo: z.string().optional(),
  damagePhotos: z.boolean().optional(),
});

type ClaimFormValues = z.infer<typeof claimFormSchema>;

export default function CreateClaimPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      contractNumber: "",
      incidentDate: "",
      incidentTime: "",
      incidentLocation: "",
      incidentDescription: "",
      claimAmount: "",
      estimatedRepairCost: "",
      policeReport: false,
      witnessInfo: "",
      damagePhotos: false,
    },
  });

  const onSubmit = async (data: ClaimFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to create claim
      console.log("Claim data:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Đã tạo yêu cầu bồi thường mới thành công");
      router.push("/insurance/claims");
    } catch (error) {
      toast.error("Lỗi khi tạo yêu cầu bồi thường. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/insurance/claims">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tạo Yêu Cầu Bồi Thường Mới</h1>
          <p className="text-muted-foreground">Điền thông tin để tạo yêu cầu bồi thường bảo hiểm</p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Contract Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Hợp Đồng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="contractNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số Hợp Đồng</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn hợp đồng bảo hiểm" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BH-2024-001">BH-2024-001 - Honda CR-V</SelectItem>
                          <SelectItem value="BH-2024-002">BH-2024-002 - Honda Civic</SelectItem>
                          <SelectItem value="BH-2024-003">BH-2024-003 - Honda City</SelectItem>
                          <SelectItem value="BH-2024-004">BH-2024-004 - Honda HR-V</SelectItem>
                          <SelectItem value="BH-2024-005">BH-2024-005 - Honda Accord</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Incident Details */}
            <Card>
              <CardHeader>
                <CardTitle>Chi Tiết Sự Việc</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="incidentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày Xảy Ra</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="incidentTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời Gian</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="incidentLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa Điểm</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập địa điểm xảy ra sự việc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Claim Amount */}
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Bồi Thường</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="claimAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số Tiền Yêu Cầu (VNĐ)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số tiền yêu cầu bồi thường" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estimatedRepairCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chi Phí Sửa Chữa Ước Tính (VNĐ)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập chi phí sửa chữa ước tính" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Bổ Sung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="incidentDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô Tả Chi Tiết</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Mô tả chi tiết về sự việc xảy ra..." 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="witnessInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thông Tin Nhân Chứng (nếu có)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Họ tên, SĐT, địa chỉ của nhân chứng (nếu có)..." 
                          className="min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Supporting Documents */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Tài Liệu Đính Kèm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Tải Lên Tài Liệu</h3>
                    <p className="text-sm text-gray-500">
                      Kéo thả file vào đây hoặc nhấn để chọn file
                    </p>
                    <p className="text-xs text-gray-400">
                      Các định dạng cho phép: PDF, JPG, PNG (tối đa 10MB)
                    </p>
                  </div>
                  <Button variant="outline" type="button" className="mt-4">
                    <FileText className="mr-2 h-4 w-4" />
                    Chọn File
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="policeReport" className="rounded" />
                    <Label htmlFor="policeReport">Có biên bản cơ quan chức năng</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="damagePhotos" className="rounded" />
                    <Label htmlFor="damagePhotos">Có ảnh hiện trường/thiệt hại</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Link href="/insurance/claims">
              <Button variant="outline" type="button">Hủy</Button>
            </Link>
            <Button type="submit" className="bg-[#E60012] hover:bg-[#B8000E]" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Đang tạo..." : "Tạo Yêu Cầu"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}