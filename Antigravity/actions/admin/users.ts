"use server";

import prisma from "@/lib/prisma";
import { UserDTO, CreateUserInput, UpdateUserInput } from "@/lib/types/admin";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getUsers(): Promise<UserDTO[]> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { created_at: 'desc' }
    });
    return users.map(u => ({
      ...u,
      created_at: u.created_at.toISOString(),
      updated_at: u.updated_at.toISOString(),
      last_login: u.last_login ? u.last_login.toISOString() : null,
      is_active: (u as any).is_active ?? true
    }));
  } catch (error) {
    console.error("Failed to get users:", error);
    return [];
  }
}

 export async function createUser(data: CreateUserInput) {
   try {
     if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
       return { success: false, error: "Email không đúng định dạng" };
     }

     if (!data.phone || !/^\d{10}$/.test(data.phone.toString())) {
       return { success: false, error: "Số điện thoại phải có 10 chữ số" };
     }

     const roleExists = await prisma.role.findFirst({
       where: { name: data.role }
     });
     if (!roleExists) {
       return { success: false, error: "Vai trò không tồn tại trong hệ thống" };
     }

     const hashedPassword = await bcrypt.hash("honda123", 10);
     const user = await prisma.user.create({
       data: {
         email: data.email,
         name: data.name,
         role: data.role,
         role_id: roleExists.id,
         department: data.department,
         phone: data.phone,
         password_hash: hashedPassword,
         status: 'ACTIVE'
       }
     });
     revalidatePath("/admin/users");
     return { success: true, data: user };
   } catch (error: any) {
     console.error("Failed to create user:", error);
     return { success: false, error: error.message };
   }
 }

export async function updateUser(id: string, data: UpdateUserInput) {
  try {
    await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        department: data.department,
        phone: data.phone,
        status: data.status,
        is_active: data.is_active
      } as any
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update user:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.update({ 
      where: { id },
      data: { 
        status: 'INACTIVE',
        deleted_at: new Date()
      }
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    return { success: false, error: error.message };
  }
}

export async function resetPassword(id: string) {
  try {
    const hashedPassword = await bcrypt.hash("honda123", 10);
    await prisma.user.update({
      where: { id },
      data: { password_hash: hashedPassword }
    });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to reset password:", error);
    return { success: false, error: error.message };
  }
}
