// FRD: SCR-CRM-001
// Refs: components/crm/LeadsBoard.tsx
// API: GET /api/crm/leads
// ERD: leads
import { getLeads } from "@/actions/crm/leads";
import LeadsBoard from "@/components/crm/LeadsBoard";

export default async function LeadsPage() {
    const leads = await getLeads();

    return (
        <div className="h-full flex flex-col">
            <LeadsBoard initialLeads={leads} />
        </div>
    );
}

