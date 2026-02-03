import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/master/uoms/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const uom = await prisma.uoms.findUnique({
            where: { id: params.id }
        })
        
        if (!uom) {
            return NextResponse.json({ error: "UOM not found" }, { status: 404 })
        }
        
        return NextResponse.json(uom)
    } catch (error) {
        console.error("Failed to fetch UOM:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch UOM"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

// PATCH /api/master/uoms/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()
        
        const updatedUOM = await prisma.uoms.update({
            where: { id: params.id },
            data: {
                ...(body.uom_name && { uom_name: body.uom_name }),
                ...(body.description !== undefined && { description: body.description }),
                ...(body.status && { status: body.status }),
                updated_at: new Date()
            }
        })
        
        return NextResponse.json(updatedUOM)
    } catch (error) {
        console.error("Failed to update UOM:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to update UOM"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

// DELETE /api/master/uoms/[id] - Soft delete
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const uom = await prisma.uoms.update({
            where: { id: params.id },
            data: {
                status: 'INACTIVE',
                deleted_at: new Date()
            }
        })
        
        return NextResponse.json({
            success: "ACTIVE",
            message: "UOM deactivated successfully",
            data: uom
        })
    } catch (error) {
        console.error("Failed to deactivate UOM:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to deactivate UOM"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}
