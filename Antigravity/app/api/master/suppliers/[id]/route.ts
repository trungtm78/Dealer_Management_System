import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/master/suppliers/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const supplier = await prisma.supplier.findUnique({
            where: { id: params.id }
        })

        if (!supplier) {
            return NextResponse.json({ error: "Supplier not found" }, { status: 404 })
        }

        return NextResponse.json(supplier)
    } catch (error) {
        console.error("Failed to fetch Supplier:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch supplier"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

// PATCH /api/master/suppliers/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()

        const updatedSupplier = await prisma.supplier.update({
            where: { id: params.id },
            data: body
        })

        return NextResponse.json(updatedSupplier)
    } catch (error) {
        console.error("Failed to update Supplier:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to update supplier"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

// DELETE /api/master/suppliers/[id] - Soft delete implementation
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const result = await prisma.supplier.update({
            where: { id: params.id },
            data: { status: 'INACTIVE' }
        })

        return NextResponse.json({
            success: "ACTIVE",
            message: "Supplier deactivated successfully",
            data: result
        })
    } catch (error) {
        console.error("Failed to deactivate Supplier:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to deactivate supplier"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}