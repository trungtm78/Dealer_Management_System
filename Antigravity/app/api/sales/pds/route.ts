
import { NextRequest, NextResponse } from "next/server";
import { CreatePDSInput } from "@/lib/types/sales";
import { getPDSList, createPDS } from "@/actions/sales/pds";

export async function GET(req: NextRequest) {
    try {
        const list = await getPDSList();
        return NextResponse.json(list);
    } catch (error) {
        console.error("Failed to fetch PDS list:", error);
        return NextResponse.json({ error: "Failed to fetch PDS list" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data: CreatePDSInput = await req.json();
        const result = await createPDS(data);

        if (result.success && result.data) {
            return NextResponse.json(result.data, { status: 201 });
        } else {
            return NextResponse.json({ error: result.error || "Failed to create PDS" }, { status: 500 });
        }
    } catch (error) {
        console.error("Failed to create PDS:", error);
        return NextResponse.json({ error: "Failed to create PDS" }, { status: 500 });
    }
}
