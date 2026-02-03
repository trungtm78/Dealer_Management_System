import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const company = await prisma.insurance_companies.findUnique({
            where: { id: params.id }
        })

        if (!company) {
            return NextResponse.json({ error: "Insurance company not found" }, { status: 404 })
        }

        return NextResponse.json(company)
    } catch (error) {
        console.error("Failed to fetch insurance company:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch insurance company"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()

        const updatedCompany = await prisma.insurance_companies.update({
            where: { id: params.id },
            data: body
        })

        return NextResponse.json(updatedCompany)
    } catch (error) {
        console.error("Failed to update insurance company:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to update insurance company"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.insurance_companies.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            success: "ACTIVE",
            message: "Insurance company deleted successfully"
        })
    } catch (error) {
        console.error("Failed to delete insurance company:", error)
        return NextResponse.json({ error: "Failed to delete insurance company", status: 500 })
    }
}