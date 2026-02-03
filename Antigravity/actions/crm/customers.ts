"use server";


import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const isTestEnv = process.env.NODE_ENV === 'test';

const safeRevalidatePath = (path: string) => {
    if (!isTestEnv) {
        revalidatePath(path);
    }
};
import { CustomerDTO } from "@/lib/types/crm";

// --- CRUD Operations ---

export async function getCustomers(query?: string) {
    try {
        const where: any = {};
        if (query) {
            where.OR = [
                { name: { contains: query } },
                { phone: { contains: query } },
                { mobile: { contains: query } },
                { email: { contains: query } },
                { vat: { contains: query } }
            ];
        }

        const customers = await prisma.customer.findMany({
            where,
            orderBy: { created_at: "desc" },
            take: 50
        });

        return customers.map(mapToDTO);
    } catch (error) {
        console.error("Failed to fetch customers:", error);
        return [];
    }
}

export async function getCustomer(id: string) {
    try {
        const customer = await prisma.customer.findUnique({ where: { id } });
        if (!customer) return null;
        return mapToDTO(customer);
    } catch (error) {
        console.error("Failed to fetch customer:", error);
        return null;
    }
}

export async function createCustomer(data: any) {
    try {
        // Check for existing active customer with same phone
        const existing = await prisma.customer.findFirst({
            where: {
                phone: data.phone,
                status: { not: 'INACTIVE' }
            }
        });

        if (existing) {
            return { success: false, error: "Số điện thoại đã tồn tại trong hệ thống." };
        }

        // ENUM Validation
        const { EnumValidator } = await import('@/middleware/enum_validation');
        const enumValidation = EnumValidator.validateObject('customers', data);

        if (!enumValidation.valid) {
            return {
                success: false,
                error: "Lỗi xác thực: " + enumValidation.errors.join("; ")
            };
        }

        const sanitizedData = {
            name: data.name,
            phone: data.phone,
            mobile: data.mobile || null,
            email: data.email || null,
            type: data.type || 'INDIVIDUAL',
            street: data.street || null,
            city: data.city || null,
            district: data.district || null,
            ward: data.ward || null,
            vat: data.vat || null,
            notes: data.notes || null,
            tags: (data.tags && Array.isArray(data.tags)) ? JSON.stringify(data.tags) : null,
            points: 0,
            tier: data.tier || 'SILVER',
            total_points: 0,
            status: data.status || 'ACTIVE'
        };

        const newCustomer = await prisma.customer.create({
            data: sanitizedData
        });
        safeRevalidatePath("/crm/customers");
        return { success: true, data: mapToDTO(newCustomer) };
    } catch (error: any) {
        console.error("Failed to create customer:", error);
        if (error.code === 'P2002') {
            return { success: false, error: "Số điện thoại đã tồn tại trong hệ thống." };
        }
        return { success: false, error: error.message };
    }
}

export async function updateCustomer(id: string, data: any) {
    try {
        const sanitizedData: any = {};
        const allowedFields = [
            'name', 'phone', 'mobile', 'email', 'type', 'street',
            'city', 'district', 'ward', 'vat', 'notes',
            'tags', 'tier', 'points', 'total_points', 'status'
        ];

        for (const key of Object.keys(data)) {
            if (allowedFields.includes(key)) {
                if (key === 'tags' && Array.isArray(data[key])) {
                    sanitizedData[key] = JSON.stringify(data[key]);
                } else {
                    sanitizedData[key] = data[key];
                }
            }
        }

        const updated = await prisma.customer.update({
            where: { id },
            data: sanitizedData
        });
        safeRevalidatePath("/crm/customers");
        safeRevalidatePath(`/crm/customers/${id}`);
        return { success: true, data: mapToDTO(updated) };
    } catch (error: any) {
        console.error("Failed to update customer:", error);
        return { success: false, error: error.message };
    }
}

export async function searchCustomers(query: string) {
    if (!query || query.length < 2) return [];

    try {
        const customers = await prisma.customer.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { phone: { contains: query } },
                    { mobile: { contains: query } },
                    { email: { contains: query } },
                    { vat: { contains: query } }
                ]
            },
            take: 10,
            orderBy: { last_transaction_date: 'desc' }
        });

        return customers.map((c: any) => ({
            id: c.id,
            name: c.name,
            phone: c.phone || c.mobile || '',
            email: c.email || '',
            type: c.type,
            rank: c.tier,
            address: formatAddress(c)
        }));
    } catch (error) {
        console.error("Failed to search customers:", error);
        return [];
    }
}

