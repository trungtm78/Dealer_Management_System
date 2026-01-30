// FRD: SCR-CRM-005
// Refs: components/crm/LeadActivityTimeline.tsx
// API: GET /api/crm/leads/{id}/activities
// ERD: leads, interactions
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

import { LeadActivityTimeline } from "@/components/crm/LeadActivityTimeline"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, User, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function LeadHistoryPage({ params }: { params: { id: string } }) {
    const lead = await prisma.lead.findUnique({
        where: { id: params.id },
        include: {
            interactions: {
                orderBy: { created_at: 'desc' }
            }
        }
    })

    if (!lead) return notFound()

    const interactions = lead.interactions.map((i: any) => ({
        ...i,
        createdAt: i.created_at.toISOString()
    }))


    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/crm/leads">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Lịch Sử Hoạt Động & Chuyển Đổi</h1>
                    <p className="text-gray-500">Chi tiết hoạt động của khách hàng {lead.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Lead Info Card */}
                <div className="md:col-span-1 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin khách hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Họ tên</p>
                                    <p className="font-semibold">{lead.name}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <Phone className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Điện thoại</p>
                                    <p className="font-semibold">{lead.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-amber-50 rounded-lg">
                                    <Mail className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="font-semibold">{lead.email || 'Chưa cập nhật'}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Trạng thái hiện tại</p>
                                        <Badge variant="outline" className="mt-1">{lead.status}</Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Điểm tiềm năng</p>
                                        <Badge className="mt-1 bg-blue-500">{lead.score} điểm</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Timeline */}
                <div className="md:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Dòng thời gian</CardTitle>
                            <CardDescription>Toàn bộ lịch sử tương tác và thay đổi trạng thái</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* We can reuse the timeline component but disable adding new activities if we want this to be read-only, 
                                 or allow adding from here too. The component has input by default. 
                                 Let's wrap it to handle client/server mismatch if any, but component is client. */}
                            <LeadActivityTimeline
                                leadId={lead.id}
                                activities={interactions}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
