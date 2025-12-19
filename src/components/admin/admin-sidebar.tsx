"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, Settings, LogOut, Terminal } from "lucide-react";

const menuItems = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/recipes", label: "레시피 관리", icon: FileText },
  { href: "/admin/users", label: "유저 관리", icon: Users },
  { href: "/admin/settings", label: "사이트 설정", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] min-h-screen hidden lg:block fixed left-0 top-0 bottom-0 z-40">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
                <Terminal className="w-5 h-5 text-indigo-500" />
                <span className="tracking-tight">AI.ADMIN</span>
            </Link>
        </div>

        <div className="p-4 space-y-1">
            {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                    <Link 
                        key={item.href} 
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            isActive 
                            ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <Icon className="w-4 h-4" />
                        {item.label}
                    </Link>
                )
            })}
        </div>
        
        <div className="absolute bottom-4 left-0 w-full px-4">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                <LogOut className="w-4 h-4" />
                나가기
            </Link>
        </div>
    </aside>
  );
}
