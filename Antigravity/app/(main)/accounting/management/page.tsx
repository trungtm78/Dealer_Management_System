
import ManagementReport from "@/components/accounting/ManagementReport";

export default function ManagementPage() {
    return (
        <div className="h-full p-8">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Báo Cáo Quản Trị</h2>
                    <p className="text-muted-foreground">
                        Phân tích sâu dữ liệu tài chính phục vụ ra quyết định kinh doanh.
                    </p>
                </div>
            </div>
            <ManagementReport />
        </div>
    );
}
