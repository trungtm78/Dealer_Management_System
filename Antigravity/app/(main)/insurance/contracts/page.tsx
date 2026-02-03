// FRD: SCR-INS-001
// Refs: components/insurance/InsuranceContractList.tsx
// API: GET /api/insurance/contracts
// ERD: insurance_contracts, customers
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { InsuranceService } from "@/services/insurance.service";
import { InsuranceContractDTO } from "@/lib/types/insurance";
import InsuranceContractList from "@/components/insurance/InsuranceContractList";

export default function ContractsPage() {
    const [contracts, setContracts] = useState<InsuranceContractDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("ALL");

    const loadData = async () => {
        try {
            const contractsData = await InsuranceService.getContracts();
            setContracts(contractsData);
        } catch (error) {
            toast.error("Lỗi tải dữ liệu");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredContracts = contracts.filter(c => {
        const matchesSearch = c.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.customer_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.vehicle_vin.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "ALL" || c.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="h-full p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Danh Sách Hợp Đồng</h2>
                    <p className="text-muted-foreground">Quản lý hồ sơ và theo dõi tình trạng hợp đồng bảo hiểm.</p>
                </div>

                <Link href="/insurance/contracts/create">
                    <Button className="bg-[#E60012] hover:bg-[#B8000E]">
                        <Plus className="mr-2 h-4 w-4" /> Tạo Hợp Đồng Mới
                    </Button>
                </Link>
            </div>

            <div className="flex items-center justify-between space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm theo số HĐ, VIN, khách hàng..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Trạng Thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tất Cả</SelectItem>
                        <SelectItem value="ACTIVE">Hiệu Lực</SelectItem>
                        <SelectItem value="EXPIRED">Hết Hạn</SelectItem>
                        <SelectItem value="CANCELLED">Đã Hủy</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <InsuranceContractList contracts={filteredContracts} />
        </div>
    )
}
