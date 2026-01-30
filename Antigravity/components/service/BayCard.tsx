"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, User, Car, AlertTriangle, MoreHorizontal } from "lucide-react";
import { ServiceBayDTO } from "@/lib/types/service_bay";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface BayCardProps {
    bay: ServiceBayDTO;
    onAssign: (id: string) => void;
    onUpdateProgress: (bay: ServiceBayDTO) => void;
    onComplete: (id: string) => void;
}

export default function BayCard({ bay, onAssign, onUpdateProgress, onComplete }: BayCardProps) {
    const activeAssignment = bay.assignments?.[0];
    const isWorking = activeAssignment && activeAssignment.status === 'WORKING';
    const isDelayed = activeAssignment && activeAssignment.delay_minutes > 0;

    return (
        <Card className={isDelayed ? "border-red-300 shadow-md" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-bold">{bay.name}</CardTitle>
                <div className="flex items-center gap-2">
                    {isDelayed && <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />}
                    <Badge variant={bay.is_available ? "success" : "secondary" as any}>
                        {bay.is_available ? "Sẵn sàng" : "Đang sửa chữa"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                {activeAssignment ? (
                    <div className="space-y-4 pt-2">
                        <div className="grid gap-1">
                            <div className="flex items-center gap-2 text-sm">
                                <Car className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">{activeAssignment.repairOrder?.ro_number}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span>{activeAssignment.repairOrder?.customer?.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>Dự kiến: {activeAssignment.estimated_end ? new Date(activeAssignment.estimated_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                                <span>Tiến độ</span>
                                <span>{activeAssignment.progress_percent}%</span>
                            </div>
                            <Progress value={activeAssignment.progress_percent} className="h-2" />
                        </div>

                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1" onClick={() => onUpdateProgress(bay)}>Cập nhật</Button>
                            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => onComplete(bay.id)}>Hoàn tất</Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <p className="text-sm text-muted-foreground mb-4">Khoang hiện đang trống</p>
                        <Button size="sm" onClick={() => onAssign(bay.id)}>Điều phối công việc</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
