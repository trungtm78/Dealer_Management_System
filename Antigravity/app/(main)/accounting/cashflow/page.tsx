
import CashFlow from "@/components/accounting/CashFlow";

export default function CashFlowPage() {
    return (
        <div className="h-full p-8">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Lưu Chuyển Tiền Tệ</h2>
                    <p className="text-muted-foreground">
                        Theo dõi dòng tiền vào và ra (Cash Flow Statement).
                    </p>
                </div>
            </div>
            <CashFlow />
        </div>
    );
}
