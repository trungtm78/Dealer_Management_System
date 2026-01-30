
// FRD: SCR-ACC-001
// Refs: components/accounting/FinancialDashboard.tsx
// API: GET /api/accounting/dashboard
// ERD: invoices, payments, transactions
import FinancialDashboard from "@/components/accounting/FinancialDashboard";

export default function AccountingDashboardPage() {
    return (
        <div className="h-full p-8">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard Tài Chính</h2>
                    <p className="text-muted-foreground">
                        Tổng quan tình hình sức khỏe tài chính của doanh nghiệp.
                    </p>
                </div>
            </div>
            <FinancialDashboard />
        </div>
    );
}

