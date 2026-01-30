
import Payables from "@/components/accounting/Payables";

export default function PayablesPage() {
    return (
        <div className="h-full p-8">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Công Nợ Phải Trả (AP)</h2>
                    <p className="text-muted-foreground">
                        Theo dõi nghĩa vụ thanh toán cho nhà cung cấp.
                    </p>
                </div>
            </div>
            <Payables />
        </div>
    );
}
