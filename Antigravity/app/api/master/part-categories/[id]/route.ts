import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const partCategory = await prisma.part_categories.findUnique({
            where: { id: params.id }
        })

        if (!partCategory) {
            return NextResponse.json({ error: "Part category not found" }, { status: 404 })
        }

        return NextResponse.json(partCategory)
    } catch (error) {
        console.error("Failed to fetch part category:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch part category"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()
        
        const updatedPartCategory = await prisma.part_categories.update({
            where: { id: params.id },
            data: body
        })

        return NextResponse.json(updatedPartCategory)
    } catch (error) {
        console.error("Failed to update part category:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to update part category"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.part_categories.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            success: "ACTIVE",
            message: "Part category deleted successfully"
        })
    } catch (error) {
        console.error("Failed to delete part category:", error)
        return NextResponse.json({ error: "Failed to delete part category" }, { status: 500 })
    }
}