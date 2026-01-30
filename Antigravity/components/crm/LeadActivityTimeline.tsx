"use client"

import { useState } from "react"
import {
    Phone, Mail, Calendar, StickyNote, ArrowRight, Plus, MessageSquare, History as HistoryIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { InteractionDTO } from "@/lib/types/crm"
import { addLeadActivity } from "@/actions/crm/leads"
import { toast } from "sonner"

import { useRouter } from "next/navigation"

interface LeadActivityTimelineProps {
    leadId: string;
    activities: InteractionDTO[];
    onActivityAdded?: () => void;
}

export function LeadActivityTimeline({ leadId, activities, onActivityAdded }: LeadActivityTimelineProps) {
    const [newNote, setNewNote] = useState("");
    const [activityType, setActivityType] = useState("NOTE");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleAddActivity = async () => {
        if (!newNote.trim()) return;

        setIsSubmitting(true);
        const res = await addLeadActivity(leadId, activityType, newNote);
        if (res.success) {
            toast.success("Đã thêm hoạt động mới!");
            setNewNote("");
            if (onActivityAdded) {
                onActivityAdded();
            } else {
                router.refresh();
            }
        } else {
            toast.error("Lỗi khi thêm hoạt động");
        }
        setIsSubmitting(false);
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'CALL': return <Phone className="w-4 h-4 text-blue-500" />;
            case 'EMAIL': return <Mail className="w-4 h-4 text-orange-500" />;
            case 'MEETING': return <Calendar className="w-4 h-4 text-purple-500" />;
            case 'STAGE_CHANGE': return <ArrowRight className="w-4 h-4 text-green-600" />;
            case 'STAGE_CHANGE': return <ArrowRight className="w-4 h-4 text-green-600" />;
            case 'HISTORY_LOG': return <HistoryIcon className="w-4 h-4 text-gray-600" />;
            default: return <StickyNote className="w-4 h-4 text-gray-500" />;
        }
    }

    const getLabel = (type: string) => {
        switch (type) {
            case 'CALL': return "Cuộc gọi";
            case 'EMAIL': return "Email";
            case 'MEETING': return "Gặp mặt";
            case 'STAGE_CHANGE': return "Chuyển trạng thái";
            case 'HISTORY_LOG': return "Lịch sử thay đổi";
            default: return "Ghi chú";
        }
    }

    return (
        <div className="flex flex-col h-[500px]">
            {/* Input Area */}
            <div className="p-4 border rounded-lg bg-gray-50 mb-4 space-y-3">
                <div className="flex gap-2">
                    <Select value={activityType} onValueChange={setActivityType}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NOTE">📝 Ghi chú</SelectItem>
                            <SelectItem value="CALL">📞 Gọi điện</SelectItem>
                            <SelectItem value="EMAIL">📧 Email</SelectItem>
                            <SelectItem value="MEETING">📅 Gặp mặt</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Textarea
                    placeholder="Nhập nội dung hoạt động..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[80px]"
                />
                <div className="flex justify-end">
                    <Button size="sm" onClick={handleAddActivity} disabled={isSubmitting || !newNote.trim()}>
                        <Plus className="w-4 h-4 mr-2" /> Lưu Hoạt Động
                    </Button>
                </div>
            </div>

            {/* Timeline */}
            <ScrollArea className="flex-1 pr-4">
                <div className="space-y-6">
                    {activities.length === 0 && (
                        <div className="text-center text-gray-500 py-8">Chưa có hoạt động nào</div>
                    )}
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex gap-4 group">
                            <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full border bg-white flex items-center justify-center shadow-sm 
                                    ${activity.type === 'STAGE_CHANGE' ? 'border-green-200 bg-green-50' : 'border-gray-200'}
                                `}>
                                    {getIcon(activity.type)}
                                </div>
                                <div className="w-0.5 flex-1 bg-gray-100 group-last:bg-transparent min-h-[20px]" />
                            </div>
                            <div className="flex-1 pb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm text-gray-900">{getLabel(activity.type)}</span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(activity.created_at).toLocaleString('vi-VN', {
                                            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                    {activity.metadata?.durationSeconds > 0 && activity.type === 'STAGE_CHANGE' && (
                                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">
                                            ⏱ {Math.floor(activity.metadata.durationSeconds / 60)} phút ở bước trước
                                        </span>
                                    )}
                                    {activity.outcome && (
                                        <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 uppercase">
                                            {activity.outcome}
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-700 bg-white p-3 border rounded-lg shadow-sm">
                                    {activity.content}
                                    {(activity as any).actorName && (
                                        <div className="mt-1 text-xs text-gray-400 font-medium">
                                            Bởi: {(activity as any).actorName}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
