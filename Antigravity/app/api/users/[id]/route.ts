import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                employees: {
                    include: {
                        master_departments: {
                            select: {
                                id: true,
                                department_name: true
                            }
                        },
                        master_positions: {
                            select: {
                                id: true,
                                position_name: true
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: user.id,
            email: user.email,
            role: user.role,
            department: user.employees?.master_departments?.department_name || null,
            department_id: user.employees?.department_id || null,
            position: user.employees?.master_positions?.position_name || null,
            position_id: user.employees?.position_id || null,
            status: user.status
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        );
    }
}
