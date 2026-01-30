"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { menuGroups } from "@/lib/menu-list";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    // State để quản lý việc mở rộng/thu gọn các nhóm menu. Mặc định mở CRM và Tổng quan.
    const [expandedGroups, setExpandedGroups] = useState<string[]>(["CRM", "Tổng Quan"]);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Toggle group expansion
    const toggleGroup = (title: string) => {
        setExpandedGroups((prev) =>
            prev.includes(title)
                ? prev.filter((g) => g !== title)
                : [...prev, title]
        );
    };

    return (
        <div className={cn("h-screen flex flex-col bg-white border-r border-gray-200 transition-all duration-300 shadow-2xl z-50", isSidebarCollapsed ? "w-16" : "w-64", className)}>

            {/* HEADER: Honda Branding Red Gradient */}
            <div className={cn("bg-gradient-to-br from-[#E60012] via-[#C4000F] to-[#B8000E] relative overflow-hidden transition-all duration-300", isSidebarCollapsed ? "p-2" : "p-5")}>
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                </div>

                <div className="relative z-10 flex items-center gap-3">
                    {/* Logo Box */}
                    <div className={cn("bg-white rounded-xl flex items-center justify-center shadow-xl shadow-black/20 ring-2 ring-white/30 transition-all", isSidebarCollapsed ? "w-10 h-10 mx-auto" : "w-12 h-12")}>
                        <span className={cn("font-black text-[#E60012]", isSidebarCollapsed ? "text-xl" : "text-2xl")}>H</span>
                    </div>

                    {/* Text Title (Hidden when collapsed) */}
                    {!isSidebarCollapsed && (
                        <div className="flex-1 overflow-hidden">
                            <h1 className="text-base font-black text-white leading-tight tracking-wide whitespace-nowrap">HONDA OTO</h1>
                            <h1 className="text-base font-black text-white leading-tight tracking-wide whitespace-nowrap uppercase">CỘNG HÒA</h1>
                        </div>
                    )}
                </div>

                {/* Connection Line & Status (Only visible when expanded) */}
                {!isSidebarCollapsed && (
                    <div className="flex items-center gap-2 mt-4 px-1">
                        <div className="w-1 h-8 bg-white/40 rounded-full"></div>
                        <div>
                            <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wider mb-0.5">Dealer Management</p>
                            <p className="text-xs text-white font-bold">Hệ Thống Quản Lý</p>
                        </div>
                    </div>
                )}
            </div>

            {/* NAVIGATION SCROLL AREA */}
            <nav className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-white">
                {!isSidebarCollapsed ? (
                    // EXPANDED MENU
                    menuGroups.map((group) => {
                        const GroupIcon = group.icon;
                        const isExpanded = expandedGroups.includes(group.title);

                        // Check if any child is active to highlight group potentially
                        const isChildActive = group.items.some(item => pathname === item.href || pathname.startsWith(item.href));

                        return (
                            <div key={group.title} className="mb-2">
                                {/* Group Header */}
                                <button
                                    onClick={() => toggleGroup(group.title)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group",
                                        isChildActive ? "bg-gray-50 text-gray-900" : "text-gray-700 hover:bg-gray-50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <GroupIcon className={cn("w-5 h-5 transition-colors", isChildActive ? "text-[#E60012]" : "text-gray-600 group-hover:text-gray-900")} />
                                        <span className="text-sm font-semibold">{group.title}</span>
                                    </div>
                                    <ChevronRight className={cn("w-4 h-4 text-gray-400 transition-transform duration-300", isExpanded ? "rotate-90" : "rotate-0")} />
                                </button>

                                {/* Group Items (Collapsible) */}
                                <div className={cn("ml-4 overflow-hidden transition-all duration-300", isExpanded ? "max-h-[1000px] opacity-100 mt-1" : "max-h-0 opacity-0")}>
                                    <div className="space-y-0.5 border-l border-gray-100 pl-2">
                                        {group.items.map((item) => {
                                            const isActive = pathname === item.href;
                                            const ItemIcon = item.icon;
                                            return (
                                                <Link key={item.id} href={item.href}>
                                                    <div className={cn(
                                                        "w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-200 mb-1",
                                                        isActive
                                                            ? "bg-[#E60012] text-white shadow-lg shadow-red-500/20 font-semibold"
                                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                                    )}>
                                                        <ItemIcon className="w-4 h-4 flex-shrink-0" />
                                                        <span className="leading-tight">{item.label}</span>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    // COLLAPSED MINI MENU
                    <div className="space-y-1">
                        {menuGroups.map((group) => {
                            const GroupIcon = group.icon;
                            return (
                                <div key={group.title} className="relative group/tooltip">
                                    <button
                                        onClick={() => { setIsSidebarCollapsed(false); toggleGroup(group.title); }}
                                        className="w-full p-2.5 rounded-lg hover:bg-gray-100 transition-all duration-200 flex justify-center"
                                    >
                                        <GroupIcon className="w-5 h-5 text-gray-600 hover:text-[#E60012]" />
                                    </button>
                                    {/* Tooltip */}
                                    <div className="absolute left-full top-2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                        {group.title}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </nav>

            {/* BOTTOM: Collapse Toggle */}
            <div className="p-3 border-t border-gray-200 bg-gray-50/50">
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="w-full py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center text-gray-500 hover:text-gray-900"
                >
                    <ChevronRight className={cn("w-4 h-4 transition-transform duration-300", isSidebarCollapsed ? "rotate-0" : "rotate-180")} />
                </button>
            </div>

            {/* BOTTOM: User Profile (Simplified) */}
            {!isSidebarCollapsed && (
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E60012] to-[#B8000E] flex items-center justify-center shadow-md text-white font-bold text-sm">
                            AD
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold truncate">Admin User</p>
                            <p className="text-xs text-gray-500 truncate">System Admin</p>
                        </div>
                        <LogOut
                            onClick={() => router.push('/login')}
                            className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
