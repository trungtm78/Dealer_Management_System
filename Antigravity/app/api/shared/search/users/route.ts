import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { SearchRequest, SearchResponse, SelectItem } from "@/types/smart-select";

export async function POST(req: NextRequest) {
    try {
        const searchRequest: SearchRequest = await req.json();

        const { q, limit = 20, cursor, context, filter } = searchRequest;

        const where: any = {
            ...(filter?.excludedIds && { id: { notIn: filter.excludedIds } }),
            ...(context?.onlyActive !== false && { status: "ACTIVE" }),
        };

        // Exclude users already linked to employees
        if (context?.excludeLinkedUsers) {
            where.employees = {
                is: null
            };
        }

        // Search by name, email, role
        if (q && q.trim()) {
            const query = q.trim().toLowerCase();
            where.OR = [
                { name: { contains: query } },
                { email: { contains: query } },
                { role: { contains: query } }
            ];
        }

        const items = await prisma.user.findMany({
            where,
            take: limit + 1,
            ...(cursor && { skip: 1, cursor: { id: cursor as string } }),
            orderBy: [{ name: "asc" }],
            include: {
                employees: {
                    include: {
                        master_departments: {
                            select: {
                                id: true,
                                department_name: true
                            }
                        }
                    }
                }
            }
        });

        const selectItems: SelectItem[] = items.slice(0, limit).map((user: any) => ({
            id: user.id,
            label: user.email,
            subtitle: `${user.name} | ${user.role} | ${user.employees?.master_departments?.department_name || 'No Department'}`,
            meta: {
                ...user,
                has_employee: !!user.employees,
                department: user.employees?.master_departments?.department_name || null,
                department_id: user.employees?.department_id || null
            }
        }));

        const nextCursor = items.length > limit ? items[limit - 1].id : null;

        const response: SearchResponse = {
            items: selectItems,
            nextCursor
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error in users search:", error);
        return NextResponse.json(
            { error: "Failed to search users" },
            { status: 500 }
        );
    }
}
