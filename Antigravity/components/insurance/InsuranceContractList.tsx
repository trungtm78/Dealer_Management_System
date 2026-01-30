"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InsuranceContractDTO } from "@/lib/types/insurance";

interface InsuranceContractListProps {
  contracts: InsuranceContractDTO[];
}

export default function InsuranceContractList({ contracts }: InsuranceContractListProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Số Hợp Đồng</TableHead>
            <TableHead>Khách Hàng</TableHead>
            <TableHead>VIN</TableHead>
            <TableHead>Nhà Cung Cấp</TableHead>
            <TableHead>Hết Hạn</TableHead>
            <TableHead>Trạng Thái</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell className="font-medium">{contract.contract_number}</TableCell>
              <TableCell>{contract.customer_name || 'Hệ thống'}</TableCell>
              <TableCell className="font-mono text-xs">{contract.vehicle_vin}</TableCell>
              <TableCell>{contract.provider}</TableCell>
              <TableCell>{new Date(contract.end_date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={contract.status === 'ACTIVE' ? 'success' : 'secondary' as any}>
                  {contract.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" /> Chi tiết
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
