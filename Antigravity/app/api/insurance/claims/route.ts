import { NextRequest, NextResponse } from "next/server";
import { getClaims, createClaim } from "@/actions/insurance/claims";

export async function GET(req: NextRequest) {
    try {
        const data = await getClaims();
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: { code: "INS_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await createClaim(body);

        if (result.success) {
            return NextResponse.json({ success: true, data: result.data }, { status: 201 });
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
