
import { NextRequest, NextResponse } from "next/server";
import { UpdateRepairOrderInput } from "@/lib/types/service";
import { getRepairOrder, updateRepairOrder, deleteRepairOrder } from "@/actions/service/repair-orders";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const ro = await getRepairOrder(params.id);
        if (!ro) {
            return NextResponse.json({ error: "RO not found" }, { status: 404 });
        }
        return NextResponse.json(ro);
    } catch (error) {
        console.error("Failed to fetch RO:", error);
        return NextResponse.json({ error: "Failed to fetch RO" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const data: UpdateRepairOrderInput = await req.json();
        const result = await updateRepairOrder(params.id, data);

        if (result.success && result.data) {
            return NextResponse.json(result.data);
        } else {
            return NextResponse.json({ error: result.error || "Failed to update RO" }, { status: 500 });
        }
    } catch (error) {
        console.error("Failed to update RO:", error);
        return NextResponse.json({ error: "Failed to update RO" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const result = await deleteRepairOrder(params.id);
        if (result.success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: result.error || "Failed to delete RO" }, { status: 500 });
        }
    } catch (error) {
        console.error("Failed to delete RO:", error);
        return NextResponse.json({ error: "Failed to delete RO" }, { status: 500 });
    }
}
