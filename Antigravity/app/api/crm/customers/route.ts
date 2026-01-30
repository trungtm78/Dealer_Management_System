
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CustomerCreateInput, CustomerDTO } from "@/lib/types/crm";
import { createCustomer } from "@/actions/crm/customers";

// DTO Mapper
function mapToDTO(c: any): CustomerDTO {
    return {
        id: c.id,
        name: c.name,
        type: c.type,
        phone: c.phone,
        mobile: c.mobile,
        email: c.email,
        address: [c.street, c.ward, c.district, c.city].filter(Boolean).join(", "),
        street: c.street,
        city: c.city,
        district: c.district,
        ward: c.ward,
        vat: c.vat,
        tier: c.tier,
        points: c.points,
        total_points: c.total_points || c.points || 0,
        tags: c.tags,
        member_since: c.member_since.toISOString().split('T')[0],
        updated_at: c.updated_at.toISOString()
    };
}

// GET /api/crm/customers
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get('query');

        const where: any = {};
        if (query) {
            where.OR = [
                { name: { contains: query } },
                { phone: { contains: query } },
                { mobile: { contains: query } },
                { email: { contains: query } },
                { vat: { contains: query } }
            ];
        }

        const customers = await prisma.customer.findMany({
            where,
            orderBy: { created_at: "desc" },
            take: 50
        });

        return NextResponse.json(customers.map(mapToDTO));
    } catch (error) {
        console.error("API Error [GET /api/crm/customers]:", error);
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
}


// POST /api/crm/customers
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = body as CustomerCreateInput;

        // Call Server Action
        const result = await createCustomer(data);

        if (result.success && result.data) {
            return NextResponse.json(result.data, { status: 201 });
        } else {
            // Handle duplicate error code if returned by action string
            if (result.error && result.error.includes("tồn tại")) {
                return NextResponse.json({ error: result.error }, { status: 409 });
            }
            return NextResponse.json({ error: result.error || "Failed to create customer" }, { status: 500 });
        }

    } catch (error: any) {
        console.error("API Error [POST /api/crm/customers]:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
