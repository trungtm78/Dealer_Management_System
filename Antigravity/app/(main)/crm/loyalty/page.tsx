// FRD: SCR-CRM-007
// Refs: components/crm/LoyaltyDashboard.tsx
// API: GET /api/crm/customers/{id}/loyalty
// ERD: customers, loyalty_transactions
import { getLoyaltyCustomers } from "@/actions/crm/loyalty";
import LoyaltyDashboard from "@/components/crm/LoyaltyDashboard";

export default async function LoyaltyPage() {
    const customers = await getLoyaltyCustomers();

    return (
        <div className="h-full flex flex-col">
            <LoyaltyDashboard initialCustomers={customers} />
        </div>
    );
}

