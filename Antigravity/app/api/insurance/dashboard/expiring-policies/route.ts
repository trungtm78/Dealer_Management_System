import { NextResponse } from "next/server"
import { getExpiringPolicies } from "@/actions/insurance/dashboard"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const days = parseInt(searchParams.get('days') || '30')
        
        const policies = await getExpiringPolicies(days)
        return NextResponse.json(policies)
    } catch (error: any) {
        console.error("Failed to fetch expiring policies:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}