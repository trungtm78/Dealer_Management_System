
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CustomerUpdateInput, CustomerDTO } from "@/lib/types/crm";
import { updateCustomer, deleteCustomer } from "@/actions/crm/customers";

// DTO Mapper
function mapToDTO(c: any): CustomerDTO {
    return {
        id: c.id,
        name: c.name,
        type: c.type,
        phone: c.phone,
        mobile: c.mobile,
        email: c.email,
        address: [c.street, c.ward, c.district, c.city, c.state].filter(Boolean).join(", "),
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

// GET /api/crm/customers/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const customer = await prisma.customer.findUnique({ where: { id } });

        if (!customer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }

        return NextResponse.json(mapToDTO(customer));
    } catch (error) {
        console.error(`API Error [GET /api/crm/customers/${params.id}]:`, error);
        return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
    }
}

// PUT /api/crm/customers/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await req.json();
        const data = body as CustomerUpdateInput;

        // Call Server Action
        const result = await updateCustomer(id, data);

        if (result.success && result.data) {
            return NextResponse.json(result.data);
        } else {
            if (result.error && result.error.includes("not found")) {
                return NextResponse.json({ error: "Customer not found" }, { status: 404 });
            }
            return NextResponse.json({ error: result.error || "Failed to update customer" }, { status: 500 });
        }

    } catch (error: any) {
        console.error(`API Error [PUT /api/crm/customers/${params.id}]:`, error);
        return NextResponse.json({ error: error.message || "Failed to update customer" }, { status: 500 });
    }
}

// DELETE /api/crm/customers/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        // Call Server Action
        const result = await deleteCustomer(id);

        if (result.success) {
            return NextResponse.json({ success: true });
        } else {
            if (result.error && result.error.includes("not found")) {
                return NextResponse.json({ error: "Customer not found" }, { status: 404 });
            }
            return NextResponse.json({ error: result.error || "Failed to delete customer" }, { status: 500 });
        }
    } catch (error: any) {
        console.error(`API Error [DELETE /api/crm/customers/${params.id}]:`, error);
        return NextResponse.json({ error: error.message || "Failed to delete customer" }, { status: 500 });
    }
}
