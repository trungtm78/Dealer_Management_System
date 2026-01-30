
import CostAnalysis from "@/components/accounting/CostAnalysis";

export default function AnalysisPage() {
    return (
        <div className="h-full p-8">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Phân Tích Chi Phí & Lợi Nhuận</h2>
                    <p className="text-muted-foreground">
                        Báo cáo chi tiết hiệu quả sử dụng nguồn vốn và ngân sách.
                    </p>
                </div>
            </div>
            <CostAnalysis />
        </div>
    );
}
