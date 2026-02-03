import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;
        const search = searchParams.get('search') || '';
        
        const where: any = {};
        
        if (search) {
            where.OR = [
                { department_name: { contains: search } },
                { department_code: { contains: search } }
            ];
        }
        
        const [total, departments] = await Promise.all([
            prisma.master_departments.count({ where }),
            prisma.master_departments.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ]);
        
        return NextResponse.json({
            data: departments,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Failed to fetch departments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch departments' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const department = await prisma.master_departments.create({
            data: {
                department_code: body.department_code,
                department_name: body.department_name,
                status: body.status || 'ACTIVE'
            }
        });
        
        return NextResponse.json(department, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create department:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create department' },
            { status: 400 }
        );
    }
}
