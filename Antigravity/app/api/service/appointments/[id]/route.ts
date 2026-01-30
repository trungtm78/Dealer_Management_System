import { NextRequest, NextResponse } from "next/server";
import { UpdateAppointmentInput } from "@/lib/types/service";
import { getAppointment, updateAppointment, deleteAppointment } from "@/actions/service/appointments";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const appointment = await getAppointment(params.id);
        if (!appointment) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }
        return NextResponse.json(appointment);
    } catch (error) {
        console.error("Failed to fetch appointment:", error);
        return NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const data: UpdateAppointmentInput = await req.json();
        const result = await updateAppointment(params.id, data);

        if (result.success && result.data) {
            return NextResponse.json(result.data);
        } else {
            return NextResponse.json({ error: result.error || "Failed to update appointment" }, { status: 500 });
        }
    } catch (error) {
        console.error("Failed to update appointment:", error);
        return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const result = await deleteAppointment(params.id);
        if (result.success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: result.error || "Failed to delete appointment" }, { status: 500 });
        }
    } catch (error) {
        console.error("Failed to delete appointment:", error);
        return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 });
    }
}
