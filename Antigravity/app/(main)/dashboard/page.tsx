// FRD: SCR-DASH-001
// Refs: components/OperationalDashboard.tsx
// API: GET /api/dashboard/kpis
// ERD: leads, customers, quotations, test_drives, repair_orders
import OperationalDashboard from "@/components/OperationalDashboard";

export default function DashboardPage() {
    return <OperationalDashboard />;
}

