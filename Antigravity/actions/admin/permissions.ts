"use server";

import prisma from "@/lib/prisma";
import { RoleDTO, PermissionDTO } from "@/lib/types/admin";
import { revalidatePath } from "next/cache";

export async function getRoles(): Promise<RoleDTO[]> {
  try {
    const roles: any[] = await prisma.$queryRaw`SELECT * FROM roles ORDER BY name ASC`;
    return roles.map(r => ({
      ...r,
      is_system: Boolean(r.is_system),
      created_at: r.created_at
    }));
  } catch (error) {
    console.error("Failed to get roles:", error);
    return [];
  }
}

export async function getPermissions(): Promise<PermissionDTO[]> {
  try {
    const permissions: any[] = await prisma.$queryRaw`SELECT * FROM permissions ORDER BY module ASC, action ASC`;
    return permissions;
  } catch (error) {
    console.error("Failed to get permissions:", error);
    return [];
  }
}

export async function getRoleWithPermissions(roleId: string): Promise<RoleDTO | null> {
  try {
    const roles: any[] = await prisma.$queryRaw`SELECT * FROM roles WHERE id = ${roleId}`;
    if (roles.length === 0) return null;
    
    const role = roles[0];
    const perms: any[] = await prisma.$queryRaw`
      SELECT p.id, p.module, p.action 
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ${roleId}
    `;
    
    return {
      ...role,
      is_system: Boolean(role.is_system),
      created_at: role.created_at,
      permissions: perms.map(p => p.id)
    };
  } catch (error) {
    console.error("Failed to get role with permissions:", error);
    return null;
  }
}

export async function createRole(data: { name: string, description?: string, permissionIds: string[] }) {
  try {
    const id = `role-${Date.now()}`;
    await prisma.$executeRawUnsafe(`
      INSERT INTO roles (id, name, description, is_system) 
      VALUES (?, ?, ?, ?)
    `, id, data.name, data.description || null, 0);
    
    for (const pId of data.permissionIds) {
      await prisma.$executeRawUnsafe(`
        INSERT INTO role_permissions (role_id, permission_id) 
        VALUES (?, ?)
      `, id, pId);
    }
    
    revalidatePath("/admin/permissions");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create role:", error);
    return { success: false, error: error.message };
  }
}

export async function updateRole(id: string, data: { name?: string, description?: string, permissionIds?: string[] }) {
  try {
    if (data.name || data.description !== undefined) {
      await prisma.$executeRawUnsafe(`
        UPDATE roles SET name = COALESCE(?, name), description = COALESCE(?, description)
        WHERE id = ?
      `, data.name || null, data.description || null, id);
    }
    
    if (data.permissionIds) {
      await prisma.$executeRaw`DELETE FROM role_permissions WHERE role_id = ${id}`;
      for (const pId of data.permissionIds) {
        await prisma.$executeRawUnsafe(`
          INSERT INTO role_permissions (role_id, permission_id) 
          VALUES (?, ?)
        `, id, pId);
      }
    }
    
    revalidatePath("/admin/permissions");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update role:", error);
    return { success: false, error: error.message };
  }
}
