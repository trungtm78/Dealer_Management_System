import { NextRequest, NextResponse } from "next/server";
import { getQuotes, createQuote } from "@/actions/service/quotations";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || undefined;
    const quotes = await getQuotes(query);
    return NextResponse.json(quotes);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await createQuote(body);
        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json(result.data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
    }
}
