import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const bay = await prisma.service_bays.findUnique({
            where: { id: params.id }
        });

        if (!bay) {
            return NextResponse.json({
                success: false,
                error: { code: "BAY_404", message: "Bay not found" }
            }, { status: 404 });
        }

        // Get recent assignments separately
        const assignments = await prisma.bay_assignments.findMany({
            where: { bay_id: params.id },
            include: {
                RepairOrder: {
                    include: { Customer: true }
                }
            },
            orderBy: { assigned_at: 'desc' },
            take: 10
        });

        return NextResponse.json({
            success: true,
            data: { ...bay, assignments }
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
        const { bay_name, location, capacity_vehicles, description, status } = body;

        const bay = await prisma.service_bays.update({
            where: { id: params.id },
            data: {
                bay_name,
                location,
                capacity_vehicles,
                description,
                status
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
        const activeAssignment = await prisma.bay_assignments.findFirst({
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

        await prisma.service_bays.delete({
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
