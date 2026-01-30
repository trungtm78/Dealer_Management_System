'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function login(formData: FormData) {
    let email = formData.get('email') as string
    const password = formData.get('password') as string

    // 1. Alias handling: "admin" -> "admin@honda.com.vn"
    if (email === 'admin') {
        email = 'admin@honda.com.vn';
    }

    if (!email || !password) {
        return { success: false, message: 'Vui lòng nhập đầy đủ thông tin' }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })

if (!user) {
            return { success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' }
        }

        // Secure password comparison using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password_hash)

        if (!isPasswordValid) {
            return { success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' }
        }

        // Set simple cookie session
        cookies().set('user_id', user.id, { secure: true })

        return { success: true, message: 'Đăng nhập thành công' }

    } catch (error) {
        console.error('Login error:', error)
        return { success: false, message: 'Lỗi kết nối Server' }
    }
}
