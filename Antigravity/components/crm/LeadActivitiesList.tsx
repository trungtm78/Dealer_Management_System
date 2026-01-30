"use client";

import { useState, useMemo } from "react";
import { LeadDTO } from "@/lib/types/crm"; // Ensure LeadDTO is imported
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Search, Filter, Layers, User, Phone, Mail, Calendar, Eye, Activity
} from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LeadActivitiesListProps {
    leads: LeadDTO[];
}

export function LeadActivitiesList({ leads }: LeadActivitiesListProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [groupBy, setGroupBy] = useState<string | null>(null); // 'status', 'source', 'assignedTo'

    // --- Search Logic ---
    const filteredLeads = useMemo(() => {
        if (!searchTerm) return leads;
        const lower = searchTerm.toLowerCase();
        return leads.filter(l =>
            l.name.toLowerCase().includes(lower) ||
            l.phone.includes(lower) ||
            (l.email && l.email.toLowerCase().includes(lower))
        );
    }, [leads, searchTerm]);

    // --- Grouping Logic ---
    const groupedLeads = useMemo(() => {
        if (!groupBy) return { "All Leads": filteredLeads };

        const groups: Record<string, LeadDTO[]> = {};

        filteredLeads.forEach(lead => {
            let key = "Unknown";
            if (groupBy === 'status') key = lead.status;
            else if (groupBy === 'source') key = lead.source;
            else if (groupBy === 'customerType') key = lead.customer_type || "Chưa phân loại";
            // Mocking Assigned User for now since DTO might not have processed name yet, 
            // but assuming we expand mapped LeadDTO or just use ID for now. 
            // LeadsBoard usually maps it, let's assume 'system' or 'admin' for now if missing.
            // In real app, DTO should include `assignedToName`. available in schema but DTO might need check.

            if (!groups[key]) groups[key] = [];
            groups[key].push(lead);
        });

        return groups;
    }, [filteredLeads, groupBy]);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'NEW': 'bg-blue-100 text-blue-800',
            'CONTACTED': 'bg-yellow-100 text-yellow-800',
            'QUALIFIED': 'bg-purple-100 text-purple-800',
            'TEST_DRIVE': 'bg-indigo-100 text-indigo-800',
            'WON': 'bg-green-100 text-green-800',
            'DEAD': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-4">
            {/* --- Control Bar (Odoo Style) --- */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-3 rounded-lg border shadow-sm">
                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Tìm kiếm theo Tên, SĐT, Email..."
                        className="pl-9 bg-gray-50 border-gray-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filters & Group By */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Layers className="w-4 h-4" />
                                Gom nhóm {groupBy ? '(Đang bật)' : ''}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Nhóm theo</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={groupBy === null}
                                onCheckedChange={() => setGroupBy(null)}
                            >
                                Không gom nhóm
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={groupBy === 'status'}
                                onCheckedChange={() => setGroupBy('status')}
                            >
                                Trạng thái (Stage)
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={groupBy === 'source'}
                                onCheckedChange={() => setGroupBy('source')}
                            >
                                Nguồn Lead
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={groupBy === 'customerType'}
                                onCheckedChange={() => setGroupBy('customerType')}
                            >
                                Loại khách hàng
                            </DropdownMenuCheckboxItem>
                            {/* Future: Assigned User */}
                            <DropdownMenuCheckboxItem disabled>
                                Người phụ trách (Sắp có)
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* --- Content Area --- */}
            <div className="space-y-6">
                {Object.entries(groupedLeads).map(([groupTitle, groupLeads]) => (
                    <Card key={groupTitle} className="overflow-hidden border-none shadow-sm bg-transparent">
                        {groupBy && (
                            <div className="flex items-center gap-2 mb-2 px-1">
                                <div className="font-bold text-gray-700 bg-white px-3 py-1 rounded-md border shadow-sm flex items-center gap-2">
                                    {groupBy === 'status' && <Activity className="w-4 h-4 text-blue-500" />}
                                    {groupBy === 'source' && <Layers className="w-4 h-4 text-orange-500" />}
                                    {groupTitle}
                                    <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                                        {groupLeads.length}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="rounded-md border bg-white">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead className="w-[250px]">Khách Hàng</TableHead>
                                        <TableHead>Liên Hệ</TableHead>
                                        <TableHead>Trạng Thái</TableHead>
                                        <TableHead>Nguồn</TableHead>
                                        <TableHead className="text-center">Hoạt Động</TableHead>
                                        <TableHead>Cập Nhật Cuối</TableHead>
                                        <TableHead className="text-right">Hành Động</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {groupLeads.map((lead) => (
                                        <TableRow key={lead.id} className="hover:bg-blue-50/30 cursor-pointer" onClick={() => router.push(`/crm/leads/${lead.id}/history`)}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span className="text-blue-600 font-semibold hover:underline">{lead.name}</span>
                                                    {lead.customer_type && <span className="text-xs text-gray-400 capitalize">{lead.customer_type}</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3" /> {lead.phone}
                                                    </div>
                                                    {lead.email && (
                                                        <div className="flex items-center gap-1">
                                                            <Mail className="w-3 h-3" /> {lead.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`border-0 ${getStatusColor(lead.status)}`}>
                                                    {lead.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-normal text-gray-600">
                                                    {lead.source}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {lead.interactions?.length || 0}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-500">
                                                {/* Use simple string handling to avoid date lib issues if any */}
{lead.interactions && lead.interactions.length > 0
                                                    ? new Date(lead.interactions[0].created_at).toLocaleDateString('vi-VN')
                                                    : new Date(lead.created_at).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="ghost" onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/crm/leads/${lead.id}/history`);
                                                }}>
                                                    <Eye className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
