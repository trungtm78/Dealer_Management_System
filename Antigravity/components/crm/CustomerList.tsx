"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { MoreHorizontal, Plus, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
// ... imports ...
import { CRMService } from "@/services/crm.service";
import { CustomerDTO } from "@/lib/types/crm";

export function CustomerList() {
    const router = useRouter();
    const [customers, setCustomers] = useState<CustomerDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const data = await CRMService.getCustomers(query);
            setCustomers(data);
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải danh sách khách hàng");
        }
        setLoading(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadCustomers();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
            const res = await CRMService.deleteCustomer(id);
            if (res.success) {
                toast.success("Đã xóa khách hàng thành công!");
                loadCustomers();
            } else {
                toast.error("Xóa thất bại: " + res.error);
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm..."
                                className="pl-8 w-[300px]"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <Button type="submit" variant="secondary">Tìm</Button>
                    </form>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
                <Button onClick={() => router.push("/crm/customers/create")} className="bg-[#E60012] hover:bg-[#CC0010]">
                    <Plus className="mr-2 h-4 w-4" /> Thêm mới
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên khách hàng</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead>Liên hệ</TableHead>
                            <TableHead>Địa chỉ</TableHead>
                            <TableHead>Hạng thẻ</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">Đang tải...</TableCell>
                            </TableRow>
                        ) : customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">Không có dữ liệu</TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer) => (
                                <TableRow key={customer.id} className="cursor-pointer hover:bg-gray-50" onClick={() => router.push(`/crm/customers/${customer.id}`)}>
                                    <TableCell className="font-medium">
                                        <div>{customer.name}</div>
                                        {(() => {
                                            // Parse tags if it's a JSON string (SQLite), otherwise use as-is (PostgreSQL)
                                            const tags = typeof customer.tags === 'string'
                                                ? (customer.tags ? JSON.parse(customer.tags) : [])
                                                : (customer.tags || []);

                                            return tags.length > 0 && (
                                                <div className="flex gap-1 mt-1">
                                                    {tags.map((tag: string) => (
                                                        <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0">{tag}</Badge>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                    </TableCell>
                                    <TableCell>
                                        {customer.type === 'COMPANY' ? (
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Công ty</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-gray-600">Cá nhân</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {customer.phone && <div className="flex items-center gap-1"><span className="text-gray-500 text-xs">P:</span> {customer.phone}</div>}
                                            {customer.email && <div className="flex items-center gap-1"><span className="text-gray-500 text-xs">E:</span> {customer.email}</div>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate text-gray-500" title={customer.address || undefined}>
                                        {customer.address || '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={
                                            customer.tier === 'PLATINUM' ? 'bg-slate-800' :
                                                customer.tier === 'GOLD' ? 'bg-yellow-500' : 'bg-gray-400'
                                        }>
                                            {customer.tier}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/crm/customers/${customer.id}`);
                                                }}>Xem chi tiết</DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(customer.id);
                                                }} className="text-red-600 focus:text-red-600">Xóa</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
