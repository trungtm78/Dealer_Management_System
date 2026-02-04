import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createUser } from "@/actions/admin/users";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const forDropdown = searchParams.get('for_dropdown') === 'true';

        if (forDropdown) {
            const users = await prisma.user.findMany({
                where: { status: 'ACTIVE' },
                select: { id: true, name: true, status: true },
                orderBy: { name: 'asc' }
            });
            const dropdownData = users.map(u => ({
                id: u.id,
                name: u.name,
                status: u.status
            }));
            return NextResponse.json({ data: dropdownData });
        }

        const users = await prisma.user.findMany({
            orderBy: { created_at: 'desc' }
        });
        return NextResponse.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error("API Error [GET /api/admin/users]:", error);
        return NextResponse.json({
            success: false,
            error: { code: "ADM_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await createUser(body);

        if (result.success) {
            return NextResponse.json({
                success: true,
                data: result.data
            }, { status: 201 });
        } else {
            return NextResponse.json({
                success: false,
                error: { code: "ADM_400", message: result.error }
            }, { status: 400 });
        }
    } catch (error: any) {
        console.error("API Error [POST /api/admin/users]:", error);
        return NextResponse.json({
            success: false,
            error: { code: "ADM_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}
