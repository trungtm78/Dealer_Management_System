import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const serviceType = await prisma.service_types.findUnique({
            where: { id: params.id }
        })

        if (!serviceType) {
            return NextResponse.json({ error: "Service type not found" }, { status: 404 })
        }

        return NextResponse.json(serviceType)
    } catch (error) {
        console.error("Failed to fetch service type:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch service type"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()

        const updatedServiceType = await prisma.service_types.update({
            where: { id: params.id },
            data: body
        })

        return NextResponse.json(updatedServiceType)
    } catch (error) {
        console.error("Failed to update service type:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to update service type"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.service_types.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            success: "ACTIVE",
            message: "Service type deleted successfully"
        })
    } catch (error) {
        console.error("Failed to delete service type:", error)
        return NextResponse.json({ error: "Failed to delete service type", status: 500 })
    }
}