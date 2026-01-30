"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Plus, Filter, List, Search, LayoutGrid, ChevronLeft, ChevronRight, Check, X,
    GripVertical, Users, TrendingUp, Star, AlertCircle, MoreHorizontal, Edit,
    Trash2, Phone, Mail, Calendar, History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeadDTO, LeadStatus } from "@/lib/types/crm";
import { CRMService } from "@/services/crm.service";
import { LeadDialog } from "./LeadDialog"
import { ScheduleDialog } from "./ScheduleDialog"
import { toast } from "sonner"
// Removed deleteLead, updateLeadStatus, addLeadActivity imports
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface LeadsBoardProps {
    initialLeads: LeadDTO[];
}

interface Column {
    id: string;
    label: string;
    emoji: string;
    color: string;
    collapsed?: boolean;
}

const INITIAL_COLUMNS: Column[] = [
    { id: 'NEW', label: 'MỚI', emoji: '📥', color: 'bg-blue-50 border-blue-200' },
    { id: 'CONTACTED', label: 'ĐÃ LIÊN HỆ', emoji: '📞', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'QUALIFIED', label: 'TIỀM NĂNG', emoji: '✅', color: 'bg-green-50 border-green-200' },
    // TEST_DRIVE removed as it is not in Prisma Enum
    { id: 'WON', label: 'THÀNH CÔNG', emoji: '🏆', color: 'bg-green-100 border-green-300' },
    { id: 'DEAD', label: 'THẤT BẠI', emoji: '❌', color: 'bg-gray-100 border-gray-200' },
];

const getScoreStyle = (score: number) => {
    if (score >= 80) return "bg-green-500 hover:bg-green-600";
    if (score >= 50) return "bg-yellow-500 hover:bg-yellow-600";
    return "bg-red-500 hover:bg-red-600";
};

