// FRD: INS-002
// Refs: components/insurance/InsuranceClaimList.tsx
// API: GET /api/insurance/claims
// ERD: insurance_claims, insurance_contracts

import InsuranceClaimList from "@/components/insurance/InsuranceClaimList";
import { getClaims } from "@/actions/insurance/claims";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function InsuranceClaimsPage() {
  const claims = await getClaims();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản Lý Bồi Thường</h1>
          <p className="text-muted-foreground">Theo dõi và xử lý các yêu cầu bồi thường bảo hiểm.</p>
        </div>
        <Button className="bg-[#E60012] hover:bg-[#c50010]">
          <Plus className="mr-2 h-4 w-4" /> Tạo Yêu Cầu Mới
        </Button>
      </div>

      <InsuranceClaimList claims={claims} />
    </div>
  );
}
