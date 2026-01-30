
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { LoginInput } from "@/lib/types/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const body: LoginInput = await req.json();
        let { email, password } = body;

// Alias handling
        if (email === 'admin') {
            email = 'admin@honda.com.vn';
        }
        if (email === 'sale') {
            email = 'sale@honda.com.vn';
        }
        
        // Demo password handling
        if (password === 'admin123' && email === 'sale@honda.com.vn') {
            // Allow admin123 for sale account in demo
        } else if (password === 'sale123' && email === 'sale@honda.com.vn') {
            // Also accept sale123 for sale account in demo
        }

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Vui lòng nhập đầy đủ thông tin" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Tài khoản hoặc mật khẩu không chính xác" },
                { status: 401 }
            );
        }

const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        // Demo password handling
        let demoPasswordValid = false;
        if (!isPasswordValid) {
            if ((email === 'admin@honda.com.vn' && password === 'admin123') ||
                (email === 'sale@honda.com.vn' && (password === 'admin123' || password === 'sale123'))) {
                demoPasswordValid = true;
            }
        }

        if (!isPasswordValid && !demoPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Tài khoản hoặc mật khẩu không chính xác" },
                { status: 401 }
            );
        }

        // Set Cookie
        cookies().set('user_id', user.id, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return NextResponse.json({
            success: true,
            message: "Đăng nhập thành công",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login API Error:", error);
        return NextResponse.json(
            { success: false, message: "Lỗi kết nối Server" },
            { status: 500 }
        );
    }
}
