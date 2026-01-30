
import PnLReport from "@/components/accounting/PnLReport";

export default function PnLPage() {
    return (
        <div className="h-full p-8">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Báo Cáo Lãi Lỗ</h2>
                    <p className="text-muted-foreground">
                        Chi tiết doanh thu, chi phí và lợi nhuận (Income Statement).
                    </p>
                </div>
            </div>
            <PnLReport />
        </div>
    );
}
