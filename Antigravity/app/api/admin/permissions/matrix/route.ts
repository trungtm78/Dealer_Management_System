import { NextRequest, NextResponse } from "next/server";
import { getRoles, getPermissions } from "@/actions/admin/permissions";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const [roles, permissions] = await Promise.all([
            getRoles(),
            getPermissions()
        ]);

        const matrix: any[] = await prisma.$queryRaw`SELECT * FROM role_permissions`;

        return NextResponse.json({
            success: true,
            data: {
                roles,
                permissions,
                matrix: matrix.map(m => ({
                    role_id: m.role_id,
                    permission_id: m.permission_id
                }))
            }
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: { code: "ADM_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}
