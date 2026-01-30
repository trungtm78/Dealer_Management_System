import { NextRequest, NextResponse } from "next/server";
import { updateClaimStatus } from "@/actions/insurance/claims";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { status, notes } = body;
        const result = await updateClaimStatus(params.id, status, notes);

        if (result.success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({
                success: false,
                error: { code: "INS_400", message: result.error }
            }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: { code: "INS_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}
