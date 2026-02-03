import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const quotations = await prisma.quotation.findMany({
            include: {
                Customer: true,
                User: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { created_at: "desc" }
        });

        return NextResponse.json(quotations);
    } catch (error) {
        console.error("Failed to fetch quotations:", error);
        return NextResponse.json(
            { error: "Failed to fetch quotations" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        // Generate quote number
        const count = await prisma.quotation.count();
        const quoteNumber = `QT/2026/${String(count + 1).padStart(3, '0')}`;

        const quotation = await prisma.quotation.create({
            data: {
                quote_number: quoteNumber,
                customer_name: body.customer_name,
                customer_phone: body.customer_phone,
                model: body.model,
                version: body.version,
                color: body.color,
                base_price: body.base_price,
                total_price: body.total_price,
                created_by_id: body.user_id || "system",
                status: "DRAFT"
            },
            include: {
                Customer: true,
                User: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return NextResponse.json(quotation);
    } catch (error) {
        console.error("Failed to create quotation:", error);
        return NextResponse.json(
            { error: "Failed to create quotation" },
            { status: 500 }
        );
    }
}