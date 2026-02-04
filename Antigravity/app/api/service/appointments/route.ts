import { NextRequest, NextResponse } from "next/server";
import { CreateAppointmentInput } from "@/lib/types/service";
import { getAppointments, createAppointment } from "@/actions/service/appointments";
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
        const skip = calculateSkip(page, limit);

        const where: any = {
            ...buildSearchWhereClause(search, ["customer_name", "vehicle_model"]),
        };

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.date) {
            where.appointment_date = new Date(filters.date);
        }

        const [total, appointments] = await Promise.all([
            prisma.serviceAppointment.count({ where }),
            prisma.serviceAppointment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);

        return NextResponse.json({
            data: appointments,
            meta: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        console.error("Failed to fetch appointments:", error);
        return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data: CreateAppointmentInput = await req.json();
        const result = await createAppointment(data);

        if (result.success && result.data) {
            return NextResponse.json(result.data, { status: 201 });
        } else {
            console.error("Failed to create appointment:", result.error);
            return NextResponse.json({ error: result.error || "Failed to create appointment" }, { status: 500 });
        }
    } catch (error: any) {
        console.error("Failed to create appointment:", error);
        return NextResponse.json({ error: "Failed to create appointment", details: error?.message }, { status: 500 });
    }
}
