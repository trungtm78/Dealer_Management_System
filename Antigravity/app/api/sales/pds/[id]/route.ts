
import { NextRequest, NextResponse } from "next/server";
import { UpdatePDSInput } from "@/lib/types/sales";
import { getPDS, updatePDS } from "@/actions/sales/pds";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const pds = await getPDS(params.id);
        if (!pds) {
            return NextResponse.json({ error: "PDS not found" }, { status: 404 });
        }
        return NextResponse.json(pds);
    } catch (error) {
        console.error("Failed to fetch PDS:", error);
        return NextResponse.json({ error: "Failed to fetch PDS" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const data: UpdatePDSInput = await req.json();
        const result = await updatePDS(params.id, data);

        if (result.success && result.data) {
            return NextResponse.json(result.data);
        } else {
            return NextResponse.json({ error: result.error || "Failed to update PDS" }, { status: 500 });
        }
    } catch (error) {
        console.error("Failed to update PDS:", error);
        return NextResponse.json({ error: "Failed to update PDS" }, { status: 500 });
    }
}
