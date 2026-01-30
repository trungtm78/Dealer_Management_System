"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Settings, FileText, Activity, ShieldCheck, AlertTriangle } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
    const { state } = useAdmin();
    const { users, logs, settings } = state;

    const activeUsers = users.filter(u => u.status === "Active").length;
    const adminUsers = users.filter(u => u.role === "Admin").length;
    const todayLogs = logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length;

    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Trung Tâm Quản Trị</h2>
                <p className="text-muted-foreground">Tổng quan hệ thống và hoạt động người dùng.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng Người Dùng</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-muted-foreground text-green-600">{activeUsers} đang hoạt động</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quản Trị Viên</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{adminUsers}</div>
                        <p className="text-xs text-muted-foreground">Quyền hạn cao nhất</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hoạt Động Hôm Nay</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayLogs}</div>
                        <p className="text-xs text-muted-foreground">tác vụ được ghi nhận</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Trạng Thái Hệ Thống</CardTitle>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">Ổn định</div>
                        <p className="text-xs text-muted-foreground">{settings.dealerName}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Nhật Ký Hoạt Động Gần Đây</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[350px]">
                            <div className="space-y-4">
                                {logs.slice(0, 10).map((log) => (
                                    <div key={log.id} className="flex items-start gap-4 border-b pb-4 last:border-none">
                                        <div className={`mt-1 p-2 rounded-full ${log.module === 'Admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                <span className="font-bold">{log.userName}</span>: {log.action}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{log.details}</p>
                                            <p className="text-[10px] text-gray-400">{log.timestamp} - Module: {log.module}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Phân Bố Nhân Sự</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { role: "Sales", count: users.filter(u => u.role === "Sales").length, color: "bg-blue-500" },
                                { role: "Service", count: users.filter(u => u.role === "Service").length, color: "bg-orange-500" },
                                { role: "Accountant", count: users.filter(u => u.role === "Accountant").length, color: "bg-green-500" },
                                { role: "Admin", count: users.filter(u => u.role === "Admin").length, color: "bg-purple-500" },
                            ].map((item) => (
                                <div key={item.role} className="flex items-center">
                                    <div className="w-24 text-sm font-medium">{item.role}</div>
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full mx-2">
                                        <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${(item.count / users.length) * 100}%` }}></div>
                                    </div>
                                    <div className="text-sm font-bold text-muted-foreground">{item.count}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
