"use client";

import Link from "next/link";
import { Terminal, Search } from "lucide-react";
import { Suspense } from "react";
import { UserNav } from "@/components/user-nav";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[#020617]/90">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 shrink-0 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
             <Terminal className="h-5 w-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white">AI.RECIPE</span>
        </Link>

        {/* Search - Simplified for speed */}
        <div className="hidden md:flex flex-1 max-w-md relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search recipes..." 
            className="w-full h-9 bg-white/5 border border-white/10 rounded-full pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:bg-white/[0.08] transition-all"
          />
        </div>

        {/* Navigation & User */}
        <div className="flex items-center gap-3">
          <Link href="/create" className="hidden sm:block">
            <button className="h-9 px-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                레시피 등록
            </button>
          </Link>
          <div className="w-px h-4 bg-white/10 mx-1 hidden sm:block" />
          <Suspense fallback={<div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />}>
             <UserNav />
          </Suspense>
        </div>

      </div>
    </header>
  );
}
