
import BalanceSheet from "@/components/accounting/BalanceSheet";

export default function BalanceSheetPage() {
    return (
        <div className="h-full p-8">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Bảng Cân Đối Kế Toán</h2>
                    <p className="text-muted-foreground">
                        Tình hình tài sản, nguồn vốn và công nợ tại một thời điểm.
                    </p>
                </div>
            </div>
            <BalanceSheet />
        </div>
    );
}
