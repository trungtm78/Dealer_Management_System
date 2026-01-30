import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { points, description } = body;

        if (points === undefined) {
            return NextResponse.json({ error: "Points is required" }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            const transaction = await tx.loyaltyTransaction.create({
                data: {
                    customer_id: params.id,
                    points: Number(points),
                    type: points > 0 ? 'EARN' : 'REDEEM',
                    reason: description || 'Points adjustment'
                }
            });

            const customer = await tx.customer.update({
                where: { id: params.id },
                data: { points: { increment: Number(points) } }
            });

            // Tier thresholds: BRONZE (0-499), SILVER (500-1999), GOLD (2000-4999), PLATINUM (5000+)
            let tier = 'BRONZE';
            if (customer.points >= 5000) tier = 'PLATINUM';
            else if (customer.points >= 2000) tier = 'GOLD';
            else if (customer.points >= 500) tier = 'SILVER';

            if (tier !== customer.tier) {
                await tx.customer.update({ where: { id: params.id }, data: { tier } });
            }

            return {
                transaction_id: transaction.id,
                new_total: customer.points,
                new_tier: tier
            };
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("API Error [POST /api/crm/customers/:id/loyalty]:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
