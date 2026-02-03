import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withVehicleModelLogging } from "@/lib/activity-logger";

// GET /api/vehicle-models/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const vehicleModel = await prisma.vehicle_models.findUnique({
            where: { id: params.id }
        });

        if (!vehicleModel) {
            return NextResponse.json({ error: "Vehicle model not found" }, { status: 404 });
        }

        return NextResponse.json(vehicleModel);
    } catch (error) {
        console.error("Failed to fetch vehicle model:", error);
        return NextResponse.json({ error: "Failed to fetch vehicle model" }, { status: 500 });
    }
}

// PATCH /api/vehicle-models/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    return withVehicleModelLogging(async (request: NextRequest) => {
        try {
            const body = await request.json();
            const { id, ...updateData } = body; // Remove id from update data

            // Validate that model_code cannot be updated
            if (updateData.model_code) {
                return NextResponse.json(
                    { error: "Model code cannot be updated" },
                    { status: 400 }
                );
            }

            // Convert numeric fields
            if (updateData.base_price) {
                updateData.base_price = parseFloat(updateData.base_price);
            }

            const updatedVehicleModel = await prisma.vehicle_models.update({
                where: { id: params.id },
                data: updateData
            });

            return NextResponse.json(updatedVehicleModel);
        } catch (error) {
            console.error("Failed to update vehicle model:", error);
            return NextResponse.json(
                { error: "Failed to update vehicle model" },
                { status: 500 }
            );
        }
    })(req);
}

// DELETE /api/vehicle-models/[id] - Soft delete implementation
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    return withVehicleModelLogging(async (request: NextRequest, context: any) => {
        try {
            // Perform soft delete by updating status and deleted_at
            const updatedVehicleModel = await prisma.$executeRaw`
                UPDATE vehicle_models 
                SET status = 'INACTIVE', deleted_at = ${new Date()}
                WHERE id = ${params.id}
            `;

            // Fetch the updated record
            const result = await prisma.vehicle_models.findUnique({
                where: { id: params.id }
            });

            return NextResponse.json({
                success: "ACTIVE",
                message: "Vehicle model deactivated successfully",
                data: result
            });
        } catch (error) {
            console.error("Failed to deactivate vehicle model:", error);
            return NextResponse.json(
                { error: "Failed to deactivate vehicle model" },
                { status: 500 }
            );
        }
    })(req, { params });
}