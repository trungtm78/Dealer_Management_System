
import StockMovements from "@/components/parts/StockMovements";

export default function MovementsPage() {
    return (
        <div className="h-full p-8">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quản Lý Nhập Xuất</h2>
                    <p className="text-muted-foreground">
                        Lịch sử biến động kho và truy vết giao dịch.
                    </p>
                </div>
            </div>
            <StockMovements />
        </div>
    );
}
