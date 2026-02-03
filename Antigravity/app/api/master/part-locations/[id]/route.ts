import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const partLocation = await prisma.part_locations.findUnique({
            where: { id: params.id }
        })

        if (!partLocation) {
            return NextResponse.json({ error: "Part location not found" }, { status: 404 })
        }

        return NextResponse.json(partLocation)
    } catch (error) {
        console.error("Failed to fetch part location:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch part location"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()
        
        const updatedPartLocation = await prisma.part_locations.update({
            where: { id: params.id },
            data: body
        })

        return NextResponse.json(updatedPartLocation)
    } catch (error) {
        console.error("Failed to update part location:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to update part location"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.part_locations.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            success: "ACTIVE",
            message: "Part location deleted successfully"
        })
    } catch (error) {
        console.error("Failed to delete part location:", error)
        return NextResponse.json({ error: "Failed to delete part location" }, { status: 500 })
    }
}