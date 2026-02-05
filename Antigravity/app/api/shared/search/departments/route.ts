import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { SearchRequest, SearchResponse, SelectItem } from "@/types/smart-select";

export async function POST(req: NextRequest) {
    try {
        const searchRequest: SearchRequest = await req.json();

        const { q, limit = 20, cursor, context, filter } = searchRequest;

        const where: any = {
            ...(filter?.excludedIds && { id: { notIn: filter.excludedIds } }),
            ...(context?.onlyActive !== false && { status: "ACTIVE" })
        };

        if (q && q.trim()) {
            const query = q.trim().toLowerCase();
            where.OR = [
                { department_name: { contains: query } },
                { department_code: { contains: query } }
            ];
        }

        const items = await prisma.master_departments.findMany({
            where,
            take: limit + 1,
            ...(cursor && { skip: 1, cursor: { id: cursor as string } }),
            orderBy: [{ department_name: "asc" }],
            include: {
                _count: {
                    select: { employees: true }
                }
            }
        });

        const selectItems: SelectItem[] = items.slice(0, limit).map((dept: any) => ({
            id: dept.id,
            label: dept.department_name,
            subtitle: `${dept.department_code} | ${dept._count.employees} employees`,
            meta: dept
        }));

        const nextCursor = items.length > limit ? items[limit - 1].id : null;

        const response: SearchResponse = {
            items: selectItems,
            nextCursor
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error in departments search:", error);
        return NextResponse.json(
            { error: "Failed to search departments" },
            { status: 500 }
        );
    }
}
