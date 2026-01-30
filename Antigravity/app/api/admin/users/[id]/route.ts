import { NextRequest, NextResponse } from "next/server";
import { updateUser, deleteUser } from "@/actions/admin/users";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const result = await updateUser(params.id, body);

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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const result = await deleteUser(params.id);

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
