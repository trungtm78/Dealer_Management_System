"use client";

import { useState, useTransition, useEffect, useMemo } from 'react';
import { Save, RefreshCw, Plus, Trash2, Settings, AlertCircle, Loader2, Layers, CheckCircle2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScoringRuleDTO } from "@/lib/types/crm";
import { toggleRule, updateRuleWeight, createScoringRule, deleteScoringRule, deleteManyScoringRules, recalculateAllLeadsScore } from "@/actions/crm/scoring";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import ScoringSimulator from './ScoringSimulator';
import ScoringConfigDialog from './ScoringConfigDialog';

interface ScoringDashboardProps {
    initialRules: ScoringRuleDTO[];
}

export default function ScoringDashboard({ initialRules }: ScoringDashboardProps) {
    const [rules, setRules] = useState<ScoringRuleDTO[]>(initialRules);
    const [isPending, startTransition] = useTransition();
    const [isRecalculating, startRecalculating] = useTransition();
    const router = useRouter();

    // Sync local state with server data (important for router.refresh())
    useEffect(() => {
        setRules(initialRules);
    }, [initialRules]);

    // Selection State
    const [selectedRules, setSelectedRules] = useState<Set<string>>(new Set());

    const toggleSelectRule = (id: string, checked: boolean) => {
        const newSelected = new Set(selectedRules);
        if (checked) newSelected.add(id);
        else newSelected.delete(id);
        setSelectedRules(newSelected);
    };

    const toggleSelectGroup = (category: string, checked: boolean) => {
        const rulesInGroup = rules.filter(r => r.category === category);
        const newSelected = new Set(selectedRules);

        rulesInGroup.forEach(r => {
            if (checked) newSelected.add(r.id);
            else newSelected.delete(r.id);
        });

        setSelectedRules(newSelected);
    };

    const isGroupSelected = (category: string) => {
        const rulesInGroup = rules.filter(r => r.category === category);
        if (rulesInGroup.length === 0) return false;
        return rulesInGroup.every(r => selectedRules.has(r.id));
    };

    const isGroupIndeterminate = (category: string) => {
        const rulesInGroup = rules.filter(r => r.category === category);
        if (rulesInGroup.length === 0) return false;
        const selectedCount = rulesInGroup.filter(r => selectedRules.has(r.id)).length;
        return selectedCount > 0 && selectedCount < rulesInGroup.length;
    };

    // Add Rule State
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newRule, setNewRule] = useState<{ category: string; criteria: string; weight: number; enabled: boolean }>({ category: 'Nguồn Lead', criteria: '', weight: 10, enabled: true });



    const handleWeightChange = (id: string, newWeight: number) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, weight: newWeight } : r));
        startTransition(async () => {
            await updateRuleWeight(id, newWeight);
        });
    };

    const handleToggle = (id: string, currentStatus: boolean) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !currentStatus } : r));
        startTransition(async () => {
            await toggleRule(id, currentStatus);
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa quy tắc này?")) return;
        setRules(prev => prev.filter(r => r.id !== id));
        startTransition(async () => {
            const res = await deleteScoringRule(id);
            if (res.success) toast.success("Đã xóa quy tắc");
            else {
                toast.error("Xóa thất bại");
                router.refresh();
            }
        });
    };

    const handleBulkDelete = () => {
        if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedRules.size} quy tắc đã chọn?`)) return;

        const idsToDelete = Array.from(selectedRules);
        setRules(prev => prev.filter(r => !selectedRules.has(r.id)));
        setSelectedRules(new Set()); // Clear selection locally

        startTransition(async () => {
            const res = await deleteManyScoringRules(idsToDelete);
            if (res.success) toast.success("Đã xóa các quy tắc đã chọn");
            else {
                toast.error("Xóa thất bại");
                router.refresh();
            }
        });
    };

    const handleAddRule = async () => {
        if (!newRule.criteria.trim()) return;

        startTransition(async () => {
            const res = await createScoringRule(newRule.category, newRule.criteria, newRule.weight, newRule.enabled);
            if (res.success) {
                toast.success("Đã thêm quy tắc mới");
                setIsAddDialogOpen(false);
                setNewRule({ ...newRule, criteria: '', enabled: true });
                router.refresh();
            } else {
                toast.error("Thêm thất bại");
            }
        });
    };

    const handleRecalculate = () => {
        startRecalculating(async () => {
            const res = await recalculateAllLeadsScore();
            if (res.success) {
                toast.success(`Đã tính lại điểm cho ${res.count} Leads thành công!`);
            } else {
                toast.error("Có lỗi xảy ra khi tính lại điểm.");
            }
        });
    };

    // Config State
    const [scoringConfig, setScoringConfig] = useState({
        hot: { min: 80, label: "Hot Lead", color: "green" },
        warm: { min: 50, label: "Warm Lead", color: "yellow" },
        cold: { min: 0, label: "Cold Lead", color: "gray" },
    });

    const categories = Array.from(new Set(rules.map(r => r.category)));
    // Add default categories if empty or just validation
    const availableCategories = ['Nguồn Lead', 'Sản Phẩm Quan Tâm', 'Hành Vi', 'Thông Tin Xe', 'Ngân Sách', 'Thời Gian Mua', 'Loại Khách Hàng'];

    // Summary Metrics
    const activeRulesCount = rules.filter(r => r.enabled).length;
    const maxPossibleScore = rules.reduce((sum, r) => sum + (r.enabled && r.weight > 0 ? r.weight : 0), 0);

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Tổng tiêu chí</p>
                            <h3 className="text-2xl font-bold mt-1 text-gray-900">{rules.length}</h3>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-full">
                            <Layers className="w-5 h-5 text-gray-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Đang kích hoạt</p>
                            <h3 className="text-2xl font-bold mt-1 text-green-600">{activeRulesCount}</h3>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Điểm tối đa (Lý thuyết)</p>
                            <h3 className="text-2xl font-bold mt-1 text-[#1877F2]">{maxPossibleScore}</h3>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Trophy className="w-5 h-5 text-[#1877F2]" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Lead Scoring Rules</h1>
                    <p className="text-gray-500 text-sm">Cấu hình tiêu chí tự động chấm điểm tiềm năng khách hàng</p>
                </div>
                <div className="flex gap-2">
                    <ScoringConfigDialog onConfigChange={setScoringConfig} />

                    {selectedRules.size > 0 && (
                        <Button variant="destructive" onClick={handleBulkDelete}>
                            <Trash2 className="w-4 h-4 mr-2" /> Xóa ({selectedRules.size}) Mục
                        </Button>
                    )}
                    <Button variant="outline" onClick={handleRecalculate} disabled={isRecalculating}>
                        {isRecalculating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                        Tính Lại Điểm (Batch)
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2 shadow-sm border-gray-200">
                    <CardHeader className="pb-3 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Settings className="w-5 h-5 text-[#E60012]" /> Tiêu Chí Đánh Giá
                            </CardTitle>

                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-[#E60012] hover:text-[#c50010] hover:bg-red-50">
                                        <Plus className="w-4 h-4 mr-1" /> Thêm tiêu chí
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Thêm Tiêu Chí Chấm Điểm Mới</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Danh Mục</Label>
                                            <Select
                                                value={newRule.category}
                                                onValueChange={(v) => setNewRule({ ...newRule, category: v })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableCategories.map(c => (
                                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tiêu chí (Giá trị so khớp)</Label>
                                            <Input
                                                placeholder="VD: Facebook, Honda CR-V, Lái thử..."
                                                value={newRule.criteria}
                                                onChange={(e) => setNewRule({ ...newRule, criteria: e.target.value })}
                                            />
                                            <p className="text-xs text-gray-500">Nhập chính xác giá trị cần so khớp trong hệ thống.</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Điểm số</Label>
                                                <Input
                                                    type="number"
                                                    value={newRule.weight}
                                                    onChange={(e) => setNewRule({ ...newRule, weight: parseInt(e.target.value) || 0 })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="block">Trạng thái</Label>
                                                <div className="flex items-center gap-2 h-10">
                                                    <Switch
                                                        checked={newRule.enabled}
                                                        onCheckedChange={(c) => setNewRule({ ...newRule, enabled: c })}
                                                    />
                                                    <span className="text-sm text-gray-600">
                                                        {newRule.enabled ? 'Kích hoạt ngay' : 'Tạm tắt'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Hủy</Button>
                                        <Button onClick={handleAddRule} disabled={!newRule.criteria || isPending} className="bg-[#E60012] hover:bg-[#c50010]">
                                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Lưu Tiêu Chí
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        {categories.map(cat => (
                            <div key={cat}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Checkbox
                                        id={`cat-${cat}`}
                                        checked={isGroupSelected(cat) || (isGroupIndeterminate(cat) ? 'indeterminate' : false)}
                                        onCheckedChange={(checked) => toggleSelectGroup(cat, checked as boolean)}
                                        className="data-[state=checked]:bg-[#E60012] data-[state=indeterminate]:bg-[#E60012] border-gray-300"
                                    />
                                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-l-4 border-[#E60012] pl-3 flex-1">
                                        {cat}
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3 pl-6">
                                    {rules.filter(r => r.category === cat).map(rule => (
                                        <div key={rule.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${selectedRules.has(rule.id) ? 'bg-red-50 border-red-200' : (rule.enabled ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60')}`}>
                                            <div className="flex items-center gap-4 flex-1">
                                                <Checkbox
                                                    checked={selectedRules.has(rule.id)}
                                                    onCheckedChange={(checked) => toggleSelectRule(rule.id, checked as boolean)}
                                                />
                                                <Switch
                                                    checked={rule.enabled}
                                                    onCheckedChange={() => handleToggle(rule.id, rule.enabled)}
                                                    className="data-[state=checked]:bg-green-600"
                                                />
                                                <span className="font-medium text-sm text-gray-700">{rule.criteria}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400">Trọng số:</span>
                                                <Input
                                                    type="number"
                                                    className="w-16 h-8 text-center font-bold"
                                                    value={rule.weight}
                                                    onChange={(e) => handleWeightChange(rule.id, parseInt(e.target.value) || 0)}
                                                    disabled={!rule.enabled}
                                                />
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                    onClick={() => handleDelete(rule.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="col-span-1 space-y-6">
                    <div className="sticky top-6">
                        <ScoringSimulator rules={rules} config={scoringConfig} />
                    </div>
                </div>
            </div>
        </div>
    );
}
