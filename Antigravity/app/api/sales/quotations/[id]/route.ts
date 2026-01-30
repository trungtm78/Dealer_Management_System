
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { QuotationDTO, QuotationStatus } from "@/lib/types/sales";

// GET /api/sales/quotations/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const quotation = await prisma.quotation.findUnique({
            where: { id: params.id },
            include: {
                createdBy: { select: { id: true, name: true } }
            }
        });

        if (!quotation) {
            return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
        }

const accessoriesTotal = quotation.accessories ? 
            JSON.parse(quotation.accessories).reduce((sum: number, item: any) => sum + (item.price || 0), 0) : 0;
        const servicesTotal = quotation.services ? 
            JSON.parse(quotation.services).reduce((sum: number, item: any) => sum + (item.price || 0), 0) : 0;
            
        const dto: QuotationDTO = {
            id: quotation.id,
            quoteNumber: quotation.quote_number,
            customerId: quotation.customer_id,
            customerName: quotation.customer_name,
            customerPhone: quotation.customer_phone,
            model: quotation.model,
            version: quotation.version,
            color: quotation.color,
            basePrice: parseFloat(quotation.base_price.toString()),
            accessories: quotation.accessories ? JSON.parse(quotation.accessories) : [],
            services: quotation.services ? JSON.parse(quotation.services) : [],
            accessoriesTotal,
            servicesTotal,
            insurance: quotation.insurance ? parseFloat(quotation.insurance.toString()) : 0,
            registrationTax: quotation.registration_tax ? parseFloat(quotation.registration_tax.toString()) : 0,
            registration: quotation.registration_fee ? parseFloat(quotation.registration_fee.toString()) : 0,
            otherFees: quotation.other_fees ? parseFloat(quotation.other_fees.toString()) : 0,
            discount: quotation.discount ? parseFloat(quotation.discount.toString()) : 0,
            promotionValue: quotation.promotion_value ? parseFloat(quotation.promotion_value.toString()) : 0,
            totalPrice: parseFloat(quotation.total_price.toString()),
            status: quotation.status as QuotationStatus,
            validUntil: quotation.valid_until?.toISOString() || null,
            createdAt: quotation.created_at.toISOString(),
            updatedAt: quotation.updated_at.toISOString(),
            createdBy: quotation.createdBy ? {
                id: quotation.createdBy.id,
                name: quotation.createdBy.name
            } : undefined
        };

        return NextResponse.json(dto);
    } catch (error) {
        console.error("Failed to fetch quotation:", error);
        return NextResponse.json({ error: "Failed to fetch quotation" }, { status: 500 });
    }
}

// PUT /api/sales/quotations/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const data = await req.json();

        // Prepare update data
        const updateData: any = { ...data };
        delete updateData.id;
        delete updateData.quoteNumber;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        delete updateData.createdBy;

        if (data.validUntil) {
            updateData.validUntil = new Date(data.validUntil);
        }

        const updatedQuotation = await prisma.quotation.update({
            where: { id: params.id },
            data: updateData,
            include: {
                createdBy: { select: { id: true, name: true } }
            }
        });

const accessoriesTotal = updatedQuotation.accessories ? 
            JSON.parse(updatedQuotation.accessories).reduce((sum: number, item: any) => sum + (item.price || 0), 0) : 0;
        const servicesTotal = updatedQuotation.services ? 
            JSON.parse(updatedQuotation.services).reduce((sum: number, item: any) => sum + (item.price || 0), 0) : 0;
            
        const dto: QuotationDTO = {
            id: updatedQuotation.id,
            quoteNumber: updatedQuotation.quote_number,
            customerId: updatedQuotation.customer_id,
            customerName: updatedQuotation.customer_name,
            customerPhone: updatedQuotation.customer_phone,
            model: updatedQuotation.model,
            version: updatedQuotation.version,
            color: updatedQuotation.color,
            basePrice: parseFloat(updatedQuotation.base_price.toString()),
            accessories: updatedQuotation.accessories ? JSON.parse(updatedQuotation.accessories) : [],
            services: updatedQuotation.services ? JSON.parse(updatedQuotation.services) : [],
            accessoriesTotal,
            servicesTotal,
            insurance: updatedQuotation.insurance ? parseFloat(updatedQuotation.insurance.toString()) : 0,
            registrationTax: updatedQuotation.registration_tax ? parseFloat(updatedQuotation.registration_tax.toString()) : 0,
            registration: updatedQuotation.registration_fee ? parseFloat(updatedQuotation.registration_fee.toString()) : 0,
            otherFees: updatedQuotation.other_fees ? parseFloat(updatedQuotation.other_fees.toString()) : 0,
            discount: updatedQuotation.discount ? parseFloat(updatedQuotation.discount.toString()) : 0,
            promotionValue: updatedQuotation.promotion_value ? parseFloat(updatedQuotation.promotion_value.toString()) : 0,
            totalPrice: parseFloat(updatedQuotation.total_price.toString()),
            status: updatedQuotation.status as QuotationStatus,
            validUntil: updatedQuotation.valid_until?.toISOString() || null,
            createdAt: updatedQuotation.created_at.toISOString(),
            updatedAt: updatedQuotation.updated_at.toISOString(),
            createdBy: updatedQuotation.createdBy ? {
                id: updatedQuotation.createdBy.id,
                name: updatedQuotation.createdBy.name
            } : undefined
        };

        return NextResponse.json(dto);
    } catch (error) {
        console.error("Failed to update quotation:", error);
        return NextResponse.json({ error: "Failed to update quotation" }, { status: 500 });
    }
}

// DELETE /api/sales/quotations/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.quotation.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete quotation:", error);
        return NextResponse.json({ error: "Failed to delete quotation" }, { status: 500 });
    }
}
