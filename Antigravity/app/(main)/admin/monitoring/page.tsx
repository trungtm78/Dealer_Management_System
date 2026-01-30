"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Cpu, Server, Users, Wifi } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { time: "00:00", requests: 400 },
    { time: "03:00", requests: 300 },
    { time: "06:00", requests: 200 },
    { time: "09:00", requests: 800 },
    { time: "12:00", requests: 1200 },
    { time: "15:00", requests: 1500 },
    { time: "18:00", requests: 1000 },
    { time: "21:00", requests: 600 },
];

export default function SystemMonitoringPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Giám Sát Hệ Thống</h2>
                <p className="text-muted-foreground">Theo dõi trạng thái sức khỏe và hiệu năng của hệ thống.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                        <Wifi className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">99.9%</div>
                        <p className="text-xs text-muted-foreground">Operational</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                        <Cpu className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45%</div>
                        <p className="text-xs text-muted-foreground">2 Cores active</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                        <Server className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2.4 GB</div>
                        <p className="text-xs text-muted-foreground">of 8 GB Total</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 since last hour</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Lưu Lượng Truy Cập</CardTitle>
                        <CardDescription>Số lượng requests trong 24h qua.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="requests" stroke="#E60012" strokeWidth={2} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Dịch Vụ Nền</CardTitle>
                        <CardDescription>Trạng thái các service background.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-green-500 mr-2" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Database Service</p>
                                    <p className="text-xs text-muted-foreground">PostgreSQL 15.0 - Running</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-green-500 mr-2" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Redis Cache</p>
                                    <p className="text-xs text-muted-foreground">Redis 7.0 - Running</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-yellow-500 mr-2" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Job Queue</p>
                                    <p className="text-xs text-muted-foreground">Processing delayed (High Load)</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-green-500 mr-2" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Storage Service</p>
                                    <p className="text-xs text-muted-foreground">S3 Bucket - Healthy</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
