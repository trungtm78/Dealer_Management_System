import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CreateLeadInput, LeadDTO, LeadSource, LeadStatus } from "@/lib/types/crm";
import { createLead } from "@/actions/crm/leads";
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";

// DTO Mapper
function mapToLeadDTO(l: any): LeadDTO {
    return {
        id: l.id,
        name: l.name,
        phone: l.phone,
        email: l.email,
        source: l.source as LeadSource,
        status: l.status as LeadStatus,
        score: l.score,
        model_interest: l.model_interest,
        model_version: l.model_version,
        color: l.color,
        budget: l.budget,
        timeframe: l.timeframe,
        customer_type: l.customer_type,
        address: l.address,
        notes: l.notes,
        time_created: l.created_at.toLocaleString("vi-VN"),
        created_at: l.created_at.toISOString(),
        updated_at: l.updated_at.toISOString(),
        interactions: l.Interaction?.map((i: any) => ({
            id: i.id,
            content: i.notes,
            type: i.type,
            lead_id: i.lead_id,
            user_id: i.user_id,
            created_at: i.created_at.toISOString(),
            outcome: i.outcome,
            metadata: i.metadata,
        })) || []
    };
}

// GET /api/crm/leads
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const forDropdown = searchParams.get('for_dropdown') === 'true';
        const status = searchParams.get('status') || 'ACTIVE';

        if (forDropdown) {
            const leads = await prisma.lead.findMany({
                where: { status },
                select: { id: true, name: true, status: true },
                orderBy: { name: 'asc' }
            });
            const dropdownData = leads.map(l => ({
                id: l.id,
                name: l.name,
                status: l.status
            }));
            return NextResponse.json({ data: dropdownData });
        }

        const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
        const skip = calculateSkip(page, limit);

        const where: any = {
            ...buildSearchWhereClause(search, ["name", "phone", "email", "model_interest"]),
        };

        if (filters.status) {
            where.status = filters.status;
        }

        const [total, leads] = await Promise.all([
            prisma.lead.count({ where }),
            prisma.lead.findMany({
                where,
                include: { Interaction: true },
                orderBy: { created_at: "desc" },
                skip,
                take: limit
            })
        ]);

        return NextResponse.json({
            data: leads.map(mapToLeadDTO),
            meta: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        console.error("API Error [GET /api/crm/leads]:", error);
        return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }
}


// POST /api/crm/leads
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = body as CreateLeadInput;

        const result = await createLead(data);

        if (result.success) {
            return NextResponse.json(mapToLeadDTO(result.data), { status: 201 });
        } else {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

    } catch (error: any) {
        console.error("API Error [POST /api/crm/leads]:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
