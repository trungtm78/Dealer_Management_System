"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import UserTable from "./UserTable";
import { UserDTO } from "@/lib/types/admin";
import { deleteUser, resetPassword } from "@/actions/admin/users";
import { toast } from "sonner";

interface UserManagementProps {
  initialUsers: UserDTO[];
}

export default function UserManagement({ initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState<UserDTO[]>(initialUsers);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
    const res = await deleteUser(id);
    if (res.success) {
      setUsers(users.filter(u => u.id !== id));
      toast.success("Đã xóa người dùng");
    } else {
      toast.error("Lỗi: " + res.error);
    }
  };

  const handleResetPassword = async (user: UserDTO) => {
    if (!confirm(`Đặt lại mật khẩu cho ${user.name} thành 'honda123'?`)) return;
    const res = await resetPassword(user.id);
    if (res.success) {
      toast.success("Đã đặt lại mật khẩu");
    } else {
      toast.error("Lỗi: " + res.error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm người dùng..." 
            className="pl-8" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button className="bg-[#E60012] hover:bg-[#c50010]">
          <UserPlus className="mr-2 h-4 w-4" /> Thêm người dùng
        </Button>
      </div>

      <UserTable 
        users={filteredUsers} 
        onEdit={() => {}} 
        onResetPassword={handleResetPassword}
        onDelete={handleDelete}
      />
    </div>
  );
}
