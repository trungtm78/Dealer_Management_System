import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination"

// GET /api/master/parts - Lấy danh sách parts với vehicle compatibility
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const forDropdown = searchParams.get('for_dropdown') === 'true';
        const status = searchParams.get('status') || 'ACTIVE';

        if (forDropdown) {
            const parts = await prisma.part.findMany({
                where: { status },
                select: { id: true, name: true, status: true },
                orderBy: { name: 'asc' }
            });
            const dropdownData = parts.map(p => ({
                id: p.id,
                name: p.name,
                status: p.status
            }));
            return NextResponse.json({ data: dropdownData });
        }

        const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5)
        const skip = calculateSkip(page, limit)

        const where: any = {
            ...buildSearchWhereClause(search, ["name", "part_number"]),
        }

        if (filters.status) {
            where.status = filters.status
        } else {
            where.status = "ACTIVE"
        }

        if (filters.category) {
            where.category = filters.category
        }

        const [total, parts] = await Promise.all([
            prisma.part.count({ where }),
            prisma.part.findMany({
                where,
                skip,
                take: limit,
                include: {
                    PartVehicleCompatibility: {
                        include: {
                            VehicleModel: true
                        }
                    }
                },
                orderBy: {
                    created_at: "desc"
                }
            })
        ])

        const partsWithCompatibility = parts.map(part => ({
            id: part.id,
            part_number: part.part_number,
            name: part.name,
            description: part.description,
            category: part.category,
            quantity: part.quantity,
            min_stock: part.min_stock,
            unit_price: part.unit_price,
            location: part.location,
            status: part.status,
            compatible_vehicles: part.PartVehicleCompatibility.map(pvc => ({
                id: pvc.VehicleModel.id,
                model_code: pvc.VehicleModel.model_code,
                model_name: pvc.VehicleModel.model_name,
                category: pvc.VehicleModel.category,
                status: pvc.VehicleModel.status
            }))
        }))

        return NextResponse.json({
            data: partsWithCompatibility,
            meta: buildPaginationMeta(total, page, limit)
        })
    } catch (error) {
        console.error("GET /api/master/parts error:", error)
        return NextResponse.json({
            error: "Không thể tải danh sách phụ tùng"
        }, { status: 500 })
    }
}


// POST /api/master/parts - Tạo part mới với vehicle compatibility
export async function POST(request: NextRequest) {
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

        // Validation
        if (!part_number || !name) {
            return NextResponse.json({
                success: false,
                error: "Mã phụ tùng và Tên phụ tùng là bắt buộc"
            }, { status: 400 })
        }

        // Check duplicate part_number
        const existing = await prisma.part.findUnique({
            where: { part_number }
        })

        if (existing) {
            return NextResponse.json({
                success: false,
                error: "Mã phụ tùng đã tồn tại"
            }, { status: 400 })
        }

        // Create part with compatibility using transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create part
            const newPart = await tx.part.create({
                data: {
                    part_number,
                    name,
                    description: description || null,
                    category,
                    quantity: quantity || 0,
                    min_stock: min_stock || 10,
                    max_stock: max_stock || 100,
                    unit_price,
                    cost_price: cost_price || 0,
                    location: location || null,
                    status: "ACTIVE"
                }
            })

            // Create vehicle compatibility records if provided
            if (compatible_vehicle_model_ids && compatible_vehicle_model_ids.length > 0) {
                await tx.partVehicleCompatibility.createMany({
                    data: compatible_vehicle_model_ids.map((vehicle_model_id: string) => ({
                        part_id: newPart.id,
                        vehicle_model_id
                    }))
                })
            }

            return newPart
        })

        return NextResponse.json({
            success: true,
            data: result
        }, { status: 201 })
    } catch (error) {
        console.error("POST /api/master/parts error:", error)
        return NextResponse.json({
            success: false,
            error: "Không thể tạo phụ tùng mới"
        }, { status: 500 })
    }
}
