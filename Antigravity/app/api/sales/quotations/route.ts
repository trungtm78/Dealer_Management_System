import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createQuotation, getQuotations, CreateQuotationInput } from "@/actions/sales/quotations";
import { QuotationDTO, QuotationStatus } from "@/lib/types/sales";
import { parsePaginationParams, buildPaginationMeta, buildSearchWhereClause, calculateSkip } from "@/lib/utils/pagination";

// GET /api/sales/quotations
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const forDropdown = searchParams.get('for_dropdown') === 'true';
        const status = searchParams.get('status') || 'ACTIVE';

        if (forDropdown) {
            const quotations = await prisma.quotation.findMany({
                where: { status },
                select: { id: true, quote_number: true, status: true },
                orderBy: { quote_number: 'asc' }
            });
            const dropdownData = quotations.map(q => ({
                id: q.id,
                name: q.quote_number,
                status: q.status
            }));
            return NextResponse.json({ data: dropdownData });
        }

        const { page, limit, search, ...filters } = parsePaginationParams(searchParams, 5);
        const skip = calculateSkip(page, limit);

        const where: any = {
            ...buildSearchWhereClause(search, ["quote_number", "customer_name", "customer_phone"]),
        };

        if (filters.status) {
            where.status = filters.status;
        }

        const [total, quotations] = await Promise.all([
            prisma.quotation.count({ where }),
            prisma.quotation.findMany({
                where,
                orderBy: { created_at: 'desc' },
                skip,
                take: limit
            })
        ]);

        const dtos: QuotationDTO[] = quotations.map((q: any) => {
            const accessories = q.accessories ? JSON.parse(q.accessories) : [];
            const services = q.services ? JSON.parse(q.services) : [];
            const accessoriesTotal = accessories.reduce((sum: number, item: any) => sum + (item.price || 0), 0);
            const servicesTotal = services.reduce((sum: number, item: any) => sum + (item.price || 0), 0);

            return {
                id: q.id,
                quoteNumber: q.quote_number,
                customerId: q.customer_id,
                customerName: q.customer_name,
                customerPhone: q.customer_phone,
                model: q.model,
                version: q.version,
                color: q.color,
                basePrice: parseFloat(q.base_price.toString()),
                accessories,
                services,
                accessoriesTotal,
                servicesTotal,
                insurance: q.insurance ? parseFloat(q.insurance.toString()) : 0,
                registrationTax: q.registration_tax ? parseFloat(q.registration_tax.toString()) : 0,
                registration: q.registration_fee ? parseFloat(q.registration_fee.toString()) : 0,
                otherFees: q.other_fees ? parseFloat(q.other_fees.toString()) : 0,
                discount: q.discount ? parseFloat(q.discount.toString()) : 0,
                promotionValue: q.promotion_value ? parseFloat(q.promotion_value.toString()) : 0,
                totalPrice: parseFloat(q.total_price.toString()),
                status: q.status as QuotationStatus,
                validUntil: q.valid_until?.toISOString() || null,
                createdAt: q.created_at.toISOString(),
                updatedAt: q.updated_at.toISOString()
            };
        });

        return NextResponse.json({
            data: dtos,
            meta: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        console.error("Failed to fetch quotations:", error);
        return NextResponse.json({ error: "Failed to fetch quotations" }, { status: 500 });
    }
}

// POST /api/sales/quotations
export async function POST(req: NextRequest) {
    try {
        const data: CreateQuotationInput = await req.json();

        const result = await createQuotation(data);

        if (result.success && result.data) {
            const q = result.data;
            const accessories = q.accessories ? JSON.parse(q.accessories) : [];
            const services = q.services ? JSON.parse(q.services) : [];
            const accessoriesTotal = accessories.reduce((sum: number, item: any) => sum + (item.price || 0), 0);
            const servicesTotal = services.reduce((sum: number, item: any) => sum + (item.price || 0), 0);

            const dto: QuotationDTO = {
                id: q.id,
                quoteNumber: q.quote_number,
                customerId: q.customer_id,
                customerName: q.customer_name,
                customerPhone: q.customer_phone,
                model: q.model,
                version: q.version,
                color: q.color,
                basePrice: parseFloat(q.base_price.toString()),
                accessories,
                services,
                accessoriesTotal,
                servicesTotal,
                insurance: q.insurance ? parseFloat(q.insurance.toString()) : 0,
                registrationTax: q.registration_tax ? parseFloat(q.registration_tax.toString()) : 0,
                registration: q.registration_fee ? parseFloat(q.registration_fee.toString()) : 0,
                otherFees: q.other_fees ? parseFloat(q.other_fees.toString()) : 0,
                discount: q.discount ? parseFloat(q.discount.toString()) : 0,
                promotionValue: q.promotion_value ? parseFloat(q.promotion_value.toString()) : 0,
                totalPrice: parseFloat(q.total_price.toString()),
                status: q.status as QuotationStatus,
                validUntil: q.valid_until?.toISOString() || null,
                createdAt: q.created_at.toISOString(),
                updatedAt: q.updated_at.toISOString()
            };
            return NextResponse.json(dto, { status: 201 });
        } else {
            return NextResponse.json({ error: result.error || "Failed to create quotation" }, { status: 500 });
        }
    } catch (error) {
        console.error("Failed to create quotation:", error);
        return NextResponse.json({ error: "Failed to create quotation" }, { status: 500 });
    }
}
