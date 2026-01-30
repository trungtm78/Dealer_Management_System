// FRD: SCR-SVC-006
// Refs: components/service/BayUtilization.tsx
// API: GET /api/service/bays, GET /api/service/bays/utilization
// ERD: service_bays, bay_assignments

"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import BayKPICards from "@/components/service/BayKPICards";
import BayCard from "@/components/service/BayCard";
import BayUtilizationChart from "@/components/service/BayUtilizationChart";
import BayAssignmentDialog from "@/components/service/BayAssignmentDialog";
import BayProgressDialog from "@/components/service/BayProgressDialog";
import { ServiceBayDTO, BayKPIs } from "@/lib/types/service_bay";

export default function BayUtilizationPage() {
    const [bays, setBays] = useState<ServiceBayDTO[]>([]);
    const [kpis, setKpis] = useState<BayKPIs | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [assignOpen, setAssignOpen] = useState(false);
    const [selectedBayId, setSelectedBayId] = useState<string | null>(null);
    
    const [progressOpen, setProgressOpen] = useState(false);
    const [selectedBay, setSelectedBay] = useState<ServiceBayDTO | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const [baysRes, kpiRes] = await Promise.all([
                fetch('/api/service/bays'),
                fetch('/api/service/bays/utilization')
            ]);

            const baysData = await baysRes.json();
            const kpiData = await kpiRes.json();

            if (baysData.success) setBays(baysData.data);
            if (kpiData.success) setKpis(kpiData.data);
        } catch (error) {
            toast.error("Lỗi đồng bộ dữ liệu");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Auto-refresh 30s
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleOpenAssign = (id: string) => {
        setSelectedBayId(id);
        setAssignOpen(true);
    };

    const handleOpenProgress = (bay: ServiceBayDTO) => {
        setSelectedBay(bay);
        setProgressOpen(true);
    };

    const handleCompleteWork = async (id: string) => {
        if (!confirm("Xác nhận hoàn tất công việc và giải phóng khoang?")) return;
        
        try {
            const res = await fetch(`/api/service/bays/${id}/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: 'usr-admin' })
            });
            const result = await res.json();
            if (result.success) {
                toast.success("Đã hoàn tất công việc");
                fetchData();
            } else {
                toast.error("Lỗi: " + result.error.message);
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50/30 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quản Lý Hiệu Suất Khoang</h2>
                    <p className="text-muted-foreground">Theo dõi tiến độ, điều phối công việc và tối ưu công suất xưởng dịch vụ.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={fetchData}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Làm mới
                    </Button>
                </div>
            </div>

            {kpis && <BayKPICards data={kpis} />}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {bays.map((bay) => (
                    <BayCard 
                        key={bay.id} 
                        bay={bay} 
                        onAssign={handleOpenAssign}
                        onUpdateProgress={handleOpenProgress}
                        onComplete={handleCompleteWork}
                    />
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">
                {kpis && <BayUtilizationChart data={kpis} />}
                <div className="col-span-3">
                    {/* Placeholder for future Summary or Alert list */}
                </div>
            </div>

            <BayAssignmentDialog 
                open={assignOpen} 
                onOpenChange={setAssignOpen} 
                bayId={selectedBayId} 
                onSuccess={fetchData} 
            />

            <BayProgressDialog 
                open={progressOpen} 
                onOpenChange={setProgressOpen} 
                bay={selectedBay} 
                onSuccess={fetchData} 
            />
        </div>
    );
}
