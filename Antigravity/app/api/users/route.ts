import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "@/actions/users";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role') || undefined;
    const users = await getUsers(role);
    return NextResponse.json(users);
}
