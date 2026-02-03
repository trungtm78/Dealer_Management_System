import { NextResponse } from "next/server"
import { getRenewalRate } from "@/actions/insurance/dashboard"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const period = searchParams.get('period') as 'this_month' | 'last_month' | 'ytd' || 'this_month'
        
        const renewalRate = await getRenewalRate(period)
        return NextResponse.json(renewalRate)
    } catch (error: any) {
        console.error("Failed to fetch renewal rate:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}