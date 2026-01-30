"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { RoleDTO, PermissionDTO } from "@/lib/types/admin";
import { updateRole } from "@/actions/admin/permissions";
import { toast } from "sonner";

interface PermissionMatrixProps {
  roles: RoleDTO[];
  permissions: PermissionDTO[];
  initialMatrix: { role_id: string, permission_id: string }[];
}

export default function PermissionMatrix({ roles, permissions, initialMatrix }: PermissionMatrixProps) {
  const [matrix, setMatrix] = useState(initialMatrix);

  const isChecked = (roleId: string, permId: string) => {
    return matrix.some(m => m.role_id === roleId && m.permission_id === permId);
  };

  const handleToggle = async (roleId: string, permId: string) => {
    const active = isChecked(roleId, permId);
    const newMatrix = active 
      ? matrix.filter(m => !(m.role_id === roleId && m.permission_id === permId))
      : [...matrix, { role_id: roleId, permission_id: permId }];
    
    setMatrix(newMatrix);

    const rolePerms = newMatrix.filter(m => m.role_id === roleId).map(m => m.permission_id);
    const res = await updateRole(roleId, { permissionIds: rolePerms });
    
    if (res.success) {
      toast.success("Đã cập nhật quyền");
    } else {
      toast.error("Cập nhật thất bại: " + res.error);
      setMatrix(matrix); // Revert
    }
  };

  // Group permissions by module
  const modules = Array.from(new Set(permissions.map(p => p.module)));

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Module / Action</TableHead>
            {roles.map(role => (
              <TableHead key={role.id} className="text-center">{role.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {modules.map(module => (
            <>
              <TableRow key={module} className="bg-gray-50">
                <TableCell colSpan={roles.length + 1} className="font-bold py-2">
                  {module.toUpperCase()}
                </TableCell>
              </TableRow>
              {permissions.filter(p => p.module === module).map(perm => (
                <TableRow key={perm.id}>
                  <TableCell className="pl-6 text-sm">{perm.action}</TableCell>
                  {roles.map(role => (
                    <TableCell key={role.id} className="text-center">
                      <Checkbox 
                        checked={isChecked(role.id, perm.id)}
                        onCheckedChange={() => handleToggle(role.id, perm.id)}
                        disabled={role.is_system && role.name === 'ADMIN'}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
