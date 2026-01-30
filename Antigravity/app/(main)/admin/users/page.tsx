// FRD: ADM-001
// Refs: components/admin/UserManagement.tsx
// API: GET /api/admin/users
// ERD: users

import UserManagement from "@/components/admin/UserManagement";
import { getUsers } from "@/actions/admin/users";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản Lý Người Dùng</h1>
          <p className="text-muted-foreground">Tạo và quản lý tài khoản nhân viên trong hệ thống.</p>
        </div>
      </div>

      <UserManagement initialUsers={users} />
    </div>
  );
}
