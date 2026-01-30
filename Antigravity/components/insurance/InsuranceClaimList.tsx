"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { InsuranceClaimDTO } from "@/lib/types/insurance";
import { updateClaimStatus } from "@/actions/insurance/claims";
import { toast } from "sonner";

interface InsuranceClaimListProps {
  claims: InsuranceClaimDTO[];
}

export default function InsuranceClaimList({ claims }: InsuranceClaimListProps) {
  const handleStatusUpdate = async (id: string, status: string) => {
    const res = await updateClaimStatus(id, status);
    if (res.success) toast.success("Đã cập nhật trạng thái");
    else toast.error("Lỗi: " + res.error);
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Số Bồi Thường</TableHead>
            <TableHead>Hợp Đồng</TableHead>
            <TableHead>Ngày Xảy Ra</TableHead>
            <TableHead>Số Tiền Yêu Cầu</TableHead>
            <TableHead>Trạng Thái</TableHead>
            <TableHead className="text-right">Thao Tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.map((claim) => (
            <TableRow key={claim.id}>
              <TableCell className="font-medium">{claim.claim_number}</TableCell>
              <TableCell>{claim.contract_number}</TableCell>
              <TableCell>{new Date(claim.incident_date).toLocaleDateString()}</TableCell>
              <TableCell>{claim.claim_amount.toLocaleString()} VND</TableCell>
              <TableCell>
                <Badge variant="outline">{claim.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {claim.status === 'SUBMITTED' && (
                    <>
                      <Button size="sm" variant="ghost" className="text-green-600" onClick={() => handleStatusUpdate(claim.id, 'APPROVED')}>
                        <CheckCircle className="h-4 w-4 mr-1" /> Duyệt
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleStatusUpdate(claim.id, 'REJECTED')}>
                        <XCircle className="h-4 w-4 mr-1" /> Từ chối
                      </Button>
                    </>
                  )}
                  {claim.status === 'APPROVED' && (
                    <Button size="sm" variant="ghost" className="text-blue-600" onClick={() => handleStatusUpdate(claim.id, 'PAID')}>
                      <Clock className="h-4 w-4 mr-1" /> Thanh toán
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
