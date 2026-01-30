
import PurchaseList from "@/components/parts/PurchaseList";

export default function PurchasesPage() {
    return (
        <div className="h-full p-8">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Mua Hàng & Cung Ứng</h2>
                    <p className="text-muted-foreground">
                        Quản lý yêu cầu mua hàng, đơn đặt hàng và nhập kho từ nhà cung cấp.
                    </p>
                </div>
            </div>
            <PurchaseList />
        </div>
    );
}
