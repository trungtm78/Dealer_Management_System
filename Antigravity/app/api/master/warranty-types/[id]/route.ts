import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const warrantyType = await prisma.warranty_types.findUnique({
            where: { id: params.id }
        })

        if (!warrantyType) {
            return NextResponse.json({ error: "Warranty type not found" }, { status: 404 })
        }

        return NextResponse.json(warrantyType)
    } catch (error) {
        console.error("Failed to fetch warranty type:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch warranty type"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()

        const updatedWarrantyType = await prisma.warranty_types.update({
            where: { id: params.id },
            data: body
        })

        return NextResponse.json(updatedWarrantyType)
    } catch (error) {
        console.error("Failed to update warranty type:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to update warranty type"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.warranty_types.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            success: "ACTIVE",
            message: "Warranty type deleted successfully"
        })
    } catch (error) {
        console.error("Failed to delete warranty type:", error)
        return NextResponse.json({ error: "Failed to delete warranty type", status: 500 })
    }
}