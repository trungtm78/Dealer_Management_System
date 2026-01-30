
import Depreciation from "@/components/accounting/Depreciation";

export default function DepreciationPage() {
    return (
        <div className="h-full p-8">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quản Lý Khấu Hao</h2>
                    <p className="text-muted-foreground">
                        Bảng tính chi phí khấu hao định kỳ.
                    </p>
                </div>
            </div>
            <Depreciation />
        </div>
    );
}
