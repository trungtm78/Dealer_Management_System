import { Sidebar } from "@/components/Sidebar";
import { InsuranceProvider } from "@/context/InsuranceContext";
import { AdminProvider } from "@/context/AdminContext";

// Layout này đóng vai trò Wrapper. Sidebar bên trong là Client Component tự quản lý state collapse.
// Vì Sidebar dùng relative width (w-64 hoặc w-16), flex container sẽ tự điều chỉnh content còn lại.
export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminProvider>
            <InsuranceProvider>
                <div className="flex min-h-screen w-fit min-w-full bg-[#F8F9FC]">
                    {/* Sidebar: Sticky left */}
                    <aside className="sticky top-0 h-screen z-40">
                        <Sidebar className="h-full border-r-0" />
                        {/* Border handled by sidebar component itself */}
                    </aside>

                    {/* Main Content Area: Flex grow to fill remaining space */}
                    <div className="flex flex-1 flex-col">
                        {/* Header - Minimalist White */}
                        <header className="flex h-16 items-center gap-4 bg-white px-8 shadow-sm border-b border-gray-100 sticky top-0 z-30">
                            <div className="flex-1">
                                {/* Breadcrumb or Page Title usually goes here */}
                                <h2 className="text-lg font-bold text-gray-800 tracking-tight">Dashboard Điều Hành</h2>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Notification Bell */}
                                <button className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                                </button>

                                <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>

                                <div className="flex items-center gap-3">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-bold text-gray-900 leading-none">Admin Quản Trị</p>
                                        <p className="text-xs text-gray-500 mt-1">Head of Sales</p>
                                    </div>
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#E60012] to-[#B8000E] flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-white ring-1 ring-gray-100">
                                        AD
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Page Content */}
                        <main className="flex-1 p-6 md:p-8">
                            {children}
                        </main>
                    </div>
                </div>
            </InsuranceProvider>
        </AdminProvider>
    );
}
