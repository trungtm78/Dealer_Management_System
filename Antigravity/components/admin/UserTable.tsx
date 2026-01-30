"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserCog, Key, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserDTO } from "@/lib/types/admin";

interface UserTableProps {
  users: UserDTO[];
  onEdit: (user: UserDTO) => void;
  onResetPassword: (user: UserDTO) => void;
  onDelete: (id: string) => void;
}

export default function UserTable({ users, onEdit, onResetPassword, onDelete }: UserTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên Người Dùng</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Vai Trò</TableHead>
            <TableHead>Phòng Ban</TableHead>
            <TableHead>Trạng Thái</TableHead>
            <TableHead>Lần Cuối Đăng Nhập</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="secondary">{user.role}</Badge>
              </TableCell>
              <TableCell>{user.department || '-'}</TableCell>
              <TableCell>
                <Badge variant={user.is_active ? "success" : "destructive" as any}>
                  {user.is_active ? 'Hoạt động' : 'Khóa'}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {user.last_login ? new Date(user.last_login).toLocaleString() : 'Chưa từng'}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <UserCog className="mr-2 h-4 w-4" /> Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onResetPassword(user)}>
                      <Key className="mr-2 h-4 w-4" /> Đặt lại mật khẩu
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600"
                      onClick={() => onDelete(user.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Xóa người dùng
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
