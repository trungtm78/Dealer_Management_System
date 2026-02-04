import { NextRequest, NextResponse } from "next/server";
import { CreateVehicleInput } from "@/lib/types/inventory";
import { getVehicles, createVehicle } from "@/actions/inventory/vehicles";
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";
import prisma from "@/lib/prisma";

// GET /api/inventory/vehicles
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const forDropdown = searchParams.get('for_dropdown') === 'true';
        const status = searchParams.get('status') || 'AVAILABLE';

        if (forDropdown) {
            const vehicles = await prisma.vin.findMany({
                where: { status },
                select: { id: true, vin_number: true, model: true, status: true },
                orderBy: { vin_number: 'asc' }
            });
            const dropdownData = vehicles.map(v => ({
                id: v.id,
                name: `${v.vin_number} - ${v.model}`,
                status: v.status
            }));
            return NextResponse.json({ data: dropdownData });
        }

        const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
        const skip = calculateSkip(page, limit);

        const where: any = {
            ...buildSearchWhereClause(search, ["vin", "model_name", "color"]),
        };

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.model) {
            where.model_name = filters.model;
        }

        const [total, vehicles] = await Promise.all([
            prisma.vin.count({ where }),
            prisma.vin.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);

        return NextResponse.json({
            data: vehicles,
            meta: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        console.error("Failed to fetch vehicles:", error);
        return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
    }
}

// POST /api/inventory/vehicles
export async function POST(req: NextRequest) {
    try {
        const data: CreateVehicleInput = await req.json();
        const result = await createVehicle(data);

        if (result.success && result.data) {
            return NextResponse.json(result.data, { status: 201 });
        } else {
            if (result.error && result.error.includes("tồn tại")) {
                return NextResponse.json({ error: result.error }, { status: 409 });
            }
            return NextResponse.json({ error: result.error || "Failed to create vehicle" }, { status: 500 });
        }
    } catch (error) {
        console.error("Failed to create vehicle:", error);
        return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
    }
}
