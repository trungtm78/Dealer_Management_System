import { NextRequest, NextResponse } from "next/server";
import { convertLeadToCustomer } from "@/actions/crm/customers";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const result = await convertLeadToCustomer(params.id);

        if (result.success) {
            return NextResponse.json({ success: true, customerId: result.customerId });
        } else {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }
    } catch (error) {
        console.error("Convert Lead Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
