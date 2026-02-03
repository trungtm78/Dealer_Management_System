import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/master/vehicle-colors/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const vehicleColor = await prisma.vehicle_colors.findUnique({
            where: { id: params.id }
        })

        if (!vehicleColor) {
            return NextResponse.json({ error: "Vehicle color not found" }, { status: 404 })
        }

        return NextResponse.json(vehicleColor)
    } catch (error) {
        console.error("Failed to fetch vehicle color:", error)
        return NextResponse.json({ error: "Failed to fetch vehicle color" }, { status: 500 })
    }
}

// PATCH /api/master/vehicle-colors/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()
        
        const vehicleColor = await prisma.vehicle_colors.update({
            where: { id: params.id },
            data: body
        })

        return NextResponse.json(vehicleColor)
    } catch (error) {
        console.error("Failed to update vehicle color:", error)
        return NextResponse.json({ error: "Failed to update vehicle color" }, { status: 500 })
    }
}

// DELETE /api/master/vehicle-colors/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const vehicleColor = await prisma.vehicle_colors.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            success: "ACTIVE",
            message: "Vehicle color deleted successfully"
        })
    } catch (error) {
        console.error("Failed to delete vehicle color:", error)
        return NextResponse.json({ error: "Failed to delete vehicle color" }, { status: 500 })
    }
}