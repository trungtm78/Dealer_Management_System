import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const bays = await prisma.serviceBay.findMany({
            include: {
                assignments: {
                    where: { status: { in: ['ASSIGNED', 'WORKING'] } },
                    include: {
                        repairOrder: {
                            include: { customer: true }
                        }
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json({
            success: true,
            data: bays
        });
    } catch (error) {
        console.error("API Error [GET /api/service/bays]:", error);
        return NextResponse.json({
            success: false,
            error: { code: "BAY_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, location, capacity, equipment } = body;

        if (!name) {
            return NextResponse.json({
                success: false,
                error: { code: "BAY_400", message: "Name is required" }
            }, { status: 400 });
        }

        const bay = await prisma.serviceBay.create({
            data: {
                name,
                location,
                capacity,
                equipment: equipment ? JSON.stringify(equipment) : null,
                status: 'ACTIVE',
                is_available: true
            }
        });

        return NextResponse.json({
            success: true,
            data: bay
        }, { status: 201 });
    } catch (error) {
        console.error("API Error [POST /api/service/bays]:", error);
        return NextResponse.json({
            success: false,
            error: { code: "BAY_500", message: "Internal Server Error" }
        }, { status: 500 });
    }
}
