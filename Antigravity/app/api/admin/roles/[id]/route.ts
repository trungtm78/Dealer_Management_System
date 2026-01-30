import { NextRequest, NextResponse } from "next/server";
import { getRoleWithPermissions, updateRole } from "@/actions/admin/permissions";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const data = await getRoleWithPermissions(params.id);
        if (!data) return NextResponse.json({ success: false, error: { code: "ADM_404", message: "Role not found" } }, { status: 404 });
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: { code: "ADM_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const result = await updateRole(params.id, body);

        if (result.success) {
            return NextResponse.json({ success: true });
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
