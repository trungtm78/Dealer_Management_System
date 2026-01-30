
import BackorderList from "@/components/parts/BackorderList";

export default function BackorderPage() {
    return (
        <div className="h-full p-8">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quản Lý Hàng Nợ (Backorder)</h2>
                    <p className="text-muted-foreground">
                        Theo dõi các phụ tùng đang nợ khách hàng và xử lý khi hàng về.
                    </p>
                </div>
            </div>
            <BackorderList />
        </div>
    );
}
