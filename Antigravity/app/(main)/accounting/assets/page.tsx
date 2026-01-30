
import FixedAssets from "@/components/accounting/FixedAssets";

export default function AssetsPage() {
    return (
        <div className="h-full p-8">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quản Lý Tài Sản Cố Định</h2>
                    <p className="text-muted-foreground">
                        Danh mục và trạng thái các tài sản của doanh nghiệp.
                    </p>
                </div>
            </div>
            <FixedAssets />
        </div>
    );
}
