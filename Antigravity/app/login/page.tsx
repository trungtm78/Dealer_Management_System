"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AuthService } from '@/services/auth.service'; // NEW Service
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, User, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const result = await AuthService.login({ email, password });

            if (result.success) {
                toast.success("Đăng nhập thành công!", {
                    description: "Đang chuyển hướng vào hệ thống...",
                    duration: 2000,
                });

                // Delay slightly to show success message
                setTimeout(() => {
                    router.push('/crm/leads');
                    router.refresh(); // Refresh to update session state in components
                }, 800);
            } else {
                toast.error("Đăng nhập thất bại", {
                    description: result.message,
                });
            }
        } catch (error) {
            toast.error("Lỗi hệ thống", {
                description: "Vui lòng thử lại sau.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex w-full">
            {/* LEFT SIDE: Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#E60012] to-[#C50010] p-12 flex-col justify-between relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                </div>

                {/* Top Branding */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-3xl font-black text-[#E60012]">H</span>
                        </div>
                        <div>
                            <h1 className="text-white text-2xl font-bold tracking-tight">Honda ERP</h1>
                            <p className="text-white/80 text-sm font-medium">Dealer Management System</p>
                        </div>
                    </div>

                    <div className="space-y-6 text-white mt-12">
                        <div>
                            <h2 className="text-4xl font-bold mb-2">Chào mừng đến với</h2>
                            <h3 className="text-3xl font-light opacity-90">Hệ Thống Quản Lý Đại Lý</h3>
                        </div>

                        <div className="space-y-5 pt-8">
                            {[
                                { title: "Quản lý toàn diện", desc: "Tích hợp Sales, Service, Parts, Insurance & Finance" },
                                { title: "Kết nối Honda VN", desc: "Đồng bộ dữ liệu trực tiếp với Honda Việt Nam" },
                                { title: "Real-time Dashboard", desc: "Báo cáo điều hành & chỉ số KPI thời gian thực" }
                            ].map((feat, idx) => (
                                <div key={idx} className="flex items-start gap-4 group">
                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                                        <span className="text-white text-sm font-bold">✓</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-0.5">{feat.title}</h4>
                                        <p className="text-white/70 text-sm leading-relaxed">{feat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 text-white/60 text-sm font-medium">
                    <p>© 2026 Honda Vietnam Co., Ltd. All rights reserved.</p>
                    <p className="opacity-70">Version 2.0.1 (Stable Build)</p>
                </div>
            </div>

            {/* RIGHT SIDE: Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-[#F8F9FC]">
                <div className="w-full max-w-md">

                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-12 h-12 bg-[#E60012] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                            <span className="text-2xl font-black text-white">H</span>
                        </div>
                        <h1 className="text-2xl font-bold text-[#E60012]">Honda ERP</h1>
                    </div>

                    <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
                        <CardHeader className="space-y-1 pb-6 text-center">
                            <CardTitle className="text-2xl font-bold text-gray-900">Đăng nhập</CardTitle>
                            <CardDescription>Nhập thông tin tài khoản DMS của bạn</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email / Tên đăng nhập</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            name="email"
                                            placeholder="admin"
                                            defaultValue="admin"
                                            className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Mật khẩu</Label>
                                        <a href="#" className="text-xs text-[#E60012] font-medium hover:underline">Quên mật khẩu?</a>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            defaultValue="admin123"
                                            className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#E60012] hover:bg-[#C50010] text-white h-11 font-bold shadow-lg shadow-red-500/30 transition-all hover:scale-[1.02]"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        "Đăng Nhập Hệ Thống"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex-col space-y-4 pt-4 bg-gray-50/50 border-t border-gray-100 rounded-b-xl">
                            <div className="text-center w-full">
                                <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Tài khoản Demo</p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-white p-2 rounded border border-gray-200 text-gray-600">
                                        <span className="font-bold text-gray-900">Admin:</span> admin / admin123
                                    </div>
<div className="bg-white p-2 rounded border border-gray-200 text-gray-600">
                                        <span className="font-bold text-gray-900">Sales:</span> sale / sale123
                                    </div>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
