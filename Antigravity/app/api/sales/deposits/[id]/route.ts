import { NextRequest, NextResponse } from "next/server";
import { DepositStatus } from "@/lib/types/sales";
import { getDeposit, updateDepositStatus } from "@/actions/sales/deposits";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const deposit = await getDeposit(params.id);
        if (!deposit) {
            return NextResponse.json({ error: "Deposit not found" }, { status: 404 });
        }
        return NextResponse.json(deposit);
    } catch (error) {
        console.error("Failed to fetch deposit:", error);
        return NextResponse.json({ error: "Failed to fetch deposit" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        // Only status update supported for now as per Action
        if (!body.status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        const result = await updateDepositStatus(params.id, body.status as DepositStatus);

        if (result.success && result.data) {
            return NextResponse.json(result.data);
        } else {
            return NextResponse.json({ error: result.error || "Failed to update deposit" }, { status: 500 });
        }
    } catch (error) {
        console.error("Failed to update deposit:", error);
        return NextResponse.json({ error: "Failed to update deposit" }, { status: 500 });
    }
}
