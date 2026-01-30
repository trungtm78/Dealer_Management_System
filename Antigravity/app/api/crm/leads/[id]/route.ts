
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CreateLeadInput, LeadDTO, LeadSource, LeadStatus } from "@/lib/types/crm";
import { updateLead, deleteLead, updateLeadStatus } from "@/actions/crm/leads";

// DTO Mapper (Reused logic, ideally shared in utils in future refactor)
function mapToLeadDTO(l: any): LeadDTO {
    return {
        id: l.id,
        name: l.name,
        phone: l.phone,
        email: l.email || null,
        source: l.source as LeadSource,
        status: l.status as LeadStatus,
        score: l.score || 0,
        model_interest: l.model_interest || null,
        model_version: l.model_version || null,
        color: undefined,  // Not in schema
        budget: l.budget || null,
        timeframe: l.timeframe || null,
        customer_type: l.customer_type || null,
        address: l.address || null,
        notes: l.notes || null,
        time_created: l.created_at?.toLocaleString("vi-VN") || '',
        created_at: l.created_at?.toISOString() || '',
        updated_at: l.updated_at?.toISOString() || '',
        interactions: [],  // Simplified - not fetching for now
        history: []  // Simplified - not fetching for now
    };
}

// GET /api/crm/leads/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id: params.id }
        });

        if (!lead) {
            return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        }

        return NextResponse.json(mapToLeadDTO(lead));
    } catch (error: any) {
        console.error("API Error [GET /api/crm/leads/:id]:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error?.message }, { status: 500 });
    }
}

// PUT /api/crm/leads/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        // Allow partial updates
        const data = body;
        let success = true;
        let errorMsg = "";

        // 1. Handle Status Change if present
        if (data.status && data.status !== "ALL") {
            const currentLead = await prisma.lead.findUnique({
                where: { id: params.id },
                select: { status: true }
            });

            if (currentLead && currentLead.status !== data.status) {
                // Determine the note to use for the transition log
                // Prioritize 'transitionNote', fall back to 'note' or 'notes' if provided
                const noteContent = data.transitionNote || data.note || data.notes;

                const statusResult = await updateLeadStatus(params.id, data.status as LeadStatus, noteContent);
                if (!statusResult.success) {
                    success = false;
                    errorMsg = statusResult.error || "Failed to update status";
                }
            }
        }

        // 2. Handle other fields update
        // Filter out fields that shouldn't be passed to updateLead directly
        // 'status' is handled above. 'transitionNote' and 'note' are not in Prisma schema.
        // 'notes' IS in Prisma schema, so we keep it if checking specifically for general note updates.
        // If data contained 'transitionNote', we must remove it to avoid "Unknown arg" error.
        const { status, transitionNote, note, ...otherData } = data;

        if (Object.keys(otherData).length > 0 && success) {
            const updateResult = await updateLead(params.id, otherData);
            if (!updateResult.success) {
                success = false;
                errorMsg = updateResult.error || "Failed to update lead details";
            }
        }

        if (!success) {
            return NextResponse.json({ error: errorMsg }, { status: 400 });
        }

// Fetch updated lead to return
        const updatedLead = await prisma.lead.findUnique({
            where: { id: params.id }
        });

        if (!updatedLead) return NextResponse.json({ error: "Lead not found after update" }, { status: 404 });

        return NextResponse.json(mapToLeadDTO(updatedLead));

} catch (error: any) {
        console.error("API Error [PUT /api/crm/leads/:id]:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error?.message }, { status: 500 });
    }
}

// DELETE /api/crm/leads/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const result = await deleteLead(params.id);
        if (result.success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }
} catch (error: any) {
        console.error("API Error [DELETE /api/crm/leads/:id]:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error?.message }, { status: 500 });
    }
}
