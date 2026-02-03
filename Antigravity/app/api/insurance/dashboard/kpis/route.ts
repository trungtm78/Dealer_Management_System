import { NextResponse } from "next/server"
import { getDashboardKPIs } from "@/actions/insurance/dashboard"

export async function GET() {
    try {
        const kpis = await getDashboardKPIs()
        return NextResponse.json(kpis)
    } catch (error: any) {
        console.error("Failed to fetch dashboard KPIs:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}