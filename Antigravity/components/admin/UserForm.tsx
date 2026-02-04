"use client";

import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { SmartSelect } from "@/components/SmartSelect";
import type { SelectDataSource } from "@/types/smart-select";
import { Loader2 } from "lucide-react";
import { CreateUserInput } from "@/lib/types/admin";

const userSchema = z.object({
  name: z.string().min(2, "Tên phải ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  role: z.string().min(1, "Vui lòng chọn vai trò"),
  department: z.string().optional(),
  phone: z.string().optional(),
});

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateUserInput) => Promise<void>;
}

const roleDataSource: SelectDataSource = {
  search: async (req) => {
    const res = await fetch('/api/shared/search/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    return res.json();
  }
};

const departmentDataSource: SelectDataSource = {
  search: async (req) => {
    const res = await fetch('/api/shared/search/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    return res.json();
  }
};

export default function UserForm({ open, onOpenChange, onSubmit }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [departmentId, setDepartmentId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "SALES",
      department: "",
      phone: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof userSchema>) => {
    setLoading(true);
    try {
      await onSubmit(values as CreateUserInput);
      form.reset();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm Người Dùng Mới</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="a.nguyen@honda.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <SmartSelect
                  dataSource={roleDataSource}
                  value={roleId}
                  onChange={(id, item) => {
                    setRoleId(id as number | null);
                    if (item) {
                      form.setValue("role", item.label || "");
                    } else {
                      form.setValue("role", "");
                    }
                  }}
                  label="Vai trò"
                  placeholder="Chọn vai trò..."
                  required
                  context={{ onlyActive: true }}
                  className="w-full"
                />
              </div>
              <div>
                <SmartSelect
                  dataSource={departmentDataSource}
                  value={departmentId}
                  onChange={(id, item) => {
                    setDepartmentId(id as number | null);
                    if (item) {
                      form.setValue("department", item.label || "");
                    } else {
                      form.setValue("department", "");
                    }
                  }}
                  label="Phòng ban"
                  placeholder="Chọn phòng ban..."
                  context={{ onlyActive: true }}
                  className="w-full"
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="090..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
              <Button type="submit" disabled={loading} className="bg-[#E60012] hover:bg-[#c50010]">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Tạo người dùng
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
