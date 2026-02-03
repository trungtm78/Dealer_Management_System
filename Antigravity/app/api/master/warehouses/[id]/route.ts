import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/master/warehouses/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const warehouse = await prisma.warehouses.findUnique({
            where: { id: params.id }
        })

        if (!warehouse) {
            return NextResponse.json({ error: "Warehouse not found" }, { status: 404 })
        }

        return NextResponse.json(warehouse)
    } catch (error) {
        console.error("Failed to fetch warehouse:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch warehouse"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

// PATCH /api/master/warehouses/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()

        const updatedWarehouse = await prisma.warehouses.update({
            where: { id: params.id },
            data: body
        })

        return NextResponse.json(updatedWarehouse)
    } catch (error) {
        console.error("Failed to update warehouse:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to update warehouse"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

// DELETE /api/master/warehouses/[id] - Soft delete implementation
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const result = await prisma.warehouses.update({
            where: { id: params.id },
            data: { deleted_at: new Date() }
        })

        return NextResponse.json({
            success: "ACTIVE",
            message: "Warehouse deactivated successfully",
            data: result
        })
    } catch (error) {
        console.error("Failed to deactivate warehouse:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to deactivate warehouse"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}