import { NextRequest, NextResponse } from "next/server";
import { CreateVehicleInput } from "@/lib/types/inventory";
import { getVehicles, createVehicle } from "@/actions/inventory/vehicles";

// GET /api/inventory/vehicles
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query') || undefined;

        const vehicles = await getVehicles(query);
        return NextResponse.json(vehicles);
    } catch (error) {
        console.error("Failed to fetch vehicles:", error);
        return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
    }
}

// POST /api/inventory/vehicles
export async function POST(req: NextRequest) {
    try {
        const data: CreateVehicleInput = await req.json();
        const result = await createVehicle(data);

        if (result.success && result.data) {
            return NextResponse.json(result.data, { status: 201 });
        } else {
            if (result.error && result.error.includes("tồn tại")) {
                return NextResponse.json({ error: result.error }, { status: 409 });
            }
            return NextResponse.json({ error: result.error || "Failed to create vehicle" }, { status: 500 });
        }
    } catch (error) {
        console.error("Failed to create vehicle:", error);
        return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
    }
}
