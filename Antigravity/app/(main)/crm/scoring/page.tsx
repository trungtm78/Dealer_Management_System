// FRD: SCR-CRM-003
// Refs: components/crm/ScoringDashboard.tsx
// API: GET /api/crm/scoring/rules
// ERD: scoring_rules, leads
import { getScoringRules } from "@/actions/crm/scoring";
import ScoringDashboard from "@/components/crm/ScoringDashboard";

export default async function ScoringPage() {
    const rules = await getScoringRules();

    return (
        <div className="h-full flex flex-col">
            <ScoringDashboard initialRules={rules} />
        </div>
    );
}

