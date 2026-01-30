
import { NextResponse } from "next/server";
import { getInsuranceContracts, createInsuranceContract } from "@/actions/insurance/contracts";

export async function GET(request: Request) {
    const contracts = await getInsuranceContracts();
    return NextResponse.json(contracts);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Basic conversion for Date strings if needed, but Action expects Date objects sometimes or strings?
        // In Action: `startDate: data.startDate` (Date).
        // Body JSON has strings. Need to convert.

        const payload = {
            ...body,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            premium: Number(body.premium)
        };

        const result = await createInsuranceContract(payload);
        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json(result.data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
