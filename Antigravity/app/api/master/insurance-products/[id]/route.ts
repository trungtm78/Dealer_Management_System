import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const product = await prisma.insurance_products.findUnique({
            where: { id: params.id }
        })

        if (!product) {
            return NextResponse.json({ error: "Insurance product not found" }, { status: 404 })
        }

        return NextResponse.json(product)
    } catch (error) {
        console.error("Failed to fetch insurance product:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch insurance product"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()

        const updatedProduct = await prisma.insurance_products.update({
            where: { id: params.id },
            data: body
        })

        return NextResponse.json(updatedProduct)
    } catch (error) {
        console.error("Failed to update insurance product:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to update insurance product"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.insurance_products.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            success: "ACTIVE",
            message: "Insurance product deleted successfully"
        })
    } catch (error) {
        console.error("Failed to delete insurance product:", error)
        return NextResponse.json({ error: "Failed to delete insurance product", status: 500 })
    }
}