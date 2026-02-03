import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const bays = await prisma.service_bays.findMany({
            where: { status: { not: 'DELETED' } },
            orderBy: { bay_name: 'asc' }
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
        const { bay_name, bay_code, bay_type, location, capacity_vehicles } = body;

        if (!bay_name || !bay_code) {
            return NextResponse.json({
                success: false,
                error: { code: "BAY_400", message: "Bay name and code are required" }
            }, { status: 400 });
        }

        const bay = await prisma.service_bays.create({
            data: {
                bay_name,
                bay_code,
                bay_type: bay_type || 'GENERAL',
                capacity_vehicles: capacity_vehicles || 1,
                location,
                status: 'ACTIVE'
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
