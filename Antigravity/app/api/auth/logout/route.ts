
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    cookies().delete('user_id');
    return NextResponse.json({ success: true, message: "Đăng xuất thành công" });
}
