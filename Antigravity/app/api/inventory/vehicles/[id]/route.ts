import { NextRequest, NextResponse } from "next/server";
import { UpdateVehicleInput } from "@/lib/types/inventory";
import { getVehicle, updateVehicle, deleteVehicle } from "@/actions/inventory/vehicles";

// GET /api/inventory/vehicles/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const vehicle = await getVehicle(params.id);
        if (!vehicle) {
            return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
        }
        return NextResponse.json(vehicle);
    } catch (error) {
        console.error("Failed to fetch vehicle:", error);
        return NextResponse.json({ error: "Failed to fetch vehicle" }, { status: 500 });
    }
}

// PUT /api/inventory/vehicles/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const data: UpdateVehicleInput = await req.json();
        const result = await updateVehicle(params.id, data);

        if (result.success && result.data) {
            return NextResponse.json(result.data);
        } else {
            return NextResponse.json({ error: result.error || "Failed to update vehicle" }, { status: 500 });
        }
    } catch (error) {
        console.error("Failed to update vehicle:", error);
        return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 });
    }
}

// DELETE /api/inventory/vehicles/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const result = await deleteVehicle(params.id);
        if (result.success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: result.error || "Failed to delete vehicle" }, { status: 500 });
        }
    } catch (error) {
        console.error("Failed to delete vehicle:", error);
        return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 });
    }
}
