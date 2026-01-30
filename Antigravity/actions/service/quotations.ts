'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ServiceQuoteDTO, CreateServiceQuoteInput, UpdateServiceQuoteInput, QuoteStatus } from '@/lib/types/service'

function mapToDTO(quote: any): ServiceQuoteDTO {
    return {
        id: quote.id,
        quoteNumber: quote.quote_number,
        customerId: quote.customer_id,
        customerName: quote.customer?.name,
        customerPhone: quote.customer?.phone,
        vehicleInfo: typeof quote.vehicle_info === 'string' ? JSON.parse(quote.vehicle_info) : quote.vehicle_info,
        advisorId: quote.advisor_id,
        advisorName: quote.advisor?.name,
        services: typeof quote.services === 'string' ? JSON.parse(quote.services) : quote.services || [],
        parts: typeof quote.parts === 'string' ? JSON.parse(quote.parts) : quote.parts || [],
        totalLabor: Number(quote.total_labor),
        totalParts: Number(quote.total_parts),
        subTotal: Number(quote.sub_total),
        vat: Number(quote.vat),
        totalAmount: Number(quote.total_amount),
        status: quote.status as QuoteStatus,
        expiryDate: quote.expiry_date ? quote.expiry_date.toISOString().split('T')[0] : '',
        notes: quote.notes,
        createdAt: quote.created_at.toISOString()
    }
}

export async function getQuotes(query?: string) {
    try {
        const quotes = await prisma.serviceQuote.findMany({
            include: {
                customer: true,
                advisor: true
            },
            orderBy: { created_at: 'desc' }
        });

        let dtos = quotes.map(mapToDTO);

        if (query) {
            const lowerQuery = query.toLowerCase();
            dtos = dtos.filter((q: ServiceQuoteDTO) =>
                q.quoteNumber.toLowerCase().includes(lowerQuery) ||
                (q.customerName && q.customerName.toLowerCase().includes(lowerQuery)) ||
                (q.vehicleInfo?.plateNumber && q.vehicleInfo.plateNumber.toLowerCase().includes(lowerQuery))
            );
        }

        return dtos;
    } catch (error) {
        console.error("Failed to fetch quotes:", error);
        return [];
    }
}

export async function getQuote(id: string) {
    try {
        const quote = await prisma.serviceQuote.findUnique({
            where: { id },
            include: { customer: true, advisor: true }
        });
        if (!quote) return null;
        return mapToDTO(quote);
    } catch (error) {
        console.error("Failed to fetch quote:", error);
        return null;
    }
}

export async function createQuote(data: CreateServiceQuoteInput) {
    try {
        // Re-calculate totals from inputs
        const totalLabor = data.services.reduce((acc: number, item: any) => acc + (item.laborCost || 0), 0);
        const totalParts = data.parts.reduce((acc: number, item: any) => acc + ((item.unitPrice || 0) * (item.quantity || 1)), 0);
        const subTotal = totalLabor + totalParts;
        const vat = subTotal * 0.1;
        const totalAmount = subTotal + vat;

        // Generate Quote Number
        const count = await prisma.serviceQuote.count();
        const quoteNumber = `SQ-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

        const newQuote = await prisma.serviceQuote.create({
            data: {
                quote_number: quoteNumber,
                customer_id: data.customerId,
                advisor_id: data.advisorId,
                vehicle_info: JSON.stringify(data.vehicleInfo), // JSON
                services: JSON.stringify(data.services), // JSON
                parts: JSON.stringify(data.parts), // JSON
                expiry_date: new Date(data.expiryDate),
                notes: data.notes,
                status: 'DRAFT',
                total_labor: totalLabor,
                total_parts: totalParts,
                sub_total: subTotal,
                vat,
                total_amount: totalAmount
            },
            include: { customer: true, advisor: true }
        });

        revalidatePath('/service/quotations');
        return { success: true, data: mapToDTO(newQuote) };
    } catch (error: any) {
        console.error("Failed to create quote:", error);
        return { success: false, error: error.message || "Không thể tạo báo giá" };
    }
}

export async function updateQuote(id: string, data: UpdateServiceQuoteInput) {
    try {
        const updateData: any = {};
        if (data.status) updateData.status = data.status;
        if (data.notes) updateData.notes = data.notes;
        if (data.expiryDate) updateData.expiry_date = new Date(data.expiryDate);

        const updated = await prisma.serviceQuote.update({
            where: { id },
            data: updateData,
            include: { customer: true, advisor: true }
        });

        revalidatePath('/service/quotations');
        return { success: true, data: mapToDTO(updated) };
    } catch (error: any) {
        console.error("Failed to update quote:", error);
        return { success: false, error: "Không thể cập nhật báo giá" };
    }
}

// Convert Quote to Repair Order
export async function convertQuoteToRO(id: string) {
    try {
        const quote = await prisma.serviceQuote.findUnique({ where: { id } });
        if (!quote) return { success: false, error: "Báo giá không tồn tại" };

        if (quote.status === 'CONVERTED') return { success: false, error: "Báo giá đã được chuyển đổi" };

        // Create RO
        const roCount = await prisma.repairOrder.count();
        const roNumber = `RO-${new Date().getFullYear()}-${(roCount + 1).toString().padStart(4, '0')}`;

        // Transaction: Create RO + Update Quote Status
        await prisma.$transaction(async (tx: any) => {
            await tx.repairOrder.create({
                data: {
                    ro_number: roNumber,
                    customer_id: quote.customer_id,
                    vehicle_info: quote.vehicle_info,
                    customer_complaints: quote.notes || "Từ báo giá " + quote.quote_number,
                    status: 'PENDING',
                    advisor_id: quote.advisor_id
                }
            });

            await tx.serviceQuote.update({
                where: { id },
                data: { status: 'CONVERTED' }
            });
        });

        revalidatePath('/service/quotations');
        revalidatePath('/service/repair-orders');
        return { success: true };

    } catch (error: any) {
        console.error("Failed to convert quote:", error);
        return { success: false, error: "Lỗi chuyển đổi" };
    }
}

