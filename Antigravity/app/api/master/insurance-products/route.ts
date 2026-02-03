import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';
        
        const where: any = {};
        
        if (search) {
            where.OR = [
                { product_name: { contains: search } },
                { product_code: { contains: search } }
            ];
        }
        
        if (status) {
            where.status = status;
        }
        
        const [total, products] = await Promise.all([
            prisma.insurance_products.count({ where }),
            prisma.insurance_products.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);
        
        return NextResponse.json({
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Failed to fetch insurance products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch insurance products' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const product = await prisma.insurance_products.create({
            data: {
                product_code: body.product_code,
                product_name: body.product_name,
                insurance_type: body.insurance_type,
                premium_amount: parseFloat(body.premium_amount),
                coverage_amount: parseFloat(body.coverage_amount),
                deductible_amount: body.deductible_amount ? parseFloat(body.deductible_amount) : null,
                max_claim_amount: body.max_claim_amount ? parseFloat(body.max_claim_amount) : null,
                status: body.status || 'ACTIVE'
            }
        });
        
        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create insurance product:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create insurance product' },
            { status: 400 }
        );
    }
}