export default function LeadsBoard({ initialLeads }: LeadsBoardProps) {
    // Local state for optimistic update
    const [leads, setLeads] = useState<LeadDTO[]>(initialLeads);
    // Dynamic Columns State
    const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('kanban_columns');
        if (saved) {
            try {
                setColumns(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load columns", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('kanban_columns', JSON.stringify(columns));
        }
    }, [columns, isInitialized]);

    const [draggedLead, setDraggedLead] = useState<LeadDTO | null>(null);
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const [editingLead, setEditingLead] = useState<LeadDTO | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Schedule Dialog State
    const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
    const [schedulingLead, setSchedulingLead] = useState<LeadDTO | null>(null);

    // Stage Change Confirmation
    const [confirmStageOpen, setConfirmStageOpen] = useState(false);
    const [pendingTransition, setPendingTransition] = useState<{ lead: LeadDTO, newStatus: string } | null>(null);
    const [transitionNote, setTransitionNote] = useState("");

    // Add Stage State
    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnName, setNewColumnName] = useState("");

    const handleAddColumn = () => {
        if (!newColumnName.trim()) return;

        const id = newColumnName.toUpperCase().replace(/\s+/g, '_');
        // Simple random color picker from existing themes
        const themes = [
            'bg-blue-50 border-blue-200',
            'bg-yellow-50 border-yellow-200',
            'bg-green-50 border-green-200',
            'bg-purple-50 border-purple-200',
            'bg-gray-100 border-gray-200',
            'bg-pink-50 border-pink-200',
            'bg-indigo-50 border-indigo-200'
        ];
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];

        const newCol: Column = {
            id,
            label: newColumnName,
            emoji: '🆕',
            color: randomTheme,
            collapsed: false
        };

        setColumns([...columns, newCol]);
        setNewColumnName("");
        setIsAddingColumn(false);
        toast.success("Đã thêm cột mới!");
    };

    const toggleColumn = (colId: string) => {
        setColumns(prev => prev.map(c =>
            c.id === colId ? { ...c, collapsed: !c.collapsed } : c
        ));
    };

    const handleDeleteColumn = (colId: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa cột này? Các Lead trong cột sẽ bị ẩn (không bị xóa).")) {
            setColumns(prev => prev.filter(c => c.id !== colId));
            toast.success("Đã xóa cột!");
        }
    };

    const [draggedCol, setDraggedCol] = useState<string | null>(null);

    // Column Drag & Drop
    const handleColumnDragStart = (e: React.DragEvent, colId: string) => {
        e.stopPropagation();
        setDraggedCol(colId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleColumnDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleColumnDrop = (e: React.DragEvent, targetColId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (!draggedCol || draggedCol === targetColId) {
            setDraggedCol(null);
            return;
        }

        const oldIndex = columns.findIndex(c => c.id === draggedCol);
        const newIndex = columns.findIndex(c => c.id === targetColId);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newColumns = [...columns];
            const [movedCol] = newColumns.splice(oldIndex, 1);
            newColumns.splice(newIndex, 0, movedCol);
            setColumns(newColumns);
        }
        setDraggedCol(null);
    };

    const handleSchedule = (lead: LeadDTO) => {
        setSchedulingLead(lead);
        setScheduleDialogOpen(true);
    };

    const handleCall = async (lead: LeadDTO) => {
        // Log the call activity
        await CRMService.addActivity(lead.id, 'CALL', 'Gọi điện từ bảng CRM');
        toast.success("Đã ghi nhận lịch sử gọi điện");
    };

    const handleLeadSaved = () => {
        router.refresh();
        window.location.reload();
    };

    const handleEdit = (lead: LeadDTO) => {
        setEditingLead(lead);
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingLead(null);
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa Lead này không?")) return;

        // Optimistic UI update
        setLeads(prev => prev.filter(l => l.id !== id));

        const res = await CRMService.deleteLead(id);
        if (res.success) {
            toast.success("Đã xóa Lead thành công!");
            router.refresh();
        } else {
            // Revert checks would be complex here without fetching, but for deletion usually acceptable
            toast.error("Xóa thất bại: " + res.error);
            // Optionally revert: window.location.reload();
        }
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [sourceFilter, setSourceFilter] = useState("all");

    const [filterDateStart, setFilterDateStart] = useState("");
    const [filterDateEnd, setFilterDateEnd] = useState("");
    const [filterMinScore, setFilterMinScore] = useState("");

    const clearFilters = () => {
        setSourceFilter("all");
        setFilterDateStart("");
        setFilterDateEnd("");
        setFilterMinScore("");
    };

    const hasActiveFilters = sourceFilter !== "all" || filterDateStart || filterDateEnd || filterMinScore;

    // Filter Logic
    const filteredLeads = leads.filter(lead => {
        const lowerTerm = searchTerm.toLowerCase();
        const matchesSearch =
            lead.name.toLowerCase().includes(lowerTerm) ||
            lead.phone.includes(lowerTerm) ||
            (lead.email && lead.email.toLowerCase().includes(lowerTerm)) ||
            (lead.source && lead.source.toLowerCase().includes(lowerTerm)) ||
            (lead.model_interest && lead.model_interest.toLowerCase().includes(lowerTerm)) ||
            (lead.model_version && lead.model_version.toLowerCase().includes(lowerTerm)) ||
            (lead.color && lead.color.toLowerCase().includes(lowerTerm)) ||
            (lead.budget && lead.budget.toLowerCase().includes(lowerTerm)) ||
            (lead.timeframe && lead.timeframe.toLowerCase().includes(lowerTerm)) ||
            (lead.customer_type && lead.customer_type.toLowerCase().includes(lowerTerm)) ||
            (lead.address && lead.address.toLowerCase().includes(lowerTerm)) ||
            (lead.notes && lead.notes.toLowerCase().includes(lowerTerm));
        const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;

        let matchesDate = true;
        if (filterDateStart) {
            matchesDate = matchesDate && new Date(lead.time_created) >= new Date(filterDateStart);
        }
        if (filterDateEnd) {
            // Add one day to include the end date fully
            const endDate = new Date(filterDateEnd);
            endDate.setHours(23, 59, 59, 999);
            matchesDate = matchesDate && new Date(lead.time_created) <= endDate;
        }


        let matchesScore = true;
        if (filterMinScore) {
            matchesScore = lead.score >= parseInt(filterMinScore);
        }

        return matchesSearch && matchesSource && matchesDate && matchesScore;
    });

    const handleDragStart = (e: React.DragEvent, lead: LeadDTO) => {
        e.stopPropagation();
        setDraggedLead(lead);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (status: string) => {
        if (draggedLead && draggedLead.status !== status) {
            setPendingTransition({ lead: draggedLead, newStatus: status });
            setConfirmStageOpen(true);
            setTransitionNote("");
        }
    };

    const confirmTransition = async () => {
        if (!pendingTransition) return;

        const { lead, newStatus } = pendingTransition;

        // Validation: Require note for WON or DEAD
        if ((newStatus === 'WON' || newStatus === 'DEAD') && !transitionNote.trim()) {
            toast.error("Vui lòng nhập ghi chú cho trạng thái này (Bắt buộc)!");
            return;
        }

        const oldStatus = lead.status;

        // Optimistic Update
        setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: newStatus as LeadStatus } : l));
        setConfirmStageOpen(false);

        // Call Service
        startTransition(async () => {
            // Ensure server side handles note/activity log if included in payload
            const res = await CRMService.updateLead(lead.id, { status: newStatus, transitionNote: transitionNote });
            // Note: API needs to be able to accept 'note' field for status change side effect
            if (!res.success) {
                // Revert if failed
                setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: oldStatus } : l));
                toast.error("Cập nhật thất bại!");
            } else {
                toast.success("Đã chuyển trạng thái & ghi lịch sử!");
            }
        });

        setPendingTransition(null);
    };

    // Stats Calculation
    const stats = {
        totalLeadsMonth: leads.filter(l => {
            const date = new Date(l.created_at);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length,
        conversionRate: leads.length > 0
            ? Math.round((leads.filter(l => l.status === 'WON').length / leads.length) * 100 * 10) / 10
            : 0,
        avgScore: leads.length > 0
            ? Math.round(leads.reduce((acc, l) => acc + l.score, 0) / leads.length)
            : 0,
        overdueCount: leads.filter(l => {
            const date = new Date(l.created_at);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return l.status === 'NEW' && diffDays > 3;
        }).length
    };


    return (
        <div className="h-full flex flex-col">
            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="shadow-sm border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Tổng leads tháng</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stats.totalLeadsMonth}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Tỷ lệ chuyển đổi</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.conversionRate}%</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-l-4 border-l-yellow-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Điểm trung bình</CardTitle>
                        <Star className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.avgScore}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Cảnh báo quá hạn</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.overdueCount}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            type="search"
                            placeholder="Tìm kiếm Lead..."
                            className="pl-9 h-9 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={sourceFilter} onValueChange={setSourceFilter}>
                            <SelectTrigger className="w-[140px] h-9 bg-white">
                                <SelectValue placeholder="Nguồn Lead" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả nguồn</SelectItem>
                                <SelectItem value="FACEBOOK">Facebook</SelectItem>
                                <SelectItem value="WEBSITE">Website</SelectItem>
                                <SelectItem value="WALK_IN">Walk-in</SelectItem>
                                <SelectItem value="HOTLINE">Hotline</SelectItem>
                            </SelectContent>

                        </Select>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={hasActiveFilters ? "secondary" : "outline"} size="sm" className="h-9 bg-white">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Bộ Lọc {hasActiveFilters && <span className="ml-1 w-2 h-2 bg-red-500 rounded-full" />}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-80 p-4" align="start">
                                <DropdownMenuLabel>Bộ lọc nâng cao</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="space-y-4 pt-2">
                                    <div className="space-y-2">
                                        <Label>Ngày tạo từ</Label>
                                        <Input
                                            type="date"
                                            value={filterDateStart}
                                            onChange={(e) => setFilterDateStart(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Đến ngày</Label>
                                        <Input
                                            type="date"
                                            value={filterDateEnd}
                                            onChange={(e) => setFilterDateEnd(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Điểm tối thiểu ({filterMinScore || 0})</Label>
                                        <Input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="5"
                                            value={filterMinScore || 0}
                                            onChange={(e) => setFilterMinScore(e.target.value)}
                                        />
                                    </div>
                                    <div className="pt-2 flex justify-end">
                                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                            Xóa bộ lọc
                                        </Button>
                                    </div>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="w-px h-6 bg-gray-200 mx-2" />

                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 bg-white"
                            onClick={() => setViewMode(viewMode === 'kanban' ? 'list' : 'kanban')}
                        >
                            {viewMode === 'kanban' ? <List className="h-4 w-4 mr-2" /> : <LayoutGrid className="h-4 w-4 mr-2" />}
                            {viewMode === 'kanban' ? 'List View' : 'Kanban View'}
                        </Button>
                        <Button onClick={handleCreate} className="bg-[#E60012] hover:bg-[#cc0010] h-9">
                            <Plus className="mr-2 h-4 w-4" /> Tạo Lead Mới
                        </Button>
                    </div>
                </div>

                <LeadDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    initialData={editingLead}
                    onSaved={handleLeadSaved}
                />
                <ScheduleDialog
                    open={scheduleDialogOpen}
                    onOpenChange={setScheduleDialogOpen}
                    leadId={schedulingLead?.id || ""}
                    onScheduled={() => router.refresh()}
                />

                {/* Confirm Transition Dialog */}
                <Dialog open={confirmStageOpen} onOpenChange={setConfirmStageOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Xác nhận chuyển trạng thái</DialogTitle>
                            <DialogDescription>
                                Bạn đang chuyển <b>{pendingTransition?.lead.name}</b> sang trạng thái <b>{columns.find(c => c.id === pendingTransition?.newStatus)?.label}</b>.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label>
                                Ghi chú chuyển đổi
                                {(pendingTransition?.newStatus === 'WON' || pendingTransition?.newStatus === 'DEAD') && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                            <Textarea
                                placeholder={(pendingTransition?.newStatus === 'WON' || pendingTransition?.newStatus === 'DEAD') ? "Nhập lý do Win/Lost (Bắt buộc)..." : "Nhập lý do hoặc ghi chú (Tùy chọn)..."}
                                value={transitionNote}
                                onChange={(e) => setTransitionNote(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setConfirmStageOpen(false)}>Hủy</Button>
                            <Button onClick={confirmTransition} className="bg-[#E60012] text-white">Xác nhận chuyển</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {
                viewMode === 'kanban' ? (
                    /* Kanban Board */
                    <div className="flex-1 pb-4">
                        <div className="flex items-start h-full">
                            {columns.map(col => {
                                const colLeads = filteredLeads.filter(l => l.status === col.id);

                                if (col.collapsed) {
                                    return (
                                        <div
                                            key={col.id}
                                            className={`h-full pt-4 mx-1 transition-all duration-300 ${draggedCol === col.id ? 'opacity-50' : ''}`}
                                            draggable
                                            onDragStart={(e) => handleColumnDragStart(e, col.id)}
                                            onDragOver={handleColumnDragOver}
                                            onDrop={(e) => {
                                                if (draggedCol) {
                                                    handleColumnDrop(e, col.id);
                                                }
                                            }}
                                        >
                                            <div
                                                className={`h-full w-12 rounded-xl border ${col.color} flex flex-col items-center py-4 cursor-pointer hover:brightness-95`}
                                                onClick={() => toggleColumn(col.id)}
                                                title={col.label}
                                            >
                                                <div className="mb-4 text-xl">{col.emoji}</div>
                                                <div className="writing-vertical-rl text-xs font-bold text-gray-600 tracking-wider uppercase">
                                                    {col.label}
                                                </div>
                                                <div className="mt-4 bg-white/80 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                                                    {colLeads.length}
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-400 mt-auto mb-2" />
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={col.id}
                                        draggable
                                        onDragStart={(e) => handleColumnDragStart(e, col.id)}
                                        onDragOver={handleColumnDragOver}
                                        onDrop={(e) => {
                                            if (draggedCol) {
                                                handleColumnDrop(e, col.id);
                                            } else {
                                                handleDrop(col.id);
                                            }
                                        }}
                                        className={`flex-none w-[280px] rounded-xl border ${col.color} flex flex-col h-full mx-2 transition-all duration-300 ${draggedCol === col.id ? 'opacity-50 ring-2 ring-dashed ring-gray-300' : ''}`}
                                    >
                                        <div className="p-3 border-b border-black/5 bg-white/50 backdrop-blur-sm rounded-t-xl flex items-center justify-between group cursor-grab active:cursor-grabbing">
                                            <div className="flex items-center gap-2 font-bold text-gray-700">
                                                <GripVertical className="h-4 w-4 text-gray-400" />
                                                <span>{col.emoji}</span>
                                                <span className="truncate max-w-[150px]" title={col.label}>{col.label}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm text-gray-600">
                                                    {colLeads.length}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => toggleColumn(col.id)}
                                                    title="Thu nhỏ"
                                                >
                                                    <ChevronLeft className="h-4 w-4 text-gray-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                                                    onClick={() => handleDeleteColumn(col.id)}
                                                    title="Xóa cột"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                                            {colLeads.map(lead => (
                                                <Card
                                                    key={lead.id}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, lead)}
                                                    onClick={() => handleEdit(lead)}
                                                    className="p-4 cursor-pointer active:cursor-grabbing hover:shadow-md transition-all border-none shadow-sm ring-1 ring-black/5"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-gray-800 text-sm">{lead.name}</h4>
                                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                                {lead.source}
                                                            </p>
                                                        </div>
                                                        <Badge className={`${getScoreStyle(lead.score)} text-white border-0 shadow-sm`}>
                                                            {lead.score}
                                                        </Badge>
                                                    </div>

                                                    <div className="space-y-1.5 mb-3">
                                                        <div className="text-xs text-gray-600 bg-gray-50 p-1.5 rounded">
                                                            <span className="font-semibold text-gray-700">Xe:</span> {lead.model_interest || 'N/A'}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {lead.time_created}
                                                        </div>
                                                    </div>


                                                    <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                                                        <div className="text-xs text-gray-500 font-medium">{lead.phone}</div>
                                                        <div onClick={(e) => e.stopPropagation()}>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        className="h-6 w-6 p-0 hover:bg-gray-100 data-[state=open]:bg-gray-100"
                                                                    >
                                                                        <span className="sr-only">Open menu</span>
                                                                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-[200px]">
                                                                    <DropdownMenuItem onClick={() => handleEdit(lead)} className="cursor-pointer">
                                                                        <Edit className="mr-2 h-4 w-4 text-blue-600" /> Sửa thông tin
                                                                    </DropdownMenuItem>

                                                                    {lead.phone && (
                                                                        <DropdownMenuItem onClick={() => handleCall(lead)} className="cursor-pointer">
                                                                            <a href={`tel:${lead.phone}`} className="flex items-center w-full">
                                                                                <Phone className="mr-2 h-4 w-4 text-green-600" /> Gọi điện
                                                                            </a>
                                                                        </DropdownMenuItem>
                                                                    )}

                                                                    {lead.email && (
                                                                        <DropdownMenuItem asChild className="cursor-pointer">
                                                                            <a href={`mailto:${lead.email}`}>
                                                                                <Mail className="mr-2 h-4 w-4 text-amber-600" /> Gửi Email
                                                                            </a>
                                                                        </DropdownMenuItem>
                                                                    )}

                                                                    <DropdownMenuItem onClick={() => handleSchedule(lead)} className="cursor-pointer">
                                                                        <Calendar className="mr-2 h-4 w-4 text-purple-600" /> Lên lịch
                                                                    </DropdownMenuItem>

                                                                    <div className="h-px bg-gray-100 my-1" />

                                                                    <DropdownMenuItem onClick={() => handleDelete(lead.id)} className="cursor-pointer text-red-600 focus:text-red-600 bg-red-50/50 hover:bg-red-50 focus:bg-red-50">
                                                                        <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Xóa Lead
                                                                    </DropdownMenuItem>

                                                                    <div className="h-px bg-gray-100 my-1" />

                                                                    <DropdownMenuItem onClick={() => router.push(`/crm/leads/${lead.id}/history`)} className="cursor-pointer">
                                                                        <History className="mr-2 h-4 w-4 text-blue-600" /> Xem lịch sử
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Add New Stage Column */}
                            <div className="flex-none w-[280px] h-full mx-2 pt-1">
                                {isAddingColumn ? (
                                    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                                        <Input
                                            autoFocus
                                            placeholder="Tên cột mới..."
                                            value={newColumnName}
                                            onChange={(e) => setNewColumnName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                                            className="mb-2 h-8"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => setIsAddingColumn(false)} className="h-7 w-7 p-0">
                                                <X className="h-4 w-4 text-gray-500" />
                                            </Button>
                                            <Button size="sm" onClick={handleAddColumn} disabled={!newColumnName.trim()} className="bg-[#E60012] hover:bg-[#cc0010] h-7 px-3 text-xs">
                                                Thêm
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 h-10 border-2 border-dashed border-gray-100 hover:border-gray-300"
                                        onClick={() => setIsAddingColumn(true)}
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Thêm cột
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* List View */
                    <div className="bg-white rounded-lg border shadow-sm flex-1 overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Tên Khách Hàng</TableHead>
                                    <TableHead>Số Điện Thoại</TableHead>
                                    <TableHead>Nguồn</TableHead>
                                    <TableHead>Dòng Xe</TableHead>
                                    <TableHead>Trạng Thái</TableHead>
                                    <TableHead>Điểm</TableHead>
                                    <TableHead>Ngày Tạo</TableHead>
                                    <TableHead className="text-right">Hành Động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLeads.map((lead) => (
                                    <TableRow key={lead.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium text-blue-600 cursor-pointer hover:underline" onClick={() => handleEdit(lead)}>
                                            {lead.name}
                                        </TableCell>
                                        <TableCell>{lead.phone}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{lead.source}</Badge>
                                        </TableCell>
                                        <TableCell>{lead.model_interest || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={
                                                columns.find(c => c.id === lead.status)?.color || 'bg-gray-50 border-gray-200'
                                            }>
                                                {columns.find(c => c.id === lead.status)?.label || lead.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getScoreStyle(lead.score)}>{lead.score}</Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-500 text-sm">{lead.time_created}</TableCell>

                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(lead)} className="cursor-pointer">
                                                        <Edit className="mr-2 h-4 w-4 text-blue-600" /> Sửa thông tin
                                                    </DropdownMenuItem>

                                                    {lead.phone && (
                                                        <DropdownMenuItem asChild className="cursor-pointer">
                                                            <a href={`tel:${lead.phone}`}>
                                                                <Phone className="mr-2 h-4 w-4 text-green-600" /> Gọi điện
                                                            </a>
                                                        </DropdownMenuItem>
                                                    )}

                                                    {lead.email && (
                                                        <DropdownMenuItem asChild className="cursor-pointer">
                                                            <a href={`mailto:${lead.email}`}>
                                                                <Mail className="mr-2 h-4 w-4 text-amber-600" /> Gửi Email
                                                            </a>
                                                        </DropdownMenuItem>
                                                    )}

                                                    <DropdownMenuItem onClick={() => handleSchedule(lead)} className="cursor-pointer">
                                                        <Calendar className="mr-2 h-4 w-4 text-purple-600" /> Lên lịch
                                                    </DropdownMenuItem>

                                                    <div className="h-px bg-gray-100 my-1" />

                                                    <DropdownMenuItem onClick={() => handleDelete(lead.id)} className="cursor-pointer text-red-600 focus:text-red-600 bg-red-50/50 hover:bg-red-50 focus:bg-red-50">
                                                        <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Xóa Lead
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredLeads.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center">
                                            Không tìm thấy dữ liệu.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )
            }
        </div >
    );
}
