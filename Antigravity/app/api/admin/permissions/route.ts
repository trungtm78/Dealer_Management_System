import { NextRequest, NextResponse } from "next/server";
import { getPermissions } from "@/actions/admin/permissions";

export async function GET(req: NextRequest) {
    try {
        const data = await getPermissions();
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: { code: "ADM_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}
