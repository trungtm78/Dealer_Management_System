// FRD: ADM-002
// Refs: components/admin/PermissionMatrix.tsx
// API: GET /api/admin/permissions/matrix
// ERD: roles, permissions, role_permissions

import PermissionMatrix from "@/components/admin/PermissionMatrix";
import { getRoles, getPermissions } from "@/actions/admin/permissions";
import prisma from "@/lib/prisma";

export default async function PermissionsPage() {
  const [roles, permissions] = await Promise.all([
    getRoles(),
    getPermissions()
  ]);

  const matrix: any[] = await prisma.$queryRaw`SELECT * FROM role_permissions`;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Phân Quyền Hệ Thống</h1>
          <p className="text-muted-foreground">Quản lý ma trận quyền hạn cho các vai trò người dùng.</p>
        </div>
      </div>

      <PermissionMatrix 
        roles={roles} 
        permissions={permissions} 
        initialMatrix={matrix.map(m => ({
          role_id: m.role_id,
          permission_id: m.permission_id
        }))} 
      />
    </div>
  );
}
