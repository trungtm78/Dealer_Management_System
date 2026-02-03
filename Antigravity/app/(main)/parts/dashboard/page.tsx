
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function PartsDashboardPage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Phụ Tùng</h2>
                <p className="text-muted-foreground">Quản lý kho và cung ứng phụ tùng</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link href="/parts/inventory">
                    <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tồn Kho</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Tra Cứu</div>
                            <p className="text-xs text-muted-foreground">Xem danh sách phụ tùng</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/parts/purchases">
                    <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Mua Hàng</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Đặt Hàng</div>
                            <p className="text-xs text-muted-foreground">Quản lý mua hàng</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/parts/return">
                    <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Trả Hàng</CardTitle>
                            <RotateCcw className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Đổi Trả</div>
                            <p className="text-xs text-muted-foreground">Quản lý trả hàng</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
