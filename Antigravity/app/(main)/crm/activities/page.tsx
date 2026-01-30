// FRD: SCR-CRM-005
// Refs: components/crm/LeadActivitiesList.tsx
// API: GET /api/crm/interactions
// ERD: interactions
import { getLeads } from "@/actions/crm/leads";
import { LeadActivitiesList } from "@/components/crm/LeadActivitiesList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LeadActivitiesPage() {
    // Server Action Fetch
    const leads = await getLeads();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Lịch Sử & Hoạt Động</h2>
                    <p className="text-muted-foreground">
                        Theo dõi toàn bộ tương tác và lịch sử chăm sóc khách hàng
                    </p>
                </div>
            </div>

            <LeadActivitiesList leads={leads} />
        </div>
    );
}

