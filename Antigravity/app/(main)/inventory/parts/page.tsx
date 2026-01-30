
import InventoryList from "@/components/parts/InventoryList";

export default function InventoryPage() {
    return (
        <div className="h-full p-8">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quản Lý Kho Phụ Tùng</h2>
                    <p className="text-muted-foreground">
                        Theo dõi tồn kho, định mức an toàn và quản lý danh mục phụ tùng.
                    </p>
                </div>
            </div>
            <InventoryList />
        </div>
    );
}
