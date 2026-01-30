import { NextRequest, NextResponse } from "next/server";
import { getRoles, createRole } from "@/actions/admin/permissions";

export async function GET(req: NextRequest) {
    try {
        const data = await getRoles();
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: { code: "ADM_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await createRole(body);

        if (result.success) {
            return NextResponse.json({ success: true }, { status: 201 });
        } else {
            return NextResponse.json({
                success: false,
                error: { code: "ADM_400", message: result.error }
            }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: { code: "ADM_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}
