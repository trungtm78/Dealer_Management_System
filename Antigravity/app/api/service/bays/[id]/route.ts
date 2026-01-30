import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const bay = await prisma.serviceBay.findUnique({
            where: { id: params.id },
            include: {
                assignments: {
                    include: {
                        repairOrder: {
                            include: { customer: true }
                        }
                    },
                    orderBy: { assigned_at: 'desc' },
                    take: 10
                }
            }
        });

        if (!bay) {
            return NextResponse.json({
                success: false,
                error: { code: "BAY_404", message: "Bay not found" }
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: bay
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: { code: "BAY_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { name, location, capacity, equipment, status, is_available } = body;

        const bay = await prisma.serviceBay.update({
            where: { id: params.id },
            data: {
                name,
                location,
                capacity,
                equipment: equipment ? JSON.stringify(equipment) : undefined,
                status,
                is_available
            }
        });

        return NextResponse.json({
            success: true,
            data: bay
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: { code: "BAY_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Check for active assignments
        const activeAssignment = await prisma.bayAssignment.findFirst({
            where: {
                bay_id: params.id,
                status: { in: ['ASSIGNED', 'WORKING'] }
            }
        });

        if (activeAssignment) {
            return NextResponse.json({
                success: false,
                error: { code: "BAY_HAS_ACTIVE_WORK", message: "Cannot delete bay with active assignment" }
            }, { status: 400 });
        }

        await prisma.serviceBay.delete({
            where: { id: params.id }
        });

        return NextResponse.json({
            success: true,
            message: "Bay deleted successfully"
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: { code: "BAY_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}
