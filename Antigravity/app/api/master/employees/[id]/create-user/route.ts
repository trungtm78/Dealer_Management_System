import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface CreateUserRequest {
    email: string;
    password: string;
    role_id: string;
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const employeeId = params.id;
        const body: CreateUserRequest = await req.json();
        const { email, password, role_id } = body;

        if (!email || !password || !role_id) {
            return NextResponse.json(
                { error: "VALIDATION_ERROR", message: "Email, password and role are required" },
                { status: 400 }
            );
        }

        const employee = await prisma.employees.findUnique({
            where: { id: employeeId }
        });

        if (!employee) {
            return NextResponse.json(
                { error: "NOT_FOUND", message: "Employee not found" },
                { status: 404 }
            );
        }

        if (employee.user_id) {
            return NextResponse.json(
                { error: "CONFLICT", message: "Employee already linked to a user" },
                { status: 409 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "VALIDATION_ERROR", message: "Email already used by another user" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "VALIDATION_ERROR", message: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        if (!hasUpperCase || !hasLowerCase || !hasNumber) {
            return NextResponse.json(
                { error: "VALIDATION_ERROR", message: "Password must contain uppercase, lowercase and number" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password_hash: hashedPassword,
                name: employee.full_name,
                role: "USER",
                role_id,
                status: "ACTIVE"
            }
        });

        const updatedEmployee = await prisma.employees.update({
            where: { id: employeeId },
            data: {
                user_id: user.id
            }
        });

        return NextResponse.json(
            {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role_id: user.role_id,
                    status: user.status,
                    created_at: user.created_at
                },
                employee: {
                    id: updatedEmployee.id,
                    user_id: updatedEmployee.user_id
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user for employee:", error);
        return NextResponse.json(
            { error: "INTERNAL_ERROR", message: "Failed to create user" },
            { status: 500 }
        );
    }
}
