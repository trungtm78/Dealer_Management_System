// FRD: SCR-CRM-010
// Refs: components/crm/MarketingDashboard.tsx
// API: GET /api/crm/campaigns
// ERD: marketing_campaigns, customers
import { getCampaigns } from "@/actions/crm/marketing";
import MarketingDashboard from "@/components/crm/MarketingDashboard";

export default async function MarketingPage() {
    const campaigns = await getCampaigns();

    return (
        <div className="h-full flex flex-col">
            <MarketingDashboard initialCampaigns={campaigns} />
        </div>
    );
}