export async function convertLeadToCustomer(leadId: string) {
    try {
        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) return { success: false, error: "Lead không tồn tại trong hệ thống" };

        const existing = await prisma.customer.findFirst({
            where: {
                OR: [
                    { phone: lead.phone, status: { not: 'INACTIVE' } },
                    { mobile: lead.phone, status: { not: 'INACTIVE' } }
                ]
            }
        });

        if (existing) {
            return { 
                success: false, 
                error: "Số điện thoại đã tồn tại trong hệ thống. Không thể tạo khách hàng mới." 
            };
        }

        const result = await prisma.$transaction(async (tx: any) => {
            const newCustomer = await tx.customer.create({
                data: {
                    name: lead.name,
                    phone: lead.phone,
                    email: lead.email,
                    type: (lead.customer_type && lead.customer_type.toLowerCase() === 'company') ? 'COMPANY' : 'INDIVIDUAL',
                    street: lead.address,
                    notes: `Converted from Lead: ${lead.model_interest || ''} ${lead.model_version || ''}. Notes: ${lead.notes || ''}`,
                    tags: JSON.stringify(['CONVERTED_LEAD']),
                    tier: 'SILVER',
                    points: 0,
                    total_points: 0
                }
            });

            await tx.lead.update({
                where: { id: leadId },
                data: {
                    status: 'WON',
                }
            });

            return newCustomer;
        });

        safeRevalidatePath("/crm/leads");
        safeRevalidatePath("/crm/customers");
        return { success: true, customerId: result.id };

    } catch (error: any) {
        console.error("Failed to convert lead:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteCustomer(id: string) {
    try {
        // Check if customer exists
        const customer = await prisma.customer.findUnique({
            where: { id }
        });

        if (!customer) {
            return { success: false, error: "Khách hàng không tồn tại" };
        }

        // BR-CRM-042: Không cho xóa nếu có contracts active
        const activeContracts = await prisma.contract.count({
            where: {
                customer_id: id,
                status: { in: ['ACTIVE', 'PENDING'] }
            }
        });

        if (activeContracts > 0) {
            return { 
                success: false, 
                error: "Không thể xóa khách hàng vì có hợp đồng đang hoạt động. Vui lòng hủy tất cả hợp đồng trước khi xóa." 
            };
        }

        // FK Validation: Check for other restricted relationships
        const { FKValidator } = await import('@/middleware/fk_validation');
        const fkValidation = await FKValidator.validateBeforeDelete('customers', id);
        
        if (!fkValidation.valid) {
            return { 
                success: false, 
                error: fkValidation.error || "Không thể xóa khách hàng vì có bản ghi liên quan đang tồn tại." 
            };
        }

        // Perform cascading delete for related records
        const cascadeResult = await FKValidator.performCascadingDelete('customers', id);
        if (!cascadeResult.success) {
            return { success: false, error: cascadeResult.error };
        }

        // Soft delete: UPDATE status = 'INACTIVE' and set deleted_at
        const updatedCustomer = await prisma.customer.update({
            where: { id },
            data: { 
                status: 'INACTIVE',
                deleted_at: new Date()
            }
        });

        safeRevalidatePath("/crm/customers");
        return { success: true, data: updatedCustomer };
    } catch (error: any) {
        console.error("Failed to delete customer:", error);
        return { success: false, error: error.message };
    }
}

function mapToDTO(c: any): CustomerDTO {
    return {
        id: c.id,
        name: c.name,
        type: c.type,
        phone: c.phone,
        mobile: c.mobile,
        email: c.email,
        address: formatAddress(c),
        street: c.street,
        city: c.city,
        district: c.district,
        ward: c.ward,
        vat: c.vat,
        tier: c.tier,
        points: c.points,
        total_points: c.total_points || c.points || 0,
        tags: c.tags,
        member_since: c.member_since.toISOString().split('T')[0],
        updated_at: c.updated_at.toISOString()
    };
}

function formatAddress(c: any) {
    const parts = [c.street, c.ward, c.district, c.city].filter(Boolean);
    return parts.join(", ");
}
