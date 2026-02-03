import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/master/parts/[id] - Lấy chi tiết part
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const part = await prisma.part.findUnique({
            where: { id: params.id },
            include: {
                PartVehicleCompatibility: {
                    include: {
                        VehicleModel: true
                    }
                }
            }
        })

        if (!part) {
            return NextResponse.json({
                success: false,
                error: "Không tìm thấy phụ tùng"
            }, { status: 404 })
        }

        const partWithCompatibility = {
            ...part,
            compatible_vehicles: part.PartVehicleCompatibility.map(pvc => ({
                id: pvc.VehicleModel.id,
                model_code: pvc.VehicleModel.model_code,
                model_name: pvc.VehicleModel.model_name,
                category: pvc.VehicleModel.category,
                status: pvc.VehicleModel.status
            }))
        }

        return NextResponse.json({
            success: true,
            data: partWithCompatibility
        })
    } catch (error) {
        console.error("GET /api/master/parts/[id] error:", error)
        return NextResponse.json({
            success: false,
            error: "Không thể tải thông tin phụ tùng"
        }, { status: 500 })
    }
}

// PATCH /api/master/parts/[id] - Cập nhật part và compatibility
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()
        const {
            part_number,
            name,
            description,
            category,
            quantity,
            min_stock,
            max_stock,
            unit_price,
            cost_price,
            location,
            compatible_vehicle_model_ids
        } = body

        // Update using transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update part
            const updatedPart = await tx.part.update({
                where: { id: params.id },
                data: {
                    part_number,
                    name,
                    description: description || null,
                    category,
                    quantity,
                    min_stock,
                    max_stock: max_stock || 100,
                    unit_price,
                    cost_price: cost_price || 0,
                    location: location || null,
                    updated_at: new Date()
                }
            })

            // Delete existing compatibility records
            await tx.partVehicleCompatibility.deleteMany({
                where: { part_id: params.id }
            })

            // Create new compatibility records
            if (compatible_vehicle_model_ids && compatible_vehicle_model_ids.length > 0) {
                await tx.partVehicleCompatibility.createMany({
                    data: compatible_vehicle_model_ids.map((vehicle_model_id: string) => ({
                        part_id: params.id,
                        vehicle_model_id
                    }))
                })
            }

            return updatedPart
        })

        return NextResponse.json({
            success: true,
            data: result
        })
    } catch (error) {
        console.error("PATCH /api/master/parts/[id] error:", error)
        return NextResponse.json({
            success: false,
            error: "Không thể cập nhật phụ tùng"
        }, { status: 500 })
    }
}

// DELETE /api/master/parts/[id] - Xóa part (cascade delete compatibility)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.part.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            success: true,
            message: "Xóa phụ tùng thành công"
        })
    } catch (error) {
        console.error("DELETE /api/master/parts/[id] error:", error)
        return NextResponse.json({
            success: false,
            error: "Không thể xóa phụ tùng"
        }, { status: 500 })
    }
}
