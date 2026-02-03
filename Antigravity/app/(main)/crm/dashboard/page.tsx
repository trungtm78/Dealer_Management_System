
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Megaphone } from "lucide-react";
import Link from "next/link";

export default function CRMDashboardPage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard CRM</h2>
                <p className="text-muted-foreground">Tổng quan hoạt động quản lý khách hàng</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link href="/crm/customers">
                    <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Khách Hàng</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Quản Lý</div>
                            <p className="text-xs text-muted-foreground">Danh sách khách hàng</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/crm/leads">
                    <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Leads</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Tiềm Năng</div>
                            <p className="text-xs text-muted-foreground">Theo dõi Lead</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/crm/marketing">
                    <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Chiến Dịch</CardTitle>
                            <Megaphone className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Marketing</div>
                            <p className="text-xs text-muted-foreground">Quản lý chiến dịch</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
