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
            deleted_at: null
        };

        if (q && q.trim()) {
            const query = q.trim().toLowerCase();
            where.OR = [
                { full_name: { contains: query } },
                { employee_code: { contains: query } },
                { email: { contains: query } }
            ];
        }

        const positionFilter = context?.positionFilter as string[];
        if (positionFilter && positionFilter.length > 0) {
            where.master_positions = {
                position_name: {
                    in: positionFilter
                }
            };
        }

        const items = await prisma.employees.findMany({
            where,
            take: limit + 1,
            ...(cursor && { skip: 1, cursor: { id: cursor as string } }),
            orderBy: [{ full_name: "asc" }],
            include: {
                master_departments: {
                    select: {
                        id: true,
                        department_code: true,
                        department_name: true
                    }
                },
                master_positions: {
                    select: {
                        id: true,
                        position_code: true,
                        position_name: true
                    }
                },
                master_levels: {
                    select: {
                        id: true,
                        level_code: true,
                        level_name: true
                    }
                },
                User: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });

        const selectItems: SelectItem[] = items.slice(0, limit).map((employee: any) => ({
            id: employee.id,
            label: employee.full_name,
            subtitle: `${employee.employee_code} | ${employee.master_positions?.position_name || 'No Position'} | ${employee.master_departments?.department_name || 'No Dept'}`,
            meta: employee
        }));

        const nextCursor = items.length > limit ? items[limit - 1].id : null;

        const response: SearchResponse = {
            items: selectItems,
            nextCursor
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error in employees search:", error);
        return NextResponse.json(
            { error: "Failed to search employees" },
            { status: 500 }
        );
    }
}
