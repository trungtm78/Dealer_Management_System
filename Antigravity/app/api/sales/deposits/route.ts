
import { NextRequest, NextResponse } from "next/server";
import { CreateDepositInput } from "@/lib/types/sales";
import { getDeposits, createDeposit } from "@/actions/sales/deposits";

export async function GET(req: NextRequest) {
    try {
        const deposits = await getDeposits();
        return NextResponse.json(deposits);
    } catch (error) {
        console.error("Failed to fetch deposits:", error);
        return NextResponse.json({ error: "Failed to fetch deposits" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data: CreateDepositInput = await req.json();
        const result = await createDeposit(data);

        if (result.success && result.data) {
            return NextResponse.json(result.data, { status: 201 });
        } else {
            return NextResponse.json({ error: result.error || "Failed to create deposit" }, { status: 500 });
        }
    } catch (error) {
        console.error("Failed to create deposit:", error);
        return NextResponse.json({ error: "Failed to create deposit" }, { status: 500 });
    }
}
