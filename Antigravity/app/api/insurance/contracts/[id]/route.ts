
import { NextResponse } from "next/server";
import { getInsuranceContract, updateInsuranceContract, deleteInsuranceContract } from "@/actions/insurance/contracts";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const contract = await getInsuranceContract(params.id);
    if (!contract) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(contract);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const body = await request.json();
    const payload = {
        ...body,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        premium: body.premium ? Number(body.premium) : undefined
    };

    const result = await updateInsuranceContract(params.id, payload);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json(result.data);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const result = await deleteInsuranceContract(params.id);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true });
}
