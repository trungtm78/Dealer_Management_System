import { NextRequest, NextResponse } from "next/server";
import { UpdatePartInput } from "@/lib/types/inventory";
import { getPart, updatePart, deletePart } from "@/actions/inventory/parts";

// GET /api/inventory/parts/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const part = await getPart(params.id);
        if (!part) {
            return NextResponse.json({ error: "Part not found" }, { status: 404 });
        }
        return NextResponse.json(part);
    } catch (error) {
        console.error("Failed to fetch part:", error);
        return NextResponse.json({ error: "Failed to fetch part" }, { status: 500 });
    }
}

// PUT /api/inventory/parts/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const data: UpdatePartInput = await req.json();
        const result = await updatePart(params.id, data);

        if (result.success && result.data) {
            return NextResponse.json(result.data);
        } else {
            return NextResponse.json({ error: result.error || "Failed to update part" }, { status: 500 });
        }
    } catch (error) {
        console.error("Failed to update part:", error);
        return NextResponse.json({ error: "Failed to update part" }, { status: 500 });
    }
}

// DELETE /api/inventory/parts/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const result = await deletePart(params.id);
        if (result.success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: result.error || "Failed to delete part" }, { status: 500 });
        }
    } catch (error) {
        console.error("Failed to delete part:", error);
        return NextResponse.json({ error: "Failed to delete part" }, { status: 500 });
    }
}
