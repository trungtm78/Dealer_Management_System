"use client";

import { useState, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SmartSelect } from "@/components/SmartSelect";
import type { SelectDataSource } from "@/types/smart-select";
import { Save, Calculator } from "lucide-react";

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

export type ContractFormValues = z.infer<typeof contractFormSchema>;

interface InsuranceContractFormProps {
  onSubmit: (data: ContractFormValues) => Promise<void>;
  onCancel: () => void;
  initialValues?: Partial<ContractFormValues>;
  isLoading?: boolean;
}

// DataSources
const customerDataSource: SelectDataSource = {
  search: async (req) => {
    const res = await fetch('/api/shared/search/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    return res.json();
  }
};

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

const providerDataSource: SelectDataSource = {
  search: async (req) => {
    const res = await fetch('/api/shared/search/providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    return res.json();
  }
};

export default function InsuranceContractForm({
  onSubmit,
  onCancel,
  initialValues,
  isLoading = false
}: InsuranceContractFormProps) {
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
      ...initialValues
    },
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [vehicleModelId, setVehicleModelId] = useState<number | null>(null);
  const [providerId, setProviderId] = useState<number | null>(null);

  const handleCalculatePremium = async () => {
    const vehicleMake = form.getValues("vehicleMake");
    const vehicleModel = form.getValues("vehicleModel");
    const vehicleYear = form.getValues("vehicleYear");
    const coverageAmount = form.getValues("coverageAmount");

    if (!vehicleMake || !vehicleModel || !coverageAmount) {
      form.setError("coverageAmount", { message: "Vui lòng nhập đầy đủ thông tin xe và số tiền bảo hiểm" });
      return;
    }

    setIsCalculating(true);
    try {
      // Simulate API call for premium calculation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock premium calculation (2-5% of coverage amount based on vehicle value and age)
      const basePremium = parseFloat(coverageAmount) * 0.03;
      const yearFactor = 2024 - parseInt(vehicleYear) > 5 ? 1.2 : 1.0;
      const makeFactor = vehicleMake === "Honda" ? 0.9 : 1.1;

      const calculatedPremium = Math.round(basePremium * yearFactor * makeFactor);
      form.setValue("premium", calculatedPremium.toString());
    } catch (error) {
      form.setError("premium", { message: "Không thể tính phí bảo hiểm. Vui lòng thử lại." });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = async (data: ContractFormValues) => {
    await onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Khách Hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <SmartSelect
                    dataSource={customerDataSource}
                    value={customerId?.toString()}
                    onChange={(id, item) => {
                      setCustomerId(id ? parseInt(id as string) : null);
                      if (item) {
                        form.setValue("customerName", item.label);
                        form.setValue("customerPhone", (item.meta as any)?.phone || "");
                        form.setValue("customerEmail", (item.meta as any)?.email || "");
                      } else {
                        form.setValue("customerName", "");
                        form.setValue("customerPhone", "");
                        form.setValue("customerEmail", "");
                      }
                    }}
                    label="Khách hàng"
                    placeholder="Tìm khách hàng..."
                    required
                    context={{ onlyActive: true }}
                    className="w-full"
                  />
                </div>
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input {...field} />
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
                <div>
                  <SmartSelect
                    dataSource={vehicleModelDataSource}
                    value={vehicleModelId}
                    onChange={(id, item) => {
                      setVehicleModelId(id as number | null);
                      if (item) {
                        form.setValue("vehicleModel", item.label);
                        form.setValue("vehicleMake", (item.meta as any)?.brand || "Honda");
                      } else {
                        form.setValue("vehicleModel", "");
                        form.setValue("vehicleMake", "");
                      }
                    }}
                    label="Dòng xe"
                    placeholder="Chọn dòng xe..."
                    required
                    context={{ onlyActive: true }}
                    className="w-full"
                  />
                </div>
                <FormField
                  control={form.control}
                  name="vehicleModel"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input {...field} />
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
                <div>
                  <FormField
                    control={form.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhà cung cấp bảo hiểm *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên nhà cung cấp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                <div className="flex space-x-2">
                  <FormField
                    control={form.control}
                    name="coverageAmount"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Số tiền bảo hiểm (VNĐ)</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập số tiền bảo hiểm" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCalculatePremium}
                    disabled={isCalculating}
                    className="mt-6"
                  >
                    <Calculator className="h-4 w-4" />
                  </Button>
                </div>
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
              {isLoading ? "Đang lưu..." : "Lưu Hợp Đồng"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}