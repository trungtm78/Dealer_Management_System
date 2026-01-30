"use client";

import { useAdmin, ApiConfig } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { CheckCircle2, AlertCircle, RefreshCw, Settings2 } from "lucide-react";

export default function ApiConfigurationPage() {
    const { state, updateApiConfig } = useAdmin();
    const [editingConfig, setEditingConfig] = useState<ApiConfig | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleTestConnection = (config: ApiConfig) => {
        toast.promise(
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() > 0.2) resolve(true);
                    else reject(new Error("Timeout"));
                }, 2000);
            }),
            {
                loading: `Connecting to ${config.name}...`,
                success: `Connected to ${config.name} successfully!`,
                error: `Failed to connect to ${config.name}`,
            }
        );
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingConfig) {
            updateApiConfig({
                ...editingConfig,
                lastSync: new Date().toLocaleString() // Update sync time on save
            });
            setIsDialogOpen(false);
            toast.success(`Updated configuration for ${editingConfig.name}`);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Cấu Hình API</h2>
                    <p className="text-muted-foreground">Quản lý kết nối với các dịch vụ bên ngoài.</p>
                </div>
                <Button>
                    <RefreshCw className="mr-2 h-4 w-4" /> Sync All
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {state.apiConfigs.map((config) => (
                    <Card key={config.id}>
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="bg-muted p-2 rounded-full">
                                    <Settings2 className="h-6 w-6 text-primary" />
                                </div>
                                <Badge variant={config.status === "Active" ? "default" : "secondary"}>
                                    {config.status}
                                </Badge>
                            </div>
                            <CardTitle className="mt-4">{config.name}</CardTitle>
                            <CardDescription className="truncate">{config.baseUrl}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground space-y-2">
                                <div className="flex justify-between">
                                    <span>Last Sync:</span>
                                    <span className="font-medium text-foreground">{config.lastSync}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>API Key:</span>
                                    <span className="font-mono text-foreground">••••••••••••</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between gap-2">
                            <Button variant="outline" className="w-full" onClick={() => handleTestConnection(config)}>
                                Test
                            </Button>

                            <Dialog open={isDialogOpen && editingConfig?.id === config.id} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (open) setEditingConfig(config);
                                else setEditingConfig(null);
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="w-full" onClick={() => { setEditingConfig(config); setIsDialogOpen(true); }}>
                                        Configure
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Configuration</DialogTitle>
                                        <DialogDescription>
                                            Update settings for {config.name}. Click save when done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    {editingConfig && (
                                        <form onSubmit={handleSave} className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="name" className="text-right">Name</Label>
                                                <Input id="name" value={editingConfig.name} onChange={(e) => setEditingConfig({ ...editingConfig, name: e.target.value })} className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="baseUrl" className="text-right">Base URL</Label>
                                                <Input id="baseUrl" value={editingConfig.baseUrl} onChange={(e) => setEditingConfig({ ...editingConfig, baseUrl: e.target.value })} className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="apiKey" className="text-right">API Key</Label>
                                                <Input id="apiKey" type="password" value={editingConfig.apiKey} onChange={(e) => setEditingConfig({ ...editingConfig, apiKey: e.target.value })} className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="status" className="text-right">Status</Label>
                                                <Select value={editingConfig.status} onValueChange={(val: ApiConfig["status"]) => setEditingConfig({ ...editingConfig, status: val })}>
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Active">Active</SelectItem>
                                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit">Save Changes</Button>
                                            </DialogFooter>
                                        </form>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
