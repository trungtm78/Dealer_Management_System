
import { NextRequest, NextResponse } from "next/server";
import { CreateAppointmentInput } from "@/lib/types/service";
import { getAppointments, createAppointment } from "@/actions/service/appointments";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query') || undefined;

        const appointments = await getAppointments(query);
        return NextResponse.json(appointments);
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
