import { NextRequest, NextResponse } from "next/server";
import { getQuote, updateQuote, convertQuoteToRO } from "@/actions/service/quotations";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const quote = await getQuote(params.id);
    if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(quote);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        // Check for specific actions like convert
        if (body.action === 'convert') {
            const res = await convertQuoteToRO(params.id);
            if (!res.success) return NextResponse.json({ error: res.error }, { status: 400 });
            return NextResponse.json({ success: true });
        }

        const result = await updateQuote(params.id, body);
        if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
        return NextResponse.json(result.data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
    }
}
