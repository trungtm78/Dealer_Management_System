import { NextRequest, NextResponse } from "next/server";
import { CreateStockMovementInput } from "@/lib/types/inventory";
import { getStockMovements, createStockMovement } from "@/actions/inventory/movements";

// GET /api/inventory/movements
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const partId = searchParams.get('partId') || undefined;

        const movements = await getStockMovements(partId);
        return NextResponse.json(movements);
    } catch (error) {
        console.error("Failed to fetch movements:", error);
        return NextResponse.json({ error: "Failed to fetch movements" }, { status: 500 });
    }
}

// POST /api/inventory/movements
export async function POST(req: NextRequest) {
    try {
        const data: CreateStockMovementInput = await req.json();
        const result = await createStockMovement(data);

        if (result.success && result.data) {
            return NextResponse.json(result.data, { status: 201 });
        } else {
            const status = result.error && result.error.includes("Insufficient") ? 400 : 500;
            return NextResponse.json({ error: result.error || "Failed to create movement" }, { status });
        }
    } catch (error) {
        console.error("Failed to create movement:", error);
        return NextResponse.json({ error: "Failed to create movement" }, { status: 500 });
    }
}
