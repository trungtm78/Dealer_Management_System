
import { NextRequest, NextResponse } from "next/server";
import { CreateRepairOrderInput } from "@/lib/types/service";
import { getRepairOrders, createRepairOrder } from "@/actions/service/repair-orders";

export async function GET(req: NextRequest) {
    try {
        const ros = await getRepairOrders();
        return NextResponse.json(ros);
    } catch (error) {
        console.error("Failed to fetch repair orders:", error);
        return NextResponse.json({ error: "Failed to fetch repair orders" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data: CreateRepairOrderInput = await req.json();
        const result = await createRepairOrder(data);

        if (result.success && result.data) {
            return NextResponse.json(result.data, { status: 201 });
        } else {
            return NextResponse.json({ error: result.error || "Failed to create RO" }, { status: 500 });
        }
    } catch (error) {
        console.error("Failed to create repair order:", error);
        return NextResponse.json({ error: "Failed to create repair order" }, { status: 500 });
    }
}
