"use client";

import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Save, Upload, FileText, Camera } from "lucide-react";

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

export type ClaimFormValues = z.infer<typeof claimFormSchema>;

interface InsuranceClaimFormProps {
  onSubmit: (data: ClaimFormValues) => Promise<void>;
  onCancel: () => void;
  initialValues?: Partial<ClaimFormValues>;
  isLoading?: boolean;
}

export default function InsuranceClaimForm({ 
  onSubmit, 
  onCancel, 
  initialValues, 
  isLoading = false 
}: InsuranceClaimFormProps) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
      ...initialValues
    },
  });

  const handleCalculateAmount = async () => {
    const estimatedRepairCost = form.getValues("estimatedRepairCost");
    
    if (!estimatedRepairCost) {
      form.setError("estimatedRepairCost", { message: "Vui lòng nhập chi phí sửa chữa ước tính" });
      return;
    }

    setIsCalculating(true);
    try {
      // Simulate API call for claim amount calculation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock calculation (claim amount is typically 80-95% of estimated repair cost)
      const estimatedCost = parseFloat(estimatedRepairCost);
      const claimPercentage = 0.9; // 90%
      const calculatedAmount = Math.round(estimatedCost * claimPercentage);
      
      form.setValue("claimAmount", calculatedAmount.toString());
    } catch (error) {
      form.setError("claimAmount", { message: "Không thể tính số tiền bồi thường. Vui lòng thử lại." });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(file => {
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        return validTypes.includes(file.type) && file.size <= maxSize;
      });

      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // Update form state
      if (newFiles.some(file => file.type.startsWith('image/'))) {
        form.setValue('damagePhotos', true);
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: ClaimFormValues) => {
    await onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  name="estimatedRepairCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chi Phí Sửa Chữa Ước Tính (VNĐ)</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl className="flex-1">
                          <Input 
                            placeholder="Nhập chi phí sửa chữa ước tính" 
                            type="number" 
                            {...field} 
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleCalculateAmount}
                          disabled={isCalculating}
                          className="mt-1"
                        >
                          Tính
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="claimAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số Tiền Yêu Cầu (VNĐ)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nhập số tiền yêu cầu bồi thường" 
                          type="number" 
                          {...field} 
                        />
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
                  <div className="mt-4">
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Button variant="outline" type="button" asChild>
                        <span>
                          <FileText className="mr-2 h-4 w-4" />
                          Chọn File
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Tệp đã tải lên:</h4>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-gray-400">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="policeReport" 
                      className="rounded"
                      checked={form.watch('policeReport')}
                      onChange={(e) => form.setValue('policeReport', e.target.checked)}
                    />
                    <Label htmlFor="policeReport">Có biên bản cơ quan chức năng</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="damagePhotos" 
                      className="rounded"
                      checked={form.watch('damagePhotos') || uploadedFiles.some(f => f.type.startsWith('image/'))}
                      onChange={(e) => form.setValue('damagePhotos', e.target.checked)}
                    />
                    <Label htmlFor="damagePhotos">Có ảnh hiện trường/thiệt hại</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              className="bg-[#E60012] hover:bg-[#B8000E]" 
              disabled={isLoading || isCalculating}
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Đang lưu..." : "Gửi Yêu Cầu"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}