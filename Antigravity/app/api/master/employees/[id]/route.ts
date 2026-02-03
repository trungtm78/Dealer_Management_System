import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/master/employees/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const employee = await prisma.employees.findUnique({
            where: { id: params.id }
        })

        if (!employee) {
            return NextResponse.json({ error: "Employee not found" }, { status: 404 })
        }

        return NextResponse.json(employee)
    } catch (error) {
        console.error("Failed to fetch employee:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch employee"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

// PATCH /api/master/employees/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()

        const updatedEmployee = await prisma.employees.update({
            where: { id: params.id },
            data: body
        })

        return NextResponse.json(updatedEmployee)
    } catch (error) {
        console.error("Failed to update employee:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to update employee"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

// DELETE /api/master/employees/[id] - Soft delete implementation
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const result = await prisma.employees.update({
            where: { id: params.id },
            data: { deleted_at: new Date() }
        })

        return NextResponse.json({
            success: "ACTIVE",
            message: "Employee deactivated successfully",
            data: result
        })
    } catch (error) {
        console.error("Failed to deactivate employee:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to deactivate employee"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}