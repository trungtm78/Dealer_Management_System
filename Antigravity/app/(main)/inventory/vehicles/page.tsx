
import VehicleList from "@/components/inventory/VehicleList";

export default function VehiclesPage() {
    return (
        <div className="h-full p-8">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quản Lý Kho Xe</h2>
                    <p className="text-muted-foreground">
                        Theo dõi tồn kho xe, vị trí (VIN) và trạng thái xe.
                    </p>
                </div>
            </div>
            <VehicleList />
        </div>
    );
}
