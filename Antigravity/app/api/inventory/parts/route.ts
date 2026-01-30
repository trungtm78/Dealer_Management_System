import { NextRequest, NextResponse } from "next/server";
import { CreatePartInput } from "@/lib/types/inventory";
import { getParts, createPart } from "@/actions/inventory/parts";

// GET /api/inventory/parts
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query') || undefined;

        const parts = await getParts(query);
        return NextResponse.json(parts);
    } catch (error) {
        console.error("Failed to fetch parts:", error);
        return NextResponse.json({ error: "Failed to fetch parts" }, { status: 500 });
    }
}

// POST /api/inventory/parts
export async function POST(req: NextRequest) {
    try {
        const data: CreatePartInput = await req.json();
        
        const result = await createPart(data);
    
        if (result.success && result.data) {
            return NextResponse.json(result.data, { status: 201 });
        } else {
            console.error("Failed to create part:", result.error);
            if (result.error && result.error.includes("tồn tại")) {
                return NextResponse.json({ error: result.error }, { status: 409 });
            }
            return NextResponse.json({ error: result.error || "Failed to create part" }, { status: 500 });
        }
} catch (error: any) {
        console.error("Failed to create part:", error);
        return NextResponse.json({ error: "Failed to create part", details: error?.message }, { status: 500 });
    }
}
