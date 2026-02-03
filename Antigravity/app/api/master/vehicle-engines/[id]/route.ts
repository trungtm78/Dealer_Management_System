import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/master/vehicle-engines/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const vehicleEngine = await prisma.vehicle_engines.findUnique({
            where: { id: params.id }
        })

        if (!vehicleEngine) {
            return NextResponse.json({ error: "Vehicle engine not found" }, { status: 404 })
        }

        return NextResponse.json(vehicleEngine)
    } catch (error) {
        console.error("Failed to fetch vehicle engine:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch vehicle engine"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

// PATCH /api/master/vehicle-engines/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()
        
        const updatedVehicleEngine = await prisma.vehicle_engines.update({
            where: { id: params.id },
            data: body
        })

        return NextResponse.json(updatedVehicleEngine)
    } catch (error) {
        console.error("Failed to update vehicle engine:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to update vehicle engine"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

// DELETE /api/master/vehicle-engines/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const result = await prisma.vehicle_engines.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            success: "ACTIVE",
            message: "Vehicle engine deleted successfully",
            data: result
        })
    } catch (error) {
        console.error("Failed to delete vehicle engine:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to delete vehicle engine"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}